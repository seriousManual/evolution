var shuffle = require('./lib/shuffle');

module.exports = function (self) {
    self.addEventListener('message', function (ev) {
        var list = ev.data;

        var res = list;

        res = shuffle(res);

        setTimeout(function () {
            self.postMessage({drugs: 'foo'});
        }, 1000);

    });
};