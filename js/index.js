// index.js used for /index.html
console.log(
`   // ------------------------------------------ //
  //  Author:  derzombiiie (derz@elidragon.com) //
 //  License: GPLv3 (if not noted otherwise)   //
// ------------------------------------------ //`)

// static theme for testing 
new themes( "light" )

// get newest 10 blog articles from api
$.get("/posts?api&featured&len=10", d => {
    let json = JSON.parse(d)
    if ( json.type != "s" )
        return false
    else {
        elements = []
        for( let i = 0 ; i < json.content.length ; i++ ) {
            let elem = new entry(json.content[i].title, json.content[i].author, json.content[i].desc, json.content[i].href, json.content[i].tags)
            elements.push(elem)
            $(".content").append(elem.createelement())
        }
    }
})