var Circle = require('../../lib/circles/Circle');
var Printer = require('../../lib/circles/Printer');
var CircleAlgorithm = require('../../lib/circles/Circles');

function CirclesScenario(canvasId, options) {
    this._circles = [];
    this._printer = new Printer(canvasId, options);
    this._algorithm = new CircleAlgorithm(options);

}

CirclesScenario.prototype.addScenarioCircle = function (x, y, radius) {
    var circle = new Circle(x, y, radius);
    this._printer.addScenarioCircle(circle);
    this._algorithm.addScenarioCircle(circle);

    return this;
};

CirclesScenario.prototype.run = function() {
    var that = this;

    this._algorithm.run();

    this._algorithm.on('newOptimum', function (child) {
        that._printer.updateCircles(that._algorithm.getPopulation().getIndividuums());
    });

    this._algorithm.on('rate', function (rate) {
        console.log('rate', rate);
    });

    this._algorithm.on('terminated', function (population) {
        that._printer.setGoldenCircle(population.getFirst());
        console.log('term');
    });
};

module.exports = function (canvasId, options) {
    return new CirclesScenario(canvasId, options || {});
};