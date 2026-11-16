import React, { useRef, useState } from 'react';
import { Check, Star, Sparkles } from 'lucide-react';
import { Head, Task, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 2. Три любимых приложения. Четвёртое не выбирается — карточка вздрагивает и строка подсказывает.
// Когда выбрано три — карточка «Всё это сделали программисты» с тем, на чём написано каждое из выбранных.
const APPS = [
  ['roblox', '🧱', '#E2231A'], ['minecraft', '⛏️', '#5B8C32'], ['football', '⚽', '#1F6FEB'],
  ['youtube', '▶️', '#FF0033'], ['tiktok', '🎵', '#111111'], ['instagram', '📷', '#C13584'],
];

export default function Apps({ t, st, set, setNav }) {
  const s = t.s2;
  const [shake, setShake] = useState('');
  const [warn, setWarn] = useState(false);
  const wt = useRef(null);
  const n = st.apps.length;
  useNav(setNav, [st.lang, n], () => ({ label: s.next, ok: n === 3, skip: n < 3 }));

  const toggle = (id) => {
    if (st.apps.includes(id)) { setWarn(false); sfx('unpick'); set({ apps: st.apps.filter((a) => a !== id) }); return; }
    if (n >= 3) { sfx('error'); setShake(id); setTimeout(() => setShake(''), 450); setWarn(true); clearTimeout(wt.current); wt.current = setTimeout(() => setWarn(false), 2500); return; }
    sfx('pick');
    const apps = st.apps.concat(id);
    if (apps.length === 3) setTimeout(() => confetti(0.5, 0.55), 120);
    set({ apps });
  };

  return (
    <section className="sl sl-apps">
      <Head eyebrow={s.eyebrow} title={s.title} />
      <Task right={<span className="stars" aria-label={s.count(n)}>{[0, 1, 2].map((i) => <Star key={i} size={18} className={i < n ? 'on' : ''} />)}</span>}>
        {s.task} · <b>{s.count(n)}</b>
      </Task>
      <div className="app-grid">
        {APPS.map(([id, ic, c]) => {
          const on = st.apps.includes(id);
          const a = s.apps[id];
          return (
            <button key={id} type="button" className={'app-card' + (on ? ' is-on' : '') + (shake === id ? ' is-shake' : '')} onClick={() => toggle(id)} aria-pressed={on}>
              <span className="app-ic" style={{ '--c': c }} aria-hidden="true"><Art id={'app-' + id} fallback={ic} /></span>
              <span className="app-tx"><b>{a.name}</b><span>{a.sub}</span></span>
              <span className="tick" aria-hidden="true">{on ? <Check size={15} strokeWidth={3} /> : null}</span>
            </button>
          );
        })}
      </div>
      {warn ? <div className="note note-warn">{s.full}</div> : null}
      {n === 3 ? (
        <div className="fact">
          <div className="fact-h"><Sparkles size={18} /> {s.factTitle}</div>
          <p>{s.factText}</p>
          <ul>
            {st.apps.map((id) => <li key={id}><b>{s.apps[id].name}</b> — {s.apps[id].code}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
