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
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (object) {
            for (var field in object) {
                if (fields.indexOf(field) === -1) {
                    delete object[field];
                }
            }
            return object;
        });
    };
};

module.exports.filterIn = function (field, filter) {
    return function (collection) {
        return collection.filter(function (object) {
            return filter.indexOf(object[field]) !== -1;
        });
    };
};

module.exports.filterEqual = function (field, filter) {
    return function (collection) {
        return collection.filter(function (object) {
            return object[field] == filter;
        });
    };
};

module.exports.sortBy = function (field, mode) {
    mode = mode.toLowerCase();
    return function (collection) {
        return collection.sort(function (object1, object2) {
            if (mode == 'asc') {
                return object1[field] <= object2[field] ? 1 : -1;
            } else {
                return object1[field] >= object2[field] ? 1 : -1;
            }
        });
    };
};

module.exports.format = function (field, callback) {
    return function (collection) {
        return collection.map(function (item) {
            item[field] = callback(item[field]);
            return item;
        });
    };
};

// Будет круто, если реализуете операторы:
// or и and

module.exports.or = function () {

};

module.exports.and = function () {

};
