var fabric = require('../../fabric');

var Course = require('./Course');

function TspPrinter(canvasId, options) {
    this._options = options || {};

    this._cityRadius = 8;
    this._cities = [];
    this._cityObjects = [];

    this._courses = [];

    this._canvas = new fabric.Canvas(canvasId, {
        backgroundColor: 'rgb(0, 0, 0)',
        width: this._options.width || 420,
        height: this._options.height || 420
    });
}

TspPrinter.prototype.addCity = function (city) {
    this._cities.push(city);

    var cityIndex = 3000;
    var cityObject = new fabric.Circle({
        radius: 8, fill: 'white', left: city.getX(), top: city.getY(), selectable: false
    });

    this._canvas.insertAt(cityObject, cityIndex + this._cityObjects.length, true);
    this._canvas.renderAll();

    this._cityObjects.push(cityObject);
};

TspPrinter.prototype.createCourse = function (options) {
    var that = this;

    var courseObjects = [];
    var course = new Course(function () {
        that._updateCourse(course, courseObjects);
    });

    var i = 1000 - (this._courses.length * 100);
    this._cities.forEach(function (city) {
        course.addCity(city);

        var line = new fabric.Line([0, 0, 0, 0], {
            strokeWidth: options.lineWidth,
            stroke: options.lineColor
        });

        that._canvas.insertAt(line, i++, true);
        courseObjects.push(line);
    });

    this._courses.push(course);
    this._canvas.renderAll();

    return course;
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