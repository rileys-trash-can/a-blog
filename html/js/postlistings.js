$(document).ready(() => {
	displayshare()
	fetch("/posts?api&hot&len=10").then(d => d.json()).then(data=>{
		if( data.type != "s" ) {
			alert( "Error:" + data.text )
			return
		}

		posts = []
		for ( let i = 0 ; i < data.content.length ; i++ ) {
			posts.push( new entry( data.content[i].title, data.content[i].author, data.content[i].desc, "#", data.content[i].tags, data.content[i].id ) )
			posts[posts.length-1].appendto(".content")
		}
	})
})
