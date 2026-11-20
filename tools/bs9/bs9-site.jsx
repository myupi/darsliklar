// =============================================================================
// ПОХОЖИЙ САЙТ BOOTSTRAP (урок 9 модуля: копия сайта урока 8, страница Carousel заменена на Components → Menu и Dialog —
// сверены с docs/6.0, 20.11.2026). Урок 8: копия сайта урока 7, страницы прежних уроков (кроме Install и Alert) убраны ради веса,
// + Components → Carousel — сверена с docs/6.0, 20.11.2026). Урок 7: копия сайта урока 6 + Forms → Overview, Form control, Checkbox, Radio, Switch —
// сверены с docs/6.0, 20.11.2026: select тоже с form-control, выноска «Heads up!»; меню Forms — как на сайте).
// Урок 6: копия сайта урока 5 + Layout → Containers, Grid, Breakpoints — сверены с docs/6.0,
// 20.11.2026). Урок 5: копия сайта урока 4 + страница Card.
// Урок 4: копия сайта урока 3 + страницы Flex, Justify content, Align items, Gap — сверены
// с getbootstrap.com/docs/6.0, 20.11.2026). Урок 3: копия сайта урока 2, tools/bs2/bs2-site.jsx, + страницы Images, Border radius,
// Spinner, Placeholder — код и разделы сверены с getbootstrap.com/docs/6.0, 20.11.2026). Урок 2 (Button, Colors,
// Background, выделение строки или слова в коде, как мышкой).
// Урок 1 ( заказчик, 19.11.2026: «чтобы сайт бутстрапа был почти
// точь в точь как там, чтобы ученик не терялся, зайдя в бутстрап; покажи, как заходят на сайт, начиная с гугл поиска»).
// Сверено с getbootstrap.com (v6.0, светлая тема, 19.11.2026): шапка (знак, Docs · Examples · Icons · Blog, поиск
// «Search docs… ⌘K», v6.0, тема), главная (плашка, заголовок, npm, «For Agents», «Read the docs»), документация (меню
// слева с цветными значками разделов, заголовок 40 px, «View & Edit», блок кода «HTML» со значком копирования),
// на телефоне — «B / Docs», лупа, v6.0, тема и ☰, меню выезжает. Цвета — те же (oklch сайта переведены в hex).
// Знак Bootstrap — тот же рисунок (MIT, репозиторий twbs/bootstrap). Страница поиска Google — упрощённая, как в браузере.
// =============================================================================
const BS_LOGO_D = 'M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z';
const BsLogo = ({ h }) => <svg className="bx-logo" viewBox="0 0 118 94" height={h || 22} width={(h || 22) * 118 / 94} aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d={BS_LOGO_D} /></svg>;
const BX_ICONS = {
  book: <path d="M2 3.2c1.8-.9 3.8-.9 6 .6v9c-2.2-1.4-4.2-1.4-6-.6zM14 3.2c-1.8-.9-3.8-.9-6 .6v9c2.2-1.4 4.2-1.4 6-.6z" />,
  map: <path d="M1.5 3.5 6 2l4 1.6L14.5 2v10.5L10 14l-4-1.6-4.5 1.5zM6 2v10.4M10 3.6V14" fill="none" stroke="currentColor" strokeWidth="1.3" />,
  palette: <path d="M8 1.5a6.5 6.5 0 1 0 0 13c1 0 1.4-.7 1.1-1.5-.4-1 .2-1.8 1.2-1.8h1.5A2.7 2.7 0 0 0 14.5 8 6.5 6.5 0 0 0 8 1.5zM4.6 8a1 1 0 1 1 0-.01M6.5 4.8a1 1 0 1 1 0-.01M9.8 4.8a1 1 0 1 1 0-.01" />,
  grid: <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />,
  file: <path d="M3.5 1.5h6l3 3v10h-9zM9.5 1.5v3h3M5.5 8h5M5.5 10.5h5" fill="none" stroke="currentColor" strokeWidth="1.3" />,
  radios: <path d="M4.5 5.5a2.2 2.2 0 1 1 0-.01M4.5 11.5a2.2 2.2 0 1 1 0-.01M8.5 5.5h6M8.5 11.5h6" fill="none" stroke="currentColor" strokeWidth="1.4" />,
  menu: <path d="M1.5 3.5h13v4h-13zM1.5 9.5h13v3h-13z" />,
  magic: <path d="M10.5 1.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6zM2 13.8l7.2-7.2 1.4 1.4-7.2 7.2z" />,
  braces: <path d="M5.5 2C4 2 4 3 4 4.5S3.5 7 2.2 8C3.5 9 4 9.5 4 11.5S4 14 5.5 14M10.5 2C12 2 12 3 12 4.5s.5 2.5 1.8 3.5c-1.3 1-1.8 1.5-1.8 3.5S12 14 10.5 14" fill="none" stroke="currentColor" strokeWidth="1.3" />
};
const BxIcon = ({ n, c }) => <svg className="bx-ic" viewBox="0 0 16 16" width="14" height="14" style={{ color: c }} fill="currentColor" aria-hidden="true">{BX_ICONS[n]}</svg>;
const CopyIcon = ({ ok }) => (ok
  ? <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  : <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M11 3.5V3a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 2 3v6.5A1.5 1.5 0 0 0 3.5 11H4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>);

