core.apps.css_editor = function() {

    core.values.site_css = null;

}



core.apps.css_editor.prototype = {


    window_resize: {
        height: 400,
        min_height: 400,
        width: 670,
        min_width: 480,
        target: "css_editor"
    },



    getTitle: function() {
        return "Theme Editor";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "css_editor");
    },


    onShowContent: function() {
        if(core.values.site_css == null) {
            this.loadCSS();
        } else {
            this.$["editor"].value = core.values.site_css;
        }
    },


    loadCSS: function() {
        desktop.setState("loading");
        var p = {
            dialog: "css_editor",
            act: "get"
        }
        core.transport.send("/controller.php", p, this.onCSSData.bind(this));
    },


    onCSSData: function(r) {
        if(!r || r.status != "ok") {
            desktop.modal_dialog.alert("Server error");
            return;
        }
        desktop.setState("normal");
        core.values.site_css = r.data
        this.$["editor"].value = core.values.site_css;
    },



    onEditorCancelClick: function() {   
        desktop.hidePopupApp();
    },


    onEditorSaveClick: function() {
        desktop.setState("loading");
        var p = {
            dialog: "css_editor",
            act: "set",
            css: this.$["editor"].value
        }
        core.transport.send("/controller.php", p, this.onSetCSSResponce.bind(this));
    },


    onSetCSSResponce: function(r) {
        if(!r || r.status != "ok") {
            desktop.modal_dialog.alert("Server error");
            return;
        }
//        desktop.setState("normal");
        desktop.loadURL(location.href);
    }


}
core.apps.css_editor.extendPrototype(core.components.html_component);
core.apps.css_editor.extendPrototype(core.components.popup_app);