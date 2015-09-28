<?php

$config["js_apps"]["core.apps.text_popup"] = array(

    'general' => array(
        'title' => 'Text popup',
        'name' => 'text_popup',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_ADVANCED,
        'description' => '',
        'depends' => [
            //'texts_manager' because it's core anyway
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "app.js",
                "app.admin.js",
                "text_popup.js"
            ),
            "templates" => array(
                "templates/text_popup.xml"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "app.js",
                "text_popup.js"
            ),
            "templates" => array(
                "templates/text_popup.xml"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "app.js",
                "text_popup.js"
            ),
            "templates" => array(
                "templates/text_popup.xml"
            )
        )

    )

);