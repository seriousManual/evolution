module.exports = function recombination(a, b) {
    var tmp = [];

    var log = {};
    var lookup = {};
    for (var i = 0; i < a.length; i++) {
        lookup[a[i]] = i;
    }

    var fContinue = true;
    var index = 0;
    while (fContinue) {
        tmp[index] = a[index];
        log[a[index]] = true;

        index = lookup[b[index]];
        if (log[a[index]] !== undefined) {
            fContinue = false;
        }
    }

    for (var i = 0; i < a.length; i++) {
        if (tmp[i] === undefined) {
            tmp[i] = b[i];
        }
    }

    return tmp;
};