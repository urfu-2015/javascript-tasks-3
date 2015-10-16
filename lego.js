'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var newCollection = module.exports.select('*')(collection); // *- все поля,
    //  просто копируем, чтобы не испортить исходник
    for (var i = 1; i < arguments.length; i++) {
        newCollection = arguments[i](newCollection);
    };
    console.log(newCollection);
    return newCollection;
};

module.exports.or = function () {
    var args = arguments;
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < args.length; i++) {
            var sourceCollection = module.exports.select('*')(collection);
            var tempResult = args[i](sourceCollection);
            newCollection = newCollection.concat(tempResult);
        }
        return newCollection;
    };
};

module.exports.and = function () {
    var args = arguments;
    return function (collection) {
        var newCollection = module.exports.select('*')(collection);
        for (var i = 0; i < args.length; i++) {
            var sourceCollection = module.exports.select('*')(collection);
            var tempResult = args[i](sourceCollection);
            newCollection = intersecArrays(newCollection, tempResult);
        };
        return newCollection;
    };
};

function intersecArrays(first, second) {
    var result = [];
    for (var i = 0; i < first.length; i++) {
        for (var j = 0; j < second.length; j++) {
            if (isEqual(first[i], second[j])) {
                result.push(first[i]);
            }
        };
    };
    return result;
};

function isEqual(first, second) {
    for (var e in first) {
        if (e in second) {
            if (first[e] != second[e]) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
};
// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

module.exports.select = function () {
    var args = arguments;
    return function (collection) {
        var values = [];
        for (var e in args) {
            values.push(args[e]);
        }
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            newCollection.push({});
            for (var e in collection[i]) {
                if (values.indexOf(e) != -1 || values[0] == '*') {
                    newCollection[i][e] = collection[i][e];
                }
            };
        };
        return newCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < Math.min(n, collection.length); i++) {
            newCollection.push(collection[i]);
        }
        return newCollection;
    };
};

module.exports.filterIn = function (field, valid) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            for (var e in collection[i]) {
                if (e == field && valid.indexOf(collection[i][e]) != -1) {
                    newCollection.push(collection[i]);
                }
            }
        }
        return newCollection;
    };
};


module.exports.filterEqual = function (field, value) {
    return module.exports.filterIn(field, [value]);
};

module.exports.sortBy = function (field, rule) {
    return function (collection) {
        var newCollection = collection.sort((a, b) => a[field] > b[field] ? 1 :
            a[field] < b[field] ? -1 : 0);
        if (rule === 'desc') {
            return newCollection.reverse();
        };
        return newCollection;
    };
};

module.exports.format = function (field, fun) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            for (var e in collection[i]) {
                if (e === field) {
                    collection[i][e] = fun(collection[i][e]);
                }
            }
        };
        return collection;
    };
};
