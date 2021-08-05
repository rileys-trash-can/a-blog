class themes {
    constructor( theme ) {
        if ( theme ) return this.loadstyle(theme)
        fetch("/usermeta?theme").then( d => d.json()).then( d => {
            if ( d.type == "s" )
                this.loadstyle( d.style )
            else
                console.error("Couldnt read user style")
        })
    }
    
    loadstyle( style ) {
        $.get( "/static/style/" + style + ".css" , css => {
            $('<style type="text/css"></style>')
            .html(css).appendTo("head")
        })
    }
}