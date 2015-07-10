var worker = require('webworkify');

var City = require('../../lib/tsp/lib/City');
var Printer = require('../../lib/tsp/lib/Printer');

function Tsp(canvasId, options) {
    this._printer = new Printer(canvasId, options);

    this._cities = [];
    this._options = options || {};
}

Tsp.prototype.addCity = function (x, y) {
    var city = new City(x, y);

    this._printer.addCity(city);
    this._cities.push(city);

    return this;
};

Tsp.prototype.run = function () {
    var algorithm = worker(require('../../lib/tsp/TspWebworker'));
    var course = this._printer.createCourse({lineWidth: 2, lineColor: 'rgb(255, 0, 0)'});

    algorithm.addEventListener('message', function (message) {
        var data = message.data;
        var type = data.type;
        var payload = data.payload;

        if (type === 'newOptimum') {
            course.setOrder(payload);
        } else if (type === 'rate') {
            console.log('rate', payload);
        } else if (type === 'terminated') {
            console.log('terminated');
        }
    });

    algorithm.postMessage({
        type: 'init',
        payload: {
            cities: this._cities.map(function (city) {
                return {x: city.getX(), y: city.getY()};
            }),
            options: this._options
        }
    })
};

module.exports = function (canvasId, options) {
    return new Tsp(canvasId, options);
};