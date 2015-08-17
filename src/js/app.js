window.EVO = {
    tsp: {
        tspCombinations: require('./scenarios/tsp/combinations'),
        tspRecombination: require('./scenarios/tsp/recombination'),
        tspPrinter: require('./scenarios/tsp/printer'),
        tspTrivial: require('./scenarios/tsp/trivial'),
        tsp: require('./scenarios/tsp/tsp'),
        tspWebworker: require('./scenarios/tsp/tspWebworker'),
        prepopulation: require('./scenarios/tsp/prepop')
    },

    circles: {
        printer: require('./scenarios/circles/printer'),
        circles: require('./scenarios/circles/circles'),
        trivial: require('./scenarios/circles/trivial')
    },

    circleWorld: {
        Circle: require('./lib/circleworld/Circle'),
        Printer: require('./lib/circleworld/Printer'),
        circleWorld: require('./scenarios/circleworld/circleworld')
    }
};