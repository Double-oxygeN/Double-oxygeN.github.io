mp = null;
gp = null;
disp = "";
disp2 = "次の手 : \n";
cp = new Array();
k = new Array(-1, -1);
cou = new Array(0, 0, 0);
hoge = 0;
coord = new Array();
coordE = new Array();
large = 8;
easterEgg = "";
waitin = 18;
next = new Array(0, 0, 0);

function gtitle()
{
	var canvas = document.getElementById('gboard');
	var ctx = canvas.getContext('2d');
	mp = new MainPanel(canvas, ctx);
	document.getElementById('prev').style.display = "none";
	document.getElementById('next').style.display = "none";
	document.getElementById('matta').style.display = "none";
	st_start();
}

function MainPanel(canvas, ctx)
{
	this.canvas = canvas;
	this.ctx = ctx;
	this.method = 0;
	return this;
}

MainPanel.prototype.finish = function()
{
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
}

function st_start()
{
	mp.level = 1;
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);

	mp.ctx.font = "24px Baskerville";
	mp.ctx.textAlign = "center";
	mp.ctx.textBaseline = "middle";
	mp.ctx.fillStyle = "Black";
	mp.ctx.fillText("le PIDELE", mp.canvas.width / 2, mp.canvas.height / 2);
	
	disp = "(20/4/2016 updated) このテキストボックスが編集されると以降のメッセージが出なくなるバグを解消しました。加えて，このテキストボックスに棋譜のテキストを入力してDATALOADボタンを押すと，START時に棋譜を再現できるようになりました。テキストには\"1 :\"といった手数の表示も必要です(対局中の棋譜をCOPY & PASTEするのであれば問題ありません)。\n(27/4/2016 updated) 盤面の大きさを変更できるようになりました。チュートリアルの誤動作を解消しました。";
	document.kif.tea.value = disp;
}

function pregame()
{
	firstSel = document.forms.sengo.first.selectedIndex;
	secondSel = document.forms.sengo.second.selectedIndex;
	largeS = document.forms.sengo.large.selectedIndex;
	cp[1] = document.forms.sengo.first.options[firstSel].value;
	cp[0] = document.forms.sengo.first.options[secondSel].value;
	large = document.forms.sengo.large.options[largeS].value;
	
	gp = new GamePanel();

	gp.draw();

	mp.canvas.addEventListener("click", gp.mouseClick);

	document.getElementById('pregame').style.display = "none";
	document.getElementById('sengo').style.display = "none";
	document.getElementById('tutor').style.display = "none";
	document.getElementById('kif').style.display = "none";
	document.getElementById('large').style.display = "none";
	
	hoge = 15;
	if ((easterEgg == "s") || (easterEgg == "A") || (easterEgg == "r")) {
		waitin = 1;
		master = setInterval("computerMaster()",1);
	} else {
		master = setInterval("computerMaster()",50);
	}
}


function tutorial()
{
	tgp = new TutorialPanel();
	
	tgp.draw();
	
	// mp.canvas.addEventListener("click", tgp.mouseClick);
	
	document.getElementById('pregame').style.display = "none";
	document.getElementById('sengo').style.display = "none";
	document.getElementById('tutor').style.display = "none";
	document.getElementById('next').style.display = "";
	document.getElementById('kif').style.display = "none";
	document.getElementById('large').style.display = "none";
}

