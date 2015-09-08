core.apps.container.extendPrototype({

    
    apps_container: true,


    initAdminMode: function() {
        if(core.usertype < USERTYPE_ADMIN) return;

        this.buildModel(this.$["window"],
            { tag: "div", className: "container_border" }
        );
        this.$["content"].wid = "cell";
        this.$["content"].is_row = true;
        this.$["window"].is_container_app = true;
        this.$["content"].style.minHeight = "32px";
        this.onContentChanged();
    },



    enableDrop: function() {
        desktop.layout.app_drag.showPlaceholder(false);
        this.app_drop_allowable = true;
        this.hideAdminOverlay();
        this.showOuterOverlay();

        var el = this.$["content"];
        if(el.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el });
        } else if(el.firstChild && el.firstChild.firstChild && el.firstChild.firstChild.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el.firstChild.firstChild });
        }
    },


    disableDrop: function() {
        if(this.app_drop_allowable) {
            desktop.layout.app_drag.showPlaceholder(false);
            this.app_drop_allowable = false;
            this.hideOuterOverlay();
        }
    },


    onContentChanged: function() {
        if(this.isContentEmpty()) {
            this.showEmptyMsg();
        } else {
            this.hideEmptyMsg();
        }
    },


    isContentEmpty: function() {
        var el = this.$["content"];
        return el.childNodes.length == 0 || (el.firstChild && el.firstChild.firstChild && el.firstChild.firstChild.childNodes.length == 0);
    },


    showEmptyMsg: function() {
        if(this.empty_msg_visible) return;
        this.empty_msg_visible = true;
        var el = this.$["content"];
        this.buildModel(this.$["window"],
            { tag: "div", className: "msg_container_empty",
              id: "msg_empty",
              innerHTML: "Container" }
        );
    },


    hideEmptyMsg: function() {
        if(!this.empty_msg_visible) return;
        this.hideElement("msg_empty");
        this.empty_msg_visible = false;
    },



    showDropOverlay: function() {
        if(this.drop_overlay_visible) return;

        this.drop_overlay_visible = true;
        if(!this.$.drop_overlay) {
            this.buildModel(this.$.window,
                { tag: "div",
                  id: "drop_overlay",
                  className: "container_drop_overlay" }
            );
        } else {
            this.showElement("drop_overlay");
        }
    },


    hideDropOverlay: function() {
        this.drop_overlay_visible = false;
        this.hideElement("drop_overlay");
    }

});