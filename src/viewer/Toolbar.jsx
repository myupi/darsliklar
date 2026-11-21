import React, { useEffect, useState } from 'react';
import {
  ExternalLink, Keyboard, Laptop, Maximize2, Menu, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, PanelTopClose, PanelTopOpen, RotateCcw, RotateCw, Smartphone, Tablet,
} from 'lucide-react';
import { pad2 } from '../shared/catalog.js';
import { titlesOf } from '../shared/lessonTitles.js';
import CopyButton from './CopyButton.jsx';

const LANGS = [
  { v: 'ru', label: 'RU' },
  { v: 'uz', label: 'UZ' },
  { v: 'en', label: 'EN' },
];

const DEVICES = [
  { v: 'phone', label: 'Телефон', Icon: Smartphone },
  { v: 'phoneKbd', label: 'Телефон с открытой клавиатурой', Icon: Keyboard },
  { v: 'tablet', label: 'Планшет', Icon: Tablet },
  { v: 'laptop', label: 'Ноутбук', Icon: Laptop },
  { v: 'fill', label: 'Во всю область', Icon: Maximize2 },
];

const VOICES = [
  { v: 'browser', label: 'Браузер', hint: 'Реплики читает голос браузера. Уроку с ttsApiBase сервис озвучки отвечает «недоступен» — и урок сам переходит на голос браузера' },
  { v: 'simulate', label: 'Тихо', hint: 'Без звука, но с паузой по длине реплики — урок идёт как с голосом (сервис ttsApiBase отдаёт тишину нужной длины)' },
  { v: 'fast', label: 'Быстро', hint: 'Без звука, паузы вшестеро короче — чтобы быстро пройти урок на проверке' },
  { v: 'off', label: 'Нет', hint: 'Голоса нет совсем: ни сервиса ttsApiBase, ни голоса браузера — проверка, что урок показывает текст и не зависает' },
];

function Segmented({ value, options, onChange, label, iconOnly }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          className={'seg-btn' + (value === o.v ? ' is-on' : '')}
          onClick={() => onChange(o.v)}
          title={o.hint || o.label}
          aria-label={o.label}
        >
          {o.Icon ? <o.Icon size={15} aria-hidden="true" /> : null}
          {iconOnly && o.Icon ? null : <span>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}

// Поле, которое применяет значение по Enter или при уходе фокуса:
// иначе урок перезапускался бы на каждую букву.
function CommitInput({ value, onCommit, ...rest }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value]);
  const commit = () => { if (v !== value) onCommit(v); };
  return (
    <input
      {...rest}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { commit(); e.currentTarget.blur(); } }}
    />
  );
}

export function MenuButton({ onClick }) {
  return (
    <button type="button" className="icon-btn nav-toggle" onClick={onClick} title="Каталог уроков" aria-label="Каталог уроков">
      <Menu size={17} />
    </button>
  );
}

// Кнопки панелей (как у журнала справа): левая — каталог, верхняя — шапка урока, правая — журнал.
// Левая — только на широком экране (на узком каталог и так выезжает по «≡»).
export function PanelButtons({ prefs, set, log = true, top = true }) {
  const b = (on, onClick, hide, show, Close, Open, cls) => (
    <button type="button" className={'icon-btn' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} onClick={onClick} title={on ? hide : show} aria-label={on ? hide : show}>
      {on ? <Close size={17} /> : <Open size={17} />}
    </button>
  );
  return (
    <>
      {b(!prefs.navHidden, () => set({ navHidden: !prefs.navHidden }), 'Скрыть левую панель', 'Показать левую панель', PanelLeftClose, PanelLeftOpen, 'wide-only')}
      {top ? b(!prefs.barHidden, () => set({ barHidden: !prefs.barHidden }), 'Скрыть верхнюю панель', 'Показать верхнюю панель', PanelTopClose, PanelTopOpen) : null}
      {log ? b(prefs.logOpen, () => set({ logOpen: !prefs.logOpen }), 'Скрыть журнал', 'Показать журнал', PanelRightClose, PanelRightOpen) : null}
    </>
  );
}

