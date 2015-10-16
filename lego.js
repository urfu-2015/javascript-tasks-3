'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var resultCollection = collection;
    for (var i = 1; i < arguments.length; i++) {
        resultCollection = arguments[i](resultCollection);
    }
    return resultCollection;
};

function inArgs(args, prop) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] === prop) {
            return true;
        }
    }
    return false;
}

module.exports.select = function () {
    var args = arguments;
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var newObj = {};
            for (var prop in collection[i]) {
                if (inArgs(args, prop)) {
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

function isInVariant(field, args, person) {
    var argsString = args.join();
    for (var param in person) {
        if (param === field) {
            if (argsString.indexOf(person[param]) != -1) {
                return true;
            }
        }
    }
    return false;
}

module.exports.filterIn = function () {
    var args = arguments;
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (isInVariant(args[0], args[1], collection[i])) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
};


module.exports.sortBy = function (param, order) {
    return function (collection) {
        collection.sort(function (a, b) {
            if (a[param] < b[param]) {
                return -1;
            }
            if (a[param] > b[param]) {
                return 1;
            }
            return 0;
        });
        return order === 'asc' ? collection : collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
    // Магия
};

module.exports.format = function (property, func) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var newObj = {};
            for (var key in collection[i]) {
                if (key === property) {
                    newObj[key] = func(collection[i][key]);
                } else {
                    newObj[key] = collection[i][key];
                }
            }
            changedCollection.push(newObj);
        }
        return changedCollection;
    };
    // Магия
};



module.exports.filterEqual = function (pararmetr, value) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i][pararmetr] === value) {
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

function addElem(collection, dict, elem) {
    var str = [elem['age'], elem['gender'], elem['name'],
        elem['email'], elem['phone'], elem['favoriteFruit']].join();
    if (dict[str] === undefined) {
        collection.push(elem);
        dict[str] = 1;
    }
}

module.exports.or = function () {
    var functions = arguments;
    return function (collection) {
        var newCollection = [];
        var dict = {};
        for (var i = 0; i < functions.length; i++) {
            var funcResult = functions[i](collection);
            for (var j = 0; j < funcResult.length; j++) {
                addElem(newCollection, dict, funcResult[j]);
            }
        }
        return newCollection;
    };
};
