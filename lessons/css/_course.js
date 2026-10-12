// Курс «CSS» — план уроков.
// Файл урока: lessons/css/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …).
// Урок находится по номеру: как только файл появится, он станет «готов» в каталоге.

export default {
  title: 'CSS',
  subtitle: 'Оформление сайтов',
  short: 'CSS',
  color: '#1572B6',
  order: 2,
  lessons: [
    { n: 1, slug: 'chto-takoe-css', title: 'Что такое CSS и как он меняет сайт', topics: ['подключение CSS', 'property: value', 'первый стиль'] },
    { n: 2, slug: 'selektory', title: 'Как выбрать элемент для стилизации', topics: ['селектор по тегу', '.class', '#id'] },
    { n: 3, slug: 'cveta', title: 'Цвета', topics: ['color', 'hex', 'rgb', 'hsl'] },
    { n: 4, slug: 'fon', title: 'Фон', topics: ['background-color', 'background-image'] },
    { n: 5, slug: 'tekst-i-shrifty', title: 'Текст и шрифты', topics: ['font-size', 'font-family', 'font-weight', 'text-align', 'text-decoration'] },
    { n: 6, slug: 'razmery', title: 'Размеры элементов', topics: ['width', 'height', 'px', '%'] },
    { n: 7, slug: 'box-model', title: 'Box Model', topics: ['margin', 'padding', 'border', 'box-sizing: border-box'] },
    { n: 8, slug: 'kartochki', title: 'Красивые карточки', topics: ['border-radius', 'box-shadow', 'border'] },
    { n: 9, slug: 'display', title: 'Как элементы ведут себя на странице', topics: ['block', 'inline', 'inline-block', 'display', 'div', 'span'] },
    { n: 10, slug: 'flexbox-osi', title: 'Flexbox: расположение элементов', topics: ['display: flex', 'row / column', 'главная и поперечная оси'] },
    { n: 11, slug: 'flexbox-vyravnivanie', title: 'Flexbox: выравнивание', topics: ['justify-content', 'align-items', 'gap', 'flex-wrap'] },
    { n: 12, slug: 'pozicionirovanie', title: 'Позиционирование', topics: ['position', 'relative', 'absolute', 'fixed'] },
    { n: 13, slug: 'hover-transform', title: 'Hover и transform', topics: [':hover', 'transform', 'scale', 'translate', 'rotate', 'cursor'] },
    { n: 14, slug: 'transition', title: 'Плавные эффекты', topics: ['transition', 'hover + transform'] },
    { n: 15, slug: 'animacii', title: 'CSS-анимации', topics: ['@keyframes', 'animation'] },
    { n: 16, slug: 'adaptivnost', title: 'Адаптивность', topics: ['%', 'media queries', 'сайт на телефоне'] },
    { n: 17, slug: 'final-proekt', title: 'Финальный проект', topics: [], final: true },
  ],
};
