var util = require('util');

var GeneticAlgorithm = require('../geneticAlgorithm/GeneticAlgorithm');
var Population = require('../geneticAlgorithm/Population');
var Circle = require('./Circle');

function Circleworld(options) {
    GeneticAlgorithm.call(this, options);

    this._sizePopulation = options.sizePopulation || 35;
    this._options = options;
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
    //TODO
};

module.exports = Circleworld;