var TspPrinter = require('./../lib/tsp/lib/Printer');
var City = require('./../lib/tsp/lib/City');

var shuffle = require('./../lib/shuffle');

function tspPrinter(placeholderId) {
    var printer = new TspPrinter(placeholderId);

    var cities = [
        new City(147, 391),
        new City(257, 170),
        new City(347, 157),
        new City(158, 197),
        new City(69, 62),
        new City(16, 12),
        new City(95, 154),
        new City(244, 390),
        new City(313, 34),
        new City(221, 23),
        new City(286, 108),
        new City(173, 277),
        new City(263, 267)
    ];

    cities = shuffle(cities);

    cities.forEach(function (city) {
        printer.addCity(city);
    });

    var course1 = printer.createCourse({
        lineWidth: 2, lineColor: 'rgb(255, 0, 0)', zIndex: 5
    });
    var course2 = printer.createCourse({
        lineWidth: 8, lineColor: 'rgb(40, 40, 40)', zIndex: 1
    });

    var variation = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    setInterval(function () {
        course1.setOrder(shuffle(variation));
        course2.setOrder(shuffle(variation));
    }, 1000);
}

module.exports = tspPrinter;