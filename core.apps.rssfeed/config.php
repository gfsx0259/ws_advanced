<?

    $config["js_apps"]["core.apps.rssfeed"] = array(

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