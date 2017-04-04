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
    var ThisConMou = false;//当前是否在截取区域按下状态
    var ThisTop = 0;//截取区域top-相对于移动区域
    var ThisLeft = 0;//截取区域left-相对于移动区域
    var ThisWidthMax;//截取区域的宽度最大值(暂不支持非正方形)
    var ThisHeightMax;//截取区域的高度最大值(暂不支持非正方形)
    var ThisMax = 0;//截取区域的长宽最大值
    var ThisWidth = 50;//截取区域width
    var ThisHeight = 50;//截取区域height
    var Rotate = 0;//偏离角度
    var Scale = 1;//缩放比例
    var image = new Image();//新建一个空的图片对象
    var imageWidth;//图片的原始宽度
    var imageHeight;//图片的原始高度
    var imgConWidth;//缩略图宽度
    var imgConHeight;//缩略图高度
    var canvas = document.getElementById("cae-canvas");//得到canvas对象
    var ctx=canvas.getContext("2d");

    //截取区域位置设置
    var RemovalPositionSet = function (top,left,width,height,topMax,leftMax) {
        topMax = topMax || 0;
        leftMax = leftMax || 0;
        if(top >= 0 && left >= 0 && top <= topMax && left <= leftMax){//碰撞检测
            $(".j-cae-mb").css("transform","translate("+left+"px,"+top+"px)");
            $(".j-cae-img-tp").css("clip","rect("+top+"px,"+(left + width)+"px,"+(top + height)+"px,"+left+"px)");
        }
    }

    //截取区域大小设置
    var RemovalSizeSet = function (width,height) {
        $(".j-cae-mb").width(width);
        $(".j-cae-mb").height(height);
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
        }else{
            $(".j-cae-flr").removeClass("cae-active");
            $(".j-cae").find("[caeActive='true']").attr("caeActive","false");
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

    //选择图片
    $("#cae-fle").change(function(){
        var file = this.files[0];//得到文件
        var reader = new FileReader();//新建空文件属性对象
        if(file != undefined)reader.readAsDataURL(file);//传入文件
        reader.onload = function(){
            var url = reader.result;//将得到的文件转成data64编码
            image.src = url;//将input得到的url赋值给新建的图片对象

            image.onload = function () {
                imageWidth = image.width;//图片的原始宽度
                imageHeight = image.height;//图片的原始高度

                //激活功能
                Switch(true);

                //初始化图片
                InitImage(imageWidth,imageHeight,image.src);

                //截取区域大小初始化
                RemovalSizeSet(50,50);

                //数据初始化
                InitData();

                //重置截取区域位置
                RemovalPositionSet(0,0,ThisWidth,ThisHeight);

                if(ThisWidthMax > ThisHeightMax){
                    ThisMax = ThisHeightMax;
                }else{
                    ThisMax = ThisWidthMax;
                }

                //进度条位置初始化
                SchLeft = (SchParentWidth / ThisMax) * ThisWidth;
                RippleScrollBarPositionSet(SchLeft);

                //取得截取坐标
                var x = ThisLeft / imgConWidth * imageWidth;
                var y = ThisTop / imgConHeight * imageHeight;
                var thewidth = imageWidth / imgConWidth * ThisWidth;
                var theheight = imageHeight / imgConHeight * ThisHeight;
                ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);
            }
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
    $(".j-cae-mb").mousemove(function(ev){
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
            var ThisLeftMax = ParenWidth - ThisWidth;
            var ThisTopMax = ParenHeight - ThisHeight;
            //截取区域移动
            RemovalPositionSet(ThisTop,ThisLeft,ThisWidth,ThisHeight,ThisTopMax,ThisLeftMax);
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
        //取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);

        ThisWidthMax = ParenWidth - ThisLeft;//截取区域的宽度最大值
        ThisHeightMax = ParenHeight - ThisTop;//截取区域的高度最大值
    })
    
    //向左转
    $(".j-cae").on("click",".j-turn-left[caeActive='true']",function () {
        Rotate -= 90;

        //旋转
        RotateDirection(Rotate);

        //数据初始化
        InitData();

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

    //向右转
    $(".j-cae").on("click",".j-turn-right[caeActive='true']",function () {
        Rotate += 90;
        //旋转
        RotateDirection(Rotate);

        //数据初始化
        InitData();

        //取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.translate(90,90);
        ctx.rotate(90*Math.PI/180);
        ctx.translate(-90,-90);
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, 180, 180);
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
            ThisWidth = ThisMax * Scale;
            ThisHeight = ThisMax * Scale;
            if(ThisWidth > (ThisMax - ThisLeft)){
                ThisLeft = ThisMax - ThisWidth;
            }
            if(ThisHeight > (ThisMax - ThisTop)){
                ThisTop = ThisMax - ThisHeight;
            }
            $(".j-cae-mb").css("transform","translate("+ThisLeft+"px,"+ThisTop+"px)");
            $(".j-cae-mb").width(ThisWidth);
            $(".j-cae-mb").height(ThisHeight);
            $(".j-cae-img-tp").css("clip","rect("+ThisTop+"px,"+(ThisLeft + ThisWidth)+"px,"+(ThisTop + ThisHeight)+"px,"+ThisLeft+"px)");
            $(".j-cae-sch-btn").css("transform","translate("+SchLeft+"px,0px)");
        }
    })

    //图片下载
    $(".j-cae").on("click",".j-cae-dld[caeActive='true']",function () {
        imgDown('png');
    })
    
    $(window).resize(function () {
        //数据初始化
        InitData();
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

    //数据初始化
    var InitData = function () {
        ThisWidth = $(".j-cae-mb").width();//截取区域width
        ThisHeight = $(".j-cae-mb").height();//截取区域height
        ParentTop = $(".j-cae-co").offset().top;//移动区域所在的top位置
        ParentLeft = $(".j-cae-co").offset().left;//移动区域所在的left位置
        ParenWidth = $(".j-cae-co").width();//移动区域所在的宽度
        ParenHeight = $(".j-cae-co").height();//移动区域所在的高度
        ThisWidthMax = ParenWidth - ThisLeft;//截取区域的宽度最大值
        ThisHeightMax = ParenHeight - ThisTop;//截取区域的高度最大值
        imgConWidth = $(".j-cae-img-bm").width();//缩略图宽度
        imgConHeight = $(".j-cae-img-bm").height();//缩略图高度
        SchParentWidth = $(".j-cae-sch").width();//缩放进度条宽度
        SchParentLeft = $(".j-cae-sch").offset().left;//缩放进度条的left位置
    }

})();

CanvasAvatar;

// var promisifiedOldGUM = function(constraints) {
//
//     // 第一个拿到getUserMedia，如果存在
//     var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
//
//     // 有些浏览器只是不实现它-返回一个不被拒绝的承诺与一个错误保持一致的接口
//     if (!getUserMedia) {
//         return Promise.reject(new Error('getUserMedia is not implemented in this browser-getUserMedia是不是在这个浏览器实现'));
//     }
//
//     // 否则，调用包在一个旧navigator.getusermedia承诺
//     return new Promise(function(resolve, reject) {
//         getUserMedia.call(navigator, constraints, resolve, reject);
//     });
//
// }
//
// // 旧的浏览器可能无法实现mediadevices可言，所以我们设置一个空的对象第一
// if (navigator.mediaDevices === undefined) {
//     navigator.mediaDevices = {};
// }
//
// // 一些浏览器部分实现mediadevices。我们不能只指定一个对象
// // 随着它将覆盖现有的性能getUserMedia。.
// // 在这里，我们就要错过添加getUserMedia财产。.
// if (navigator.mediaDevices.getUserMedia === undefined) {
//     navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
// }
//
// // Prefer camera resolution nearest to 1280x720.
// var constraints = {
//     audio: false,
//     video: {
//         width: 720,
//         height: 720
//     }
// };
//
// navigator.mediaDevices.getUserMedia(constraints)
//     .then(function(stream) {
//         var video = document.querySelector('video');
//         video.src = window.URL.createObjectURL(stream);
//         video.onloadedmetadata = function(e) {
//             video.play();
//         };
//     }).catch(function(err) {
//     console.log(err.name + ": " + err.message);
// });