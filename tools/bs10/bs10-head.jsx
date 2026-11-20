// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 10 «Финальный проект» (20.11.2026). Набор — bs10-kit.jsx (урок 9 + карусель урока 8), сайт —
// bs10-site.jsx (Install, Alert, Menu), общие куски экранов — bs10-common.jsx (FillRounds и др.).
// Сайт кружка целиком (siteH) и по частям — для станций 1–9 (по одной на урок модуля).
// =============================================================================
const PHONE = 360, TABLET = 768;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw === TABLET ? pick(UI.tablet) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const TX = (pick, k) => escH(pick(C.site[k]));
const ca = (plain, c) => (plain || !c ? '' : ' class="' + c + '"');
// Части сайта. plain — без Bootstrap (без class и data-bs-*); th — цвет theme-*.
const P_HDR = (pick, plain, th, btnCls, jc) => '<div' + ca(plain, 'd-flex ' + (jc || 'justify-content-between') + ' align-items-center') + '><img src="logo.png" alt="Logo"><h4>' + TX(pick, 'title') + '</h4>'
  + '<div' + ca(plain, 'd-flex gap-3') + '>' + P_MENU(pick, plain, th) + '<button' + ca(plain, btnCls || 'btn-solid theme-' + th) + '>' + TX(pick, 'join') + '</button></div></div>';
const P_MENU = (pick, plain, th, tg) => '<button' + ca(plain, 'btn-outline theme-' + th) + (plain || tg === null ? '' : ' data-bs-toggle="' + escH(tg || 'menu') + '"') + '>' + TX(pick, 'sections') + '</button><div' + ca(plain, 'menu') + '>'
  + ['g1', 'g2', 'g3'].map((k) => '<a' + ca(plain, 'menu-item') + ' href="#">' + TX(pick, k) + '</a>').join('') + '</div>';
const P_ALERT = (pick, plain, th) => '<div' + ca(plain, 'alert theme-' + th) + ' role="alert"><p>' + TX(pick, 'news') + '</p></div>';
const P_CAR = (pick, plain, items, btns) => '<div id="galereya"' + ca(plain, 'carousel slide') + '><div' + ca(plain, 'carousel-inner') + '>'
  + (items || ['carousel-item active', 'carousel-item', 'carousel-item']).map((c, i) => '<div' + ca(plain, c) + '><img src="slayd' + (i + 1) + '.jpg"' + ca(plain, 'd-block w-100') + ' alt="Robot"></div>').join('') + '</div>'
  + (btns === false || plain ? '' : '<div class="d-flex align-items-center gap-3">' + ['prev', 'next'].map((k) => '<button class="btn-icon btn-sm" data-bs-target="#galereya" data-bs-slide="' + k + '"><span class="carousel-icon-' + k + '" aria-hidden="true"></span><span class="visually-hidden">' + k + '</span></button>').join('') + '</div>') + '</div>';
const P_CARD = (pick, plain, i, cls) => '<section' + ca(plain, cls == null ? 'card' : cls) + ' style="max-width: 240px"><img src="robot' + i + '.jpg"' + ca(plain, 'card-img-top') + ' alt="Robot"><div' + ca(plain, 'card-body') + '><h4>' + TX(pick, 'r' + i) + '</h4></div></section>';
const P_ROW = (pick, plain, cols) => '<div' + ca(plain, 'row') + '>' + (cols || ['md:col-4', 'md:col-4', 'md:col-4']).map((c, i) => '<div' + ca(plain, c) + '>' + P_CARD(pick, plain, i + 1).replace(' style="max-width: 240px"', '') + '</div>').join('') + '</div>';
const P_FORM = (pick, plain, th, inp) => '<form><label for="ism"' + ca(plain, 'form-label') + '>' + TX(pick, 'name') + '</label><input type="text" id="ism"' + ca(plain, inp == null ? 'form-control' : inp) + '>'
  + '<button type="submit"' + ca(plain, 'btn-solid theme-' + th) + '>' + TX(pick, 'send') + '</button></form>';
