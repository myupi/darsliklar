import React, { useEffect, useRef, useState } from 'react';
import { Check, Star, ScanLine } from 'lucide-react';
import { Head, Task, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 2. Три любимых приложения. Четвёртое не выбирается — карточка вздрагивает, Бип подсказывает.
// «Сканер» сразу показывает, из какого кода сделано выбранное: строки печатаются на глазах (тёмный редактор).
const APPS = [
  ['roblox', '🧱', '#E2231A'], ['minecraft', '⛏️', '#5B8C32'], ['football', '⚽', '#1F6FEB'],
  ['youtube', '▶️', '#FF0033'], ['tiktok', '🎵', '#111111'], ['instagram', '📷', '#C13584'],
];
// Кусочек кода каждого приложения: язык и строки (настоящий синтаксис, упрощённо).
const CODE = {
  roblox: ['Lua', ['local part = Instance.new("Part")', 'part.Color = Color3.new(1, 0, 0)', 'part.Parent = workspace']],
  minecraft: ['Java', ['void onBlockBreak(Block block) {', '  player.give(Item.DIAMOND);', '}']],
  football: ['C++', ['ball.speed += gravity * dt;', 'if (ball.hits(goal)) {', '  score++;', '}']],
  youtube: ['JavaScript', ['video.play();', 'likeButton.onclick = () => {', '  likes++;', '};']],
  tiktok: ['Python · AI', ['feed = model.recommend(user.likes)', 'for video in feed[:10]:', '    show(video)']],
  instagram: ['HTML · CSS', ['<img class="story" src="photo.jpg">', '.story {', '  border-radius: 50%;', '}']],
};

function Typer({ lines }) {
  const all = lines.join('\n');
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(all.length); return undefined; }
    const id = setInterval(() => setN((k) => { if (k >= all.length) { clearInterval(id); return k; } return k + 2; }), 22);
    return () => clearInterval(id);
  }, [all]);
  return <pre className="scan-code">{all.slice(0, n)}<i className={'caret' + (n >= all.length ? ' is-done' : '')} /></pre>;
}

export default function Apps({ t, st, set, setNav, bot, say, award }) {
  const s = t.s2;
  const [shake, setShake] = useState('');
  const [warn, setWarn] = useState(false);
  const wt = useRef(null);
  const factRef = useRef(null);
  const n = st.apps.length;
  useNav(setNav, [st.lang, n], () => ({ label: s.next, ok: n === 3, skip: n < 3 }));

  const toggle = (id) => {
    if (st.apps.includes(id)) { setWarn(false); sfx('unpick'); set({ apps: st.apps.filter((a) => a !== id) }); return; }
    if (n >= 3) { sfx('error'); setShake(id); setTimeout(() => setShake(''), 450); setWarn(true); say(bot.full); clearTimeout(wt.current); wt.current = setTimeout(() => setWarn(false), 2500); return; }
    sfx('pick');
    const apps = st.apps.concat(id);
    if (apps.length === 3) {
      setTimeout(() => confetti(0.5, 0.55), 120);
      setTimeout(() => { say(bot.apps3); award('apps', factRef.current); }, 900);
    } else say(bot.app(s.apps[id].name));
    set({ apps });
  };

  return (
    <section className="sl sl-apps">
      <Head eyebrow={s.eyebrow} title={s.title} />
      <Task right={<span className="stars" aria-label={s.count(n)}>{[0, 1, 2].map((i) => <Star key={i} size={20} className={i < n ? 'on' : ''} />)}</span>}>
        {s.task} · <b>{s.count(n)}</b>
      </Task>
      <div className="app-grid stagger">
        {APPS.map(([id, ic, c]) => {
          const on = st.apps.includes(id);
          const a = s.apps[id];
          return (
            <button key={id} type="button" className={'app-card tilt' + (on ? ' is-on' : '') + (shake === id ? ' is-shake' : '')} onClick={() => toggle(id)} aria-pressed={on}>
              <span className="app-ic" style={{ '--c': c }} aria-hidden="true"><Art id={'app-' + id} fallback={ic} /></span>
              <span className="app-tx"><b>{a.name}</b><span>{a.sub}</span></span>
              <span className="tick" aria-hidden="true">{on ? <Check size={15} strokeWidth={3} /> : null}</span>
            </button>
          );
        })}
      </div>
      {warn ? <div className="note note-warn">{s.full}</div> : null}
      {n ? (
        <div className={'scan' + (n === 3 ? ' is-full' : '')} ref={factRef}>
          <div className="scan-h"><ScanLine size={18} /> {n === 3 ? s.factTitle : s.factText}</div>
          <div className="scan-grid">
            {st.apps.map((id) => (
              <div key={id} className="scan-item">
                <div className="scan-top"><span className="scan-ic"><Art id={'app-' + id} fallback={null} /></span><b>{s.apps[id].name}</b><span className="scan-lang">{CODE[id][0]}</span></div>
                <Typer lines={CODE[id][1]} />
                <small>{s.apps[id].code}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
