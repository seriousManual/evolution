var util = require('util');
var Population = require('../geneticAlgorithm/Population');

function CirclePopulation() {
    Population.call(this);
}

util.inherits(CirclePopulation, Population);

module.exports = CirclePopulation;