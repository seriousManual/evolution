$(document).ready( function() {

    var myGA = null;

    $('#calc').click( function() {
        if ( !myGA ) {
            myGA = create();
        }
        myGA.baseData.target = parseInt( $( '#term' ).val() );
        myGA.run();

        myGA.printHistory( "pages" );
        
    } );

    function create() {

        var baseData = {
            target:0,
            numberChars:12,
            poolSize:30,
            table: {
                '0000':0,
                '0001':1,
                '0010':2,
                '0011':3,
                '0100':4,
                '0101':5,
                '0110':6,
                '0111':7,
                '1000':8,
                '1001':9,
                '1010':'+',
                '1011':'-',
                '1100':'*',
                '1101':'/'
            },
            operators: ['+','-','*','/']
        };

        baseData.interpreteGenome = function( g )  {
            var group = '';
            var ret = '';
            for( var i = 0; i < g.length/4; i++ ) {
                group = '';
                group += g.charAt( i* 4 );
                group += g.charAt( i* 4+1 );
                group += g.charAt( i* 4+2 );
                group += g.charAt( i* 4+3 );

                var tmp = this.table[ group ];
                if ( tmp ) {
                    ret += tmp;
                }
            }

            return ret;
        };

        baseData.parseGenome = function( g ) {
            var state = 's1';
            var tmp = '';

            //finite state machine for the win
            for( var i = 0; i < g.length; i++ ) {
                var c = g.charAt( i );

                if ( state == 's1' ) {
                    if ( $.inArray( c, ['1','2','3','4','5','6','7','8','9'] ) >= 0 ) {
                        state = 's2';
                        tmp += c;
                    }
                } else if ( state == 's2' ) {
                    if ( $.inArray( c, ['0', '1','2','3','4','5','6','7','8','9'] ) >= 0 ) {
                        state = 's3';
                        tmp += c;
                    } else if ( $.inArray( c, ['+','-','*','/'] ) >= 0 ) {
                        state = 's1';
                        tmp += c;
                    }
                } else if ( state == 's3' ) {
                    if ( $.inArray( c, ['+','-','*','/'] ) >= 0 ) {
                        state = 's1';
                        tmp += c;
                    }
                }
            }
            if ( state == 's1' ) {
                tmp = tmp.substring( 0, tmp.length-1 );
            }

            return tmp;
        }

        baseData.htmlEntities = function(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace( ' ', '&nbsp;' );
        }






        var ga = GA.getAlgorithm( baseData );

        ga.generateGenePool = function() {
            var genePool = [];
            for( var i = 0; i < this.baseData.poolSize; i++ ) {
                var tmp = '';
                for( var y = 0; y < this.baseData.numberChars*4; y++ ) {
                    tmp += ( Math.random() > 0.5 ? '1' : '0' );
                }
                genePool.push( { s:tmp, getS: function() { return this.s; }, setS: function(s) { this.s = s } } );
            }

            return genePool;
        }

        ga.chooseParents = function( pool ) {
            c1 = parseInt( Math.random() * Math.random() * (pool.length) );
            do {
                c2 = parseInt( Math.random() * Math.random() * (pool.length) );
            } while( c1 == c2 );

            return { 0: pool[ c1 ], 1: pool[ c2 ] };
        }

        ga.mutate = function( p1, p2 ) {
            var tmp = '';

            /*
            for( var i = 0; i < p1.length; i++ ) {
                if ( Math.random() < 0.5 ) {
                    tmp += p1.charAt( i );
                } else {
                    tmp += p2.charAt( i );
                }
            }
            */
            var s1 = p1.getS();
            var s2 = p2.getS();

            var nr = parseInt( Math.random() * (s1.length+1) );

            tmp = s1.slice( 0, nr ).concat( s2.slice( nr ) );

            var a = tmp.split('');
            for( var i = 0; i < 3; i++ ) {
                nr = parseInt( Math.random() * tmp.length );
                a[ nr ] = ( ( parseInt( a[ nr ] ) + 1 ) % 2 ) + '';
            }
            return a.join( '' );
        }

        ga.getFitness = function( str ) {
            var g = this.baseData.interpreteGenome( str );
            var p = this.baseData.parseGenome( g );

            var operators = false;
            for( var k in this.baseData.operators ) {
                if ( p.indexOf( this.baseData.operators[ k ] ) !== -1 ) {
                    operators = true;
                    break;
                }
            }

            var v = eval( p );
            var difference = Math.abs( this.baseData.target - v );

            if ( !operators ) { //no operators found!
                difference *= -1;
            }

            var f = 1 / difference;

            return f;
        }

        ga.termCriterium = function( x ) {
            return this.history[ this.history.length-1 ][0].f === Infinity;
        }

        ga.showHistoryPage = function( page, number, $container ) {
            var rows = '';

            page.sort( function(a,b) { return b.f - a.f; } );

            for( var k in page ) {
                var row = page[k].getS();
                var interpreted = this.baseData.interpreteGenome(row);
                var parsed = this.baseData.parseGenome( interpreted );
                var evaled = eval( parsed );

                var bgColor = '#fff';
                if ( page[k].isParent ) {
                    bgColor = '#0f0';
                } else if ( page[k].isChild ) {
                    bgColor = '#f00';
                }

                rows += '<tr style="background-color:' + bgColor + '"><td>' + this.baseData.htmlEntities( row ) + '</td><td>' + page[ k ].f + '</td><td>' + interpreted + '</td><td>' + parsed + '</td><td>' + evaled + '</td></tr>';
            }
            var table = '<h2>' + (number) + '</h2><table cellspacing="0" cellpadding="3" border="1"><tr><th>genome</th><th>fitness</th><th>interpreted</th><th>parsed</th><th>value</th></tr>' + rows + '</table>';

            $container.html( table );
        }

        return ga;
    }

} );