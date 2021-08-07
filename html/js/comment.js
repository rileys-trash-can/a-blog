function displaycomments() {
    commenting = new metaentry(undefined,"comment:",".content",{"content":
`Your comment: (no MD)<br>
<textarea class="comment commtext"></textarea>
<input class="comment" onclick="comment($('.commtext').val())" type="submit" value="Submit!" \\>`})
}

function comment(comment) {
    $.ajax({
        type: "POST",
        url: "/comment",
        data: {
            comment: comment
        },
        dataType: "json"
    })
}
