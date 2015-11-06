'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) 
{
	for (var i = 1; i < arguments.length; i++)
	{
		collection = arguments[i](collection);
	}
	return collection;

};

module.exports.select = function () {
	var conditions = [];
	
	for (var i = 0; i < arguments.length; i++)
	{
		conditions[i] = arguments[i];
	}
	return function (collection){
	for (var i = 0; i < collection.length; i++)
		{
			for (var j = 0; j < Object.keys(collection[0]).length; j++)
				{
					if (conditions.indexOf(Object.keys(collection[i])[j]) === -1)
						{
							delete collection[i][Object.keys(collection[i])[j]];
							j--;
						}
				}
		}
	return collection;
	};
};

module.exports.filterEqual = function(){
	var property = arguments[0];
	var value = arguments[1];
	var changedCollection = [];
	
	return function(collection){	
		for(var i = 0; i < collection.length; i++){
			if (collection[i][property] == value)
			{
				changedCollection.push(collection[i]);
			}
		}
	return changedCollection;
	};
};


module.exports.filterIn = function () {
	var property = arguments[0];
	var values = arguments[1];
	var changedCollection = [];
	
	return function(collection)
	{
		for (var i = 0; i < collection.length; i++)
		{
			if (values.indexOf(collection[i][property]) != -1)
				{
					changedCollection.push(collection[i]);
				}
		}
		return changedCollection;
	};
};

module.exports.sortBy = function () {
 var sort = arguments[0];
 var type = arguments[1];
 
	return function(collection){
	if (type == 'asc'){
	for (var i = 0; i < collection.length; i++){
			for (var j = 0; j < collection.length; j++){
				if (collection[i][sort] < collection[j][sort]){
					var helpfulValue = collection[j];
					collection[j] =collection[i];
					collection[i] = helpfulValue;
				}
			}
		}	
	}
	else if (type == 'desc'){
	for (var i = 0; i < collection.length; i++){
			for (var j = 0; j < collection.length; j++){
				if (collection[i][sort] > collection[j][sort]){
					var helpfulValue = collection[j];
					collection[j] =collection[i];
					collection[i] = helpfulValue;
				}
			}
		}	
	}
	return collection;
	};
};
module.exports.format = function () {
	var paramOfSort = arguments[0];
	var func = arguments[1];
	return function(collection){
		for (var i = 0; i < collection.length; i++){
			collection[i][paramOfSort] = func(collection[i][paramOfSort]);
		}
		return collection;
	};
    // Магия
};


// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

module.exports.limit = function (n) {
		return function (collection) {
		if (n>0 && n < collection.length) 
		{		
			var changedCollection = collection;
			changedCollection.splice(n, changedCollection.length); 
			return changedCollection;
		}
		else
		{
			return collection;
		}
	};
};

