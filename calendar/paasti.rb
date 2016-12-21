#! ruby -Ku

=begin
require 'rubygems'
require 'twitter'

Twitter.configure do |config|
	config.consumer_key = 
	config.consumer_secret = 
	config.oauth_token = 
	config_oauth_token_secret = 
end
=end
 
def createMessage
	array_senaha = ["søl","led","duk","kac","cið","ðot","tøh","hez","zuþ","þan","nig","gos","map","mob"]
 
	array_months = ["蒼風","青霧","碧泡","春水","緑酸","翠雷","黄火","橙熔","赤銅","紅土","紫岩","紺塵","白天","黒地"]
 
	array_tika = ["sø", "le", "du", "ka", "ci", "ðo", "tø", "he", "zu", "þa", "ni", "go"]
 
	t = Time.now + 9 * 3600
 
	# judge whether the year is leap year
	leap = 0
	if t.year % 4 == 0
		leap = 1
		if t.year % 100 == 0 && t.year % 400 != 0
			leap = 0
		end
	end
	 
	# change dating format into dozenal one
	d = 0
	if leap == 1 && t.yday == 183
		mp = array_senaha[13]
		m = array_months[13]
		d = 1
	elsif t.yday < 183
		thms = (t.yday - 1) / 91
		thd = (t.yday - 1) % 91 + 1
	else
		thms = (t.yday - 1 - leap) / 91
		thd = (t.yday - 1 - leap) % 91 + 1
	end
	 
	if d == 0
		nm = thms * 3
		if thd > 61
			nm += 2
			thd -= 61
		elsif thd > 31
			nm += 1
			thd -= 31
		end
		mp = array_senaha[nm]
		m = array_months[nm]
		d = thd
	end
	 
	# display the date
	dz = 0
	until d / 12 == 0
		dz += 1
		d -= 12
	end
	case d
	when 10
		dun = 'X'
	when 11
		dun = 'E'
	else
		dun = d.to_s
	end
	 
	str_update = "lo tika "
	if dz == 0
		if d == 1
			str_update << "leud " + mp + "senahud:\ná ða pesa:\n"
		elsif d % 6 == 2
			str_update << array_tika[d] + "mud " + mp + "senahud:\n"
		else
			str_update << array_tika[d] + "ud " + mp + "senahud:\n"
		end
	elsif d % 6 == 2
		str_update << array_tika[dz] + array_tika[d] + "mud " + mp + 	"senahud:\n"
	else	
		str_update << array_tika[dz] + array_tika[d] + "ud " + mp + "senahud:\n"
	end
	 
	str_update << "今日は　#{m}季　"
	if dz == 0
		if d == 1
			str_update << "朔日\n時は　その動きを　止めない"
		else
			str_update << dun + "日"
		end
	else
		str_update << dz.to_s + dun + "日"
	end
	
	return str_update
end
  
def tweetTest
	print(createMessage + "\n")
	print(t)
end

tweetTest