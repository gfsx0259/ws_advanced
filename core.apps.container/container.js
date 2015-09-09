core.apps.container = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: ""
    }

};

core.apps.container.prototype = {


    getWindowTpl: function() {
        return "container_app_window";
    },


    onOpen: function() {
        this.callFunction("initAdminMode");
        this.setTitle(this.profile["title"]);
    }

};
core.apps.container.extendPrototype(core.components.html_component);
core.apps.container.extendPrototype(core.components.desktop_app);