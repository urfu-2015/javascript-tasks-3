'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var args = [].slice.call(arguments);
    args.shift();
    for (var i = 0; i < args.length; i++) {
        collection = args[i](collection);
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
module.exports.limit = function () {
    var func = function (n) {
        var args = [].slice.call(arguments);
        var collection = args[1];
        var changedCollection = [];
        if (n <= collection.length) {
            for (var i = 0; i < n; i++) {
                changedCollection[i] = collection[i];
            }
        } else {
            var i = 0;
            while (i < collection.length) {
                changedCollection[i] = collection[i];
                i++;
            }
        }
        return changedCollection;
    };
    func = func.bind(null, arguments[0]);
    return func;
};

module.exports.select = function () {
    var func = function (colomns) {
        var args = [].slice.call(arguments);
        var collection = args[1];
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            changedCollection[i] = {};
            for (var j = 0; j < colomns.length; j++) {
                if (colomns[j] in collection[i]) {
                    changedCollection[i][colomns[j]] = collection[i][colomns[j]];
                }
            }
        }
        return changedCollection;
    };
    func = func.bind(null, arguments);
    return func;
};

module.exports.filterIn = function () {
    var func = function (params) {
        var args = [].slice.call(arguments);
        var collection = args[1];
        var colomn = params.colomn;
        var values = [];
        values = params.values;
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            for (var j in values) {
                if (collection[i][colomn] === values[j]) {
                    changedCollection.push(collection[i]);
                }
            }
        }
        return changedCollection;
    };
    var objectToReturn = {
        colomn: arguments[0],
        values: arguments[1]
    };
    func = func.bind(null, objectToReturn);
    return func;
};

module.exports.filterEqual = function () {
    return exports.filterIn(arguments[0], [arguments[1]]);
};

module.exports.sortBy = function () {
    var func = function (colomn, direction) {
        direction = direction || 'asc';
        var collection = arguments[2];
        var changedCollection = collection;
        var reverseFunction = exports.reverse();
        var sortFunc = function (fieldName) {
            var aObj = arguments[1];
            var bObj = arguments[2];
            if (fieldName === 'age') {
                return aObj.age - bObj.age;
            } else {
                if (aObj[fieldName] > bObj[fieldName]) {
                    return 1;
                } else if (aObj[fieldName] < bObj[fieldName]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        };
        sortFunc = sortFunc.bind(null, colomn);
        changedCollection.sort(sortFunc);
        if (direction !== 'asc') {
            changedCollection = reverseFunction(changedCollection);
        }
        return changedCollection;
    };
    func = func.bind(null, arguments[0], arguments[1]);
    return func;
};

module.exports.format = function () {
    var func = function (params) {
        var args = [].slice.call(arguments);
        var collection = args[1];
        var colomn = params.colomn;
        var formatter = params.formatterFunc;
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            changedCollection.push(collection[i]);
            changedCollection[i][colomn] = formatter(changedCollection[i][colomn]);
        }
        return changedCollection;
    };
    var objectToReturn = {
        colomn: arguments[0],
        formatterFunc: arguments[1]
    };
    func = func.bind(null, objectToReturn);
    return func;
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы :
// or и and
