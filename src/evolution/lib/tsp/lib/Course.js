function TspCourse(onUpdate) {
    this._cities = [];
    this._order = [];
    this._onUpdate = onUpdate;
}

TspCourse.prototype.addCity = function (city) {
    this._cities.push(city);
};

TspCourse.prototype.setOrder = function (order) {
    var that = this;

    this._order = order.reduce(function(carry, index) {
        carry.push(that._cities[index]);
        return carry;
    }, []);

    this._onUpdate();
};

TspCourse.prototype.getOrder = function() {
    return this._order;
};

TspCourse.prototype.getLength = function () {
    var previousCity = this._order[this._order.length - 1];
    return this._order.reduce(function (sum, city) {
        sum += previousCity.distance(city);
        previousCity = city;

        return sum;
    }, 0);
};

module.exports = TspCourse;