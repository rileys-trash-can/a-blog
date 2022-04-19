const { exec }   = require('child_process')
const speakeasy  = require('speakeasy')
const crypto     = require('crypto')

function sha256( spec ) {
	return crypto.createHash('sha256').update(spec).digest('hex')
}

class Authenticator {
	constructor( secrets ) {
		this.db = secrets
		
		this.db.createIndex({'name': 1}, {unique:true})
	}

	async deleteUser( name ) {
		return (await this.db.deleteOne({name})).deletedCount === 1
	}

	async createUser( name ) {
		// check if user exists:
		if( await this.db.findOne({name}) ) return [null]
	
		let secret = Authenticator.createSecret()

		secret.createUTF8 = _ => {
			return new Promise(r => 
				exec(`qrencode '${secret.otpauth_url}' -t ANSIUTF8 -o -`, (err, stdout, stderr) => {
					if(err | stderr) return r(null)
	
					r( stdout )
				})
			)
		}
	
		return [
			this.db.insertOne({
				name,
				secret: secret.base32,
				validCodes: [],
			}),
			secret
		]
	}

	async validate( name, code ) {
		if( !name | !code ) return false

		// check if is in valid array of user:
		if( await this.db.aggregate([{
			$match: {
				name,
				validCodes: {
					$in:[sha256(code.toString())]
				}
			}
		}, {
			$project: {_id:1}
		}])) return true

		return speakeasy.totp.verify({
			secret: await this.getSecret( name ),
			encoding: 'base32',
			window: 2,
			token: code,
		})
	}

	keepValid( name, code ) {
		return this.db.aggregate([
		{
			$match: {
				$nin: { validTokens:[sha256(code.toString())] }
			}
		},
		{
			$push: {
				validCodes: sha256(code.toString())
			}
		}
		])
	}

	async getSecret( name ) {
		let dbq = await this.db.findOne({name})
		if( !dbq ) return null

		return dbq.secret
	}

	static qrFromBase32( base32 ) {
		return new Promise( r => exec(`qrencode '${"otpauth://totp/SecretKey?secret=" + base32.toString()}' -t ANSIUTF8 -o -`, (err, stdout, stderr) => {
			if(err | stderr) return r(null)

			return r(stdout)
		}))
	}

	static createSecret() {
		return speakeasy.generateSecret({length: 20});
	}
}

module.exports = {
	Authenticator
}
