function Individuum() {
    this._fitness = Infinity;
}

Individuum.prototype.mutate = function () {
    throw new Error('mutate not implemented');
};

Individuum.prototype.recombinate = function () {
    throw new Error('recombinate not implemented');
};

Individuum.prototype.getFitness = function () {
    return this._fitness;
};

Individuum.prototype.setFitness = function (fitness) {
    this._fitness = fitness;

    return this;
};

module.exports = Individuum;