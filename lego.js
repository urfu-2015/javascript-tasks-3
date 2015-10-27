'use strict';

// Список названий полей телефонной книги
var phoneBookFields = ['age', 'gender', 'name', 'email', 'phone', 'favoriteFruit'];
var sortTypes = {asc: 'asc', desc: 'desc'};
var allFields = '*';
// Если поле не присутствует в записной книжке выбрасывает исключение
function isPhoneBookField(field) {
    if (phoneBookFields.indexOf(field) === -1) {//includes не сработало
        throw new Error('Invalid field: ' + field);
    }
};

function isFunction(func) {
    if (typeof func === 'function') {
        return true;
    } else {
        return false;
    }
};

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection,
                                selectFields,
                                filterCollection,
                                sortCollection,
                                formatCollection,
                                limitCollection) {
    var queryRes = [];

    if (isFunction(selectFields)) {
        queryRes = selectFields(collection);
    }

    if (isFunction(filterCollection)) {
        queryRes = Array.from(filterCollection(queryRes));
        var i = 0;
        var l = queryRes.length;
        while (i < l) {
            if (queryRes[i] === null) {
                queryRes.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    if (isFunction(sortCollection)) {
        queryRes = Array.from(sortCollection(queryRes));
    }

    if (isFunction(formatCollection)) {
        queryRes = Array.from(formatCollection(queryRes));
    }

    if (isFunction(limitCollection)) {
        queryRes = Array.from(limitCollection(queryRes));
    }

    return queryRes;
};

module.exports.select = function () {
    var fields = [];
    if (!arguments.length) {
        throw new Error('no selected fields');
    }
    if (arguments.length === 1 && arguments[0] === allFields) {
        fields = Array.from(phoneBookFields);
    } else {
        for (var i = 0, l = arguments.length; i < l; i++) {
            isPhoneBookField(arguments[i]);
            fields.push(arguments[i]);
        }
    }

    var selectFields = function (collection) {
        var newCollection = [];
        var record = {};
        for (var i = 0, l = collection.length; i < l; i++) {
            for (var j = 0, fl = fields.length; j < fl; j++) {
                record[fields[j]] = collection[i][fields[j]];
            }
            newCollection.push(record);
            record = {};
        }
        return newCollection;
    };
    return selectFields;
};


module.exports.filterIn = filterIn;
function filterIn(field, values) {
    isPhoneBookField(field);
    var filter = {
        field: field,
        values: values
    };

    var filterCollection = function (collection) {
        return collection.map( function(element) {
            if (filter.values.indexOf(element[filter.field]) === -1) {
                return element = null;
            } else {
                return element;
            }
        });
      /*   for (var i = 0, l = collection.length; i < l; i++) {
            if (filter && filter.values.indexOf(collection[i][filter.field]) === -1) {
                collection[i] = null;
            }
        } 
        return newCollection;*/
    };
    return filterCollection;
};

module.exports.sortBy = function (field, type) {
    isPhoneBookField(field);
    if (type === undefined) {
        type = sortTypes.asc;
    }
    if (type !== sortTypes.desc && type !== sortTypes.asc) {
        throw new Error('Invalid sort type: ' + type);
    }
    var sorter = {
        field: field,
        type: type
    };

    var sortCollection = function (collection) {
        var buferRecord;
        for (var i = 0, l = collection.length; i < l; i++) {
            for (var j = i + 1, l = collection.length; j < l; j++) {
                if (collection[i][sorter.field] > collection[j][sorter.field] &&
                    sorter.type === sortTypes.asc ||
                    collection[i][sorter.field] < collection[j][sorter.field] &&
                        sorter.type === sortTypes.desc) {
                    buferRecord = Object.assign({}, collection[i]);
                    collection[i] = Object.assign({}, collection[j]);
                    collection[j] = Object.assign({}, buferRecord);
                    buferRecord = {};
                }
            }
        }
        return collection;
    };
    return sortCollection;
};

module.exports.format = function (field, func) {
    isPhoneBookField(field);
    if (!isFunction(func)) {
        throw new Error('Invalid type: ' + typeof func + '. Function expected');
    }
    var formater = {
        field: field,
        func: func
    };

    var formatCollection = function (collection) {
        if (formater) {
            for (var i = 0, l = collection.length; i < l; i++) {
                collection[i][formater.field] = formater.func(collection[i][formater.field]);
            }
        }
        return collection;
    };
    return formatCollection;
};

module.exports.filterEqual = function (field, value) {
    return filterIn(field, [value]);
};

module.exports.or = function () {
    if (!arguments.length) {
        return function () {
            return [];
        };
    }
    var someFunctions = Array.from(arguments);

    var justOr = function (collection) {
        var collections = [];
        var newCollection = [];
        for (var i = 0, l = someFunctions.length; i < l; i++) {
            newCollection = Array.from(collection);
            collections.push(someFunctions[i](newCollection));
            newCollection = [];
        }
        var defaultValue;
        for (var j = 0, cl = collection.length; j < cl; j++) {
            defaultValue = false;
            for (var i = 0, l = collections.length; i < l; i++) {
                defaultValue = defaultValue || collections[i][j];
            }
            if (defaultValue) {
                newCollection.push(defaultValue);
            }
        }
        return newCollection;
    };
    return justOr;
};

module.exports.and = function () {
    if (!arguments.length) {
        return function () {
            return [];
        };
    }
    var someFunctions = Array.from(arguments);

    var justAnd = function (collection) {
        var collections = [];
        var newCollection = [];
        for (var i = 0, l = someFunctions.length; i < l; i++) {
            newCollection = Array.from(collection);
            collections.push(someFunctions[i](newCollection));
            newCollection = [];
        }
        var defaultValue;
        for (var j = 0, cl = collection.length; j < cl; j++) {
            defaultValue = true;
            for (var i = 0, l = collections.length; i < l; i++) {
                defaultValue = defaultValue && collections[i][j];
            }
            if (defaultValue) {
                newCollection.push(defaultValue);
            }
        }
        return newCollection;
    };
    return justAnd;
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    var lim;

    if (n === undefined) {
        lim = 0;
    }
    lim = Number(n);
    if (isNaN(lim) || lim < 1) {
        throw new Error('Invalid limit: ' + n);
    }

    var limitCollection = function (collection) {
        if (lim) {
            collection.splice(lim, Number.MAX_VALUE);
        }
        return collection;
    };

    return limitCollection;
};
