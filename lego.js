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
    return collection => collection.slice(0, Math.max(n, 0));
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return collection =>
        collection.map(contact => {
            var newContact = {};
            fields.forEach(field => {
                if (field in contact) {
                    newContact[field] = contact[field];
                }
            });
            return newContact;
        });
};

module.exports.filterIn = filterIn;

function filterIn(field, values) {
    return collection =>
        collection.filter(contact =>
            field in contact && values.find(value =>
                value.toString().toLowerCase() ===
                contact[field].toString().toLowerCase()));
};

module.exports.filterEqual = function (field, value) {
    return collection => filterIn(field, [value])(collection);
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
            .filter(contact =>
                repeats[JSON.stringify(contact)]);
    };
};

module.exports.and = function () {
    return collection => {
        var repeats = countRepeats(manyFunctions(collection, arguments));
        return collection
            .filter(contact =>
                repeats[JSON.stringify(contact)] === arguments.length);
    };
};

function manyFunctions(collection, args) {
    var functions = [].slice.call(args);
    return functions.reduce((result, func) => {
        return result.concat(func(collection));
    }, []);
}

function countRepeats(book) {
    return book.reduce((result, contact) => {
        var stringContact = JSON.stringify(contact);
        result[stringContact] ?
            result[stringContact]++ :
            result[stringContact] = 1;
        return result;
    }, {});
}
