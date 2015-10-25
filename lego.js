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
            return collection;
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
                var key = fields[j];
                if (collection[i][key]) {
                    record[key] = collection[i][key];
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
            if (!collection[i][field]) {
                continue;
            }
            for (var j = 0; j < values.length; j++) {
                if (collection[i][field] === values[j]) {
                    changedCollection.push(collection[i]);
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
            if (a[field] > b[field]) {
                return sign;
            }
            if (a[field] === b[field]) {
                return 0;
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
        return collection.map(function (record) {
            record[field] = func(record[field]);
            return record;
        });
    };
}

function and() {
    var filters = [].slice.call(arguments);
    return function (collection) {
        for (var i = 0; i < filters.length; i++) {
            collection = filters[i](collection);
        }
        return collection;
    };
}

function or() {
    var filters = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < filters.length; i++) {
            var filteredCollection = filters[i](collection);
            for (var j = 0; j < filteredCollection.length; j++) {
                if (changedCollection.indexOf(filteredCollection[j]) === -1) {
                    changedCollection.push(filteredCollection[j]);
                }
            }
        }
        return changedCollection;
    };
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