function GamePanel()
{
	disp = "よろしくお願いします。\n";
	document.kif.tea.value = disp;
	
	this.sz = (432 / large) - 3;
	this.gap = 3;
	this.b_w = -1; // 手番
	this.trn = 1;
	this.repTrn = new Array(1, 0, 0, 0);
	this.tScore = 0;
	 // 盤面の状態 0 : blank, -1 : black, 1 : white
	this.st = new Array();
	this.dst1 = new Array();
	this.dst2 = new Array();
	this.dst3 = new Array();
	this.hidst = new Array();
	this.appst = new Array();
	this.negst = new Array();
	for (var i=0; i < large; i++) {
		this.st[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.dst1[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.dst2[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.dst3[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.hidst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.appst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.negst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	
	return this;
}

function computerMaster()
{
	if (coord[1] != null) {
		gp.kifKif();
	}
	hoge++; 
	if (hoge >= waitin) {
		if (cp[(gp.trn % 2)] != 0) {
			gp.computer1();
		}
		hoge = 0;
	}
	if (gp.trn > large * large) {
		gp.winner();
	}
}

function TutorialPanel()
{
	disp = "これからこのゲームの説明をしていきます。\nNEXTボタンを押して次に進んでください。";
	document.kif.tea.value = disp;
	
	this.sz = 51;
	this.gap = 3;
	this.trn = 0;
	this.st = new Array(); // 盤面の状態 0 : blank, -1 : black, 1 : white
	for (var i=0; i < large; i++) {
		this.st[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	return this;
}

GamePanel.prototype.mouseClick = function(event)
{
	hoge = 0;
	
	for (var j1=0; j1 < large; j1++) {
		for (var j2=0; j2 < large; j2++) {
			gp.dst1[j1][j2] = gp.st[j1][j2];
		}
	}
	
	if ((cp[0] * cp[1]) == 0) {
		var x_base = mp.canvas.offsetLeft;
		var y_base = mp.canvas.offsetTop;
		var x = event.pageX - x_base;
		var y = event.pageY - y_base;
		for (var i=0; i < 9; i++) {
			gp.hidst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
			gp.appst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
			gp.negst[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
	
		for (var i1 = 0; i1 < large; i1++) {
			if (y >= gp.gap + i1 * (gp.gap + gp.sz) && y <= (i1 + 1)*(gp.gap + gp.sz)) {
				k[0] = i1;
				break;
			}	
		}
		for (var i1 = 0; i1 < large; i1++) {
			if (x >= gp.gap + i1 * (gp.gap + gp.sz) && x <= (i1 + 1)*(gp.gap + gp.sz)) {
				k[1] = i1;
				break;
			}
		}
	
		if (gp.st[k[0]][k[1]] == 0){
			if (gp.trn < 7) {
				gp.fuseki(k);
			} else {
				disp += gp.trn + " : ";
				gp.piikpidela(k);
				gp.puuthpidela(k);
				gp.pooetpidela(k);
				gp.trn++;
				if (gp.trn % 2 == 0) {
					gp.b_w = 1;
				} else {
					gp.b_w = -1;
				}
				disp += "\n";
			}
			document.kif.tea.value = disp;
		} else {
			alert("そこには置けません");
		}
	}
	
	if ((gp.trn == 2) || (gp.trn == 3)) {
		document.getElementById('matta').style.display = "";
	}
}

GamePanel.prototype.piikpidela = function(k)
{
	gp.st[k[0]][k[1]] = gp.b_w;
	gp.draw();
	
	if (gp.b_w < 0) {
		disp += "F";
	} else {
		disp += "S";
	}
	gp.letr1(k);
	
}

GamePanel.prototype.puuthpidela = function(k)
{
	var puuth = 0;
	var cntr = 0;

	for (var i1 = 0; i1 < large; i1++) {
		for (var i2 = 0; i2 < large; i2++) {
			if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2)
				puuth += gp.st[i1][i2];
				
		}
	}

	if (puuth * gp.b_w >= 0) {
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2 && gp.st[i1][i2] * gp.b_w < 0) {
					gp.st[i1][i2] = gp.b_w;
					gp.hidst[i1][i2] = (i1 - k[0] + 1) * 3 + i2 - k[1] + 2;
					var gottn = new Array(i1, i2);
					if (cntr == 0) {
						disp += " x";
						cntr++;
					} else {
						disp += ",";
					}
					gp.letr1(gottn);
				}
			}
		}
	}

	gp.draw();

}

GamePanel.prototype.fuseki = function(k)
{
	gp.st[k[0]][k[1]] = gp.b_w;
	
	var puuth = 0;
	var c = 0;
	
	for (var i1 = 0; i1 < large; i1++) {
		for (var i2 = 0; i2 < large; i2++) {
			if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2)
				puuth += gp.st[i1][i2];
		}
	}
	
	if (puuth * gp.b_w >= 0) {
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2 && gp.st[i1][i2] * gp.b_w < 0) {
					c++;
				}
			}
		}
	}
	
	if (c != 0) {
		alert("6手目までは攻撃禁止です");
		gp.st[k[0]][k[1]] = 0;
	} else {
		disp += gp.trn + " : ";
		gp.draw();
		if (gp.b_w < 0) {
			disp += "F";
		} else {
			disp += "S";
		}
		gp.letr1(k);
		gp.trn++;
		if (gp.trn % 2 == 0) {
			gp.b_w = 1;
		} else {
			gp.b_w = -1;
		}
		disp += "\n";
	}
}

GamePanel.prototype.pooetpidela = function(k)
{
	// alert("pooet");
	do {
		var ex = 0;
		var pooet = 0;
	
		//alert("!");
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				pooet = 0;
				if (gp.hidst[i1][i2] != 0) {
					ex = 1;
					for (var i3 = 0; i3 < large; i3++) {
						for (var i4 = 0; i4 < large; i4++) {
							if (Math.abs(i1 - i3) < 2 && Math.abs(i2 - i4) < 2) {
								pooet += gp.st[i3][i4];
								// alert("pooet = "+pooet);
							}
						}
					}
				}
				if (pooet * gp.b_w >= 0) {
					switch(gp.hidst[i1][i2]){
						case 1:
							if (i1 != 0 && i2 != 0) {
								if (gp.st[i1 - 1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2 - 1] = gp.b_w;
									gp.negst[i1 - 1][i2 - 1] = 1;
								}
							}
							break;
						case 2:
							if (i1 != 0) {
								if (gp.st[i1 - 1][i2] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2] = gp.b_w;
									gp.negst[i1 - 1][i2] = 2;
								}
							}
							break;
						case 3:
							if (i1 != 0 && (i2 - large + 1) != 0) {
								if (gp.st[i1 - 1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2 + 1] = gp.b_w;
									gp.negst[i1 - 1][i2 + 1] = 3;
								}
							}
							break;
						case 4:
							if (i2 != 0) {
								if (gp.st[i1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1][i2 - 1] = gp.b_w;
									gp.negst[i1][i2 - 1] = 4;
								}
							}
							break;
						case 6:
							if (i2 - large + 1 != 0) {
								if (gp.st[i1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1][i2 + 1] = gp.b_w;
									gp.negst[i1][i2 + 1] = 6;
								}
							}
							break;
						case 7:
							if ((i1 - large + 1) != 0 && i2 != 0) {
								if (gp.st[i1 + 1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2 - 1] = gp.b_w;
									gp.negst[i1 + 1][i2 - 1] = 7;
								}
							}
							break;
						case 8:
							if (i1 - large + 1 != 0) {
								if (gp.st[i1 + 1][i2] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2] = gp.b_w;
									gp.negst[i1 + 1][i2] = 8;
								}
							}
							break;
						case 9:
							if ((i1 - large + 1) != 0 && (i2 - large + 1) != 0) {
								if (gp.st[i1 + 1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2 + 1] = gp.b_w;
									gp.negst[i1 + 1][i2 + 1] = 9;
								}
							}
							break;
					}
				}
				gp.hidst[i1][i2] = 0;
			}
		}
	
		for (var i5 = 0; i5 < large; i5++) {
			for (var i6 = 0; i6 < large; i6++) {
				if (gp.appst[i5][i6] != 0) {
					gp.st[i5][i6] = gp.appst[i5][i6];
					gp.appst[i5][i6] = 0;
					var gotn = new Array(i5, i6);
					disp += ",";
					gp.letr1(gotn);
				}
			}
		}
	
		gp.draw();
		// alert("ex = "+ex);
		for (var i7 = 0; i7 < large; i7++) {
			for (var i8 = 0; i8 < large; i8++) {
				gp.hidst[i7][i8] = gp.negst[i7][i8];
				gp.negst[i7][i8] = 0;
			}
		}
	} while (ex != 0);
		
}

