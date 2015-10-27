'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var filterBook = collection;
    for (var i = 1; i < arguments.length; i++) {
        filterBook = arguments[i](filterBook);
    }
    return filterBook;
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
        if (n < 0) n = 0;
        return n < collection.length ? collection.slice(0, n) : collection;
    }
    // Магия
};

module.exports.select = function () {
    var keys = [].slice.apply(arguments);
    return function (collection) {
        var filterCollection = [];

        collection.forEach(function(item, index) {
            filterCollection[index] = {};
            keys.forEach(function(key) {
                if (key in item)
                    filterCollection[index][key] = item[key];
            })
        });

        return filterCollection;
    }
}

module.exports.filterIn = function (keyForFilter, valuesForFilter) {
    return function (collection) {
        var filterCollection = collection.filter(function(item) {
            return valuesForFilter.some(function(value) {
                return item[keyForFilter] == value;
            });
        });

        return filterCollection;
    }
}

module.exports.sortBy = function (keyForSort, order) {
    return function (collection) {
        function compare(a, b) {
            if (a[keyForSort] > b[keyForSort]) return 1;
            if (a[keyForSort] < b[keyForSort]) return -1;
        }

        var sortedCollection = collection.sort(compare);
        return order == "desc" ? collection.reverse() : collection;
    }
}

module.exports.format = function (key, func) {
    return function (collection) {
        for (var item of collection) {
               item[key] = func(item[key]);
        }
        return collection;
    }
}

module.exports.filterEqual = function (key, expectedValue) {
    return function(collection) {
        var filterCollection = collection.filter(function(item) {
            return item[key] == expectedValue;
        });

        return filterCollection;
    }
}
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.or = function () {
    var functions = [].slice.apply(arguments);
    return function () {
        var filters = [].slice.apply(arguments);


    }
}

module.exports.and = function() {
    var functions = [].slice.apply(arguments);
    return function (collection) {

        functions.forEach(function(func) {
            collection = func(collection);
        });

        return collection;
    }
}
// Будет круто, если реализуете операторы:
// or и and
