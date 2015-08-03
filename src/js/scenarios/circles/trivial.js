var Circle = require('../../lib/circles/Circle');
var Printer = require('../../lib/circles/Printer');

function Trivial (canvasId, options) {
    this._options = options;

    this._circles = [];
    this._printer = new Printer(canvasId, options);
    this._runner = new Circle(0, 0, 0);
}

Trivial.prototype.addScenarioCircle = function (x, y, radius) {
    var circle = new Circle(x, y, radius);

    this._circles.push(circle);
    this._printer.addScenarioCircle(circle);

    return this;
};

Trivial.prototype.run = function () {
    setInterval(this._step.bind(this), 0);
};

Trivial.prototype._step = function () {
    var result = this._isColliding(this._runner);

    if (!result) {
        this._printer.setGoldenCircle(this._runner);
        this._runner.setRadius(this._runner.getRadius() + 1);
    } else {
        switch (result) {
            case 't':
                this._runner.setY(this._runner.getY() + 1);
                break;
            case 'b':
                this._runner.setY(this._runner.getY() - 1);
                break;
            case 'l':
                this._runner.setX(this._runner.getX() + 1);
                break;
            case 'r':
                this._runner.setX(parseInt(this._runner.getRadius() / 2, 10));
                this._runner.setY(this._runner.getY() + 1);
                break;
            default:
                this._runner.setX(this._runner.getX() + 1);
                break;
        }

        this._printer.updateCircles([this._runner]);
    }
};

Trivial.prototype._isColliding = function (circle) {
    var that = this;
    var overlapping = 0;

    this._circles.forEach(function (scenarioCircle) {
        if (that._pyth(scenarioCircle, circle) < circle.getRadius() + scenarioCircle.getRadius()) {
            overlapping++;
        }
    });

    if (overlapping > 0) {
        return true;
    }

    if (circle.getX() - circle.getRadius() < 0) {
        return 'l';
    }
    if (circle.getX() + circle.getRadius() > this._options.width) {
        return 'r';
    }
    if (circle.getY() - circle.getRadius() < 0) {
        return 't';
    }
    if (circle.getY() + circle.getRadius() > this._options.height) {
        return 'b';
    }

    return false;
};

Trivial.prototype._pyth = function (c1, c2) {
    return Math.sqrt(Math.pow(c1.getX() - c2.getX(), 2) + Math.pow(c1.getY() - c2.getY(), 2));
};

module.exports = function (canvasId, options) {
    return new Trivial(canvasId, options || {});
};