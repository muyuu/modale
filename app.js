(function($, global){
    "use strict";

    // img
    var modal01 = uiModale();

    // iframe
    var modal02 = uiModale({
        root: ".js-modale-iframe",
        type: "iframe"
    });

    // youtube
    var modal02 = uiModale({
        root: ".js-modale-youtube"
    });

    // div
    var modaldiv = uiModale({
        root: ".js-modale-div"
    });
    var modaldivclone = uiModale({
        root : ".js-modale-div-clone",
        clone: true
    });

})(jQuery, (this || 0).self || global);
