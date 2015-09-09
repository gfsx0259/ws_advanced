<?

class dialog_controller_rssfeed extends dialog_controller
{


    function run()
    {
        parent::run();

//$_REQUEST["url"] = "http://xmlhack.ru/index.rdf";
//$_REQUEST["url"] = "http://news.rambler.ru/rss/popular/head/";
//$_REQUEST["url"] = "http://news.yandex.ru/movies.rss";

        /*
        $tmp_file = md5($_REQUEST["url"]);
        if(file_exists($tmp_file)) {
            $xml = file_get_contents($tmp_file);
        } else {
            $xml = $this->get($_REQUEST["url"]);
            file_put_contents($tmp_file, $xml);
        }
        */

        $xml = $this->get($_REQUEST["url"]);
        if (!$xml) return false;

        $data = simplexml_load_string($xml);
        if (!$data) return false;

        $res = array(
            "channel_info" => array(
                "title" => (string)$data->channel->title,
                "link" => (string)$data->channel->link,
                "description" => strip_tags((string)$data->channel->description)
            ),
            "items" => array()
        );

        if ($data->channel->image) {
            $res["channel_img"] = array(
                "url" => (string)$data->channel->image->url,
                "title" => (string)$data->channel->image->title,
                "link" => (string)$data->channel->image->link
            );
        }

        $items = $data->item ? $data->item : $data->channel->item;
        foreach ($items as $item_data) {
            $item = array(
                "title" => (string)$item_data->title,
                "link" => (string)$item_data->link,
                "description" => strip_tags((string)$item_data->description),
                "pubDate" => strtotime($item_data->pubDate)
            );
            $res["items"][] = $item;
        }

        return $res;
    }


    function get($url)
    {
        $c = curl_init();
        curl_setopt($c, CURLOPT_URL, $url);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($c, CURLOPT_HEADER, 0);
        return curl_exec($c);
    }

}

?>