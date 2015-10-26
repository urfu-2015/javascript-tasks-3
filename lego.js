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
                if (item[key]) {
                    contact[key] = item[key];
                }
            });
            newCollection.push(contact);
        });
        return newCollection;
    };
};

module.exports.filterIn = function (filterKey, filterValue) {
    return function (collection) {
        var newCollection = [];
        collection.forEach(function (item, i, arr) {
            filterValue.forEach(function (value, i, arr) {
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
        collection.reduce(function (previousValue, currentValue) {
            if (currentValue[filterKey] === filterValue) {
                newCollection.push(currentValue);
            }
        });
        return newCollection;
    };
};

module.exports.sortBy = function (sortKey, sortingOrder) {
    return function (collection) {
        if (sortingOrder === 'asc') {
            collection.sort(function (a, b) {
                return sortValue(a, b, sortKey);
            });
        }
        if (sortingOrder === 'desc') {
            collection.sort(function (a, b) {
                return sortValue(b, a, sortKey);
            });
        }
        return collection;
    };
};

function sortValue(a, b, sortKey) {
    if (a[sortKey] > b[sortKey]) {
        return 1;
    }
    if (a[sortKey] < b[sortKey]) {
        return -1;
    }
    return 0;
}

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
