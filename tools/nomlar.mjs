// Списки названий (16.11.2026, просьба заказчика) уроков, практик и тестов (ru / uz / en) с именами файлов — lessons/<курс>/NOMLAR.txt
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const R = '/Users/mac/Projects/darsliklar/lessons';
const strAt = (s, i) => { // строковый литерал JS, начиная с кавычки в позиции i
  const q = s[i]; let j = i + 1, out = '';
  while (s[j] !== q) { if (s[j] === '\\') { out += s[j + 1]; j += 2; } else out += s[j++]; }
  return out;
};
const field = (s, key, from = 0) => { const re = new RegExp('\\b' + key + ':\\s*([\'"`])', 'g'); re.lastIndex = from; const m = re.exec(s); return m ? strAt(s, m.index + m[0].length - 1) : null; };
const metaTitle = (src) => {
  const i = src.indexOf('const META = {'); if (i < 0) return null;
  const j = src.indexOf('lessonTitle:', i);
  return { uz: field(src, 'uz', j), ru: field(src, 'ru', j), en: field(src, 'en', j) };
};
const HEAD = { html: 'Курс HTML', css: 'Курс CSS', ai: 'Модуль «ИИ»', bootstrap: 'Модуль Bootstrap' };
// node tools/nomlar.mjs [курс…] — без аргументов все курсы. HTML (27.11.2026): уроки, практики и тесты по частям —
// файлы <NN>q<K>-…, <NN>p<K>-…, <NN>q<K>t<J>-…; названия с сквозными номерами 1–17; целые уроки и практики, которые заменили части, не перечисляются.
const WANT = process.argv.slice(2);
for (const c of ['html', 'css', 'ai', 'bootstrap'].filter((x) => !WANT.length || WANT.includes(x))) {
  const all = readdirSync(join(R, c));
  const byParts = c === 'html';
  const hasParts = (n, kind) => all.some((f) => f.startsWith(String(n).padStart(2, '0') + (kind === 'p' ? 'p1-' : 'q1-')));
  const files = all.filter((f) => (byParts ? /^\d\d(q\d(t\d)?|p\d?)?-.*\.jsx$/ : /^\d\d(p|t\d)?-.*\.jsx$/).test(f))
    .filter((f) => { if (!byParts) return true; const m = /^(\d\d)(q\dt\d|q\d|p\d|p|t\d)?-/.exec(f); const n = +m[1], k = m[2] || '';
      if (k === '' && hasParts(n, 'q')) return false;      // целый урок заменили части
      if (k === 'p' && hasParts(n, 'p')) return false;      // целую практику заменили части
      if (/^t\d$/.test(k)) return false;                   // старые тесты урока целиком
      return true; })
    .sort((a, b) => {
      if (!byParts) return a.localeCompare(b);
      const key = (f) => { const m = /^(\d\d)(?:q(\d))?(?:t(\d)|(p)(\d?))?-/.exec(f); const part = +(m[2] || m[5] || 0);
        const kind = m[3] ? 2 : (m[4] || (!m[2] && /^\d\dp/.test(f))) ? 1 : 0;   // урок, практика, тесты
        return [+m[1], part, kind, +(m[3] || 0)]; };
      const x = key(a), y = key(b); for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0;
    });
  const course = (await import(join(R, c, '_course.js'))).default;
  const lines = [c === 'ai' ? `${HEAD[c]} — названия уроков и тестов на трёх языках и имена файлов` : `${HEAD[c]} — названия уроков, практик и тестов на трёх языках и имена файлов`,
    c === 'ai' ? 'Darslar va testlar nomlari — uch tilda va fayl nomi' : 'Darslar, amaliyotlar va testlar nomlari — uch tilda va fayl nomi',
    c === 'ai' ? 'Lesson and test titles in three languages with file names' : 'Lesson, practice and test titles in three languages with file names',
    'Пересобрать список: node tools/nomlar.mjs', ''];
  const titles = {};
  for (const f of files) {
    const src = readFileSync(join(R, c, f), 'utf8');
    let m = byParts ? null : /^(\d\d)(p|t(\d))?-/.exec(f); let n = m ? +m[1] : 0;
    if (byParts) {   // HTML: сквозной номер урока 1–17 и тип по имени файла
      const h = /^(\d\d)(?:q(\d)(?:t(\d))?|(p)(\d?))?-/.exec(f);
      const part = +(h[2] || h[5] || 0);
      n = part ? 2 * (+h[1] - 1) + part : (+h[1] === 9 ? 17 : +h[1]);
      m = [f, h[1], h[4] ? 'p' : h[3] ? 't' : undefined, h[3]];
    }
    let t;
    if (m[3]) { // тест: вопрос из QS[K-1]
      const k = +m[3];
      const base = titles[n] || {};
      const qs = src.indexOf('const QS = ['); let pos = qs;
      for (let i = 0; i < k; i++) pos = src.indexOf("{ id: '", pos + 1);   // ai-, html-, css- (тесты HTML и CSS — 16.11.2026)
      const uzAt = src.indexOf('uz: {', pos), ruAt = src.indexOf('ru: {', pos), enAt = src.indexOf('en: {', pos);
      t = { kind: 'test', k, base,
        uz: `${n}-dars, ${k}/5-test. ` + field(src, 'q', uzAt),
        ru: `Урок ${n}, тест ${k}/5. ` + field(src, 'q', ruAt),
        en: `Lesson ${n}, test ${k}/5. ` + field(src, 'q', enAt) };
    } else {
      t = metaTitle(src);
      if (!m[2]) titles[n] = t;
    }
    if (m[3] && k1(m[3])) lines.push(`--- Тесты к уроку ${n} / ${n}-dars testlari / Tests for lesson ${n} ---`, '');
    lines.push(`Файл / Fayl / File:  ${f}`, `  RU: ${t.ru}`, `  UZ: ${t.uz}`, `  EN: ${t.en}`, '');
  }
  writeFileSync(join(R, c, 'NOMLAR.txt'), lines.join('\n'));
  console.log(c, files.length);
}
function k1(s) { return s === '1'; }
