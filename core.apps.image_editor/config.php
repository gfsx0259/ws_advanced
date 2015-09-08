<?

    $config["js_apps"]["core.apps.image_editor"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("image_editor.js"),
                "templates" => array("templates/image_editor.xml"),
                "styles" => array("styles.css")
            ),

            USERTYPE_CONTRIBUTOR => array(
                "code" => array("image_editor.js"),
                "templates" => array("templates/image_editor.xml"),
                "styles" => array("styles.css")
            )
        )

    )


?>