// Задания для компилятора платформы (14.11.2026): ученик сам пишет код, ИИ платформы проверяет по промпту.
// Источник — docs/kompilyator-amaliy-<курс>.txt в формате файла заказчика HTML_practice_prompts.txt:
//   N. НАЗВАНИЕ УРОКА: …
//   ЗАДАНИЕ ДЛЯ УЧЕНИКА:  (строки на узбекском; перевод — «(RU: …)»)
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
    const checkAt = b.indexOf('ПРОМПТ ДЛЯ ПРОВЕРКИ:');
    if (checkAt < 0) continue;
    let task = taskAt >= 0 ? b.slice(taskAt + 'ЗАДАНИЕ ДЛЯ УЧЕНИКА:'.length, checkAt).trim() : '';
    let ru = '';
    const r = /\(RU:\s*([\s\S]*?)\)\s*$/.exec(task);
    if (r) { ru = r[1].replace(/\s*\n\s*/g, ' ').trim(); task = task.slice(0, r.index).trim(); }
    const lines = task.split('\n').map((s) => s.trim()).filter(Boolean);
    items.push({
      n: +m[1],
      title: m[2].trim(),
      intro: lines.filter((s) => !s.startsWith('- ')),
      steps: lines.filter((s) => s.startsWith('- ')).map((s) => s.slice(2)),
      ru,
      check: b.slice(checkAt + 'ПРОМПТ ДЛЯ ПРОВЕРКИ:'.length).trim()
    });
  }
  const tail = blocks.find((b) => !/^\d+\.\s*НАЗВАНИЕ УРОКА:/m.test(b)) || '';
  return { head, items, notes: tail };
}

// { html: { file, head, items, notes }, css: … } — модули в порядке курсов (файлы читаются по алфавиту).
const ORDER = ['html', 'css', 'js', 'ai'];
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
