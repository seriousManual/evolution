var util = require('util');
var Emitter = require('events').EventEmitter;

var ExpSmooth = require('./ExpSmooth');

function Sampler(interval) {
    var that = this;

    Emitter.call(this);

    this._count = 0;
    this._lastExecution = Date.now();
    this._expSmooth = new ExpSmooth(0.7);

    setInterval(function() {
        that._measure();
    }, interval || 1000);
}

util.inherits(Sampler, Emitter);

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

    this.emit('rate', this.getRate());
};

module.exports = Sampler;