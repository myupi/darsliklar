// Тест 3/5 к уроку 2 модуля «ИИ» — один вопрос в формате CRM «JSX savol / test» (13.11.2026).
// Собрано: node tools/aitest/build.mjs 02 — вручную не править; исходник — tools/aitest/l02.jsx, набор — tools/aitest/kit.jsx.
import React, { useEffect, useRef, useState } from 'react';
// =============================================================================
// ТЕСТЫ МОДУЛЯ «ИИ» — НАБОР (13.11.2026). Формат — как тесты CRM «JSX savol / test» (образцы заказчика
// ij-d01-test-01…05), дизайн — экраны «Quiz» CoddyCamp LMS (PDF заказчика), фон — в точку, как в уроках.
// Один файл — один вопрос; к уроку — 5 файлов (lessons/ai/NNtK-<slug>.jsx, K = 1…5).
//
// Договор с платформой (как у образцов): props { lang, mode: 'answer' | 'review', initialAnswer, onReady(bool),
// registerCheck(fn), onSubmit(result) }. Тест сообщает, выбран ли ответ (onReady), отдаёт платформе проверку
// (registerCheck); по её кнопке «Tekshirish» — onSubmit({ correct, questionText, studentAnswer, correctAnswer,
// options, meta: { target, ptype, level, tag } }) и отклик в самом тесте: «Barakalla!» с пояснением или «Maslahat»
// с подсказкой (верный вариант при ошибке не подсвечивается). Одна попытка. В review — отправленный ответ, без выбора.
// Своей кнопки «Tekshirish» у теста нет, как у образцов (заказчик, 13.11.2026): её рисует платформа, в просмотрщике —
// эмуляция платформы src/player/QuizShell.jsx. Отклик — плашка под вариантами, как у образцов.
// Языки: uz, ru (как у образцов) и en для просмотрщика.
// =============================================================================

const AQ_LETTERS = ['A', 'B', 'C', 'D'];
const AQ_UI = {
  uz: { chip: 'Eslaymiz', ok: 'Barakalla!', hint: 'Maslahat', review: 'Javob allaqachon yuborilgan.', art: 'Rasm' },
  ru: { chip: 'Вспоминаем', ok: 'Молодец!', hint: 'Подсказка', review: 'Ответ уже отправлен.', art: 'Рисунок' },
  en: { chip: 'Let’s recall', ok: 'Well done!', hint: 'Hint', review: 'The answer has already been sent.', art: 'Picture' }
};
// Метки вопросов формулы — те же цвета, что в уроках модуля.
const AQ_FORMULA = [
  { uz: 'Nima?', ru: 'Что?', en: 'What?', c: '#FA4F28', bg: '#FFF1EC' },
  { uz: 'Nega?', ru: 'Зачем?', en: 'Why?', c: '#7C3AED', bg: '#F3EEFF' },
  { uz: 'Kim uchun?', ru: 'Для кого?', en: 'For whom?', c: '#0D9488', bg: '#E6F7F5' },
  { uz: 'Ichida nima?', ru: 'Что внутри?', en: 'What’s inside?', c: '#DB2777', bg: '#FDECF4' },
  { uz: "Ko'rinishi?", ru: 'Как выглядит?', en: 'How it looks?', c: '#65A30D', bg: '#F0F8E4' },
  { uz: 'Qanday ishlaydi?', ru: 'Как ведёт себя?', en: 'How it behaves?', c: '#B45309', bg: '#FEF3E2' },
  { uz: 'Qoidalar?', ru: 'Какие правила?', en: 'What rules?', c: '#BE123C', bg: '#FDEBEF' }
];

