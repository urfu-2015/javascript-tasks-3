'use strict';

/** Метод, который будет выполнять операции над коллекцией один за другим
 * @param {Array} query
 * @param {Array of Dicts} changedCollection
*/
module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = collection;
    for (var op in arguments) {
        if (op != '0') {
            changedCollection = arguments[op](changedCollection);
        }
    }
    // Возращаем изменённую коллекцию
    return changedCollection;
};

/** Оператор select, который оставляет только нужные поля в записях
 * @return {function}
 */
module.exports.select = function () {
    var fieldsToChoose = [].slice.apply(arguments);
    return function (collection) {
        var changedCollection = [];
        var counter = 0;
        for (var i = 0; i < collection.length; i++) {
            var temp_dict = {};
            for (var key in collection[i]) {
                if (fieldsToChoose.indexOf(key) != -1) {
                    counter += 1;
                    temp_dict[key] = collection[i][key];
                }
            }
            if (counter == fieldsToChoose.length) {
                changedCollection.push(temp_dict);
            }
            counter = 0;
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/** Оператор filterIn, который сортирует по какому-то ключу и значениям
 * @return {function}
 */
module.exports.filterIn = function (keyForFilter, exceptedValues) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            for (var j = 0; j < exceptedValues.length; j++) {
                if (collection[i][keyForFilter].indexOf(exceptedValues[j]) != -1) {
                    changedCollection.push(collection[i]);
                    break;
                }
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};


/** Оператор filterEqual, который сортирует по какому-то ключу и значению
 * @return {function}
 */
module.exports.filterEqual = function (keyForFilter, exceptedValue) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i][keyForFilter] === exceptedValue) {
                changedCollection.push(collection[i]);
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/** Оператор sortBy, который сортирует по какому-то ключу и значению
 * @return {function}
 */
module.exports.sortBy = function (keyForSort, typeOfSort) {
    return function (collection) {
        function comparePeople(a, b) {
            if (a[keyForSort] > b[keyForSort]) {
                return 1;
            }
            if (a[keyForSort] < b[keyForSort]) {
                return -1;
            }
            return 0;
        }
        var changedCollection = collection.sort(comparePeople);
        if (typeOfSort === 'desc') {
            changedCollection.reverse();
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/** Оператор reverse, который переворачивает коллекцию
 * @return {function}
*/
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/** Оператор format, который меняет формат какого-то значения
 * @return {function}
 */
module.exports.format = function (key, func) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            collection[i][key] = func(collection[i][key]);
            changedCollection.push(collection[i]);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Оператор limit, который выбирает первые N записей
 * @param {Number} n
 * @return {function}
 */
module.exports.limit = function (n) {
    return function (collection) {
        if (n > collection.length) {
            n = collection.length;
        }
        if (n < 0) {
            n = 0;
        }
        var changedCollection = [];
        for (var i = 0; i < n; i++) {
            changedCollection.push(collection[i]);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Оператор or, который отбирает участников по нескольким фильтрам
 * @return {function}
 */
module.exports.or = function () {
    var args = [].slice.apply(arguments);
    return function (collection) {
        var result = [];
        for (var i = 0; i < args.length; i++) {
            var changedCollection = args[i](collection);
            for (var j = 0; j < changedCollection.length; j++) {
                result.push(changedCollection[j]);
            }
        }
        // Возращаем изменённую коллекцию
        return result;
    };
};

/**
 * Оператор and, который объединяет в себе некоторые операторы
 * @return {function}
 */
module.exports.and = function () {
    var operators = [].slice.apply(arguments);
    return function (collection) {
        var changedCollection = collection;
        for (var i = 0; i < operators.length; i++) {
            changedCollection = operators[i](changedCollection);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};
