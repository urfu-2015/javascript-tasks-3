'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим

module.exports.query = function (collection) {
    if (typeof collection !== 'object') {
        return null;
    }
    var legoCollection = collection.map(function (item) {
        return Object.assign({}, item);;
    });

    for (var i = 1; i < arguments.length; i ++) {
        legoCollection = arguments[i](legoCollection);
    }
    return legoCollection;
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

module.exports.filterIn = function (field, elements) {
    return function (collection) {
        return collection.filter(function (item) {
            return elements.indexOf(item[field]) !== -1;
        });
    };
};

module.exports.filterEqual = function (field, element) {
    return function (collection) {
        return collection.filter(function (item) {
            return item[field] === element;
        });
    };
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

module.exports.sortBy = function (field, type) {
    return function (collection) {
        if (type === 'asc') {
            return collection.sort(function (a, b) {
                return a[field] >= b[field] ? 1 : -1;
            });
        } else {
            return collection.sort(function (a, b) {
                return b[field] >= a[field] ? 1 : -1;
            });
        }
    };
};

module.exports.format = function (field, filter) {
    return function (collection) {
        return collection.map(function (item) {
            item[field] = filter(item[field]);
            return item;
        });
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return n < 0 ? [] : collection.slice(0, n);
    };
};

module.exports.or = function () {
    var conditions = [].slice.call(arguments);

    return function (collection) {
        return conditions.map(function (item) {
            return item(collection);
        });
    };
};

module.exports.and = function () {
    var conditions = [].slice.call(arguments);

    return function (collection) {
        return conditions.reduce(function (collection, item) {
            return item(collection);
        }, collection);
    };
};
