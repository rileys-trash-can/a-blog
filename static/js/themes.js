function setCookie(cname, cvalue, exdays) {
	if ( !exdays ) {
		exdays = 10**20
	}
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

themes = new class {
    constructor( theme ) {
		this.theme = getCookie("theme")

		if( !this.theme ) {
			this.theme = "dark"
		}

		this.loadstyle(this.theme)
    }
    
    loadstyle( style ) {
    this.theme = style
        $.get( "/static/style/" + style + ".css" , css => {
            $('<style type="text/css"></style>')
            .html(css).appendTo("head")
        })
    }

    set( style ) {
    	setCookie( "theme", style )
    	location = location
    }
}
