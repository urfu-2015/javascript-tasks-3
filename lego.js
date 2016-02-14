'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function () {
    var args = [].slice.call(arguments);
    var collection = args[0];

    args.splice(0, 1);

    var changedCollection = args.reduce(function (changedCollection, method) {
        return method(changedCollection);
    }, collection);

    return changedCollection;
};

/**
 * Возвращает функцию, которая возвращает новую коллекцию, с обратным порядком
 * @returns {Function}
 */
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Возвращает функцию, которая возвращает новую коллекцию, содержащую только заданные поля
 * @param {Object} arguments аргументы функции
 * @returns {Function}
 */
module.exports.select = function () {
    var args = arguments;

    return function (collection) {
        return collection.map(function (item) {
            var changedItem = {};

            for (var i = 0; i < args.length; i++) {
                var fieldName = args[i];
                changedItem[fieldName] = item[fieldName];
            }

            return changedItem;
        });
    }
};

/**
 * Возвращает функцию, которая при вызове возвращает новую коллекцию,
 * в которой поле c именем field содержит значение, встречающееся в массиве type
 * @param {String} field
 * @param {String[]} type
 * @returns {Function}
 */
module.exports.filterIn = function (field, type) {
    return function (collection) {
        return collection.filter(function(item){
            return type.indexOf(item[field]) !== -1;
        });
    };
};

/**
 * Возвращает функцию, которая при вызове возвращает новую коллекцию,
 * которая сортирует коллекцию по значеню в переданном поле
 * @param {String} field имя поля по которому сортируем
 * @param {String} type порядок сортировки, может быть asc или desc
 * @returns {Function}
 */
module.exports.sortBy = function (field, type) {
    return function (collection) {
        return collection.sort(compareNumbers.bind(this, field, type));
    }
};

/**
 * Сравнивает числа
 * @param {Object} arguments аргументы функции
 * @param {String} arguments[0] имя поля по которому сортируем
 * @param {String} arguments[1] порядок сортировки
 * @param {Object} arguments[2] 1 объект сравнения
 * @param {Object} arguments[3] 2 объект сравнения
 * @returns {Number} -1|0|1
 */
function compareNumbers () {
    var field = arguments[0];
    var type = arguments[1];
    var a = arguments[2];
    var b = arguments[3];
    var result = Number(a[field]) - Number(b[field]);
    return type === 'desc' ? -result : result;
}

/**
 * Возвращает функцию, которая при вызове возвращает новую коллекцию,
 * в которой поле (аргумент 1), равно значению (аргумент 2)
 * @param {String} field
 * @param {String} type
 * @returns {Function}
 */
module.exports.filterEqual = function (field, type) {
    return function (collection) {
        return collection.filter(function(item){
            return item[field] === type;
        });
    };
};

/**
 * Возвращает функцию, которая при вызове возвращает новую коллекцию,
 * с отформатированным значением поля при помощи переданной функции
 * @param {String} field
 * @param {Function} fn
 * @returns {Function}
 */
module.exports.format = function (field, fn) {
    return function (collection) {
        return collection.map(function (item) {
            item[field] = fn(item[field]);

            return item;
        })
    };
};

/**
 * Возвращает функцию, которая при вызове возвращает новую коллекцию с первыми N записями
 * @param {Number} n
 * @returns {Function}
 */
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

// Будет круто, если реализуете операторы:
// or и and
//реализую в следующем PR
