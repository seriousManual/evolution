var worker = require('webworkify');

var City = require('../../lib/tsp/lib/City');
var Printer = require('../../lib/tsp/lib/Printer');
var tspWebworker = require('../../lib/tsp/TspWebworker');

function Tsp(canvasId, options) {
    this._cities = [];
    this._canvasId = canvasId;
    this._options = options || {};

    this._algorithm = null;
    this._printer = null;

    this._setup();
}

Tsp.prototype.addCity = function (x, y) {
    var city = new City(x, y);

    this._printer.addCity(city);
    this._cities.push(city);

    return this;
};

Tsp.prototype._setup = function() {
    this._printer = new Printer(this._canvasId, this._options);
};

Tsp.prototype.run = function () {
    this._algorithm = worker(tspWebworker);
    var course = this._printer.createCourse({lineWidth: 2, lineColor: 'rgb(255, 0, 0)'});

    this._algorithm.addEventListener('message', function (message) {
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

    this._algorithm.postMessage({
        type: 'init',
        payload: {
            cities: this._cities.map(function (city) {
                return {x: city.getX(), y: city.getY()};
            }),
            options: this._options
        }
    });
};

Tsp.prototype.reset = function() {
    var that = this;

    if (this._algorithm) {
        this._algorithm.terminate();
    }
    this._setup();

    this._cities.forEach(function(city) {
        that._printer.addCity(city);
    });
};

Tsp.prototype.restart = function() {
    this.reset();
    this.run();
};

module.exports = function (canvasId, options) {
    return new Tsp(canvasId, options);
};