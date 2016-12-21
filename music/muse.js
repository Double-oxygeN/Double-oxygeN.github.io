function jukeBox() {
	this.vol = 72;
	this.nr = 0;
	this.MAX = 6;
	this.aud = new Array();
}

jukeBox.prototype = Object.create(Object.prototype,{
	loadMusic: {
		value:function() {
			console.groupCollapsed("LOAD MUSIC");
			for (var mn=0;mn<this.MAX;mn++) {
				this.aud[mn] = new Audio("mlist/" + (mn+1) + ".mp3");
				console.log(mn + " : " + this.aud[mn].canPlayType("audio/mp3"));
			}
			console.groupEnd();
		}
	},
	
	play: {
		value:function(bool) {
			if (bool) {
				this.allStop();
			}
			this.aud[this.nr].volume = this.vol/72;
			this.aud[this.nr].play();
		}
	},
	
	pause: {
		value:function() {
			this.aud[this.nr].pause();
		}
	},
	
	allStop: {
		value:function() {
			for (var mn=0;mn<this.MAX;mn++) {
				this.aud[mn].pause();
				this.aud[mn].currentTime = 0.0;
			}
		}
	},
	
	num: {
		value:function(nn) {
			rn = nn;
			while (rn<0) {
				rn += this.MAX;
			}
			while (rn >= this.MAX) {
				rn -= this.MAX;
			}
			return rn;
		}
	}
})

function Pos() {
	this.x = 0;
	this.y = 0;
	this.isSelected = false;
}
var mouse = new Pos();
function inMouse(lx,ty,w,h) {
	return lx < mouse.x && mouse.x < (lx + w) && ty < mouse.y && mouse.y < (ty + h);
}

function mouseMove(event) {
	var rect = event.target.getBoundingClientRect();
	mouse.x = event.clientX - rect.left;
	mouse.y = event.clientY - rect.top;
}

function mouseDown(event) {
	var ck = event.button;
	if (ck==0) {
		mouse.isSelected = true;
	}
}

function mouseUp(event) {
	var ck = event.button;
	if (ck==0) {
		mouse.isSelected = false;
	}
}

function touchStart(e) {
	var ct = e.changedTouches[0];
	mouse.x = ct.pageX - cv.offsetLeft;
	mouse.y = ct.pageY - cv.offsetTop;
	mouse.isSelected = true;
}
function touchMove(e) {
	var ct = e.changedTouches[0];
	mouse.x = ct.pageX - cv.offsetLeft;
	mouse.y = ct.pageY - cv.offsetTop;
}
function touchEnd(e) {
	mouse.isSelected = false;
}

var sel,playIt,anime;
function select(nu) {
	if (sel!=nu) {
		sel = nu;
		playIt = 0;
	}
}

