<?

    $config["js_apps"]["core.apps.file_download"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "templates" => array(
                    "templates/file_download_content.xml"
                ),
                "code" => array(
                    "file_download.js",
                    "file_download.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("file_download.js"),
                "templates" => array(
                    "templates/file_download_content.xml"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("file_download.js"),
                "templates" => array(
                    "templates/file_download_content.xml"
                )
            )
        )

    )


?>