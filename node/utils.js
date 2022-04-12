// utils.js
// ©derz 2022 GPL-v2-no-later

module.exports.getIp = ( req ) => { // ip though apache2 proxy
	const header = req.headers["x-forwarded-for"].split(", ")
	return header[header.length-1]
} 

// c
module.exports.kv = ( k, v ) => {
	let o = {}
	o[k] = v
	return o
}
