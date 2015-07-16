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

    var newRadius = (this.getRadius() + circle.getRadius()) / 2;
    var newColor = [
        parseInt((myColor[0] + circleColor[0]) / 2, 10),
        parseInt((myColor[1] + circleColor[1]) / 2, 10),
        parseInt((myColor[2] + circleColor[2]) / 2, 10)
    ];

    return new Circle()
        .setColor(newColor)
        .setRadius(newRadius);
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
    if (Math.random() > 0.7) {
        var a = 1;
        if (Math.random() < 0.5) {
            a = -1;
        }
        var b = Math.max(1, parseInt((Math.random() * Math.random() * 10) * a + value, 10))
        return b;
    }

    return value;
};

module.exports = Circle;