// ── КАРТИНКИ ВОПРОСА (лёгкие, без движка уроков) ──
// Короткая запись текста на трёх языках в данных вопроса: const T = aqL(L); T('uz', 'ru', 'en').
const aqL = (L) => (uz, ru, en) => (L === 'ru' ? ru : L === 'en' ? en : uz);
// Поле промпта: rows — [{ q: номер вопроса формулы, t: текст | null (пустая строка «…») }]
// или своя метка { lab, c, bg, t } — например, «1-prompt», «2-prompt» урока 7.
function AqPrompt({ L, rows }) {
  return (
    <div className="aq-prompt">
      {rows.map((r, i) => {
        const f = r.lab ? { c: r.c || '#475569', bg: r.bg || '#F1F5F9' } : AQ_FORMULA[r.q];
        return (
          <div key={i} className="aq-pl">
            <span className="aq-pq" style={{ background: f.c }}>{r.lab || f[L] || f.ru}</span>
            {r.t ? <span className="aq-pv" style={{ background: f.bg, color: f.c }}>{r.t}</span> : <span className="aq-pe">…</span>}
          </div>
        );
      })}
    </div>
  );
}
// Окно браузера — как в уроках модуля (Chrome: вкладка с названием, кнопки окна, адресная строка index.html).
// Сайт внутри — того же вида, что собирает ИИ в уроках (aiSite, tools/ai1/ai1-kit.jsx): меню, баннер с градиентом,
// главная кнопка, карточки, раздел цели, подвал. Страница рисуется в ширину 800 px (на телефоне — 390 px, мобильная
// версия, 480 px) и уменьшается под окно, как в уроках; сайт виден целиком, без прокрутки внутри окна.
// site: { title, em, nav: [3], badge, sub, cta, cards: [{ ic, h, p }], goal: { h, fields: [], btn } | null, foot, noFoot, focus, c, c2, bg }
function AqBrowser({ title, children, phone, innerRef, style }) {
  return (
    <div ref={innerRef} style={style} className={'aq-br' + (phone ? ' is-phone' : '')}>
      <div className="aq-br-bar">
        <span className="aq-br-tab"><i className="aq-br-fav" /><span className="aq-br-tt">{title}</span><i className="aq-br-x" /></span>
        <i className="aq-br-plus" />
        <span className="aq-br-win"><i className="aq-w-min" /><i className="aq-w-max" /><i className="aq-br-x" /></span>
      </div>
      <div className="aq-br-tool"><span className="aq-br-ar">‹ ›</span><span className="aq-br-url"><i className="aq-br-lock" />index.html</span></div>
      <div className="aq-br-body">{children}</div>
    </div>
  );
}
// Расширения сайта для вопросов уроков 2–7 (всё необязательно):
//   font — свой шрифт; dark — тёмная страница; radius / shadow ('big' | 'none') — форма карточек; heroBg — свой фон баннера;
//   btn / btnFg — свой цвет кнопок (второй цвет «Ko'rinishi?»); oneBtn — одна кнопка (без кнопки в меню); mobile — телефон (390 px, ☰), bottomBtn — кнопка внизу экрана телефона;
//   info — строка сведений под баннером [{ t, guess }]; blocks — блоки [{ h, items: [{ t, p, guess }], mark }];
//   extras — что ИИ добавил сам { popup, sale, chat }; cursor — 'hover' | 'click' над главной кнопкой; ctaHot — вид
//   кнопки под мышкой { bg, scale }; ctaBig — кнопка всегда огромная; toast — сообщение после нажатия;
//   marks — метки { hero: { t, c }, cta: { t, c }, info: { t, c }, extras: { t, c } }; у блока — свой mark.
function AqPin({ m }) { return m ? <i className="pin" style={{ background: m.c || '#475569' }}>{m.t}</i> : null; }
function AqCursor({ click }) {
  return (
    <span className={'cur' + (click ? ' is-click' : '')} aria-hidden="true">
      {click ? <i className="ring" /> : null}
      <svg viewBox="0 0 24 24"><path d="M5 2.5v17.2l4.6-4.4 3 6.6 2.9-1.3-3-6.5h6.4z" fill="#fff" stroke="#111827" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    </span>
  );
}
// Свободная высота под картинку вопроса: высота .aq-main без отступов и без всех остальных частей (заголовок, варианты,
// плашка). Экран теста не прокручивается (заказчик, 13.11.2026: «нигде не должен быть скрола»): картинка берёт, что осталось.
function aqFree(el) {
  const vis = el && el.closest('.aq-vis'); const main = el && el.closest('.aq-main');
  if (!vis || !main) return null;
  const px = (v) => parseFloat(v) || 0;
  const cs = getComputedStyle(main);
  let free = main.clientHeight - px(cs.paddingTop) - px(cs.paddingBottom);
  const vs = getComputedStyle(vis);
  free -= px(vs.marginTop) + px(vs.marginBottom);
  if (cs.display !== 'grid') {
    for (const ch of main.children) {
      if (ch === vis || ch.tagName === 'STYLE') continue;
      const c = getComputedStyle(ch);
      if (c.display === 'none' || c.position === 'absolute') continue;
      free -= ch.offsetHeight + px(c.marginTop) + px(c.marginBottom);
    }
  }
  return { free: Math.max(0, Math.floor(free)), width: vis.clientWidth, wide: cs.display === 'grid' };
}
// Пересчёт при смене размера окна и когда появляется плашка ответа.
function useAqFit(ref, deps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const main = ref.current && ref.current.closest('.aq-main');
    if (!main) return undefined;
    let raf = 0;
    const bump = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setTick((t) => t + 1)); };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(bump) : null;
    if (ro) { ro.observe(main); Array.prototype.forEach.call(main.children, (c) => ro.observe(c)); }
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(() => { if (ro) Array.prototype.forEach.call(main.children, (c) => ro.observe(c)); bump(); }) : null;
    if (mo) mo.observe(main, { childList: true });
    window.addEventListener('resize', bump);
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (mo) mo.disconnect(); window.removeEventListener('resize', bump); };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return tick;
}
// Сайт в окне. Масштаб — по ширине и по свободной высоте; если по высоте сайт стал бы мельче читаемого, окно показывает
// его часть — от элемента S.focus (селектор внутри страницы: '.blk', '.info', '.goal', '.cards' …), как в уроках на телефоне.
function AqSite({ site }) {
  const S = site;
  const frame = useRef(null);
  const docRef = useRef(null);
  const tick = useAqFit(frame, [site]);
  const [fit, setFit] = useState(null);
  useEffect(() => {
    const f = aqFree(frame.current); const doc = docRef.current;
    if (!f || !doc) return;
    const phone = !!S.mobile;
    const narrow = !f.wide && f.width < 560;
    const vw = phone ? 390 : narrow ? 480 : 800;
    const maxW = phone ? Math.min(f.width, 300) : Math.min(f.width, f.wide ? 640 : 520);
    const chrome = frame.current.offsetHeight - (frame.current.querySelector('.aq-page') || frame.current).offsetHeight;
    const docH = doc.offsetHeight;
    const kW = maxW / vw, kH = (f.free - chrome) / docH;
    const kMin = Math.min(kW, phone ? 0.62 : narrow ? 0.6 : 0.42);   // мельче — текст сайта не прочитать
    const k = Math.max(Math.min(kW, kH), kMin);
    const fullH = Math.round(docH * k);
    const viewH = Math.max(0, Math.min(fullH, f.free - chrome));
    let off = 0;
    if (viewH < fullH && S.focus) {
      const el = doc.querySelector(S.focus);
      if (el) off = Math.min(fullH - viewH, Math.max(0, Math.round((el.offsetTop - 8) * k)));
    }
    const next = { vw, k, viewH, off, hide: viewH < 70 };
    setFit((p) => (p && p.vw === next.vw && Math.abs(p.k - next.k) < 0.002 && p.viewH === next.viewH && p.off === next.off && p.hide === next.hide ? p : next));
  }, [tick, site, fit && fit.vw]); // eslint-disable-line react-hooks/exhaustive-deps
  const vw = fit ? fit.vw : (S.mobile ? 390 : 800);
  const k = fit ? fit.k : 0;
  const vars = { '--c': S.c, '--c2': S.c2, '--bg': S.bg, '--rad': (S.radius != null ? S.radius : 16) + 'px' };
  if (S.font) vars.fontFamily = S.font;
  if (S.heroBg) vars['--hero'] = S.heroBg;
  if (S.btn) { vars['--btn'] = S.btn; vars['--btnfg'] = S.btnFg || '#1F2937'; }
  const M = S.marks || {};
  const cls = 'aq-doc' + (vw < 600 ? ' is-m' : '') + (S.dark ? ' is-dark' : '') + (S.shadow === 'big' ? ' sh-big' : S.shadow === 'none' ? ' sh-none' : '') + (S.heroBg ? ' has-hero' : '') + (S.btn ? ' has-btn' : '');
  const hot = S.cursor === 'hover' && S.ctaHot ? { background: S.ctaHot.bg || undefined, color: S.ctaHot.fg || undefined, transform: 'scale(' + (S.ctaHot.scale || 1) + ')' } : null;
  return (
    <AqBrowser title={S.title} phone={!!S.mobile} innerRef={frame} style={fit ? { width: Math.round(vw * k), visibility: fit.hide ? 'hidden' : 'visible', height: fit.hide ? 0 : undefined } : { visibility: 'hidden' }}>
      <div className="aq-page" style={{ height: fit ? fit.viewH : 1 }}>
        <div className="aq-scale" style={{ transform: fit ? 'translateY(' + -fit.off + 'px)' : undefined }}>
          <div ref={docRef} className={cls} style={Object.assign({ width: vw, transform: 'scale(' + (k || 1) + ')' }, vars)}>
            <div className="nav"><span className="logo">{S.em + ' ' + S.title.split(/\s+/).slice(0, 2).join(' ')}</span>
              {S.mobile ? <span className="burger">☰</span> : <><div className="links">{S.nav.map((x, i) => <span key={i}>{x}</span>)}</div>{S.oneBtn ? <span /> : <span className="navbtn">{S.cta}</span>}</>}</div>
            <div className="hero">
              {S.badge ? <span className="badge">{S.badge}</span> : null}<h1 className="title">{S.title}</h1>{S.sub ? <p className="sub">{S.sub}</p> : null}
              <span className="cta-w"><button type="button" tabIndex={-1} className={'cta' + (S.ctaBig ? ' is-big' : '')} style={hot || undefined}>{S.cta}</button>{S.cursor ? <AqCursor click={S.cursor === 'click'} /> : null}<AqPin m={M.cta} /></span>
              {S.toast ? <div className="toast">{S.toast}</div> : null}
              {S.extras && S.extras.sale ? <span className="sale">{S.extras.sale}</span> : null}
              <AqPin m={M.hero} />
            </div>
            {S.info && S.info.length ? <div className="info">{S.info.map((x, i) => <span key={i} className={x.guess ? 'is-guess' : ''}>{x.t}{x.guess ? <i className="tx">{x.guess}</i> : null}</span>)}<AqPin m={M.info} /></div> : null}
            {S.cards && S.cards.length ? <div className="cards">{S.cards.map((c, i) => <div key={i} className="card"><div className="ic">{c.ic}</div><h3 className="ch">{c.h}</h3><p className="cp">{c.p}</p></div>)}</div> : null}
            {(S.blocks || []).map((b, i) => (
              <div key={i} className="blk"><h2 className="bh">{b.h}</h2>
                <div className="row3">{b.items.map((x, j) => <div key={j} className={'it' + (x.wide ? ' wide' : '')}>{x.ic ? <div className="ic">{x.ic}</div> : null}{x.t}{x.p ? <p className="pr">{x.p}{x.guess ? <i className="tx">{x.guess}</i> : null}</p> : x.guess ? <i className="tx">{x.guess}</i> : null}</div>)}</div>
                <AqPin m={b.mark} /></div>
            ))}
            {S.goal ? <div className="goal"><h2 className="gh">{S.goal.h}</h2>{S.goal.fields.map((x, i) => <div key={i} className="inp">{x}</div>)}<button type="button" tabIndex={-1} className="btn2">{S.goal.btn}</button></div> : null}
            {S.bottomBtn ? <div className="bottom"><span>{S.bottomBtn}</span></div> : null}
            {S.noFoot ? null : <div className="foot">{'© 2026 ' + S.title + '. ' + S.foot}</div>}
            {S.extras && S.extras.popup ? <div className="popup"><b>{S.extras.popup}</b><span className="inp">✉ email</span><AqPin m={M.extras} /></div> : null}
            {S.extras && S.extras.chat ? <span className="chat">💬</span> : null}
          </div>
        </div>
      </div>
    </AqBrowser>
  );
}
// Сообщение клиента — облачко.
function AqMsg({ who, text }) {
  return <div className="aq-msg"><b>{who}</b><span>{text}</span></div>;
}

