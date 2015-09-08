core.apps.rssfeed.extendPrototype({


    onFirstRun: function() {
        this.showSettings();
    },



    settingsBlocks: [
        { title: "RSS Feed URL:",
          controls: [
            { tag: "wsc_text", id: "inp_rss_feed_url" }
          ]},

        { title: "Channel:",
          controls: [
            { tag: "wsc_checkbox", title: "Show info", id: "inp_show_channel_info" },
            { tag: "wsc_checkbox", title: "Show image", id: "inp_show_channel_img" }
          ]},

        { title: "Item:",
          controls: [
            { tag: "wsc_checkbox", title: "Show publish date", id: "inp_show_item_pub_date" },
            { tag: "wsc_checkbox", title: "Show description", id: "inp_show_item_description" }
          ]},


        { title: "Per Page:",
          controls: [
            { tag: "wsc_slider", id: "inp_items_per_page",
              options: [
                { text: "5 records", value: 5 },
                { text: "10 records", value: 10 },
                { text: "15 records", value: 15 },
                { text: "20 records", value: 20 },
                { text: "All", value: 0 }
              ]}
          ]},

        { title: "Auto Refresh:",
          controls: [
            { tag: "wsc_slider", id: "inp_refesh_time_interval",
              options: [
                { text: "Disabled", value: 0 },
                { text: "1 min", value: 1 },
                { text: "2 min", value: 2 },
                { text: "3 min", value: 3 },
                { text: "5 min", value: 5 },
                { text: "10 min", value: 10 }
              ]}
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_rss_feed_url"].value = this.profile["rss_feed_url"];

        this.$["inp_show_channel_info"].setChecked(this.profile["show_channel_info"]);
        this.$["inp_show_channel_img"].setChecked(this.profile["show_channel_img"]);
        this.$["inp_show_item_pub_date"].setChecked(this.profile["show_item_pub_date"]);
        this.$["inp_show_item_description"].setChecked(this.profile["show_item_description"]);

        this.$["inp_items_per_page"].setValue(this.profile["items_per_page"]);
        this.$["inp_refesh_time_interval"].setValue(this.profile["refesh_time_interval"]);

    },


    processSettingsForm: function() {
        this.profile["rss_feed_url"] = this.$["inp_rss_feed_url"].value;

        this.profile["show_channel_info"] = this.$["inp_show_channel_info"].checked;
        this.profile["show_channel_img"] = this.$["inp_show_channel_img"].checked;
        this.profile["show_item_pub_date"] = this.$["inp_show_item_pub_date"].checked;
        this.profile["show_item_description"] = this.$["inp_show_item_description"].checked;

        this.profile["items_per_page"] = parseInt(this.$["inp_items_per_page"].value, 10);
        this.profile["refesh_time_interval"] = parseInt(this.$["inp_refesh_time_interval"].value, 10);
    },


    onSettingsUpdated: function() {
        clearTimeout(this.refresh_timeout);
        this.is_loading = false;
        this.refresh();
    }


});