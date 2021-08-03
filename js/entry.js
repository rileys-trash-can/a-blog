class entry {
    constructor( title, author, desc, href, tags ) {
        this.title = title;
        this.author = author;
        this.desc = desc;
        this.href = href;
        this.tags = tags;
    }
    createelement() {
        let element       = document.createElement("DIV");
        element.innerHTML += 
`<div class="entry">
<div class="title">${this.title}</div>
<div class="author">BY ${this.author}</div>
<hr  class="seperator" \>
<div class="preview">${this.desc}</div>
</div>`
        element.classList = ["entrybox"]
        return element
    }
    appendto( tag ) {
        $(tag).append(this.createelement());
    }
}