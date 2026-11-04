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
    { n: 8, slug: 'robot-pixel', title: 'Из чего сделан сайт: робот Пиксель (проба)',
      topics: ['HTML · CSS · JavaScript', 'веб-страница и её код'] },
    { n: 9, slug: 'struktura-dokumenta-kodi', title: 'Структура HTML-документа — прежний урок 1 курса (Коди)',
      topics: ['html', 'head', 'title', 'body'] },
    { n: 11, slug: 'struktura-dokumenta-2', title: 'Структура HTML-документа — урок 1, вариант 2: страница Пикселя сломалась',
      topics: ['html', 'head', 'title', 'body'] },
    { n: 13, slug: 'struktura-robot', title: 'Структура HTML-документа — робот Пиксель (прежний урок 1 курса до 22.10.2026)',
      topics: ['html', 'head', 'title', 'body'] },
    { n: 14, slug: 'zagolovki-robofutbol', title: 'Заголовки и текст — робофутбол (прежний урок 2 курса до 22.10.2026)',
      topics: ['h1–h6', 'p', 'b', 'i'] },
    { n: 15, slug: 'bumazhnaya-stranitsa', title: 'Структура HTML-документа — копия урока 1 курса «Бумажная страница» (24.10.2026)',
      topics: ['html', 'head', 'title', 'body'] },
    { n: 16, slug: 'b-oyin', title: 'Урок 1 «Бумажная страница» в рамке дизайна «B · O‘yin» (шапка, низ, панели результата; 28.10.2026)',
      topics: ['html', 'head', 'title', 'body', 'дизайн B · O‘yin'] },
    // 17 «Kodi playground» стал уроком 1 курса HTML (02.11.2026). Ниже — прежние уроки и практики курса,
    // перенесённые в тестовые в тот же день (бумажный стиль эталона 22.10.2026).
    // Прежние практики 19, 21, 23, 25, 27 и их исходники удалены заказчиком 04.11.2026.
    { n: 18, slug: 'struktura-dokumenta', title: 'Структура HTML-документа — прежний урок 1 курса «Бумажная страница» (до 02.11.2026)',
      topics: ['html', 'head', 'title', 'body'] },
    { n: 20, slug: 'zagolovki-i-tekst', title: 'Заголовки и текст — прежний урок 2 курса (бумажный)',
      topics: ['h1–h6', 'p', 'b', 'i'] },
    { n: 22, slug: 'spiski', title: 'Списки — прежний урок 3 курса (бумажный)',
      topics: ['ul', 'ol', 'li'] },
    { n: 24, slug: 'ssylki-i-atributy', title: 'Ссылки и атрибуты — прежний урок 4 курса (бумажный)',
      topics: ['a', 'href'] },
    { n: 26, slug: 'izobrazheniya', title: 'Изображения — прежний урок 5 курса (бумажный)',
      topics: ['img', 'src', 'alt'] },
    // 28 «Редактор» стал уроком 1 курса HTML и эталоном (02.11.2026); прежний урок 1 — тестовый 29.
    { n: 29, slug: 'struktura-playground', title: 'Структура HTML-документа — «Kodi playground» (урок 1 курса и эталон до 02.11.2026)',
      topics: ['html', 'head', 'title', 'body', 'Kodi playground'] },
    // 04.11.2026: тестовые копии уроков 1 и 2 под новые режимы платформы — «Подготовленная озвучка JSX»
    // (LESSON_AUDIO + useAudio) и «Контракт завершения v1»; только узбекский. Сборка: node tools/managed-test/build.mjs.
    { n: 30, slug: 'urok1-yangi-ovoz', title: 'Урок 1 — тест: подготовленная озвучка и завершение v1 (uz)',
      topics: ['LESSON_AUDIO', 'useAudio', 'contractVersion: 1'] },
    { n: 31, slug: 'urok2-yangi-ovoz', title: 'Урок 2 — тест: подготовленная озвучка и завершение v1 (uz)',
      topics: ['LESSON_AUDIO', 'useAudio', 'contractVersion: 1'] },
  ],
};
