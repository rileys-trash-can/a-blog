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

this.saveconf = () => {
	fs.writeFile("config/admin.yaml", yaml.dump(this.config), "utf8", ()=>{})
}

this.pass = ( pass ) => {
	if ( this.config.passhash == crypto.createHash( "sha256" ).update( pass ).digest( "base64" ) ) return true
	return false
}

this.indexuse = (req, res, next) => {
	const auth = ( req.headers.authorization || "" ).split(" ")[1] || ""
	const [user, pass] = Buffer.from(auth, "base64").toString().split(":")

	if( user != "admin" || !this.pass( pass ) ) {
		// not auth
		res.set("WWW-Authenticate", "Basic realm=401")
		res.status(401)
		res.end("Not authenticated!")
		return
	}
	next()
}

this.index = (req, res) => {
	console.log("authenticated!")

	fs.readFile("html/admin/index.html", (data) => {
		res.type("text/html")
		res.end(data)
	})
	return
}

