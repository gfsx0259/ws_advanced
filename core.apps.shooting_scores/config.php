<?

    $config["js_apps"]["core.apps.shooting_scores"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "shooting_scores.js",
                    "shooting_scores.admin.js"
                ),
                "templates" => array("templates/shooting_scores.xml")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("shooting_scores.js"),
                "templates" => array("templates/shooting_scores.xml")
            ),


            USERTYPE_GUEST => array(
                "code" => array("shooting_scores.js"),
                "templates" => array("templates/shooting_scores.xml")
            )
        )

    )


?>