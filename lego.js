'use strict';


module.exports.query = function (collection) {
    var args = [].slice.call(arguments, 0);
    for(var i=1;i<args.length;i++){
        collection = args[i](collection);
    }
    return collection;
};

module.exports.select = function () {
    var selected = [].slice.call(arguments, 0);
    return function (collection){
        var result = [];
        for (var i=0; i<collection.length; i++){
            result.push({});
            for(var e in collection[i]){
                if(selected.indexOf(e) != -1){
                    result[i][e] = collection[i][e]
                }
            }
        }
        return result;
    }
};

module.exports.filterIn = function () {
    var args = [].slice.call(arguments, 0);
    var field = args[0];
    args = args[1];
    return function (collection){
        return collection.filter(function(entry){
            return args.indexOf(entry[field]) !== -1;
        });
    }
};

module.exports.filterEqual = function () {
    var args = [].slice.call(arguments, 0);
    var field = args[0];
    args = args[1];
    return function (collection){
        return collection.filter(function(entry){
            return entry[field] === args;
        });
    }
};

module.exports.sortBy = function () {
    var args = [].slice.call(arguments, 0);
    var field = args[0];
    var f = args[1];
    return function (collection){
        return collection.sort(function(entry1, entry2){
            if(entry1[field] > entry2[field]){
                if (f === 'asc')
                    return 1;
                else
                    return -1;
            }
            if(entry1[field] < entry2[field]){
                if (f === 'asc')
                    return -1;
                else
                    return 1;
            }
            return 0;
        });
    }
};

module.exports.format = function () {
    var args = [].slice.call(arguments, 0);
    var field = args[0];
    var f = args[1];
    return function (collection){
        return collection.map(function(entry){
            entry[field] = f(entry[field]);
            return entry;
        });
    }
};

module.exports.limit = function () {
    var n = arguments[0];
    return function (collection){
        return collection.slice(0,n);
    }
};

module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

module.exports.or = function () {
    var args = [].slice.call(arguments, 0);
    return function (collection) {
        var tempCollection = [];
        for(var i=0;i<args.length;i++) {
            var x = args[i](collection);
            tempCollection = tempCollection.concat(x);
        }
        collection = [];
        for(i=0; i<tempCollection.length; ++i) {
            if(collection.indexOf(tempCollection[i]) === -1){
                collection.push(tempCollection[i]);
            }
        }
        return collection;
    };
};

module.exports.and = function () {
    var args = [].slice.call(arguments, 0);
    return function (collection) {
        for(var i=0;i<args.length;i++){
            collection = args[i](collection);
        }
        return collection;
    };
};


