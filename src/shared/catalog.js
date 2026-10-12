// Каталог курсов и уроков. Собирается автоматически из папки lessons/:
//   lessons/<курс>/_course.js     — план курса (название, цвет, список уроков)
//   lessons/<курс>/<NN>-<slug>.jsx — файл урока; привязывается к плану по номеру NN
// Файл без пары в плане тоже попадает в каталог — с пометкой «вне плана».

const COURSE_DEFS = import.meta.glob('/lessons/*/_course.js', { eager: true, import: 'default' });

// Ленивые загрузчики уроков: код урока грузится только когда его открывают.
export const LESSON_LOADERS = import.meta.glob('/lessons/*/*.jsx');

const FILE_RE = /^\/lessons\/([^/]+)\/([^/]+)\.jsx$/;

export const pad2 = (n) => String(n).padStart(2, '0');
export const lessonFilePath = (fileId) => `/lessons/${fileId}.jsx`;

const prettify = (base) =>
  base.replace(/^\d+[-_]?/, '').replace(/[-_]+/g, ' ').trim() || base;

function normalizeCourse(id, def) {
  const d = def || {};
  return {
    id,
    title: d.title || id,
    subtitle: d.subtitle || '',
    short: d.short || id.replace(/^_/, '').slice(0, 4).toUpperCase(),
    color: d.color || '#6B7280',
    order: typeof d.order === 'number' ? d.order : 50,
    lessons: (d.lessons || []).map((l) => ({
      ...l,
      key: `${id}/#${l.n}`,
      course: id,
      topics: l.topics || [],
      file: null,
      status: 'planned',
      expected: `lessons/${id}/${pad2(l.n)}-${l.slug || 'urok'}.jsx`,
    })),
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
    const num = /^(\d+)/.exec(base);
    const n = num ? Number(num[1]) : null;
    const fileId = `${cid}/${base}`;
    const slot = n != null ? course.lessons.find((l) => l.n === n && l.status === 'planned') : null;
    if (slot) {
      slot.file = fileId;
      slot.status = 'ready';
    } else {
      course.lessons.push({
        key: fileId, n, course: cid, title: prettify(base), topics: [],
        file: fileId, status: 'extra', expected: `lessons/${fileId}.jsx`,
      });
    }
  }

  const list = [...courses.values()];
  list.forEach((c) => {
    c.lessons.sort((a, b) => (a.n ?? 1e9) - (b.n ?? 1e9) || String(a.key).localeCompare(String(b.key)));
    c.ready = c.lessons.filter((l) => l.status !== 'planned').length;
    c.planned = c.lessons.filter((l) => l.status !== 'extra').length;
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
