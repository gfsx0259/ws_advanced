<?php

class dialog_controller_file_download extends dialog_controller
{

    var $APIs = array("forms_manager/forms");


    function run()
    {
        parent::run();

        if ($this->usertype < USERTYPE_ADMIN) {
            $this->notFound();
        }

        $file_id = (int)$_GET["id"];

        $p = array(
            "id" => $file_id
        );
        $file = $this->forms->getFile($p);
        if (!$file) {
            $this->notFound();
        }

        $this->outputFile($file);
    }


    function outputFile($file)
    {
        global $config;
        $sys_name = $config["storage"] . "/" . $file["sys_name"];
        if (!file_exists($sys_name)) {
            $this->notFound();
        }


        header("Expires: Mon, 31 Mar 1981 9:51:00 GMT\n");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        $mime = @mime_content_type($sys_name);
        if ($mime) {
            header("Content-type: " . $mime . ";\n");
        }
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: " . filesize($sys_name) . ";\n");
        header("Content-Disposition: attachment; filename=\"" . $file["name"] . "\";\n\n");
        readfile($sys_name);
    }


    function notFound()
    {
        header("HTTP/1.0 404 Not Found");
        die();
    }


}