'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.lenght; i++) {
        collection = arguments[i](collection);
    };
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n > 0 && n < collection.lenght) {
            return collection.slice(0, n);
        };
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
module.exports.select = function() {
    // var args = [].slice.call(arguments);
    var args = Array.from(arguments);
    return function (collection) {
        return collection.map(function (contact) {
            for (var key in contact) {
                if (args.indexOf(key) === -1) {
                    delete contact[key];
                }
            }
            return contact;
        });

    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        var filtered = [];
        collection.forEach(function (contact) {
            for (var i = 0; i < values.length; i++) {
                if (contact[field] == values[i]) {
                    filtered.push(contact);
                };
            };
        });
        return filtered;
    };
};

module.exports.filterEqual = function (field, filter) {
    return function (collection) {
        return collection.filter(function (contact) {
            return contact[field] === filter;
        });
    };
};

module.exports.sortBy = function (field, order) {
    return function (collection) {
        order = order === 'asc' ? 1 : -1;
        return collection.sort(function (contact1, contact2) {
            if (contact1[field] > contact2[field]) {
                return order;
            } else {
                return -order;
            }
        });
    };
};

module.exports.format = function (field, paremeter) {
    return function (collection) {
        collection.forEach(function (contact) {
            contact[field] = paremeter(contact[field]);
        });
        return collection;
    };
};
