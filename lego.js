'use strict';

/**
 * Метод, который выполняет операции над коллекцией один за другим
 * @param collection
 * @returns {*} changedCollection
 */
module.exports.query = function (collection /* операторы через запятую */) {
    var changedCollection = collection;
    for (var funcOp in arguments) {
        if (funcOp != '0') {
            changedCollection = arguments[funcOp](changedCollection);
        }
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
        var changedCollection = [];
        for (var elem = 0; elem < n; ++elem) {
            changedCollection.push(collection[elem]);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
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
                if (fieldsToChoose.indexOf(key) != -1) {
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
module.exports.filterIn = function () {
    var fieldToFilterBy = arguments[0];
    var valuesToFilterBy = arguments[1];
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            for (var key in collection[elem]) {
                if (valuesToFilterBy.indexOf(collection[elem][fieldToFilterBy]) != -1) {
                    changedCollection.push(collection[elem]);
                }
            }
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Сортирует по возрастанию или убыванию
 * @param key
 * @param order
 * @returns {Function}
 */
module.exports.sortBy = function (key, order) {
    return function (collection) {
        function comparePeople(a, b) {
            if (parseInt(a[key]) > parseInt(b[key])) {
                return 1;
            }
            if (parseInt(a[key]) < parseInt(b[key])) {
                return -1;
            }
        }
        var changedCollection = collection.sort(comparePeople);
        if (order === 'desc') {
            changedCollection.reverse();
        }
        return changedCollection;
    };
};

/**
 * Изменяет значение по выбранному ключу
 * @param key
 * @param showFn
 * @returns {Function}
 */
module.exports.format = function (key, showFn) {
    return function (collection) {
        var changedCollection = [];
        for (var elem = 0; elem < collection.length; ++elem) {
            var changedMan = collection[elem];
            changedMan[key] = showFn(collection[elem][key]);
            changedCollection.push(changedMan);
        }
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

/**
 * Выбирает только заданные значения по заданным полям
 * @param key
 * @param expectedVal
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
        ansSet.forEach(function (value) {
            changedCollection.push(value);
        });
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
