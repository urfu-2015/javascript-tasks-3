import {curry, pipe} from './Uganda';
import * as _ from './thunderscore';

// Метод, который будет выполнять операции над коллекцией один за другим
export const query = pipe;

// Оператор reverse, который переворачивает коллекцию
export const reverse = curry(function (collection) {
    return [...collection].reverse();
});

// Оператор limit, который выбирает первые N записей
export const limit = curry((n, collection) => collection.slice(0, n), 2);

export const select = (...fields) => (
    collection => collection.map(curry(_.select)(fields))
);

export const filterIn = curry(_.filterIn);

export const filterEqual = curry(_.filterEqual);

export const sortBy = curry(_.sortBy);

export const format = curry(_.format);


// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit

// Будет круто, если реализуете операторы:
// or и and
