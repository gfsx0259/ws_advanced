<?php

class dialog_controller_css_editor extends dialog_controller
{

    function run()
    {
        parent::run();

        if ($this->usertype < USERTYPE_ADMIN) return null;

        switch ($_REQUEST["act"]) {

            case "get":
                $site_info = $this->sites->getSiteInfo();
                return array(
                    "status" => "ok",
                    "data" => $site_info["css"]
                );
                break;


            case "set":
                $p = array(
                    "css" => stripslashes($_REQUEST["css"])
                );
                $this->sites->setValues($p);
                return array(
                    "status" => "ok"
                );
                break;
        }
    }


}