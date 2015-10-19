'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; ++i) {
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
        collection = collection.slice(0, n);
        return collection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function (field) {
    var keys = arguments;
    return function (collection) {
        collection = collection.map(function (contact) {
            var newObject = {};
            for (var i = 0; i < keys.length; ++i) {
                newObject[keys[i]] = contact[keys[i]];
            }
            return newObject;
        });
        return collection;
    };
};

module.exports.filterIn = function (field, condition) {
    return function (collection) {
        collection = collection.filter(function (contact) {
            for (var i in condition) {
                if (contact[field] === condition[i]) {
                    return true;
                }
            }
            return false;
        });
        return collection;
    };
};

module.exports.filterEqual = function () {
    return function (collection) {
        collection = collection.filter(function (contact) {
            return contact[field] === condition ? true : false;
        });
        return collection;
    };
};

module.exports.sortBy = function (field, condition) {
    return function (collection) {
        collection = collection.sort(function (a, b) {
            if (a[field] > b[field]) {
                return 1;
            } else {
                return -1;
            }
        });
        return condition === 'asc' ? collection : collection.reverse();
    };
};

module.exports.format = function (field, getFirstLetter) {
    return function (collection) {
        collection = collection.map(function (contact) {
            contact[field] = getFirstLetter(contact[field]);
            return contact;
        });
        return collection;
    };
};

// Будет круто, если реализуете операторы:
// or и and
