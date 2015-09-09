<?php

$config["js_apps"]["core.apps.shooting_scores"] = array(

    'general' => array(
        'title' => 'Shooting scores',
        'name' => 'shooting_scores',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "shooting_scores.js",
                "shooting_scores.admin.js"
            ),
            "templates" => array("templates/shooting_scores.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("shooting_scores.js"),
            "templates" => array("templates/shooting_scores.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array("shooting_scores.js"),
            "templates" => array("templates/shooting_scores.xml")
        )
    )

)


?>