'use strict';

// Список названий полей телефонной книги
var phoneBookFields = ['age', 'gender', 'name', 'email', 'phone', 'favoriteFruit'];
var sortTypes = {asc: 'asc', desc: 'desc'};
// Если поле не присутствует в записной книжке выбрасывает исключение
function isPhoneBookField(field) {
    if (phoneBookFields.indexOf(field) === -1) {//includes не сработало
        throw new Error('Invalid field: ' + field);
    }
};

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection, fields, filter, sorter, formater, limit) {
    var qyeryRes = [];
    var record = {};

    for (var i = 0, l = collection.length; i < l; i++) {
        record = Object.assign({}, {});//???без обнуления одинаковые записи в результате

        // Фильтруем записи
        if (filter && filter.values.indexOf(collection[i][filter.field]) === -1) {
            continue;
        }

        // Берём только выбранные поля
        for (var j = 0, fl = fields.length; j < fl; j++) {
            record[fields[j]] = collection[i][fields[j]];
        }
        //console.log(Object.keys(record));
        qyeryRes.push(record);
    }

    //console.log(sorter.type);
    //Сортировка по выбранному полю
    var buferRecord;
    if (sorter) {
        for (var i = 0, l = qyeryRes.length; i < l; i++) {
            for (var j = i + 1, l = qyeryRes.length; j < l; j++) {
                if (qyeryRes[i][sorter.field] > qyeryRes[j][sorter.field]) {
                    buferRecord = Object.assign({}, qyeryRes[i]);
                    qyeryRes[i] = Object.assign({}, qyeryRes[j]);
                    qyeryRes[j] = Object.assign({}, buferRecord);
                    buferRecord = Object.assign({}, {});
                }
            }
        }
        if (sorter.type === sortTypes.desc) {
            qyeryRes.reverse();
        }
    }
    
    if (formater) {
        for (var i = 0, l = qyeryRes.length; i < l; i++) {
            qyeryRes[i][formater.field] = formater.func(qyeryRes[i][formater.field]);
        }
    }

    if (limit) {
        qyeryRes.splice(limit, Number.MAX_VALUE);
    }
    return qyeryRes;
};

module.exports.select = function () {
    var arg = arguments || phoneBookFields;
    var fields = [];

    for (var i = 0, l = arg.length; i < l; i++) {
        isPhoneBookField(arg[i]);
        fields.push(arg[i]);
    }
    return fields;
};

module.exports.filterIn = function (field, values) {
    isPhoneBookField(field);

    var filter = {
        field: field,
        values: values
    };
    return filter;
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
    return sorter;
};

module.exports.format = function (field, func) {
    isPhoneBookField(field);
    
    var formater = {
        field: field,
        func: func
    };
    return formater;
};

module.exports.filterEqual = function (field, value) {
    isPhoneBookField(field);

    var filter = {
        field: field,
        value: value
    };
    return filter;
};

module.exports.or = function () {
};

module.exports.and = function () {
};

// Оператор reverse, который переворачивает коллекцию
/*module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};*/

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    if (n === undefined) {
        return 0;
    }
    var lim = Number(n);
    if (isNaN(lim)) {
        throw new Error('Invalid limit: ' + n);
    } else {
        return lim;
    }
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
