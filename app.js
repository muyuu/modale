(function($, global){
    "use strict";

    // img
    let modal01 = uiModale({
        onClickContent: function($el, $content){
            let href = $el.attr("data-link");
            $content.on("click", function(){
                location.href = href;
            });
        },
        onClose: function(){

        }
    });

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
    $(".close_modal_btn").on("click", function(){
        for (let i = 0; i < modaldiv.length; i++) {
            modaldiv[i].close();
        }
    });
    let modaldivclone = uiModale({
        root : ".js-modale-div-clone",
        clone: true
    });

})(jQuery, (this || 0).self || global);
