var circleCreator = function (placeHolder, config) {

    if (!placeHolder) {
        throw new Error('no placeHolder');
    }

    var myGA = null;
    config = config || { mutateCallback: true };

    init(placeHolder);

    function init () {
        if (!myGA) {
            myGA = create(config);
        }
    }

    return {
        run: function (callback) {
            callback = callback || function () {
            };

            myGA.run(function () {
                callback();

                if (config.printHistory) {
                    myGA.printHistory("pages");
                }
            });
        },

        pause: {

        },

        reset: function () {
            myGA.desintegrate();
            myGA = null;

            $('#' + placeHolder).html('');

            init();
        },

        redefineBaseData: function (baseData) {
            myGA.redefineBaseData(baseData);
        },

        baseData: myGA.baseData
    };

    function create (config) {

        var baseData = {
            canvasSize: config.canvasSize ? config.canvasSize : 550,
            genPoolSize: config.poolSize ? config.poolSize : 30,
            circleObject: Circle,
            maxRuns: config.logHistory || 10000,
            logHistory: false,
            goal: { col: [255, 0, 0], rad: 50 }
        };

        var ga = GA.getAlgorithm(baseData);

        ga.stepDelay = 1000;

        ga.generateGenePool = function () {
            var tmp = [];

            for (var i = 0; i < this.baseData.genPoolSize; i++) {
                var rad = parseInt(Math.random() * baseData.goal.rad, 10);
                var col = [parseInt(Math.random() * 256, 10), parseInt(Math.random() * 256, 10), parseInt(Math.random() * 256, 10)];
                tmp.push(new Circle(col, rad));
            }

            return tmp;
        };

        ga.chooseParents = function (pool) {
            c1 = parseInt((Math.random() * Math.random()) * pool.length, 10);
            do {
                c2 = parseInt((Math.random() * Math.random()) * pool.length, 10);
            } while (c1 == c2);

            return { 0: pool[ c1 ], 1: pool[ c2 ] };
        };

        function mutateCol (n1, n2) {
            var tmp = Math.random() < 0.5 ? n1 : n2;

            if (Math.random() > 0.7) {
                var mut = parseInt(Math.random() * Math.random() * Math.random() * 255, 10);
                tmp += (Math.random() < 0.5 ? -1 : 1) * mut;
            }
            return Math.min(Math.max(tmp, 0), 255);
        }

        function mutateRad (n1, n2) {
            var tmp = Math.random() < 0.5 ? n1 : n2;

            if (Math.random() > 0.3) {
                tmp += (Math.random() < 0.5 ? -1 : 1) * parseInt(Math.random() * 30, 10);
            }
            tmp = Math.max(0, tmp);

            return tmp;
        }

        ga.mutate = function (p1, p2) {
            var newRad = mutateRad(p1.rad, p2.rad);

            var c1 = mutateCol(p1.col[0], p2.col[0]);
            var c2 = mutateCol(p1.col[1], p2.col[1]);
            var c3 = mutateCol(p1.col[2], p2.col[2]);

            var newCol = [c1, c2, c3];

            return new Circle(newCol, newRad).getS();
        };

        ga.getFitness = function (circle) {
            var tmpCircle = new Circle();
            tmpCircle.setS(circle);

            var fitnessRad = Math.abs(baseData.goal.rad - tmpCircle.rad);
            var fitnessCol = (Math.abs(baseData.goal.col[0] - tmpCircle.col[0]) + Math.abs(baseData.goal.col[1] - tmpCircle.col[1]) + Math.abs(baseData.goal.col[2] - tmpCircle.col[2]));

            return (fitnessRad + fitnessCol) * -1;
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
            return true;
        };

        if (config.mutateCallback) {
            ga.mutateCalllback = printGenome;
        }

        function printGenome (pool) {
            function nubsi (c) {
                return (c < 16 ? '0' : '') + c.toString(16);
            }

            var i = 0;
            while (i < baseData.genPoolSize) {
                var drawCircle = baseData.poolCircles[i];
                var drawText = baseData.poolTexts[i];

                var col = '#' + nubsi(pool[i].col[0]) + nubsi(pool[i].col[1]) + nubsi(pool[i].col[2]);

                drawCircle.radius(pool[i].rad).backgroundColor(col);
                drawText.backgroundColor('#ffffff').text(pool[i].f);

                currX = currX + step;
                i++;
            }
        }

        var can = br4.createC(placeHolder, { width: baseData.canvasSize, height: baseData.canvasSize, lineColor: '#000', backgroundColor: '#000' });

        var step = baseData.goal.rad + 30;
        var currX = step;
        var currY = step;

        baseData.poolCircles = [];
        baseData.poolTexts = [];
        for (var i = 0; i < baseData.genPoolSize; i++) {
            var drawText = can.createO(br4.o.gText, {z: 1000, text: '', backgroundColor: '#ffffff', middleMode: true});
            baseData.poolTexts.push(drawText);

            var drawCircle = can.createO(br4.o.gCircle, { z: i, x: 0, y: 0, radius: 1, lineWidth: 0, lineColor: '#f00', backgroundColor: '#f00', middleMode: true, z: 0 });
            baseData.poolCircles.push(drawCircle);

            drawText.x(currX).y(currY);
            drawCircle.x(currX).y(currY);

            currX += step;

            if (currX >= baseData.canvasSize) {
                currY += step;
                currX = step;
            }
        }

        return ga;
    }

    function Circle (col, rad) {
        this.col = col || [0, 0, 0];
        this.rad = rad || 1;

        this.setS = this.parseGenome = function (g) {
            var tmp = g.split('_');
            this.col = tmp[0].split(',').map(function (value) {
                return parseInt(value, 10);
            });
            this.rad = parseInt(tmp[1], 10);
        };

        this.getS = function () {
            return this.col + '_' + this.rad;
        }

    }
};