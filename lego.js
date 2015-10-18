'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var filterBook = collection;
    for (var i = 1; i < arguments.length; i++) {
        filterBook = arguments[i](filterBook);
    }
    console.log(filterBook);
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
        return n < collection.length ? collection.slice(0, n) : collection;
    }
    // Магия
};

module.exports.select = function () {
    var keys = [].slice.apply(arguments);
    return function (collection) {
        var filterCollection = [];

        for (var k in collection) {
            filterCollection[k] = [];
            for (var i in keys) {
                var key = keys[i];
                filterCollection[k][key] = collection[k][key];
            }
        }

        return filterCollection;
    }
}

module.exports.filterIn = function (keyForFilter, valuesForFilter) {
    return function (collection) {
        var filterCollection = [];

        for (var i in collection) {
            for (var k in valuesForFilter) {
                var value = valuesForFilter[k];
                if (collection[i][keyForFilter] == value)
                    filterCollection.push(collection[i]);
            }
        }

        return filterCollection;
    }
}

module.exports.sortBy = function (keyForSort, order) {
    return function (collection) {
        function compare(a, b) {
            if (parseInt(a[keyForSort]) > parseInt(b[keyForSort])) return 1;
            if (parseInt(a[keyForSort]) < parseInt(b[keyForSort])) return -1;
        }

        var sortedCollection = collection.sort(compare);
        return order == "desc" ? collection.reverse() : collection;
    }
}

module.exports.format = function (key, func) {
    return function (collection) {
        for (var i in collection) {
               collection[i][key] = func(collection[i][key]);
        }
        return collection;
    }
}

module.exports.filterEqual = function (key, expectedValue) {
    return function(collection) {
        var filterCollection = [];
        for (var i in collection) {
            if (collection[i][key] == expectedValue)
                filterCollection.push(collection[i]);
        }
        return filterCollection;
    }
}
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
