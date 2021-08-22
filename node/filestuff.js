const fs = require("fs")

module.exports.handler = (req, res, folder) => {
	fs.readFile("html/" + folder + "/" +  req.params.file, "utf8", (err, data) => {
		if (err) {
			res.status(404)
			res.end("Not Found!")
		} else {
			res.type(req.params.file)
			res.end(data)
		}
	})
}
module.exports.readFS = (req, res, file, type) => {
	fs.readFile(file, "utf8", (err, data) => {
		if (err) {
			res.status(500)
			res.end("not found!")
		} else {
			res.type(type ? type : file)
			res.end(data)
		}
	})
}
module.exports.readFSr = (req, res, file, type, search, replace) => {
	fs.readFile(file, "utf8", (err, data) => {
		if (err) {
			res.status(500)
			res.end("not found!")
		} else {
			res.type(type ? type : file)
			res.end( data.split(search).join(replace) )
		}
	})
}
