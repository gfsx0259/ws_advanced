<?

    $config["js_apps"]["core.apps.container"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "container.js",
                    "container.admin.js"
                ),
                "templates" => array(
                    "templates/container_app_window.xml"
                ),
                "styles" => array(
                    "styles.css"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("container.js"),
                "templates" => array(
                    "templates/container_app_window.xml"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("container.js"),
                "templates" => array(
                    "templates/container_app_window.xml"
                )
            )
        )

    )


?>