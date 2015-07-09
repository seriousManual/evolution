var work = require('webworkify');

window.EVO = {
    tspCombinations: require('./scenarios/tspCombinations'),
    tspRecombination: require('./scenarios/tspRecombination'),
    tspPrinter: require('./scenarios/tspPrinter'),
    tspTrivial: require('./scenarios/tspTrivial'),
    tsp: require('./scenarios/tsp')
};

var w = work(require('./workerTest'));

var a = [1,2,3,4,5,6,7];

w.addEventListener('message', function (message) {
    var stuff = message.data;
    console.log(stuff);
    console.log('shuffled stuff: ', stuff[0], stuff[1]);

    send();
});

send();

function send() {
    console.log('sending');
    w.postMessage(a);
}