GamePanel.prototype.letr1 = function(k)
{
	var kx = k[1] + 1;
	var kxx = "" + kx;
	if (kx == 10) {
		kxx = "X";
	} else if (kx == 11) {
		kxx = "E";
	} else if (kx == 12){
		kxx = "0";
	}
	disp += kxx;
	switch (k[0]) {
		case 0: disp += "a"; break;
		case 1: disp += "b"; break;
		case 2: disp += "c"; break;
		case 3: disp += "d"; break;
		case 4: disp += "e"; break;
		case 5: disp += "f"; break;
		case 6: disp += "g"; break;
		case 7: disp += "h"; break;
		case 8: disp += "i"; break;
		case 9: disp += "j"; break;
		case 10: disp += "k"; break;
		case 11: disp += "l"; break;
	}
}

GamePanel.prototype.letr2 = function(k)
{
	var kx = k[1] + 1;
	var kxx = "" + kx;
	if (kx == 10) {
		kxx = "X";
	} else if (kx == 11) {
		kxx = "E";
	} else if (kx == 12){
		kxx = "0";
	}
	disp2 += kxx;
	switch (k[0]) {
		case 0: disp2 += "a"; break;
		case 1: disp2 += "b"; break;
		case 2: disp2 += "c"; break;
		case 3: disp2 += "d"; break;
		case 4: disp2 += "e"; break;
		case 5: disp2 += "f"; break;
		case 6: disp2 += "g"; break;
		case 7: disp2 += "h"; break;
		case 8: disp2 += "i"; break;
		case 9: disp2 += "j"; break;
		case 10: disp2 += "k"; break;
		case 11: disp2 += "l"; break;
	}
}

