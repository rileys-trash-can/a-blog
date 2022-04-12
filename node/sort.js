const {Post} = require("./posts")

class Sortable {
	constructor( db ) {
		this.db = db

		this.vars()
	}

	vars() {
		this.name = ""
		this.desc = ""
	}
	
	preview() {
		return this.db.find({"hidden":false})
	}
}

class dateDesc extends Sortable { // by date descending aka newest
	vars() {
		this.name = "new"
		this.desc = "newest first"
		this.tName = "dateDesc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"create": -1}).project(Post.previewProjection())
	}
}

class dateAsc extends Sortable { // by date ascending aka oldest
	vars() {
		this.name = "old"
		this.desc = "oldest first"
		this.tName = "dateAsc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"create": 1}).project(Post.previewProjection())
	}
}

class upvotesDesc extends Sortable {
	vars() {
		this.name = "upvotes"
		this.desc = "most liked goes first"
		this.tName = "upvotesDesc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"rating.up": -1}).project(Post.previewProjection())
	}
}

class upvotesAsc extends Sortable {
	vars() {
		this.name = "!upvotes"
		this.desc = "most liked goes last"
		this.tName = "upvotesAsc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"rating.up": 1}).project(Post.previewProjection())
	}
}

class downvotesDesc extends Sortable {
	vars() {
		this.name = "downvotes"
		this.desc = "most downvoted goes first"
		this.tName = "downvotesDesc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"rating.down": -1}).project(Post.previewProjection())
	}
}

class downvotesAsc extends Sortable {
	vars() {
		this.name = "!downvotes"
		this.desc = "most downvoted goes last"
		this.tName = "downvotesAsc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"rating.down": 1}).project(Post.previewProjection())
	}
}

class nameAsc extends Sortable {
	vars() {
		this.name = "name [a-z]"
		this.desc = "a before z"
		this.tName = "nameAsc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"title": -1}).project(Post.previewProjection())
	}
}

class nameDesc extends Sortable {
	vars() {
		this.name = "name [z-a]"
		this.desc = "z before a"
		this.tName = "nameDesc"
	}

	preview() {
		return this.db.find({"hidden":false}).sort({"title": 1}).project(Post.previewProjection())
	}
}

class updownVoteAsc extends Sortable {
	vars() {
		this.name = "upvote - downvote"
		this.desc = "(10-2) before (5-4)"
		this.tName = "updownVoteAsc"
	}

	preview() {
		return this.db.aggregate([
			{
				$match: {
					hidden: false
				}
			},
			{
				$project: Post.previewProjection({
					ratio: { $subtract: ["$rating.up", "$rating.down"]},
				})
			},
			{
				$sort: {ratio: -1}
			},
		])
	}
}

class updownVoteDesc extends Sortable {
	vars() {
		this.name = "downvote - upvote"
		this.desc = "(10-2) before (5-4)"
		this.tName = "updownVoteDesc"
	}

	preview() {
		return this.db.aggregate([
			{
				$match: {
					hidden: false
				}
			},
			{
				$project: Post.previewProjection({
					ratio: { $subtract: ["$rating.up", "$rating.down"]},
				})
			},
			{
				$sort: {ratio: 1}
			},
		])
	}
}

// Filter:
class Filter {
	constructor( db ) {
		this.db = db
	}

	preview() {
		return this.db.find().toArray()
	}

	async length() {
		return (await this.preview()).length
	}
}

class tagSort extends Filter {
	constructor( db, tags ) {
		super( db )
		
		this.tags = (tags instanceof Array) ? tags : [tags]
	}

	preview() {
		return this.db.aggregate([
			{
				$match: {
					hidden: false,
					tags: {
						"$in": this.tags
					}
				}
			}
		])
	}
}
	
class Sorter {
	constructor( db, collection ) {
		this.db = db
		this.sorters = {}
		collection.forEach(sa => {
			this.sorters[sa.name] = new sa(db)
			this[sa.name] = this.sorters[sa.name]
		})
	}

	getSorters() {
		return this.sorters
	}

	isValidSort( sort ) {
		return Object.keys(this.sorters).includes(sort)
	}

	tag(tags) {
		return new tagSort(this.db, tags)
	}
}
module.exports.Sorter = Sorter
 
module.exports.collection = [
	updownVoteAsc,
	updownVoteDesc,
	dateDesc,
	dateAsc,
	upvotesDesc,
	upvotesAsc,
	downvotesAsc,
	downvotesDesc,
	nameAsc,
	nameDesc,
]

module.exports.Sortable = Sortable
