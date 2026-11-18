import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardCheck, Download, ExternalLink, FileCode, Eye, Sparkles } from 'lucide-react';
import { exportSlide } from './slideExport.js';
import CopyButton from './CopyButton.jsx';
import { MenuButton } from './Toolbar.jsx';

// Режим «Компилятор» просмотрщика (14.11.2026): одно задание — как его видит ученик (слайд «Amaliy vazifa»: условия и результат
// справа) и промпт, по которому работу проверяет ИИ платформы. Данные — docs/kompilyator-amaliy-<модуль>.txt.
// Модули без результата на слайде и без примера решения (заказчик, 16.11.2026, «ИИ»: «результат не показывать, а только дать задания»).
const NO_RESULT = new Set(['ai']);
// Страница-пример на языке слайда (16.11.2026: «результат везде узбекский, сделай соответствующими языками»):
// узбекская — <NN>/index.html, русская и английская — <NN>/ru/index.html и <NN>/en/index.html (картинки рядом, те же имена).
const exampleUrl = (it, lang) => '/kompilyator/' + it.module + '/' + String(it.n).padStart(2, '0') + '/' + (lang && lang !== 'uz' ? lang + '/' : '') + 'index.html';

// Теги и атрибуты в условии — красным, как на прежних слайдах «Amaliy vazifa».
// Свойства CSS в тексте задания отмечены обратными кавычками: `width` (кавычки не показываются).
function hl(text) {
  return String(text).split(/(`[^`]+`|<\/?!?[A-Za-z][^<>]*>|\b[a-z]+="")/g)
    .map((x, i) => (i % 2 ? <span key={i} className="cmp-tag">{x.replace(/^`|`$/g, '')}</span> : x));
}
// Русский перевод: «Тема: условие; условие; условие.» → тема и пункты.
function ruParts(ru) {
  const s = String(ru || '').replace(/\.\s*$/, '');
  const at = s.indexOf(': ');
  return at < 0 ? { intro: s, steps: [] } : { intro: s.slice(0, at) + '.', steps: s.slice(at + 2).split(/;\s*/).filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1)) };
}

// Как задание видит ученик — слайд «Amaliy vazifa» точь-в-точь как прежние слайды заказчика (14.11.2026):
// кадр 16:9 одного размера (все размеры — доли ширины кадра, cqw), оранжевый фон и серый круг справа, «— HTML»,
// «Amaliy vazifa», «● JUNIOR», персонаж справа; в белой карточке — тема и условия (теги красным) и в красной рамке
// результат: страница-пример целиком, уменьшенная, без вкладки браузера и без прокрутки.
const PAGE_W = 340;   // ширина страницы-примера до уменьшения, px: меньше — крупнее текст в рамке (заказчик, 14.11.2026)
// Заголовок слайда на языке слайда (16.11.2026: «Как видит ученик» — на трёх языках).
const SLIDE_TITLE = { uz: 'Amaliy vazifa', ru: 'Практика', en: 'Practice task' };   // ru — «Практика» (заказчик, 16.11.2026)
const SLIDE_LANGS = [['uz', "O'zbekcha"], ['ru', 'Русский'], ['en', 'English']];
const KICKER = {
  uz: (n, m) => `Kompilyator uchun topshiriq ${n} / ${m}`,
  ru: (n, m) => `Задание для компилятора ${n} из ${m}`,
  en: (n, m) => `Compiler task ${n} of ${m}`,
};
function StudentView({ it, lang }) {
  const [fit, setFit] = useState(null);   // { s: масштаб, ch: высота страницы }
  const frame = useRef(null);
  const view = useRef(null);
  const tries = useRef(0);
  const sFloor = useRef(Infinity);
  const slideRef = useRef(null);
  const [busy, setBusy] = useState('');
  const url = exampleUrl(it, lang);
  const noRes = NO_RESULT.has(it.module);
  const measure = () => {
    const f = frame.current, v = view.current;
    const d = f && f.contentDocument;
    if (!d || !d.body || d.readyState !== 'complete' || !v) return;
    d.documentElement.style.overflow = 'hidden';
    // Высота <html> — по содержимому, с полями body и заголовков (scrollHeight не меньше окна iframe).
    const ch = Math.ceil(d.documentElement.getBoundingClientRect().height);
    const slide = v.closest('.cmp-slide');
    const maxH = (slide ? slide.clientWidth : 1000) * 0.3;   // рамка помещается в карточку кадра
    let s = Math.min(v.clientWidth / PAGE_W, maxH / ch);
    // Уменьшили — страница шире и короче: меряем ещё раз в следующем кадре, пока масштаб не устоится.
    // Не больше 8 пересчётов на страницу — чтобы масштаб и высота не раскачивали друг друга.
    // С 4-го пересчёта масштаб только уменьшается: у страницы с @media ширина пересекает порог туда-обратно
    // (раскладка и высота прыгают) — так она пересечёт его один раз и устоится, ничего не обрежется.
    tries.current += 1;
    if (tries.current > 8) return;
    if (tries.current > 3) s = Math.min(s, sFloor.current);
    sFloor.current = s;
    setFit((o) => (o && Math.abs(o.s - s) < 0.004 && o.ch === ch ? o : { s, ch }));
  };
  useEffect(() => { setFit(null); tries.current = 0; }, [url]);
  useEffect(() => { const t = requestAnimationFrame(measure); return () => cancelAnimationFrame(t); }, [fit && fit.s, fit && fit.ch]);
  useEffect(() => { const onResize = () => { tries.current = 0; measure(); }; window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize); }, []);
  const T = lang === 'uz' ? { intro: it.intro.join(' '), steps: it.steps } : ruParts(lang === 'en' ? it.en : it.ru);
  // Скачать слайд картинкой PNG или файлом PDF (1920×1080).
  const save = async (kind) => {
    if (busy || !slideRef.current) return;
    setBusy(kind);
    try { await exportSlide(slideRef.current, kind, 'amaliy-vazifa-' + it.module + '-' + String(it.n).padStart(2, '0') + '-' + lang); }
    catch (e) { console.error('[slide] ' + kind, e); }
    finally { setBusy(''); }
  };
  return (
    <>
    <div ref={slideRef} className="cmp-slide" aria-label="Как задание видит ученик">
      <div className="cmp-slide-circle" aria-hidden="true" />
      <img className="cmp-slide-hero" src="/kompilyator/bola.webp" alt="" aria-hidden="true" />
      <div className="cmp-slide-top">{String(it.module).toUpperCase()}</div>
      <div className="cmp-slide-junior">JUNIOR</div>
      <div className="cmp-slide-title">{SLIDE_TITLE[lang] || SLIDE_TITLE.uz}</div>
      <div className={'cmp-slide-card' + (noRes ? ' is-text' : '')}>
        <div className="cmp-slide-text">
          <p className="cmp-slide-intro">{hl(T.intro)}</p>
          {T.steps.length ? <ol className="cmp-slide-list">{T.steps.map((x, i) => <li key={i}>{hl(x)}</li>)}</ol> : null}
        </div>
        {noRes ? null : <div className="cmp-slide-res">
          <div ref={view} className="cmp-slide-view" style={fit ? { height: Math.ceil(fit.ch * fit.s) } : undefined}>
            <iframe ref={frame} title={'Результат ' + it.n} src={url} sandbox="allow-same-origin" scrolling="no" onLoad={() => { tries.current = 0; measure(); }}
              style={fit ? { width: (100 / fit.s) + '%', height: fit.ch, transform: 'scale(' + fit.s + ')' } : undefined} />
          </div>
        </div>}
      </div>
    </div>
    <div className="cmp-slide-dl">
      {[['png', 'Скачать PNG'], ['pdf', 'Скачать PDF']].map(([k, t]) => (
        <button key={k} type="button" className="cmp-dl-btn" disabled={!!busy || (!fit && !noRes)} onClick={() => save(k)}>
          <Download size={15} aria-hidden="true" /> {busy === k ? 'Готовлю…' : t}
        </button>
      ))}
    </div>
    <TaskText T={T} />
    </>
  );
}

// Текст задания слайда — строками, у каждой своя «Скопировать» (заказчик, 18.11.2026: «отдельно отдельно написать, чтобы я мог скопировать»).
// Копируется простой текст: без обратных кавычек-пометок свойств CSS.
const plain = (x) => String(x).replace(/`([^`]+)`/g, '$1');
function TaskText({ T }) {
  const rows = [{ k: 'intro', n: null, t: plain(T.intro) }].concat(T.steps.map((x, i) => ({ k: 's' + i, n: i + 1, t: plain(x) })));
  const all = rows.map((r) => (r.n ? r.n + '. ' : '') + r.t).join('\n');
  return (
    <div className="cmp-text">
      <div className="cmp-text-head">Текст задания <CopyButton text={all} label="Скопировать весь текст" /></div>
      {rows.map((r) => (
        <div key={r.k} className={'cmp-text-row' + (r.n ? '' : ' is-intro')}>
          <span className="cmp-text-n">{r.n ? r.n + '.' : ''}</span>
          <span className="cmp-text-t">{r.t}</span>
          <CopyButton text={r.t} label="Скопировать строку" />
        </div>
      ))}
    </div>
  );
}

// Пример решения — готовая страница public/kompilyator/<модуль>/<NN>/index.html, рядом её картинки и страницы ссылок
// (её можно открыть ученику во весь экран). На трёх языках — переключатель над кодом (16.11.2026).
const RES_LABEL = { uz: 'Natija', ru: 'Результат', en: 'Result' };
function Example({ it }) {
  const [lang, setLang] = useState('uz');
  const url = exampleUrl(it, lang);
  const [code, setCode] = useState(null);
  useEffect(() => {
    let dead = false;
    // Смена языка — прежний код остаётся, пока не придёт новый (без прыжка раздела).
    // Нет файла — сервер отдаёт страницу просмотрщика (в ней @vite/client и /src/): это не пример.
    fetch(url).then((r) => (r.ok ? r.text() : null)).then((t) => { if (!dead) setCode(t && t.indexOf('@vite/client') < 0 && t.indexOf('/src/') < 0 ? t : ''); }).catch(() => { if (!dead) setCode(''); });
    return () => { dead = true; };
  }, [url]);
  if (code === null) return null;
  if (!code) return <p className="cmp-src">Примера пока нет: положите <code>public{url}</code>.</p>;
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <section>
      <div className="cmp-label"><Sparkles size={14} aria-hidden="true" /> Пример решения — можно показать ученику
        <span className="cmp-langs" role="tablist" aria-label="Язык примера">
          {SLIDE_LANGS.map(([l, name]) => (
            <button key={l} type="button" role="tab" aria-selected={lang === l} className={'cmp-lang' + (lang === l ? ' is-on' : '')} onClick={() => setLang(l)}>{name}</button>
          ))}
        </span>
        <CopyButton text={code} label="Скопировать код примера" />
        <a className="icon-btn sm" href={url} target="_blank" rel="noreferrer" title="Открыть результат во весь экран" aria-label="Открыть результат во весь экран"><ExternalLink size={14} /></a>
      </div>
      <div className="cmp-example">
        <div className="cmp-editor">
          <div className="cmp-tabbar"><span className="cmp-tab"><FileCode size={12} aria-hidden="true" /> index.html</span></div>
          <div className="cmp-code is-full">
            {lines.map((l, i) => <React.Fragment key={i}><span className="cmp-ln">{i + 1}</span><span className="cmp-src-line">{l || ' '}</span></React.Fragment>)}
          </div>
        </div>
        <div className="cmp-result">
          <div className="cmp-result-bar"><i /><i /><i /><span>{RES_LABEL[lang]}</span></div>
          <iframe title={'Пример ' + it.n} src={url} sandbox="allow-same-origin" />
        </div>
      </div>
    </section>
  );
}

export default function CompilerTask({ item, items, course, onPick, onMenu }) {
  if (!item) return <div className="cmp-page"><MenuButton onClick={onMenu} /> Заданий пока нет: положите docs/kompilyator-amaliy-&lt;модуль&gt;.txt</div>;
  const list = items.filter((x) => x.module === item.module);
  const tasks = list.filter((x) => x.n != null);
  const i = list.findIndex((x) => x.key === item.key);
  const prev = list[i - 1], next = list[i + 1];
  return (
    <div className="cmp-page">
      <header className="cmp-head">
        <MenuButton onClick={onMenu} />
        {course ? <span className="course-chip" style={{ '--chip': course.color }}>{course.short}</span> : null}
        {item.n != null && item.titles ? (
          // Шапка на трёх языках (заказчик, 18.11.2026): строка «Задание для компилятора N из M» и название — uz, ru, en, у названия — «Скопировать».
          <div className="cmp-head-langs">
            {SLIDE_LANGS.map(([l]) => (item.titles[l] ? (
              <div key={l} className="cmp-head-lang">
                <span className="cmp-lang">{l.toUpperCase()}</span>
                <div className="cmp-head-text">
                  <p className="cmp-kicker">{KICKER[l](item.n, tasks.length)}</p>
                  <h1>{item.titles[l]} <CopyButton text={item.titles[l]} label="Скопировать название" /></h1>
                </div>
              </div>
            ) : null))}
          </div>
        ) : (
          <div className="cmp-head-text">
            <p className="cmp-kicker">{item.n != null ? `Задание для компилятора ${item.n} из ${tasks.length}` : 'Задания для компилятора'}</p>
            <h1>{item.title}</h1>
          </div>
        )}
        <div className="cmp-head-act">
          <button type="button" className="icon-btn" disabled={!prev} onClick={() => prev && onPick(prev.key)} title="Предыдущее задание" aria-label="Предыдущее задание"><ChevronLeft size={17} /></button>
          <button type="button" className="icon-btn" disabled={!next} onClick={() => next && onPick(next.key)} title="Следующее задание" aria-label="Следующее задание"><ChevronRight size={17} /></button>
        </div>
      </header>

      {item.n != null ? (
        <div className="cmp-one">
          {/* Слайд ученика на трёх языках, у каждого свои «Скачать PNG / PDF» (заказчик, 16.11.2026). */}
          {SLIDE_LANGS.map(([l, name]) => (
            <section key={l}>
              <div className="cmp-label"><Eye size={14} aria-hidden="true" /> Как видит ученик — {name}</div>
              <StudentView it={item} lang={l} />
            </section>
          ))}
          <section>
            <div className="cmp-label"><ClipboardCheck size={14} aria-hidden="true" /> Промпт проверки <CopyButton text={item.check} label="Скопировать промпт" /></div>
            <pre className="cmp-prompt">{item.check}</pre>
          </section>
          {NO_RESULT.has(item.module) ? null : <Example it={item} />}
          <p className="cmp-src">Источник: <code>{item.file}</code> — правка там сразу видна здесь.</p>
        </div>
      ) : (
        <div className="cmp-one">
          <pre className="cmp-prompt is-notes">{String(item.notes || '').replace(/^СВЕРКА[^\n]*\n/, '')}</pre>
        </div>
      )}
    </div>
  );
}
