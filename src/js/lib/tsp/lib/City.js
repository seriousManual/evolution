function City(x, y) {
    this._x = x;
    this._y = y;
}

City.prototype.getX = function () {
    return this._x;
};

City.prototype.getY = function () {
    return this._y;
};

City.prototype.distance = function (city) {
    return Math.sqrt(Math.pow(city.getX() - this.getX(), 2) + Math.pow(city.getY() - this.getY(), 2));
};

module.exports = City;