(function(definition){
    "use strict";

    var moduleName = "uiModal";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

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

    const trimDot = s =>{ return s.replace(".", ""); };

    const isUndefined = obj =>{ return obj === void 0; };

    const isPng = str => { return getExtension(str) === "png"; };
    const isGif = str => { return getExtension(str) === "gif"; };
    const isJpg = str => { return getExtension(str) === "jpg"; };
    const isDiv = str => { return str.indexOf("#") === 0; };
    const isYoutube = (str) => { return str.indexOf("youtube.com") !== -1; };

    const getExtension = (fileName) => {
        var ret;
        if (!fileName) return false;

        var fileTypes = fileName.split(".");
        var len = fileTypes.length;
        if (len === 0)return false;

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
        var rootElement = ".js-onModal";
        var opt = !isUndefined(param) ? param : {};

        var $self;
        if (isUndefined(opt.root)) $self = $(rootElement);
        if (!isUndefined(opt.root)) $self = opt.root instanceof jQuery ? param.root : $(param.root);

        return $self.map((key, val)=>{ new Module(opt, val); });
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(param, moduleRoot) {

        this.target = null;
        this.extension = null;
        this.$root = $(moduleRoot);

        this.opt = {
            root   : this.defaultRootElement,
            width  : isUndefined(param.width) ? 800 : param.width,
            height : isUndefined(param.height) ? 600 : param.height,
            padding: isUndefined(param.padding) ? 40 : param.padding,

            type: isUndefined(param.type) ? "img" : param.type,

            startopen: isUndefined(param.startopen) ? false : param.startopen,

            clone: isUndefined(param.clone) ? false : param.clone,
            btn: isUndefined(param.btn) ? true : param.btn
        };

        this.$root.on("click", (e)=>{
            e.preventDefault();

            this.init();
            return false;
        });

        if(this.opt.startopen) this.init();
    }


    Module.prototype.init = function() {
        console.log('init');
        this.setTarget();
        this.setType();
        this.drawModalElement();
        this.calcSize(this.open);
        return this;
    };


    Module.prototype.setTarget = function () {

        this.target = this.$root.attr("href");

        return this;
    };


    Module.prototype.setType = function(link) {

        if (this.target.indexOf("youtube.com") !== -1) {
            this.type = "youtube";
            this.setYoutubeId();
        }
        if (isPng(this.target) || isGif(this.target) || isJpg(this.target)) {
            this.type = "img";
        }
        if (isDiv(this.target)) {
            this.type = "div";
        }
        if ( this.opt.type === "iframe") {
            this.type = "iframe";
        }
        return this;
    };


    Module.prototype.setYoutubeId = function() {
        this.target = this.getYoutubeId();
    }
    Module.prototype.getYoutubeId = function() {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = this.target.match(regExp);
        if (match&&match[2].length==11){
            return match[2];
        }else{
            //error
        }
    };


    Module.prototype.drawModalElement = function() {
        this.drawOverlay();
        this.drawModal();
        this.drawModalBody();
        this.drawModalContent();

        if(this.opt.btn) {
            this.drawModalBtn();
        }

        this.setModalElements();
        this.setModalCloseElements();
        return this;
    };


    Module.prototype.drawOverlay = function() {

        $("body").append("<div id='js-modalOverlay' class='ui-modal__overlay'>");
        this.$overlay = $("#js-modal-overlay");

        return this;
    };


    Module.prototype.drawModal = function() {

        $("body").append("<div id='js-modal' class='ui-modal'>");
        this.$modal = $("#js-modal");

        return this;
    };


    Module.prototype.drawModalBody = function() {

        this.$modal.append("<div id='js-modalBody' class='ui-modal__body'>");
        this.$modalBody = $("#js-modalBody");

        return this;
    };


    Module.prototype.drawModalContent = function() {

        var contentStr = "<img src='" + this.target + "' >";

        if (this.type === "youtube"){
            contentStr = "<iframe src='https://www.youtube.com/embed/" + this.target + "?enablejsapi=1&amp;rel=0&amp;controls=0&amp;showinfo=0' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }
        if (this.type === "iframe") {
            contentStr = "<iframe src='" + this.target + "' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }

        if (this.type === "div"){
            if (this.opt.clone) {
                contentStr = $(this.target).clone(true, true);
            } else {
                contentStr = $(this.target);
            }
        }

        this.$modalBody.append(contentStr);

        return this;
    };


    Module.prototype.drawModalBtn = function() {
        var btnStr = "<a id='js-modalClose' class='ui-modal__close' href='#'>close</a>";
        this.$modalBody.append(btnStr);
        return this;
    };


    Module.prototype.setModalElements = function() {
        this.$modalElements = $("#js-modalOverlay, #js-modal");
        return this;
    };


    Module.prototype.setModalCloseElements = function() {
        this.$modalCloseElements = $("#js-modalOverlay, #js-modalClose");
        return this;
    };


    Module.prototype.calcSize = function(func) {

        if (this.type === "img"){

            var img = new Image();
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


    Module.prototype.setSize = function(width, height) {
        this.$modal.css({
            width : width,
            height: height
        });

        if (this.type === "youtube" || this.type === "iframe") {
            this.$modalBody.find('iframe').css({
                width: width,
                height: height
            });
        }

        return this;
    };


    /**
    * open body panel
    * @returns {boolean}
    */
    Module.prototype.open = function() {

        $("body").addClass("js-noScroll");

        this.$modalElements.fadeIn(()=>{
            this.setCloseEvent();
        });

        return this;
    };


    Module.prototype.close = function() {

        this.$modalElements.fadeOut(()=>{

            if (this.type === "div" && !this.opt.clone) {
                $("body").append($(this.target));
            }

            this.$modalElements.remove();
            $("body").removeClass("js-noScroll");
        });

        return this;
    };


    Module.prototype.setCloseEvent = function() {

        this.$modalCloseElements.on("click", ()=>{
            this.close();
        });
    };

    return factory;
});
