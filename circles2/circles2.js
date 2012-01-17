$(document).ready( function() {
    var myGA = null;

    $('#calc').click( function() {
        if ( !myGA ) {
            myGA = create();
        }

        myGA.baseData.scenario = createScenario( myGA.baseData.canvasSize, myGA.baseData.scenarioSize );
        console.time( 'run' );
        myGA.run();
        console.timeEnd( 'run' );

        myGA.printHistory( "pages" );
        printResult( myGA.result(), myGA.baseData );
    } );

    function create() {

        var baseData = {
            canvasSize: 400,
            genPoolSize: 30,
            scenarioSize: 4,
            circleObject: circle,
            pointObject: point,
            maxRuns: 10000,
            logHistory: true
        };

        var ga = GA.getAlgorithm( baseData );

        ga.generateGenePool = function() {
            var tmp = [];

            for( var i = 0; i < this.baseData.genPoolSize; i++ ) {
                var size = Math.random() * this.baseData.canvasSize * 0.4;
                tmp.push( new circle( parseInt( Math.random() * this.baseData.canvasSize, 10 ), parseInt( Math.random() * this.baseData.canvasSize, 10 ), parseInt( size, 10 ) ) );
            }

            return tmp;
        }

        ga.chooseParents = function( pool ) {
            c1 = parseInt( Math.random() * (pool.length), 10 );
            do {
                c2 = parseInt( Math.random() * (pool.length), 10 );
            } while( c1 == c2 );

            return { 0: pool[ c1 ], 1: pool[ c2 ] };
        }

        ga.mutate = function( p1, p2 ) {
            var tmp = new this.baseData.circleObject();
            tmp.x = Math.random() < 0.5 ? p1.x : p2.x;
            tmp.y = Math.random() < 0.5 ? p1.y : p2.y;
            tmp.r = Math.random() < 0.5 ? p1.r : p2.r;


            var maxMutate = 10;
            var r = Math.random();
            if ( r < 0.3 ) {
                tmp.r += weightedMutate( maxMutate );
            } else if ( r < 0.6 ) {
                tmp.r -= weightedMutate( maxMutate );
            }

            r = Math.random();
            if ( r < 0.3 ) {
                tmp.x += weightedMutate( maxMutate );
            } else if ( r < 0.6 ) {
                tmp.x -= weightedMutate( maxMutate );
            }

            r = Math.random();
            if ( r < 0.3 ) {
                tmp.y += weightedMutate( maxMutate );
            } else if ( r < 0.6 ) {
                tmp.y -= weightedMutate( maxMutate );
            }

            function weightedMutate( nr ) {
                return parseInt( ( 1 - Math.random() * Math.random() ) * nr, 10 );
            }

            return tmp.getS();
        };

        ga.getFitness = function( str ) {
            var tmp = new this.baseData.circleObject();
            tmp.parseGenome( str );

            var outside = 0;
            for( var k in this.baseData.scenario ) {
                var p = this.baseData.scenario[ k ];
                if ( p.d( tmp ) > tmp.r ) {
                    outside++;
                }
            }

            if ( outside > 0 ) {
                return 1 / tmp.area() * -1;
            } else {
                return 1 / tmp.area();
            }


        };

        ga.termCriterium = function() {
            var cnt = this.pool.length * 0.8;
            var tmp = this.pool[0].f;
            for( var i = 0; i < cnt; i++ ) {
                var c = this.pool[i];
                if ( tmp !== c.f ) {
                    return false;
                }
            }
            return true;
        };

        ga.showHistoryPage = function( page, number, $container ) {
            printScenario( this.baseData );

            var $table = $('<table cellspacing="0" cellpadding="3" border="1"></table>');
            $('<tr><th>genome</th><th>fitness</th><th>x</th><th>y</th><th>r</th></tr>').appendTo( $table );

            page.sort( function(a,b) { return b.f - a.f; } );

            for( var k in page ) {
                var row = page[k];

                var circle = new this.baseData.circleObject();

                circle.parseGenome( row.getS() );

                var drawCircle = this.baseData.poolCircles[ k ];
                drawCircle.x( circle.x );
                drawCircle.y( circle.y );
                drawCircle.radius( circle.r );

                var bgColor = '#fff';
                if ( row.isParent ) {
                    bgColor = '#0f0';
                } else if ( row.isChild ) {
                    bgColor = '#f00';
                }

                $('<tr style="background-color:' + bgColor + '"><td>' + row.getS() + '</td><td>' + row.f + '</td><td>' + row.x + '</td><td>' + row.y + '</td><td>' + row.r + '</td></tr>')
                    .mouseenter(
                        ( function() {
                            var tmp = drawCircle;
                            return function() {
                                tmp.backgroundColor( '#ff0' ).opacity( 0.5 ).z( 1000 );
                            };
                        } )() )
                    .mouseleave(
                        ( function() {
                            var tmp = drawCircle;
                            return function() {
                                tmp.backgroundColor( '' ).opacity( 1 ).z( 0 );
                            };
                        } )() )
                    .appendTo( $table );
            }
            $( '<h2>' + (number) + '</h2>' ).appendTo( $container );

            $container.append( $table );
        };

        var can = br4.createC( 'circles', { width: baseData.canvasSize, height: baseData.canvasSize, backgroundColor: '#000' } )

        baseData.scenarioPoints = [];
        baseData.poolCircles = [];
        for( var i = 0; i < baseData.scenarioSize; i++ ) {
            baseData.scenarioPoints.push( can.createO( br4.o.gCircle, { x: 0, y: 0, radius: 3, lineWidth: 0, backgroundColor:'#fff', middleMode: true, z: 0 } ) );
        }
        for( var i = 0; i < baseData.genPoolSize; i++ ) {
            baseData.poolCircles.push( can.createO( br4.o.gCircle, { x: 0, y: 0, radius: 1, lineWidth: 2, lineColor: '#f00', middleMode: true, z: 0 } ) );
        }

        return ga;
    }

    function printResult( result, baseData ) {
        printScenario( baseData );
        var drawCircle = baseData.poolCircles[ 0 ];
        drawCircle.x( result.x );
        drawCircle.y( result.y );
        drawCircle.radius( result.r );
    }

    function printScenario( baseData ) {
        for( var k in baseData.scenario ) {
            var point = baseData.scenario[ k ];
            var drawCircle = baseData.scenarioPoints[ k ];

            drawCircle.x( point.x );
            drawCircle.y( point.y );
        }
    }

    function createScenario( size, number ) {
        var tmp = [];

        for( var i = 0; i < number; i++ ) {
            tmp.push( new point( parseInt( Math.random() * size, 10 ), parseInt( Math.random() * size, 10 ) ) );
        }

        return tmp;
    }

    function point( x, y ) {
        this.x = x;
        this.y = y;

        this.d = function( p ) {
            return Math.sqrt( Math.pow( this.x - p.x, 2 ) + Math.pow( this.y - p.y, 2 ) );
        }
    }

    function circle( x, y, r ) {
        var stdLength = 10;

        this.x = x;
        this.y = y;
        this.r = r;

        this.setS = this.parseGenome = function( g ) {
            var x = '';
            var y = '';
            var r = '';
            for( var i = 0; i < g.length; i++ ) {
                if ( i / stdLength < 1 ) {
                    x += g[ i ];
                } else if ( i / stdLength < 2 ) {
                    y += g[ i ];
                } else if ( i / stdLength < 3 ) {
                    r += g[ i ];
                }
            }

            this.x = parseInt( x, 2 );
            this.y = parseInt( y, 2 );
            this.r = parseInt( r, 2 );
        }

        this.getS = this.getGenome = function() {
            return lpad( this.x.toString( 2 ), stdLength, '0' ) + lpad( this.y.toString( 2 ), stdLength, '0' ) + lpad( this.r.toString( 2 ), stdLength, '0' );
        }

        this.area = function(){
            return Math.PI * Math.pow( this.r, 2 );
        }

        var lpad = function( str, length, c ) {
            for( var i = str.length; i < length; i++ ) {
                str = c.toString() + str.toString();
            }

            return str;
        }

    }

} );