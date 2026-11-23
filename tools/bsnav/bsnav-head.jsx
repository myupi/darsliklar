// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 7 «Navbar и Pagination» (23.11.2026). Набор — bsnav-kit.jsx (копия урока «Menu и Dialog» + ящик
// drawer), сайт — bsnav-site.jsx (Components → Navbar, Pagination), общие куски экранов — bsnav-common.jsx.
// Модели: Navbar (navRows) и Pagination (pagRows) — строки кода и честный HTML страницы из одних и тех же данных.
// =============================================================================
const PHONE = 360, TABLET = 768, LAPTOP = 1024;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw === TABLET ? pick(UI.tablet) : vw === LAPTOP ? pick(UI.laptop) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const DRW_ID = 'menyu';
// Переключатель ширины экрана (телефон / планшет / ноутбук) — как в уроке 6.
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

// ── NAVBAR. { plain — просто ссылки без Bootstrap; nav, expand, bg — части class у <nav>; theme — data-bs-theme; fluid; brand;
// brandText; tog: { cls, toggle, target } | false; drw: { cls, id, dis } | false; ul; li; a — class ссылок (строка или список по
// пунктам); active — номер активного пункта (null — нет); items — ключи C.site; texts — свои надписи }.
const NAV_ITEMS = ['home', 'courses', 'news', 'contact'];
const NAV_FULL = { nav: 'navbar', expand: 'md:navbar-expand', bg: 'bg-1', theme: 'dark', fluid: 'container-fluid', brand: 'navbar-brand',
  tog: { cls: 'btn-icon navbar-toggler', toggle: 'drawer', target: '#' + DRW_ID }, drw: { cls: 'drawer drawer-end', id: DRW_ID, dis: 'drawer' },
  ul: 'nav navbar-nav', li: 'nav-item', a: 'nav-link', active: 0, items: NAV_ITEMS };
