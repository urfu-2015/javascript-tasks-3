'use strict';

module.exports.query = query;
module.exports.select = select;
module.exports.filterIn = filterIn;
module.exports.filterEqual = filterEqual;
module.exports.sortBy = sortBy;
module.exports.format = format;
module.exports.limit = limit;
module.exports.and = and;
module.exports.or = or;
module.exports.reverse = reverse;

function query(collection) {
    var myCollection = JSON.stringify(collection);
    myCollection = JSON.parse(myCollection);
    var args = [].slice.call(arguments, 1);
    args.unshift(myCollection);

    myCollection = args.reduce(function (result, current) {
        return current(result);
    });

    return myCollection;
}

function select() {
    var attrNames = [].slice.call(arguments);
    return function(collection) {
        collection.forEach(function (item) {
            for (var prop in item) {
                if (attrNames.every(elem => elem !== prop)) {
                    delete item[prop];
                }
            }
        });

        return collection;
    };
}

function filterIn(attrName, attrValues) {
    return function(collection) {
        return collection.filter(function (item) {
            return attrValues.some(elem => elem === item[attrName]);
        });
    };
}

function filterEqual(attrName, attrValue) {
    return function(collection) {
        return collection.filter(function (item) {
            return item[attrName] === attrValue;
        });
    };
}

function sortBy(attrName, direct) {
    return function(collection) {
        collection.sort(function (a, b) {
            return a[attrName] - b[attrName];
        });
        return direct === 'desc' ? collection.reverse() : collection;
    };
}

function format(attrName, func) {
    return function(collection) {
        collection.forEach(function (item) {
            item[attrName] = func(item[attrName]);
        });

        return collection;
    };
}

function limit(n) {
    return function(collection) {
        return collection.slice(0, n);
    };
}

function and() {
    var args = [].slice.call(arguments);

    return function(collection) {
        args.unshift(collection);
        return args.reduce(function (result, current) {
            return current(result);
        });
    };
}

function or() {
    var args = [].slice.call(arguments);

    return function(collection) {
        var result = [];
        args.some(function (item) {
            result = item(collection);
            return result.length ? true : false;
        });
        return result;
    };
}

function reverse() {
    return function (collection) {
        return collection.reverse();
    };
}