// ── ВОПРОС ──
function AqTest({ Q, lang, mode = 'answer', initialAnswer = null, onReady, registerCheck, onSubmit }) {
  const L = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'uz';
  const T = Q[L] || Q.ru;
  const U = AQ_UI[L];
  const answering = mode === 'answer', review = mode === 'review';
  const fromAnswer = (a) => {
    const s = typeof a === 'string' ? a : a && typeof a.studentAnswer === 'string' ? a.studentAnswer : null;
    if (s === null) return null;
    for (const l of ['uz', 'ru', 'en']) { const i = Q[l] ? Q[l].opts.indexOf(s) : -1; if (i >= 0) return i; }
    return null;
  };
  const [sel, setSel] = useState(() => (review ? fromAnswer(initialAnswer) : null));
  const [checked, setChecked] = useState(false);
  const sent = useRef(false);
  const fbRef = useRef(null);
  const ok = checked && sel === Q.correct;
  const check = () => {
    if (!answering || sel === null || sent.current) return;
    sent.current = true; setChecked(true);
    if (onSubmit) onSubmit({ correct: sel === Q.correct, questionText: T.q, studentAnswer: T.opts[sel], correctAnswer: T.opts[Q.correct], options: T.opts.slice(), meta: { target: Q.target, ptype: 'AI', level: 1, tag: Q.tag } });
  };
  useEffect(() => { if (onReady) onReady(answering && sel !== null && !checked); return () => { if (onReady) onReady(false); }; }, [sel, checked, answering, onReady]);
  useEffect(() => { if (!registerCheck) return undefined; registerCheck(check); return () => registerCheck(null); }); // eslint-disable-line react-hooks/exhaustive-deps
  // Экран не прокручивается: если вопрос с картинкой-промптом всё же не влез (очень низкий телефон), картинка прячется,
  // а вопрос, варианты и плашка остаются целиком. Окно сайта подгоняет себя само (AqSite).
  const mainRef = useRef(null);
  const [tight, setTight] = useState(false);
  const fitTick = useAqFit(mainRef, []);
  useEffect(() => {
    const m = mainRef.current;
    if (!m) return;
    if (m.querySelector('.aq-br')) { if (tight) setTight(false); return; }
    if (!tight && m.scrollHeight > m.clientHeight + 1) setTight(true);
  }, [fitTick, checked, tight]);
  const fb = checked ? (
    <div ref={fbRef} className={'aq-fb ' + (ok ? 'is-ok' : 'is-bad')} aria-live="polite">
      <div className="aq-fb-in">
        <span className="aq-fb-ic">{ok ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>}</span>
        <div className="aq-fb-tx"><b>{ok ? U.ok : U.hint}</b><p>{ok ? T.ok : T.hint}</p></div>
      </div>
    </div>
  ) : null;
  return (
    <section className={'aq' + (tight ? ' is-tight' : '')} lang={L}>
      <style>{AQ_CSS}</style>
      <div className="aq-main" ref={mainRef}>
        <span className="aq-chip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v13M3 18.5V5.5a1 1 0 0 1 1-1h5a3 3 0 0 1 3 3 3 3 0 0 1 3-3h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5a3 3 0 0 0-3 1.5 3 3 0 0 0-3-1.5H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{U.chip}</span>
        <div className="aq-head">
          <h1 className="aq-q">{T.q}</h1>
          {T.ctx ? <p className="aq-ctx">{T.ctx}</p> : null}
        </div>
        {Q.vis ? <div className="aq-vis" role="img" aria-label={T.alt || U.art}>{Q.vis(L, T)}</div> : null}
        <div className="aq-opts" role="group" aria-label={T.q}>
          {T.opts.map((o, i) => {
            const on = sel === i;
            const st = checked && on ? (i === Q.correct ? ' is-ok' : ' is-bad') : on ? ' is-sel' : '';
            return (
              <button key={i} type="button" data-v={i} className={'aq-opt' + st} aria-pressed={on ? 'true' : 'false'} disabled={!answering || checked} onClick={() => setSel(i)}>
                <span className="aq-badge" aria-hidden="true">{AQ_LETTERS[i]}</span><span className="aq-txt">{o}</span>
              </button>
            );
          })}
        </div>
        {fb}
        {review ? <p className="aq-muted">{U.review}</p> : null}
      </div>
    </section>
  );
}

