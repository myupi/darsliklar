// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 6 «Контейнер и сетка» (20.11.2026). Набор — bs6-kit.jsx (копия урока 5), сайт — bs6-site.jsx
// (+ Containers, Grid, Breakpoints), общие куски экранов — bs6-common.jsx (из урока 3). Страница честная: настоящий CSS
// Bootstrap 6 в окне заданной ширины (vw) — @media (width>=768px) срабатывают по ширине окна, как в браузере.
// =============================================================================
const PHONE = 360, TABLET = 768, LAPTOP = 1024;   // ноутбук 1024 px: на телефоне страница крупнее (container — 960 px)
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw === TABLET ? pick(UI.tablet) : vw === LAPTOP ? pick(UI.laptop) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
// Блоки страницы кружка (карточки из урока 5).
const BLOCK_KEYS = ['b1', 'b2', 'b3', 'b4'];
const blockH = (pick, k) => '<div class="card card-body"><b>' + escH(pick(C.site[k])) + '</b></div>';   // только заголовок: страница короче и крупнее
// Страница: o = { cont, row, cols: [cls…] } — class контейнера, ряда и колонок (null — без class; cont: false — без контейнера).
function gridH(pick, o) {
  const cols = (o.cols || []).map((c, j) => '<div' + clsA(c) + '>' + blockH(pick, BLOCK_KEYS[j]) + '</div>').join('');
  const row = o.row === false ? cols : '<div' + clsA(o.row) + '>' + cols + '</div>';
  return o.cont === false ? row : '<div' + clsA(o.cont) + '>' + row + '</div>';
}
// Код страницы: контейнер, ряд и по строке на колонку. hlk: { cont, row, cols: [cls для строки j] }.
function gridLines(pick, o, hlk) {
  const H = hlk || {};
  const out = [];
  const d0 = o.cont === false ? 0 : 1, d1 = d0 + (o.row === false ? 0 : 1);
  if (o.cont !== false) out.push(hl('c' + (o.cont || ''), 0, '<div' + (o.cont ? ' class="' + o.cont + '"' : '') + '>', H.cont ? { cls: H.cont } : null));
  if (o.row !== false) out.push(hl('r' + (o.row || ''), d0, '<div' + (o.row ? ' class="' + o.row + '"' : '') + '>', H.row ? { cls: H.row } : null));
  (o.cols || []).forEach((c, j) => out.push(hl('k' + j + (c || ''), d1, '<div' + (c ? ' class="' + c + '"' : '') + '>…' + pick(C.site[BLOCK_KEYS[j]]) + '…</div>', { cls: 'b2-cut' + (H.cols && H.cols[j] ? ' ' + H.cols[j] : '') })));
  if (o.row !== false) out.push(hl('rc', d0, '</div>'));
  if (o.cont !== false) out.push(hl('cc', 0, '</div>'));
  return out;
}
// Карточка «внутри Bootstrap».
function CssCard({ pick, rules, on }) {
  return (
    <div className={'b4-css' + (on ? ' is-on' : '')}>
      <span className="b4-css-h">{pick(UI.inside)}</span>
      {rules.map((r, j) => <div key={j} className="b4-css-r" translate="no"><b>.{r[0]}</b> {'{ '}<i>{r[1]}</i>{' }'}</div>)}
    </div>
  );
}
const colRule = (c) => {
  if (c === 'container') return ['container', 'max-width: 540 / 720 / 960 / 1200 / 1440px; margin: auto'];
  if (c === 'row') return ['row', 'display: flex; flex-wrap: wrap'];
  if (c === 'col') return ['col', 'flex: 1 0 0'];
  const m = /^(?:([a-z0-9]+):)?col-(\d+)$/.exec(c || '');
  if (m) { const w = Math.round(+m[2] / 12 * 10000) / 100 + '%'; return [m[1] ? m[1] + '\\:col-' + m[2] : 'col-' + m[2], (m[1] ? '@media (width>=' + BP_PX[m[1]] + 'px) ' : '') + 'width: ' + w]; }
  return null;
};
const BP_PX = { sm: 576, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
// Переключатель ширины экрана (телефон / планшет / ноутбук).
function WidthChips({ pick, vw, onPick, seen, disabled, led }) {
  return (
    <div className="b6-widths">
      {[['phone', PHONE], ['tablet', TABLET], ['laptop', LAPTOP]].map(([k, w]) => (
        <button key={k} type="button" className={'b2-chip is-shape' + (vw === w ? ' is-on' : '') + (seen && seen[w] ? ' is-seen' : '')} onClick={() => onPick(w)} disabled={disabled} data-w={w}>
          <span>{pick(UI[k])}</span><Led on={!!led && !(seen && seen[w])} />
        </button>
      ))}
    </div>
  );
}

// ── Проверка слова в class (kind: cont | row | col; want — строка или список).
const COL_RE = /^((sm|md|lg|xl|2xl):)?col(-([1-9]|1[0-2]|auto))?$/;
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (wants.indexOf(v) >= 0) return null;
  if (/^konteyner|^kontainer|^setka|^ustun|^qator/.test(v)) return { k: 'native' };
  if (kind === 'cont') {
    if (v === 'container-fluid') return { k: 'fluid' };
    if (/^contain/.test(v)) return { k: 'noPrefix', w: 'container' };
    if (v === 'row' || COL_RE.test(v)) return { k: 'fam_cont', w: v };
    return { k: 'unknown', w: v };
  }
  if (kind === 'row') {
    if (v === 'rows') return { k: 'plural', w: 'row' };
    if (v === 'd-flex') return { k: 'flexRow' };
    if (/^container/.test(v) || COL_RE.test(v)) return { k: 'fam_row', w: v };
    return { k: 'unknown', w: v };
  }
  // kind === 'col'
  let m = /^col-(sm|md|lg|xl|xxl)-(\d+|auto)$/.exec(v);
  if (m) return { k: 'old', w: (m[1] === 'xxl' ? '2xl' : m[1]) + ':col-' + m[2] };
  m = /^(sm|md|lg|xl|2xl)[-_.](col.*)$/.exec(v);
  if (m) return { k: 'noColon', w: m[1] + ':' + m[2] };
  if (/^\d+$/.test(v)) return { k: 'noPrefix', w: 'col-' + v };
  if (COL_RE.test(v)) return { k: 'other' };   // настоящий класс, но не тот, что в образце
  if (/^((sm|md|lg|xl|2xl):)?col-\d+$/.test(v)) return { k: 'over', w: v };   // col-13 и больше
  if (v === 'row' || /^container/.test(v)) return { k: 'fam_col', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
