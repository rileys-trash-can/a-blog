// footer stuff:

class footerentry {
	constructor(type, name, link) {
		this.name = name
		this.link = link
		this.type = type
	}
	appendto(jtag) {
		let elem;
		switch( this.type ) {
			case "text":
			case undefined:
				elem = document.createElement("a")
				elem.innerHTML = this.name.replaceAll("<", "&lt;").replaceAll(">", "&ht;")
				elem.classList = ["text"]
				elem.href = this.link
				break

			case "spacer":
				elem = document.createElement("span")
				elem.innerHTML = "|"
				elem.classList = ["spacer"]
				break

			default:
				return
		}

		$(jtag).append(elem)
	}
}

footer = new class {
	constructor() {
		this.entrys = []
		this.container = ".footer"
		this.length = 0
	}

	add( footer ) {
		if ( this.length > 0 && footer.type != "spacer" ) {
			this.add( new footerentry("spacer") )
		}
		footer.appendto( this.container )
		this.entrys.push( footer )
		this.length++		
	}
}

// create all elements:
$(document).ready(() => {
	let parsefooter = [
		{"type":"text", "name":"Privacy policy", "link":"/static/pp.html"}, // privacy policy
		{"type":"text", "name":"Impressum",      "link":"/static/impressum.html"}, // impressum
		{"type":"text", "name":"Cookie Settings","link":"/static/keks.html"} // cookie settings
	]

	for ( let i = 0 ; i < parsefooter.length ; i++ ) {
		footer.add( new footerentry( parsefooter[i].type, parsefooter[i].name, parsefooter[i].link ) )
	}
})