const navO = (add) => Object.assign({}, NAV_FULL, add);
const NAV_PLAIN = { plain: true, items: NAV_ITEMS };
const joinC = (...xs) => { const v = xs.filter((x) => x != null && x !== '').join(' '); return v || null; };
const navCls = (o) => joinC(o.nav, o.expand, o.bg);
const aCls = (o, i) => { const base = Array.isArray(o.a) ? o.a[i] : o.a; return joinC(base, o.active === i && base ? 'active' : null); };
function navRows(pick, o) {
  const t = (k) => pick(C.site[k]);
  const label = (i) => (o.texts && o.texts[i] != null ? o.texts[i] : t(o.items[i]));
  if (o.plain) return [{ key: 'nav', d: 0, tag: 'nav', attrs: [] }, { key: 'brand', d: 1, tag: 'a', attrs: [['href', '#']], text: o.brandText || t('title'), close: true }, { key: 'ul', d: 1, tag: 'ul', attrs: [] }]
    .concat(o.items.map((k, i) => ({ key: 'i' + i, d: 2, tag: 'li', attrs: [], link: { attrs: [['href', '#']], text: label(i) } })), [{ key: 'ulc', d: 1, raw: '</ul>' }, { key: 'navc', d: 0, raw: '</nav>' }]);
  const rows = [{ key: 'nav', d: 0, tag: 'nav', attrs: [['class', navCls(o)], ['data-bs-theme', o.theme]] },
    { key: 'cf', d: 1, tag: 'div', attrs: [['class', o.fluid]] },
    { key: 'brand', d: 2, tag: 'a', attrs: [['class', o.brand], ['href', '#']], text: o.brandText || t('title'), close: true }];
  if (o.tog) rows.push({ key: 'tog', d: 2, tag: 'button', attrs: [['class', o.tog.cls], ['type', 'button'], ['data-bs-toggle', o.tog.toggle], ['data-bs-target', o.tog.target], ['aria-label', 'Menu']], tog: true });
  if (o.drw) rows.push({ key: 'drw', d: 2, tag: 'dialog', attrs: [['class', o.drw.cls], ['id', o.drw.id]] }, { key: 'dh', d: 3, tag: 'div', attrs: [['class', 'drawer-header']], dh: o.drw.dis }, { key: 'db', d: 3, tag: 'div', attrs: [['class', 'drawer-body']] });
  const dd = o.drw ? 4 : 2;
  rows.push({ key: 'ul', d: dd, tag: 'ul', attrs: [['class', o.ul]] });
  o.items.forEach((k, i) => rows.push({ key: 'i' + i, d: dd + 1, tag: 'li', attrs: [['class', o.li]], link: { attrs: [['class', aCls(o, i)], ['href', '#']], text: label(i), v: 'n' + i } }));
  // Пример с сайта (показ g1): пункт Menu и форма поиска — строками, как на сайте; потом Коди их удаляет.
  if (o.extra) rows.push({ key: 'imenu', d: dd + 1, src: '<li class="nav-item"><button class="nav-link" data-bs-toggle="menu">Menu</button>…</li>',
    html: '<li class="nav-item"><button class="nav-link" type="button" data-bs-toggle="menu">Menu</button><div class="menu"><a class="menu-item" href="#">Action</a></div></li>' });
  rows.push({ key: 'ulc', d: dd, raw: '</ul>' });
  if (o.extra) rows.push({ key: 'form', d: dd, src: '<form class="hstack gap-2" role="search">…</form>', html: '<form class="hstack gap-2" role="search"><input class="form-control" type="search" placeholder="Search"></form>' });
  if (o.drw) rows.push({ key: 'dbc', d: 3, raw: '</div>' }, { key: 'drwc', d: 2, raw: '</dialog>' });
  rows.push({ key: 'cfc', d: 1, raw: '</div>' }, { key: 'navc', d: 0, raw: '</nav>' });
  return rows;
}
// ── PAGINATION. { ul, align — второе слово у ul; li; a; act — номер активной страницы (1…3, null — нет); wrap — <nav> вокруг }.
const PAG_FULL = { ul: 'pagination', align: 'justify-content-center', li: 'page-item', a: 'page-link', act: 1 };
const pagO = (add) => Object.assign({}, PAG_FULL, add);
const PAG_PLAIN = { ul: null, align: null, li: null, a: null, act: null };
const PAG_KEYS = ['prev', '1', '2', '3', 'next'];
function pagRows(pick, o) {
  const rows = [{ key: 'pul', d: 0, tag: 'ul', attrs: [['class', joinC(o.ul, o.align)]] }];
  PAG_KEYS.forEach((k, i) => {
    const num = /^\d$/.test(k) ? +k : null;
    const liC = o.liX && o.liX[i] !== undefined ? o.liX[i] : joinC(o.li, num != null && o.act === num ? 'active' : null);   // liX / aX — свой class у пункта i (задания)
    const aC = o.aX && o.aX[i] !== undefined ? o.aX[i] : o.a;
    rows.push({ key: 'p' + i, d: 1, tag: 'li', attrs: [['class', liC]], link: { attrs: [['class', aC], ['href', '#']], text: num != null ? k : (o.texts && o.texts[k]) || pick(C.site[k]), v: num != null ? 'pg' + num : 'pg' + k } });
  });
  rows.push({ key: 'pulc', d: 0, raw: '</ul>' });
  return rows;
}
const attrsS = (attrs, esc) => attrs.filter((a) => a[1] != null).map((a) => ' ' + a[0] + '="' + (esc ? escH(a[1]) : a[1]) + '"').join('');
const NAV_TOG_ICON = '<span class="navbar-toggler-icon" aria-hidden="true"></span>';
function rowHtml(r, pick) {
  if (r.raw) return r.raw;
  if (r.html != null) return r.html;
  const open = '<' + r.tag + attrsS(r.attrs, true) + '>';
  if (r.tog) return open + NAV_TOG_ICON + '</button>';
  if (r.dh) return open + '<h5 class="drawer-title">' + escH(pick(C.site.menuTitle)) + '</h5><button type="button" class="btn-close" data-bs-dismiss="' + escH(r.dh) + '" aria-label="Close"></button></div>';
  if (r.link) return open + '<a' + attrsS(r.link.attrs, true) + (r.link.v ? ' data-v="' + r.link.v + '"' : '') + '>' + escH(r.link.text) + '</a></li>';
  if (r.text != null) return open + escH(r.text) + (r.close ? '</' + r.tag + '>' : '');
  return open;
}
function rowSrc(r) {
  if (r.raw) return r.raw;
  if (r.src != null) return r.src;
  const open = '<' + r.tag + attrsS(r.attrs) + '>';
  if (r.tog) return open + '…</button>';
  if (r.dh) return open + '…</div>';
  if (r.link) return open + '<a' + attrsS(r.link.attrs) + '>' + r.link.text + '</a></li>';
  if (r.text != null) return open + r.text + (r.close ? '</' + r.tag + '>' : '');
  return open;
}
// Новости кружка (по три на страницу) — то, что листает Pagination.
const NEWS_N = 3;
const newsH = (pick, page) => '<h5>' + escH(pick(fillL(C.site.newsPage, { n: page }))) + '</h5>'
  + C.site.newsList.slice((page - 1) * NEWS_N, page * NEWS_N).map((x) => '<div class="card" style="margin-bottom:6px"><div class="card-body"><b>' + escH(pick(x)) + '</b></div></div>').join('');
