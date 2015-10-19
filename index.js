'use strict';

var phoneBook = require('./phoneBook');
var lego = require('./lego');
var result = lego.query(
    phoneBook,
    lego.select('name', 'gender', 'age', 'phone', 'favoriteFruit'),
    lego.filterIn('favoriteFruit', ['Яблоко', 'Картофель']),
    lego.sortBy('age', 'asc'),
    lego.format('gender', function (value) {
        return value[0];
    }),
    lego.limit(10)
);
