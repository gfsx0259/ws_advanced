core.apps.file_download.extendPrototype({


    onFirstRun: function() {
        this.showSettings();
        this.$["filename"].onSelectClick();
    },



    settingsBlocks: [
        { title: "File:", 
          controls: [
            { tag: "wsc_file", id: "filename" }
          ]},


        { title: "Icon:", 
          controls: [
            { tag: "wsc_file", id: "s_image" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Show", id: "inp_chk_image" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Enable image popup on click ", id: "inp_popup" },
          ]},


        { title: "Description:", 
          controls: [
            { tag: "wsc_text", id: "inp_description" },
            { tag: "div", className: "divider"},
            { tag: "wsc_checkbox", title: "Show", id: "inp_caption" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_popup"].setChecked(this.profile["popup"]);
        this.$["inp_caption"].setChecked(this.profile["caption"]);
        this.$["inp_chk_image"].setChecked(this.profile["chk_image"]);

        this.$["s_image"].setValue(this.profile["image"]);

        this.$["inp_description"].value = this.profile["description"];
        this.$["filename"].setValue(this.profile["file"]);
    },


    processSettingsForm: function() {
        this.profile["popup"] = this.$["inp_popup"].checked ? 1 : 0;
        this.profile["caption"] = this.$["inp_caption"].checked ? 1 : 0;
        this.profile["chk_image"] = this.$["inp_chk_image"].checked ? 1 : 0;
        this.profile["description"] = this.$["inp_description"].value;
        this.profile["file"] = this.$["filename"].value;
        this.profile["image"] = this.$["s_image"].value;
    },


    onSettingsUpdated: function() {
        this.refreshContent();
    }


});