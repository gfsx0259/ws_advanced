<?

$config["js_apps"]["core.apps.rssfeed"] = array(

    'general' => array(
        'title' => 'RSS Feeds',
        'name' => 'rssfeed',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_ADVANCED,
        'description' => ''
    ),

    "version" => 1,

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "rssfeed.js",
                "rssfeed.admin.js"
            ),
            "templates" => array(
                "templates/template.xml"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("rssfeed.js"),
            "templates" => array(
                "templates/template.xml"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("rssfeed.js"),
            "templates" => array(
                "templates/template.xml"
            )
        )
    )

)


?>