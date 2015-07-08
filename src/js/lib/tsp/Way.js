var util = require('util');

var Individuum = require('../geneticAlgorithm/Individuum');
var recombinate = require('./lib/recombination');

function Way() {
    Individuum.call(this);

    this._cityOrder = [];
}

util.inherits(Way, Individuum);

Way.prototype.setCityOrder = function(cityOrder) {
    this._cityOrder = cityOrder;

    return this;
};

Way.prototype.getCityOrder = function() {
    return this._cityOrder;
};

Way.prototype.recombinate = function(way) {
    var order1 = this.getCityOrder();
    var order2 = way.getCityOrder();
    var newOrder = recombinate(order1, order2);

    return (new Way()).setCityOrder(newOrder);
};

Way.prototype.mutate = function() {
    var order = this.getCityOrder();

    var index1 = 0;
    var index2 = 0;
    var numberSwaps = 1 + parseInt(Math.random() * 4, 10);
    for (var i = 0; i < numberSwaps; i++) {
        index1 = parseInt(Math.random() * order.length, 10);
        index2 = parseInt(Math.random() * order.length, 10);

        var tempSwap = order[index1];
        order[index1] = order[index2];
        order[index2] = tempSwap;
    }

    this.setCityOrder(order);
};

module.exports = Way;