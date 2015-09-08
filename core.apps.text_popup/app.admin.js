core.apps.text_popup.extendPrototype({


    onFirstRun: function() {
        this.showSettings();
        desktop.openTextsManager(this.onDocSelected1.bind(this));
    },


    onDocSelected1: function(doc) {
        this.profile.content_doc_id = doc.id;
        this.profile.page_content = "content";
        desktop.openTextsManager(this.onDocSelected2.bind(this));
    },

    onDocSelected2: function(doc) {
        this.profile.popup_doc_id = doc.id;
        this.profile.popup_content = "content";
        this.fillSettingsForm();
    },


    settingsBlocks: [
        { title: "On page doc:", 
          controls: [
            { tag: "wsc_doc_control", id: "inp_page_doc" }
          ]},

        { title: "Popup doc:", 
          controls: [
            { tag: "wsc_doc_control", id: "inp_popup_doc" }
          ]},

        { title: "Popup size:",
          controls: [
            { tag: "wsc_size", id: "inp_size" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_page_doc"].setValue({ id: this.profile.content_doc_id, content: this.profile.page_content });
        this.$["inp_popup_doc"].setValue({ id: this.profile.popup_doc_id, content: this.profile.popup_content });
        this.$["inp_size"].setValue({ width: this.profile["popup_width"], height: this.profile["popup_height"]});
    },


    processSettingsForm: function() {
        var d = this.$["inp_page_doc"].value;
        this.profile.content_doc_id = d.id;
        this.profile.page_content = d.content;

        var d = this.$["inp_popup_doc"].value;
        this.profile.popup_doc_id = d.id;
        this.profile.popup_content = d.content;

        var s = this.$["inp_size"].value;
        this.profile["popup_width"] = s.width || 400;
        this.profile["popup_height"] = s.height || 300;
    },


    onSettingsUpdated: function() {
        this.refresh();
    },


    getUsedTexts: function() {
        var res = [];
        var p = this.profile;
        if(p["content_doc_id"]) {
            res.push(p["content_doc_id"]);
        }
        if(p["popup_doc_id"]) {
            res.push(p["popup_doc_id"]);
        }
        return res.length ? res : null;
    }


});