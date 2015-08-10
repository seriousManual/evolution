var City = require('../../lib/tsp/lib/City');
var Printer = require('../../lib/tsp/lib/Printer');
var TspAlgorithm = require('../../lib/tsp/Tsp');

function Tsp(canvasId, options) {
    options = options || {};

    if (options.interval === 'fast') {
        options.interval = 1;
    }

    this._options = options;
    this._canvasId = canvasId;
    this._cities = [];

    this._printer = null;
    this._algorithm = null;

    this._setup();
}

Tsp.prototype.addCity = function (x, y) {
    var city = new City(x, y);

    this._printer.addCity(city);
    this._algorithm.addCity(city.getX(), city.getY());
    this._cities.push(city);

    return this;
};

Tsp.prototype._setup = function() {
    this._printer = new Printer(this._canvasId, this._options);
    this._algorithm = new TspAlgorithm(this._options);
};

Tsp.prototype.reset = function() {
    var that = this;

    this._algorithm.terminate();
    this._setup();

    this._cities.forEach(function(city) {
        that._printer.addCity(city);
        that._algorithm.addCity(city.getX(), city.getY());
    });
};

Tsp.prototype.restart = function() {
    this.reset();
    this.run();
};

Tsp.prototype.run = function () {
    this._algorithm.run();

    var course = this._printer.createCourse({lineWidth: 2, lineColor: 'rgb(255, 0, 0)'});
    var courseGolden = this._printer.createCourse({lineWidth: 8, lineColor: 'rgb(50, 50, 50)'});

    this._algorithm.on('newOptimum', function (child) {
        course.setOrder(child.getCityOrder());
    });

    this._algorithm.on('rate', function (rate) {
        console.log('rate', rate);
    });

    this._algorithm.on('terminated', function () {
        console.log('terminated');
    });

    if (!!this._options.childCheck) {
        this._algorithm.on('childCheck', function (child) {
            courseGolden.setOrder(child.getCityOrder());
        });
    }
};

module.exports = function (canvasId, options) {
    return new Tsp(canvasId, options);
};