GamePanel.prototype.winner = function()
{
	gp.tScore = 0;
	
	for (var j1 = 0; j1 < large; j1++) {
		for ( var j2 = 0; j2 < large; j2++) {
		gp.tScore += gp.st[j1][j2];
		}
	}
	
	gp.letr2(next);
	if (gp.tScore < 0) {
		gp.tScore = -gp.tScore;
		if (cp[1] == 0) {
			disp += gp.tScore + "枚差で先手(PLAYER)の勝ちです。";
		} else {
			disp += gp.tScore + "枚差で先手(COM)の勝ちです。";
		}
		gp.repTrn[1]++;
		disp2 += " - 黒" + gp.tScore + "\n";
	} else if (gp.tScore > 0) {
		if (cp[0] == 0) {
			disp += gp.tScore + "枚差で後手(PLAYER)の勝ちです。";
		} else {
			disp += gp.tScore + "枚差で後手(COM)の勝ちです。";
		}
		gp.repTrn[2]++;
		disp2 += " - 白" + gp.tScore + "\n";
	} else if (gp.tScore == 0) {
		disp += "引き分けです。";
		gp.repTrn[3]++;
		disp2 += " - 引分" + gp.tScore + "\n";
	}
	document.kif.tea.value = disp;
	
	if (easterEgg != "r") {
		alert("終局です");
		clearInterval(master);
	} else if (gp.repTrn[0] < 100){
		gp.trn = 1;
		gp.b_w = -1;
		gp.repTrn[0]++;
		disp = "" + gp.repTrn[0] + "\n";
		for (var i=0; i < large; i++) {
			this.st[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		}
		for (var j=0; j <= 144; j++) {
			coord[j] = coordE[j];
		}
	} else {
		alert("結果が出ました。")
		clearInterval(master);
		
		disp2 += "先手勝 : 後手勝 : 引分け = " + gp.repTrn[1] + " : " + gp.repTrn[2] + " : " + gp.repTrn[3];
		document.kif.tea.value = disp2;
	}
}

function matta()
{
	for (var j1=0; j1 < large; j1++) {
		for (var j2=0; j2 < large; j2++) {
			gp.st[j1][j2] = gp.dst1[j1][j2];
		}
	}
	
	gp.trn--;
	if (gp.trn % 2 == 0) {
		gp.b_w = 1;
	} else {
		gp.b_w = -1;
	}
	disp = disp.replace(gp.trn + " : ", "待った -> ");
	gp.draw();
	document.kif.tea.value = disp;
	document.getElementById('matta').disabled = true;
}

GamePanel.prototype.draw = function()
{
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
	mp.ctx.beginPath();
	mp.ctx.fillStyle = "rgb(0, 0, 0)";
	mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height);
	mp.ctx.fill();

	for (var i1 = 0; i1 < large; i1++) {
		for (var i2 = 0; i2 < large; i2++) {
			var x = gp.gap + i2 * (gp.sz + gp.gap);
			var y = gp.gap + i1 * (gp.sz + gp.gap);
			mp.ctx.beginPath();
			mp.ctx.fillStyle = "rgb(0, 192, 0)";
			mp.ctx.fillRect(x, y, gp.sz, gp.sz);
			mp.ctx.fill();
			if (gp.st[i1][i2] != 0) {
				x += Math.floor(gp.sz / 2);
				y += Math.floor(gp.sz / 2);
				if (gp.st[i1][i2] < 0)
					mp.ctx.fillStyle = "rgb(0, 0, 0)";
				else
					mp.ctx.fillStyle = "rgb(256, 256, 256)";
				mp.ctx.arc(x, y, Math.floor(gp.sz / 2) - 2, 0, 2 * Math.PI);
				mp.ctx.fill();
			}
		}
	}
}

TutorialPanel.prototype.draw = function()
{
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
	mp.ctx.beginPath();
	mp.ctx.fillStyle = "rgb(0, 0, 0)";
	mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height);
	mp.ctx.fill();

	for (var i1 = 0; i1 < 8; i1++) {
		for (var i2 = 0; i2 < 8; i2++) {
			var x = tgp.gap + i2 * (tgp.sz + tgp.gap);
			var y = tgp.gap + i1 * (tgp.sz + tgp.gap);
			mp.ctx.beginPath();
			mp.ctx.fillStyle = "rgb(0, 192, 0)";
			mp.ctx.fillRect(x, y, tgp.sz, tgp.sz);
			mp.ctx.fill();
			if (tgp.st[i1][i2] != 0) {
				x += Math.floor(tgp.sz / 2);
				y += Math.floor(tgp.sz / 2);
				if (tgp.st[i1][i2] < 0)
					mp.ctx.fillStyle = "rgb(0, 0, 0)";
				else
					mp.ctx.fillStyle = "rgb(255, 255, 255)";
				mp.ctx.arc(x, y, Math.floor(tgp.sz / 2) - 2, 0, 2 * Math.PI);
				mp.ctx.fill();
			}
		}
	}
}

//以下，COMのコード

GamePanel.prototype.kifKif = function(){
	var trr = "";
	var y = 0;
	var x = 0;
	var xC = "";
	for (var i=1; i<=large * large; i++){
		if (coord[i] == null) {
			break;
		}
		
		trr = coord[i].charAt(0);
		yC = coord[i].charAt(1);
		xC = coord[i].charAt(2);
		
		switch (xC) {
			case "a": x = 0; break;
			case "b": x = 1; break;
			case "c": x = 2; break;
			case "d": x = 3; break;
			case "e": x = 4; break;
			case "f": x = 5; break;
			case "g": x = 6; break;
			case "h": x = 7; break;
			case "i": x = 8; break;
			case "j": x = 9; break;
			case "k": x = 10; break;
			case "l": x = 11; break;
		}
		
		switch (yC) {
			case "X": y = 10; break;
			case "E": y = 11; break;
			case "0": y = 12; break;
			default: y = parseInt(yC); break;
		}
		
		if (trr == "F") {
			gp.b_w = -1;
		} else if (trr == "S") {
			gp.b_w = 1;
		}
		
		k = [x, y - 1];
		// alert("" + x + y);
		
		disp += gp.trn + " : ";
		gp.piikpidela(k);
		gp.puuthpidela(k);
		gp.pooetpidela(k);
		gp.trn++;
		if (gp.trn % 2 == 0) {
			gp.b_w = 1;
		} else {
			gp.b_w = -1;
		}
		disp += "\n";
		
		coordE[i] = coord[i];
		coord[i] = null;
	}
	
	document.kif.tea.value = disp;
}

