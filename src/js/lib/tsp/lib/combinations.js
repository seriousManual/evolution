module.exports = function* createCombinations(input) {
    if (input.length == 1) {
        yield input;
        return;
    }

    for (var i = 0; i < input.length; i++) {
        var tail = input.concat([]);
        var head = input[i];
        tail.splice(i, 1);

        for (var combination of createCombinations(tail)) {
            yield [head].concat(combination);
        }
    }
};