// Страница: Navbar (n), новости страницы (news — номер или null), Pagination (pg).
const pageH = (pick, n, news, pg) => (n ? navRows(pick, n).map((r) => rowHtml(r, pick)).join('') : '')
  + (news ? '<div style="padding:10px 2px 4px">' + newsH(pick, news) + '</div>' : '')
  + (pg ? pagRows(pick, pg).map((r) => rowHtml(r, pick)).join('') : '');
// Строка с полем в значении атрибута name: before / after — что стоит в значении до и после поля.
function fieldParts(r, name, node, before, after, inLink) {
  const attrs = inLink ? r.link.attrs : r.attrs;
  const out = [];
  const tagOpen = (tag, list) => {
    out.push(pn('a' + tag, '<'), <span key={'t' + tag} className="b1-tg">{tag}</span>);
    list.forEach((a, j) => {
      if (a[0] !== name && a[1] == null) return;
      if (a[0] === 'aria-label') return;
      out.push(<React.Fragment key={'s' + tag + j}>{sp()}</React.Fragment>, <span key={'n' + tag + j} className="b1-at">{a[0]}</span>, pn('e' + tag + j, '='));
      if (a[0] === name && list === attrs) out.push(<span key={'q' + tag + j} className="b1-st">{'"' + (before ? before + ' ' : '')}</span>, node, <span key={'z' + tag + j} className="b1-st">{(after ? ' ' + after : '') + '"'}</span>);
      else out.push(<span key={'v' + tag + j} className="b1-st">{'"' + a[1] + '"'}</span>);
    });
    out.push(pn('g' + tag, '>'));
  };
  if (r.link) {
    tagOpen(r.tag, r.attrs);
    tagOpen('a', r.link.attrs);
    out.push(<span key="tx" className="b1-tx">{r.link.text}</span>, pn('c1', '</'), <span key="c2" className="b1-tg">a</span>, pn('c3', '>'), pn('c4', '</'), <span key="c5" className="b1-tg">{r.tag}</span>, pn('c6', '>'));
    return out;
  }
  tagOpen(r.tag, r.attrs);
  if (r.tog) out.push(<span key="tx" className="b1-tx">…</span>, pn('c1', '</'), <span key="c2" className="b1-tg">button</span>, pn('c3', '>'));
  else if (r.text != null) out.push(<span key="tx" className="b1-tx">{r.text}</span>, pn('c1', '</'), <span key="c2" className="b1-tg">{r.tag}</span>, pn('c3', '>'));
  return out;
}
// Код: opt = { hl: { ключ: класс }, src: { ключ: своя запись строки }, gapEnd — подсвеченное пустое место в конце, field: { key, attr, node, before, after, link }, fold: { drw — ящик одной строкой, nav — весь
// Navbar одной строкой }, script, top — строки перед кодом }.
function codeLines(pick, n, pg, opt) {
  const O = opt || {};
  const H = O.hl || {};
  const F = O.fold || {};
  const out = [];
  const one = (r) => {
    const k = r.key + attrsS(r.attrs || []) + (r.text || '') + (r.link ? attrsS(r.link.attrs) + r.link.text : '');
    if (O.field && r.key === O.field.key) { out.push({ k: k + 'f', d: r.d, cls: 'b1-line is-hl', parts: fieldParts(r, O.field.attr, O.field.node, O.field.before, O.field.after, O.field.link) }); return; }
    out.push(hl(k, r.d, (O.src && O.src[r.key]) || rowSrc(r), { cls: H[r.key] || '' }));   // src — своя (свёрнутая) запись строки
  };
  if (n && F.nav) out.push(hl('navz' + navCls(n) + (n.theme || ''), 0, '<nav class="' + navCls(n) + '"' + (n.theme ? ' data-bs-theme="' + n.theme + '"' : '') + '>…</nav>', { cls: 'b2-cut' + (H.nav ? ' ' + H.nav : '') }));
  else if (n) {
    let skip = null;
    navRows(pick, n).forEach((r) => {
      if (skip) { if (r.key === skip) skip = null; return; }
      if (F.drw && r.key === 'drw') { out.push(hl('drwz', r.d, rowSrc(r) + '…</dialog>', { cls: 'b2-cut' + (H.drw ? ' ' + H.drw : '') })); skip = 'drwc'; return; }
      one(r);
    });
  }
  if (pg) pagRows(pick, pg).forEach(one);
  if (O.script) out.push(scriptL('sc', 0, { cls: H.script || '' }));
  if (O.gapEnd) out.push({ k: 'scgap', d: 0, cls: 'b1-line is-hl bn-gap', parts: [<span key="g" className="b1-tx">{'\u00a0'}</span>] });   // пустое место, где должна быть строка script
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
  navbar: ['.navbar', 'display: flex; padding; min-height: 3.5rem'],
  fluid: ['.container-fluid', 'width: 100%; display: flex; justify-content: space-between'],
  brand: ['.navbar-brand', 'font-size: 1.25rem; font-weight: 600'],
  nav: ['.navbar-nav', 'display: flex; flex-direction: column'],
  link: ['.nav-link', 'padding; color'],
  expand: ['@media (width>=768px) .md\\:navbar-expand', 'navbar-nav: row; ☰ hidden'],
  active: ['.nav-link.active', 'color: brighter; font-weight'],
  dark: ['[data-bs-theme="dark"]', 'colors of the dark theme'],
  drawer: ['.drawer[open]', 'visibility: visible; slides in'],
  pag: ['.pagination', 'display: flex'],
  plink: ['.page-link', 'padding; border; color'],
  pact: ['.page-item.active > .page-link', 'background: primary; color: white'],
  center: ['.justify-content-center', 'justify-content: center']
};
const rulesOf = (keys) => keys.map((k) => UI_RULES[k]).filter(Boolean);

