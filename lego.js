'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++)
        collection = arguments[i](collection);
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
        for (var i = 0; i <= limit; i++) {
            var arrCollection = [];
            arrCollection.push(collection[i]);
        }
        return arrCollection;
    };
};

// Оператор select, который выбирает только нужные поля
module.exports.select = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        for (var i in collection) {
            for (var j in args) {
                var person = {};
                person[args[j]] = collection[i][args[j]];
            }
            var result = [];
            result.push(person);
        }
        return result;
    };
};

// Оператор filterIn, которым выбираем тех, кто любит Яблоки и Картофель
module.exports.filterIn = function (filter, queries) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            if (queries.indexOf(person[filter]) !== -1) {
                var result = [];
                result.push(person);
            }
        }
        return result;
    };
};


module.exports.filterEqual = function (filter, queries) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var person = collection[i];
            if (person[filter] === queries) {
                var result = [];
                result.push(person);
            }
        }
        return result;
    };
};

// Оператор sortBy, отсуртирует их по возрасту (но зачем?)
module.exports.sortBy = function (filter, type) {
    return function (collection) {
        if (type === 'asc') {
            return collection.sort(function (a, b) {
                if (a[filter] >= b[filter]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            return collection.sort(function (a, b) {
                if (b[filter] >= a[filter]) {
                    return 1;
                } else {
                    return -1;
                }
            });
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
