// =============================================================================
// НАБОР УРОКА 7 МОДУЛЯ BOOTSTRAP «Navbar и Pagination» (23.11.2026) — копия набора урока «Menu и Dialog» (tools/bs9).
// Новое: ящик Navbar (drawer) — кнопка data-bs-toggle="drawer" + data-bs-target="#id" открывает <dialog class="drawer">
// (showModal, как окно; страница не ниже 440 px, чтобы ящик был виден), data-bs-dismiss="drawer", фон и пункт меню — закрывают.
// На ширине от 768 px (md:navbar-expand) ящик стоит строкой сам — это делает CSS Bootstrap, без скрипта.
// Ниже — история набора урока «Menu и Dialog»: копия набора урока 8; вместо карусели — меню и окно
// (bsUi): со строкой script (js) — как скрипт Bootstrap: кнопка data-bs-toggle="menu" открывает соседний .menu (show, место
// под кнопкой, щелчок по пункту или мимо — закрывает), data-bs-toggle="dialog" + data-bs-target="#id" открывает родной
// <dialog class="dialog"> (showModal: фон и фокус — браузер), data-bs-dismiss="dialog", щелчок по фону и Esc — закрывают
// (data-bs-backdrop="static" — фон не закрывает). Без script, с чужим словом в toggle или без «#» — кнопка мёртвая (onDead).
// Урок 8 «Карусель» (20.11.2026) — копия набора урока 7. Новое: карусель в окне страницы
// (bsCarousel): листание — сама прокрутка браузера (scroll-snap Bootstrap 6), мышкой — перетаскиванием, как пальцем;
// со строкой script (js) — как скрипт Bootstrap: кнопки data-bs-slide и точки data-bs-slide-to по data-bs-target (без «#»
// или чужой id — не работают), active — начальный слайд, data-bs-autoplay="true" — сам листает (data-bs-interval у слайда,
// иначе 5000 мс), carousel-fade — смена прозрачностью. Без script кнопки мёртвые (onDead), листать пальцем можно.
// Урок 7 «Формы» (20.11.2026) — копия набора урока 6 (= урока 5). Новое: страница отдаёт себя —
// onPick(v, doc) и api ({ doc, fit }) — поля формы можно читать и заполнять (показ s11, своё x2); отправка формы в окне
// никуда не уходит (кнопка submit — preventDefault: окно без allow-forms, иначе браузер пишет ошибку в журнал).
// Урок 5 «Карточки» — копия набора урока 4; новое — фото robot1–3.jpg (320×180).
// Урок 4: копия набора урока 3 (tools/bs3/bs3-kit.jsx); новое — картинки
// logo.png и r1–r3.png (FILES). Урок 3 — копия набора урока 2 (tools/bs2/bs2-kit.jsx;
// основа — урок 1). Новое в уроке 3: экран заданной ширины (BsFrame vw — страница шириной vw px, как телефон 360 px,
// уменьшается целиком; onWide — содержимое шире экрана), картинки сайта FILES (рисунки SVG, имена как файлы).
// Из урока 2:
// Добавлено: выделенное слово в строке (hParts opt.word), нажатие вещи на странице (BsFrame onPick, data-v),
// страница сайта кружка урока 2 (siteHtml2: заголовок, абзац, объявление, кнопки), строки с полем в class (clsParts).
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const escH = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── CDN — та же строка, что на сайте (Install, CDN Quickstart). «//» записан кодом: адреса — текст урока, урок их не грузит.
const BS_H = 'https://';
const BS_CDN = BS_H + 'cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/';
const BS_CSS_URL = BS_CDN + 'css/bootstrap.min.css';
const BS_JS_URL = BS_CDN + 'js/bootstrap.bundle.min.js';
const BS_CSS_SRI = 'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe';
const BS_JS_SRI = 'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL';
const LINK_HTML = '<link href="' + BS_CSS_URL + '" rel="stylesheet" integrity="' + BS_CSS_SRI + '" crossorigin="anonymous">';
const SCRIPT_HTML = '<script type="module" src="' + BS_JS_URL + '" integrity="' + BS_JS_SRI + '" crossorigin="anonymous"></script>';
// Ссылка, «поправленная» Коди (s11): буквы в слове bootstrap поменялись местами — такого файла нет.
const LINK_BAD = LINK_HTML.replace('npm/bootstrap@', 'npm/bootsrtap@');
const BS_THEMES = ['primary', 'accent', 'success', 'danger', 'warning', 'info', 'inverse', 'secondary'];
const CLOSE_BTN = '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
const SAMPLE = 'A simple alert—check it out!';

