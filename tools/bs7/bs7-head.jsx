// =============================================================================
// ПОМОЩНИКИ ЭКРАНОВ УРОКА 7 «Формы» (20.11.2026). Набор — bs7-kit.jsx (копия урока 6 + доступ к странице), сайт —
// bs7-site.jsx (+ Forms), общие куски экранов — bs7-common.jsx (из урока 3). Страница честная: настоящий CSS Bootstrap 6;
// поля на странице настоящие — в них можно писать, галочку можно ставить.
// =============================================================================
const PHONE = 360;
const vwTitle = (pick, vw) => (vw === PHONE ? pick(UI.phone) : vw ? vw + ' px' : pick(C.site.title));
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
// Форма записи в кружок. Части формы (parts) — по порядку; o — class каждой вещи: ключ «часть.l» — подпись, «часть.c» —
// само поле (у галочки, кружка и переключателя «часть.f» — обёртка form-field), «send.c» — кнопка.
// Строка кода — та же разметка, что на странице (честно); у списка варианты в коде свёрнуты «…», пока он не в фокусе.
function formParts(pick, part) {
  const t = (k) => pick(C.site[k]);
  const lab = (id, k) => ({ key: part + '.l', tag: 'label', attrs: [['for', id]], text: t(k), close: true });
  if (part === 'name') return [lab('ism', 'name'), { key: 'name.c', tag: 'input', attrs: [['type', 'text'], ['id', 'ism']] }];
  if (part === 'phone') return [lab('tel', 'phone'), { key: 'phone.c', tag: 'input', attrs: [['type', 'tel'], ['id', 'tel']] }];
  if (part === 'date') return [lab('kun', 'date'), { key: 'date.c', tag: 'input', attrs: [['type', 'date'], ['id', 'kun']] }];
  if (part === 'num') return [lab('yosh', 'age'), { key: 'num.c', tag: 'input', attrs: [['type', 'number'], ['id', 'yosh']] }];
  if (part === 'note') return [lab('izoh', 'note'), { key: 'note.c', tag: 'textarea', attrs: [['id', 'izoh'], ['rows', '2']], text: '', close: true }];
  if (part === 'group') return [lab('guruh', 'group'), { key: 'group.c', tag: 'select', attrs: [['id', 'guruh']], text: '…', close: true, html: C.site.groups.map((g) => '<option>' + escH(pick(g)) + '</option>').join(''), opts: C.site.groups.map((g) => pick(g)) }];
  if (part === 'agree' || part === 'agree2') {
    const id = part === 'agree' ? 'rozi' : 'rozi2';
    return [{ key: part + '.f', tag: 'div', attrs: [] }, { key: part + '.c', tag: 'input', attrs: [['type', 'checkbox'], ['id', id]], d: 1 }, { tag: 'label', attrs: [['for', id]], text: t(part === 'agree' ? 'agree' : 'photo'), close: true, d: 1 }, { raw: '</div>' }];
  }
  if (part === 'time') return [{ key: 'time.f', tag: 'div', attrs: [] }, { key: 'time.c', tag: 'input', attrs: [['type', 'radio'], ['name', 'vaqt'], ['id', 'v1']], d: 1 }, { tag: 'label', attrs: [['for', 'v1']], text: t('morning'), close: true, d: 1 }, { raw: '</div>' },
    { fold: true, html: '<div class="form-field"><input type="radio" name="vaqt" id="v2" class="radio"><label for="v2">' + escH(t('evening')) + '</label></div>', src: '<div class="form-field">…' + t('evening') + '…</div>' }];
  if (part === 'news') return [{ key: 'news.f', tag: 'div', attrs: [] }, { key: 'news.c', tag: 'div', attrs: [], d: 1 }, { tag: 'input', attrs: [['type', 'checkbox'], ['id', 'yangi'], ['role', 'switch']], bare: 'switch', d: 2 }, { raw: '</div>', d: 1 }, { tag: 'label', attrs: [['for', 'yangi']], text: t('news'), close: true, d: 1 }, { raw: '</div>' }];
  if (part === 'send') return [{ key: 'send.c', tag: 'button', attrs: [['type', 'submit']], text: t('send'), close: true, v: 'send' }];
  return [];
}
const attrS = (attrs) => attrs.map((a) => ' ' + a[0] + '="' + a[1] + '"').join('');
// Строка (src — для кода, html — для страницы).
function rowSrc(r, c) {
  if (r.raw) return r.raw;
  if (r.fold) return r.src;
  return '<' + r.tag + attrS(r.attrs) + (c ? ' class="' + c + '"' : '') + (r.bare ? ' ' + r.bare : '') + '>' + (r.text != null ? r.text : '') + (r.close ? '</' + r.tag + '>' : '');
}
function rowHtml(r, c) {
  if (r.raw) return r.raw;
  if (r.fold) return r.html;
  return '<' + r.tag + attrS(r.attrs) + clsA(c) + (r.bare ? ' ' + r.bare : '') + (r.v ? ' data-v="' + r.v + '"' : '') + '>' + (r.html != null ? r.html : r.text != null ? escH(r.text) : '') + (r.close ? '</' + r.tag + '>' : '');
}
// Страница: форма из частей parts; top — что-то над формой (e'lon «Rahmat!»).
function formH(pick, parts, o, top) {
  const cls = o || {};
  return (top || '') + '<form>' + parts.map((p) => formParts(pick, p).map((r) => rowHtml(r, r.key ? cls[r.key] : null)).join('')).join('') + '</form>';
}
// Код: opt = { hl: { ключ: класс строки }, field: { key, node } — поле ввода в class, fold: { часть: true } — часть одной
// строкой, open: true — варианты списка строками, noForm: true — без строк form }.
function formLines(pick, parts, o, opt) {
  const O = opt || {};
  const cls = o || {};
  const H = O.hl || {};
  const out = O.noForm ? [] : [hl('fo', 0, '<form>', { cls: 'b1-edge' })];
  const d0 = O.noForm ? 0 : 1;
  parts.forEach((p) => {
    const rows = formParts(pick, p);
    if (O.fold && O.fold[p]) {
      const main = rows.find((r) => r.key && /\.(c)$/.test(r.key));
      const lab = rows.find((r) => r.tag === 'label');
      const wrap = rows[0].key && /\.f$/.test(rows[0].key);
      const src = wrap ? rowSrc({ tag: 'div', attrs: [] }, cls[rows[0].key]) + '…' + (lab ? lab.text : '') + '…</div>' : (lab ? rowSrc(lab, cls[lab.key]) : '') + rowSrc(main, cls[main.key]);
      out.push(hl('z' + p + (cls[rows[0].key] || '') + (main ? cls[main.key] || '' : ''), d0, src, { cls: 'b2-cut' + (H[p] ? ' ' + H[p] : '') }));
      return;
    }
    rows.forEach((r, j) => {
      const d = d0 + (r.d || 0);
      const c = r.key ? cls[r.key] : null;
      const k = p + j + (c || '');
      if (O.field && r.key === O.field.key) {
        out.push({ k: k + 'f', d, cls: 'b1-line is-hl', parts: clsParts({ tag: r.tag, attrs: r.attrs, field: O.field.node, text: r.text != null ? r.text : null, close: !!r.close }) });
        return;
      }
      const ex = H[r.key || ''] || (r.tag === 'label' && H[p + '.l']) || null;
      out.push(hl(k, d, rowSrc(r, c), { cls: ex || '' }));
      if (O.open && r.opts) {
        out.pop();
        out.push(hl(k, d, rowSrc(Object.assign({}, r, { text: null, close: false }), c), { cls: ex || '' }));
        r.opts.forEach((t, i) => out.push(hl(k + 'o' + i, d + 1, '<option>' + t + '</option>')));
        out.push(hl(k + 'sc', d, '</select>'));
      }
    });
  });
  if (!O.noForm) out.push(hl('fc', 0, '</form>', { cls: 'b1-edge' }));
  return out;
}
// Все class формы по Bootstrap — для частей parts.
const FORM_FULL = { 'name.l': 'form-label', 'name.c': 'form-control', 'phone.l': 'form-label', 'phone.c': 'form-control', 'date.l': 'form-label', 'date.c': 'form-control',
  'num.l': 'form-label', 'num.c': 'form-control', 'note.l': 'form-label', 'note.c': 'form-control', 'group.l': 'form-label', 'group.c': 'form-control',
  'agree.f': 'form-field', 'agree.c': 'check', 'agree2.f': 'form-field', 'agree2.c': 'check', 'time.f': 'form-field', 'time.c': 'radio', 'news.f': 'form-field', 'news.c': 'switch', 'send.c': 'btn-solid theme-primary' };
