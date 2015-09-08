core.apps.rssfeed = function(args) {

    this.rssdatatime=new Date();
    this.currentRSSContents='' 

    this.defaultProfile = {
        title: "",
        app_style: "",
        rss_feed_url: "",
        show_channel_info: true,
        show_channel_img: true,
        show_item_pub_date: true,
        show_item_description: true,
        refesh_time_interval: 0,
        items_per_page: 0
   }


   this.loaded_url = "";
   this.data = false;
}


core.apps.rssfeed.prototype = {


    buildContent: function(el) {
        this.displayTpl(el, "rssfeed");
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
    },



    refresh: function() {
        if(this.loaded_url != this.profile["rss_feed_url"]) {
            this.loaded_url = this.profile["rss_feed_url"];
            this.loadData();
        } else {
            this.displayRSS();
        }
    },


    // data
    loadData: function() {
        if(this.is_loading) return;

        this.is_loading = true;
        this.hideElements(["pager_top", "pager_bottom"]);

        if(this.profile.url != "") {
            this.$["rss"].innerHTML = "Loading...";
            var p = {
                dialog: "rssfeed",
                url: this.profile["rss_feed_url"]
            }        
            core.transport.send("/controller.php", p, this.setData.bind(this), "POST");
        } else {
            this.$["rss"].innerHTML = "";
        }
    },



    setData: function(r) {
        this.is_loading = false;
        if(!r || !r.items) {
            this.data = false;
            this.$["rss"].innerHTML = "Error";
        } else {
            this.data = r;
            this.displayRSS();

            var t = 60000 * this.profile.refesh_time_interval;
            if(t) {
                this.refresh_timeout = setTimeout(this.loadData.bind(this), t);
            }
        }
    },



    // render rss
    displayRSS: function() {
        this.offset = 0;

        if(this.profile["items_per_page"] > 0 && this.data && this.data.items.length > this.profile["items_per_page"]) {
            this.showElements(["pager_top", "pager_bottom"]);
            if(!this.pagers) {
                var p = {
                    per_page: this.profile["items_per_page"],
                    parent: this.$["pager_top"],
                    callback: this.setOffset.bind(this),
                    class_name: "pager"
                }
                this.pagers = { top: new core.objects.pager(p) };
                p.parent = this.$["pager_bottom"];
                this.pagers["bottom"] = new core.objects.pager(p);
            }
            this.pagers["top"].setData(this.offset, this.data.items.length, this.profile["items_per_page"]);
            this.pagers["bottom"].setData(this.offset, this.data.items.length, this.profile["items_per_page"]);
        } else {
            this.hideElements(["pager_top", "pager_bottom"]);
        }


        if(this.data && this.data.channel_info && this.profile["show_channel_info"]) {
            this.showElement("info_box");
            this.$["info_box"].innerHTML = 
                "<a href='" + this.data.channel_info["link"] + "'>" + this.data.channel_info.title + "</a>" +
                "<div class='description'>" + this.data.channel_info.description;
        } else {
            this.hideElement("info_box");
        }


        if(this.data && this.data.channel_img && this.profile["show_channel_img"]) {
            this.showElement("img_box");
            this.$["img_box"].innerHTML = 
                "<img src='" + this.data.channel_img.url + "'/>" + 
                "<a href='" + this.data.channel_img["link"] + "'>" +
                this.data.channel_img.title +
                "</a>";
        } else {
            this.hideElement("img_box");
        }

        this.renderPage();
    },



    setOffset: function(ofs) {
        this.offset = ofs;
        this.pagers["top"].setData(this.offset, this.data.items.length, this.profile["items_per_page"]);
        this.pagers["bottom"].setData(this.offset, this.data.items.length, this.profile["items_per_page"]);
        this.renderPage();
    },



    
    renderPage: function() {

        if(!this.data) return;

        var html = "", title, desc, item_data, date_obj = new Date(), date, description,
            l = this.profile["items_per_page"] == 0 ? this.data.items.length : this.profile["items_per_page"];

        for(var i=0; i<l; i++) {
            if(this.offset + i > this.data.items.length) break;

            item_data = this.data.items[this.offset + i];

            if(item_data.title) {
                title = "<a href='" + item_data["link"] + "'>" + item_data.title + "</a>";
            } else {
                title = false;
            }


            if(item_data["pubDate"] && this.profile["show_item_pub_date"]) {
                date_obj.setUnixTime(item_data["pubDate"]);
                date = date_obj.format(core.config.formats["datetime"]);
            } else {
                date = false;
            }

            if(item_data["description"] && this.profile["show_item_description"]) {
                description = item_data["description"];
            } else {
                description = false;
            }


            html += 
                "<div class='item'>" +
                    (title ? "<div class='title'>" + title + "</div>" : "") +
                    (date ? "<div class='date'>" + date + "</div>" : "") +
                    (description ? "<div class='description'>" + description + "</div>" : "") +
                "</div>";

        }
        this.$["rss"].innerHTML = html;
    }

}
core.apps.rssfeed.extendPrototype(core.components.html_component);
core.apps.rssfeed.extendPrototype(core.components.desktop_app);