const siteH = (pick, o) => {
  const O = o || {};
  const th = O.th || 'success', pl = !!O.plain;
  return '<div' + ca(pl, 'container') + '>' + P_HDR(pick, pl, th, O.btnCls) + P_ALERT(pick, pl, th) + P_CAR(pick, pl) + P_ROW(pick, pl) + P_FORM(pick, pl, th) + '</div>';
};
// Код сайта целиком — по строке на часть (как свёрнутые блоки в редакторе).
function siteLines(pick, o, hlk) {
  const O = o || {};
  const H = hlk || {};
  const th = O.th || 'success', pl = !!O.plain;
  const x = (k) => ({ cls: 'b2-cut' + (H[k] ? ' ' + H[k] : '') });
  const L = [];
  if (!pl && !O.noLink) L.push(linkL('ln', 0, x('link')));
  L.push(hl('co', 0, '<div' + ca(pl, 'container') + '>', x('cont')),
    hl('hd', 1, '<div' + ca(pl, 'd-flex justify-content-between align-items-center') + '>…' + (O.btnCls ? '<button class="' + O.btnCls + '">' : '') + '…</div>', x('hdr')),
    hl('al', 1, '<div' + ca(pl, 'alert theme-' + th) + ' role="alert">…</div>', x('alert')),
    hl('cr', 1, '<div id="galereya"' + ca(pl, 'carousel slide') + '>…</div>', x('car')),
    hl('rw', 1, '<div' + ca(pl, 'row') + '>…' + (pl ? '' : 'md:col-4 · card') + '…</div>', x('row')),
    hl('fm', 1, '<form>…' + (pl ? '' : 'form-control') + '…</form>', x('form')),
    hl('cc', 0, '</div>', x('cont')));
  if (!pl && !O.noScript) L.push(scriptL('sc', 0, x('script')));
  return L;
}
// Строка с полем в значении атрибута: tag, attrs [[имя, значение | FIELD]], before — что в значении перед полем, tail — что
// после «>» (текст и теги строкой).
const FIELD = {};
function fLine(k, d, tag, attrs, node, before, tail) {
  const out = [pn('a', '<'), <span key="t" className="b1-tg">{tag}</span>];
  attrs.forEach((a, j) => {
    out.push(<React.Fragment key={'s' + j}>{sp()}</React.Fragment>, <span key={'n' + j} className="b1-at">{a[0]}</span>, pn('e' + j, '='));
    if (a[1] === FIELD) out.push(<span key={'q' + j} className="b1-st">{'"' + (before || '')}</span>, node, <span key={'z' + j} className="b1-st">"</span>);
    else out.push(<span key={'v' + j} className="b1-st">{'"' + a[1] + '"'}</span>);
  });
  out.push(pn('g', '>'));
  if (tail) out.push(<React.Fragment key="tl">{hParts(tail)}</React.Fragment>);
  return { k, d, cls: 'b1-line is-hl', parts: out };
}
// ── Проверка слова (kind: cls | theme | toggle).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
const KNOWN10 = ['container', 'row', 'col', 'md:col-4', 'col-4', 'd-flex', 'justify-content-between', 'justify-content-center', 'justify-content-end', 'justify-content-start', 'align-items-center', 'gap-3',
  'card', 'card-body', 'card-img-top', 'img-fluid', 'img-thumbnail', 'rounded', 'form-control', 'form-label', 'check', 'carousel', 'carousel-inner', 'carousel-item', 'active', 'menu', 'menu-item', 'dialog', 'alert',
  'btn-solid', 'btn-outline'].concat(BS_THEMES.map((t) => 'theme-' + t));
const OLD10 = /^(btn-(primary|success|danger|warning|info|secondary)|text-(primary|success|danger)|col-(sm|md|lg)-\d+|form-select|form-check|dropdown(-.*)?|modal|img-responsive|card-block|navbar-toggler)$/;
const COLOR10 = /^(yashil|qizil|ko'k|kok|sariq|green|red|blue|yellow|зел[её]ный|красный|синий)$/;
function lev(a, b) {
  const m = a.length, n = b.length, d = [];
  for (let i = 0; i <= m; i++) { d[i] = [i]; }
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v) && !COLOR10.test(v)) return { k: 'cyr' };
  if (wants.indexOf(v) >= 0) return null;
  if (kind === 'theme') {
    if (/^theme-/.test(v) && BS_THEMES.indexOf(v.slice(6)) >= 0) return { k: 'twice', w: v.slice(6) };
    if (wants.length > 1 && !OLD10.test(v)) return { k: 'anyTheme' };   // свой цвет: любой цвет Bootstrap
    if (BS_THEMES.indexOf(v) >= 0) return { k: 'otherTheme', w: v };
    if (COLOR10.test(v)) return { k: 'nativeColor', w: want0 };
    if (OLD10.test(v)) { const m = /^btn-([a-z]+)$/.exec(v); return { k: 'old', w: m && BS_THEMES.indexOf(m[1]) >= 0 && wants.length > 1 ? m[1] : want0 }; }
    if (lev(v, want0) <= 2) return { k: 'typo', w: want0 };
    return { k: 'unknown', w: v };
  }
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (OLD10.test(v)) return { k: 'old', w: want0 };
  if (want0.length >= 4 && lev(v, want0) <= 2) return { k: 'typo', w: want0 };
  if (KNOWN10.indexOf(v) >= 0 || (kind === 'toggle' && /^(dialog|carousel)$/.test(v))) return { k: 'fam', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
// Телефон: длинный код листается к строке с полем (уроки 8–9).
function hlScroll() {
  document.querySelectorAll('.b10-pair .kz-code, .b10-end .kz-code').forEach((c) => {
    if (c.scrollHeight <= c.clientHeight + 2) return;
    const l = c.querySelector('.kz-line:has(.kz-gap)') || c.querySelector('.kz-line.is-hl, .kz-line.is-new');
    if (!l) return;
    const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect();
    c.scrollTop = Math.max(0, Math.round(lr.top - cr.top + c.scrollTop - c.clientHeight / 2 + lr.height / 2));
  });
}
const useHlScroll = (dep) => useEffect(() => { const t = setTimeout(hlScroll, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
