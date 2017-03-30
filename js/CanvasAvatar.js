var CanvasAvatar=(function () {

    //声明变量
    var ThisConMou = false;//当前是否在截取区域按下状态
    var ThisConHover = false;//当前鼠标是否在截取区域元素上状态
    var ThisSizeMou = false;//当前是否在调整大小区按下状态
    var ThisSizeHover = false;//当前是否在调整大小区素上状态
    var ClaRangeTop = 0;//鼠标在元素中的top位置
    var ClaRangeLeft = 0;//鼠标在元素中的left位置
    var ParentTop;//移动区域所在的top位置
    var ParentLeft;//移动区域所在的left位置
    var ParenWidth;//移动区域所在的宽度
    var ParenHeight;//移动区域所在的高度
    var ThisTop;//截取区域top-相对于移动区域
    var ThisLeft;//截取区域left-相对于移动区域
    var ThisWidthMax;//截取区域的宽度最大值
    var ThisHeightMax;//截取区域的高度最大值
    var ThisWidth = $(".j-cae-mb").width()+2;//截取区域width
    var ThisHeight = $(".j-cae-mb").height()+2;//截取区域height
    var Rotate = 0;//偏离角度
    var image = new Image();//新建一个空的图片对象
    var imageWidth;//图片的原始宽度
    var imageHeight;//图片的原始高度
    var imgConWidth;//缩略图宽度
    var imgConHeight;//缩略图高度
    var canvas = document.getElementById("cae-canvas");//得到canvas对象
    var ctx=canvas.getContext("2d");

    //选择图片
    $("#cae-fle").change(function(){
        var file = this.files[0];//得到文件
        var reader = new FileReader();//新建空文件属性对象
        if(file != undefined)reader.readAsDataURL(file);//传入文件
        reader.onload=function(){
            var url = reader.result;//将得到的文件转成data64编码
            image.src = url;//将input得到的url赋值给新建的图片对象
            imageWidth = image.width;//图片的原始宽度
            imageHeight = image.height;//图片的原始高度

            //激活功能
            $(".j-cae-fl").addClass("cae-active");

            //图像居中
            $(".j-cae-co").css({"width":"100%","height":"100%","top":"0","left":"0"});
            if(imageWidth < imageHeight){
                $(".j-cae-img").addClass("cae-img-he").removeClass("cae-img-wi");
            }else{
                $(".j-cae-img").addClass("cae-img-wi").removeClass("cae-img-he");
            }
            $(".j-cae-img").attr("src",image.src);
            $(".j-cae-co").width($(".j-cae-img-bm").width()).height($(".j-cae-img-bm").height())
                .css({"top":($(".j-cae-mnc").height()-$(".j-cae-co").height())/2+"px","left":($(".j-cae-mnc").width()-$(".j-cae-co").width())/2+"px"});
            $(".j-cae-mnc").css({"border-radius":"0px"});

            //重置剪切区域位置
            $(".j-cae-mb").css("transform","translate(0px,0px)");
            $(".j-cae-img-tp").css("clip","rect(0px,50px,50px,0px)");

            ThisWidth = $(".j-cae-mb").width();//截取区域width
            ThisHeight = $(".j-cae-mb").height();//截取区域height
            ParentTop = $(".j-cae-co").offset().top;//移动区域所在的top位置
            ParentLeft = $(".j-cae-co").offset().left;//移动区域所在的left位置
            ThisTop = 0;//截取区域top
            ThisLeft = 0;//截取区域left
            ParenWidth = $(".j-cae-co").width();//移动区域所在的宽度
            ParenHeight = $(".j-cae-co").height();//移动区域所在的高度
            ThisWidthMax = ParenWidth - ThisLeft;//截取区域的宽度最大值
            ThisHeightMax = ParenHeight - ThisTop;//截取区域的高度最大值
            imgConWidth = $(".j-cae-img-bm").width();//缩略图宽度
            imgConHeight = $(".j-cae-img-bm").height();//缩略图高度

            //取得截取坐标
            var x = ThisLeft / imgConWidth * imageWidth;
            var y = ThisTop / imgConHeight * imageHeight;
            var thewidth = imageWidth / imgConWidth * ThisWidth;
            var theheight = imageHeight / imgConHeight * ThisHeight;
            ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);
        }
    })

    //鼠标是否在截取区域上
    $(".j-cae-mb").hover(function(){
        ThisConHover = true;
    },function(){
        ThisConHover = false;
    })
    //鼠标是否在截取区域中按下
    $(".j-cae-mb").mousedown(function(ev){
        ThisConMou = true;
        //鼠标在选中区中的位置
        ClaRangeTop = ev.pageY - $(this).offset().top;
        ClaRangeLeft = ev.pageX - $(this).offset().left;
    })

    //截取区域拖动效果
    $(".j-cae-mb").mousemove(function(ev){
        var ThisBottom = 0;//截取区域距离拖动区间底部的距离
        var ThisRight = 0;//截取区域距离拖动区间右部的距离
        if(ThisConMou && ThisConHover){
            if(Math.abs(Rotate % 360) == 0){
                ThisTop = ev.pageY - ParentTop - ClaRangeTop;
                ThisLeft = ev.pageX - ParentLeft - ClaRangeLeft;
                ThisBottom = ParenHeight- ThisTop - ThisHeight;//截取区域底部距离拖动区间顶部的距离
                ThisRight = ParenWidth - ThisLeft - ThisWidth;//截取区域右部距离拖动区间左部的距离
            }else if(Math.abs(Rotate % 360) == 90){
                ThisTop = ev.pageX - ParentLeft - ClaRangeLeft;
                ThisLeft = ParenWidth- (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
                ThisBottom = ParenHeight- ThisTop - ThisHeight;//截取区域底部距离拖动区间顶部的距离
                ThisRight = ParenWidth - ThisLeft - ThisWidth;//截取区域右部距离拖动区间左部的距离
            }else if (Math.abs(Rotate % 360) == 180){
                ThisTop = ParenHeight - (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
                ThisLeft = ParenWidth- (ev.pageX - ParentLeft - ClaRangeLeft) - ThisWidth;
                ThisBottom = ParenHeight- ThisTop - ThisHeight;//截取区域底部距离拖动区间顶部的距离
                ThisRight = ParenWidth - ThisLeft - ThisWidth;//截取区域右部距离拖动区间左部的距离
            }else if (Math.abs(Rotate % 360) == 270){
                ThisTop = ParenHeight - (ev.pageX - ParentLeft - ClaRangeLeft) - ThisHeight;
                ThisLeft = ev.pageY - ParentTop - ClaRangeTop;
                ThisBottom = ParenHeight- ThisTop - ThisHeight;//截取区域底部距离拖动区间顶部的距离
                ThisRight = ParenWidth - ThisLeft - ThisWidth;//截取区域右部距离拖动区间左部的距离
            }
            //碰撞检测
            if(ThisTop >= 0 && ThisBottom >= 0 && ThisLeft >= 0 && ThisRight >= 0){
                $(this).css("transform","translate("+ThisLeft+"px,"+ThisTop+"px)");
                $(".j-cae-img-tp").css("clip","rect("+ThisTop+"px,"+(ThisLeft + ThisWidth)+"px,"+(ThisTop + ThisHeight)+"px,"+ThisLeft+"px)");
            }
        }
    })

    //当鼠标抬起时截取图片
    $(document).mouseup(function(){
        ThisConMou = false;
        ThisConHover = true;
        ThisSizeMou = false;

        //截取图片
        //截取越界重置
        if(ThisTop < 0) ThisTop = 0;
        if(ThisTop > ParenHeight - ThisHeight) ThisTop = ParenHeight - ThisHeight;
        if(ThisLeft < 0) ThisLeft = 0;
        if(ThisLeft > ParenWidth - ThisWidth) ThisLeft = ParenWidth - ThisWidth;
        //取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);

        ThisWidthMax = ParenWidth - ThisLeft;//截取区域的宽度最大值
        ThisHeightMax = ParenHeight - ThisTop;//截取区域的高度最大值
    })
    $(".j-cae-mb-btn").mousedown(function () {
        ThisConHover = false;
        ThisSizeMou = true;
    })
    $(".j-cae-co").hover(function () {
        ThisSizeHover = true;
    },function () {
        ThisSizeHover = false;
    })
    //改变截取区域大小
    $(".j-cae-co").mousemove(function(ev){
        var ThisWidths = ev.pageX - ParentLeft - ThisLeft;
        var ThisHeights = ev.pageY - ParentTop - ThisTop;
        if(ThisSizeMou && ThisSizeHover && ThisWidthMax > ThisWidths && ThisHeightMax > ThisHeights){
            ThisWidth = ThisWidths;
            ThisHeight = ThisHeights;
            $(".j-cae-mb").width(ThisWidth).height(ThisHeight);
            $(".j-cae-img-tp").css("clip","rect("+ThisTop+"px,"+(ThisLeft + ThisWidth)+"px,"+(ThisTop + ThisHeight)+"px,"+ThisLeft+"px)");
        }
    })
    
    //向左转
    $(".j-turn-left").click(function () {
        Rotate -= 90;
        $(".j-cae-co").css("transform","rotate("+Rotate+"deg)");

        //初始化
        ThisWidth = $(".j-cae-mb").width();//截取区域width
        ThisHeight = $(".j-cae-mb").height();//截取区域height
        ParentTop = $(".j-cae-co").offset().top;//移动区域所在的top位置
        ParentLeft = $(".j-cae-co").offset().left;//移动区域所在的left位置
        ThisTop = 0;//截取区域top
        ThisLeft = 0;//截取区域left
        ParenWidth = $(".j-cae-co").width();//移动区域所在的宽度
        ParenHeight = $(".j-cae-co").height();//移动区域所在的高度
        ThisWidthMax = ParenWidth - ThisLeft;//截取区域的宽度最大值
        ThisHeightMax = ParenHeight - ThisTop;//截取区域的高度最大值

        //取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.translate(90,90);
        ctx.rotate(-90*Math.PI/180);
        ctx.translate(-90,-90);
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);
    })

    //图片下载
    $(".j-cae-dld").click(function () {
        imgDown('png');
    })

    //图片下载功能
    function imgDown(type) {
        var imgData = canvas.toDataURL(type);//得到截取区域的data64位编码
        var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        };
        imgData = imgData.replace(_fixType(type),'image/octet-stream');//替换图片类型
        var saveFile = function(data, filename){
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            //实例化事件对象
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            //触发点击事件
            save_link.dispatchEvent(event);
        };
        var filename = 'img_' + (new Date()).getTime() + '.' + type;//给下载的图片命名
        saveFile(imgData,filename);
    }

})();

CanvasAvatar;