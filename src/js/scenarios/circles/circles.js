var Circle = require('../../lib/circles/Circle');
var Printer = require('../../lib/circles/Printer');
var CircleAlgorithm = require('../../lib/circles/Circles');

function CirclesScenario(canvasId, options) {
    this._circles = [];
    this._options = options;
    this._canvasId = canvasId;

    this._printer = null;
    this._algorithm = null;

    this._setup();
}

CirclesScenario.prototype.addScenarioCircle = function (x, y, radius) {
    var circle = new Circle(x, y, radius);

    this._circles.push(circle);
    this._printer.addScenarioCircle(circle);
    this._algorithm.addScenarioCircle(circle);

    return this;
};

CirclesScenario.prototype.run = function () {
    var that = this;

    this._algorithm.run();

    this._algorithm.on('populationImprovement', function (child) {
        that._printer.updateCircles(that._algorithm.getPopulation().getIndividuums());
    });

    this._algorithm.on('newOptimum', function (child) {
        that._printer.setGoldenCircle(child);
    });

    this._algorithm.on('rate', function (rate) {
        console.log('rate', rate);
    });

    this._algorithm.on('missRate', function (rate) {
        console.log('missRate', rate);
    });

    this._algorithm.on('hitRate', function (rate) {
        console.log('hitRate', rate);
    });

    this._algorithm.on('terminated', function (population) {
        that._printer.setGoldenCircle(population.getFirst());
    });
};

CirclesScenario.prototype.step = function () {
    this._algorithm._step();
};

CirclesScenario.prototype.reset = function () {
    this._algorithm.terminate();
    this._setup();
};

CirclesScenario.prototype.restart = function () {
    this.reset();
    this.run();
};

CirclesScenario.prototype._setup = function () {
    var that = this;
    this._printer = new Printer(this._canvasId, this._options);
    this._algorithm = new CircleAlgorithm(this._options);

    this._circles.forEach(function(circle) {
        that._printer.addScenarioCircle(circle);
        that._algorithm.addScenarioCircle(circle);
    });

    this._printer.on('click', this.restart.bind(this));
};

module.exports = function (canvasId, options) {
    return new CirclesScenario(canvasId, options || {});
};