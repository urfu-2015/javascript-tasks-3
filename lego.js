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

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        var limitCollection = collection.slice(0, n);
        return limitCollection;
    }
};

module.exports.select = function() {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (item) {
            for (var key in item) {
                if (fields.indexOf(key) === -1) {
                    delete item[key];
                    }
                }
            return item;
            });
        };
};

module.exports.filterIn = function (field, values) {
    var valuesLength = values.length;
    return function (collection) {
        return collection.filter(function (item) {
            for (var i = 0; i < valuesLength; i++) {
                if (item[field] == values[i])
                    return true;
            }
            return false;
        })
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (item) {
            if (item[field] === value)
                return true;
            return false;
        });
    };
};

module.exports.sortBy = function (field, typeSort) {
    return function (collection) {
        var sortedCollection = collection.sort(function (a, b) {
            return a[field] - b[field];
            });
        return typeSort === 'asc' ? sortedCollection : sortedCollection.reverse();
        };
    };

module.exports.format = function (field, format) {
    return function (collection) {
        var formatedCollection = collection.map(function (item) {
            item[field] = format(item[field]);
            return item;
            });
        return formatedCollection;
        };
};

module.exports.or = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var resultOr = [];
        for (var i = 0; i < fields.length; i++) {
            var resultField = fields[i](collection);
            for (var item in resultField)
                if (resultOr.indexOf(resultField[item]) == -1)
                    resultOr.push(resultField[item]);
            return resultOr;
        }
    };
};

module.exports.and = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var resultCollection = [];
        for (var i = 0; i < fields.length; i++) {
            resultCollection = fields[i](resultCollection);
        }
        return resultCollection;
    };
};

