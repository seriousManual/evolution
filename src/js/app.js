window.EVO = {
    tspCombinations: require('./scenarios/tsp/combinations'),
    tspRecombination: require('./scenarios/tsp/recombination'),
    tspPrinter: require('./scenarios/tsp/printer'),
    tspTrivial: require('./scenarios/tsp/trivial'),
    tsp: require('./scenarios/tsp/tsp'),
    tspWebworker: require('./scenarios/tsp/tspWebworker'),

    circles: {
        printer: require('./scenarios/circles/printer')
    }
};