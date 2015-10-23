'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        var action = arguments[i];
        var actionName = action[0];
        var actionFun = action[1];

        switch (actionName) {
            // функции типа coll обрабатывают всю коллекцию
            case 'coll':
                collection = actionFun(collection);
                break;
            // функции типа filter проверяют запись на соответствие условию
            case 'filter':
                collection = collection.filter(actionFun);
                break;
            // функции типа transform трансформируют запись
            case 'transform':
                collection = collection.map(actionFun);
                break;
        }
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return ['coll', function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    }];
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return ['coll', function (collection) {
        if (n >= 0) {
            return collection.slice(0, n);
        } else {
            throw new RangeError('Parameter must be between 0 and ' + collection.length);
        }
    }];
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.select = function () {
    var selectedFields = [].slice.call(arguments);
    return ['transform', function (record) {
        return selectedFields.reduce(function (result, field) {
            if (field in record) {
                result[field] = record[field];
            }
            return result;
        }, {});
    }];
};

module.exports.filterIn = function (field, values) {
    return ['filter', function (record) {
        return values.some(function (value) {
            return value === record[field];
        });
    }];
};

module.exports.filterEqual = function (field, value) {
    return ['filter', function (record) {
        return value === record[field];
    }];
};

module.exports.sortBy = function (field, type) {
    return ['coll', function (collection) {
        var sortValue = {asc: 1, desc: -1}[type] || 1;
        return collection.sort(function (record1, record2) {
            if (record1[field] === record2[field]) {
                return 0;
            } else if (record1[field] > record2[field]) {
                return sortValue;
            } else {
                return -sortValue;
            }
        });
    }];
};

module.exports.format = function (field, func) {
    return ['transform', function (record) {
        record[field] = func(record[field]);
        return record;
    }];
};

// Будет круто, если реализуете операторы:
// or и and

module.exports.or = function () {
    var actions = [].slice.call(arguments);
    return logicalAction(function (result, value) {
        return result || value;
    }, false, actions);
};

module.exports.and = function () {
    var actions = [].slice.call(arguments);
    return logicalAction(function (result, value) {
        return result && value;
    }, true, actions);
};

var logicalAction = function (reduceFun, reduceInit, actions) {
    return ['filter', function (record) {
        return actions.map(function (action) {
            if (action[0] !== 'filter') {
                throw new Error('Logical action accepts only filter actions');
            }
            return action[1](record);
        }).reduce(reduceFun, reduceInit);
    }];
};
