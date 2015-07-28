var fabric = require('../fabric');

var Circle = require('./Circle');

function CircleWorldPrinter(canvasId, options) {
    this._options = options || {};

    this._previewCircle = null;
    this._parent1Circle = null;
    this._parent2Circle = null;
    this._circles = [];
    this._texts = [];

    this._backgroundColor = this._options.backgroundColor || [255, 0, 0];
    this._padding = 50;
    this._paddingRight = 350;

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: this._buildColorString(this._backgroundColor),
        width: options.width,
        height: options.height
    });

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
    this._parent1Circle = this._createCircle(this._options.width - this._paddingRight + 200, 140);
    this._parent2Circle = this._createCircle(this._options.width - this._paddingRight + 200, 300);
    this._previewCircle = this._createCircle(this._options.width - this._paddingRight + 200, 550);
    this._canvas.add(this._previewCircle);
    this._canvas.add(this._parent1Circle);
    this._canvas.add(this._parent2Circle);

    var rect = new fabric.Rect({
        left: this._options.width - this._paddingRight + 100,
        top: this._padding + 15,
        fill: 'transparent',
        stroke: this._buildColorString([255, 255, 255]),
        strokeWidth: 3,
        width: this._paddingRight - 150,
        height: 600
    });
    this._canvas.add(rect);

    this._canvas.add(new fabric.Line([50, 10, 250, 10], {
        left: 750,
        top: 440,
        stroke: 'white',
        strokeWidth: 3
    }));

    var text = this._createTextObject('Recombination', this._options.width - this._paddingRight + 200, this._padding);
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
        fill: this._buildColorString([255, 255, 255]),
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
        fill: this._buildColorString([255, 255, 255]),
        stroke: this._buildColorString([255, 255, 255]),
        strokeWidth: 3
    });
};

CircleWorldPrinter.prototype.updateCircles = function (circlesList) {
    var that = this;

    circlesList.forEach(function (circle, index) {
        var c = circle.getColor();
        var inverseColor = that._calcInverseColor(c);

        that._circles[index]
            .set('radius', circle.getRadius())
            .set('fill', that._buildColorString(c))
//            .set('stroke', that._buildColorString(that._calcComplementaryColor(c)));

        that._texts[index]
            .set('text', circle.getFitness() + '')
            .set('fill', that._buildColorString(inverseColor));
    });

    this._canvas.renderAll();
};

CircleWorldPrinter.prototype.setPreviewCircle = function(newChildCircle, parent1Circle, parent2Circle) {
    this._previewCircle
        .set('radius', newChildCircle.getRadius())
        .set('fill', this._buildColorString(newChildCircle.getColor()));

    this._parent1Circle
        .set('radius', parent1Circle.getRadius())
        .set('fill', this._buildColorString(parent1Circle.getColor()));

    this._parent2Circle
        .set('radius', parent2Circle.getRadius())
        .set('fill', this._buildColorString(parent2Circle.getColor()));
};

CircleWorldPrinter.prototype.setBackgroundcolor = function(backgroundColor) {
    this._canvas.setBackgroundColor(this._buildColorString(backgroundColor));
};

CircleWorldPrinter.prototype._calcInverseColor = function (color) {
    var yiq = ((color[0] * 299) + (color[1] * 587) + (color[2] * 114)) / 1000;

    if (yiq >= 128) {
        return [0, 0, 0];
    } else {
        return [255, 255, 255];
    }
};

CircleWorldPrinter.prototype._calcComplementaryColor = function(color) {
    return [
        Math.abs(255 - color[0]),
        Math.abs(255 - color[1]),
        Math.abs(255 - color[2])
    ];
};

CircleWorldPrinter.prototype._buildColorString = function(color) {
    return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
};

module.exports = CircleWorldPrinter;