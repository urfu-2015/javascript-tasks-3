'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var book = collection;
    for (var i = 1; i < arguments.length; i++) {
        book = arguments[i](book);
    }
    return book;
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
        var firstN = [];
        for (var i = 0; i < Math.min(n, collection.length); i++) {
            firstN.push(collection[i]);
        }
        return firstN;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.select = function () {
    var values = [];
    for (var i = 0; i < arguments.length; i++) {
        values.push(arguments[i]);
    }
    return function (collection) {
        var newBook = [];
        for (var i = 0; i < collection.length; i++) {
            var record = collection[i];
            var newRecord = {};
            for (var key in record) {
                if (values.indexOf(key) != -1) {
                    newRecord[key] = record[key];
                }
            }
            newBook.push(newRecord);
        }
        return newBook;
    };
};

module.exports.filterIn = function (field, choice) {
    return function (collection) {
        var newBook = [];
        for (var i = 0; i < collection.length; i++) {
            var record = collection[i];
            var keys = Object.keys(record);
            if (keys.indexOf(field) != -1 && choice.indexOf(record[field]) != -1) {
                newBook.push(record);
            }
        }
        return newBook;
    };
};

module.exports.filterEqual = function (key, value) {
    return module.exports.filterIn(key, [value]);
};

module.exports.sortBy = function (key, method) {
    return function (collection) {
        var newBook = collection.sort(function (first, second) {
            if (first[key] > second[key]) {
                return 1;
            }
            if (first[key] < second[key]) {
                return -1;
            }
            return 0;
        });
        if (method === 'desc') {
            return newBook.reverse();
        }
        return newBook;
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        var newBook = [];
        for (var i = 0; i < collection.length; i++) {
            var newRecord = {};
            var record = collection[i];
            for (var key in record) {
                newRecord[key] = key === field ? func(record[key]) : record[key];
            }
            newBook.push(newRecord);
        }
        return newBook;
    };
};

// Будет круто, если реализуете операторы:
// or и and

module.exports.and = function () {
    var functions = arguments;
    return function (collection) {
        var newBook = collection;
        for (var i = 0; i < functions.length; i++) {
            newBook = functions[i](newBook);
        }
        return newBook;
    };
};

module.exports.or = function () {
    var functions = arguments;
    return function (collection) {
        var resultCollection = [];
        for (var i = 0; i < functions.length; i++) {
            var newCollection = functions[i](collection);
            for (var j = 0; j < newCollection.length; j++) {
                resultCollection.push(newCollection[j]);
            }
        }
        return resultCollection;
    };
};
