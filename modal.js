"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (definition) {
    "use strict";

    var moduleName = "uiModal";

    var root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" && global.global === global && global;

    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }
})(function (root, $) {
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------

    var trimDot = function trimDot(s) {
        return s.replace(".", "");
    };

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
    var isYoutube = function isYoutube(str) {
        return str.indexOf("youtube.com") !== -1;
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
        var _this = this;

        this.target = null;
        this.extension = null;
        this.$root = $(moduleRoot);

        this.opt = {
            root: this.defaultRootElement,
            width: isUndefined(param.width) ? 800 : param.width,
            height: isUndefined(param.height) ? 600 : param.height,
            padding: isUndefined(param.padding) ? 40 : param.padding,

            type: isUndefined(param.type) ? "img" : param.type,

            startopen: isUndefined(param.startopen) ? false : param.startopen,

            clone: isUndefined(param.clone) ? false : param.clone,
            btn: isUndefined(param.btn) ? true : param.btn
        };

        this.$root.on("click", function (e) {
            e.preventDefault();

            _this.init();
            return false;
        });

        if (this.opt.startopen) this.init();
    }

    Module.prototype.init = function () {
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

    Module.prototype.setType = function (link) {

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
        if (this.opt.type === "iframe") {
            this.type = "iframe";
        }
        return this;
    };

    Module.prototype.setYoutubeId = function () {
        this.target = this.getYoutubeId();
    };
    Module.prototype.getYoutubeId = function () {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = this.target.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            //error
        }
    };

    Module.prototype.drawModalElement = function () {
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

    Module.prototype.drawOverlay = function () {

        $("body").append("<div id='js-modalOverlay' class='ui-modal__overlay'>");
        this.$overlay = $("#js-modal-overlay");

        return this;
    };

    Module.prototype.drawModal = function () {

        $("body").append("<div id='js-modal' class='ui-modal'>");
        this.$modal = $("#js-modal");

        return this;
    };

    Module.prototype.drawModalBody = function () {

        this.$modal.append("<div id='js-modalBody' class='ui-modal__body'>");
        this.$modalBody = $("#js-modalBody");

        return this;
    };

    Module.prototype.drawModalContent = function () {

        var contentStr = "<img src='" + this.target + "' >";

        if (this.type === "youtube") {
            contentStr = "<iframe src='https://www.youtube.com/embed/" + this.target + "?enablejsapi=1&amp;rel=0&amp;controls=0&amp;showinfo=0' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }
        if (this.type === "iframe") {
            contentStr = "<iframe src='" + this.target + "' width='' height='' frameborder='0' allowfullscreen></iframe>";
        }

        if (this.type === "div") {
            if (this.opt.clone) {
                contentStr = $(this.target).clone(true, true);
            } else {
                contentStr = $(this.target);
            }
        }

        this.$modalBody.append(contentStr);

        return this;
    };

    Module.prototype.drawModalBtn = function () {
        var btnStr = "<a id='js-modalClose' class='ui-modal__close' href='#'>close</a>";
        this.$modalBody.append(btnStr);
        return this;
    };

    Module.prototype.setModalElements = function () {
        this.$modalElements = $("#js-modalOverlay, #js-modal");
        return this;
    };

    Module.prototype.setModalCloseElements = function () {
        this.$modalCloseElements = $("#js-modalOverlay, #js-modalClose");
        return this;
    };

    Module.prototype.calcSize = function (func) {
        var _this2 = this;

        if (this.type === "img") {

            var img = new Image();
            img.src = this.target;

            img.onload = function () {
                _this2.setSize(img.width, img.height);

                // callback function
                if (typeof func !== "function") return false;
                func.apply(_this2);
            };
        } else {

            this.setSize(this.opt.width, this.opt.height);

            // callback function
            if (typeof func !== "function") return false;
            func.apply(this);
        }
    };

    Module.prototype.setSize = function (width, height) {
        this.$modal.css({
            width: width,
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
    Module.prototype.open = function () {
        var _this3 = this;

        $("body").addClass("js-noScroll");

        this.$modalElements.fadeIn(function () {
            _this3.setCloseEvent();
        });

        return this;
    };

    Module.prototype.close = function () {
        var _this4 = this;

        this.$modalElements.fadeOut(function () {

            if (_this4.type === "div" && !_this4.opt.clone) {
                $("body").append($(_this4.target));
            }

            _this4.$modalElements.remove();
            $("body").removeClass("js-noScroll");
        });

        return this;
    };

    Module.prototype.setCloseEvent = function () {
        var _this5 = this;

        this.$modalCloseElements.on("click", function () {
            _this5.close();
        });
    };

    return factory;
});