// Превью фигуры урока «загляни внутрь»: node tools/anatomy/preview.mjs → tools/anatomy/preview-p.html
import { writeFileSync } from 'node:fs';
import * as k from './kit/iso-kit.mjs';
import { docModel } from './pervaya.figures.mjs';
const d = docModel();
const states = [
  { name: 'закрыт', parts: { 'title-card': 'off', 'page-card': 'off', 'title-stray': 'off', slots: 'off' }, move: {} },
  { name: 'html открыт, отделения закрыты', parts: { 'title-stray': 'off', slots: 'off', 'title-card': 'off', 'page-card': 'off', lid: 'off' }, move: { lid: d.open.lid } },
  { name: 'head раскрыт', parts: { 'title-stray': 'off', slots: 'off', 'page-card': 'off', lid: 'off', 'head-cover': 'off' }, move: { lid: d.open.lid, 'head-cover': d.open.cover } },
  { name: 'всё раскрыто', parts: { 'title-stray': 'off', slots: 'off', lid: 'off', 'head-cover': 'off', 'body-cover': 'off' }, move: { lid: d.open.lid } },
];
const css = k.ISO_CSS + `body{margin:0;background:#f2f2ef;font:13px sans-serif} .w{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px}
.w>div{background:#fbfbfa;border-radius:12px} [data-state=off]{display:none} [data-state=ghost]{opacity:.14}
.fg-tint{opacity:.13} .fg-tint[data-tag=html]{fill:#586A83} .fg-tint[data-tag=head]{fill:#6F57AB} .fg-tint[data-tag=body]{fill:#1171A0}
text[data-tag=html]{fill:#586A83} text[data-tag=head]{fill:#6F57AB} text[data-tag=body]{fill:#1171A0} text[data-tag=title]{fill:#9F4471}
[data-part=case],[data-part=case-near],[data-part=html-close]{--anatomy-top:#f3f5f8;--anatomy-shade-0:#d3d8df;--anatomy-shade-1:#dde1e7;--anatomy-shade-2:#e6e9ee;--anatomy-shade-3:#eef0f3}
[data-part=head]{--anatomy-top:#f6f3fc;--anatomy-shade-0:#d9d1ec;--anatomy-shade-1:#e2dcf1;--anatomy-shade-2:#ebe6f6;--anatomy-shade-3:#f2effa}
[data-part=body]{--anatomy-top:#f0f7fb;--anatomy-shade-0:#cfe1ec;--anatomy-shade-1:#d9e8f1;--anatomy-shade-2:#e3eef5;--anatomy-shade-3:#ecf4f9}
[data-part=title-card],[data-part=page-card],[data-part=title-stray]{--anatomy-top:#fff;--anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1}
text[data-font=sans]{font-family:sans-serif;font-weight:600;letter-spacing:0}
.fg-slot{fill:none;stroke:#8a8a8f;stroke-dasharray:3 3;stroke-width:.8}`;
const texts = { title: 'Мой первый сайт', page1: 'Привет! Это', page2: 'моя страница.' };
const html = states.map((s) => `<div><b>${s.name}</b>${d.svg}</div>`).join('');
const script = `const S=${JSON.stringify(states)},A=${JSON.stringify(d.axes)},T=${JSON.stringify(texts)};
document.querySelectorAll('.w>div').forEach((box,i)=>{const s=S[i];
box.querySelectorAll('[data-t]').forEach(n=>{if(T[n.dataset.t]!=null)n.textContent=T[n.dataset.t]});
box.querySelectorAll('[data-part]').forEach(g=>{const st=s.parts[g.dataset.part]; if(st)g.dataset.state=st});
Object.entries(s.move).forEach(([k,v])=>box.querySelectorAll('[data-move="'+k+'"]').forEach(g=>g.setAttribute('transform','translate('+A[k][0]*v+' '+A[k][1]*v+')')));
document.querySelectorAll('[data-fit]').forEach(n=>{const m=+n.dataset.fit; if(n.getComputedTextLength()>m){n.setAttribute('textLength',m);n.setAttribute('lengthAdjust','spacingAndGlyphs')}}); if(!s.move.lid){} else box.querySelectorAll('[data-part=lid]').forEach(g=>g.style.opacity=.15)});`;
writeFileSync(new URL('./preview-p.html', import.meta.url), `<!doctype html><meta charset=utf-8><style>${css}</style><body class="iso" data-theme="light"><div class="w">${html}</div><script>${script}</script>`);
console.log('ok');
