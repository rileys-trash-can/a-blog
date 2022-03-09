class post {
	constructor(data) {
		this.title = data.title
		this.desc = data.desc
		this.tags = data.tags
		this.content = data.content
		this.date = data.date
	}
}

class posts {
	constructor( db ) {
		this.db = db
	}

	newest() {
		
	}

	best() {
		
	}
}
module.exports.posts = posts
