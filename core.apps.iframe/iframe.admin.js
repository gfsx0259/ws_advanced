core.apps.iframe.extendPrototype({


    resize_params: {
        target_element: "browser"
    },


    onFirstRun: function() {
        this.showSettings();
    },


    settingsBlocks: [
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", hide: "w",
              id: "inp_height" }
          ]},

        { title: "URL:", 
          controls: [
            { tag: "wsc_text",
              events: { onblur: "checkSettingsURL" },
              id: "inp_url" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_height"].setValue({ height: this.profile["height"]});
        this.$["inp_url"].value = this.profile["url"];
    },


    processSettingsForm: function() {
        this.profile["height"] = this.$["inp_height"].value.height;
        this.profile["url"] = this.$["inp_url"].value.trim();
    },

    onSettingsUpdated: function() {
        this.refresh();
    },


    checkSettingsURL: function(e) {
        var el = this.$["inp_url"];
        var url = el.value.trim();
        if(url.indexOf("://") == -1) {
            url = "http://" + url;
        }
        el.value = url;
    }

});