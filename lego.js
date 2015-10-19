'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var phoneBook = collection;

	for (var i = 1; i < arguments.length; i++) {
		phoneBook = arguments[i](phoneBook);
	}
	console.log(phoneBook);
	return phoneBook;
};

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
     return function (collection){
    	return collection.slice(0, n);
    };
    // Магия
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
