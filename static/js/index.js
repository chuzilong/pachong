window.onload=function(){
    var clientW=document.documentElement.clientWidth;
    var menubox=document.querySelector(".menubox");
    var links=document.querySelectorAll(".menubox a");

    var widths=0;

    for(var i=0;i<links.length;i++){
        widths+=links[i].offsetWidth
    }
    menubox.style.width=widths+"px";


    var currentLeft=0;

    touch.on(".menubox","dragstart",function (e) {
        currentLeft=parseInt(getComputedStyle(menubox,null).marginLeft)?parseInt(getComputedStyle(menubox,null).marginLeft):0
    })

    touch.on(".menubox","drag",function (e) {
        var left=(currentLeft+e.x);
        if(left>0){
            left=0;
        }
        if(left<clientW-widths){
            left=clientW-widths
        }
        menubox.style.marginLeft=left+"px";
    })
}