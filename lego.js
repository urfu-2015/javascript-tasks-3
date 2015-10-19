'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection /* операторы через запятую */) {
    var newCollection = collection;
    var args = [].slice.call(arguments);
        for (var i=1; i< args.length; i++){
            newCollection=args[i](newCollection);}
        return newCollection;
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
    return function (collection){
        return collection.slice(0,n);
    };
};

module.exports.select = function() 
{return function (collection){
    var args = [].slice.call(arguments);
    return collection.map(function (abonent){
        var newAbonet={};
        for(var i=0; i < args.length; i++)
            {newAbonet[args[i]]=abonent[args[i]];}
        return newAbonet;
        });
    };
};

module.exports.filterIn = function(field, validValues)
{return function (collection)
    {return collection.filter( function ( abonent)
        {for (var i=0, k=true; i< validValues.length && k===true; i++)
            {if (abonent[field].indexOf(validValues[i])===-1) 
                {k=false;}
            }
        return k;
        });
    };
};

module.exports.filterEqual = function(field, validValues)
{return function (collection)
    {return collection.filter( function ( abonent)
        {return abonent[field]===validValues;});
    };
};

module.exports.sortBy = function(field, sortingOrder)
{return function (collection)
    {newcollection=collection.sort( function (a,b)
        {if (a[field]<b[field]){ return -1};
        if (a[field]>b[field]){ return 1};
        if (a[field]=b[field]){ return 0};
        });
    if(sortingOrder === 'asc')
        { return newcollection;}
    else 
        {return newcollection.reverse();};
    };
};


module.exports.format = function(field, formatValues)
{ return function (collection)
    {return collection.map(function(abonent){
        var newAbonet=abonent;
        newAbonet[field] = formatValues(abonent[field]);
        return newAbonet;
        });
    };
};
 

// Будет круто, если реализуете операторы:
// or и and
