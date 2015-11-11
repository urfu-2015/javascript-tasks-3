'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
	for(var i = 1; i < arguments.length; i++) {
		arguments[i](collection);
	}
	return collection;
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
	return function (collection) {
        collection.splice(n, collection.length);
		return collection;
    };
};


module.exports.select = function () {
	var selectedProperties = {};
	for (var i = 0; i < arguments.length; i++) {
			selectedProperties[arguments[i]] = i;	
		}
	return function(collection) {
		var deletedProperties = {};
		var person = collection[0];
		var i = 0;
		for (var property in person) {
			if (!(property in selectedProperties)) {
					deletedProperties['prop'+i] = property;
					i++;
			};
		}
	
		for (var k = 0; k < collection.length; k++) {
			var property;
			for (var keyProp in deletedProperties) {
				property = deletedProperties[keyProp];
				delete collection[k][property];
			}
		}
		return collection;
	}
};


module.exports.filterIn = function () {
	
	var listProperties ={};
	for (var i = 0; i < arguments.length; i+=2) {
		if ((i & 1) == 0) {
			listProperties[arguments[i]] = arguments[i+1];
		}
	}
	
	return function(collection) {
		var person = {};
		var i = 0;
		var numCorrectPropOfPers;
		var numPropInFilt;
		while (i < collection.length) {
			person = collection[i];
			numCorrectPropOfPers = 0;	
			numPropInFilt = 0;
				for (var property in listProperties) {
					if (person.hasOwnProperty(property)) {
						var validValues = listProperties[property];
						numPropInFilt += 1;
						for (var j = 0; j <= validValues.length; j++) {
							if (person[property] === validValues[j]) {
								numCorrectPropOfPers +=1;
								break;
							}
						}
					}
				}
			if (numCorrectPropOfPers != numPropInFilt) {
			collection.splice(i,1);
			} else {
				i++;
			}	
		}
		return collection;
	}
};


module.exports.filterEqual = function () {
	
	var listProperties ={};
	for (var i = 0; i < arguments.length; i+=2) {
		if ((i & 1) == 0) {
			listProperties[arguments[i]] = arguments[i+1];
		}
	}
	
	return function(collection) {
		var person = {};
		var i = 0;
		var numCorrectPropOfPers;
		var numPropInFilt;
		while (i < collection.length) {
			person = collection[i];
			numCorrectPropOfPers = 0;	
			numPropInFilt = 0;
					for (var property in listProperties) {
						if (person.hasOwnProperty(property)) {
							var validValues = listProperties[property];
							numPropInFilt += 1;
							if (person[property] === validValues) {
									numCorrectPropOfPers +=1;
							} else {
								break;
							}
						}	
					}
			if (numCorrectPropOfPers != numPropInFilt) {
				collection.splice(i,1);
			} else {
				i++;
			}	
		}
		return collection;
	}
};


module.exports.sortBy = function () {

	var property = arguments[0];
	var method = arguments[1];

	return function(collection) {
		var compareProp = function compare(personA, personB) {
			if (method == 'asc') {
				return personA[property] - personB[property];
			} else {
				return -(personA[property] - personB[property]);
			}
		}
		return collection.sort(compareProp);
	}
};


module.exports.format = function () {

	var property = arguments[0];
	var func = arguments[1];

	return function(collection) {
		for (var i = 0; i < collection.length; i++) {
			collection[i][property] = func(collection[i][property]);
		}
		return collection;
	}
}


module.exports.and = function () {

	var listFunction = {};
	for(var i = 0; i < arguments.length; i++) {
		listFunction['func'+i] = arguments[i];
	}

	return function(collection) {
		for (var func in listFunction) {
			var funcAnd = listFunction[func];
			funcAnd(collection);
		}
		return collection;
	}
};


module.exports.or = function () {

	var listFunction = {};
	for(var i = 0; i < arguments.length; i++) {
		listFunction['func'+i] = arguments[i];
	}
	var b = arguments[0];

	return function(collection) {
		var personArr = [];
		var changedCollection = [];
		for (var i = 0; i < collection.length; i++) {
			personArr[0] = collection[i];
			for (var func in listFunction) {
				var funcOr = listFunction[func];
				funcOr(personArr);
				//return personArr.length;
				if (personArr.length > 0) {
					changedCollection = changedCollection.concat(personArr[0]);
					break;
				} else {
					personArr[0] = collection[i];
				}
			}
		}
		return changedCollection;
	}
};