var cv,ctx;
window.onload = function() {
	cv = document.getElementById('juke');
	cv.width = 800;
	cv.height = 650;
	ctx = cv.getContext('2d');
	
	cv.addEventListener('mousemove',mouseMove,true);
	cv.addEventListener('mousedown',mouseDown,true);
	cv.addEventListener('mouseup',mouseUp,true);
	
	if (window.TouchEvent) {
		cv.addEventListener('touchstart',touchStart,true);
		cv.addEventListener('touchmove',touchMove,true);
		cv.addEventListener('touchend',touchEnd,true);
		cv.addEventListener('touchcancel',touchEnd,true);
	}
	
	var fps = 1000 / 30;
	var run = true;
	
	var mode = 0;
	var gradient = null;
	var col = [255,128,64];
	var playmes = ["PLAY","STOP"];
	playIt = 0;
	sel = 0;
	var sc = 0;
	anime = [0,0];
	var met = null;
	
	var jb = new jukeBox();
	jb.loadMusic();
	var examin = new Array();
	var xhr = new XMLHttpRequest();
	xhr.onload = function(e) {
		examin = (xhr.responseText).split(/\r\n|\r|\n/);
	}
	xhr.open("GET","mlist/contents.txt");
	xhr.send(null);
	
	(function(){
		
		if(mode==0) {
			ctx.beginPath();
			ctx.clearRect(0,0,cv.width,cv.height);
			gradient = ctx.createLinearGradient(400,0,400,550);
			gradient.addColorStop(0, "rgb(128,128,128)");
			gradient.addColorStop(0.25, "rgb(32,32,32)");
			gradient.addColorStop(0.28, "rgb(240,240,240)");
			gradient.addColorStop(0.35, "rgb(128,128,128)");
			gradient.addColorStop(0.8, "rgb(64,64,64)");
			gradient.addColorStop(1, "rgb(128,128,128)");
			ctx.fillStyle = gradient;
			ctx.fillRect(0,0,cv.width,550);
			ctx.fillStyle = 'rgb(32,32,32)';
			ctx.fillRect(0,550,cv.width,cv.height - 550);
			ctx.fillStyle = 'rgb(216,216,32)';
			ctx.fillRect(350,130,360,80);
			ctx.fillRect(280,235,360,80);
			ctx.fillRect(210,340,360,80);
			ctx.globalAlpha = 0.3;
			ctx.fillRect(420,25,360,80);
			ctx.fillRect(140,445,360,80);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = 'rgb(216,54,0)';
			ctx.lineWidth = 3;
			ctx.strokeRect(350 - sel*70,130 + sel*105,360,80);
			gradient = ctx.createRadialGradient(140,150,1,140,150,100);
			gradient.addColorStop(0, "rgb(" + col[0].toString() +",0,0)");
			gradient.addColorStop(1, "rgb(" + col[0].toString() + ",128," + col[2].toString() + ")");
			ctx.fillStyle = gradient;
			ctx.arc(140,150,100,0,2*Math.PI,true);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = 'rgb(0,240,0)';
			ctx.font = "36pt 游ゴシック";
			ctx.fillText(playmes[playIt],80,168);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = 'rgb(0,0,0)';
			ctx.font = "20pt 游ゴシック";
			for (var i=-1;i<4;i++) {
				ctx.fillText(1+jb.num(sc + i),360 - 70 * i,160 + i * 105);
			}
			ctx.fillStyle = 'rgb(0,255,0)';
			ctx.font = "36px 游ゴシック";
			ctx.fillText(examin[jb.num(sc + sel)],800-anime[0],620);
			met = ctx.measureText(examin[jb.num(sc + sel)]);
			ctx.closePath();
			ctx.fill();
			anime[0] += 2;
			if (anime[0] > 810 + met.width) {
				anime[0] = 0;
			}
			
			if (mouse.isSelected) {
				if (inMouse(40,50,200,200)) {
					col = [64,128,255];
					if (playIt==0) {
						playIt = 1;
						jb.nr = jb.num(sel + sc);
						jb.play(true);
					} else {
						playIt = 0;
						jb.pause();
					}
				} else if (inMouse(420,25,360,80)) {
					sc--;
					playIt = 0;
					mode = 1;
				} else if (inMouse(350,130,360,80)) {
					select(0);
				} else if (inMouse(280,235,360,80)) {
					select(1);
				} else if (inMouse(210,340,360,80)) {
					select(2);
				} else if (inMouse(140,445,360,80)) {
					sc++;
					playIt = 0;
					mode = 2;
				}
				mouse.isSelected = false;
			} else {
				col = [255,128,64];
			}
		} else if (mode==1) {
			ctx.beginPath();
			ctx.clearRect(0,0,cv.width,cv.height);
			gradient = ctx.createLinearGradient(400,0,400,550);
			gradient.addColorStop(0, "rgba(128,128,128,1)");
			gradient.addColorStop(0.25, "rgba(32,32,32,1)");
			gradient.addColorStop(0.28, "rgba(240,240,240,1)");
			gradient.addColorStop(0.35, "rgba(128,128,128,1)");
			gradient.addColorStop(0.8, "rgba(64,64,64,1)");
			gradient.addColorStop(1, "rgba(128,128,128,1)");
			ctx.fillStyle = gradient;
			ctx.fillRect(0,0,cv.width,550);
			ctx.fillStyle = 'rgb(32,32,32)';
			ctx.fillRect(0,550,cv.width,cv.height - 550);
			ctx.fillStyle = 'rgb(216,216,32)';
			ctx.fillRect(350 - anime[1]*14/3,130 + anime[1]*7,360,80);
			ctx.fillRect(280 - anime[1]*14/3,235 + anime[1]*7,360,80);
			ctx.fillRect(210 - anime[1]*14/3,340 + anime[1]*7,360,80);
			ctx.globalAlpha = 0.3;
			ctx.fillRect(420 - anime[1]*14/3,25 + anime[1]*7,360,80);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = 'rgb(216,54,0)';
			ctx.lineWidth = 3;
			ctx.strokeRect(350 - sel*70,130 + sel*105,360,80);
			gradient = ctx.createRadialGradient(140,150,1,140,150,100);
			gradient.addColorStop(0, "rgba(" + col[0].toString() +",0,0,1)");
			gradient.addColorStop(1, "rgba(" + col[0].toString() + ",128," + col[2].toString() + ",1)");
			ctx.fillStyle = gradient;
			ctx.arc(140,150,100,0,2*Math.PI,true);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0,240,0,1)';
			ctx.font = "36pt 游ゴシック";
			ctx.fillText(playmes[playIt],80,168);
			ctx.closePath();
			ctx.fill();
			
			if(++anime[1] > 15) {
				anime[1] = 0;
				mode = 0;
			}
		} else if (mode==2) {
			ctx.beginPath();
			ctx.clearRect(0,0,cv.width,cv.height);
			gradient = ctx.createLinearGradient(400,0,400,550);
			gradient.addColorStop(0, "rgba(128,128,128,1)");
			gradient.addColorStop(0.25, "rgba(32,32,32,1)");
			gradient.addColorStop(0.28, "rgba(240,240,240,1)");
			gradient.addColorStop(0.35, "rgba(128,128,128,1)");
			gradient.addColorStop(0.8, "rgba(64,64,64,1)");
			gradient.addColorStop(1, "rgba(128,128,128,1)");
			ctx.fillStyle = gradient;
			ctx.fillRect(0,0,cv.width,550);
			ctx.fillStyle = 'rgb(32,32,32)';
			ctx.fillRect(0,550,cv.width,cv.height - 550);
			ctx.fillStyle = 'rgb(216,216,32)';
			ctx.fillRect(350 + anime[1]*14/3,130 - anime[1]*7,360,80);
			ctx.fillRect(280 + anime[1]*14/3,235 - anime[1]*7,360,80);
			ctx.fillRect(210 + anime[1]*14/3,340 - anime[1]*7,360,80);
			ctx.globalAlpha = 0.3;
			ctx.fillRect(140 + anime[1]*14/3,445 - anime[1]*7,360,80);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = 'rgb(216,54,0)';
			ctx.lineWidth = 3;
			ctx.strokeRect(350 - sel*70,130 + sel*105,360,80);
			gradient = ctx.createRadialGradient(140,150,1,140,150,100);
			gradient.addColorStop(0, "rgba(" + col[0].toString() +",0,0,1)");
			gradient.addColorStop(1, "rgba(" + col[0].toString() + ",128," + col[2].toString() + ",1)");
			ctx.fillStyle = gradient;
			ctx.arc(140,150,100,0,2*Math.PI,true);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0,240,0,1)';
			ctx.font = "36pt 游ゴシック";
			ctx.fillText(playmes[playIt],80,168);
			ctx.closePath();
			ctx.fill();
			
			if(++anime[1] > 15) {
				anime[1] = 0;
				mode = 0;
			}
		}
		
		if (run){
			setTimeout(arguments.callee, fps);
		}
	})();
};