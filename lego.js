'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    if (collection.length === 0) {
        console.error('Телефонная книга пуста!');
        return;
    }
    //var resultCollection = arguments[1](collection);
    //for (var i in arguments.slice(2)) {
    //    resultCollection = arguments[i](resultCollection);
    //}
    console.log(arguments[3](collection));
    //return arguments[2](collection);
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
            console.error('Лимит не должен превышать размер телефонной книги!');
            return;
        }
        var resultCollection = [];
        for (var i = 0; i < n; i++) {
            resultCollection.push(collection[i])
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
    if (arguments.length === 0) {
        console.error('Нет параметров для фильтра!');
    }
    if (values.length === 0) {
        console.error('Не указаны значения для фильтра!');
        return;
    }
    return function(collection) {
        var resultCollection = [];
        for (var i in collection){
            for (var j in values) {
                if (collection[i][param] === values[j]) {
                    resultCollection.push(collection[i]);
                }
            }
        }
        return resultCollection;
    }
};

module.exports.filterEqual = function (param, value) {
    if (arguments.length === 0) {
        console.error('Нет параметров для фильтра!');
    }
    if (values.length === 0) {
        console.error('Не указано значение для фильтра!');
        return;
    }
    return function(collection) {
        var  resultCollection = [];
        for (var i in collection) {
            if (collection[i][param] === value) {
                resultCollection.push(collection[i]);
            }
        }
        return resultCollection;
    }
};

function findMin(collection, tempMin, param) {
    var result = 0;
    for (var i in collection) {
        if (collection[i][param] < tempMin[param]) {
            tempMin = collection[i];
            result = i;
        }
    }
    return i;
}

module.exports.sortBy = function (param, order) {
    if (arguments.length === 0) {
        console.error('Нет параметров для сортировки!');
        return;
    }
    //if (arguments[1] !== 'asc' || arguments[1] !== 'desc') {
    //    console.error('Несуществующий порядок сортировки!', order !== 'acs', arguments[1] !== 'asc');
    //    return;
    //}
    return function(collection) {
        var resultCollection = [];
        // ищем самый маленький элемент. если asc, push, если desc, unshift
        var minElementIndex = 0;
        collection = collection.splice(0, 1);
        for (var i = 0; i < collection.length; i++) {
            minElementIndex = findMin(collection, collection[minElementIndex], param);
            if (order === 'asc') {
                resultCollection.push(collection[minElementIndex]);
            } else {
                resultCollection.unshift(collection[minElementIndex]);
            }
            collection = collection.splice(collection[minElementIndex], 1);
        }
        return resultCollection;
    }
};

module.exports.format = function (arg, func) {
    // Магия
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

// TODO обернуть
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

module.exports.or = function (arg, func) {
    // Магия
};