GamePanel.prototype.computer1 = function(){
	var i = 0;
	while (i == 0) {	
		if (gp.trn < 7) {
			var rCp1x = Math.floor(Math.random() * large);
			var rCp1y = Math.floor(Math.random() * large);
			k = [rCp1y, rCp1x];
		} else {
			gp.cpSelect1();
		}
		
		if (gp.st[k[0]][k[1]] == 0){
			if (gp.trn < 7) {
				gp.fuseK(k);
				if (gp.st[k[0]][k[1]] != 0){
					i++;
					if (gp.trn == next[2] + 1) {
						next[0] = k[0];
						next[1] = k[1];
					}
				}
			} else {
				disp += gp.trn + " : ";
				gp.piikpidela(k);
				gp.puuthpidela(k);
				gp.pooetpidela(k);
				gp.trn++;
				if (gp.trn % 2 == 0) {
					gp.b_w = 1;
				} else {
					gp.b_w = -1;
				}
				disp += "\n";
				
				i++;
				if (gp.trn == next[2] + 1) {
						next[0] = k[0];
						next[1] = k[1];
				}
			}
			document.kif.tea.value = disp;
		}
	}
}

GamePanel.prototype.cpSelect1 = function() {
	for (var j1=0; j1 < large; j1++) {
		for (var j2=0; j2 < large; j2++) {
			gp.dst1[j1][j2] = gp.st[j1][j2];
		}
	}
	
	cou[0] = 0;
	var best = -100;
	var rr = 0;
	var bestCoord = new Array();
	bestCoord[0] = new Array();
	bestCoord[1] = new Array();
	var a = new Array(0, 0);
	var checkN = 0;
	
	for (var i1=0; i1 < large; i1++) {
		for (var i2=0; i2 < large; i2++) {
			if (gp.dst1[i1][i2] == 0) {
				cou[0] = 0;
				a = [i1, i2];
				gp.piikSimu1(a, gp.dst1);
				cou[0] += gp.puuthSimu1(a, gp.dst1);
				cou[0] += gp.pooetSimu1(a, gp.dst1);
				
				if (cp[(gp.trn % 2)] >= 3) {
					cou[0] -= gp.cpSelect2();
				}
				
				if (cp[(gp.trn % 2)] == 2) {
					if ((cou[0] < 5) && (cou[0] > best)) {
						best = cou[0];
						checkN = 1;
						bestCoord[0][0] = i1;
						bestCoord[1][0] = i2;
					} else if (cou[0] == best) {
						bestCoord[0][checkN] = i1;
						bestCoord[1][checkN] = i2;
						checkN++;
					}
				} else {
					if (cou[0] > best) {
						best = cou[0];
						// alert("worse = " + cou[0]);
						checkN = 1;
						bestCoord[0][0] = i1;
						bestCoord[1][0] = i2;
					} else if (cou[0] == best) {
						bestCoord[0][checkN] = i1;
						bestCoord[1][checkN] = i2;
						checkN++;
					}
				}
				
				for (var i3=0; i3 < large; i3++) {
					for (var i4=0; i4 < large; i4++) {
						gp.dst1[i3][i4] = gp.st[i3][i4];
					}
				}
			}
		}
	}
	
	if (checkN < 1) {
		checkN = 1;
		bestCoord[0][0] = Math.floor(Math.random() * large);
		bestCoord[1][0] = Math.floor(Math.random() * large);
	}
	
	rr = Math.floor(Math.random() * checkN);
	
	//disp += "rand = " + rr + ", checkN = " + checkN + ", bC =  (" + bestCoord[1][rr] + "," + bestCoord[0][rr] + ")\n";
	
	k = [bestCoord[0][rr], bestCoord[1][rr]];
	if ((easterEgg == "v") || (easterEgg == "A")) {
		disp += "次の手の評価値 : " + best  + ", 候補 : " + checkN + "\n";
	}
}

GamePanel.prototype.cpSelect2 = function() {
	for (var l1=0; l1 < large; l1++) {
		for (var l2=0; l2 < large; l2++) {
			gp.dst2[l1][l2] = gp.dst1[l1][l2];
		}
	}
	
	gp.b_w *= -1;
	cou[1] = 0;
	var worst = 0;
	var b = new Array(0, 0);
	for (var k1=0; k1 < large; k1++) {
		for (var k2=0; k2 < large; k2++) {
			if (gp.dst2[k1][k2] == 0) {
				cou[1] = 0;
				b = [k1, k2];
				gp.piikSimu1(b, gp.dst2);
				cou[1] += gp.puuthSimu1(b, gp.dst2);
				cou[1] += gp.pooetSimu1(b, gp.dst2);
				
				if (cp[(gp.trn % 2)] >= 4) {
					cou[1] -= gp.cpSelect3();
				}
				
				if (cou[1] > worst) {
					worst = cou[1];
				}
				
				for (var k3=0; k3 < large; k3++) {
					for (var k4=0; k4 < large; k4++) {
						gp.dst2[k3][k4] = gp.dst1[k3][k4];
					}
				}
			}
		}
	}
	
	gp.b_w *= -1;
	return worst;
	
}