const AQ_CSS = `
.aq { box-sizing: border-box; display: flex; flex-direction: column; height: var(--aq-h, 100dvh); overflow: hidden; width: 100%; color: #1E1B39; font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, Arial, sans-serif; -webkit-text-size-adjust: 100%;
  background-color: #F4F5F7; background-image: radial-gradient(circle, #D5DAE1 1px, transparent 1.4px); background-size: 20px 20px; background-position: -10px -10px; }
.aq * { box-sizing: border-box; }
/* Экран теста — ровно в высоту окна, без прокрутки (заказчик, 13.11.2026). Картинка берёт оставшееся место. */
.aq-main { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; width: 100%; max-width: 760px; margin: 0 auto; padding: 16px 16px 12px; }
.aq-main > * { flex: none; }
.aq.is-tight .aq-vis { display: none; }
.aq-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 14px; border-radius: 999px; background: #E1F5FF; color: #009BE7; font-size: 12px; font-weight: 600; white-space: nowrap; }
.aq-chip svg { width: 16px; height: 16px; flex: none; }
.aq-head { display: flex; flex-direction: column; margin-top: 16px; }
.aq-q { margin: 0; font-size: 22px; font-weight: 700; line-height: 1.3; color: #000; overflow-wrap: break-word; }
.aq-ctx { margin: 8px 0 0; font-size: 14px; font-weight: 500; line-height: 1.4; color: #6E6A85; overflow-wrap: break-word; }
/* Карточка промпта и сообщение — во всю ширину вариантов, по левому краю (заказчик, 14.11.2026). */
.aq-main > .aq-vis { flex: 0 1 auto; min-height: 0; overflow: hidden; display: flex; justify-content: center; align-items: flex-start; margin-top: 14px; }
.aq-opts { display: flex; flex-wrap: wrap; margin-top: 18px; }
.aq-opt { display: flex; align-items: center; width: 100%; min-height: 56px; margin: 5px 0; padding: 8px 16px; background: #fff; border: solid #E9E7EF; border-width: 2px 2px 4px; border-radius: 14px;
  font: inherit; font-size: 16px; font-weight: 500; line-height: 1.3; color: #1E1B39; text-align: left; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.aq-opt:disabled { cursor: default; }
.aq-opt:not(:disabled):hover { border-color: #D5D2DE; }
.aq-badge { flex: 0 0 34px; width: 34px; height: 34px; margin-right: 14px; border-radius: 10px; background: #F4F4F7; color: #77738F; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; }
.aq-txt { min-width: 0; flex: 1 1 auto; overflow-wrap: break-word; }
.aq-opt.is-sel { background: #FFF2ED; border-color: #FA4F28; }
.aq-opt.is-sel .aq-badge { background: #FA4F28; color: #fff; }
.aq-opt.is-ok { background: #ECFAF5; border-color: #09B163; }
.aq-opt.is-ok .aq-badge { background: #09B163; color: #fff; }
.aq-opt.is-bad { background: #FFF1F1; border-color: #D93A3A; }
.aq-opt.is-bad .aq-badge { background: #D93A3A; color: #fff; }
.aq-muted { margin: 14px 0 0; font-size: 14px; color: #6E6A85; }
/* Отклик: «Barakalla!» / «Maslahat» — плашка под вариантами, как в тестах CRM (заказчик, 13.11.2026). */
.aq-fb { margin-top: 18px; border: 2px solid; border-radius: 20px; }
.aq-fb.is-ok { background: linear-gradient(180deg, #E9FAF1, #F5FCF8); border-color: #3DBE7A; }
.aq-fb.is-bad { background: linear-gradient(180deg, #FDE8E8, #FFF5F5); border-color: #E05252; }
.aq-fb-in { display: flex; align-items: center; gap: 14px; max-width: 760px; margin: 0 auto; padding: 14px 16px; }
.aq-fb-ic { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.aq-fb-ic svg { width: 20px; height: 20px; }
.aq-fb.is-ok .aq-fb-ic { background: #22A060; }
.aq-fb.is-bad .aq-fb-ic { background: #D32F2F; }
.aq-fb-tx { flex: 1 1 auto; min-width: 0; }
.aq-fb-tx b { display: block; font-size: 18px; font-weight: 700; line-height: 1.2; }
.aq-fb.is-ok .aq-fb-tx b { color: #1F9D57; }
.aq-fb.is-bad .aq-fb-tx b { color: #C62828; }
.aq-fb-tx p { margin: 4px 0 0; font-size: 14.5px; font-weight: 500; line-height: 1.45; color: #1E1B39; }
/* Картинки: поле промпта, сайт, сообщение клиента. */
.aq-prompt { display: flex; flex-direction: column; gap: 8px; width: 100%; box-sizing: border-box; padding: 14px 16px; border-radius: 18px; background: #fff; box-shadow: 0 0 0 1px #E2E8F0, 0 6px 18px rgba(15, 23, 42, .06); }
.aq-pl { display: flex; align-items: center; gap: 8px; min-width: 0; }
.aq-pq { flex: none; padding: 2px 10px; border-radius: 999px; color: #fff; font-size: 12px; font-weight: 700; white-space: nowrap; }
.aq-pv { min-width: 0; padding: 2px 8px; border-radius: 6px; font-size: 15px; font-weight: 600; overflow-wrap: anywhere; }
.aq-pe { display: inline-block; min-width: 72px; padding: 0 10px; border: 1.5px dashed #CBD5E1; border-radius: 6px; color: #94A3B8; text-align: center; font-weight: 700; }
/* Окно браузера — как в уроках (Chrome). */
.aq-br { width: min(100%, 480px); border-radius: 10px; overflow: hidden; background: #DEE1E6; box-shadow: inset 0 0 0 1px #C7CBD1, 0 10px 26px rgba(15, 23, 42, .10); }
.aq-br-bar { display: flex; align-items: flex-end; gap: 6px; height: 31px; padding: 0 0 0 10px; }
.aq-br-tab { display: flex; align-items: center; gap: 7px; max-width: 62%; height: 25px; padding: 0 10px; border-radius: 8px 8px 0 0; background: #fff; color: #202124; font-size: 12px; font-weight: 500; }
.aq-br-fav { flex: none; width: 11px; height: 11px; border-radius: 3px; background: #E44D26; }
.aq-br-tt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.aq-br-x { flex: none; position: relative; width: 9px; height: 9px; opacity: .6; }
.aq-br-x::before, .aq-br-x::after { content: ''; position: absolute; left: 4px; top: -1px; width: 1.5px; height: 11px; background: #202124; rotate: 45deg; }
.aq-br-x::after { rotate: -45deg; }
.aq-br-plus { position: relative; flex: none; align-self: center; width: 12px; height: 12px; margin-top: 4px; }
.aq-br-plus::before, .aq-br-plus::after { content: ''; position: absolute; left: 5px; top: 0; width: 2px; height: 12px; background: #5F6368; }
.aq-br-plus::after { rotate: 90deg; }
.aq-br-win { margin-left: auto; align-self: center; display: flex; align-items: center; gap: 14px; padding-right: 12px; margin-top: 2px; }
.aq-w-min { width: 10px; height: 1.5px; background: #202124; opacity: .8; }
.aq-w-max { width: 9px; height: 9px; border: 1px solid #202124; border-radius: 1px; opacity: .8; }
.aq-br-tool { display: flex; align-items: center; gap: 10px; height: 30px; padding: 0 10px; background: #fff; box-shadow: inset 0 -1px 0 #DADCE0; }
.aq-br-ar { flex: none; color: #5F6368; font-size: 15px; letter-spacing: 6px; line-height: 1; }
.aq-br-url { flex: 1; display: flex; align-items: center; gap: 7px; height: 21px; padding: 0 12px; border-radius: 999px; background: #F1F3F4; color: #202124; font-size: 12px; }
.aq-br-lock { flex: none; width: 9px; height: 9px; border-radius: 50%; box-shadow: inset 0 0 0 1.6px #5F6368; }
.aq-br-body { background: #fff; }
.aq-page { overflow: hidden; background: #F8FAFC; } /* сайт виден целиком — без прокрутки внутри окна */
.aq-scale { position: relative; overflow: hidden; }
/* Сайт — те же правила, что у сайта ИИ в уроках (aiSite). */
.aq-doc { transform-origin: 0 0; background-color: #F8FAFC; font-family: Inter, system-ui, sans-serif; color: #0F172A; text-align: left; }
.aq-doc .nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 32px; background-color: white; box-shadow: 0 1px 0 #E2E8F0; }
.aq-doc .logo { font-weight: 800; font-size: 18px; color: var(--c2); }
.aq-doc .links { display: flex; gap: 22px; font-size: 14px; color: #475569; }
.aq-doc .navbtn { background-color: var(--c); color: white; padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; }
.aq-doc .hero { padding: 34px 28px; background-image: linear-gradient(135deg, var(--c), var(--c2)); color: white; text-align: center; }
.aq-doc .badge { display: inline-block; padding: 5px 14px; border-radius: 999px; background-color: rgba(255, 255, 255, 0.2); font-size: 13px; font-weight: 600; }
.aq-doc .title { margin: 10px 0 8px; font-size: 38px; font-weight: 800; line-height: 1.1; }
.aq-doc .sub { margin: 0 0 16px; font-size: 17px; opacity: 0.92; }
.aq-doc .cta { background-color: white; color: var(--c2); padding: 12px 24px; border: none; border-radius: 12px; font: inherit; font-size: 17px; font-weight: 800; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); }
.aq-doc .cards { display: flex; gap: 14px; padding: 18px 28px 6px; }
.aq-doc .card { flex: 1; background-color: white; border-radius: 16px; padding: 14px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
.aq-doc .ic { font-size: 28px; }
.aq-doc .ch { margin: 8px 0 4px; font-size: 18px; font-weight: 700; }
.aq-doc .cp { margin: 0; font-size: 14px; color: #64748B; }
.aq-doc .goal { margin: 14px 28px 6px; padding: 16px 18px; border-radius: 18px; background-color: var(--bg); }
.aq-doc .gh { margin: 0 0 12px; font-size: 22px; font-weight: 800; color: var(--c2); }
.aq-doc .inp { background-color: white; border: 1px solid #CBD5E1; border-radius: 10px; padding: 11px 14px; color: #94A3B8; margin: 0 0 10px; font-size: 15px; }
.aq-doc .btn2 { background-color: var(--c); color: white; padding: 12px 22px; border: none; border-radius: 10px; font: inherit; font-size: 15px; font-weight: 700; }
.aq-doc .foot { padding: 14px 28px; color: #64748B; font-size: 13px; text-align: center; }
.aq-br.is-phone { width: min(100%, 300px); }
.aq-doc { position: relative; }
.aq-doc .cards .card, .aq-doc .it, .aq-doc .goal { border-radius: var(--rad); }
.aq-doc.sh-big .card, .aq-doc.sh-big .it { box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22); }
.aq-doc.sh-none .card, .aq-doc.sh-none .it { box-shadow: none; border: 2px solid #CBD5E1; }
.aq-doc.has-hero .hero { background-image: var(--hero); }
.aq-doc.has-btn .navbtn, .aq-doc.has-btn .btn2, .aq-doc.has-btn .cta { background-color: var(--btn); color: var(--btnfg); }
.aq-doc.is-dark { background-color: #0B1020; color: #E2E8F0; }
.aq-doc.is-dark .nav { background-color: #0F172A; box-shadow: 0 1px 0 #1E293B; }
.aq-doc.is-dark .links { color: #94A3B8; }
.aq-doc.is-dark .card, .aq-doc.is-dark .it { background-color: #111827; color: #E2E8F0; }
.aq-doc.is-dark .foot { color: #64748B; }
.aq-doc .burger { font-size: 26px; color: var(--c2); }
.aq-doc.is-dark .burger { color: #E2E8F0; }
.aq-doc .cta-w { position: relative; display: inline-block; }
.aq-doc .cta.is-big { padding: 30px 64px; font-size: 30px; }
.aq-doc .cur { position: absolute; right: -34px; bottom: -34px; width: 40px; height: 40px; }
.aq-doc .cur svg { width: 40px; height: 40px; filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .35)); }
.aq-doc .cur .ring { position: absolute; left: -14px; top: -14px; width: 36px; height: 36px; border-radius: 50%; border: 4px solid #FBBF24; }
.aq-doc .hero { position: relative; }
.aq-doc .sale { position: absolute; left: 24px; top: 20px; padding: 8px 16px; border-radius: 12px; background-color: #DC2626; color: white; font-size: 22px; font-weight: 800; rotate: -6deg; }
.aq-doc .info { position: relative; display: flex; flex-wrap: wrap; gap: 10px 22px; justify-content: center; padding: 14px 24px; background-color: white; box-shadow: 0 1px 0 #E2E8F0; font-size: 16px; font-weight: 600; color: #0F172A; }
.aq-doc .info .is-guess { color: #64748B; }
.aq-doc .blk { position: relative; margin: 14px 28px 4px; }
.aq-doc .bh { margin: 0 0 8px; font-size: 20px; font-weight: 800; color: var(--c2); }
.aq-doc.is-dark .bh { color: var(--c); }
.aq-doc .row3 { display: flex; flex-wrap: wrap; gap: 12px; }
.aq-doc .it { flex: 1; background-color: white; padding: 10px 14px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07); font-size: 15px; font-weight: 600; }
.aq-doc .it .ic { font-size: 26px; margin-bottom: 2px; }
.aq-doc .wide { flex-basis: 100%; }
.aq-doc .pr { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: var(--c2); }
.aq-doc .tx { display: inline-block; margin-left: 8px; padding: 2px 9px; border-radius: 999px; background-color: #475569; color: white; font-size: 13px; font-weight: 700; font-style: normal; vertical-align: middle; }
.aq-doc .pin { position: absolute; right: 10px; top: 10px; z-index: 3; padding: 4px 12px; border-radius: 999px; color: white; font-size: 16px; font-weight: 800; font-style: normal; white-space: nowrap; box-shadow: 0 3px 8px rgba(0, 0, 0, .2); }
.aq-doc .cta-w .pin { right: auto; left: calc(100% + 14px); top: 50%; translate: 0 -50%; }
.aq-doc .info .pin { top: 50%; translate: 0 -50%; }
.aq-doc .popup { position: absolute; left: 20px; bottom: 20px; z-index: 2; display: flex; flex-direction: column; gap: 8px; width: 250px; padding: 16px; border-radius: 16px; background-color: white; box-shadow: 0 16px 40px rgba(15, 23, 42, .3); font-size: 15px; }
.aq-doc .popup .pin { top: -16px; }
.aq-doc .popup .inp { margin: 0; }
.aq-doc .chat { position: absolute; right: 20px; bottom: 20px; z-index: 2; width: 62px; height: 62px; border-radius: 50%; background-color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 10px 24px rgba(0, 0, 0, .25); }
.aq-doc .toast { display: block; width: fit-content; margin: 16px auto 0; padding: 12px 22px; border-radius: 14px; background-color: #0F172A; color: white; font-size: 17px; font-weight: 700; white-space: nowrap; box-shadow: 0 12px 28px rgba(0, 0, 0, .3); }
.aq-doc .bottom { padding: 14px 18px; background-color: rgba(255, 255, 255, .95); box-shadow: 0 -1px 0 #E2E8F0; }
.aq-doc .bottom span { display: block; padding: 14px; border-radius: 12px; background-color: var(--c); color: white; text-align: center; font-size: 17px; font-weight: 800; }
.aq-doc.is-m .blk { margin: 12px 20px 4px; } .aq-doc.is-m .it { flex: 1 1 28%; padding: 12px 14px; }
.aq-doc.is-m .links { display: none; } .aq-doc.is-m .nav { padding: 12px 18px; } .aq-doc.is-m .hero { padding: 28px 20px; } .aq-doc.is-m .title { font-size: 32px; }
.aq-doc.is-m .cards { gap: 10px; padding: 14px 20px 4px; } .aq-doc.is-m .card { padding: 12px; } .aq-doc.is-m .ch { font-size: 16px; } .aq-doc.is-m .cp { font-size: 13px; } .aq-doc.is-m .goal { margin: 12px 20px 6px; } .aq-doc.is-m .btn2 { white-space: nowrap; }
.aq-msg { display: flex; flex-direction: column; gap: 4px; width: 100%; box-sizing: border-box; padding: 12px 16px; border-radius: 18px 18px 18px 4px; background: #fff; box-shadow: 0 0 0 1px #E2E8F0, 0 6px 18px rgba(15, 23, 42, .06); }
.aq-msg b { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7C3AED; }
.aq-msg span { font-size: 15px; font-weight: 600; line-height: 1.4; color: #1E1B39; }
/* Ноутбук: варианты по два в ряд, вопрос крупнее, строка контекста — над вопросом (как в макете). */
@media (min-width: 720px) {
  .aq-main { padding: 28px 24px 20px; }
  .aq-chip { height: 34px; padding: 0 16px; font-size: 13px; }
  .aq-head { flex-direction: column-reverse; margin-top: 18px; }
  .aq-ctx { margin: 0 0 6px; font-size: 16px; }
  .aq-q { font-size: 28px; line-height: 1.3; letter-spacing: -.3px; color: #1E1B39; }
  .aq-main > .aq-vis { margin-top: 20px; }
  .aq-opts { margin: 18px -6px -6px; }
  .aq-opt { width: calc(50% - 12px); margin: 6px; min-height: 64px; font-size: 18px; border-radius: 16px; }
  .aq-fb-in { padding: 18px 24px; }
}
/* Телефон: плотнее, окно сайта — без адресной строки и кнопок окна (как в уроках модуля на телефоне). */
@media (max-width: 719px) {
  .aq-br-tool, .aq-br-win, .aq-br-plus { display: none; }
  .aq-chip { height: 28px; padding: 0 12px; font-size: 11.5px; }
  .aq-head { margin-top: 10px; }
  .aq-q { font-size: 19px; line-height: 1.28; }
  .aq-ctx { margin-top: 4px; font-size: 13.5px; line-height: 1.35; }
  .aq-main > .aq-vis { margin-top: 10px; }
  .aq-opts { margin-top: 10px; }
  .aq-opt { min-height: 46px; margin: 3px 0; padding: 6px 12px; font-size: 15px; border-radius: 12px; }
  .aq-badge { flex-basis: 28px; width: 28px; height: 28px; margin-right: 10px; font-size: 13px; border-radius: 8px; }
  .aq-fb { margin-top: 10px; border-radius: 16px; }
  .aq-fb-in { padding: 10px 12px; gap: 10px; }
  .aq-fb-ic { flex-basis: 30px; width: 30px; height: 30px; }
  .aq-fb-tx b { font-size: 16px; }
  .aq-fb-tx p { margin-top: 2px; font-size: 13.5px; line-height: 1.35; }
  .aq-prompt { padding: 10px 12px; gap: 6px; }
  .aq-msg { padding: 10px 14px; }
  .aq-msg span { font-size: 14px; }
}
@media (max-width: 719px) and (max-height: 680px) {
  .aq-main { padding-top: 12px; }
  .aq-q { font-size: 17.5px; }
  .aq-ctx { font-size: 13px; }
  .aq-opt { min-height: 42px; margin: 2px 0; padding: 5px 10px; font-size: 14px; }
  .aq-badge { flex-basis: 26px; width: 26px; height: 26px; margin-right: 9px; font-size: 12.5px; }
}
`;

