core.apps.text_popup = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",

        content_doc_id: null,
        page_content: "summary",

        popup_doc_id: null,
        popup_content: "content",

        popup_width: 400,
        popup_height: 300
    }

}


core.apps.text_popup.prototype = {


    buildContent: function(el) {
        this.$["content"].onclick = this.onContentClick.bindAsEventListener(this);
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },


    onAppStyleChanged: function() {
        if(!this.popup) return;
        this.popup.setStyle(this.getAppStyleSelector());
    },


    refresh: function() {
        if(this.profile["content_doc_id"]) {
            core.data.texts.get(this.profile["content_doc_id"], this.setContentDoc.bind(this));
        } else {
            this.setContentDoc(null);
        }
    },


    onContentClick: function(e) {
        e = core.browser.event.fix(e);
        if(e && e.target.tagName == "A") {
            return;
        }
        this.showPopup();
    },


    setContentDoc: function(doc) {
        if(this.profile["content_doc_id"] == null) {
            this.$["content"].innerHTML = "";
        } else {
            this.$["content"].innerHTML = doc[this.profile["page_content"]];
        }
    },



    showPopup: function() {
        if(this.profile["popup_doc_id"] == null) return;
        if(!this.popup) {
            this.popup = new core.objects.text_popup();
        }
        this.popup.setStyle(this.getAppStyleSelector());
        var scroll = core.browser.getScroll();
        var wsize = core.browser.getWindowSize();

        var pos = {
            left: Math.round((wsize.width - this.profile["popup_width"]) * 0.5) - 20,
            width: this.profile["popup_width"],
            height: this.profile["popup_height"]
        }
        this.popup.setPosition(pos);
        this.popup.show("Loading...");
        core.data.texts.get(this.profile["popup_doc_id"], this.setPopupDoc.bind(this));
    },



    setPopupDoc: function(doc) {
        this.popup.setStyle(this.getAppStyleSelector());
        this.popup.show(doc[this.profile["popup_content"]]);
    },


    onClose: function() {
        if(!this.popup) return;
        this.popup.kill();
        this.popup = null;
    }


}
core.apps.text_popup.extendPrototype(core.components.html_component);
core.apps.text_popup.extendPrototype(core.components.desktop_app);