// generate sharelink:
let shareurl = encodeURI(this.location.toString().split("//")[1])

function displayshare() {
    sharemenu = new metaentry(undefined,"Share",".content",{"content":
`Don't know why you would, but here you can find me elsewhere on the interwebz:<br \\>
<a href="//github.com/derzombiiie"><img class="socialicon" title="pls click tiktok icon!" src="/static/icon/github.png" \\></a>
<a href="//www.youtube.com/watch?v=dQw4w9WgXcQ"><img title="100% legit" class="socialicon" src="/static/icon/tiktok.png" \\></a>
<small>(yea thats it lol)</small><br \\><br \\>
oh yea the title of this box: go share this page with...
<a title="good old fashioned email!"             class="share" href="mailto:?subject=DerZombiiies%20totally%20cool%20website!&body=Hi%2C%0AI%20just%20found%20this%20on%20the%20interwebz%3A%20${shareurl}">Email</a>,
<a title="i dont use it; works though (i think)" class="share" href="whatsapp://send?text=Hi%2C%0AI%20just%20found%20this%20on%20the%20interwebz%3A%20${shareurl}">WhatsApp</a>,
<a title="twitter, pls url be not to long!" class="share" href="https://twitter.com/intent/tweet?text==Check%20derzombiiies%20website!%0A%40%20${shareurl}">Twitter</a>,
Copy: <input value="${shareurl}" \\>`
    })
}
