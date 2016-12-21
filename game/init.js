var cv;
var run = true;
const fps = 1000 / 48;
const MODE_SELECT = {
	"TITLE": 1,
	"OPTION": 2,
	"READ_KIF": 3,
	"GAMEPLAY": 4,
	"RESULT": 6,
	"TUTORIAL": 7,
	"CONNECTION": 8,
	"WAIT": 9
};
const PLAYER_TYPE = {
	"ONLINE": -1,
	"PLAYER": 0,
	"COM1": 1,
	"COM2": 2,
	"COM3": 3,
	"COM4": 4
};

function Config() {
	this.p1 = PLAYER_TYPE.PLAYER;
	this.p2 = PLAYER_TYPE.PLAYER;
	this.owntime = 10;
	this.sectime = 10;
	this.session = null;
	this.boardlarge = 8;
	this.you = -1;
}
Config.prototype = Object.create(Object.prototype, {
	succ: {
		value: function (mode) {
			var maxx = 3
			var mmm;
			if (window.sessionStorage) {
				mmm = window.sessionStorage.getItem("power_up");
				if (mmm === "energy") {
					maxx = 4;
				}
			} else if (this.session == "energy") {
				maxx = 4;
			}
			if (mode == 0) {
				if (++this.p1 > maxx) this.p1 = 0;
			}
			if (mode == 1) {
				if (++this.p2 > maxx) this.p2 = 0;
			}
			if (mode == 2) {
				switch (this.owntime) {
				case 10:
					this.owntime = Number.POSITIVE_INFINITY;
					break;
				case Number.POSITIVE_INFINITY:
					this.owntime = 3;
					break;
				case 3:
				default:
					this.owntime = 10;
					break;
				}
			}
			if (mode == 3) {
				switch (this.sectime) {
				case 10:
					this.sectime = 20;
					break;
				case 20:
					this.sectime = 0;
					break;
				case 0:
				default:
					this.sectime = 10;
					break;
				}
			}
			if (mode == 4) {
				if (++this.boardlarge > 12) this.boardlarge = 12;
			}
			if (mode == 5) {
				this.you *= -1;
			}
		}
	},

	prev: {
		value: function (mode) {
			var maxx = 3
			if (window.sessionStorage) {
				var mmm = window.sessionStorage.getItem("power_up");
				if (mmm === "energy") {
					maxx = 4;
				}
			}
			if (mode == 0) {
				if (--this.p1 < 0) this.p1 = maxx;
			}
			if (mode == 1) {
				if (--this.p2 < 0) this.p2 = maxx;
			}
			if (mode == 2) {
				switch (this.owntime) {
				case 3:
					this.owntime = Number.POSITIVE_INFINITY;
					break;
				case 10:
					this.owntime = 3;
					break;
				case Number.POSITIVE_INFINITY:
				default:
					this.owntime = 10;
					break;
				}
			}
			if (mode == 3) {
				switch (this.sectime) {
				case 0:
					this.sectime = 20;
					break;
				case 10:
					this.sectime = 0;
					break;
				case 20:
				default:
					this.sectime = 10;
					break;
				}
			}
			if (mode == 4) {
				if (--this.boardlarge < 4) this.boardlarge = 4;
			}
			if (mode == 5) {
				this.you *= -1;
			}
		}
	},

	dispText: {
		value: function (mode) {
			if (mode < 2) {
				var check = (mode < 1) ? this.p1 : this.p2;
				switch (check) {
				case PLAYER_TYPE.ONLINE:
					return "SOMEONE";
				case PLAYER_TYPE.PLAYER:
					return "PLAYER";
				case PLAYER_TYPE.COM1:
					return "COM(弱)";
				case PLAYER_TYPE.COM2:
					return "COM(中)";
				case PLAYER_TYPE.COM3:
					return "COM(強)";
				case PLAYER_TYPE.COM4:
					return "COM(兇)";
				default:
					return "?????";
				}
			}
			if (mode == 2) {
				if (isFinite(this.owntime)) {
					return this.owntime.toString() + " min.";
				}
				return "∞";
			}
			if (mode == 3) {
				return this.sectime.toString() + " sec.";
			}
			if (mode == 4) {
				return this.boardlarge;
			}
			if (mode == 5) {
				if (this.you < 0) {
					return "せんて";
				} else {
					return "ごて";
				}
			}
		}
	}
});

