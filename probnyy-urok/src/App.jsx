import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { T } from './i18n.js';
import { BOT } from './i18n-bot.js';
import { Ambient, flyCoin, useTilt } from './ui/live.jsx';
import { sfx, setSound } from './ui/fx.js';
import Start from './slides/Start.jsx';
import Apps from './slides/Apps.jsx';
import Team from './slides/Team.jsx';
import Platform from './slides/Platform.jsx';
import Practice from './slides/Practice.jsx';
import Final from './slides/Final.jsx';

// Пробный урок Junior IT: 6 слайдов, ведёт живой ментор (голоса нет). Шапка и низ — как у пробного урока
// Junior IT (junior-12-yosh.vercel.app), содержимое между ними — в облике наших уроков (стол в точку, белые
// карточки, оранжевый акцент, тёмный редактор и Chrome в практике).
// Выбор ученика хранится в браузере: перезагрузка страницы не сбрасывает урок.

const KEY = 'probnyy-urok:v1';
const SLIDES = [Start, Apps, Team, Platform, Practice, Final];
const INITIAL = { lang: 'ru', slide: 0, age: 'teens', plus14: false, apps: [], goal: null, practiced: false, sound: true, path: 'create', coins: 0, earned: [] };
const COIN_MAX = 50;   // Junior Coins за урок: по 5 за действие, 10 действий

function load() {
  try {
    const q = new URLSearchParams(window.location.search);
    const s = Object.assign({}, INITIAL, JSON.parse(window.localStorage.getItem(KEY) || '{}'));
    if (q.get('lang') === 'uz' || q.get('lang') === 'ru') s.lang = q.get('lang');
    if (q.get('slide')) s.slide = Math.max(0, Math.min(SLIDES.length - 1, +q.get('slide') - 1 || 0));
    return s;
  } catch (e) { return INITIAL; }
}

export default function App() {
  const [st, setSt] = useState(load);
  const set = (patch) => setSt((o) => Object.assign({}, o, typeof patch === 'function' ? patch(o) : patch));
  const t = T[st.lang];
  const bot = BOT[st.lang];
  useTilt();

  // Робота-помощника внизу убрали (заказчик, 16.11.2026: «убери робота снизу») — реплики слайдов больше не показываются.
  const say = () => {};
  // Монеты: каждое действие (key) — один раз; монета летит от элемента el в счётчик шапки.
  const awarded = useRef(null);
  if (!awarded.current) awarded.current = { keys: new Set(st.earned), coins: st.coins };
  const award = (key, el, n = 5) => {
    const A = awarded.current;
    if (A.keys.has(key) || A.coins >= COIN_MAX) return;
    A.keys.add(key); A.coins = Math.min(COIN_MAX, A.coins + n);
    set((o) => ({ coins: Math.min(COIN_MAX, o.coins + n), earned: o.earned.concat(key) }));
    flyCoin(el, n);
    setTimeout(() => sfx('coin'), 650);
  };

  useEffect(() => { try { window.localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* без хранилища — урок с начала */ } }, [st]);
  useEffect(() => { setSound(st.sound); }, [st.sound]);
  useEffect(() => { document.documentElement.lang = st.lang; document.title = t.title; }, [st.lang, t.title]);

  const go = (n) => {
    const to = Math.max(0, Math.min(SLIDES.length - 1, n));
    if (to === st.slide) return;
    sfx('click');
    set({ slide: to });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const restart = () => { awarded.current = { keys: new Set(), coins: 0 }; set(Object.assign({}, INITIAL, { lang: st.lang, sound: st.sound })); window.scrollTo({ top: 0 }); };

  const Slide = SLIDES[st.slide];
  const pct = Math.round((st.slide / (SLIDES.length - 1)) * 100);
  // У каждого слайда своя главная кнопка (текст и доступность) — слайд сообщает её через nav.
  const [nav, setNav] = useState({ label: '', ok: true, onNext: null, skip: false });

  return (
    <div className="app">
      <header className="hud">
        <div className="hud-in">
          <div className="hud-logo" aria-label="Junior IT">
            <span className="hud-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="30" height="30"><path d="M5 9 9 3l5 5h4l5-5 4 6v11a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9Z" fill="#FA4F28" /><circle cx="12" cy="17" r="2.2" fill="#fff" /><circle cx="20" cy="17" r="2.2" fill="#fff" /><path d="M13 22h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
            <span className="hud-word"><b>junior</b><small>academy</small></span>
          </div>
          <span className="hud-pill"><span className="hud-pill-l">{t.slide} </span>{st.slide + 1} / {SLIDES.length}</span>
          <div className="hud-prog" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <i style={{ width: pct + '%' }} />
          </div>
          <span className="hud-pct">{pct}%</span>
          <span className="hud-coins" title={bot.coinsTitle} aria-label={bot.coinsTitle + ': ' + st.coins}><span className="coin sm" aria-hidden="true" /> {st.coins}</span>
          <div className="hud-lang" role="radiogroup" aria-label="Til / Язык">
            {['ru', 'uz'].map((l) => (
              <button key={l} type="button" role="radio" aria-checked={st.lang === l} className={st.lang === l ? 'is-on' : ''} onClick={() => { sfx('click'); set({ lang: l }); }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button type="button" className="hud-sound" onClick={() => set({ sound: !st.sound })} aria-label={st.sound ? t.soundOn : t.soundOff} title={st.sound ? t.soundOn : t.soundOff}>
            {st.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <main className="desk">
        <Ambient />
        <div className="desk-in" key={st.slide}>
          <Slide t={t} lang={st.lang} st={st} set={set} go={go} restart={restart} setNav={setNav} bot={bot} say={say} award={award} coinMax={COIN_MAX} />
        </div>
      </main>

      <footer className="foot">
        <div className="foot-in">
          <div className="foot-left">
            {st.slide > 0 ? (
              <button type="button" className="btn-back" onClick={() => go(st.slide - 1)}><ChevronLeft size={18} /> <span className="btn-back-t">{t.back}</span></button>
            ) : null}
          </div>
          <div className="foot-right">
            {nav.skip && st.slide < SLIDES.length - 1 ? (
              <button type="button" className="btn-skip" onClick={() => go(st.slide + 1)}>{t.skip}</button>
            ) : null}
            {nav.label ? (
              <button type="button" className="btn-main" disabled={!nav.ok} onClick={() => (nav.onNext ? nav.onNext() : go(st.slide + 1))}>
                {nav.label} <ChevronRight size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