// ── Проверка ответа (kind: cls | theme | toggle | target).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
const KNOWN7 = ['navbar', 'navbar-brand', 'navbar-nav', 'nav', 'nav-item', 'nav-link', 'md:navbar-expand', 'container-fluid', 'container', 'navbar-toggler', 'drawer',
  'pagination', 'page-item', 'page-link', 'active', 'justify-content-center', 'justify-content-end', 'bg-1', 'bg-primary'];
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (wants.indexOf(v) >= 0) return null;
  if (/^navbar-expand(-(sm|md|lg|xl|xxl))?$|^(sm|lg|xl):navbar-expand$/.test(v) && /navbar-expand/.test(want0)) return { k: 'expand', w: want0 };
  if (/^(navbar-dark|navbar-light|bg-dark|navbar-inverse)$/.test(v)) return { k: 'old', w: want0 };
  if (kind === 'theme') {
    if (v === 'light') return { k: 'light' };
    if (/^(black|qora|tun|night|dark-mode)$/.test(v)) return { k: 'theme' };
    return { k: 'theme' };
  }
  if (kind === 'target') {
    if (v === DRW_ID) return { k: 'noHash', w: '#' + DRW_ID };
    if (v[0] === '.') return { k: 'dotTarget', w: '#' + DRW_ID };
    return { k: 'otherId', w: '#' + DRW_ID };
  }
  if (kind === 'toggle') {
    if (v === 'menu' || v === 'dialog' || v === 'collapse' || v === 'offcanvas') return { k: 'otherUi', w: want0 };
    return { k: 'unknown', w: v };
  }
  // kind === 'cls'
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (/^(menyu|sarlavha|nom|havola|sahifa|raqam|faol|markaz|o'rta)/.test(v)) return { k: 'native' };
  if (/^(brand|link|item|logo|title)$/.test(v)) return { k: 'noPrefix', w: want0 };
  if (/^(navbar-?brend|navbarbrand|nav-?lnk|navlink|nav-links|page-?lnk|pagelink|page-links|paginaton|pagenation|pagination-list|activ|actve|justify-center|justify-content-centre)$/.test(v)) return { k: 'typo', w: want0 };
  if (KNOWN7.indexOf(v) >= 0) return { k: 'fam', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
// Телефон: код длиннее места — окно кода листается к нужной строке (поле, подсветка).
function hlScroll() {
  document.querySelectorAll('.bn-pair .kz-code, .bn-end .kz-code, .b1-tri .kz-code').forEach((c) => {
    if (c.scrollHeight <= c.clientHeight + 2) return;
    const l = c.querySelector('.kz-line:has(.kz-gap)') || c.querySelector('.kz-line.is-hl, .kz-line.is-new');
    if (!l) return;
    const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect();
    c.scrollTop = Math.max(0, Math.round(lr.top - cr.top + c.scrollTop - c.clientHeight / 2 + lr.height / 2));
  });
}
const useHlScroll = (dep) => useEffect(() => { const t = setTimeout(hlScroll, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
