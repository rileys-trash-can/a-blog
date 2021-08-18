//readout ?page
param = {}
{
let oparam = window.location.search.substr(1).split("&")
index = undefined
if ( oparam != "" ) {
	for ( let i = 0 ; i < oparam.length ; i++ ) {
		let p = oparam[i].split("=")
		param[p[0]] = p[1]
		if ( p[0] == "page" ) {
			index = Number(p[1])
		}
	}
}
if ( !index ) {
	index = 0
}
}

class entry {
    constructor(title, author, desc, href, tags, id, rating) {
        this.title = title;
        this.author = author;
        this.desc = desc;
        this.href = href;
        this.tags = tags;
        this.rating = rating
        this.id = id
    }
    createelement() {
		// create taglist
		let tags = ""
		for ( let i = 0 ; i < this.tags.length ; i++ ) {
			tags += `<span class="tag"><a href="/search?tag=${this.tags[i]}">${this.tags[i]}</a></span>`
		}
    
        let element = document.createElement("DIV");
        element.innerHTML +=
            `<div class="entry">
<a class="title" href="/posts?post=${this.id}">${this.title}</a>
<div class="author">BY <a class="author" href="/author?author=${this.author}">${this.author}</a></div>
<hr  class="seperator" \>
<div class="preview">${this.desc}</div>
<hr  class="seperator" \>
<div class="tagtitle">Tags:</div>
<div class="brow">
<span class="tags">${tags}</span>
<span class="rating">
<span class="plus"  title="upvotes"><a class="upvote"  >${this.rating["+"]}</a></span>
<span class="minus" title="downvotes"><a class="downvote">${this.rating["-"]}</a></span>
</div>
</div>
</div>`
        element.classList = ["entrybox"]
        return element
    }
    appendto(tag) {
        $(tag).append(this.createelement());
    }
}

// ---------------------------------------------------- //
class metaentry {
    constructor(type, title, writeto, additional) {
        this.type = type
        this.title = title;
        this.writeto = writeto;
        this.additional = additional;
        switch (this.type) {
            case "stat":
                this.update()
                break;

            default:
                this.appendto( this.writeto )
        }
    }
    createelement() {
        let element = document.createElement("DIV");
            element.innerHTML +=
`            <div class="entry metaentry">
            <div class="title" href="/posts?post=${this.id}">${this.title}</div>
            <hr  class="seperator" \\>
            <div class="preview ${this.additional.class}">${this.additional.content}</div>
            </div>`
        element.classList = ["entrybox"]
        return element
    }
    update() {
        if (!this.structed) {
            this.init()
            this.update()
            return
        }
        switch (this.type) {
            case "stat":
                $.get("/stats?api", d => {
                    let json = JSON.parse(d)
                    this.stats = json
                    $(this.writeto).append(this.createelement())
                })
                break
        }
    }
    init() {
        let html = document.createElement("div")
        html.classList = ["entrybox"]

        return this.structed = html
    }
    appendto(tag) {
        $(tag ? tag : this.writeto).append(this.createelement());
    }
}

function GET2param(param) {
	let k = Object.keys(param)
	let ret = "?"
	for ( let i = 0 ; i < k.length ; i++ ) {
		if ( param[k] == undefined ) {
			ret += k + "&"
		} else {
			ret += k + "=" + param[k] + "&"
		}
	}
	return ret.slice(0, -1)
}

function pager( len, index ) {
	console.log ( `len ${len} ; index ${index}`)
	let p = Object.assign({}, param)
	let base = window.location.pathname
	let elem = document.createElement("div")
	let h = `<div class="pager">\n`
	p.page = 0
	h += `<span class="pager entry"><a href="${base + GET2param(p)}">&lt;&lt;</a></span>\n`
	if ( 0 <= ( index - 1 ) ) {
		p.page = index - 1
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">&lt;</a></span>\n`
	}
	// ------------------------------------
	if ( 0 <= ( index - 2) ) {
		p.page = index  - 2
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">${index - 2}</a></span>\n`
	}
	if ( 0 <= ( index - 1) ) {
		p.page = index - 1
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">${index - 1}</a></span>\n`
	}
	// ------------------------------------	
	p.page = index
	h += `<span class="pager entry selected"><a href="${base + GET2param(p)}">${index}</a></span>\n`
	// ------------------------------------
	if ( index + 1 <= len ) {
		p.page = index + 1
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">${index + 1}</a></span>\n`
	}
	if ( index + 2 <= len ) {
		p.page = index + 2
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">${index + 2}</a></span>\n`
	}
	// ------------------------------------
	if ( index + 1 <= len) {
		p.page = index + 1
		h += `<span class="pager entry"><a href="${base + GET2param(p)}">&gt;</a></span>\n`
	}
	p.page = len
	h += `<span class="pager entry"><a href="${base + GET2param(p)}">&gt;&gt;</a></span>\n`
	h += `</div>\n`
	elem.innerHTML = h
	return elem
}
