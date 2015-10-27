'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var argLength = arguments.length;
    if (argLength === 1) {
        return collection;
    }
    var result = (JSON.parse(JSON.stringify(collection)));
    for (var i = 1; i < argLength; i++) {
        result = arguments[i](result);
    }
    return result;
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
    n = n > 0 ? n : 0;
    return function (collection) {
        return collection.slice(0, n);
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {

        //var changedCollection = collection.filter(function (item) {
        //    for (var i = 0; i < fields.length; i++) {
        //        if (Object.keys(item).indexOf(fields[i]) === -1) {
        //            return false;
        //        }
        //    }
        //    return true;
        //});

        return collection.map(function (item) {
            var newItem = {};
            fields.forEach(function (field) {
                if ((item[field])) {
                    newItem[field] = item[field];
                }
            });
            return newItem;
        });
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        return collection.filter(function (item) {
            for (var i = 0; i < values.length; i++) {
                if (item[field] === values[i]) {
                    return true;
                }
            }
            return false;
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (item) {
            if (item[field] === value) {
                return true;
            }
            return false;
        });
    };
};

module.exports.sortBy = function (field, option) {
    return function (collection) {
        var changedCollection = collection.sort(function (a, b) {
            return a[field] - b[field];
        });
        return option === 'asc' ? changedCollection : changedCollection.reverse();
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        return collection.map(function (item) {
            if (item[field]) {
                item[field] = func(item[field]);
            }
            return item;
        });
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < args.length; i++) {
            var tempCollection = args[i](collection);
            var changedCollection = changedCollection.concat(tempCollection.filter(function (item) {
                return changedCollection.indexOf(item) < 0;
            }));
        }
        return changedCollection;
    };
};

module.exports.and = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = collection.slice();
        for (var i = 0; i < args.length; i++) {
            changedCollection = args[i](changedCollection);
        }
        return changedCollection;
    };
};
