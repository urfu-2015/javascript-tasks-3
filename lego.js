'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = collection;
    for (var func in arguments) {
        if (typeof arguments[func] == "function") {
            changedCollection = arguments[func](changedCollection);
        }
    }
    return changedCollection;
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
    // Магия.
    return function (collection) {
        var changedCollection = [];
        if (collection.length < n){
            n = collection.length;
        }
        for (var element = 0; element < n; element++) {
            changedCollection.push(collection[element]);
        }
        return changedCollection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function () {
    var change = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = collection.map(function(element){
            var friend = {};
            for (var key in element) {
                if (change.indexOf(key) != -1) {
                    friend[key] = element[key];
                }
            }
            return friend;
        });
        return changedCollection;
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        var changedCollection = collection.filter(function(element){
            return values.indexOf(element[field]) != -1
        });
        return changedCollection;
    };
};

module.exports.sortBy = function (key, order) {
    return function (collection) {
        function sortedRule(first, second){
            return first[key] < second[key] ? -1 : first[key] > second[key] ? 1 : 0
        }
        var changedCollection = collection.sort(sortedRule);
        if (order === 'desc') {
            changedCollection.reverse();
        }
        return changedCollection;
    };
};

module.exports.format = function (key, show) {
    return function (collection) {
        var changedCollection = collection.map(function(element){
            element[key] = show(element[key]);
            return element;
        });
        return changedCollection;
    };
};

module.exports.filterEqual = function (key, value) {
    return function (collection) {
        var changedCollection = collection.filter(function(element){
            return element[key] == value;
        });
        return changedCollection;
    };
};
// Будет круто, если реализуете операторы:
// or и and
