import React, { useEffect, useRef, useState } from 'react';
import { Code2, Puzzle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Repeat, Zap, Play, Trash2, RotateCcw } from 'lucide-react';
import { Head, Task, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 5. Практика: «Веб-студия» (Teens) и «Лабиринт» (Kids). Возраст выбирает, какая открыта сначала;
// вторая — на соседней вкладке. Любая доведённая до конца практика отмечается в итоге на финале.
export default function Practice({ t, st, set, setNav }) {
  const s = t.s5;
  const [tab, setTab] = useState(st.age === 'kids' ? 'maze' : 'web');
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));
  const done = () => { if (!st.practiced) set({ practiced: true }); };
  return (
    <section className="sl sl-practice">
      <div className="pr-top">
        <span className="chip">{s.eyebrow}</span>
        <div className="seg" role="tablist">
          {[['web', Code2], ['maze', Puzzle]].map(([id, Ic]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => { sfx('click'); setTab(id); }}>
              <Ic size={16} /> {s.tabs[id]}
            </button>
          ))}
        </div>
      </div>
      {tab === 'web' ? <WebStudio s={s.web} done={done} /> : <Maze s={s.maze} done={done} />}
    </section>
  );
}

// ─── Веб-студия ────────────────────────────────────────────────────────────
const COLORS = ['#FA4F28', '#0FA38E', '#7C5CFA', '#E6A100', '#E2366F'];
const QUICK_ICONS = ['🤖', '🚀', '⚽'];

