const ejs = require("ejs")
const crypto = require("crypto")
const {kv} = require("./utils.js")
const {Remarkable} = require("remarkable")
const geoip = require("geoip-ultralightplus")

const md = new Remarkable({
	breaks: true,
})

const hash = crypto.createHmac("sha256", "this is a very very very very very dumb secret")

class Post {
	constructor(data) {
		this.id = data.id
		this.headline = data.headline
		this.subline = data.subline
		this.create = data.create
		this.author = data.author
		this.tags = data.tags
		this.content = data.content
		this.comments = data.comments
		this.rating = data.rating
	}

	// removes things not used
	preview() {
		let preview = new this.constructor(this)
		preview.comments = null
		preview.content = null
		return preview
	}

	// save to collection
	async save( collection ) {
		let _id = await collection.updateOne({id: this.id}, {$set: this}, {upsert: true}) // replace if exists
		console.log("saving POST", this.id, _id)
		return _id
	}

	static previewProjection( projection = {} ) {
		projection.headline = 1
		projection.subline  = 1
		projection.create   = 1
		projection.author   = 1
		projection.tags     = 1
		projection.rating   = 1
		projection.id       = 1
		
		return projection
	}

	// comment
	static async comment( db, id, ip, content) {
		return await db.updateOne({id:id, "comments.enabled": true}, {
			$push: {
				"comments.list": {
					author: content.name ?
						  `${content.name} (${ip} (${geoip.lookupCountry(ip)}))`
						: `${ip} (${geoip.lookupCountry(ip)})`,
					create: Date.now(),
					content: content.comment,
				}
			}
		})
	}
	
	// vote on post based on id
	static async vote( db, id, ip, type ) {
		ip = hash.update(ip)
		
		return await db.updateOne({id:id}, {
			$inc: kv("rating." + type, 1),
			$set: kv("raters." + ip, type),
		})
	}

	// change vote if allready voted: await Post.changeVote(posts, data.post, data.ip, data.vote)
	static async changeVote( db, id, ip, type ) {
		ip = hash.update(ip);

		let itype = type === "up" ? "down" : "up"

		// change vote score & change status
		return await db.updateOne({id:id}, {
			"$inc": Object.assign( // change vote
				kv("rating." +  type, +1),
				kv("rating." + itype, -1)
			),
			"$set": // status
				kv("raters." + ip, type),
		})
	}

	// checking if ip has allready voted:
	static async getVote( db, id, ip ) {
		ip = hash.update(ip);
		
		return (
			await db.findOne(
				Object.assign(
					{
						id: id,	
					},
					kv("raters." + ip, {
						$exists: true
					})
				)
			,
				{
					projection: 
						kv("raters."+ip, 1)
				}
			)
		)?.raters[ip]
	}

	static async get( id, db ) {
		let dbq = await db.findOne({id:id}, {projection: {
					"headline":1,
					"subline": 1,
					"create":  1,
					"author":  1,
					"tags":    1,
					"content": 1,
					"comments":1,
					"rating":  1,
					"id":      1,
				}})
		return dbq ? new Post(dbq) : null
	}

	markdown() {
		this.content = md.render(this.content) // render markdown
		this.subline = md.render(this.subline) // render markdown
		return this
	}
}
module.exports.Post = Post

