'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var operators = [].slice.call(arguments);
    operators.splice(0, 1);
    operators.forEach(function (operator) {
        collection = operator(collection);
    });
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

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var result = [];
        var resultElem = {};
        collection.forEach(function (elem) {
            fields.forEach(function (field) {
                if (field in elem) {
                    resultElem[field] = elem[field];
                }
            });
            result.push(resultElem);
        });
        return result;
    };
};

//
module.exports.filterIn = function () {
    var args = [].slice.call(arguments);
    var filterField = args[0];
    var filterValues = args[1];
    return function (collection) {
        var result = [];
        collection.forEach(function (elem) {
            filterValues.forEach(function (value) {
                if (elem[filterField] == value) {
                    result.push(elem);
                }
            });
        });
        return result;
    };
};

//
module.exports.filterEqual = function (field, value) {
    return function (collection) {
        collection.filter(elem => (elem[field] === value));
    };
};

//
module.exports.sortBy = function (field, order) {
    return function (collection) {
        var newCollection = collection.sort((a, b) => a[field] > b[field] ? 1 :
            a[field] < b[field] ? -1 : 0);
        if (order === 'desc') {
            return newCollection.reverse();
        };
        return newCollection;
    };
};

//
module.exports.format = function (field, formatter) {
    return function (collection) {
        collection.forEach(function (elem) {
            elem[field] = formatter(elem[field]);
        });
        return collection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (size) {
    return function (collection) {
        return collection.slice(0, size);
    };
};

// Будет круто, если реализуете операторы:
// or и and
module.exports.or = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        var resultCollection = [];
        operators.forEach(function (operator) {
            resultCollection.push(operator(collection));
        });
        return resultCollection;
    };
};

//
module.exports.and = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        operators.forEach(function (operator) {
            collection = operator(collection);
        });
        return collection;
    };
};
