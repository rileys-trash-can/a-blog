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
    a = new menubar( ".menubox", [
        {"type":"href", "text":"derzombiiie.com","href":"/"},
        {"type":"href", "text":"posts",          "href":"/posts"},
        {"type":"href", "text":"newest",         "href":"/posts?newest"},
        {"type":"input","id"  :"search-field",   "icon":"/icon/search.svg" ,"alt":"search"}
    ])
})
