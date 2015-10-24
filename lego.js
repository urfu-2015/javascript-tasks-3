'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; ++i) {
        collection = arguments[i](collection);
    }
    console.log(collection);
};

module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        if (n < 0) {
            return [];
        }
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var attributesCollection = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (contact) {
            var changedContact = {};
            attributesCollection.forEach(function(attribute) {
                changedContact[attribute] = contact[attribute];
            });
            return changedContact;
        });
    };
};

module.exports.filterIn = function (attribute, values) {
    return function (collection) {
        return collection.filter(function (contact) {
            return values.some(value => contact[attribute] === value);
        });
    };
};

module.exports.filterEqual = function (attribute, value) {
    return function (collection) {
        return collection.filter(function (contact) {
            return contact[attribute] === value;
        });
    };
};

module.exports.sortBy = function (attribute, typeSort) {
    return function (collection) {
        return collection.sort(function (a, b) {
            var method = (typeSort === 'asc') ? 1 : -1;
            if (isNaN(a[attribute])) {
                return method * a[attribute].localeCompare(b[attribute]);
            }
            return method * (a[attribute] - b[attribute]);
        });
    };
};

module.exports.format = function (attribute, method) {
    return function (collection) {
        return collection.map(function (contact) {
            var contactClone = Object.assign({}, contact);
            contactClone[attribute] = method(contactClone[attribute]);
            return contactClone;
        });
    };
};
