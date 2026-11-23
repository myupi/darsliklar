// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 8 «Карусель» (20.11.2026). Набор — bs8-kit.jsx (копия урока 7 + карусель в окне страницы),
// сайт — bs8-site.jsx (+ Components → Carousel), общие куски экранов — bs8-common.jsx (из урока 3).
// =============================================================================
const PHONE = 360;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const PICS = ['slayd1.jpg', 'slayd2.jpg', 'slayd3.jpg'];   // широкие баннеры 480×200: фото и кнопки видны в окне целиком
const CAR_ID = 'galereya';
// Карусель кружка. o: { car — class карусели (null — без), id, auto — значение data-bs-autoplay (null — нет), inner — class
// обёртки слайдов, items — class каждого слайда, ints — data-bs-interval слайдов, btns — { prev, next, target } (null — без
// кнопок), dots — data-bs-target точек (null — без точек) }. Кнопки и точки — прямо в карусели, без обёрток.
const CAR_FULL = { car: 'carousel slide', id: CAR_ID, auto: null, inner: 'carousel-inner', items: ['carousel-item active', 'carousel-item', 'carousel-item'], ints: [null, null, null], btns: null, dots: null };
const BTNS = { prev: 'prev', next: 'next', target: '#' + CAR_ID };
const carO = (add) => Object.assign({}, CAR_FULL, add);
// Атрибуты вещи — по порядку: [имя, значение]; значение null — атрибута нет.
function carRows(o) {
  const items = o.items || [];
  const ex = o.extra ? /^([\w-]+)="([^"]*)"$/.exec(o.extra) : null;   // свой атрибут карусели (q1, t6: data-bs-ride="carousel")
  const rows = [{ key: 'car', d: 0, tag: 'div', attrs: [['id', o.id], ['class', o.car], ['data-bs-autoplay', o.auto]].concat(ex ? [[ex[1], ex[2]]] : []) },
    { key: 'inner', d: 1, tag: 'div', attrs: [['class', o.inner]] }];
  items.forEach((c, i) => rows.push({ key: 'i' + i, d: 2, tag: 'div', attrs: [['class', c], ['data-bs-interval', (o.ints || [])[i] || null]], img: (o.pics || PICS)[i % 3] }));
  rows.push({ key: 'innerc', d: 1, raw: '</div>' });
  // Кнопки и точки — в одном ряду: <div class="d-flex align-items-center gap-3"> (урок 4); без обёртки карусель растянула бы
  // кнопки на всю ширину. У примера с сайта (g1) обёртка — просто <div> (ctlCls: '').
  if (o.btns || o.dots != null) {
    const cc = o.ctlCls != null ? o.ctlCls : 'd-flex align-items-center gap-3';
    rows.push({ key: 'ctl', d: 1, tag: 'div', attrs: [['class', cc]] });
    if (o.btns) ['prev', 'next'].forEach((k) => rows.push({ key: k, d: 2, tag: 'button', attrs: [['class', 'btn-icon btn-sm'], ['data-bs-target', o.btns.targets ? o.btns.targets[k] : o.btns.target], ['data-bs-slide', o.btns[k]]], btn: k }));
    if (o.dots != null) rows.push({ key: 'dots', d: 2, tag: 'div', attrs: [['class', o.dotsCls || 'carousel-indicators']], dots: o.dots });
    rows.push({ key: 'ctlc', d: 1, raw: '</div>' });
  }
  rows.push({ key: 'carc', d: 0, raw: '</div>' });
  return rows;
}
const attrsS = (attrs, esc) => attrs.filter((a) => a[1] != null && a[1] !== '').map((a) => ' ' + a[0] + '="' + (esc ? escH(a[1]) : a[1]) + '"').join('');
const ICON = (k) => '<span class="carousel-icon-' + k + '" aria-hidden="true"></span><span class="visually-hidden">' + (k === 'prev' ? 'Previous' : 'Next') + '</span>';
const dotsHtml = (t) => [0, 1, 2].map((i) => '<button type="button" data-bs-target="' + escH(t) + '" data-bs-slide-to="' + i + '"' + (i ? '' : ' class="active" aria-current="true"') + ' aria-label="Slide ' + (i + 1) + '"></button>').join('');
function rowHtml8(r) {
  if (r.raw) return r.raw;
  const open = '<' + r.tag + attrsS(r.attrs, true) + '>';
  if (r.img) return open + '<img src="' + r.img + '" class="d-block w-100" alt="Robot"></div>';
  if (r.btn) return open + ICON(r.btn) + '</button>';
  if (r.dots != null) return open + dotsHtml(r.dots) + '</div>';
  return open;
}
const carH = (pick, o, top) => (top || '') + carRows(o).map(rowHtml8).join('');
// Строка кода: та же разметка; картинка слайда — «<img src="robot1.jpg" …>», значки кнопки — «…».
function rowSrc8(r, openDots) {
  if (r.raw) return r.raw;
  const open = '<' + r.tag + attrsS(r.attrs) + '>';
  if (r.img) return open + '<img src="' + r.img + '" …></div>';
  if (r.btn) return open + '…</button>';
  if (r.dots != null) return openDots ? open : open + '…</div>';
  return open;
}
// Строка с полем: в значении атрибута name (before — что стоит в значении перед полем: «carousel-item »).
function fieldParts(r, name, node, before, after) {
  const out = [pn('a', '<'), <span key="t" className="b1-tg">{r.tag}</span>];
  r.attrs.forEach((a, j) => {
    if (a[0] !== name && (a[1] == null || a[1] === '')) return;
    out.push(<React.Fragment key={'s' + j}>{sp()}</React.Fragment>, <span key={'n' + j} className="b1-at">{a[0]}</span>, pn('e' + j, '='));
    if (a[0] === name) out.push(<span key={'q' + j} className="b1-st">{'"' + (before || '')}</span>, node, <span key={'z' + j} className="b1-st">{(after || '') + '"'}</span>);
    else out.push(<span key={'v' + j} className="b1-st">{'"' + a[1] + '"'}</span>);
  });
  out.push(pn('g', '>'));
  if (r.img) out.push(<span key="im" className="b1-tx">{'<img src="' + r.img + '" …></div>'}</span>);
  if (r.btn) out.push(<span key="bt" className="b1-tx">{'…</button>'}</span>);
  return out;
}
// Код карусели: opt = { hl: { ключ строки: класс }, field: { key, attr, node, before, after }, openDots, foldCtl — кнопки и точки одной
// строкой, script: строка script в конце, src: { ключ строки: своя (свёрнутая) запись }, gapEnd — подсвеченное пустое место в конце }.
function carLines(pick, o, opt) {
  const O = opt || {};
  const H = O.hl || {};
  const out = [];
  let inCtl = false;
  carRows(o).forEach((r) => {
    const k = r.key + attrsS(r.attrs || []);
    if (O.foldCtl && r.key === 'ctl') { inCtl = true; out.push(hl(k + 'z', r.d, rowSrc8(r) + '…</div>', { cls: 'b2-cut' + (H.ctl ? ' ' + H.ctl : '') })); return; }
    if (inCtl) { if (r.key === 'ctlc') inCtl = false; return; }
    if (O.field && r.key === O.field.key) {
      out.push({ k: k + 'f', d: r.d, cls: 'b1-line is-hl', parts: fieldParts(r, O.field.attr, O.field.node, O.field.before, O.field.after) });
      return;
    }
    const cut = r.img || r.btn || r.dots != null ? 'b2-cut' : '';
    out.push(hl(k, r.d, (O.src && O.src[r.key]) || rowSrc8(r, O.openDots), { cls: [cut, H[r.key] || ''].filter(Boolean).join(' ') }));
    if (r.dots != null && O.openDots) {
      [0, 1, 2].forEach((i) => out.push(hl('dt' + i + r.dots, r.d + 1, '<button data-bs-target="' + r.dots + '" data-bs-slide-to="' + i + '"></button>', { cls: H['dot' + i] || '' })));
      out.push(hl('dtc', r.d, '</div>'));
    }
  });
  if (O.script) out.push(scriptL('sc', 0, { cls: H.script || '' }));
  if (O.gapEnd) out.push({ k: 'scgap', d: 0, cls: 'b1-line is-hl b8-gap', parts: [<span key="g" className="b1-tx">{'\u00a0'}</span>] });   // пустое место, где должна быть строка script
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
const CAR_RULES = {
  inner: ['.carousel-inner', 'display: flex; overflow-x: auto; scroll-snap-type: x mandatory'],
  item: ['.carousel-item', 'flex: 0 0 100%; scroll-snap-align: start'],
  fade: ['.carousel-fade .carousel-item', 'opacity: 0; transition: opacity'],
  fadeOn: ['.carousel-fade .active', 'opacity: 1'],
  dots: ['.carousel-indicators', 'display: flex; justify-content: center'],
  dotOn: ['.carousel-indicators .active', 'width: 2.5×']
};
const rulesOf = (keys) => keys.map((k) => CAR_RULES[k]).filter(Boolean);

// ── Проверка ответа (kind: cls | slide | target | auto | ms).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
const KNOWN8 = ['carousel', 'slide', 'carousel-inner', 'carousel-item', 'active', 'carousel-fade', 'carousel-indicators'];
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (wants.indexOf(v) >= 0) return null;
  if (kind === 'ms') {
    if (/^\d+(\.\d+)?\s*(s|sek|soniya|сек|с)$/.test(v)) return { k: 'msSec', w: String(Math.round(parseFloat(v) * 1000)) };
    if (/^\d+$/.test(v) && +v < 100) return { k: 'msSmall', w: String(+v * 1000) };
    if (/^\d+\s*ms$/.test(v)) return { k: 'msUnit', w: v.replace(/\D/g, '') };
    if (/^\d+$/.test(v)) return { k: 'msOther' };
    return { k: 'msNum' };
  }
  if (kind === 'target') {
    if (v === CAR_ID) return { k: 'noHash', w: '#' + CAR_ID };
    if (v[0] === '#') return { k: 'otherId', w: '#' + CAR_ID };
    if (v[0] === '.') return { k: 'dotTarget', w: '#' + CAR_ID };
    return { k: 'noHash', w: '#' + CAR_ID };
  }
  if (kind === 'slide') {
    if (v === 'next' || v === 'prev') return { k: 'dir' };
    if (/^(oldinga|keyingi|orqaga|oldingi|right|left|forward|back)$/.test(v)) return { k: 'dirWord', w: want0 };
    return { k: 'unknown', w: v };
  }
  if (kind === 'auto') {
    if (v === 'false') return { k: 'autoFalse' };
    if (/^(yes|ha|on|1|ok)$/.test(v)) return { k: 'autoYes', w: 'true' };
    return { k: 'unknown', w: v };
  }
  // kind === 'cls'
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (/^(rasm|slayd|galereya|karusel)/.test(v)) return { k: 'native' };
  if (/^carousel-?(items|slide|inners)$/.test(v) || v === 'carouselitem' || v === 'carouselinner') return { k: 'typo', w: want0 };
  if (/^(item|inner|fade)$/.test(v)) return { k: 'noPrefix', w: 'carousel-' + v };
  if (v === 'actived' || v === 'activ' || v === 'aktiv' || v === 'is-active') return { k: 'typo', w: 'active' };
  if (/^(carousel-control-(prev|next)|carousel-caption|data-bs-ride)$/.test(v)) return { k: 'old' };
  if (KNOWN8.indexOf(v) >= 0) return { k: 'fam', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);

// Телефон: код длиннее места — окно кода листается само к нужной строке (поле, подсветка, новая строка), как редактор.
function hlScroll() {
  document.querySelectorAll('.b8-pair .kz-code, .b8-end .kz-code').forEach((c) => {
    if (c.scrollHeight <= c.clientHeight + 2) return;
    const l = c.querySelector('.kz-line:has(.kz-gap)') || c.querySelector('.kz-line.is-hl, .kz-line.is-new');
    if (!l) return;
    const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect();
    c.scrollTop = Math.max(0, Math.round(lr.top - cr.top + c.scrollTop - c.clientHeight / 2 + lr.height / 2));
  });
}
const useHlScroll = (dep) => useEffect(() => { const t = setTimeout(hlScroll, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
