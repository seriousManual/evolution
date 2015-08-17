function City(x, y) {
    this._x = x;
    this._y = y;

    this._ident = String(Math.random() * 1000000000);
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

City.prototype.toString = function() {
    return this._ident;
};

module.exports = City;