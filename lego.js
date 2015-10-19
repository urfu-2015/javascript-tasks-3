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
        return collection.reverse();
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
            for (var i in values)
                if (values[i] === element[property])
                    return true;
            return false;
        });
    }
};

/*
 Оператор filterEqual, аналогично пред. только теперь элемент один
 */
module.exports.filterEqual = function(property, value) {
    return function (collection) {
        return collection.filter(function (element) {
            if (value === element[property])
                return true;
            return false;
        });
    }
};

/*
 Оператор sortBy, который сортирует O_O
 */
module.exports.sortBy = function(property, type) {
    return function (collection) {
        var modify = type === 'asc' ? 1 : -1;
        // Обычная сортировка в зависимости от type
        return collection.sort(function (a, b) {
            if (a[property] > b[property])
                return modify;
            if (a[property] < b[property])
                return modify * (-1);
            return 0;
        });
    }
};

/*
 Оператор format, который формирует -_-
 */
module.exports.format = function(property, format) {
    return function (collection) {
        collection.forEach(function (element) {
            element[property] = format(element[property]);
        });
        return collection;
    }
};

// Будет круто, если реализуете операторы:
// or и and
