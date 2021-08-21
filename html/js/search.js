$(document).ready(() => {
	results = []
	for ( let i = 0 ; i < searchDATA.length ; i++ ) {
		// generate shorted description:
		let desc = ""
		let d = searchDATA[i].desc.split(" ")
		for( let i = 0 ; i < 10 ; i ++ ) {
			desc += d[i] + " "
		}
		desc += "..."
		
		results.push( new entry( searchDATA[i].title, searchDATA[i].author, desc, "", searchDATA[i].tags, searchDATA[i].id, searchDATA[i].rating ) )
		results[results.length-1].appendto(".content")
		console.log("loop")
	}
})
