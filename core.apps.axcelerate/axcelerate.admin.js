core.apps.axcelerate.extendPrototype({
    onFirstRun: function() {
        this.showSettings();
    },

    settingsBlocks: [
        {
            title: 'API Token',
            controls: {
                tag: 'wsc_text', id: 'api_token'
            }
        },
        {
            title: 'WS Token',
            controls: {
                tag: 'wsc_text', id: 'ws_token'
            }
        },
        {
            title: 'Course',
            controls: {
                tag: 'select',
                id: 'axcelerate_course',
                className: 'w_100'
            }
        }
    ],

    processSettingsForm: function() {
        var title, location, course;

        this.profile["api_token"] = this.$["api_token"].value;
        this.profile["ws_token"] = this.$["ws_token"].value;

        course = this.$["axcelerate_course"].value.split(' (');
        if(course[0]) {
            title = course[0];
            location = course[1].slice(0, course[1].length - 1);
        }

        this.profile["ax_location"] = location;
        this.profile["ax_title"] = title;
    },

    onSettingsUpdated: function() {
        this.fillSettingsForm();
        this.getCourseDates();
    },

    fillSettingsForm: function() {
        if(this.profile["api_token"]) {
            this.$["api_token"].value = this.profile["api_token"];
        }
        if(this.profile["ws_token"]) {
            this.$["ws_token"].value = this.profile["ws_token"];
        }

        var p = {
            dialog: 'axcelerate',
            act: 'get_courses'
        };

        this.ajaxProxy(p, function(res) {
            if(!res[0].title && !res[0].location) return;
            var select = this.$["axcelerate_course"],
                prop, option,
                len = res.length, i;
            select.innerHTML = "";
            for(i = 0; i < len; i += 1) {
                prop = res[i];
                option = document.createElement('option');
                option.appendChild(document.createTextNode(prop.title + ' (' + prop.location + ')'));
                select.appendChild(option);
            }
        });
    }
});