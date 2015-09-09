core.objects.text_popup = function() {


    var scroll = core.browser.getScroll();
    var wsize = core.browser.getWindowSize();

    this.position = {
        width: 400,
        height: 300,
        top: scroll.top + 100
    };
    this.position.left = Math.round((wsize.width - 400) * 0.5) - 20;

};


core.objects.text_popup.prototype = {

    show: function(html) {
        if(!this.is_rendered) {
            this.render();
            this.is_rendered = true;
        }
        this.showElement("popup_wrapper");
        this.updatePosition();
        this.$["content"].innerHTML = html || "";
    },


    render: function() {
        this.displayTpl(document.body, "text_popup");
    },


    setStyle: function(class_name) {
        if(!this.is_rendered) return;
        this.$["popup_wrapper"].className = class_name;
    },


    setPosition: function(pos) {
        for(var k in pos) {
            this.position[k] = pos[k];
        }
        this.updatePosition();
    },


    updatePosition: function() {
        if(!this.is_rendered) return;

        var els = this.$["window"].style;
        els.left = this.position.left + "px";
        els.top = this.position.top + "px";
        els.width = this.position.width + "px";
        els.height = this.position.height + "px";
    },



    hide: function() {
        if(!this.is_rendered) return;

        this.hideElement("popup_wrapper");
    },


    kill: function() {
        if(!this.is_rendered) return;
        document.body.removeChild(this.$["popup_wrapper"]);
    },




    // resize

    startResize: function(e) {
        if(this.is_resizing) return;
        this.is_resizing = true;
        e = core.browser.event.fix(e);
        document.onmouseup = this.stopResize.bindAsEventListener(this);
        this._old_mouse_move = document.onmousemove;
        this._tmp_size = {
            width: this.position.width,
            height: this.position.height
        };
        this._roffset = {
            left: e.clientX,
            top: e.clientY
        };
        document.onmousemove = this.resize.bindAsEventListener(this);
        document.ondragstart = function() { return false };
        core.browser.event.kill(e);
        return false;    
    },


    resize: function(e) {
        e = core.browser.event.fix(e);

        var win = core.browser.getWindowSize();
        var ofs = {
            width: Math.max(this._roffset.left - Math.min(win.width, e.clientX)),
            height: Math.max(this._roffset.top - Math.min(win.height, e.clientY))
        };

        this.position.width = Math.max(this._tmp_size.width - ofs.width, 100),
        this.position.height = Math.max(this._tmp_size.height - ofs.height, 50);
        this.updatePosition();
    },



    stopResize: function(e) {
        this.is_resizing = false;
        document.onmouseup = null;
        document.onmousemove = this._old_mouse_move;
    },




    // move

    startMove: function(e) {
        if(this.is_moving) return;
        this.is_moving = true;
        e = core.browser.event.fix(e);
        document.onmouseup = this.stopMove.bindAsEventListener(this);
        this._old_mouse_move = document.onmousemove;
        this._tmp_pos = {
            left: this.position.left,
            top: this.position.top
        };
        this._roffset = {
            left: e.clientX,
            top: e.clientY
        };
        document.onmousemove = this.move.bindAsEventListener(this);
        document.ondragstart = function() { return false };
        core.browser.event.kill(e);
        return false;    
    },


    move: function(e) {
        e = core.browser.event.fix(e);

        var win = core.browser.getWindowSize();
        var pos = {
            left: Math.max(this._roffset.left - Math.min(win.width, e.clientX)),
            top: Math.max(this._roffset.top - Math.min(win.height, e.clientY))
        };

        this.position.left = Math.max(this._tmp_pos.left - pos.left, 0),
        this.position.top = Math.max(this._tmp_pos.top - pos.top, 0);
        this.updatePosition();
    },



    stopMove: function(e) {
        this.is_moving = false;
        document.onmouseup = null;
        document.onmousemove = this._old_mouse_move;
    }
};
core.objects.text_popup.extendPrototype(core.components.html_component);