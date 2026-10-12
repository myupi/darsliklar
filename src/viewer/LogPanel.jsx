import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, CircleCheck, Flag, Hourglass, Info, Music, Trash2, Volume2, XCircle, Zap,
} from 'lucide-react';
import CopyButton from './CopyButton.jsx';

const GROUPS = {
  all: { label: 'Всё', test: () => true },
  voice: { label: 'Голос', test: (e) => e.type === 'tts' || e.type === 'wait' },
  events: { label: 'События', test: (e) => e.type === 'event' || e.type === 'sfx' || e.type === 'finished' },
  errors: { label: 'Ошибки', test: (e) => e.type === 'error' || e.type === 'warn' },
};

const KIND = { segment: 'сегмент', oneOff: 'реплика', replay: 'повтор', line: 'реплика', service: 'реплика · ttsApiBase' };

const clock = (t) => {
  const d = new Date(t);
  return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0').slice(0, 1);
};

function Row({ e }) {
  const d = e.data || {};
  switch (e.type) {
    case 'tts':
      return (
        <Item icon={<Volume2 size={14} />} tone="voice" t={e.t}
          head={<>{KIND[d.kind] || 'реплика'}{d.id ? <code>{d.id}</code> : null}<span className="tag">{d.lang}</span>{d.voice ? <span className="tag">{d.voice}</span> : null}{!d.marker ? <span className="tag warn" title="Реплика без маркера языка в начале ([Русское произношение] …)">без маркера</span> : null}{d.muted ? <span className="tag">звук выкл.</span> : null}</>}
          body={d.spoken} />
      );
    case 'wait':
      return <Item icon={<Hourglass size={14} />} tone="muted" t={e.t} head={<>ждёт <code>{d.waits_for && d.waits_for.type}{d.waits_for && d.waits_for.target ? ' → ' + d.waits_for.target : ''}</code></>} />;
    case 'event':
      return <Item icon={<Zap size={14} />} tone="event" t={e.t} head={<>triggerEvent <code>{d.type}{d.target != null ? ', ' + d.target : ''}</code></>} />;
    case 'sfx':
      return <Item icon={<Music size={14} />} tone="muted" t={e.t} head={<>звук <code>{String(e.data)}</code></>} />;
    case 'finished':
      return <Item icon={<Flag size={14} />} tone={d.count > 1 ? 'error' : 'ok'} t={e.t} head={<>onFinished #{d.count}</>} />;
    case 'loaded':
      return <Item icon={<CircleCheck size={14} />} tone="ok" t={e.t} head={<>урок загружен за {d.ms} мс · <code>{d.component}</code></>} body={'пропсы: ' + (d.props || []).join(', ')} />;
    case 'warn':
      return <Item icon={<AlertTriangle size={14} />} tone="warn" t={e.t} body={String(e.data)} />;
    case 'error':
      return (
        <Item icon={<XCircle size={14} />} tone="error" t={e.t} head={<>{d.message || String(e.data)}</>}
          body={d.componentStack || d.stack ? <details><summary>стек</summary><pre>{(d.componentStack || d.stack || '').trim()}</pre></details> : null} />
      );
    default:
      return <Item icon={<Info size={14} />} tone="muted" t={e.t} body={typeof e.data === 'string' ? e.data : JSON.stringify(e.data)} />;
  }
}

function Item({ icon, tone, t, head, body }) {
  return (
    <li className={'log-row tone-' + tone}>
      <span className="log-ico" aria-hidden="true">{icon}</span>
      <div className="log-main">
        {head ? <div className="log-head">{head}</div> : null}
        {body ? <div className="log-body">{body}</div> : null}
      </div>
      <time className="log-time">{clock(t)}</time>
    </li>
  );
}

export default function LogPanel({ log, onClear }) {
  const [group, setGroup] = useState('all');
  const listRef = useRef(null);
  const stick = useRef(true);

  const finished = log.filter((e) => e.type === 'finished');
  const last = finished[finished.length - 1];
  const count = finished.length;
  const counts = useMemo(() => {
    const c = {};
    Object.keys(GROUPS).forEach((k) => { c[k] = log.filter(GROUPS[k].test).length; });
    return c;
  }, [log]);
  const shown = log.filter(GROUPS[group].test);

  useEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [shown.length]);

  const json = last ? JSON.stringify(last.data && last.data.payload, null, 2) : '';

  return (
    <aside className="logpanel" aria-label="Журнал урока">
      <div className="lp-head">
        <h2>Журнал</h2>
        <button type="button" className="icon-btn sm" onClick={onClear} title="Очистить журнал" aria-label="Очистить журнал">
          <Trash2 size={14} />
        </button>
      </div>

      <div className={'contract ' + (count === 0 ? 'is-wait' : count === 1 ? 'is-ok' : 'is-bad')}>
        <div className="contract-line">
          <Flag size={14} aria-hidden="true" />
          <span>
            onFinished:{' '}
            {count === 0 ? 'ещё не вызван' : count === 1 ? 'вызван 1 раз' : `вызван ${count} раза — должен ровно 1`}
          </span>
        </div>
        {last ? (
          <details className="payload" open>
            <summary>
              payload
              <CopyButton text={json} label="Скопировать payload" />
            </summary>
            <pre>{json}</pre>
          </details>
        ) : null}
      </div>

      <div className="lp-filters" role="tablist" aria-label="Фильтр журнала">
        {Object.entries(GROUPS).map(([k, g]) => (
          <button key={k} type="button" role="tab" aria-selected={group === k}
            className={'chip' + (group === k ? ' is-on' : '')} onClick={() => setGroup(k)}>
            {g.label}<span className="chip-n">{counts[k]}</span>
          </button>
        ))}
      </div>

      <ul
        className="log-list"
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        {shown.length ? shown.map((e) => <Row key={e.id} e={e} />) : <li className="log-empty">Пока пусто. Здесь появятся реплики, события и ошибки урока.</li>}
      </ul>
    </aside>
  );
}
