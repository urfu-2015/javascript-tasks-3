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
        var changedCollection = collection.slice(0, n);
        console.log(changedCollection);
        return changedCollection;
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (record) {
            for (var key in record) {
                if (fields.indexOf(key) === -1) {
                    delete record[key];
                }
            }
            return record;
        });
    };
};

module.exports.filterIn = function (property, values) {
    return function (collection) {
        var changedCollection = collection.filter(function (filterByValues) {
            for (var i = 0; i < values.length; i++) {
                if (filterByValues[property] === values[i]) {
                    return true;
                    break;
                }
            }
            return false;
        });
        return changedCollection;
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
            return [firstRec[property],secondRec[property]];
        });
        return (howSort === 'asc') ? changedCollection : changedCollection.reverse();
    };
};

module.exports.filterEqual = function (property, value) {
    filterIn(property, [value]);
};
