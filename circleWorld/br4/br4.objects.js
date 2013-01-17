/*
TODO:
===============
textbox
checkbox
button
images
tooltips
*/

( function( br4 ) {
    br4.extendO( 'gLine', {  initChild: function() {
                                this.extend( 'angle', 0 );
                                this.extend( 'lineLength', 0 );
                                this.extend( 'x2', 0 );
                                this.extend( 'y2', 0 );
                            },
                            drawChild: function( ctx ) {
                                var xStart = this.x();
                                var yStart = this.y();
                                var xEnd = 0;
                                var yEnd = 0;
                                
                                if ( this.x2() || this.y2() ) {
                                    xEnd = this.x2();
                                    yEnd = this.y2();
                                } else {
                                    var ll = this.lineLength();
                                    
                                    var myAngle = Math.deg2rad( this.angle() );

                                    var tmpX = Math.cos( myAngle ) * ( this.middleMode() ? this.lineLength() / 2 : this.lineLength());
                                    var tmpY = Math.tan( myAngle ) * tmpX;

                                    var xEnd = parseInt( tmpX + xStart );
                                    var yEnd = parseInt( tmpY + yStart );
                                    
                                    if ( this.middleMode() ) {
                                        xStart = xStart - tmpX;
                                        yStart = yStart - tmpY;
                                    }
                                }

                                ctx.moveTo(xStart, yStart);
                                ctx.lineTo(xEnd, yEnd);
                                ctx.stroke();

                                return true;
                            }
    } );

    br4.extendO( 'gCircle', { initChild: function() {
                                this.extend( 'radius', 0 );
                            },
                            drawChild: function( ctx ) {
                                var x = this.x();
                                var y = this.y();
                                
                                if ( !this.middleMode() ) {
                                    x += this.radius() / 2;
                                    y += this.radius() / 2;
                                }
                                
                                ctx.arc(x, y, this.radius(), 0, 2*Math.PI, true );
                                if ( this.backgroundColor() !== false ) {
                                    ctx.fill();
                                }
                                if ( this.lineColor() !== false && this.lineWidth() > 0 ) {
                                    ctx.stroke();
                                }
                                return true;
                            }
    } );
    
    br4.extendO( 'gRectangle', { initChild: function() {
                                this.extend( 'height', 0 );
                                this.extend( 'width', 0 );
                                this.extend( 'borderRadius', 0 );
                                this.setEventBinding( true );
                            },
                            
                            drawChild: function( ctx ) {
                                var x = this.x();
                                var y = this.y();
                                var w = this.width();
                                var h = this.height();
                                var r = this.borderRadius();
                                var lw = this.lineWidth();
                                
                                if ( 2*r > w || 2*r > h ) {
                                    console.info( 'borderRadius shoud be less than w/2, obviously we got borderRadius in lincoln park of ' + this.borderRadius() );
                                }
                                
                                if ( this.middleMode() ) {
                                    x = x - w/2;
                                    y = y - h/2;
                                }

                                if ( this.backgroundColor() !== false ) {
                                    if ( r > 0 ) {
                                        this.drawPaths( ctx, x, y, w, h, r );
                                        ctx.fill();
                                    } else {
                                        ctx.fillRect( x, y,w, h );
                                    }
                                }
                                if ( this.lineColor() !== false && lw > 0 ) {
                                    if ( r > 0 ) {
                                        if ( lw > w / 2 ) {
                                            console.info( 'lineWidth shoud be less than w/2, obviously we got linewidth in lincoln park of ' + lw );
                                        }
                                        x = x + lw / 2;
                                        y = y + lw / 2;
                                        w = w - lw;
                                        h = h - lw;
                                        r = Math.max( r - lw / 2, r );

                                        this.drawPaths( ctx, x, y, w, h, r );
                                        ctx.stroke();
                                    } else {
                                        ctx.strokeRect( x, y, w, h );
                                    }
                                }
                                return true;
                            },
                            
                            drawPaths: function( ctx, x, y, w, h, r ) {
                                var data = {
                                    c1: {
                                        p0: { x: x, y: y },
                                        pS: { x: x, y: y + r },
                                        pE: { x: x+r, y: y }
                                    },
                                    c2: {
                                        p0: { x: x+w, y: y },
                                        pS: { x: x+w-r, y: y },
                                        pE: { x: x+w, y: y+r }
                                    },
                                    c3: {
                                        p0: { x: x+w, y: y+h },
                                        pS: { x: x+w, y: y+h-r },
                                        pE: { x: x+w-r, y: y+h }
                                    },
                                    c4: {
                                        p0: { x: x, y: y+h },
                                        pS: { x: x+r, y: y+h },
                                        pE: { x: x, y: y+h-r }
                                    }
                                }
                                
                                ctx.beginPath();
                                ctx.moveTo( data.c4.pE.x, data.c4.pE.y );
                                $.each( data, function( k, v ) {
                                    ctx.arcTo( v.p0.x, v.p0.y, v.pE.x, v.pE.y, r );
                                } );
                                ctx.closePath();
                            }
                            
    } );
    
    br4.extendO( 'gText', { initChild: function() {
                                this.extend( 'text', '' );
                                this.extend( 'fontSize', '12' );
                                this.extend( 'fontFace', 'Arial' );
                                this.extend( 'fontColor', null );
                            },
                            drawChild: function( ctx ) {
                                var x = this.x();
                                var y = this.y();
                            
                                ctx.font = this.fontSize() + 'pt ' + this.fontFace();
                                
                                if ( this.middleMode() ) {
                                    x -= ctx.measureText( this.text() ).width/2;
                                }
                                
                                ctx.fillText( this.text(), x, y );
                                ctx.stroke();
                                return false;
                            }
    } );
    
    br4.extendO( 'gImage', { initChild: function() {
                                this.extend( 'path', '' );
                            },
                            drawChild: function( ctx ) {
                                throw 'image not yet implemented';
                                return false;
                            }
    } );

} )( window.br4 || { extendO: function() { throw 'br4 missing!'; } } );
















