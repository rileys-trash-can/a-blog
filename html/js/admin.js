$(document).ready(() => {
	mde = new SimpleMDE({
		element: document.getElementById("mde")
	})
})

function previewpost() {
	let tags = $(".editor.tags").val().split(/[\,\ ]/gm).filter(i=> i!="" )

	// createpost with id "preview"
	$.post("/admin/post", {
			"action": "set",
			"id": "preview",
			"title": $(".editor.title").val(),
			"body": mde.value(),
			"tags": tags,
			"time": "auto",
			"author": $(".editor.author").val(),
			"desc": $(".editor.desc").val()	
	}).then(res=>{
		if( res.type == "s" ) {
			$(".link").attr("href", "/posts?post=preview")
			document.getElementsByClassName("link")[0].click()
		} else {
			alert( "Err! " + res.text )
		}
	})
}

function post() {
	// check if pushed accidentally:
	let check = Math.floor( Math.random()*10**5 )

	if( prompt( "To proceed posting please type: " + check ) != check ) {
		alert( "wrong!" )
		//return
	}

	// push post
	let tags = $(".editor.tags").val().split(/[\,\ ]/).filter(i=> i!="" )

	// createpost with id "preview"
	$.post("/admin/post", {
			"action": "push",
			"title": $(".editor.title").val(),
			"body": mde.value(),
			"tags": tags,
			"time": "auto",
			"author": $(".editor.author").val(),
			"desc": $(".editor.desc").val()	
	}).then(res=>{
		if( res.type == "s" ) {
			alert( "Post live!" )
		} else {
			alert( "Err! " + res.text )
		}
	})
}

function save() {
	let tags = $(".editor.tags").val().split(/[\,\ ]/).filter(i=> i!="" )

	let postjson = {
		"title": $(".editor.title").val(),
		"body": mde.value(),
		"tags": tags,
		"author": $(".editor.author").val(),
		"desc": $(".editor.desc").val()	
	}		

	// dl it locally ( as .json )
	$(".dl").attr("href", "data:application/json;base64," + btoa( JSON.stringify(postjson) ))
	document.getElementsByClassName("dl")[0].click()
	
}

function load() {
	let file = document.getElementsByClassName("load")[0].files[0]
	let read = new FileReader()
	read.readAsText(file, "UTF-8")
	read.onload = (e) => {
		let p = JSON.parse( e.target.result )

		$(".editor.title").val (p.title)
		mde.value              (p.body)
		$(".editor.tags").val  (p.tags.join(", "))
		$(".editor.author").val(p.author)
		$(".editor.desc").val  (p.desc)
	
		console.log(p)
	}
}
