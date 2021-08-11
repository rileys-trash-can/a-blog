this.init = (db) => {
    this.db = db
    return this
}

this.ranking = { "hot":[-1], "new":[-1] }

// generating "hot" + "new" articles etc. (should run 1 / 0:30h and at startup + on new article)
this.rank = (c) => {
    if (!c) {
        // read * from db to work on
        this.postBUFF = []
        let readall = false
        let i = 0
        while ( !readall ) {
            if ( this.db.get(i) ) {
                this.postBUFF[i] = this.db.get(i);
            } else {
                readall = true
            }
            i++
        }
        Object.keys(this.ranking).forEach((elem, index) => {
            this.rank(elem)
        });
    } else {
        let filterMap = {}
        let result = [];
        switch (c) {
            case "hot":
                filterMap = {}
                this.postBUFF.forEach((item) => {
                if (!filterMap[item.id] || ( filterMap[item.id].rating["+"] - filterMap[item.id].rating["-"] ) < ( item.rating["+"] - item.rating["-"] ) ) {
                    filterMap[item.id] = item;

                }
                })
                result = []
    
                for (let id in filterMap) {
                    result.push(filterMap[id]);
                }
                result.sort((a , b) => {
                    return ( b.rating["+"] - b.rating["-"] ) - ( a.rating["+"] - a.rating["-"] ); 
                });
                this.ranking.hot = []
                result.forEach((elem, i) => {
                    this.ranking.hot.push(elem.id)
                })
                break
    
            case "new":
                filterMap = {}
                this.postBUFF.forEach((item) => {
                if (!filterMap[item.id] || filterMap[item.id].create < item.create ) {
                    filterMap[item.id] = item;
                }
                })
                result = []
    
                for (let id in filterMap) {
                result.push(filterMap[id]);
                }
                result.sort((a , b) => {
                return b.create - a.create;
                });
                this.ranking.new = []
                result.forEach((elem, i) => {
                    this.ranking.new.push(elem.id)
                })
                break
        }
    }
}

this.read = (count, sort) => {
    let ret = []
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

this.push = (post) => {
	if ( !post ) return {"type":"err","text":"no post"}
	if ( !post.title || !post.content || !post.create ) return {"type":"err","text":"wrong contents"}
	
	if ( post.time == "auto" ) {
		post.time = new Date().getTime()
	}
	
	let len = this.db.get("len")
	this.db.set(len, {
		"autor": post.author,
		"content": post.content,
		"create": post.create,
		"desc": post.desc,
		"id": len,
		"rating": {"+":0,"-":0},
		"tags": post.tags,
		"title":post.title		
	})
	this.db.set("len", len+1)
	return {"type":"s","text":"Success! postid: " + len,"content":len}
}

this.set = (postID, post) => {
	if ( !post ) return {"type":"err","text":"no post"}
	if ( !post.title || !post.content || !post.create ) return {"type":"err","text":"wrong contents"}

	this.db.set(postID, post)
	return {"type":"s", "text":"Success, set post \"" + postID + "\"","content":postID}
}
