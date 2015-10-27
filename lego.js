'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (phoneBook) {
    for (var functions = 1; functions < arguments.length; functions++) {
        phoneBook = arguments[functions](phoneBook);
    }
    return phoneBook;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (phoneBook) {
        return phoneBook.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (phoneBook) {
        var newPhoneBook = phoneBook.slice(0, n);
        return newPhoneBook;
    };
};

module.exports.select = function () {
    var records = [].slice.call(arguments);
    return function (phoneBook) {
        var newPhoneBook = [];
        phoneBook.map(function (contact) {
            var record = contact;
            var newRecord = {};
            var keys = Object.keys(record);
            keys.forEach(function (key) {
                if (records.indexOf(key) !== -1) {
                    newRecord[key] = record[key];
                }
            });
            newPhoneBook.push(newRecord);
        });
        return newPhoneBook;
    };
};

module.exports.filterIn = function (record, criteria) {
    return function (phoneBook) {
        var newPhoneBook = [];
        for (var contact = 0; contact < phoneBook.length; contact++) {
            for (var criterion = 0; criterion < criteria.length; criterion++) {
                if (phoneBook[contact][record] === criteria[criterion]) {
                    newPhoneBook.push(phoneBook[contact]);
                }
            }
        }
        return newPhoneBook;
    };
};


module.exports.sortBy = function (record, criterion) {
    return function (phoneBook) {
        function sorted(phoneBook) {
            return phoneBook.sort(function (a, b) {
                if (a[record] > b[record]) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        if (criterion == 'asc') {
            return sorted(phoneBook);
        } else {
            return sorted(phoneBook).reverse;
        };
    };
};

module.exports.format = function (record, func) {
    return function (phoneBook) {
        for (var contact = 0; contact < phoneBook.length; contact++) {
            phoneBook[contact][record] = func(phoneBook[contact][record]);
        }
        return phoneBook;
    };
};
