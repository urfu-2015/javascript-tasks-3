'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
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
module.exports.limit = function (limit) {
    return function (collection) {
        if (limit <= 0) {
            return '';
        }

        var arrCollection = [];
        for (var i = 0; i <= limit; i++) {
            arrCollection.push(collection[i]);
        }
        return arrCollection;
    };
};

// Оператор select, который выбирает только нужные поля
module.exports.select = function () {
    return function (collection) {
        var person = {};
        var result = [];

        for (var i = 0; i < collection.length; i++) {
            for (var j = 0; j < arguments.length; j++) {
                person[arguments[j]] = collection[i][arguments[j]];
            }
            result.push(person);
        }
        return result;
    };
};

// Оператор filterIn, которым выбираем тех, кто любит Яблоки и Картофель
module.exports.filterIn = function (filter, queries) {
    return function (collection) {
        return collection.filter(function (person) {
            for (var i = 0; i < queries.length; i++) {
                if (person[filter] === queries[i]) {
                    return true;
                }
            }
            return false;
        });
    };
};

module.exports.filterEqual = function (filter, queries) {
    return function (collection) {
        return collection.filter(function (person) {
            if (person[filter] === queries) {
                return true;
            }
            return false;
        });
    };
};

// Оператор sortBy, отсуртирует их по возрасту (но зачем?)
module.exports.sortBy = function (filter, type) {
    return function (collection) {
        var sort = collection.sort(function (a, b) {
            if (a[filter] >= b[filter]) {
                return 1;
            } else {
                return -1;
            }
        });
        if (type === 'asc') {
            return sort;
        } else {
            return sort.reverse();
        }
    };
};

//Оператор format, выведет пол только первой буквой для удобства
module.exports.format = function (filter, func) {
    return function (collection) {
        return collection.map(function (person) {
            person[filter] = func(person[filter]);
            return person;
        });
    };
};

// Будет круто, если реализуете операторы:
// or
module.exports.or = function () {

};

//and
module.exports.and = function () {

};
