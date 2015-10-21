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
        return n <= 0 ? [] : collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    if (!fields.length) {
        return [];
    }
    return function (collection) {
        return collection.map(function (item) {
            return fields.reduce(function (newItem, field) {
                if (typeof item[field] !== 'undefined') {
                    newItem[field] = item[field];
                }
                return newItem;
            }, {});
        });
    };
};

module.exports.filterIn = function (field, conditions) {
    return function (collection) {
        var changedCollection = collection;
        return changedCollection.filter(function (item) {
            return conditions.indexOf(item[field]) !== -1;
        });
    };
};

module.exports.filterEqual = function (field, condition) {
    return function (collection) {
        var changedCollection = collection;
        return changedCollection.filter(function (item) {
            return item[field] === condition;
        });
    };
};

module.exports.sortBy = function (field, mode) {
    return function (collection) {
        var changedCollection = collection;
        return changedCollection.sort(function (object1, object2) {
            if (mode == 'asc') {
                return object1[field] <= object2[field] ? 1 : -1;
            } else {
                return object1[field] >= object2[field] ? 1 : -1;
            }
        });
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        var changedCollection = collection;
        changedCollection.forEach(function (item) {
            item[field] = func(item[field]);
        });
        return changedCollection;
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var newCollection = [];
        args.forEach(function (func) {
            var tempCollection = func(collection);
            tempCollection.forEach(function (item) {
                if (newCollection.indexOf(item) === -1) {
                    newCollection.push(item);
                }
            });
        });
        return newCollection;
    };
};

module.exports.and = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        args.forEach(function (func) {
            collection = func(collection);
        });
        return collection;
    };
};

// Будет круто, если реализуете операторы:
// or и and
