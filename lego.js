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
    var cloneCollection = deepClone(collection);
    var args = [].slice.call(arguments, 1);

    return args.reduce(function (result, current) {
        return current(result);
    }, cloneCollection);
}

function select() {
    var attrNames = [].slice.call(arguments);
    return function (collection) {
        collection.forEach(function (item) {
            for (var prop in item) {
                if (item.hasOwnProperty(prop) && attrNames.indexOf(prop) < 0) {
                    delete item[prop];
                }
            }
        });
        return collection;
    };
}

function filterIn(attrName, attrValues) {
    return function (collection) {
        return collection.filter(function (item) {
            return attrValues.indexOf(item[attrName]) !== -1;
        });
    };
}

function filterEqual(attrName, attrValue) {
    return function (collection) {
        return collection.filter(function (item) {
            return item[attrName] === attrValue;
        });
    };
}

function sortBy(attrName, direct) {
    return function (collection) {
        direct = (direct === 'asc') ? 1 : -1;
        collection.sort(function (a, b) {
            return a[attrName] > b[attrName] ? direct : -direct;
        });
        return collection;
    };
}

function format(attrName, func) {
    return function (collection) {
        collection.forEach(function (item) {
            item[attrName] = func(item[attrName]);
        });

        return collection;
    };
}

function limit(n) {
    return function (collection) {
        return collection.slice(0, n);
    };
}

function and() {
    var args = [].slice.call(arguments);

    return function (collection) {
        return args.reduce(function (result, current) {
            return current(result);
        }, collection);
    };
}

function or() {
    var args = [].slice.call(arguments);

    return function (collection) {
        var result = [];
        result = args.reduce(function (res, current) {
            return res.concat(current(collection));
        }, result);

        var deleteIndex = 0;

        // delete repeated objects
        result.forEach(function (item, i) {
            while ((deleteIndex = result.indexOf(item, i + 1)) > 0) {
                result.splice(deleteIndex, 1);
            }
        });

        return result;
    };
}

function reverse() {
    return function (collection) {
        return collection.reverse();
    };
}

function deepClone(collection) {
    return JSON.parse(JSON.stringify(collection));
}
