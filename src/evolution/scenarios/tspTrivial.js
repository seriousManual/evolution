var City = require('../lib/tsp/lib/City');
var shuffle = require('../lib/shuffle');
var Printer = require('../lib/tsp/lib/Printer');
var createCombinations = require('../lib/tsp/combinations');

function tspTrivial (canvasId) {
    var cities = [];
    var printer = new Printer(canvasId);

    var shortestWay = null;
    var lengthShortestWay = Infinity;

    return {
        start: function () {
            var testCourse = printer.createCourse({
                lineWidth: 2, lineColor: 'rgb(100, 100, 100)'
            });

            var goldenCourse = printer.createCourse({
                lineWidth: 8, lineColor: 'rgb(180, 0, 0)'
            });

            var cityIndizes = cities.map(function (value, index) {
                return index;
            });

            cityIndizes = shuffle(cityIndizes);
            var combinations = createCombinations(cityIndizes);

            var count = 0;
            setInterval(function () {
                console.log(count);
                count = 0;
            }, 1000);

            setInterval(run, 0);

            function fastRun () {
                var infiniCount = 0;
                while (true) {
                    if (infiniCount > 1000) {
                        setTimeout(fastRun, 0);
                        break;
                    }

                    run();
                    infiniCount++;
                }
            }

            function run () {
                var next = combinations.next();
                var combination = next.value;

                count++;
                testCourse.setOrder(combination);

                if (testCourse.getLength() < lengthShortestWay) {
                    shortestWay = combination;
                    lengthShortestWay = testCourse.getLength();
                    goldenCourse.setOrder(combination);
                }
            }
        },
        addCity: function (x, y) {
            var city = new City(x, y);

            cities.push(city);
            printer.addCity(city);

            cities = shuffle(cities);

            return this;
        }
    }
}

module.exports = tspTrivial;