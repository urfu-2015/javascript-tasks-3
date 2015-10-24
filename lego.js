'use strict';

function query(collection){
	var phoneBook = collection;
	for (var i=1;i<arguments.length;i++){
		phoneBook = arguments[i](phoneBook);
	}
	return phoneBook;
};

function reverse(){
    return function (collection){
		return collection.reverse();
    };
};

function limit(n){
	n = n<0 ? 0 : n;
	return function (collection){
	return collection.slice(0, n);
	};
};

function select(){
	var args = arguments;
	return function (collection){
		var values = [];
		for (var e of args){
			values.push(e);
		}
		var newCollection = [];
		for (var i=0;i<collection.length;i++){
			newCollection.push({});
			for (var field in collection[i]){
				if (values.indexOf(field) !== -1 || values[0] === '*'){
                    newCollection[i][field] = collection[i][field];
				}
			};
		};
		return newCollection;
	};
}

function filterIn(field, values){
	return function (collection){
		var changedCollection = collection.filter(function (item){
			for (var i=0;i<values.length;i++){
				if (item[field] === values[i]){
					return true;
				}
			}
			return false;
		});
		return changedCollection;
    };
}

function filterEqual(field,values){
	return module.exports.filterIn(key,[value]);
}

function sortBy(selector, type){
	return function (collection){
		type = type === 'asc' ? 1 : -1;
		return collection.sort(function(a,b){
			if (a[selector] === b[selector]){
				return 1;
			}
			if (a[selector]>b[selector]){
				return type;
			} else{
				return -type;
			}
		});
    }
}

function format(field, func){
	return function (collection){
        var newPhoneBook = collection;
		newPhoneBook.map(function(user){
            user[field] = func(user[field]);
            return user;
        });
        return newPhoneBook;
    };
}

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
