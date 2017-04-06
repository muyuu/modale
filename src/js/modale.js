(function(definition){
    "use strict";

    let moduleName = "uiModale";
    let root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object") {
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }

})(function(root, $){
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    const trimDot = s => s.replace(".", "");
    const isUndefined = obj => obj === void 0;
    const isPng = str => getExtension(str) === "png";
    const isGif = str => getExtension(str) === "gif";
    const isJpg = str => getExtension(str) === "jpg";
    const isDiv = str => str.indexOf("#") === 0;
    const isYoutube = (str) => str.indexOf("youtube.com") !== -1;
    const getExtension = fileName =>{
        let ret;
        if (!fileName) return false;

        const fileTypes = fileName.split(".");
        const len = fileTypes.length;
        if (len === 0) return false;

        ret = fileTypes[len - 1];
        return ret;
    };


    // -------------------------------------------------------
    // module
    // -------------------------------------------------------

    /**
     * module factory
     * this module is dependent on jQuery
     * @prop {string} rootElement default root element class or id
     * @prop {array} instance
     * @namespace
     */
    function factory(param){
        let rootElement = ".js-modale";
        let opt = !isUndefined(param) ? param : {};

        let $self;
        if (isUndefined(opt.root)) $self = $(rootElement);
        if (!isUndefined(opt.root)) $self = opt.root instanceof jQuery ? param.root : $(param.root);

        let length = $self.length;
        let result = [];
        for (let i = 0; i < length; i++) {
            result[i] = new Module(opt, $self[i]);
        }
        return result;
    }


    /**
     * constructor
     * @sourceType {Function}
     */
    function Module(param, moduleRoot){

        this.target = null;
        this.sourceType = null;
        this.extension = null;
        this.$root = $(moduleRoot);

        this.opt = {
            root   : moduleRoot,
            width  : isUndefined(param.width) ? 800 : param.width,
            height : isUndefined(param.height) ? 600 : param.height,
            padding: isUndefined(param.padding) ? 40 : param.padding,

            type   : isUndefined(param.type) ? "img" : param.type,
            closeEl: isUndefined(param.closeEl) ? ".js-modaleClose" : param.closeEl,

            startOpen: isUndefined(param.startOpen) ? false : param.startOpen,

            clone: isUndefined(param.clone) ? false : param.clone,
            btn  : isUndefined(param.btn) ? false : param.btn,

            btnStr    : isUndefined(param.btnStr) ? "close" : param.btnStr,
            btnPadding: isUndefined(param.btnPadding) ? 20 : param.btnPadding,

            // callback
            onOpen : isUndefined(param.onOpen) ? null : param.onOpen,
            onClose: isUndefined(param.onClose) ? null : param.onClose
        };

        // state
        this.isOpen = false;


        this.$root.on("click", (e)=>{
            e.preventDefault();

            this.init();
            return false;
        });

        if (this.opt.startOpen) this.init();
    }


    Module.prototype.init = function(){
        this.isOpen = true;
        this.setTarget();
        this.setType();
        this.drawModalElement();
        this.calcSize(this.open);
        return this;
    };


    Module.prototype.setTarget = function(){

        this.target = this.$root.attr("href");
        return this;
    };


    Module.prototype.setType = function(){

        if (this.target.indexOf("youtube.com") !== -1) {
            this.sourceType = "youtube";
            this.setYoutubeId();
        }

        if (isPng(this.target) || isGif(this.target) || isJpg(this.target)) {
            this.sourceType = "img";
        }

        if (isDiv(this.target)) {
            this.sourceType = "div";
        }

        if (this.opt.type === "iframe") {
            this.sourceType = "iframe";
        }

        return this;
    };


    Module.prototype.setYoutubeId = function(){
        this.target = this.getYoutubeId();
        return this;
    };


    Module.prototype.getYoutubeId = function(){
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        let match = this.target.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            //error
        }
    };


    Module.prototype.drawModalElement = function(){
        this.drawOverlay();
        this.drawModal();
        this.drawModalBody();
        this.drawModalContent();

        if (this.opt.btn) {
            this.drawModalBtn();
        }

        this.setModalElements();
        this.setModalCloseElements();
        return this;
    };


    Module.prototype.drawOverlay = function(){

        $("body").append("<div id='js-modaleOverlay' class='ui-modal__overlay'>");
        this.$overlay = $("#js-modale-overlay");
        return this;
    };


    Module.prototype.drawModal = function(){

        $("body").append("<div id='js-modale' class='ui-modal'>");
        this.$modal = $("#js-modale");

        return this;
    };


    Module.prototype.drawModalBody = function(){

        this.$modal.append("<div id='js-modaleBody' class='ui-modal__body'>");
        this.$modalBody = $("#js-modaleBody");

        return this;
    };


    Module.prototype.drawModalContent = function(){

        let contentStr = "<img src='" + this.target + "' >";

        if (this.sourceType === "youtube") {
            contentStr = "<iframe src='https://www.youtube.com/embed/" + this.target + "?enablejsapi=1&amp;rel=0&amp;controls=0&amp;showinfo=0' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }
        if (this.sourceType === "iframe") {
            contentStr = "<iframe src='" + this.target + "' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }

        if (this.sourceType === "div") {
            if (this.opt.clone) {
                contentStr = $(this.target).clone(true, true);
            } else {
                contentStr = $(this.target);
            }
        }

        this.$modalBody.append(contentStr);
        return this;
    };


    Module.prototype.drawModalBtn = function(){
        let btnStr = `<a id='js-modaleClose' class='ui-modal__close' href='#'>${this.opt.btnStr}</a>`;
        $("body").append(btnStr);
        this.$modalBtn = $("#js-modaleClose");
        return this;
    };


    Module.prototype.setModalElements = function(){
        this.$modalElements = $("#js-modaleOverlay, #js-modale, #js-modaleClose");
        return this;
    };


    Module.prototype.setModalCloseElements = function(){
        this.$modalCloseElements = $(`#js-modaleOverlay, ${this.opt.closeEl}`);
        return this;
    };


    Module.prototype.calcSize = function(func){

        if (this.sourceType === "img") {

            let img = new Image();
            img.src = this.target;

            img.onload = ()=>{
                this.setSize(img.width, img.height);

                // callback function
                if (typeof func !== "function") return false;
                func.apply(this);
            };
        } else {

            this.setSize(this.opt.width, this.opt.height);

            // callback function
            if (typeof func !== "function") return false;
            func.apply(this);
        }
    };


    Module.prototype.adjustSize = function(width, height){
        const offset = this.opt.padding;
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();

        if(windowWidth <= width) {
            width = windowWidth - offset;
        }

        if(windowHeight <= height) {
            height = windowHeight - offset;
        }
        return {width: width, heigth: height};
    };


    Module.prototype.setSize = function(width, height){
        const obj = this.adjustSize(width, height);
        let calcedWidth = obj.width;
        let calcedHeight = obj.height;

        // fixed scroll
        this.currentScrollY = $( window ).scrollTop();
        $("body, html").css({
            top: -1 * this.currentScrollY
        });

        this.$modal.css({
            width : calcedWidth,
            height: calcedHeight
        });

        if (this.opt.btn) {
            this.$modalBtn.css({
                "margin-top": (calcedHeight / 2) + this.opt.btnPadding
            });
        }

        if (this.sourceType === "youtube" || this.sourceType === "iframe") {
            this.$modalBody.find("iframe").css({
                width : calcedWidth,
                height: calcedHeight
            });
        }

        return this;
    };

    Module.prototype.reCalcSize = function(){
        const contentWidth = this.$modalBody.width();
        const contentHeight = this.$modalBody.height();
        const modalWidth = this.$modal.width();
        const modalHeight = this.$modal.height();
        let width, height;

        const isSmallWidthContent = ()=> modalWidth > contentWidth;
        const isSmallHeightContent = ()=> modalHeight > contentHeight;
        const notNeedAnimate = ()=> !isSmallWidthContent() && !isSmallHeightContent();

        if(isSmallWidthContent()) {
            width = contentWidth;
        }

        if(isSmallHeightContent()) {
            height = contentHeight;
        }

        if (notNeedAnimate()) return this;

        this.$modal.animate({
            width,
            height,
        }, 300, "swing");

        return this;
    };


    /**
     * open body panel
     * @returns {object} this
     */
    Module.prototype.open = function(){

        $("body").addClass("js-noScroll");

        this.$modalElements
            .fadeIn()
            .promise()
            .done(()=>{
                this.setCloseEvent();
                this.reCalcSize();

                if (typeof this.opt.onOpen !== "function") return;
                this.opt.onOpen();
            });

        return this;
    };


    Module.prototype.close = function(){

        if(!this.isOpen) return this;

        this.$modalElements
            .fadeOut()
            .promise()
            .done(()=>{

                let $body = $("body");

                if (this.sourceType === "div" && !this.opt.clone) {
                    $body.append($(this.target));
                }

                this.$modalElements.remove();
                $body.removeClass("js-noScroll");

                // fixed scroll
                $("body, html").attr({style: ""})
                    .prop( { scrollTop: this.currentScrollY } );

                if (typeof this.opt.onClose !== "function") return;
                this.opt.onClose();
            });

        return this;
    };


    Module.prototype.setCloseEvent = function(){

        this.$modalCloseElements.on("click", (e)=>{
            e.preventDefault();
            this.close();
        });
    };

    return factory;
});
