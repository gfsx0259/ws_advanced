<?php

class dialog_controller_axcelerate extends dialog_controller
{
    public $APIs = ['captcha'];
    public $appAPIs = ['axcelerate'];

    public function run()
    {
        parent::run();
        switch ($_REQUEST["act"]) {
            case "get_calendar":
                echo $this->axcelerate->getCalendar();
                die;
                break;
            case "register_new_user":
                echo $this->axcelerate->registerNewUser();
                die;
                break;
            case "register_current_user":
                echo $this->axcelerate->registerCurrentUser();
                die;
                break;
            case "get_course_details":
                echo $this->axcelerate->getCourseDetails();
                die;
                break;
            case "course_payment":
                echo $this->axcelerate->coursePayment();
                die;
                break;
            case "save_settings":
                echo $this->axcelerate->saveSettings();
                die;
                break;
            case "get_locations":
                echo $this->axcelerate->getLocations();
                die;
                break;
            case "get_courses":
                echo $this->axcelerate->getCourses();
                die;
                break;
        }
    }
}