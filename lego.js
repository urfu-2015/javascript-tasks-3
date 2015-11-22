'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var args = [].slice.call(arguments);
    args.splice(0, 1);
    args.forEach(function (arg){
        collection = arg(collection);
    });
    return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    // Магия
    return function (collection) {
        return collection.slice(0,n);
    };
};

module.exports.select = function() {
    var args = [].slice.call(arguments);
    var resultCollection = [];
    return function (collection) {
        collection.forEach(function (contact) {
            var oneContact = {};
            args.forEach(function (arg) {
                oneContact[arg] = contact[arg];
            });
            resultCollection.push(oneContact);
        });
        return resultCollection;
    };
};

module.exports.filterIn = function () {
    var args = [].slice.call(arguments);
    var resultCollection = [];
    return function (collection){
        collection.forEach(function (contact) {
            args[1].forEach(function(arg){
                if (contact[args[0]] === arg){
                    resultCollection.push(contact);
                }
            })
        });
        return resultCollection;
    };
};

module.exports.sortBy = function () {
    var args = [].slice.call(arguments);
    return function (collection){
        collection.sort(checkResult);
        if (args[1] == 'asc'){
            return collection;
        }else{
            return collection.reverse();
        }
    };
};

function checkResult(firstContact, secondContact){
    return firstContact.age - secondContact.age;
}

module.exports.format = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        collection.forEach(function (contact) {
            contact[args[0]] = args[1](contact[args[0]]);
        });
        return collection;
    };
};

module.exports.filterEqual = function () {
    var args = [].slice.call(arguments);
    var resultCollection = [];
    return function (collection) {
        collection.forEach(function (contact) {
            if (contact[args[0]] == args[1]){
                resultCollection.push(contact)
            }
        });
        return resultCollection;
    };
};
