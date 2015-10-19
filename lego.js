'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function(collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function() {
    return function(collection) {
        return collection.slice().reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function(n) {
    return function(collection) {
        if (n < 0) {
            throw new new RangeError('Should`t be limited array negative number.');
        }
        return collection.slice(0, n);
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function() {
    var selectors = [].slice.call(arguments);
    return function(collection) {
        return collection.map(function(contact) {
            var result = {};
            selectors.forEach(selector => {
                if (selector in contact) {
                    result[selector] = contact[selector];
                }
            });
            return result;
        });
    };
};

module.exports.filterIn = function(selector, values) {
    return function(collection) {
        return collection.filter(function(contact) {
            return values.some(value => value === contact[selector]);
        });
    };
};

module.exports.filterEqual = function(selector, value) {
    return function(collection) {
        return collection.filter(contact => value === contact[selector]);
    };
};

module.exports.sortBy = function(selector, type) {
    return function(collection) {
        type = type === 'asc' ? 1 : -1;
        return collection.sort(function(contact1, contact2) {
            if (contact1[selector] > contact2[selector]) {
                return type;
            } else {
                return -type;
            }
        });
    };
};

module.exports.format = function(selector, f) {
    return function(collection) {
        collection.forEach(contact => {
            contact[selector] = f(contact[selector]);
        });
        return collection;
    };
};
