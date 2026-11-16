import React from 'react';
import { Check, Gamepad2, Code2, GraduationCap } from 'lucide-react';
import { Head, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 1. Возраст: Kids или Teens — крупные карточки с иллюстрацией; отметка «14+» — только для Teens
// (выбор Kids её снимает, отметка включает Teens). За первый выбор — монеты, Бип реагирует на каждый.
export default function Start({ t, st, set, setNav, bot, say, award }) {
  const s = t.s1;
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));

  const pickAge = (age, e) => {
    award('age', e.currentTarget);
    if (age === st.age) { say(bot[age]); return; }
    sfx('pick');
    say(bot[age]);
    set({ age, plus14: age === 'kids' ? false : st.plus14 });
  };
  const toggle14 = (e) => {
    const on = !st.plus14;
    sfx(on ? 'pick' : 'unpick');
    if (on) { confetti(0.5, 0.75, 40); say(bot.plus14); award('age', e.currentTarget); }
    set({ plus14: on, age: on ? 'teens' : st.age });
  };

  const Card = ({ id, icon, d }) => (
    <button type="button" className={'age-card tilt age-' + id + (st.age === id ? ' is-on' : '')} onClick={(e) => pickAge(id, e)} aria-pressed={st.age === id}>
      <span className={'age-art age-ic-' + id} aria-hidden="true"><Art id={'age-' + id} fallback={<span className="age-ic-fb">{icon}</span>} /></span>
      <span className="age-tx">
        <span className="age-tag">{d.tag}</span>
        <b>{d.age}</b>
        <span className="age-sub">{d.text}</span>
      </span>
      <span className="tick" aria-hidden="true">{st.age === id ? <Check size={16} strokeWidth={3} /> : null}</span>
    </button>
  );

  return (
    <section className="sl sl-start">
      <Head eyebrow={s.eyebrow} title={s.title} sub={s.ask} />
      <div className="age-grid">
        <Card id="kids" icon={<Gamepad2 size={44} />} d={s.kids} />
        <Card id="teens" icon={<Code2 size={44} />} d={s.teens} />
      </div>
      <button type="button" className={'plus-card' + (st.plus14 ? ' is-on' : '')} onClick={toggle14} aria-pressed={st.plus14}>
        <span className="box" aria-hidden="true">{st.plus14 ? <Check size={15} strokeWidth={3} /> : null}</span>
        <span className="plus-tx">
          <b>{s.plus}</b>
          <span>{s.plusSub}</span>
        </span>
        <span className="plus-tag"><GraduationCap size={14} /> IT Park</span>
      </button>
      {st.plus14 ? <div className="note note-ok"><GraduationCap size={18} /> {s.plusNote}</div> : null}
    </section>
  );
}
