<?

    $config["js_apps"]["core.apps.axcelerate"] = array(

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

    )


?>