function WebStudio({ s, done }) {
  const [layer, setLayer] = useState('html');           // html | css | js — слои добавляются по порядку
  const [title, setTitle] = useState('');
  const [slogan, setSlogan] = useState('');
  const [btn, setBtn] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [radius, setRadius] = useState(12);
  const [players, setPlayers] = useState(0);
  const [icon, setIcon] = useState('🏆');
  const L = { html: 1, css: 2, js: 3 }[layer];
  const T1 = title.trim() || s.defTitle, S1 = slogan.trim() || s.defSlogan, B1 = btn.trim() || s.defBtn;

  const quick = (i) => { sfx('pick'); setTitle(s.quick[i]); setIcon(QUICK_ICONS[i]); };
  const press = () => {
    if (L < 3) return;                                   // без JS кнопка на странице ничего не делает
    sfx('win'); confetti(0.72, 0.5, 60);
    setPlayers((p) => p + 1); done();
  };
  const Line = ({ n, children, dim }) => <div className={'ed-ln' + (dim ? ' is-dim' : '')}><span className="ed-n">{n}</span><span className="ed-c">{children}</span></div>;
  const Tag = ({ c }) => <span className="tk-t">{c}</span>;

  return (
    <div className="web">
      <Head eyebrow={null} title={s.title} />
      <Task>{s.task}</Task>
      <div className="layers">
        {['html', 'css', 'js'].map((id, i) => (
          <button key={id} type="button" className={'layer layer-' + id + (L > i ? ' is-on' : '')} onClick={() => { sfx('click'); setLayer(id); }} aria-pressed={layer === id}>
            <span className="layer-n">{i + 1}</span> {s.layers[id]}
          </button>
        ))}
      </div>
      <div className="note note-info">{s.layerNote[layer]}</div>
      <div className="web-grid">
        {/* Редактор кода — тёмный, как VS Code; поля ввода — прямо в строках кода. */}
        <div className="ed">
          <div className="ed-tabs"><span className="is-on">index.html</span><span className={L < 2 ? 'is-off' : ''}>style.css</span><span className={L < 3 ? 'is-off' : ''}>script.js</span></div>
          <div className="ed-body">
            <div className="ed-sec">HTML</div>
            <Line n={1}><Tag c="<h1>" /><input className="ed-in" value={title} placeholder={s.defTitle} onChange={(e) => setTitle(e.target.value)} aria-label={s.titleL} maxLength={40} /><Tag c="</h1>" /></Line>
            <div className="ed-chips">{s.quick.map((q, i) => <button key={q} type="button" onClick={() => quick(i)}>{QUICK_ICONS[i]} {q}</button>)}</div>
            <Line n={2}><Tag c="<p>" /><input className="ed-in" value={slogan} placeholder={s.defSlogan} onChange={(e) => setSlogan(e.target.value)} aria-label={s.sloganL} maxLength={50} /><Tag c="</p>" /></Line>
            <Line n={3}><Tag c="<button>" /><input className="ed-in" value={btn} placeholder={s.defBtn} onChange={(e) => setBtn(e.target.value)} aria-label={s.btnL} maxLength={24} /><Tag c="</button>" /></Line>
            <div className={'ed-sec' + (L < 2 ? ' is-dim' : '')}>CSS</div>
            <Line n={4} dim={L < 2}><span className="tk-s">button</span> {'{'}</Line>
            <Line n={5} dim={L < 2}>&nbsp;&nbsp;<span className="tk-p">background</span>: <span className="tk-v">{color}</span>;</Line>
            <div className={'ed-sw' + (L < 2 ? ' is-dim' : '')}>{COLORS.map((c) => <button key={c} type="button" disabled={L < 2} className={c === color ? 'is-on' : ''} style={{ background: c }} onClick={() => { sfx('click'); setColor(c); }} aria-label={s.colorL + ' ' + c} />)}</div>
            <Line n={6} dim={L < 2}>&nbsp;&nbsp;<span className="tk-p">border-radius</span>: <span className="tk-v">{radius}px</span>;</Line>
            <div className={'ed-range' + (L < 2 ? ' is-dim' : '')}><input type="range" min={0} max={28} value={radius} disabled={L < 2} onChange={(e) => setRadius(+e.target.value)} aria-label={s.radiusL} /></div>
            <Line n={7} dim={L < 2}>{'}'}</Line>
            <div className={'ed-sec' + (L < 3 ? ' is-dim' : '')}>JavaScript</div>
            <Line n={8} dim={L < 3}><span className="tk-p">button</span>.<span className="tk-f">onclick</span> = () =&gt; {'{'}</Line>
            <Line n={9} dim={L < 3}>&nbsp;&nbsp;<span className="tk-p">players</span>++; <span className="tk-f">salute</span>();</Line>
            <Line n={10} dim={L < 3}>{'};'}</Line>
          </div>
        </div>

        {/* Браузер — Chrome: вкладка с названием страницы и адрес. */}
        <div className="chrome">
          <div className="chrome-bar">
            <span className="chrome-dots"><i /><i /><i /></span>
            <span className="chrome-tab">{icon} {T1}</span>
          </div>
          <div className="chrome-url">turnir.junior-it.uz</div>
          <div className={'site site-l' + L} style={{ '--c': color, '--rad': radius + 'px' }}>
            <h1>{L > 1 ? <span className="site-ic">{icon}</span> : null}{T1}</h1>
            <p>{S1}</p>
            <button type="button" onClick={press}>{B1}</button>
            {L === 3 ? <div className="site-players">{players ? s.players(players) : s.clickMe}</div> : null}
            <div className="site-heroes">
              {s.heroes.map(([n, r], i) => (
                <div key={n} className="hero"><span className="hero-av"><Art id={['hero-steve', 'hero-roblox', 'hero-ender'][i]} fallback={['⛏️', '🏃', '🟣'][i]} /></span><b>{n}</b><small>{r}</small></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {players ? <div className="note note-ok">{s.done}</div> : null}
    </div>
  );
}

// ─── Лабиринт ──────────────────────────────────────────────────────────────
// Поле: стены обходят, лаву перепрыгивают (прыжок — на 2 клетки, только через лаву), монеты — бонус.
// Уровень 2 учит повторам (программа не длиннее 6 блоков), уровень 3 — прыжкам.
const LEVELS = [
  { size: 4, start: [3, 0], goal: [0, 3], walls: [[2, 1], [1, 2], [3, 2]], lava: [], coins: [[0, 1]], max: 8 },
  { size: 5, start: [4, 0], goal: [0, 4], walls: [[3, 1], [3, 2], [2, 2], [1, 1], [1, 2], [0, 1]], lava: [], coins: [[4, 2], [2, 4]], max: 6 },
  { size: 6, start: [5, 0], goal: [0, 5], walls: [[4, 1], [4, 2], [3, 3], [2, 2], [1, 1], [1, 3], [2, 4], [4, 4]], lava: [[5, 2], [2, 5]], coins: [[5, 1], [3, 5]], max: 8 },
];
const DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const DIR_IC = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };
const has = (list, r, c) => list.some(([a, b]) => a === r && b === c);

function Maze({ s, done }) {
  const [lv, setLv] = useState(0);
  const [prog, setProg] = useState([]);                // [{ dir, rep, jump }]
  const [mod, setMod] = useState(null);                // 2 | 3 | 'jump' — ждёт направления
  const [pos, setPos] = useState(LEVELS[0].start);
  const [got, setGot] = useState([]);
  const [msg, setMsg] = useState(null);                // { kind: 'err'|'ok'|'info', text }
  const [run, setRun] = useState(false);
  const [won, setWon] = useState([]);                  // пройденные уровни
  const timer = useRef(null);
  // Программа и модификатор — ещё и в ref: нажатия подряд (быстрее перерисовки) не теряют блоки.
  const progRef = useRef([]); const modRef = useRef(null);
  const setP = (v) => { progRef.current = v; setProg(v); };
  const setM = (v) => { modRef.current = v; setMod(v); };
  const L = LEVELS[lv];

  useEffect(() => () => clearTimeout(timer.current), []);
  const reset = (n = lv) => { clearTimeout(timer.current); setRun(false); setPos(LEVELS[n].start); setGot([]); setMsg(null); setM(null); };
  const goLevel = (n) => { sfx('click'); setLv(n); setP([]); reset(n); };

  const add = (dir) => {
    if (run) return;
    const cur = progRef.current, m = modRef.current;
    if (cur.length >= L.max) { sfx('error'); setMsg({ kind: 'err', text: s.msg.full }); return; }
    sfx('click');
    setP(cur.concat({ dir, rep: typeof m === 'number' ? m : 1, jump: m === 'jump' }));
    setM(null); setMsg(null);
  };
  const pickMod = (m) => { if (run) return; sfx('click'); setM(modRef.current === m ? null : m); };

  const start = () => {
    if (run) return;
    const prog = progRef.current;
    if (!prog.length) { sfx('error'); setMsg({ kind: 'err', text: s.msg.empty }); return; }
    // Разворачиваем программу в шаги и проигрываем по одному.
    const steps = [];
    prog.forEach((b) => { for (let i = 0; i < b.rep; i += 1) steps.push(b); });
    let [r, c] = L.start; let coins = []; let i = 0;
    setPos(L.start); setGot([]); setRun(true); setMsg({ kind: 'info', text: s.running });
    const fail = (key) => {
      sfx('error'); setMsg({ kind: 'err', text: s.msg[key] });
      timer.current = setTimeout(() => { setPos(L.start); setGot([]); setRun(false); }, 900);
    };
    const tick = () => {
      if (i >= steps.length) { fail('short'); return; }
      const b = steps[i]; i += 1;
      const [dr, dc] = DIRS[b.dir];
      let nr = r + dr, nc = c + dc;
      if (b.jump) {
        if (nr < 0 || nc < 0 || nr >= L.size || nc >= L.size) { fail('edge'); return; }
        if (has(L.walls, nr, nc)) { fail('wall'); return; }
        nr += dr; nc += dc;
      }
      if (nr < 0 || nc < 0 || nr >= L.size || nc >= L.size) { fail('edge'); return; }
      if (has(L.walls, nr, nc)) { fail('wall'); return; }
      if (has(L.lava, nr, nc)) { setPos([nr, nc]); fail('lava'); return; }
      r = nr; c = nc; setPos([r, c]); sfx('step');
      if (has(L.coins, r, c) && !coins.some(([a, b2]) => a === r && b2 === c)) { coins = coins.concat([[r, c]]); setGot(coins); sfx('coin'); }
      if (r === L.goal[0] && c === L.goal[1]) {
        setRun(false); sfx('win'); confetti(0.5, 0.55);
        const all = won.includes(lv) ? won : won.concat(lv);
        setWon(all); done();
        setMsg({ kind: 'ok', text: all.length === LEVELS.length ? s.msg.winAll : s.msg.win });
        return;
      }
      timer.current = setTimeout(tick, 320);
    };
    timer.current = setTimeout(tick, 250);
  };

  const cell = (r, c) => {
    const isPos = pos[0] === r && pos[1] === c;
    let cls = 'mz-c', ic = null;
    if (has(L.walls, r, c)) cls += ' is-wall';
    else if (has(L.lava, r, c)) { cls += ' is-lava'; ic = '🔥'; }
    else if (L.goal[0] === r && L.goal[1] === c) { cls += ' is-goal'; ic = <span className="mz-portal"><Art id="maze-portal" fallback="🌀" /></span>; }
    else if (has(L.coins, r, c) && !has(got, r, c)) ic = <span className="coin" aria-label="coin" />;
    return <div key={r + '-' + c} className={cls}>{isPos ? <span className="mz-bot"><Art id="maze-robot" fallback="🤖" /></span> : ic}</div>;
  };

  return (
    <div className="maze">
      <Head eyebrow={null} title={s.title} />
      <Task right={<span className="mz-coins"><span className="coin sm" /> {got.length} / {L.coins.length}</span>}>{s.task}</Task>
      <div className="mz-levels">
        {s.levels.map((n, i) => (
          <button key={n} type="button" className={(lv === i ? 'is-on' : '') + (won.includes(i) ? ' is-won' : '')} onClick={() => goLevel(i)}>{won.includes(i) ? '✓ ' : ''}{n}</button>
        ))}
      </div>
      <div className="mz-grid-wrap">
        <div className="mz-board" style={{ gridTemplateColumns: `repeat(${L.size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${L.size}, minmax(0, 1fr))` }}>
          {Array.from({ length: L.size }).map((_, r) => Array.from({ length: L.size }).map((__, c) => cell(r, c)))}
        </div>
        <div className="mz-side">
          <div className="mz-legend"><span><span className="coin sm" /> {s.legend.coin}</span><span><i className="lg-wall" /> {s.legend.wall}</span>{L.lava.length ? <span>🔥 {s.legend.lava}</span> : null}<span>🌀 {s.legend.portal}</span></div>
          <div className="mz-h">{s.moves}</div>
          <div className="mz-blocks">
            {['up', 'down', 'left', 'right'].map((d) => { const Ic = DIR_IC[d]; return <button key={d} type="button" className="blk blk-move" onClick={() => add(d)} disabled={run}><Ic size={16} /> {s[d]}</button>; })}
          </div>
          {lv > 0 ? (
            <>
              <div className="mz-h">{s.tricks}</div>
              <div className="mz-blocks">
                <button type="button" className={'blk blk-rep' + (mod === 2 ? ' is-on' : '')} onClick={() => pickMod(2)} disabled={run}><Repeat size={15} /> 2×</button>
                <button type="button" className={'blk blk-rep' + (mod === 3 ? ' is-on' : '')} onClick={() => pickMod(3)} disabled={run}><Repeat size={15} /> 3×</button>
                {lv > 1 ? <button type="button" className={'blk blk-jump' + (mod === 'jump' ? ' is-on' : '')} onClick={() => pickMod('jump')} disabled={run}><Zap size={15} /> {s.jump}</button> : null}
              </div>
              {mod ? <div className="mz-hint">{mod === 'jump' ? s.jumpHint : s.repeatHint}</div> : null}
            </>
          ) : null}
          <div className="mz-prog">
            <div className="mz-prog-h">{s.program} <span>{prog.length} / {L.max}</span></div>
            {prog.length ? (
              <div className="mz-stack">
                {prog.map((b, i) => { const Ic = DIR_IC[b.dir]; return (
                  <button key={i} type="button" className={'chip-blk' + (b.jump ? ' is-jump' : b.rep > 1 ? ' is-rep' : '')} onClick={() => { if (!run) { sfx('unpick'); setP(progRef.current.filter((_, k) => k !== i)); } }} title="×">
                    {b.rep > 1 ? b.rep + '× ' : ''}{b.jump ? <Zap size={13} /> : null}<Ic size={14} />
                  </button>
                ); })}
              </div>
            ) : <div className="mz-empty">{s.empty}</div>}
          </div>
          <div className="mz-run">
            <button type="button" className="btn-ghost" onClick={() => { sfx('unpick'); setP([]); reset(); }} disabled={run}><Trash2 size={16} /> {s.clear}</button>
            <button type="button" className="btn-main sm" onClick={start} disabled={run}><Play size={16} /> {s.run}</button>
          </div>
          {msg ? <div className={'note ' + (msg.kind === 'ok' ? 'note-ok' : msg.kind === 'err' ? 'note-warn' : 'note-info')}>{msg.text}</div> : null}
          {msg && msg.kind === 'ok' ? (
            <div className="mz-run">
              <button type="button" className="btn-ghost" onClick={() => { setP([]); reset(); }}><RotateCcw size={16} /> {s.again}</button>
              {lv < LEVELS.length - 1 ? <button type="button" className="btn-main sm" onClick={() => goLevel(lv + 1)}>{s.nextLevel}</button> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
