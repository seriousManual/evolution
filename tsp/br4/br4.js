/*
    TODO:
    ================================
    mouseup + mousedown
    after deletion and movment: tree cleanup
    moving one object to another place, update eventhandler tree
    changing size of object!
    redrawing only things that have been changed?
    borderradius: lineWidth fix
    gradients + fade + pattern
*/

(function(window) {
    var $ = window.$;

    //==EVENTHANDLER
    var eventHandler = function( c ) {
        var that = this;
        var deepest = 0;
   
        var myCanvas = c;
        var $myDrawingCanvas = $( myCanvas.getDrawingCanvas() );
        var tree = {};      //holds the treestructure of all objects
        var objects = {};   //holds a flat representation of all objects
        var debugObjects = {};
        var debug = true;
        
        var focusedElement = null;
   
        var eventObject = function( x, y, t ) {
            this.x = x;
            this.y = y;
            this.target = t;
        }
    
        var treeLeaf = function( x, y, width, height ) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.subTree = null;
            this.data = [];
            
            this.hasSubtree = function() {
                return this.subTree !== null;
            }
            
            this.numberChilds = function() {
                return this.data.length;
            }
        }

        //checks for specific coordinates of object, located in the tree
        //returns the specific object
        this.treeLookup = function( x, y ) {
            return checkLeaf( x, y, tree );
        }
        
        var checkLeaf = function( x, y, myTree ) {
            if ( myTree.hasSubtree() ) {
                var pos = '';
                if ( y < myTree.subTree.TL.y + myTree.subTree.TL.height ) {
                    pos = 'T';
                } else {
                    pos = 'B';
                }
                if ( x < myTree.subTree.TL.x + myTree.subTree.TL.width ) {
                    pos += 'L';
                } else {
                    pos += 'R';
                }
                
                return checkLeaf( x, y, myTree.subTree[ pos ] );
            } else {
                var o = null;
                var coll = [];
                for ( var k in myTree.data ) {
                    //shibby. performance issue
                    o = myTree.data[ k ];
                    var ow = o.width();
                    var oh = o.height();
                    var ox = o.x() - ( o.middleMode ? o.middleMode() ? ow / 2 : 0 : 0 );
                    var oy = o.y() - ( o.middleMode ? o.middleMode() ? oh / 2 : 0 : 0 );
                    
                    if ( x >= ox && x <= ox + ow && y >= oy && y <= oy + oh ) {
                        coll.push( o );
                    }
                }
                return coll;
            }
        }
        
        this.treeInsert = function( o ) {
            if ( this.isKnown( o ) ) return; //we already know you

            insertLeaf( o, tree, 0 );
            objects[ o ] = o;
        }
        
        var insertLeaf = function( o, myTree, depth ) {
            if ( depth > deepest ) {
                deepest = depth;
            }
            if ( depth >= 15 ) {
                console.log( 'break due to too much depth' );
                return;
            }
        
            //gibt es einen unterbaum?
            if ( myTree.hasSubtree() ) {
                //checken in welchen teil des subtrees wir inserten müssen (evtl in mehrere! )
                var ret = findPartialSubtree( o, myTree );
                for ( var k in ret ) {
                    insertLeaf( o, ret[ k ], depth+1 );
                }
                
            } else {
                //checken wie viele datas in dem leaf liegen
                if ( myTree.numberChilds() >= 4 ) {
                    // zu viele data. müssen subtree anlegen, vorhandene in den neuen subtree schmeißen
                    myTree.subTree = createSubtree( myTree.x, myTree.y, myTree.width, myTree.height );

                    var tmp = myTree.data
                    myTree.data = [];

                    for( var k in tmp ) {
                        insertLeaf( tmp[ k ], myTree, depth+1 );
                    }
                    insertLeaf( o, myTree, depth+1 );
                    
                } else {
                    //es ist genügend platz für alle da!
                    myTree.data.push( o );
                }
            }
            
        }
        
        this.treeDelete = function( o ) {
            if ( this.isKnown( o ) ) {
                deleteObject( o, tree );
            }
        }
        
        var deleteObject = function( o, myTree ) {
            if ( myTree.hasSubtree() ) {
                var ret = findPartialSubtree( o, myTree )
                
                for( var k in ret ) {
                    deleteObject( o, ret[ k ] );
                }
            } else {
                var c = 0;
                for ( var k in myTree.data ) {
                    if ( myTree.data[ k ] === o ) {
                        myTree.data.splice(c, 1);
                        return;
                    }
                    c++;
                }
            }
        }
        
        this.init = function() {
            tree = new treeLeaf( 0, 0, myCanvas.width(), myCanvas.height() );

            var xOffset = $myDrawingCanvas.offset().left;
            var yOffset = $myDrawingCanvas.offset().top;

            $myDrawingCanvas.mousemove( function(e) {
                var x = e.pageX - xOffset;
                var y = e.pageY - yOffset;

                resolvePosition.call( that, x, y );
            } );
            
            $myDrawingCanvas.click( function(e) {
                var x = e.pageX - xOffset;
                var y = e.pageY - yOffset;
                
                resolvePosition.call( that, x, y );
                
                var eo = new eventObject( x, y, focusedElement );
                focusedElement.trigger.call( focusedElement, 'mouseclick', eo );
            } );
        }
        
        var createSubtree = function ( x, y, w, h ) {
            return {
                'TL': new treeLeaf( x,          y,           w / 2,    h / 2 ),
                'TR': new treeLeaf( x + w / 2,  y,           w / 2,    h / 2 ),
                'BL': new treeLeaf( x,          y + w / 2,   w / 2,    h / 2 ),
                'BR': new treeLeaf( x + w / 2,  y + h / 2,   w / 2,    h / 2 )
            };
        }
        
        this.traverseTree = function( $c ) {
            for( var k in debugObjects ) {
                debugObjects[ k ].remove();
            }
            debugObjects = {};
            traverseSubtree( tree );
        }
        
        var traverseSubtree = function( st ) {
            if ( st.hasSubtree() ) {
                var tmp = null;
                tmp = myCanvas.createO( br4.o.gRectangle, { z:10000, x:st.subTree.TL.x, y: st.subTree.TL.y,   width: st.subTree.TL.width, height: st.subTree.TL.height, lineWidth: 1, lineColor:'#f00' } );
                debugObjects[ tmp ] = tmp;
                tmp = myCanvas.createO( br4.o.gRectangle, { z:10000, x:st.subTree.TR.x, y: st.subTree.TR.y,   width: st.subTree.TR.width, height: st.subTree.TR.height, lineWidth: 1, lineColor:'#f00' } );
                debugObjects[ tmp ] = tmp;
                tmp = myCanvas.createO( br4.o.gRectangle, { z:10000, x:st.subTree.BL.x, y: st.subTree.BL.y,   width: st.subTree.BL.width, height: st.subTree.BL.height, lineWidth: 1, lineColor:'#f00' } );
                debugObjects[ tmp ] = tmp;
                tmp = myCanvas.createO( br4.o.gRectangle, { z:10000, x:st.subTree.BR.x, y: st.subTree.BR.y,   width: st.subTree.BR.width, height: st.subTree.BR.height, lineWidth: 1, lineColor:'#f00' } );
                debugObjects[ tmp ] = tmp;
            
                console.groupCollapsed( 'subTree' );
                console.log( 'TL' );
                traverseSubtree( st.subTree.TL );
                console.log( 'TR' );
                traverseSubtree( st.subTree.TR );
                console.log( 'BL' );
                traverseSubtree( st.subTree.BL );
                console.log( 'BR' );
                traverseSubtree( st.subTree.BR );
                console.groupEnd();
            } else {
                console.groupCollapsed( 'data' );
                for ( var k in st.data ) {
                    var o = st.data[ k ];
                    console.log( o.x() + '_' + o.y() );
                    
                    var 
                        middleMode = ( o.middleMode ? o.middleMode() : false ),
                        w = o.width(),
                        h = o.height(),
                        x = ( o.x ? o.x() : 0 ) - ( middleMode ? w/2 : 0 ),
                        y = ( o.y ? o.y() : 0 ) - ( middleMode ? h/2 : 0 );

                    var tmp = myCanvas.createO( br4.o.gRectangle, { z:10000,x: x, y: y, width: w, height: h, lineWidth: 1, lineColor:'#fff' } );
                    debugObjects[ tmp ] = tmp;
                }
                console.groupEnd();
            }
        }
        
        this.isKnown = function( o ) {
            return objects[ o ] !== undefined;
        }
        
        var findPartialSubtree = function( o, myTree ) {
            var ret = [];
        
            var 
                middleMode = ( o.middleMode ? o.middleMode() : false ),
                w = o.width(),
                h = o.height(),
                x = ( o.x ? o.x() : 0 ) - ( middleMode ? w/2 : 0 ),
                y = ( o.y ? o.y() : 0 ) - ( middleMode ? h/2 : 0 );

            var cTL = {x: x, y: y},
                cTR = {x: x+w, y: y},
                cBL = {x: x, y: y+h},
                cBR = {x: x+w, y: y+h};
            
            var t = myTree;
            
            if ( cTL.x <= t.x + t.width / 2 && cTL.y <= t.y + t.height / 2 ) {
                ret.push( t.subTree.TL );
            }
            if ( cTR.x > t.x + t.width / 2 && cTR.y <= t.y + t.height / 2 ) {
                ret.push( t.subTree.TR );
            }
            if ( cBL.x <= t.x + t.width / 2 && cBL.y > t.y + t.height / 2 ) {
                ret.push( t.subTree.BL );
            }
            if ( cBR.x > t.x + t.width / 2 && cBR.y > t.y + t.height / 2 ) {
                ret.push( t.subTree.BR );
            }
            
            return ret;
        }
        
        var resolvePosition = function( x, y ) {
            var b = this.treeLookup( x, y );

            if ( b.length === 0 ) {
                b = myCanvas;
            } else if ( b.length === 1 ) {
                b = b[0];
            } else {
                //shibby. performance issue
                b.sort( function(a,b) {
                    return ( a.z() > b.z() ? -1 : a.z() < b.z() ? 1 : 0 );
                } );
                b = b[0];
            }

            if ( !focusedElement ) {
                focusedElement = myCanvas;
            }

            var eo = new eventObject( x, y, b );
            
            if ( b != focusedElement ) {
                b.trigger.call( b, 'mouseover', eo );
                focusedElement.trigger.call( focusedElement, 'mouseout', eo );

                if ( b.clickable && b.clickable === true ) {
                    $myDrawingCanvas.css( 'cursor', 'pointer' );
                } else {
                    $myDrawingCanvas.css( 'cursor', 'auto' );
                }
                
                focusedElement = b;
            }
            focusedElement.trigger.call( focusedElement, 'mousemove', eo );
        }
       
        this.init();
    }

    //==RENDERER
    var renderer = function( myCanvas, placeHolderId ) {
        var myCanvas = myCanvas;
        var myDrawCanvas = null;
        var myDrawCanvasCTX = null;
        var placeHolder = null;
        var placeHolderId = placeHolderId;
        var intervalTime = 35;
    
        this.redraw = function( forced ) {
            if ( forced || myCanvas.changed ) {
                //background
                myDrawCanvasCTX.fillStyle = myCanvas.backgroundColor();
                myDrawCanvasCTX.strokeStyle = myCanvas.lineColor() || "";
                myDrawCanvasCTX.lineWidth = myCanvas.lineWidth() || "";
                
                myDrawCanvasCTX.fillRect( 0, 0, myCanvas.width(), myCanvas.height());
                myDrawCanvasCTX.strokeRect( 0, 0, myCanvas.width(), myCanvas.height() );
                
                var objs = myCanvas.getObjects();
                for( var i in objs ) {
                    objs[i].draw( myDrawCanvasCTX );
                }
                
                myCanvas.setChangedFlag( false );
            }
        }
        
        this.setIntervalTime = function(t) {
            intervalTime = t;
            startInterval();
            return this;
        }
        
        this.init = function() {
            placeHolder = $('#' + placeHolderId );

            if ( placeHolder.length !== 1 ) {
                throw 'placeholderId ' + placeHolderId + ' not found';
            }
        
            placeHolder.html( '' );
            this.startInterval();
            
            myDrawCanvas = $('<canvas/>')
                                    .attr( { width:myCanvas.width(), height:myCanvas.height() } )
                                    .appendTo( placeHolder );
            
            myDrawCanvas = myDrawCanvas[0];
            myDrawCanvasCTX = myDrawCanvas.getContext('2d');
            
            this.redraw( true );
        }
        
        this.startInterval = function() {
            $(this).stopTime( 'redrawing' );
            
            if ( intervalTime > 0 ) {
                $(this).everyTime(intervalTime, 'redrawing', function() { this.redraw( false ); } );
            }
        }
        
        //canvas has changed, need to reinit.
        this.notifyChange = function() {
            this.init();
        };
        
        this.getDrawingCanvas = function() {
            return myDrawCanvas;
        }
        this.getDrawingCanvasCTX = function() {
            return myDrawCanvasCTX;
        }
        
        this.init();
    }

    
    
    //==OOBJECT
    var oObject = function() {
        
        //set more than one datas
        this.setData = function(value) {
            if ( typeof value === 'object' ) {
                for( var k in value ) {
                    if ( this[ k ] !== undefined ) {
                        this[ k ].call( this, value[k] );
                    } else {
                        throw 'tried to set unknown property: ' + k;
                    }
                }
            }
            return this;
        }
        
        //return the data and stuff
        this.getData = function() {
            return this.data;
        };
        
        //extend my this.data
        this.extend = function( insertKey, startvalue, customGetter, customSetter ) {
            if ( this[ insertKey ] !== undefined ) {
                throw 'cant extend with key ' + insertKey + ', already exists';
            }
        
            var it = {};
            if ( typeof insertKey === 'object' && ( startvalue === undefined || startvalue === null ) ) {
                it = insertKey;
            } else {
                it[insertKey] = startvalue;
            }
        
            for( var k in it ) {
                if ( this.data[ k ] === undefined && this[ k ] === undefined ) {
                    this.data[ k ] = it[ k ];
                    
                    //getter and setter. invokable by the name of the individual key. e.g. mLine.angle() || mLine.angle(90)
                    //shibby. performance issue (custom(getter|setter))
                    this.properties[ k ] = true;
                    this[ k ] = (function( key ) {
                        return function( value ) {
                            if ( value === undefined ) { // read
                                var ret = this.data[ key ];
                                if ( customGetter !== undefined && customGetter !== null ) {
                                    ret = customGetter.call( this, ret, k );
                                };
                                return ret;
                            } else { //write
                                var ret = value;
                                if ( customSetter !== undefined && customSetter !== null ) {
                                    ret = customSetter.call( this, value, k );
                                }
                                this.data[key] = ret;
                                this.notifyChange();
                                return this;
                            }
                        };
                    })(k);
                } else {
                    throw k + ' already exists as key';
                }
            }
        }
        
        //enable binding of events to this object. has to has width, height, x, y, middlemode
        this.setEventBinding = function() {
            if ( !this.width || !this.height ) {
                throw 'this object is not suitable for eventbinding';
            }
            
            var that = this; //$.each changes this to the object, so using that to conserve this
            $.each( [ 'click', 'move', 'over', 'out' ], function(k, v) {
                var name = 'mouse' + v;
                that[ name ] = function( value ) {
                    return genericEvent.call( that, name, value );
                };
            } );
        }
        
        /*this.mousedown = this.mouseup = */this.mouseclick = this.mouseover = this.mouseout = this.mousemove = function() { throw 'missing implementation for mouseevent!' };
        
        this.trigger = function( event, eventData ) {
            if ( this.events[ event ] === undefined ) return; //event hasn't been bound, don't fire it....
            
            var that = this;  //$.each changes this to the object, so using that to conserve this
            $.each( this.events[ event ], function( k, v ) {
                v.call( that, eventData || {} );
            } );
        }
        
        //myO.click( function() { alert( this.x() ); } ) || myO.click();
        var genericEvent = function( event, v ) {
            if ( v === undefined ) { 
                //trigger event
                this.trigger.call( this, event );
            } else { 
                //add event handler, but only to objects, not to canvas, that events we already have
                if ( this instanceof oStencil ) {
                    this.eventHandler.treeInsert( this );    //register the graphic object to the eventhandler instance
                }
                
                if ( this.events[ event ] === undefined ) {
                    this.events[ event ] = [ v ];
                } else {
                    this.events[ event ].push( v );
                }
                
                if ( event === 'mouseclick' ) {
                    this.clickable = true;
                }
                return this;
            }
        }
        
        this.notifyChange = function() {
            throw 'missing implementation';
        }
        
        this.toString = function() {
            return this.identificado;
        }
        
        this.setEventHandler = function( e ) {
            this.eventHandler = e;
        }
    
    }
    
    
    
    // ==CANVAS
    var canvas = function() {
        this.changed = true;
        
        var renderer = null;
        this.eventHandler = null;
        this.clickable = false;
        
        var objects = [];
        this.properties = {};
        
        this.data = {};
        this.events = {};
        this.identificado = br4.util.ident.getIdent( 'oCanvas' );
        
        var insertData = {
            width:0,
            height:0,
            backgroundColor:'#000',
            lineWidth:0,
            lineColor:false
        };
        
        this.setChangedFlag = function(f) {
            this.changed = Boolean(f);
        }
        
        this.getObjects = function() {
            return objects;
        }
        
        this.getDrawingCanvas = function() {
            return renderer.getDrawingCanvas();
        }
        
        this.getDrawingCanvasCTX = function() {
            return renderer.getDrawingCanvasCTX();
        }
        
        
        this.createO = function( type, params ) {
            var tmp = br4.createO( type, this, this.eventHandler, params );
            if ( tmp !== undefined ) {
                objects.push( tmp );
            }
            this.reSortZ();
            
            return tmp;
        }
        
        this.createCompositum = function( type, params ) {
            var tmp = br4.createCompositum( type, this, params );
        }
        
        this.setRenderer = function(r) {
            renderer = r;
        }
        
        this.setEventHandler = function( e ) {
            this.eventHandler = e;
        }
        
        this.notifyChange = function() {
            renderer.notifyChange();
        }
        
        this.reSortZ = function() {
            objects.sort( function(a,b) {
                return ( a.z() > b.z() ? 1 : a.z() < b.z() ? -1 : 0 );
            } );
        }
        
        this.removeO = function( o ) {
            var i = 0;
            for( var k in objects ) {
                if ( objects[k] === o ) {
                    objects.splice(i, 1);
                    break;
                }
                i++;
            }
            if ( this.eventHandler.isKnown( o ) ) {
                this.eventHandler.treeDelete( o );
            }
            
            this.setChangedFlag( true );
        }
        
        this.extend( insertData );
    }
    canvas.inheritsFrom( oObject );
    

    //==OSTENCIL
    var oStencil = function() {
        
        this.clickable = false;
        this.data = {};
        this.events = {};
        this.properties = {};
        this.identificado = br4.util.ident.getIdent( 'oStencil' );
        
        this.eventHandler = null;
        
        var insertData = {
            x:0,
            y:0,
            z:0,
            lineColor:false,
            lineWidth:1,
            backgroundColor:false,
            visible:true,
            middleMode:false,
            opacity:1
        };
    
        this.canvas = null;
        
        //notify the canvas that the object has been changed
        this.notifyChange = function() {
            if ( this.canvas ) {
                this.canvas.setChangedFlag( true );
            }
        }
        
        //set the canvas
        this.setCanvas = function( c ) {
            this.canvas = c;
        }
        
        //get the canvas
        this.getCanvas = function() {
            return this.canvas;
        }
        
        this.remove = function() {
            this.canvas.removeO( this );
        }
        
        //draw the object
        this.draw = function( ctx ) {
            if ( !this.visible() ) return;
            
            if ( this.drawChild ) {
                //setting linewidth, linecolor, background color
                ctx.fillStyle = this.backgroundColor() || "";
                ctx.strokeStyle = this.lineColor() || "";
                ctx.lineWidth = this.lineWidth();

                ctx.beginPath();
                var b = this.drawChild( ctx );
                ctx.closePath();
            } else {
                throw 'missing draw implementation';
            }
        }
        
        //animate the object
        this.animate = function( properties, duration, cb ) {
            if ( !duration ) {
                duration = 1000;
            }

            var that = this;
            $( this.data ).animate( properties, { duration: duration,
                                               step: function() { that.notifyChange(); },
                                               queue: false,
                                               complete: cb
                                           } );
        }
        
        this.init = function() {
            this.extend( insertData );
            this.overWriteColorProperties();
            this.overWriteZProperty();
            this.initChild();
        }
        
        this.initChild = function() { throw 'missing init child function' };
        this.drawChild = function() { throw 'missing draw child implementation' };
        
        //shibby: use replace keep metho
        this.overWriteColorProperties = function() {
            var that = this;
            jQuery.each( [ 'lineColor', 'backgroundColor' ], function( k, name ) {
                var _old = that[ name ];
                
                that[ name ] = ( function( _oldFunction, keyName ) {
                    return function( value ) {
                        if ( value === undefined ) {
                            var tmp = _oldFunction.apply( that );
                            
                            if ( jQuery.isArray( tmp ) && tmp.length == 3 ) {
                                return 'rgba(' + tmp[0] + ',' + tmp[1] + ',' + tmp[2] + ', ' + this.opacity() + ')';
                            } else if ( false && ( typeof value === 'canvasgradient' || typeof value === 'canvasblapattern' ) ) { //shibby!
                                return tmp;
                            } else if ( tmp === '' || tmp === false ) {
                                return false;
                            }
                        } else {
                            var color = br4.util.getRGB( value );

                            if ( jQuery.isArray( color ) ) {
                                return _oldFunction.apply( that, [ color ] );
                            } else if ( false && ( typeof value === 'canvasgradientblablubb' || typeof value === 'canvasblapattern' ) ) { //shibby!
                                return _oldFunction.apply( that, [ value ] );
                            } else if ( value === false || value === "" ) {
                                return _oldFunction.apply( that, [ false ] );
                            }
                            throw 'invalid color: ' + color;
                        }
                    };
                } )( _old, name );
            } );
        }
        
        //shibby: use replace keep metho
        this.overWriteZProperty = function() {
            var _old = this[ 'z' ];
            this[ 'z' ] = function( val ) {
                var ret = _old.call( this, val );
                if ( val !== undefined ) {
                    this.canvas.reSortZ();
                }
                return ret;
            };
        }

    }
    oStencil.inheritsFrom( oObject );
    
    
    
    var graphicObjects = {
    };
    
    var composita = {
    };
    
    
    //==BR4
    var br4 = {
        util: {
        },
    
        o: {
        },
        
        c: {
        },
    
        createC: function( placeHolder, params ) {
            var myC = new canvas( params );
            if ( myC ) {
                var myR = new renderer( myC, placeHolder );
                myC.setRenderer( myR );
            }
            
            myC.setData( params );
            myC.setEventBinding();
            
            var myE = new eventHandler( myC );
            myC.setEventHandler( myE );
            
            return myC;
        },
        
        createCompositum: function( type, canvas, params ) {
            if( composita[ type ] !== undefined ) {
                var tmp = new composita[ type ]();
                tmp.setCanvas( canvas );
                tmp.setData( params );
                return tmp;
            } else {
                throw 'type ' + type + ' not found';
            }
        },
    
        createO: function( type, canvas, eventHandler, params ) {
            if ( graphicObjects[ type ] !== undefined ) {
                var tmp = graphicObjects[type];
                var stencil = new oStencil();
                
                var readyObject = jQuery.extend( true, stencil, tmp );
                readyObject.setCanvas( canvas );
                readyObject.init();

                readyObject.setEventHandler( eventHandler );
                readyObject.setData( params );
                return readyObject;
            } else {
                throw 'type ' + type + ' not found';
            }
        },
        
        extendO: function( name, o ) {
            //they're abstract, have to be implemented
            if ( o.initChild === undefined || o.drawChild === undefined ) {
                throw 'initChild and drawChild have to be implemented';
            }
        
            if ( graphicObjects[ name ] === undefined ) {
                graphicObjects[ name ] = o;
                this.o[ name ] = name;
            } else {
                throw 'object ' + name + ' already exists';
            }
        },
        
        extendC: function( name, o ) {
            if ( composita[ name ] === undefined ) {
                composita[ name ] = o;
                this.c[ name ] = name;
            } else {
                throw 'object ' + name + ' already exists';
            }
        }
    };

	
    // Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/
	br4.util.getRGB = function (color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;
        
		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

        return false;
	}
    
    br4.util.ident = {
        idents: {},
        getIdent: function( prefix ) {
            var ident = '';
            do {
                ident = prefix + parseInt( Math.random() * 10000000000, 10 );
            } while( this.haveIdent( ident ) );
            
            this.idents[ ident ] = true;
            
            return ident;
        },
        haveIdent: function( ident ) {
            return this.idents[ ident ] !== undefined;
        }
    };
    
    br4.util.weigthedRand = function( base, number, multipleSelection ) {
        var res = [];
        if ( base.length === 0 ) {
            return res;
        }
        
        if ( base.length <= number ) {
            base.sort( function( a, b ) { return Math.random() < 0.5 ? 1 : -1; } );
            for( var k in base ) res.push( base[ k ].key );
            return res;
        }
        
        var max = 0;
        for ( var i = 0; i < base.length; i++ ) {
            base[ i ].ok = false;
            max += base[ i ].prob;
        }

        base.sort( function(a,b) { return Math.random() > 0.5 ? -1 : 1 } );
        
        while( res.length < number ) {
            var rnd = parseInt( Math.random() * max, 10 );
            var temp = 0;

            for( var i = 0; i < base.length; i++ ) {
                if ( !base[ i ].ok ) {
                    temp += base[ i ].prob;
                    if ( rnd <= temp ) {
                        if ( multipleSelection ) {
                            base[ i ].ok = true;
                            max -= base[ i ].prob;
                        }
                        res.push( base[ i ].key );
                        break;
                    }
                }
            }
        }

        return res;
    };

    window.br4 = br4;
})(window);