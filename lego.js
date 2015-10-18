'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
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
        var newCollection = [];
        for (var i = 0; i < n; i++) {
            newCollection.push(collection[i]);
        }
        return newCollection;
    };
};

module.exports.select = function () {
    var fields = arguments;
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            var newContact = {};
            for (var j = 0; j < fields.length; j++) {
                var field = fields[j];
                newContact[field] = contact[field];
            }
            newCollection.push(newContact);
        }
        return newCollection;
    };
};

module.exports.filterIn = function (field, possibleValues) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            if (possibleValues.indexOf(contact[field]) >= 0) {
                newCollection.push(contact);
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            if (contact[field] === value) {
                newCollection.push(contact);
            }
        }
        return newCollection;
    };
};

module.exports.sortBy = function (field, sortType) {
    return function (collection) {
        var sortFunction = function (a, b) {
            if (a[field] > b[field]) {
                return 1;
            }
            if (a[field] < b[field]) {
                return -1;
            }
            return 0;
        };
        var sortedCollection = collection.sort(sortFunction);
        if (sortType === 'desc') {
            sortedCollection = sortedCollection.reverse();
        }
        return sortedCollection;
    };
};

module.exports.format = function (field, changingFunction) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            contact[field] = changingFunction(contact[field]);
        }
        return collection;
    };
};
