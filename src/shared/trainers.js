// Тренажёры модулей (18.11.2026): раздел «Тренажёр» просмотрщика. Тренажёр — два файла для LMS Junior в папке
// trenajor/<папка>/: JSX (импорт только react) и банк вопросов JSON. Собирает их tools/trenajor/build.mjs.
// Здесь — список тренажёров и загрузка файлов (лениво: банк большой, нужен только открытому тренажёру).
const JSX = import.meta.glob('/trenajor/*/*.jsx');
const BANKS = import.meta.glob('/trenajor/*/*.json', { import: 'default' });

const fileIn = (map, dir) => Object.keys(map).find((p) => p.startsWith('/trenajor/' + dir + '/')) || null;

// pick: 'lesson' — LMS берёт вопросы модуля (по желанию — только из пройденных уроков, поле lesson);
//       'block'  — образец математики: вопросы одного блока (b01…b04), как его LMS.
const LIST = [
  { id: 'html', module: 'html', title: 'HTML', dir: 'html', langs: ['uz', 'ru', 'en'], pick: 'lesson' },
  { id: 'css', module: 'css', title: 'CSS', dir: 'css', langs: ['uz', 'ru', 'en'], pick: 'lesson' },
  { id: 'ai', module: 'ai', title: 'ИИ', dir: 'ai', langs: ['uz', 'ru', 'en'], pick: 'lesson' },
  { id: 'g01', title: 'Математика 1-sinf', dir: 'obrazec-matematika', langs: ['uz', 'ru'], pick: 'block', sample: true,
    color: '#FF7A1A', short: 'MAT', blocks: ['b01', 'b02', 'b03', 'b04'], size: 15, fixedSize: true },
];

export const TRAINERS = LIST.map((t) => {
  const jsx = fileIn(JSX, t.dir);
  const bank = fileIn(BANKS, t.dir);
  return Object.assign({}, t, { jsx, bank, status: jsx && bank ? 'ready' : 'planned' });
});

export const trainerById = (id) => TRAINERS.find((t) => t.id === id) || null;

export function loadTrainer(t) {
  return JSX[t.jsx]().then((m) => m.default);
}

const bankCache = {};
export function loadBank(t) {
  if (!t || !t.bank) return Promise.resolve([]);
  if (!bankCache[t.id]) bankCache[t.id] = BANKS[t.bank]();
  return bankCache[t.id];
}

// Текст на языке: строка или { uz, ru, en }.
export const tx = (v, lang) => (v == null ? '' : typeof v === 'object' && !Array.isArray(v) ? String(v[lang] ?? v.uz ?? v.ru ?? '') : String(v));

// «Впиши ответ» (question_type text_input): так вписанный ответ сравнивает LMS (trenajor/html/README.md) — та же функция,
// что в tools/trenajor/build.mjs: регистр, пробелы по краям и вокруг < > / =, «умные» кавычки, «;» в конце не важны.
export const normAnswer = (s) => String(s == null ? '' : s).normalize('NFKC').replace(/[‘’ʻʼ`´]/g, "'").replace(/[“”«»„]/g, '"')
  .trim().replace(/\s+/g, ' ').replace(/\s*([<>/=])\s*/g, '$1').replace(/;+$/, '').toLowerCase();
// Все типы, кроме single_choice (text_input, assemble, find_error, tap_page; 18.11.2026), сравниваются одинаково: ответ — строка,
// верно, если после normAnswer она совпала с одной из accepted_answers (или correct_answer).
export const checkAnswer = (q, value) => ((q.question_type || 'single_choice') !== 'single_choice'
  ? (q.accepted_answers || [q.correct_answer]).map(normAnswer).includes(normAnswer(value))
  : q.correct_answer === value);
