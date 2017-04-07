var CanvasAvatar=(function () {

    //声明变量
    var SchMou = false;//缩放控件是否按下状态
    var ClaRangeTop = 0;//鼠标在截取区域元素中的top位置
    var ClaRangeLeft = 0;//鼠标在截取区域元素中的left位置
    var SchParentWidth = $(".j-cae-sch").width();//缩放进度条宽度
    var SchParentLeft = $(".j-cae-sch").offset().left;//缩放进度条的left位置
    var SchRangeLeft = 0;//鼠标在缩放按钮元素中的left位置
    var SchLeft = 0;//缩放按钮元素的top位置
    var ParentTop;//移动区域所在的top位置
    var ParentLeft;//移动区域所在的left位置
    var ParenWidth;//移动区域所在的宽度
    var ParenHeight;//移动区域所在的高度
    var CanvasWidth = 0;//画布的宽度
    var CanvasHeight = 0;//画布的高度
    var ThisConMou = false;//当前是否在截取区域按下状态
    var ThisTop = 0;//截取区域top-相对于移动区域
    var ThisLeft = 0;//截取区域left-相对于移动区域
    var ThisWidthMax;//截取区域的宽度最大值(暂不支持非正方形)
    var ThisHeightMax;//截取区域的高度最大值(暂不支持非正方形)
    var ThisMax = 0;//截取区域的长宽最大值
    var PonSet = 0;////截取区域的长宽比例
    var ThisWidth = 50;//截取区域width
    var ThisHeight = 50;//截取区域height
    var Rotate = 0;//偏离角度
    var Scale = 1;//缩放比例
    var image = new Image();//新建一个空的图片对象
    var imageWidth;//图片的原始宽度
    var imageHeight;//图片的原始高度
    var imgConWidth;//缩略图宽度
    var imgConHeight;//缩略图高度
    var AreaWidth = 0;//放置控件宽度
    var imgSizeMax = 10240;//图片的最大限制（KB）
    var canvas = document.getElementById("cae-canvas");//得到canvas对象
    var ctx = canvas.getContext("2d");

    //截取区域位置设置
    var RemovalPositionSet = function (top,left,width,height) {
        var leftMax = ParenWidth - ThisWidth;
        var topMax = ParenHeight - ThisHeight;
        if(top >= 0 && left >= 0 && top <= topMax && left <= leftMax){//碰撞检测
            $(".j-cae-mb").css("transform","translate("+left+"px,"+top+"px)");
            $(".j-cae-img-tp").css("clip","rect("+top+"px,"+(left + width)+"px,"+(top + height)+"px,"+left+"px)");
        }
    }

    //截取区域大小设置
    var RemovalSizeSet = function (width,height) {
        $(".j-cae-mb").width(width);
        $(".j-cae-mb").height(height);
        ThisWidth = width;
        ThisHeight = height;
    }

    //进度条位置设置
    var RippleScrollBarPositionSet = function (left) {
        $(".j-cae-sch-btn").css("transform","translate("+left+"px,0px)");
    }

    //激活与关闭按钮
    var Switch = function (status) {
        if(status){
            $(".j-cae-flr").addClass("cae-active");
            $(".j-cae").find("[caeActive='false']").attr("caeActive","true");
            $(".j-cae-lel").addClass("cae-active");
        }else{
            $(".j-cae-flr").removeClass("cae-active");
            $(".j-cae").find("[caeActive='true']").attr("caeActive","false");
            $(".j-cae-lel").removeClass("cae-active");
        }
    }

    //初始化图片
    var InitImage = function (width,height,url) {
        $(".j-cae-co").css({"width":"100%","height":"100%","top":"0","left":"0"});
        if(width < height){
            $(".j-cae-img").addClass("cae-img-he").removeClass("cae-img-wi");
        }else{
            $(".j-cae-img").addClass("cae-img-wi").removeClass("cae-img-he");
        }
        $(".j-cae-img").attr("src",url);
        $(".j-cae-co").width($(".j-cae-img-bm").width()).height($(".j-cae-img-bm").height())
            .css({"top":($(".j-cae-mnc").height()-$(".j-cae-co").height())/2+"px","left":($(".j-cae-mnc").width()-$(".j-cae-co").width())/2+"px"});
    }

    //方向旋转
    var RotateDirection = function (angle) {
        $(".j-cae-co").css("transform","rotate("+angle+"deg)");
    }

    //图片下载功能
    var ImageDown = function (type) {
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

    //数据初始化
    var InitData = function () {
        ThisWidth = $(".j-cae-mb").width();//截取区域width
        ThisHeight = $(".j-cae-mb").height();//截取区域height
        ParentTop = $(".j-cae-co").offset().top;//移动区域所在的top位置
        ParentLeft = $(".j-cae-co").offset().left;//移动区域所在的left位置
        ParenWidth = $(".j-cae-co").width();//移动区域所在的宽度
        ParenHeight = $(".j-cae-co").height();//移动区域所在的高度
        var ThisWidthMaxS = (ParenWidth - ThisLeft)/ThisWidth;
        var ThisHeightMaxS = (ParenHeight - ThisTop)/ThisHeight;
        console.log("ThisWidthMaxS = "+ThisWidthMaxS);
        console.log("ThisHeightMaxS = "+ThisHeightMaxS);
        if(ThisWidthMaxS < ThisHeightMaxS){
            ThisWidthMax  = ThisWidthMaxS * ThisWidth;
            ThisHeightMax  = ThisWidthMaxS * ThisHeight;
        }else{
            ThisWidthMax  = ThisHeightMaxS * ThisWidth;
            ThisHeightMax  = ThisHeightMaxS * ThisHeight;
        }
        imgConWidth = $(".j-cae-img-bm").width();//缩略图宽度
        imgConHeight = $(".j-cae-img-bm").height();//缩略图高度
        SchParentWidth = $(".j-cae-sch").width();//缩放进度条宽度
        SchParentLeft = $(".j-cae-sch").offset().left;//缩放进度条的left位置
    }

    //canvas大小设置
    var CanvasSizeInit = function (width,height) {
        canvas.width = width;
        canvas.height = height;
    }

    //截取图片
    var IonImg = function () {
        //取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, CanvasWidth, CanvasHeight);
    }

    //取得截取的图片
    var GetDataUrl = function () {
        return canvas.toDataURL();
    }

    //图片的最大限制（KB）
    var SetImgSizeMax = function (size) {
        imgSizeMax = size;
    }
    
    //设置提示信息
    var SetTipsText = function (text) {
        $(".j-cae-tips").text(text);
    }
    
    //设置截取的图片的长宽
    var SetRemovalImgSize = function (width,height) {
        $(".j-cae-mnc-s").width(width).height(width);
        $(".j-cae-flr").width(width+2);
        $(".j-cae").width((width*2)+280-110*2);
        AreaWidth = width;
    }

    //选择图片
    $("#cae-fle").change(function(){
        var file = this.files[0];//得到文件
        var reader = new FileReader();//新建空文件属性对象
        if(file != undefined)reader.readAsDataURL(file);//传入文件
        if((file.size / 1024) <= imgSizeMax){
            SetTipsText("");
            reader.onload = function(){
                var url = reader.result;//将得到的文件转成data64编码
                image.src = url;//将input得到的url赋值给新建的图片对象

                image.onload = function () {
                    imageWidth = image.width;//图片的原始宽度
                    imageHeight = image.height;//图片的原始高度

                    var he = true;
                    var wi = true;;
                    if(imageWidth > imageHeight){
                        if(AreaWidth/imageWidth*imageHeight < ThisHeight){
                            he = false;
                        }
                    }else{
                        if(AreaWidth/imageHeight*imageWidth < ThisWidth){
                            wi = false;
                        }
                    }

                    if(he && wi){

                        //激活功能
                        Switch(true);

                        //初始化图片
                        InitImage(imageWidth,imageHeight,image.src);

                        //截取区域大小初始化
                        // RemovalSizeSet(50,50);

                        //数据初始化
                        InitData();

                        if(ThisWidth > ThisHeight){
                            CanvasWidth = AreaWidth;
                            CanvasHeight = ThisHeight/ThisWidth*AreaWidth;
                        }else{
                            CanvasHeight = AreaWidth;
                            CanvasWidth = ThisWidth/ThisHeight*AreaWidth;
                        }
                        //canvas大小设置
                        CanvasSizeInit(CanvasWidth,CanvasHeight);

                        //重置截取区域位置
                        RemovalPositionSet(0,0,ThisWidth,ThisHeight);

                        if(ThisWidthMax > ThisHeightMax){
                            SchLeft = (SchParentWidth / ThisWidthMax) * ThisWidth;
                        }else{
                            SchLeft = (SchParentWidth / ThisHeightMax) * ThisWidth;
                        }
                        //进度条位置初始化
                        RippleScrollBarPositionSet(SchLeft);

                        //截取图片
                        IonImg();
                    }else{
                        SetTipsText("图片长宽比例超过限制");
                    }
                }
            }
        }else{
            SetTipsText("图片大小超过限制");
        }
    })

    //鼠标是否在截取区域中按下
    $(".j-cae-mb").mousedown(function(ev){
        ThisConMou = true;
        //鼠标在选中区中的位置
        ClaRangeTop = ev.pageY - $(this).offset().top;
        ClaRangeLeft = ev.pageX - $(this).offset().left;
    })

    //截取区域拖动效果
    $(".j-cae-co").mousemove(function(ev){
        var ThisBottom = 0;//截取区域距离拖动区间底部的距离
        var ThisRight = 0;//截取区域距离拖动区间右部的距离
        if(ThisConMou){
            ThisBottom = ParenHeight- ThisTop - ThisHeight;//截取区域底部距离拖动区间顶部的距离
            ThisRight = ParenWidth - ThisLeft - ThisWidth;//截取区域右部距离拖动区间左部的距离
            if(Rotate % 360 == 0){
                ThisTop = ev.pageY - ParentTop - ClaRangeTop;
                ThisLeft = ev.pageX - ParentLeft - ClaRangeLeft;
            }else if(Rotate % 360 == -90 || Rotate % 360 == 270){
                ThisTop = ev.pageX - ParentLeft - ClaRangeLeft;
                ThisLeft = ParenWidth- (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
            }else if (Rotate % 360 == -180 || Rotate % 360 == 180){
                ThisTop = ParenHeight - (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
                ThisLeft = ParenWidth- (ev.pageX - ParentLeft - ClaRangeLeft) - ThisWidth;
            }else if (Rotate % 360 == -270 || Rotate % 360 == 90){
                ThisTop = ParenHeight - (ev.pageX - ParentLeft - ClaRangeLeft) - ThisHeight;
                ThisLeft = ev.pageY - ParentTop - ClaRangeTop;
            }
            if(ThisTop <= 0){
                ThisTop = 0;
            }
            if(ThisLeft <= 0){
                ThisLeft = 0;
            }
            if(ThisRight < 0){
                ThisLeft = ParenWidth - ThisWidth;
            }
            if(ThisBottom < 0){
                ThisTop = ParenHeight - ThisHeight;
            }
            //截取区域位置设置
            RemovalPositionSet(ThisTop,ThisLeft,ThisWidth,ThisHeight);
        }
    })

    //当鼠标抬起时截取图片
    $(document).mouseup(function(){
        ThisConMou = false;
        SchMou = false;

        //截取图片
        //截取越界重置
        if(ThisTop < 0) ThisTop = 0;
        if(ThisTop > ParenHeight - ThisHeight) ThisTop = ParenHeight - ThisHeight;
        if(ThisLeft < 0) ThisLeft = 0;
        if(ThisLeft > ParenWidth - ThisWidth) ThisLeft = ParenWidth - ThisWidth;
        //截取图片
        IonImg();
    })

    //向左转
    $(".j-cae").on("click",".j-turn-left[caeActive='true']",function () {
        Rotate -= 90;

        //旋转
        RotateDirection(Rotate);

        //数据初始化
        InitData();

        ctx.translate(AreaWidth/2,AreaWidth/2);
        ctx.rotate(-90*Math.PI/180);
        ctx.translate(-AreaWidth/2,-AreaWidth/2);
        //截取图片
        IonImg();
    })

    //向右转
    $(".j-cae").on("click",".j-turn-right[caeActive='true']",function () {
        Rotate += 90;
        //旋转
        RotateDirection(Rotate);

        //数据初始化
        InitData();

        //取得截取坐标
        ctx.translate(AreaWidth/2,AreaWidth/2);
        ctx.rotate(90*Math.PI/180);
        ctx.translate(-AreaWidth/2,-AreaWidth/2);
        //截取图片
        IonImg();
    })

    //缩放
    $(".j-cae").on("mousedown",".j-cae-sch-btn[caeActive='true']",function(ev){
        SchMou = true;
        //鼠标在选中区中的位置
        SchRangeLeft = ev.pageX - $(this).offset().left;
    })

    //进度条
    $(document).mousemove(function (ev) {
        SchLeft = ev.pageX - SchParentLeft - SchRangeLeft;
        //更改截取区域大小
        if(SchMou && SchLeft <= SchParentWidth && SchLeft >= 0){
            Scale = SchLeft / SchParentWidth;
            ThisWidth = ThisWidthMax * Scale;
            ThisHeight = ThisHeightMax * Scale;
            if(ThisWidth > (ParenWidth - ThisLeft)){
                ThisLeft = ParenWidth - ThisWidth;
            }
            if(ThisHeight > (ParenHeight - ThisTop)){
                ThisTop = ParenHeight - ThisHeight;
            }
            //截取区域位置设置
            RemovalPositionSet(ThisTop,ThisLeft,ThisWidth,ThisHeight);
            //截取区域大小设置
            RemovalSizeSet(ThisWidth,ThisHeight);
            //进度条位置设置
            RippleScrollBarPositionSet(SchLeft);
        }
    })

    //图片下载
    $(".j-cae").on("click",".j-cae-dld[caeActive='true']",function () {
        ImageDown('png');
    })

    $(window).resize(function () {
        //数据初始化
        InitData();
    })

    return {
        setRemovalSize : RemovalSizeSet,
        setRemovalImgSize : SetRemovalImgSize,
        getImg : GetDataUrl,
        getSizeMax : SetImgSizeMax,
    }

})();

CanvasAvatar.setRemovalSize(50,50);
CanvasAvatar.getSizeMax(5024);
CanvasAvatar.setRemovalImgSize(210,180);
$(".cae-sn").click(function () {
    console.log(CanvasAvatar.getImg());
})
