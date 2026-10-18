// Превью монитора: node tools/zagolovki/preview-monitor.mjs [out.html] — корпус и HTML-слой на экране.
import { writeFileSync } from 'node:fs';
import * as k from '../anatomy/kit/iso-kit.mjs';
import { monitorModel } from './monitor.figures.mjs';
const m = monitorModel();
const css = k.ISO_CSS + `body{margin:0;background:#f2f2ef;font:13px sans-serif;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px}
.cell{position:relative;background:#fbfbfa;border-radius:14px}
.mon{position:relative;width:100%;aspect-ratio:${m.ar}}
.mon>svg{position:absolute;inset:0;width:100%;height:100%}
.mon-glass{fill:#14181f}.mon-glare{fill:#fff;opacity:.06}.mon-bezel{fill:#2a2f38}.mon-hole{fill:#3a3d44;opacity:.5}.mon-slot{fill:#3a3d44;opacity:.45}
.mon-cam{fill:#1b1f27}.mon-led{fill:#9aa3ad}.is-on .mon-led{fill:#36d17a;filter:drop-shadow(0 0 2px #36d17a)}
.scr{position:absolute;left:0;top:0;transform-origin:0 0;width:320px;height:200px;background:#fff;overflow:hidden;font-family:Georgia,serif}
.scr .bar{height:26px;background:#ecebe8;display:flex;align-items:flex-end;padding:0 8px}.scr .tab{background:#fff;border-radius:6px 6px 0 0;padding:4px 10px;font:600 11px sans-serif}
.scr .pg{padding:8px 12px}.scr h1{font-size:24px;margin:.2em 0}.scr h2{font-size:18px;margin:.3em 0}.scr p{font-size:13px;margin:.3em 0}`;
const html = [1, 2].map(() => `<div class="cell"><div class="mon is-on">${m.svg}<div class="scr"><div class="bar"><span class="tab">Битва знаний</span></div><div class="pg"><h1>Битва знаний</h1><h2>Правила</h2><p>Отвечай на <b>10 вопросов</b> быстрее соперника.</p></div></div></div></div>`).join('');
const script = `const S=${JSON.stringify(m.screen)},W=${m.w},H=${m.h};
function place(){document.querySelectorAll('.mon').forEach(mon=>{const svg=mon.querySelector('svg');const r=svg.getBoundingClientRect(),R=mon.getBoundingClientRect();
const s=Math.min(r.width/W,r.height/H),ox=(r.width-W*s)/2+(r.left-R.left),oy=(r.height-H*s)/2+(r.top-R.top);
const P=(p)=>[ox+p[0]*s,oy+p[1]*s];const a=P(S.tl),b=P(S.tr),c=P(S.bl);const el=mon.querySelector('.scr');const w=el.offsetWidth,h=el.offsetHeight;
el.style.transform='matrix('+[(b[0]-a[0])/w,(b[1]-a[1])/w,(c[0]-a[0])/h,(c[1]-a[1])/h,a[0],a[1]].join(',')+')';})}
place();addEventListener('resize',place);`;
writeFileSync(process.argv[2] || new URL('./preview-monitor.html', import.meta.url), `<!doctype html><meta charset=utf-8><style>${css}</style><body class="iso" data-theme="light">${html}<script>${script}</script>`);
console.log('ok', m.screen);
