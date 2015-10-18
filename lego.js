'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var operators = Object.keys(arguments).map(key => arguments[key]).slice(1);
    return operators.reduce(function (currentCollection, operator) {
        return operator(currentCollection);
    },
    collection.slice());
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return collection => {
        return collection.slice().reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return collection => {
        if (isNaN(n) || n < 0) {
            throw new RangeError('n должно быть числом и >= 0');
        }
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = Object.keys(arguments).map(key => arguments[key]);
    return collection => {
        return collection.map(contact => {
            var result = {};
            fields.forEach(field => {
                if (field in contact) {
                    result[field] = contact[field];
                }
            });
            return result;
        });
    };
};

module.exports.filterIn = function (field, values) {
    return collection => {
        return collection.filter(contact => {
            return values.some(value => value === contact[field]);
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return collection => {
        return collection.filter(contact => value === contact[field]);
    };
};

module.exports.sortBy = function (field, order) {
    if (!(order === 'asc' || order === 'desc')) {
        throw new TypeError('Порядок сортировки должен быть asc или desc');
    }
    var compareContact = function (contact1, contact2) {
        if (contact1[field] > contact2[field]) {
            return 1;
        }
        return -1;
    };
    return function (collection) {
        if (order === 'asc') {
            return collection.sort(compareContact);
        }
        return collection.sort(compareContact).reverse();
    };
};

module.exports.format = function (field, formatter) {
    return collection => {
        collection.forEach(contact => {
            contact[field] = formatter(contact[field]);
        });
        return collection;
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
