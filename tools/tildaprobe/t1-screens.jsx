// =============================================================================
// ПРОБНЫЙ ЭКРАН МОДУЛЯ TILDA — похожий редактор Tilda; после публикации та же карточка показывает сайт, как его видит гость.
// Шаги (st): 0 пустая страница → 1 библиотека → 2 раздел «Обложка» → 3 обложка на странице, правка заголовка →
// 4 «Опубликовать» → 5 окно «Публикация прошла успешно!» → 6 сайт открыт (готово).
// =============================================================================

// Обложка блока — одна и та же в редакторе и на опубликованном сайте.
function TCover({ id, title, sub, onTitle, editing, edit }) {
  const look = (COVERS.find((c) => c.id === id) || {}).look || 'plate';
  return (
    <section className={'t1-cover is-' + look}>
      {look === 'author' ? <i className="t1-avatar" aria-hidden="true" /> : null}
      <div className="t1-plate">
        {editing ? edit : (
          onTitle ? <button type="button" className="t1-h is-tap" onClick={onTitle}>{title}</button> : <h1 className="t1-h">{title}</h1>
        )}
        <p className="t1-p">{sub}</p>
      </div>
    </section>
  );
}
// Карточка блока в библиотеке: картинка-набросок, шифр, описание; у платного — замок.
function TCard({ c, onPick, flash }) {
  const pick = usePick();
  return (
    <button type="button" className={'t1-card' + (c.paid ? ' is-paid' : '') + (flash ? ' is-flash' : '')} onClick={() => onPick(c)}>
      <span className={'t1-thumb is-' + c.look} aria-hidden="true"><i /><b /></span>
      <span className="t1-cap"><em>{c.paid ? <i className="t1-lock" aria-hidden="true" /> : null}{c.id}</em>{pick(c.d)}</span>
      {c.paid ? <span className="t1-paid">{pick(TL.paid)}</span> : null}
    </button>
  );
}

