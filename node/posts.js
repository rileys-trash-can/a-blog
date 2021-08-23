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
            	this.len = i
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

this.read = (count, sort, index) => {
    let ret = []
    if ( count == -1 ) {
    	count = this.length
    }
    switch (sort) {
    	case "hot":
			for ( let i = 0 ; i < count ; i++ ) {
				if ( typeof( this.ranking.hot[i] ) == "number" ) {
					ret.push( this.db.get( this.ranking.hot[i] ) )
				}
			}
				
			break

    	default:
    		index = index ? index : 0
		    for ( let i = 0 ; i < count ; i++ ) {
		        if ( this.db.get( i + index ) )
		            ret.push( this.db.get( i + index ) )
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
		"author": post.author,
		"content": post.content,
		"create": post.create,
		"desc": post.desc,
		"id": len,
		"rating": {"+":0,"-":0},
		"tags": post.tags,
		"title":post.title		
	})
	this.db.set("len", len+1)
	this.index()
	return {"type":"s","text":"Success! postid: " + len,"content":len}
}

this.set = (postID, post) => {
	if ( !post ) return {"type":"err","text":"no post"}
	if ( !post.title || !post.content || !post.create ) return {"type":"err","text":"wrong contents"}

	this.db.set(postID, post)
	return {"type":"s", "text":"Success, set post \"" + postID + "\"","content":postID}
}


this.IPs;
this.ipcheck = (post, ip) => {
	if ( !this.IPs[ip] ) return false
	if ( !this.IPs[ip][post] ) return false
	return this.IPs[ip][post]
}

this.ipset = (post, ip, rating) => {
	if ( !this.IPs[ip] ) {
		this.IPs[ip] = {}
	}
	this.IPs[ip][post] = rating
}

this.rate = ( post, rating, ip ) => {
	if ( !post || !rating ) return {"type":"err", "text":"not enough args"}

	let ipi = this.ipcheck( post, ip )
	let p = this.db.get( post )

	if ( ip ) {
		if ( ipi == "+" ) {
			p.rating["+"]--
		}
		if ( ipi == "-" ) {
			p.rating["-"]--
		}
		
	}

	this.ipset( post, ip, rating )
	p.rating[rating]++
	this.db.set( post , p )
	return {"type":"s", "text":"success!", "content": p.rating}
}

// does the indexing for search by tags / author
this.index = () => {
	let len = this.len
	this.tags = []
	this.author = []

	for ( let i = 0 ;  i < len ; i++ ) {
		this.tags[i] = this.db.get( i ).tags.sort()
	}
	for ( let i = 0 ;  i < len ; i++ ) {
		this.author[i] = this.db.get( i ).author
	}

	
}

this.search = ( tags, author, sort, pinfo ) => {
	// search goes through all articles and counts the amount of matching tags; then it uses sort to sort stuff though the this.ranking[sort]
	let len = this.len 
	let rnk = [] // rank based on tags

	// rnk[postID] = amount of matching tags
	for ( let l = 0 ; l < len ; l++ ) {
		if ( ( author.includes( this.author[l] ) || author.length == 0 || author == false ) && tags.length > 0 ) {		
			for ( let i = 0 ; i < tags.length ; i++ ) {
				if ( this.tags[l].includes( tags[i] ) ) {
					if ( !rnk[l] ) {
						rnk[l] = 0
					}
					rnk[l]++
				}
			}
		}
		if ( author.includes( this.author[l] ) && ( tags.length == 0 || this.tags == false ) ) {
			rnk[l] = 1
		}

	}

	let rem = true
	let sorted = []
	let pos = -1;
	let hig = 0;
	while ( rem ) {
		for ( let i = 0 ; i < rnk.length ; i++ ) {
			if ( rnk[i] ) {
				if ( rnk[i] > hig ) {
					hig = rnk[i]
					pos = i
				}
			}
		}
		if ( pos != -1 ) {
			sorted.push( pos )
			rnk[pos] = undefined
			hig = 0
			pos = -1
		} else {
			rem = false
		}
	}

	if ( sort ) {
		// do sorting
		// another few for loops
	}

	if ( pinfo ) {
		// add post data to response
		let ns = []
		for ( let i = 0 ; i < sorted.length ; i++ ) {
			ns.push( this.db.get( sorted[i] ) )
		}
		return ns
	}

	return sorted
}
