function ExpSmooth(rate) {
    this._rate = rate;
    this._currentValue = null;
}

ExpSmooth.prototype.update = function (value) {
    if (this._currentValue === null) {
        this._currentValue = value;
    } else {
        this._currentValue = this._currentValue * (1 - this._rate) + value * this._rate;
    }
};

ExpSmooth.prototype.getValue = function () {
    return this._currentValue;
};

module.exports = ExpSmooth;