GamePanel.prototype.cpSelect3 = function() {
	for (var l1=0; l1 < large; l1++) {
		for (var l2=0; l2 < large; l2++) {
			gp.dst3[l1][l2] = gp.dst2[l1][l2];
		}
	}
	
	gp.b_w *= -1;
	cou[2] = 0;
	var better = 0;
	var b = new Array(0, 0);
	for (var k1=0; k1 < large; k1++) {
		for (var k2=0; k2 < large; k2++) {
			if (gp.dst3[k1][k2] == 0) {
				cou[2] = 0;
				b = [k1, k2];
				gp.piikSimu1(b, gp.dst3);
				cou[2] += gp.puuthSimu1(b, gp.dst3);
				cou[2] += gp.pooetSimu1(b, gp.dst3);
				
				if (cou[2] > better) {
					better = cou[2];
				}
				
				for (var k3=0; k3 < large; k3++) {
					for (var k4=0; k4 < large; k4++) {
						gp.dst3[k3][k4] = gp.dst2[k3][k4];
					}
				}
			}
		}
	}
	
	gp.b_w *= -1;
	
	return better;
	
}

GamePanel.prototype.piikSimu1 = function(k, arr)
{
	arr[k[0]][k[1]] = gp.b_w;
}

GamePanel.prototype.puuthSimu1 = function(k, arr)
{
	var puuth = 0;
	var cc = 0;

	for (var i1 = 0; i1 < large; i1++) {
		for (var i2 = 0; i2 < large; i2++) {
			if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2)
				puuth += arr[i1][i2];
		}
	}

	if (puuth * gp.b_w >= 0) {
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2 && arr[i1][i2] * gp.b_w < 0) {
					arr[i1][i2] = gp.b_w;
					cc++;
					gp.hidst[i1][i2] = (i1 - k[0] + 1) * 3 + i2 - k[1] + 2;
				}
			}
		}
	}
	
	return cc;
}

GamePanel.prototype.pooetSimu1 = function(k, arr)
{
	var cc = 0;
	do {
		var ex = 0;
		var pooet = 0;
	
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				pooet = 0;
				if (gp.hidst[i1][i2] != 0) {
					ex = 1;
					for (var i3 = 0; i3 < large; i3++) {
						for (var i4 = 0; i4 < large; i4++) {
							if (Math.abs(i1 - i3) < 2 && Math.abs(i2 - i4) < 2) {
								pooet += arr[i3][i4];
							}
						}
					}
				}
				if (pooet * gp.b_w >= 0) {
					switch(gp.hidst[i1][i2]){
						case 1:
							if (i1 != 0 && i2 != 0) {
								if (arr[i1 - 1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2 - 1] = gp.b_w;
									gp.negst[i1 - 1][i2 - 1] = 1;
								}
							}
							break;
						case 2:
							if (i1 != 0) {
								if (arr[i1 - 1][i2] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2] = gp.b_w;
									gp.negst[i1 - 1][i2] = 2;
								}
							}
							break;
						case 3:
							if (i1 != 0 && (i2 - large + 1) != 0) {
								if (arr[i1 - 1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1 - 1][i2 + 1] = gp.b_w;
									gp.negst[i1 - 1][i2 + 1] = 3;
								}
							}
							break;
						case 4:
							if (i2 != 0) {
								if (arr[i1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1][i2 - 1] = gp.b_w;
									gp.negst[i1][i2 - 1] = 4;
								}
							}
							break;
						case 6:
							if (i2 - large + 1 != 0) {
								if (arr[i1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1][i2 + 1] = gp.b_w;
									gp.negst[i1][i2 + 1] = 6;
								}
							}
							break;
						case 7:
							if ((i1 - large + 1) != 0 && i2 != 0) {
								if (arr[i1 + 1][i2 - 1] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2 - 1] = gp.b_w;
									gp.negst[i1 + 1][i2 - 1] = 7;
								}
							}
							break;
						case 8:
							if (i1 - large + 1 != 0) {
								if (arr[i1 + 1][i2] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2] = gp.b_w;
									gp.negst[i1 + 1][i2] = 8;
								}
							}
							break;
						case 9:
							if ((i1 - large + 1) != 0 && (i2 - large + 1) != 0) {
								if (arr[i1 + 1][i2 + 1] * gp.b_w < 0) {
									gp.appst[i1 + 1][i2 + 1] = gp.b_w;
									gp.negst[i1 + 1][i2 + 1] = 9;
								}
							}
							break;
					}
				}
				gp.hidst[i1][i2] = 0;
			}
		}
	
		for (var i5 = 0; i5 < large; i5++) {
			for (var i6 = 0; i6 < large; i6++) {
				if (gp.appst[i5][i6] != 0) {
					arr[i5][i6] = gp.appst[i5][i6];
					cc++;
					gp.appst[i5][i6] = 0;
				}
			}
		}
		for (var i7 = 0; i7 < large; i7++) {
			for (var i8 = 0; i8 < large; i8++) {
				gp.hidst[i7][i8] = gp.negst[i7][i8];
				gp.negst[i7][i8] = 0;
			}
		}
	} while (ex != 0);
		
	return cc;
}

