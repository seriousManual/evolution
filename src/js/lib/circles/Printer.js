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

TspPrinter.prototype.addCircle = function(circle) {
    var circleIndex = 1000 - this._circles.length;
    var scenarioCircleObject = this._createCircleObject(circle, 'rgb(255, 0, 0)', circleIndex);

    this._circles.push(scenarioCircleObject);
};

TspPrinter.prototype._createCircleObject = function(circle, color, index) {
    var scenarioCircleObject = new fabric.Circle({
        radius: circle.getRadius(),
        left: circle.getX(),
        top: circle.getY(),
        borderColor: color,
        selectable: false
    });

    this._canvas.insertAt(scenarioCircleObject, index, true);
    this._canvas.renderAll();
};

TspPrinter.prototype._updateCourse = function (course, courseObjects) {
    var that = this;
    var order = course.getOrder();
    var previousCity = order[order.length - 1];

    var i = 0;
    order.forEach(function (city) {
        var line = courseObjects[i];
        var offset = that._cityRadius - line.get('strokeWidth') / 2;

        line
            .set('x1', previousCity.getX() + offset)
            .set('y1', previousCity.getY() + offset)
            .set('x2', city.getX() + offset)
            .set('y2', city.getY() + offset);

        previousCity = city;
        i++;
    });

    this._canvas.renderAll();
};

module.exports = TspPrinter;