'use strict';

module.exports.query = function (collection) {
    for(var i = 1; i < arguments.length; i++){
        collection = arguments[i](collection);
    }
    return collection;
};

module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

module.exports.limit = function (n) {
    return function(collection){
        n = n < 0 ? 0 : n;
        return collection.slice(0, n);
    }
};

module.exports.select = function (){
    var fields = [].slice.call(arguments);
    return function(collection){
        var newCollection = [];
        for(var i = 0; i < collection.length; i++){
            var contact = collection[i];
            var newContact = {};
            for(var key in contact){
                if(fields.hasOwnProperty(key)){
                    newContact[key] = contact[key];
                }
            }
            newCollection.push(newContact);
        }
        return newCollection;
    }
}

module.exports.filterIn = function (field, values){
    return function(collection){
        var newCollection = [];
        for(var i = 0; i < collection.length; i++){
            var contact = collection[i];
            for(var j = 0; j < values.length; j++){
                if(contact[field] === values[j]){
                   newCollection.push(contact);
                }
            }
        }
        return newCollection;
    }
}

module.exports.filterEqual = function (field, value){
    return function(collection){
        return module.exports.filterIn(field, [value]);
    }
}

module.exports.sortBy=function(field, parametr){
    return function(collection){
        var newCollection = collection.sort(function(a, b){
            if(a[field] > b[field]){
                return 1;
            }
            if(a[field] < b[field]){
                return -1;
            }
            return 0;
        });
        if(parametr === 'desc'){
            return newCollection.reverse();
        }
        return newCollection;
    }
}

module.exports.format=function(field, handler){
    return function(collection){
        var newCollection = [];
        for(var i = 0; i < collection.length; i++){
            var contact = collection[i];
            var newContact = Object.assign({}, contact);
            newContact[field] = handler(contact[field]);
            newCollection.push(newContact);
        }
        return newCollection;
    }
}

