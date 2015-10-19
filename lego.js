'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var argsLength = arguments.length;
    for (var i = 1; i < argsLength; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (n < 0) {
            throw 'The number of entries must be positive';
        }
        return n < collection.length ? collection.slice(0, n) : collection;
    };
};

// Оператор select, который выбирает определенные поля из телефонной книги
module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var newCollection = [];
        collection.forEach(function (record, recordIndex) {
            newCollection[recordIndex] = {};
            fields.forEach(function (field) {
                if (field in record) {
                    newCollection[recordIndex][field] = collection[recordIndex][field];
                }
            });
        });
        return newCollection;
    };
};

// Оператор filterIn фильтрует по значению в некотором поле
module.exports.filterIn = function (fieldName, values) {
    return function (collection) {
        return collection.filter(function (record) {
            return values.indexOf(record[fieldName]) !== -1;
        });
    };
};

// Оператор filterEqual
module.exports.filterEqual = function (fieldName, value) {
    return function (collection) {
        return collection.filter(function (record) {
            return record[fieldName] === value;
        });
    };
};

// Оператор sortBy, сортирует по какому-то полю
module.exports.sortBy = function (fieldName, sortType) {
    return function (collection) {
        if (!(sortType === 'asc' || sortType === 'desc')) {
            throw 'Incorrect sorting method. Possible options: \'asc\', \'desc\'';
        }
        if (sortType === 'asc') {
            return collection.sort(function (a, b) {
                if (a[fieldName] > b[fieldName]) {
                    return 1;
                }
                if (a[fieldName] < b[fieldName]) {
                    return -1;
                }
                return 0;
            });
        }
        return collection.sort(function (a, b) {
            if (a[fieldName] > b[fieldName]) {
                return -1;
            }
            if (a[fieldName] < b[fieldName]) {
                return 1;
            }
            return 0;
        });
    };
};

// Оператор format - форматирует некоторое поле
module.exports.format = function (fieldName, formatFunction) {
    return function (collection) {
        collection.forEach(function (record) {
            record[fieldName] = formatFunction(record[fieldName]);
        });
        return collection;
    };
};
