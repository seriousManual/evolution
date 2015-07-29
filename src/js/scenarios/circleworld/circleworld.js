var Circle = require('../../lib/circleworld/Circle');
var Printer = require('../../lib/circleworld/Printer');
var CircleworldAlgorithm = require('../../lib/circleworld/Circleworld');

function CircleworldScenario(canvasId, options) {
    this._options = options;
    this._canvasId = canvasId;

    this._printer = null;
    this._algorithm = null;

    this._setup();
}

CircleworldScenario.prototype.run = function () {
    var that = this;

    this._algorithm.run();

    this._algorithm.on('populationImprovement', function (child) {
        that._printer.updateCircles(that._algorithm.getPopulation().getIndividuums());
    });

    this._algorithm.on('childCheck', function(child, parent1, parent2) {
        that._printer.setPreviewCircle(child, parent1, parent2);
    });

    this._algorithm.on('rate', function (rate) {
        console.log('rate', rate);
    });
};

CircleworldScenario.prototype.reset = function () {
    this._algorithm.terminate();
    this._setup();
};

CircleworldScenario.prototype.restart = function () {
    this.reset();
    this.run();
};

CircleworldScenario.prototype.setInterval = function(interval) {
    this._algorithm.setInterval(interval);
};

CircleworldScenario.prototype._setup = function () {
    this._printer = new Printer(this._canvasId, this._options);
    this._algorithm = new CircleworldAlgorithm(this._options);

    if (this._options.targetColor) {
        this._printer.setBackgroundcolor(this._options.targetColor);
    }

    this._printCircles();
};

CircleworldScenario.prototype.setTargetColor = function(targetColor) {
    this._algorithm.setTargetColor(targetColor);
    this._printer.setBackgroundcolor(targetColor);

    this._printCircles();
};

CircleworldScenario.prototype._printCircles = function() {
    this._printer.updateCircles(this._algorithm.getPopulation().getIndividuums());
};

module.exports = function (canvasId, options) {
    return new CircleworldScenario(canvasId, options || {});
};