export default function Toolbar({ sel, prefs, set, canRun, openHref, onRestart, onMenu }) {
  const { course, lesson } = sel;
  const path = lesson.file ? `lessons/${lesson.file}.jsx` : lesson.expected;
  const titles = titlesOf(lesson, course);   // название на трёх языках из самого урока (18.11.2026)

  return (
    <header className="toolbar">
      <div className="tb-row">
        <MenuButton onClick={onMenu} />
        <div className="tb-title">
          <span className="course-chip" style={{ '--chip': course.color }}>{course.short}</span>
          {titles ? (
            <h1 className="tb-langs">
              {['uz', 'ru', 'en'].map((l) => (
                <span key={l} className="tb-lang-row">
                  <span className="cmp-lang">{l.toUpperCase()}</span>
                  <span className="tb-lang-t">{titles[l]}</span>
                  <CopyButton text={titles[l]} label="Скопировать название" />
                </span>
              ))}
            </h1>
          ) : (
            <h1>
              {lesson.n != null ? <span className="tb-n">{pad2(lesson.n)}</span> : null}
              {lesson.kind === 'practice' && lesson.lessonTitle ? `Практика · ${lesson.practiceTitle || lesson.lessonTitle}` : lesson.kind === 'test' && lesson.lessonTitle ? `${lesson.title} · ${lesson.testTitle || lesson.lessonTitle}` : lesson.title}
            </h1>
          )}
          <span className={'pill is-' + lesson.status}>
            {lesson.status === 'ready' ? 'готов' : lesson.status === 'extra' ? 'вне плана' : 'не создан'}
          </span>
        </div>
        <div className="tb-actions">
          {canRun ? (
            <>
              <button type="button" className="btn" onClick={onRestart} title="Перезапустить урок с начала">
                <RotateCcw size={15} aria-hidden="true" /> Перезапуск
              </button>
              <a className="btn" href={openHref} target="_blank" rel="noreferrer" title="Открыть урок отдельно, во всё окно">
                <ExternalLink size={15} aria-hidden="true" /> Отдельно
              </a>
            </>
          ) : null}
          <PanelButtons prefs={prefs} set={set} log={canRun} />
        </div>
      </div>

      <div className="tb-path">
        <code>{path}</code>
        <CopyButton text={path} label="Скопировать путь" />
      </div>

      {canRun ? (
        <div className="tb-row tb-controls">
          <div className="ctl">
            <span className="ctl-label">Язык</span>
            <Segmented label="Язык урока" value={prefs.lang} options={LANGS} onChange={(lang) => set({ lang })} />
          </div>
          <div className="ctl">
            <span className="ctl-label">Экран</span>
            <Segmented label="Устройство" value={prefs.device} options={DEVICES} onChange={(device) => set({ device })} iconOnly />
            <button
              type="button"
              className={'icon-btn' + (prefs.rotated ? ' is-on' : '')}
              onClick={() => set({ rotated: !prefs.rotated })}
              disabled={prefs.device === 'fill'}
              title="Повернуть устройство"
              aria-label="Повернуть устройство"
            >
              <RotateCw size={15} />
            </button>
          </div>
          {lesson.kind === 'test' ? (
            <div className="ctl">
              <span className="ctl-label" title="Кнопку «Tekshirish» держит платформа — своей у теста нет. Здесь её рисует просмотрщик (эмуляция платформы); «Нет» — тест как есть, без кнопки">Кнопка платформы</span>
              <Segmented label="Кнопка платформы «Tekshirish»" value={prefs.quizBar === false ? 'off' : 'on'}
                options={[{ v: 'on', label: 'Есть', hint: 'Полоса платформы внизу: «Tekshirish», после проверки — «Keyingisi»' }, { v: 'off', label: 'Нет', hint: 'Тест как есть — только вопрос, без кнопки платформы' }]}
                onChange={(v) => set({ quizBar: v === 'on' })} />
            </div>
          ) : null}
          <div className="ctl">
            <span className="ctl-label">Голос</span>
            <Segmented label="Озвучка" value={prefs.voice} options={VOICES} onChange={(voice) => set({ voice })} />
          </div>
          <div className="ctl">
            <span className="ctl-label">Ученик</span>
            <CommitInput
              className="field"
              value={prefs.name}
              onCommit={(name) => set({ name })}
              placeholder="имя"
              aria-label="Имя ученика (studentName)"
              style={{ width: 110 }}
            />
          </div>
          <div className="ctl">
            <span className="ctl-label" title="Дев-пропсы startAt / startScreen: открыть урок сразу на экране N (с нуля)">С экрана</span>
            <CommitInput
              className="field"
              value={prefs.start}
              onCommit={(start) => set({ start: start.replace(/[^\d]/g, '') })}
              placeholder="0"
              inputMode="numeric"
              aria-label="Начать с экрана (startAt)"
              style={{ width: 52 }}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
