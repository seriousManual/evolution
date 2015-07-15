var fabric = require('../fabric');

var Circle = require('./Circle');

function CircleWorldPrinter(canvasId, options) {
    this._options = options || {};

    this._circles = [];
    this._texts = [];

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: 'rgb(0, 0, 0)',
        width: options.width,
        height: options.height
    });

    this._init();
}

CircleWorldPrinter.prototype._init = function () {
    var number = this._options.sizePopulation;
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

            this._createRenderObject(xPosition, yPosition);

            count++;
        }
    }
};

CircleWorldPrinter.prototype._createRenderObject = function (x, y) {
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
    this._circles.push(circleObject);

    var textObject = new fabric.Text('0', {
        fontFamily: 'Comic Sans',
        fontSize: 25,
        fill: 'rgb(255, 255, 255)',
        left: x,
        top: y + 2,
        originX: 'center',
        originY: 'center'
    });
    this._canvas.add(textObject);
    this._texts.push(textObject);

    this._canvas.renderAll();

};

CircleWorldPrinter.prototype.updateCircles = function (circlesList) {
    var that = this;

    circlesList.forEach(function (circle, index) {
        var c = circle.getColor();
        var inverseColor = that._calcInverseColor(c);

        that._circles[index]
            .set('radius', circle.getRadius())
            .set('fill', 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')');

        that._texts[index]
            .set('text', circle.getFitness() + '')
            .set('fill', 'rgb(' + inverseColor[0] + ', ' + inverseColor[1] + ', ' + inverseColor[2] + ')');
    });

    this._canvas.renderAll();
};

CircleWorldPrinter.prototype._calcInverseColor = function (color) {
    var yiq = ((color[0] * 299) + (color[1] * 587) + (color[2] * 114)) / 1000;

    if (yiq >= 128) {
        return [0, 0, 0];
    } else {
        return [255, 255, 255];
    }
};

module.exports = CircleWorldPrinter;