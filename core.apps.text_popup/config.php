<?

    $config["js_apps"]["core.apps.text_popup"] = array(

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

    )


?>