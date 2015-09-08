core.apps.embed.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },

    settingsBlocks: [
        { title: "Code:", 
          controls: [
            { tag: "wsc_textarea", id: "inp_code",
              style: { height: "100px" } }
          ]},
        { title: "Height:", 
          controls: [
            { tag: "wsc_size", hide: "w",
              id: "inp_height" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_code"].value = this.profile["code"];
        this.$["inp_height"].setValue({ height: this.profile["embed_height"]});
    },


    processSettingsForm: function() {
        this.profile["embed_height"] = this.$["inp_height"].value.height;
        this.profile["code"] = this.$["inp_code"].value;
    },


    onSettingsUpdated: function() {
        this.renderEmbedCode();
    }

});