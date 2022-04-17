const {Post} = require("./posts")
const {Remarkable} = require("remarkable")
const {ObjectId} = require("mongodb")

const md = new Remarkable({
	breaks: true,
})

class Author {
	constructor( data ) {
		this._id      = data._id
		this.name     = data.name
		this.desc     = data.desc
		this.category = data.category
		this.picture  = data.picture
		this.posts    = data.posts
	}

	static async get( _id, db ) {
		if( !ObjectId.isValid(_id ) ) return null
		
		let author = await db.findOne( { _id: ObjectId(_id) })

		if( !author ) return null

		return new Author( author )
	}

	static async byName( name, db ) {
		let author = await db.findOne( { name } )

		if( !author ) return null
	
		return new Author( author )
	}

	async render( postsDB ) {
		let author = new Author(this)

		// get some newer posts
		author.posts = await Post.byAuthor( this.name, postsDB ).sort({create:1}).toArray()

		return author
	}

	markdown() {
		return md.render(this.desc)
	}
}

module.exports = {
	Author,
}
