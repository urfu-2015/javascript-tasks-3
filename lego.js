'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; ++i) {
        collection = arguments[i](collection);
    }
    console.log(collection);
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
        var partCollection = collection.slice(0, n);
        return partCollection;
    };
};

module.exports.select = function () {
    var attributesCollection = [].slice.call(arguments);
    return function (collection) {
        for (var i = 0; i < collection.length; ++i) {
            var keys = Object.keys(collection[i]);
            for (var j = 0; j < keys.length; ++j) {
                if (!attributesCollection.some(attrCollection => attrCollection === keys[j])) {
                    delete collection[i][keys[j]];
                }
            }
        }
        return collection;
    };
};

module.exports.filterIn = function (attribute, values) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; ++i) {
            if (values.some(value => collection[i][attribute] === value)) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
};

module.exports.filterEqual = function (attribute, value) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; ++i) {
            if (collection[i][attribute] === value) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
};

module.exports.sortBy = function (attribute, typeSort) {
    return function (collection) {
        return collection.sort(function (a, b) {
            var method = (typeSort === 'asc') ? 1 : -1;
            if (isNaN(a[attribute])) {
                return method * a[attribute].localeCompare(b[attribute]);
            } else {
                return method * (a[attribute] - b[attribute]);
            }
        });
    };
};

module.exports.format = function (attribute, method) {
    return function (collection) {
        for (var i = 0; i < collection.length; ++i) {
            collection[i][attribute] = method(collection[i][attribute]);
        }
        return collection;
    };
};
