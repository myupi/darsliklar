import React from 'react';
import { FilePlus2, FolderOpen } from 'lucide-react';
import { pad2 } from '../shared/catalog.js';
import CopyButton from './CopyButton.jsx';
import { MenuButton } from './Toolbar.jsx';

// Урок есть в плане, но файла ещё нет.
export function Placeholder({ sel }) {
  const { course, lesson } = sel;
  return (
    <div className="placeholder">
      <div className="ph-card">
        <div className="ph-num" style={{ '--chip': course.color }}>{pad2(lesson.n)}</div>
        <h2>{lesson.kind === 'practice' ? `Практика к уроку «${lesson.lessonTitle || pad2(lesson.n)}»` : lesson.title}</h2>
        {lesson.topics.length ? (
          <div className="topics">
            {lesson.topics.map((t) => <code key={t} className="topic">{t}</code>)}
          </div>
        ) : null}
        <p className="ph-note">
          <FilePlus2 size={16} aria-hidden="true" />
          {lesson.kind === 'practice' ? 'Практика ещё не создана.' : 'Урок ещё не создан.'} Положите файл сюда — он появится в списке сам, перезапуск не нужен:
        </p>
        <div className="ph-path">
          <code>{lesson.expected}</code>
          <CopyButton text={lesson.expected} label="Скопировать путь" />
        </div>
        <p className="ph-hint">
          {lesson.kind === 'practice'
            ? <>Практика находится по номеру урока с буквой p: <b>{pad2(lesson.n)}p-</b> в начале имени файла; остальную часть имени можно менять.</>
            : <>Урок находится по номеру <b>{pad2(lesson.n)}-</b> в начале имени файла; остальную часть имени можно менять.</>}
        </p>
      </div>
    </div>
  );
}

// Обзор, когда урок не выбран.
export function Welcome({ catalog, onPick, onMenu }) {
  return (
    <div className="welcome">
      <div className="wl-inner">
        <div className="wl-top">
          <MenuButton onClick={onMenu} />
          <h1>Курсы</h1>
        </div>
        <p className="wl-lead">Выберите урок слева или курс ниже. Готовые уроки открываются в эмуляторе платформы.</p>
        <div className="wl-grid">
          {catalog.map((c) => {
            const first = c.lessons.find((l) => l.status !== 'planned') || c.lessons[0];
            const pct = c.planned ? Math.round((c.ready / c.planned) * 100) : 0;
            return (
              <button key={c.id} type="button" className="wl-card" onClick={() => first && onPick(first.key)} disabled={!first}>
                <span className="course-chip lg" style={{ '--chip': c.color }}>{c.short}</span>
                <span className="wl-title">{c.title}</span>
                <span className="wl-sub">{c.subtitle}</span>
                <span className="wl-bar" aria-hidden="true"><i style={{ width: pct + '%', background: c.color }} /></span>
                <span className="wl-count">готово {c.ready} из {c.planned || c.lessons.length}</span>
              </button>
            );
          })}
        </div>

        <section className="howto">
          <h2><FolderOpen size={17} aria-hidden="true" /> Где что лежит</h2>
          <ul>
            <li><code>lessons/&lt;курс&gt;/_course.js</code> — план курса: темы, номера, цвет.</li>
            <li><code>lessons/&lt;курс&gt;/&lt;NN&gt;-&lt;slug&gt;.jsx</code> — файл урока. Номер NN связывает его с планом.</li>
            <li><code>lessons/&lt;курс&gt;/&lt;NN&gt;p-&lt;slug&gt;.jsx</code> — практика к уроку NN, в списке стоит сразу после урока.</li>
            <li>Новый курс — новая папка в <code>lessons/</code> со своим <code>_course.js</code>.</li>
            <li><code>lessons/_reference/</code> — эталонные уроки для сравнения.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
