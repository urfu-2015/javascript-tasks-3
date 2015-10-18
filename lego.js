'use strict';

module.exports.query = function (collection /* операторы через запятую */) {
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
        var changedCollection = collection.slice(0, n);
        return changedCollection;
    }
};

module.exports.select = function () {
    var propertiesList = new Set(arguments);
    return function (collection) {
        var changedCollection = [].concat(collection);
        for (var i = 0; i < changedCollection.length; i++) {
            var collEntry = changedCollection[i];
            var collEntryKeys = Object.keys(collEntry);
            for (var j = 0; j < collEntryKeys.length; j++) {
                var key = collEntryKeys[j];
                if (!propertiesList.has(key)) {
                    delete collEntry[key];
                }
            }
        }
        return changedCollection;
    }
}

module.exports.filterIn = function (property) {
    var propValues = new Set(arguments[1]);
    return function (collection) {
        var changedCollection = [].concat(collection);
        for (var i = 0; i < changedCollection.length; i++) {
            var collEntry = changedCollection[i];
            if (!propValues.has(collEntry[property])) {
                changedCollection.splice(i, 1);
                i -= 1;
            }
        }
        return changedCollection;
    }
}

module.exports.filterEqual = function (property, propValue) {
    return function (collection) {
        var changedCollection = [].concat(collection);
        for (var i = 0; i < changedCollection.length; i++) {
            var collEntry = changedCollection[i];
            if (collEntry[property] != propValue) {
                changedCollection.splice(i, 1);
                i -= 1;
            }
        }
        return changedCollection;
    }
}

module.exports.sortBy = function (property, order) {
    if (order === 'asc') {
        var compare = function (a, b) {
            return a > b;
        } 
    }
    else {
        if (order === 'desc') {
            var compare = function (a, b) {
                return a < b;
            } 
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
            return entry;
        });
    return changedCollection;
    }
}
