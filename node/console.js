const readline = require("readline")

module.exports.registerdcmds = {}

const rl = readline.createInterface({
	input:  process.stdin,
	output: process.stdout
})

module.exports.init = () => {
	prefix = ""	
	process.stdout.write(prefix + "> ")
	rl.on("line", (i) => {
		module.exports.eval(i)
		process.stdout.write(prefix + "> ")
	})	
	return module.exports
}
module.exports.eval = ( cmd ) => {
	let split = cmd.split( " " )
	let comm  = split[0]
	split.shift()
	let args  = split

	if (! comm ) return // if cmd empty dont do anything

	if ( comm === "FE!") {
		process.exit(1) // FORCE EXIT "crash" programm
	}

	if ( module.exports.registerdcmds[comm] ) {
		module.exports.registerdcmds[comm](args, prefix)
	} else {
		console.log(`Bad command! '${ comm }'`)			
	}
}
module.exports.registercmd = ( cmd, callback ) => {
	module.exports.registerdcmds[cmd] = callback
}
this.registerdcmds["help"] = () => {
	console.log( Object.keys(this.registerdcmds).sort().join(", ") )
}
this.registerdcmds["?"] = () => {
	this.eval("help")
}
this.registerdcmds["eval"] = () => {
	try {
		console.log(eval(args.join(" ")))
	} catch {
		console.log("Couldn't execute!")
	}
}
this.registerdcmds["exit"] = () => {
	process.exit(1)
}
this.registerdcmds["clear"] = () => {
	console.clear()
}
