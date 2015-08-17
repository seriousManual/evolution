var City = require('../City');

function Prepopulation() {
    this._citiesLookup = {};
    this._cities = [];
    this._table = null;
}

Prepopulation.prototype.addCity = function(city) {
    this._cities.push(city);
    this._citiesLookup[city] = city;

    this._table = null;
};

Prepopulation.prototype._buildTable = function() {
    if (this._table) {
        return;
    }
    console.time('buildTable');
    this._table = {};

    for (var i = 0; i < this._cities.length; i++) {
        var city1 = this._cities[i];

        this._table[city1] = this._cities
            .map(function(city2) {
                var distance = Math.sqrt(Math.pow(city1.getX() - city2.getX(), 2) + Math.pow(city1.getY() - city2.getY(), 2));

                return [city2, distance];
            })
            .sort(function(a, b) {
                if (a[1] == b[1]) return 0;

                return a[1] < b[1] ? -1 : 1;
            })
            .filter(function(entity) {
                return entity[1] > 0;
            })
            .map(function(entity) {
                return entity[0];
            });
    }
    console.log(this._table);
    console.timeEnd('buildTable');
};

Prepopulation.prototype._pickRandomCityFromList = function(cityList, excludeList) {
    for(var i = 0; i < 10; i++) {
        var res = cityList[parseInt(Math.random() * Math.random() * Math.random(), 10)];
        if (excludeList.indexOf(res) == -1) {
            return res;
        }
    }

    return null;
};

Prepopulation.prototype._pickRandomCity = function(excludeList) {
    while (true) {
        var choosen = this._cities[parseInt(Math.random() * this._cities.length, 10)];
        if (!excludeList[choosen]) {
            return choosen;
        }
    }
};

Prepopulation.prototype.buildCourse = function() {
    this._buildTable();

    var result = [];
    var globalExcludeList = {};
    var currentCity = this._cities[parseInt(Math.random() * this._cities.length, 10)];

    globalExcludeList[currentCity] = true;
    result.push(currentCity);

    do {
        var localExcludeList = [];
        var neighbours = this._table[currentCity];
        var choosen = null;
        for (var i = 0; i < 3; i++) {
            choosen = this._pickRandomCityFromList(neighbours, localExcludeList);
            if (!globalExcludeList[choosen] && choosen !== null) {
                break;
            }

            localExcludeList.push(choosen);
        }

        if (!choosen) {
            choosen = this._pickRandomCity(globalExcludeList);
        }

        globalExcludeList[choosen] = true;
        result.push(choosen);

        currentCity = choosen;
    } while(result.length < this._cities.length);

    return result;
};

module.exports = Prepopulation;