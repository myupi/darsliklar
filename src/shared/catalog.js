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

const practiceOf = (id, l, pt, i) => ({
  key: `${id}/#${l.n}p${pt ? (pt.k || i + 1) : ''}`,
  ...(pt ? { pk: pt.k || i + 1 } : {}),
  n: l.n,
  kind: 'practice',
  slug: l.slug,
  course: id,
  title: pt ? (pt.title || `${l.practiceTitle || 'Практика'} · часть ${pt.k || i + 1}`) : (l.practiceTitle || 'Практика'),
  practiceTitle: l.practiceTitle || null,
  lessonTitle: l.title,
  topics: l.topics || [],
  file: null,
  status: 'planned',
  expected: `lessons/${id}/${pad2(l.n)}p${pt ? (pt.k || i + 1) : ''}-${l.slug || 'urok'}.jsx`,
});

const TESTS_PER_LESSON = 5;
const testOf = (id, l, k, pt) => ({
  key: `${id}/#${l.n}${pt ? `q${pt.k}` : ''}t${k}`,
  n: l.n,
  ...(pt ? { qk: pt.k } : {}),
  tk: k,
  kind: 'test',
  slug: l.slug,
  course: id,
  title: `Тест ${k}/${TESTS_PER_LESSON}`,
  testTitle: l.testTitle || null,
  lessonTitle: pt ? (pt.title || l.title) : l.title,
  topics: pt ? (pt.topics || l.topics || []) : (l.topics || []),
  file: null,
  status: 'planned',
  expected: `lessons/${id}/${pad2(l.n)}${pt ? `q${pt.k}` : ''}t${k}-${l.slug || 'urok'}.jsx`,
});

function normalizeCourse(id, def) {
  const d = def || {};
  const plan = [];
  (d.lessons || []).forEach((l) => {
    // Урок частями (parts в строке плана; HTML 1, 25.11.2026): вместо одной строки урока — строка на каждую часть,
    // файлы <NN>q<K>-<slug>.jsx; номер урока тот же, практика и тесты — после последней части.
    if (Array.isArray(l.parts) && l.parts.length) {
      l.parts.forEach((pt, i) => {
        const qk = pt.k || i + 1;
        plan.push({
          ...l,
          kind: 'lesson',
          qk,
          baseTitle: l.title,
          title: pt.title || `${l.title} — часть ${qk}`,
          key: `${id}/#${l.n}q${qk}`,
          course: id,
          topics: pt.topics || l.topics || [],
          file: null,
          status: 'planned',
          expected: `lessons/${id}/${pad2(l.n)}q${qk}-${l.slug || 'urok'}.jsx`,
        });
      });
    } else plan.push({
      ...l,
      kind: 'lesson',
      key: `${id}/#${l.n}`,
      course: id,
      topics: l.topics || [],
      file: null,
      status: 'planned',
      expected: `lessons/${id}/${pad2(l.n)}-${l.slug || 'urok'}.jsx`,
    });
    // Практика частями (practiceParts в строке плана; HTML 2–8, 27.11.2026): строка на каждую часть, файлы <NN>p<K>-<slug>.jsx;
    // каждая часть стоит сразу после своей части урока (см. сортировку ниже), тесты — за последней.
    if (d.practice && (!l.final || l.practiceTitle)) {
      if (Array.isArray(l.practiceParts) && l.practiceParts.length) l.practiceParts.forEach((pt, i) => plan.push(practiceOf(id, l, pt, i)));
      else plan.push(practiceOf(id, l));   // финальному — только если задана своя практика
    }
    // Тесты — так же; у урока частями — 5 тестов на каждую часть (HTML, 27.11.2026): после практики своей части.
    if (d.tests && (!l.final || l.testTitle)) {
      if (Array.isArray(l.parts) && l.parts.length && l.testParts) l.parts.forEach((pt, i) => { for (let k = 1; k <= TESTS_PER_LESSON; k += 1) plan.push(testOf(id, l, k, { ...pt, k: pt.k || i + 1 })); });
      else for (let k = 1; k <= TESTS_PER_LESSON; k += 1) plan.push(testOf(id, l, k));
    }
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
    const num = /^(\d+)(?:(p)(\d)?|(t)(\d)?|(q)(\d)(?:t(\d))?)?(?=[-_]|$)/i.exec(base);
    const n = num ? Number(num[1]) : null;
    const k0 = num ? (num[2] ? 'p' : num[4] ? 't' : num[6] ? (num[8] ? 't' : 'q') : '') : '';
    const kind = k0 === 't' ? 'test' : k0 === 'p' ? 'practice' : 'lesson';
    const tk = kind === 'test' ? Number(num[5] || num[8] || 1) : null;
    const qk = num && num[6] ? Number(num[7]) : null;
    const pk = k0 === 'p' && num[3] ? Number(num[3]) : null;
    const fileId = `${cid}/${base}`;
    // Целый файл урока, который в плане разделён на части, в списке не показывается (части — свои файлы).
    if (kind === 'lesson' && qk == null && n != null && course.lessons.some((l) => l.n === n && l.qk != null)) continue;
    // То же с тестами урока, у которого тесты разделены по частям (<NN>q<K>t<J>-…).
    if (kind === 'test' && qk == null && n != null && course.lessons.some((l) => l.n === n && l.kind === 'test' && l.qk != null)) continue;
    // То же с целой практикой, которая в плане разделена на части.
    if (kind === 'practice' && pk == null && n != null && course.lessons.some((l) => l.n === n && l.kind === 'practice' && l.pk != null)) continue;
    const slot = n != null ? course.lessons.find((l) => l.n === n && l.kind === kind && (kind !== 'test' || l.tk === tk) && (l.qk ?? null) === qk && (l.pk ?? null) === pk && l.status === 'planned') : null;
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
    // Часть практики — сразу за своей частью урока (урок ч.1 → практика ч.1 → урок ч.2 → практика ч.2).
    const pos = (l) => (l.n ?? 1e9) + (l.kind === 'practice' ? (l.pk ? l.pk * 0.01 + 0.005 : 0.5) : l.kind === 'test' ? (l.qk ? l.qk * 0.01 + 0.007 + (l.tk || 1) * 0.0001 : 0.6 + (l.tk || 1) * 0.01) : (l.qk || 0) * 0.01);
    c.lessons.sort((a, b) => pos(a) - pos(b) || String(a.key).localeCompare(String(b.key)));
    // Курс с уроками-частями (HTML): номера в списке сквозные 1, 2, 3…, а не «01, 01, 02, 02» (заказчик, 27.11.2026);
    // у каждой части своё название. Номер урока n остаётся прежним (ключи, файлы, тренажёр, компилятор).
    if (c.lessons.some((l) => l.qk != null)) {
      let seq = 0;
      c.lessons.forEach((l) => { if (l.kind === 'lesson' && l.status !== 'extra') l.seq = ++seq; });
    }
    // Счётчики курса — по урокам; практика и тесты считаются отдельно.
    const lessons = c.lessons.filter((l) => l.kind !== 'practice' && l.kind !== 'test' && !(l.qk > 1));   // урок частями — один урок
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
