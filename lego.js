'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
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
module.exports.limit = function (limit) {
    // Магия
    return function (collection) {
        return collection.slice(0, limit);
    };
};

module.exports.select = function () {
    var selectors = [].slice.call(arguments);

    return function (collection) {
        return collection.map(function (item) {
            var result = {};

            for (var i = 0; i < selectors.length; i++) {
                if (selectors[i] in item) {
                    result[selectors[i]] = item[selectors[i]];
                }
            }
            return result;
        });
    };
};

module.exports.filterIn = function (filteredField, filter) {
    return function (collection) {
        return collection.filter(function (value) {
            for (var i = 0; i < filter.length; i++) {
                if (value[filteredField] === filter[i]) {
                    return true;
                }
            }
            return false;
        });
    };
};

module.exports.filterEqual = function (filteredField, filter) {
    return function (collection) {
        return collection.filter(function (value) {
            return value[filteredField] === filter;
        });
    };
};

module.exports.sortBy = function (sortField, sortType) {
    return function (collection) {
        return collection.sort(function (firstItem, secondItem) {
            if (sortType === 'asc') {
                if (firstItem[sortField] > secondItem[sortField]) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (firstItem[sortField] > secondItem[sortField]) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
    };
};

module.exports.format = function (formattedField, func) {
    return function (collection) {
        return collection.map(function (item) {
            item[formattedField] = func(item[formattedField]);
            return item;
        });
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
