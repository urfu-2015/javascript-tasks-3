'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var argsLength = arguments.length;
    for (var i = 1; i < argsLength; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

// Оператор select, который выбирает только указанные поля для каждого объекта
module.exports.select = function () {
    var requiredFields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (person) {
            var updatedPerson = {};
            requiredFields.forEach(function (field) {
                updatedPerson[field] = person[field];
            });
            return updatedPerson;
        });
    };
};

/* Оператор filterIn, который выбирает только те объекты,
   у которых одно из указанных значений в поле field
*/
module.exports.filterIn = function (field, correctValues) {
    var valuesLength = correctValues.length;
    return function (collection) {
        return collection.filter(function (person) {
            for (var i = 0; i < valuesLength; i++) {
                if (person[field] == correctValues[i]) {
                    return true;
                }
            }
        });
    };
};

// Оператор sortBy, который сортирует коллекцию относительно field
module.exports.sortBy = function (field, direction) {
    return function (collection) {
        collection = collection.sort(function (a, b) {
            return a[field] - b[field];
        });
        return direction === 'asc' ? collection : collection.reverse();
    };
};

// Оператор format, который изменяет значения field согласно переданному формату
module.exports.format = function (field, requiredFormat) {
    return function (collection) {
        var updatedCollection = collection.map(function (person) {
            person[field] = requiredFormat(person[field]);
            return person;
        });
        return updatedCollection;
    };
};

/* Оператор filterEqual, который выбирает только те объекты,
   у которых указанное значение в поле field
 */
module.exports.filterEqual = function (field, correctValue) {
    return function (collection) {
        return collection.filter(function (person) {
            return person[field] == correctValue;
        });
    };
};

module.exports.and = function () {
    var queries = [].slice.call(arguments);
    return function (collection) {
        queries.forEach(function (query) {
            collection = query(collection);
        });
        return collection;
    };
};

module.exports.or = function () {
    var queries = [].slice.call(arguments);
    return function (collection) {
        var updatedCollections = [];
        queries.forEach(function (query) {
            updatedCollections.push(query(collection));
        });
        return updatedCollections;
    };
};
