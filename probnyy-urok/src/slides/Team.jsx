import React from 'react';
import { Video, Laptop, Coins, MessageCircle, CalendarCheck } from 'lucide-react';
import { Head, useNav } from '../ui/kit.jsx';
import Art from '../ui/Art.jsx';

// Слайд 3. Ментор и куратор, и как проходит неделя. Лица — без фотографий: значок роли в круге.
export default function Team({ t, st, setNav }) {
  const s = t.s3;
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));
  const Person = ({ d, ic, cls, art }) => (
    <div className={'person ' + cls}>
      <span className="person-av" aria-hidden="true"><Art id={art} fallback={ic} /></span>
      <div>
        <span className="person-role">{d.role}</span>
        <b>{d.name}</b>
        <p>{d.text}</p>
      </div>
    </div>
  );
  const HOW = [<Video size={20} key="v" />, <Laptop size={20} key="l" />, <Coins size={20} key="c" />];
  return (
    <section className="sl sl-team">
      <Head eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
      <div className="people">
        <Person d={s.mentor} ic={<MessageCircle size={30} />} cls="is-mentor" art="mentor" />
        <Person d={s.curator} ic={<CalendarCheck size={30} />} cls="is-curator" art="curator" />
      </div>
      <div className="how">
        <div className="how-h">{s.howTitle}</div>
        <ol>
          {s.how.map((h, i) => (
            <li key={i}><span className="how-ic">{HOW[i]}</span><span><b>{h.t}</b><small>{h.d}</small></span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
