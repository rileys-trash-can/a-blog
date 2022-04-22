const fs        = require("fs").promises
const express   = require("express")
const ejs       = require("ejs")
const {Post, examplePost} = require("./posts")
const {getIp} = require("./utils")
const con       = require("rl-console")
const {MongoClient} = require("mongodb")
const {collection, Sorter}  = require("./sort")
const {TokenGenerator}   = require("./token")
const cookieParser = require('cookie-parser')
const {Remarkable} = require("remarkable")
const bodyParser = require("body-parser")
const {Author} = require("./author")
const {Authenticator} = require("./2fa")

// token generators:
const voteToken = new TokenGenerator()
const commentingToken = new TokenGenerator()

// some db variables do need to be global
let blogDB, posts, authors, secrets

// other globals
let sort, authenticator
let evil = []

// express
const app = express()

// configure view engine
app.set("view engine", "ejs")

// cookies!1!
app.use(cookieParser())

// post requests!1!
app.use(bodyParser.urlencoded({ extended: true }));

// static:
app.use("/static", express.static("static"))

// halfstatic (TM)
// themes:
app.get("/cookiestatic/theme.css", (req, res) => {
	let theme = req.cookies.theme
	if( ["dark", "light", "none"].includes(theme) ) {// if valid theme is set
		res.redirect(`/static/style/theme/${theme}.css`)
		return
	}
	res.redirect(`/static/style/theme/dark.css`)
})

// layout:
app.get("/cookiestatic/layout.css", (req, res) => {
	let layout = req.cookies.layout
	if( ["default", "none"].includes(layout) ) {// if valid theme is set
		res.redirect(`/static/style/layout/${layout}.css`)
		return
	}
	res.redirect(`/static/style/layout/default.css`)
})

// index
app.get("/", async (req, res) => {
	res.render("index", {
		posts:await sort.dateDesc.preview().limit(5).project(Post.previewProjection).toArray(),
		url: "http://" + req.get("host") + req.originalUrl,
	})
})

// listing of posts & sorting
app.get("/posts", async (req, res) => {
	const count = await posts.count()
	const postsPerPage = 20
	const page = req.query.page ? (Number(req.query.page) > 0 ? Number(req.query.page) : 0 ) : 0
	const sorter = req.query.sort ? (sort.isValidSort(req.query.sort) ? sort[req.query.sort] : sort.updownVoteAsc ) : sort.updownVoteAsc
		
	res.render("postlist", {
		posts: await sorter.preview().skip(postsPerPage * page).limit(postsPerPage).toArray(),
		url: "https://" + req.get("host") + req.originalUrl,
		title: "posts",
		pager: {
			page: page,
			pageCount: Math.floor(count / postsPerPage)+1,
		},
		sort: sorter,
		tags: false,
		sorters: sort.getSorters(),
	})	
})

// rss
app.get("/rss.xml", async (req, res) => {
	res.type("xml")
	if( req.query.html !== undefined )
		res.render("rss-html", {
			posts: await sort.dateDesc.render(20, false),
		})
	else
		res.render("rss", {
			posts: await sort.dateDesc.noComments(false).limit(20).toArray(),
		})
})

// search for tags (only):
app.get("/tag/:tags", async (req, res) => {
	const tags = req.params.tags.split("+")
	// add tags thing:
	if( req.query.add )
		return res.redirect("/tag/" + tags.concat(req.query.add.toLowerCase()).join("+"))

	const filter = sort.tag(tags)
	const page = req.query.page ? (Number(req.query.page) > 0 ? Number(req.query.page) : 0 ) : 0

	res.render("postlist", {
		posts: await filter.preview().limit(20).skip(page * 20).toArray(),
		url: "https://" + req.get("host") + req.originalUrl,
		title: "/tag",
		pager: {
			page: page,
			pageCount: Math.floor(filter.length())
		},
		sort: false,
		tags: tags,
		sorters: false,
	})
})

