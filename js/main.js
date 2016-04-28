var video = document.getElementById("vid");
var can1 = document.getElementById("can1");
var can2 = document.getElementById("can2");
var canback = document.createElement("canvas")
var ctx1, ctx2, ctxback, lastTime = -1;

function doInvertImage(ctxSrc, ctxDst)
{
	var imgd = ctxSrc.getImageData(0, 0, video.clientWidth, video.clientHeight);
	var pix = imgd.data;

	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i  ] = 255 - pix[i  ]; // red
		pix[i+1] = 255 - pix[i+1]; // green
		pix[i+2] = 255 - pix[i+2]; // blue
		pix[i+3] = 255; // alpha
	}
	ctxDst.putImageData(imgd, 0, 0);
}

function doBlurImage(ctxSrc, ctxDst)
{
	var imgd = ctxSrc.getImageData(0, 0, video.clientWidth, video.clientHeight);
	StackBlur.imageDataRGBA(imgd, 0, 0, video.clientWidth, video.clientHeight, 3);
	ctxDst.putImageData(imgd, 0, 0);
}

function draw(e){
	var time = video.currentTime;
	//if (lastTime != time)
	{
		ctxback.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
		/* Invert color process */
		doInvertImage(ctxback, ctx1);
		/* Gaussian process */
		doBlurImage(ctxback, ctx2);
		lastTime = time;
	}//else{
	//	console.log("Same time");
	//}
	if (video.paused || video.ended) {
		console.log("Stopped!");
		return;
	}
	/* for better performance, use this function */
	requestAnimationFrame(draw);
}

function adjustCanvasSize(){
	can1.width = video.clientWidth;
	can1.height = video.clientHeight;
	ctx1 = can1.getContext("2d");
	can2.width = video.clientWidth;
	can2.height = video.clientHeight;
	ctx2 = can2.getContext("2d");
	canback.width = video.clientWidth;
	canback.height = video.clientHeight;
	ctxback = canback.getContext("2d");
}

function prepareFrame(e){
	adjustCanvasSize();
	// start drawing process
	draw();
}

video.addEventListener("play", prepareFrame);
video.addEventListener("seeked", prepareFrame);
video.addEventListener("canplay", adjustCanvasSize);