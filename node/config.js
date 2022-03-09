const yaml = require("js-yaml")
const fs = require("fs")

try {
	let configfile = fs.readFileSync("config/config.yaml", "utf8")
	data = yaml.load( configfile )
} catch {
	console.log("Couldn't read config file!")
	console.log("Abort!")
	process.exit(0)
}

module.exports = data
