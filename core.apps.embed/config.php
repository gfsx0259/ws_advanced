<?

$config["js_apps"]["core.apps.embed"] = array(

    'general' => array(
        'title' => 'Embed object',
        'name' => 'embed',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_ADVANCED,
        'description' => ''
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "embed.js",
                "embed.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("embed.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("embed.js")
        )
    )

)


?>