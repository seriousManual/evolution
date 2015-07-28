var util = require('util');

var Individuum = require('../geneticAlgorithm/Individuum');


function Circle(radius, color) {
    Individuum.call(this);

    this._radius = radius;
    this._color = color;
    this.setFitness(-Infinity);
}

util.inherits(Circle, Individuum);

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
    var myColor = this.getColor();
    var circleColor = circle.getColor();

    var newRadius = this._combinate(this.getRadius(), circle.getRadius());
    var newColor = [
        this._combinate(myColor[0], circleColor[0]),
        this._combinate(myColor[1], circleColor[1]),
        this._combinate(myColor[2], circleColor[2])
    ];

    return new Circle()
        .setColor(newColor)
        .setRadius(newRadius);
};

Circle.prototype._combinate = function(v1, v2) {
    var rnd = Math.random();
    var v1N = rnd * v1;
    var v2N = (1 - rnd) * v2;
    var result = v1N + v2N;

    return parseInt(result, 10);
};

Circle.prototype.mutate = function () {
    var myColor = this.getColor();
    this.setColor([
        this._mutate(myColor[0]),
        this._mutate(myColor[1]),
        this._mutate(myColor[2])
    ]);

    this.setRadius(this._mutate(this.getRadius()));
};

Circle.prototype._mutate = function(value) {
    var modificator = 1;
    if (Math.random() < 0.5) {
        modificator = -1;
    }
    var deltaAbs = Math.random() * Math.random() * 50;

    var delta = deltaAbs * modificator;
    var newvalue = delta +  value;
    var b = Math.max(1, parseInt(newvalue, 10));

    return b;
};

module.exports = Circle;