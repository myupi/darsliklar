import React from 'react';
import { CheckCircle2, RotateCcw, Eye, Wrench } from 'lucide-react';
import { Head, useNav, LINK_AFTER } from '../ui/kit.jsx';
import { sfx, confetti } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 6. «Один год — два результата»: потреблять или создавать. Итог урока — что ученик сделал сегодня.
// Главная кнопка следует выбору (у Junior IT она всегда звала «создавать», даже если выбрано «потреблять»).
export default function Final({ t, st, set, restart, setNav }) {
  const s = t.s6;
  const create = st.path !== 'consume';
  useNav(setNav, [st.lang, st.path], () => ({
    label: create ? s.ctaCreate : s.ctaConsume,
    ok: true,
    onNext: () => {
      if (!create) { sfx('click'); set({ path: 'create' }); return; }
      sfx('win'); confetti(0.5, 0.7, 90);
      setTimeout(() => { window.location.href = LINK_AFTER; }, 900);
    },
  }));
  const pick = (p) => { sfx('pick'); set({ path: p }); };
  const sum = [
    s.sumAge(st.age === 'kids' ? 'Kids' : 'Teens'),
    st.apps.length ? s.sumApps(st.apps.length) : null,
    st.goal ? s.sumGoal(t.s4.gifts[st.goal]) : null,
    st.practiced ? s.sumPractice : null,
  ].filter(Boolean);

  const Side = ({ id, d, Ic }) => (
    <button type="button" className={'path path-' + id + ((id === 'create') === create ? ' is-on' : '')} onClick={() => pick(id)} aria-pressed={(id === 'create') === create}>
      <Art id={'final-' + id} className="path-art" />
      <span className="path-tag"><Ic size={16} /> {d.tag}</span>
      <b>{d.lead}</b>
      <ul>{d.items.map((x) => <li key={x}>{x}</li>)}</ul>
    </button>
  );

  return (
    <section className="sl sl-final">
      <Head eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
      <div className="paths">
        <Side id="consume" d={s.consume} Ic={Eye} />
        <span className="paths-vs">VS</span>
        <Side id="create" d={s.create} Ic={Wrench} />
      </div>
      <div className="summary">
        <b>{s.summary}</b>
        <ul>{sum.map((x) => <li key={x}><CheckCircle2 size={18} /> {x}</li>)}</ul>
        <button type="button" className="btn-ghost" onClick={() => { sfx('click'); restart(); }}><RotateCcw size={16} /> {s.restart}</button>
      </div>
    </section>
  );
}
