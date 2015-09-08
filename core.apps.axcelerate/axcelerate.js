/**
 * Created by alexey on 20.03.14.
 */
core.apps.axcelerate = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        api_token: "",
        ws_token: "",
        ax_location: "",
        ax_title: ""
    }
};

core.apps.axcelerate.prototype = {

    buildContent: function(el) {
        this.displayTpl(this.$["content"], "axcelerate_register");
    },

    onOpen: function() {
        var self = this,
            contactId;
        this.showSection("register");
        this.getCourseDates();
        this.generateYears(); //generate years for payment
//        contactId = this.getCookie('contactId');
//        if(contactId) {
//            this.$["course_contact_id"].value = contactId;
//        }

        /*core.browser.event.attach(this.$["course_have_account"], 'onchange', function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement;

            if (target.value === "No") {
                self.$["axcelerate_new_user"].style.display = "inherit";
                self.$["axcelerate_current_user"].style.display = "none";
            } else if(target.value === "Yes") {
                self.$["axcelerate_current_user"].style.display = "inherit";
                self.$["axcelerate_new_user"].style.display = "none";
            }
        });*/

        core.browser.event.attach(this.$["course_datepicker_table"], 'onclick', function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement,
                p;

            if(target.className === "course") {
                self.$["course_date"].value = target.getAttribute('data-start_day') + " " + e.target.getAttribute('data-start_time');
                self.$["course_title"].value = target.getAttribute('data-title');
                self.$["course_id"].value = target.getAttribute('data-course_id');
                self.$["course_instance_id"].value = target.getAttribute('data-course_instance_id');
                self.$["course_type"].value = target.getAttribute('data-type');

                p = {
                    ID: e.target.getAttribute('data-course_id'),
                    type: e.target.getAttribute('data-type'),
                    dialog: 'axcelerate',
                    act: 'get_course_details'
                };

                self.ajaxProxy(p, function(res) {
                    if(res.COST) {
                        self.$["course_cost1"].innerHTML = res.COST;
//                        self.$["course_cost2"].innerHTML = res.COST;
                        self.$["course_amount"].value = res.COST;
                    } else {
                        self.showMessage('error', 'aXcelerate error, refresh the page');
                    }
                });
            }

            self.onDateBlur();
        });

        core.browser.event.attach(this.$["course_date"], 'onclick', function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement,
                prop, i,
                p = {
                    dialog: 'axcelerate',
                    act: 'get_course_details'
                },
                courses = self.courseDates,
                len = courses.length;

            if(!target.value) return false;

            for(i = 0; i < len; i += 1) {
                for(prop in courses[i]) {
                    if(prop === 'start' && courses[i][prop] === target.value) {
                        self.$["course_time"].value = target.value;
                        self.$["course_title"].value = courses[i].title;
                        self.$["course_id"].value = courses[i].courseID;
                        self.$["course_instance_id"].value = courses[i].courseInstanceID;
                        self.$["course_type"].value = courses[i].type;
                        p['ID'] = courses[i].courseInstanceID;
                        p['type'] = courses[i].type;
                    }
                }
            }
            self.ajaxProxy(p, function(res) {
                if (res.COST) {
                    self.showElement('course_cost');
                    self.$["course_cost1"].innerHTML = '$' + res.COST + ' inc GST. ';
//                        self.$["course_cost2"].innerHTML = res.COST;
                    self.$["course_amount"].value = res.COST;
                    self.$["course_participants"].innerHTML = 'Participant vacancy: ' + res.PARTICIPANTVACANCY;
                } else {
                    self.showMessage('error', 'aXcelerate error, refresh the page');
                }
            });
        });
        this.setTitle(this.profile["title"]);
    },

    generateYears: function() {
        var year = new Date().getFullYear(), i = 10, option;

        while(i--) {
            option = document.createElement('option');
            option.appendChild(document.createTextNode(year));
            this.$["payment_exp_year"].appendChild(option);
            year += 1;
        }
    },

    showSection: function(name) {
        if(this.active_section) {
            this.hideElement("axcelerate_" + this.active_section);
        }
        if(!this.$["axcelerate_" + name]) {
            this.displayTpl(this.$["content"], "axcelerate_" + name);
        }
        this.showElement("axcelerate_" + name);
        this.active_section = name;
    },

    hideActiveSection: function() {
        this.hideElement("axcelerate_" + this.active_section);
        this.active_section = false;
    },

    showMessage: function(mode, text) {
        this.showElement("msg");
        this.$["msg"].className = "message_" + mode;
        this.$["msg"].innerHTML = text;
    },

    /*onDateFocus: function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement,
            x = target.offsetLeft,
            y = target.offsetTop + target.offsetHeight,
            datepicker = this.$["course_datepicker"],
            self = this;

        with(datepicker.style) {
            display = "block";
            position = "absolute";
            left = x + "px";
            top = y + "px";
            boxShadow = "0 0 3px rgba(0,0,0,.2)";
            mozBoxShadow = "0 0 3px rgba(0,0,0,.2)";
        }

        this.setDatepicker();
    },*/

    setDates: function(dates) {
        var select = this.$["course_date"],
            result, i, len, option;

        select.innerHTML = '';
        if(dates.length) {
            if(dates.length === 0) {
                result = document.createElement('option');
                result.appendChild(document.createTextNode('No courses.'));
            } else {
                result = document.createDocumentFragment();
                option = document.createElement('option');
                option.appendChild(document.createTextNode('Select date'));
                option.value = '';
                result.appendChild(option);
                for(i = 0, len = dates.length; i < len; i += 1) {
                    option = document.createElement('option');
                    option.appendChild(document.createTextNode(dates[i].start));
                    result.appendChild(option);
                }
            }
        } else {
            result = document.createElement('option');
            result.appendChild(document.createTextNode('No courses'));
        }
        select.appendChild(result);
    },

    onDateBlur: function() {
        this.$["course_datepicker"].style.display = "none";
    },

    setDatepicker: function() {
        if(!this.courseDates) return false;
        var datepicker = this.$["course_datepicker"], hint,
            table = this.$["course_datepicker_table"],
            date = new Date(),
            month = date.getMonth(),
            monthNow = month,
            year = date.getFullYear(),
            day = date.getDate(),
            dateStr = year + "-" + ((month + 1 + "").length === 1 ? ("0" + (month + 1)) : (month + 1)),
            data = this.parseCourse(this.courseDates),
            back = this.$["course_datepicker_back"],
            next = this.$["course_datepicker_next"],
            self = this;

        //core.browser.event.attach - for events
        this.createTable(table, data[dateStr], year, month, day);

        core.browser.event.attach(back, 'onclick', function() {
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
            dateStr = year + "-" + ((month + 1 + "").length === 1 ? ("0" + (month + 1)) : (month + 1));
            self.createTable(table, data[dateStr], year, month, monthNow === month ? day : null);
        });

        core.browser.event.attach(next, 'onclick', function() {
            if (month === 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
            dateStr = year + "-" + ((month + 1 + "").length === 1 ? ("0" + (month + 1)) : (month + 1));
            self.createTable(table, data[dateStr], year, month, monthNow === month ? day : null);
        });

        core.browser.event.attach(datepicker, 'onmouseover', function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement,
                x, y;


            if(target.className === "course") {
                x = target.parentNode.offsetLeft + target.offsetLeft + target.offsetWidth + 15;
                y = target.parentNode.offsetTop + target.offsetTop + target.offsetHeight - 15;

                hint = document.createElement('div');
                hint.className = 'hint';
                hint.innerHTML = "<ul>" +
                    "<li>" + target.getAttribute('data-title') + "</li>" +
                    "<li>Start: " + target.getAttribute('data-start_day')+ " " + target.getAttribute('data-start_time') + "</li>" +
                    "<li>End: " + target.getAttribute('data-end_day')+ " " + target.getAttribute('data-end_time') + "</li>" +
                    "<li>Location: " + target.getAttribute('data-location') + "</li>" +
                    "<li>Type: " + target.getAttribute('data-type') + "</li>" +
                "</ul>";

                hint.style.left = x + "px";
                hint.style.top = y + "px";

                datepicker.appendChild(hint);

                return false;
            } else {
                return false;
            }
        });

        core.browser.event.attach(datepicker, 'onmouseout', function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement;

            if(target.className === "course") {
                datepicker.removeChild(hint);
            }
            return false;
        });
    },

    createTable: function(table, data, year, month, dayNow) {
        var day = 1, val = 1,
            firstDay, daysInMonth, months, date,
            rows, empty = true,
            childs, td, tr, span, dayVal, i, j, k, len, course,
            dateString = year + "-" + ((month + 1 + "").length === 1 ? ("0" + (month + 1)) : (month + 1)) + "-",
            dateStringNow, longEventFirst = true;

        date = new Date(year, month, day);
        firstDay = date.getDay();
        daysInMonth = 33 - new Date(year, month, 33).getDate();
        rows = Math.ceil((daysInMonth + (firstDay-1))/7);

        months = ["January","February","March","April","May","June","July","August","September"
            ,"October","November","December"];

        childs = table.childNodes;
        while(childs.length) {
            table.removeChild(childs[0]);
        }
        for (i=0; i<rows; i++) {
            tr = document.createElement("tr");

            for (j=0; j<=6; j++) {
                td = document.createElement("td");
                if ((!empty || j === firstDay) && val <= daysInMonth) {
                    span = document.createElement('span');
                    dayVal = document.createTextNode(val);
                    span.appendChild(dayVal);
                    if(val === dayNow) {
                        span.style.color = "rgb(255,0,0)";
                    }
                    td.appendChild(span);

                    dateStringNow = dateString + ((val + "").length === 1 ? ("0" + val) : val);
                    if(data && data[dateStringNow]) {
                        for(k = 0, len = data[dateStringNow].length; k<len; k += 1) {
                            course = document.createElement('span');
                            course.innerHTML = data[dateStringNow][k].title.length > 10
                                    ? data[dateStringNow][k].title.slice(0,10) + ".."
                                    : data[dateStringNow][k].title;
                            course.className = "course";
                            course.setAttribute('data-title', data[dateStringNow][k].title);
                            course.setAttribute('data-course_id', data[dateStringNow][k].courseId);
                            course.setAttribute('data-course_instance_id', data[dateStringNow][k].courseInstanceId);
                            course.setAttribute('data-start_day', data[dateStringNow][k].startDate);
                            course.setAttribute('data-start_time', data[dateStringNow][k].startTime);
                            course.setAttribute('data-end_day', data[dateStringNow][k].endDate);
                            course.setAttribute('data-end_time', data[dateStringNow][k].endTime);
                            course.setAttribute('data-location', data[dateStringNow][k].location);
                            course.setAttribute('data-type', data[dateStringNow][k].type);
                            course.className = 'course';
                            if(data[dateStringNow][k].longEvent) {
                                if(longEventFirst) {
                                    longEventFirst = false;
                                } else {
                                    course.style.color = "rgba(0,0,0,0)";
                                }
                            }
                            td.appendChild(course);
                        }
                    }

                    val++;
                    empty = false;
                }
                td.className = 'date-ceil';
                td.setAttribute('valign', 'top');
                td.setAttribute('data-val', val - 1);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        var dateStr = this.$["course_datepicker_date"];

        dateStr.innerHTML = months[month] +', ' + year;
    },

    cacheCourse: undefined,

    parseCourse: function(data) {
        if(this.cacheCourse) {
            return this.cacheCourse;
        }

        var len = data.length, i,
            result = {},
            current, result_current,
            start, end, res_date,
            temp_obj, date_diff, date,
            year, month, day,
            endYear, endMonth, endDay, daysInMonth;

        for(i = 0; i < len; i += 1) {
            current = data[i];
            start = current.start.split(' ');
            end = current.end.split(' ');
            res_date = start[0].slice(0,7);
            if(!result[res_date]) {
                result[res_date] = {};
            }
            result_current = result[res_date];

            if(!result_current[start[0]]) {
                result_current[start[0]] = [];
            }

            temp_obj = {
                title: current.title,
                startDate: start[0],
                startTime: start[1].slice(0,5),
                allDay: current.allDay,
                type: current.type,
                location: current.location,
                courseInstanceId: current.courseInstanceID,
                courseId: current.courseID,
                endDate: end[0],
                endTime: end[1].slice(0,5)
            };

            result_current[start[0]].push(temp_obj);

            date_diff = +end[0].slice(8) - +start[0].slice(8);
            if(date_diff !== 0) {
                year = +start[0].slice(0, 4);
                month = +start[0].slice(5, 7);
                day = +start[0].slice(8);
                endYear = +end[0].slice(0, 4);
                endMonth = +end[0].slice(5, 7);
                endDay = +end[0].slice(8);

                if(date_diff < 0) {
                    daysInMonth = 33 - new Date(year, month - 1, 33).getDate();
                    date_diff = endDay + daysInMonth - day + 1; //1 need to while loop
                }

                while(date_diff -= 1) {
                    day += 1;
                    daysInMonth = 33 - new Date(year, month - 1, 33).getDate();

                    if(day > daysInMonth) {
                        day = 1;
                        month += 1;

                        if(month > 12) {
                            month = 1;
                            year += 1;
                        }
                    }

                    res_date = year + "-" + ((month + "").length === 1 ? "0" + month : month);

                    if(!result[res_date]) {
                        result[res_date] = {};
                    }

                    result_current = result[res_date];

                    date = year + "-" + ((month + "").length === 1 ? "0" + month : month) + "-" + ((day + "").length === 1 ? "0" + day : day);
                    if(!result_current[date]) {
                        result_current[date] = [];
                    }
                    temp_obj.longEvent = true;
                    result_current[date].unshift(temp_obj);
                }
            }
        }
        this.cacheCourse = result;
        return result;
    },

    courseDates: undefined,

    getCourseDates: function() {
        if(this.courseDates) {
            return this.courseDates;
        }

        var p = {
            act: 'get_calendar',
            title: this.profile['ax_title'],
            location: this.profile['ax_location']
        };

        this.ajaxProxy(p, this.setCourseDate);
    },

    setCourseDate: function(data) {
        if(Object.prototype.toString.call(data) === "[object Array]") {
            if(data.length > 0) {
                this.courseDates = data;
            }
            this.setDates(data);
        }
    },

    onNewUserRegisterClick: function() {
        var p,
            firstName = this.$["course_first_name"].value.trim(),
            lastName = this.$["course_last_name"].value.trim(),
            email = this.$["course_contact_email"].value.trim();

        p = {
            dialog: "axcelerate",
            act: "register_new_user",
            date: this.$["course_date"].value.trim(),
            title: this.$["course_title"].value.trim(),
            first_name: firstName,
            last_name: lastName,
            gender: this.$["course_gender"].value,
            street: this.$["course_address_street"].value.trim(),
            line2: this.$["course_address_line2"].value.trim(),
            town: this.$["course_address_town"].value.trim(),
            state: this.$["course_address_state"].value.trim(),
            post_code: this.$["course_address_post_code"].value.trim(),
            country: this.$["course_address_country"].value.trim(),
            phone: this.$["course_contact_phone"].value.trim(),
            mobile: this.$["course_contact_mobile"].value.trim(),
            email: email,
            instanceID: this.$["course_instance_id"].value.trim(),
            type: this.$["course_type"].value.trim()
        };

        if(p.first_name === '') {
            this.showMessage("error", "First name can not be empty");
            return false;
        } else if(p.last_name === '') {
            this.showMessage("error", "Last name can not be empty");
            return false;
        } else if(p.email === '') {
            this.showMessage("error", "Email can not be empty");
            return false;
        } else if(p.instanceID === '') {
            this.showMessage('error', 'Select the course date');
            return false;
        } else if(p.type === '') {
            this.showMessage('error', 'Select the course date');
            return false;
        }
        
        this.hideElement("msg");
        this.$["payment_submit"].disabled = true;
        this.showElement('course_registration_wait');
        this.ajaxProxy(p, this.onCourseRegisterResponse);
    },

    onCurrentUserRegisterClick: function() {
        var p,
            contactId = this.$["course_contact_id"].value.trim(),
            instanceId = this.$["course_instance_id"].value.trim(),
            type = this.$["course_type"].value.trim();

        if(contactId === '') {
            this.showMessage('error', 'Contact Id can not be empty');
            return false;
        } else if(instanceId === '') {
            this.showMessage('error', 'Select the course date');
            return false;
        } else if(type === '') {
            this.showMessage('error', 'Select the course date');
            return false;
        }

        p = {
            dialog: "axcelerate",
            act: "register_current_user",
            contactID: contactId,
            instanceID: instanceId,
            type: type
        };

        this.hideElement("msg");
        this.ajaxProxy(p, this.onCourseRegisterResponse);
    },

    onCourseRegisterResponse: function(res) {
        if(res.LEARNERID !== undefined && res.CONTACTID) {
            this.$["course_learner_id"].innerHTML = "";
            this.$["course_learner_id"].appendChild(document.createTextNode((res.LEARNERID + "")));
            this.contactId = res.CONTACTID;
            document.cookie = 'contactId=' + this.contactId;
            this.onPayment();
        } else {
            this.showMessage('error', 'Error. Please try again');
            this.hideElement('course_registration_wait');
            this.$["payment_submit"].disabled = false;
        }
    },

    showPaymentForm: function(e) {
        this.$["axcelerate_payment"].style.display = "inherit";
    },

    onPaymentClick: function() {
        this.onNewUserRegisterClick();
    },

    onPayment: function() {
        var p = {
            dialog: 'axcelerate',
            act: 'course_payment',
            amount: this.$["course_amount"].value.trim(),
            instanceId: this.$["course_instance_id"].value.trim(),
            type: /^w|p|el$/.test(this.$["course_type"].value.trim()) ? this.$["course_type"].value.trim() : 'w',
            contactId: this.contactId,
            cardholder: this.$["payment_cardholder"].value.trim(),
            card_number: this.$["payment_card_number"].value.trim(),
            exp_month: this.$["payment_exp_month"].value.trim(),
            exp_year: this.$["payment_exp_year"].value.trim(),
            cvv: this.$["payment_cvv"].value.trim()
        };

        if(p.card_number === '' || p.card_number.length !== 16) {
            this.showMessage('error', 'Uncorrect card number');
            this.$["payment_submit"].disabled = false;
            this.hideElement('course_registration_wait');
            return false;
        } else if(p.cardholder === '') {
            this.showMessage('error', 'Uncorrect name on card');
            this.$["payment_submit"].disabled = false;
            this.hideElement('course_registration_wait');
            return false;
        } else if(p.cvv === '' || p.cvv.length !== 3) {
            this.showMessage('error', 'Uncorrect cvv number');
            this.$["payment_submit"].disabled = false;
            this.hideElement('course_registration_wait');
            return false;
        } else if(!p.amount || !p.instanceId || !p.contactId) {
            this.showMessage('error', 'Choose course first');
            this.$["payment_submit"].disabled = false;
            this.hideElement('course_registration_wait');
            return false;
        }

        this.hideElement("msg");
        
        this.ajaxProxy(p, this.onPaymentResponse);
    },

    onPaymentResponse: function(res) {
        
        this.hideElement('course_registration_wait');
        if(res.ERROR) {
            this.showMessage('error', res.DETAILS);
            this.$["payment_submit"].disabled = false;
        } else {
            this.showElement('course_succefffull_reg');
        }
    },

    onCardNumberChange: function(e) {
        var e = e || window.e,
            target = e.target || e.srcElement;

        if(target.value.length === 16) {
            with(target.style) {
                boxShadow = "inset 0 0 7px rgba(0,255,0,.3)";
                mozBoxShadow = "inset 0 0 7px rgba(0,255,0,.3)";
            }
        } else {
            with(target.style) {
                boxShadow = "inset 0 0 7px rgba(255,0,0,.3)";
                mozBoxShadow = "inset 0 0 7px rgba(255,0,0,.3)";
            }
        }
    },

    getCookie: function(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },

    ajaxProxy: function(o, callback) {
        o['dialog'] = 'axcelerate';
        o['api_token'] = this.profile['api_token'];
        o['ws_token'] = this.profile['ws_token'];

        core.transport.send("/controller.php", o, callback, "post", this);
    }
};

core.apps.axcelerate.extendPrototype(core.components.html_component);
core.apps.axcelerate.extendPrototype(core.components.desktop_app);