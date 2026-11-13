// Каталог курсов и уроков. Собирается автоматически из папки lessons/:
//   lessons/<курс>/_course.js      — план курса (название, цвет, список уроков)
//   lessons/<курс>/<NN>-<slug>.jsx  — файл урока; привязывается к плану по номеру NN
//   lessons/<курс>/<NN>p-<slug>.jsx — практика к уроку NN (буква p после номера)
// Практика идёт в плане сразу после своего урока, если в _course.js стоит
// practice: true (финальному проекту — final: true — практика только со своим practiceTitle).
// Название практики — practiceTitle в строке урока, иначе просто «Практика».
//   lessons/<курс>/<NN>t<K>-<slug>.jsx — тест K (1…5) к уроку NN: один вопрос в формате CRM «JSX savol / test»
//   (модуль «ИИ» — тесты вместо практики, заказчик 12–13.11.2026). Пять тестов идут в плане сразу после урока (и его
//   практики), если в _course.js стоит tests: true (финальному проекту — только со своим testTitle).
// Файл без пары в плане тоже попадает в каталог — с пометкой «вне плана».

const COURSE_DEFS = import.meta.glob('/lessons/*/_course.js', { eager: true, import: 'default' });

// Ленивые загрузчики уроков: код урока грузится только когда его открывают.
export const LESSON_LOADERS = import.meta.glob('/lessons/*/*.jsx');

const FILE_RE = /^\/lessons\/([^/]+)\/([^/]+)\.jsx$/;

export const pad2 = (n) => String(n).padStart(2, '0');
export const lessonFilePath = (fileId) => `/lessons/${fileId}.jsx`;

const prettify = (base) =>
  base.replace(/^\d+[-_]?/, '').replace(/[-_]+/g, ' ').trim() || base;

const practiceOf = (id, l) => ({
  key: `${id}/#${l.n}p`,
  n: l.n,
  kind: 'practice',
  slug: l.slug,
  course: id,
  title: l.practiceTitle || 'Практика',
  practiceTitle: l.practiceTitle || null,
  lessonTitle: l.title,
  topics: l.topics || [],
  file: null,
  status: 'planned',
  expected: `lessons/${id}/${pad2(l.n)}p-${l.slug || 'urok'}.jsx`,
});

const TESTS_PER_LESSON = 5;
const testOf = (id, l, k) => ({
  key: `${id}/#${l.n}t${k}`,
  n: l.n,
  tk: k,
  kind: 'test',
  slug: l.slug,
  course: id,
  title: `Тест ${k}/${TESTS_PER_LESSON}`,
  testTitle: l.testTitle || null,
  lessonTitle: l.title,
  topics: l.topics || [],
  file: null,
  status: 'planned',
  expected: `lessons/${id}/${pad2(l.n)}t${k}-${l.slug || 'urok'}.jsx`,
});

function normalizeCourse(id, def) {
  const d = def || {};
  const plan = [];
  (d.lessons || []).forEach((l) => {
    plan.push({
      ...l,
      kind: 'lesson',
      key: `${id}/#${l.n}`,
      course: id,
      topics: l.topics || [],
      file: null,
      status: 'planned',
      expected: `lessons/${id}/${pad2(l.n)}-${l.slug || 'urok'}.jsx`,
    });
    if (d.practice && (!l.final || l.practiceTitle)) plan.push(practiceOf(id, l));   // финальному — только если задана своя практика
    if (d.tests && (!l.final || l.testTitle)) for (let k = 1; k <= TESTS_PER_LESSON; k += 1) plan.push(testOf(id, l, k));   // тесты — так же
  });
  return {
    id,
    title: d.title || id,
    subtitle: d.subtitle || '',
    short: d.short || id.replace(/^_/, '').slice(0, 4).toUpperCase(),
    color: d.color || '#6B7280',
    order: typeof d.order === 'number' ? d.order : 50,
    sandbox: !!d.sandbox,   // песочница: файлы без плана — готовые уроки
    lessons: plan,
  };
}

export function buildCatalog() {
  const courses = new Map();
  for (const [path, def] of Object.entries(COURSE_DEFS)) {
    const id = path.split('/')[2];
    courses.set(id, normalizeCourse(id, def));
  }

  for (const path of Object.keys(LESSON_LOADERS).sort()) {
    const m = path.match(FILE_RE);
    if (!m) continue;
    const [, cid, base] = m;
    if (!courses.has(cid)) courses.set(cid, normalizeCourse(cid, null));
    const course = courses.get(cid);
    const num = /^(\d+)(p|t(\d)?)?(?=[-_]|$)/i.exec(base);
    const n = num ? Number(num[1]) : null;
    const kind = num && num[2] ? (num[2][0].toLowerCase() === 't' ? 'test' : 'practice') : 'lesson';
    const tk = kind === 'test' ? Number(num[3] || 1) : null;
    const fileId = `${cid}/${base}`;
    const slot = n != null ? course.lessons.find((l) => l.n === n && l.kind === kind && (kind !== 'test' || l.tk === tk) && l.status === 'planned') : null;
    if (slot) {
      slot.file = fileId;
      slot.status = 'ready';
    } else {
      course.lessons.push({
        key: fileId, n, kind, course: cid, title: kind === 'practice' ? 'Практика' : kind === 'test' ? 'Тест' : prettify(base), topics: [],
        file: fileId, status: course.sandbox ? 'ready' : 'extra', expected: `lessons/${fileId}.jsx`,
      });
    }
  }

  const list = [...courses.values()];
  list.forEach((c) => {
    // Практика стоит сразу после своего урока, тест — за ней.
    const pos = (l) => (l.n ?? 1e9) + (l.kind === 'practice' ? 0.5 : l.kind === 'test' ? 0.6 + (l.tk || 1) * 0.01 : 0);
    c.lessons.sort((a, b) => pos(a) - pos(b) || String(a.key).localeCompare(String(b.key)));
    // Счётчики курса — по урокам; практика и тесты считаются отдельно.
    const lessons = c.lessons.filter((l) => l.kind !== 'practice' && l.kind !== 'test');
    const tests = c.lessons.filter((l) => l.kind === 'test');
    c.testReady = tests.filter((l) => l.status !== 'planned').length;
    c.testPlanned = tests.filter((l) => l.status !== 'extra').length;
    const practices = c.lessons.filter((l) => l.kind === 'practice');
    c.ready = lessons.filter((l) => l.status !== 'planned').length;
    c.planned = c.sandbox ? lessons.length : lessons.filter((l) => l.status !== 'extra').length;
    c.practiceReady = practices.filter((l) => l.status !== 'planned').length;
    c.practicePlanned = practices.filter((l) => l.status !== 'extra').length;
  });
  list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return list;
}

export function findLesson(catalog, key) {
  if (!key) return null;
  for (const c of catalog) {
    for (const l of c.lessons) {
      if (l.key === key || (l.file && l.file === key)) return { course: c, lesson: l };
    }
  }
  return null;
}

export function findByFile(catalog, fileId) {
  return findLesson(catalog, fileId);
}
