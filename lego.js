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
        if (limit < 0) {
            throw Error('Negative limit.');
        }
        return collection.slice(0, limit);
    };
};

module.exports.select = function () {
    var selectors = [].slice.call(arguments);

    return function (collection) {
        return collection.map(function (item) {
            var result = {};

            selectors.forEach(function (selector) {
                if (item.hasOwnProperty(selector)) {
                    result[selector] = item[selector];
                }
            });
            return result;
        });
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        return collection.filter(function (item) {
            return values.some(function (value) {
                return value === item[field];
            });
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (item) {
            return item[field] === value;
        });
    };
};

module.exports.sortBy = function (field, sortType) {
    return function (collection) {
        var sortingCoefficient = sortType === 'asc' ? 1 : -1;
        return collection.sort(function (firstItem, secondItem) {
            if (firstItem[field] > secondItem[field]) {
                return sortingCoefficient;
            }
            if (firstItem[field] < secondItem[field]) {
                return -1 * sortingCoefficient;
            }
            if (firstItem[field] = secondItem[field]) {
                return 0;
            }
        });
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        return collection.map(function (item) {
            var copy = Object.assign({}, item);
            copy[field] = func(copy[field]);
            return copy;
        });
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments);

    return function (collection) {
        var result = [];

        args.forEach(function (arg) {
            arg(collection).forEach(function (item) {
                if (result.length === 0 || !result.some(function (resultItem) {
                        return resultItem === item;
                    })) {
                    result.push(item);
                }
            });
        });
        return result;
    };
};

module.exports.and = function () {
    var args = [].slice.call(arguments);

    return function (collection) {
        var result = collection;

        args.forEach(function (item) {
            result = item(result);
        });
        return result;
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
