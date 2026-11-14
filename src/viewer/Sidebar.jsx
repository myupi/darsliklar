import React, { useMemo, useState } from 'react';
import { ChevronDown, ListChecks, PencilRuler, Search, SquareTerminal, X } from 'lucide-react';
import { pad2 } from '../shared/catalog.js';
import { COMPILER } from '../shared/compiler.js';

const STATUS_LABEL = { ready: 'готов', planned: 'в плане', extra: 'вне плана' };

const match = (l, q) =>
  !q || [l.title, l.lessonTitle, l.practiceTitle, l.slug, l.file, ...(l.topics || []), l.n != null ? pad2(l.n) : '']
    .some((s) => String(s || '').toLowerCase().includes(q));

export default function Sidebar({ catalog, selectedKey, onPick, mode = 'lessons', onMode, cmpItems = [], cmpKey, onCmp }) {
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

      <div className="seg sb-mode" role="tablist" aria-label="Что смотреть">
        <button type="button" role="tab" aria-selected={mode === 'lessons'} className={'seg-btn' + (mode === 'lessons' ? ' is-on' : '')} onClick={() => onMode && onMode('lessons')}><span>Уроки</span></button>
        <button type="button" role="tab" aria-selected={mode === 'compiler'} className={'seg-btn' + (mode === 'compiler' ? ' is-on' : '')} onClick={() => onMode && onMode('compiler')}><SquareTerminal size={14} aria-hidden="true" /><span>Компилятор</span></button>
      </div>

      <label className="search">
        <Search size={15} aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'compiler' ? 'Поиск: задание, тег, номер' : 'Поиск: урок, тег, номер'}
          aria-label="Поиск урока"
        />
        {query ? (
          <button type="button" className="icon-btn sm" onClick={() => setQuery('')} aria-label="Очистить поиск">
            <X size={14} />
          </button>
        ) : null}
      </label>

      {mode === 'compiler' ? (
        <nav className="courses">
          {Object.keys(COMPILER).map((m) => {
            const course = catalog.find((c) => c.id === m);
            const rows = cmpItems.filter((x) => x.module === m && (!q || [x.title, x.check, x.n != null ? String(x.n) : ''].some((t) => String(t || '').toLowerCase().includes(q))));
            if (q && !rows.length) return null;
            return (
              <section key={m} className="course">
                <div className="course-head is-static">
                  <span className="course-chip" style={{ '--chip': course ? course.color : '#FA4F28' }}>{course ? course.short : m.toUpperCase()}</span>
                  <span className="course-title">Задания для компилятора</span>
                  <span className="course-count">{COMPILER[m].items.length}</span>
                </div>
                <ul className="lessons">
                  {rows.map((x) => (
                    <li key={x.key}>
                      <button type="button" className={'lesson-row is-ready' + (x.n == null ? ' is-practice' : '') + (cmpKey === x.key ? ' is-active' : '')} onClick={() => onCmp && onCmp(x.key)} title={x.title}>
                        <span className="lesson-n">{x.n != null ? pad2(x.n) : '··'}</span>
                        <span className="lesson-body">
                          <span className="lesson-title">{x.title.replace(/^Amaliy ish\.\s*/, '')}</span>
                          {x.n != null ? <span className="lesson-topics">{(x.check.match(/<[a-z0-9]+>/g) || []).filter((t, i, a) => a.indexOf(t) === i).slice(0, 5).join(' ')}</span> : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </nav>
      ) : (
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
                        className={'lesson-row is-' + l.status + (l.kind === 'practice' || l.kind === 'test' ? ' is-practice' : '') + (l.kind === 'test' ? ' is-test' : '') + (selectedKey === l.key ? ' is-active' : '')}
                        onClick={() => onPick(l.key)}
                        title={l.file ? `lessons/${l.file}.jsx` : `Ожидается: ${l.expected}`}
                      >
                        {l.kind === 'test' ? (
                          <span className="lesson-n" aria-hidden="true"><ListChecks size={13} /></span>
                        ) : l.kind === 'practice' ? (
                          <span className="lesson-n" aria-hidden="true"><PencilRuler size={13} /></span>
                        ) : (
                          <span className="lesson-n">{l.n != null ? pad2(l.n) : '··'}</span>
                        )}
                        <span className="lesson-body">
                          <span className="lesson-title">{l.title}</span>
                          {l.kind === 'lesson' && l.topics.length ? <span className="lesson-topics">{l.topics.join(' · ')}</span> : null}
                          {l.kind === 'practice' && l.practiceTitle ? <span className="lesson-topics">практика</span> : null}
                          {l.kind === 'test' && l.testTitle ? <span className="lesson-topics">тест</span> : null}
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
      )}

      {mode === 'compiler' ? null : <div className="legend">
        <span><i className="status-dot is-ready" /> готов</span>
        <span><i className="status-dot is-planned" /> в плане</span>
        <span><i className="status-dot is-extra" /> вне плана</span>
      </div>}
    </aside>
  );
}
