'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) 
{
	var i;
	var changedCollection = collection;
	for (i = 1; i < arguments.length; i++)
	{
		arguments[i](changedCollection);
	}
	return changedCollection;

};

module.exports.select = function () {
	var conditions = [];
	var whatNeed = [false, false, false, false, false, false];
	for (var i = 0; i < arguments.length; i++)
	{
		conditions[i] = arguments[i];
	}
	
	return function(collection){
	var properties = Object.keys(collection[0]);
	
	for (var i = 0; i < conditions.length; i++)
	{
		
		for (var j = 0; j < properties.length; j++)
			{
				if (conditions[i] == properties[j])
				{
					whatNeed[j] = true;
				}
			}
	}
	
	for (var i = 0; i < collection.length; i++)
	{
		for (var j = 0; j < whatNeed.length; j++)
		{
			if (!whatNeed[j])
			{
				delete collection[i][properties[j]];
			}
		}
	}
		return collection;
	};
};

module.exports.filterEqual = function(){
	var prop = arguments[0];
	var wish = arguments[1];
	
	return function(collection){	
		for(var i = 0; i < collection.length; i++){
			if (collection[i][prop] != wish)
			{
				collection.splice(i,1);
				i--;
			}
		}
	return collection;
	};
};


module.exports.filterIn = function () {
	var prop = arguments[0];
	var fruits = arguments[1];
	var wishList = [];
	
	return function(collection)
	{
		for (var i = 0; i < fruits.length; i++){
			for (var j = 0; j < collection.length; j++){
					if (collection[j] != null)
					{
					if (fruits[i] == collection[j][prop])
					{
						wishList[j] = collection[j];
					}
					}
				}
			}
		var count = 0;
		while(count < wishList.length){
			if (collection[count] != wishList[count])
			{
				collection.splice(count,1);
				wishList.splice(count,1);
			}
			else
			{
				count++;
			}
		}
	return collection;
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
			return collection;
	}
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
		collection.splice(n, collection.length); 
		return collection; 
	};
};

