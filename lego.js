'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
	var filteredCollection = collection;
	arguments.forEach(function (argument) {
		argument(filteredCollection);
	})
	return filteredCollection;
};

module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

module.exports.limit = function (n) {
	return function(collection){
		return n < 0 ? [] : n < collection.length ? collection.slice(0,n) : collection;
	};
};

module.exports.select = function () {
	var keys = [].slice.apply(arguments);
	return function (collection) {
		var filteredCollection= [];
		for(var k in collection){
			filteredCollection[k] = [];
			keys.forEach(function(key){
				filteredCollection[k][key] = collection[k][key];
			});
		}
		return filteredCollection;
	};
};

module.exports.filterIn = function (keyForFilter, valuesForFilter) {
	return function(collection){
		var filteredCollection =[];

		collection.forEach(function(entry){
			valuesForFilter.forEach(function(value){
				if(entry[keyForFilter] == value){
					filteredCollection.push(entry);
				}
			});
		});

		return filteredCollection;
	};
};

module.exports.sortBy = function (keyForSort, order) {
	return function(collection){
		function compare(a,b){
			return a[keyForSort] > b[keyForSort] ? 1 : -1;
		}

		var sortedCollection = collection.sort(compare);
		return order === 'desc' ? sortedCollection.reverse() : order === 'asc' ? sortedCollection : 0; //Заменить ноль на ошибку
	};
};

module.exports.format = function (field, func) {
	return function(collection){
		collection.forEach(function(entry){
			entry[field] = func(entry[field]);
		});
		return collection;
	};
};

module.exports.filterEqual = function (key, expectedValue) {
	return function(collection){
		var filteredCollection = collection.filter(function (entry) {
			return entry[key] == expectedValue;
		});
		return filteredCollection;
	};
};
// Вам необходимо реализовать остальные операторы:
//  

// Будет круто, если реализуете операторы:
// or и and
