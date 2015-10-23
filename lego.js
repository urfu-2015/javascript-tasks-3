'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    for (var i = 1; i < arguments.length; i++) {
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
    // Магия
    return function (collection) {
        if (n < 0) {
            return [];
        }
        return collection.slice(0, n);
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.select = function () {
    var fields = [];
    for (var i = 0; i < arguments.length; i++) {
        fields[i] = arguments[i];
    }
    return function (collection) {
        return collection.map(function (note) {
            var changedNote = {};
            fields.forEach(function (field) {
                if (field in note) {
                    changedNote[field] = note[field];
                }
            });
            return changedNote;
        });
    };
};

module.exports.filterIn = function (field, values) {
    return function (collection) {
        return collection.filter(function (note) {
            return values.indexOf(note[field]) >= 0;
        });
    };
};

module.exports.filterEqual = function (field, value) {
    return function (collection) {
        return collection.filter(function (note) {
            return note[field] == value;
        });
    };
};

module.exports.sortBy = function (field, method) {
    return function (collection) {
        function sortCol(a, b) {
            if (a[field] < b[field]) {
                return -1;
            } else if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        }

        if (method == 'asc') {
            return collection.sort(sortCol);
        } else if (method == 'desc') {
            return collection.sort(sortCol).reverse();
        }
    };
};

module.exports.format = function (field, func) {
    return function (collection) {
        return collection.map(function (note) {
            note[field] = func(note[field]);
            return note;
        });
    };
};

// Будет круто, если реализуете операторы:
// or и and
function equalsNotes(a, b) {
    var result = false;
    for (var keyA in a) {
        for (var keyB in b) {
            if (keyA == keyB) {
                if (a[keyA] == b[keyB]) {
                    result = true;
                    break;
                }
            }
        }
    }
    return result;
}

function mergerCollections(a, b) {
    var result = a;
    var bool;

    b.forEach(function (noteB) {
        bool = false;
        for (var noteA in a) {
            if (equalsNotes(noteA, noteB)) {
                bool = true;
                break;
            }
        }
        if (!bool) {
            result.push(noteB);
            b.slice(b.indexOf(noteB), 1);
        }
    });
    return result;
}

module.exports.or = function () {
    var arg = arguments;
    return function (collection) {
        var resultCollection = [];
        for (var i = 0; i < arg.length; i++) {
            resultCollection = mergerCollections(resultCollection, arg[i](collection));
            console.log(resultCollection);
        }
        return resultCollection;
    };
};

module.exports.and = function () {
    var arg = arguments;
    return function (collection) {
        for (var i = 0; i < arg.length; i++) {
            collection = arg[i](collection);
        }
        return collection;
    };
};
