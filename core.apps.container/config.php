<?php

$config["js_apps"]["core.apps.container"] = array(

    'general' => array(
        'title' => 'Container',
        'name' => 'container',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_ADVANCED,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "container.js",
                "container.admin.js"
            ),
            "templates" => array(
                "templates/container_app_window.xml"
            ),
            "styles" => array(
                "styles.css"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("container.js"),
            "templates" => array(
                "templates/container_app_window.xml"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("container.js"),
            "templates" => array(
                "templates/container_app_window.xml"
            )
        )
    )

);