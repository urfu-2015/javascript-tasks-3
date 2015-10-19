'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
function query(collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
}

// Оператор reverse, который переворачивает коллекцию
function reverse() {
    return function (collection) {
        return collection.slice(0).reverse();
    };
}

// Оператор limit, который выбирает первые N записей
function limit(n) {
    return function (collection) {
        if (n < 0) {
            return [];
        }
        if (collection.length >= n) {
            return collection.slice(0, n);
        } else {
            return collection.slice(0);
        }
    };
}

function select() {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var record = {};
            for (var j = 0; j < fields.length; j++) {
                if (collection[i][fields[j]]) {
                    record[fields[j]] = collection[i][fields[j]];
                }
            }
            changedCollection.push(record);
        }
        return changedCollection;
    };
}

function filterIn(field, values) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i][field]) {
                for (var j = 0; j < values.length; j++) {
                    if (collection[i][field] === values[j]) {
                        changedCollection.push(collection[i]);
                    }
                }
            }
        }
        return changedCollection;
    };
}

function filterEqual(field, value) {
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i][field] === value) {
                changedCollection.push(collection[i]);
            }
        }
        return changedCollection;
    };
}

function sortBy(field, order) {
    return function (collection) {
        var changedCollection = collection.slice(0);
        var sign = 1;
        if (order !== 'asc' && order !== 'desc') {
            return changedCollection;
        }
        if (order === 'desc') {
            sign = -1;
        }
        changedCollection.sort(function (a, b) {
            if (a[field] >= b[field]) {
                return sign;
            }
            if (a[field] < b[field]) {
                return -1 * sign;
            }
        });
        return changedCollection;
    };
}

function format(field, func) {
    return function (collection) {
        var changedCollection = collection.slice(0);
        for (var i = 0; i < collection.length; i++) {
            changedCollection[i][field] = func(changedCollection[i][field]);
        }
        return changedCollection;
    };
}

function and() {

}

function or() {

}

module.exports = {
    and: and,
    or: or,
    query: query,
    reverse: reverse,
    limit: limit,
    select: select,
    filterIn: filterIn,
    filterEqual: filterEqual,
    sortBy: sortBy,
    format: format
};
