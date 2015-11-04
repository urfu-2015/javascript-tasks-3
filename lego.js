'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var functions = 1; functions < arguments.length; functions++) {
        collection = arguments[functions](collection);
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        // Возращаем изменённую коллекцию
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n > collection.length) {
            n = collection.length;
        }
        if (n < 0) {
            return [];
        }
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = arguments;
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var newField = {};
            for (var j = 0; j < fields.length; j++) {
                console.log(fields[j]);
                if (collection[i][fields[j]] !== undefined) {
                    newField[fields[j]] = collection[i][fields[j]];
                }
            }
            newCollection.push(newField);
        }
        return newCollection;
    };
};

module.exports.filterIn = function (field, criteria) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            for (var j = 0; j < criteria.length; j++) {
                if (collection[i][field] == criteria[j]) {
                    newCollection.push(collection[i]);
                }
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (field, criterion) {
    return module.exports.filterIn(field, criterion);
};

module.exports.sortBy = function (field, criterion) {
    var sorter = function (i, j) {
        return criterion === "asc" ? i < j : i > j;
    } 
    return function (collection) {
        return collection.sort(sorter);
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        for (var contact = 0; contact < collection.length; contact++) {
            collection[contact][field] = func(collection[contact][field]);
        }
        return collection;
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
