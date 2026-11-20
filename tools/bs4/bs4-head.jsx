// =============================================================================
// ЭКРАНЫ УРОКА 4 МОДУЛЯ BOOTSTRAP «Flex» (облик «Редактор», 20.11.2026). Набор — bs4-kit.jsx (копия урока 3: экран
// заданной ширины vw, картинки FILES), сайт — bs4-site.jsx. Страница честная: настоящий bootstrap.min.css 6.0.0-alpha.1.
// Шапка сайта — логотип, заголовок h4 и кнопка (без d-flex — друг под другом: h4 — блок); страница шириной 600 px
// (как ноутбук), на телефоне уменьшается целиком. Общие куски экранов (раунды, показ «слово с сайта», задание с полем) —
// из урока 3 (bs4-common.jsx). Сценарий — docs/scenarij-bootstrap-04-flex.md.
// =============================================================================
const PHONE = 360;
const WIDE = 480;   // шапка: страница 480 px — на телефоне крупнее, расстановка ещё видна
const CARDS = 600;  // карточки роботов: три по 150 px и расстояние до 32 px
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const BTN4 = '<button class="btn-solid theme-success">Yozilish</button>';
// Шапка: class контейнера cls; в коде — 5 строк.
const headH = (pick, cls) => '<div' + clsA(cls) + '>' + '<img src="logo.png" alt="Logo"><h4>' + escH(pick(C.site.h1)) + '</h4>' + BTN4.replace('Yozilish', escH(pick(C.site.join))) + '</div>';
// cut — строки в одну строку с многоточием (в заданиях с полем на телефоне главное — строка с полем).
const headKids = (pick, d, cut) => [hl('k1', d, '<img src="logo.png" alt="Logo">', cut ? { cls: 'b2-cut' } : null), hl('k2', d, '<h4>' + pick(C.site.h1) + '</h4>', cut ? { cls: 'b2-cut' } : null), hl('k3', d, BTN4.replace('Yozilish', pick(C.site.join)), cut ? { cls: 'b2-cut' } : null)];
const headLines = (pick, cls, extra, cut) => [hl('o' + (cls || ''), 0, '<div' + (cls ? ' class="' + cls + '"' : '') + '>', extra)].concat(headKids(pick, 1, cut), [hl('c', 0, '</div>')]);
// Карточки роботов: три картинки 150 px.
const cardsH = (cls) => '<div' + clsA(cls) + '>' + ['r1', 'r2', 'r3'].map((r) => '<img src="' + r + '.png" alt="Robot">').join('') + '</div>';
const cardsLines = (cls, extra) => [hl('o' + (cls || ''), 0, '<div' + (cls ? ' class="' + cls + '"' : '') + '>', extra), hl('i1', 1, '<img src="r1.png" alt="Robot">'), hl('i2', 1, '<img src="r2.png" alt="Robot">'), hl('i3', 1, '<img src="r3.png" alt="Robot">'), hl('c', 0, '</div>')];
// Строка контейнера с полем в class: <div class="before [поле] after">.
const divField = (before, after) => (f) => ({ k: 'o', d: 0, cls: 'b1-line is-hl', parts: clsParts({ tag: 'div', attrs: [], before, field: f, after }) });
// Карточка «внутри Bootstrap»: правило CSS этого класса.
function CssCard({ pick, rules, on }) {
  return (
    <div className={'b4-css' + (on ? ' is-on' : '')}>
      <span className="b4-css-h">{pick(UI.inside)}</span>
      {rules.map((r, j) => <div key={j} className="b4-css-r" translate="no"><b>.{r[0]}</b> {'{ '}<i>{r[1]}</i>{' }'}</div>)}
    </div>
  );
}
const JC_CSS = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around', evenly: 'space-evenly' };
const AI_CSS = { start: 'flex-start', end: 'flex-end', center: 'center', baseline: 'baseline', stretch: 'stretch' };
const GAP_REM = { 0: '0', 1: '.25rem', 2: '.375rem', 3: '.5rem', 4: '.75rem', 5: '1rem', 6: '1.25rem', 7: '1.5rem', 8: '1.75rem', 9: '2rem', 10: '2.25rem', 11: '2.5rem', 12: '3rem' };
const ruleOf = (w) => {
  if (w === 'd-flex') return ['d-flex', 'display: flex'];
  if (w === 'flex-wrap') return ['flex-wrap', 'flex-wrap: wrap'];
  if (w === 'flex-column') return ['flex-column', 'flex-direction: column'];
  let m = /^justify-content-([a-z]+)$/.exec(w); if (m && JC_CSS[m[1]]) return [w, 'justify-content: ' + JC_CSS[m[1]]];
  m = /^align-items-([a-z]+)$/.exec(w); if (m && AI_CSS[m[1]]) return [w, 'align-items: ' + AI_CSS[m[1]]];
  m = /^gap-(\d+)$/.exec(w); if (m && GAP_REM[m[1]] != null) return [w, 'gap: ' + GAP_REM[m[1]]];
  return null;
};

