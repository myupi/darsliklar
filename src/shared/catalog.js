// Каталог курсов и уроков. Собирается автоматически из папки lessons/:
//   lessons/<курс>/_course.js      — план курса (название, цвет, список уроков)
//   lessons/<курс>/<NN>-<slug>.jsx  — файл урока; привязывается к плану по номеру NN
//   lessons/<курс>/<NN>p-<slug>.jsx — практика к уроку NN (буква p после номера)
// Практика идёт в плане сразу после своего урока, если в _course.js стоит
// practice: true (финальному проекту — final: true — практика не нужна).
// Название практики — practiceTitle в строке урока, иначе просто «Практика».
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
    if (d.practice && !l.final) plan.push(practiceOf(id, l));
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
    const num = /^(\d+)(p)?(?=[-_]|$)/i.exec(base);
    const n = num ? Number(num[1]) : null;
    const kind = num && num[2] ? 'practice' : 'lesson';
    const fileId = `${cid}/${base}`;
    const slot = n != null ? course.lessons.find((l) => l.n === n && l.kind === kind && l.status === 'planned') : null;
    if (slot) {
      slot.file = fileId;
      slot.status = 'ready';
    } else {
      course.lessons.push({
        key: fileId, n, kind, course: cid, title: kind === 'practice' ? 'Практика' : prettify(base), topics: [],
        file: fileId, status: course.sandbox ? 'ready' : 'extra', expected: `lessons/${fileId}.jsx`,
      });
    }
  }

  const list = [...courses.values()];
  list.forEach((c) => {
    // Практика стоит сразу после своего урока.
    const pos = (l) => (l.n ?? 1e9) + (l.kind === 'practice' ? 0.5 : 0);
    c.lessons.sort((a, b) => pos(a) - pos(b) || String(a.key).localeCompare(String(b.key)));
    // Счётчики курса — по урокам; практика считается отдельно.
    const lessons = c.lessons.filter((l) => l.kind !== 'practice');
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
