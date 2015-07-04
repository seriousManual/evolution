var shuffle = require('./lib/shuffle');
var tspRecombination = require('./lib/tsp/recombination');

module.exports = function (input1, input2) {
    console.time('shuffle1');
    shuffle(input1);
    console.timeEnd('shuffle1');

    console.time('shuffle2');
    shuffle(input2);
    console.timeEnd('shuffle2');


    console.time('timeMutation');
    var recombination = tspRecombination(input1, input2);
    console.timeEnd('timeMutation');

    console.log(recombination);
};