// post displayer:
$(document).ready(() => {
console.log(1)
	content = new entry(postDATA.title, postDATA.author, postDATA.desc, postDATA.href, postDATA.tags, postDATA.id, postDATA.create)
	content.appendto(".content")
	displayshare()
})