// /author page
app.get("/author/:author", async (req, res) => {
	// TODO: author db with sth like about page for each one
	// (Picture)
	// desc
	// category
	// list of posts

	if( !req.params.author ) {
		res.status(404)
		res.render("404", {
			url: req.originalUrl,
		})
		return
	}

	let author;

	if( req.query.name !== undefined )
		author = await Author.byName( req.params.author, authors )
	else
		author = await Author.get( req.params.author, authors )

	if( !author ) {
		res.status(404)
		res.render("404", {
			url: req.originalUrl,
		})
		return
	}


	res.render("author", {
		author: await author.render( posts ),
		url: req.originalUrl,
	})
})

// read singular post
app.get("/posts/:id", async (req, res) => {
	let notice = null
	if( req.query.vote === "success" )
		notice = {
			"type": "success",
			"title": "Success",
			"message": "Successfully voted on post, thanks!",
		}
	if( req.query.vote === "error" )
		notice = {
			"type": "error",
			"title": "Error",
			"message": "There was an error trying to vote on this post, please try again.",
		}
	if( req.query.comment === "success" )
		notice = {
			"type": "success",
			"title": "Success",
			"message": "Successfully commented on post, thanks!",
		}
	if( req.query.comment === "error" )
		notice = {
			"type": "error",
			"title": "Error",
			"message": "There was an error trying to comment on this post, please try again.",
		}

	let post = await Post.get(req.params.id, posts, authors)
	
	if( !post ) { // 404
		res.status(404)
		res.render("404", {
			url: req.originalUrl,
		})
		return
	}

	post.markdown()
	res.render("post", {
		post: post,
		ctoken: commentingToken.generate(1000*60*30, {ip: getIp(req), post: req.params.id}),
		url: "http://" + req.get("host") + req.originalUrl,
		voting: {
			up: {
				token: voteToken.generate(1000*60*30, {ip: getIp(req), post: req.params.id, vote: "up"}),
				clicked: req.cookies[req.params.id+".vote"] ? req.cookies[req.params.id+".vote"] === "up" : false,
			},
			down: {
				token: voteToken.generate(1000*60*30, {ip: getIp(req), post: req.params.id, vote: "down"}),
				clicked: req.cookies[req.params.id+".vote"] ? req.cookies[req.params.id+".vote"] === "down" : false,
			},
		},
		notice: notice,
	})
})

// vote on posts
app.get("/posts/:id/vote", async (req, res) => {
	// is token presend and if, is it valid:
	if( req.query?.token && req.query.token.length > 32 ) {
		// check if valid
		let data = voteToken.validate(req.query.token);
		if( !data ) {
			res.redirect(`/posts/${req.params.id}/?vote=error`)
			return
		}

		// check if ip is correct
		if( data.ip !== getIp(req) ) {
			res.redirect(`/posts/${req.params.id}/?vote=error`)
			return			
		}
		
		console.log(`voting "${data.vote}" on post "${data.post}" with ip "${data.ip}"`)

		// check if allready voted:
		let voted = await Post.getVote(posts, data.post, data.ip )

		// if allready voted, check if vote changed and if change vote
		if( voted ) {
			if ( voted !== data.vote ) { // vote changed
				await Post.changeVote(posts, data.post, data.ip, data.vote)
			}
			res.cookie(data.post+".vote", data.vote, { maxAge: 9999999999999, httpOnly: true })
			res.redirect(`/posts/${data.post}/?vote=success`)
			return
		}

		// do the actual voting:
		res.cookie(data.post+"-vote", data.vote, { maxAge: 9999999999999, httpOnly: true })
		await Post.vote(posts, data.post, data.ip, data.vote)

		res.redirect(`/posts/${data.post}/?vote=success`)
	} else {
		res.redirect(`/posts/${req.params.id}/?vote=error`)
	}
	
})

// comment on posts
app.post("/posts/:id/comment", async (req, res) => {

	// check for content:
	if( !req.body.comment || !req.params.id ) {
		res.redirect(`/posts/${req.params.id}/?comment=error`)
		return
	}

	// is token presend and if, is it valid:
	if( req.body?.token && req.body.token.length > 32 ) {
		// check if valid
		let data = commentingToken.validate(req.body.token);
		if( !data || data.ip !== getIp(req) ) {
			res.redirect(`/posts/${req.params.id}/?comment=error`)
			return
		}

		console.log("commenting", req.body.comment.length, "chars on post", req.params.id, "from", data.ip)

		// commenting:
		await Post.comment( posts, req.params.id, data.ip, {
			name: req.body.name,
			comment: req.body.comment,
		})

		res.redirect(`/posts/${req.params.id}/?comment=success`)
	} else {
		res.redirect(`/posts/${req.params.id}/?comment=error`)
	}

})

