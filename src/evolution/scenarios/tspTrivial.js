var util = require('util');
var Emitter = require('events').EventEmitter;

var Sampler = require('../lib/Sampler');
var City = require('../lib/tsp/lib/City');
var shuffle = require('../lib/shuffle');
var Printer = require('../lib/tsp/lib/Printer');
var createCombinations = require('../lib/tsp/combinations');


function TspTrivial(canvasId) {
    var that = this;
    Emitter.call(this);

    this._printer = new Printer(canvasId);
    this._sampler = new Sampler(1000);

    this._cities = [];
    this._lengthShortestWay = Infinity;

    this._sampler.on('rate', function(rate) {
        that.emit('rate', rate);
    });
}

util.inherits(TspTrivial, Emitter);

TspTrivial.prototype.start = function() {
    var that = this;

    var testCourse = this._printer.createCourse({
        lineWidth: 2, lineColor: 'rgb(100, 100, 100)'
    });

    var goldenCourse = this._printer.createCourse({
        lineWidth: 8, lineColor: 'rgb(180, 0, 0)'
    });

    var cityIndizes = this._cities.map(function (value, index) {
        return index;
    });

    cityIndizes = shuffle(cityIndizes);
    var combinations = createCombinations(cityIndizes);

    setInterval(run.bind(this), 0);

    function run () {
        that._sampler.sample();
        var next = combinations.next();
        var combination = next.value;

        testCourse.setOrder(combination);

        if (testCourse.getLength() < that._lengthShortestWay) {
            that._lengthShortestWay = testCourse.getLength();
            goldenCourse.setOrder(combination);

            that.emit('newShortestWay', combination, that._lengthShortestWay);
        }
    }
};

TspTrivial.prototype.addCity = function(x, y) {
    var city = new City(x, y);

    this._cities.push(city);
    this._printer.addCity(city);

    this._cities = shuffle(this._cities);

    return this;
};

function createTspTrivial (canvasId) {
    return new TspTrivial(canvasId);
}

module.exports = createTspTrivial;