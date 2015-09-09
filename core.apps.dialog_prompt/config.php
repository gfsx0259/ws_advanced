<?

$config["js_apps"]["core.apps.dialog_prompt"] = array(

    'general' => array(
        'title' => 'Dialog prompt',
        'name' => 'dialog_prompt',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => 'Displayed dialog when it needed, it is component for other widgets, such as files manager'
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "dialog_prompt.js"
            ),
            "templates" => array(
                "templates/dialog_prompt.xml"
            ),
            "styles" => array(
                "styles.css"
            )
        )
    )

)


?>