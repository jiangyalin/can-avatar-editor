var CanvasAvatar=(function () {

    // 获取元素距离文档left的距离
    var getElementLeft = function (element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;

        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }

        return actualLeft;
    };

    // 获取元素距离文档top的距离
    var getElementTop = function (element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return actualTop;
    };
    
    // 声明变量
    var fileName = ''; // 原始文件名
    var SchMou = false; // 缩放控件是否按下状态
    var ClaRangeTop = 0; // 鼠标在截取区域元素中的top位置
    var ClaRangeLeft = 0; // 鼠标在截取区域元素中的left位置
    var jCaeSch = document.querySelectorAll('.j-cae-sch');
    var SchParentWidth = jCaeSch[0].clientWidth; // 缩放进度条宽度
    var SchParentLeft = getElementLeft(jCaeSch[0]); // 缩放进度条的left位置
    var SchRangeLeft = 0; // 鼠标在缩放按钮元素中的left位置
    var SchLeft = 0; // 缩放按钮元素的top位置
    var ParentTop; // 移动区域所在的top位置
    var ParentLeft; // 移动区域所在的left位置
    var ParenWidth; // 移动区域所在的宽度
    var ParenHeight; // 移动区域所在的高度
    var CanvasWidth = 0; // 画布的宽度
    var CanvasHeight = 0; // 画布的高度
    var ThisConMou = false; // 当前是否在截取区域按下状态
    var ThisTop = 0; // 截取区域top-相对于移动区域
    var ThisLeft = 0; // 截取区域left-相对于移动区域
    var ThisWidthMax; // 截取区域的宽度最大值(暂不支持非正方形)
    var ThisHeightMax; // 截取区域的高度最大值(暂不支持非正方形)
    var ThisMax = 0; // 截取区域的长宽最大值
    var PonSet = 0; // 截取区域的长宽比例
    var ThisWidth = 50; // 截取区域width
    var ThisHeight = 50; // 截取区域height
    var Rotate = 0; // 偏离角度
    var Scale = 1; // 缩放比例
    var image = new Image(); // 新建一个空的图片对象
    var imageWidth; // 图片的原始宽度
    var imageHeight; // 图片的原始高度
    var imgConWidth; // 缩略图宽度
    var imgConHeight; // 缩略图高度
    var AreaWidth = 0; // 放置控件宽度
    var imgSizeMax = 10240; // 图片的最大限制（KB）
    var imgData = {}; // 截取的图片数据
    var canvas = document.getElementById("cae-canvas"); // 得到canvas对象
    var ctx = canvas.getContext("2d");

    // 截取区域位置设置
    var RemovalPositionSet = function (top, left, width, height) {
        var leftMax = ParenWidth - ThisWidth;
        var topMax = ParenHeight - ThisHeight;
        if (top >= 0 && left >= 0 && top <= topMax && left <= leftMax) { // 碰撞检测
            var jCaeMb = document.getElementsByClassName('j-cae-mb')[0];
            jCaeMb.style.transform = 'translate(' + left + 'px ,' + top + 'px)';
            var jCaeImgTp = document.getElementsByClassName('j-cae-img-tp')[0];
            jCaeImgTp.style.clip = 'rect(' + top + 'px, ' + (left + width) + 'px, ' + (top + height) + 'px, ' + left + 'px)';
        }
    };

    // 截取区域大小设置
    var RemovalSizeSet = function (width,height) {
        var jCaeMb = document.getElementsByClassName('j-cae-mb')[0];
        jCaeMb.style.width = width + 'px';
        jCaeMb.style.height = height + 'px';
        ThisWidth = width;
        ThisHeight = height;
    };

    // 进度条位置设置
    var RippleScrollBarPositionSet = function (left) {
        var jCaeSchBtn = document.getElementsByClassName('j-cae-sch-btn')[0];
        jCaeSchBtn.style.transform = 'translate(' + left + 'px, 0px)';
    };

    // 激活与关闭按钮
    var Switch = function (status) {
        var jCaeFlr = document.getElementsByClassName('j-cae-flr');
        var jCae = document.querySelectorAll('.j-cae')[0];
        var jCaeLel = document.querySelectorAll('.j-cae-lel');
        if (status) {
            jCaeFlr[0].classList.add('cae-active');
            jCaeFlr[1].classList.add('cae-active');
            jCae.querySelectorAll("[caeActive = 'false']").forEach(function (data) {
                data.setAttribute('caeActive', 'true');
            });
            jCaeLel[0].classList.add('cae-active');
        } else {
            jCaeFlr[0].classList.remove('cae-active');
            jCaeFlr[1].classList.remove('cae-active');
            jCae.querySelectorAll("[caeActive = 'true']").forEach(function (data) {
                data.setAttribute('caeActive', 'false');
            });
            jCaeLel[0].classList.remove('cae-active');
        }
    };

    // 初始化图片
    var InitImage = function (width, height, url) {
        var jCaeCo = document.querySelectorAll('.j-cae-co');
        jCaeCo[0].style.width = '100%';
        jCaeCo[0].style.height = '100%';
        jCaeCo[0].style.top = '0';
        jCaeCo[0].style.left = '0';
        var jCaeImg = document.querySelectorAll('.j-cae-img');
        if (width < height) {
            jCaeImg.forEach(function (data) {
                data.classList.add('cae-img-he');
                data.classList.remove('cae-img-wi');
            });
        } else {
            jCaeImg.forEach(function (data) {
                data.classList.add('cae-img-wi');
                data.classList.remove('cae-img-he');
            });
        }
        jCaeImg.forEach(function (data) {
            data.src = url;
        });
        var jCaeImgBm = document.querySelectorAll('.j-cae-img-bm');
        var jCaeMnc = document.querySelectorAll('.j-cae-mnc');
        jCaeCo[0].style.width = jCaeImgBm[0].clientWidth + 'px';
        jCaeCo[0].style.height = jCaeImgBm[0].clientHeight + 'px';
        jCaeCo[0].style.top = (jCaeMnc[0].clientHeight - jCaeCo[0].clientHeight) / 2 + 'px';
        jCaeCo[0].style.left = (jCaeMnc[0].clientWidth - jCaeCo[0].clientWidth) / 2 + 'px';
    };

    // 方向旋转
    var RotateDirection = function (angle) {
        var jCaeCo = document.querySelectorAll('.j-cae-co');
        jCaeCo[0].style.transform = 'rotate(' + angle + 'deg)';
    };

    // 图片下载功能
    var ImageDown = function (type) {
        var imgData = canvas.toDataURL(type); // 得到截取区域的data64位编码
        var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        };
        imgData = imgData.replace(_fixType(type), 'image/octet-stream'); // 替换图片类型
        var saveFile = function (data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            // 实例化事件对象
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            // 触发点击事件
            save_link.dispatchEvent(event);
        };
        var filename = 'img_' + (new Date()).getTime() + '.' + type; // 给下载的图片命名
        saveFile(imgData, filename);
    };

    //数据初始化
    var InitData = function () {
        var jCaeMb = document.querySelectorAll('.j-cae-mb');
        ThisWidth = jCaeMb[0].clientWidth; // 截取区域width
        ThisHeight = jCaeMb[0].clientHeight; // 截取区域height
        var jCaeCo = document.querySelectorAll('.j-cae-co');
        ParentTop = getElementTop(jCaeCo[0]); // 移动区域所在的top位置
        ParentLeft = getElementLeft(jCaeCo[0]); // 移动区域所在的left位置
        ParenWidth = jCaeCo[0].clientWidth; // 移动区域所在的宽度
        ParenHeight = jCaeCo[0].clientHeight; // 移动区域所在的高度
        if (ParenWidth < ParenHeight) {
            ThisWidthMax = ParenWidth;
            ThisHeightMax = ParenWidth;
        } else {
            ThisWidthMax = ParenHeight;
            ThisHeightMax = ParenHeight;
        }
        var jCaeImgBm = document.querySelectorAll('.j-cae-img-bm');
        imgConWidth = jCaeImgBm[0].clientWidth; // 缩略图宽度
        imgConHeight = jCaeImgBm[0].clientHeight; // 缩略图高度
        var jCaeSch = document.querySelectorAll('.j-cae-sch');
        SchParentWidth = jCaeSch[0].clientWidth; // 缩放进度条宽度
        SchParentLeft = getElementLeft(jCaeSch[0]); // 缩放进度条的left位置
    };

    // canvas大小设置
    var CanvasSizeInit = function (width,height) {
        canvas.width = width;
        canvas.height = height;
    };

    // 截取图片
    var IonImg = function () {
        // 取得截取坐标
        var x = ThisLeft / imgConWidth * imageWidth;
        var y = ThisTop / imgConHeight * imageHeight;
        var thewidth = imageWidth / imgConWidth * ThisWidth;
        var theheight = imageHeight / imgConHeight * ThisHeight;
        ctx.drawImage(image, x, y, thewidth, theheight, 0, 0, CanvasWidth, CanvasHeight);
    };

    // 取得截取的图片
    var GetDataUrl = function () {
        var DataURL = '';
        if (fileName != '') {
            DataURL = canvas.toDataURL();
            imgData = {
                name: fileName,
                ContentType: 'image/png',
                DataURL: DataURL
            };
            return imgData;
        } else {
            return '';
        }
    };

    // 图片的最大限制（KB）
    var SetImgSizeMax = function (size) {
        var jCaeMaxSize = document.querySelectorAll('.j-cae-max-size');
        jCaeMaxSize[0].innerText = (size / 1024).toFixed(2);
        imgSizeMax = size;
    };

    // 设置提示信息
    var SetTipsText = function (text) {
        var jCaeTips = document.querySelectorAll('.j-cae-tips');
        jCaeTips[0].innerText = text;
    };

    // 设置截取的图片的长宽
    var SetRemovalImgSize = function (width, height) {
        var jCaeMncS = document.querySelectorAll('.j-cae-mnc-s');
        jCaeMncS.forEach(function (data) {
            data.style.width = width + 'px';
            data.style.height = width + 'px';
        });
        var jCaeFlr = document.querySelectorAll('.j-cae-flr');
        jCaeFlr.forEach(function (data) {
            data.style.width = (width + 2) + 'px';
        });
        var jCae = document.querySelectorAll('.j-cae');
        jCae[0].style.width = ((width * 2) + 280) + 'px';
        AreaWidth = width;
    };

    // 初始化dome
    var InitDome = function () {
        Switch(false);
        CanvasSizeInit(0, 0);
        RemovalSizeSet(50, 50);
        var caeFle = document.querySelectorAll('#cae-fle');
        caeFle[0].value = '';
        fileName = '';
        imgData = {
            name: '',
            ContentType: '',
            DataURL: ''
        };
    };

    // 选择图片
    var caeFle = document.querySelectorAll('#cae-fle');
    caeFle[0].addEventListener('change', function () {
        fileName = caeFle[0].value.substring(caeFle[0].value.lastIndexOf("\\") + 1);
        var file = this.files[0]; // 得到文件
        var reader = new FileReader(); // 新建空文件属性对象
        if (file != undefined) reader.readAsDataURL(file); // 传入文件
        if ((file.size / 1024) <= imgSizeMax) {
            SetTipsText('');
            reader.onload = function (){
                Rotate = 0;
                RotateDirection(Rotate); // 重置偏转角度
                var url = reader.result; // 将得到的文件转成data64编码
                image.src = url; // 将input得到的url赋值给新建的图片对象

                image.onload = function () {
                    imageWidth = image.width; // 图片的原始宽度
                    imageHeight = image.height; // 图片的原始高度

                    var he = true;
                    var wi = true;
                    if (imageWidth > imageHeight) {
                        if (AreaWidth / imageWidth*imageHeight < ThisHeight) {
                            he = false;
                        }
                    } else {
                        if (AreaWidth / imageHeight*imageWidth < ThisWidth) {
                            wi = false;
                        }
                    }

                    if (he && wi) {

                        // 激活功能
                        Switch(true);

                        // 初始化图片
                        InitImage(imageWidth, imageHeight, image.src);

                        // 截取区域大小初始化
                        // RemovalSizeSet(50, 50);

                        // 数据初始化
                        InitData();

                        // 截取区域最大
                        if (imgConWidth > imgConHeight) {
                            RemovalSizeSet(imgConHeight, imgConHeight);
                        } else {
                            RemovalSizeSet(imgConWidth, imgConWidth);
                        }

                        if (ThisWidth > ThisHeight) {
                            CanvasWidth = AreaWidth;
                            CanvasHeight = ThisHeight / ThisWidth * AreaWidth;
                        } else {
                            CanvasHeight = AreaWidth;
                            CanvasWidth = ThisWidth / ThisHeight * AreaWidth;
                        }
                        // canvas大小设置
                        CanvasSizeInit(CanvasWidth, CanvasHeight);

                        // 重置截取区域位置
                        RemovalPositionSet(0, 0, ThisWidth, ThisHeight);

                        if (ThisWidthMax > ThisHeightMax) {
                            SchLeft = (SchParentWidth / ThisWidthMax) * ThisWidth;
                        } else {
                            SchLeft = (SchParentWidth / ThisHeightMax) * ThisWidth;
                        }
                        // 进度条位置初始化
                        RippleScrollBarPositionSet(SchLeft);

                        // 截取图片
                        IonImg();
                    } else {
                        SetTipsText("图片长宽比例超过限制");
                    }
                }
            }
        } else {
            SetTipsText("图片大小超过限制");
        }
    });

    // 鼠标是否在截取区域中按下
    var jCaeMb = document.querySelectorAll('.j-cae-mb');
    jCaeMb[0].addEventListener('mousedown', function (ev) {
        ThisConMou = true;
        // 鼠标在选中区中的位置
        var text = jCaeMb[0].style.transform;
        var translateX = Number(text.substring(text.indexOf('(') + 1, text.indexOf('p')));
        var translateY = Number(text.substring(text.lastIndexOf(',') + 1, text.lastIndexOf('p')));
        ClaRangeTop = ev.pageY - getElementTop(this) - translateY;
        ClaRangeLeft = ev.pageX - getElementLeft(this) - translateX;
    });

    // 截取区域拖动效果
    var jCaeCo = document.querySelectorAll('.j-cae-co');
    jCaeCo[0].addEventListener('mousemove', function (ev) {
        var ThisBottom = 0; // 截取区域距离拖动区间底部的距离
        var ThisRight = 0; // 截取区域距离拖动区间右部的距离
        if (ThisConMou) {
            ThisBottom = ParenHeight- ThisTop - ThisHeight; // 截取区域底部距离拖动区间顶部的距离
            ThisRight = ParenWidth - ThisLeft - ThisWidth; // 截取区域右部距离拖动区间左部的距离
            if (Rotate % 360 == 0) {
                ThisTop = ev.pageY - ParentTop - ClaRangeTop;
                ThisLeft = ev.pageX - ParentLeft - ClaRangeLeft;
            } else if (Rotate % 360 == -90 || Rotate % 360 == 270) {
                ThisTop = ev.pageX - ParentLeft - ClaRangeLeft;
                ThisLeft = ParenWidth- (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
            } else if (Rotate % 360 == -180 || Rotate % 360 == 180) {
                ThisTop = ParenHeight - (ev.pageY - ParentTop - ClaRangeTop) - ThisHeight;
                ThisLeft = ParenWidth- (ev.pageX - ParentLeft - ClaRangeLeft) - ThisWidth;
            } else if (Rotate % 360 == -270 || Rotate % 360 == 90) {
                ThisTop = ParenHeight - (ev.pageX - ParentLeft - ClaRangeLeft) - ThisHeight;
                ThisLeft = ev.pageY - ParentTop - ClaRangeTop;
            }
            if (ThisTop <= 0) ThisTop = 0;
            if (ThisLeft <= 0) ThisLeft = 0;
            if (ThisRight < 0) ThisLeft = ParenWidth - ThisWidth;
            if (ThisBottom < 0) ThisTop = ParenHeight - ThisHeight;
            // 截取区域位置设置
            RemovalPositionSet(ThisTop, ThisLeft, ThisWidth, ThisHeight);
        }
    });

    // 当鼠标抬起时截取图片
    document.addEventListener('mouseup', function () {
        ThisConMou = false;
        SchMou = false;

        // 截取图片
        // 截取越界重置
        if (ThisTop < 0) ThisTop = 0;
        if (ThisTop > ParenHeight - ThisHeight) ThisTop = ParenHeight - ThisHeight;
        if (ThisLeft < 0) ThisLeft = 0;
        if (ThisLeft > ParenWidth - ThisWidth) ThisLeft = ParenWidth - ThisWidth;
        // 截取图片
        IonImg();
    });

    // 向左转
    var jTurnLeft = document.querySelectorAll('.j-turn-left');
    jTurnLeft[0].addEventListener('click', function () {
        var state = this.attributes.caeActive.value;
        if (state === 'true') {
            Rotate -= 90;

            // 旋转
            RotateDirection(Rotate);

            // 数据初始化
            InitData();

            ctx.translate(AreaWidth / 2, AreaWidth / 2);
            ctx.rotate(-90 * Math.PI / 180);
            ctx.translate(-AreaWidth / 2, -AreaWidth / 2);
            // 截取图片
            IonImg();
        }
    });

    // 向右转
    var jTurnRight = document.querySelectorAll('.j-turn-right');
    jTurnRight[0].addEventListener('click', function () {
        var state = this.attributes.caeActive.value;
        if (state === 'true') {
            Rotate += 90;
            // 旋转
            RotateDirection(Rotate);

            // 数据初始化
            InitData();

            // 取得截取坐标
            ctx.translate(AreaWidth / 2, AreaWidth / 2);
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-AreaWidth / 2, -AreaWidth / 2);
            // 截取图片
            IonImg();
        }
    });

    // 缩放
    var jCaeSchBtn = document.querySelectorAll('.j-cae-sch-btn');
    jCaeSchBtn[0].addEventListener('mousedown', function (ev) {
        var state = this.attributes.caeActive.value;
        if (state === 'true') {
            SchMou = true;
            // 鼠标在选中区中的位置
            var text = jCaeSchBtn[0].style.transform;
            var translateX = Number(text.substring(text.indexOf('(') + 1, text.indexOf('p')));
            SchRangeLeft = ev.pageX - getElementLeft(jCaeSchBtn[0]) - translateX;
        }
    });

    // 进度条
    document.addEventListener('mousemove', function (ev) {
        SchLeft = ev.pageX - SchParentLeft - SchRangeLeft;
        // 更改截取区域大小
        if (SchMou && SchLeft <= SchParentWidth && SchLeft >= 0) {
            Scale = SchLeft / SchParentWidth;
            ThisWidth = ThisWidthMax * Scale;
            ThisHeight = ThisHeightMax * Scale;
            if (ThisWidth > (ParenWidth - ThisLeft)) ThisLeft = ParenWidth - ThisWidth;
            if (ThisHeight > (ParenHeight - ThisTop)) ThisTop = ParenHeight - ThisHeight;
            // 截取区域位置设置
            RemovalPositionSet(ThisTop, ThisLeft, ThisWidth, ThisHeight);
            // 截取区域大小设置
            RemovalSizeSet(ThisWidth, ThisHeight);
            // 进度条位置设置
            RippleScrollBarPositionSet(SchLeft);
        }
    });

    // 图片下载
    var jCaeDld = document.querySelectorAll('.j-cae-dld');
    jCaeDld[0].addEventListener('click', function () {
        var state = this.attributes.caeActive.value;
        if (state === 'true') ImageDown('png');
    });

    window.addEventListener('resize', function () {
        // 数据初始化
        InitData();
    });

    return {
        setRemovalSize : RemovalSizeSet, // 设置截取的大小(禁用)
        setRemovalImgSize : SetRemovalImgSize, // 设置截取区域的大小
        getImg : GetDataUrl, // 截取的图片的编码
        getSizeMax : SetImgSizeMax, // 设置上传图片的最大限制
        InitImage : InitImage, // 初始化图片
        InitDome : InitDome // 初始化dome
    }

})();

CanvasAvatar.getSizeMax(5024);
CanvasAvatar.setRemovalImgSize(210,210);
var caeSn = document.querySelectorAll('.cae-sn');
caeSn[0].addEventListener('click', function () {
    console.log(CanvasAvatar.getImg())
    // $(".j-cae-img").prop('src',CanvasAvatar.getImg().DataURL)
    // CanvasAvatar.InitDome();
});

