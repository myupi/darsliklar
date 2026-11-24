// =============================================================================
// УКАЗАТЕЛЬ (заказчик, 24.11.2026: «покажем куда нажимать, потом что появится, куда идти, что вводить… если на компе то пусть
// появится курсор, если на телефоне рука»). На компьютере — стрелка мыши, на телефоне — палец с кругом касания.
// Телефон или компьютер — по той же ширине, по которой меняется вид Tilda (до 759 px — телефон).
//   const G = useGuide(root);      root — ref на .kz-scene (класс tl-groot: position: relative)
//   G.go('.css', fx, fy)          подъехать к вещи; G.tap() — нажатие (кольцо / круг касания и звук)
//   G.hide()                      убрать; {G.el} — сам указатель последним ребёнком root
//   usePoint(G, sel, on)          в задании: указатель стоит у вещи, которую надо нажать, и «нажимает» её каждые 2 с
//                                 (сам ничего не нажимает); sel меняется — указатель едет к новой вещи.
// =============================================================================
const isTouchView = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(max-width: 759px)').matches;
function useGuide(root) {
  const [cur, setCur] = useState(null);
  const [press, setPress] = useState(0);
  const [touch, setTouch] = useState(isTouchView());
  const rm = reduceMotion();
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(max-width: 759px)');
    const f = () => setTouch(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', f); else mq.addListener(f);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', f); else mq.removeListener(f); };
  }, []);
  const pt = (q, fx, fy) => {
    const r = root.current; const el = r && r.querySelector(q);
    if (!r || !el || !el.offsetParent) return null;
    const a = r.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: Math.round(b.left - a.left + b.width * (fx == null ? 0.5 : fx)), y: Math.round(b.top - a.top + b.height * (fy == null ? 0.5 : fy)) };
  };
  const go = (q, fx, fy) => {
    const t = pt(q, fx, fy);
    if (!t) return false;
    setCur((old) => {
      if (old || rm) return { x: t.x, y: t.y };
      setTimeout(() => setCur((o2) => (o2 ? { x: t.x, y: t.y } : o2)), 40);
      return { x: t.x + 40, y: t.y + 60, fresh: true };
    });
    return true;
  };
  const tap = (quiet) => { setPress((v) => v + 1); if (!quiet) sfx('tap', true); };
  const hide = () => setCur(null);
  const el = cur ? (
    <span key={'g' + press} className={'tl-g' + (touch ? ' is-touch' : ' is-mouse') + (press ? ' is-press' : '')} style={{ left: cur.x + 'px', top: cur.y + 'px' }} aria-hidden="true">
      {touch ? (
        <>
          <i className="tl-g-dot" />
          <svg className="tl-g-finger" viewBox="0 0 48 64" width="40" height="54">
            <path d="M17 6c0-3 2-5 5-5s5 2 5 5v20l2-1c3-1 6 0 7 3l1 2c3-1 6 1 6 4v1c3-1 5 1 5 4v12c0 9-7 13-15 13h-6c-6 0-10-3-13-8L4 40c-2-3-1-6 2-7 2-1 5 0 6 2l5 6V6z"
              fill="#FFE1CC" stroke="#3B2A20" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
        </>
      ) : (
        <svg className="tl-g-arrow" viewBox="0 0 24 24" width="26" height="26"><path d="M5 2.5 L5 19.5 L9.4 15.4 L12.3 21.6 L15.2 20.3 L12.4 14.3 L18.4 14.1 Z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      )}
      <i className="tl-g-ring" />
    </span>
  ) : null;
  return { go, tap, hide, el, touch, pt };
}
// Указатель в задании: стоит у нужной вещи и показывает нажатие (сам не нажимает). Новая вещь — едет к ней.
function usePoint(G, sel, on) {
  useEffect(() => {
    if (!on || !sel) { G.hide(); return undefined; }
    let dead = false;
    const place = () => {
      if (dead) return;
      const el = document.querySelector('.tl-groot ' + sel) || document.querySelector(sel);
      const field = el && /^(INPUT|TEXTAREA)$/.test(el.tagName);
      G.go(sel, field ? 0.86 : 0.5, field ? 0.62 : 0.5);   // в поле ввода — у правого края, чтобы не закрывать текст
    };
    const t0 = setTimeout(place, 350);
    const re = setInterval(place, 700);           // вещь могла сдвинуться (открылась панель, клавиатура)
    const tp = setInterval(() => { if (!dead) G.tap(true); }, 2000);
    return () => { dead = true; clearTimeout(t0); clearInterval(re); clearInterval(tp); };
  }, [sel, on]); // eslint-disable-line react-hooks/exhaustive-deps
}
