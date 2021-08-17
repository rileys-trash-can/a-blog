$(document).ready(() => {
	displayshare()
	fetch(`/posts?api&hot&len=5&page=${index}`).then(d => d.json()).then(data=>{
		if( data.type != "s" ) {
			alert( "Error:" + data.text )
			return
		}
		console.log(data)
		length = data.pages

		posts = []
		for ( let i = 0 ; i < data.content.length ; i++ ) {
			posts.push( new entry( data.content[i].title, data.content[i].author, data.content[i].desc, "#", data.content[i].tags, data.content[i].id ) )
			posts[posts.length-1].appendto(".content")
		}

		// bottom pager
		$(".content").append( pager( length, index ) )
	})
})
