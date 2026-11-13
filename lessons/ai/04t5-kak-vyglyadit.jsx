// Тест 5/5 к уроку 4 модуля «ИИ» — один вопрос в формате CRM «JSX savol / test» (13.11.2026).
// Собрано: node tools/aitest/build.mjs 04 — вручную не править; исходник — tools/aitest/l04.jsx, набор — tools/aitest/kit.jsx.
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
.aq-prompt { display: flex; flex-direction: column; gap: 8px; width: min(100%, 480px); padding: 14px 16px; border-radius: 18px; background: #fff; box-shadow: 0 0 0 1px #E2E8F0, 0 6px 18px rgba(15, 23, 42, .06); }
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
.aq-msg { display: flex; flex-direction: column; gap: 4px; width: min(100%, 480px); padding: 12px 16px; border-radius: 18px 18px 18px 4px; background: #fff; box-shadow: 0 0 0 1px #E2E8F0, 0 6px 18px rgba(15, 23, 42, .06); }
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
// ТЕСТЫ К УРОКУ 4 МОДУЛЯ «ИИ» «Как должен выглядеть сайт?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «chiroyli» — догадка ИИ («Taxmin»); стиль под сайт и его аудиторию; первый цвет — главный;
// стиль по просьбе клиента; форма карточек и тени по сайту.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'kak-vyglyadit';
const QS = [
  { id: 'ai-04t1', target: 'ai-04', tag: 'chiroyli', correct: 0,
    // Как в крючке урока 4: «chiroyli bo'lsin» для киберспорта — нежно-розовый сайт, догадка ИИ.
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Kibersport turniri', 'Киберспортивный турнир', 'Esports tournament'), em: '🎮', c: '#EC4899', c2: '#9D174D', bg: '#FCE7F3', radius: 24,
      font: 'Georgia, "Times New Roman", serif', heroBg: 'linear-gradient(135deg, #FBCFE8, #F472B6)',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T('Jamoalar', 'Команды', 'Teams'), T('Sovrinlar', 'Призы', 'Prizes')],
      badge: T('Bahor turniri · 2026', 'Весенний турнир · 2026', 'Spring tournament · 2026'), sub: T('Eng kuchli jamoalar!', 'Сильнейшие команды!', 'The strongest teams!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      cards: [{ ic: '🌸', h: T('Jadval', 'Расписание', 'Schedule'), p: T("O'yinlar kuni", 'Дни игр', 'Game days') }, { ic: '🌷', h: T('Jamoalar', 'Команды', 'Teams'), p: T('Ishtirokchilar', 'Участники', 'Players') }, { ic: '💐', h: T('Sovrinlar', 'Призы', 'Prizes'), p: T("G'oliblarga", 'Победителям', 'For the winners') }],
      marks: { hero: { t: T('Taxmin', 'Догадка', 'Guess'), c: '#475569' } },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Promptda «Ko'rinishi?» — «chiroyli bo'lsin».", q: "Nega o'yinchilar uchun sayt pushti bo'lib qoldi?", opts: ["Sun'iy intellekt «chiroyli» ni o'zicha tushundi", "Pushti — o'yinchilarning sevimli rangi", 'Promptda pushti rang yozilgan', 'Sayt buzilib qolgan'],
      ok: "«Chiroyli» har kimda har xil. Sun'iy intellekt o'zi taxmin qildi, shuning uchun «Taxmin» belgisi turibdi.", hint: "Promptda rang yozilganmi? Saytdagi «Taxmin» belgisi nima deydi?", alt: "Pushti kibersport sayti, «Taxmin» belgisi bilan" },
    ru: { ctx: 'В промпте «Как выглядит?» — «чтобы было красиво».', q: 'Почему сайт для игроков стал розовым?', opts: ['ИИ понял «красиво» по-своему', 'Розовый — любимый цвет игроков', 'В промпте написан розовый цвет', 'Сайт сломался'],
      ok: '«Красиво» у каждого своё. ИИ угадал сам — поэтому стоит метка «Догадка».', hint: 'Написан ли в промпте цвет? О чём говорит метка «Догадка» на сайте?', alt: 'Розовый сайт киберспорта с меткой «Догадка»' },
    en: { ctx: 'The “How it looks?” line says “make it pretty”.', q: 'Why did the gamers’ site turn pink?', opts: ['The AI understood “pretty” its own way', 'Pink is gamers’ favourite colour', 'The prompt says pink', 'The site is broken'],
      ok: '“Pretty” means something different to everyone. The AI guessed, which is why there is a “Guess” tag.', hint: 'Does the prompt name a colour? What does the “Guess” tag on the site tell you?', alt: 'A pink esports site with a “Guess” tag' } },

  { id: 'ai-04t2', target: 'ai-04', tag: 'uslub', correct: 2,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Kibersport turniri sayti', 'Сайт киберспортивного турнира', 'An esports tournament site') }, { q: 2, t: T("14–17 yoshli o'yinchilar", 'игроки 14–17 лет', 'gamers aged 14–17') }, { q: 4, t: null }]} />; },
    uz: { ctx: "Sayt o'yinchilar uchun. Ko'rinishini yozamiz.", q: "Qaysi «Ko'rinishi?» o'yinchilarga mos?", opts: ['yumshoq pushti, gullar bilan', "issiq jigarrang, qo'lyozma shrift", "qorong'i neon, yashil rang, kod shrifti", "chiroyli va zo'r bo'lsin"],
      ok: "O'yinchilarga qorong'i neon mos keladi. Uslub, rang va shrift aniq yozilgan.", hint: "Sayt kimlar uchun? Ularga qanday uslub yoqadi: o'yin ekrani yoki gullar?", alt: "«Ko'rinishi?» qatori bo'sh prompt" },
    ru: { ctx: 'Сайт для игроков. Пишем, как он выглядит.', q: 'Какая строка «Как выглядит?» подходит игрокам?', opts: ['нежно-розовый, с цветами', 'тёплый коричневый, рукописный шрифт', 'тёмный неон, зелёный цвет, шрифт кода', 'красиво и круто'],
      ok: 'Игрокам подходит тёмный неон. Стиль, цвет и шрифт названы точно.', hint: 'Для кого сайт? Какой стиль им нравится: как в игре или с цветочками?', alt: 'Промпт с пустой строкой «Как выглядит?»' },
    en: { ctx: 'The site is for gamers. We describe how it looks.', q: 'Which “How it looks?” line suits gamers?', opts: ['soft pink, with flowers', 'warm brown, handwritten font', 'dark neon, green, code font', 'pretty and cool'],
      ok: 'Dark neon suits gamers. The style, colour and font are named exactly.', hint: 'Who is the site for? What style do they like: like a game screen, or with flowers?', alt: 'A prompt with an empty “How it looks?” line' } },

  { id: 'ai-04t3', target: 'ai-04', tag: 'asosiy-rang', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Futbol klubi', 'Футбольный клуб', 'Football club'), em: '⚽', c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2', btn: '#FACC15', btnFg: '#1F2937',
      nav: [T('Jadval', 'Расписание', 'Schedule'), T("O'yinchilar", 'Игроки', 'Players'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi mavsum', 'Новый сезон', 'New season'), sub: T("Biz bilan o'ynang!", 'Играй с нами!', 'Play with us!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      goal: { h: T("Ro'yxatdan o'tish", 'Запись', 'Sign up'), fields: [T('Ismingiz', 'Твоё имя', 'Your name')], btn: T('Yuborish', 'Отправить', 'Send') },
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: "Qaysi «Ko'rinishi?» shu saytni bergan?", opts: ['sariq va qizil', 'qizil va sariq', 'faqat oq rang', 'chiroyli ranglar'],
      ok: "Birinchi yozilgan rang asosiy bo'ladi: sayt qizil, tugmalar esa sariq.", hint: "Saytda qaysi rang ko'p: banner qanday, tugmalar qanday? Birinchi yozilgan rang — asosiy.", alt: "Qizil sayt, sariq tugmalar" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Какая строка «Как выглядит?» дала этот сайт?', opts: ['жёлтый и красный', 'красный и жёлтый', 'только белый', 'красивые цвета'],
      ok: 'Первый названный цвет — главный: сайт красный, а кнопки жёлтые.', hint: 'Какого цвета на сайте больше: какой баннер, какие кнопки? Первый цвет — главный.', alt: 'Красный сайт с жёлтыми кнопками' },
    en: { ctx: 'The AI made this site.', q: 'Which “How it looks?” line gave this site?', opts: ['yellow and red', 'red and yellow', 'only white', 'nice colours'],
      ok: 'The first colour written is the main one: the site is red and the buttons are yellow.', hint: 'Which colour is there most of: the banner, the buttons? The first colour is the main one.', alt: 'A red site with yellow buttons' } },

  { id: 'ai-04t4', target: 'ai-04', tag: 'mijoz-uslubi', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T("«Do'konimiz — «Buvijonning shirinliklari». Mijozlarimiz bobo va buvilar. Sayt issiq va uydagidek bo'lsin.»", '«Наш магазин — «Бабушкины сладости». Наши покупатели — бабушки и дедушки. Пусть сайт будет тёплым и домашним».', '“Our shop is called Granny’s Sweets. Our customers are grandparents. Make the site warm and homely.”')} />; },
    uz: { ctx: "Mijozning xabarini o'qing.", q: "Qaysi «Ko'rinishi?» mos keladi?", opts: ["qorong'i neon, kod shrifti", 'kulrang, mayda shrift, soyasiz', "yorqin pushti, hammasi miltillasin", "issiq uslub, jigarrang va oltin, qo'lyozma shrift"],
      ok: "Mijoz issiq, uydagidek sayt so'radi: jigarrang va oltin ranglar, qo'lyozma shrift aynan shunday.", hint: "Mijoz qanday kayfiyat so'radi? Shunga mos uslub, rang va shriftni tanlang.", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Какая строка «Как выглядит?» подходит?', opts: ['тёмный неон, шрифт кода', 'серый, мелкий шрифт, без теней', 'ярко-розовый, всё мигает', 'тёплый стиль, коричневый и золотой, рукописный шрифт'],
      ok: 'Клиент просил тёплый, домашний сайт — это коричневый и золотой цвета и рукописный шрифт.', hint: 'Какое настроение просил клиент? Выбери подходящие стиль, цвет и шрифт.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'Which “How it looks?” line fits?', opts: ['dark neon, code font', 'grey, tiny font, no shadows', 'bright pink, everything flashing', 'warm style, brown and gold, handwritten font'],
      ok: 'The client asked for a warm, homely site: brown and gold with a handwritten font is exactly that.', hint: 'What mood did the client ask for? Choose a style, colour and font to match.', alt: 'The client’s message' } },

  { id: 'ai-04t5', target: 'ai-04', tag: 'shakl', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Robot kursi', 'Курс роботов', 'Robot course'), em: '🤖', c: '#7C3AED', c2: '#4C1D95', bg: '#EDE9FE', radius: 30, shadow: 'big', focus: '.cards',
      nav: [T('Darslar', 'Занятия', 'Lessons'), T('Ustozlar', 'Учителя', 'Teachers'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('Yangi guruh', 'Новая группа', 'New group'), sub: T("Robot yasashni o'rganing!", 'Научись собирать роботов!', 'Learn to build robots!'), cta: T("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
      cards: [{ ic: '🔧', h: T("Yig'amiz", 'Собираем', 'We build'), p: T("O'z robotingiz", 'Свой робот', 'Your own robot') }, { ic: '💻', h: T('Dasturlaymiz', 'Программируем', 'We code'), p: T('Oddiy kod', 'Простой код', 'Simple code') }, { ic: '🏆', h: T('Musobaqa', 'Соревнования', 'Contests'), p: T('Sovrinlar', 'Призы', 'Prizes') }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi. Kartochkalarga qarang.", q: "Kartochkalar uchun «Ko'rinishi?» ga nima yozilgan?", opts: ["to'g'ri burchaklar, soyasiz", "yumaloq burchaklar, katta soyalar", 'kod shrifti', 'hech narsa yozilmagan'],
      ok: "Kartochkalarning burchaklari yumaloq, ostida katta soya bor. Promptda aynan shu yozilgan.", hint: "Kartochkalarning burchaklariga va ostidagi soyaga qarang.", alt: "Yumaloq burchakli, katta soyali kartochkalar" },
    ru: { ctx: 'ИИ сделал такой сайт. Посмотри на карточки.', q: 'Что написано про карточки в строке «Как выглядит?»?', opts: ['прямые углы, без теней', 'скруглённые углы, большие тени', 'шрифт кода', 'ничего не написано'],
      ok: 'У карточек скруглённые углы и большая тень снизу. Именно это написано в промпте.', hint: 'Посмотри на углы карточек и на тень под ними.', alt: 'Карточки со скруглёнными углами и большими тенями' },
    en: { ctx: 'The AI made this site. Look at the cards.', q: 'What does the “How it looks?” line say about the cards?', opts: ['square corners, no shadows', 'rounded corners, big shadows', 'code font', 'nothing at all'],
      ok: 'The cards have rounded corners and a big shadow underneath. That is exactly what the prompt says.', hint: 'Look at the corners of the cards and the shadow under them.', alt: 'Cards with rounded corners and big shadows' } }
];

export default function AiTest04q5(props) { return <AqTest Q={QS[4]} {...props} />; }