// ── СТРОКИ КОДА: подсветка HTML как в VS Code; значение integrity свёрнуто, как в редакторе (sha384-B/GM…CrCe).
const sp = () => <span className="b1-sp">{' '}</span>;
function foldVal(v, mark, fold) {
  if (fold === 'pkg' && /cdn\.jsdelivr/.test(v)) { const m = /npm\/([^/]+)\//.exec(v); return <span title={v}>{'…/npm/'}<b className="b1-pkg">{m ? m[1] : ''}</b>{'/…/' + v.slice(v.lastIndexOf('/') + 1)}</span>; }   // видна буква в имени пакета (t4)
  if (fold && /cdn\.jsdelivr/.test(v)) return <span className="b1-fold" title={v}>{'…/' + v.slice(v.lastIndexOf('/') + 1)}</span>;
  if (/^sha384-/.test(v)) return <span className={'b1-fold' + (mark === 'sri' ? ' is-mk' : '')} title={v}>{v.slice(0, 11) + '…' + v.slice(-4)}</span>;
  if (mark && /cdn\.jsdelivr/.test(v)) {
    const at = v.indexOf('bootstrap@'), ver = 'bootstrap@6.0.0-alpha.1';
    const fi = v.lastIndexOf('/') + 1;
    if (at > 0) return <>{v.slice(0, at)}<span className={mark === 'ver' ? 'b1-mk' : ''}>{ver}</span>{v.slice(at + ver.length, fi)}<span className={mark === 'file' ? 'b1-mk' : ''}>{v.slice(fi)}</span></>;
  }
  return v;
}
function hParts(src, opt) {
  const o = opt || {};
  const out = [];
  let n = 0;
  const key = () => 'h' + (n++);
  const re = /<\/?[a-zA-Z!][\w-]*|\/?>/g;
  let m, i = 0, inTag = false;
  const text = (t) => {
    if (!t) return;
    if (!inTag) {
      if (o.word && t.indexOf(o.word) >= 0) {   // урок 7: выделенный текст подписи (между тегами), как мышкой
        const at = t.indexOf(o.word);
        out.push(<span key={key()} className="b1-tx">{t.slice(0, at)}<span className="b2-wsel">{o.word}</span>{t.slice(at + o.word.length)}</span>);
        return;
      }
      out.push(<span key={key()} className="b1-tx">{t}</span>); return;
    }
    t.split(/(\s+|=|"[^"]*")/).forEach((p) => {
      if (!p) return;
      if (p[0] === '"' && o.word && p.indexOf(o.word) > 0) {   // выделенное слово внутри значения (как двойной щелчок мышкой)
        const v = p.slice(1, -1), at = v.indexOf(o.word);
        out.push(<span key={key()} className="b1-st">{'"' + v.slice(0, at)}<span className="b2-wsel">{o.word}</span>{v.slice(at + o.word.length) + '"'}</span>);
      } else if (p[0] === '"') out.push(<span key={key()} className="b1-st">{'"'}{foldVal(p.slice(1, -1), o.mark, o.fold)}{'"'}</span>);
      else if (p === '=') out.push(<span key={key()} className="b1-pn">=</span>);
      else if (/^\s+$/.test(p)) out.push(<React.Fragment key={key()}>{sp()}</React.Fragment>);
      else out.push(<span key={key()} className="b1-at">{p}</span>);
    });
  };
  while ((m = re.exec(src))) {
    text(src.slice(i, m.index));
    const t = m[0];
    if (t === '>' || t === '/>') { out.push(<span key={key()} className="b1-pn">{t}</span>); inTag = false; }
    else { const sl = t[1] === '/' ? 2 : 1; out.push(<span key={key()} className="b1-pn">{t.slice(0, sl)}</span>, <span key={key()} className="b1-tg">{t.slice(sl)}</span>); inTag = true; }
    i = m.index + t.length;
  }
  text(src.slice(i));
  return out;
}
const hl = (k, d, src, extra, opt) => Object.assign({ k, d, parts: hParts(src, opt), cls: 'b1-line' }, extra || {}, { cls: 'b1-line' + (extra && extra.cls ? ' ' + extra.cls : '') + (src.length > 60 ? ' b1-long' : '') });
// Пустое место для вставки: «✎ Shu yerga qo'ying».
function slotLine(k, d, pick, onTap, led, disabled) {
  return { k, d, cls: 'b1-line b1-slot', onTap, led, disabled, parts: [<span key="p" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>] };
}
// Документ в редакторе: head (title + свои строки) и body (свои строки).
function docLines(pick, head, body) {
  return [hl('ho', 0, '<head>', { cls: 'b1-edge' })]
    .concat(head || [], [hl('hc', 0, '</head>', { cls: 'b1-edge' }), hl('bo', 0, '<body>', { cls: 'b1-edge' })], body || [], [hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
}
const linkL = (k, d, extra, full) => hl(k, d, LINK_HTML, extra, { fold: !full });
const scriptL = (k, d, extra, full) => hl(k, d, SCRIPT_HTML, extra, { fold: !full });
const alertSrc = (cls, close) => ['<div class="' + cls + '" role="alert">', '  <p>{T}</p>'].concat(close ? ['  ' + CLOSE_BTN] : [], ['</div>']);
const alertCode = (k, d, cls, text, close, extra) => alertSrc(cls, close).map((s, j) => hl(k + j, d + (s.startsWith('  ') ? 1 : 0), s.replace(/^ {2}/, '').replace('{T}', text), extra));

// ── СТРАНИЦА: iframe без скриптов. bs — подключён ли CSS Bootstrap (строка link в коде); js — строка script:
// без неё кнопка закрытия e'lon не работает (имитация скрипта Bootstrap). Страница ужимается целиком (scale), если не
// влезает в окно.
function BsFrame({ body, bs, js, onDismiss, onDead, dep, zoom, onPick, vw, onWide, api, onSlide, onUi }) {
  const ref = useRef(null);
  const wrap = useRef(null);
  const live = useRef({});
  const stop = useRef(null);
  live.current = { js, onDismiss, onDead, onPick, onWide, onSlide, onUi };
  useEffect(() => () => { if (stop.current) stop.current(); }, []);
  // Урок 7: Navbar первым на странице — во всю ширину (без полей окна), как на сайтах: в Bootstrap 6 md:navbar-expand — container
  // query по ширине самого Navbar, с полями на «планшете 768» он был бы 740 px и не раскрывался.
  // Светлая тема всегда (data-bs-theme="light"): Bootstrap 6 сам включает тёмную, если она в системе, а облик уроков — светлый.
  // Картинки — по именам файлов (src="robot.jpg"): в окне вместо файла рисунок из FILES; в коде — имя файла (урок 3).
  const doc = useMemo(() => '<!doctype html><html data-bs-theme="light" style="color-scheme:light"><head><meta charset="utf-8">' + (bs ? '<style>' + BS_CSS + '</style>' : '') +
    '<style>html,body{margin:0}body{padding:12px 14px}body>nav.navbar:first-child{margin:-12px -14px 10px}</style></head><body>' + withFiles(body) + '</body>' + (js ? '<!--js-->' : '') + '</html>', [body, bs, js]);
  const fit = () => {
    const f = ref.current, w = wrap.current;
    const d = f && f.contentDocument;
    if (!d || !d.documentElement || !w) return;
    const page = w.closest('.kz-br-page');
    const W = w.clientWidth || 300;
    let z = 1;
    const at = (k) => {
      f.style.width = Math.round(W / k) + 'px'; f.style.height = '10px';
      const h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
      f.style.height = h + 'px'; f.style.transform = 'scale(' + k + ')'; w.style.height = Math.ceil(h * k) + 'px';
    };
    if (zoom) { at(zoom); return; }   // примеры на сайте Bootstrap — свой масштаб, без подгонки под окно
    if (vw) {   // экран заданной ширины: страница vw px, уменьшается целиком, по центру окна; что шире — обрезано краем
      const atV = (k) => {
        f.style.width = vw + 'px'; f.style.height = '10px';
        const h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
        f.style.height = h + 'px'; f.style.transform = 'scale(' + k + ')'; f.style.marginLeft = Math.max(0, Math.round((W - vw * k) / 2)) + 'px';
        w.style.height = Math.ceil(h * k) + 'px';
      };
      let k = Math.min(1, W / vw);
      atV(k);
      while (page && page.scrollHeight > page.clientHeight + 1 && k > 0.3) { k -= 0.05; atV(k); }
      w.style.setProperty('--vwk', String(k)); w.style.setProperty('--vwx', Math.round((W - vw * k) / 2) + 'px'); w.style.setProperty('--vww', Math.round(vw * k) + 'px');
      const wide = d.documentElement.scrollWidth > vw + 1;
      w.classList.toggle('is-wide', wide);
      if (live.current.onWide) live.current.onWide(wide);
      return;
    }
    at(z);
    // урок 7: форма не мельче 0.55 — поля должны читаться и нажиматься; что не влезло — окно листается (.b7-pair)
    const zMin = w.closest('.bn-pair, .bn-q1') ? 0.55 : 0.32;
    while (page && page.scrollHeight > page.clientHeight + 1 && z > zMin) { z -= 0.06; at(z); }   // урок 5: карточка целиком, даже мельче
  };
  const onLoad = () => {
    const d = ref.current && ref.current.contentDocument;
    if (d) d.addEventListener('click', (e) => {
      const lnk = e.target && e.target.closest && e.target.closest('a[href]');
      if (lnk) e.preventDefault();   // ссылки в окне страницы никуда не уходят (href="#" увёл бы окно на адрес урока)
      if (uiClick(d, e, live.current, fit)) return;   // меню и окно (урок 9)
      const sub = e.target && e.target.closest && e.target.closest('button[type="submit"], input[type="submit"]');
      if (sub) e.preventDefault();   // форма никуда не уходит (урок 7)
      const pk = e.target && e.target.closest && e.target.closest('[data-v]');
      if (pk && live.current.onPick) { live.current.onPick(pk.getAttribute('data-v'), d); return; }
      const b = e.target && e.target.closest && e.target.closest('[data-bs-dismiss="alert"]');
      if (!b) return;
      if (live.current.js) { const a = b.closest('.alert'); if (a) a.remove(); fit(); if (live.current.onDismiss) live.current.onDismiss(); }
      else if (live.current.onDead) live.current.onDead();
    });
    if (api) api.current = { doc: () => ref.current && ref.current.contentDocument, fit };
    if (stop.current) stop.current();
    stop.current = d ? bsUi(d, live, fit) : null;
    fit();
  };
  useLayoutEffect(() => {
    const page = wrap.current && wrap.current.closest('.kz-br-page');
    if (!page || typeof ResizeObserver === 'undefined') return undefined;
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    ro.observe(page);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(fit, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(fit, 80); return () => clearTimeout(t); }, [vw]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={wrap} className={'b1-frame' + (vw ? ' b3-vw' : '')}><iframe ref={ref} title="page" srcDoc={doc} sandbox="allow-same-origin" scrolling="no" tabIndex={-1} onLoad={onLoad} />{vw ? <i className="b3-edge" aria-hidden="true" /> : null}</div>;
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'b1-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
// ── КАРТИНКИ САЙТА (урок 3): рисунки SVG вместо файлов; размеры — как у фото (robot.jpg 800×500 — шире телефона).
const SVG_NS = 'http:' + '\u002F\u002F' + 'www.w3.org/2000/svg';
const svgUri = (w, h, inner) => 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='" + SVG_NS + "' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + ' ' + h + "'>" + inner + '</svg>');
const ROBOT = (x, y, k, c) => "<g transform='translate(" + x + ' ' + y + ') scale(' + k + ")'><line x1='60' y1='-6' x2='60' y2='-30' stroke='#475569' stroke-width='6'/><circle cx='60' cy='-34' r='9' fill='" + c + "'/>"
  + "<rect x='0' y='0' width='120' height='92' rx='22' fill='#E2E8F0' stroke='#475569' stroke-width='6'/><rect x='18' y='20' width='84' height='44' rx='14' fill='#1E293B'/><circle cx='42' cy='42' r='9' fill='#38BDF8'/><circle cx='78' cy='42' r='9' fill='#38BDF8'/>"
  + "<rect x='10' y='102' width='100' height='86' rx='18' fill='" + c + "' stroke='#475569' stroke-width='6'/><rect x='38' y='124' width='44' height='26' rx='6' fill='#FDE68A'/><circle cx='30' cy='202' r='16' fill='#334155'/><circle cx='90' cy='202' r='16' fill='#334155'/></g>";
const FILES = {
  'robot.jpg': svgUri(800, 500, "<rect width='800' height='500' fill='#BFE3FF'/><rect y='380' width='800' height='120' fill='#C08A5B'/><rect y='372' width='800' height='14' fill='#9A6A42'/>"
    + "<circle cx='690' cy='90' r='46' fill='#FDE68A'/>" + ROBOT(300, 120, 1.15, '#FA4F28') + "<rect x='560' y='300' width='120' height='76' rx='10' fill='#64748B'/><rect x='572' y='312' width='96' height='52' rx='6' fill='#22C55E'/>"),
  'murabbiy.jpg': svgUri(400, 400, "<rect width='400' height='400' fill='#FDE7DC'/><circle cx='200' cy='420' r='170' fill='#FA4F28'/><rect x='170' y='230' width='60' height='50' fill='#E8B48A'/>"
    + "<circle cx='200' cy='170' r='88' fill='#F1C49B'/><path d='M112 160 Q120 70 200 72 Q285 70 290 165 Q262 112 200 112 Q140 112 112 160Z' fill='#3F2A1D'/><circle cx='168' cy='178' r='9' fill='#1F2937'/><circle cx='232' cy='178' r='9' fill='#1F2937'/><path d='M170 216 Q200 238 230 216' fill='none' stroke='#9A3412' stroke-width='7' stroke-linecap='round'/>"),
  'robot1.jpg': svgUri(320, 180, "<rect width='320' height='180' fill='#CFFAFE'/><rect y='150' width='320' height='30' fill='#86EFAC'/><circle cx='270' cy='40' r='20' fill='#FDE68A'/>" + ROBOT(125, 22, 0.55, '#0FA38E')),
  'robot2.jpg': svgUri(320, 180, "<rect width='320' height='180' fill='#EDE9FE'/><rect y='150' width='320' height='30' fill='#C4B5FD'/><circle cx='50' cy='40' r='16' fill='#fff'/>" + ROBOT(125, 22, 0.55, '#7c3aed')),
  'robot3.jpg': svgUri(320, 180, "<rect width='320' height='180' fill='#FFEDD5'/><rect y='150' width='320' height='30' fill='#FDBA74'/><circle cx='270' cy='36' r='18' fill='#fff7ed'/>" + ROBOT(125, 22, 0.55, '#FA4F28')),
  'logo.png': svgUri(56, 56, "<rect width='56' height='56' rx='14' fill='#FA4F28'/>" + ROBOT(16, 10, 0.2, '#FDE68A')),
  'r1.png': svgUri(150, 150, "<rect width='150' height='150' fill='#E0F2FE'/>" + ROBOT(42, 22, 0.55, '#0FA38E')),
  'r2.png': svgUri(150, 150, "<rect width='150' height='150' fill='#F3E8FF'/>" + ROBOT(42, 22, 0.55, '#7c3aed')),
  'r3.png': svgUri(150, 150, "<rect width='150' height='150' fill='#FFEDD5'/>" + ROBOT(42, 22, 0.55, '#FA4F28')),
  // Урок 8 — слайды карусели: широкие баннеры 480×200 (у каруселей фото обычно шире, чем 16:9).
  'slayd1.jpg': svgUri(480, 200, "<rect width='480' height='200' fill='#CFFAFE'/><rect y='168' width='480' height='32' fill='#86EFAC'/><circle cx='410' cy='48' r='26' fill='#FDE68A'/>" + ROBOT(205, 34, 0.6, '#0FA38E')),
  'slayd2.jpg': svgUri(480, 200, "<rect width='480' height='200' fill='#EDE9FE'/><rect y='168' width='480' height='32' fill='#C4B5FD'/><rect x='40' y='60' width='90' height='70' rx='8' fill='#fff' stroke='#7c3aed' stroke-width='4'/><path d='M58 110l18-22 14 16 10-10 18 16' fill='none' stroke='#7c3aed' stroke-width='4'/>" + ROBOT(250, 34, 0.6, '#7c3aed')),
  'slayd3.jpg': svgUri(480, 200, "<rect width='480' height='200' fill='#FFEDD5'/><rect y='168' width='480' height='32' fill='#FDBA74'/><path d='M370 40l10 20 22 3-16 15 4 22-20-11-20 11 4-22-16-15 22-3z' fill='#FACC15'/>" + ROBOT(160, 34, 0.6, '#FA4F28') + ROBOT(260, 34, 0.6, '#0FA38E')),
  'jamoa.jpg': svgUri(900, 400, "<rect width='900' height='400' fill='#DCFCE7'/><rect y='300' width='900' height='100' fill='#86EFAC'/>" + ROBOT(90, 70, 0.95, '#0FA38E') + ROBOT(390, 60, 1, '#7c3aed') + ROBOT(690, 70, 0.95, '#FA4F28'))
};
const withFiles = (html) => String(html).replace(/src="([^"]+)"/g, (m, f) => (FILES[f] ? 'src="' + FILES[f] + '"' : m));
// Серая картинка-образец, как на сайте документации («Placeholder 200x200»).
const docPh = (w, h, label) => svgUri(w, h, "<rect width='" + w + "' height='" + h + "' fill='#868e96'/><text x='50%' y='50%' fill='#dee2e6' font-family='sans-serif' font-size='" + Math.max(10, Math.round(Math.min(w, h) / 9)) + "' text-anchor='middle' dominant-baseline='middle'>" + label + '</text>');
// Сайт кружка (урок 2). o: { h1: class заголовка (false — без заголовка), p: class абзаца (false — без), alert: class
// объявления (нет — без), btns: [{ cls, text, v }] — кнопки (cls null — без class; v — метка для нажатия). Class пишется
// как набран (честно: незнакомое слово Bootstrap просто не красит).
const clsA = (c) => (c == null || c === '' ? '' : ' class="' + escH(c) + '"');
const siteHtml2 = (pick, o) => (o.h1 === false ? '' : '<h1' + clsA(o.h1) + '>' + escH(pick(C.site.h1)) + '</h1>')
  + (o.p === false || o.p === undefined ? '' : '<p' + clsA(o.p) + '>' + escH(pick(C.site.when)) + '</p>')
  + (o.alert ? '<div class="' + escH(o.alert) + '" role="alert"><p>' + escH(pick(C.site.notice)) + '</p></div>' : '')
  + (o.btns || []).map((b) => '<button type="button"' + clsA(b.cls) + (b.v ? ' data-v="' + escH(b.v) + '"' : '') + '>' + escH(b.text != null ? b.text : pick(C.site.btn)) + '</button>').join(' ');
function SitePage({ pick, o, body: raw, bs = true, title, onPick, cls, children, vw, onWide, api, js, onUi, onDead }) {
  const body = raw != null ? raw : siteHtml2(pick, o);
  return <Br title={title || pick(C.site.title)} short cls={cls}><BsFrame body={body} bs={bs} js={js} dep={body + bs + (vw || '') + (js ? 'j' : '')} onPick={onPick} vw={vw} onWide={onWide} api={api} onUi={onUi} onDead={onDead} />{children}</Br>;
}
// Части страницы урока 3: картинка, спиннер (как на сайте: role="status" и скрытый текст «Loading…»), заглушка.
const imgH = (file, cls, alt) => '<img src="' + file + '"' + clsA(cls) + ' alt="' + escH(alt || '') + '">';
const spinH = (cls) => '<div' + clsA(cls) + ' role="status"><span class="visually-hidden">Loading…</span></div>';
const quietSlot = (k, d, pick, on) => ({ k, d, cls: 'b1-line b1-slot' + (on ? ' is-on' : ''), parts: [<span key="p" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>] });
// Образец «Kerak» — маленькая честная страница рядом с кодом (что должно получиться).
function Goal({ pick, html, label, zoom, js }) {
  return (
    <div className="b2-goal">
      <span className="b2-goal-h">{pick(label || UI.need)}</span>
      <div className="b2-goal-in"><BsFrame body={html} bs js={js} dep={html} zoom={zoom || 0.8} /></div>
    </div>
  );
}
// Строка кода с полем ввода в class: <tag attrs class="before [поле] after">text</tag>.
const pn = (k, t) => <span key={k} className="b1-pn">{t}</span>;
function clsParts({ tag, attrs, before, field, after, text, close }) {
  const out = [pn('a', '<'), <span key="b" className="b1-tg">{tag}</span>];
  (attrs || []).forEach((a, j) => out.push(<React.Fragment key={'s' + j}>{sp()}</React.Fragment>, <span key={'at' + j} className="b1-at">{a[0]}</span>, pn('eq' + j, '='), <span key={'v' + j} className="b1-st">{'"' + a[1] + '"'}</span>));
  out.push(<React.Fragment key="sc">{sp()}</React.Fragment>, <span key="c" className="b1-at">class</span>, pn('e', '='), <span key="q1" className="b1-st">{'"' + (before ? before + ' ' : '')}</span>, field,
    <span key="q2" className="b1-st">{(after ? ' ' + after : '') + '"'}</span>, pn('g', '>'));
  if (text != null) out.push(<span key="t" className="b1-tx">{text}</span>);
  if (close) out.push(pn('h', '</'), <span key="i" className="b1-tg">{tag}</span>, pn('j', '>'));
  return out;
}

// ── САЙТ BOOTSTRAP И ПОИСК GOOGLE — в bs1-site.jsx (подключается после этого файла).

// Помощь на экране-объяснении (как в уроках CSS): ступени 1-2-3 по лампочке.
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
// Ход «скопируй на сайте → вставь в код» (s9, s10, s13): want — какую копию ждём; промахи — своя причина.
function useCopyPaste({ want, c, canTap, onDone }) {
  const [clip, setClip] = useState(null);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(true);
  const st = useRef({ tries: 0, misses: 0 });
  const copy = (k) => { if (!canTap) return; sfx('pop', true); setClip(k); setMsg(null); return k; };
  const paste = (sayNow) => {
    if (!canTap) return false;
    st.current.tries += 1;
    const issue = !clip ? c.msgs.noClip : clip !== want ? c.msgs.wrongClip : null;
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return false; }
    setMsg(null); onDone(st.current, lad); return true;
  };
  return { clip, copy, paste, msg, lad, st, setMsg };
}

// ── МЕНЮ И ОКНО В ОКНЕ СТРАНИЦЫ (урок 9) — то, что делает скрипт Bootstrap, если в коде есть строка script (L.js).
// onUi(событие, подробность): 'menu' (открыто / закрыто), 'open' (окно открыто), 'close' (как закрыли: btn, backdrop, esc).
const uiEvt = (L, a, b) => { if (L.onUi) L.onUi(a, b); };
function menuOf(btn) { let m = btn.nextElementSibling; while (m && !(m.classList && m.classList.contains('menu'))) m = m.nextElementSibling; return m; }
function closeMenus(d, L, keep) {
  d.querySelectorAll('.menu.show').forEach((m) => { if (m === keep || m.classList.contains('position-static')) return; m.classList.remove('show'); const b = m.__btn; if (b) b.setAttribute('aria-expanded', 'false'); uiEvt(L, 'menu', false); });
}
function openDialog(d, dlg, L, fit) {
  if (!dlg || dlg.open || typeof dlg.showModal !== 'function') return;
  d.body.style.minHeight = '';
  dlg.showModal();
  dlg.style.maxHeight = 'none';   // настоящая высота окна (в низкой странице его сжимает max-height: 100% − поля)
  const need = dlg.classList.contains('drawer') ? 440 : Math.ceil(dlg.getBoundingClientRect().height + 64);   // окно страницы не ниже открытого окна (ящик — во всю высоту)
  dlg.style.maxHeight = '';
  if (d.documentElement.clientHeight < need) d.body.style.minHeight = need + 'px';
  if (d.documentElement.classList) d.documentElement.classList.add('dialog-open');
  fit(); uiEvt(L, 'open', dlg.id);
}
function uiClick(d, e, L, fit) {
  const t = e.target;
  if (!t || !t.closest) return false;
  // окно: щелчок по самому <dialog> (мимо его коробки) — по фону
  if (t.tagName === 'DIALOG' && t.open && L.js) {
    const r = t.getBoundingClientRect();
    const out = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (out && t.__static !== true) { t.__how = 'backdrop'; t.close(); }
    return true;
  }
  const dis = t.closest('[data-bs-dismiss]');
  if (dis && dis.closest('dialog')) {
    const dlg = dis.closest('dialog');
    const wantD = dlg.classList.contains('drawer') ? 'drawer' : 'dialog';   // урок 7: ящик Navbar закрывает data-bs-dismiss="drawer"
    if (!L.js || dis.getAttribute('data-bs-dismiss') !== wantD) { if (L.onDead) L.onDead(L.js ? 'dismiss' : 'nojs'); return true; }
    dlg.__how = dis.classList.contains('btn-close') ? 'x' : 'btn'; dlg.close(); return true;
  }
  // урок 7: пункт меню в открытом ящике — ящик закрывается (переход на раздел)
  const inDrawer = t.closest('dialog.drawer[open] .nav-link');
  if (inDrawer && L.js) { const dlg = inDrawer.closest('dialog'); dlg.__how = 'link'; dlg.close(); return false; }
  const tg = t.closest('[data-bs-toggle]');
  if (tg) {
    const kind = tg.getAttribute('data-bs-toggle');
    if (!L.js) { if (L.onDead) L.onDead('nojs'); return true; }
    if (kind === 'menu') {
      const m = menuOf(tg);
      if (!m) { if (L.onDead) L.onDead('nomenu'); return true; }
      const on = !m.classList.contains('show');
      closeMenus(d, L, m);
      m.__btn = tg;
      if (on) {
        const br = tg.getBoundingClientRect(), dr = d.body.getBoundingClientRect();
        Object.assign(m.style, { top: Math.round(br.bottom - dr.top + 2) + 'px', left: Math.round(br.left - dr.left) + 'px' });
        m.classList.add('show'); tg.setAttribute('aria-expanded', 'true');
      } else { m.classList.remove('show'); tg.setAttribute('aria-expanded', 'false'); }
      fit(); uiEvt(L, 'menu', on);
      return true;
    }
    if (kind === 'dialog' || kind === 'drawer') {
      let dlg = null;
      try { const sel = tg.getAttribute('data-bs-target'); dlg = sel ? d.querySelector(sel) : null; } catch (er) { dlg = null; }
      if (!dlg || dlg.tagName !== 'DIALOG') { if (L.onDead) L.onDead('target'); return true; }
      dlg.__static = tg.getAttribute('data-bs-backdrop') === 'static';
      openDialog(d, dlg, L, fit);
      return true;
    }
    if (L.onDead) L.onDead('toggle');
    return true;
  }
  // пункт меню или щелчок мимо — меню закрывается (autoClose: true)
  if (L.js) {
    const inMenu = t.closest('.menu');
    if (!inMenu || t.closest('.menu-item')) closeMenus(d, L, null);
  }
  return false;
}
function bsUi(d, R, fit) {
  const offs = [];
  d.body.style.position = 'relative';   // меню встаёт под кнопкой: координаты от body
  d.querySelectorAll('dialog').forEach((dlg) => {
    const onClose = () => { d.body.style.minHeight = ''; if (d.documentElement.classList) d.documentElement.classList.remove('dialog-open'); fit(); uiEvt(R.current, 'close', dlg.__how || 'esc'); dlg.__how = null; };
    const onCancel = (e) => { if (dlg.__static) { e.preventDefault(); } };
    dlg.addEventListener('close', onClose);
    dlg.addEventListener('cancel', onCancel);
    offs.push(() => { dlg.removeEventListener('close', onClose); dlg.removeEventListener('cancel', onCancel); });
  });
  return () => offs.forEach((f) => f());
}
// Снаружи (показы с курсором): открыть окно или меню по селектору кнопки, как щелчком.
function uiPress(d, sel) { const el = d && d.querySelector(sel); if (el) el.click(); return el; }
