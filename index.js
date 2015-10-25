'use strict';

// Подключаем нашу телефоную книгу друзей
var phoneBook = require('./phoneBook');

// Подключаем волшебный конструктор запросов
var lego = require('./lego');

console.log(lego.query(
    phoneBook,
    lego.select('name', 'age'),
    lego.or(
        lego.filterEqual('age', '21'),
        lego.filterEqual('name', 'Анна')
    )
));

console.log(lego.query(
    phoneBook,
    lego.or(
        lego.filterEqual('age', 20),
        lego.filterEqual('age', 33),
        lego.filterEqual('name', 'Анна')
    )
));

// Мы хотим найти подходящих друзей для вечеринки
var result = lego.query(

    // Для этого передаём нашу книгу
    phoneBook,

    // И выбираем только нужные поля
    lego.select('name', 'gender', 'age', 'phone', 'favoriteFruit'),

    // Обязательно выбираем тех, кто любит Яблоки и Картофель (самое важное !!!)
    lego.filterIn('favoriteFruit', ['Яблоко', 'Картофель']),

    // Отсортируем их по возрасту (но зачем?)
    lego.sortBy('age', 'asc'), // Бывает только asc (от меньшего к большему) или desc (наоборот)

    // А пол выведем только первой буквой для удобства
    lego.format('gender', function (value) {
        return value[0];
    }),

    // На дачу влезет примерно 10 человек
    lego.limit(10)
);

// console.log(result);

var result = lego.query(
    phoneBook,

    // Выбираем всех парней, которые любят картофель, и всех девушек, которые любят яблоки
    lego.or(
        lego.and(
            lego.filterEqual('gender', 'Мужской'),
            lego.filterIn('favoriteFruit', ['Картофель'])
        ),
        lego.and(
            lego.filterEqual('gender', 'Женский'),
            lego.filterIn('favoriteFruit', ['Яблоко'])
        )
    )
);

// console.log(result);
