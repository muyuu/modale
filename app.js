(function($, global){
    "use strict";

    // img
    let modal01 = uiModale();

    // iframe
    var modal02 = uiModale({
        root   : ".js-modale-iframe",
        type   : "iframe",
        closeEl: "#js-modaleClose",
        btn    : true,
        btnStr : "閉じる"
    });

    // youtube
    var modal02 = uiModale({
        root: ".js-modale-youtube"
    });

    // div
    let modaldiv = uiModale({
        root  : ".js-modale-div",
        onOpen: function(){
            console.log("open");
        },
        onClose: function(){
            console.log("close");
        }
    });
    let modaldivclone = uiModale({
        root : ".js-modale-div-clone",
        clone: true
    });

})(jQuery, (this || 0).self || global);
