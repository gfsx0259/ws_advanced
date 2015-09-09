core.apps.file_download = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        popup: true,
        caption: false,
        file: null,
        effect: "fade",
        image: null,
        description: "",
        chk_image : true
    }
};

core.apps.file_download.prototype = {

    onOpen: function() {
        this.setTitle(this.profile["title"]);
       
    },
    buildContent: function(el) {
        this.displayTpl(this.$["content"], "file_download_content");
        this.refreshContent();
    },
    
    refreshContent: function(){
        if (this.profile["chk_image"] && this.profile["image"] != null){
            this.$["v_image_tr"].style.display = "";
            this.$["v_image"].src = core.common.getUserFile(this.profile["image"]);
        }else{
            this.hideElement("v_image_tr");
        }       

        this.$["v_description"].innerHTML = this.profile["description"];
        if (this.profile["caption"]){
            this.$["v_desc_tr"].style.display = "";
        }else{
            this.hideElement("v_desc_tr");
        }
        if(this.profile["file"]) {
            this.sendRequest({ act: "get_file_info", fname: this.profile["file"]});
            this.showElement("btn_download");
        } else {
            this.hideElement("btn_download");
        }
    },

    onDownloadClick: function() {
        desktop.loadURL(core.common.getUserFile(this.profile["file"]));
    },

    sendRequest: function(p) {
        this.$["v_size"].innerHTML = "Loading...";
        this.$["v_name"].innerHTML = "Loading...";
        this.isLoading = true;
        p.dialog = "files_manager";
        core.transport.send("/controller.php", p, this.onServerResponce.bind(this));
    },


    onServerResponce: function(file) {
        switch(file.status) {
            case "error":
                this.hideElement("file_info");
                this.showElement("error_msg");
                this.$["error_msg"].innerHTML = "File <strong>" + this.profile["file"] + "</strong> not found";
                break;

            case "info":
                this.hideElement("error_msg");
                this.showElement("file_info");
                this.$["v_size"].innerHTML = core.utils.fsystem.formatSize(file.size);
                this.$["v_name"].innerHTML = file.name;
                if(file.size_string == ""){
                    this.hideElement("v_image_size_tr");
                } else {
                    this.$["v_image_size_tr"].style.display = "";
                    this.$["v_image_size"].innerHTML = file.size_string;
                }
                break;
        }
    },

    popupImages: function() {
        if(this.profile["popup"]){
            desktop.openImageBox([this.profile["image"]]);
        }
    }
    
};
core.apps.file_download.extendPrototype(core.components.html_component);
core.apps.file_download.extendPrototype(core.components.desktop_app);