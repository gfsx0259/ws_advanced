<?php

$config["js_apps"]["core.apps.file_download"] = array(

    'general' => array(
        'title' => 'File download',
        'name' => 'file_download',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_ADVANCED,
        'icon' => 'icon.png',
        'description' => 'Allow to download user files',
        'depends' => [
            'forms_manager',
            'files_manager'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "templates" => array(
                "templates/file_download_content.xml"
            ),
            "code" => array(
                "file_download.js",
                "file_download.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("file_download.js"),
            "templates" => array(
                "templates/file_download_content.xml"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("file_download.js"),
            "templates" => array(
                "templates/file_download_content.xml"
            )
        )
    )

);