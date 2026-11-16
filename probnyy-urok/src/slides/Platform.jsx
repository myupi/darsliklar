import React, { useRef, useState } from 'react';
import { Home, BookOpen, Gift, Award, Flame, Coins, Zap, Check, ChevronRight, Rocket, Code2, Calculator, Languages } from 'lucide-react';
import { Head, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 4. Платформа — пример с данными для знакомства: главная, курсы (у каждого — своё окно с примером),
// CoinShop (цель-подарок; выбор попадает в итог на финале), сертификаты.
const GIFTS = [['vr', '🥽', 900], ['phone', '📱', 2500], ['laptop', '💻', 4000], ['ultrabook', '💻', 3500], ['tablet', '📲', 1800], ['speaker', '🔊', 700], ['headphones', '🎧', 600], ['keyboard', '⌨️', 800]];
const COURSES = [['kids', Rocket, '#7C5CFA'], ['web', Code2, '#FA4F28'], ['math', Calculator, '#0FA38E'], ['eng', Languages, '#E6A100']];

export default function Platform({ t, st, set, setNav, bot, say, award }) {
  const s = t.s4;
  const [tab, setTab] = useState('home');
  const [course, setCourse] = useState(null);
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));
  const open = (id) => { sfx('click'); setTab('courses'); setCourse(id); };
  const TABS = [['home', Home], ['courses', BookOpen], ['shop', Gift], ['certs', Award]];

  return (
    <section className="sl sl-platform">
      <Head eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
      <div className="lms">
        <nav className="lms-nav" aria-label="LMS">
          {TABS.map(([id, Ic]) => (
            <button key={id} type="button" className={tab === id ? 'is-on' : ''} onClick={() => { sfx('click'); setTab(id); if (id !== 'courses') setCourse(null); }}>
              <Ic size={17} /> <span>{s.tabs[id]}</span>
            </button>
          ))}
        </nav>
        <div className="lms-body">
          <div className="lms-demo">{s.demo}</div>
          {tab === 'home' ? <HomeTab s={s} st={st} open={open} bot={bot} /> : null}
          {tab === 'courses' ? <CoursesTab s={s} course={course} setCourse={setCourse} bot={bot} say={say} award={award} /> : null}
          {tab === 'shop' ? <ShopTab s={s} st={st} set={set} bot={bot} say={say} award={award} /> : null}
          {tab === 'certs' ? <CertsTab s={s} /> : null}
        </div>
      </div>
    </section>
  );
}

