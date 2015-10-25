'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; ++i) {
        collection = arguments[i](collection);
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
        if (!isFinite(n) || n <= 0) {
            return [];
        } else {
            return collection.slice(0, n);
        }
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = function (field) {
    var keys = arguments;
    return function (collection) {
        return collection.map(function (contact) {
            var newObject = {};
            for (var i = 0; i < keys.length; ++i) {
				if (contact.hasOwnProperty(keys[i])) {
					newObject[keys[i]] = contact[keys[i]];
				}
            }
            return newObject;
        });
    };
};

module.exports.filterIn = function (field, condition) {
    return function (collection) {
		if (collection[0].hasOwnProperty(field)) {
			return collection.filter(function (contact) {
				for (var i in condition) {
					if (contact[field].toLowerCase() === condition[i].toLowerCase()) {
						return true;
					}
				}
				return false;
			});
		} else {
			return [];
		}
    };
};

module.exports.filterEqual = function (field, condition) {
    return function (collection) {
		if (collection[0].hasOwnProperty(field)) {
			return collection.filter(function (contact) {
				return contact[field].toLowerCase() === condition.toLowerCase() ? true : false;
			});
		} else {
			return [];
		}
    };
};

module.exports.sortBy = function (field, condition) {
    return function (collection) {
        collection = collection.sort(function (a, b) {
            return a[field] - b[field];
        });
        return condition === 'asc' ? collection : collection.reverse();
    };
};

module.exports.format = function (field, filterFinction) {
    return function (collection) {
        if (collection[0].hasOwnProperty(field)) {
            return collection.map(function (contact) {
                contact[field] = filterFinction(contact[field]);
                return contact;
            });
        } else {
            return collection;
        }
    };
};

// Будет круто, если реализуете операторы:
// or и and
