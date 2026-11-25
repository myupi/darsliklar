import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Image as ImageIcon, Keyboard, Laptop, Maximize2, PanelRightClose, PanelRightOpen, RotateCcw, RotateCw, Smartphone, Tablet } from 'lucide-react';
import { pad2 } from '../shared/catalog.js';
import { loadBank, tx } from '../shared/trainers.js';
import CopyButton from './CopyButton.jsx';
import DeviceStage from './DeviceStage.jsx';
import LogPanel from './LogPanel.jsx';
import { MenuButton } from './Toolbar.jsx';

// Раздел «Тренажёр» просмотрщика (18.11.2026): тренажёр модуля в телефоне или ноутбуке с эмуляцией LMS
// (src/trainer/main.jsx — выбор вопросов, сохранение ответа, итог и награда) и банк вопросов по урокам.

const LANG_LABEL = { uz: 'UZ', ru: 'RU', en: 'EN' };
const DEVICES = [
  { v: 'phone', label: 'Телефон', Icon: Smartphone },
  { v: 'phoneKbd', label: 'Телефон с открытой клавиатурой («впиши ответ»)', Icon: Keyboard },
  { v: 'tablet', label: 'Планшет', Icon: Tablet },
  { v: 'laptop', label: 'Ноутбук', Icon: Laptop },
  { v: 'fill', label: 'Во всю область', Icon: Maximize2 },
];
const DIFF = { easy: 'лёгкий', medium: 'средний', hard: 'трудный' };
// Вопросы без вариантов A–D (18.11.2026): метка на карточке и подсказка.
const QTYPE = {
  text_input: ['впиши ответ', 'Ученик сам вписывает ответ'],
  assemble: ['собери', 'Ученик собирает код из кусочков по порядку'],
  find_error: ['найди ошибку', 'Ученик нажимает строку кода с ошибкой'],
  tap_page: ['нажми на странице', 'Ученик нажимает нужное место на странице'],
};
// Блоки образца математики (его README).
export const G01_BLOCKS = { b01: '10 gacha sanash, qo‘shish va ayirish', b02: '11–20 va o‘nlikdan o‘tish', b03: '21–100 va amallar', b04: 'Masalalar, shakllar, o‘lchov' };

export function useBank(tr) {
  const [bank, setBank] = useState(null);
  useEffect(() => {
    let alive = true;
    setBank(null);
    if (tr && tr.status === 'ready') loadBank(tr).then((b) => { if (alive) setBank(b); });
    return () => { alive = false; };
  }, [tr && tr.id]);
  return bank;
}

