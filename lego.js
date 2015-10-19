'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (phoneBook) {

    for (var functions = 1; functions < arguments.length; functions++) {
        phoneBook = arguments[functions](phoneBook);
    }
    console.log(phoneBook);
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (phoneBook) {
        var changedphoneBook = phoneBook.reverse();
        return changedphoneBook;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (phoneBook) {
        var newphoneBook = [];
        for (var i = 0; i < n; i++) {
            newphoneBook.push(phoneBook[i]);
        }
        return newphoneBook;
    };
};

module.exports.select = function () {
    var fields = arguments;
    return function (phoneBook) {
        var newphoneBook = [];
        for (var contact = 0; contact < phoneBook.length; contact++) {
            var newField = {};
            for (var field = 0; field < fields.length; field++) {
                newField[fields[field]] = phoneBook[contact][fields[field]];
            }
            newphoneBook.push(newField);
        }
        return newphoneBook;
    };
};

module.exports.filterIn = function (field, criteria) {
    return function (phoneBook) {
        var newphoneBook = [];
        for (var contact = 0; contact < phoneBook.length; contact++) {
            for (var criterion = 0; criterion < criteria.length; criterion++) {
                if (phoneBook[contact][field] == criteria[criterion]) {
                    newphoneBook.push(phoneBook[contact]);
                }
            }
        }
        return newphoneBook;
    };
};

module.exports.filterEqual = function (field, criterion) {
    return function (phoneBook) {
        return module.exports.filterEqual(field, criterion);
    };
};

function sort(phoneBook, field) {
    for (var contact1 = 0; contact1 < phoneBook.length; contact1++) {
        for (var contact2 = 0; contact2 < phoneBook.length - 1; contact2++) {
            if (phoneBook[contact2][field] > phoneBook[Number(contact2) + 1][field]) {
                var newField = {};
                newField = phoneBook[Number(contact2) + 1][field];
                phoneBook[Number(contact2) + 1][field] = phoneBook[contact2][field];
                phoneBook[contact2][field] = newField;
            }
        }
    }
    return phoneBook;
}

module.exports.sortBy = function (field, criterion) {
    return function (phoneBook) {
        var newphoneBook = [];
        if (criterion == 'asc') {
            phoneBook = sort(phoneBook, field);
        } else {
            phoneBook = sort(phoneBook, field).reverse();
        }
        return phoneBook;
    };
};

module.exports.format = function (field, func) {
    return function (phoneBook) {
        for (var contact = 0; contact < phoneBook.length; contact++) {
            phoneBook[contact][field] = func(phoneBook[contact][field]);
        }
        return phoneBook;
    };
};
