module.exports.query = function (collection /* операторы через запятую */) {
    var args = [].slice.call(arguments);
    args.splice(0, 1);
    args.forEach(function (arg) {
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
        if (n > 0) {
            return collection.slice(0, n);
        }
        return collection;
    };
};

module.exports.select = function () {
    var args = [].slice.call(arguments);
    return function (collection) {
        return collection.reduce(function (contacts, contact) {
            var currentContact = {};
            args.forEach(function (arg) {
                currentContact[arg] = contact[arg];
                return currentContact;
            });
            contacts.push(currentContact);
            return contacts;
        }, []);
    };
};

module.exports.filterIn = function (fieldName, fieldValue) {
    return function (collection) {
        return collection.filter(function (contact) {
            return fieldValue.indexOf(contact[fieldName]) != -1;
        });
    };
};

module.exports.sortBy = function (fieldSort, sortMethod) {
    return function (collection) {
        if (sortMethod === 'asc') {
            return collection.sort(function (a, b) {
                return a[fieldSort] - b[fieldSort];
            });
        } else if (sortMethod === 'desc') {
            return collection.sort(function (a, b) {
                return b[fieldSort] - a[fieldSort];
            });
        }
        return collection;
    };
};

module.exports.format = function (gender, firstLetter) {
    return function (collection) {
        return  collection.map(function (contact) {
            contact[gender] = firstLetter(contact[gender]);
            return contact;
        });
    };
};

module.exports.filterEqual = function (fieldName, fieldValue) {
    var resultCollection = [];
    return function (collection) {
        return resultCollection = collection.filter(function (contact) {
            return contact[fieldName] === fieldValue;
        });
    };
};
