const fs = require("fs")
const express  = require("express")
const filestuff = require("./filestuff")
var   con       = require("./console")
const JSONdb = require("simple-json-db")
var   posts = require("./posts")

const app = express()
const port = 5500


// express static stuff sites:
app.get("/", (req, res) => filestuff.readFS(req, res, "html/index.html", "text/html"))
app.use("/static", express.static("html"))

// console commands:
con.registercmd( "stop", () => shutdown() )
con.registercmd( "getpost", (arg) => console.log(postsDB.get(arg[0])) )
con.registercmd( "getpostranking", (arg) => console.log(posts.ranking[arg[0]]))
con.registercmd( "appeval", (arg) => {try {console.log(eval(arg.join(" ")))} catch {console.log("Couldn't execute!")}})

con.registercmd( "post", (arg => {
	let t
	sw:
	switch (arg[0]) {
		case "get":
			if (!arg[1]) {
					console.log("Nothing to get!")
				} else {
					console.log(postsDB.get(arg[1]))
				}
				break
		
		case "ranking":
			if (arg[1]) {
				console.log(posts.ranking[arg[1]])
				break sw
			} else {
				let keys = Object.keys(posts.ranking)
				for ( let i = 0 ; i < keys.length ; i++ ) {
					console.log(keys[i] + ":")
					console.log(posts.ranking[keys[i]])
				}
				break sw
			}

		case "rank":
			console.log("Ranking...")
			t = posts.rank()
			if (t) console.log(t)
			console.log("DONE!")
			break

		case "sync":
			console.log("syncing...")
			t = postsDB.sync()
			if (t) console.log(t)
			console.log("DONE!")
			break

		default:
			console.log("Sub-command not found or not supplied!")
				

		case "?":
		case "h":
		case "help":
			console.log("Availible cmds: get, ranking, rank")
			break
	}
}))

// shutdown:
function shutdown() {
	process.exit(1)
}

// readout jsonDB:
const postsDB = new JSONdb("storage/posts.json")
posts.init(postsDB)
posts.rank()

// posts:
app.get("/posts", (req, res) => {
	if( typeof( req.query.api ) != "undefined" ) {
	res.type( "application/json" )
		if( ! ( req.query.len < 50 ) )  {
			res.status( 400 )
			res.end( JSON.stringify({"type":"err","text":"no len or to high specified"}) )		
		} else {
			res.status( 200 )
			res.send(`{"type":"s","content":${JSON.stringify(posts.read(10, "featured"))}}`)
		}
	} else {
		res.status( 400 )
		res.end("Why you trying this?")
	}
})

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
	con.init()
})
