const fs = require("fs")
const crypto = require("crypto")
const yaml = require("js-yaml")

// init:
this.init = (comments, posts, log) => {
	this.comments = comments
	this.posts    = posts
	this.log      = log
}

// readout stuff
this.config = yaml.load( fs.readFileSync("config/admin.yaml", "utf8") )

// crypto.createHash("sha256").update("base64")
this.setpass = ( p ) => {
	this.config.passhash = crypto.createHash( "sha256" ).update( p ).digest( "base64" )
	this.saveconf()
}

// save conf (just pwd)
this.saveconf = () => {
	fs.writeFile("config/admin.yaml", yaml.dump(this.config), "utf8", ()=>{})
}

// check password
this.pass = ( pass ) => {
	if ( this.config.passhash == crypto.createHash( "sha256" ).update( pass ).digest( "base64" ) ) return true
	return false
}

// does the auth stuff
this.pre = (req, res, next) => {
	const auth = ( req.headers.authorization || "" ).split(" ")[1] || ""
	const [user, pass] = Buffer.from(auth, "base64").toString().split(":")

	if( user != "admin" || !this.pass( pass ) || pass == "." ) {
		// not auth
		res.set("WWW-Authenticate", "Basic realm=401")
		res.status(401)
		res.end("Not authenticated!")
		return
	}
	next()
}

// POST: /admin/post api endpoint handler
this.post = (req, res) => {
	res.type("application/json")
	let ret
	let post
	switch ( req.body.action ) {
		case "set":
			if( !req.body.id || !req.body.title || !req.body.body || !req.body.tags || !req.body.time || !req.body.author || !req.body.desc ) {
				res.status( 400 )
				res.end( JSON.stringify( {"type":"err","text":"Non complete request!"} ) )
				return
			}
			if ( req.body.time == "auto" ) {
				req.body.time = new Date().getTime()
			}

			this.log.log(`Trying to set post "${req.body.id}", as name "${req.body.title}"`, this.log.d.basic)	
			post = {
				"author": req.body.author,
				"content": req.body.body,
				"create": req.body.time,
				"desc": req.body.desc,
				"id": typeof(req.body.id) == "number" ? req.body.id : -1,
				"rating": {"+":0,"-":0},
				"tags": req.body.tags,
				"title": req.body.title
			}
			this.log.log(`Contents: ${JSON.stringify( post )}`, this.log.d.datahorder)	
			
			ret = this.posts.set( req.body.id, post )
			
			if ( ret.type != "s" ) res.status( 400 )
			res.end( JSON.stringify( ret ) )
			break

		case "push":
			if( !req.body.title || !req.body.body || !req.body.tags || !req.body.time || !req.body.author || !req.body.desc ) {
				res.status( 400 )
				res.end( JSON.stringify( {"type":"err","text":"Non complete request!"} ) )
				return
			}
			if ( req.body.time == "auto" ) {
				req.body.time = new Date().getTime()
			}

			this.log.log(`Trying to set post "${req.body.id}", as name "${req.body.title}"`, this.log.d.basic)

			post = {
				"author": req.body.author,
				"content": req.body.body,
				"create": req.body.time,
				"desc": req.body.desc,
				"id": -1,
				"rating": {"+":0,"-":0},
				"tags": req.body.tags,
				"title": req.body.title
			}

			this.log.log(`Contents: ${ JSON.stringify(post) }`, this.log.d.datahorder)
			
			ret = this.posts.push( post )
			if ( ret.type != "s" ) res.status( 400 )
			res.end( JSON.stringify( ret ) )
			break	
		default:
			res.status( 501 )
			res.end( JSON.stringify( {"type":"err","text":"Not implemented!"} ) )
			break
	}

	return
}

