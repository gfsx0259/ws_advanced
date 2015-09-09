core.apps.shooting_scores = function(args) {

    this.defaultProfile = {
        title: "",
        data_key: "",
        default_date_range: "all",
        visible_columns: {
            name: true,
            target_1: true,
            target_2: true,
            target_3: true,
            target_total: true,
            group_1: true,
            picture_1: true,
            group_2: true,
            picture_2: true,
            group_3: true,
            picture_3: true,
            group_average: true,
            action: true,
            barrel: true,
            powder: true,
            gunsmith: true,
            caliber: true,
            primer: true,
            bullets: true,
            scope: true,
            stock: true,
            blind: true
        }
    }

};


core.apps.shooting_scores.prototype = {

    columns: [
        { key: "ut",
          title: "",
          type: "ut" },
        { key: "name",   
          title: "Name",
          type: "string" },
        { key: "target_1",
          title: "Target 1",
          type: "number" },
        { key: "target_2",
          title: "Target 2",
          type: "number"},
        { key: "target_3",
          title: "Target 3",
          type: "number"},
        { key: "target_total",
          title: "Target Total",
          type: "number"},
        { key: "group_1",
          title: "Group 1",
          type: "number"},
        { key: "group_2",
          title: "Group 2",
          type: "number"},
        { key: "group_3",
          title: "Group 3",
          type: "number"},
        { key: "group_average",
          title: "Group Average",
          type: "number"},
        { key: "action",
          title: "Action",
          type: "string" },
        { key: "barrel",
          title: "Barrel",
          type: "string" },
        { key: "powder",
          title: "Powder",
          type: "string" },
        { key: "gunsmith",
          title: "Gunsmith",
          type: "string" },
        { key: "caliber",
          title: "Caliber",
          type: "string" },
        { key: "primer",
          title: "Primer",
          type: "string" },
        { key: "bullets",
          title: "Bullets",
          type: "string" },
        { key: "scope",
          title: "Scope",
          type: "string" },
        { key: "stock",
          title: "Stock",
          type: "string" },
        { key: "blind",
          title: "Blind",
          type: "string" },
        { key: "picture_1",
          title: "Picture 1",
          type: "picture" },
        { key: "picture_2",
          title: "Picture 2",
          type: "picture" },
        { key: "picture_3",
          title: "Picture 3",
          type: "picture" }
    ],



    getColumnIdxByKey: function(key) {
        for(var i=0; i<this.columns.length; i++) {
            if(this.columns[i].key == key) return i;
        }
        return null;
    },


    column_idx: {
        target_total: 5,
        group_average: 9
    },


    gtable_options: {
        sortColumn: 0, 
        showRowNumber: false,
        width: "100%",
        allowHtml: true
//        height: "300px"
    },


    buildContent: function(el) {
        this.displayTpl(this.$.content, "shooting_scores");
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);

        core.utils.google_jsapi.load(this.onGoogleAPILoaded.bind(this));
        this.$.table.innerHMTL = "Loading...";
    },


    onGoogleAPILoaded: function(result) {
        if(result) {
            google.load(
                'visualization', 
                '1',
                {'packages': ['table', 'corechart'],callback:this.onGooglePackagesLoaded.bind(this)}
            );
        } else {
            this.$.table.innerHMTL = "Error loading google API";
        }
    },


    onGooglePackagesLoaded: function(r) {
        this.loadData();
    },

        
    loadData: function() {        
        this.hideElements(["filters", "graphs1", "graphs2"]);
        if(!this.profile.data_key) return;

        var r = {
            dialog: "shooting_scores",
            act: "get_rows",
            data_key: this.profile.data_key
        };
        core.transport.send("/controller.php", r, this.onServerReponse.bind(this));
    },


    onServerReponse: function(r) {
        if(!r || r.status != "ok") {
            var msg = "Error ";
            if(r.data_key) {
                msg += " loading data for " + r.data_key;
            }
            this.$.table.innerHTML = msg;
        } else {
            this.showElements(["filters", "graphs1", "graphs2"]);
            this.setRows(r.data);
        }
    },




    setRows: function(rows) {
        this.rows = rows;
        this.processDates();

        if(!this.gtable) {
            this.gtable = new google.visualization.Table(this.$.table);
            google.visualization.events.addListener(this.gtable, 
                'select',
                this.onTableSelection.bind(this)
            );
            google.visualization.events.addListener(this.gtable, 
                'sort',
                this.onTableSort.bind(this)
            );
        }
        this.fillTable();
        this.updateRanking();
        this.updateChart2();
        this.updateChart3();
    },




    onTableSort: function(args) {
        this.sort_options = {
            column: args.column,
            ascending: args.ascending
        }
    },



    processDates: function() {
        var dates = {};
        var d;
        for(var i=0; i<this.rows.length; i++) {
            d = new Date(this.rows[i][0]).getUnixTime();
            this.rows[i][0] = d;
            dates[d] = 1;
        }


        this.dates = [];
        for(var d in dates) {
            this.dates.push(d);
        }
        this.dates = this.dates.sort(function(a,b) { return a == b ? 0 : (a > b ? 1 : -1) });


        this.$.inp_date_start.options.length = 0;
        this.$.inp_date_end.options.length = 0;
        for(var i=0; i<this.dates.length; i++) {
            this.$.inp_date_start.options.add(new Option(new Date(this.dates[i] * 1000).format(), this.dates[i]));
            this.$.inp_date_end.options.add(new Option(new Date(this.dates[i] * 1000).format(), this.dates[i]));
        }

        switch(this.profile.default_date_range) {
            case "all":
                this.$.inp_date_start.value = this.dates[0];
                this.$.inp_date_end.value = this.dates[this.dates.length - 1];
                break;
            case "latest":
                this.$.inp_date_start.value = this.dates[this.dates.length - 1];
                this.$.inp_date_end.value = this.dates[this.dates.length - 1];
                break;
        }
    },







