var fabric = require('../fabric');

var Circle = require('./Circle');

function CircleWorldPrinter(canvasId, options) {
    this._options = options || {};

    this._circles = [];

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: 'rgb(0, 0, 0)',
        width: options.width,
        height: options.height
    });

    this._init();
}

CircleWorldPrinter.prototype._init = function() {
    var number = this._options.number;
    var squareSize = Math.ceil(Math.sqrt(number));
    var padding = 50;

    var availableWidth = this._options.width - (padding * 2);
    var availableHeight = this._options.height - (padding * 2);

    var rasterX = availableWidth / (squareSize - 1);
    var rasterY = availableHeight / (squareSize - 1);

    var count = 0;
    outerLoop: for (var yIndex = 0; yIndex < squareSize; yIndex++) {
        for (var xIndex = 0; xIndex < squareSize; xIndex++) {
            if (count == number) {
                break outerLoop;
            }

            var xPosition = padding + xIndex * rasterX;
            var yPosition = padding + yIndex * rasterY;

            this._circles.push(this._createCircleObject(xPosition, yPosition));

            count++;
        }
    }
};

CircleWorldPrinter.prototype._createCircleObject = function (x, y) {
    var circleObject = new fabric.Circle({
        radius: 5,
        left: x,
        top: y,
        selectable: false,
        originX: 'center',
        originY: 'center',
        fill: 'rgb(255, 0, 0)'
    });

    this._canvas.add(circleObject);
    this._canvas.renderAll();

    return circleObject;
};

CircleWorldPrinter.prototype.updateCircles = function (circlesList) {
    var that = this;

    circlesList.forEach(function (circle, index) {
        var c = circle.getColor();

        that._circles[index]
            .set('radius', circle.getRadius())
            .set('fill', 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')');
    });

    this._canvas.renderAll();
};

module.exports = CircleWorldPrinter;