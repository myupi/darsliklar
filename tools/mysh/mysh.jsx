// =============================================================================
// КУРСОР МЫШИ ДЛЯ ПОКАЗОВ (общий для уроков HTML 1, 6, 7, 8; заказчик, 07.11.2026: «давай это сделаем как ты предложил»).
// По образцу курсора уроков 4–5 (Z4Cursor): стрелка сама едет к вещи в окне браузера и делает то, что человек делает
// мышкой (наводит, щёлкает, тянет). Кнопки урока («Дальше», «Проверить», ответы) курсор никогда не нажимает.
//   const M = useMysh(root);           root — ref на .kz-scene (ей нужен класс ms-root: position: relative)
//   M.go('.css', fx, fy, { hand })     ехать к вещи: точка fx, fy — доля ширины и высоты (по умолчанию середина)
//   M.click()                          щелчок: кольцо и звук касания
//   M.hide()                           убрать курсор
//   M.hold(true|false)                 зажать / отпустить кнопку мыши (тянуть уголок)
//   M.follow('.css', fx, fy, мс)       ехать вместе с вещью, пока она меняется (тянем уголок — поле растёт)
//   M.card({ t, sub }) / M.card(null)  карточка под курсором, как у вкладки Chrome при наведении: название и адрес
//   M.slow                             сколько ждать полёта ({ wait: M.slow } в шагах useKzDemo)
//   {M.el}                             сам курсор — последним ребёнком root
// =============================================================================
function useMysh(root) {
  const [cur, setCur] = useState(null);
  const [press, setPress] = useState(false);
  const [down, setDown] = useState(false);
  const [card, setCard] = useState(null);
  const rm = reduceMotion();
  const slow = rm ? 200 : 800;
  const pt = (q, fx, fy) => {
    const r = root.current; const el = r && r.querySelector(q);
    if (!r || !el) return null;
    const a = r.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: Math.round(b.left - a.left + b.width * (fx == null ? 0.5 : fx)), y: Math.round(b.top - a.top + b.height * (fy == null ? 0.5 : fy)) };
  };
  const go = (q, fx, fy, o) => {
    const t = pt(q, fx, fy);
    if (!t) return;
    const hand = !!(o && o.hand);
    setCur((old) => {
      if (old || rm) return { x: t.x, y: t.y, hand };
      // Первое появление — чуть в стороне, затем полёт к вещи (а не возникновение прямо на ней).
      setTimeout(() => setCur((o2) => (o2 ? { x: t.x, y: t.y, hand } : o2)), 40);
      return { x: t.x + 46, y: t.y + 34, hand: false, fresh: true };
    });
  };
  const click = () => { setPress(true); sfx('tap', true); setTimeout(() => setPress(false), 280); };
  const hide = () => { setCur(null); setDown(false); setCard(null); };
  const hold = (v) => setDown(!!v);
  const follow = (q, fx, fy, ms) => {
    const t0 = performance.now();
    const tick = () => {
      const t = pt(q, fx, fy);
      const live = performance.now() - t0 < ms;
      if (t) setCur((o) => (o ? { x: t.x, y: t.y, hand: o.hand, follow: live } : o));
      if (live) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const W = root.current ? root.current.clientWidth : 400;
  const cardEl = cur && card ? (
    <span className="ms-card" style={{ left: Math.max(4, Math.min(cur.x - 14, W - 214)) + 'px', top: (cur.y + 24) + 'px' }} aria-hidden="true">
      <b>{card.t}</b>{card.sub ? <i>{card.sub}</i> : null}
    </span>
  ) : null;
  const el = cur ? (
    <span className={'ms-cur' + (cur.hand ? ' is-hand' : '') + (press ? ' is-press' : '') + (down ? ' is-down' : '') + (cur.follow ? ' is-follow' : '')} style={{ left: cur.x + 'px', top: cur.y + 'px' }} aria-hidden="true">
      {cur.hand
        ? <svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 2.5c-.9 0-1.6.7-1.6 1.6v8.6l-1.3-1.4c-.6-.7-1.7-.7-2.3-.1-.6.6-.6 1.5-.1 2.1l4.2 5.6c.8 1.1 2.1 1.7 3.4 1.7h3.6c2.2 0 4-1.8 4-4v-5.1c0-.9-.7-1.6-1.6-1.6-.4 0-.7.1-1 .4v-.3c0-.9-.7-1.6-1.6-1.6-.5 0-.9.2-1.2.5-.2-.7-.8-1.2-1.5-1.2-.4 0-.8.1-1.1.4V4.1c0-.9-.7-1.6-1.6-1.6z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        : <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 2.5 L5 19.5 L9.4 15.4 L12.3 21.6 L15.2 20.3 L12.4 14.3 L18.4 14.1 Z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
      <i className="ms-ring" />
    </span>
  ) : null;
  const both = cur ? <>{cardEl}{el}</> : null;
  return { go, click, hide, hold, follow, card: setCard, slow, el: both, on: !!cur };
}
