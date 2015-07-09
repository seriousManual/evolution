var shuffle = require('../../lib/shuffle');

var Circle = require('../../lib/circles/Circle');
var Printer = require('../../lib/circles/Printer');

function PrinterScenario(canvasId, options) {
    var that = this;

    this._circles = [];
    this._printer = new Printer(canvasId, options);

    for(var i = 0; i < options.number; i++) {
        this._circles.push(new Circle(
            Math.random() * options.width,
            Math.random() * options.height,
            Math.random() * options.width
        ));
    }

    setInterval(function() {
        that._circles.forEach(function(circle) {
            circle.setX(Math.random() * options.width);
            circle.setY(Math.random() * options.height);
            circle.setRadius(Math.random() * (options.width / 3));
        });

        that._printer.updateCircles(that._circles);
    }, 1000);
}

PrinterScenario.prototype.addScenarioCircle = function(x, y, radius) {
    this._printer.addScenarioCircle(new Circle(x, y, radius));

    return this;
};

module.exports = function(canvasId, options) {
    return new PrinterScenario(canvasId, options || {});
};