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
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n < 0) {
            return collection.slice(0, 0);
        }
        return collection.slice(0, n);
    };
};

module.exports.format = function (field, characteristic) {
    return function (collection) {
        collection.forEach(function (contact) {
            contact[field] = characteristic(contact[field]);
        });
        return collection;
    };
};

module.exports.filterIn = function (field, characteristic) {
    return function (collection) {
        var filterCollection = [];
        collection.forEach(function (contact) {
            for (var i = 0; i < characteristic.length; i++) {
                if (contact[field] === characteristic[i]) {
                    filterCollection.push(contact);
                }
            }
        });
        return filterCollection;
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (contact) {
            return contact[field] === value;
        });
    };
};

module.exports.sortBy = function (field, sortType) {
    return function (collection) {
        var sortFunction = function (a, b) {
            if (a[field] > b[field]) {
                return 1;
            }
            if (a[field] < b[field]) {
                return -1;
            }
            return 0;
        };
        var sortedCollection = collection;
        sortedCollection.sort(sortFunction);
        if (sortType === 'desc') {
            sortedCollection.reverse();
        }
        return sortedCollection;
    };
};

module.exports.select = function () {
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
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
