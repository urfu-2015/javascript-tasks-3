'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    var args = [].slice.call(arguments);
    args.splice(0, 1);
    console.log(args);
    var ind;
    var collectionA = collection;
    for (ind in args)
    {
        collectionA = args[ind](collectionA);
    }
    console.log(collectionA);
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    // Магия
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and

module.exports.select = function(){

    var args = [].slice.call(arguments);
    return function (collection)
    {
        var changedCollection = [];
        var index;
        for (index in collection){
            var i;
            var newEntry = {};
            for (i = 1; i < args.length; i++)
            {
                newEntry[args[i]] = collection[index][args[i]];
            }
            changedCollection.push(newEntry);
        }
        return changedCollection;
    }

};

module.exports.filterIn = function(){
    var nameField = arguments[0];
    var valuesOfField = arguments[1];
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

module.exports.filterEqual = function(){

    var nameField = arguments[0];
    var valueOfField = arguments[1];
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

    function sortedRule(a, b){
        return a[fieldForOrder] - b[fieldForOrder];
    }
    if (order === 'asc') {
        return function (collection) {
            var changedCollection = collection.sort(sortedRule);
            return changedCollection;
        }
    }
    if (order === 'desk'){
        return function (collection) {
            var changedCollection = collection.sort(sortedRule).reverse();

            return changedCollection;
        }
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
        for (i = 0; i < number; i++)
        {
            changedCollection.push(collection);
        }
        return changedCollection;
    }
};
