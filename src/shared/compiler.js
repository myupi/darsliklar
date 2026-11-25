// Задания для компилятора платформы (14.11.2026): ученик сам пишет код, ИИ платформы проверяет по промпту.
// Источник — docs/kompilyator-amaliy-<курс>.txt в формате файла заказчика HTML_practice_prompts.txt:
//   N. НАЗВАНИЕ УРОКА: …            (узбекский)
//   НАЗВАНИЕ (RU): … / НАЗВАНИЕ (EN): …  (18.11.2026: шапка задания на трёх языках)
//   ЗАДАНИЕ ДЛЯ УЧЕНИКА:  (строки на узбекском; перевод — «(RU: …)», затем «(EN: …)»)
//   ПРОМПТ ДЛЯ ПРОВЕРКИ: (строки на английском)
// Задания разделяет строка из «=». Просмотрщик показывает их в своём режиме «Компилятор» (не в списке курсов).
const RAW = import.meta.glob('/docs/kompilyator-amaliy-*.txt', { query: '?raw', import: 'default', eager: true });


function parse(text) {
  const blocks = String(text || '').split(/\n=+\n/).map((b) => b.trim()).filter(Boolean);
  const head = blocks.shift() || '';
  const items = [];
  for (const b of blocks) {
    const m = /^(\d+)\.\s*НАЗВАНИЕ УРОКА:\s*(.+)$/m.exec(b);
    if (!m) continue;
    const taskAt = b.indexOf('ЗАДАНИЕ ДЛЯ УЧЕНИКА:');
    // Без промпта — тоже задание: работу проверяет человек (Tilda, заказчик 25.11.2026: «тильду проверяет человек»).
    const checkAt0 = b.indexOf('ПРОМПТ ДЛЯ ПРОВЕРКИ:');
    const checkAt = checkAt0 < 0 ? b.length : checkAt0;
    if (taskAt < 0 && checkAt0 < 0) continue;
    const tRu = /^НАЗВАНИЕ \(RU\):\s*(.+)$/m.exec(b);
    const tEn = /^НАЗВАНИЕ \(EN\):\s*(.+)$/m.exec(b);
    let task = taskAt >= 0 ? b.slice(taskAt + 'ЗАДАНИЕ ДЛЯ УЧЕНИКА:'.length, checkAt).trim() : '';
    // Перевод: «(RU: …)», за ним «(EN: …)» (16.11.2026: слайд ученика на трёх языках).
    let ru = '', en = '';
    const e = /\(EN:\s*([\s\S]*?)\)\s*$/.exec(task);
    if (e) { en = e[1].replace(/\s*\n\s*/g, ' ').trim(); task = task.slice(0, e.index).trim(); }
    const r = /\(RU:\s*([\s\S]*?)\)\s*$/.exec(task);
    if (r) { ru = r[1].replace(/\s*\n\s*/g, ' ').trim(); task = task.slice(0, r.index).trim(); }
    const lines = task.split('\n').map((s) => s.trim()).filter(Boolean);
    items.push({
      n: +m[1],
      title: m[2].trim(),
      titles: { uz: m[2].trim(), ru: tRu ? tRu[1].trim() : '', en: tEn ? tEn[1].trim() : '' },
      intro: lines.filter((s) => !s.startsWith('- ')),
      steps: lines.filter((s) => s.startsWith('- ')).map((s) => s.slice(2)),
      ru,
      en,
      check: checkAt0 < 0 ? '' : b.slice(checkAt + 'ПРОМПТ ДЛЯ ПРОВЕРКИ:'.length).trim()
    });
  }
  const tail = blocks.find((b) => !/^\d+\.\s*НАЗВАНИЕ УРОКА:/m.test(b)) || '';
  return { head, items, notes: tail };
}

// { html: { file, head, items, notes }, css: … } — модули в порядке курсов (файлы читаются по алфавиту).
const ORDER = ['html', 'css', 'js', 'ai', 'bootstrap', 'tilda'];
const rank = (id) => (ORDER.indexOf(id) < 0 ? 99 : ORDER.indexOf(id));
export const COMPILER = Object.fromEntries(Object.entries(RAW).map(([path, text]) => {
  const id = /kompilyator-amaliy-([a-z0-9]+)\.txt$/.exec(path)[1];
  return [id, Object.assign({ file: path.slice(1) }, parse(text))];
}).sort((a, b) => rank(a[0]) - rank(b[0])));

// Плоский список для боковой панели режима «Компилятор»: задания модуля по порядку, в конце — сверка со старыми.
export function compilerItems() {
  const out = [];
  Object.keys(COMPILER).forEach((m) => {
    const d = COMPILER[m];
    d.items.forEach((it) => out.push(Object.assign({ key: m + ':' + it.n, module: m, file: d.file }, it)));
    if (d.notes) out.push({ key: m + ':notes', module: m, file: d.file, n: null, title: 'Сверка со старыми промптами', notes: d.notes });
  });
  return out;
}
