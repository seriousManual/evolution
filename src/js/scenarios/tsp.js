var City = require('../lib/tsp/lib/City');
var Printer = require('../lib/tsp/lib/Printer');
var TspAlgorithm = require('../lib/tsp/Tsp');

function Tsp(canvasId) {
    this._printer = new Printer(canvasId);
    this._algorithm = new TspAlgorithm();
}

Tsp.prototype.addCity = function(x, y) {
    var city = new City(x, y);

    this._printer.addCity(city);
    this._algorithm.addCity(city);

    return this;
};

Tsp.prototype.run = function() {
    this._algorithm.run();

    var course = this._printer.createCourse({ lineWidth: 2, lineColor: 'rgb(255, 0, 0)' });

    this._algorithm.on('newOptimum', function(child) {
        console.log('newOptimum', child.getFitness());
        course.setOrder(child.getCityOrder());
    });

    this._algorithm.on('rate', function(rate) {
        console.log('rate', rate);
    });

    this._algorithm.on('terminated', function() {{
        console.log('terminated');
    }});
};

module.exports = function(canvasId) {
    return new Tsp(canvasId);
};