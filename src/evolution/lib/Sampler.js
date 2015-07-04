var ExpSmooth = require('./ExpSmooth');

function Sampler() {
    var that = this;

    this._count = 0;
    this._lastExecution = Date.now();
    this._expSmooth = new ExpSmooth(0.9);
    this._onUpdate = function() {};

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
    this._onUpdate(this.getRate());
};

Sampler.prototype.onUpdate = function(handler) {
    this._onUpdate = handler;
};

module.exports = Sampler;