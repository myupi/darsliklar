const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const tagWord = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const useShake = () => {
  const [shake, setShake] = useState(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const wobble = useCallback((k) => { setShake(k); setTimeout(() => { if (alive.current) setShake(null); }, 420); }, []);
  return [shake, wobble, alive];
};
function useRec(id) {
  const store = useStore();
  const [rec, setRec] = useState(() => store.get(id) || null);
  const put = useCallback((v) => { store.set(id, v); setRec(v); }, [id, store]);
  return [rec, put, store];
}
// Текст листа body — в две строки (на модели лист узкий).
function twoLines(s) {
  const w = String(s || '').trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(' '), ''];
  let best = 1, diff = 1e9;
  for (let i = 1; i < w.length; i += 1) {
    const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
    if (d < diff) { diff = d; best = i; }
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}
const docTexts = (title, text) => { const [a, b] = twoLines(text); return { title, page1: a, page2: b }; };

// Фигура. Экран задаёт состояние, фигура только рисует:
//   texts · parts { ключ: on|ghost|off } · lit [ключи] · move { ключ: величина } ·
//   led [ключи] · shake { k, n } · onPick(ключ) · pickable [ключи].
function Fig({ texts, parts, lit, move, led, shake, onPick, pickable, cls, label }) {
  const F = FIG;
  const pick = usePick();
  const ref = useRef(null);
  const html = useMemo(() => ({ __html: F.svg }), [F]);
  const pos = useRef(null);
  const want = useRef(move || {});
  want.current = move || {};
  const raf = useRef(0);
  const q = (sel) => (ref.current ? ref.current.querySelectorAll(sel) : []);
  const place = () => {
    Object.keys(pos.current).forEach((k) => {
      const ax = F.axes[k];
      if (!ax) return;
      const v = pos.current[k];
      q('[data-move="' + k + '"]').forEach((g) => g.setAttribute('transform', 'translate(' + (ax[0] * v).toFixed(2) + ' ' + (ax[1] * v).toFixed(2) + ')'));
    });
  };
  useLayoutEffect(() => {
    pos.current = Object.assign({}, move || {});
    place();
    return () => cancelAnimationFrame(raf.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const moveKey = JSON.stringify(move || {});
  useEffect(() => {
    if (!pos.current) return undefined;
    const calm = reduceMotion();
    let last = 0;
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      let moving = false;
      Object.keys(want.current).forEach((k) => {
        const w = want.current[k];
        const v = pos.current[k] === undefined ? w : pos.current[k];
        const nv = calm ? w : v + (w - v) * (1 - Math.exp(-dt / 0.18));
        pos.current[k] = Math.abs(w - nv) < 0.05 ? w : nv;
        if (pos.current[k] !== w) moving = true;
      });
      place();
      raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [moveKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const textKey = JSON.stringify(texts || {});
  useLayoutEffect(() => {
    const t = texts || {};
    q('[data-t]').forEach((n) => {
      const k = n.getAttribute('data-t');
      if (t[k] === undefined) return;
      n.textContent = t[k];
      // Длинный текст сжимается до ширины карточки, а не вылезает за неё.
      const fit = Number(n.getAttribute('data-fit'));
      n.removeAttribute('textLength');
      n.removeAttribute('lengthAdjust');
      if (fit && t[k] && n.getComputedTextLength && n.getComputedTextLength() > fit) {
        n.setAttribute('textLength', String(fit));
        n.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  }, [textKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const partKey = JSON.stringify(parts || {});
  useLayoutEffect(() => {
    const ps = parts || {};
    q('[data-part]').forEach((g) => {
      const st = ps[g.getAttribute('data-part')];
      if (st && st !== 'on') g.setAttribute('data-state', st); else g.removeAttribute('data-state');
    });
  }, [partKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const litKey = (lit || []).join(',');
  useLayoutEffect(() => {
    const on = lit || [];
    q('[data-sel]').forEach((g) => {
      const yes = on.indexOf(g.getAttribute('data-sel')) >= 0;
      g.classList.toggle('is-lit', yes);
      const solid = g.querySelector(':scope > .iso-solid');
      if (solid) { if (yes) solid.setAttribute('data-lit', ''); else solid.removeAttribute('data-lit'); }
    });
  }, [litKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const ledKey = (led || []).join(',') + '|' + (pickable || []).join(',') + '|' + !!onPick;
  useLayoutEffect(() => {
    q('[data-hit]').forEach((g) => {
      const k = g.getAttribute('data-hit');
      g.classList.toggle('is-led', (led || []).indexOf(k) >= 0);
      g.classList.toggle('is-pick', !!onPick && (!pickable || pickable.indexOf(k) >= 0));
    });
  }, [ledKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!shake || !shake.k) return undefined;
    const els = q('[data-shake="' + shake.k + '"]');
    els.forEach((g) => { g.classList.remove('fx-shake'); void g.getBoundingClientRect(); g.classList.add('fx-shake'); });
    const t = setTimeout(() => els.forEach((g) => g.classList.remove('fx-shake')), 520);
    return () => clearTimeout(t);
  }, [shake && shake.n]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = (e) => {
    if (!onPick) return;
    const g = e.target.closest && e.target.closest('[data-hit]');
    if (!g) return;
    const k = g.getAttribute('data-hit');
    if (pickable && pickable.indexOf(k) < 0) return;
    onPick(k);
  };
  return <div ref={ref} className={'fig iso' + (cls ? ' ' + cls : '')} data-theme="light" style={{ '--ar': F.ar }} role="img"
    aria-label={label ? pick(label) : undefined} onClick={click} dangerouslySetInnerHTML={html} />;
}

// Состояние модели по умолчанию: коробка открыта, всё на месте.
const LID_UP = () => FIG.open.lid;
const DROP = () => FIG.open.drop;

// Кнопки частей: имя тега + цвет + форма. Для клавиатуры и для тех, кому
// неудобно попадать в модель.
function PartChips({ items, onPick, sel, seen, disabled, led, cls }) {
  return (
    <div className={'chips' + (cls ? ' ' + cls : '')} translate="no">
      {items.map((k) => (
        <button key={k} type="button" disabled={disabled} onClick={() => onPick(k)} style={{ '--c': TAGC[k] || T.ink2 }}
          className={'chip mono' + (sel === k ? ' is-sel' : '') + (seen && seen.indexOf(k) >= 0 ? ' is-seen' : '')}>
          <span className="chip-mark" aria-hidden="true">{seen && seen.indexOf(k) >= 0 ? <Icon name="check" size={12} /> : null}</span>
          {k}
          <Led on={!!led && led.indexOf(k) >= 0} />
        </button>
      ))}
    </div>
  );
}

// Строка задания: при затруднении на её место встаёт подсказка.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}

// =============================================================================

function Inspector({ rules }) {
  const pick = usePick();
  const firstOpen = rules.findIndex((r) => !r.ok);
  return (
    <div className={'insp' + (firstOpen < 0 ? ' insp-all' : '')} aria-live="polite">
      <span className="insp-h"><Icon name="listN" size={14} />{pick(UI.inspector)}</span>
      {rules.map((r, i) => (
        <span key={r.id} className={'insp-r' + (r.ok ? ' is-ok' : '') + (i === firstOpen ? ' is-now' : '')}>
          <span className="insp-ic">{r.ok ? <Icon name="check" size={13} /> : null}</span>
          {pick(r.text)}
        </span>
      ))}
    </div>
  );
}
