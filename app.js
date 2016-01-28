/*global UiModal*/
(function($, global) {
    "use strict";

    // img
    var modal01 = uiModal();

    // iframe
    var modal02 = uiModal({
      root: ".js-onModal-iframe",
      type: "iframe"
    });

    // youtube
    var modal02 = uiModal({
      root: ".js-onModal-youtube"
    });

    // div
    var modaldiv = uiModal({
      root: ".js-onModal-div"
    });
    var modaldivclone = uiModal({
      root: ".js-onModal-div-clone",
      clone: true
    });

})(jQuery, (this || 0).self || global);
