'use strict';

module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

module.exports.reverse = function () {
    return collection => collection.reverse();
};

module.exports.limit = function (n) {
    return collection => collection.slice(0, n);
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return collection =>
        collection.map(contact => {
            var newContact = {};
            fields.forEach(function (field) {
                newContact[field] = contact[field];
            });
            return newContact;
        });
};

module.exports.filterIn = function (field, values) {
    return collection =>
        collection.filter(contact =>
            values.find(value =>
                value.toLowerCase() === contact[field].toLowerCase()));
};

module.exports.filterEqual = function (field, value) {
    return collection =>
        collection.filter(contact =>
            contact[field] === value);
};

module.exports.sortBy = function (field, type) {
    type = type === 'asc' ? 1 : -1;
    return collection =>
        collection.sort((a, b) =>
            a[field] > b[field] ? type : -type);
};

module.exports.format = function (field, format) {
    return collection =>
        collection.map(contact => {
            contact[field] = format(contact[field]);
            return contact;
        });
};

module.exports.or = function () {
    return collection => {
        var repeats = countRepeats(manyFunctions(collection, arguments));
        return collection
            .filter(contact => repeats[contact.email]);
    };
};

module.exports.and = function () {
    return collection => {
        var repeats = countRepeats(manyFunctions(collection, arguments));
        return collection
            .filter(contact => repeats[contact.email] === arguments.length);
    };
};

function manyFunctions(collection, args) {
    var functions = [].slice.call(args);
    return functions.reduce(function (func1, func2) {
        return func1(collection).concat(func2(collection));
    });
}

function countRepeats(book) {
    var dict = {};
    book.forEach(contact => {
        dict[contact.email] = dict[contact.email] ? dict[contact.email] + 1 : 1;
    });
    return dict;
}
