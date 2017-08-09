# can-avatar-editor

基于canvas的图片编辑器

CanvasAvatar.getSizeMax(5024); // 设置用户选择的文件的最大大小（单位KB）

CanvasAvatar.setRemovalImgSize(210,210);

$(".cae-sn").click(function () {

    CanvasAvatar.InitDome(); // 初始化编辑器dom
    
    comsole.log(CanvasAvatar.getImg()); // 得到截取的图片对象
    
});
