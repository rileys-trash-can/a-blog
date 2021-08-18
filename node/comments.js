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
	if ( !typeof(len) == "number" || !typeof(len) == "undefined" ) return {"type":"err","text":"bad length"}

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
		if ( !this.db.get(post + "-" + (i + offset) ).deleted ) {
			let c = this.db.get(post + "-" + (i + offset) )
			c.id = i
			ret.push( c )
		}
	}
	return {"type":"s","content":ret}
}

this.delete = (post, comment) => {
	if ( !this.db.get(post + "-" + comment) ) return {"type":"err","text":"Comment dosn't exist"}
	let commentBUFF = this.db.get(post + "-" + comment)
	commentBUFF.deleted = true
	this.db.set(post + "-" + comment, commentBUFF)
	return {"type":"s","text":"Success!"}
}

this.set = (post, commentID, comment) => {
	this.db.set(post + "-" + commentID, comment)
	return {"type":"s"}
}
