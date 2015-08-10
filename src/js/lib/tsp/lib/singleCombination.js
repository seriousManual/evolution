function singleCombination(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        for (var x = i+1; x < arr.length; x++) {
            result.push([arr[i], arr[x]]);
        }
    }

    return result;
}

module.exports = singleCombination;