function T1({ p }) {
  const pick = usePick();
  const log = useLog();
  const [rec, put] = useRec('t1');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 6 : 0);
  const [cover, setCover] = useState(solved ? rec.cover : null);
  const [title, setTitle] = useState(solved ? rec.title : '');
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(null);
  const [hintLv, setHintLv] = useState(0);
  const miss = useRef(0);
  const tries = useRef(0);
  const inRef = useRef(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? C.ok : C.say[0], pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const step = Math.min(st, 5);
  const go = (n, pose) => { setSt(n); setMsg(null); setHintLv(0); miss.current = 0; if (n <= 5) sayNow(C.say[n], pose || 'explain'); };
  const err = (m) => { tries.current += 1; miss.current += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (miss.current >= 2) setHintLv(1); };
  const ok = (n) => { tries.current += 1; sfx('pop', true); go(n); };
  const txt = cover ? COVER_TXT[cover] : null;
  const doneTitle = () => {
    const v = draft.trim();
    if (!v) { err(C.emptyTitle); return; }
    if (txt && v.toLowerCase() === txt.t.toLowerCase()) { err(C.sameTitle); return; }
    setTitle(v); setEditing(false); ok(4);
  };
  const openSite = () => {
    sfx('win', true); setSt(6); setMsg(null);
    put({ done: true, cover, title });
    log({ screenId: 't1', type: 'tilda-first-site', correct: true, firstTry: tries.current <= 6, attempts: tries.current, cover, title });
    sayNow(C.ok, 'cheer');
  };
  useEffect(() => { if (editing && inRef.current) { try { inRef.current.focus(); } catch (e) { /* без фокуса */ } } }, [editing]);
  const lock = !canTap;
  const shownTitle = title || (txt ? txt.t : '');
  // ── Редактор ──
  const editor = (
    <div className={'t1-ed' + (st === 1 || st === 2 ? ' has-lib' : '')} translate="no">
      <div className="t1-top">
        <span className="t1-crumb"><i className="t1-home" aria-hidden="true" /><span>/</span><b>{pick(TL.site)}</b><span className="t1-pg">/ {pick(TL.page)} ▾</span></span>
        <span className="t1-acts">
          <span className="t1-undo" aria-hidden="true">↶ ↷</span>
          <span className="t1-act">{pick(TL.preview)}</span>
          <button type="button" className={'t1-act is-pub' + (st === 4 ? ' is-led' : '')} disabled={lock || st >= 5} onClick={() => { if (st === 4) { sfx('pop', true); setSt(5); setMsg(null); setHintLv(0); celebrate(); sayNow(C.say[5], 'cheer'); } else if (st < 4) err(st === 3 ? C.emptyTitle : C.hints[st]); }}>{pick(TL.publish)}</button>
          <span className="t1-act is-more">{pick(TL.more)} ▾</span>
        </span>
      </div>
      <div className="t1-canvas">
        {cover ? (
          <div className="t1-rec">
            <div className="t1-bar">
              <span className="t1-chip">{cover} ▾</span>
              <span className="t1-chip">⚙ {pick(TL.settings)}</span>
              <span className="t1-chip is-content">✎ {pick(TL.content)}</span>
            </div>
            <TCover id={cover} title={shownTitle} sub={txt.p} editing={editing}
              onTitle={st === 3 && !lock ? () => { sfx('tap', true); setDraft(txt.t); setEditing(true); setMsg(null); } : null}
              edit={(
                <span className="t1-edit">
                  <input ref={inRef} className="t1-in" value={draft} maxLength={40} placeholder={pick(C.ph)} aria-label={pick(C.ask[3])}
                    onChange={(e) => { setDraft(e.target.value); setMsg(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doneTitle(); } }}
                    autoComplete="off" spellCheck={false} enterKeyHint="done" />
                  <button type="button" className="kz-btn is-coral t1-ok" onClick={doneTitle}>{pick(UI.done)}</button>
                </span>
              )} />
          </div>
        ) : (
          <div className="t1-empty">
            <i className="t1-cam" aria-hidden="true" />
            <b>{pick(TL.empty1)}</b>
            <span>{pick(TL.empty2)}</span>
          </div>
        )}
        <div className="t1-dock">
          <button type="button" className={'t1-all' + (st === 0 ? ' is-led' : '')} disabled={lock || st >= 3} onClick={() => { if (st === 0) ok(1); }}>
            <i aria-hidden="true">≡</i>{pick(TL.all)}
          </button>
          <span className="t1-quick">{TL.quick.map((q, i) => <span key={i}>{pick(q)}</span>)}</span>
        </div>
        {st === 1 || st === 2 ? (
          <div className="t1-lib">
            <div className="t1-lib-l">
              <div className="t1-lib-h">{pick(TL.lib)}<span aria-hidden="true">⌕ ✕</span></div>
              <div className="t1-lib-tabs">{TL.tabs.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}>{pick(t)}</span>)}</div>
              <div className="t1-cats">
                {TL.cats.map((c, i) => (
                  <button type="button" key={i} className={'t1-cat' + (i === 0 && st === 2 ? ' is-on' : '') + (i === 0 && st === 1 ? ' is-led' : '')}
                    onClick={() => { if (st !== 1) return; if (i === 0) ok(2); else err(C.wrongCat); }}>{pick(c)}</button>
                ))}
              </div>
            </div>
            {st === 2 ? (
              <div className="t1-lib-r">
                {COVERS.map((c) => (
                  <TCard key={c.id} c={c} flash={flash === c.id} onPick={(cv) => {
                    if (cv.paid) { setFlash(cv.id); setTimeout(() => setFlash(null), 600); err(C.locked); return; }
                    setCover(cv.id); ok(3);
                  }} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {st === 5 ? (
          <div className="t1-modal">
            <div className="t1-dlg">
              <span className="t1-qr" aria-hidden="true" />
              <b className="t1-dlg-h">{pick(TL.okH)}</b>
              <span className="t1-dlg-l">{pick(TL.okLink)}</span>
              <span className="t1-dlg-u">https://{SITE_URL}</span>
              <button type="button" className="t1-open is-led" onClick={openSite}>{pick(TL.open)}</button>
              <span className="t1-dlg-f"><span>{pick(TL.seo)}</span><span className="t1-dlg-x">{pick(TL.close)}</span></span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
  // ── Опубликованный сайт: та же карточка, но без панелей редактора — так страницу видит гость. Адрес — строкой-ссылкой. ──
  const live = st >= 6;
  const site = (
    <div className="t1-ed is-live" translate="no">
      <div className="t1-url"><i className="t1-globe" aria-hidden="true" /><span>{SITE_URL}</span></div>
      <div className="t1-site">
        <TCover id={cover} title={shownTitle} sub={txt ? txt.p : ''} />
        <div className="t1-made"><i aria-hidden="true">T</i>{pick(TL.made)}</div>
      </div>
    </div>
  );
  return (
    <StageB voiceTop eyebrow={C.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : C.hints[step]}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="t1-sheet">
        <KzAsk text={solved || live ? C.askOk : C.ask[step]} hint={live ? null : (msg || (hintLv ? C.hints[step] : null))} err={!!msg} />
        <div className={'kz-scene t1-scene' + (live ? ' is-live' : '')}>
          <div className="kz-col t1-left">{live ? site : editor}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

const SCREENS = [{ id: 't1', code: 'LEVEL-1', Comp: T1 }];
const SCREEN_RESET = { t1: ['t1'] };

export default function TildaProbe({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: null })
  });
  useParallax();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
