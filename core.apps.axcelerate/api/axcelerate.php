<?php

class api_axcelerate
{
    const SERVER_URL = "https://stg.axcelerate.com.au/api";
    private $WS_TOKEN;
    private $API_TOKEN;
    private $id;

    /**
     * get Tokens from bd, need to work with axcelerate api
     */
    public function setTokens()
    {
        $this->API_TOKEN = $_REQUEST['api_token'];
        $this->WS_TOKEN = $_REQUEST['ws_token'];
        if ($this->API_TOKEN !== '' && $this->WS_TOKEN !== '') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get calendar from axcelerate api
     */

    public function getCalendar()
    {
        $url = self::SERVER_URL . "/course/calendar";

        $title = $_REQUEST['title'];
        $location = $_REQUEST['location'];
        if ($title == "undefined" && $location == "undefined") {
            return false;
        }

        $data = json_decode($this->sendCurl($url . '?location=' . urlencode($location)), true);

        return json_encode($this->filterArray($data, 'title', $title));
    }

    /**
     * Function to filter array
     * @param $array
     * @param $index
     * @param $value
     * @return array
     */

    private function filterArray($array, $index, $value)
    {
        if (is_array($array) && count($array) > 0) {
            $newarray = array();
            foreach (array_keys($array) as $key) {
                $temp[$key] = $array[$key][$index];
                if ($temp[$key] == $value) {
                    $newarray[$key] = $array[$key];
                }
            }
        }
        return $newarray;
    }

    /**
     * Get course details
     */
    public function getCourseDetails()
    {
        $url = self::SERVER_URL . "/course/instance/detail";
        $data[] = "instanceID=" . $_REQUEST['ID'];
        if (preg_match('/^w|p|el$/i', $_REQUEST['type'])) {
            $data[] = "type=" . $_REQUEST['type'];
        } else {
            $data[] = "type=w";
        }

        return $this->sendCurl($url . '?' . join('&', $data));
    }

    /**
     * Register new user to aXcelerate
     * @return mixed - course enrol
     */

    public function registerNewUser()
    {
        $url = self::SERVER_URL . "/contact";

        $data = array(
            'givenName' => $_REQUEST['first_name'],
            'surname' => $_REQUEST['last_name'],
            'title' => $_REQUEST['title'],
            'emailAddress' => $_REQUEST['email'],
            'sex' => $_REQUEST['gender'] == 'Mail' ? 'M' : 'F',
            'country' => $_REQUEST['country']
        );
        if (isset($_REQUEST['street'])) $data['address1'] = $_REQUEST['street'];
        if (isset($_REQUEST['line2'])) $data['address2'] = $_REQUEST['line2'];
        if (isset($_REQUEST['town'])) $data['city'] = $_REQUEST['town'];
        if (isset($_REQUEST['state'])) $data['state'] = $_REQUEST['state'];
        if (isset($_REQUEST['post_code'])) $data['postcode'] = $_REQUEST['post_code'];
        if (isset($_REQUEST['phone'])) $data['phone'] = $_REQUEST['phone'];
        if (isset($_REQUEST['mobile'])) $data['mobilephone'] = $_REQUEST['mobile'];

        $response = json_decode(trim($this->sendCurl($url, 'POST', $data), "\x0"));
        $reg = json_decode($this->courseEnrol(array(
            'contactID' => (string)$response->{'CONTACTID'},
            'instanceID' => $_REQUEST['instanceID'],
            'type' => $_REQUEST['type']
        )));
        $reg->{'CONTACTID'} = (string)$response->{'CONTACTID'};

        return json_encode($reg);
    }

    /**
     * If user have id in aXcelerate that just enrol to course
     * @return mixed - course enrol
     */

    public function registerCurrentUser()
    {
        $reg = json_decode($this->courseEnrol(array(
            'contactID' => $_REQUEST['contactID'],
            'instanceID' => $_REQUEST['instanceID'],
            'type' => $_REQUEST['type']
        )));
        $reg->{'CONTACTID'} = $_REQUEST['contactID'];

        return json_encode($reg);
    }

    /**
     * Course payment via axcelerate api
     */

    public function coursePayment()
    {
        $url = self::SERVER_URL . '/payment/';

        $data = array(
            'paymentAmount=' . $_REQUEST['amount'],
            'contactID=' . $_REQUEST['contactId'],
            'instanceID=' . $_REQUEST['instanceId'],
            'type=' . $_REQUEST['type'],
            'nameOnCard=' . $_REQUEST['cardholder'],
            'cardNumber=' . $_REQUEST['card_number'],
            'cardCCV=' . $_REQUEST['cvv'],
            'expiryMonth=' . $_REQUEST['exp_month'],
            'expiryYear=' . $_REQUEST['exp_year'],
        );

        return $this->sendCurl($url, 'POST', join('&', $data));
    }

    /**
     * Get course locations
     * @return array
     */

    public function getLocations()
    {
        $url = self::SERVER_URL . '/course/locations';
        return $this->sendCurl($url);
    }

    /**
     * Get courses calendar
     */

    public function getCourses()
    {
        $url = self::SERVER_URL . "/course/calendar";
        $month = date('m', strtotime('+11 months'));

        $data = json_decode($this->sendCurl($url . '?monthTo=' . $month), true);

        return json_encode($this->parseCourses($data));
    }

    /**
     * Filter courses by courseId, title and date
     * @param $data
     * @return array
     */

    private function parseCourses($data)
    {
        $courses = array();
        $result = array();

        if (empty($data)) {
            return [];
        }

        foreach ($data as $course) {
            $title = $course["title"] . '(' . $course["location"] . ')';
            if (!array_key_exists($title, $courses)) {
                $courses[$title] = array(
                    'title' => $course["title"],
                    'location' => $course["location"]
                );
            }
        }
        if (empty($courses)) {
            return [];
        }
        foreach ($courses as $course) {
            $result[] = $course;
        }

        return $result;
    }

    /**
     * Enrol to course
     * @param $data
     * @return mixed
     */

    private function courseEnrol($data)
    {
        $url = self::SERVER_URL . "/course/enrol";
        $data_temp = array();
        foreach ($data as $key => $val) {
            $data_temp[] = $key . '=' . $val;
        }
        $data_str = join('&', $data_temp);

        return $this->sendCurl($url, 'POST', $data_str);
    }

    /**
     * Method to send curl
     * @param $url
     * @param string $method
     * @param null $data
     * @return mixed -  response
     */

    private function sendCurl($url, $method = 'GET', $data = null)
    {
        if (!$this->setTokens()) {
            return false;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);

        $headers = array();
        $headers[] = 'apitoken: ' . $this->WS_TOKEN;
        $headers[] = 'wstoken: ' . $this->API_TOKEN;
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 180);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }
}