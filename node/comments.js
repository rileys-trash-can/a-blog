this.init = (db) => {
    this.db = db
    return this
}

this.push = (post, comment) => {
	if (!post) return {"type":"err","text":"no post"}
	if (!comment.body || !comment.time || !comment.author) return {"type":"err","text":"Comment not complete"}

	let len = this.db.get(post + "-len") ? this.db.get(post + "-len") : 0
	this.db.set(post + "-" + len, comment)
	this.db.set(post + "-len", len + 1)

	return {"type":"s", "text":"Commented!", "content":len}
}

this.get = (post, len) => {
	if ( !post ) return {"type":"err","text":"no post"}
	if ( !(typeof(len) == "number" || typeof(len) == "undefined") ) return {"type":"err","text":"bad length"}

	let length = this.db.get(post + "-len") ? this.db.get(post + "-len") : 0
	let abslen = this.db.get(post + "-len") ? this.db.get(post + "-len") : 0
	if ( len == 0 ) return {"type":"s","content":[]}
	if ( typeof(len) == "number") {
		if ( len < length ) length = len
	}

	// calc offset (if any)
	let offset = abslen - length

	let ret = []	
	for ( let i = length-1 ; i > -1 ; i-- ) {
		ret.push( this.db.get(post + "-" + (i + offset) ) )
	}
	return {"type":"s","content":ret}
}
