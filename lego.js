'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 0; i < arguments.length; i++) {
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
        return collection.splice(0, n);
    };
};
module.exports.select = function () {
    var parameters = [].slice.call(arguments);
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            var dataOfPerson = Object.keys(person);
            for (var j = 0; j < dataOfPerson.length; j++) {
                var infOfPerson = dataOfPerson[j];
                if (parameters.indexOf(infOfPerson) !== 0) {
                    delete person[dataOfPerson];
                }
            }
        }
    };
};

module.exports.filterIn = function (fieldOfCollection, parameter) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            var fieldsOfPerson = Object.keys(person);
            for (var j = 0; j < fieldsOfPerson.length; j++) {
                if (fieldsOfPerson[j] == fieldOfCollection && fieldsOfPerson[j].some(parameter)) {
                    newCollection.push(collection[i]);
                }
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (fieldOfCollection, value) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            if (person[fieldOfCollection] === value) {
                newCollection.push(person);
            }
        }
        return newCollection;
    };
};

module.exports.sortBy = function (fieldOfCollection, ruleOfSort) {
    return function (collection) {
        collection = collection.sort(function (person1, person2) {
            return person1[fieldOfCollection] - person2[fieldOfCollection];
        });

        return ruleOfSort === 'asc' ? collection : collection.reverse();
    };
};


module.exports.format = function (fieldOfCollection, fun) {
    return function (collection) {
        var newCollection = collection.map(function (person) {
            person[fieldOfCollection] = fun(person[fieldOfCollection]);
            return person;
        });
        return newCollection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
