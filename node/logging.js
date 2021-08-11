const fs = require("fs")

this.init = async ( ll, logfile) => {
	this.ll = ll // ll = logging level
	this.locked = false
	this.logfile = logfile
	this.writeBUFF = ""
	this.writelog("--- SEPERATOR ---\n")
}
this.d = {
	"none": -1,
	"basic": 0,
	"datahorder": 10,
	"haxxer": 1337
}

this.log = ( msg, ll ) => {
	if(ll => this.ll) {
		// prep msg for logging:
		msg = msg.replace(/\n/g, "\n" + " ".repeat(14) + "| ")
		this.writelog( new Date().getTime() + " | " + msg + "\n" )
	}
	if(this.ll == this.d.haxxer) {
		console.log(msg)
	}
}

this.writelog = async ( msg ) => {
	if(!this.locked) {
		this.locked = true
		let BUFF = this.writeBUFF + msg
		this.writeBUFF = ""
		await fs.promises.appendFile(this.logfile, BUFF)
		this.locked = false
	} else {
		this.writeBUFF += msg
	}
}

this.clearBUFF = () => { // execute before close of programm!
	this.locked = true // forever
	fs.appendFileSync(this.logfile, this.writeBUFF)
}
