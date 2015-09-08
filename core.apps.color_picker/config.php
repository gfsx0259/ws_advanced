<?

    $config["js_apps"]["core.apps.color_picker"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array("color_picker.js"),
                "templates" => array("templates/color_picker.xml"),
                "styles" => array("styles.css")
            ),

            USERTYPE_CONTRIBUTOR => array(
                "code" => array("color_picker.js"),
                "templates" => array("templates/color_picker.xml"),
                "styles" => array("styles.css")
            )
        )

    )


?>