/*
 * Object-friendly forEach implementation
 */

function each(obj, iterator, context) {
    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            iterator.call(context, obj[keys[i]], keys[i], obj);
        }
    }
    return obj;
};


/*
 * Type detection and other helpers
 */

function isObject(arg) {
    return ('[object Object]' === Object.prototype.toString.call(arg));
}

function isArray(arg) {
    return Array.isArray(arg);
}

function length(arg) {
    return (isObject(arg) ? Object.keys(arg) : arg).length;
}

function commas(str) {
    str = '' + str;
    return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


/*
 * Helper methods for timer objects
 */

function newTimer() {
    return {
        start: Date.now()
    };
}

function endTimer(timer) {
    timer.end = Date.now();
    timer.delta = timer.end - timer.start;
}


/*
 * Starting and stopping timers by id
 */

function startById(timers, key, id) {

    if (!timers[key]) {
        timers[key] = {};
    }

    if (!isObject(timers[key])) {
        throw new Error('Timer [' + key + '] initialised anonymously then called with an id.');
    }

    if (timers[key][id] && timers[key][id].end) {
        throw new Error('Timer [' + key + '], id [' + id + '] started more than once.');
    }

    timers[key][id] = newTimer();

}

function stopById(timers, key, id) {

    if (!timers[key] || !timers[key][id] || timers[key][id].end) {
        throw new Error('Timer [' + key + '], id [' + id + '] stopped more than once.');
    }

    endTimer(timers[key][id]);

}


/*
 * Starting and stopping timers by index
 */

function startByIndex(timers, key) {

    if (!timers[key]) {
        timers[key] = [];
    }

    if (!isArray(timers[key])) {
        throw new Error('Timer [' + key + '] initialised with an id then called anynomously.');
    }

    if (timers[key].length && timers[key][timers[key].length - 1].end) {
        throw new Error('Timer [' + key + '] started again without being stopped.');
    }

    timers[key].push(newTimer());

}

function stopByIndex(timers, key) {

    if (!timers[key] || !timers[key].length || timers[key][timers[key].length - 1].end) {
        throw new Error('Timer [' + key + '] stopped without being started.');
    }

    endTimer(timers[key][timers[key].length - 1]);

}


/**
 * Timer Class
 */

function Timer() {

    // Ensure a new instance has been created.
    // Calling Timer as a function will return a new instance instead.
    if (!(this instanceof Timer)) {
        return new Timer();
    }

    var timers = {},
        timersById = {};

    this.start = function(key, id) {

        if (id) {
            startById(timers, key, id);
        } else {
            startByIndex(timers, key);
        }

        return this;

    }

    this.stop = function(key, id) {

        if (id) {
            stopById(timers, key, id);
        } else {
            stopByIndex(timers, key);
        }

        return this;

    }

    this.toString = this.inspect = function() {

        var output = [];

        each(timers, function(timer, key) {

            var total = 0,
                str = '*   ' + key + ': ';

            each(timer, function(i) {
                total += i.delta;
            });

            var times = length(timer);

            if (times > 1) {
                str += commas(times) + ' x ' + commas(Math.round(total / times)) + 'ms = ' + commas(total) + 'ms';
            } else {
                str += commas(total) + 'ms';
            }

            output.push(str);

        });

        return output.length ? 'TIMER RESULTS:\n' + output.join('\n') + '\n' : 'NO TIMERS TO OUTPUT';
    }

}

var exports = module.exports = Timer;
