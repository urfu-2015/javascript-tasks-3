'use strict';

function isIntNegative(n) {
    return Number(n) == n && n % 1 === 0 && Number(n) < 0;
}

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; ++i) {
        collection = arguments[i](collection);
    }
    console.log(collection);
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        // Возращаем изменённую коллекцию
        return collection.reverse();
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return function (collection) {
        if (isIntNegative(n)) {
            n = 0;
        }
        return collection.slice(0, n);
    };
};

// Оператор select
module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        return collection.map(function (contact) {
            var newContact = {};
            var keys = Object.keys(contact);
            keys.forEach(function (key) {
                if (fields.indexOf(key) > -1) {
                    newContact[key] = contact[key];
                }
            });
            return newContact;
        });
    };
};

// Оператор filterIn
module.exports.filterIn = function (field, filter) {
    return function (collection) {
        return collection.filter(function (contact) {
            return filter.indexOf(contact[field]) > -1;
        });
    };
};

// Оператор filterEqual
module.exports.filterEqual = function (field, filter) {
    return function (collection) {
        return collection.filter(function (contact) {
            return filter === contact[field];
        });
    };
};


// Оператор sortBy
module.exports.sortBy = function (field, ord_type) {
    return function (collection) {
        return collection.sort(function (contact1, contact2) {
            if (ord_type === 'asc') {
                return contact1[field] <= contact2[field] ? -1 : 1;
            } else if (ord_type === 'desc') {
                return contact1[field] >= contact2[field] ? -1 : 1;
            }
            return -1;
        });
    };
};

// Оператор format
module.exports.format = function (field, view) {
    return function (collection) {
        return collection.map(function (contact) {
            contact[field] = view(contact[field]);
            return contact;
        });
    };
};

// Оператор or
module.exports.or = function () {
    var functions = [].slice.call(arguments);
    var collectionOr;
    return function (collection) {
        if (functions.length) {
            collectionOr = functions[0](collection);
            for (var i = 1; i < functions.length; i++) {
                var collect = functions[i](collection);
                var collections_string = collectionOr.map(JSON.stringify);
                collectionOr = collectionOr.concat(
                    collect.filter(
                        function (contact) {
                            return collections_string.indexOf(JSON.stringify(contact)) ==
                                -1;
                        }
                    )
                );
            };
        } else {
            collectionOr = collection;
        }
        return collectionOr;
    };
};


module.exports.and = function () {
    var functions = [].slice.call(arguments);
    var collectionAnd;
    return function (collection) {
        if (functions.length) {
            collectionAnd = functions[0](collection);
            for (var i = 1; i < functions.length; i++) {
                var collect = functions[i](collection);
                var collections_string = collect.map(JSON.stringify);
                collectionAnd = collectionAnd.filter(
                    function (contact) {
                        return collections_string.indexOf(JSON.stringify(contact)) > -1;
                    }
                );
            };
        } else {
            collectionAnd = collection;
        }
        return collectionAnd;
    };
};
