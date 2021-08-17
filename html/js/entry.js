class entry {
    constructor(title, author, desc, href, tags, id) {
        this.title = title;
        this.author = author;
        this.desc = desc;
        this.href = href;
        this.tags = tags;
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
<div class="tags">${tags}</div>
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
