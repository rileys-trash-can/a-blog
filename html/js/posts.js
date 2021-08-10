// post displayer:
$(document).ready(() => {
	content = new entry(postDATA.title, postDATA.author, marked(postDATA.content), postDATA.href, postDATA.tags, postDATA.id, postDATA.create)
	content.appendto(".content")
	// commenting thing
	displayshare()
	displaycomments()
})

