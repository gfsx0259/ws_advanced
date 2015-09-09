<?php

$config["js_apps"]["core.apps.iframe"] = array(

    'general' => array(
        'title' => 'Embed Web page',
        'name' => 'iframe',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_ADVANCED,
        'description' => ''
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "iframe.js",
                "iframe.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "iframe.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("iframe.js")
        )

    )

)
?>