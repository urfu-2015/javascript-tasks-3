'use strict';

module.exports.query = function () {
    var newArgs = Array.prototype.slice.call(arguments);
    var result = newArgs[0];
    for (var i = 1; i < newArgs.length; i++) {
        result = newArgs[i](result);
    };
    return result;
};

module.exports.limit = function (n) {
    return function (collection) {
        var changedCollection = collection.slice(0, n);
        return changedCollection;
    };
};

module.exports.sortBy = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        for (var property in collection[0]) {
            if (args[0] == property) {
                if (args[1] == 'asc') {
                    var changedCollection = collection.sort(function (a, b) {
                        return a[property] - b[property];
                    });
                } else if (args[1] == 'desc') {
                    var changedCollection = collection.sort(function (a, b) {
                        return b[property] - a[property];
                    });
                };
                return changedCollection;
            };
        };
    };
};

module.exports.filterIn = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var item in collection) {
            var copy = {};
            for (var property in collection[item]) {
                if (args.indexOf(property) != -1 && args[1].indexOf(collection[item][property]) != -1) {
                    copy = collection[item];
                    changedCollection.push(copy);
                    break;
                };
            };
        };
        return changedCollection;
    };
};

module.exports.filterEqual = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var item in collection) {
            var copy = {};
            for (var property in collection[item]) {
                if (args.indexOf(property) != -1 && args[1] == collection[item][property]) {
                    copy = collection[item];
                    changedCollection.push(copy);
                    break;
                };
            };
        };
        return changedCollection;
    };
};

module.exports.select = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var item in collection) {
            var copy = {};
            for (var property in collection[item]) {
                if (args.indexOf(property) != -1) {
                    copy[property] = collection[item][property];
                };
            };
            changedCollection.push(copy);
        };
        return changedCollection;
    };
};

module.exports.format = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        for (var property in collection[0]) {
            if (args.indexOf(property) != -1) {
                for (var item in collection) {
                    var copy = {};
                    copy = collection[item];
                    copy[property] = args[1](copy[property]);
                    changedCollection.push(copy);
                };
                return changedCollection;
            };
        };
    };
};

module.exports.and = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var result = collection;
        for (var i = 0; i < args.length; i++) {
            result = args[i](result);
        };
        return result;
    };
};

module.exports.or = function () {
    var args = Array.prototype.slice.call(arguments);
    return function (collection) {
        var result = [];
        for (var i = 0; i < args.length; i++) {
            var tempResult = args[i](collection);
            for (var item in tempResult)
                if (result.indexOf(tempResult[item]) == -1) {
                    result.push(tempResult[item]);
                };
            };
        return result;
    };
};
