const fs        = require("fs").promises
const express   = require("express")
const ejs       = require("ejs")
const config    = require("./config")
const { posts } = require("./posts")
const con       = require("rl-console")
const {MongoClient} = require("mongodb")

async function main() {
// mongodb
const mongoClient = new MongoClient("mongodb://mongo:27017/posts")

mongoClient.connect().then(_ => {
	console.log("connected to mongo")
})

/*
var PostSchema = new mongoose.Schema({
	id: Number,
	title: String,
	create: Date,
	tags: [String],
	author: String,
	desc: String,
	content: String,

	comments: {
		enabled: Boolean,
		list: [{
			author: String,
			create: Date,
			content: String,
		}]
	},

	rating: {
		up: Number,
		down: Number,
	}
})

const Post = mongoose.model("Post", PostSchema)

const test = new Post({
	id: 0,
	title: "test",
	create: 0,
	tags: ["hi","wc"],
	author: "ur mom",
	desc: "test2",
	content: "content(TM)",

	comments: {
		enabled: true,
		list: [{
			author: "name",
			create: 1,
			content: "Hi, comment!",
		}]
	},

	rating: {
		up: 3,
		down: 9,
	}
})

await test.save();

//mongoose.model("Post", Post)



// express
const app = express()

// configure view engine
app.set("view engine", "ejs")

// static:
app.use("/static", express.static("static"))

app.get("/", (req, res) => {
	res.render("index", {
		content:posts.newest()
	})
})

client.connect().then(_ =>
	app.listen(80, _ => {
		console.log(`Listening on :80`)
		listDatabases(client).then(d => {console.log(d)})
		con.init()
	})
)
*/
}
main()
