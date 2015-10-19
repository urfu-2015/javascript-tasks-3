'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
        if (i == 5) {
        }
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
        var newCollection = collection.splice(0, n);
        return newCollection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.select = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var newCollection = [];
        collection.forEach(function (item, i, arr) {
            var contact = {};
            args.forEach(function (key, j, arr) {
                contact[key] = item[key];
            });
            newCollection.push(contact);
        });
        return newCollection;
    };
};

module.exports.filterIn = function (filterKey, filterValue) {
    return function (collection) {
        var newCollection = [];
        filterValue.forEach(function (value, i, arr) {
            collection.forEach(function (item, i, arr) {
                if (value == item[filterKey]) {
                    newCollection.push(item);
                }
            });
        });
        return newCollection;
    };
};

module.exports.filterEqual = function (filterKey, filterValue) {
    return function (collection) {
        var newCollection = [];
        collection.forEach(function (item, i, arr) {
            if (filterValue == item[filterKey]) {
                newCollection.push(item);
            }
        });
        return newCollection;
    };
};

module.exports.sortBy = function (sortKey, sortingOrder) {
    return function (collection) {
        collection.sort(function (a, b) {
            if (a[sortKey] > b[sortKey]) {
                return 1;
            }
            if (a[sortKey] < b[sortKey]) {
                return -1;
            }
            return 0;
        });
        return (sortingOrder === 'asc') ? collection : collection.reverse();
    };
};

module.exports.format = function (formatKey, format) {
    return function (collection) {
        var newCollection = [];
        collection.forEach(function (item, i, arr) {
            item[formatKey] = format(item[formatKey]);
            newCollection.push(item);
        });
        return newCollection;
    };
};

// Будет круто, если реализуете операторы:
// or и and
