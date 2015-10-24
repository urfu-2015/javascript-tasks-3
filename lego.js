'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    if (collection.length === 0) {
        console.error('Телефонная книга пуста!');
        return;
    }
    var resultCollection = collection;
    for (var i = 1; i < arguments.length; i++) {
        resultCollection = arguments[i](resultCollection);
    }
    console.log(resultCollection);
    return resultCollection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n > collection.length) {
            return collection;
        }
        if (n <= 0) {
            return '';
        }
        var resultCollection = [];
        for (var i = 0; i < n; i++) {
            resultCollection.push(collection[i]);
        }
        return resultCollection;
    };

};

module.exports.select = function () {
    var selectArgs = [].slice.call(arguments);
    return function (collection) {
        if (!selectArgs.length) {
            return collection;
        }
        var resultCollection = [];
        for (var i in collection) {
            var newElement = {};
            for (var j in selectArgs) {
                if (typeof collection[i][selectArgs[j]] !== 'undefined') {
                    newElement[selectArgs[j]] = collection[i][selectArgs[j]];
                }
            }
            resultCollection.push(newElement);
        }
        return resultCollection;
    };
};

module.exports.filterIn = function (param, values) {
    if (arguments.length <= 1) {
        return '';
    }
    return function (collection) {
        var resultCollection = [];
        for (var i in collection) {
            for (var j in values) {
                if (collection[i][param] === values[j]) {
                    resultCollection.push(collection[i]);
                }
            }
        }
        return resultCollection;
    };
};

module.exports.filterEqual = function (param, value) {
    if (arguments.length <= 1) {
        return '';
    }
    return module.exports.filterIn(param, [value]);
};

function findMin(collection, param) {
    var result = 0;
    var tempMin = collection[result];
    for (var i in collection) {
        if (collection[i][param] <= tempMin[param]) {
            tempMin = collection[i];
            result = i;
        }
    }
    return result;
}

module.exports.sortBy = function (param, order) {
    if (['asc', 'desc'].indexOf(order) < 0 || arguments.length <= 1) {
        return '';
    }
    return function (collection) {
        var resultCollection = [];
        var minElementIndex = 0;
        var minElement = collection[0];
        var unchangeableLen = collection.length;
        for (var i = 0; i < unchangeableLen; i++) {
            minElementIndex = findMin(collection, param);
            minElement = collection[minElementIndex];
            resultCollection.push(minElement);
            collection.splice(minElementIndex, 1);
        }
        if (order === 'desc') {
            resultCollection.reverse();
        }
        return resultCollection;
    };
};

module.exports.format = function (arg, func) {
    if (!arguments.length) {
        return '';
    }
    return function (collection) {

        for (var i in collection) {
            collection[i][arg] = func(collection[i][arg]);
        }
        return collection;
    };
};

// Будет круто, если реализуете операторы:
// or и and

function areEqual(firstObj, secondObj) {
    var keys = Object.keys(firstObj);
    for (var i in keys) {
        if (firstObj[keys[i]] !== secondObj[keys[i]]) {
            return false;
        }
    }
    return true;
}

module.exports.and = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        if (!operators.length) {
            return '';
        }
        var tempCollection1 = operators[0](collection);
        var arrOfIntersected = new Array(tempCollection1.length);
        for (var i = 1; i < operators.length; i++) {
            var tempCollection2 = operators[i](collection);
            for (var j in tempCollection1) {
                for (var k in tempCollection2) {
                    if (areEqual(tempCollection1[j], tempCollection2[k])) {
                        arrOfIntersected[j] = true;
                        break;
                    }
                }
            }
        }
        var resultCollection = [];
        for (var i in arrOfIntersected) {
            if (arrOfIntersected[i]) {
                resultCollection.push(tempCollection1[i]);
            }
        }
        return resultCollection;
    };
};

module.exports.or = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        if (!operators.length) {
            return '';
        }
        var resultCollection = operators[0](collection);
        for (var i = 1; i < operators.length; i++) {
            var tempCollection = operators[i](collection);
            for (var j in tempCollection) {
                var isNotInCollection = true;
                for (var k in resultCollection) {
                    if (areEqual(resultCollection[k], tempCollection[j])) {
                        isNotInCollection = false;
                    }
                }
                if (isNotInCollection) {
                    resultCollection.push(tempCollection[j]);
                }
            }
        }
        return resultCollection;
    };
};
