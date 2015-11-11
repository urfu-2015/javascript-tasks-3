'use strict';
var result = require('./phoneBook');
// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        arguments[i];
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
    //var result = arguments[0];
    result.splice(n, result.length);
    return result;
};

module.exports.select = function () {
    //var result = arguments[0];
    //var result = require('./phoneBook');
    var selectedProperties = {};
    var deletedProperties = {};
    var person = result[0];

    for (var i = 0; i < arguments.length; i++) {
        selectedProperties[arguments[i]] = i;
    }
    var i = 0;
    for (var property in person) {
        if (!(property in selectedProperties)) {
            deletedProperties['prop' + i] = property;
            i++;
        };
    }

    for (var k = 0; k < result.length; k++) {
        var property;
        for (var keyProp in deletedProperties) {
            property = deletedProperties[keyProp];
            delete result[k][property];
        }
    }
    return result;
};

module.exports.filterIn = function () {
    //var result = arguments[0];
    var listProperties = {};
    for (var i = 0; i < arguments.length; i += 2) {
        if ((i & 1) == 0) {
            listProperties[arguments[i]] = arguments[i + 1];
        }
    }

    var person = {};
    var i = 0;
    var numCorrectPropOfPers;
    var numPropInFilt;
    while (i < result.length) {
        person = result[i];
        numCorrectPropOfPers = 0;
        numPropInFilt = 0;
        for (var property in listProperties) {
            if (person.hasOwnProperty(property)) {
                var validValues = listProperties[property];
                numPropInFilt += 1;
                for (var j = 0; j <= validValues.length; j++) {
                    if (person[property] === validValues[j]) {
                        numCorrectPropOfPers += 1;
                        break;
                    }
                }
            }
        }
        if (numCorrectPropOfPers != numPropInFilt) {
            result.splice(i, 1);
        } else {
            i++;
        }
    }
    return result;
};

module.exports.filterEqual = function () {
    //var result = arguments[0];
    var listProperties = {};
    for (var i = 0; i < arguments.length; i += 2) {
        if ((i & 1) == 0) {
            listProperties[arguments[i]] = arguments[i + 1];
        }
    }

    var person = {};
    var i = 0;
    var numCorrectPropOfPers;
    var numPropInFilt;
    while (i < result.length) {
        person = result[i];

        numCorrectPropOfPers = 0;
        numPropInFilt = 0;
        for (var property in listProperties) {
            if (person.hasOwnProperty(property)) {
                var validValues = listProperties[property];
                numPropInFilt += 1;
                if (person[property] === validValues) {
                    numCorrectPropOfPers += 1;
                } else {
                    break;
                }
            }
        }
        if (numCorrectPropOfPers != numPropInFilt) {
            result.splice(i, 1);
        } else {
            i++;
        }
    }
    return result;
};

module.exports.sortBy = function () {
    //var result = arguments[0];
    var property = arguments[0];
    var method = arguments[1];
    var compareProp = function compare(personA, personB) {
        if (method == 'asc') {
            return personA[property] - personB[property];
        } else {
            return -(personA[property] - personB[property]);
        }
    };
    return result.sort(compareProp);
};

module.exports.format = function () {
    //var result = arguments[0];
    for (var i = 0; i < result.length; i++) {
        result[i][arguments[0]] = arguments[1](result[i][arguments[0]]);
    }
    return result;
};

module.exports.and = function () {
    //var result = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        arguments[i];
    }
    return result;
};



// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
