'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        return collection.slice().reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function () {
    var selectors = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (contact) {
            var out = {};
            selectors.forEach(selector => {
                if (selector in contact) {
                    out[selector] = contact[selector];
                }
            });
            return out;
        });
    };
};

module.exports.filterIn = function (selector, values) {
    return function (collection) {
        return collection.filter(function (contact) {
            return values.some(value => value === contact[selector]);
        });
    };
};

module.exports.filterEqual = function (selector, value) {
    return function (collection) {
        return collection.filter(contact => value === contact[selector]);
    };
};

module.exports.sortBy = function (selector, type) {
    return function (collection) {
        type = type === 'asc' ? 1 : -1;
        return collection.sort(function (contact1, contact2) {
            if (contact1[selector] > contact2[selector]) {
                return type;
            } else {
                return -type;
            }
        });
    };
};

module.exports.format = function (selector, f) {
    return function (collection) {
        collection.forEach(contact => {
            contact[selector] = f(contact[selector]);
        });
        return collection;
    };
};

// Будет круто, если реализуете операторы:
// or и and
module.exports.or = or;
module.exports.and = and;

function and() {
    if (arguments.length === 0 || arguments.length === 1) {
        return collection => [];
    } else {
        var functions = [].slice.call(arguments);
        return function (collection) {
            functions.forEach(f => {
                collection = f(collection);
            });
            return collection;
        };
    }
};

function or() {
    if (arguments.length === 0) {
        return collection => [];
    } else if (arguments.length === 1) {
        return collection => arguments[0](collection);
    } else {
        var args = [].slice.call(arguments);
        return function (collection) {
            var result1 = or.apply(null, args.splice(0, args.length / 2))(collection);
            var result2 = or.apply(null, args)(collection);
            var out = result1.concat(result2);
            var and = result1.filter(v => Boolean(result2.indexOf(v) + 1));
            and.forEach(value => {
                out.splice(out.indexOf(value), 1);
            });
            return out;
        };
    }
};
