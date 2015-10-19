'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var length = arguments.length;
    var changedCollection = collection;
    for (var i = 1; i < length; i++) {
        changedCollection = arguments[i](changedCollection);
    }
    return changedCollection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {

        // Возращаем изменённую коллекцию
        return collection.reverse();
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        var changedCollection = [];
        for (var count = 0; count < n; count++) {
            changedCollection.push(collection[count]);
        }
        return changedCollection;
    };
};

module.exports.select = function () {
    var args = arguments;
    return function (collection) {
        var changedCollection = [];
        for (var count = 0; count < collection.length; count++) {
            var record = {};
            for (var arg = 0; arg < args.length; arg++) {
                record[args[arg]] = collection[count][args[arg]];
            }
            changedCollection.push(record);
        }
        return changedCollection;
    };
};

module.exports.filterIn = function (key, values) {
    return function (collection) {
        var changedCollection = [];
        for (var count=0; count<collection.length; count++) {
            if (values.indexOf(collection[count][key]) != -1) {
                changedCollection.push(collection[count]);
            }
        }
        return changedCollection;
    };
};

module.exports.filterEqual = function (key, value) {
    return function (collection) {
        var changedCollection = [];
        for (var count=0; count<collection.length; count++) {
            if (value == collection[count][key]) {
                changedCollection.push(collection[count]);
            }
        }
        return changedCollection;
    };
};

module.exports.sortBy = function (key, type) {
    return function (collection) {
        var changedCollection = collection;
        changedCollection.sort(function (a, b) {
            return a[key]<b[key] ? -1 : 1;
        });
        if (type == 'desc') {
            changedCollection = changedCollection.reverse();
        }
        return changedCollection;
    };
};

module.exports.format = function (key, func) {
    return function (collection) {
        var changedCollection = [];
        for (var count=0; count<collection.length; count++) {
            changedCollection.push(collection[count]);
            changedCollection[count][key] = func(collection[count][key]);
        }
        return changedCollection;
    };
};

module.exports.and = function () {
    var length = arguments.length;
    var args = arguments;
    return function (collection) {
        var changedCollection = collection;
        for (var i = 0; i < length; i++) {
            changedCollection = args[i](changedCollection);
        }
        return changedCollection;
    };
};

module.exports.or = function () {
    var length = arguments.length;
    var args = arguments;
    return function (collection) {
        var changedCollection = [];
        for (var i = 0; i < length; i++) {
            var newCollection = args[i](collection);
            for (var j = 0; j < newCollection.length; j++){
                if (!Contains(changedCollection, newCollection[j])){
                    changedCollection.push(newCollection[j]);
                }
            }
        }
        return changedCollection;
    };
};

function Contains(collection, item){
    for (var record = 0; record < collection.length; record++) {
        var fields = Object.keys(collection[record]);
        var equals = true;
        for (var currentField = 0; currentField < fields.length; currentField++) {
            if (item[fields[currentField]] !== collection[record][fields[currentField]]) {
                equals = false;
            }
        }
        if (equals){
            return true;
        }
    }
    return false;
}

// Будет круто, если реализуете операторы:
// or и and
