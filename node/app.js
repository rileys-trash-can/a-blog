const fs = require("fs")
const express  = require("express")
const filestuff = require("./filestuff")
var   con       = require("./console")
const JSONdb = require("simple-json-db")

const app = express()
const port = 5500


// express static stuff sites:
app.get("/", (req, res) => filestuff.readFS(req, res, "html/index.html", "text/html"))
app.use("/static", express.static("html"))

// console commands:
con.registercmd( "stop", () => shutdown() )

// shutdown:
function shutdown() {
	process.exit(1)
}

// readout jsonDB:
const posts = new JSONdb("storage/posts.json")

// posts:
app.get("/posts", (req, res) => {
	if( typeof( req.query.api ) != "undefined" ) {
	res.type( "application/json" )
		if( typeof(req.query.featured) != "undefined") {
			if( ! ( req.query.len < 50 ) )  {
				res.status( 400 )
				res.end( JSON.stringify({"type":"err","text":"no len or to high specified"}) )		
			} else {
				
			}
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
