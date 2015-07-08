function Population() {
    this._individuums = [];
}

Population.prototype.getIndividuums = function() {
    return this._individuums;
};

Population.prototype.addIndividuum = function(individuum) {
    this._individuums.push(individuum);
    this.sort();
};

Population.prototype.replaceIndividuum = function(index, individuum) {
    this._individuums[index] = individuum;
    this.sort();
};

Population.prototype.replaceLastIndividuum = function(individuum) {
    this.replaceIndividuum(this.getSize() - 1, individuum);
};

Population.prototype.getSize = function() {
    return this._individuums.length;
};

Population.prototype.getByIndex = function(index) {
    if (this._individuums[index]) {
        return this._individuums[index];
    }

    return null;
};

Population.prototype.getFirst = function() {
    return this.getByIndex(0);
};

Population.prototype.getLast = function() {
    return this.getByIndex(this.getSize() - 1);
};

Population.prototype.sort = function() {
    var that = this;

    this._individuums.sort(function(a, b) {
        return that.fitnessCompare(a, b) === a ? -1 : 1;
    });
};

Population.prototype.fitnessCompare = function(a, b) {
    return a.getFitness() > b.getFitness() ? a : b;
};

Population.prototype.fitsIn = function(child) {
    return this.fitnessCompare(child, this.getLast()) === child;
};

Population.prototype.maxFitness = function() {
    return this.getFirst().getFitness();
};

Population.prototype.minFitness = function() {
    return this.getLast().getFitness();
};

module.exports = Population;