function HomeTab({ s, st, open, bot }) {
  const goal = st.goal ? s.gifts[st.goal] : null;
  return (
    <div className="lms-home">
      <div className="lms-hero">
        <div><small>{s.hello}</small><b>{s.helloSub}</b></div>
        <div className="lms-stats">
          <span className="lms-coins"><span className="coin sm" /> {st.coins} {s.coins}</span>
          <span><Flame size={16} /> 3 {s.streak}</span>
          <span><Zap size={16} /> 120 {s.points}</span>
        </div>
      </div>
      {goal ? <div className="lms-goal"><Gift size={16} /> {s.goal}: <b>{goal}</b></div> : null}
      <div className="lms-h">{s.myCourses}</div>
      <div className="lms-courses stagger">
        {COURSES.map(([id, Ic, c]) => (
          <button key={id} type="button" className="lms-course tilt" style={{ '--c': c }} onClick={() => open(id)}>
            <Art id={'course-' + id} className="lms-cover" />
            <span className="lms-course-ic"><Ic size={22} /></span>
            <b>{s.courses[id].name}</b>
            <small>{s.courses[id].sub}</small>
            <span className="lms-open">{s.open} <ChevronRight size={14} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CoursesTab({ s, course, setCourse, bot, say, award }) {
  const cur = course || 'kids';
  const d = s.courses[cur];
  return (
    <div className="lms-cw">
      <div className="lms-ctabs">
        {COURSES.map(([id, Ic, c]) => (
          <button key={id} type="button" className={cur === id ? 'is-on' : ''} style={{ '--c': c }} onClick={() => { sfx('click'); setCourse(id); }}>
            <Ic size={16} /> {s.courses[id].name}
          </button>
        ))}
      </div>
      <div className="lms-cpanel" key={cur}>
        <Art id={'course-' + cur} className="lms-cover lms-cover-big" />
        <b className="lms-cname">{d.name}</b> <small>{d.sub}</small>
        {cur === 'math' ? <MathTask d={d} bot={bot} say={say} award={award} /> : cur === 'eng' ? <EngCards d={d} bot={bot} say={say} award={award} /> : (
          <ol className="lms-steps stagger">{d.items.map((x, i) => <li key={i}><span>{i + 1}</span>{x}</li>)}</ol>
        )}
      </div>
    </div>
  );
}

function MathTask({ d, bot, say, award }) {
  const [pick, setPick] = useState(null);
  const ok = pick === '32';
  return (
    <div className="math">
      <div className="math-q">2 → 4 → 8 → 16 → <span>?</span></div>
      <p>{d.q}</p>
      <div className="math-opts">
        {d.opts.map((o) => (
          <button key={o} type="button" className={pick === o ? (o === '32' ? 'is-ok' : 'is-no') : ''} onClick={(e) => { setPick(o); sfx(o === '32' ? 'win' : 'error'); if (o === '32') { confetti(0.5, 0.6, 40); say(bot.mathOk); award('math', e.currentTarget); } else say(bot.mathNo); }}>{o}</button>
        ))}
      </div>
      {pick ? <div className={'note ' + (ok ? 'note-ok' : 'note-warn')}>{ok ? d.ok : d.no}</div> : null}
    </div>
  );
}

function EngCards({ d, bot, say, award }) {
  const [flip, setFlip] = useState({});
  const seen = useRef(new Set());
  return (
    <div className="eng">
      <small>{d.hint}</small>
      <div className="eng-row">
        {d.words.map(([en, tr]) => (
          <button key={en} type="button" className={'eng-card' + (flip[en] ? ' is-flip' : '')} onClick={(e) => { sfx('click'); seen.current.add(en); setFlip(Object.assign({}, flip, { [en]: !flip[en] })); if (d.words.every(([w]) => seen.current.has(w))) { const el = e.currentTarget; setTimeout(() => { say(bot.eng); award('eng', el); }, 300); } }}>
            <span className="eng-f"><b>{en}</b></span>
            <span className="eng-b">{tr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShopTab({ s, st, set, bot, say, award }) {
  return (
    <div className="shop">
      <b className="shop-h">{s.shopTitle}</b>
      <small>{s.shopSub}</small>
      <div className="shop-grid stagger">
        {GIFTS.map(([id, ic, price]) => (
          <button key={id} type="button" className={'gift tilt' + (st.goal === id ? ' is-on' : '')} onClick={(e) => { sfx('pick'); set({ goal: st.goal === id ? null : id }); if (st.goal !== id) { confetti(0.5, 0.6, 30); say(bot.goal(s.gifts[id])); award('goal', e.currentTarget); } }} aria-pressed={st.goal === id}>
            <span className="gift-ic" aria-hidden="true"><Art id={'gift-' + id} fallback={ic} /></span>
            <b>{s.gifts[id]}</b>
            <small><Coins size={12} /> {price}</small>
            {st.goal === id ? <span className="tick"><Check size={14} strokeWidth={3} /></span> : null}
          </button>
        ))}
      </div>
      <div className="shop-goal">
        <span>{s.goal}: <b>{st.goal ? s.gifts[st.goal] : s.noGoal}</b></span>
        {st.goal ? (() => { const price = GIFTS.find((g) => g[0] === st.goal)[2]; const p = Math.min(100, Math.round((st.coins / price) * 100)); return (
          <span className="goal-bar"><span className="goal-fill" style={{ width: Math.max(2, p) + '%' }} /><small><span className="coin sm" /> {st.coins} / {price}</small></span>
        ); })() : null}
      </div>
    </div>
  );
}

function CertsTab({ s }) {
  const rows = [['HTML', 100], ['CSS', 100], ['JavaScript', 40]];
  return (
    <div className="certs">
      <b className="shop-h">{s.certsTitle}</b>
      {rows.map(([n, p]) => (
        <div key={n} className="cert">
          <span className="cert-ic"><Award size={20} /></span>
          <span className="cert-n"><b>{n}</b><small>{p === 100 ? s.certDone : s.certNow}</small></span>
          <span className="cert-bar"><i style={{ width: p + '%' }} /></span>
          <span className="cert-p">{p}%</span>
        </div>
      ))}
    </div>
  );
}
