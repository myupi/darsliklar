#!/usr/bin/env node
// Проверка файлов команды: определения агентов (.claude/agents/*.md), навык /lesson-team
// и документы docs/lesson-team/. Поля, имена, инструменты, права, ссылки на файлы.
//
//   node tools/qa/lesson-team/check-team.mjs
//
// Код выхода 0 — замечаний нет, 1 — есть.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT } from './lib/files.mjs';

const problems = [];
const ok = [];
const P = (m) => problems.push(m);

function frontmatter(path) {
  const text = readFileSync(path, 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) return { error: 'нет блока frontmatter между строками ---', text };
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (kv) fields[kv[1]] = kv[2].trim();
    else if (line.trim()) return { error: 'строка frontmatter не в виде «ключ: значение»: ' + line, text };
  }
  return { fields, body: text.slice(m[0].length), text };
}

// Встроенные инструменты Claude Code, которые разрешено перечислять в tools.
const KNOWN = new Set(['Read', 'Write', 'Edit', 'MultiEdit', 'Glob', 'Grep', 'Bash', 'WebFetch', 'WebSearch', 'NotebookEdit', 'Agent', 'Task', 'TodoWrite', 'Skill']);
const ROLES = {
  'lesson-methodist': { write: false },
  'subject-reviewer': { write: false, bash: true },
  'lesson-builder': { write: true },
  'language-editor': { write: false },
  'learning-reviewer': { write: false },
  'ux-reviewer': { write: false },
  'qa-tester': { write: false, bash: true },
};

// Ссылки на файлы в тексте: `путь` с / и расширением (без шаблонов <…>, …, *).
function checkRefs(where, text, baseDir) {
  const refs = [...text.matchAll(/`([^`\s]+)`/g)].map((m) => m[1])
    .filter((r) => r.includes('/') && !/[<>…*{}$]/.test(r) && !/^https?:/.test(r) && !r.startsWith('-'))
    .map((r) => r.replace(/[),.:;]+$/, '').split(':')[0])
    .filter((r) => /\.(md|mjs|js|jsx|json|html|css)$|\/$/.test(r));
  for (const r of [...new Set(refs)]) {
    const clean = r.replace(/^\//, '');
    const candidates = [resolve(ROOT, clean), resolve(ROOT, '.claude/skills/novyy-urok', clean), resolve(ROOT, 'docs/lesson-team', clean)]
      .concat(baseDir ? [resolve(ROOT, baseDir, clean)] : []);
    if (!candidates.some((c) => existsSync(c))) P(`${where}: ссылка на несуществующий путь \`${r}\``);
  }
  return refs.length;
}

// ── Агенты
const agentsDir = resolve(ROOT, '.claude/agents');
const files = existsSync(agentsDir) ? readdirSync(agentsDir).filter((f) => f.endsWith('.md')) : [];
const names = new Set();
for (const role of Object.keys(ROLES)) if (!files.includes(role + '.md')) P(`нет агента ${role} (.claude/agents/${role}.md)`);
for (const f of files) {
  const where = `.claude/agents/${f}`;
  const fm = frontmatter(join(agentsDir, f));
  if (fm.error) { P(`${where}: ${fm.error}`); continue; }
  const { name, description, tools, model } = fm.fields;
  if (!name) P(`${where}: нет name`);
  if (!description) P(`${where}: нет description`);
  if (name && name !== f.replace(/\.md$/, '')) P(`${where}: name «${name}» не совпадает с именем файла`);
  if (name && !/^[a-z][a-z0-9-]*$/.test(name)) P(`${where}: имя только из строчных латинских букв, цифр и дефисов`);
  if (name && names.has(name)) P(`${where}: имя ${name} повторяется`);
  names.add(name);
  if (model !== 'inherit') P(`${where}: model должен быть inherit (модель пользователя), сейчас «${model || 'не задан'}»`);
  const list = (tools || '').split(',').map((t) => t.trim()).filter(Boolean);
  if (!list.length) P(`${where}: tools не задан — агент унаследует все инструменты`);
  list.filter((t) => !KNOWN.has(t)).forEach((t) => P(`${where}: неизвестный инструмент ${t}`));
  if (list.includes('Agent') || list.includes('Task')) P(`${where}: субагент не должен запускать других агентов (координатор — главный Claude)`);
  const role = ROLES[name];
  if (role) {
    const writes = list.some((t) => ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(t));
    if (writes && !role.write) P(`${where}: у проверяющего не должно быть инструментов записи`);
    if (!writes && role.write) P(`${where}: исполнителю нужны Edit и Write`);
    if (list.includes('Bash') && !role.write && !role.bash) P(`${where}: Bash не предусмотрен этой роли`);
    if (list.includes('Bash') && !role.write && !/только чтени|не «только чтени|не только читаешь|Не только чтени/i.test(fm.body + description)) {
      P(`${where}: агент с Bash должен прямо говорить, что он не «только для чтения»`);
    }
  }
  for (const section of ['Вход', 'Формат результата', 'не завершен']) {
    if (!fm.body.includes(section)) P(`${where}: нет раздела про «${section}»`);
  }
  checkRefs(where, fm.body, '.claude/agents');
  ok.push(`агент ${name}: ${list.join(', ')}`);
}

