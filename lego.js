'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var phoneBook = collection;
    for (var i = 1; i < arguments.length; i++) {
        phoneBook = arguments[i](phoneBook);
    }
    return phoneBook;
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
        n = n > 0 ? n : collection.length;
        n = Math.min(n, collection.length);
        var limitCollection = [];
        for (var i = 0; i < n; i++) {
            limitCollection.push(collection[i]);
        };
        return limitCollection;
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var selectedCollection = [];
        collection.forEach(function (item, i, collection) {
            var newData = {};
            fields.forEach(function (field, i, fields) {
                if (item.hasOwnProperty(field)) {
                    newData[field] = item[field];
                };
            });
            selectedCollection.push(newData);
        });
        return selectedCollection;
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        var filteredCollection = collection.filter(function (item, i, collection) {
            return values.indexOf(item[field]) > -1;
        });
        return filteredCollection;
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        var filteredCollection = [];
        collection.forEach(function (item, i, collection) {
            if (value === item[field]) {
                filteredCollection.push(item);
            };
        });
        return filteredCollection;
    };
};

module.exports.sortBy = function (property, order) {
    return function (collection) {
        if (order !== 'asc' || 'desc') {
            order = 'asc';
        };
        var sortedCollection = collection.sort(function (first, second) {
            if (first[property] < second[property]) {
                return (order == 'asc'? -1 : 1);
            }
            if (first[property] > second[property]) {
                return (order == 'asc'? 1 : -1);
            }
            return 0;
        });
        return sortedCollection;
    };
};

module.exports.format = function (property, convertFunction) {
    return function (collection) {
        var formatedCollection = [];
        collection.forEach(function (item, i, collection) {
            var newData = {};
            for (var prop in item) {
                if (property === prop) {
                    newData[prop] = convertFunction(item[prop]);
                } else {
                    newData[prop] = item[prop];
                }
            }
            formatedCollection.push(newData);
        });
        return formatedCollection;
    };
};



// Будет круто, если реализуете операторы:
// or и and
