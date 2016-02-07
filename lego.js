'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function () {
    var collection = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
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

// Оператор select, который выбирает только нужные поля
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

// Обязательно выбираем тех, кто любит Яблоки и Картофель (самое важное !!!)
module.exports.filterIn = function (field, type) {
    return function (collection) {
        return collection.filter(function(item){
            return type.indexOf(item[field]) !== -1;
        });
    };
};

// Отсортируем их по возрасту
module.exports.sortBy = function (field, type) {
    return function (collection) {
        return collection.sort(function (a, b) {
            var result = Number(a[field]) - Number(b[field]);
            return type === 'desc' ? -result : result;
        });
    }
};

// А пол выведем только первой буквой для удобства
module.exports.format = function (field, fn) {
    return function (collection) {
        return collection.map(function (item) {
            item[field] = fn(item[field]);

            return item;
        })
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return collection.filter(function(item, i){
            return i < n;
        });
    };
};

// Будет круто, если реализуете операторы:
// or и and
//реализую в следующем PR
