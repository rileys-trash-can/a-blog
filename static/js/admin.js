document.onreadystatechange = _ => {
	if( document.readyState === "complete" )
		mde = new SimpleMDE({
			element: document.getElementById("mde")
		})
}

function save() {
	let tags = document.getElementsByClassName("editor tags")[0].value.split(/[\,\ ]/).filter(i=> i!="" )

	let filename = prompt("Please enter a file name:")
		filename = filename ? filename : "post.export" 

	let postjson = {
		"title": document.getElementsByClassName("editor title").value,
		"body": mde.value(),
		"tags": tags,
		"author": document.getElementsByClassName("editor author").value,
		"desc": document.getElementsByClassName("editor desc").value,	
	}		

	// dl it locally ( as .json )
	document.getElementsByClassName("dl")[0].download = filename+".json"
	document.getElementsByClassName("dl")[0].href     = "data:application/json;charset=utf-8," + encodeURIComponent( JSON.stringify(postjson) )
	document.getElementsByClassName("dl")[0].click()
	
}

function load() {
	let file = document.getElementsByClassName("load")[0].files[0]
	let read = new FileReader()
	read.readAsText(file, "UTF-8")
	read.onload = (e) => {
		let p = JSON.parse( e.target.result )

		document.getElementsByClassName("editor title").value = p.title
		document.getElementsByClassName("editor tags").val    = p.tags.join(", ")
		document.getElementsByClassName("editor author").val  = p.author
		document.getElementsByClassName("editor desc").val    = p.desc
		mde.value(p.body)

		console.log(p)
	}
}
