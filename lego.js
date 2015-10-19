'use strict';

module.exports.query = function (collection) {
    var operators = [].slice.call(arguments);
    var newCollection = collection;
    operators.shift();
    operators.forEach(function (operator) {
        newCollection = operator(newCollection);
    });
    return newCollection;
};

function cloneCollection(collection) {
    return collection.map(function(contact) {
        var fields = Object.keys(contact);
        return fields.reduce(function(newContact, field) {
            newContact[field] = contact[field];
            return newContact;
        }, {});
    });
}



module.exports.reverse = function () {
    return function (collection) {
        return cloneCollection(collection).reverse();
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        return collection.slice(0, n);
    };
};

module.exports.select = function () {
    var fields = [].slice.call(arguments);
    return function (collection) {
        var newCollection = cloneCollection(collection);
        newCollection.forEach(function (contact) {
            var contactFields = Object.keys(contact);
            contactFields.forEach(function (field) {
                if (fields.indexOf(field) < 0) {
                    delete contact[field];
                }
            })
        });
        return newCollection;
    }
};

module.exports.filterIn = function (field, filter) {
    return function (collection) {
        return collection.filter(function (contact) {
            return filter.indexOf(contact[field]) > -1;
        });
    }
};

module.exports.sortBy = function (field, sort) {
    return function (collection) {
        var newCollection = cloneCollection(collection);
        newCollection.sort(function (a, b) {
            var aField = a[field];
            var bField = b[field];
            var compareRes;
            if (typeof aField == 'number' && typeof bField == 'number') {
                compareRes = aField - bField;
            } else {
                compareRes = aField.localeCompare(bField, 'en', {numeric: true});
            }
            return sort === 'asc' ? compareRes : -compareRes;
        });
        return newCollection;
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        var newCollection = cloneCollection(collection);
        newCollection.forEach(function (contact) {
            contact[field] = func(contact[field]);
        });
        return newCollection;
    };
};

module.exports.filterEqual = function (field, value) {
    return this.filterIn(field, [value]);
};


module.exports.and = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        var resCollections = deeperQuery(collection, operators);
        return merge(resCollections, and);
    };
};

module.exports.or = function () {
    var operators = [].slice.call(arguments);
    return function (collection) {
        return merge(deeperQuery(collection, operators), or);
    }
};

function deeperQuery(collection, operators) {
    if (operators.length == 0) {
        return collection;
    }
    var resCollections = [];
    operators.forEach(function (operator) {
        resCollections.push(operator(collection));
    });
    return resCollections;
}

function merge(resCollections, func) {
    var result = resCollections.shift();
    resCollections.forEach(function (collection) {
        result = func(result, collection);
    });
    return result;
}

function and(result, collection) {
    var mapCollection = collection.map(JSON.stringify);
    return result.filter(function (contact) {
        return mapCollection.indexOf(JSON.stringify(contact)) > -1;
    });
}

function or(result, collection) {
    var mapResult = result.map(JSON.stringify);
    return result.concat(collection.filter(function (contact) {
        return mapResult.indexOf(JSON.stringify(contact)) == -1;
    }));
}

