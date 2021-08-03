console.log(
    `- * - # Menubar (by derz) # - * -`)

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
                    html += `<div class="href" onclick='location = "${p[i].href}"'>\n`
                    html += `${p[i].text}\n`
                    html += `</div>\n`
                    break
                
                case "input":
                    html += `<div class="input">\n`
                    html += `   <input type="${ p[i].type ? p[i].type : "text" }" id="${p[i].id}">\n`
                    html += `   <img src="${ p[i].icon }" alt="${ p[i].alt }">\n`
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
document.onreadystatechange = () => {
    if( document.readyState == "complete" )
        a = new menubar( ".menubox", [
            {"type":"href", "text":"derzombiiie.com","href":"/"},
            {"type":"href", "text":"posts",          "href":"/posts"},
            {"type":"href", "text":"newest",         "href":"/posts?newest"},
            {"type":"input","id"  :"search-field",   "icon":"/icon/search.svg"}
        ])
}
