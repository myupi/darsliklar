import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildCatalog, findLesson } from '../shared/catalog.js';
import { MSG_SOURCE } from '../runtime/bridge.js';
import { readPrefs, writePrefs } from './prefs.js';
import Sidebar from './Sidebar.jsx';
import Toolbar from './Toolbar.jsx';
import DeviceStage from './DeviceStage.jsx';
import LogPanel from './LogPanel.jsx';
import { Placeholder, Welcome } from './Placeholder.jsx';

let logId = 0;

export default function App() {
  const catalog = useMemo(() => buildCatalog(), []);
  const [prefs, setPrefs] = useState(readPrefs);
  const set = useCallback((patch) => setPrefs((p) => Object.assign({}, p, patch)), []);
  useEffect(() => { writePrefs(prefs); }, [prefs]);

  const sel = findLesson(catalog, prefs.lesson);
  const file = sel ? sel.lesson.file : null;
  const [run, setRun] = useState(0);

  const playerQuery = useMemo(() => {
    if (!file) return '';
    const q = new URLSearchParams({ file, lang: prefs.lang, voice: prefs.voice });
    if (prefs.name) q.set('name', prefs.name);
    if (prefs.start !== '') q.set('start', prefs.start);
    return q.toString();
  }, [file, prefs.lang, prefs.voice, prefs.name, prefs.start]);
  const src = file ? `/player.html?${playerQuery}&run=${run}` : null;

  // ── Журнал: всё, что урок делает с платформой ───────────────────────────
  const frameRef = useRef(null);
  const [log, setLog] = useState([]);
  useEffect(() => { setLog([]); }, [src]);
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data;
      if (!d || d.source !== MSG_SOURCE) return;
      if (frameRef.current && e.source !== frameRef.current.contentWindow) return;
      logId += 1;
      const row = { id: logId, type: d.type, data: d.data, t: d.t || Date.now() };
      setLog((l) => (l.length > 600 ? l.slice(-500) : l).concat(row));
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // На узком экране каталог выезжает поверх урока.
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = useCallback(() => setNavOpen((v) => !v), []);
  const pick = useCallback((key) => { set({ lesson: key, start: '' }); setNavOpen(false); }, [set]);

  return (
    <div className={'app' + (navOpen ? ' nav-open' : '')}>
      <Sidebar catalog={catalog} selectedKey={sel ? sel.lesson.key : null} onPick={pick} />
      {navOpen ? <div className="nav-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" /> : null}
      <main className="main">
        {sel ? (
          <>
            <Toolbar
              sel={sel}
              prefs={prefs}
              set={set}
              canRun={!!file}
              openHref={file ? `/player.html?${playerQuery}` : null}
              onRestart={() => setRun((r) => r + 1)}
              onMenu={toggleNav}
            />
            <div className="workspace">
              {file ? (
                <DeviceStage
                  frameRef={frameRef}
                  src={src}
                  device={prefs.device}
                  rotated={prefs.rotated}
                  title={sel.lesson.title}
                />
              ) : (
                <Placeholder sel={sel} />
              )}
              {file && prefs.logOpen ? <LogPanel log={log} onClear={() => setLog([])} /> : null}
            </div>
          </>
        ) : (
          <Welcome catalog={catalog} onPick={pick} onMenu={toggleNav} />
        )}
      </main>
    </div>
  );
}
