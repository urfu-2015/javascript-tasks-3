'use strict';

module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};

module.exports.reverse = function () {
    return function (collection) {
        return collection.collection.reverse();
    };
};
module.exports.limit = function (n) {
    return function (collection) {
        return collection.splice(0, n);
    };
};
module.exports.select = function () {
    var selectors = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (element) {
            var result = {};
            for (var i = 0; i < selectors.length; i++) {
                result[selectors[i]] = element[selectors[i]];
            }
            return result;
        });
    };
};
module.exports.filterIn = function (selector, values) {
    return function (collection) {
        function isInList(element, list) {
            for (var i = 0; i < list.length; i++) {
                if (element === list[i]) {
                    return true;
                }
            }
            return false;
        }
        var i = 0;
        while (collection[i] != null) {
            if (isInList(collection[i][selector], values)) {
                i++;
            } else {
                collection.splice(i, 1);
            }
        }
        return collection;
    };
};
module.exports.filterEqual = function (selector, value) {
    return function (collection) {
        var i = 0;
        while (collection[i] != null) {
            if (collection[i][selector] === value) {
                i++;
            } else {
                collection.splice(i, 1);
            }
        }
        console.log(collection);
    };
};
module.exports.sortBy = function (selector, order) {
    return function (collection) {
        var orderType = order === 'asc' ? 1 : -1;
        return collection.sort(function (note1, note2) {
            if (note1[selector] > note2[selector]) {
                return orderType;
            }
            if (note1[selector] < note2[selector]) {
                return -orderType;
            }
            return 0;
        });
    };
};
module.exports.format = function (selector, func) {
    return function (collection) {
        for (var i = 0; i < collection.length; i++) {
            collection[i][selector] = func(collection[i][selector]);
        }
        console.log(collection);
        return collection;
    };
};
