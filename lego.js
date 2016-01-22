'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var args = [].slice.call(arguments);
    args.forEach(function (row, index) {
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
        if (n > 0) {
            return collection.slice(0, n);
        }
        return collection;
    };
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
    };
};

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
    };
};

module.exports.filterEqual = function (field, equal) {
    return function (collection) {
        var ret = [];

        collection.forEach(function (row, index) {
            if (row[field] == equal) {
                ret.push(row);
            }
        });

        return ret;
    };
};

module.exports.sortBy = function (field, orderType) {
    return function (collection) {
        collection.sort(function (a, b) {
            if (a[field] < b[field]) {
                return -1;
            } else {
                return 1;
            }
        });
        if (orderType == 'desc') {
            collection = collection.reverse();
        }

        return collection;
    };
};

module.exports.format = function (field, callback) {
    return function (collection) {
        collection.forEach(function (row, index) {
            // collection[index][field] = callback(row[field]);
            row[field] = callback(row[field]);
        });

        return collection;
    };
};

/**
 * Функция копирования объекта
 * @param  {Object} obj
 * @return {Object}
 */
function copyObject(obj) {
    var newObject = {};
    var keys = Object.keys(obj);
    keys.forEach(function (key, keyIndex) {
        if (typeof obj[key] == 'object') {
            newObject[key] = copyObject(obj[key]);
        } else {
            newObject[key] = obj[key];
        }
    });
    return newObject;
}

/**
 * Простая функция копирования массива объектов
 * @param  {Object[]} collection
 * @return {Object[]}
 */
function copyCollection(collection) {
    var ret = [];
    collection.forEach(function (row, index) {
        var newObject = copyObject(row);
        ret.push(newObject);
    });
    return ret;
}

module.exports.and = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        args.forEach(function (row, index) {
            if (typeof row === 'function') {
                collection = row(collection);
            }
        });

        return collection;
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var ret = [];
        args.forEach(function (row, index) {
            if (typeof row == 'function') {
                var newCollection = row(collection);
                newCollection.forEach(function (item, itemIndex) {
                    if (ret.indexOf(item) === -1) {
                        ret.push(item);
                    }
                });
            }
        });

        return ret;
    };
};