app.use("/admin", async (req, res, next) => {
	if( evil.includes(getIp(req)) ) return

	const auth = ( req.headers.authorization || "" ).split(" ")[1] || ""
	const [user, pass] = Buffer.from(auth, "base64").toString().split(":")
	let valid

	// do pass checking:
	if( !user | !pass | !(valid = await authenticator.validate( user, pass )) ) {
		res.set('WWW-Authenticate', 'Basic realm="reality"');
		res.status(401)
		res.end()
	} else {
		next()

		// keep key valid for ~30mins
		
		authenticator.keepValid(user, valid)
	}
})

app.get("/admin/editor", (req, res) => {
	res.render("admin/editor")
})

app.post("/admin/editor/post", async (req, res) => {
	try {
	post = new Post({
		headline: req.body.headline,
		subline:  req.body.description,
		create:   Date.now(),
		author:   req.body.author.split(" "),
		tags:     req.body.tag.split(" "),
		content:  req.body.content,
		comments: {enabled: true, list: []},
		rating:   {up: 0, down: 0},
	})
	} catch {
		res.end("not ok")
	}

	await post.save( posts )

	res.end("ok")
})

app.get("/redirect/social/:social", (req, res) => {
	switch( req.params.social ) {
		case "tiktok": res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); break;
		case "github": res.redirect("https://github.com/DerZombiiie"); break;
		default: res.redirect("/fuckoff04"); break
	}
})

async function main() {
// mongodb
const mongoClient = new MongoClient("mongodb://mongo:27017/blog")

// connecting to mongo & starting express
await Promise.all([
	mongoClient.connect().then(_ => console.log("connected to mongo")),
	new Promise(r => app.listen(80, _ => r(console.log(`Listening on :80`)))),
])

blogDB  = mongoClient.db("blog")    // blog go here
posts   = blogDB.collection("posts") // post go here
authors = blogDB.collection("authors") // authors go here
secrets = blogDB.collection("secrets") // secret stuffs 2fa code go here

// sorting stuff
sort = new Sorter(posts, collection, authors)

// secret stuffs
authenticator = new Authenticator(secrets)

con.registercmd("evil", av => {
	if( !av[1] ) {
		console.log(evil.join(", "))
		return
	}

	if( av[1][0] && (av[1][0] === "!") ) {
		let iip = av[1].substr(1)
		evil = evil.filter(ip => ip !== iip)
		return
	}

	evil.push(av[1])	
})

con.registercmd("user", async (av, r) => {
	if( !av[1] | av[1] == "help" | !av[2] ) return r(console.log("Usage: user <create | delete | qr | validate> <username>"))

	switch( av[1] ) {
		case "create":
			console.log("Creating user %s", av[2])

			// the secret thing
			let [dbq, secret] = await authenticator.createUser( av[2] )
			if( !dbq ) return r(console.log("User exists!"))

			// output the qr code:
			console.log(await secret.createUTF8())
			console.log("or:", secret.base32, "or", secret.otpauth_url)
			r()
			break;

		case "delete":
			let existed = await authenticator.deleteUser( av[2] )
			console.log(existed ? "Deleted user " + av[2] : " User " + av[2] + " didn't exist")
			r()
			break;

		case "qr":
			let res = await authenticator.getSecret( av[2] )
			if( !res ) return r(console.log("user not exist"))

			console.log(await Authenticator.qrFromBase32(res))
			console.log("or:", res)
			r()
			break;

		case "validate":
			console.log(await authenticator.validate(av[2], Number(av[3])))
			r()
			break;
	}
}, true)

con.registercmd("eval", async (av, r) => {
	try {
		av.shift()
		let p;
		eval("p = new Promise(async r => {console.log(" + av.join(" ") + "); r()})" )
		await p
	} catch(e) {
		console.log("Err", e)
	}
	r()
}, true)


con.init()
}

main()
