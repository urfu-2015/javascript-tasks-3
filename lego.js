'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; ++i) {
            collection = arguments[i](collection);
    }
        return collection;
}

module.exports.select = function () {
    var filters = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (filters.indexOf(key) === -1) {
                        delete obj[key];
                    }
                }
            }
            return obj;
        });
    }
}

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    }
}

module.exports.filterIn = function (key, filters) {
    return function (collection) {
        return collection.filter(function (obj) {
            return filters.indexOf(obj[key]) !== -1;
        });
    }
}

module.exports.filterEqual = function (key, filter) {
    return function (collection) {
        return collection.filter(function (obj) {
            return obj[key] === filter;
        });
    }
}

module.exports.sortBy = function (key, order) {
    return function (collection) {
        collection.sort(function (obj1, obj2) {
            return obj1[key] >= obj2[key] ? 1 : -1;
        });
        return order === 'asc' ? collection : collection.reverse();
    }
}

module.exports.format = function (key, filter) {
    return function (collection) {
        return collection.map(function (obj) {
            obj[key] = filter(obj[key]);
            return obj;
        });
    }
}

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    // Магия
    return function (collection) {
        return collection.slice(0, n);
    }
}

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