function Pos() {
	this.x = 0;
	this.y = 0;
	this.selected = false;
}
Pos.prototype = Object.create(Object.prototype, {
	isOverRect: {
		value: function (lx, ty, w, h) {
			return lx < this.x && this.x < (lx + w) && ty < mouse.y && mouse.y < (ty + h);
		}
	}
})
var mouse = new Pos();

function mouseMove(e) {
	var rect = e.target.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
}

function mouseDown(e) {
	switch (e.button) {
	case 0:
		mouse.selected = true;
		break;
	}
}

function mouseUp(e) {
	switch (e.button) {
	case 0:
		mouse.selected = false;
		break;
	}
}

function touchMove(e) {
	var ct = e.changedTouches[0];
	mouse.x = ct.pageX - cv.offsetLeft;
	mouse.y = ct.pageY - cv.offsetTop;
}

function touchStart(e) {
	var ct = e.changedTouches[0];
	mouse.x = ct.pageX - cv.offsetLeft;
	mouse.y = ct.pageY - cv.offsetTop;
	mouse.selected = true;
}

function touchEnd(e) {
	var ct = e.changedTouches[0];
	mouse.x = ct.pageX - cv.offsetLeft;
	mouse.y = ct.pageY - cv.offsetTop;
	mouse.selected = false;
}

function Grid(num) {
	this.num = num;
	this.value = new Array(num);
	for (var i = 0; i < num; i++) {
		this.value[i] = new Array(num);
		for (var j = 0; j < num; j++) {
			this.value[i][j] = 0;
		}
	}
}

Grid.prototype = Object.create(Object.prototype, {
	copy: {
		value: function () {
			var cp = new Grid(this.num);
			for (var i = 0; i < this.num; i++) {
				for (var j = 0; j < this.num; j++) {
					cp.value[i][j] = this.value[i][j];
				}
			}
			return cp;
		}
	}
});

function Board(num, owntime, sectime) {
	this.num = num;
	this.width = 420;
	this.height = 420;
	this.leftx = 0;
	this.topy = 0;
	this.line = 2;
	this.sz = (this.width - this.line * (num + 1)) / num;
	this.who = -1; // -1:first, 1:second
	this.turn = 1;
	this.stone = [0, 0];
	this.sectime = sectime;
	this.playtimer = false;
	this.timer = [owntime * 60, owntime * 60, sectime, sectime, 0];
	this.clock = 0;
	this.grid = new Grid(num);
	this.ugrid = new Grid(num);
	this.hist = new Array();
	this.isTurned = [true, false, false, false, false, false, false, false, false, false];
	this.kif = ["", 0];
}

