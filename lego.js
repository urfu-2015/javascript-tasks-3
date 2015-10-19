'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection, selection, filtration, sorting, formating, limit) {
    var result = [];
    var oneRecord = {};
    for (var i = 0; i < collection.length; i++) {
        if ((collection[i][filtration.field] === filtration.values[0]) ||
            (collection[i][filtration.field] === filtration.values[1])) {
            for (var j = 0; j < selection.length; j++) {
                oneRecord[selection[j]] = collection[i][selection[j]];
            }
            result.push(oneRecord);
        }
        oneRecord = {};
    }
    result = result.sort(compareFields(sorting.field, sorting.type));
    for (var k = 0; k < result.length; k++) {
        result[k][formating.field] = formating.value(result[k][formating.field]);
    }
    for (var l = 0; l < limit; l++) {
        result.splice(limit, result.length - limit);
    }
    return result;
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
    // Магия
    if (n === undefined) {
        return 0;
    }
    return n;
};

module.exports.select = function () {
    // Магия
    var args = [].slice.call(arguments);
    return args;
};

module.exports.filterIn = function (field, value) {
    // Магия
    var filter = {
        field: field,
        values: value
    };
    return filter;
};

module.exports.filterEqual = function (n) {
    // Магия
};

function compareFields(field, type) {
    if (type === 'asc') {
        return function (firstNote, secondNote) {
            if (firstNote[field] > secondNote[field]) {
                return 1;
            }
            return -1;
        };
    }
    return function (firstNote, secondNote) {
        if (firstNote[field] < secondNote[field]) {
            return 1;
        }
        return -1;
    };
}

module.exports.sortBy = function (field, type) {
    // Магия
    var sorting = {
        field: field,
        type: type
    };
    return sorting;
};

module.exports.format = function (field, value) {
    // Магия
    var formating = {
        field: field,
        value: value
    };
    return formating;
};

module.exports.and = function (n) {

};

module.exports.or = function (n) {

};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
