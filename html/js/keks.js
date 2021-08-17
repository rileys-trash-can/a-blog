switchcb = {}
switchcb.ads = (s) => {
	console.log("settings ads setting to "+s)
}
switchcb.the = (s) => {
	console.log("themes "+s)
}
switchcb.oth = (s) => {
	console.log("other settings is "+s)
}

toggler = new class {
	constructor() {
		
	}
	toggle( jtag, s ) {
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
		let je = $(jtag).attr("state", s)
		let classes = je.attr("class").split(" ")
		switch ( s ) {
			case "noff":
				classes.splice(2,2)
				classes[2] = "noff"
				break

			case "on":
				classes.splice(2,2)
				classes[2] = "on"
				break

			case "off":
				classes.splice(2,2)
				classes[2] = "off"
				break
		}
		je.attr("class", classes.join(" "))
		switchcb[je.attr("cb")](s)
		return s
	}
}

