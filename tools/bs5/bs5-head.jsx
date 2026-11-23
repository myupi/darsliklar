// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 5 «Карточки» (20.11.2026). Набор — bs5-kit.jsx (копия урока 4 + фото robot1–3.jpg), сайт —
// bs5-site.jsx (+ Card), общие куски экранов — bs5-common.jsx (из урока 3). Страница честная: настоящий CSS Bootstrap 6;
// card-title и card-text в CSS 6.0.0-alpha.1 правил не имеют — это имена, вид даёт card-body (так и показываем).
// =============================================================================
const PHONE = 360;
const WIDE = 600;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
// Карточка робота. o: { card, img, body, title, text } — class каждой части (null — без class; img: false — без фото),
// src, name, desc, btn — содержимое; wrap — без обёртки (всё кучей). Ширина как на сайте: max-width 320px.
const CARD_W = 'max-width: 240px';   // свои карточки уже примера сайта (320 px): на телефоне карточка видна целиком
const ROBOTS = [{ src: 'robot1.jpg', k: 'r1' }, { src: 'robot2.jpg', k: 'r2' }, { src: 'robot3.jpg', k: 'r3' }];
function cardParts(pick, o) {
  const name = o.name != null ? o.name : pick(C.site.name1), desc = o.desc != null ? o.desc : pick(C.site.desc1);
  const img = o.img === false ? '' : '<img src="' + (o.src || 'robot1.jpg') + '"' + clsA(o.img) + ' alt="Robot">';
  const inner = '<h4' + clsA(o.title) + '>' + escH(name) + '</h4><p' + clsA(o.text) + '>' + escH(desc) + '</p><a href="#" class="btn-solid ' + (o.btn || 'theme-primary') + '">' + escH(pick(C.site.more)) + '</a>';
  return { img, inner };
}
const cardH = (pick, o) => {
  const P = cardParts(pick, o);
  const body = o.body === false ? P.inner : '<div' + clsA(o.body) + '>' + P.inner + '</div>';
  return '<section' + clsA(o.card) + ' style="' + CARD_W + '">' + P.img + body + '</section>';
};
// Строки кода карточки (как на сайте). hlk — какие строки подсветить: { card, img, body, title, text, btn }.
function cardLines(pick, o, hlk) {
  const H = hlk || {};
  const x = (k) => (H[k] ? { cls: H[k] } : null);
  const name = o.name != null ? o.name : pick(C.site.name1), desc = o.desc != null ? o.desc : pick(C.site.desc1);
  const out = [hl('s', 0, '<section' + (o.card ? ' class="' + o.card + '"' : '') + ' style="' + CARD_W + '">', x('card'))];
  if (o.img !== false) out.push(hl('i', 1, '<img src="' + (o.src || 'robot1.jpg') + '"' + (o.img ? ' class="' + o.img + '"' : '') + ' alt="Robot">', x('img')));
  const d = o.body === false ? 1 : 2;
  if (o.body !== false) out.push(hl('b', 1, '<div' + (o.body ? ' class="' + o.body + '"' : '') + '>', x('body')));
  out.push(hl('t', d, '<h4' + (o.title ? ' class="' + o.title + '"' : '') + '>' + name + '</h4>', x('title')),
    hl('p', d, '<p' + (o.text ? ' class="' + o.text + '"' : '') + '>' + desc + '</p>', Object.assign({ cls: 'b2-cut' + (H.text ? ' ' + H.text : '') })),
    hl('a', d, '<a href="#" class="btn-solid ' + (o.btn || 'theme-primary') + '">' + pick(C.site.more) + '</a>', x('btn')));
  if (o.body !== false) out.push(hl('bc', 1, '</div>'));
  out.push(hl('sc', 0, '</section>'));
  return out;
}
const FULL = { card: 'card', img: 'card-img-top', body: 'card-body', title: 'card-title', text: 'card-text' };
const rowH = (pick, cls, cards) => '<div' + clsA(cls) + '>' + cards.map((o) => cardH(pick, o).replace(' style="' + CARD_W + '"', ' style="max-width: 180px"')).join('') + '</div>';
// Карточка «внутри Bootstrap»: правило CSS класса.
function CssCard({ pick, rules, on }) {
  return (
    <div className={'b4-css' + (on ? ' is-on' : '')}>
      <span className="b4-css-h">{pick(UI.inside)}</span>
      {rules.map((r, j) => <div key={j} className="b4-css-r" translate="no"><b>.{r[0]}</b> {'{ '}<i>{r[1]}</i>{' }'}</div>)}
    </div>
  );
}
const CARD_RULES = { card: ['card', 'border; border-radius; display: flex; flex-direction: column'], 'card-img-top': ['card-img-top', 'width: 100%; border-top radius'], 'card-body': ['card-body', 'padding; display: flex; flex-direction: column; gap'], 'card-title': ['card-title', '— (Bootstrap 6 da qoida yo\'q)'] };
// Полоса «Fayllar»: какие фото лежат рядом со страницей (как в уроке CSS 4).
function FilesBar({ pick, lit, cls }) {
  return (
    <div className={'b5-files' + (cls ? ' ' + cls : '')}><span className="b5-files-h">{pick(UI.files)}</span>
      {ROBOTS.map((r) => <span key={r.src} className={'b5-file' + (lit === r.src ? ' is-lit' : '')}><img src={FILES[r.src]} alt="" />{r.src}</span>)}
    </div>
  );
}

