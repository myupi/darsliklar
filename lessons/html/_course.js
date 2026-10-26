// Курс «HTML» — план уроков.
// Файл урока: lessons/html/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …).
// Урок находится по номеру: как только файл появится, он станет «готов» в каталоге.

// Практика к уроку: lessons/<курс>/<NN>p-<slug>.jsx — в списке сразу после урока (practice: true).
// Своё название практики — practiceTitle в строке урока; без него — «Практика».

export default {
  title: 'HTML',
  subtitle: 'Основы разметки',
  short: 'HTML',
  color: '#E34F26',
  order: 1,
  practice: true,   // после каждого урока — практика (<NN>p-<slug>.jsx)
  lessons: [
    { n: 1, slug: 'struktura-dokumenta', title: 'Структура HTML-документа', topics: ['html', 'head', 'body', 'title'],
      practiceTitle: 'Бумажная улица' },
    { n: 2, slug: 'zagolovki-i-tekst', title: 'Заголовки и текст', topics: ['h1–h6', 'p', 'b', 'i'],
      practiceTitle: 'Стенгазета' },
    { n: 3, slug: 'spiski', title: 'Списки', topics: ['ul', 'ol', 'li'],
      practiceTitle: 'Походный блокнот' },
    { n: 4, slug: 'ssylki-i-atributy', title: 'Ссылки и атрибуты', topics: ['a', 'href'],
      practiceTitle: 'Острова' },
    { n: 5, slug: 'izobrazheniya', title: 'Изображения', topics: ['img', 'src', 'alt'],
      practiceTitle: 'Выставка' },
    { n: 6, slug: 'formy-vvod', title: 'Формы, часть 1: ввод данных', topics: ['form', 'label', 'input', 'type', 'placeholder'] },
    { n: 7, slug: 'formy-vybor', title: 'Формы, часть 2: выбор и отправка', topics: ['select', 'option', 'textarea', 'button'] },
    { n: 8, slug: 'struktura-sajta', title: 'Структура настоящего сайта', topics: ['header', 'nav', 'main', 'section', 'footer'] },
    { n: 9, slug: 'final-proekt', title: 'Финальный HTML-проект', topics: [], final: true },
  ],
};
