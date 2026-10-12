import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { pad2 } from '../shared/catalog.js';

const STATUS_LABEL = { ready: 'готов', planned: 'в плане', extra: 'вне плана' };

const match = (l, q) =>
  !q || [l.title, l.slug, l.file, ...(l.topics || []), l.n != null ? pad2(l.n) : '']
    .some((s) => String(s || '').toLowerCase().includes(q));

export default function Sidebar({ catalog, selectedKey, onPick }) {
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState({});
  const q = query.trim().toLowerCase();

  const courses = useMemo(
    () => catalog.map((c) => ({ ...c, shown: c.lessons.filter((l) => match(l, q) || (q && c.title.toLowerCase().includes(q))) })),
    [catalog, q]
  );
  const total = catalog.reduce((s, c) => s + c.ready, 0);

  return (
    <aside className="sidebar">
      <button type="button" className="brand" onClick={() => onPick('')} title="К обзору курсов">
        <span className="brand-mark" aria-hidden="true">D</span>
        <span className="brand-text">
          <span className="brand-name">Darsliklar</span>
          <span className="brand-sub">просмотр уроков · готово {total}</span>
        </span>
      </button>

      <label className="search">
        <Search size={15} aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: урок, тег, номер"
          aria-label="Поиск урока"
        />
        {query ? (
          <button type="button" className="icon-btn sm" onClick={() => setQuery('')} aria-label="Очистить поиск">
            <X size={14} />
          </button>
        ) : null}
      </label>

      <nav className="courses">
        {courses.map((c) => {
          if (q && !c.shown.length) return null;
          const isClosed = !q && closed[c.id];
          return (
            <section key={c.id} className="course">
              <button
                type="button"
                className="course-head"
                onClick={() => setClosed((s) => ({ ...s, [c.id]: !s[c.id] }))}
                aria-expanded={!isClosed}
              >
                <span className="course-chip" style={{ '--chip': c.color }}>{c.short}</span>
                <span className="course-title">{c.title}</span>
                <span className="course-count">{c.ready}/{c.planned || c.lessons.length}</span>
                <ChevronDown size={15} className={'chev' + (isClosed ? ' is-closed' : '')} aria-hidden="true" />
              </button>
              {!isClosed ? (
                <ul className="lessons">
                  {c.shown.map((l) => (
                    <li key={l.key}>
                      <button
                        type="button"
                        className={'lesson-row is-' + l.status + (selectedKey === l.key ? ' is-active' : '')}
                        onClick={() => onPick(l.key)}
                        title={l.file ? `lessons/${l.file}.jsx` : `Ожидается: ${l.expected}`}
                      >
                        <span className="lesson-n">{l.n != null ? pad2(l.n) : '··'}</span>
                        <span className="lesson-body">
                          <span className="lesson-title">{l.title}</span>
                          {l.topics.length ? <span className="lesson-topics">{l.topics.join(' · ')}</span> : null}
                        </span>
                        <span className={'status-dot is-' + l.status} aria-label={STATUS_LABEL[l.status]} title={STATUS_LABEL[l.status]} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </nav>

      <div className="legend">
        <span><i className="status-dot is-ready" /> готов</span>
        <span><i className="status-dot is-planned" /> в плане</span>
        <span><i className="status-dot is-extra" /> вне плана</span>
      </div>
    </aside>
  );
}
