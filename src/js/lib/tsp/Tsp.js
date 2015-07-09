var util = require('util');

var shuffle = require('../shuffle');

var GeneticAlgorithm = require('../geneticAlgorithm/GeneticAlgorithm');
var Population = require('./Population');
var Way = require('./Way');

function Tsp(options) {
    options = options || {};

    GeneticAlgorithm.call(this, options);

    this._sizePopulation = options.sizePopulation || 35;

    this._cities = [];
}

util.inherits(Tsp, GeneticAlgorithm);

Tsp.prototype.addCity = function (city) {
    this._cities.push(city);
};

Tsp.prototype._createPopulation = function () {
    var population = new Population();

    for (var i = 0; i < this._sizePopulation; i++) {
        var individuum = new Way();

        var order = [];
        for (var y = 0; y < this._cities.length; y++) {
            order.push(y);
        }
        order = shuffle(order);

        individuum.setCityOrder(order);

        population.addIndividuum(individuum);
    }

    return population;
};

Tsp.prototype.calculateFitness = function (child) {
    var order = child.getCityOrder();

    var length = 0;
    var prevCityIndex = order[order.length - 1];
    var prevCity = this._cities[prevCityIndex];
    for (var i = 0; i < order.length; i++) {
        var city = this._cities[order[i]];
        length += prevCity.distance(city);

        prevCity = city;
    }

    return length;
};

module.exports = Tsp;