const withCls = (o, add) => Object.assign({}, o, add);
const without = (o, keys) => { const x = Object.assign({}, o); keys.forEach((k) => { x[k] = null; }); return x; };
// E'lon «Rahmat!» над формой после отправки (урок 1: alert theme-success).
const thanksH = (pick) => '<div class="alert theme-success" role="alert"><p>' + escH(pick(C.site.thanks)) + '</p></div>';
// Карточка «внутри Bootstrap».
function CssCard({ pick, rules, on }) {
  return (
    <div className={'b4-css' + (on ? ' is-on' : '')}>
      <span className="b4-css-h">{pick(UI.inside)}</span>
      {rules.map((r, j) => <div key={j} className="b4-css-r" translate="no"><b>.{r[0]}</b> {'{ '}<i>{r[1]}</i>{' }'}</div>)}
    </div>
  );
}
const FORM_RULES = {
  'form-control': ['form-control', 'display: flex; width: 100%; padding; border; border-radius'],
  'form-label': ['form-label', 'margin-bottom: .5rem'],
  check: ['check', 'appearance: none; width: 1.25rem; border; border-radius: 33%'],
  radio: ['radio', 'appearance: none; width: 1.25rem; border-radius: 50%'],
  switch: ['switch', 'width: 2.2rem; border-radius: 10rem'],
  'form-field': ['form-field', 'display: grid; gap: .5rem'],
  'btn-solid': ['btn-solid', 'background: var(--theme); border-radius; padding']
};
const rulesOf = (keys) => keys.map((k) => FORM_RULES[k]).filter(Boolean);

