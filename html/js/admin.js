$(document).ready(()=>{
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
			"time": "auto"
	}).then(r => r.json()).then(res=>{
		if( res.type == "s" ) {
			window.open("/posts?post=preview")
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
		return
	}

	// push post
	let tags = $(".editor.tags").val().split(/[\,\ ]/).filter(i=> i!="" )

	// createpost with id "preview"
	$.post("/admin/post", {
			"action": "push",
			"title": $(".editor.title").val(),
			"body": mde.value(),
			"tags": tags,
			"time": "auto"
	}).then(r => r.json()).then(res=>{
		if( res.type == "s" ) {
			alert( "Post live!" )
		} else {
			alert( "Err! " + res.text )
		}
	})
}
