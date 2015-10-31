'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
	var filterCollection = collection;
	for (var i = 1; i < arguments.length; i++) {
		filterCollection = arguments[i](filterCollection);
	};
	return filterCollection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

//Оператор select, который выбирает из массива
module.exports.select = function () {
	var keys = [].slice.apply(arguments);
	return function (collection) {
		var filterCollection = [];
		for(var i in collection){
			filterCollection[i] = [];
			keys.forEach(function(evade){
				filterCollection[k][evade] = collection[k][evade];
			});
		}
		return filterCollection;
	};
};

// Оператор filterIn, который фильтрует по параметрам

module.exports.filterIn = function (keyFilter, valueFilter) {
	return function (collection) {
		var filterCollection = [];
		collection.forEach(function(evade){
			valueFilter.forEach(function(value){
				if(evade[keyFilter] == value){
					filterCollection.push(evade);
				}
			});
		});
		return filterCollection;
	};	
};

// Оператор filterEqual, который фильтрует по конкретному парамтеру

module.exports.filterEqual = function (keyFilter, valueFilter) {
	return function (collection) {
		var filterCollection = [];
		collection.forEach(function(evade){
			if(evade[keyFilter] === valueFilter){
				filterCollection.push(evade);
			}
		});
		return filterCollection;
	};	
};

// Оператор sortBy, который сортирует по признаку

module.exports.sortBy = function (keySort, evade) {
	return function(collection){
		function compared(a,b){
			return a[keySort] > b[keySort] ? 1 : -1;
		}
		var sortCollection = collection.sort(compared);
		return evade === 'asc' ? sortCollection : sortCollection.reverse();
	};
};


// Оператор format, который форматирует функцию

module.exports.format = function (key, func) {
	return function (collection) {
		collection.forEach(function(evade){
			evade[key] = func(evade[key]);
		});
		return collection;
	};	
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    // Магия
    return function (collection) {
	    var isIndexValid = true;
	    if (n < 0) {
	        console.error('Неверный индекс!');
	        isIndexValid = false;
	    }
	    else {
	        if (isValidIndex) {
	            return collection.slice(0, n);
	        } else {
	            return collection;
	        }
	    }
	}; 
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
