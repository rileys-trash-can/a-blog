// generate sharelink:
let shareurl = encodeURI(this.location.toString().split("//")[1])

function displayshare() {
    sharemenu = new metaentry(undefined,"Share",".content",{"content":
`Don't know why you would, but here you can find me elsewhere on the Net:<br \\>
<a href="https://github.com/derzombiiie"><img class="socialicon" src="/static//icon/github.png" \\></a>
<small>(yea thats it)</small><br \\><br \\>
oh yea the title of this box: go share my page: 
<a class="share" href="mailto:?subject=DerZombiiies%20totally%20cool%20website!&body=Hi%2C%0AI%20just%20found%20this%20on%20the%20interwebz%3A%20${shareurl}">Email</a>,
<a class="share" href="whatsapp://send?text=Hi%2C%0AI%20just%20found%20this%20on%20the%20interwebz%3A%20${shareurl}">WhatsApp</a>,
<a class="share" href="https://twitter.com/intent/tweet?text==Check%20derzombiiies%20website!%0A%40%20${shareurl}">Twitter</a>,
Copy: <input value="${shareurl}" \\>`
    })
}