//    filters
    onClearQClick: function() {
        this.$.inp_q.value = "";
        this.fillTable();
        this.updateRanking();
        this.updateChart2();
        this.updateChart3();
    },



    onDateStartChanged: function() {
        if(this.$.inp_date_start.value > this.$.inp_date_end.value) {
            this.$.inp_date_end.value = this.$.inp_date_start.value;
        }
//        this.saveViewSettings();
        this.fillTable();
        this.updateRanking();
        this.updateChart2();
        this.updateChart3();
    },



    onDateEndChanged: function() {
        if(this.$.inp_date_start.value > this.$.inp_date_end.value) {
            this.$.inp_date_start.value = this.$.inp_date_end.value;
        }
//        this.saveViewSettings();
        this.fillTable();
        this.updateRanking();
        this.updateChart2();
        this.updateChart3();
    },


    onGroupResultsChanged: function() {
//        this.view_settings.group_results = this.$.inp_group_results.value;
//        this.saveViewSettings();
        this.fillTable();
    },






    fillTable: function() {
        this.hideElement("graphs1");

        var visible_cols = this.getVisibleColumns();

        this.table_data = this.getFilteredRows(this.rows, visible_cols);

        if(this.$.inp_group_results.value == 1) {
            this.table_data = this.groupRowsByName(this.table_data);
        }

        var visible_data = this.processCells(this.table_data, visible_cols);



        var gtable_data = new google.visualization.DataTable(), ctype;
        for(var j=0; j<visible_cols.length; j++) {
            ctype = this.columns[visible_cols[j]].type;
            if(ctype == "picture") {
                gtable_data.addColumn("string", "");
            } else {
                gtable_data.addColumn(ctype, this.columns[visible_cols[j]].title);
            }
        }
        gtable_data.addRows(visible_data);

        if(this.sort_options) {
            this.gtable_options.sortColumn = this.sort_options.column;
            this.gtable_options.sortAscending = this.sort_options.ascending;
        }

        this.gtable.draw(gtable_data, this.gtable_options);
    },





    getFilteredRows: function(rows, visible_cols) {
        var q = this.$.inp_q.value.trim().toLowerCase(),
            date_start = this.$.inp_date_start.value,
            date_end = this.$.inp_date_end.value,
            filtered_rows = [];

        for(var i=0; i<rows.length; i++) {
            if(rows[i][0] < date_start || rows[i][0] > date_end) continue;

            var row = [];
            var str = "", v;
            for(var j=0; j<visible_cols.length; j++) {
                v = rows[i][visible_cols[j]] || "";

                if(this.columns[visible_cols[j]].type == "string") {
                    str += " " + v;
                }
            }
            if(q == "" || (q != "" && str.toLowerCase().indexOf(q) != -1)) {
                filtered_rows.push(rows[i]);
            }
        }

        return filtered_rows;
    },



    groupRowsByName: function(rows) {
        var grouped_rows = {}, name, res = [];

        for(var i=0; i<rows.length; i++) {
            name = rows[i][1];
            if(!grouped_rows[name]) {
                grouped_rows[name] = [ rows[i] ];
            } else {
                grouped_rows[name].push(rows[i]);
            }
        }

        for(name in grouped_rows) {
            var name_block = grouped_rows[name], row = [], v;
            
            for(var i=0; i<name_block[0].length; i++) {
                switch(this.columns[i].type) {
                    case "number":
                        var sum = 0, competitions = 0;
                        for(var k=0; k<name_block.length; k++) {
                            v = parseFloat(name_block[k][i]);
                            if(!isNaN(v)) {
                                competitions ++;
                                sum += v;
                            }
                        }
                        v = competitions == 0 ? 0 : parseFloat((sum / competitions).toFixed(2));
                        break;
                    case "picture":
                        v = [];
                        for(var k=0; k<name_block.length; k++) {
                            if(name_block[k][i]) {
                                v.push(name_block[k][i]);
                            }
                        }
                        v = v.join("#");
                        break;
                        
                    default:
                        v = name_block[0][i];
                        break;
                }
                row.push(v);
            }
            res.push(row);
        }
        return res;
    },




    processCells: function(rows, visible_cols) {
        var res = [], v, col_idx;
        for(var i=0; i<rows.length; i++) {
            var row = [];
            for(var j=0; j<visible_cols.length; j++) {
                v = rows[i][visible_cols[j]];
                switch(this.columns[visible_cols[j]].type) {
                    case "number":
                        v = parseFloat(v) || 0;
                        break;

                    case "picture":
                        if(v != "") {
                            v = v.split("#");
                            v = "<a href='javascript:void(0)' onclick='desktop.openImageBox([\"" + v.join("\",\"") + "\"],0)'><img src='/static/icons/picture_small.png'/></a>";
                        } else {    
                            v = "";
                        }
                        break;
                }
                row.push(v);
            }
            res.push(row);
        }
        return res;
    },









