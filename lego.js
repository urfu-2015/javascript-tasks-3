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
            entryProps.forEach(function (prop){
                if (propList.has(prop)) {
                    newEntry[prop] = entry[prop];
                }
            });
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
            return a > b;
        }
        if (order === 'desc') {
            return a < b;
        }
    }
    return function (collection) {
        var changedCollection = [].concat(collection);
        var isSorted = false;
        while (!isSorted) {
            isSorted = true;
            for (var i = 0; i < changedCollection.length - 1; i++) {
                var collEntry1 = changedCollection[i];
                var collEntry2 = changedCollection[i+1];
                var property1 = collEntry1[property];
                var property2 = collEntry2[property];
                if (compare(property1, property2)) {
                    var collEntry1Copy = collEntry1;
                    changedCollection.splice(i, 1);
                    changedCollection.splice(i + 1, 0, collEntry1Copy);
                    isSorted = false;
                }
            }
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
    var funcList = Object.assign(arguments);
    return function(collection) {
        var changedCollection = new Set();
        for (var i = 0; i < funcList.length; i++) {
            var func = funcList[i];
            var funcResult = func(collection);
            funcResult.forEach(function (entry) {
                changedCollection.add(entry);
            });
        }
        return changedCollection;
    } 
}

module.exports.and = function () {
    var funcList = Object.assign(arguments);
    return function (collection) {
        var func = funcList[0];
        var funcResult = func(collection);
        var commonEntries = new Set(funcResult);
        for (var i = 1; i < funcList.length; i++) {
            func = funcList[i];
            var funcResult = func(collection);
            commonEntries = funcResult.map(function (entry) {
                if (commonEntries.has(entry)) {
                    return entry;
                }
            });
        }
        return commonEntries;
    }
}
