var util = require('util');
var Emitter = require('events').EventEmitter;

var Sampler = require('../Sampler');

var MARKER_FAST = 'fast';

function GeneticAlgorithm (options) {
    var that = this;
    options = options || {};

    Emitter.call(this);

    this._population = null;
    this._interval = options.interval || 1000;
    this._intervalHandle = null;
    this._numberRuns = 0;

    this._samplerCount = new Sampler();
    this._samplerHit = new Sampler();
    this._samplerMiss = new Sampler();

    this._samplerCount.on('rate', function (rate) {
        that.emit('rate', rate);
    });

    this._samplerHit.on('rate', function (rate) {
        that.emit('hitRate', rate);
    });

    this._samplerMiss.on('rate', function (rate) {
        that.emit('missRate', rate);
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
    if (this._interval == MARKER_FAST) {
        this._runFast();
    } else {
        this._runByInterval();
    }
};

GeneticAlgorithm.prototype.evaluatePopulation = function () {
    var that = this;

    this._population.getIndividuums().forEach(function (individuum) {
        individuum.setFitness(that.calculateFitness(individuum));
    });

    this._population.sort();
};

GeneticAlgorithm.prototype._runByInterval = function () {
    if (this._intervalHandle) {
        clearInterval(this._intervalHandle);
    }

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
    this._samplerCount.sample();

    var parents = this.chooseParents();
    var bestIndividuum = population.getFirst();

    var child = parents[0].recombinate(parents[1]);
    child.mutate();
    child.setFitness(this.calculateFitness(child));

    this.emit('childCheck', child, parents[0], parents[1]);

    if (population.fitsIn(child)) {
        population.replaceLastIndividuum(child);
        this._samplerHit.sample();
        this.emit('populationImprovement', population);
    } else {
        this._samplerMiss.sample();
    }

    if (population.getFirst() !== bestIndividuum) {
        this.emit('newOptimum', population.getFirst());
    }

    if (this.termCriterium()) {
        this.terminate();
        return false;
    }

    return true;
};

GeneticAlgorithm.prototype.terminate = function () {
    if (this._intervalHandle) {
        clearInterval(this._intervalHandle);
    }

    this._samplerCount.stop();
    this._samplerHit.stop();
    this._samplerMiss.stop();

    this.emit('terminated', this.getPopulation());
};

GeneticAlgorithm.prototype.setInterval = function (interval) {
    if (this._interval == MARKER_FAST) {
        return;
    }

    this._interval = interval;
    this._runByInterval();
};

module.exports = GeneticAlgorithm;