GamePanel.prototype.fuseK = function(k)
{
	gp.st[k[0]][k[1]] = gp.b_w;
	
	var puuth = 0;
	var c = 0;
	
	for (var i1 = 0; i1 < large; i1++) {
		for (var i2 = 0; i2 < large; i2++) {
			if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2)
				puuth += gp.st[i1][i2];
		}
	}
	
	if (puuth * gp.b_w >= 0) {
		for (var i1 = 0; i1 < large; i1++) {
			for (var i2 = 0; i2 < large; i2++) {
				if (Math.abs(k[0] - i1) < 2 && Math.abs(k[1] - i2) < 2 && gp.st[i1][i2] * gp.b_w < 0) {
					c++;
				}
			}
		}
	}
	
	if (c != 0) {
		gp.st[k[0]][k[1]] = 0;
	} else {
		disp += gp.trn + " : ";
		gp.draw();
		if (gp.b_w < 0) {
			disp += "F";
		} else {
			disp += "S";
		}
		gp.letr1(k);
		gp.b_w = -gp.b_w;
		gp.trn++;
		disp += "\n";
	}
}

// 以下，チュートリアルのコード

function nextButton()
{
	tgp.trn++;
	showTutorial();
}

function prevButton()
{
	tgp.trn--;
	showTutorial();
}
function showTutorial()
{
	tgp.lane();
	document.kif.tea.value = disp;
	tgp.draw();
}

TutorialPanel.prototype.lane = function()
{
	eval("tgp.tutor" + tgp.trn + "();");
}

TutorialPanel.prototype.tutor1 = function()
{
	disp = "PIDELEでは，オセロのように8×8に区切られた盤と，表裏に異なる色の塗られた石(通常は白と黒)64枚を用意します。\n対局者は２人。先後を決め，お互いに挨拶を交わしてから始めましょう。";
	document.getElementById('prev').style.display = "none";
	
	tgp.st[5][1] = 0;
}

TutorialPanel.prototype.tutor2 = function()
{
	disp = "先手は(大抵の場合)黒を持ち石とします。先手の人は枠線の内に，黒を表にして石を置きます。\n置く位置に制限は基本的にはありません。作戦を立てて置きたいところに置きましょう。";
	
	tgp.st[5][1] = -1;
	tgp.st[2][5] = 0;
	document.getElementById('prev').style.display = "";
}

TutorialPanel.prototype.tutor3 = function()
{
	disp = "後手は(大抵の場合)白を持ち石とします。同様に白を表にして石を置きます。\nここで棋譜の読み方を説明します。\nPIDELEでは，まず先手番ならばF，後手番ならばSと書きます。\n続いて置いた石の座標ですが，左から右に1〜8，上から下にa〜hとします。\n最後にひっくり返した石の座標を，xに続けて書きます。";
	
	tgp.st[2][5] = 1;
	
}

TutorialPanel.prototype.tutor4 = function()
{
	disp = "例えば，先ほどの１手目は F2f，今置いた２手目は S6c，といった具合です。\n実戦では，棋譜は今この文章が書かれている枠内に自動的に表示されますので，是非ご活用ください。";
	
	tgp.st[3][4] = 0;
}

TutorialPanel.prototype.tutor5 = function()
{
	disp = "再び先手番です。このように，終局まで先後交互に石を置きます。\nここで先手は F5d と置こうとしますが，実はこれは反則手です。\n「６手目までは，相手の石をひっくり返すことのできるような手は禁止」というルールがあります。\nまずは，NEXTを押してどういう手がそれに当てはまるのかを見てみましょう。";
	
	tgp.st[5][1] = -1;
	tgp.st[2][5] = 1;
	tgp.st[3][4] = -1;
	tgp.st[4][5] = 0;
}

TutorialPanel.prototype.tutor6 = function()
{
	disp = "例えばこの状況の時，白石に隣接した位置に黒石を置いてみます。\n図は石が少なく見えますが，７手目以降の盤面であるとして考えてください。";
	
	tgp.st[5][1] = 0;
	tgp.st[2][5] = 0;
	tgp.st[3][4] = 0;
	tgp.st[4][4] = 0;
	tgp.st[4][5] = 1;
}

TutorialPanel.prototype.tutor7 = function()
{
	disp = "F5eと置きました。\nここで確認するのは，今置いた石と，その周囲8マスにある石の最大９つあるそれぞれの石の数です。\nこの場面では，計9マスの範囲内に白黒ともに1つずつの石があります。";
	
	tgp.st[4][4] = -1;
	tgp.st[4][5] = 1;
}

TutorialPanel.prototype.tutor8 = function()
{
	disp = "範囲内の自分の石の数が相手の石の数以上であるとき，その範囲内にある相手の石を全てひっくり返して自分のものにすることができます。\nこれを，ルール《集団》と言います。";
	
	tgp.st[3][4] = 0;
	tgp.st[4][5] = -1;
}

