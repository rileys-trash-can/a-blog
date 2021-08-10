console.log(`- * - # Menubar (by derz) # - * -`)

class menubar {
    constructor( tag, content ) {
        this.tag = tag
        return this.parse( content )
    }
    parse( p ) {
        let html = '<div class="menubar">'
        for ( let i = 0; i < p.length ; i++ ) {
            switch( p[i].type ) {
                case "href":
                    html += `<a class="href" title="${ p[i].href }" href="${ p[i].href }">\n`
                    html += `${ p[i].text }\n`
                    html += `</a>\n`
                    break
                
                case "input":
                    html += `<div class="input">\n`
                    html += `   <input type="${ p[i].type ? p[i].type : "text" }" id="${ p[i].id }">\n`
                    html += `   <img src="${ p[i].icon }" title="${ p[i].alt }" alt="${ p[i].alt }">\n`
                    html += `</div>`
                    break

                default:
                    console.warn("No type specified!")
            }
            html += '<div class="spacer"></div>\n'
        }
        html += '</div>\n'
        $(this.tag).html(html)
        return html
    }
}

// init:
$(document).ready(() => {
	let e = []
	e.push({"type":"href", "text":conf.site_name,   "href":"/"})
	e.push({"type":"href", "text":"posts",          "href":"/posts"})
	e.push({"type":"href", "text":"newest",         "href":"/posts?newest"})
	if(conf.search_enable) e.push({"type":"input","id"  :"search-field",   "icon":"/static/icon/search.svg" ,"alt":"search"})
	    
    a = new menubar( ".menubox", e)
})
