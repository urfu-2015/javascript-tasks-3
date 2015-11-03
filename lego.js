'use strict';

/**
 * Метод, который выполняет операции над коллекцией один за другим
 * @param {Object[]} collection
 * @param {...Function}
 * @returns {Object[]} changedCollection
 */
module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = collection;
    for (var i = 1; i < arguments.length; i++) {
        changedCollection = arguments[i](changedCollection);
    }
    return changedCollection;
};

/**
 * Оператор reverse, который переворачивает коллекцию
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
 * Оператор limit, который выбирает первые N записей
 * @param n
 * @returns {Function}
 */
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n + 1);
    };
};

/**
 * Оператор select, который оставляет только нужные поля в записях
 * @returns {Function}
 */
module.exports.select = function () {
    // Получаем все аргументы
    var fieldsToChoose = [].slice.apply(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            changedCollection.push({});
            for (var key in collection[elem]) {
                // Копируем только нужные ключи
                if (fieldsToChoose.indexOf(key) !== -1) {
                    changedCollection[elem][key] = collection[elem][key];
                }
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Оператор filterIn делает выборку по ключам определенных полей
 * @returns {Function}
 */
module.exports.filterIn = function (field, value) {
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            if (value.indexOf(collection[elem][field]) !== -1) {
                changedCollection.push(collection[elem]);
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

///**
// * Функция - компаратор для сортировки
// * @param a - первый человек
// * @param b - второй человек
// * @returns {number}
// */
function sorting (direction) {
    return function comparePeople(a, b) {
        // Делаем сортировку для чисел и строк
        // Б.О.О можем проверить только один параметр
        if (typeof a === 'number') {
            a = parseInt(a[key], 10);
            b = parseInt(b[key], 10);
        }
        if (direction === 'asc') {
            return a < b ? 1 : -1;
        } else {
            return a > b ? 1 : -1;
        }
    }
}

/**
 * Сортирует по возрастанию или убыванию
 * @param key
 * @param order
 * @returns {Function}
 */
module.exports.sortBy = function (key, order) {
    return function (collection) {
        var changedCollection = collection.sort(sorting(order));
        if (order === 'desc') {
            changedCollection.reverse();
        }
        return changedCollection;
    };
};

/**
 * Изменяет значение по выбранному ключу
 * @param {string} key
 * @param {Function} formatter
 * @returns {Function}
 */
module.exports.format = function (key, formatter) {
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            var changedMen = collection[elem];
            changedMen[key] = formatter(collection[elem][key]);
            changedCollection.push(changedMen);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Выбирает только заданные значения по заданным полям
 * @param {string} key
 * @param {string} expectedVal
 * @returns {Function}
 */
module.exports.filterEqual = function (key, expectedVal) {
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            if (collection[elem][key] === expectedVal) {
                changedCollection.push(collection[elem]);
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Деает операцию or.
 * Считаем, что логические операции нас попросят сделать
 * только с операторами [select, filterIn, filterEqual, sortBy, format, limit]
 * но не с чистыми данными
 * @returns {Function}
 */
module.exports.or = function () {
    // Получаем все аргументы
    var toUnion = [].slice.apply(arguments);
    return function (collection) {
        var changedCollection = [];
        var ansSet = new Set();
        for (var elem = 0; elem < toUnion.length; ++elem) {
            var partOfCollection = toUnion[elem](collection);
            for (var i in partOfCollection) {
                ansSet.add(partOfCollection[i]);
            }
        }
        changedCollection = Array.from(ansSet);
        return changedCollection;
    };
};

/**
 * Делает операцию and
 * Ограничения как в or.
 * @returns {Function}
 */
module.exports.and = function () {
    // Получаем все аргументы
    var toIntersect = [].slice.apply(arguments);
    return function (collection) {
        var changedCollection = collection;
        var tmpArr = [];
        for (var elem = 0; elem < toIntersect.length; ++elem) {
            var partOfCollection = toIntersect[elem](collection);
            for (var i in partOfCollection) {
                tmpArr.push(partOfCollection[i]);
            }
            changedCollection = changedCollection.filter(function (value) {
                return tmpArr.indexOf(value) > -1;
            });
            tmpArr = [];
        }
        return changedCollection;
    };
};
