var util = require('util');

var GeneticAlgorithm = require('../geneticAlgorithm/GeneticAlgorithm');
var Population = require('./Population');
var Circle = require('./Circle');

function Circles(options) {
    GeneticAlgorithm.call(this, options);

    this._sizePopulation = options.sizePopulation || 35;
    this._options = options;
    this._scenario = [];
}

util.inherits(Circles, GeneticAlgorithm);

Circles.prototype.addScenarioCircle = function (circle) {
    this._scenario.push(circle);
};

Circles.prototype._createPopulation = function () {
    var population = new Population();

    for (var i = 0; i < this._sizePopulation; i ++) {
        population.addIndividuum(new Circle()
            .setRadius(parseInt(Math.random() * 100, 10))
            .setX(parseInt(Math.random() * this._options.width, 10))
            .setY(parseInt(Math.random() * this._options.height, 10))
        );
    }

    return population;
};

Circles.prototype.calculateFitness = function (child) {
    var overlapping = 0;
    var outside = 0;

    this._scenario.forEach(function (scenarioCircle) {
        if (pyth(scenarioCircle, child) < child.getRadius() + scenarioCircle.getRadius()) {
            overlapping++;
        }
    });

    if (child.getX() - child.getRadius() < 0) {
        outside++;
    }
    if (child.getX() + child.getRadius() > this._options.width) {
        outside++;
    }
    if (child.getY() - child.getRadius() < 0) {
        outside++;
    }
    if (child.getY() + child.getRadius() > this._options.height) {
        outside++;
    }

    if (child.getY() < 0 || child.getX() < 0 || child.getX() > this._options.width || child.getY() > this._options.height) {
        outside += 10;
    }

    var area = child.area();
    if (area <= 0) {
        outside += 100;
    }

    function pyth(c1, c2) {
        return Math.sqrt(Math.pow(c1.getX() - c2.getX(), 2) + Math.pow(c1.getY() - c2.getY(), 2));
    }

    var rating = 1;
    if (outside > 0 || overlapping > 0) {
        rating = -1;
    }

    if (outside !== 0) {
        rating = rating * (outside * 4);
    }

    if (!overlapping == 0) {
        rating = rating * (overlapping * 2);
    }

    rating = rating * child.area();

    return rating;
};

module.exports = Circles;