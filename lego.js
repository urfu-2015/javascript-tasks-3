'use strict';

module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        n = n < 0 ? 0 : n;
        var changedCollection = collection.slice(0, n);
        return changedCollection;
    }
};

module.exports.select = function () {
    var propList = new Set(arguments);
    return function (collection) {
        var changedCollection = collection.map(function (entry){
            var newEntry = {};
            var entryProps = Object.keys(entry);
            entryProps.reduce(function (previousProp, currentProp){
                if (propList.has(currentProp)) {
                    newEntry[currentProp] = entry[currentProp];
                }
            }, 0);
            return newEntry;
        });
        return changedCollection;
    }
}

module.exports.filterIn = function (property, propValues) {
    propValues = new Set(propValues);
    return function (collection) {
        var changedCollection = collection.filter(function (entry){
            var propValue = entry[property];
            if (propValues.has(propValue)) {
                return true;
            }
            return false;
        });
        return changedCollection;
    }
}

module.exports.filterEqual = function (property, propValue) {
    return function (collection) {
        var changedCollection = collection.filter(function (entry) {
            if (entry[property] === propValue) {
                return true;
            }
            return false;
        });
        return changedCollection;
    }
}

module.exports.sortBy = function (property, order) {
    var compare = function (a, b) {
        if (order === 'asc') {
            return a - b;
        }
        if (order === 'desc') {
            return b - a;
        }
    }
    return function (collection) {
        var changedCollection = [].concat(collection);
        var isSorted = false;
        while (!isSorted) {
            changedCollection.sort(function (a, b) {
                isSorted = true;
                var comparison = compare(a[property], b[property]);
                if (comparison > 0) {
                    isSorted = false;
                }
                return comparison;
            });
        }
    return changedCollection;
    }
}

module.exports.format = function (property, _function) {
    return function (collection) {
        var changedCollection = [].concat(collection);
        changedCollection.forEach(function (entry){
            entry[property] = _function(entry[property]);
        });
    return changedCollection;
    }
}

module.exports.or = function () {
    var funcList = arguments;
    return function(collection) {
        var changedCollection = [];
        for (var i = 0; i < funcList.length; i++) {
            var func = funcList[i];
            var funcResult = func(collection);
            changedCollection = changedCollection.concat(funcResult);
        }
        return changedCollection;
    }
}

module.exports.and = function () {
    var funcList = arguments;
    return function (collection) {
        var changedCollection = [].concat(collection);
        for (var i = 0; i < funcList.length; i++) {
            var func = funcList[i];
            changedCollection = func(changedCollection);
        }
        return changedCollection;
    }
}
