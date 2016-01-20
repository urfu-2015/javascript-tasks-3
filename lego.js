'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var args = [].slice.call(arguments);
    args.forEach(function(row, index) {
        if (typeof row === 'function') {
            collection = row(collection);
        }
    });
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
        return collection.slice(0, n);
    }
};

module.exports.select = function () {
    var args = [].slice.call(arguments);

    return function (collection) {
        var ret = [];
        collection.forEach(function (row, index) {
            var obj = {};
            args.forEach(function (argument, argIndex) {
                if (typeof row[argument] !== 'undefined') {
                    obj[argument] = row[argument];
                }
            });
            ret.push(obj);
        });
        return ret;
    }
}

module.exports.filterIn = function (field, needle) {
    return function (collection) {
        var ret = [];
        if (typeof needle !== 'object') {
            needle = [needle];
        }
        collection.forEach(function (row, index) {
            if (needle.indexOf(row[field]) != -1) {
                ret.push(row);
            }
        });

        return ret;
    }
}

module.exports.filterEqual = function (field, equal) {
    return function (collection) {
        var ret = [];

        collection.forEach(function (row, index) {
            if (row[field] == equal) {
                ret.push(row);
            }
        });

        return ret;
    }
}

module.exports.sortBy = function (field, orderType) {
    return function (collection) {
        collection.sort(function (a, b) {
            if (a[field] < b[field])
              return -1;
            else if (a[field] > b[field])
              return 1;
            else
              return 0;
        });
        if (orderType=='desc') {
            collection = collection.reverse();
        }

        return collection;
    }
}

module.exports.format = function (field, callback) {
    return function (collection) {
        collection.forEach(function(row, index) {
            // collection[index][field] = callback(row[field]);
            row[field] = callback(row[field]);
        });

        return collection;
    }
}

// Будет круто, если реализуете операторы:
// or и and
