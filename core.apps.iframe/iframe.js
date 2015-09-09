core.apps.iframe = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        height: 200,
        url: ""
    }
};

core.apps.iframe.prototype = {


    buildContent: function(el) {
        this.buildModel(el,
            { tag: "iframe",
              id: "browser",
              vspace: "0",
              hspace: "0",
              marginwidth: "0",
              marginheight: "0",
              frameBorder: "0",
              allowTransparency: true,
              style: { width: "100%", height: "0", border: "0", backgroundColor: "transparent" }}
        );
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },


    refresh: function() {
        this.$["browser"].style.height = this.profile["height"] + "px";
        this.$["browser"].src = this.profile["url"] || "about:blank";
    }


};

core.apps.iframe.extendPrototype(core.components.html_component);
core.apps.iframe.extendPrototype(core.components.desktop_app);