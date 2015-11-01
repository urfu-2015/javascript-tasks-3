'use strict';

module.exports.query = query;
module.exports.select = select;
module.exports.filterIn = filterIn;
module.exports.filterEqual = filterEqual;
module.exports.sortBy = sortBy;
module.exports.format = format;
module.exports.and = and;
module.exports.or = or;
module.exports.limit = limit;

// Список названий полей телефонной книги
var phoneBookFields = ['age', 'gender', 'name', 'email', 'phone', 'favoriteFruit'];
var SORT_TYPE_ASC = 'asc';
var SORT_TYPE_DESC = 'desc';
var ALL_FIELDS = '*';

// Если поле не присутствует в записной книжке выбрасывает исключение
function isPhoneBookField(field) {
    if (phoneBookFields.indexOf(field) === -1) {
        throw new Error('Invalid field: ' + field);
    }
};

function isFunction(func) {
    return (typeof func === 'function');
};

function doOperation(filters, operation) {
    if (!filters.length) {
        return function () {
            return [];
        };
    }
    return function (collection) {
        var collections = [];
        var newCollection = [];
        filters.forEach(function (filter) {
            collections.push(filter(collection));
        });
        var value;
        for (var j = 0, l = collection.length; j < l; j++) {
            switch (operation) {
                case 'or':
                    value = collections.reduce(function (prevValue, element) {
                        return (prevValue || element[j]);
                    }, false);
                    break;
                case 'and':
                    value = collections.reduce(function (prevValue, element) {
                        return (prevValue && element[j]);
                    }, true);
                    break;
                default:
                    value = false;
            };
            if (value) {
                newCollection.push(value);
            }
        }
        return newCollection;
    };
};

// Метод, который будет выполнять операции над коллекцией один за другим
function query(collection, selector, filter, sorter, formater, limiter) {
    var queryRes = [];
    if (isFunction(selector)) {
        queryRes = selector(collection);
    }
    if (isFunction(filter)) {
        queryRes = filter(queryRes).filter(function (element) {
            return (element !== null);
        });
    }
    if (isFunction(sorter)) {
        queryRes = sorter(queryRes);
    }
    if (isFunction(formater)) {
        queryRes = formater(queryRes);
    }
    if (isFunction(limiter)) {
        queryRes = limiter(queryRes);
    }
    return queryRes;
};

function select() {
    var fields = [];
    var arg = Array.from(arguments);
    if (!arg.length) {
        throw new Error('no selected fields');
    }
    if (arg.length === 1 && arg[0] === ALL_FIELDS) {
        fields = phoneBookFields;
    } else {
        fields = arg.filter(function (element) {
            isPhoneBookField(element);
            return true;
        });
    }

    return function (collection) {
        var newCollection = collection.map(function (element) {
            var record = {};
            for (var j = 0, l = fields.length; j < l; j++) {
                record[fields[j]] = element[fields[j]];
            }
            return record;
        });
        return newCollection;
    };
};

function filterIn(field, values) {
    isPhoneBookField(field);
    return function (collection) {
        return collection.map(function (element) {
            if (values.indexOf(element[field]) === -1) {
                return element = null;
            } else {
                return element;
            }
        });
    };
};

function filterEqual(field, value) {
    return filterIn(field, [value]);
};

function sortBy(field, type) {
    isPhoneBookField(field);
    if (type === undefined) {
        type = SORT_TYPE_ASC;
    }
    if (type !== SORT_TYPE_DESC && type !== SORT_TYPE_ASC) {
        throw new Error('Invalid sort type: ' + type);
    }

    return function (collection) {
        var buferRecord;
        var l = collection.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (collection[i][field] > collection[j][field] && type === SORT_TYPE_ASC ||
                    collection[i][field] < collection[j][field] && type === SORT_TYPE_DESC) {
                    buferRecord = collection[i];
                    collection[i] = collection[j];
                    collection[j] = buferRecord;
                }
            }
        }
        return collection;
    };
};

function format(field, func) {
    isPhoneBookField(field);
    if (!isFunction(func)) {
        throw new Error('Invalid type: ' + typeof func + '. Function expected');
    }

    return function (collection) {
        return collection.map(function (element) {
            element[field] = func(element[field])
            return element;
        });
    };
};

function or() {
    return doOperation(Array.from(arguments), 'or');
};

function and() {
    return doOperation(Array.from(arguments), 'and');
};

// Оператор limit, который выбирает первые n записей
function limit(n) {
    var lim;

    if (n === undefined) {
        lim = 0;
    }
    lim = Number(n);
    if (isNaN(lim) || lim < 1) {
        throw new Error('Invalid limit: ' + n);
    }

    return function (collection) {
        if (lim) {
            return collection.slice(0, lim);
        }
        return collection;
    };
};
