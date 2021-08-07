this.init = (db) => {
    this.db = db
    return this
}

// key structur:
// postID-commentID

// how 2 requests:
// POST /comment  // create comment
// comment:
// ---
// GET /comment   // read out comments
// post:

// CMDs
// comment postID [ commentID ]

// generating "hot" + "new" articles etc. (should run 1 / 0:30h and at startup + on new article)
this.read = (count, sort) => {
    let ret = []
	debugger
    switch (sort) {
    	case "hot":
		this.ranking.hot.length
			for ( let i = 0 ; i < count ; i++ ) {
				if ( typeof( this.ranking.hot[i] ) == "number" ) {
					ret.push( this.db.get( this.ranking.hot[i] ) )
				}
			}
				
			break

    	default:
		    for ( let i = 0 ; i < count ; i++ ) {
		        if ( this.db.get( i ) )
		            ret.push( this.db.get( i ) )
		    }
		    break
    }
    return ret
}
