core.apps.shooting_scores.extendPrototype({





    onFirstRun: function() {
        this.showSettings();
    },


    settingsBlocks: [
        { title: "File:",
          controls: [
            { tag: "wsc_select", id: "inp_data_key" }
          ]},

        { title: "Default date range:",
          controls: [
            { tag: "wsc_select", id: "inp_default_date_range",
              options: [
                { text: "All", value: "all" },
                { text: "Latest competition", value: "latest" }
              ]}
          ]},

        { title: "Show columns:",
          controls: [
            { tag: "div", id: "columns_selector" }
          ]}

    ],
    



    onSettingsRendered: function() {
        for(var i=2; i<this.columns.length; i++) {
            this.buildModel(this.$.columns_selector,
                { tag: "wsc_checkbox", id: "inp_column_visible_" + this.columns[i].key,
                  title: this.columns[i].title }
            );
        }

        if(!this.data_keys_loaded) {
            desktop.setState("loading");
            var r = {
                dialog: "shooting_scores",
                act: "get_data_keys_list"
            };
            core.transport.send("/controller.php", r, this.onDataKeysResponse.bind(this));
        }
    },


    onDataKeysResponse: function(r) {
        desktop.setState("normal");
        var opts = [
            { text: "...", value: ""}
        ];
        if(r && r.status == "ok") {
            for(var i=0; i<r.data.length; i++) {
                opts.push({ text: r.data[i], value: r.data[i] });
            }
        }
        this.$.inp_data_key.setOptions(opts);
        this.$["inp_data_key"].setValue(this.profile.data_key);
        this.data_keys_loaded = true;
    },


    fillSettingsForm: function() {
        this.$["inp_data_key"].setValue(this.profile.data_key);
        this.$["inp_default_date_range"].setValue(this.profile.default_date_range);
        for(var i=2; i<this.columns.length; i++) {
            this.$["inp_column_visible_" + this.columns[i].key].setChecked(this.profile["visible_columns"][this.columns[i].key]);
        }
    },



    processSettingsForm: function() {
        this.profile.data_key = this.$["inp_data_key"].value;
        this.profile.default_date_range = this.$["inp_default_date_range"].value;
        for(var i=2; i<this.columns.length; i++) {
            this.profile.visible_columns[this.columns[i].key] = this.$["inp_column_visible_" + this.columns[i].key].checked;
        }
    },


    onSettingsUpdated: function() {
        this.loadData();
    }

});