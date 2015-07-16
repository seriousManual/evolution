var util = require('util');

var GeneticAlgorithm = require('../geneticAlgorithm/GeneticAlgorithm');
var Population = require('../geneticAlgorithm/Population');
var Circle = require('./Circle');

function Circleworld(options) {
    GeneticAlgorithm.call(this, options);

    this._sizePopulation = options.sizePopulation || 35;
    this._options = options;

    this._targetColor = options.targetColor || [255, 0, 0];
    this._targetRadius = options.targetRadius || 50;
}

util.inherits(Circleworld, GeneticAlgorithm);

Circleworld.prototype._createPopulation = function () {
    var population = new Population();

    for (var i = 0; i < this._sizePopulation; i ++) {
        var radius = parseInt(Math.random() * 30, 10);
        var color = [
            parseInt(Math.random() * 255, 10),
            parseInt(Math.random() * 255, 10),
            parseInt(Math.random() * 255, 10)
        ];

        population.addIndividuum(new Circle(radius, color));
    }

    return population;
};

Circleworld.prototype.calculateFitness = function (child) {
    var color = child.getColor();

    var fitnessRad = Math.abs(this._targetRadius - child.getRadius());
    var fitnessCol = Math.abs(this._targetColor[0] - color[0]) +
                     Math.abs(this._targetColor[1] - color[1]) +
                     Math.abs(this._targetColor[2] - color[2]);

    return (fitnessRad + fitnessCol) * -1;
};

module.exports = Circleworld;