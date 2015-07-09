var fabric = require('../fabric');

function TspPrinter(canvasId, options) {
    this._options = options || {};

    this._scenarioCircles = [];
    this._circles = [];

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: 'rgb(0, 0, 0)',
        width: options.width || 420,
        height: options.height || 420
    });
}

TspPrinter.prototype.addScenarioCircle = function (circle) {
    var scenarioCircleIndex = 3000;
    var scenarioCircleObject = this._createCircleObject(circle, 'rgb(255, 255, 255)', scenarioCircleIndex + this._scenarioCircles.length);

    this._scenarioCircles.push(scenarioCircleObject);
};

TspPrinter.prototype._createCircleObject = function(circle, color, index) {
    var scenarioCircleObject = new fabric.Circle({
        radius: circle.getRadius(),
        left: circle.getX(),
        top: circle.getY(),
        stroke: color,
        strokeWidth: 2,
        selectable: false,
        originX: 'center',
        originY: 'center',
        fill: 'transparent'
    });

    this._canvas.insertAt(scenarioCircleObject, index, true);
    this._canvas.renderAll();

    return scenarioCircleObject;
};

TspPrinter.prototype.updateCircles = function (circlesList) {
    var that = this;

    circlesList.forEach(function(circle, index) {
        if (!that._circles[index]) {
            that._circles[index] = that._createCircleObject(circle, 'rgb(255, 0, 0)', 1000 - index);
        }

        that._circles[index]
            .set('left', circle.getX())
            .set('top', circle.getY())
            .set('radius', circle.getRadius())
            .setCoords();
    });

    this._canvas.renderAll();
};

module.exports = TspPrinter;