// Меню документации — разделы и пункты, как на сайте 6.0 (значок и цвет раздела — как у сайта).
const BD_NAV = [
  { g: 'start', t: 'Getting started', ic: 'book', c: '#7740ff', items: ['Install', 'AI', 'Approach', 'CSS variables', 'JavaScript', 'Browsers & devices', 'Accessibility'] },
  { g: 'guides', t: 'Guides', ic: 'map', c: '#00b15a', items: ['Quickstart', 'npm', 'Vite', 'Migration'] },
  { g: 'custom', t: 'Customize', ic: 'palette', c: '#e12871', items: ['Overview', 'Sass', 'Color', 'Theme'] },
  { g: 'layout', t: 'Layout', ic: 'grid', c: '#00beb6', items: ['Breakpoints', 'Containers', 'Grid', 'Columns', 'Gutters'] },
  { g: 'content', t: 'Content', ic: 'file', c: '#77828c', items: ['Reboot', 'Typography', 'Images', 'Tables', 'Prose'] },
  { g: 'forms', t: 'Forms', ic: 'radios', c: '#0087fe', items: ['Overview', 'Field', 'Form control', 'Checkbox', 'Radio', 'Switch', 'Range', 'Input group', 'Floating labels', 'Form adorn', 'Chips', 'Combobox', 'Datepicker', 'OTP input', 'Password strength', 'Layout', 'Validation'] },
  { g: 'comp', t: 'Components', ic: 'menu', c: '#00b4f8', items: ['Accordion', 'Alert', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'Button group', 'Card', 'Carousel', 'Close button', 'Collapse', 'Dialog', 'Drawer', 'List group', 'Menu', 'Nav', 'Navbar', 'Pagination', 'Placeholder', 'Popover', 'Spinner', 'Toasts', 'Tooltip'] },
  { g: 'helpers', t: 'Helpers', ic: 'magic', c: '#ff6800', items: ['Focus ring', 'Position', 'Stacks'] },
  { g: 'util', t: 'Utilities', ic: 'braces', c: '#e62845', items: ['API', 'Colors', 'Background', 'Color scheme', 'Theme', 'Display', 'Align items', 'Flex', 'Gap', 'Justify content', 'Margin', 'Padding', 'Border', 'Border radius'] }
];
// «Overview» есть и в Customize, и в Forms: в уроке 7 это страница Forms (заголовок «Forms», адрес forms/overview/).
const bdGrp = (item) => (item === 'Overview' ? BD_NAV.find((g) => g.g === 'forms') : BD_NAV.find((g) => g.items.indexOf(item) >= 0));
const bdGroupOf = (item) => (bdGrp(item) || BD_NAV[0]).g;
const bdPath = (item) => { const g = bdGrp(item); const sec = g ? g.t.toLowerCase().replace(/\s+/g, '-') : 'getting-started'; return 'getbootstrap.com/docs/6.0/' + sec + '/' + item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '/'; };
const bdTitle = (item) => (item === 'Install' ? 'Install Bootstrap' : item === 'Overview' ? 'Forms' : item) + ' · Bootstrap v6.0';
const ALERT_DEFAULT = '<div class="alert" role="alert">\n  <p>' + SAMPLE + '</p>\n</div>';
const variantLine = (t) => '<div class="alert theme-' + t + '" role="alert">';
const CDN_BLOCK = LINK_HTML + '\n' + SCRIPT_HTML;
// Урок 2 — страницы Button, Colors, Background (код — как на сайте 6.0; цвета — BS_THEMES по порядку сайта).
const BS_TITLE = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const btnLine = (shape, t) => '<button type="button" class="' + shape + ' theme-' + t + '">' + BS_TITLE(t) + '</button>';
const BTN_VARIANTS = BS_THEMES.map((t) => btnLine('btn-solid', t)).concat(BS_THEMES.map((t) => btnLine('btn-outline', t)));
const BTN_VARIANTS_EX = ['btn-solid', 'btn-outline'].map((sh) => '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">' + BS_THEMES.map((t) => btnLine(sh, t)).join('') + '</div>').join('');
const FG_LINES = BS_THEMES.map((t) => '<p class="fg-' + t + '">.fg-' + t + '</p>');
const BG_LINES = BS_THEMES.map((t) => '<div class="p-3 mb-2 bg-' + t + ' fg-contrast-' + t + '">.bg-' + t + '</div>');
// Урок 9 — Components → Menu и Dialog (код — как на сайте 6.0: кнопка data-bs-toggle="menu" и соседний .menu с .menu-item;
// родной <dialog class="dialog"> с dialog-header / dialog-body / dialog-footer, кнопка data-bs-toggle="dialog").
const MENU_OVER = ['<button class="btn-solid theme-primary" type="button" data-bs-toggle="menu" aria-expanded="false">', '  Toggle menu', '</button>', '<div class="menu">', '  <a class="menu-item" href="#">Menu item 1</a>', '  <a class="menu-item" href="#">Menu item 2</a>', '  <a class="menu-item" href="#">Menu item 3</a>', '</div>'];
const MENU_DIV = ['<div class="menu show position-static">', '  <a class="menu-item" href="#">Action</a>', '  <a class="menu-item" href="#">Another action</a>', '  <a class="menu-item" href="#">Something else here</a>', '  <hr class="menu-divider">', '  <a class="menu-item" href="#">Separated link</a>', '</div>'];
const MENU_HDR = ['<div class="menu show position-static">', '  <a class="menu-item" href="#">Action</a>', '  <a class="menu-item" href="#">Action</a>', '  <h6 class="menu-header">Menu header</h6>', '  <a class="menu-item" href="#">Another action</a>', '</div>'];
const DLG_EX = ['<button type="button" class="btn-solid theme-primary" data-bs-toggle="dialog" data-bs-target="#exampleDialog">', '  Open dialog', '</button>', '', '<dialog class="dialog" id="exampleDialog">', '  <div class="dialog-header">', '    <h1 class="dialog-title">Dialog title</h1>',
  '    <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>', '  </div>', '  <div class="dialog-body">', '    <p>This is a native dialog element. It uses the browser’s built-in modal behavior for accessibility and focus management.</p>', '  </div>', '  <div class="dialog-footer">',
  '    <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="dialog">Close</button>', '    <button type="button" class="btn-solid theme-primary">Save changes</button>', '  </div>', '</dialog>'];