function Segmented({ value, options, onChange, label, iconOnly }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={'seg-btn' + (value === o.v ? ' is-on' : '')}
          onClick={() => onChange(o.v)} title={o.hint || o.label} aria-label={o.label}>
          {o.Icon ? <o.Icon size={15} aria-hidden="true" /> : null}
          {iconOnly && o.Icon ? null : <span>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}

function trainerQuery(tr, prefs, extra) {
  const lang = tr.langs.includes(prefs.lang) ? prefs.lang : tr.langs[0];
  const q = new URLSearchParams({ t: tr.id, lang });
  if (extra && extra.savol) {
    q.set('savol', extra.savol); q.set('exit', '0'); q.set('restart', '0');
    return q.toString();
  }
  q.set('rejim', prefs.trnMode);
  if (tr.pick === 'block') q.set('blok', /^b\d\d$/.test(prefs.trnUpto) ? prefs.trnUpto : tr.blocks[0]);
  else if (prefs.trnUpto) q.set('gacha', prefs.trnUpto);
  if (!tr.fixedSize) q.set('n', prefs.trnN || '15');
  if (prefs.trnSave !== 'ok') q.set('saqlash', prefs.trnSave);
  if (prefs.trnExit === false) q.set('exit', '0');
  if (prefs.trnRestart === false) q.set('restart', '0');
  return q.toString();
}

function Head({ tr, course, title, pill, onMenu, actions, paths }) {
  return (
    <>
      <div className="tb-row">
        <MenuButton onClick={onMenu} />
        <div className="tb-title">
          <span className="course-chip" style={{ '--chip': tr.color || (course && course.color) || '#FA4F28' }}>{tr.short || (course && course.short) || tr.title}</span>
          <h1>{title}</h1>
          {pill}
        </div>
        <div className="tb-actions">{actions}</div>
      </div>
      <div className="tb-path">
        {paths.map((p, i) => <React.Fragment key={p}>{i ? <span className="trn-path-sep">·</span> : null}<code>{p}</code><CopyButton text={p} label="Скопировать путь" /></React.Fragment>)}
      </div>
    </>
  );
}

// ── Попытка: тренажёр с эмуляцией LMS ──
function Play({ tr, course, bank, prefs, set, onMenu, frameRef, log, clearLog }) {
  const [run, setRun] = useState(0);
  const query = trainerQuery(tr, prefs);
  const src = `/trainer.html?${query}&run=${run}`;
  useEffect(() => { clearLog(); }, [src]);
  const lessons = useMemo(() => {
    if (!bank) return [];
    const m = new Map();
    bank.forEach((x) => { if (x.lesson != null) m.set(x.lesson, (m.get(x.lesson) || 0) + 1); });
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [bank]);
  const pool = !bank ? null : tr.pick === 'block' ? null
    : bank.filter((x) => !prefs.trnUpto || (x.lesson != null && x.lesson <= Number(prefs.trnUpto))).length;
  const size = tr.fixedSize ? tr.size : Number(prefs.trnN) || 15;
  const lessonTitle = (n) => { const l = course && course.lessons.find((x) => x.kind === 'lesson' && x.n === n); return l ? (l.baseTitle || l.title) : ''; };
  return (
    <>
      <header className="toolbar">
        <Head tr={tr} course={course} onMenu={onMenu}
          title={tr.sample ? `Образец LMS · ${tr.title}` : `Тренажёр ${tr.title}`}
          pill={<span className="pill is-ready">{bank ? bank.length + ' вопросов' : 'готов'}</span>}
          paths={[tr.jsx.slice(1), tr.bank.slice(1)]}
          actions={<>
            <button type="button" className="btn" onClick={() => setRun((r) => r + 1)} title="Новая попытка: LMS заново выберет вопросы"><RotateCcw size={15} aria-hidden="true" /> Новая попытка</button>
            <a className="btn" href={`/trainer.html?${query}`} target="_blank" rel="noreferrer" title="Открыть тренажёр отдельно, во всё окно"><ExternalLink size={15} aria-hidden="true" /> Отдельно</a>
            <button type="button" className={'icon-btn' + (prefs.logOpen ? ' is-on' : '')} onClick={() => set({ logOpen: !prefs.logOpen })}
              title={prefs.logOpen ? 'Скрыть журнал' : 'Показать журнал'} aria-label={prefs.logOpen ? 'Скрыть журнал' : 'Показать журнал'}>
              {prefs.logOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
            </button>
          </>} />
        <div className="tb-row tb-controls">
          <div className="ctl">
            <span className="ctl-label">Язык</span>
            <Segmented label="Язык" value={tr.langs.includes(prefs.lang) ? prefs.lang : tr.langs[0]} options={tr.langs.map((v) => ({ v, label: LANG_LABEL[v] }))} onChange={(lang) => set({ lang })} />
          </div>
          <div className="ctl">
            <span className="ctl-label">Экран</span>
            <Segmented label="Устройство" value={DEVICES.some((d) => d.v === prefs.device) ? prefs.device : 'phone'} options={DEVICES} onChange={(device) => set({ device })} iconOnly />
            <button type="button" className={'icon-btn' + (prefs.rotated ? ' is-on' : '')} onClick={() => set({ rotated: !prefs.rotated })} disabled={prefs.device === 'fill'} title="Повернуть устройство" aria-label="Повернуть устройство"><RotateCw size={15} /></button>
          </div>
          <div className="ctl">
            <span className="ctl-label" title="kind попытки: с наградой (1 в день) или тренировка без награды">Режим</span>
            <Segmented label="Режим попытки" value={prefs.trnMode} onChange={(trnMode) => set({ trnMode })}
              options={[{ v: 'reward', label: 'С наградой', hint: 'kind: reward — в конце LMS начисляет 1 coin + 10 point за верный ответ' }, { v: 'practice', label: 'Без награды', hint: 'kind: practice — «Mukofotsiz mashq», coin и point нет' }]} />
          </div>
          {tr.pick === 'block' ? (
            <div className="ctl">
              <span className="ctl-label" title="Образец: LMS берёт 15 случайных из 100 вопросов открытого блока">Блок</span>
              <select className="field trn-select" value={/^b\d\d$/.test(prefs.trnUpto) ? prefs.trnUpto : tr.blocks[0]} onChange={(e) => set({ trnUpto: e.target.value })} aria-label="Блок">
                {tr.blocks.map((b) => <option key={b} value={b}>{b} · {G01_BLOCKS[b] || ''}</option>)}
              </select>
            </div>
          ) : (
            <div className="ctl">
              <span className="ctl-label" title="LMS может брать вопросы только из пройденных уроков (поле lesson у вопроса)">Пройдено</span>
              <select className="field trn-select" value={/^\d+$/.test(prefs.trnUpto) ? prefs.trnUpto : ''} onChange={(e) => set({ trnUpto: e.target.value })} aria-label="Пройдено уроков">
                <option value="">весь модуль</option>
                {lessons.map(([n, c]) => <option key={n} value={String(n)}>уроки 1–{n}{lessonTitle(n) ? ' (до «' + lessonTitle(n) + '»)' : ''}</option>)}
              </select>
              {pool != null ? <span className={'trn-pool' + (pool < size ? ' is-bad' : '')} title="Сколько вопросов в выборке">{pool} в выборке</span> : null}
            </div>
          )}
          {tr.fixedSize ? null : (
            <div className="ctl">
              <span className="ctl-label" title="question_count попытки">Вопросов</span>
              <Segmented label="Вопросов в попытке" value={String(prefs.trnN || '15')} onChange={(trnN) => set({ trnN })}
                options={[{ v: '15', label: '15', hint: 'Как в LMS' }, { v: '5', label: '5', hint: 'Короткая попытка — быстро дойти до итога' }]} />
            </div>
          )}
          <div className="ctl">
            <span className="ctl-label" title="Как LMS сохраняет ответ (busy)">Сохранение</span>
            <Segmented label="Сохранение ответа" value={prefs.trnSave} onChange={(trnSave) => set({ trnSave })}
              options={[{ v: 'ok', label: 'Сразу', hint: '0,3 с' }, { v: 'slow', label: 'Медленно', hint: '1,5 с — видно «Saqlanmoqda…»' }, { v: 'fail', label: 'С ошибкой', hint: 'Первое сохранение ответа и первое завершение падают — тренажёр просит нажать ещё раз' }]} />
          </div>
          <div className="ctl">
            <span className="ctl-label" title="Какие колбэки LMS передаёт тренажёру. Без них кнопок нет">Кнопки LMS</span>
            <button type="button" className={'chip' + (prefs.trnExit !== false ? ' is-on' : '')} onClick={() => set({ trnExit: prefs.trnExit === false })} title="onExit: крестик и «Chiqish»">onExit</button>
            <button type="button" className={'chip' + (prefs.trnRestart !== false ? ' is-on' : '')} onClick={() => set({ trnRestart: prefs.trnRestart === false })} title="onRestart: «Yana mashq qilish»">onRestart</button>
          </div>
        </div>
      </header>
      <div className="workspace">
        <DeviceStage noArm frameRef={frameRef} src={src} device={DEVICES.some((d) => d.v === prefs.device) ? prefs.device : 'phone'} rotated={prefs.rotated} title={'Тренажёр ' + tr.title} />
        {prefs.logOpen ? <LogPanel log={log} onClear={clearLog} /> : null}
      </div>
    </>
  );
}

// ── Банк вопросов: карточки и выбранный вопрос вживую ──
function Card({ x, lang, on, onPick }) {
  const opts = x.options || [];
  let vis = null;
  if (typeof x.vis === 'string' && x.vis.startsWith('@')) {
    try { vis = JSON.parse(x.vis.slice(x.vis.indexOf(':') + 1)); } catch (e) { vis = null; }
  }
  // CSS-вид (тренажёр CSS): код — css, страница — html (+ base/goal)
  const code = vis && vis.code != null ? tx(vis.code, lang) : vis && vis.css != null ? tx(vis.css, lang) : null;
  const hasPage = !!vis && (vis.page != null || vis.html != null);
  return (
    <li>
      <button type="button" className={'trn-card' + (on ? ' is-on' : '')} onClick={onPick}>
        <span className="trn-card-top">
          <code>{x.question_id}</code>
          {x.difficulty ? <span className={'trn-diff is-' + x.difficulty}>{DIFF[x.difficulty] || x.difficulty}</span> : null}
          {QTYPE[x.question_type] ? <span className="trn-diff is-input" title={QTYPE[x.question_type][1]}>{QTYPE[x.question_type][0]}</span> : null}
          {x.vis ? <span className="trn-vis" title="У вопроса есть картинка"><ImageIcon size={12} aria-hidden="true" /> {code != null && hasPage ? 'код и страница' : code != null ? 'код' : hasPage ? 'страница' : 'картинка'}</span> : null}
        </span>
        {tx(x.context, lang) ? <span className="trn-ctx">{tx(x.context, lang)}</span> : null}
        <span className="trn-q">{tx(x.question_text, lang)}</span>
        {code != null ? <pre className="trn-code">{x.question_type === 'find_error'
          ? code.split('\n').map((ln, i) => <span key={i} className={String(i + 1) === String(x.correct_answer) ? 'trn-bugline' : ''}>{ln + '\n'}</span>) : code}</pre> : null}
        {x.question_type === 'assemble' ? (
          <span className="trn-input">
            <span className="trn-input-l">Собирает по порядку:</span>
            {String(x.correct_answer).split(',').map((id, i) => <code key={id} className="is-main">{i + 1}. {tx(((x.options || []).find((o) => o.id === id) || {}).text, lang).trim()}</code>)}
            <span className="trn-input-l">лишние:</span>
            {(x.options || []).filter((o) => !String(x.correct_answer).split(',').includes(o.id)).map((o) => <code key={o.id}>{tx(o.text, lang).trim()}</code>)}
          </span>
        ) : null}
        {x.question_type === 'find_error' ? <span className="trn-input"><span className="trn-input-l">Нажимает строку:</span><code className="is-main">{x.correct_answer}</code></span> : null}
        {x.question_type === 'tap_page' ? <span className="trn-input"><span className="trn-input-l">Нажимает на странице:</span><code className="is-main">data-t="{x.correct_answer}"</code></span> : null}
        {x.question_type === 'text_input' ? (
          <span className="trn-input">
            <span className="trn-input-l">Ученик вписывает:</span>
            {(x.accepted_answers || [x.correct_answer]).map((a, i) => <code key={i} className={i ? '' : 'is-main'}>{a}</code>)}
          </span>
        ) : null}
        <span className={'trn-opts' + (x.mono ? ' is-mono' : '')}>
          {(x.question_type || 'single_choice') === 'single_choice' && opts.map((o, i) => (
            <span key={o.id} className={'trn-opt' + (o.id === x.correct_answer ? ' is-ok' : '')}>
              <b>{String.fromCharCode(65 + i)}</b>{tx(o.text, lang)}{o.id === x.correct_answer ? <CheckCircle2 size={13} aria-label="верный" /> : null}
            </span>
          ))}
        </span>
        {tx(x.solution_explanation, lang) ? <span className="trn-why">{tx(x.solution_explanation, lang)}</span> : null}
      </button>
    </li>
  );
}

function Bank({ tr, course, bank, sub, prefs, set, onMenu, frameRef }) {
  const lang = tr.langs.includes(prefs.lang) ? prefs.lang : tr.langs[0];
  const rows = !bank ? [] : bank.filter((x) => sub == null || (tr.pick === 'block' ? x.block_id === sub : String(x.lesson) === sub));
  const selQ = rows.find((x) => x.question_id === prefs.trnQ) || rows[0] || null;
  const lessonTitle = sub == null ? '' : tr.pick === 'block' ? G01_BLOCKS[sub] || sub
    : (((course && course.lessons.find((x) => x.kind === 'lesson' && String(x.n) === sub)) || {}).baseTitle || ((course && course.lessons.find((x) => x.kind === 'lesson' && String(x.n) === sub)) || {}).title) || '';
  const pos = { a: 0, b: 0, c: 0, d: 0 };
  rows.forEach((x) => { if ((x.question_type || 'single_choice') !== 'single_choice') return; const i = (x.options || []).findIndex((o) => o.id === x.correct_answer); if (i >= 0) pos['abcd'[i]]++; });
  const nType = (t) => rows.filter((x) => x.question_type === t).length;
  const src = selQ ? `/trainer.html?${trainerQuery(tr, prefs, { savol: selQ.question_id })}` : null;
  return (
    <>
      <header className="toolbar">
        <Head tr={tr} course={course} onMenu={onMenu}
          title={<>{sub != null && tr.pick !== 'block' ? <span className="tb-n">{pad2(Number(sub))}</span> : null}{sub == null ? `Все вопросы · ${tr.title}` : lessonTitle || sub}</>}
          pill={<span className="pill is-ready">{rows.length} вопросов</span>}
          paths={[tr.bank.slice(1)]}
          actions={null} />
        <div className="tb-row tb-controls">
          <div className="ctl">
            <span className="ctl-label">Язык</span>
            <Segmented label="Язык" value={lang} options={tr.langs.map((v) => ({ v, label: LANG_LABEL[v] }))} onChange={(l) => set({ lang: l })} />
          </div>
          <div className="ctl">
            <span className="ctl-label">Экран</span>
            <Segmented label="Устройство" value={DEVICES.some((d) => d.v === prefs.device) ? prefs.device : 'phone'} options={DEVICES.filter((d) => d.v !== 'fill')} onChange={(device) => set({ device })} iconOnly />
          </div>
          <div className="ctl trn-stat" title="На каком месте стоит верный ответ — чтобы «жать всегда A» не работало">
            <span className="ctl-label">Верный ответ</span>
            {Object.keys(pos).filter((k) => pos[k] || k !== 'd').map((k) => <span key={k} className="trn-pos"><b>{k.toUpperCase()}</b> {pos[k]}</span>)}
          </div>
          {Object.keys(QTYPE).some((t) => nType(t)) ? (
            <div className="ctl trn-stat" title="Вопросы без вариантов: ответ — строка, LMS сравнивает её с accepted_answers">
              <span className="ctl-label">Без вариантов</span>
              {Object.keys(QTYPE).map((t) => (nType(t) ? <span key={t} className="trn-pos">{QTYPE[t][0]} {nType(t)}</span> : null))}
            </div>
          ) : null}
        </div>
      </header>
      <div className="workspace trn-bank">
        <ul className="trn-list">
          {!bank ? <li className="log-empty">Загружаю банк…</li> : rows.map((x) => (
            <Card key={x.question_id} x={x} lang={lang} on={selQ === x} onPick={() => set({ trnQ: x.question_id })} />
          ))}
        </ul>
        <div className="trn-preview">
          {src ? <DeviceStage noArm frameRef={frameRef} src={src} device={DEVICES.some((d) => d.v === prefs.device && d.v !== 'fill') ? prefs.device : 'phone'} rotated={false} title={selQ.question_id} /> : null}
        </div>
      </div>
    </>
  );
}

export default function TrainerPage({ tr, course, sub, isBank, prefs, set, onMenu, frameRef, log, clearLog }) {
  const bank = useBank(tr);
  if (!tr) return null;
  if (tr.status !== 'ready') {
    return (
      <>
        <header className="toolbar">
          <div className="tb-row">
            <MenuButton onClick={onMenu} />
            <div className="tb-title"><span className="course-chip" style={{ '--chip': (course && course.color) || '#999' }}>{(course && course.short) || tr.title}</span><h1>Тренажёр {tr.title}</h1><span className="pill is-planned">в плане</span></div>
          </div>
        </header>
        <div className="placeholder">
          <div className="ph-card trn-plan">
            <h2>Тренажёр {tr.title} ещё не собран</h2>
            <p>Как у HTML: вопросы — <code>tools/trenajor/{tr.dir}/lNN.mjs</code> (формат — <code>tools/trenajor/html/FORMAT.md</code>), свой <code>META</code> в <code>tools/trenajor/build.mjs</code>, сборка — <code>node tools/trenajor/build.mjs {tr.dir}</code>. Файлы появятся в <code>trenajor/{tr.dir}/</code>, и тренажёр откроется здесь сам.</p>
          </div>
        </div>
      </>
    );
  }
  return isBank
    ? <Bank tr={tr} course={course} bank={bank} sub={sub} prefs={prefs} set={set} onMenu={onMenu} frameRef={frameRef} />
    : <Play tr={tr} course={course} bank={bank} prefs={prefs} set={set} onMenu={onMenu} frameRef={frameRef} log={log} clearLog={clearLog} />;
}
