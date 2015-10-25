'use strict';


module.exports.query = function (collection) {
    var args = [].slice.call(arguments, 0);
    for (var i = 1; i < args.length;i++) {
        collection = args[i](collection);
    }
    return collection;
};

module.exports.select = function () {
    var selected = [].slice.call(arguments, 0);
    return function (collection) {
        var result = [];
        for (var i = 0; i < collection.length; i++) {
            result.push({});
            for (var e in collection[i]) {
                if (selected.indexOf(e) !== -1) {
                    result[i][e] = collection[i][e];
                }
            }
        }
        return result;
    };
};

module.exports.filterIn = function (field, args) {
    return function (collection) {
        return collection.filter(function (entry) {
            return args.indexOf(entry[field]) !== -1;
        });
    };
};

module.exports.filterEqual = function (field, arg) {
    return function (collection) {
        return collection.filter(function (entry) {
            return entry[field] === arg;
        });
    };
};

module.exports.sortBy = function (field, f) {
    return function (collection) {
        return collection.sort(function (entry1, entry2) {
            if (entry1[field] > entry2[field]) {
                return f === 'asc' ? 1 : -1;
            }
            if (entry1[field] < entry2[field]) {
                return f === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
};

module.exports.format = function (field, f) {
    return function (collection) {
        return collection.map(function (entry) {
            entry[field] = f(entry[field]);
            return entry;
        });
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        if (n < 0) {
            throw new RangeError('Параметр должен быть положительным');
        }
        return collection.slice(0, n);
    };
};

module.exports.reverse = function () {
    return function (collection) {
        return collection.slice().reverse();
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments, 0);
    return function (collection) {
        var filteredItems = [];
        for (var i = 0; i < args.length; i++) {
            filteredItems = filteredItems.concat(args[i](collection));
        }
        collection = [];
        for (i = 0; i < filteredItems.length; i++) {
            if (collection.indexOf(filteredItems[i]) === -1) {
                collection.push(filteredItems[i]);
            }
        }
        return collection;
    };
};

module.exports.and = function () {
    var args = [].slice.call(arguments, 0);
    return function (collection) {
        args.splice(0, 0, collection);
        return module.exports.query.apply(null, args);
    };

};
