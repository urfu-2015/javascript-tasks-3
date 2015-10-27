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
        return collection.slice(0, n);
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function () {
    var change = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function(element){
            var friend = {};
            for (var key in element) {
                if (change.indexOf(key) != -1) {
                    friend[key] = element[key];
                }
            }
            return friend;
        });
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        return collection.filter(function(element){
            return values.indexOf(element[field]) != -1
        });
    };
};

module.exports.sortBy = function (key, order) {
    return function (collection) {
        function sortedRule(first, second){
            if (first[key] < second[key]){
                return -1;
            }
            if (first[key] > second[key]){
                return 1;
            }
            return 0;
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
        return collection.map(function(element){
            element[key] = show(element[key]);
            return element;
        });
    };
};

module.exports.filterEqual = function (key, value) {
    return function (collection) {
        return collection.filter(function(element){
            return element[key] == value;
        });
    };
};
// Будет круто, если реализуете операторы:
// or и and
module.exports.or = function () {
    var change = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var element in change) {
            var friends = change[element](collection);
            changedCollection = changedCollection.concat(friends);
        }
        return changedCollection;
    };
};

module.exports.and = function () {
    var change = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = collection;
        var party;
        for (var func in  change) {
            party = change[func](collection).map(function(element){
                return element;
            });
            changedCollection = changedCollection.filter(function (value) {
                return party.indexOf(value) > -1;
            });
        }
        return changedCollection;
    };
};
