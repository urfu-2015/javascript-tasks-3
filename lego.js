'use strict';

module.exports.query = function (collection) {
    var argsLength = arguments.length;
    for (var i = 1; i < argsLength; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};
module.exports.limit = function (n) {
    return function (collection) {
        if (n < 0) {
            return collection.slice(0, 0);
        }
        return collection.slice(0, n);
    };
};
module.exports.format = function (feature, method) {
    return function (collection) {
        collection.forEach(function (contact) {
            contact[feature] = method(contact[feature]);
        });
        return collection;
    };
};
module.exports.sortBy = function (feature, sortOrder) {
    var order = sortOrder === 'asc' ? 1 : -1;
    return function (collection) {
        return collection.sort(function (a, b) {
            var res = a[feature] > b[feature] ? 1 : -1;
            return res * order;
        });
    };
};
module.exports.filterEqual = function (feature, value) {
    return function (collection) {
        return collection.filter(function (contact) {
            return contact[feature] === value;
        });
    };
};
module.exports.filterIn = function (feature, args) {
    return function (collection) {
        return collection.filter(function (contact) {
            /*return args.some(arg => contact[feature] === arg);*/
            return args.indexOf(contact[feature]) != -1;
        });
    };
};
module.exports.select = function () {
    var features = [].slice.call(arguments);
    return function (collection) {
        collection.forEach(function (contact) {
            Object.keys(contact).forEach(function (key) {
                if (features.indexOf(key) === -1) {
                    delete contact[key];
                }
            });
        });
        return collection;
    };
};
module.exports.and = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        args.forEach(function (arg) {
            collection = arg(collection);
        });
        return collection;
    };
};
module.exports.or = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        args.forEach(function (arg) {
            var copy = collection.slice();
            var res = arg(copy);
            /*changedCollection = changedCollection.concat(res);*/
            res.forEach(function (contact) {
                if (changedCollection.indexOf(contact) === -1) {
                    changedCollection.push(contact);
                }
            });
        });
        return changedCollection;
    };
};
