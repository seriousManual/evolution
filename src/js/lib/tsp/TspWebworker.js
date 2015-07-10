var TspAlgorithm = require('./Tsp');

module.exports = function (self) {
    var algorithm;

    self.addEventListener('message', function (event) {
        var data = event.data;
        var type = data.type;
        var payload = data.payload;

        if (type === 'init') {
            algorithm = new TspAlgorithm(payload.options);

            payload.cities.forEach(function (city) {
                algorithm.addCity(city.x, city.y);
            });

            algorithm.on('newOptimum', function (child) {
                self.postMessage({
                    type: 'newOptimum',
                    payload: child.getCityOrder()
                });
            });

            algorithm.on('rate', function (rate) {
                self.postMessage({
                    type: 'rate',
                    payload: rate
                });
            });

            algorithm.on('terminated', function () {
                self.postMessage({
                    type: 'terminated'
                });
            });

            algorithm.run();
        }
    });
};