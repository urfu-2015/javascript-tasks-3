'use strict';

var cloner = {
    _clone: function _clone(obj) {
        if (obj instanceof Array) {
            var out = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                var value = obj[i];
                out[i] = (value !== null && typeof value === "object") ? _clone(value) : value;
            }
        } else {
            var out = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    out[key] = (value !== null && typeof value === "object") ? _clone(value) : value;
                }
            }
        }
        return out;
    },

    clone: function(it) {
        return this._clone({
            it: it
        }).it;
    }
};

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var args = [].slice.call(arguments);
    args.splice(0, 1);
    /*console.log(args);*/
    var ind;
    for (ind in args)
    {
        collection = args[ind](collection);
    }
    return collection;
    /*console.log(collection);*/
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        console.log(collection);
        var changedCollection = cloner.clone(collection).reverse();
        // Возращаем изменённую коллекцию
        console.log(changedCollection);
        return changedCollection;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and

module.exports.select = function(){
    var args = [].slice.call(arguments);
    return function (collection) {
        var changedCollection = [];
        var index;
        for (index in collection){
            var i;
            var newEntry = {};
            for (i in args) {

                if (collection[index][args[i]] !== undefined) {
                    newEntry[args[i]] = collection[index][args[i]];
                }
            }
            changedCollection.push(newEntry);
        }
        return changedCollection;
    }

};

module.exports.filterIn = function(nameField, valuesOfField){
    //var nameField = arguments[0];
    //var valuesOfField = arguments[1];
    return function(collection){
        var index;
        var changedCollection = [];
        for (index in collection)
        {
            var i;
            for (i in valuesOfField)
            {
                if (new RegExp(valuesOfField[i], 'i').test(collection[index][nameField]))
                {
                    changedCollection.push(collection[index]);
                }
            }
        }
        return changedCollection;
    }
};

module.exports.filterEqual = function(nameField, valueOfField){
    //var nameField = arguments[0];
    //var valueOfField = arguments[1];
    return function(collection){
        var index;
        var changedCollection = [];
        for (index in collection)
        {
            var i;
            if (valueOfField === collection[index][nameField]){

                changedCollection.push(collection[index]);
            }
        }
        return changedCollection;
    }

};

module.exports.sortBy = function(fieldForOrder, order) {
    function sortedRule(order){
        return function (a, b){
            a = a[fieldForOrder];
            b = b[fieldForOrder];
            switch (order) {
                case 'asc':
                    return a > b ? 1 : a < b ? -1 : 0;
                case 'desc':
                    return a < b ? 1 : a > b ? -1 : 0;
            }
        };
    }

    return function (collection) {

        var changedCollection = cloner.clone(collection).sort(sortedRule(order));
        return changedCollection;
    }
};

module.exports.format = function(){
    var printedField = arguments[0];
    var inFormat = arguments[1];
    return function (collection){
        var changedCollection = [];
        var index;
        for (index in collection){
            var newEntry = {};
            var field;
            for (field in collection[index]) {
                if (field === printedField){
                    newEntry[field] = inFormat(collection[index][field]);
                }
                else {
                    newEntry[field] = collection[index][field];
                }
            }
            changedCollection.push(newEntry);
        }
        return changedCollection;
    }
};

module.exports.limit =  function() {
    var number = arguments[0];
    return function (collection){
        var changedCollection = [];
        var i;
        for (i = 0; i < number && i < collection.length; i++)
        {
            changedCollection.push(collection[i]);
        }
        return changedCollection;
    }
};


module.exports.and = function (){
    var arg = [].slice.call(arguments);
    return function(collection){
        if (arg.length == 0)
        {
            return [];
        }
        var current = arg[0](collection);
        var other;
        for (var i = 1; i < arg.length; i++) {
            other = arg[i](collection);
            var firstCollection = new Set(current);
            var secondCollection = new Set(other);
            var result = [];
            for (var elem of firstCollection){
                if (secondCollection.has(elem))
                {
                    result.push(elem);
                }
            }
            current = result;
        }
        return current;
    }
};

module.exports.or = function (){
    var arg = [].slice.call(arguments);
    return function(collection){
        if (arg.length == 0)
        {
            return [];
        }
        var firstCollection = new Set(arg[0](collection));
        var secondCollection;
        for (var i = 1; i < arg.length; i++) {
            secondCollection = new Set(arg[i](collection));
            var result = new Set();
            for (var elem of firstCollection)
            {
                result.add(elem);
            }
            for (var elem of secondCollection)
            {
                result.add(elem);
            }
            firstCollection = result;
        }
        return Array.from(firstCollection);
    }
};

