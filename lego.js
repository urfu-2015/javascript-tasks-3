'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var collectionCopy = collection.slice();
    for (var i = 1; i < arguments.length; i++) {
        collectionCopy = (arguments[i])(collectionCopy);
    }
    return collectionCopy;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    var isValidIndex = true;
    if (n < 0) {
        console.error('Неверный индекс! Оператор limit не будет менять коллекцию');
        isValidIndex = false;
    }
    return function (collection) {
        if (isValidIndex) {
            return collection.slice(0, n);
        } else {
            return collection;
        }
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (element) {
            var newElement = {};
            var keysInThisElement = Object.keys(element);
            fields.forEach(function (key) {
                if (keysInThisElement.indexOf(key) !== -1) {
                    newElement[key] = element[key];
                }
            });
            return newElement;
        });
    };
};

module.exports.filterIn = function (field, valuesArray) {
    return function (collection) {
        return collection.filter(function (element) {
            return valuesArray.indexOf(element[field]) !== -1;
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (element) {
            return element[field] == value;
        });
    };
};

var __getSortPredicate = function (field, order) {
    var orderMultiplicator = (order == 'asc') ? 1 : -1;
    return function (a, b) {
        var orderAnswer;
        if (a[field] === b[field]) {
            orderAnswer = 0;
        }
        if (a[field] > b[field]) {
            orderAnswer = 1;
        }
        if (a[field] < b[field]) {
            orderAnswer = -1;
        }
        return orderAnswer * orderMultiplicator;
    };
};

module.exports.sortBy = function (field, order) {
    var isValidArguments = true;
    if (order !== 'asc' && order !== 'desc') {
        console.error('Неправильный аргумент! SortBy не будет менять коллекцию');
        isValidArguments = false;
    }
    return function (collection) {
        if (!isValidArguments) {
            return collection;
        }
        return collection.sort(__getSortPredicate(field, order));
    };
};

module.exports.format = function (field, formatFunc) {
    return function (collection) {
        collection.forEach(function (element) {
            element[field] = formatFunc(element[field]);
        });
        return collection;
    };
};

module.exports.or = function () {
    var filters = [].slice.call(arguments);
    return function (collection) {
        var resultCollection = [];
        filters.forEach(function (filter) {
            var collectionByThisFilter = filter(collection);
            collectionByThisFilter.forEach(function (element) {
                if (resultCollection.indexOf(element) === -1) {
                    resultCollection.push(element);
                }
            });
        });
        return resultCollection;
    };
};

module.exports.and = function () {
    var filters = [].slice.call(arguments);
    return function (collection) {
        var resultCollection = collection.slice();
        filters.forEach(function (filter) {
            var collectionByThisFilter = filter(collection);
            for (var i = 0; i < resultCollection.length; i++) {
                var elementIndex = collectionByThisFilter.indexOf(resultCollection[i]);
                if (elementIndex == -1) {
                    resultCollection.splice(i, 1);
                    i--;
                }
            }
        });
        return resultCollection;
    };
};
