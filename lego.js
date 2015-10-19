'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var phoneBook = getCopyBook(collection);
    for (var i = 1; i < arguments.length; i++) {
        phoneBook = arguments[i](phoneBook);
    };
    return phoneBook;
};

function getCopyBook(phoneBook) {
    var newPhoneBook = [];
    phoneBook.forEach(function(user, item, collection) {
        var newUser = {};
        var fields = Object.keys(user);
        fields.forEach(function(field, item, fields) {
            newUser[field] = user[field];
        });
        newPhoneBook.push(newUser);
    });
    return newPhoneBook;
}

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
    return function(phoneBook) {
        var limit = Math.min(phoneBook.length, n);
        var newPhoneBook = [];
        for (var i = 0; i < limit; i++) {
            newPhoneBook.push(phoneBook[i]);
        };
        return newPhoneBook;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function() {
    var values = arguments;
    return function(phoneBook) {
        var newPhoneBook = [];
        phoneBook.forEach(function(user, item, phoneBook) {
            var newUser = {};
            for (var field in user) {
                if (isInList(field, values)) {
                    newUser[field] = user[field];
                };
            };
            newPhoneBook.push(newUser);
        });
        return newPhoneBook;
    };
};

function isInList(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true;
        };
    };
    return false;
};

module.exports.filterIn = function(field, values) {
    return function(phoneBook) {
        var newPhoneBook = phoneBook.filter(function(user) {
            for (var i = 0; i < values.length; i++) {
                if (user[field] == values[i]) {
                    return true;
                };
            };
            return false;
        });
        return newPhoneBook;
    };
};

module.exports.filterEqual = function(field, value) {
    return module.exports.filterIn(field, [value]);
};

var compareUsers = function (field, method) {
    if (method == 'asc') {
        return function (first, second) {
            if (first[field] > second[field]) {
                return 1;
            };
            return -1;
        };
    };
    return function (first, second) {
        if (first[field] < second[field]) {
            return 1;
        };
        return -1;
    };
};

module.exports.sortBy = function(param, method) {
    return function(phoneBook) {
        var newPhoneBook = phoneBook.sort(compareUsers(param, method));
        return newPhoneBook;
    };
};

module.exports.format = function(param, func) {
    return function(phoneBook) {
        var newPhoneBook = phoneBook.map(function(user) {
            user[param] = func(user[param]);
            return user;
        });
        return newPhoneBook;
    };
};

// Будет круто, если реализуете операторы:
// or и and
module.exports.and = function() {
    var args = arguments;
    return function(phoneBook) {
        var newPhoneBook = getCopyBook(phoneBook);
        for (var i = 0; i < args.length; i++) {
            newPhoneBook = args[i](newPhoneBook);
        };
        return newPhoneBook;
    };
};

module.exports.or = function() {
    var args = arguments;
    return function(phoneBook) {
        var newPhoneBook = getCopyBook(phoneBook);
        var resultBook = [];
        for (var i = 0; i < args.length; i++) {
            var changedPhoneBook = args[i](newPhoneBook);
            changedPhoneBook.forEach(function(user, item, changedPhoneBook) {
                if (!isInList(user, resultBook)) {
                    resultBook.push(user);
                };
            });
        };
        return resultBook;
    };
};
