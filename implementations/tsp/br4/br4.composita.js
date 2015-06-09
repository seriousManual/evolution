
( function( br4 ) {
    
    function compositum() {
    
    }
    
    function gButton() {
    }
    gButton.inheritsFrom( compositum );
    br4.extendC( 'gButton', gButton );
    
} )( window.br4 || { extendO: function() { throw 'br4 missing!'; } } );