$(document).ready(function () {
    var myGA = null;

    $('#calc').click(function () {
        if (!myGA) {
            myGA = create();
        }

        //myGA.baseData.scenario = createScenario( myGA.baseData.canvasSize, myGA.baseData.scenarioSize );

        myGA.baseData.scenario = [
            new City(244, 390),
            new City(147, 391),
            new City(286, 108),
            new City(95, 154),
            new City(257, 170),
            new City(347, 157),
            new City(158, 197),
            new City(69, 62),
            new City(16, 12),
            new City(313, 34),
            new City(221, 23),
            new City(173, 277),
            new City(263, 267)
        ];

        myGA.run(function () {
            myGA.printHistory("pages");
        });

    });

    function create () {

        var baseData = {
            canvasSize: 400,
            genPoolSize: 40,
            scenarioSize: 13,
            wayObject: way,
            maxRuns: 100000,
            logHistory: false
        };

        var ga = GA.getAlgorithm(baseData);

        ga.stepDelay = 0;

        ga.generateGenePool = function () {
            var tmp = [];

            for (var i = 0; i < this.baseData.genPoolSize; i++) {
                var scene = [];
                for (var x = 1; x <= this.baseData.scenarioSize; x++) {
                    scene.push(x);
                }
                scene.sort(function () {
                    return Math.random() - 0.5
                });

                var tmpWay = new this.baseData.wayObject();
                tmpWay.setS(scene);
                tmp.push(tmpWay);
            }

            return tmp;
        };

        ga.chooseParents = function (pool) {
            var c1 = parseInt(Math.random() * Math.random() * (pool.length), 10);
            var c2 = null;
            do {
                c2 = parseInt(Math.random() * Math.random() * (pool.length), 10);
            } while (c1 == c2);

            return { 0: pool[ c1 ], 1: pool[ c2 ] };
        };

        ga.poolSort = function (pool) {
            pool.sort(function (a, b) {
                return ( a.f - b.f )
            });
        }

        ga.mutate = function (p1, p2) {
            var a = p1.getS();
            var b = p2.getS();

            var tmp = [];
            var log = {};
            var lookup = {};
            for (var i = 0; i < a.length; i++) {
                lookup[ a[ i ] ] = i;
            }

            var fContinue = true;
            var index = 0;
            while (fContinue) {
                tmp[ index ] = a[ index ];
                log[ a[index] ] = true;

                index = lookup[ b[ index ] ];
                if (log[ a[index] ] !== undefined) {
                    fContinue = false;
                }
            }

            for (var i = 0; i < a.length; i++) {
                if (tmp[ i ] === undefined) {
                    tmp[ i ] = b[ i ];
                }
            }

            var nr1 = 0;
            var nr2 = 0;
            var nr = 1 + parseInt(Math.random() * 4, 10);
            for (var a = 0; a < nr; a++) {
                nr1 = parseInt(Math.random() * tmp.length, 10);
                nr2 = parseInt(Math.random() * tmp.length, 10);

                var x = tmp[ nr1 ];
                tmp[ nr1 ] = tmp[ nr2 ];
                tmp[ nr2 ] = x;
            }

            return tmp;
        };

        ga.getFitness = function (str) {
            var prev = null;
            var overall = 0;
            for (var k in str) {
                var station = str[k] - 1;
                if (prev !== null) {
                    var prevCity = this.baseData.scenario[ prev ];
                    var nextCity = this.baseData.scenario[ station ];
                    overall += prevCity.distance(nextCity);
                }
                prev = station;
            }
            var firstCity = this.baseData.scenario[ str[ 0 ] - 1 ];
            var lastCity = this.baseData.scenario[ str[ str.length - 1 ] - 1 ];

            overall += firstCity.distance(lastCity);

            return overall;
        };

        ga.fitnessCompare = function (f1, f2) {
            return f1 < f2;
        };

        ga.termCriterium = function () {
            var cnt = this.pool.length * 0.8;
            var tmp = this.pool[0].f;
            for (var i = 0; i < cnt; i++) {
                var c = this.pool[i];
                if (tmp !== c.f) {
                    return false;
                }
            }
            console.log('termination');
            return true;
        };

        var number = 0;
        var redraw = 0;
        ga.mutateCalllback = function (pool) {
            if (redraw === 100) {
                redraw = 0;
                ga.showHistoryPage(pool, number, $('#pages'));
            }
            redraw++;
            number++;
        };

        ga.showHistoryPage = function (page, number, $container) {
            $container.html('');

            printScenario(this.baseData);

            var $table = $('<table cellspacing="0" cellpadding="3" border="1"></table>');
            $('<tr><th>genome</th><th>fitness</th></tr>').appendTo($table);

            page.sort(function (a, b) {
                return a.f - b.f;
            });

            var myWay = page[ 0 ].getS();

            for (var k in page) {
                var row = page[ k ];

                var bgColor = '#fff';
                if (row.isParent) {
                    bgColor = '#0f0';
                } else if (row.isChild) {
                    bgColor = '#f00';
                }

                var bd = this.baseData;
                $('<tr style="background-color:' + bgColor + '"><td>' + row.getS().join('') + '</td><td>' + row.f + '</td></tr>')
                    .mouseenter(
                    (function () {
                        var tmp = row.getS();
                        return function () {
                            printRow(bd, tmp);
                        };
                    })())
                    .appendTo($table);
            }

            printRow(this.baseData, myWay);

            $('<h2>' + (number) + '</h2>').appendTo($container);

            $container.append($table);
        };

        var can = br4.createC("tsp", { width: baseData.canvasSize, height: baseData.canvasSize, backgroundColor: '#000' })

        baseData.scenarioCities = [];
        baseData.ways = [];
        for (var i = 0; i < baseData.scenarioSize; i++) {
            baseData.scenarioCities.push(can.createO(br4.o.gCircle, { x: 0, y: 0, radius: 8, backgroundColor: '#fff', middleMode: true, z: 1 }));
        }

        for (var i = 0; i < baseData.scenarioSize; i++) {
            baseData.ways.push(can.createO(br4.o.gLine, { x: 0, y: 0, x2: 0, y2: 0, lineWidth: 2, lineColor: '#f00', z: 0 }));
        }

        return ga;
    }

    function printRow (baseData, myWay) {
        var prev = null;
        var c = 0;

        for (var k in myWay) {
            var station = myWay[ k ] - 1;
            var subway = baseData.ways[ c ];

            if (prev !== null) {
                var prevCity = baseData.scenario[ prev ];
                var nextCity = baseData.scenario[ station ];

                subway.x(prevCity.x).y(prevCity.y).x2(nextCity.x).y2(nextCity.y);
                c++;
            }
            prev = station;
        }
        var firstCity = myWay[ 0 ] - 1;
        var lastCity = myWay[ myWay.length - 1 ] - 1;
        firstCity = baseData.scenario[ firstCity ];
        lastCity = baseData.scenario[ lastCity ];

        subway = baseData.ways[ baseData.ways.length - 1 ];
        subway.x(lastCity.x).y(lastCity.y).x2(firstCity.x).y2(firstCity.y);
    }

    function printScenario (baseData) {
        for (var k in baseData.scenario) {
            var circle = baseData.scenario[ k ];
            var drawCircle = baseData.scenarioCities[ k ];

            drawCircle.x(circle.x);
            drawCircle.y(circle.y);
        }
    }

    function createScenario (size, number) {
        var tmp = [];

        for (var i = 0; i < number; i++) {
            var x = parseInt(size * Math.random(), 10);
            var y = parseInt(size * Math.random(), 10);
            tmp.push(new City(x, y));
        }

        return tmp;
    }

    function City (x, y) {
        this.x = x;
        this.y = y;

        this.distance = function (city) {
            return Math.sqrt(Math.pow(city.x - this.x, 2) + Math.pow(city.y - this.y, 2));
        }
    }

    function way () {
        this.genome = [];

        this.getS = function () {
            return this.genome;
        };

        this.setS = function (s) {
            this.genome = s;
        };
    }

});