// graphs

    onTableSelection: function(r) {
        var selection = this.gtable.getSelection();
        if(!selection || selection.length == 0 || selection[selection.length - 1].row == null) return;
        var name = this.table_data[selection[selection.length - 1].row][1];


        if(name == this.selected_name) return;
        this.selected_name = name;


        this.showElement("graphs1");
        if(!this.is_graphs_ready) {
            this.is_graphs_ready = true;

            this.charts = [
                new google.visualization.LineChart(this.$.chart0),
                new google.visualization.LineChart(this.$.chart1)
            ]
        }



        var data0 = [], data1 = [], r;
        for(var i=0; i<this.rows.length; i++) {
            r = this.rows[i];
            if(r[1] == name) {
                data0.push([ r[0], parseFloat(r[this.column_idx.target_total])]);
                data1.push([ r[0], parseFloat(r[this.column_idx.group_average])]);
            }
        }

        data0 = data0.sort(function(a,b) { return a[0] == b[0] ? 0 : (a[0] > b[0] ? 1 : -1) });
        data1 = data1.sort(function(a,b) { return a[0] == b[0] ? 0 : (a[0] > b[0] ? 1 : -1) });
        for(var i=0; i<data0.length; i++) {
            data0[i][0] = new Date(data0[i][0] * 1000).format();
            data1[i][0] = new Date(data1[i][0] * 1000).format();
        }
        data0.unshift(['Date', '']);
        data1.unshift(['Date', '']);

        data0 = google.visualization.arrayToDataTable(data0);
        this.$.chart0_title.innerHTML ="Target Total for " + name;
        this.charts[0].draw(data0, { legend: { position: "none" }});
        
        data1 = google.visualization.arrayToDataTable(data1);
        this.$.chart1_title.innerHTML ="Group Average for " + name;
        this.charts[1].draw(data1, { legend: { position: "none" }});
    },





    getVisibleColumns: function() {
        var res = [ 1 ], i = 1, vc = clone(this.profile.visible_columns);

        for(var i=2; i<this.columns.length; i++) {
            if(vc[this.columns[i].key]) res.push(i);
        }
        return res;
    },





    updateRanking: function() {
        var col_idx = this.getColumnIdxByKey(this.$.inp_ranking.value);
        if(col_idx == null) {
            this.$.ranking.innerHTML = "";
            return;
        }

        var l = {},
            date_start = this.$.inp_date_start.value,
            date_end = this.$.inp_date_end.value;



        for(var i=0; i<this.rows.length; i++) {
            if(this.rows[i][0] < date_start || this.rows[i][0] > date_end) continue;

            var key = this.rows[i][col_idx],
                group_average = parseFloat(this.rows[i][this.column_idx.group_average]) || 0,
                target_total = parseFloat(this.rows[i][this.column_idx.target_total]) || 0;

            if(!l[key]) {
                l[key] = {
                    competitions: 0,
                    group_average: 0,
                    target_total: 0
                }
            }

            l[key].competitions++;
            l[key].group_average += group_average;
            l[key].target_total += target_total;
        }



        var l2 = [];
        for(var key in l) {
            l2.push({ 
                key: key, 
                score: l[key].target_total - l[key].group_average
            });
        }


        l2 = l2.sort(function(a,b) { return a.score == b.score ? 0 : (a.score < b.score ? 1 : -1) });
        l2 = l2.slice(0, 5);

        var html = "<ol>";
        for(var i=0; i<l2.length; i++) {
            html += "<li>" + (l2[i].key || "Not specified") + "</li>";
        }
        this.$.ranking.innerHTML = html + "</ol>";
    },







    updateChart2: function() {
        var col_idx = this.getColumnIdxByKey(this.$.inp_chart2.value);
        if(col_idx == null) return;
        var chart_data = this.getPieChartData(this.column_idx.group_average, col_idx);
        if(!this.chart2) {
            this.chart2 = new google.visualization.PieChart(this.$.chart2);
        }
        this.chart2.draw(chart_data, { backgroundColor: { fill: "transparent" }});
    },



    updateChart3: function() {
        var col_idx = this.getColumnIdxByKey(this.$.inp_chart3.value);
        if(col_idx == null) return;
        var chart_data = this.getPieChartData(this.column_idx.target_total, col_idx);
        if(!this.chart3) {
            this.chart3 = new google.visualization.PieChart(this.$.chart3);
        }
        this.chart3.draw(chart_data, { backgroundColor: { fill: "transparent" }});
    },




    getPieChartData: function(calc_col_idx, value_col_idx) {

        var winners = {},
            date_start = this.$.inp_date_start.value,
            date_end = this.$.inp_date_end.value;

        var dates = [];
        for(var i=0; i<this.dates.length; i++) {
            if(this.dates[i] >= date_start && this.dates[i] <= date_end) {
                dates.push(this.dates[i]);
            }
        }

        for(var i=0; i<dates.length; i++) {
            var date = dates[i];
            for(var j=0; j<this.rows.length; j++) {
                if(this.rows[j][0] != date) continue;
                if(!winners[date] || winners[date][calc_col_idx] < this.rows[j][calc_col_idx]) {
                    winners[date] = this.rows[j];
                }
            }
        }

        var data = {}, key;
        for(var i in winners) {
            key = winners[i][value_col_idx];
            if(!data[key]) {
                data[key] = 1;
            } else {
                data[key]++;
            }
        }


        var chart_data = [["",""]];
        for(var key in data) {
            chart_data.push([key || "Not specified", parseInt(data[key],10)]);
        }

        return google.visualization.arrayToDataTable(chart_data);
    }


/*

    // cookies
    loadViewSettigns: function() {
        this.view_settings = eval(core.broser.cookies.get("shooting_scores"));
        if(!this.view_settings) {
            this.view_settings = {
                date_start: 0,
                date_end: 0,
                group_results: 1
            }           
        }
        this.$.inp_group_results.value = this.view_settings.group_results;
    },


    saveViewSettings: function() {
        this.view_settings = {
            group_results: this.$.inp_group_results.value,
        }
        core.broser.cookies.set("shooting_scores", varToString(this.view_settings));
    }
    */

};
core.apps.shooting_scores.extendPrototype(core.components.html_component);
core.apps.shooting_scores.extendPrototype(core.components.desktop_app);