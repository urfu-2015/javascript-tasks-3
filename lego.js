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
        return collection.slice(0, n);
    };
    // Магия
};

module.exports.select = function () {
    var options = [].slice.call(arguments);
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            var newPerson = {};
            for (var reason in person) {
                if (options.indexOf(reason) != -1) {
                    newPerson[reason] = person[reason];
                }
            }
            newCollection.push(newPerson);
        }
        return newCollection;
    };
};

module.exports.filterIn = function (criterion, options) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            for (var option in options) {
                if (collection[i][criterion] == options[option]) {
                    newCollection.push(collection[i]);
                    break;
                }
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (criterion, options) {
    return module.exports.filterIn(criterion, [options]);
};

module.exports.sortBy = function (criterion, methodSorting) {
    return function (collection) {
        var newBook = collection.sort(function (first, second) {
            if (first[criterion] > second[criterion]) {
                return 1;
            }
            if (first[criterion] < second[criterion]) {
                return -1;
            }
            if (first[criterion] == second[criterion]) {
                return 0;
            }
        });
        if (methodSorting === 'asc') {
            return collection;
        }
        if (methodSorting === 'desc') {
            return collection.reverse();
        }
    };
};

module.exports.format = function (criterion, functionFormat) {
    return function (collection) {
        var newCollection = collection.map(function (person) {
            person[criterion] = functionFormat(person[criterion]);
            return person;
        });
        return newCollection;
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format

// Будет круто, если реализуете операторы:
// or и and
