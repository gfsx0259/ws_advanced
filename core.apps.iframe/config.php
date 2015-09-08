<?

    $config["js_apps"]["core.apps.iframe"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "iframe.js",
                    "iframe.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "iframe.js"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("iframe.js")
            )

        )

    )
?>