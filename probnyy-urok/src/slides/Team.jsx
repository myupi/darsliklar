import React, { useEffect, useRef, useState } from 'react';
import { Video, Laptop, Coins, MessageCircle, CalendarCheck, MessagesSquare } from 'lucide-react';
import { Head, useNav } from '../ui/kit.jsx';
import { sfx } from '../ui/fx.js';
import Art from '../ui/Art.jsx';

// Слайд 3. Ментор и куратор — крупные портреты; рядом живой мини-чат группы: ученик пишет, что кнопка не
// работает, ментор находит ошибку в коде, куратор напоминает об уроке. Сообщения приходят по одному.
function Chat({ bot, s, onDone }) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(null);
  const box = useRef(null);
  useEffect(() => {
    const msgs = bot.chat;
    let i = 0; const tms = [];
    const next = () => {
      if (i >= msgs.length) { setTyping(null); onDone(); return; }
      const who = msgs[i][0];
      setTyping(who);
      tms.push(setTimeout(() => { i += 1; setShown(i); setTyping(null); sfx(who === 'me' ? 'click' : 'pick'); tms.push(setTimeout(next, 650)); }, who === 'me' ? 800 : 1300));
    };
    tms.push(setTimeout(next, 700));
    return () => tms.forEach(clearTimeout);
  }, [bot]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const b = box.current; if (b) b.scrollTop = b.scrollHeight; }, [shown, typing]);
  const NAME = { me: bot.you, mentor: s.mentor.role, curator: s.curator.role };
  const AV = { mentor: 'mentor', curator: 'curator' };
  return (
    <div className="chat">
      <div className="chat-h"><MessagesSquare size={17} /> {bot.chatTitle}<span className="chat-dot" /></div>
      <div className="chat-body" ref={box}>
        {bot.chat.slice(0, shown).map(([who, text, code], i) => (
          <div key={i} className={'msg msg-' + who}>
            {who !== 'me' ? <span className="msg-av"><Art id={AV[who]} fallback={null} /></span> : null}
            <div className="msg-b">
              <small>{NAME[who]}</small>
              {text}
              {code ? <code className="msg-code">{code}</code> : null}
            </div>
          </div>
        ))}
        {typing ? (
          <div className={'msg msg-' + typing}>
            {typing !== 'me' ? <span className="msg-av"><Art id={AV[typing]} fallback={null} /></span> : null}
            <div className="msg-b msg-typing"><small>{NAME[typing]} · {bot.chatTyping}</small><span className="dots"><i /><i /><i /></span></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Team({ t, st, setNav, bot, say, award }) {
  const s = t.s3;
  const chatRef = useRef(null);
  useNav(setNav, [st.lang], () => ({ label: s.next, ok: true }));
  const Person = ({ d, ic, cls, art }) => (
    <div className={'person tilt ' + cls}>
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
      <div className="team-grid">
        <div className="people">
          <Person d={s.mentor} ic={<MessageCircle size={30} />} cls="is-mentor" art="mentor" />
          <Person d={s.curator} ic={<CalendarCheck size={30} />} cls="is-curator" art="curator" />
        </div>
        <div ref={chatRef}><Chat key={st.lang} bot={bot} s={s} onDone={() => { say(bot.chatDone); award('team', chatRef.current); }} /></div>
      </div>
      <div className="how">
        <div className="how-h">{s.howTitle}</div>
        <ol className="stagger">
          {s.how.map((h, i) => (
            <li key={i}><span className="how-ic">{HOW[i]}</span><span><b>{h.t}</b><small>{h.d}</small></span></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
