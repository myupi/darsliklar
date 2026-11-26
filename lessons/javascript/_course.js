// Курс «JavaScript» — план уроков (заказчик, 26.11.2026: «это темы JS», затем таблица тем для 11–14 лет «без localStorage
// и с новыми темами»: 25 уроков и финальный проект).
// Место в дорожной карте заказчика (17.11.2026): HTML → CSS → ИИ → Bootstrap → Tilda → Blockly → JavaScript → Git/GitHub → React.
// Файл урока: lessons/javascript/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …). Как только файл появится, урок «готов» в каталоге.
// Практики и тесты — пока не решены, по слову заказчика.

export default {
  title: 'JavaScript',
  subtitle: 'Сайт оживает',
  short: 'JS',
  color: '#E5B800',
  order: 7,
  lessons: [
    { n: 1, slug: 'chto-takoe-js', title: 'Что такое JavaScript', topics: ['зачем нужен JS', 'подключить JS к сайту', 'console.log()'] },
    { n: 2, slug: 'peremennye', title: 'Переменные', topics: ['let', 'const', 'хранение данных', 'изменение значений'] },
    { n: 3, slug: 'tipy-dannyh', title: 'Типы данных', topics: ['string', 'number', 'boolean'] },
    { n: 4, slug: 'operatory', title: 'Операторы', topics: ['+ - * /', '> <', '==='] },
    { n: 5, slug: 'usloviya-1', title: 'Условия — 1 часть', topics: ['if', 'else'] },
    { n: 6, slug: 'usloviya-2', title: 'Условия — 2 часть', topics: ['else if', '&&', '||'] },
    { n: 7, slug: 'funkcii-1', title: 'Функции — 1 часть', topics: ['что такое функция', 'зачем она нужна', 'создание и вызов'] },
    { n: 8, slug: 'funkcii-2', title: 'Функции — 2 часть', topics: ['параметры', 'return'] },
    { n: 9, slug: 'massivy', title: 'Массивы — основы', topics: ['несколько значений', 'индексы', 'length', 'получение элемента'] },
    { n: 10, slug: 'izmenenie-massivov', title: 'Изменение массивов', topics: ['push()', 'pop()'] },
    { n: 11, slug: 'cikly', title: 'Циклы', topics: ['for', 'повторение действий', 'перебор массива'] },
    { n: 12, slug: 'obekty', title: 'Объекты', topics: ['связанные данные', 'свойства: имя, цена, уровень, изображение'] },
    { n: 13, slug: 'dom-1', title: 'DOM — находим элементы', topics: ['связь JS с HTML', 'querySelector()', 'querySelectorAll()'] },
    { n: 14, slug: 'dom-2', title: 'DOM — изменяем страницу', topics: ['текст', 'CSS-классы', 'внешний вид элементов'] },
    { n: 15, slug: 'sobytiya-1', title: 'События — клики', topics: ['click', 'addEventListener()'] },
    { n: 16, slug: 'sobytiya-2', title: 'События — действия пользователя', topics: ['input', 'change', 'реакция на ввод и выбор'] },
    { n: 17, slug: 'input', title: 'Работа с input', topics: ['.value', 'данные пользователя'] },
    { n: 18, slug: 'formy', title: 'Формы', topics: ['данные формы', 'submit', 'простая проверка'] },
    { n: 19, slug: 'sozdanie-elementov', title: 'Создание и удаление элементов', topics: ['createElement()', 'append()', 'remove()'] },
    { n: 20, slug: 'foreach', title: 'forEach', topics: ['одно действие для каждого элемента массива'] },
    { n: 21, slug: 'poisk-i-filtraciya', title: 'Поиск и фильтрация данных', topics: ['find()', 'filter()'] },
    { n: 22, slug: 'preobrazovanie-massiva', title: 'Преобразование массива', topics: ['map()', 'новые данные из массива'] },
    { n: 23, slug: 'shablonnye-stroki', title: 'Шаблонные строки', topics: ['${}', 'текст с переменными', 'данные объектов в строке'] },
    { n: 24, slug: 'sluchajnye-znacheniya', title: 'Случайные значения', topics: ['Math.random()', 'Math.floor()', 'случайные числа, цвета, персонажи', 'мини-игры'] },
    { n: 25, slug: 'tajmery', title: 'Таймеры', topics: ['setTimeout()', 'setInterval()', 'обратный отсчёт'] },
    { n: 26, slug: 'final-proekt', title: 'Финальный проект', topics: ['переменные, условия, функции, массивы, DOM, события в одном интерактивном проекте'], final: true },
  ],
};