// example post
module.exports.examplePost = new Post({
	id: -1,
	headline: "Lorem Ipsum dolor sit!",
	subline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Nec ullamcorper sit amet risus nullam eget felis eget.",
	create: 0,
	tags: ["Lorem","placeholder"],
	author: ["ur mom", "test"],
	content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Ut porttitor leo a diam sollicitudin tempor id eu nisl. Commodo nulla facilisi nullam vehicula ipsum a. Neque viverra justo nec ultrices dui. Non quam lacus suspendisse faucibus interdum posuere. Phasellus vestibulum lorem sed risus. Feugiat in ante metus dictum at tempor. Feugiat in fermentum posuere urna nec tincidunt praesent semper. Ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae. Justo eget magna fermentum iaculis eu non diam. Viverra ipsum nunc aliquet bibendum enim. Eros donec ac odio tempor orci dapibus ultrices.\n	Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Blandit libero volutpat sed cras ornare arcu dui vivamus arcu. Volutpat blandit aliquam etiam erat velit scelerisque in dictum. Ut tristique et egestas quis ipsum suspendisse ultrices. Ultrices neque ornare aenean euismod elementum nisi. At erat pellentesque adipiscing commodo elit at. Gravida rutrum quisque non tellus orci ac auctor. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Suspendisse interdum consectetur libero id. Dolor sit amet consectetur adipiscing elit ut. Justo donec enim diam vulputate ut pharetra sit. Sagittis orci a scelerisque purus semper eget duis at. Sapien eget mi proin sed. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Arcu dictum varius duis at consectetur lorem donec massa sapien. Ut sem nulla pharetra diam sit. Laoreet id donec ultrices tincidunt arcu non sodales.	\n	Est ullamcorper eget nulla facilisi etiam dignissim diam. Tristique senectus et netus et malesuada. Pretium quam vulputate dignissim suspendisse in est ante in. Scelerisque eu ultrices vitae auctor eu augue ut lectus. Tempus urna et pharetra pharetra massa massa ultricies. Id porta nibh venenatis cras sed felis eget velit aliquet. A lacus vestibulum sed arcu non odio euismod lacinia. Et leo duis ut diam quam nulla porttitor. Sed faucibus turpis in eu mi bibendum neque egestas. Malesuada nunc vel risus commodo viverra. Sit amet porttitor eget dolor. Lorem sed risus ultricies tristique nulla. Nunc consequat interdum varius sit. Blandit volutpat maecenas volutpat blandit aliquam. Habitant morbi tristique senectus et. Suscipit adipiscing bibendum est ultricies integer quis. Mauris pellentesque pulvinar pellentesque habitant morbi. Sed vulputate mi sit amet mauris commodo.\n	Viverra tellus in hac habitasse. Pharetra pharetra massa massa ultricies mi quis hendrerit dolor. Aenean sed adipiscing diam donec adipiscing. A pellentesque sit amet porttitor eget dolor morbi non. Nunc sed augue lacus viverra vitae congue eu. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque. Consectetur purus ut faucibus pulvinar elementum integer. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Cursus in hac habitasse platea dictumst quisque sagittis purus. Euismod nisi porta lorem mollis aliquam. Malesuada fames ac turpis egestas maecenas pharetra. Volutpat ac tincidunt vitae semper quis. Augue interdum velit euismod in pellentesque massa placerat. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt. Mi ipsum faucibus vitae aliquet nec. Tempor orci eu lobortis elementum. Aliquet enim tortor at auctor. Sed turpis tincidunt id aliquet risus feugiat. Accumsan tortor posuere ac ut consequat semper viverra. Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis.\n	**Rhoncus mattis rhoncus urna neque viverra justo nec ultrices dui. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida. Amet dictum sit amet justo donec. Tempor nec feugiat nisl pretium fusce. Integer malesuada nunc vel risus commodo viverra. Iaculis urna id volutpat lacus laoreet non. Pulvinar sapien et ligula ullamcorper malesuada proin. Euismod nisi porta lorem mollis aliquam ut porttitor leo a. Purus viverra accumsan in nisl. Ornare suspendisse sed nisi lacus sed.**",

	comments: {
		enabled: true,
		list: [{
			author: "Caesar",
			create: 1,
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In nibh mauris cursus mattis. Id venenatis a condimentum vitae sapien pellentesque habitant morbi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Tincidunt arcu non sodales neque sodales ut. Adipiscing bibendum est ultricies integer quis auctor elit. Massa massa ultricies mi quis hendrerit. Duis ut diam quam nulla porttitor massa. Maecenas accumsan lacus vel facilisis. Sit amet massa vitae tortor condimentum lacinia quis. Aliquet sagittis id consectetur purus. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Sit amet consectetur adipiscing elit pellentesque habitant. Consequat mauris nunc congue nisi vitae suscipit tellus mauris. Nulla aliquet enim tortor at auctor urna nunc id cursus. Tempor orci dapibus ultrices in iaculis nunc sed. Felis bibendum ut tristique et egestas quis. Scelerisque viverra mauris in aliquam sem."
		}]
	},

	rating: {
		up: 3,
		down: 9,
	}
})

class PostList extends Array {
	constructor( data ) {
		super()
		PostList.arrayOnly( data, this )
	}

	static arrayOnly( data, arr = [] ) {
		data.forEach(post => arr.push(new Post(post)))
		return arr
	}

	exportIds( ids = [] ) {
		this.forEach(post => {
			ids.push(post.id)
		})
		return ids
	}
}

module.exports.PostList = PostList
