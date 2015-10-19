'use strict';

var sortOrder = { asc: 1, desc: -1 };

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var operators = [].slice.call(arguments, 1);
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
    var fields = [].slice.call(arguments);
    return collection => {
        return collection.map(contact => {
            return fields.reduce(function (current, field) {
                if (contact.hasOwnProperty(field)) {
                    current[field] = contact[field];
                }
                return current;
            },
            {});
        });
    };
};

module.exports.filterIn = function (field, values) {
    return collection => {
        return collection.filter(contact => {
            return values.indexOf(contact[field]) >= 0;
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return collection => {
        return collection.filter(contact => value === contact[field]);
    };
};

module.exports.sortBy = function (field, order) {
    if (!sortOrder[order]) {
        throw new TypeError('Порядок сортировки должен быть asc или desc');
    }
    function compareContact(contact1, contact2) {
        return contact1[field] > contact2[field] ? 1 : -1;
    }
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


module.exports.and = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        return operators.reduce(function (current, operator) {
            return operator(current);
        },
        collection.slice());
    };
};

module.exports.or = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        return operators.reduce(function (current, operator) {
            return [...current, ...operator(collection)]
        },
        []);
    };
};
