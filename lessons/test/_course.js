// «Тестовые уроки» — песочница заказчика для экспериментов.
// Плана нет: любой файл lessons/test/<имя>.jsx сам появляется в списке как готовый.
// Номер в начале имени (01-…, 02-…) задаёт порядок; без номера файл встаёт в конец.
// Канон сюда не переносится и не проверяется (npm run canon работает только с курсом html).

export default {
  title: 'Тестовые уроки',
  subtitle: 'Эксперименты',
  short: 'TEST',
  color: '#8B5CF6',
  order: 90,
  sandbox: true,   // файлы без плана считаются готовыми, а не «вне плана»
  // Номер в строке привязывает файл к названию: 02-… получает title отсюда.
  lessons: [
    { n: 2, slug: 'zaglyani-vnutr', title: 'HTML: загляни внутрь страницы — эксперимент',
      topics: ['html', 'head', 'title', 'body', 'anatomy'] },
    { n: 3, slug: 'pervaya-stranitsa', title: 'Моя первая страница: исследуй, собери, создай',
      topics: ['Эксперимент: интерактивный HTML + Anatomy'] },
    { n: 4, slug: 'spiski', title: 'Списки — урок 3 курса HTML (проба)',
      topics: ['ul', 'ol', 'li'] },
    { n: 5, slug: 'spiski-2', title: 'Списки — урок 3 курса HTML (проба 2: гайд по игре)',
      topics: ['ul', 'ol', 'li'] },
    { n: 6, slug: 'ssylki-i-atributy', title: 'Ссылки и атрибуты — урок 4 курса HTML (проба)',
      topics: ['a', 'href'] },
    { n: 7, slug: 'struktura-robot', title: 'Структура HTML-документа — урок 1 (проба: робот Пиксель)',
      topics: ['html', 'head', 'title', 'body', 'HTML · CSS · JavaScript'] },
    { n: 8, slug: 'robot-pixel', title: 'Из чего сделан сайт: робот Пиксель (проба)',
      topics: ['HTML · CSS · JavaScript', 'веб-страница и её код'] },
    { n: 9, slug: 'zagolovki-monitor', title: 'Заголовки и текст — урок 2 (проба: монитор турнира)',
      topics: ['h1–h6', 'p', 'b', 'i', 'anatomy: монитор'] },
  ],
};