const DLG_SIZES = ['<dialog class="dialog dialog-xl">…</dialog>', '<dialog class="dialog dialog-lg">…</dialog>', '<dialog class="dialog">…</dialog>', '<dialog class="dialog dialog-sm">…</dialog>'];
const BLOCKS9 = { mover: MENU_OVER, mdiv: MENU_DIV, mhdr: MENU_HDR, dex: DLG_EX, dsizes: DLG_SIZES };
const lineOf = (block, i) => (block === 'variants' ? BTN_VARIANTS : block === 'colors' ? FG_LINES : block === 'bg' ? BG_LINES : BLOCKS9[block])[i];
const exOf = (rows) => rows.join('').replace(/>\s+</g, '><');
function useNarrow(ref, px) {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const upd = () => setNarrow(el.clientWidth < px);
    upd();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return narrow;
}
// Кнопка копирования — значок в углу блока, как на сайте; после нажатия — галочка и подсказка «Copied!».
function CopyBtn({ k, copied, onCopy, led, disabled, hl: lit }) {
  const on = copied === k;
  return (
    <button type="button" className={'bd-copy' + (on ? ' is-on' : '') + (lit ? ' is-hl' : '')} disabled={disabled} onClick={onCopy ? () => onCopy(k) : undefined} data-copy={k} aria-label="Copy to clipboard" translate="no">
      <CopyIcon ok={on} />{on ? <span className="bd-tip">Copied!</span> : null}<Led on={!!led} />
    </button>
  );
}
// Строки кода на сайте можно выделять, как мышкой (урок 2): onLine(i) — нажали строку i (выделить и скопировать);
// sel — выделенная строка (синее выделение браузера); word — { i, w } выделенное слово в строке i; lineLed — огонёк у строки.
function CodeBlock({ label, code, k, copied, onCopy, led, hl: lit, copyHl, disabled, mark, attach, onLine, sel, word, lineLed, lineOff }) {
  const rows = code.split('\n');
  return (
    <div className={'bd-code' + (lit ? ' is-hl' : '') + (attach ? ' is-attach' : '') + (onLine ? ' is-lines' : '')} data-code={k}>
      <div className="bd-code-bar"><span>{label || 'HTML'}</span><CopyBtn k={k} copied={copied} onCopy={onCopy} led={led} hl={copyHl} disabled={disabled} /></div>
      <pre translate="no">{rows.map((ln, i) => {
        const cls = (mark && mark.indexOf(i) >= 0 ? 'is-mk' : '') + (sel === i ? ' is-sel' : '');
        const kids = hParts(ln, word && word.i === i ? { word: word.w } : null);
        return onLine
          ? <button key={i} type="button" className={'bd-ln ' + cls} data-ln={i} onClick={() => onLine(i)} disabled={lineOff}>{kids}<Led on={lineLed === i} /></button>
          : <div key={i} className={cls} data-ln={i}>{kids}</div>;
      })}</pre>
    </div>
  );
}
// Примеры на странице сайта — та же честная отрисовка Bootstrap.
const BdExample = ({ html, hl: lit, zoom }) => <div className={'bd-ex' + (lit ? ' is-hl' : '')}><div className="bd-ex-in"><BsFrame body={html} bs dep={html} zoom={zoom || 0.72} /></div></div>;
// Шапка сайта. home — главная; на телефоне (narrow) — «B / Docs», лупа, v6.0, тема и ☰ (у документации).
function BxHeader({ narrow, home, onBurger, burgerHl, burgerLed }) {
  if (narrow) return (
    <div className="bx-top is-narrow">
      <BsLogo h={20} /><span className="bx-crumb">/ {home ? 'Home' : 'Docs'} <i>⌄</i></span>
      <span className="bx-top-r"><span className="bx-search-ic" aria-hidden="true">⌕</span><span className="bx-ver">v6.0 <i>⌄</i></span><span className="bx-theme" aria-hidden="true">◐</span>
        {!home ? <button type="button" className={'bx-burger' + (burgerHl ? ' is-hl' : '')} onClick={onBurger} aria-label="Toggle docs navigation" data-x="burger">☰<Led on={!!burgerLed} /></button> : null}</span>
    </div>
  );
  return (
    <div className="bx-top">
      <BsLogo h={20} /><span className={'bx-nav' + (home ? '' : ' is-docs')}><b>Docs</b><span>Examples</span><span>Icons</span><span>Blog</span></span>
      <span className="bx-search">⌕ Search docs… <kbd>⌘K</kbd></span>
      <span className="bx-top-r"><span className="bx-ver">v6.0 <i>⌄</i></span><span className="bx-theme" aria-hidden="true">◐</span></span>
    </div>
  );
}
// Главная getbootstrap.com: плашка, заголовок, текст, npm, «For Agents», «Read the docs».
function BxHome({ onRead, readLed, readHl }) {
  const ref = useRef(null);
  const narrow = useNarrow(ref, 560);
  return (
    <div ref={ref} className={'bx bx-home' + (narrow ? ' is-narrow' : '')}>
      <BxHeader narrow={narrow} home />
      <div className="bx-hero">
        <span className="bx-pill">Security updates for Bootstrap 3 &amp; 4 →</span>
        <h1 className="bx-h">Bootstrap is the open source design system for everyone</h1>
        <p className="bx-lead">Bootstrap 6 has been rebuilt for today’s web as a framework-agnostic design toolkit that anyone—human or AI, novice or pro—can use to build anything.</p>
        <div className="bx-cta">
          <span className="bx-npm">npm i bootstrap@6.0.0-alpha.1 <CopyIcon /></span>
          <span className="bx-agents">🚀 For Agents</span>
          <button type="button" className={'bx-read' + (readHl ? ' is-hl' : '')} onClick={onRead} data-x="read">📖 Read the docs<Led on={!!readLed} /></button>
        </div>
        <p className="bx-cur">Currently v6.0.0-alpha.1 · <u>Bootstrap 5 docs</u> · <u>All releases</u></p>
      </div>
    </div>
  );
}
// Документация. page — открытая страница; open — раскрытый раздел меню; only — один раздел страницы (cdn | default |
// variants) без меню; hl — подсветка (menu, example, code, copy, cdn, variants); lit — пункт меню или кнопка копирования,
// которую просят нажать; menuView — на телефоне меню выехало; scrollTo — блок, к которому прокрутить страницу.
function BsDocs({ page, open, onOpen, onNav, onCopy, copied, hl: H, lit, only, menuView, onMenu, navOff, copyOff, mark, scrollTo, scrollKey, peek, lines, exHl, word }) {
  const L = (k) => (lines && lines[k]) || {};   // выделение строк в блоке кода k: { onLine, sel, word, lineLed, lineOff }
  const ref = useRef(null);
  const mainRef = useRef(null);
  const narrow = useNarrow(ref, 520);
  useEffect(() => {
    const m = mainRef.current;
    if (!m || !scrollTo) return undefined;
    const go = () => {
      // «sec:имя» — к началу раздела (заголовок и пример), иначе сначала блок кода (урок 2, 20.11.2026)
      const el = /^sec:/.test(scrollTo) ? m.querySelector('[data-sec="' + scrollTo.slice(4) + '"]') : (m.querySelector('[data-code="' + scrollTo + '"]') || m.querySelector('[data-sec="' + scrollTo + '"]'));
      if (el) m.scrollTop = Math.max(0, Math.round(el.getBoundingClientRect().top - m.getBoundingClientRect().top + m.scrollTop - (only ? 4 : 30)));
    };
    go();
    // 19.11.2026: превью примеров — iframe; сначала они 150 px, после загрузки сжимаются, и блок уезжал вверх за край
    // (в показе sc курсор «копировал» невидимую кнопку). Полторы секунды после прокрутки высота страницы под присмотром.
    if (typeof ResizeObserver !== 'function' || !m.firstElementChild) return undefined;
    const ro = new ResizeObserver(go);
    [...m.children].forEach((k) => ro.observe(k));
    const t = setTimeout(() => ro.disconnect(), 1500);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [scrollTo, page, narrow, scrollKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // Раскрытый раздел меню — в видимую часть списка (в выехавшем меню на телефоне пункты иначе ниже края).
  useEffect(() => {
    const r = ref.current; if (!r) return;
    r.querySelectorAll('.bd-side').forEach((sd) => { const g = (peek && sd.querySelector('.bd-grp-h[data-g="' + peek + '"]')) || sd.querySelector('.bd-grp.is-open'); if (g) sd.scrollTop = Math.max(0, g.offsetTop - sd.offsetTop - 4); });
  }, [open, menuView, narrow, peek]);   // peek — показать заголовок раздела, к которому сейчас поедет курсор
  const sec = (id, kids) => (!only || only === id ? <div className="bd-sec" data-sec={id}>{kids}</div> : null);
  const head = (title, lead, info) => (only ? null : (
    <>
      <h1 className="bd-h1">{title}</h1>
      <p className="bd-lead">{lead}</p>
      <div className="bd-meta">{info ? <><span><i className="bd-badge is-js">JS</i>{info === 'req' ? 'Requires JS' : 'JS Optional'}</span><span><i className="bd-badge is-css">CSS</i>Layer: <code>components</code></span></> : null}<span>⌥ View &amp; Edit</span></div>
    </>
  ));
  const content = () => {
    if (page === 'Install') return (
      <>
        {head('Install Bootstrap', 'Add Bootstrap to your project with CDN, package manager, or source files.')}
        {!only ? sec('install', <><h2 className="bd-h2">Install</h2><p className="bd-p">Pull in Bootstrap’s source files into nearly any project with a package manager.</p>
          <CodeBlock label="npm" code="npm install bootstrap" k="npm" copied={copied} disabled /></>) : null}
        {sec('cdn', <>
          <h2 className={'bd-h2' + (H === 'cdn' ? ' is-hl' : '')}>CDN</h2>
          <p className="bd-p">Include Bootstrap’s CSS and JavaScript files via CDN.</p>
          <p className="bd-p">Here are our primary CDN links for CSS and JavaScript:</p>
          <CodeBlock code={CDN_BLOCK} k="cdn" copied={copied} onCopy={onCopy} led={lit === 'cdn'} disabled={copyOff} hl={H === 'code'} copyHl={H === 'copy'} mark={mark && mark.cdn} />
        </>)}
      </>
    );
    if (page === 'Alert') return (
      <>
        {head('Alert', 'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.', true)}
        {sec('default', <>
          <h2 className="bd-h2">Default alert</h2>
          {!only ? <p className="bd-p">Alerts are available for any length of text, as well as an optional close button.</p> : null}
          <BdExample html={'<div class="alert" role="alert"><p>' + SAMPLE + '</p></div>'} hl={H === 'example'} />
          <CodeBlock attach code={ALERT_DEFAULT} k="alert" copied={copied} onCopy={onCopy} led={lit === 'alert'} disabled={copyOff} hl={H === 'code'} copyHl={H === 'copy'} />
        </>)}
        {sec('variants', <>
          <h2 className={'bd-h2' + (H === 'variants' ? ' is-hl' : '')}>Variants</h2>
          {!only ? <p className="bd-p">Use any of our variant theme classes for color mode adaptive, contextual styling.</p> : null}
          <BdExample zoom={0.5} html={'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' + ['primary', 'success', 'danger', 'warning'].map((t) => '<div class="alert theme-' + t + '" role="alert" style="margin:0"><p>A simple ' + t + ' alert—check it out!</p></div>').join('') + '</div>'} />
          <CodeBlock attach code={BS_THEMES.map(variantLine).join('\n')} k="variants" copied={copied} onCopy={onCopy} disabled={copyOff} mark={mark && mark.variants} />
        </>)}
      </>
    );
    return (
      <>
        {head(page, 'Documentation and examples for ' + page.toLowerCase() + ' in Bootstrap.')}
        <div className="bd-ph" aria-hidden="true"><i /><i /><i /></div>
      </>
    );
  };
  const block = (k, rows, exHtml, zoom) => (
    <>
      <BdExample zoom={zoom} html={exHtml} hl={exHl === k} />
      <CodeBlock attach code={rows.join('\n')} k={k} copied={copied} onCopy={onCopy} disabled={copyOff} mark={mark && mark[k]} onLine={L(k).onLine} sel={L(k).sel} word={L(k).word} lineLed={L(k).lineLed} lineOff={L(k).lineOff} />
    </>
  );
  // Урок 9 — Menu и Dialog.
  const content9 = () => {
    if (page === 'Menu') return (
      <>
        {head('Menu', 'Toggle contextual menus and custom overlays for lists of buttons, links, forms, and other custom content.', 'req')}
        {sec('mover', <>
          <h2 className={'bd-h2' + (H === 'mover' ? ' is-hl' : '')}>Overview</h2>
          {!only ? <p className="bd-p">Menus are toggleable, contextual overlays for displaying lists of links and more. They’re toggled by clicking, not by hovering.</p> : null}
          {block('mover', MENU_OVER, exOf(MENU_OVER).replace('class="menu"', 'class="menu show position-static" style="margin-top:4px"'), 0.62)}
        </>)}
        {sec('mhdr', <>
          <h3 className={'bd-h2' + (H === 'mhdr' ? ' is-hl' : '')}>Headers</h3>
          {block('mhdr', MENU_HDR, exOf(MENU_HDR), 0.62)}
        </>)}
        {sec('mdiv', <>
          <h3 className={'bd-h2' + (H === 'mdiv' ? ' is-hl' : '')}>Dividers</h3>
          {block('mdiv', MENU_DIV, exOf(MENU_DIV), 0.62)}
        </>)}
      </>
    );
    if (page === 'Dialog') return (
      <>
        {head('Dialog', 'A modern component built on the native <dialog> element with built-in accessibility and backdrop support that replaces the old Modal component.', 'req')}
        {sec('dex', <>
          <h2 className={'bd-h2' + (H === 'dex' ? ' is-hl' : '')}>Example</h2>
          {!only ? <p className="bd-p">Toggle a working dialog by clicking the button below. It will open with a backdrop and focus will be trapped inside.</p> : null}
          {block('dex', DLG_EX, exOf(DLG_EX).replace('<dialog class="dialog" id="exampleDialog">', '<dialog class="dialog" id="exampleDialog" open style="position:static;margin:8px 0 0">'), 0.6)}
        </>)}
        {sec('dsizes', <>
          <h2 className={'bd-h2' + (H === 'dsizes' ? ' is-hl' : '')}>Optional sizes</h2>
          {!only ? <p className="bd-p">Dialogs have three optional sizes: .dialog-sm (280px), .dialog-lg (800px) and .dialog-xl (1140px). The default is 500px.</p> : null}
          <CodeBlock attach code={DLG_SIZES.join('\n')} k="dsizes" copied={copied} onCopy={onCopy} disabled={copyOff} mark={mark && mark.dsizes} />
        </>)}
      </>
    );
    return content();
  };
  const side = (
    <nav className={'bd-side' + (H === 'menu' ? ' is-hl' : '')}>
      {BD_NAV.map((g) => {
        const isOpen = open === g.g || open === 'all';
        return (
          <div key={g.g} className={'bd-grp' + (isOpen ? ' is-open' : '')}>
            <button type="button" className="bd-grp-h" data-g={g.g} onClick={() => onOpen && onOpen(open === g.g ? null : g.g)} disabled={navOff}>
              <BxIcon n={g.ic} c={g.c} />{g.t}<Led on={lit === 'grp:' + g.g} />
            </button>
            {isOpen ? g.items.map((it) => (
              <button key={it} type="button" className={'bd-item' + (page === it ? ' is-cur' : '')} onClick={() => onNav && onNav(it)} disabled={navOff} data-item={it}>
                {it}<Led on={lit === 'item:' + it} />
              </button>
            )) : null}
          </div>
        );
      })}
    </nav>
  );
  return (
    <div ref={ref} className={'bx bd' + (narrow ? ' is-narrow' : '') + (only ? ' is-only' : '')}>
      {!(only && narrow) ? <BxHeader narrow={narrow} onBurger={onMenu} burgerHl={H === 'menu'} burgerLed={lit === 'burger' || (/^(grp|item):/.test(lit || '') && !menuView)} /> : null}
      <div className="bd-body">
        {!only && !narrow ? side : null}
        <div ref={mainRef} className="bd-main" key={page + (only || '')}>{content9()}</div>
        {!only && narrow && menuView ? <div className="bd-drawer"><div className="bd-drawer-h"><BsLogo h={18} /><b>Browse docs</b><button type="button" className="bd-x" onClick={onMenu} aria-label="Close">×</button></div>{side}</div> : null}
      </div>
    </div>
  );
}
// Поиск Google: стартовая страница (typed — набранное, caret — курсор в поле) и страница результатов (hl — первый результат).
function GoogleHome({ typed, caret }) {
  return (
    <div className="gg">
      <div className="gg-top"><span>Gmail</span><span>Images</span><i className="gg-ava" aria-hidden="true" /></div>
      <div className="gg-logo" aria-label="Google"><b style={{ color: '#4285F4' }}>G</b><b style={{ color: '#EA4335' }}>o</b><b style={{ color: '#FBBC05' }}>o</b><b style={{ color: '#4285F4' }}>g</b><b style={{ color: '#34A853' }}>l</b><b style={{ color: '#EA4335' }}>e</b></div>
      <div className={'gg-box' + (caret ? ' is-focus' : '')} data-x="gbox"><span className="gg-mag" aria-hidden="true">⌕</span><span className="gg-q">{typed}{caret ? <i className="gg-caret" /> : null}</span></div>
      <div className="gg-btns"><span>Google Search</span><span>I’m Feeling Lucky</span></div>
    </div>
  );
}
function GoogleResults({ q, hl: lit, onOpen, led }) {
  return (
    <div className="gg gg-res">
      <div className="gg-bar"><span className="gg-logo is-sm"><b style={{ color: '#4285F4' }}>G</b><b style={{ color: '#EA4335' }}>o</b><b style={{ color: '#FBBC05' }}>o</b><b style={{ color: '#4285F4' }}>g</b><b style={{ color: '#34A853' }}>l</b><b style={{ color: '#EA4335' }}>e</b></span><span className="gg-box is-sm"><span className="gg-q">{q}</span></span></div>
      <div className="gg-tabs"><b>All</b><span>Images</span><span>Videos</span><span>News</span></div>
      <button type="button" className={'gg-r' + (lit ? ' is-hl' : '')} onClick={onOpen} data-x="result">
        <span className="gg-site"><span className="gg-fav"><BsLogo h={12} /></span><span><b>Bootstrap</b><i>https://getbootstrap.com</i></span></span>
        <span className="gg-t">Bootstrap · The most popular HTML, CSS, and JS library in the world.</span>
        <span className="gg-s">Powerful, extensible, and feature-packed frontend toolkit. Build and customize with Sass, utilize prebuilt grid system and components…</span>
        <Led on={!!led} />
      </button>
      <div className="gg-r is-dim"><span className="gg-site"><span className="gg-fav is-w">W</span><span><b>Wikipedia</b><i>https://en.wikipedia.org › wiki › Bootstrap</i></span></span><span className="gg-t">Bootstrap (front-end framework) - Wikipedia</span></div>
    </div>
  );
}
const DocsBr = ({ page, children, cls }) => <PaperBrowser title={bdTitle(page)} url={bdPath(page)} short cls={'b1-br b1-docs' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
