// =============================================================================
// НАБОР ТЕСТОВ МОДУЛЯ «ИИ» (13.11.2026; заказчик: «вместо практики будут тесты», «тестов 5», «в тесте нет никакого
// вступления», «последний слайд вывод тоже не нужен»). Тест к уроку — 5 экранов: 5 вопросов подряд, без вступления
// и без итога; после пятого — «Testni tugatish». Облик и ИИ-симулятор — как в уроках модуля
// (tools/ai1), подключается после ai1-engine, ai1-kit, ai-common.
//   · Подсказок нет: ни лампочки, ни огоньков, ни ступеней.
//   · Одна попытка: ответ засчитан сразу; дальше — «верно» или «не так» и одна фраза почему; при ошибке подсвечен
//     верный вариант. «Назад» и «Повторить» нет.
//   · Платформе — оценка и разбор по вопросам (payload.test).
// Виды вопросов: TqPick (выбор варианта; тело вопроса — любое: карточка, сайт), TqLine (нажать строку промпта),
// TqMulti (отметить несколько, «Tekshirish»), TqWrite (написать строку промпта, ИИ строит сайт). last — пятый вопрос:
// его кнопка завершает тест (onFinished).
// =============================================================================

const TQ_UI = {
  right: L3("To'g'ri!", 'Верно!', 'Correct!'),
  wrong: L3('Unday emas', 'Не так', 'Not quite'),
  next: L3('Keyingi savol', 'Следующий вопрос', 'Next question'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  q: L3('{n}-savol', 'Вопрос {n}', 'Question {n}'),
  finish: L3('Testni tugatish', 'Завершить тест', 'Finish the test')
};
const TQ_N = 5;
const TQ_QI = { what: 0, why: 1, who: 2, inside: 3, look: 4, beh: 5, rules: 6 };

// Ответ на вопрос: одна попытка, запись в хранилище (tq_<id>: { ok, v }), реплика Коди — «верно / не так» и почему.
function useTq(id, c) {
  const log = useLog();
  const store = useStore();
  const saved = store.get('tq_' + id);
  const [ans, setAns] = useState(saved || null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: saved ? c.why : c.say, pose: saved ? (saved.ok ? 'smile' : 'think') : 'curious' }]);
  const canTap = useCanAnswer(spoken) && !ans;
  const canGo = useAdvanceGate(!!ans, spoken);
  const answer = (v, ok) => {
    if (!canTap) return;
    const a = { ok: !!ok, v };
    setAns(a); store.set('tq_' + id, a);
    sfx(ok ? 'win' : 'soft', true);
    log({ screenId: id, type: 'test', correct: !!ok, firstTry: !!ok, attempts: 1, hints: 0, depth: 0 });
    sayNow(joinL(ok ? TQ_UI.right : TQ_UI.wrong, c.why), ok ? 'cheer' : 'think');
  };
  return { ans, answer, canTap, canGo, speaker };
}
// Рамка вопроса: шапка с «N-savol», задание, тело, «верно / не так» и почему; внизу — только «Дальше».
function TqFrame({ p, c, n, Q, children, last }) {
  const pick = usePick();
  return (
    <StageB voiceTop eyebrow={fillL(TQ_UI.q, { n: String(n) })} screen={p.screen} total={p.total} speaker={Q.speaker} done={false} hint={null}
      nav={<NextBtn disabled={!Q.canGo} onClick={last ? p.finish : p.next} label={last ? TQ_UI.finish : TQ_UI.next} />}>
      <Sheet cls="a1-sheet tq-sheet">
        <KzAsk text={c.ask} />
        {children}
        {Q.ans ? (
          <div className={'tq-verdict a1-in ' + (Q.ans.ok ? 'is-ok' : 'is-bad')} role="status">
            <b>{pick(Q.ans.ok ? TQ_UI.right : TQ_UI.wrong)}</b><span>{pick(c.why)}</span>
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}
// Кнопка варианта: до ответа — обычная; после — верный зелёный, выбранный неверный — зачёркнут.
const tqOptCls = (Q, v, right) => 'kz-btn a1-opt tq-opt ' + (!Q.ans ? 'is-ghost' : v === right ? 'is-ok' : Q.ans.v === v ? 'is-bad' : 'is-dim');

// ВЫБОР ВАРИАНТА: body — что над вариантами (карточка, сайт); opts — [{ v, t }], right — верный v.
function TqPick({ p, c, id, n, body, opts, right, last }) {
  const pick = usePick();
  const Q = useTq(id, c);
  return (
    <TqFrame p={p} c={c} n={n} Q={Q} last={last}>
      <div className="kz-scene kz-scene-col tq-scene">
        <div className="kz-col">
          {body ? body(Q) : null}
          <div className="tq-opts">
            {opts.map((o) => (
              <button key={o.v} type="button" data-v={o.v} disabled={!Q.canTap} onClick={() => Q.answer(o.v, o.v === right)} className={tqOptCls(Q, o.v, right)}>
                <b>{o.v.toUpperCase()}</b><span>{pick(o.t)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TqFrame>
  );
}
// НАЖМИ СТРОКУ ПРОМПТА: rows — [{ qi, t }], right — номер строки; рядом — сайт по этому промпту.
function TqLine({ p, c, id, n, rows, right, site, last }) {
  const pick = usePick();
  const Q = useTq(id, c);
  return (
    <TqFrame p={p} c={c} n={n} Q={Q} last={last}>
      <div className="kz-scene a1-scene tq-scene">
        <div className="kz-col a1-left">
          <div className="a1-ed tq-lines">
            {rows.map((r, i) => (
              <button key={i} type="button" data-v={String(i)} disabled={!Q.canTap} onClick={() => Q.answer(String(i), i === right)}
                className={'tq-line a1-line is-q' + r.qi + (!Q.ans ? '' : i === right ? ' is-ok' : Q.ans.v === String(i) ? ' is-bad' : '')}>
                <span className="a1-q is-on">{pick(FORMULA[r.qi])}</span><span className="a1-txt"><span className="a1-val">{pick(r.t)}</span></span>
              </button>
            ))}
          </div>
        </div>
        <div className="kz-col a1-right"><AiBrowser site={site} /></div>
      </div>
    </TqFrame>
  );
}
// ОТМЕТЬ НЕСКОЛЬКО: opts — [{ v, qi, t }] (строки промпта), right — массив верных v; «Tekshirish» засчитывает.
function TqMulti({ p, c, id, n, card, opts, right, last }) {
  const pick = usePick();
  const Q = useTq(id, c);
  const [sel, setSel] = useState(() => (Q.ans ? Q.ans.v : []));
  const tap = (v) => { if (!Q.canTap) return; sfx('tap', true); setSel(sel.indexOf(v) >= 0 ? sel.filter((x) => x !== v) : sel.concat(v)); };
  const go = () => Q.answer(sel, sel.length === right.length && right.every((v) => sel.indexOf(v) >= 0));
  return (
    <TqFrame p={p} c={c} n={n} Q={Q} last={last}>
      <div className="kz-scene kz-scene-col tq-scene">
        <div className="kz-col">
          {card ? <TaskCard c={{ card }} /> : null}
          <div className="tq-multi">
            {opts.map((o) => {
              const on = sel.indexOf(o.v) >= 0, good = right.indexOf(o.v) >= 0;
              return (
                <button key={o.v} type="button" data-v={o.v} disabled={!Q.canTap} onClick={() => tap(o.v)}
                  className={'tq-mrow a1-line is-q' + o.qi + (on ? ' is-sel' : '') + (!Q.ans ? '' : good ? ' is-ok' : on ? ' is-bad' : '')}>
                  <i className="tq-box" aria-hidden="true">{on ? '✓' : ''}</i>
                  <span className="a1-q is-on">{pick(FORMULA[o.qi])}</span><span className="a1-txt"><span className="a1-val">{pick(o.t)}</span></span>
                </button>
              );
            })}
          </div>
          {!Q.ans ? <button type="button" className="kz-btn tq-go" disabled={!Q.canTap || !sel.length} onClick={go}>{pick(TQ_UI.check)}</button> : null}
        </div>
      </div>
    </TqFrame>
  );
}
// НАПИШИ СТРОКУ ПРОМПТА: given — готовые строки ({ key: L3 }), key — строка ученика (qi — её вопрос), check(pr) → true/false.
function TqWrite({ p, c, id, n, given, keyName, qi, check, last }) {
  const pick = usePick();
  const Q = useTq(id, c);
  const [val, setVal] = useState(Q.ans ? Q.ans.v : '');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(Q.ans ? Q.ans.v : null);
  const base = {};
  Object.keys(given).forEach((k) => { base[k] = pick(given[k]); });
  const send = () => {
    if (!Q.canTap || busy || !String(val).trim()) return;
    const v = noSemi(val);
    sfx('pop', true); setBusy(true);
    setTimeout(() => { setBusy(false); setSent(v); Q.answer(v, check(Object.assign({}, base, { [keyName]: v }))); }, AI_MS());
  };
  const pr = sent != null ? Object.assign({}, base, { [keyName]: sent }) : base;
  const site = aiSite(pick, pr);
  const keys = Object.keys(given).concat(keyName);
  const rows = keys.map((k, i) => (k === keyName
    ? (sent != null || busy ? txtRow(sent != null ? sent : val, qi) : { q: FORMULA[qi], on: true, cls: 'is-task', body: <PromptSlot value={val} onChange={setVal} onEnter={send} ph={c.ph} max={120} /> })
    : txtRow(base[k], TQ_QI[k])));
  return (
    <TqFrame p={p} c={c} n={n} Q={Q} last={last}>
      <div className="kz-scene a1-scene tq-scene">
        <div className="kz-col a1-left">
          {c.card ? <TaskCard c={c} /> : null}
          <PromptEditor rows={rows} send={!Q.ans ? (
            <button type="button" className={'a1-send' + (String(val).trim() ? ' is-ready' : '')} disabled={!Q.canTap || busy} onClick={send}>
              <span>{pick(busy ? UI.thinking : UI.send)}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>) : null} />
        </div>
        <div className="kz-col a1-right"><AiBrowser site={site} busy={busy} /></div>
      </div>
    </TqFrame>
  );
}

// Оценка для платформы.
const tqPayload = (store, ids) => {
  const answers = ids.map((id) => { const a = store.get('tq_' + id); return { id, ok: !!(a && a.ok) }; });
  return { score: answers.filter((a) => a.ok).length, max: ids.length, answers };
};
