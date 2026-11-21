import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildCatalog, findLesson } from '../shared/catalog.js';
import { MSG_SOURCE } from '../runtime/bridge.js';
import { readPrefs, writePrefs } from './prefs.js';
import Sidebar from './Sidebar.jsx';
import Toolbar, { MenuButton, PanelButtons } from './Toolbar.jsx';
import DualStage, { SlideNav } from './DualStage.jsx';
import DeviceStage from './DeviceStage.jsx';
import LogPanel from './LogPanel.jsx';
import { Placeholder, Welcome } from './Placeholder.jsx';
import CompilerTask from './CompilerPage.jsx';
import { COMPILER, compilerItems } from '../shared/compiler.js';
import TrainerPage from './TrainerPage.jsx';
import { TRAINERS, trainerById } from '../shared/trainers.js';

let logId = 0;

export default function App() {
  const catalog = useMemo(() => buildCatalog(), []);
  const [prefs, setPrefs] = useState(readPrefs);
  const set = useCallback((patch) => setPrefs((p) => Object.assign({}, p, patch)), []);
  useEffect(() => { writePrefs(prefs); }, [prefs]);

  // Режим «Компилятор» (14.11.2026): своя боковая панель с заданиями, курсов в ней нет.
  const compilerMode = prefs.view === 'compiler';
  const cmpAll = useMemo(() => compilerItems(), []);
  const cmpSel = compilerMode ? (cmpAll.find((x) => x.key === prefs.cmp) || cmpAll[0] || null) : null;
  // Режим «Тренажёр» (18.11.2026): тренажёры модулей с эмуляцией LMS и их банки вопросов. trn = '<id>' | '<id>:bank' | '<id>:bank:<урок>'.
  const trainerMode = prefs.view === 'trainer';
  const trnParts = String(prefs.trn || '').split(':');
  const trn = trainerMode ? (trainerById(trnParts[0]) || TRAINERS[0]) : null;
  const trnBank = trnParts[1] === 'bank';
  const trnSub = trnBank && trnParts[2] ? trnParts[2] : null;
  const sel = compilerMode || trainerMode ? null : findLesson(catalog, prefs.lesson);
  const file = sel ? sel.lesson.file : null;
  const [run, setRun] = useState(0);

  const playerQuery = useMemo(() => {
    if (!file) return '';
    const q = new URLSearchParams({ file, lang: prefs.lang, voice: prefs.voice });
    if (prefs.name) q.set('name', prefs.name);
    if (prefs.start !== '') q.set('start', prefs.start);
    if (sel && sel.lesson.kind === 'test' && prefs.quizBar === false) q.set('bar', '0');
    return q.toString();
  }, [file, sel, prefs.lang, prefs.voice, prefs.name, prefs.start, prefs.quizBar]);
  const src = file ? `/player.html?${playerQuery}&run=${run}` : null;
  // Все три панели закрыты — два окна сразу: телефон слева, ноутбук справа, действия синхронно (DualStage).
  // Голос — только у телефона: ноутбук без звука, но с паузами по длине реплик, чтобы окна шли вровень.
  const dual = !!file && prefs.navHidden && prefs.barHidden && !prefs.logOpen;
  const srcB = src ? src.replace(/([?&]voice=)browser\b/, '$1simulate') : null;

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
    <div className={'app' + (navOpen ? ' nav-open' : '') + (prefs.navHidden ? ' nav-hidden' : '')}>
      <Sidebar catalog={catalog} selectedKey={sel ? sel.lesson.key : null} onPick={pick}
        mode={compilerMode ? 'compiler' : trainerMode ? 'trainer' : 'lessons'} onMode={(m) => { set({ view: m }); setNavOpen(false); }}
        cmpItems={cmpAll} cmpKey={cmpSel ? cmpSel.key : null} onCmp={(k) => { set({ cmp: k }); setNavOpen(false); }}
        trnKey={trn ? [trn.id].concat(trnBank ? ['bank'] : [], trnSub ? [trnSub] : []).join(':') : null} onTrn={(k) => { set({ trn: k, trnQ: '' }); setNavOpen(false); }} />
      {navOpen ? <div className="nav-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" /> : null}
      <main className="main">
        {trainerMode ? (
          <TrainerPage key={trn.id + (trnBank ? ':bank' : '')} tr={trn} course={catalog.find((c) => c.id === trn.module) || null} sub={trnSub} isBank={trnBank}
            prefs={prefs} set={set} onMenu={toggleNav} frameRef={frameRef} log={log} clearLog={() => setLog([])} />
        ) : compilerMode ? (
          <CompilerTask item={cmpSel} items={cmpAll} course={cmpSel ? catalog.find((c) => c.id === cmpSel.module) : null}
            onPick={(k) => set({ cmp: k })} onMenu={toggleNav} />
        ) : sel ? (
          <>
            {prefs.barHidden ? (
              <>{dual ? <SlideNav frameRef={frameRef} onGo={(i) => { if (String(i) === String(prefs.start)) setRun((r) => r + 1); else set({ start: String(i) }); }} /> : null}
              <div className="bar-peek" role="toolbar" aria-label="Панели просмотрщика">
                <MenuButton onClick={toggleNav} />
                <PanelButtons prefs={prefs} set={set} log={!!file} />
              </div></>
            ) : <Toolbar
              sel={sel}
              prefs={prefs}
              set={set}
              canRun={!!file}
              openHref={file ? `/player.html?${playerQuery}` : null}
              onRestart={() => setRun((r) => r + 1)}
              onMenu={toggleNav}
            />}
            <div className="workspace">
              {file && dual ? (
                <DualStage frameRef={frameRef} src={src} srcB={srcB} title={sel.lesson.title} zoom={Number(prefs.dualZoom) || 100} onZoom={(z) => set({ dualZoom: z })}
                  phone={prefs.dualPhone || '390x844'} laptop={prefs.dualLaptop || '1366x800'} onSize={set} />
              ) : file ? (
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
