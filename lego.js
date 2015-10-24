'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим

module.exports.query = function (collection) {
    if (typeof collection !== 'object') {
        return [];
    }
    var legoCollection = [].slice.call(collection);

    for (var i = 1; i < arguments.length; i ++) {
        legoCollection = arguments[i](legoCollection);
    }
    return legoCollection;
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (item) {
            var newItem = new Object;
            for (var key of fields) {
                if (Object.keys(item).indexOf(key) !== -1) {
                    newItem[key] = item[key];
                }
            }
            return newItem;
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
        }
        return collection.sort(function (a, b) {
            return b[field] >= a[field] ? 1 : -1;
        });
    };
};

module.exports.format = function (field, handler) {
    return function (collection) {
        collection.forEach(function (item) {
            item[field] = handler(item[field]);
        });
        return collection;
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
        return conditions.reduce(function (tempCollection, item) {
            return combination(tempCollection, item(collection));
        }, []);
    };
};
function combination(arr1, arr2) {
    arr2 = arr2.filter(item => {
        return arr1.indexOf(item) === -1;
    });
    return arr1.concat(arr2);
}

module.exports.and = function () {
    var conditions = [].slice.call(arguments);

    return function (collection) {
        return conditions.reduce(function (collection, item) {
            return item(collection);
        }, collection);
    };
};
