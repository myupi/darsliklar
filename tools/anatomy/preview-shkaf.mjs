// Превью шкафа документа: node tools/anatomy/preview-shkaf.mjs [out.html] [robot] → состояния фигуры для проверки глазами.
// Второй аргумент robot — вариант урока 07 (табличка DOCTYPE, ящики задвинуты в покое).
import { writeFileSync } from 'node:fs';
import * as k from './kit/iso-kit.mjs';
import { cabinetModel } from './shkaf.figures.mjs';
const ROBOT = process.argv[3] === 'robot';
const d = cabinetModel(ROBOT ? { doctype: true, covers: true, tagsFront: true } : {});
const O = d.open;
const states = ROBOT ? [
  { name: 'урок 07: закрыт', parts: { slots: 'off', 'title-stray': 'off', 'title-card': 'off', 'page-card': 'off' }, move: {} },
  { name: 'открыт html, ящики задвинуты', parts: { lid: 'off', slots: 'off', 'title-stray': 'off', 'title-card': 'off', 'page-card': 'off' }, move: { lid: O.lid }, lit: ['html', 'html-close'] },
  { name: 'выдвинут head', parts: { lid: 'off', slots: 'off', 'title-stray': 'off', 'page-card': 'off' }, move: { lid: O.lid, 'head-cover': O.cover }, lit: ['head', 'head-close'] },
  { name: 'оба выдвинуты, DOCTYPE', parts: { lid: 'off', slots: 'off', 'title-stray': 'off' }, move: { lid: O.lid, 'head-cover': O.cover, 'body-cover': O.cover }, lit: ['doctype'] },
  { name: 'сборка: пусто', parts: { lid: 'off', 'title-stray': 'off', 'title-card': 'off', head: 'off', body: 'off' }, move: { lid: O.lid, 'head-cover': O.cover, 'body-cover': O.cover } },
  { name: 'сборка: готово', parts: { lid: 'off', slots: 'off', 'title-stray': 'off' }, move: { lid: O.lid, 'head-cover': O.cover, 'body-cover': O.cover }, lit: ['title'] },
] : [
  { name: 'закрыт (этап 1)', parts: { slots: 'off', 'title-stray': 'off', head: 'off', body: 'off', 'title-card': 'off' }, move: { head: O.drop, body: O.drop, 'title-card': O.drop } },
  { name: 'открыт', parts: { lid: 'off', slots: 'off', 'title-stray': 'off' }, move: { lid: O.lid } },
  { name: 'выбран head', parts: { lid: 'off', slots: 'off', 'title-stray': 'off' }, move: { lid: O.lid, head: O.pull }, lit: ['head', 'head-close'] },
  { name: 'выбран body', parts: { lid: 'off', slots: 'off', 'title-stray': 'off' }, move: { lid: O.lid, body: O.pull }, lit: ['body', 'body-close', 'page'] },
  { name: 'сборка: пусто', parts: { lid: 'off', 'title-stray': 'off', 'title-card': 'off', 'page-card': 'off', head: 'off', body: 'off', 'html-close': 'ghost' }, move: { lid: O.lid } },
  { name: 'Помоги Коди', parts: { lid: 'off', slots: 'off', 'title-card': 'off', 'body-close': 'ghost', 'head-close': 'ghost' }, move: { lid: O.lid, 'title-stray': 8 }, lit: ['title'] },
];
const css = k.ISO_CSS + `body{margin:0;background:#f2f2ef;font:13px sans-serif} .w{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px}
.w>div{background:#fbfbfa;border-radius:12px;position:relative} b{position:absolute;left:10px;top:6px}
[data-state=off]{opacity:0} [data-state=ghost]{opacity:.16}
.fg-tint{opacity:.12} .is-lit .fg-tint{opacity:.3} .fg-tint[data-tag=html]{fill:#586A83} .fg-tint[data-tag=head]{fill:#6F57AB} .fg-tint[data-tag=body]{fill:#1171A0}
.fg-void{fill:#3b3d44;opacity:.26}
text[data-tag=html]{fill:#586A83} text[data-tag=head]{fill:#6F57AB} text[data-tag=body]{fill:#1171A0} text[data-tag=title]{fill:#9F4471}
[data-part=case],[data-part=case-near],[data-part=html-close],[data-part=lid]{--anatomy-top:#f3f5f8;--anatomy-shade-0:#d0d6de;--anatomy-shade-1:#dbe0e7;--anatomy-shade-2:#e5e9ee;--anatomy-shade-3:#eef0f3}
[data-part=head]{--anatomy-top:#f6f3fc;--anatomy-shade-0:#d6cdec;--anatomy-shade-1:#e0d9f1;--anatomy-shade-2:#e9e4f6;--anatomy-shade-3:#f1eefa}
[data-part=body]{--anatomy-top:#eff7fb;--anatomy-shade-0:#cbdfeb;--anatomy-shade-1:#d6e7f1;--anatomy-shade-2:#e1eef5;--anatomy-shade-3:#ebf4f9}
[data-part=doctype]{--anatomy-top:#fffbea;--anatomy-shade-0:#e4dcc0;--anatomy-shade-1:#ece5cc;--anatomy-shade-2:#f2ecd8;--anatomy-shade-3:#f7f2e3}
[data-part=title-card],[data-part=page-card],[data-part=title-stray]{--anatomy-top:#fff;--anatomy-shade-0:#dededb;--anatomy-shade-1:#e7e7e4;--anatomy-shade-2:#efefec;--anatomy-shade-3:#f6f6f3}
text[data-font=sans]{font-family:sans-serif;font-weight:700;letter-spacing:0;fill:#1d1d1f}
.fg-slot{fill:rgba(88,106,131,.06);stroke:#8a95a5;stroke-dasharray:4 3;stroke-width:.9;vector-effect:non-scaling-stroke}
[data-tag=head].is-lit>.iso-solid>.iso-edge,[data-tag=head] .is-lit>.iso-solid>.iso-edge{stroke:#6F57AB}
[data-tag=body].is-lit>.iso-solid>.iso-edge,[data-tag=body] .is-lit>.iso-solid>.iso-edge{stroke:#1171A0}
[data-tag=title].is-lit>.iso-solid>.iso-edge{stroke:#9F4471} [data-sel=doctype].is-lit .iso-edge{stroke:#5b5b60} .is-lit>.iso-solid>.iso-edge{stroke-width:1.6} .is-lit>.iso-solid>.iso-top{fill:#fff}`;
const texts = { title: 'Мой первый сайт', page1: 'Привет! Это', page2: 'моя страница.' };
const html = states.map((s) => `<div><b>${s.name}</b>${d.svg}</div>`).join('');
const script = `const S=${JSON.stringify(states)},A=${JSON.stringify(d.axes)},T=${JSON.stringify(texts)};
document.querySelectorAll('.w>div').forEach((box,i)=>{const s=S[i];
box.querySelectorAll('[data-t]').forEach(n=>{if(T[n.dataset.t]!=null)n.textContent=T[n.dataset.t]});
box.querySelectorAll('[data-part]').forEach(g=>{const st=s.parts[g.dataset.part]; if(st)g.dataset.state=st});
(s.lit||[]).forEach(k=>box.querySelectorAll('[data-sel="'+k+'"]').forEach(g=>g.classList.add('is-lit')));
Object.entries(s.move).forEach(([k,v])=>box.querySelectorAll('[data-move="'+k+'"]').forEach(g=>g.setAttribute('transform','translate('+A[k][0]*v+' '+A[k][1]*v+')')));
box.querySelectorAll('[data-fit]').forEach(n=>{const m=+n.dataset.fit; if(n.getComputedTextLength()>m){n.setAttribute('textLength',m);n.setAttribute('lengthAdjust','spacingAndGlyphs')}});});`;
writeFileSync(process.argv[2] || new URL('./preview-shkaf.html', import.meta.url), `<!doctype html><meta charset=utf-8><style>${css}</style><body class="iso" data-theme="light"><div class="w">${html}</div><script>${script}</script>`);
console.log('ok');
