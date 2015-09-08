core.apps.dialog_prompt = function() {}


core.apps.dialog_prompt.prototype = {


    // code
    getTitle: function() {
        return "";
    },


    renderContent: function() {
        this.displayTpl(this.$["content"], "dialog_prompt");
    },


    // init menu/pages elements_list
    onShowContent: function() {
        this.$["label"].innerHTML = core.values.dialog_prompt.label;
        this.$["inp_text"].value = core.values.dialog_prompt.default_value || "";
    },

   

    onOkClick: function() {
        var v = this.$["inp_text"].value.trim();
        desktop.hidePopupApp();
        if(v != "" && core.values.dialog_prompt.callback) {
            core.values.dialog_prompt.callback(v);
        }
    },


    onCancelClick: function() {
        desktop.hidePopupApp();
    }

}
core.apps.dialog_prompt.extendPrototype(core.components.html_component);
core.apps.dialog_prompt.extendPrototype(core.components.popup_app);