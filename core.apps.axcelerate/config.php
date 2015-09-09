<?php

$config["js_apps"]["core.apps.axcelerate"] = array(
    'general' => array(
        'title' => 'Enroll on aXcelerate',
        'name' => 'axcelerate',//should be like 3th part of folder
        'icon' => 'icon.png',
        'version' => '1.0.0',
        'category' => CATEGORY_ADVANCED,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "axcelerate.js",
                "axcelerate.admin.js"
            ),
            "templates" => array(
                "templates/axcelerate.xml"
            ),
            "styles" => array(
                "styles/styles.css"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("axcelerate.js"),
            "templates" => array(
                "templates/axcelerate.xml"
            ),
            "styles" => array(
                "styles/styles.css"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("axcelerate.js"),
            "templates" => array(
                "templates/axcelerate.xml"
            ),
            "styles" => array(
                "styles/styles.css"
            )
        )
    )

);