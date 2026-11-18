// Названия уроков на трёх языках для просмотрщика (заказчик, 18.11.2026: шапка урока «в 3 языках»).
// Источник — сами файлы уроков: META.lessonTitle { uz, ru, en } (то же название урок отдаёт платформе).
// Виртуальный модуль `virtual:lesson-titles` → { 'html/01-struktura-dokumenta': { uz, ru, en }, … }; правка урока его обновляет.
import fs from 'node:fs';
import path from 'node:path';

const ID = 'virtual:lesson-titles';
const RID = '\0' + ID;
const STR = String.raw`'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"`;
const RE = new RegExp(String.raw`lessonTitle:\s*\{\s*uz:\s*(${STR}),\s*ru:\s*(${STR}),\s*en:\s*(${STR})`);
const unq = (s) => s.slice(1, -1).replace(/\\(.)/g, '$1');

export function lessonTitles(root) {
  const out = {};
  const dir = path.join(root, 'lessons');
  for (const c of fs.readdirSync(dir)) {
    const cd = path.join(dir, c);
    if (!fs.statSync(cd).isDirectory()) continue;
    for (const f of fs.readdirSync(cd)) {
      if (!f.endsWith('.jsx')) continue;
      const src = fs.readFileSync(path.join(cd, f), 'utf8');
      const at = src.lastIndexOf('const META = {');
      const m = RE.exec(at >= 0 ? src.slice(at, at + 2000) : '');
      if (m) out[c + '/' + f.slice(0, -4)] = { uz: unq(m[1]), ru: unq(m[2]), en: unq(m[3]) };
    }
  }
  return out;
}

export default function lessonTitlesPlugin() {
  let root = process.cwd();
  return {
    name: 'lesson-titles',
    configResolved(c) { root = c.root; },
    resolveId(id) { return id === ID ? RID : null; },
    load(id) { return id === RID ? 'export default ' + JSON.stringify(lessonTitles(root)) + ';' : null; },
    handleHotUpdate({ file, server }) {
      if (!/[\\/]lessons[\\/][^\\/]+[\\/][^\\/]+\.jsx$/.test(file)) return;
      const mod = server.moduleGraph.getModuleById(RID);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
}
