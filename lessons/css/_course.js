// Курс «CSS» — план уроков.
// Файл урока: lessons/css/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …).
// Урок находится по номеру: как только файл появится, он станет «готов» в каталоге.

// Практика к уроку: lessons/<курс>/<NN>p-<slug>.jsx — в списке сразу после урока (practice: true).

export default {
  title: 'CSS',
  subtitle: 'Оформление сайтов',
  short: 'CSS',
  color: '#1572B6',
  order: 2,
  practice: true,   // после каждого урока — практика (<NN>p-<slug>.jsx)
  tests: true,      // после практики — 5 тестов «Тест 1/5…5/5» (<NN>t<K>-<slug>.jsx; формат CRM, как в модуле «ИИ»; 16.11.2026)
  lessons: [
    { n: 1, slug: 'chto-takoe-css', title: 'Что такое CSS и как он меняет сайт', topics: ['подключение CSS', 'property: value', 'первый стиль'], practiceTitle: 'Кафе Коди',
      parts: [
        { k: 1, title: 'Подключаем CSS: тег style и правило', topics: ['подключение CSS', 'тег style'] },
        { k: 2, title: 'Селектор и поломки в CSS', topics: ['селектор', 'свойство и значение'] },
      ] },
    { n: 2, slug: 'selektory', title: 'Как выбрать элемент для стилизации', topics: ['селектор по тегу', '.class', '#id'], practiceTitle: 'Кинотеатр Коди',
      parts: [
        { k: 1, title: 'Класс и id: как выбрать нужное', topics: ['.class', 'селектор по тегу'] },
        { k: 2, title: 'Класс или id: поломки и своя страница', topics: ['#id', 'сила правил'] },
      ] },
    { n: 3, slug: 'cveta', title: 'Цвета', topics: ['color', 'hex', 'rgb', 'hsl'], practiceTitle: 'Космос Коди',
      parts: [
        { k: 1, title: 'Цвет текста: названия и hex', topics: ['color', 'названия цветов', 'hex'] },
        { k: 2, title: 'rgb, hsl и своя палитра', topics: ['rgb', 'hsl', 'свои цвета'] },
      ] },
    { n: 4, slug: 'fon', title: 'Фон', topics: ['background-color', 'background-image'], practiceTitle: 'Выходной Коди',
      parts: [
        { k: 1, title: 'Цвет и картинка на фоне', topics: ['background-color', 'background-image'] },
        { k: 2, title: 'Повтор, размер и поломки фона', topics: ['background-repeat', 'background-size', 'cover'] },
      ] },
    { n: 5, slug: 'tekst-i-shrifty', title: 'Текст и шрифты', topics: ['font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration'], practiceTitle: 'Книжный клуб Коди',
      parts: [
        { k: 1, title: 'Размер и шрифт', topics: ['font-size', 'font-family'] },
        { k: 2, title: 'Жирность, выравнивание и подчёркивание', topics: ['font-weight', 'text-decoration', 'text-align'] },
      ] },
    { n: 6, slug: 'razmery', title: 'Размеры элементов', topics: ['width', 'height', 'px', '%'], practiceTitle: 'Игра Коди',
      parts: [
        { k: 1, title: 'Ширина в px и в процентах', topics: ['width', 'px', '%'] },
        { k: 2, title: 'Высота, фото и поломки размеров', topics: ['height', 'img', 'поломки размеров'] },
      ] },
    { n: 7, slug: 'box-model', title: 'Box Model', topics: ['margin', 'padding', 'border', 'box-sizing: border-box'], practiceTitle: 'Ремонт кинотеатра',
      parts: [
        { k: 1, title: 'Padding и border', topics: ['padding', 'border'] },
        { k: 2, title: 'Margin и box-sizing', topics: ['margin', 'box-sizing'] },
      ] },
    { n: 8, slug: 'kartochki', title: 'Красивые карточки', topics: ['border-radius', 'box-shadow', 'border'], practiceTitle: 'Магазин игр Коди',
      parts: [
        { k: 1, title: 'Скруглённые углы и тени', topics: ['border-radius', 'box-shadow'] },
        { k: 2, title: 'Границы по сторонам и поломки карточек', topics: ['border-top…', 'поломки карточек'] },
      ] },
    { n: 9, slug: 'display', title: 'Как элементы ведут себя на странице', topics: ['block', 'inline', 'inline-block', 'display', 'div', 'span'], practiceTitle: 'Кнопки кинотеатра',
      parts: [
        { k: 1, title: 'div и span: block, inline и none', topics: ['div', 'span', 'block', 'inline'] },
        { k: 2, title: 'inline-block и поломки display', topics: ['inline-block', 'display: none'] },
      ] },
    { n: 10, slug: 'flexbox-osi', title: 'Flexbox: расположение элементов', topics: ['display: flex', 'row / column', 'главная и поперечная оси'], practiceTitle: 'Планеты в ряд',
      parts: [
        { k: 1, title: 'Включаем flex: направление', topics: ['display: flex', 'flex-direction'] },
        { k: 2, title: 'Главная и поперечная оси', topics: ['главная и поперечная оси'] },
      ] },
    { n: 11, slug: 'flexbox-vyravnivanie', title: 'Flexbox: выравнивание', topics: ['justify-content', 'align-items', 'gap', 'flex-wrap'], practiceTitle: 'Полки с афишами',
      parts: [
        { k: 1, title: 'justify-content и align-items', topics: ['justify-content', 'align-items'] },
        { k: 2, title: 'gap, flex-wrap и поломки', topics: ['gap', 'flex-wrap'] },
      ] },
    { n: 12, slug: 'pozicionirovanie', title: 'Позиционирование', topics: ['position', 'relative', 'absolute', 'fixed'], practiceTitle: 'Метки и ракеты',
      parts: [
        { k: 1, title: 'relative и absolute', topics: ['position: relative', 'absolute'] },
        { k: 2, title: 'fixed, отступы и поломки', topics: ['fixed', 'top, right, bottom, left'] },
      ] },
    { n: 13, slug: 'hover-transform', title: 'Hover и transform', topics: [':hover', 'transform', 'scale', 'translate', 'rotate', 'cursor'], practiceTitle: 'Музыкальный сайт Коди',
      parts: [
        { k: 1, title: ':hover и transform', topics: [':hover', 'transform'] },
        { k: 2, title: 'Hover и transform вместе, cursor', topics: ['transform и :hover вместе', 'cursor'] },
      ] },
    { n: 14, slug: 'transition', title: 'Плавные эффекты', topics: ['transition', 'hover + transform'], practiceTitle: 'Плавные эффекты кино',
      parts: [
        { k: 1, title: 'transition: время и свойства', topics: ['transition', 'время'] },
        { k: 2, title: 's и ms, linear и ease, поломки', topics: ['s и ms', 'linear и ease'] },
      ] },
    { n: 15, slug: 'animacii', title: 'CSS-анимации', topics: ['@keyframes', 'animation'], practiceTitle: 'Полёт в космос',
      parts: [
        { k: 1, title: '@keyframes: кадры и повторы', topics: ['@keyframes'] },
        { k: 2, title: 'animation: скорость, направление и поломки', topics: ['animation', 'infinite', 'alternate'] },
      ] },
    { n: 16, slug: 'adaptivnost', title: 'Адаптивность', topics: ['%', 'media queries', 'сайт на телефоне'], practiceTitle: 'Футбольный клуб Коди',
      parts: [
        { k: 1, title: 'px и % на телефоне, @media', topics: ['%', '@media'] },
        { k: 2, title: 'Скрытие на телефоне и порядок правил', topics: ['display: none', 'порядок правил'] },
      ] },
    { n: 17, slug: 'final-proekt', title: 'Финальный проект', topics: [], final: true },
  ],
};
