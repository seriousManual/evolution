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

    this._padding = 50;
    this._paddingRight = 350;

    this._init();
}

CircleWorldPrinter.prototype._init = function () {
    var number = this._options.sizePopulation;
    var squareSize = Math.ceil(Math.sqrt(number));

    var availableWidth = this._options.width - this._padding - this._paddingRight;
    var availableHeight = this._options.height - (this._padding * 2);

    var rasterX = availableWidth / (squareSize - 1);
    var rasterY = availableHeight / (squareSize - 1);

    var count = 0;
    outerLoop: for (var yIndex = 0; yIndex < squareSize; yIndex++) {
        for (var xIndex = 0; xIndex < squareSize; xIndex++) {
            if (count == number) {
                break outerLoop;
            }

            var xPosition = this._padding + xIndex * rasterX;
            var yPosition = this._padding + yIndex * rasterY;

            this._createRenderObject(xPosition, yPosition);

            count++;
        }
    }

    this._buildPreview();
};

CircleWorldPrinter.prototype._buildPreview = function() {
    this._previewCircle = this._createCircle(this._options.width - this._paddingRight + 200, 140);
    this._canvas.add(this._previewCircle);

    var rect = new fabric.Rect({
        left: this._options.width - this._paddingRight + 100,
        top: this._padding + 15,
        fill: 'transparent',
        stroke: 'rgb(255, 255, 255)',
        width: this._paddingRight - 150,
        height: 150
    });
    this._canvas.add(rect);

    var text = this._createTextObject('The New Candidate', this._options.width - this._paddingRight + 200, this._padding);
    this._canvas.add(text);
};

CircleWorldPrinter.prototype._createRenderObject = function (x, y) {
    var circleObject = this._createCircle(x, y);
    this._canvas.add(circleObject);
    this._circles.push(circleObject);

    var textObject = this._createTextObject('', x, y);
    this._canvas.add(textObject);
    this._texts.push(textObject);

    this._canvas.renderAll();

};

CircleWorldPrinter.prototype._createTextObject = function(text, x, y) {
    return new fabric.Text(text, {
        fontFamily: 'Comic Sans MS',
        fontSize: 25,
        fill: 'rgb(255, 255, 255)',
        left: x,
        top: y + 2,
        originX: 'center',
        originY: 'center',
        selectable: false
    });
};

CircleWorldPrinter.prototype._createCircle = function(x, y) {
    return new fabric.Circle({
        radius: 5,
        left: x,
        top: y,
        selectable: false,
        originX: 'center',
        originY: 'center',
        fill: 'rgb(255, 0, 0)'
    });
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

CircleWorldPrinter.prototype.setPreviewCircle = function(circle) {
    var c = circle.getColor();

    this._previewCircle
        .set('radius', circle.getRadius())
        .set('fill', 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')');
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