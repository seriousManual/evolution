var createCombinations = require('./lib/tsp/combinations');

module.exports = {
    create: function(input, update, finished) {
        var iterator = createCombinations(input);
        var handle;

        return {
            run: function() {
                handle = setInterval(function() {
                    var next = iterator.next();
                    if (next.done) {
                        clearInterval(handle);
                        finished();
                    } else {
                        update(next.value);
                    }
                }, 100);
            },

            stop: function() {
                clearInterval(handle);
            }
        }
    }
};