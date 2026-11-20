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
for (const c of ['html', 'css', 'ai', 'bootstrap']) {
  const files = readdirSync(join(R, c)).filter((f) => /^\d\d(p|t\d)?-.*\.jsx$/.test(f)).sort();
  const course = (await import(join(R, c, '_course.js'))).default;
  const lines = [c === 'ai' ? `${HEAD[c]} — названия уроков и тестов на трёх языках и имена файлов` : `${HEAD[c]} — названия уроков, практик и тестов на трёх языках и имена файлов`,
    c === 'ai' ? 'Darslar va testlar nomlari — uch tilda va fayl nomi' : 'Darslar, amaliyotlar va testlar nomlari — uch tilda va fayl nomi',
    c === 'ai' ? 'Lesson and test titles in three languages with file names' : 'Lesson, practice and test titles in three languages with file names',
    'Пересобрать список: node tools/nomlar.mjs', ''];
  const titles = {};
  for (const f of files) {
    const src = readFileSync(join(R, c, f), 'utf8');
    const m = /^(\d\d)(p|t(\d))?-/.exec(f); const n = +m[1];
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
