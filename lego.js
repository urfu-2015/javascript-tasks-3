'use strict';
// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
	var phoneBook = Object.assign([], collection);
	for (var i = 1; i < arguments.length; i++) {
		phoneBook = arguments[i](phoneBook);
	}
	console.log(phoneBook);
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

module.exports.select = function () {
	var args = [].slice.apply(arguments);
	return function (collection) {
		var selectedPhoneBook = [];
		for (var i = 0; i < collection.length; i++) {
			selectedPhoneBook[i] = {};
			for(var item of args) {
				selectedPhoneBook[i][item] = collection[i][item];
			}
		}
		return selectedPhoneBook;
	}
}

module.exports.filterIn = function (item, filter) {
	return function (collection) {
		var filtredPhoneBook = [];
		for (var i = 0; i < collection.length; i++) {
			for(var e of filter) {
				if (collection[i][item] === e) {
					filtredPhoneBook.push(collection[i]);
					break;
				}
			}
		}
		return filtredPhoneBook;
	}
}

module.exports.filterEqual = function (item, filter) {
	return function (collection) {
		var filtredPhoneBook = [];
		for (var i = 0; i < collection.length; i++) {
			if (collection[i][item] === filter) {
				filtredPhoneBook.push(collection[i]);
			}
		}
		return filtredPhoneBook;
	}
}


module.exports.sortBy = function (item, isReverse) {
	return function (collection) {
		function compare(a, b) {
			if (a[item] > b[item]) {
				return 1;
			}
			if (a[item] < b[item]) {
				return -1;
			}
			return 0;
		}
		
		collection = collection.sort(compare);
		if (isReverse === 'desc') {
			return collection.reverse();
		}
		return collection;
	}
}


module.exports.format = function (item, handler) {
	return function (collection) {
		for (var i = 0; i < collection.length; i++) {
			collection[i][item] = handler(collection[i][item]);
		}
		return collection;
	}
}

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
	return function (collection) {
		if (n < collection.length && n >= 0) {
			return collection.slice(0, n);
		}
		else if (n >= collection.length) {
		    return collection;
		}
		else {
			throw RangeError('Parameter must be non-negative');
		}
	}
	// Магия
};
// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
