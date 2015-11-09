'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};


// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (record) {
            for (var key in record) {
                if (record.hasOwnProperty(key)) {
                    if (fields.indexOf(key) === -1) {
                        delete record[key];
                    }
                }
            }
            return record;
        });
    };
};

module.exports.filterIn = function (property, values) {
    return function(collection) {
        return collection.filter(function (filterByValues) {
            if (values.indexOf(filterByValues[property]) === -1) {
                return false;
            } else {
                return true;
            }
        });
    };
};

module.exports.format = function (property, func) {
    return function (collection) {
        var changedCollection = collection.map(function (record) {
            record[property] = func(record[property]);
            return record;
        });
        return changedCollection;
    };
};

module.exports.sortBy = function (property, howSort) {
    return function (collection) {
        var changedCollection = collection.sort(function (firstRec, secondRec) {
            return firstRec[property] - secondRec[property];
        });
        return howSort === 'asc' ? changedCollection : changedCollection.reverse();
    };
};

module.exports.filterEqual = function (property, value) {
    return this.filterIn(property, [value]);
};
