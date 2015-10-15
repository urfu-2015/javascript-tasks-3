'use strict';

module.exports.query = function (collection) {
    var validContact = clone(collection);
    var len = arguments.length;
    for (var i = 1; i < len; i++) {
        arguments[i](validContact);
    }
    return validContact;
};

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        collection.splice(n);
        return collection;
    };
};

module.exports.select = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        var countCont = collection.length;
        for (var i = 0; i < countCont; i++) {
            var contact = collection[i];
            var fields = Object.keys(contact);
            var countFields = fields.length;
            for (var j = 0; j < countFields; j++) {
                var field = fields[j];
                if (args.indexOf(field) < 0) {
                    delete contact[field];
                }
            }
        }
    };
};

module.exports.filterIn = function (field, filter) {
    return function (collection) {
        var len = collection.length;
        var offset = 0;
        for (var i = 0; i < len; i++) {
            var contact = collection[i-offset];
            var countFilter = filter.length;
            var isValid = false;
            for (var j = 0; j < countFilter; j++) {
                if (contact[field] === filter[j]) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                collection.splice(i - offset, 1);
                offset++;
            }
        }
    }
};

module.exports.sortBy = function (field, sort) {
    return function (collection) {
        collection.sort(function (a, b) {
            var aField = a[field];
            var bField = b[field];
            var compareRes;
            if (Number.isInteger(aField) && Number.isInteger(bField)) {
                compareRes = aField - bField;
            } else {
                compareRes = aField.localeCompare(bField, 'en', {numeric: true});
            }
            if (sort == 'asc') {
                return compareRes;
            } else {
                return -compareRes;
            }
        })
    }
};

module.exports.format = function (field, func) {
    return function (collection) {
        var len = collection.length;
        for (var i=0; i<len; i++) {
            var contact = collection[i];
            contact[field] = func(contact[field]);
        }
    }
};

module.exports.filterEqual = function (field, value) {
    return this.filterIn(field, [value]);
};
