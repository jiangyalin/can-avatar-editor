$(function(){
	$("#input_img").change(function(){
		var file=this.files[0];//得到文件
		var reader=new FileReader();//新建空文件属性对象
		reader.readAsDataURL(file);//传入文件
		reader.onload=function(){
			var url=reader.result;//将得到的文件转成data64编码
			var image=new Image();//新建一个空的图片对象
			image.src=url;//将input得到的url赋值给新建的图片对象

			//选中图像居中
			$(".box_le_main").css({"width":"100%","height":"100%","top":"0","left":"0"});
			if(image.width<image.height){
				$(".box_le_img").addClass("my_img_hei").removeClass("my_img_wid");
			}else{
				$(".box_le_img").addClass("my_img_wid").removeClass("my_img_hei");
			}
			$(".box_le_img").attr("src",image.src);
			$(".box_le_main").width($(".j-img-back").width()).height($(".j-img-back").height())
				.css({"top":($(".box_le_ma").height()-$(".box_le_main").height())/2+"px","left":($(".box_le_ma").width()-$(".box_le_main").width())/2+"px"});
			$(".box_le_ma").css({"border-radius":"0px"});

			ThisWidth=$(".box_le_mb").width()+2;//截取区域width
			ThisHeight=$(".box_le_mb").height()+2;//截取区域height
			ParentTop=$(".box_le_main").offset().top;//移动区域所在的top位置
			ParentLeft=$(".box_le_main").offset().left;//移动区域所在的left位置
			ParenWidth=$(".box_le_main").width()-ThisWidth;//移动区域所在的宽度
			ParenHeight=$(".box_le_main").height()-ThisHeight;//移动区域所在的高度
		}
	})
	
	//声明拖动区域

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
	$(".box_le_mb").hover(function(){
		ThisConHover=true;
	},function(){
		ThisConHover=false;
	})
	$(".box_le_mb").mousedown(function(ev){
		ThisConMou=true;
		//鼠标在选中区中的位置
		ClaRangeTop=ev.pageY-$(this).offset().top;
		ClaRangeLeft=ev.pageX-$(this).offset().left;
	})
	$(".box_le_mb").mouseup(function(){
		ThisConMou=false;

		//截取图片
		var canvas=document.getElementById("canvas");
		var ctx=canvas.getContext("2d");
		var thisimg=document.getElementById("j-img-2");
		var theImage=new Image();
		theImage.src=$(".j-img-back").attr("src");
		//取得截取坐标
		var x=ThisLeft/$(".j-img-back").width()*theImage.width;
		var y=ThisTop/$(".j-img-back").height()*theImage.height;
		var thewidth=theImage.width/thisimg.width*ThisWidth;
		var theheight=theImage.height/thisimg.height*ThisHeight;
		ctx.drawImage(thisimg,x,y,thewidth,theheight, 0,0,180,180);

	})
	//截取区域拖动效果
	$(".box_le_mb").mousemove(function(ev){
		// console.log(ThisConMou,ThisConHover)
		if(ThisConMou==true && ThisConHover==true){
			ThisTop=ev.pageY-ParentTop-ClaRangeTop;
			ThisLeft=ev.pageX-ParentLeft-ClaRangeLeft;
			if(ThisTop>=0 && ThisTop<=ParenHeight && ThisLeft>=0 && ThisLeft<=ParenWidth){
				$(this).css("transform","translate("+ThisLeft+"px,"+ThisTop+"px)");
				$(".j-img-ago").css("clip","rect("+ThisTop+"px,"+(ThisLeft+ThisWidth)+"px,"+(ThisTop+ThisHeight)+"px,"+ThisLeft+"px)");
			}
		}
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
	$(".box_le_ma").mouseup(function () {
		ThisConMou=false;
		// ThisConHover=false;
		ThisSizeMou=false;
		// ThisSizeHover=false;
	})
	$(".box_le_ma").mousedown(function () {
		console.log(ThisConMou,ThisConHover,ThisSizeMou,ThisSizeHover)
	})
	$(document).mouseup(function () {
		ThisConMou=false;
		//截取图片
		var canvas=document.getElementById("canvas");
		var ctx=canvas.getContext("2d");
		var thisimg=document.getElementById("j-img-2");
		var theImage=new Image();
		theImage.src=$(".j-img-back").attr("src");
		//取得截取坐标
		var x=ThisLeft/$(".j-img-back").width()*theImage.width;
		var y=ThisTop/$(".j-img-back").height()*theImage.height;
		var thewidth=theImage.width/thisimg.width*ThisWidth;
		var theheight=theImage.height/thisimg.height*ThisHeight;
		console.log(x+"kkk"+y)
		ctx.drawImage(thisimg,x,y,thewidth,theheight, 0,0,180,180);
	})
})
