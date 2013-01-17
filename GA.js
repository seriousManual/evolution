( function( window ) {

    if ( !window.jQuery ) {
        throw 'jquery needed';
    }

    var algorithm = {
        history:[],
        fLog:[],
        baseData: {},
        pool:[],


        logHistory: true,
        maxRuns: 15000,

        termCriterium:      null,
        fitnessCompare:     function( f1, f2 ) { return f1 > f2; },
        generateGenePool:   null,
        chooseParents:      null,
        mutate:             null,
        getFitness:         null,
        showHistoryPage:    null,
        mutateCalllback:    function(){},
        stepDelay:          0,
        flagDesintegrate:   false,

        result: function() {
            return this.pool[ 0 ];
        },

        poolSort: function ( p ) {
            p.sort( function( a, b ) { return ( a.f - b.f )*-1 } );
        },

        logHistoryStep: function( p1, p2, child ) {
            if ( !this.logHistory ) {
                return;
            }

            var tmpPool = [];
            for( var k in this.pool ) {
                var entry = this.pool[k];
                var tmp = {};
                if ( p1 ) {
                    if ( entry == p1 || entry == p2 ) {
                        tmp.isParent = true;
                    } else if ( entry == child ) {
                        tmp.isChild = true;
                    }
                }

                tmpPool.push( $.extend( true, tmp, this.pool[k] ) );
            }
            this.history.push( tmpPool );
        },

        run: function( callback ) {
            callback = callback || function() {};
            this.history = [];
            this.maxRuns = this.baseData.maxRuns || this.maxRuns;
            if ( this.baseData.logHistory !== undefined ) {
                this.logHistory = this.baseData.logHistory;
            }

            var tmpPool = this.generateGenePool();

            var f = null;
            for( var k in tmpPool ) {
                var tmp = tmpPool[ k ];
                tmp.f = this.getFitness( tmp.getS() );
                this.pool[ k ] = tmp;
            }
            this.poolSort( this.pool );
            this.logHistoryStep();

            var c    = 0;
            var self = this;

            //setTimeout is stupidly slow (even with 0ms), but recursing indefenitly will crash the callstack sometime, so we push in some asynchrounos bleepers (also to allow dom updates)
            var nextBloop = function() {};

            if(self.stepDelay === 0) {
                nextBloop = function() {
                    if(c % 500 === 0) {
                        window.setTimeout(step, 0);
                    } else {
                        step();
                    }
                }
            } else {
                nextBloop = function() {
                    window.setTimeout(step, self.stepDelay);
                }
            }

            function step() {
                var keepRunning = true;

                if ( c++ > self.maxRuns ) {
                    console.log('maxruns reached');
                    keepRunning = false;
                }

                if ( self.flagDesintegrate ) {
                    console.log('desintegrating');
                    keepRunning = false;
                }

                self.fLog.push( self.result().f );
                self.poolSort( self.pool );

                if ( self.termCriterium() ) {
                    keepRunning = false;
                }

                var parents = self.chooseParents( self.pool );

                var m = self.mutate( parents[ 0 ], parents[ 1 ] );
                var mF = self.getFitness( m );
                var lastPoolEntry = self.pool[ self.pool.length-1 ];
                var fitter = false;

                if ( self.fitnessCompare( mF, lastPoolEntry.f ) ) {
                    lastPoolEntry.setS( m );
                    lastPoolEntry.f = mF;
                    fitter = true;
                }

                self.logHistoryStep( parents[0], parents[1], fitter ? lastPoolEntry : null );

                self.mutateCalllback( self.pool, fitter );

                if ( keepRunning ) {
                    nextBloop();
                } else {
                    callback();
                }
            };

            step();
        },

        desintegrate: function() {
            this.flagDesintegrate = true;
        },

        printHistory: function( id ) {
            var aktPage = 0;

            var $container = $( '#' + id );
            if ( $container.length == 0 ) {
                return;
            }

            if ( this.history.length == 0 ) {
                return;
            }

            $container.html('');
            var state = 'pause';
            var that = this;

            var $page = $( '<div />' );

            var playSteps = Math.round( this.history.length / 300 );
            var $play = $( '<button />' )
                            .html( '&gt;' )
                            .click( function() {
                                if ( state == 'pause' ) {
                                    $(this).html ( '||' );
                                    state = 'play';
                                } else {
                                    $(this).html ( '&gt;' );
                                    state = 'pause';
                                }
                    
                                if ( state == 'play' ) {
                                    $(this).everyTime( 100, 'animating', function() {
                                        if ( aktPage + playSteps < that.history.length-1 ) {
                                            aktPage += playSteps;
                                            showHistoryPage.call( that, that.history[ aktPage ], aktPage+1, $page );
                                        } else {
                                            $(this).stopTime( 'animating' );
                                        }
                                    } );
                                } else {
                                    $(this).stopTime( 'animating' );
                                }
                            })
                            .appendTo( $container );

            $container.append( $('<br />' ) );

            var $leftleft = $( '<button />' )
                            .html( '&lt;-------' )
                            .click( function() {
                                if ( aktPage-10 > 0 ) {
                                    aktPage -= 10;
                                    showHistoryPage.call( that, that.history[ aktPage ], aktPage+1, $page );
                                }
                            })
                            .appendTo( $container );

            var $left = $( '<button />' )
                            .html( '&lt;--' )
                            .click( function() {
                                if ( aktPage > 0 ) {
                                    aktPage--;
                                    showHistoryPage.call( that, that.history[ aktPage ], aktPage+1, $page );
                                }
                            })
                            .appendTo( $container );

            var $right = $( '<button />' )
                            .html( '--&gt;' )
                            .click( function() {
                                if ( aktPage < that.history.length-1 ) {
                                    aktPage++;
                                    showHistoryPage.call( that, that.history[ aktPage ], aktPage+1, $page );
                                }
                            })
                            .appendTo( $container );

            var $rightright = $( '<button />' )
                            .html( '---------&gt;' )
                            .click( function() {
                                if ( aktPage+10 < that.history.length-1 ) {
                                    aktPage += 10;
                                    showHistoryPage.call( that, that.history[ aktPage ], aktPage+1, $page );
                                }
                            })
                            .appendTo( $container );

            var $gotoNr = $( '<input />' )
                            .appendTo( $container );

            var $gotoBttn = $( '<button />' )
                            .html( 'goto' )
                            .click( function() {
                                var nr = parseInt( $gotoNr.val() ) - 1;
                                if ( nr >= 0 && nr < that.history.length ) {
                                    aktPage = nr;
                                    showHistoryPage.call( that, that.history[ nr ], nr+1, $page );
                                }
                            })
                            .appendTo( $container );

            var $nr = $( '<div />' )
                            .appendTo( $container );

            $page.appendTo( $container );

            $nr.html( '<h1>' + this.history.length + ' generations</h1>' );
            $gotoNr.val( 0 );

            aktPage = this.history.length-1;
            showHistoryPage.call( this, this.history[ this.history.length-1 ], this.history.length, $page );

            function showHistoryPage( page, number, $container ) {
                number = parseInt( number );
                $gotoNr.val( number );

                if ( this.showHistoryPage ) {
                    $container.html( '' );
                    this.showHistoryPage( page, number, $container );
                } else {
                    $container.html( 'nothing' );
                }
            }
        }
    };


    var GA = {
        getAlgorithm: function( baseData ) {
            baseData = baseData || {};
            var tmp = $.extend( true, {}, algorithm );
            tmp.baseData = baseData;

            return tmp;
        }
    };


    window.GA = GA;

} )( window )
