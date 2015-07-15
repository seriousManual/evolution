var util = require('util');

var Individuum = require('../geneticAlgorithm/Individuum');


function Circle(radius, color) {
    Individuum.call(this);

    this._radius = radius;
    this._color = [0, 0, 0];
    this.setFitness(-Infinity);
}

util.inherits(Circle, Individuum);

Circle.prototype.area = function () {
    return Math.PI * Math.pow(this.getRadius(), 2);
};

Circle.prototype.getColor = function(color) {
    return this._color;
};

Circle.prototype.setColor = function(color) {
    this._color = color;

    return this;
};

Circle.prototype.getRadius = function () {
    return this._radius;
};

Circle.prototype.setRadius = function (radius) {
    this._radius = radius;

    return this;
};

Circle.prototype.recombinate = function (circle) {

};

Circle.prototype.mutate = function () {

};

module.exports = Circle;