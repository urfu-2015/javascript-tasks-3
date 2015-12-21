'use strict';

module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

module.exports.reverse = function () {
    return function (collection) {
        var newCollection = collection.reverse();
        return newCollection;
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

module.exports.filterIn = function (fieldName, filterValues) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            var validFind = new RegExp(contact[fieldName],'i');
            if (!validFind.exec(filterValues)) {
                newCollection.push(contact);
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (fieldName, value) {
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            if (contact[fieldName] === value) {
                newCollection.push(contact);
            }
        }
        return newCollection;
    };
};
module.exports.format = function (fieldName, newToString) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            contact[fieldName] = newToString(contact[fieldName]);
        }
        return collection;
    };
};

module.exports.sortBy = function (field, sortType) {
    if (sortType === 'desc') {
        var type = -1;
    } else {
        var type = 1;
    }
    return function (collection) {
        var sortFunction = function (a, b) {
            if (a[field] > b[field]) {
                return type;
            }
            if (a[field] < b[field]) {
                return -type;
            }
            return 0;
        };
        return collection.sort(sortFunction);
    };
};

module.exports.select = function () {
    var oldPhoneBook = arguments;
    return function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            var contact = collection[i];
            var newContact = {};
            for (var j = 0; j < oldPhoneBook.length; j++) {
                var field = oldPhoneBook[j];
                if (contact[field] !== undefined) {
                    newContact[field] = contact[field];
                }
            }
            newCollection.push(newContact);
        }
        return newCollection;
    };
};