// ── Проверка слова в class (kind: jc | ai | gap; want — строка или список).
const KNOWN4 = { jc: Object.keys(JC_CSS).map((x) => 'justify-content-' + x), ai: Object.keys(AI_CSS).map((x) => 'align-items-' + x), gap: Object.keys(GAP_REM).map((x) => 'gap-' + x) };
const PRE4 = { jc: 'justify-content-', ai: 'align-items-', gap: 'gap-' };
const CSSV4 = { 'space-between': 'between', 'space-around': 'around', 'space-evenly': 'evenly', 'flex-start': 'start', 'flex-end': 'end' };
const NATIVE4 = /^(chap|ong|o'?ng|orta|o'?rta|markaz|markazda|chetlarga|tepa|past|left|right|middle|top|bottom|centre|oraliq|masofa)$/;
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = want == null ? KNOWN4[kind] : [].concat(want);
  const want0 = [].concat(want || KNOWN4[kind][0])[0];
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (v[0] === '.') return { k: 'dot' };
  const cp = /^(justify-content|align-items|gap)\s*:\s*([a-z0-9.-]+)/.exec(v);
  if (cp) { const val = CSSV4[cp[2]] || cp[2]; const g = cp[1] === 'gap' ? null : cp[1] + '-' + val; return { k: 'cssProp', w: g && KNOWN4[cp[1] === 'justify-content' ? 'jc' : 'ai'].indexOf(g) >= 0 ? g : want0 }; }
  if (/\s/.test(v)) return { k: 'one' };
  if (wants.indexOf(v) >= 0) return null;
  const pv = /^(justify-content|align-items)-(.+)$/.exec(v);
  if (pv && CSSV4[pv[2]]) return { k: 'cssVal', w: pv[1] + '-' + CSSV4[pv[2]] };
  if (CSSV4[v] && kind !== 'gap') return { k: 'cssVal', w: PRE4[kind] + CSSV4[v] };
  if (kind !== 'gap' && KNOWN4[kind].indexOf(PRE4[kind] + v) >= 0) return { k: 'noPrefix', w: PRE4[kind] + v };
  if (kind === 'gap') {
    if (/^\d+$/.test(v) && GAP_REM[v] != null) return { k: 'noPrefix', w: 'gap-' + v };
    if (/^(gap-?)?\d+(px|rem)?$/.test(v)) return { k: 'noSize', w: v };
  }
  if (v === 'd-flex' || v === 'flex') return { k: 'isFlex' };
  if (NATIVE4.test(v.replace(/'/g, ''))) return { k: 'native' };
  if (KNOWN4[kind].indexOf(v) >= 0) return { k: 'other' };
  const fam = Object.keys(KNOWN4).find((x) => KNOWN4[x].indexOf(v) >= 0);
  if (fam) return { k: 'fam_' + kind, w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
