// post displayer:
$(document).ready(() => {
	content = new entry(postDATA.title, postDATA.author, marked(postDATA.content), postDATA.href, postDATA.tags, postDATA.id, postDATA.rating)
	content.appendto(".content")

	// rating bit:
	$(".upvote")  .on("click", () => { vote("+", $(".upvote"), $(".downvote")) })
	$(".downvote").on("click", () => { vote("-", $(".upvote"), $(".downvote")) })

 	// commenting thing
	displayshare()
	displaycomments()
})