// =============================================================================
// ТЕСТЫ К УРОКУ 2 МОДУЛЯ «ИИ» «Для кого создаём?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «Kim uchun?» — возраст и кто они, а не «hamma uchun»; по сайту понять, для кого он; интересы аудитории;
// две аудитории (кто выбирает и кто решает); какая фраза идёт в «Kim uchun?», а не в «Nima?» / «Nega?».
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'dlya-kogo';
const QS = [
  { id: 'ai-02t1', target: 'ai-02', tag: 'kim-uchun', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site') }, { q: 1, t: T('bolalar yozilsin', 'чтобы дети записывались', 'get kids to sign up') }, { q: 2, t: null }]} />; },
    uz: { ctx: "Sun'iy intellektga sayt kimlar uchun ekanini aytamiz.", q: "«Kim uchun?» qatoriga qaysi biri aniqroq?", opts: ['hamma uchun', '8–10 yoshli bolalar', 'yaxshi odamlar', "ko'p odam"],
      ok: "Yoshi ham, kimligi ham aytilgan. Sun'iy intellekt saytni aynan shu bolalarga moslaydi.", hint: "Qaysi javobda yosh va kimligi bor? «Hamma uchun» degani hech kim uchun degani.", alt: "«Kim uchun?» qatori bo'sh prompt" },
    ru: { ctx: 'Говорим ИИ, для кого сайт.', q: 'Что точнее подходит в строку «Для кого?»?', opts: ['для всех', 'дети 8–10 лет', 'хорошие люди', 'много людей'],
      ok: 'Названы и возраст, и кто они. ИИ подстроит сайт именно под этих детей.', hint: 'В каком ответе есть возраст и кто они? «Для всех» — значит ни для кого.', alt: 'Промпт с пустой строкой «Для кого?»' },
    en: { ctx: 'We tell the AI who the site is for.', q: 'Which fits the “For whom?” line best?', opts: ['for everyone', 'kids aged 8–10', 'nice people', 'lots of people'],
      ok: 'It names both the age and who they are. The AI will fit the site to exactly these kids.', hint: 'Which answer has an age and says who they are? “For everyone” means for no one.', alt: 'A prompt with an empty “For whom?” line' } },

  { id: 'ai-02t2', target: 'ai-02', tag: 'sayt-kimga', correct: 2,
    // Сайт, как его делает ИИ урока 2 для «7–8 yoshli bolalar»: яркий, крупный, Comic Sans, интересы — первыми карточками.
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Robotlar shousi', 'Шоу роботов', 'Robot show'), em: '🤖', c: '#F97316', c2: '#7C2D12', bg: '#FFEDD5',
      font: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive', radius: 26,
      heroBg: 'linear-gradient(135deg, #F97316, #EC4899 55%, #FACC15)',
      nav: [T("O'yinlar", 'Игры', 'Games'), T("Sovg'alar", 'Подарки', 'Gifts'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('7–8 yosh uchun', 'Для детей 7–8 лет', 'For kids aged 7–8'),
      sub: T("Robotlar bilan o'ynaymiz va sovg'a yutamiz!", 'Играем с роботами и выигрываем подарки!', 'Play with robots and win gifts!'),
      cta: T('Kelaman!', 'Я приду!', 'I’m coming!'),
      cards: [{ ic: '🎮', h: T("O'yinlar", 'Игры', 'Games'), p: T("Robotlar bilan o'yinlar", 'Игры с роботами', 'Games with robots') },
        { ic: '🎁', h: T("Sovg'alar", 'Подарки', 'Gifts'), p: T("Har bir bolaga sovg'a", 'Подарок каждому', 'A gift for every kid') },
        { ic: '🦸', h: T('Komikslar', 'Комиксы', 'Comics'), p: T('Robot qahramonlar', 'Роботы-герои', 'Robot heroes') }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: 'Bu sayt kim uchun yaratilgan?', opts: ['Keksalar uchun', 'Ota-onalar uchun', 'Kichik bolalar uchun', "O'qituvchilar uchun"],
      ok: "Plashkada «7–8 yosh uchun», kartochkalarda o'yinlar va sovg'alar. Sayt yorqin va katta: u kichik bolalarga moslangan.", hint: "Banner ustidagi plashkani va kartochkalarni o'qing. Ular kimga qiziq?", alt: "Yorqin sayt: «7–8 yosh uchun», o'yinlar va sovg'alar" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Для кого сделан этот сайт?', opts: ['Для пожилых', 'Для родителей', 'Для маленьких детей', 'Для учителей'],
      ok: 'На плашке «Для детей 7–8 лет», в карточках игры и подарки. Сайт яркий и крупный — он подстроен под маленьких детей.', hint: 'Прочитай плашку над заголовком и карточки. Кому они интересны?', alt: 'Яркий сайт: «Для детей 7–8 лет», игры и подарки' },
    en: { ctx: 'The AI made this site.', q: 'Who was this site made for?', opts: ['Elderly people', 'Parents', 'Little kids', 'Teachers'],
      ok: 'The badge says “For kids aged 7–8”, and the cards are games and gifts. The site is bright and big: it is made for little kids.', hint: 'Read the badge above the title and the cards. Who would find them interesting?', alt: 'A bright site: “For kids aged 7–8”, games and gifts' } },

  { id: 'ai-02t3', target: 'ai-02', tag: 'qiziqish', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T("Hayvonot bog'i bayrami sayti", 'Сайт праздника в зоопарке', 'A zoo festival site') }, { q: 1, t: T('oilalar kelsin', 'чтобы семьи пришли', 'get families to come') }, { q: 2, t: null }]} />; },
    uz: { ctx: "Bolalar hayvonlar va o'yinlarni yaxshi ko'radi. Sayt shuni ko'rsatsin.", q: "«Kim uchun?» qatorini qanday yozamiz?", opts: ["hamma uchun, qiziqarli bo'lsin", "bolalar uchun, hammasi chiroyli va qiziqarli bo'lsin", "hayvonot bog'i bayrami sayti, oilalar uchun", "6–8 yoshli bolalar, ular hayvonlar va o'yinlarni yaxshi ko'radi"],
      ok: "Yoshi ham, qiziqishi ham aytilgan. Sun'iy intellekt «Hayvonlar» va «O'yinlar» kartochkalarini birinchi qo'yadi.", hint: "Bu qatorda ikki narsa bo'lsin: kimlar va ular nimani yaxshi ko'radi.", alt: "«Kim uchun?» qatori bo'sh prompt" },
    ru: { ctx: 'Дети любят животных и игры. Пусть сайт это покажет.', q: 'Как написать строку «Для кого?»?', opts: ['для всех, чтобы было интересно', 'для детей, чтобы всё было красиво и интересно', 'сайт праздника в зоопарке, для семей', 'дети 6–8 лет, они любят животных и игры'],
      ok: 'Названы и возраст, и интересы. ИИ поставит карточки «Животные» и «Игры» первыми.', hint: 'В этой строке должны быть две вещи: кто они и что они любят.', alt: 'Промпт с пустой строкой «Для кого?»' },
    en: { ctx: 'Kids love animals and games. Let the site show it.', q: 'How should we write the “For whom?” line?', opts: ['for everyone, make it fun', 'for kids, make everything pretty and fun', 'a zoo festival site, for families', 'kids aged 6–8, they love animals and games'],
      ok: 'It names both the age and the interests. The AI will put the “Animals” and “Games” cards first.', hint: 'This line needs two things: who they are and what they love.', alt: 'A prompt with an empty “For whom?” line' } },

  { id: 'ai-02t4', target: 'ai-02', tag: 'ikki-auditoriya', correct: 0,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T("«Suzish kursimizga bolalar yozilsin. Lekin pulni ota-onalar to'laydi va xavfsizlik haqida so'raydi.»", '«Хотим, чтобы на курс плавания записывались дети. Но платят родители, и они спрашивают про безопасность».', '“We want kids to sign up for our swimming course. But parents pay, and they ask about safety.”')} />; },
    uz: { ctx: "Mijozning xabarini o'qing.", q: "«Kim uchun?» qatoriga nima yozamiz?", opts: ['bolalar va ularning ota-onalari', 'bolalar', 'ota-onalar', 'hamma uchun'],
      ok: "Bolalar tanlaydi, ota-onalar hal qiladi: ikkalasi ham yoziladi. Shunda saytda ota-onalar uchun bo'lim ham chiqadi.", hint: "Xabarda ikki xil odam bor: kim yoziladi va kim to'laydi. Ikkalasini ham yozing.", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Что написать в строку «Для кого?»?', opts: ['дети и их родители', 'дети', 'родители', 'для всех'],
      ok: 'Дети выбирают, родители решают — пишем обоих. Тогда на сайте появится и раздел для родителей.', hint: 'В сообщении два разных человека: кто записывается и кто платит. Напиши обоих.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'What goes in the “For whom?” line?', opts: ['kids and their parents', 'kids', 'parents', 'for everyone'],
      ok: 'Kids choose, parents decide: write both. Then the site also gets a section for parents.', hint: 'The message has two kinds of people: who signs up and who pays. Write both.', alt: 'The client’s message' } },

  { id: 'ai-02t5', target: 'ai-02', tag: 'qator', correct: 2,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: null }, { q: 1, t: null }, { q: 2, t: null }]} />,
    uz: { ctx: "Robot to'garagi uchun prompt yozyapmiz.", q: "«12–14 yoshli o'quvchilar, robotlarni yaxshi ko'radi» qaysi qatorga yoziladi?", opts: ['«Nima?»', '«Nega?»', '«Kim uchun?»', 'Hech qaysi qatorga'],
      ok: "Bu gap kimlar uchun ekanini va ular nimani yaxshi ko'rishini aytadi. Bu «Kim uchun?» qatori.", hint: "«Nima?» — qanday sayt, «Nega?» — odamlar nima qilsin. Bu gap esa odamlarning o'zi haqida.", alt: "Uch qatorli bo'sh prompt" },
    ru: { ctx: 'Пишем промпт для кружка роботов.', q: 'В какую строку пишем «ученики 12–14 лет, любят роботов»?', opts: ['«Что?»', '«Зачем?»', '«Для кого?»', 'Ни в какую'],
      ok: 'Эта фраза говорит, для кого сайт и что эти люди любят. Это строка «Для кого?».', hint: '«Что?» — какой сайт, «Зачем?» — что должны сделать люди. А эта фраза про самих людей.', alt: 'Пустой промпт из трёх строк' },
    en: { ctx: 'We are writing a prompt for a robot club.', q: 'Which line does “students aged 12–14 who love robots” go in?', opts: ['“What?”', '“Why?”', '“For whom?”', 'None of them'],
      ok: 'This phrase says who the site is for and what they love. That is the “For whom?” line.', hint: '“What?” is what site, “Why?” is what people should do. This phrase is about the people themselves.', alt: 'An empty three-line prompt' } }
];

export default function AiTest02q3(props) { return <AqTest Q={QS[2]} {...props} />; }
