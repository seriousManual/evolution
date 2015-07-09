var City = require('../../lib/tsp/lib/City');
var Printer = require('../../lib/tsp/lib/Printer');
var TspAlgorithm = require('../../lib/tsp/Tsp');

function Tsp(canvasId, options) {
    options = options || {};

    if (options.interval === 'fast') {
        options.interval = 1;
    }

    this._printer = new Printer(canvasId, options);
    this._algorithm = new TspAlgorithm(options);
    this._options = options;
}

Tsp.prototype.addCity = function(x, y) {
    var city = new City(x, y);

    this._printer.addCity(city);
    this._algorithm.addCity(x, y);

    return this;
};

Tsp.prototype.run = function() {
    this._algorithm.run();

    var course = this._printer.createCourse({ lineWidth: 2, lineColor: 'rgb(255, 0, 0)' });
    var courseGolden = this._printer.createCourse({ lineWidth: 8, lineColor: 'rgb(50, 50, 50)' });

    this._algorithm.on('newOptimum', function(child) {
        course.setOrder(child.getCityOrder());
    });

    this._algorithm.on('rate', function(rate) {
        console.log('rate', rate);
    });

    this._algorithm.on('terminated', function() {{
        console.log('terminated');
    }});

    if (!!this._options.childCheck) {
        this._algorithm.on('childCheck', function(child) {
            courseGolden.setOrder(child.getCityOrder());
        });
    }

};

module.exports = function(canvasId, options) {
    return new Tsp(canvasId, options);
};