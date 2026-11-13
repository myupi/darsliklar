// =============================================================================
// ЭКРАНЫ ТЕСТА К УРОКУ 1 МОДУЛЯ «ИИ» (13.11.2026): 5 вопросов (без вступления и итога); виды вопросов — tools/aitest/test-kit.jsx.
// =============================================================================

function Tq1Screen({ p }) { return <TqPick p={p} c={C.q1} id="q1" n={1} opts={C.q1.opts} right="b" />; }
function Tq2Screen({ p }) {
  const pick = usePick();
  const c = C.q2;
  const site = aiSite(pick, { what: pick(c.what), why: pick(c.whyLine) });
  return <TqPick p={p} c={c} id="q2" n={2} opts={c.opts} right="b" body={() => <div className="a1-which-site tq-site"><AiBrowser site={site} small /></div>} />;
}
function Tq3Screen({ p }) {
  const pick = usePick();
  const c = C.q3;
  return <TqLine p={p} c={c} id="q3" n={3} rows={c.rows} right={1} site={aiSite(pick, { what: pick(c.rows[0].t), why: pick(c.rows[1].t) })} />;
}
function Tq4Screen({ p }) { const c = C.q4; return <TqMulti p={p} c={c} id="q4" n={4} card={c.card} opts={c.opts} right={['a', 'd']} />; }
function Tq5Screen({ p }) {
  const c = C.q5;
  return <TqWrite p={p} c={c} id="q5" n={5} given={{ what: c.what }} keyName="why" qi={1} last check={(pr) => !!goalsOf(pr.why).order} />;
}
const TQ_IDS = ['q1', 'q2', 'q3', 'q4', 'q5'];

const SCREENS = [
  { id: 'q1', code: 'TEST-1', Comp: Tq1Screen }, { id: 'q2', code: 'TEST-2', Comp: Tq2Screen }, { id: 'q3', code: 'TEST-3', Comp: Tq3Screen },
  { id: 'q4', code: 'TEST-4', Comp: Tq4Screen }, { id: 'q5', code: 'TEST-5', Comp: Tq5Screen }
];
const SCREEN_RESET = {};

export default function AiTest1({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ test: tqPayload(store, TQ_IDS) })
  });
  useParallax();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
