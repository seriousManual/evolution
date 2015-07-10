var util = require('util');
var Population = require('../geneticAlgorithm/Population');

function TspPopulation() {
    Population.call(this);
}

util.inherits(TspPopulation, Population);

TspPopulation.prototype.fitnessCompare = function (a, b) {
    return a.getFitness() < b.getFitness() ? a : b;
};

module.exports = TspPopulation;