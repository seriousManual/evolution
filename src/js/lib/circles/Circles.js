var util = require('util');

var GeneticAlgorithm = require('../geneticAlgorithm/GeneticAlgorithm');
var Population = require('../geneticAlgorithm/Population');
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
        var radius = parseInt(this._options.width * 0.1, 10);
        console.log(radius)
        population.addIndividuum(new Circle()
            .setRadius(radius)
            .setX(parseInt(Math.random() * this._options.width, 10))
            .setY(parseInt(Math.random() * this._options.height, 10))
        );
    }

    return population;
};

Circles.prototype.calculateFitness = function (child) {
    var that = this;
    var overlapping = 0;
    var outside = 0;


    //overlapping with another circle
    this._scenario.forEach(function (scenarioCircle) {
        if (that._distance(scenarioCircle, child) < (child.getRadius() + scenarioCircle.getRadius())) {
            overlapping++;
        }
    });

    //overlapping with the playground border
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

    //positioned outside of playground
    if (child.getY() < 0 || child.getX() < 0 || child.getX() > this._options.width || child.getY() > this._options.height) {
        outside += 10;
    }

    var area = child.area();
    if (area <= 0) {
        return -Infinity;
    }

    if (outside) {
        return -1 * area * 10000;
    }

    if (overlapping) {
        return -1 * area * 100;
    }

    return area;

    // var area = child.area();
    // if (area <= 0) {
    //     outside += 100;
    // }


    // var rating = 1;
    // if (outside > 0 || overlapping > 0) {
    //     rating = -1;

    //     if (outside > 0) {
    //         rating = rating * outside * 4;
    //     }

    //     if (overlapping > 0) {
    //         rating = rating * overlapping * 2;
    //     }
    // }

    // rating = rating * area;

    // return rating;
};

Circles.prototype._distance = function(c1, c2) {
    return Math.sqrt(Math.pow(c1.getX() - c2.getX(), 2) + Math.pow(c1.getY() - c2.getY(), 2));
};

module.exports = Circles;