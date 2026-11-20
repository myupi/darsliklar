// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 9 «Menu и Dialog» (20.11.2026). Набор — bs9-kit.jsx (копия урока 8, движок меню и окна bsUi),
// сайт — bs9-site.jsx (+ Components → Menu, Dialog), общие куски экранов — bs9-common.jsx (из урока 3).
// =============================================================================
const PHONE = 360;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const DLG_ID = 'qoidalar';
// Меню: { btn — class кнопки, toggle — data-bs-toggle, cls — class меню, items: [{ kind: item | hdr | div, cls, k (текст C.site) }],
// stat — открыто на месте (show position-static, как примеры сайта) }.
const MENU_FULL = { btn: 'btn-solid theme-primary', toggle: 'menu', cls: 'menu', items: [{ kind: 'item', cls: 'menu-item', k: 'g1' }, { kind: 'item', cls: 'menu-item', k: 'g2' }, { kind: 'item', cls: 'menu-item', k: 'g3' }] };
const menuO = (add) => Object.assign({}, MENU_FULL, add);
const setMI = (o, i, add) => Object.assign({}, o, { items: o.items.map((x, j) => (j === i ? Object.assign({}, x, add) : x)) });
// Окно: { tag — dialog (или div — правила просто на странице), trig — { cls, toggle, target, backdrop }, cls, id, size, hdr, title,
// x — data-bs-dismiss крестика, body, foot, fbtn — data-bs-dismiss кнопки внизу, open — открыто на месте (атрибут open) }.
const DLG_FULL = { tag: 'dialog', trig: { cls: 'btn-outline theme-primary', toggle: 'dialog', target: '#' + DLG_ID, backdrop: null }, cls: 'dialog', id: DLG_ID, size: null,
  hdr: 'dialog-header', title: 'dialog-title', x: 'dialog', body: 'dialog-body', foot: 'dialog-footer', fbtn: 'dialog', open: false };
