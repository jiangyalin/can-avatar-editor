var CanvasAvatar=(function () {

    //声明变量
    var ThisConMou=false;//当前是否在选中区按下状态
    var ThisConHover=false;//当前鼠标是否在选中区元素上状态
    var ThisSizeMou=false;//当前是否在调整大小区按下状态
    var ThisSizeHover=false;//当前是否在调整大小区素上状态
    var ClaRangeTop=0;//鼠标在元素中的top位置
    var ClaRangeLeft=0;//鼠标在元素中的left位置
    var ParentTop;//移动区域所在的top位置
    var ParentLeft;//移动区域所在的left位置
    var ParenWidth;//移动区域所在的宽度
    var ParenHeight;//移动区域所在的高度
    var ThisTop;//截取区域top
    var ThisLeft;//截取区域left
    var ThisWidth=$(".box_le_mb").width()+2;//截取区域width
    var ThisHeight=$(".box_le_mb").height()+2;//截取区域height
    var image=new Image();//新建一个空的图片对象
    var imageWidth;//图片的原始宽度
    var imageHeight;//图片的原始高度

    //选择图片
    $("#input_img").change(function(){
        var file=this.files[0];//得到文件
        var reader=new FileReader();//新建空文件属性对象
        if(file!=undefined)reader.readAsDataURL(file);//传入文件
        reader.onload=function(){
            var url=reader.result;//将得到的文件转成data64编码
            image.src=url;//将input得到的url赋值给新建的图片对象
            imageWidth=image.width;//图片的原始宽度
            imageHeight=image.height;//图片的原始高度

            //图像居中
            $(".box_le_main").css({"width":"100%","height":"100%","top":"0","left":"0"});
            if(imageWidth<imageHeight){
                $(".box_le_img").addClass("my_img_hei").removeClass("my_img_wid");
            }else{
                $(".box_le_img").addClass("my_img_wid").removeClass("my_img_hei");
            }
            $(".box_le_img").attr("src",image.src);
            $(".box_le_main").width($(".j-img-back").width()).height($(".j-img-back").height())
                .css({"top":($(".box_le_ma").height()-$(".box_le_main").height())/2+"px","left":($(".box_le_ma").width()-$(".box_le_main").width())/2+"px"});
            $(".box_le_ma").css({"border-radius":"0px"});

            //重置剪切区域位置
            $(".box_le_mb").css("transform","translate(0px,0px)");
            $(".j-img-ago").css("clip","rect(0px,50px,50px,0px)");

            ThisWidth=$(".box_le_mb").width()+2;//截取区域width
            ThisHeight=$(".box_le_mb").height()+2;//截取区域height
            ParentTop=$(".box_le_main").offset().top;//移动区域所在的top位置
            ParentLeft=$(".box_le_main").offset().left;//移动区域所在的left位置
            ParenWidth=$(".box_le_main").width()-ThisWidth;//移动区域所在的宽度
            ParenHeight=$(".box_le_main").height()-ThisHeight;//移动区域所在的高度
        }
    })

    //鼠标是否在截取区域上
    $(".box_le_mb").hover(function(){
        ThisConHover=true;
    },function(){
        ThisConHover=false;
    })
    //鼠标是否在截取区域中按下
    $(".box_le_mb").mousedown(function(ev){
        ThisConMou=true;
        //鼠标在选中区中的位置
        ClaRangeTop=ev.pageY-$(this).offset().top;
        ClaRangeLeft=ev.pageX-$(this).offset().left;
    })

    //截取区域拖动效果
    $(".box_le_mb").mousemove(function(ev){
        if(ThisConMou==true && ThisConHover==true){
            ThisTop=ev.pageY-ParentTop-ClaRangeTop;
            ThisLeft=ev.pageX-ParentLeft-ClaRangeLeft;
            if(ThisTop>=0 && ThisTop<=ParenHeight && ThisLeft>=0 && ThisLeft<=ParenWidth){
                $(this).css("transform","translate("+ThisLeft+"px,"+ThisTop+"px)");
                $(".j-img-ago").css("clip","rect("+ThisTop+"px,"+(ThisLeft+ThisWidth)+"px,"+(ThisTop+ThisHeight)+"px,"+ThisLeft+"px)");
            }
        }
    })

    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    //当鼠标抬起是截取图片
    $(document).mouseup(function(){
        ThisConMou=false;

        //截取图片
        var thisimg=document.getElementById("j-img-2");
        //截取越界重置
        if(ThisTop<0)ThisTop=0;
        if(ThisTop>ParenHeight)ThisTop=ParenHeight;
        if(ThisLeft<0)ThisLeft=0;
        if(ThisLeft>ParenWidth)ThisLeft=ParenWidth;
        //取得截取坐标
        var x=ThisLeft/$(".j-img-back").width()*imageWidth;
        var y=ThisTop/$(".j-img-back").height()*imageHeight;
        var thewidth=imageWidth/thisimg.width*ThisWidth;
        var theheight=imageHeight/thisimg.height*ThisHeight;
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);

    })
    $(".box_le_mb_co").mousedown(function () {
        ThisConHover=false;
        ThisSizeMou=true;
    })
    $(".box_le_mb_co").mouseup(function () {
        ThisConHover=true;
        ThisSizeMou=false;
    })
    $(".box_le_mb_co").hover(function () {
        ThisSizeHover=true;
    },function () {
        ThisSizeHover=false;
    })
    $(".box_le_mb_co").mousemove(function(ev){
        if(ThisSizeMou==true && ThisSizeHover==true){
            $(".box_le_mb").width(ev.pageX-ParentLeft).height(ev.pageY-ParentTop);
            console.log("d"+ev.pageX+"n"+ParentLeft)
        }
    })
    $(".dow").click(function () {
        var type = "jpg";
        var imgData = ctx.toDataURL(type);
        var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        };
        imgData = imgData.replace(_fixType(type),'image/octet-stream');
        var saveFile = function(data, filename){
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };
        var filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
        saveFile(imgData,filename);
    })

})();

CanvasAvatar;