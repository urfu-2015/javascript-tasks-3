# Задача к лекции «Функции в Javascript» – «Картофельная вечеринка»

:sos: [Как создать Pull Request](https://github.com/urfu-2015/guides/blob/master/how-to-pull-request.md)  
:warning: При создании PullRequest'а не забудьте указать ваши имя и фамилию.
:warning: Дедлайн 19.10.2015 23:59:59.999

### Общие требования

Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

Прежде чем отправлять решение проверьте его на соответствие [общим требованиям](https://github.com/urfu-2015/guides/blob/master/js-codestyle.md).

А также на соответствие codestyle. Для этого в корне выполните:

```js
// Устанавливаем проверяльщик
npm install

// Проверяем
npm run lint

// В результате выведутся ошибки, если они есть
// Если какие-либо ошибки будут не понятны – смело спрашиваем у ментора
```

### Задача

Осень уже давно наступила, журавли улетили на юг, картофель выкопан, а яблоки собраны.
Самое время для картофельно-яблочной вечеринки! У меня есть записная книжка друзей
__phoneBook.js__, и мне понадобилось выбрать из неё самых заядлых любителей яблок
и картофеля.

Так как я разработчик, для этого я решил написать конструктор запросов __lego.js__.
Пример использования конструктора, и что в нём должно быть смотри в файле __index.js__.

Необходимо реализовать базовые операторы конструктора (назовём его «Лего»,
он же конструктор):  
query, select, filterIn, filterEqual, sortBy, format и limit

### Необязательное задание (+2 к харизме, +3 к интеллекту)

Будет нереально круто, если вы реализуете два дополнительных условных оператора:   
or и and


![](https://static50.cmtt.ru/tj_articles_2/kickstarter-potato-salad-party/31/ff2ckickstarter-potato-salad-party-5429083669e3b.jpg)
