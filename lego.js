'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
	var phoneBook = collection;

	for (var i = 1; i < arguments.length; i++) {
		phoneBook = arguments[i](phoneBook);
	}
	return phoneBook;
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
};

module.exports.select = function (){
	var values = [].slice.call(arguments);

	return function	(collection){
		var newPhoneBook = [];

		for (var i = 0; i < collection.length; i++) {
			var record = collection[i];
			var newRecord = {};
			var keys = Object.keys(record);

			keys.forEach(function (key) {
				if (values.indexOf(key) !== -1) {
					newRecord[key] = record[key];
				}
			});
			newPhoneBook.push(newRecord);
		}

		return newPhoneBook;
		};
	};

module.exports.filterIn = function (field, choice) {
	return function (collection) {
		var newPhoneBook = [];
		for (var i = 0; i < collection.length; i++){
			var record = collection[i];
			var keys = Object.keys(record);

			if (keys.indexOf(field) !== -1 && choice.indexOf(record[field]) !== -1){
				newPhoneBook.push(record);
			}
		}
		return newPhoneBook;
	};
};

module.exports.filterEqual = function (key, value) {
	return module.exports.filterIn(key, [value]);
};

module.exports.sortBy = function (key, method) {
	return function (collection) {
		var newPhoneBook = collection.sort(function (elementFirst, elementSecond) {
			if (elementFirst[key] < elementSecond[key]) {
				return -1;
			}
			if (elementFirst[key] > elementSecond[key]) {
				return 1;
			} 
		});
		if (method === 'desc') {
			return newPhoneBook.reverse();
		}
		return newPhoneBook;
	};
};

module.exports.format = function(field, func) {
    return function (collection) {
        var newPhoneBook = collection.map(function(user) {
            user[field] = func(user[field]);
            return user;
        });
        return newPhoneBook;
    };
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
