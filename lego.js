'use strict';

module.exports = {
	query: query,
	reverse: reverse,
	limit: limit,
	select: select,
	filterIn: filterIn,
	filterEqual: filterEqual,
	sortBy: sortBy,
	format: format,
}

// Метод, который будет выполнять операции над коллекцией один за другим
function query(collection){
	var phoneBook = collection;
	for (var i = 1; i < arguments.length; i++) {
		phoneBook = arguments[i](phoneBook);
	}
	console.log(phoneBook);
	return phoneBook;
};

// Оператор reverse, который переворачивает коллекцию
function reverse(){
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
function limit(n){
	return function (collection){
	return collection.slice(0, n);
	};
};

function select(){
	var args = arguments;
	return function (collection) {
		var values = [];
		for (var e in args) {
			values.push(args[e]);
		}
		var newCollection = [];
		for (var i = 0; i < collection.length; i++) {
			newCollection.push({});
			for (var e in collection[i]) {
				if (values.indexOf(e) != -1 || values[0] == '*') {
                    newCollection[i][e] = collection[i][e];
				}
			};
		};
		return newCollection;
	};
}

function filterIn(field, values){
	return function (collection) {
		var changedCollection = collection.filter(function (item) {
			for (var i = 0; i < values.length; i++) {
				if (item[field] === values[i]) {
					return true;
				}
			}
			return false;
		});
		return changedCollection;
    };
}

function filterEqual(field, values){
	return module.exports.filterIn(key, [value]);
}

function sortBy(selector, type){
	return function (collection) {
		type = type === 'asc' ? 1 : -1;
		return collection.sort(function (contact1, contact2) {
			if (contact1[selector] > contact2[selector]) {
				return type;
			} else {
				return -type;
			}
		});
    };
}

function format(field, func){
	return function (collection) {
        var newPhoneBook = collection.map(function(user){
            user[field] = func(user[field]);
            return user;
        });
        return newPhoneBook;
    };
}