const dlgO = (add) => Object.assign({}, DLG_FULL, add);
const trigO = (o, add) => Object.assign({}, o, { trig: Object.assign({}, o.trig, add) });
function menuRows(pick, o) {
  const t = (k) => pick(C.site[k]);
  const rows = [{ key: 'mbtn', d: 0, tag: 'button', attrs: [['class', o.btn], ['data-bs-toggle', o.toggle]], text: o.btnText != null ? o.btnText : t('sections'), close: true }];
  if (o.cls === false) return rows;
  rows.push({ key: 'menu', d: 0, tag: 'div', attrs: [['class', o.cls == null ? null : o.cls + (o.stat ? ' show position-static' : '')]] });
  o.items.forEach((it, i) => {
    if (it.kind === 'div') rows.push({ key: 'm' + i, d: 1, tag: 'hr', attrs: [['class', it.cls]] });
    else if (it.kind === 'hdr') rows.push({ key: 'm' + i, d: 1, tag: 'h6', attrs: [['class', it.cls]], text: t(it.k), close: true });
    else rows.push({ key: 'm' + i, d: 1, tag: 'a', attrs: [['class', it.cls], ['href', '#']], text: it.text != null ? it.text : t(it.k), close: true, v: it.k || 'own' });
  });
  rows.push({ key: 'menuc', d: 0, raw: '</div>' });
  return rows;
}
function dlgRows(pick, o) {
  const t = (k) => pick(C.site[k]);
  const T = o.trig || {};
  const rows = [];
  if (o.trig !== false) rows.push({ key: 'tbtn', d: 0, tag: 'button', attrs: [['class', T.cls], ['data-bs-toggle', T.toggle], ['data-bs-target', T.target], ['data-bs-backdrop', T.backdrop]], text: o.trigText != null ? o.trigText : t('rulesBtn'), close: true });
  const tag = o.tag || 'dialog';
  rows.push({ key: 'dlg', d: 0, tag, attrs: [['class', o.cls == null ? null : o.cls + (o.size ? ' ' + o.size : '')], ['id', o.id], ['open', o.open ? '' : null]] });
  rows.push({ key: 'hdr', d: 1, tag: 'div', attrs: [['class', o.hdr]] },
    { key: 'title', d: 2, tag: 'h1', attrs: [['class', o.title]], text: o.titleText != null ? o.titleText : t('rulesTitle'), close: true },
    { key: 'x', d: 2, tag: 'button', attrs: [['class', 'btn-close'], ['data-bs-dismiss', o.x], ['aria-label', 'Close']], text: '', close: true },
    { key: 'hdrc', d: 1, raw: '</div>' },
    { key: 'body', d: 1, tag: 'div', attrs: [['class', o.body]], inner: o.bodyText != null ? o.bodyText : t('rulesText') },
    { key: 'foot', d: 1, tag: 'div', attrs: [['class', o.foot]] },
    { key: 'fbtn', d: 2, tag: 'button', attrs: [['class', 'btn-solid theme-primary'], ['data-bs-dismiss', o.fbtn]], text: o.fbtnText != null ? o.fbtnText : t('ok'), close: true },
    { key: 'footc', d: 1, raw: '</div>' },
    { key: 'dlgc', d: 0, raw: '</' + tag + '>' });
  return rows;
}
const attrsS = (attrs, esc) => attrs.filter((a) => a[1] != null).map((a) => ' ' + a[0] + (a[1] === '' && a[0] === 'open' ? '' : '="' + (esc ? escH(a[1]) : a[1]) + '"')).join('');
function rowHtml9(r) {
  if (r.raw) return r.raw;
  const open = '<' + r.tag + attrsS(r.attrs, true) + (r.v ? ' data-v="' + r.v + '"' : '') + '>';
  if (r.inner != null) return open + '<p>' + escH(r.inner) + '</p></div>';
  if (r.text != null) return open + escH(r.text) + (r.close ? '</' + r.tag + '>' : '');
  return open;
}
function rowSrc9(r) {
  if (r.raw) return r.raw;
  const open = '<' + r.tag + attrsS(r.attrs) + '>';
  if (r.inner != null) return open + '<p>…</p></div>';
  if (r.text != null) return open + r.text + (r.close ? '</' + r.tag + '>' : '');
  return open;
}
const uiH = (pick, m, dl) => (m ? menuRows(pick, m).map(rowHtml9).join('') : '') + (m && dl ? ' ' : '') + (dl ? dlgRows(pick, dl).map(rowHtml9).join('') : '');
// Строка с полем: в значении атрибута name (before — что стоит в значении перед полем).
function fieldParts(r, name, node, before) {
  const out = [pn('a', '<'), <span key="t" className="b1-tg">{r.tag}</span>];
  r.attrs.forEach((a, j) => {
    if (a[0] !== name && a[1] == null) return;
    out.push(<React.Fragment key={'s' + j}>{sp()}</React.Fragment>, <span key={'n' + j} className="b1-at">{a[0]}</span>, pn('e' + j, '='));
    if (a[0] === name) out.push(<span key={'q' + j} className="b1-st">{'"' + (before || '')}</span>, node, <span key={'z' + j} className="b1-st">"</span>);
    else out.push(<span key={'v' + j} className="b1-st">{'"' + a[1] + '"'}</span>);
  });
  out.push(pn('g', '>'));
  if (r.inner != null) out.push(<span key="in" className="b1-tx">{'<p>…</p></div>'}</span>);
  else if (r.text != null) out.push(<span key="tx" className="b1-tx">{r.text}</span>, pn('c1', '</'), <span key="c2" className="b1-tg">{r.tag}</span>, pn('c3', '>'));
  return out;
}
// Код: opt = { hl: { ключ: класс }, field: { key, attr, node, before }, fold: { hdr, foot } — часть окна одной строкой, script }.
function uiLines(pick, m, dl, opt) {
  const O = opt || {};
  const H = O.hl || {};
  const F = O.fold || {};
  const out = [];
  const rows = (m ? menuRows(pick, m) : []).concat(dl ? dlgRows(pick, dl) : []);
  let skip = null;
  rows.forEach((r) => {
    if (skip) { if (r.key === skip) skip = null; return; }
    const k = r.key + attrsS(r.attrs || []) + (r.text || '');
    if ((r.key === 'hdr' && F.hdr) || (r.key === 'foot' && F.foot)) {
      out.push(hl(k + 'z', r.d, rowSrc9(r) + '…</div>', { cls: 'b2-cut' + (H[r.key] ? ' ' + H[r.key] : '') }));
      skip = r.key === 'hdr' ? 'hdrc' : 'footc';
      return;
    }
    if (O.field && r.key === O.field.key) {
      out.push({ k: k + 'f', d: r.d, cls: 'b1-line is-hl', parts: fieldParts(r, O.field.attr, O.field.node, O.field.before) });
      return;
    }
    out.push(hl(k, r.d, rowSrc9(r), { cls: H[r.key] || '' }));
  });
  if (O.script) out.push(scriptL('sc', 0, { cls: H.script || '' }));
  return out;
}
// Карточка «внутри Bootstrap».
function CssCard({ pick, rules, on }) {
  return (
    <div className={'b4-css' + (on ? ' is-on' : '')}>
      <span className="b4-css-h">{pick(UI.inside)}</span>
      {rules.map((r, j) => <div key={j} className="b4-css-r" translate="no"><b>{r[0]}</b> {'{ '}<i>{r[1]}</i>{' }'}</div>)}
    </div>
  );
}
const UI_RULES = {
  menu: ['.menu', 'display: none; position: absolute; border; shadow'],
  show: ['.menu.show', 'display: flex'],
  item: ['.menu-item', 'width: 100%; padding'],
  dialog: ['.dialog', 'width: 500px; border-radius; shadow'],
  open: ['.dialog[open]', 'visibility: visible; opacity: 1'],
  parts: ['.dialog-header / -body / -footer', 'padding; border'],
  hdr: ['.menu-header', 'small gray text'],
  div: ['.menu-divider', 'border-top: 1px']
};
const rulesOf = (keys) => keys.map((k) => UI_RULES[k]).filter(Boolean);

// ── Проверка ответа (kind: cls | toggle | target | dismiss).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
const KNOWN9 = ['menu', 'menu-item', 'menu-header', 'menu-divider', 'dialog', 'dialog-header', 'dialog-title', 'dialog-body', 'dialog-footer', 'btn-close'];
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (wants.indexOf(v) >= 0) return null;
  if (/^(dropdown|dropdown-menu|dropdown-item|dropdown-divider|dropdown-header|modal|modal-header|modal-body|modal-footer|modal-title|modal-dialog|modal-content)$/.test(v)) return { k: 'old', w: want0 };
  if (kind === 'target') {
    if (v === DLG_ID) return { k: 'noHash', w: '#' + DLG_ID };
    if (v[0] === '#') return { k: 'otherId', w: '#' + DLG_ID };
    if (v[0] === '.') return { k: 'dotTarget', w: '#' + DLG_ID };
    return { k: 'noHash', w: '#' + DLG_ID };
  }
  if (kind === 'toggle' || kind === 'dismiss') {
    if (v === 'menu' || v === 'dialog') return { k: 'otherUi', w: want0 };
    if (/^(menyu|oyna|ochish|yopish|open|close|show|hide)$/.test(v)) return { k: 'uiWord', w: want0 };
    return { k: 'unknown', w: v };
  }
  // kind === 'cls'
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (/^(menyu|oyna|bo'lim|qism|sarlavha)/.test(v)) return { k: 'native' };
  if (/^(item|header|divider|body|footer|title)$/.test(v)) return { k: 'noPrefix', w: (/^(item|header|divider)$/.test(v) ? 'menu-' : 'dialog-') + v };
  if (/^menu-?(items|itme|iten)$|^menuitem$/.test(v) || /^dialog-?(bodi|boby|fotter|footer s)$|^dialogbody$/.test(v)) return { k: 'typo', w: want0 };
  if (KNOWN9.indexOf(v) >= 0) return { k: 'fam', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
// Телефон: код длиннее места — окно кода листается к нужной строке (поле, подсветка), как редактор (урок 8).
function hlScroll() {
  document.querySelectorAll('.b9-pair .kz-code, .b9-end .kz-code').forEach((c) => {
    if (c.scrollHeight <= c.clientHeight + 2) return;
    const l = c.querySelector('.kz-line:has(.kz-gap)') || c.querySelector('.kz-line.is-hl, .kz-line.is-new');
    if (!l) return;
    const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect();
    c.scrollTop = Math.max(0, Math.round(lr.top - cr.top + c.scrollTop - c.clientHeight / 2 + lr.height / 2));
  });
}
const useHlScroll = (dep) => useEffect(() => { const t = setTimeout(hlScroll, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