Board.prototype = Object.create(Object.prototype, {
	around: {
		value: function (gx, gy) {
			var r = 0;
			for (var i0 = 0; i0 < this.num; i0++) {
				for (var i1 = 0; i1 < this.num; i1++) {
					if (Math.abs(i0 - gx) < 2 && Math.abs(i1 - gy) < 2) {
						r += this.grid.value[i0][i1];
					}
				}
			}
			return r;
		}
	},

	totaling: {
		value: function () {
			this.stone = [0, 0];
			for (var gx = 0; gx < this.num; gx++) {
				for (var gy = 0; gy < this.num; gy++) {
					if (this.grid.value[gx][gy] < 0) {
						this.stone[0]++;
					} else if (this.grid.value[gx][gy] > 0) {
						this.stone[1]++;
					}
				}
			}
		}
	},

	direction: {
		value: function (cx, cy, dx, dy) {
			return (dy - cy) * 3 + dx - cx;
		}
	},

	piik: {
		value: function (x, y, b) {
			if (this.grid.value[x][y] == 0) {
				if (this.turn < 7 && this.puuth(x, y)) {
					if (b) alert("6手目までは攻撃禁止！");
					return false;
				}
				this.hist[this.turn - 1] = this.grid.copy();
				this.timewatch(true);
				return true;
			}
			if (b) alert("そこはすでに埋まっているよ！");
			return false;
		}
	},

	puuth: {
		value: function (x, y) {
			if (this.around(x, y) * this.who >= -1) {
				for (var i0 = 0; i0 < this.num; i0++) {
					for (var i1 = 0; i1 < this.num; i1++) {
						if (Math.abs(i0 - x) < 2 && Math.abs(i1 - y) < 2 && this.grid.value[i0][i1] * this.who < 0) {
							return true;
						}
					}
				}
			}
			return false;
		}
	},

	pooet: {
		value: function (x, y) {
			var r = 0;
			//alert("around * who : " + this.around(x,y) * this.who);
			if (this.around(x, y) * this.who >= 0) {
				switch (this.ugrid.value[x][y]) {
				case -4:
					if (x > 0 && y > 0 && this.grid.value[x - 1][y - 1] * this.who < 0) {
						this.ugrid.value[x - 1][y - 1] = -4;
						r++;
					}
					break;
				case -3:
					if (y > 0 && this.grid.value[x][y - 1] * this.who < 0) {
						this.ugrid.value[x][y - 1] = -3;
						r++;
					}
					break;
				case -2:
					if (x < this.num - 1 && y > 0 && this.grid.value[x + 1][y - 1] * this.who < 0) {
						this.ugrid.value[x + 1][y - 1] = -2;
						r++;
					}
					break;
				case -1:
					if (x > 0 && this.grid.value[x - 1][y] * this.who < 0) {
						this.ugrid.value[x - 1][y] = -1;
						r++;
					}
					break;
				case 1:
					if (x < this.num - 1 && this.grid.value[x + 1][y] * this.who < 0) {
						this.ugrid.value[x + 1][y] = 1;
						r++;
					}
					break;
				case 2:
					if (x > 0 && y < this.num - 1 && this.grid.value[x - 1][y + 1] * this.who < 0) {
						this.ugrid.value[x - 1][y + 1] = 2;
						r++;
					}
					break;
				case 3:
					if (y < this.num - 1 && this.grid.value[x][y + 1] * this.who < 0) {
						this.ugrid.value[x][y + 1] = 3;
						r++;
					}
					break;
				case 4:
					if (x < this.num - 1 && y < this.num - 1 && this.grid.value[x + 1][y + 1] * this.who < 0) {
						this.ugrid.value[x + 1][y + 1] = 4;
						r++;
					}
					break;
				case 5:
					for (var i2 = 0; i2 < this.num; i2++) {
						for (var i3 = 0; i3 < this.num; i3++) {
							if (Math.abs(i2 - x) < 2 && Math.abs(i3 - y) < 2 && this.grid.value[i2][i3] * this.who < 0) {
								this.ugrid.value[i2][i3] = this.direction(x, y, i2, i3);
								//alert("direction : " + this.ugrid.value[i2][i3]);
								r++;
							}
						}
					}
					break;
				}
			}
			this.ugrid.value[x][y] = 0;
			return r;
		}
	},

	writeBoard: {
		value: function (context, lx, ty) {
			this.leftx = lx;
			this.topy = ty;
			context.beginPath();
			context.fillStyle = 'rgb(64,64,64)';
			context.fillRect(lx, ty, this.width, this.height);
			context.fillStyle = 'rgb(16,216,16)';
			for (var n = 0; n < this.num; n++) {
				for (var m = 0; m < this.num; m++) {
					var grx = lx + this.line + (this.line + this.sz) * m;
					var gry = ty + this.line + (this.line + this.sz) * n;
					context.fillStyle = 'rgb(16,216,16)';
					context.fillRect(grx, gry, this.sz, this.sz);
					/*
					context.font = '12pt 游ゴシック';
					context.fillStyle = 'rgb(255,0,0)';
					context.textAlign = "right";
					context.fillText("(" + this.ugrid.value[m][n] + ")",lx + (this.line + this.sz)*(m),ty + (this.line + this.sz)*(n+1));
					*/
					if (this.grid.value[m][n] < 0) {
						context.fillStyle = 'rgb(0,0,0)';
						//context.arc(grx + this.sz/2,gry + this.sz/2 ,this.sz/2 - 2,0,Math.PI * 2);
						context.fillRect(grx + 2, gry + 2, this.sz - 4, this.sz - 4);
					} else if (this.grid.value[m][n] > 0) {
						context.fillStyle = 'rgb(255,255,255)';
						//context.arc(grx + this.sz/2,gry + this.sz/2, this.sz/2 - 2,0,Math.PI * 2);
						context.fillRect(grx + 2, gry + 2, this.sz - 4, this.sz - 4);
					}
				}
			}
			context.fill();
		}
	},

	put: {
		value: function (ms) {
			var d = this.sz + this.line;
			var m = Math.floor((ms.x - this.leftx - this.line / 2) / d);
			var n = Math.floor((ms.y - this.topy - this.line / 2) / d);
			if (this.piik(m, n, true)) {
				this.ugrid.value[m][n] = 5;
				return [m, n];
			}
			return [-1, -1];
		}
	},

	ani: {
		value: function (context, a) {
			var ac = a;

			context.beginPath();
			if (this.who < 0) {
				context.fillStyle = 'rgb(0,0,0)';
			} else if (this.who > 0) {
				context.fillStyle = 'rgb(255,255,255)';
			}
			for (var ax = 0; ax < this.num; ax++) {
				for (var ay = 0; ay < this.num; ay++) {
					var grx = this.leftx + this.line + (this.line + this.sz) * ax;
					var gry = this.topy + this.line + (this.line + this.sz) * ay;
					var ss = (this.sz - 4) * ac / 24;
					switch (this.ugrid.value[ax][ay]) {
					case -4:
						context.fillRect(grx + this.sz - ss - 2, gry + this.sz - ss - 2, ss, ss);
						break;
					case -3:
						context.fillRect(grx + 2, gry + this.sz - ss - 2, this.sz - 4, ss);
						break;
					case -2:
						context.fillRect(grx + 2, gry + this.sz - ss - 2, ss, ss);
						break;
					case -1:
						context.fillRect(grx + this.sz - ss - 2, gry + 2, ss, this.sz - 4);
						break;
					case 1:
						context.fillRect(grx + 2, gry + 2, ss, this.sz - 4);
						break;
					case 2:
						context.fillRect(grx + this.sz - ss - 2, gry + 2, ss, ss);
						break;
					case 3:
						context.fillRect(grx + 2, gry + 2, this.sz - 4, ss);
						break;
					case 4:
						context.fillRect(grx + 2, gry + 2, ss, ss);
						break;
					case 5:
						context.fillRect(grx + this.sz / 2 - ss / 2, gry + this.sz / 2 - ss / 2, ss, ss);
						break;
					}
				}
			}
			context.fill();

			ac++;
			if (ac > 24) {
				ac = this.attackProcess();
			}
			return ac;
		}
	},

	attackProcess: {
		value: function () {
			var ac = -2;
			for (var ax = 0; ax < this.num; ax++) {
				for (var ay = 0; ay < this.num; ay++) {
					if (this.ugrid.value[ax][ay] != 0) {
						this.grid.value[ax][ay] = this.who;
						if (this.ugrid.value[ax][ay] == 5) {
							this.locationToKif(ax, ay, 'p');
						} else {
							this.locationToKif(ax, ay, 't');
						}
					}
				}
			}
			for (var ax = 0; ax < this.num; ax++) {
				for (var ay = 0; ay < this.num; ay++) {
					var dirgu = this.ugrid.value[ax][ay];
					if (dirgu < 0) dirgu += 10;
					if (!this.isTurned[dirgu]) {
						if (dirgu == 5) {
							this.isTurned = [true, true, true, true, true, true, true, true, true, true];
						} else {
							this.isTurned[dirgu] = true;
						}
						if (this.pooet(ax, ay) > 0) {
							ac = 0;
						}
					}
				}
			}
			this.isTurned = [true, false, false, false, false, false, false, false, false, false];
			return ac;
		}
	},

	undo: {
		value: function () {
			if (this.turn > 1) {
				this.turn--;
				this.who *= -1;
				this.grid = this.hist[this.turn - 1].copy();
				this.totaling();
				this.kif[0] = this.kif[0].replace(this.turn + " : ", "待った >> ");
				this.kif[1] = 0;
			}
		}
	},

	timewatch: {
		value: function (s_s) {
			if (s_s) {
				this.playtimer = !(this.playtimer);
				this.timer[2] = this.sectime;
				this.timer[3] = this.sectime;
				if (this.playtimer) {
					this.clock = Date.now();
				} else {
					this.timer[4] = Date.now() - this.clock;
				}
			} else if (this.playtimer) {
				if (this.who < 0) {
					if (this.timer[0] <= 0) {
						this.timer[2] -= fps / 1000;
					} else {
						this.timer[0] -= fps / 1000;
					}
				} else if (this.who > 0) {
					if (this.timer[1] <= 0) {
						this.timer[3] -= fps / 1000;
					} else {
						this.timer[1] -= fps / 1000;
					}
				}
			}

			if (this.timer[2] < 0) {
				return "先手の時間切れで後手の勝ち！";
			} else if (this.timer[3] < 0) {
				return "後手の時間切れで先手の勝ち！";
			}
			return "";
		}
	},

	judge: {
		value: function () {
			var dif = this.stone[0] - this.stone[1];
			if (dif > 0) {
				return dif + "枚差で先手の勝ち！";
			} else if (dif < 0) {
				return -dif + "枚差で後手の勝ち！";
			} else {
				return "引き分け！";
			}
		}
	},

	copy: {
		value: function () {
			var copy = new Board(this.num, 0, this.sectime);
			copy.who = this.who; // -1:first, 1:second
			copy.turn = this.turn;
			copy.grid = this.grid.copy();
			for (var hi = 0; hi < this.hist.length; hi++) {
				copy.hist[hi] = this.hist[hi].copy();
			}
			copy.kif[0] = this.kif[0];
			return copy;
		}
	},

	locationToKif: {
		value: function (x, y, option) {
			switch (option) {
			case 'p':
				this.kif[0] += "\n" + this.turn.toString() + " : ";
				if (this.who < 0) this.kif[0] += "F";
				else if (this.who > 0) this.kif[0] += "S";
				break;
			case 't':
				if (this.turn == this.kif[1]) {
					this.kif[0] += ",";
				} else {
					this.kif[0] += " x";
					this.kif[1] = this.turn;
				}
				break;
			case 'f':
				var coffee = new Config();
				coffee.p1 = x;
				coffee.p2 = y;
				this.kif[0] = coffee.dispText(0) + " 対 " + coffee.dispText(1);
				return null;
				break;
			case 'e':
				this.kif[0] += "\nまで，" + (this.turn - 1) + "手をもって終局";
				this.kif[0] += "\n" + this.stone[0] + " - " + this.stone[1];
				this.kif[0] += "\n" + x + "\b\b";
				return null;
				break;
			}

			switch (x) {
			case 9:
				this.kif[0] += 'X';
				break;
			case 10:
				this.kif[0] += 'E';
				break;
			case 11:
				this.kif[0] += '0';
				break;
			default:
				this.kif[0] += (x + 1).toString();
				break;
			}

			switch (y) {
			case 0:
				this.kif[0] += "a";
				break;
			case 1:
				this.kif[0] += "b";
				break;
			case 2:
				this.kif[0] += "c";
				break;
			case 3:
				this.kif[0] += "d";
				break;
			case 4:
				this.kif[0] += "e";
				break;
			case 5:
				this.kif[0] += "f";
				break;
			case 6:
				this.kif[0] += "g";
				break;
			case 7:
				this.kif[0] += "h";
				break;
			case 8:
				this.kif[0] += "i";
				break;
			case 9:
				this.kif[0] += "j";
				break;
			case 10:
				this.kif[0] += "k";
				break;
			case 11:
				this.kif[0] += "l";
				break;
			}
		}
	},

	// 棋譜のロード
	dataload: {
		value: function (loadtext) {
			var chrLocate = 0, coordinate = new Array(), easterEgg = "";
			for (var j=1; j <= 144; j++) {
				chrLocate = loadtext.indexOf(j + " : ");
				if (chrLocate < 0) {
					break;
				} else if (j < 10) {
					coordinate[j] = loadtext.substr(chrLocate + 4, 3);
				} else if (j < 100){
					coordinate[j] = loadtext.substr(chrLocate + 5, 3);
				} else {
					coordinate[j] = loadtext.substr(chrLocate + 6, 3);
				}
			}

			chrLocate = loadtext.indexOf("special = ");
			if (chrLocate >= 0) {
				easterEgg = loadtext.charAt(chrLocate + 10);
			}

			if (easterEgg !== 'm') {
				for (var k=1; k <= 144; k++) {
					if (!coordinate[k]) break;

					var m, n;
					switch(coordinate[k].charAt(1)) {
						case "X": m = 9; break;
						case "E": m = 10; break;
						case "0": m = 11; break;
						default: m = parseInt(coordinate[k].charAt(1)) - 1;
					}
					switch (coordinate[k].charAt(2)) {
						case "a": n = 0; break;
						case "b": n = 1; break;
						case "c": n = 2; break;
						case "d": n = 3; break;
						case "e": n = 4; break;
						case "f": n = 5; break;
						case "g": n = 6; break;
						case "h": n = 7; break;
						case "i": n = 8; break;
						case "j": n = 9; break;
						case "k": n = 10; break;
						case "l": n = 11; break;
					}
					if (this.piik(m, n, false)) {
						this.ugrid.value[m][n] = 5;
						while (this.attackProcess() == 0){};
					}
					this.who *= -1;
					this.turn++;
				}
			} else {
				for (var k=1; k <= 144; k++) {
					if (!coordinate[k]) break;

					var w, m, n;
					switch(coordinate[k].charAt(0)) {
						case "F": w = -1; break;
						case "S": w = 1; break;
					}
					switch(coordinate[k].charAt(1)) {
						case "X": m = 9; break;
						case "E": m = 10; break;
						case "0": m = 11; break;
						default: m = parseInt(coordinate[k].charAt(1)) - 1;
					}
					switch (coordinate[k].charAt(2)) {
						case "a": n = 0; break;
						case "b": n = 1; break;
						case "c": n = 2; break;
						case "d": n = 3; break;
						case "e": n = 4; break;
						case "f": n = 5; break;
						case "g": n = 6; break;
						case "h": n = 7; break;
						case "i": n = 8; break;
						case "j": n = 9; break;
						case "k": n = 10; break;
						case "l": n = 11; break;
					}

					this.kif[0] += "\n" + k.toString() + " : " + coordinate[k];
					this.grid.value[m][n] = w;
					this.who = -w;
					this.turn++;
				}
			}
			this.playtimer = true;

			return easterEgg;
		}
	}
});
