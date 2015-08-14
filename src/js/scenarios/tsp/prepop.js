var TspPrinter = require('../../lib/tsp/lib/Printer');
var Prepopulation = require('../../lib/tsp/lib/prepopulation/Prepopulation');
var City = require('../../lib/tsp/lib/City');

function PrepopulationScenario(placeholderId) {
    this._cities = [];
    this._printer = new TspPrinter(placeholderId);
    this._prepopulation = new Prepopulation();
    this._course = null;
}

PrepopulationScenario.prototype.addCity = function(x, y) {
    var city = new City(x, y);

    this._cities.push(city);
    this._printer.addCity(city);
    this._prepopulation.addCity(city);
};

PrepopulationScenario.prototype.run = function() {
    var that = this;

    if (!this._course) {
        console.time('buildCorse');
        this._course = that._printer.createCourse({lineWidth: 2, lineColor: 'rgb(255, 0, 0)', zIndex: 1});
        console.timeEnd('buildCorse');
    }

    setInterval(function() {
        console.time('run');
        var prepopCourse = that._prepopulation.buildCourse();

        var indexes = prepopCourse.map(function(city) {
            return that._cities.indexOf(city);
        });

        that._course.setOrder(indexes);
        console.timeEnd('run');
    }, 2000);

};

module.exports = function(placeholderId) {
    return new PrepopulationScenario(placeholderId);
};