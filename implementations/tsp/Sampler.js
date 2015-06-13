function Sampler() {
    var that = this;

    this._count = 0;
    this._lastExecution = Date.now();
    this._expSmooth = new ExpSmooth(0.9);

    setInterval(function() {
        that._measure();
    }, 100);
}

Sampler.prototype.sample = function(value) {
    if (value) {
        this._count += value;
    } else {
        this._count++;
    }
};

Sampler.prototype.getRate = function() {
    return this._expSmooth.getValue();
};

Sampler.prototype._measure = function() {
    var now = Date.now();
    var elapsedTime = (now - this._lastExecution) / 1000;
    var samplePerSecond = this._count / elapsedTime;

    this._expSmooth.update(samplePerSecond);

    this._lastExecution = now;
    this._count = 0;
};

function ExpSmooth(rate) {
    this._rate = rate;
    this._currentValue = null;
}

ExpSmooth.prototype.update = function(value) {
    if (this._currentValue === null) {
        this._currentValue = value;
    } else {
        this._currentValue = this._currentValue * (1 - this._rate) + value * this._rate;
    }
};

ExpSmooth.prototype.getValue = function() {
    return this._currentValue;
};