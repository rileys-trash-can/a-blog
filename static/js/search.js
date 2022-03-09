$(document).ready(() => {
	results = []
	for ( let i = 0 ; i < searchDATA.sd.length ; i++ ) {
		// generate shorted description:
		let desc = ""
		let d = searchDATA.sd[i].desc.split(" ")
		let a = "..."
		for( let i = 0 ; i < 10 ; i ++ ) {
			desc += d[i] ? d[i] + " " : ""
			a = d[i] ? a : ""
		}
		desc += a

		results.push( new entry( searchDATA.sd[i].title, searchDATA.sd[i].author, desc, "", searchDATA.sd[i].tags, searchDATA.sd[i].id, searchDATA.sd[i].rating ) )
		results[results.length-1].appendto(".content")
	}

	$(".subtitle.search").html((searchDATA.arg.join(", ").replace(/</g, "&lt;")))
	$("title").html(("search - " + searchDATA.arg.join(", ")).replace(/</g, "&lt;"))
})