// ── Проверка слова в class (kind: control | label | check | radio | switch | field | btn).
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
const KNOWN7 = ['form-control', 'form-label', 'form-text', 'form-field', 'check', 'radio', 'switch', 'btn-solid', 'btn-outline'];
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = [].concat(want || []);
  const want0 = wants[0] || '';
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (v[0] === '.') return { k: 'dot' };
  if (wants.indexOf(v) >= 0) return null;
  if (/\s/.test(v)) return kind === 'btn' && /^btn-(solid|outline) theme-[a-z]+$/.test(v) ? { k: 'other' } : { k: 'one' };
  if (/^(maydon|yozuv|forma|royxat|ro'yxat|belgi|tugma)/.test(v)) return { k: 'native' };
  if (/^form-(select|check|check-input|check-label|switch|radio)$/.test(v)) return { k: 'old', w: want0 || 'form-control' };
  if (/^form-?(contol|contrl|controll|cotrol|conrol|controls)$|^from-control$|^formcontrol$/.test(v)) return { k: 'typo', w: 'form-control' };
  if (/^form-?(lable|labels|lebel)$|^from-label$|^formlabel$/.test(v)) return { k: 'typo', w: 'form-label' };
  if (/^(chek|chack|cheсk|checks|checked)$/.test(v)) return { k: 'typo', w: 'check' };
  if (v === 'control' || v === 'label' || v === 'field') return { k: 'noPrefix', w: 'form-' + v };
  if (v === 'checkbox') return { k: 'checkbox', w: 'check' };
  if (/^(input|select|textarea|form-input|form-textarea)$/.test(v)) return { k: 'tagName', w: v };
  if (KNOWN7.indexOf(v) >= 0) {
    if (kind === 'control' || kind === 'label') return { k: 'fam', w: v };
    if ((kind === 'check' || kind === 'radio' || kind === 'switch') && /^(check|radio|switch)$/.test(v)) return { k: 'other' };
    return { k: 'fam', w: v };
  }
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);
