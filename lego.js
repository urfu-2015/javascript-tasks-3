'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var functions=1; functions < arguments.length; functions++){
        collection = arguments[functions](collection);
    }
    return collection;
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
    return function (collection) {
        // Магия
        var newCollection = [];
        for (var count = 0; count < n; count++){
            newCollection.push(collection[count]);
        }
        return newCollection;
    };
};

module.exports.select = function (){
    var fields = arguments;
    return function (collection) {
        var newCollection = [];
        for (var contact in collection){
            var newField = {};
            for (var field in fields){
                newField[fields[field]] = collection[contact][fields[field]];            			
            }
            newCollection.push(newField);		
        }
        return newCollection;
    };
};

module.exports.filterIn = function (field, criteria){
    return function (collection) {
        var newCollection = [];
        for (var contact in collection){
            for (var criterion in criteria){
                if (collection[contact][field]==criteria[criterion]){
                    newCollection.push(collection[contact]);
                }
            }
        }
        return newCollection;
    };
};

module.exports.filterEqual = function (field, criterion){
    return function (collection) {
        return module.exports.filterEqual(field, criterion);
    };
};

function sort(collection, field){
    for (var contact1 in collection){
        for (var contact2 = 0; contact2 < collection.length-1; contact2++){
            if (collection[contact2][field] > collection[Number(contact2)+1][field]){
                var newField = {};
                newField = collection[Number(contact2)+1][field];
                collection[Number(contact2)+1][field] = collection[contact2][field];
                collection[contact2][field] = newField;
            }
        }
    }
    return collection;
}

module.exports.sortBy = function (field, criterion){
    return function (collection) {
        var newCollection = [];
        if (criterion == 'asc'){
            collection = sort(collection, field);
        }
        else{
            collection = sort(collection, field).reverse();
        }
        return collection;
    };
};

module.exports.format = function (field, func){
    return function (collection) {
        for (var contact in collection){
            collection[contact][field] = func(collection[contact][field]);
        }
        return collection;
    };
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
