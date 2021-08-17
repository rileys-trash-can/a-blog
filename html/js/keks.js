switchcb = {}
switchcb.ads = (s) => {
	console.log("settings ads setting to "+s)
}
switchcb.the = (s) => {
	switch ( s ) {
		case "on":
			themes.set($(".themeselect").val())
			break

		case "off":
			setCookie("theme", "", 1)
			break
	}
	console.log("themes "+s)
}
switchcb.oth = (s) => {
	console.log("other settings is "+s)
}

toggler = new class {
	constructor() {
		
	}
	toggle( jtag, s, cb ) {
		if ( !s ) {
			s = $(jtag).attr("state")
			if ( s == "on") {
				s = "off"
			} else if ( s == "off" ) {
				s = "on"
			} else if ( s == "noff" ) {
				s = $(jtag).attr("d")
			}

		}
		let je = $(jtag)
		je.attr("state", s)
		let classes = je.attr("class").split(" ")
		switch ( s ) {
			case "noff":
				classes.splice(2,-1)
				classes[2] = "noff"
				break

			case "on":
				classes.splice(2,-1)
				classes[2] = "on"
				break

			case "off":
				classes.splice(2,-1)
				classes[2] = "off"
				break
		}
		je.attr("class", classes.join(" "))
		if ( !cb ) eval(`s="${s}";`+je.attr("cb"))
		return s
	}
}

// readout theme and create selector
$(document).ready(() => {
let c = getCookie("theme")
if ( !c )
	toggler.toggle(".cookie.setting.theme", "noff", true)
else
	toggler.toggle(".cookie.setting.theme", "on", true)

$(".cookiesetting.theme").append(`<select class="themeselect" onchange='toggler.toggle(".cookie.setting.theme", "on")'>
<option value="light" ${c == "light" ? "selected": ""}>Light-mode</option>
<option value="dark"  ${c == "dark" ? "selected" : ""}>Dark-mode</option>
<option value=""      ${c != "light" && c != "dark" && c != "" ? "selected" : ""}>-mode</option>
</select>`)
})
