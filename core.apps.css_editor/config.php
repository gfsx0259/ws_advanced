<?php
//TODO not sure that it really used, it get data from sites table, but all rows are empty
$config["js_apps"]["core.apps.css_editor"] = array(

    'general' => array(
        'title' => 'CSS editor',
        'name' => 'css_editor',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => 'It allow to edit common site styles'
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("css_editor.js"),
            "templates" => array("templates/css_editor.xml"),
            "styles" => array("styles.css")
        )
    )

);