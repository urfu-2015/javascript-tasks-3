'use strict';

module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = copyCollection(collection);
    for (var i = 1; i < arguments.length; i++) {
        changedCollection = (arguments[i])(changedCollection);
    }

    return changedCollection;
};

module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

module.exports.select = function () {
    var fields = [];
    for (var i = 0; i < arguments.length; i++) {
        fields[i] = arguments[i];
    }
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var changedRecord = {};
            var record = collection[i];
            for (var j = 0; j < fields.length; j++) {
                changedRecord[fields[j]] = record[fields[j]];
            }
            changedCollection[i] = changedRecord;
        }
        return changedCollection;
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var isMatching = false;
            for (var j = 0; j < values.length; j++) {
                if (collection[i][field] === values[j]) {
                    isMatching = true;
                    break;
                }
            }
            if (isMatching) {
                changedCollection.push(copyRecord(collection[i]));
            }
        }
        return changedCollection;
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        var values = [];
        values.push(value);
        var filterEq = module.exports.filterIn(field, values);
        return filterEq(collection);
    };
};

module.exports.sortBy = function (field, order) {
    return function (collection) {
        var changedCollection = copyCollection(collection);
        changedCollection.sort(compareRecords(field, order));
        return changedCollection;
    };
};

module.exports.format = function (field, modifyingFunction) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            changedCollection[i] = copyRecord(collection[i]);
            changedCollection[i][field] =
                modifyingFunction(changedCollection[i][field]);
        }
        return changedCollection;
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < n; i++) {
            if (collection[i] === undefined) {
                break;
            }
            changedCollection[i] = copyRecord(collection[i]);
        }
        return changedCollection;
    };
};

function copyRecord(record) {
    var copy = {};
    var keys = Object.keys(record);
    for (var i = 0; i < keys.length; i++) {
        copy[keys[i]] = record[keys[i]];
    }
    return copy;
}

function copyCollection(collection) {
    var copy = [];
    for (var i = 0; i < collection.length; i++) {
        copy[i] = copyRecord(collection[i]);
    }
    return copy;
}

function compareRecords(field, order) {
    return function (a, b) {
        var sign = (order === 'asc') ? 1 : -1;
        if (a[field] < b[field]) {
            return -1 * sign;
        }
        if (a[field] > b[field]) {
            return 1 * sign;
        }
        return 0;
    };
}

module.exports.or = function (query1, query2) {
    return function (collection) {
        var collection1 = copyCollection(collection);
        collection1 = query1(collection1);
        var collection2 = copyCollection(collection);
        collection2 = query2(collection2);
        var changedCollection = collection1;
        for (var i = 0; i < collection2.length; i++) {
            if (!recordInCollection(collection2[i], changedCollection)) {
                changedCollection.push(collection2[i]);
            }
        }
        return changedCollection;
    };
}

module.exports.and = function (query1, query2) {
    return function (collection) {
        var collection1 = copyCollection(collection);
        collection1 = query1(collection1);
        var collection2 = copyCollection(collection);
        collection2 = query2(collection2);
        var changedCollection = [];
        for (var i = 0; i < collection2.length; i++) {
            if (recordInCollection(collection2[i], collection1)) {
                changedCollection.push(collection2[i]);
            }
        }
        return changedCollection;
    };
}

function recordInCollection(record, collection) {
    for (var i = 0; i < collection.length; i++) {
        if (recordsEqual(record, collection[i])) {
            return true;
        }
    }
    return false;
}

function recordsEqual(record1, record2) {
    var keys1 = Object.keys(record1);
    var keys2 = Object.keys(record2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (var i = 0; i < keys1.length; i++) {
        if (keys1[i] !== keys2[i]) {
            return false;
        }
    }
    for (i = 0; i < keys1.length; i++) {
        if (record1[keys1[i]] !== record2[keys1[i]]) {
            return false;
        }
    }
    return true;
}
