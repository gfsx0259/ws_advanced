<?

    $config["js_apps"]["core.apps.embed"] = array(

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