// ── Проверка слова (kind: theme | file | flex | gap).
const GAP_N = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 };
const NATIVE5 = /^(qizil|yashil|sariq|kok|binafsha|qora|kulrang|havorang|red|green|yellow|blue|purple|black|gray|grey|orange|pink)$/;
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (kind !== 'file' && v[0] === '.') return { k: 'dot' };
  if (/:/.test(v)) return { k: 'cssProp', w: want0 };
  if (/\s/.test(v)) return { k: 'one' };
  if (wants.indexOf(v) >= 0) return null;
  if (kind === 'file') {
    if (/^[.…]+$/.test(String(raw || '').trim())) return { k: 'dots' };   // три точки с сайта (normCls съедает последнюю точку)
    if (FILES[v]) return { k: 'otherFile' };
    if (FILES[v + '.jpg']) return { k: 'noExt', w: v + '.jpg' };
    return { k: 'noFile', w: v };
  }
  if (kind === 'theme') {
    const m = /^theme-([a-z]+)$/.exec(v);
    if (m && BS_THEMES.indexOf(m[1]) >= 0) return { k: 'other' };
    if (BS_THEMES.indexOf(v) >= 0) return { k: 'noPrefix', w: 'theme-' + v };
    if (NATIVE5.test(v.replace(/'/g, '').replace(/^(theme|card|bg)-/, ''))) return /^(theme|card|bg)-/.test(v) ? { k: 'unknown', w: v } : { k: 'native' };
    if (/^(btn|alert|text)-[a-z]+$/.test(v)) return { k: 'old' };
    if (/^card-[a-z]+$/.test(v) && BS_THEMES.indexOf(v.slice(5)) >= 0) return { k: 'cardTheme', w: 'theme-' + v.slice(5) };
    if (/^(bg|fg)-[a-z]+$/.test(v)) return { k: 'bgTheme', w: v };
    return { k: 'unknown', w: v };
  }
  if (kind === 'flex') {
    if (v === 'flex') return { k: 'noPrefix', w: 'd-flex' };
    if (/^(justify|align|gap|flex-)/.test(v)) return { k: 'needFlex', w: v };
    if (v === 'row' || /^col/.test(v)) return { k: 'grid' };
    return { k: 'unknown', w: v };
  }
  if (kind === 'gap') {
    const m = /^gap-(\d+)$/.exec(v);
    if (m && GAP_N[m[1]]) return { k: 'other' };
    if (/^\d+$/.test(v) && GAP_N[v]) return { k: 'noPrefix', w: 'gap-' + v };
    if (/^(gap-?)?\d+(px|rem)?$/.test(v)) return { k: 'noSize', w: v };
    if (v === 'd-flex') return { k: 'isFlex' };
    return { k: 'unknown', w: v };
  }
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
