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
			if(image.width<image.height){
				$(".j-img-back").addClass("my_img_hei").removeClass("my_img_wid");
				$(".j-img-ago").addClass("my_img_hei").removeClass("my_img_wid");
			}else{
				$(".j-img-back").addClass("my_img_wid").removeClass("my_img_hei");
				$(".j-img-ago").addClass("my_img_wid").removeClass("my_img_hei");
			}
			$(".j-img-back").attr("src",image.src);
			$(".j-img-ago").attr("src",image.src);
			$(".j-img-back").css({"top":($(".box_ri_main").height()-$(".j-img-back").height())/2+"px","left":($(".box_ri_main").width()-$(".j-img-back").width())/2+"px"});
			$(".j-img-ago").css({"top":($(".box_ri_main").height()-$(".j-img-back").height())/2+"px","left":($(".box_ri_main").width()-$(".j-img-back").width())/2+"px"});
			$(".box_le_main").css({"border-radius":"0px"});

		}
	})
	
	//声明拖动区域

	var ThisMou=false;//当前是否按下状态
	var ThisHover=false;//当前鼠标是否在元素上状态
	var ClaRangeTop=0;//鼠标在元素中的top位置
	var ClaRangeLeft=0;//鼠标在元素中的left位置
	var ParentTop=$(".box_le_main").offset().top;//移动区域所在的top位置
	var ParentLeft=$(".box_le_main").offset().left;//移动区域所在的left位置
	var ParenWidth=$(".box_le_main").width()-$(".box_le_mb").width();//移动区域所在的宽度
	var ParenHeight=$(".box_le_main").height()-$(".box_le_mb").height();//移动区域所在的高度
	$(".box_le_mb").hover(function(){
		ThisHover=true;
	},function(){
		ThisHover=false;
	})
	$(".box_le_mb").mousedown(function(ev){
		ThisMou=true;
		ClaRangeTop=ev.pageY-$(this).offset().top;
		ClaRangeLeft=ev.pageX-$(this).offset().left;
	})
	$(".box_le_mb").mouseup(function(ev){
		ThisMou=false;

		//截取图片
		var canvas=document.getElementById("canvas");
		var ctx=canvas.getContext("2d");
		var thisimg=document.getElementById("j-img-2");
		var theImage=new Image();
		theImage.src=$(".j-img-back").attr("src");
		//取得截取坐标
		var x=(ev.pageX-ParentLeft-ClaRangeLeft-($(".box_ri_main").width()-$(".j-img-back").width())/2)/$(".j-img-back").width()*theImage.width;
		var y=(ev.pageY-ParentTop-ClaRangeTop-($(".box_ri_main").height()-$(".j-img-back").height())/2)/$(".j-img-back").height()*theImage.height;
		var thewidth=theImage.width/thisimg.width*50;
		var theheight=theImage.height/thisimg.height*50;
		ctx.drawImage(thisimg,x,y,thewidth,theheight, 0,0,180,180);

	})
	$(".box_le_mb").mousemove(function(ev){
		if(ThisMou==true && ThisHover==true){
			var ThisTop=ev.pageY-ParentTop-ClaRangeTop;
			var ThisLeft=ev.pageX-ParentLeft-ClaRangeLeft;
			if(ThisTop>=0 && ThisTop<=ParenHeight || ThisLeft>=0 && ThisLeft<=ParenWidth){
				$(this).css("transform","translate("+ThisLeft+"px,"+ThisTop+"px)");
				$(".j-img-ago").css("clip","rect("+(ThisTop-($(".box_ri_main").height()-$(".j-img-back").height())/2)+"px,"+(ThisLeft+50-($(".box_ri_main").width()-$(".j-img-back").width())/2)+"px,"+(ThisTop+50-($(".box_ri_main").height()-$(".j-img-back").height())/2)+"px,"+(ThisLeft-($(".box_ri_main").width()-$(".j-img-back").width())/2)+"px)");
				console.log("ClaRangeTop=",ClaRangeTop)
				console.log("ClaRangeLeft=",ClaRangeLeft)
			}
		}
	})
})
