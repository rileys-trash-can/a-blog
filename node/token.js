// token.js
// ©derz 2022 GPL-v2.0 or so
const crypto = require("crypto")

class TokenGenerator {
	constructor() {
		// generate key and initial Vector (variable as no one cares about having to reload the site or sth lol idk what im writing now fuck off)
		this.key = crypto.randomBytes(32);
		this.iVec = crypto.randomBytes(16);
	
		this.alg = "aes-256-cbc";
		
		console.log("[TOKEN]", "crypto", "key", this.key.toString("hex"), "iVec", this.iVec.toString("hex"))
	}

	static noCrypt( expire, content ) {
		return JSON.stringify({
			"expire": Date.now() + expire,
			"content": content,
		})
	}

	newCipher() {
		return crypto.createCipheriv(this.alg, this.key, this.iVec);
	}

	newDecipher() {
		return crypto.createDecipheriv(this.alg, this.key, this.iVec);
	}

	generate( expire, content ) { // time to expire in ms
		const cipher = this.newCipher()

		let tkn = cipher.update(TokenGenerator.noCrypt(expire, content), "utf-8", "hex")
		tkn += cipher.final("hex")

		return tkn
	}

	validate( token ) { // check if token is still valid and if for what
		const decipher = this.newDecipher()
		let data;

		// try to decipher
		try {
			data = decipher.update( token, "hex", "utf-8")
			data += decipher.final("utf8")
		} catch(err) {
			data = null
		}

		// parse the data
		data = JSON.parse(data)

			if( !data ) return null

		// check if expired
		if( data.expire > Date.now() )
			return data.content
		else
			return null
	}
}
module.exports.TokenGenerator = TokenGenerator
