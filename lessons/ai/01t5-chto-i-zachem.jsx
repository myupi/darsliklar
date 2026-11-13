// Тест 5/5 к уроку 1 модуля «ИИ» — один вопрос в формате CRM «JSX savol / test» (13.11.2026).
// Собрано: node tools/aitest/build.mjs 01 — вручную не править; исходник — tools/aitest/l01.jsx, набор — tools/aitest/kit.jsx.
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
// Поле промпта: rows — [{ q: номер вопроса формулы, t: текст | null (пустая строка «…») }].
function AqPrompt({ L, rows }) {
  return (
    <div className="aq-prompt">
      {rows.map((r, i) => {
        const f = AQ_FORMULA[r.q];
        return (
          <div key={i} className="aq-pl">
            <span className="aq-pq" style={{ background: f.c }}>{f[L] || f.ru}</span>
            {r.t ? <span className="aq-pv" style={{ background: f.bg, color: f.c }}>{r.t}</span> : <span className="aq-pe">…</span>}
          </div>
        );
      })}
    </div>
  );
}
// Сайт в окне браузера: title, sub, btn (текст главной кнопки | null), form (поля записи), color, guess (метка «Taxmin»).
function AqSite({ title, sub, btn, form, color, guess }) {
  return (
    <div className="aq-br">
      <div className="aq-br-bar"><i /><i /><i /><span className="aq-br-tab">{title}</span></div>
      <div className="aq-site">
        <div className="aq-hero" style={{ background: color || '#7C3AED' }}>
          <b>{title}</b>
          {sub ? <span>{sub}</span> : null}
          {btn ? <em>{btn}</em> : null}
          {guess ? <i className="aq-guess">{guess}</i> : null}
        </div>
        {form ? <div className="aq-form"><b>{form.h}</b>{form.fields.map((x, i) => <span key={i}>{x}</span>)}<em style={{ background: color || '#7C3AED' }}>{form.btn}</em></div> : null}
      </div>
    </div>
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
  useEffect(() => {
    if (!checked || !fbRef.current || typeof window === 'undefined') return;
    // Плашка под вариантами должна быть видна целиком — с запасом под нижнюю полосу платформы с кнопкой.
    const el = fbRef.current;
    requestAnimationFrame(() => {
      const low = window.innerHeight - 84;
      const d = el.getBoundingClientRect().bottom - low;
      if (d > 0) window.scrollBy(0, d);
    });
  }, [checked]);
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
    <section className="aq" lang={L}>
      <style>{AQ_CSS}</style>
      <div className="aq-main">
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
.aq { box-sizing: border-box; min-height: 100%; width: 100%; color: #1E1B39; font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, Arial, sans-serif; -webkit-text-size-adjust: 100%;
  background-color: #F4F5F7; background-image: radial-gradient(circle, #D5DAE1 1px, transparent 1.4px); background-size: 20px 20px; background-position: -10px -10px; }
.aq * { box-sizing: border-box; }
.aq { flex: 1 0 auto; } /* в полосе платформы — до самой кнопки снизу */
.aq-main { width: 100%; max-width: 760px; margin: 0 auto; padding: 56px 16px 24px; flex: 1 0 auto; }
.aq-chip { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 14px; border-radius: 999px; background: #E1F5FF; color: #009BE7; font-size: 12px; font-weight: 600; white-space: nowrap; }
.aq-chip svg { width: 16px; height: 16px; flex: none; }
.aq-head { display: flex; flex-direction: column; margin-top: 16px; }
.aq-q { margin: 0; font-size: 22px; font-weight: 700; line-height: 1.3; color: #000; overflow-wrap: break-word; }
.aq-ctx { margin: 8px 0 0; font-size: 14px; font-weight: 500; line-height: 1.4; color: #6E6A85; overflow-wrap: break-word; }
.aq-vis { display: flex; justify-content: center; margin-top: 18px; }
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
.aq-br { width: min(100%, 420px); border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 0 0 1px #D9DEE6, 0 8px 22px rgba(15, 23, 42, .08); }
.aq-br-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: #E9EDF2; }
.aq-br-bar i { width: 8px; height: 8px; border-radius: 50%; background: #C7CDD6; }
.aq-br-tab { margin-left: 8px; padding: 2px 10px; border-radius: 8px 8px 0 0; background: #fff; font-size: 11px; font-weight: 600; color: #334155; }
.aq-hero { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 12px; color: #fff; text-align: center; }
.aq-hero b { font-size: 18px; font-weight: 800; }
.aq-hero span { font-size: 12px; opacity: .92; }
.aq-hero em { margin-top: 4px; padding: 5px 14px; border-radius: 8px; background: #fff; color: #1E1B39; font-size: 12px; font-weight: 800; font-style: normal; }
.aq-guess { position: absolute; right: 8px; top: 8px; padding: 1px 8px; border-radius: 999px; background: #475569; color: #fff; font-size: 10.5px; font-weight: 700; font-style: normal; }
.aq-form { display: flex; flex-direction: column; gap: 5px; margin: 10px 12px 12px; padding: 10px; border-radius: 10px; background: #F5F3FF; }
.aq-form b { font-size: 12.5px; font-weight: 800; color: #1E1B39; }
.aq-form span { padding: 4px 8px; border: 1px solid #CBD5E1; border-radius: 6px; background: #fff; color: #94A3B8; font-size: 11px; }
.aq-form em { align-self: flex-start; padding: 4px 12px; border-radius: 6px; color: #fff; font-size: 11px; font-weight: 700; font-style: normal; }
.aq-msg { display: flex; flex-direction: column; gap: 4px; width: min(100%, 480px); padding: 12px 16px; border-radius: 18px 18px 18px 4px; background: #fff; box-shadow: 0 0 0 1px #E2E8F0, 0 6px 18px rgba(15, 23, 42, .06); }
.aq-msg b { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7C3AED; }
.aq-msg span { font-size: 15px; font-weight: 600; line-height: 1.4; color: #1E1B39; }
/* Ноутбук: варианты по два в ряд, вопрос крупнее, строка контекста — над вопросом (как в макете). */
@media (min-width: 720px) {
  .aq-main { padding: 40px 24px 32px; }
  .aq-chip { height: 34px; padding: 0 16px; font-size: 13px; }
  .aq-head { flex-direction: column-reverse; margin-top: 18px; }
  .aq-ctx { margin: 0 0 6px; font-size: 16px; }
  .aq-q { font-size: 28px; line-height: 1.3; letter-spacing: -.3px; color: #1E1B39; }
  .aq-vis { margin-top: 22px; }
  .aq-opts { margin: 18px -6px -6px; }
  .aq-opt { width: calc(50% - 12px); margin: 6px; min-height: 64px; font-size: 18px; border-radius: 16px; }
  .aq-fb-in { padding: 18px 24px; }
}
@media (max-width: 719px) and (max-height: 680px) {
  .aq-q { font-size: 20px; }
  .aq-vis { margin-top: 12px; }
  .aq-opts { margin-top: 10px; }
  .aq-opt { min-height: 48px; margin: 4px 0; padding: 6px 12px; font-size: 15px; }
  .aq-badge { flex-basis: 30px; width: 30px; height: 30px; margin-right: 10px; font-size: 14px; }
}
`;

// =============================================================================
// ТЕСТЫ К УРОКУ 1 МОДУЛЯ «ИИ» «Что создаём и зачем?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «Nima?» — конкретная вещь; «Nega?» — цель сайта, видна на сайте (кнопка, раздел); «chiroyli bo'lsin»
// — не цель; строки промпта — из сообщения клиента.
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'chto-i-zachem';
const QS = [
  { id: 'ai-01t1', target: 'ai-01', tag: 'nima', correct: 1,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: null }, { q: 1, t: L === 'ru' ? 'чтобы команды записывались' : L === 'en' ? 'get teams to sign up' : "jamoalar yozilsin" }]} />,
    uz: { ctx: "Sun'iy intellektga nima yaratishni aytamiz.", q: "«Nima?» qatoriga qaysi biri aniqroq?", opts: ['Sayt', 'Futbol turniri sayti', "Zo'r narsa", 'Bir narsa qil'],
      ok: "«Futbol turniri sayti» aniq narsani aytadi: qanday sayt kerakligini.", hint: "Qaysi javobdan sun'iy intellekt qanday sayt kerakligini biladi? Mavzu va sayt turi bo'lsin.", alt: "«Nima?» qatori bo'sh promptda" },
    ru: { ctx: 'Говорим ИИ, что создать.', q: 'Что точнее подходит в строку «Что?»?', opts: ['Сайт', 'Сайт футбольного турнира', 'Что-нибудь крутое', 'Сделай что-нибудь'],
      ok: '«Сайт футбольного турнира» называет конкретную вещь: какой нужен сайт.', hint: 'По какому ответу ИИ поймёт, какой именно нужен сайт? Нужны тема и вид сайта.', alt: 'Пустая строка «Что?» в промпте' },
    en: { ctx: 'We tell the AI what to make.', q: 'Which fits the “What?” line best?', opts: ['A site', 'A football tournament site', 'Something cool', 'Make something'],
      ok: '“A football tournament site” names a real thing: exactly what site is needed.', hint: 'Which answer tells the AI exactly what site is needed? It needs a topic and a kind of site.', alt: 'An empty “What?” line in a prompt' } },
  { id: 'ai-01t2', target: 'ai-01', tag: 'nega', correct: 2,
    vis: (L) => <AqSite title={L === 'ru' ? 'Шахматный турнир' : L === 'en' ? 'Chess tournament' : 'Shaxmat turniri'} sub={L === 'ru' ? 'Запишись прямо сейчас!' : L === 'en' ? 'Sign up now!' : "Hoziroq ro'yxatdan o'ting!"}
      btn={L === 'ru' ? 'Записаться' : L === 'en' ? 'Sign up' : "Ro'yxatdan o'tish"} color="#334155"
      form={{ h: L === 'ru' ? 'Запись' : L === 'en' ? 'Sign up' : "Ro'yxatdan o'tish", fields: [L === 'ru' ? 'Твоё имя' : L === 'en' ? 'Your name' : 'Ismingiz', L === 'ru' ? 'Твой класс' : L === 'en' ? 'Your class' : 'Sinfingiz'], btn: L === 'ru' ? 'Отправить' : L === 'en' ? 'Send' : 'Yuborish' }} />,
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: "Qaysi «Nega?» qatori shu saytni bergan?", opts: ['odamlar turnir qachon va qayerdaligini bilsin', "odamlar bizga qo'ng'iroq qilsin", "o'yinchilar turnirga yozilsin", "sayt chiroyli bo'lsin"],
      ok: "Saytda ro'yxatdan o'tish tugmasi va formasi bor: maqsad yozilish.", hint: "Saytdagi katta tugmaga va formaga qarang: ular odamlardan nima qilishni so'rayapti?", alt: "Ro'yxatdan o'tish tugmasi va formasi bor sayt" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Какая строка «Зачем?» дала этот сайт?', opts: ['чтобы люди узнали, когда и где турнир', 'чтобы люди нам звонили', 'чтобы игроки записывались на турнир', 'чтобы сайт был красивым'],
      ok: 'На сайте кнопка и форма записи: цель — запись.', hint: 'Посмотри на большую кнопку и форму: что они просят сделать?', alt: 'Сайт с кнопкой и формой записи' },
    en: { ctx: 'The AI made this site.', q: 'Which “Why?” line gave this site?', opts: ['people learn when and where the tournament is', 'get people to call us', 'get players to sign up for the tournament', 'make the site pretty'],
      ok: 'The site has a sign-up button and form: the goal is sign-ups.', hint: 'Look at the big button and the form: what do they ask people to do?', alt: 'A site with a sign-up button and form' } },
  { id: 'ai-01t3', target: 'ai-01', tag: 'nega', correct: 1,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: L === 'ru' ? 'Пиццерия' : L === 'en' ? 'Pizza cafe' : 'Pitsa kafesi sayti' }, { q: 1, t: L === 'ru' ? 'чтобы было красиво' : L === 'en' ? 'make it pretty' : "chiroyli bo'lsin" }]} />,
    uz: { ctx: "Pitsa kafesi buyurtmalar olmoqchi.", q: "Qaysi qator sun'iy intellektga hech narsa demaydi?", opts: ["«Nima?» qatori", "«Nega?» qatori", 'Ikkalasi ham aniq', "Ikkalasi ham noaniq"],
      ok: "«Chiroyli bo'lsin» maqsad emas: sayt nima qilishi kerakligini aytmaydi. Shuning uchun buyurtma tugmasi chiqmaydi.", hint: "Qaysi qator sayt nima qilishi kerakligini aytmayapti? Kafe buyurtma olmoqchi edi.", alt: "Pitsa kafesi uchun ikki qatorli prompt" },
    ru: { ctx: 'Пиццерия хочет принимать заказы.', q: 'Какая строка ничего не говорит ИИ?', opts: ['Строка «Что?»', 'Строка «Зачем?»', 'Обе точные', 'Обе неточные'],
      ok: '«Чтобы было красиво» — не цель: не сказано, что должен сделать сайт. Поэтому кнопки заказа не будет.', hint: 'Какая строка не говорит, что должен сделать сайт? Кафе хотело принимать заказы.', alt: 'Промпт из двух строк для пиццерии' },
    en: { ctx: 'A pizza cafe wants to take orders.', q: 'Which line tells the AI nothing?', opts: ['The “What?” line', 'The “Why?” line', 'Both are clear', 'Both are vague'],
      ok: '“Make it pretty” isn’t a goal: it doesn’t say what the site should do. So there won’t be an order button.', hint: 'Which line doesn’t say what the site should do? The cafe wanted to take orders.', alt: 'A two-line prompt for a pizza cafe' } },
  { id: 'ai-01t4', target: 'ai-01', tag: 'mijoz', correct: 0,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Клиент' : L === 'en' ? 'Client' : 'Mijoz'} text={L === 'ru' ? '«В нашей школе открылся шахматный кружок. Хотим, чтобы дети в него записывались».' : L === 'en' ? '“Our school has opened a chess club. We want kids to sign up for it.”' : "«Maktabimizda shaxmat to'garagi ochildi. Bolalar to'garakka yozilishini xohlaymiz.»"} />,
    uz: { ctx: "Mijozning xabarini o'qing.", q: 'Unga qaysi prompt mos?', opts: ["Shaxmat to'garagi sayti. Maqsad: bolalar yozilsin", "Shaxmat haqida sayt. Maqsad: chiroyli bo'lsin", 'Pitsa kafesi sayti. Maqsad: buyurtma qilsin', "Shaxmat to'garagi sayti. Maqsad: qo'ng'iroq qilsin"],
      ok: "Mijoz shaxmat to'garagi haqida yozdi va bolalar yozilishini xohlaydi: ikkala qator ham xabardan olingan.", hint: "Xabarda ikki narsa bor: qanday sayt va odamlar nima qilsin. Ikkalasi ham mos kelsin.", alt: "Mijozning xabari" },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Какой промпт ему подходит?', opts: ['Сайт шахматного кружка. Цель: чтобы дети записывались', 'Сайт про шахматы. Цель: чтобы было красиво', 'Сайт пиццерии. Цель: чтобы заказывали', 'Сайт шахматного кружка. Цель: чтобы звонили'],
      ok: 'Клиент пишет про шахматный кружок и хочет, чтобы дети записывались: обе строки взяты из сообщения.', hint: 'В сообщении две вещи: какой сайт и что должны делать люди. Нужно, чтобы совпали обе.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'Which prompt fits it?', opts: ['A chess club site. Goal: get kids to sign up', 'A site about chess. Goal: make it pretty', 'A pizza cafe site. Goal: get orders', 'A chess club site. Goal: get people to call'],
      ok: 'The client writes about a chess club and wants kids to sign up: both lines come from the message.', hint: 'The message has two things: what site, and what people should do. Both must match.', alt: 'The client’s message' } },
  { id: 'ai-01t5', target: 'ai-01', tag: 'nega', correct: 3,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: L === 'ru' ? 'Пекарня' : L === 'en' ? 'Bakery' : 'Novvoyxona sayti' }, { q: 1, t: null }]} />,
    uz: { ctx: "Novvoyxona odamlar tort buyurtma qilishini xohlaydi.", q: "«Nega?» qatoriga nima yozamiz?", opts: ["sayt shirin bo'lsin", 'tortlar haqida', 'hamma uchun', 'odamlar tort buyurtma qilsin'],
      ok: "Maqsad: buyurtma qilish. Shunda saytda buyurtma tugmasi va bo'limi paydo bo'ladi.", hint: "«Nega?» qatori sayt odamlardan nima qilishni so'rashini aytadi. Novvoyxona nimani xohlaydi?", alt: "«Nega?» qatori bo'sh prompt" },
    ru: { ctx: 'Пекарня хочет, чтобы люди заказывали торты.', q: 'Что написать в строку «Зачем?»?', opts: ['чтобы сайт был вкусным', 'про торты', 'для всех', 'чтобы люди заказывали торты'],
      ok: 'Цель — заказ. Тогда на сайте появятся кнопка и раздел заказа.', hint: 'Строка «Зачем?» говорит, что сайт просит сделать людей. Чего хочет пекарня?', alt: 'Промпт с пустой строкой «Зачем?»' },
    en: { ctx: 'A bakery wants people to order cakes.', q: 'What goes in the “Why?” line?', opts: ['make the site tasty', 'about cakes', 'for everyone', 'get people to order cakes'],
      ok: 'The goal is ordering. Then the site gets an order button and section.', hint: 'The “Why?” line says what the site asks people to do. What does the bakery want?', alt: 'A prompt with an empty “Why?” line' } }
];

export default function AiTest01q5(props) { return <AqTest Q={QS[4]} {...props} />; }
