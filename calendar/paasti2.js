senaha = ["søl","led","duk","kac","cið","ðot","tøh","hez","zuþ","þan","nig","gos","map","mob"];
 
months = ["蒼風","青霧","碧泡","春水","緑酸","翠雷","黄火","橙熔","赤銅","紅土","紫岩","紺塵","白天","黒地"];
 
tika = ["sø", "le", "du", "ka", "ci", "ðo", "tø", "he", "zu", "þa", "ni", "go"];

dstart = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
dLstart = [0, 31, 60, 91, 121, 151, 182, 213, 244, 274, 305, 335];

function cli()
{
	clock();
	setInterval("clock()", 60000);
}

function clock()
{
	var ddd = new Date();
	leaper(ddd);
	dozenal1();
	disp();
}
 
// judge whether the year is leap year
function leaper(ddd)
{
	leap = 0;
	if (ddd.getFullYear() % 4 == 0) {
		leap = 1;
		if (ddd.getFullYear() % 100 == 0 && ddd.getFullYear() % 400 != 0) {
			leap = 0;
		}
	}
	if (leap == 0) {
		yday = dstart[ddd.getMonth()] + ddd.getDate();
	} else {
		yday = dLstart[ddd.getMonth()] + ddd.getDate();
	}
}
 
 try{
// change dating format into dozenal one
function dozenal1() {
	d = 0;
	if (leap == 1 && yday == 183) {
		mp = senaha[13];
		m = months[13];
		d = 1;
	} else if (yday < 183) {
		thms = parseInt((yday - 1) / 91);
		thd = (yday - 1) % 91 + 1;
	} else {
		thms = parseInt((yday - 1 - leap) / 91);
		thd = (yday - 1 - leap) % 91 + 1;
	}
 
	if (d == 0) {
		nm = thms * 3;
		if (thd > 61) {
			nm += 2;
			thd -= 61;
		} else if (thd > 31) {
			nm += 1;
			thd -= 31;
		}
		mp = senaha[nm];
		m = months[nm];
		d = thd;
	}
	
}

 
// display the date
function disp()
{	
	dz = 0;
	while (d / 12 >= 1) {
		dz += 1;
		d -= 12;
	}
	switch(d) {
		case 10: dun = '#'; break;
		case 11: dun = '$'; break;
		default: dun = new String(d);
	}
	
	str_update = null;
	str_update = "lo tika ";
	if (dz == 0) {
		if (d == 1) {
			str_update += "leud " + mp + "senahud: <br>á ða pesa:<br>";
		} else if (d % 6 == 2) {
			str_update += tika[d] + "mud " + mp + "senahud: <br>";
		} else {
			str_update += tika[d] + "ud " + mp + "senahud: <br>";
		}
	} else if (d % 6 == 2) {
		str_update += tika[dz] + tika[d] + "mud " + mp + "senahud: <br>";
	} else {
		str_update += tika[dz] + tika[d] + "ud " + mp + "senahud:<br>";
	}
	 
	str_update += "今日は　"+m+"季　";
	if (dz == 0) {
		if (d == 1) {
			str_update += "朔日 <br>時は　その動きを　止めない";
		} else {
			str_update += dun + "日";
		}
	} else {
		str_update += dz + dun + "日";
	}
	
	document.getElementById("msg").innerHTML = str_update;
}
}
catch(e){
	alert("エラーデス！ <br>"+ e);
}