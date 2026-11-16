import React from 'react';
import { Check, Gamepad2, Code2, GraduationCap } from 'lucide-react';
import { Head, useNav } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 1. Возраст: Kids или Teens, и отметка «14+» — она только для Teens (у Junior IT её можно было
// оставить включённой вместе с Kids 8–10 — здесь выбор Kids её снимает, а отметка включает Teens).
export default function Start({ t, st, set, go, setNav }) {
  const s = t.s1;
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));

  const pickAge = (age) => {
    if (age === st.age) return;
    sfx('pick');
    set({ age, plus14: age === 'kids' ? false : st.plus14 });
  };
  const toggle14 = () => {
    const on = !st.plus14;
    sfx(on ? 'pick' : 'unpick');
    if (on) confetti(0.5, 0.75, 40);
    set({ plus14: on, age: on ? 'teens' : st.age });
  };

  const Card = ({ id, icon, d }) => (
    <button type="button" className={'age-card' + (st.age === id ? ' is-on' : '')} onClick={() => pickAge(id)} aria-pressed={st.age === id}>
      <span className={'age-ic age-ic-' + id} aria-hidden="true"><Art id={'age-' + id} fallback={icon} /></span>
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
        <Card id="kids" icon={<Gamepad2 size={30} />} d={s.kids} />
        <Card id="teens" icon={<Code2 size={30} />} d={s.teens} />
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
