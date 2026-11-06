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
    // 02.11.2026 (заказчик): в курсе — только урок 1 в облике «Редактор» (эталон курса; бывший тестовый 28).
    // Прежний урок 1 «Kodi playground» — тестовый 29.
    // Прежние уроки 1–5 — в тестовых (lessons/test/18–26); прежние практики удалены (04.11.2026).
    // Практики в облике «Редактор»: 01p «Пять вкладок Коди» (04.11.2026, tools/amaliyot1/), 02p «Газета Коди» (04.11.2026, tools/amaliyot2/), 03p «Праздник Коди» (04.11.2026, tools/amaliyot3/), 04p «Путешествие Коди» (04.11.2026, tools/amaliyot4/), 05p «Зоопарк Коди» (04.11.2026, tools/amaliyot5/), 06p «Анкеты Коди» (04.11.2026, tools/amaliyot6/), 07p «Лагерь Коди» (04.11.2026, tools/amaliyot7/), 08p «Сайт школы Коди» (04.11.2026, tools/amaliyot8/).
    { n: 1, slug: 'struktura-dokumenta', title: 'Структура HTML-документа', topics: ['html', 'head', 'body', 'title'], practiceTitle: 'Пять вкладок Коди' },
    { n: 2, slug: 'zagolovki-i-tekst', title: 'Заголовки и текст', topics: ['h1–h6', 'p', 'b', 'i'], practiceTitle: 'Газета Коди' },
    { n: 3, slug: 'spiski', title: 'Списки', topics: ['ul', 'ol', 'li'], practiceTitle: 'Праздник Коди' },
    { n: 4, slug: 'ssylki-i-atributy', title: 'Ссылки и атрибуты', topics: ['a', 'href'], practiceTitle: 'Путешествие Коди' },
    { n: 5, slug: 'izobrazheniya', title: 'Изображения', topics: ['img', 'src', 'alt'], practiceTitle: 'Зоопарк Коди' },
    { n: 6, slug: 'formy-vvod', title: 'Формы, часть 1: ввод данных', topics: ['form', 'label', 'input', 'type', 'placeholder'], practiceTitle: 'Анкеты Коди' },
    { n: 7, slug: 'formy-vybor', title: 'Формы, часть 2: выбор и отправка', topics: ['select', 'option', 'textarea', 'button'], practiceTitle: 'Лагерь Коди' },
    { n: 8, slug: 'struktura-sajta', title: 'Структура настоящего сайта', topics: ['header', 'nav', 'main', 'section', 'footer'], practiceTitle: 'Сайт школы Коди' },
    { n: 9, slug: 'final-proekt', title: 'Финальный HTML-проект', topics: [], final: true, practiceTitle: 'Мой сайт от и до' },
  ],
};
