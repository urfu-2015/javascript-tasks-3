'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = collection;
    for (var func in arguments) {
        if (func != '0') {
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
        var changedCollection = [];
        for (var element = 0; element < collection.length; element++) {
            var friend = {};
            for (var key in collection[element]) {
                if (change.indexOf(key) != -1) {
                    friend[key] = collection[element][key];
                }
            }
            changedCollection.push(friend);
        }
        return changedCollection;
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        var changedCollection = [];
        for (var element in collection) {
            if (values.indexOf(collection[element][field]) != -1) {
                changedCollection.push(collection[element]);
            }
        }
        return changedCollection;
    };
};

module.exports.sortBy = function (key, order) {
    return function (collection) {
        function sortedRule(first, second){
            return first[key] - second[key];
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
        var changedCollection = [];
        for (var element in collection) {
            var changedMan = collection[element];
            changedMan[key] = show(collection[element][key]);
            changedCollection.push(changedMan);
        }
        console.log(changedCollection);
        return changedCollection;
    };
};

module.exports.filterEqual = function (key, value) {
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; elem++) {
            if (collection[elem][key] === value) {
                changedCollection.push(collection[elem]);
            }
        }
        return changedCollection;
    };
};
// Будет круто, если реализуете операторы:
// or и and
