module.exports.query = function (collection) {
    var collectionCopy = collection.slice();
    for (var i = 1; i < arguments.length; i++) {
        collectionCopy = (arguments[i])(collectionCopy);
    }
    return collectionCopy;
 };
 
 // Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function() {
    return function(collection) {
        return collection.slice().reverse();
     };
 };
 
 // Оператор limit, который выбирает первые N записей

 module.exports.limit = function (n) {
    var isValidIndex = true;
    if (n < 0) {
        console.error('Should`t be limited array negative number.');
        isValidIndex = false;
    }
    return function (collection) {
        if (isValidIndex) {
            return collection.slice(0, n);
        } else {
            return collection;
        }
    };
};
 
module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (element) {
            var newElement = {};
            var keysInThisElement = Object.keys(element);
            fields.forEach(function (key) {
                if (keysInThisElement.indexOf(key) !== -1) {
                    newElement[key] = element[key];
                }
            });
            return newElement;
        });
    };
};


module.exports.filterIn = function(selector, values) {
    return function(collection) {
        return collection.filter(function(contact) {
            return values.some(value => value === contact[selector]);
        });
    };
};
 
module.exports.filterEqual = function(selector, value) {
    return function(collection) {
        return collection.filter(contact => value === contact[selector]);
    };
};

module.exports.sortBy = function (field, order) {
    var isValidArguments = true;
    if (order !== 'asc' && order !== 'desc') {
        console.error('Неправильный аргумент.');
        isValidArguments = false;
    }
    return function (collection) {
        if (!isValidArguments) {
            return collection;
        }
        return collection.sort(__getSortPredicate(field, order));
    };
};

module.exports.format = function(selector, f) {
    return function(collection) {
        collection.forEach(contact => {
            contact[selector] = f(contact[selector]);
        });
        return collection;
    };
};
