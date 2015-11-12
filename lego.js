'use strict';


// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection) {
    for (var i = 1; i < arguments.length; i++) {
        collection = arguments[i](collection);
    }
    return collection;
};


module.exports.select = function () {
    var conditions = []; // условия
	
	//помещаем их
    for (var i = 0; i < arguments.length; i++) {
        conditions[i] = arguments[i];
    }
    return function (collection) {
	    var changedCollection = [];
        for (var i = 0; i < collection.length; i++) {
            //для каждого элемента коллекции создаем объект
		    var object ={};
		    for(var j = 0; j < conditions.length; j++) {
		        //если такое поле есть, наполняем объект свойствами и добавляем в новую коллекцию
				if (Object.keys(collection[i]).indexOf(conditions[j]) != -1) {
				    object[conditions[j]] = collection[i][conditions[j]];
				}
	        }
			changedCollection.push(object);
		}
        return changedCollection;
    };
};



module.exports.filterEqual = function(){
    var property = arguments[0];
    var value = arguments[1];
    var changedCollection = [];
    
    return function(collection) {	
        for(var i = 0; i < collection.length; i++) {
            if (collection[i][property] == value) {
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
    
    return function(collection) {
        for (var i = 0; i < collection.length; i++) {
            if (values.indexOf(collection[i][property]) != -1) {
                changedCollection.push(collection[i]);
            }
		}
		return changedCollection;
	};
};

module.exports.sortBy = function () {
    var sort = arguments[0]; //что сортируем
    var type = arguments[1]; //тип сортировки
    var changedCollection = [];
 
    return function(collection) {
        if (type == 'asc') {
            for (var i = 0; i < collection.length; i++) {
                for (var j = 0; j < collection.length; j++){
                    if (collection[i][sort] < collection[j][sort]) {
                        //для каждого элемента из коллекции пробегаем по коллекции, и если находится элемент меньше его, то элементы меняются местами
						var helpfulValue = collection[j];
                        collection[j] =collection[i];
                        collection[i] = helpfulValue;
                    }
                }
            }	
        }
        else if (type == 'desc') {
            for (var i = 0; i < collection.length; i++){
                for (var j = 0; j < collection.length; j++){
                    if (collection[i][sort] > collection[j][sort]){
                        // в противном случае делаем наоборот
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
    var paramOfSort = arguments[0]; //параметр сортировки
    var func = arguments[1]; // функция сортировки
    return function(collection){
        for (var i = 0; i < collection.length; i++){
            collection[i][paramOfSort] = func(collection[i][paramOfSort]);
        }
        return collection;
    };
};

module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();
        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

module.exports.limit = function (n) {
    return function (collection) {
        if (n <= 0) {
		    return [];
		}
		else if (n < collection.length) {		
            var changedCollection = collection;
            changedCollection.splice(n, changedCollection.length); 
            return changedCollection;
		}
		//Иначе возвращаем неизмененную
		else {
            return collection;
        }
    };
};

