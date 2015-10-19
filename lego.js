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
	return function(collection) {
		var changedCollection = collection.slice(0,n);
		return changedCollection;
	}
    // Магия
};

/*module.exports.select = function ('name', 'gender', 'age', 'phone', 'favoriteFruit') {
	var fields = [].slice.call(arguments);
	return function(collection) {
		for (i = 0; i < .length; i++) {
			for (var key in collection[i]) {
				if 
			}
			
				
			};
			delete argument[i].collection
		};
		return collection
	}
    // Магия
};*/

module.exports.filterIn = function (property,values) {
	return function(collection) {
		var changedCollection = collection.filter(function(filterByValues) {
			for (var i=0; i < values.length; i++) {
				if (filterByValues[property] === values[i]) {
					return true;
					break;
				}	
			}
			return false;
		});
		return changedCollection;
	}

    // Магия
};

module.exports.format = function (property,func) {
	return function(collection) {
		var changedCollection = collection.map(function(record) {
			record[property] = func(record[property]);
			return record;
		}
	return changedCollection;
	};
};

module.exports.sortBy = function (property,howSort) {
	return function(collection) {
		var changedCollection = collection.sort(function(firstRec,secondRec) {
			return [firstRec[property],secondRec[property]];
		});
		return if (howSort ==='asc') {
			changedCollection;
		} else {
			changedCollection.reverse;
		}
	};
};