// ── Навык /lesson-team
const skillPath = resolve(ROOT, '.claude/skills/lesson-team/SKILL.md');
if (!existsSync(skillPath)) P('нет навыка .claude/skills/lesson-team/SKILL.md');
else {
  const fm = frontmatter(skillPath);
  if (fm.error) P('SKILL.md: ' + fm.error);
  else {
    const f = fm.fields;
    if (f.name !== 'lesson-team') P('SKILL.md: name должен быть lesson-team');
    if (!f.description) P('SKILL.md: нет description');
    if (!/^(true|yes|on|1)$/.test(f['disable-model-invocation'] || '')) P('SKILL.md: нужен disable-model-invocation: true (только ручной запуск)');
    if (f.context) P('SKILL.md: context не задаётся — координация остаётся в основном разговоре');
    if (f['allowed-tools']) P('SKILL.md: allowed-tools не нужен (права не расширяем)');
    if (!fm.body.includes('$ARGUMENTS')) P('SKILL.md: в тексте нет $ARGUMENTS');
    for (const role of Object.keys(ROLES)) if (!fm.body.includes(role)) P(`SKILL.md: не упомянут агент ${role}`);
    const lines = fm.text.split('\n').length;
    if (lines > 500) P(`SKILL.md: ${lines} строк — больше 500`);
    checkRefs('SKILL.md', fm.body, '.claude/skills/lesson-team');
    ok.push(`навык /lesson-team: ${lines} строк, ручной запуск`);
  }
}

// ── Документы
for (const f of ['README.md', 'pravila-komandy.md', 'obshchie-trebovaniya.md', 'format-otchyotov.md', 'shablon-postanovki.md', 'moduli/_shablon.md', 'moduli/html.md']) {
  const p = resolve(ROOT, 'docs/lesson-team', f);
  if (!existsSync(p)) { P('нет docs/lesson-team/' + f); continue; }
  const n = checkRefs('docs/lesson-team/' + f, readFileSync(p, 'utf8'), 'docs/lesson-team/' + f.split('/').slice(0, -1).join('/'));
  ok.push(`docs/lesson-team/${f}: ссылок на файлы ${n}`);
}
const qaReadme = resolve(ROOT, 'tools/qa/lesson-team/README.md');
if (existsSync(qaReadme)) { const n = checkRefs('tools/qa/lesson-team/README.md', readFileSync(qaReadme, 'utf8'), 'tools/qa/lesson-team'); ok.push('tools/qa/lesson-team/README.md: ссылок на файлы ' + n); }

ok.forEach((m) => console.log('ок   ' + m));
problems.forEach((m) => console.log('НЕ ТАК ' + m));
console.log(problems.length ? `\nЗамечаний: ${problems.length}` : '\nЗамечаний нет');
process.exit(problems.length ? 1 : 0);
