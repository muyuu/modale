"use strict";

(function (definition) {
    "use strict";

    var moduleName = "uiModal";

    var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global;

    if (typeof exports === "object") {
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }
})(function (root, $) {
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------

    /**
     * trim string "."
     * @param  {string} s text
     * @return {string} cutted "." string
     */
    var trimDot = function trimDot(s) {
        return s.replace(".", "");
    };

    /**
     * judge undefined
     * @param  {any} obj anything
     * @return {boolean}
     */
    var isUndefined = function isUndefined(obj) {
        return obj === void 0;
    };

    var isPng = function isPng(str) {
        return getExtension(str) === "png";
    };
    var isGif = function isGif(str) {
        return getExtension(str) === "gif";
    };
    var isJpg = function isJpg(str) {
        return getExtension(str) === "jpg";
    };
    var isDiv = function isDiv(str) {
        return str.indexOf("#") === 0;
    };

    var getExtension = function getExtension(fileName) {
        var ret;
        if (!fileName) return false;

        var fileTypes = fileName.split(".");
        var len = fileTypes.length;
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
    function factory(param) {
        var rootElement = ".js-onModal";
        var opt = !isUndefined(param) ? param : {};

        var $self;
        if (isUndefined(opt.root)) $self = $(rootElement);
        if (!isUndefined(opt.root)) $self = opt.root instanceof jQuery ? param.root : $(param.root);

        return $self.map(function (key, val) {
            new Module(opt, val);
        });
    }

    /**
     * constructor
     * @type {Function}
     */
    function Module(param, moduleRoot) {
        var self = this;

        self.target = null;
        self.extension = null;
        self.$root = $(moduleRoot);

        self.opt = {
            root: self.defaultRootElement,
            width: isUndefined(param.width) ? 40 : param.width,
            height: isUndefined(param.height) ? 40 : param.height,
            padding: isUndefined(param.padding) ? 40 : param.padding
        };

        self.$root.on("click", { module: self }, self.openHandler);
    }

    Module.prototype.openHandler = function (e) {
        e.preventDefault();
        var self = e.data.module;
        var target = this;
        self.init(target, self);
        return self;
    };

    Module.prototype.init = function (target, self) {
        self.setSrc(target);
        self.drawModalElement();
        self.calcSize(self.open);
        return self;
    };

    Module.prototype.setSrc = function (link) {
        this.target = $(link).attr("href");

        if (this.target.indexOf("youtube.com") !== -1) {
            this.type = "youtube";
        }
        if (isPng(this.target) || isGif(this.target) || isJpg(this.target)) {
            this.type = "img";
        }
        if (isDiv(this.target)) {
            this.type = "div";
        }
        return this;
    };

    Module.prototype.drawModalElement = function () {
        this.drawOverlay();
        this.drawModal();
        this.drawModalBody();
        this.drawModalContent();
        this.drawModalBtn();
        this.setModalElements();
        this.setModalCloseElements();
        return this;
    };

    Module.prototype.drawOverlay = function () {
        $("body").append("<div id='js-modalOverlay' class='ui-modalOverlay'>");
        this.$overlay = $("#js-modal-overlay");
        return this;
    };

    Module.prototype.drawModal = function () {
        $("body").append("<div id='js-modal' class='ui-modal'>");
        this.$modal = $("#js-modal");
        return this;
    };

    Module.prototype.drawModalBody = function () {
        this.$modal.append("<div id='js-modal__body' class='ui-modal__body'>");
        this.$modalBody = $("#js-modal__body");
        return this;
    };

    Module.prototype.drawModalContent = function () {
        var contentStr = "<img src='" + this.target + "' >";
        if (this.type === "youtube") {
            contentStr = "<iframe src='" + this.target + "' width='1000' height='563' frameborder='0' allowfullscreen></iframe>";
        }
        if (this.type === "div") {
            contentStr = $(this.target);
        }
        this.$modalBody.append(contentStr);
        return this;
    };

    Module.prototype.drawModalBtn = function () {
        var btnStr = "<a id='js-modal__close' class='ui-modal__close' href='#'>close</a>";
        this.$modalBody.append(btnStr);
        return this;
    };

    Module.prototype.setModalElements = function () {
        this.$modalElements = $("#js-modalOverlay, #js-modal");
        return this;
    };

    Module.prototype.setModalCloseElements = function () {
        this.$modalCloseElements = $("#js-modalOverlay, #js-modal__close");
        return this;
    };

    Module.prototype.calcSize = function (func) {
        var self = this;

        if (self.type === "img") {
            var img = new Image();
            img.src = this.target;

            img.onload = function () {
                self.setSize(img.width, img.height);

                // callback function
                if (typeof func !== "function") return false;
                func.apply(self);
            };
        } else {
            self.setSize(1000, 563);
            // callback function
            if (typeof func !== "function") return false;
            func.apply(self);
        }
    };

    Module.prototype.setSize = function (width, height) {
        this.$modal.css({
            width: width,
            height: height
        });
        return this;
    };

    /**
    * open body panel
    * @returns {boolean}
    */
    Module.prototype.open = function () {

        var self = this;

        $("body").addClass("js-noScroll");

        self.$modalElements.fadeIn(function () {
            self.setCloseEvent();
        });

        return this;
    };

    Module.prototype.close = function (e) {
        var self = e.data.module;
        self.$modalElements.fadeOut(function () {
            self.$modalElements.remove();
            $("body").removeClass("js-noScroll");
        });
        return this;
    };

    Module.prototype.setCloseEvent = function () {
        var self = this;
        self.$modalCloseElements.on("click", { module: self }, self.close);
    };

    return factory;
});