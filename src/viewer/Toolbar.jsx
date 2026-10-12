import React, { useEffect, useState } from 'react';
import {
  ExternalLink, Laptop, Maximize2, Menu, PanelRightClose, PanelRightOpen, RotateCcw, RotateCw, Smartphone, Tablet,
} from 'lucide-react';
import { pad2 } from '../shared/catalog.js';
import CopyButton from './CopyButton.jsx';

const LANGS = [
  { v: 'ru', label: 'RU' },
  { v: 'uz', label: 'UZ' },
  { v: 'en', label: 'EN' },
];

const DEVICES = [
  { v: 'phone', label: 'Телефон', Icon: Smartphone },
  { v: 'tablet', label: 'Планшет', Icon: Tablet },
  { v: 'laptop', label: 'Ноутбук', Icon: Laptop },
  { v: 'fill', label: 'Во всю область', Icon: Maximize2 },
];

const VOICES = [
  { v: 'browser', label: 'Браузер', hint: 'Реплики читает голос браузера' },
  { v: 'simulate', label: 'Тихо', hint: 'Без звука, но с паузой по длине реплики — урок идёт как с голосом' },
  { v: 'fast', label: 'Быстро', hint: 'Без звука, паузы вшестеро короче — чтобы быстро пройти урок на проверке' },
  { v: 'off', label: 'Нет', hint: 'Голоса нет совсем — проверка, что урок показывает текст и не зависает' },
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

export default function Toolbar({ sel, prefs, set, canRun, openHref, onRestart, onMenu }) {
  const { course, lesson } = sel;
  const path = lesson.file ? `lessons/${lesson.file}.jsx` : lesson.expected;

  return (
    <header className="toolbar">
      <div className="tb-row">
        <MenuButton onClick={onMenu} />
        <div className="tb-title">
          <span className="course-chip" style={{ '--chip': course.color }}>{course.short}</span>
          <h1>
            {lesson.n != null ? <span className="tb-n">{pad2(lesson.n)}</span> : null}
            {lesson.title}
          </h1>
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
              <button
                type="button"
                className={'icon-btn' + (prefs.logOpen ? ' is-on' : '')}
                onClick={() => set({ logOpen: !prefs.logOpen })}
                title={prefs.logOpen ? 'Скрыть журнал' : 'Показать журнал'}
                aria-label={prefs.logOpen ? 'Скрыть журнал' : 'Показать журнал'}
              >
                {prefs.logOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
              </button>
            </>
          ) : null}
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
