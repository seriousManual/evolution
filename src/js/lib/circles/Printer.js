var fabric = require('../fabric');

var Circle = require('./Circle');

function TspPrinter(canvasId, options) {
    this._options = options || {};

    this._scenarioCircles = [];
    this._circles = [];

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: 'rgb(0, 0, 0)',
        width: options.width,
        height: options.height
    });

    this._goldenCircle = this._createCircleObject(new Circle(1, 1, 100), null, 'rgb(255, 255, 0)', 0, 4000);
}

TspPrinter.prototype.addScenarioCircle = function (circle) {
    var scenarioCircleIndex = 3000;
    var scenarioCircleObject = this._createCircleObject(circle, 'rgb(255, 255, 255)', null, null, scenarioCircleIndex + this._scenarioCircles.length);

    this._scenarioCircles.push(scenarioCircleObject);
};

TspPrinter.prototype.setGoldenCircle = function (circle) {
    this._goldenCircle
        .set('left', circle.getX())
        .set('top', circle.getY())
        .set('radius', circle.getRadius())
        .set('opacity', 0.6)
        .setCoords();

    this._canvas.renderAll();
};

TspPrinter.prototype._createCircleObject = function (circle, color, backgroundColor, opacity, index) {
    var fill = backgroundColor || 'transparent';
    opacity = (opacity === null) ? 1 : opacity;

    var scenarioCircleObject = new fabric.Circle({
        radius: circle.getRadius(),
        left: circle.getX(),
        top: circle.getY(),
        stroke: color,
        strokeWidth: 2,
        selectable: false,
        originX: 'center',
        originY: 'center',
        fill: fill,
        opacity: opacity
    });

    this._canvas.insertAt(scenarioCircleObject, index, true);
    this._canvas.renderAll();

    return scenarioCircleObject;
};

TspPrinter.prototype.updateCircles = function (circlesList) {
    var that = this;

    circlesList.forEach(function (circle, index) {
        if (!that._circles[index]) {
            that._circles[index] = that._createCircleObject(circle, 'rgb(255, 0, 0)', null, null, 1000 - index);
        }

        var radius = circle.getRadius() <= 0 ? 1 : circle.getRadius();

        that._circles[index]
            .set('left', circle.getX())
            .set('top', circle.getY())
            .set('radius', radius)
            .setCoords();
    });

    this._canvas.renderAll();
};

module.exports = TspPrinter;