'use strict';

/*
 Метод, который будет выполнять операции над коллекцией один за другим
 */
module.exports.query = function (collection) {
    for (var i=1; i<arguments.length; ++i) {
        collection = (arguments[i])(collection);
    }
    return collection;
};

/*
 Оператор reverse, который переворачивает коллекцию
 */
module.exports.reverse = function () {
    return function (collection) {
        return collection.concat([]).reverse();
    };
};

/*
 Оператор limit, который выбирает первые N записей
 */
module.exports.limit = function (size) {
    return function (collection) {
        if (size < 0) {
            console.error('Ошибка! Неверное значение аргумента!');
            return;
        }
        return collection.slice(0, size);
    };
};

/*
 Оператор select, который оставляет указанные поля
 */
module.exports.select = function() {
    var properties = [].slice.call(arguments);
    return function (collection) {
        // Оставляем только нужные поля
        return collection.map(function(element) {
            var tmpElement = {};
            for (var i in properties) {
                var property = properties[i];
                if (property in element)
                    tmpElement[property] = element[property];
            }
            return tmpElement;
        });
    }
};

/*
 Оператор filterIn, который фильтрует по массиву значений
 */
module.exports.filterIn = function(property, values) {
    return function (collection) {
        return collection.filter(function (element) {
            return values.indexOf(element[property]) >= 0;
        });
    }
};

/*
 Оператор filterEqual, аналогично пред. только теперь элемент один
 */
module.exports.filterEqual = function(property, value) {
    return function (collection) {
        return collection.filter(function (element) {
            return value === element[property];
        });
    }
};

/*
 Оператор sortBy, который сортирует O_O
 */
module.exports.sortBy = function(property, order) {
    return function (collection) {
        order = order === 'asc' ? 1 : -1;
        return collection.concat([]).sort(function (a, b) {
            if (a[property] > b[property])
                return order;
            if (a[property] < b[property])
                return -order;
            return 0;
        });
    }
};

/*
 Оператор format, который форматирует элементы согласно format
 */
module.exports.format = function(property, format) {
    return function (collection) {
        collection.map(function (element) {
            element[property] = format(element[property]);
            return element;
        });
        return collection;
    }
};

/*
 Будет круто, если реализуете операторы: or и and
 */
module.exports.or = function() {
    var functions = [].slice.call(arguments);
    return function (collection) {
        var result = [];
        functions.forEach(function (element) {
            var tempCollection = element(collection);
            tempCollection.forEach(function (element) {
                if (result.indexOf(element) < 0) {
                    result.push(element);
                }
            });
        });
        return result;
    }
};

module.exports.and = function() {
    var functions = [].slice.call(arguments);
    return function (collection) {
        functions.forEach(function (elemnet) {
            collection = elemnet(collection);
        });
        return collection;
    }
};