TutorialPanel.prototype.tutor9 = function()
{
	disp = "今度は S5d という手を打ちました。\n同様に範囲を考えると，白1つに対し黒2つなので，白番は黒石をひっくり返すことができません。\nこれは６手目までに打ってもひっくり返す手ではないので反則になりません。";
	
	tgp.st[2][3] = 0;
	tgp.st[3][4] = 1;
}

TutorialPanel.prototype.tutor10 = function()
{
	disp = "黒の F4c x5d という手です。\nひっくり返す石がある場合はこのように棋譜を書きます。";
	
	tgp.st[2][3] = -1;
	tgp.st[3][4] = -1;
	tgp.st[5][6] = 0;
	tgp.st[4][5] = -1;
}

TutorialPanel.prototype.tutor11 = function()
{
	disp = "続いて白番は S7f という手を打ちました。\nルール《集団》により，6eにある黒石がひっくり返ります。";
	
	tgp.st[5][6] = 1;
	tgp.st[4][5] = 1;
}

TutorialPanel.prototype.tutor12 = function()
{
	disp = "今ひっくり返した石について，それを中心に再び範囲を考えます。\n《集団》の時同様に，範囲内の自分の石の数が相手の石の数以上あるとき，さらに石をひっくり返すことができます。\nただし，ここでひっくり返せるのは，手番で置いた石から《集団》でひっくり返した石に伸びる半直線上の相手の石に限ります。\nここではひっくり返された 6e の石を中心に範囲を考え，白２枚黒２枚でさらにひっくり返せることがわかります。";
	
	tgp.st[3][4] = -1;
}

TutorialPanel.prototype.tutor13 = function()
{
	disp = "よってこのとき 5d にある黒石もひっくり返ります。\nこのルールが適用されるのは今ひっくり返された石全てのため，再び 5d を中心に範囲を考えると，同じようにその先もひっくり返せます。";
	
	tgp.st[2][3] = -1;
	tgp.st[3][4] = 1;
}

TutorialPanel.prototype.tutor14 = function()
{
	disp = "その先はないので，ここで手番が交代します。\nこのように，ひっくり返した石についてさらに石をひっくり返せるかという規則をルール《社会》と言います。\nこのようにして７手目以降は，相手の石を攻撃しひっくり返すことができます。\n実戦では，ここまでの規則を自動かつ一瞬で処理します。";
	
	tgp.st[0] = [0, 0, 0, 0, 0, 0, 0, 0];
	tgp.st[1] = [0, 0, 0, 0, 0, 0, 0, 0];
	tgp.st[2] = [0, 0, 0, 1, 0, 0, 0, 0];
	tgp.st[3] = [0, 0, 0, 0, 1, 0, 0, 0];
	tgp.st[4] = [0, 0, 0, 0, -1, 1, 0, 0];
	tgp.st[5] = [0, 0, 0, 0, 0, 0, 1, 0];
	tgp.st[6] = [0, 0, 0, 0, 0, 0, 0, 0];
	tgp.st[7] = [0, 0, 0, 0, 0, 0, 0, 0];
	
	document.getElementById('next').style.display = "";
}

TutorialPanel.prototype.tutor15 = function()
{
	disp = "最終的に64枚全ての石を置き終えた時点で，自分の石の枚数の多い方が勝ちとなります。\nこれでチュートリアルを終わります。\nページを更新し，まずはルールを自分で確認するためにも始めてみましょう。\n対戦し，ゲームの奥深さに気づくようになると，段々と面白くなっていくはずです。\n\n最後までご覧頂きありがとうございました。";
	
	tgp.st[0] = [1, 1, 1, 1, -1, -1, -1, 1];
	tgp.st[1] = [1, 1, 1, 1, -1, -1, -1, -1];
	tgp.st[2] = [1, 1, 1, -1, 1, -1, -1, -1];
	tgp.st[3] = [1, 1, 1, -1, -1, -1, -1, -1];
	tgp.st[4] = [1, 1, 1, 1, -1, -1, -1, -1];
	tgp.st[5] = [1, 1, 1, -1, 1, -1, -1, -1];
	tgp.st[6] = [1, 1, 1, 1, -1, -1, -1, -1];
	tgp.st[7] = [1, 1, 1, 1, -1, -1, 1, -1];
	
	document.getElementById('next').style.display = "none";
}

// 棋譜のロード
function dataload()
{
	var kif = document.kif.tea.value.toString();
	// alert (kif);
	
	var chrLocate = 0;
	for (var j=1; j <= 144; j++) {
		chrLocate = kif.indexOf(j + " : ");
		if (chrLocate < 0) {
			next[2] = j;
			break;
		} else if (j < 10) {
			coord[j] = kif.substr(chrLocate + 4, 3);
		} else if (j < 100){
			coord[j] = kif.substr(chrLocate + 5, 3);
		} else {
			coord[j] = kif.substr(chrLocate + 6, 3);
		}
	}
	
	chrLocate = kif.indexOf("special = ");
	if (chrLocate >= 0) {
		easterEgg = kif.charAt(chrLocate + 10);
	}
	
	alert ("棋譜を読み込みました。\n初手：" + coord[1] + "\n" + easterEgg);
}