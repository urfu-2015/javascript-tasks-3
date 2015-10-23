'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var resultCollection = collection;
    for (var i = 1; i < arguments.length; i++) {
        resultCollection = arguments[i](resultCollection);
    }
    return resultCollection;
};

module.exports.select = function () {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    args.join();
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var newObj = {};
            for (var prop in collection[i]) {
                if (args.indexOf(prop.toString()) !== -1) {
                    newObj[prop] = collection[i][prop];
                }
            }
            changedCollection.push(newObj);
        }
        return changedCollection;
    };
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {

        // Возращаем изменённую коллекцию
        return collection.reverse();
    };
};

module.exports.filterIn = function (propName, variants) {
    return function (collection) {
        variants = variants.join();
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (variants.indexOf(collection[i][propName]) !== -1) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
};


module.exports.sortBy = function (param, order) {
    return function (collection) {
        order = !order || order === 'asc' ? true : false;
        return collection.sort(function (a, b) {
            if (a[param] < b[param]) {
                return order ? -1 : 1;
            }
            if (a[param] > b[param]) {
                return order ? 1 : -1;
            }
            return 0;
        });
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        var len = collection.length;
        return collection.slice(0, Math.max(n % len, 0));
    };
    // Магия
};

module.exports.format = function (property, func) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var newObj = {};
            for (var key in collection[i]) {
                newObj[key] = key === property ?
                    func(collection[i][key]) : collection[i][key];
            }
            changedCollection.push(newObj);
        }
        return changedCollection;
    };
    // Магия
};

module.exports.filterEqual = function (param, value) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i][param] === value) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
module.exports.and = function () {
    var functions = arguments;
    return function (collection) {
        var newCollection = collection;
        for (var i = 0; i < functions.length; i++) {
            newCollection = functions[i](newCollection);
        }
        return newCollection;
    };
};

module.exports.or = function () {
    var functions = arguments;
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < functions.length; i++) {
            var funcResult = functions[i](collection);
            for (var j = 0; j < funcResult.length; j++) {
                addElem(newCollection, funcResult[j]);
            }
        }
        return newCollection;
    };
};

function inArgs(args, prop) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] === prop) {
            return true;
        }
    }
    return false;
}

function addElem(collection, elem) {
    for (var i = 0; i < collection.length; i++) {
        var eq = true;
        for (var prop in collection[i]) {
            if (elem[prop] !== collection[i][prop]) {
                eq = false;
            }
        }
        if (eq) {
            return;
        }
    }
    collection.push(elem);
}
