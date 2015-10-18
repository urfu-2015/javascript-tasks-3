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
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n > collection.length) {
            console.error('Лимит не должен превышать размер телефонной книги!');
            return;
        }
        var resultCollection = [];
        for (var i = 0; i < n; i++) {
            resultCollection.push(collection[i]);
        }
        return resultCollection;
    };

};

module.exports.select = function () {
    var args = [].slice.call(arguments);
    if (args.length === 0) {
        console.error('Не заданы параметры выборки!');
        return;
    }
    return function (collection) {
        var selectArgs = args;
        var resultCollection = [];
        for (var i in collection) {
            var newElement = {};
            for (var j in selectArgs) {
                newElement[selectArgs[j]] = collection[i][selectArgs[j]];
            }
            resultCollection.push(newElement);
        }
        return resultCollection;
    };
};

module.exports.filterIn = function (param, values) {
    if (arguments.length === 0 || arguments.length === 1) {
        console.error('Недостаточно параметров для фильтра!');
        return;
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
    if (arguments.length === 0 || arguments.length === 1) {
        console.error('Недостаточно параметров для фильтра!');
        return;
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
    if (arguments.length === 0 || arguments.length === 1) {
        console.error('Недосаточно параметров для сортировки!');
        return;
    }
    if (order !== 'asc' && order !== 'desc') {
        console.error('Несуществующий порядок сортировки!');
        return;
    }
    return function (collection) {
        var resultCollection = [];
        var minElementIndex = 0;
        var minElement = collection[0];
        var unchangeableLen = collection.length;
        for (var i = 0; i < unchangeableLen; i++) {
            minElementIndex = findMin(collection, param);
            minElement = collection[minElementIndex];
            if (order === 'asc') {
                resultCollection.push(minElement);
            } else {
                resultCollection.unshift(minElement);
            }
            collection.splice(minElementIndex, 1);
        }
        return resultCollection;
    };
};

module.exports.format = function (arg, func) {
    if (arguments.length === 0) {
        console.error('Нет параметров для форматирования!');
        return;
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
    for (var i in Object.keys(firstObj)) {
        if (firstObj[i] !== secondObj[i]) {
            return false;
        }
    }
    return true;
}

// TODO обернуть, допилить для 2+
module.exports.and = function (firstCollection, secondCollection) {
    var resultCollection = [];
    for (var i in firstCollection) {
        for (var j in secondCollection) {
            if (areEqual(firstCollection[i], secondCollection[j])) {
                resultCollection.push(firstCollection[i]);
                break;
            }
        }
    }
    return resultCollection;
};

module.exports.or = function (func) {
    // Магия
};
