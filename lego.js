'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var operators = [].slice.call(arguments, 1);
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
        return collection.map(function (elem) {
            return fields.reduce(function (accumulator, field) {
                if (field in elem) {
                    accumulator[field] = elem[field];
                }
                return accumulator;
            },
            {});
        });
    };
};

//
module.exports.filterIn = function (filterField, filterValues) {
    return function (collection) {
        var result = [];
        collection.forEach(function (elem) {
            filterValues.forEach(function (value) {
                if (elem[filterField] === value) {
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
        return collection.filter(elem => elem[field] === value);
    };
};

//
module.exports.sortBy = function (field, order) {
    return function (collection) {
        var newCollection = collection.sort((a, b) => a[field] > b[field] ? 1 :
            a[field] < b[field] ? -1 : 0);
        return (order === 'desc') ? newCollection.reverse() : newCollection;
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
        return operators.reduce(function (resultCollection, operator) {
            var temp = operator(collection);
            temp.forEach(function (tempElem) {
                if (resultCollection.indexOf(tempElem) === -1) {
                    resultCollection.push(tempElem);
                }
            });
            return resultCollection;
        }, []);
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
