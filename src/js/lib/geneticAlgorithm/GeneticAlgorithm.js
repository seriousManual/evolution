var util = require('util');
var Emitter = require('events').EventEmitter;

var Sampler = require('../Sampler');

function GeneticAlgorithm(options) {
    var that = this;
    options = options || {};

    Emitter.call(this);

    this._population = null;
    this._interval = options.interval || 1000;
    this._intervalHandle = null;
    this._numberRuns = 0;
    this._sampler = new Sampler();

    this._sampler.on('rate', function (rate) {
        that.emit('rate', rate);
    });
}

util.inherits(GeneticAlgorithm, Emitter);

GeneticAlgorithm.prototype._createPopulation = function () {
    throw new Error('_createPopulation not implemented');
};

GeneticAlgorithm.prototype.getPopulation = function () {
    if (this._population == null) {
        this._population = this._createPopulation();
    }

    return this._population;
};

GeneticAlgorithm.prototype.termCriterium = function () {
    var poplation = this.getPopulation();
    var individuums = poplation.getIndividuums();
    var cnt = poplation.getSize() * 0.8;
    var maxFitness = poplation.maxFitness();

    //var a = individuums.reduce(function(carry, i) {
    //    if (!carry[i.getFitness()]) carry[i.getFitness()] = 0;
    //
    //    carry[i.getFitness()]++;
    //    return carry;
    //}, {});
    //
    //Object.keys(a).forEach(function(key) {
    //    console.log(key, a[key]);
    //});
    //
    //console.log('---------');

    for (var i = 0; i < cnt; i++) {
        var individuum = individuums[i];
        if (individuum.getFitness() !== maxFitness) {
            return false;
        }
    }

    return true;
};

GeneticAlgorithm.prototype.chooseParents = function () {
    var population = this.getPopulation();

    var c1 = parseInt(Math.random() * Math.random() * population.getSize(), 10);
    var c2 = null;
    do {
        c2 = parseInt(Math.random() * Math.random() * population.getSize(), 10);
    } while (c1 == c2);

    return [population.getByIndex(c1), population.getByIndex(c2)];
};

GeneticAlgorithm.prototype.calculateFitness = function () {
    throw new Error('calculateFitness not implemented');
};

GeneticAlgorithm.prototype.run = function () {
    if (this._interval == 'fast') {
        this._runFast();
    } else {
        this._runByInterval();
    }
};

GeneticAlgorithm.prototype._runByInterval = function () {
    this._intervalHandle = setInterval(this._step.bind(this), this._interval);
    this._step();
};

GeneticAlgorithm.prototype._runFast = function () {
    while (true) {
        if (!this._step()) {
            return;
        }
    }
};

GeneticAlgorithm.prototype._step = function () {
    var population = this.getPopulation();

    this._numberRuns++;
    this._sampler.sample();

    var parents = this.chooseParents();
    var bestIndividuum = population.getFirst();

    var child = parents[0].recombinate(parents[1]);
    child.mutate();
    child.setFitness(this.calculateFitness(child));

    this.emit('childCheck', child);

    if (population.fitsIn(child)) {
        population.replaceLastIndividuum(child);
    }

    if (population.getFirst() !== bestIndividuum) {
        this.emit('newOptimum', population.getFirst());
    }

    if (this.termCriterium()) {
        this._terminate();
        return false;
    }

    return true;
};

GeneticAlgorithm.prototype._terminate = function () {
    if (this._intervalHandle) {
        clearInterval(this._intervalHandle);
    }

    this._sampler.stop();
    this.emit('terminated', this.getPopulation());
};

module.exports = GeneticAlgorithm;