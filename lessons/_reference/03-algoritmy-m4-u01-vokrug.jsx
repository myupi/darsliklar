// =============================================================================
// АЛГОРИТМЫ В ЖИЗНИ · Модуль 4 · Урок 1 — «Алгоритмы вокруг тебя»
// Дети 8–10. Самодостаточный JSX: весь урок в одном файле.
// Пропсы: { studentName, lang , onFinished, startScreen , intro }
// Внешние пакеты: react, framer-motion, lucide-react, @lesson/runtime.
// Собран склейкой из deploy-algo-u1/src (_platforma.mjs), 23.09.2026.
// Править надо там и склеивать заново — руками в этом файле ничего.
// =============================================================================

import React, {
  useCallback,
  useEffect,
  useEffect as useEffect2,
  useLayoutEffect,
  useMemo,
  useMemo as useMemo2,
  useRef,
  useRef as useRef2,
  useState,
  useState as useState2,
} from 'react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  useAudio,
  useAudio as useAudio2,
  useSfx,
} from '@lesson/runtime';

// deploy-algo-u1/src/lesson.jsx

// deploy-algo-u1/src/karta.jsx

// raw:C:\Users\user\Desktop\kids jsx\deploy-algo-u1\src\karta.html
var karta_default = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>\u041A\u0430\u0440\u0442\u0430 \u043A\u0443\u0440\u0441\u0430 \xAB\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B\xBB</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&family=JetBrains+Mono:wght@500&display=swap">
<style>
:root{
  --sky:#6BD2EF; --meadow:#6CDC69; --road:#88E97B; --ink:#17224C; --muted:#5B6C87;
  --grey:#C6CEDD; --grey-rim:#A3AFC6; --lock:#6B7891; --done:#31B88A; --now:#FF9F5A; --gluk:#FF9F5A; --tik:#3FC5F0;
  --panel:#FFFFFF; --panel-ink:#17224C; --line:rgba(23,34,76,.12);
  --sig:cubic-bezier(.175,.885,.32,1.275); --out:cubic-bezier(.05,.7,.1,1); --in:cubic-bezier(.3,0,1,1);
  --sine:cubic-bezier(.45,.05,.55,.95); --gentle:cubic-bezier(.4,0,.2,1); --md3:cubic-bezier(.2,0,0,1);
  color-scheme:light;
}
*{box-sizing:border-box}
body{margin:0;background:var(--meadow);color:var(--ink);font-family:Nunito,"Segoe UI",system-ui,sans-serif;font-size:14px;line-height:1.4;-webkit-font-smoothing:antialiased}

/* ---------- \u0432\u0435\u0440\u0445\u043D\u044F\u044F \u043F\u0430\u043D\u0435\u043B\u044C: \u043F\u043E\u043B\u0443\u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u0430\u044F \u043F\u043E\u043B\u043E\u0441\u0430 \u043F\u043E\u0432\u0435\u0440\u0445 \u043A\u0430\u0440\u0442\u044B, \u043A\u0430\u043A \u0432 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0435 ---------- */
.topbar{position:fixed;inset:0 0 auto 0;height:52px;z-index:30;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding-inline:2vw;
  background:rgba(255,255,255,.16);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);box-shadow:inset 0 -1px 0 rgba(255,255,255,.14)}
.topbar .left{display:flex;align-items:center;gap:26px;justify-content:flex-end;padding-right:26px}
.topbar .back{color:#fff;font-weight:800;font-size:14px;text-decoration:none;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.18)}
.progress{display:flex;align-items:center;gap:10px;width:min(480px,44vw)}
.bar{position:relative;flex:1;height:14px;border-radius:99px;background:#418A40;overflow:visible;box-shadow:inset 0 1px 2px rgba(0,0,0,.25)}
.bar i{position:absolute;left:0;top:0;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#FFE47A,#FCD94F);transition:width 600ms var(--gentle)}
.bar .knob{position:absolute;top:50%;left:0;width:24px;height:24px;border-radius:50%;background:#FCD94F;border:0;box-shadow:0 2px 4px rgba(23,34,76,.25);transform:translate(-50%,-50%);transition:left 600ms var(--gentle)}
.bar .flag{display:none}
.finish{display:flex;align-items:center;gap:6px;color:#fff;font-weight:900;font-size:15px;text-shadow:0 1px 2px rgba(0,0,0,.18)}
.finish svg{width:18px;height:22px}
.pct{min-width:34px;font-variant-numeric:tabular-nums}
.topbar .right{display:flex;justify-content:flex-end}
/* \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0443\u0440\u0441\u0430 \u0432 \u0448\u0430\u043F\u043A\u0435 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0443\u0437\u043A\u0438\u0445 \u044D\u043A\u0440\u0430\u043D\u0430\u0445, \u0441\u043C. \u043C\u0435\u0434\u0438\u0430\u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0438\u0436\u0435. */
.topname{display:none;color:#fff;font-weight:900;font-size:17px;white-space:nowrap;
  text-shadow:0 2px 0 rgba(23,34,76,.22)}
@media(max-width:820px){.bubble{max-width:min(78vw,320px)}.finish{display:none}.topbar{display:flex;justify-content:space-between;gap:12px;padding-inline:14px}.topbar .back{display:none}.topbar .left{flex:1;padding:0;justify-content:flex-start}.progress{flex:1;width:auto;min-width:0}
  /* \u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0445\u043E\u0434\u0438\u0442 \u0438\u0437 \u043A\u0430\u0440\u0442\u044B \u0432 \u0448\u0430\u043F\u043A\u0443: \u043D\u0430 \u0445\u043E\u043B\u0441\u0442\u0435 1648px \u043E\u043D\u043E \u0441\u0442\u043E\u0438\u0442 \u043F\u043E \u0446\u0435\u043D\u0442\u0440\u0443 \u0438 \u043D\u0430
     \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0437\u0430 \u043A\u0440\u0430\u0435\u043C \u043E\u043A\u043D\u0430.
     \u0421\u043B\u0435\u0432\u0430, \u0430 \u043D\u0435 \u0441\u043F\u0440\u0430\u0432\u0430: \u0441\u043F\u0440\u0430\u0432\u0430 \u0443\u0440\u043E\u043A \u0440\u0438\u0441\u0443\u0435\u0442 \u041F\u041E\u0412\u0415\u0420\u0425 \u043A\u0430\u0434\u0440\u0430 \u0441\u0432\u043E\u0439 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C
     \u044F\u0437\u044B\u043A\u043E\u0432, \u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u044F\u0442\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434 \u043D\u0438\u043C. \u041E\u0442\u0442\u0443\u0434\u0430 \u0436\u0435 \u043F\u0440\u0430\u0432\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F \u043F\u043E\u043B\u043E\u0441\u044B \u2014 \u043E\u043D
     \u0434\u0435\u0440\u0436\u0438\u0442 \u043C\u0435\u0441\u0442\u043E \u043F\u043E\u0434 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u044C, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u043E\u0441\u0430 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430 \u043F\u043E\u0434 \u043D\u0435\u0433\u043E \u043D\u0435 \u043B\u0435\u0437\u043B\u0430. */
  .topbar{padding-right:124px}
  .mapname{display:none}.topname{display:block;flex:0 0 auto;order:-1}}

/* ---------- \u043A\u0430\u0440\u0442\u0430: \u043D\u0430 \u0432\u0441\u044E \u0448\u0438\u0440\u0438\u043D\u0443 \u044D\u043A\u0440\u0430\u043D\u0430; \u043D\u0430 \u0443\u0437\u043A\u0438\u0445 \u044D\u043A\u0440\u0430\u043D\u0430\u0445 \u2014 \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430, \u043A\u0430\u043A \u0443 \u043D\u0430\u0441\u0442\u043E\u043B\u044C\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 ---------- */
.course{position:relative;width:100%;margin:0;overflow-x:auto;overflow-y:hidden}
.course svg{display:block;width:100%;min-width:960px;height:auto}
.bubble{position:absolute;transform:translate(-50%,-100%);max-width:min(46%,320px);background:#fff;color:var(--ink);border-radius:18px;padding:10px 14px;
  font-weight:800;font-size:clamp(11px,1.5vw,16px);line-height:1.25;text-align:center;box-shadow:0 10px 24px -14px rgba(23,34,76,.6);
  opacity:0;pointer-events:none;transition:opacity 220ms var(--gentle);z-index:5}
.bubble::after{content:'';position:absolute;left:var(--tail,50%);bottom:-9px;width:16px;height:16px;background:#fff;transform:translateX(-50%) rotate(45deg);border-radius:3px}
.bubble.show{opacity:1}
/* \u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0451\u043D\u043D\u044B\u0439 \u0432\u043D\u0438\u0437 \u043F\u0443\u0437\u044B\u0440\u044C: \u0441\u0430\u043C \u0443\u0435\u0437\u0436\u0430\u0435\u0442 \u043F\u043E\u0434 \u0433\u0435\u0440\u043E\u044F, \u0445\u0432\u043E\u0441\u0442\u0438\u043A \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u0432\u0432\u0435\u0440\u0445. */
.bubble.below{transform:translate(-50%,0)}
.bubble.below::after{bottom:auto;top:-9px}
.bubble.tik{background:#DDF4FF;color:#17224C;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:clamp(10px,1.2vw,13px);letter-spacing:.06em}
.bubble.tik::after{background:#DDF4FF}
.bubble .w{display:inline-block;white-space:nowrap}
.bubble .w span{display:inline-block;animation:letterIn 300ms var(--sig) both}
@keyframes letterIn{from{opacity:0;transform:translateY(8px) rotate(-4deg)}to{opacity:1;transform:none}}

/* ---------- \u043F\u0430\u043D\u0435\u043B\u044C \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u0430 ---------- */
.ctl{position:fixed;right:14px;bottom:14px;z-index:30;background:var(--panel);color:var(--panel-ink);border-radius:18px;padding:12px 14px;box-shadow:0 18px 40px -20px rgba(23,34,76,.6),0 0 0 1px var(--line);
  display:grid;gap:8px;width:min(92vw,300px)}
.ctl h2{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
.ctl .fold{border:0;background:#EEF2F8;color:var(--ink);border-radius:8px;width:26px;height:22px;cursor:pointer;font-weight:900;line-height:1}
.ctl.folded{width:auto;padding:8px 12px}.ctl.folded>*:not(h2){display:none}.ctl.folded h2{gap:10px}
.ctl .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.ctl select{font:inherit;font-weight:800;border-radius:9px;border:1px solid var(--line);padding:6px 8px;background:#F6F8FC;color:var(--ink)}
.btn{font:inherit;font-weight:800;font-size:13px;border:0;border-radius:999px;padding:9px 14px;cursor:pointer;background:#EEF2F8;color:var(--ink);transition:transform 140ms var(--sig)}
.btn:hover{transform:translateY(-1px)}.btn:active{transform:scale(.97)}
.btn.primary{background:var(--now);color:#3A1B00;box-shadow:0 10px 20px -12px var(--now)}
.btn[disabled]{opacity:.45;cursor:default}
.note{font-size:11.5px;color:var(--muted);margin:0}
button:focus-visible,select:focus-visible{outline:3px solid var(--tik);outline-offset:2px}

/* ---------- ambient ---------- */
.gear{transform-box:fill-box;transform-origin:50% 50%;animation:spin var(--gd,12s) linear infinite}
.gear.ccw{animation-direction:reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.belt{animation:belt 1.6s linear infinite}
@keyframes belt{to{stroke-dashoffset:-36}}
.boxes{animation:boxes 4.2s linear infinite}
@keyframes boxes{from{transform:translateX(0)}to{transform:translateX(-84px)}}
.blinkred{animation:blink 1.4s steps(1) infinite}
@keyframes blink{50%{opacity:.15}}
.puff{transform-box:fill-box;transform-origin:50% 100%;animation:puff 4s var(--gentle) infinite}
@keyframes puff{0%{transform:translateY(0) scale(.5);opacity:0}20%{opacity:.85}100%{transform:translateY(-60px) translateX(10px) scale(1.4);opacity:0}}
.cloud{animation:cloudDrift 90s var(--sine) infinite alternate}
@keyframes cloudDrift{to{transform:translateX(-120px)}}
.lens{transform-box:fill-box;transform-origin:50% 50%;animation:lens 3.2s var(--sine) infinite}
@keyframes lens{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-6px,4px) rotate(-6deg)}}
.tl-r,.tl-y,.tl-g{animation:tl 3.6s steps(1) infinite}
.tl-r{--on:0}.tl-y{--on:1;animation-delay:-1.2s}.tl-g{--on:2;animation-delay:-2.4s}
@keyframes tl{0%,33%{opacity:1}34%,100%{opacity:.18}}
.bulbglow{transform-box:fill-box;transform-origin:50% 50%;animation:glow 2.8s var(--sine) infinite}
@keyframes glow{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.8;transform:scale(1.18)}}
.node .ring{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.node.current .ring{opacity:1;animation:pulse 1.7s var(--sine) infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.2);opacity:.25}}
.node .num{font-family:Nunito,sans-serif;font-weight:900;font-size:30px;text-anchor:middle;fill:#fff;opacity:0;transition:opacity 300ms}
.node.passed .num{opacity:1}
.node .disc{transition:fill 360ms var(--gentle),stroke 360ms var(--gentle)}
.node .rim{transition:stroke 360ms var(--gentle)}
.node .shine{transition:opacity 300ms}
.node.passed .disc{fill:#3EC46F}.node.passed .rim{stroke:#2FA55C}
.node.current .disc{fill:#599DDF}.node.current .rim{stroke:#FFFFFF}
.node.passed .shine,.node.current .shine{opacity:0}
.node.passed .lock,.node.current .lock{opacity:0}
.badge .glowb{transform-box:fill-box;transform-origin:50% 50%;animation:glow 3s var(--sine) infinite}

/* ---------- \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0438 (\u0440\u0438\u0433 characters-tik-gluk) ---------- */
.char{--fd:4000ms;--fa:6px}
/* \u26A0 \u0413\u0435\u0440\u043E\u0438 \u041D\u0415 \u0446\u0435\u043B\u044C \u043D\u0430\u0436\u0430\u0442\u0438\u044F. \u0421\u043B\u043E\u0439 #chars \u043B\u0435\u0436\u0438\u0442 \u043F\u043E\u0432\u0435\u0440\u0445 \u0443\u0437\u043B\u043E\u0432, \u0438 \u0413\u043B\u044E\u043A, \u0441\u0442\u043E\u044F\u0449\u0438\u0439
   \u043D\u0430 \u043A\u0440\u0443\u0436\u043A\u0435 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0443\u0440\u043E\u043A\u0430, \u043F\u0435\u0440\u0435\u0445\u0432\u0430\u0442\u044B\u0432\u0430\u043B \u043D\u0430\u0436\u0430\u0442\u0438\u0435 \u0432 \u0441\u0430\u043C\u0443\u044E \u0435\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0443:
   \u0437\u0430\u043C\u0435\u0440\u0435\u043D\u043E 12.09 \u2014 elementFromPoint \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043A\u0440\u0443\u0433\u0430 \u043E\u0442\u0434\u0430\u0432\u0430\u043B path.blob, \u0436\u0438\u0432\u044B\u0445
   \u043E\u0441\u0442\u0430\u0432\u0430\u043B\u043E\u0441\u044C 40% \u043F\u043B\u043E\u0449\u0430\u0434\u0438. \u041D\u0430\u0436\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0430\u043C \u043A\u0440\u0443\u0436\u043E\u043A. */
#chars{pointer-events:none}
.c-float{animation:cfloat var(--fd) var(--sine) infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes cfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(-1 * var(--fa)))}}
.c-actor{transform-box:fill-box;transform-origin:50% 92%}
.c-shadow{animation:shad var(--fd) var(--sine) infinite;animation-delay:90ms;transform-box:fill-box;transform-origin:50% 50%}
@keyframes shad{0%,100%{transform:scale(1);opacity:.2}50%{transform:scale(.88);opacity:.12}}
.gluk .blob{animation:gooBreath 3.6s var(--sine) infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes gooBreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,.97)}}
.tik .scanline{animation:scan 5s linear infinite}
@keyframes scan{from{transform:translateY(-40px)}to{transform:translateY(140px)}}
.tik .led{animation:led 3.4s var(--sine) infinite}
@keyframes led{0%,100%{opacity:.35}50%{opacity:1}}
.tik .spinRing{transform-box:fill-box;transform-origin:50% 50%;animation:spin 1.6s cubic-bezier(.5,0,.5,1) infinite}
.feat{opacity:0;transform-box:fill-box;transform-origin:50% 50%;transition:opacity 110ms var(--in),transform 140ms var(--in)}
.eyes{transform:scaleY(.3)}.mouth{transform:scale(.6)}.extra{transform:scale(.5)}
.feat.on{opacity:1;transform:none;transition:opacity 160ms var(--out),transform 280ms var(--sig)}
.extra.on{transition-delay:90ms}
@media(prefers-reduced-motion:reduce){
  .gear,.belt,.boxes,.blinkred,.puff,.cloud,.lens,.tl-r,.tl-y,.tl-g,.bulbglow,.node .ring,.badge .glowb,.c-float,.c-shadow,.gluk .blob,.tik .scanline,.tik .led,.tik .spinRing,.bubble .w span{animation:none!important}
  .feat,.feat.on{transition:opacity 1ms!important;transform:none!important}
}
</style>

<div class="topbar">
  <div class="left">
    <div class="progress"><div class="bar"><i id="barFill"></i><span class="knob" id="barKnob"></span></div>
      <span class="finish"><svg viewBox="0 0 18 22" aria-hidden="true"><path d="M3,2 V21" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M4,3 h11 l-3,4 3,4 h-11 Z" fill="#7BE07A"/></svg><span class="pct" id="pct">0%</span></span></div>
  </div>
  <div class="topname" id="topname"></div>
  <div class="right"></div>
</div>

<div class="course" id="course">
  <svg id="map" viewBox="0 0 1648 1900" role="img" aria-label="\u041A\u0430\u0440\u0442\u0430 \u043A\u0443\u0440\u0441\u0430 \xAB\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B\xBB: \u0437\u043C\u0435\u0439\u043A\u0430 \u0438\u0437 26 \u0443\u0440\u043E\u043A\u043E\u0432">
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FC9EC"/><stop offset="1" stop-color="#74E3FC"/></linearGradient>
      <linearGradient id="gHill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5AA9F2"/><stop offset="1" stop-color="#3F86DE"/></linearGradient>
      <linearGradient id="gHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B7FD6"/><stop offset="1" stop-color="#2E63B8"/></linearGradient>
      <linearGradient id="gNode" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CBD6E4"/><stop offset="1" stop-color="#9FB0C6"/></linearGradient>
      <linearGradient id="gForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FB05F"/><stop offset="1" stop-color="#2E9452"/></linearGradient>
      <linearGradient id="gFactory" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3C74"/><stop offset="1" stop-color="#17224C"/></linearGradient>
      <radialGradient id="gLampGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>
      <linearGradient id="gBadge" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0%" stop-color="#FFB268"/><stop offset="52%" stop-color="#FE7A2A"/><stop offset="100%" stop-color="#E2521A"/></linearGradient>
      <radialGradient id="gBadgeGloss" cx="34%" cy="16%" r="72%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity=".72"/><stop offset="62%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
      <radialGradient id="gGlowT" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#6FD8FF" stop-opacity=".5"/><stop offset="60%" stop-color="#6FD8FF" stop-opacity=".12"/><stop offset="100%" stop-color="#6FD8FF" stop-opacity="0"/></radialGradient>
      <radialGradient id="gGlowG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFC48A" stop-opacity=".55"/><stop offset="60%" stop-color="#FFA860" stop-opacity=".14"/><stop offset="100%" stop-color="#FFA860" stop-opacity="0"/></radialGradient>
      <linearGradient id="gShell" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0%" stop-color="#FBFDF0"/><stop offset="55%" stop-color="#F0F3DE"/><stop offset="100%" stop-color="#DFE4C8"/></linearGradient>
      <linearGradient id="gPanel" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0%" stop-color="#D3D9EC"/><stop offset="100%" stop-color="#A9B3D0"/></linearGradient>
      <linearGradient id="gNavy" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#2A3C74"/><stop offset="100%" stop-color="#17224C"/></linearGradient>
      <linearGradient id="gScreen" x1=".1" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#22326B"/><stop offset="100%" stop-color="#141F47"/></linearGradient>
      <linearGradient id="gScan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6FD8FF" stop-opacity="0"/><stop offset="50%" stop-color="#6FD8FF" stop-opacity=".16"/><stop offset="100%" stop-color="#6FD8FF" stop-opacity="0"/></linearGradient>
      <radialGradient id="gGoo" cx="34%" cy="22%" r="86%"><stop offset="0%" stop-color="#FFC58F"/><stop offset="46%" stop-color="#FF9F5A"/><stop offset="100%" stop-color="#E2662A"/></radialGradient>
      <radialGradient id="gGooShine" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity=".72"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
      <radialGradient id="gBlush" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FF6B6B" stop-opacity=".55"/><stop offset="100%" stop-color="#FF6B6B" stop-opacity="0"/></radialGradient>
      <radialGradient id="gMouth" cx="50%" cy="30%" r="80%"><stop offset="0%" stop-color="#8E2F1E"/><stop offset="100%" stop-color="#5C1A0F"/></radialGradient>
      <clipPath id="cScreen"><rect x="112" y="126" width="176" height="132" rx="42"/></clipPath>
      <pattern id="pGrass" width="120" height="90" patternUnits="userSpaceOnUse"><path d="M10,60 l3,-12 l3,12 M56,30 l3,-12 l3,12 M96,74 l3,-12 l3,12" fill="none" stroke="#5FBF45" stroke-width="2.4" stroke-linecap="round"/><circle cx="80" cy="20" r="2.2" fill="#F6E27A"/><circle cx="30" cy="84" r="2" fill="#F8B4C8"/></pattern>
    </defs>
    <g id="header"></g>
    <g id="meadow"></g>
    <g id="road"></g>
    <g id="deco"></g>
    <g id="badge" class="badge"></g>
    <g id="nodes"></g>
    <g id="fx"></g>
    <g id="chars"></g>
  </svg>
  <div class="bubble" id="bubble" aria-live="polite"></div>
</div>

<!-- \u043F\u0430\u043D\u0435\u043B\u044C \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u0430 \u0441\u043D\u044F\u0442\u0430: \u044D\u0442\u043E \u0438\u043D\u0442\u0440\u043E \u0443\u0440\u043E\u043A\u0430, \u0430 \u043D\u0435 \u0441\u0442\u0435\u043D\u0434 -->

<script>
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const svg=$('#map'), INK='#17224C';
const NS='http://www.w3.org/2000/svg';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* \u042D\u0442\u0438 \u0434\u0432\u0435 \u0441\u0442\u0440\u043E\u043A\u0438 \u0443\u0440\u043E\u043A \u043F\u043E\u0434\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043F\u0440\u0438 \u0441\u0431\u043E\u0440\u043A\u0435 \u043A\u0430\u0434\u0440\u0430. */
const LESSON=Math.max(1,Math.min(26,parseInt('__LESSON__',10)||1));
const LANG='__LANG__';
let SPD=1; const D=ms=>reduce?1:Math.max(1,Math.round(ms/SPD)); const wait=ms=>new Promise(r=>setTimeout(r,D(ms)));
function html(parent,str){parent.insertAdjacentHTML('beforeend',str);return parent.lastElementChild;}
function rng(seed){let t=seed+0x6D2B79F5;return()=>{t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const f1=v=>(+v).toFixed(1);
const sw=(w=3,c=INK)=>\`stroke="\${c}" stroke-width="\${w}" stroke-linejoin="round" stroke-linecap="round"\`;
const EZ={back:'cubic-bezier(.175,.885,.32,1.275)',out:'cubic-bezier(.05,.7,.1,1)',expo:'cubic-bezier(.06,.9,.15,1)',gentle:'cubic-bezier(.4,0,.2,1)',sine:'cubic-bezier(.45,.05,.55,.95)',inout:'cubic-bezier(.65,0,.35,1)',accel:'cubic-bezier(.3,0,1,1)',md3:'cubic-bezier(.2,0,0,1)',backSoft:'cubic-bezier(.22,.75,.3,1.07)'};

/* =========================================================
   \u0420\u0410\u0421\u041A\u041B\u0410\u0414\u041A\u0410: 26 \u0443\u0440\u043E\u043A\u043E\u0432, \u0440\u044F\u0434\u044B 4-5-4-5-4-4, \u0437\u043C\u0435\u0439\u043A\u0430
   ========================================================= */
/* \u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0438\u044F \u0441\u043D\u044F\u0442\u0430 \u0441 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0430 (\u043A\u0430\u0434\u0440 1648\xD7720): \u0448\u0430\u0433 \u0443\u0437\u043B\u043E\u0432 182, \u0448\u0430\u0433 \u0440\u044F\u0434\u043E\u0432 232, \u0443\u0437\u043B\u044B \xB114 \u043F\u043E \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438 \xAB\u0432\u0440\u0430\u0437\u043D\u043E\u0431\u043E\u0439\xBB */
const W=1648, H=1900, ROWS=[4,5,4,5,4,4], Y0=372, STEP=232, SKY_H=300, NODE_R=50;
const XS5=[460,643,825,1008,1190], XS4=[553,735,917,1100];
const NODES=[];
ROWS.forEach((n,r)=>{const xs=(n===5?XS5:XS4).slice(); if(r%2)xs.reverse(); xs.forEach((x,i)=>NODES.push({x,y:Y0+r*STEP+(i%2?-14:0),row:r,i,first:i===0,last:i===n-1}));});
const N=NODES.length; // 26
const rowEndsRight=r=>r%2===0;
const LAST=NODES[N-1], BADGE={x:W/2,y:LAST.y+STEP+30}; // \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0447\u0430\u0441\u0442\u043E\u043A \u0434\u043E\u0440\u043E\u0433\u0438 \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u043F\u043E\u0434 \u0431\u0430\u043D\u043D\u0435\u0440\u043E\u043C \u0437\u043D\u0430\u0447\u043A\u0430

/* =========================================================
   \u0428\u0410\u041F\u041A\u0410: \u0441\u0446\u0435\u043D\u0430 \xAB\u0424\u0430\u0431\u0440\u0438\u043A\u0430 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432\xBB
   ========================================================= */
function buildHeader(){
  const g=$('#header'); let s='';
  s+=\`<rect x="0" y="0" width="\${W}" height="\${SKY_H+40}" fill="url(#gSky)"/>\`;
  // \u043E\u0431\u043B\u0430\u043A\u0430 \u2014 \u043F\u043B\u043E\u0441\u043A\u0438\u0435, \u043A\u0430\u043A \u0432 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0435
  const cl=(x,y,sc)=>\`<g class="cloud" style="animation-delay:\${(-x/20|0)}s"><g transform="translate(\${x},\${y}) scale(\${sc})" opacity=".85"><ellipse rx="70" ry="20" fill="#fff"/><ellipse cx="-44" cy="6" rx="36" ry="14" fill="#fff"/><ellipse cx="42" cy="4" rx="40" ry="16" fill="#fff"/><ellipse cx="6" cy="-12" rx="34" ry="17" fill="#fff"/></g></g>\`;
  s+=cl(930,70,1)+cl(1330,150,.8)+cl(240,120,.6)+cl(1520,60,.5);
  // \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0433\u043E\u0440\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0441\u043B\u0435\u0432\u0430 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 (\u0430\u043D\u0430\u043B\u043E\u0433 \u0424\u0443\u0434\u0437\u0438): \u0441\u0438\u043D\u044F\u044F, \u0441\u043E \u0441\u043D\u0435\u0436\u043D\u043E\u0439 \u0448\u0430\u043F\u043A\u043E\u0439-\xAB\u043A\u044D\u0448\u0435\u043C\xBB
  s+=\`<g transform="translate(60,0)"><path d="M100,\${SKY_H} C240,270 330,210 430,130 C470,96 500,74 550,64 C600,74 636,100 676,130 C790,220 880,262 1000,\${SKY_H} Z" fill="url(#gHill1)"/>
    <path d="M446,118 C476,100 508,80 550,64 C594,80 624,100 654,118 C642,128 630,122 618,132 C604,140 592,126 578,136 C564,146 550,130 536,140 C520,150 506,134 490,144 C476,152 462,136 446,118 Z" fill="#FFFFFF"/></g>\`;
  s+=\`<path d="M0,\${SKY_H} C100,258 220,244 330,256 C440,268 520,240 620,\${SKY_H} Z" fill="url(#gHill2)" opacity=".85"/>\`;
  s+=\`<path d="M760,\${SKY_H} C860,252 960,238 1060,250 C1160,262 1240,240 1340,\${SKY_H} Z" fill="url(#gHill2)" opacity=".85"/>\`;
  s+=\`<path d="M1300,\${SKY_H} C1400,256 1500,240 1580,252 C1620,258 1640,268 \${W},\${SKY_H} Z" fill="url(#gHill2)" opacity=".85"/>\`;
  // \u043F\u043E\u043B\u043E\u0441\u0430 \u043B\u0435\u0441\u0430
  let trees='';
  for(let x=-20;x<W+40;x+=46){const h=34+((x*7)%23), w=22;trees+=\`<path d="M\${x},\${SKY_H+6} L\${x+w/2},\${SKY_H-h} L\${x+w},\${SKY_H+6} Z" fill="url(#gForest)"/><circle cx="\${x+w/2}" cy="\${SKY_H-h*.45}" r="\${w*.55}" fill="url(#gForest)"/>\`;}
  s+=\`<g opacity=".95">\${trees}</g><rect x="0" y="\${SKY_H-4}" width="\${W}" height="30" fill="#2E9452"/>\`;
  // \u0444\u0430\u0431\u0440\u0438\u043A\u0430 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432 \u0441\u043B\u0435\u0432\u0430
  s+=\`<g transform="translate(120,104)">
    <rect x="0" y="60" width="250" height="150" rx="14" fill="url(#gFactory)"/>
    <rect x="30" y="0" width="70" height="80" rx="10" fill="url(#gFactory)"/><rect x="42" y="-30" width="22" height="40" rx="6" fill="#2A3C74"/>
    <g class="puff"><circle cx="53" cy="-38" r="12" fill="#E8EEF7"/></g><g class="puff" style="animation-delay:1.4s"><circle cx="58" cy="-40" r="9" fill="#F4F7FB"/></g><g class="puff" style="animation-delay:2.7s"><circle cx="48" cy="-36" r="8" fill="#DDE6F2"/></g>
    <rect x="130" y="20" width="110" height="60" rx="10" fill="#2A3C74"/>
    <path d="M185,20 V-30" stroke="#A9B3D0" stroke-width="4"/><circle class="blinkred" cx="185" cy="-34" r="6" fill="#FF5A5A"/>
    <circle cx="70" cy="135" r="38" fill="#0F1838"/><g class="gear" style="--gd:9s">\${gearSVG(70,135,30,10,'#6FD8FF')}</g>
    <circle cx="180" cy="120" r="30" fill="#0F1838"/><g class="gear ccw" style="--gd:7s">\${gearSVG(180,120,22,8,'#FFD75E')}</g>
    <rect x="130" y="160" width="60" height="50" rx="6" fill="#0F1838"/><rect x="138" y="168" width="44" height="34" rx="4" fill="#3FC5F0" opacity=".9"/><path d="M146,178 h12 M146,188 h26 M164,178 h10" stroke="#17224C" stroke-width="3" stroke-linecap="round"/>
    <rect x="205" y="150" width="34" height="60" rx="8" fill="#2A3C74"/><rect x="214" y="160" width="16" height="22" rx="4" fill="#FFD75E" opacity=".9"/>
  </g>\`;
  // \u043A\u043E\u043D\u0432\u0435\u0439\u0435\u0440 \u0432\u044B\u0435\u0437\u0436\u0430\u0435\u0442 \u0438\u0437 \u0444\u0430\u0431\u0440\u0438\u043A\u0438 \u043A \u0434\u043E\u0440\u043E\u0433\u0435
  s+=\`<g transform="translate(370,\${SKY_H-26})"><rect x="0" y="0" width="260" height="22" rx="11" fill="#2A3C74"/><path d="M12,11 H248" stroke="#8FA0C4" stroke-width="4" stroke-dasharray="18 18" class="belt"/><circle cx="14" cy="11" r="7" fill="#A9B3D0"/><circle cx="246" cy="11" r="7" fill="#A9B3D0"/>
    <clipPath id="cpHead"><rect x="-4" y="-40" width="268" height="44"/></clipPath><g clip-path="url(#cpHead)"><g class="boxes">\${[0,1,2,3,4].map(i=>\`<g transform="translate(\${20+i*84},-26)"><rect width="42" height="30" rx="6" fill="\${['#FF9F5A','#3FC5F0','#31B88A','#FFD75E','#B98CFF'][i]}" \${sw(2.5)}/><path d="M8,15 h26" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></g>\`).join('')}</g></g></g>\`;
  // \u041D\u0410\u0417\u0412\u0410\u041D\u0418\u0415 \u0422\u0415\u041C\u042B. \u041E\u043D\u043E \u0441\u0442\u043E\u0438\u0442 \u043F\u043E \u0446\u0435\u043D\u0442\u0440\u0443 \u0445\u043E\u043B\u0441\u0442\u0430 1648px. \u041D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u0432\u0438\u0434\u0438\u0442
  // \u043E\u043A\u043D\u043E 390px, \u043A\u0430\u0440\u0442\u0430 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0430 \u043D\u0430 \u0435\u0433\u043E \u043A\u0440\u0443\u0436\u043E\u043A \u2014 \u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0434\u0430\u043B\u0435\u043A\u043E
  // \u0441\u043F\u0440\u0430\u0432\u0430, \u0441\u0440\u0435\u0437\u0430\u043D\u043D\u044B\u043C (\u0437\u0430\u043C\u0435\u0440 17.09 \u043D\u0430 390x844: \u043F\u0440\u0430\u0432\u044B\u0439 \u043A\u0440\u0430\u0439 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u043D\u0430 451px).
  // \u041F\u043E\u044D\u0442\u043E\u043C\u0443 \u043D\u0430 \u0443\u0437\u043A\u0438\u0445 \u044D\u043A\u0440\u0430\u043D\u0430\u0445 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u044F\u0447\u0435\u0442\u0441\u044F \u043E\u0442\u0441\u044E\u0434\u0430 \u0438 \u043F\u0435\u0447\u0430\u0442\u0430\u0435\u0442\u0441\u044F \u0432 \u0432\u0435\u0440\u0445\u043D\u0435\u0439
  // \u043F\u043E\u043B\u043E\u0441\u0435, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0442\u044F\u043D\u0435\u0442\u0441\u044F \u043F\u043E \u0448\u0438\u0440\u0438\u043D\u0435 \u043E\u043A\u043D\u0430. \u041D\u0430 \u0448\u0438\u0440\u043E\u043A\u0438\u0445 \u0432\u0441\u0451 \u043A\u0430\u043A \u0431\u044B\u043B\u043E.
  const tn=document.getElementById('topname'); if(tn) tn.textContent=T(['\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B','Algoritmlar','Algorithms']);
  s+=\`<text class="mapname" x="\${W/2}" y="168" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="58" fill="#fff" style="filter:drop-shadow(0 3px 0 rgba(23,34,76,.22))">\${T(['\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B','Algoritmlar','Algorithms'])}</text>\`;
  html(g,s);
}
function gearSVG(cx,cy,r,teeth,fill){
  let d=''; const ro=r, ri=r*.78;
  for(let i=0;i<teeth;i++){const a0=i/teeth*Math.PI*2,a1=a0+Math.PI/teeth*.9,a2=a0+Math.PI/teeth,a3=a0+Math.PI/teeth*1.9;
    d+=(i?'L':'M')+f1(cx+Math.cos(a0)*ro)+','+f1(cy+Math.sin(a0)*ro)+' L'+f1(cx+Math.cos(a1)*ro)+','+f1(cy+Math.sin(a1)*ro)+' L'+f1(cx+Math.cos(a2)*ri)+','+f1(cy+Math.sin(a2)*ri)+' L'+f1(cx+Math.cos(a3)*ri)+','+f1(cy+Math.sin(a3)*ri)+' ';}
  return \`<path d="\${d}Z" fill="\${fill}" \${sw(2.5)}/><circle cx="\${cx}" cy="\${cy}" r="\${r*.32}" fill="#0F1838" stroke="\${INK}" stroke-width="2.5"/>\`;
}

/* =========================================================
   \u041B\u0423\u0413
   ========================================================= */
function buildMeadow(){
  const g=$('#meadow'), r=rng(7); const top=SKY_H+10;
  let s=\`<rect x="0" y="\${top}" width="\${W}" height="\${H-top}" fill="#6CDC69"/>\`;
  // \u0432\u043E\u043B\u043D\u0438\u0441\u0442\u044B\u0439 \u043A\u0440\u0430\u0439 \u043B\u0443\u0433\u0430 \u043F\u043E\u0432\u0435\u0440\u0445 \u043B\u0435\u0441\u0430
  s+=\`<path d="M0,\${top+4} C160,\${top-14} 330,\${top+16} 520,\${top-2} C700,\${top-18} 880,\${top+14} 1060,\${top-4} C1240,\${top-20} 1440,\${top+12} \${W},\${top-6} L\${W},\${top+40} L0,\${top+40} Z" fill="#6CDC69"/>\`;
  // \u043F\u044F\u0442\u043D\u0430 \u0442\u0440\u0430\u0432\u044B \u043F\u043E\u0442\u0435\u043C\u043D\u0435\u0435 \u0438 \u043F\u0443\u0447\u043A\u0438 \u2014 \u0440\u0435\u0434\u043A\u0438\u0435, \u043A\u0430\u043A \u0432 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0435
  for(let i=0;i<14;i++){const x=r()*W,y=top+60+r()*(H-top-160),rx=90+r()*140,ry=24+r()*26;s+=\`<ellipse cx="\${x.toFixed(0)}" cy="\${y.toFixed(0)}" rx="\${rx.toFixed(0)}" ry="\${ry.toFixed(0)}" fill="#66D463" opacity=".8"/>\`;}
  for(let i=0;i<70;i++){const x=r()*W,y=top+50+r()*(H-top-120),sc=.8+r()*.7;s+=\`<g transform="translate(\${x.toFixed(0)},\${y.toFixed(0)}) scale(\${sc.toFixed(2)})"><path d="M-8,0 l4,-14 M0,0 l0,-18 M8,0 l-4,-14" fill="none" stroke="#4FBF53" stroke-width="3" stroke-linecap="round"/></g>\`;}
  for(let i=0;i<22;i++){const x=r()*W,y=top+50+r()*(H-top-120);s+=\`<circle cx="\${x.toFixed(0)}" cy="\${y.toFixed(0)}" r="3" fill="#7EE87C"/>\`;}
  html(g,s);
}

/* =========================================================
   \u0414\u041E\u0420\u041E\u0413\u0410-\u0417\u041C\u0415\u0419\u041A\u0410
   ========================================================= */
const SEGS=[]; const TURN_OUT=72; // \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0442\u043B\u044F \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u0430 \u0432\u044B\u0441\u0442\u0443\u043F\u0430\u0435\u0442 \u0437\u0430 \u043A\u0440\u0430\u0439\u043D\u0438\u0439 \u0443\u0437\u0435\u043B
/* \u043A\u0440\u0430\u0439\u043D\u044F\u044F \u0442\u043E\u0447\u043A\u0430 \u043F\u0435\u0442\u043B\u0438 \u043C\u0435\u0436\u0434\u0443 \u0440\u044F\u0434\u0430\u043C\u0438 r \u0438 r+1 */
function turnApex(r){const P=NODES.find(n=>n.row===r&&n.last),Q=NODES.find(n=>n.row===r+1&&n.first);const side=rowEndsRight(r)?1:-1;const E=(side>0?Math.max(P.x,Q.x):Math.min(P.x,Q.x))+side*TURN_OUT;return {P,Q,side,E,cx:(E-.125*(P.x+Q.x))/.75,y:(P.y+Q.y)/2};}
function segD(i){
  const a=NODES[i], b=NODES[i+1];
  if(a.row===b.row){const w=(i%2?1:-1)*10;return \`M\${a.x},\${a.y} C\${a.x+(b.x-a.x)/3},\${a.y+w} \${a.x+(b.x-a.x)*2/3},\${b.y-w} \${b.x},\${b.y}\`;}
  const t=turnApex(a.row);
  return \`M\${a.x},\${a.y} C\${f1(t.cx)},\${a.y+6} \${f1(t.cx)},\${b.y-6} \${b.x},\${b.y}\`;
}
/* \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0447\u0430\u0441\u0442\u043E\u043A: \u043E\u0442 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0443\u0437\u043B\u0430 \u043F\u0435\u0442\u043B\u044F \u0432\u043B\u0435\u0432\u043E \u0438 \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C \u043F\u043E\u0434 \u0431\u0430\u043D\u043D\u0435\u0440\u043E\u043C \u0437\u043D\u0430\u0447\u043A\u0430 */
function finalD(){const a=LAST,side=-1,E=a.x+side*TURN_OUT,cx=(E-.125*(a.x+a.x))/.75,y=BADGE.y;return \`M\${a.x},\${a.y} C\${f1(cx)},\${a.y+6} \${f1(cx)},\${y-6} \${a.x},\${y} L\${BADGE.x+420},\${y}\`;}
function buildRoad(){
  const g=$('#road'); let d=\`M\${NODES[0].x-90},\${NODES[0].y} L\${NODES[0].x},\${NODES[0].y} \`;
  for(let i=0;i<N-1;i++)d+=segD(i)+' ';
  d+=finalD();
  html(g,\`<path d="\${d}" fill="none" stroke="#7CE070" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>\`);
  html(g,\`<path d="\${d}" fill="none" stroke="#8AE97D" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>\`);
  const hid=html(g,\`<g visibility="hidden"></g>\`);
  for(let i=0;i<N-1;i++)SEGS[i]=html(hid,\`<path d="\${segD(i)}" fill="none"/>\`);
}

/* =========================================================
   \u041F\u0420\u0415\u0414\u041C\u0415\u0422\u042B \u0422\u0415\u041C\u042B \xAB\u0410\u041B\u0413\u041E\u0420\u0418\u0422\u041C\xBB (\u0431\u0435\u0437 \u0431\u0443\u043A\u0432 \u0438 \u0446\u0438\u0444\u0440)
   ========================================================= */
const shadowE=(rx,ry=rx*.36)=>\`<ellipse cy="6" rx="\${rx}" ry="\${ry}" fill="\${INK}" opacity=".16"/>\`;
const OBJ={
  gears:()=>\`\${shadowE(64)}<g class="gear" style="--gd:14s">\${gearSVG(-26,-30,34,9,'#FF9F5A')}</g><g class="gear ccw" style="--gd:10s">\${gearSVG(30,-12,26,8,'#3FC5F0')}</g><g class="gear" style="--gd:8s">\${gearSVG(-4,26,18,7,'#FFD75E')}</g>\`,
  flow:()=>\`\${shadowE(70,20)}<g \${sw(3)}><rect x="-84" y="-70" width="60" height="30" rx="15" fill="#31B88A"/><rect x="-30" y="-70" width="60" height="30" rx="7" fill="#3FC5F0"/><path d="M62,-70 L92,-55 L62,-40 L32,-55 Z" fill="#FFD75E"/><rect x="-30" y="-16" width="60" height="30" rx="7" fill="#B98CFF"/><rect x="34" y="-16" width="60" height="30" rx="15" fill="#FF9F5A"/></g>
    <g fill="none" stroke="\${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M-24,-55 H-30 M30,-55 H32 M62,-40 V-16 M-2,-40 V-16"/><path d="M-6,-24 l4,8 l4,-8 M58,-24 l4,8 l4,-8"/></g>\`,
  arm:()=>\`\${shadowE(56,18)}<rect x="-52" y="-12" width="104" height="22" rx="8" fill="#2A3C74" \${sw(3)}/><rect x="-18" y="-46" width="36" height="40" rx="8" fill="#A9B3D0" \${sw(3)}/><circle cx="0" cy="-46" r="12" fill="#FF9F5A" \${sw(3)}/><path d="M0,-46 L40,-92" stroke="\${INK}" stroke-width="16" stroke-linecap="round"/><path d="M0,-46 L40,-92" stroke="#A9B3D0" stroke-width="10" stroke-linecap="round"/><circle cx="40" cy="-92" r="10" fill="#FF9F5A" \${sw(3)}/><path d="M40,-92 L78,-70" stroke="\${INK}" stroke-width="14" stroke-linecap="round"/><path d="M40,-92 L78,-70" stroke="#A9B3D0" stroke-width="8" stroke-linecap="round"/><path d="M78,-70 l-8,18 M78,-70 l12,14" stroke="\${INK}" stroke-width="7" stroke-linecap="round"/><rect x="66" y="-56" width="30" height="30" rx="6" fill="#3FC5F0" \${sw(3)}/>\`,
  conveyor:()=>\`\${shadowE(84,16)}<rect x="-84" y="-14" width="168" height="24" rx="12" fill="#2A3C74" \${sw(3)}/><path d="M-70,-2 H70" stroke="#8FA0C4" stroke-width="4" stroke-dasharray="18 18" class="belt"/><circle cx="-70" cy="-2" r="7" fill="#A9B3D0"/><circle cx="70" cy="-2" r="7" fill="#A9B3D0"/><clipPath id="cpBelt"><rect x="-80" y="-60" width="160" height="50"/></clipPath><g clip-path="url(#cpBelt)"><g class="boxes">\${[0,1,2,3].map(i=>\`<g transform="translate(\${-70+i*84},-44)"><rect width="40" height="30" rx="6" fill="\${['#FF9F5A','#31B88A','#FFD75E','#3FC5F0'][i]}" \${sw(2.5)}/></g>\`).join('')}</g></g><path d="M-60,10 V26 M60,10 V26" stroke="\${INK}" stroke-width="6" stroke-linecap="round"/>\`,
  sign:()=>\`\${shadowE(28,10)}<path d="M0,10 V-96" stroke="#8C5A34" stroke-width="10" stroke-linecap="round"/><path d="M0,10 V-96" stroke="#B8794A" stroke-width="5" stroke-linecap="round"/>
    <g \${sw(3)}><path d="M-4,-96 H46 L62,-82 L46,-68 H-4 Z" fill="#FF9F5A"/><path d="M4,-62 H-46 L-62,-48 L-46,-34 H4 Z" fill="#3FC5F0"/><path d="M-4,-28 H46 L62,-14 L46,0 H-4 Z" fill="#31B88A"/></g>
    <g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M10,-82 H34 M26,-90 l8,8 l-8,8"/><path d="M-10,-48 H-34 M-26,-56 l-8,8 l8,8"/><path d="M14,-14 a12,12 0 1 1 12,12 M26,-2 l-6,-5 M26,-2 l6,-5"/></g>\`,
  bug:()=>\`\${shadowE(46)}<g transform="translate(-10,-6)"><ellipse rx="26" ry="20" fill="#E5442E" \${sw(3)}/><path d="M0,-20 V20" stroke="\${INK}" stroke-width="3"/><circle cx="-11" cy="-6" r="4" fill="\${INK}"/><circle cx="11" cy="-6" r="4" fill="\${INK}"/><circle cx="-9" cy="8" r="3.5" fill="\${INK}"/><circle cx="10" cy="9" r="3.5" fill="\${INK}"/><circle cx="0" cy="-20" r="9" fill="\${INK}"/><path d="M-6,-26 l-8,-10 M6,-26 l8,-10" stroke="\${INK}" stroke-width="3" stroke-linecap="round"/></g>
    <g class="lens"><circle cx="8" cy="-14" r="40" fill="#BFE6F8" fill-opacity=".45" stroke="\${INK}" stroke-width="7"/><circle cx="8" cy="-14" r="40" fill="none" stroke="#3FC5F0" stroke-width="3"/><path d="M36,14 L66,44" stroke="\${INK}" stroke-width="16" stroke-linecap="round"/><path d="M36,14 L66,44" stroke="#FF9F5A" stroke-width="9" stroke-linecap="round"/></g>\`,
  loop:()=>\`\${shadowE(50)}<path d="M-40,-30 A46,46 0 1 1 40,-30" fill="none" stroke="\${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-40,-30 A46,46 0 1 1 40,-30" fill="none" stroke="#B98CFF" stroke-width="12" stroke-linecap="round"/><path d="M40,-30 l-18,-14 M40,-30 l4,-22" stroke="\${INK}" stroke-width="10" stroke-linecap="round"/><path d="M40,-30 l-18,-14 M40,-30 l4,-22" stroke="#B98CFF" stroke-width="4" stroke-linecap="round"/><path d="M-12,-56 L14,-40 L-12,-24 Z" fill="#FFD75E" \${sw(3)}/>\`,
  blocks:()=>\`\${shadowE(60,16)}<g \${sw(3)}>\${[['#FF9F5A',0],['#3FC5F0',1],['#31B88A',2],['#FFD75E',3]].map(([c,i])=>\`<path d="M-56,\${-22-i*26} h20 a8,8 0 0 1 16,0 h68 a6,6 0 0 1 6,6 v14 a6,6 0 0 1 -6,6 h-68 a8,8 0 0 1 -16,0 h-20 a6,6 0 0 1 -6,-6 v-14 a6,6 0 0 1 6,-6 Z" fill="\${c}"/>\`).join('')}</g><g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M-38,-91 h30 M-38,-65 h18 M-38,-39 h34 M-38,-13 h22"/><path d="M8,-96 l6,6 l-6,6 M6,-70 a5,5 0 1 1 0,10 M10,-44 l-6,6 l6,6"/></g>\`,
  traffic:()=>\`\${shadowE(30,10)}<path d="M0,8 V40" stroke="\${INK}" stroke-width="10" stroke-linecap="round"/><rect x="-26" y="-112" width="52" height="124" rx="16" fill="#2A3C74" \${sw(3)}/><circle class="tl-r" cx="0" cy="-86" r="15" fill="#FF5A5A"/><circle class="tl-y" cx="0" cy="-50" r="15" fill="#FFD75E"/><circle class="tl-g" cx="0" cy="-14" r="15" fill="#31B88A"/>\`,
  swing:()=>{ // \u043A\u0430\u0447\u0435\u043B\u0438-\u0441\u043A\u0430\u043C\u0435\u0439\u043A\u0430 \u043F\u043E\u0434 \u043F\u0435\u0440\u0433\u043E\u043B\u043E\u0439 \u0441 \u0444\u043E\u043D\u0430\u0440\u0438\u043A\u043E\u043C, \u043A\u0443\u0441\u0442\u044B \u0438 \u0442\u0440\u0430\u0432\u0430 (\u043F\u043E \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0443)
    const wood='#C9905A', woodD='#8C5A34', woodL='#E2B27C', stone='#B9C2CF', stoneD='#8E99A8', leaf='#3FB05F', leafD='#2E9452';
    const post=(x)=>\`<rect x="\${x-14}" y="-30" width="28" height="34" rx="4" fill="\${stone}" \${sw(3)}/><path d="M\${x-8},-24 h16 M\${x-8},-14 h16" stroke="\${stoneD}" stroke-width="3" stroke-linecap="round"/><rect x="\${x-9}" y="-132" width="18" height="104" rx="3" fill="\${wood}" \${sw(3)}/><path d="M\${x-3},-126 V-34" stroke="\${woodL}" stroke-width="3" stroke-linecap="round" opacity=".8"/>\`;
    const block=(x)=>\`<rect x="\${x-14}" y="-160" width="28" height="28" rx="4" fill="\${wood}" \${sw(3)}/><rect x="\${x-7}" y="-153" width="14" height="14" rx="2" fill="none" stroke="\${woodD}" stroke-width="3"/>\`;
    const bush=(x,y,s)=>\`<g transform="translate(\${x},\${y}) scale(\${s})"><circle cx="-16" cy="-6" r="18" fill="\${leafD}"/><circle cx="14" cy="-4" r="20" fill="\${leaf}"/><circle cx="-2" cy="-20" r="17" fill="\${leaf}"/><circle cx="4" cy="4" r="16" fill="\${leafD}"/></g>\`;
    const tuft=(x,y,s)=>\`<g transform="translate(\${x},\${y}) scale(\${s})"><path d="M-12,0 l5,-22 M-4,0 l2,-28 M5,0 l4,-24 M12,0 l8,-18" fill="none" stroke="#5FCB5E" stroke-width="4" stroke-linecap="round"/></g>\`;
    return \`\${shadowE(100,22)}<ellipse cy="2" rx="96" ry="20" fill="#5FCB5E" opacity=".55"/>
      <ellipse cx="0" cy="8" rx="30" ry="9" fill="#D9B77A" opacity=".8"/><ellipse cx="0" cy="8" rx="18" ry="5" fill="#C39B5C" opacity=".8"/>
      \${bush(-96,-6,1)}\${bush(96,-2,1.05)}
      \${post(-70)}\${post(70)}
      <rect x="-92" y="-132" width="184" height="16" rx="4" fill="\${wood}" \${sw(3)}/><path d="M-84,-124 h168" stroke="\${woodL}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      <path d="M-60,-116 l14,14 M60,-116 l-14,14" stroke="\${woodD}" stroke-width="7" stroke-linecap="round"/>
      \${block(-56)}\${block(0)}\${block(56)}
      <path d="M-40,-116 V-52 M40,-116 V-52" stroke="\${stoneD}" stroke-width="3.5" stroke-dasharray="4 5" stroke-linecap="round"/>
      <path d="M0,-116 V-98" stroke="\${INK}" stroke-width="3" stroke-linecap="round"/><circle class="bulbglow" cx="0" cy="-84" r="34" fill="url(#gLampGlow)"/>
      <rect x="-9" y="-98" width="18" height="24" rx="4" fill="#FFB84D" \${sw(3)}/><rect x="-5" y="-93" width="10" height="14" rx="2" fill="#FFF3B0"/><rect x="-6" y="-101" width="12" height="5" rx="2" fill="\${INK}"/>
      <g \${sw(3)}><rect x="-52" y="-52" width="104" height="14" rx="4" fill="\${wood}"/><rect x="-50" y="-84" width="100" height="34" rx="5" fill="\${woodL}"/><path d="M-30,-82 V-52 M-10,-82 V-52 M10,-82 V-52 M30,-82 V-52" stroke="\${woodD}" stroke-width="3" stroke-linecap="round"/><rect x="-56" y="-42" width="112" height="10" rx="4" fill="\${woodD}"/></g>
      \${tuft(-120,10,1)}\${tuft(-40,14,.8)}\${tuft(44,16,.9)}\${tuft(122,8,1.1)}\`;
  },
  post:()=>{ // \u0441\u0442\u043E\u043B\u0431-\u0443\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C \u0441 \u043F\u044F\u0442\u044C\u044E \u0446\u0432\u0435\u0442\u043D\u044B\u043C\u0438 \u0441\u0442\u0440\u0435\u043B\u043A\u0430\u043C\u0438 (\u043F\u043E \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0443)
    const pole='#E8A98B', poleD='#C98567';
    const plank=(y,c,dark,dir)=>{ // dir: 1 \u2192 \u0441\u0442\u0440\u0435\u043B\u043A\u0430 \u0432\u043F\u0440\u0430\u0432\u043E, -1 \u2192 \u0432\u043B\u0435\u0432\u043E
      const W=150,h=32,x0=-W/2+ (dir>0?-6:6), notch=14;
      const d=dir>0
        ?\`M\${x0},\${y-h/2} H\${x0+W-notch} L\${x0+W},\${y} L\${x0+W-notch},\${y+h/2} H\${x0} L\${x0+notch},\${y} Z\`
        :\`M\${x0+W},\${y-h/2} H\${x0+notch} L\${x0},\${y} L\${x0+notch},\${y+h/2} H\${x0+W} L\${x0+W-notch},\${y} Z\`;
      return \`<path d="\${d}" fill="\${c}" \${sw(3)}/><path d="\${d}" fill="none" stroke="\${dark}" stroke-width="3" transform="translate(0,4)" clip-path="none" opacity=".35"/><circle cy="\${y}" r="4" fill="#fff" stroke="\${INK}" stroke-width="2"/>\`;
    };
    return \`\${shadowE(52,12)}<rect x="-7" y="-212" width="14" height="218" rx="7" fill="\${pole}" \${sw(3)}/><path d="M-2,-206 V-4" stroke="#F5C6AE" stroke-width="3" stroke-linecap="round" opacity=".9"/><path d="M4,-206 V-4" stroke="\${poleD}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
      \${plank(-190,'#7B6FE8','#5B4FC8',1)}\${plank(-150,'#F5C96A','#D9A64A',-1)}\${plank(-110,'#57D693','#38B577',1)}\${plank(-70,'#F27A85','#D25764',-1)}\${plank(-30,'#5CB8F0','#3D97D0',1)}\`;
  },
  toys:()=>{ // \u0434\u0435\u0442\u0441\u043A\u0438\u0435 \u043A\u0443\u0431\u0438\u043A\u0438-\u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440: \u0431\u0430\u0448\u043D\u0438 \u0441 \u043A\u0440\u044B\u0448\u0430\u043C\u0438, \u0430\u0440\u043A\u0430, \u0446\u0438\u043B\u0438\u043D\u0434\u0440\u044B (\u043F\u043E \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0443)
    const R='#F0473F',Y='#FFD23F',B='#3E7BE0',G='#3DBB6A',O='#F58A2E';
    const box=(x,y,w,h,c)=>\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}" rx="5" fill="\${c}" \${sw(3)}/><path d="M\${x+6},\${y+6} h\${w-12}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>\`;
    const roof=(x,y,w,h,c)=>\`<path d="M\${x-4},\${y} L\${x+w/2},\${y-h} L\${x+w+4},\${y} Z" fill="\${c}" \${sw(3)}/>\`;
    const cyl=(x,y,w,h,c)=>\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}" rx="\${w/2}" fill="\${c}" \${sw(3)}/><path d="M\${x+w*.3},\${y+10} V\${y+h-10}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>\`;
    const arch=(x,y,w,h,c)=>\`<path d="M\${x},\${y+h} V\${y+8} a8,8 0 0 1 8,-8 H\${x+w-8} a8,8 0 0 1 8,8 V\${y+h} H\${x+w-14} V\${y+h-16} a\${w/2-14},\${w/2-14} 0 0 0 \${-(w-28)},0 V\${y+h} Z" fill="\${c}" \${sw(3)}/>\`;
    return \`\${shadowE(110,20)}
      <!-- \u043B\u0435\u0432\u0430\u044F \u0431\u0430\u0448\u043D\u044F: \u043F\u043B\u0438\u0442\u0430, \u0437\u0435\u043B\u0451\u043D\u044B\u0439 \u0438 \u0436\u0451\u043B\u0442\u044B\u0439 \u043A\u0443\u0431\u044B, \u043A\u0440\u0430\u0441\u043D\u0430\u044F \u043A\u0440\u044B\u0448\u0430 -->
      \${box(-116,-22,80,22,R)}\${box(-104,-64,52,44,G)}\${box(-104,-106,52,44,Y)}\${roof(-104,-106,52,36,R)}
      <!-- \u0430\u0440\u043A\u0430 \u0441 \u0431\u0430\u0448\u0435\u043D\u043A\u043E\u0439 -->
      \${cyl(-44,-84,30,84,G)}\${box(-16,-60,30,30,O)}\${arch(-52,-116,96,40,R)}\${box(-30,-158,52,44,B)}\${roof(-30,-158,52,36,Y)}
      <!-- \u043F\u0440\u0430\u0432\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430: \u0436\u0451\u043B\u0442\u044B\u0439 \u0446\u0438\u043B\u0438\u043D\u0434\u0440, \u0430\u0440\u043A\u0430, \u0441\u0438\u043D\u0438\u0439 \u043A\u0443\u0431 \u0441 \u043A\u043E\u043D\u0443\u0441\u043E\u043C -->
      \${cyl(58,-92,38,92,Y)}\${cyl(104,-70,32,70,G)}\${arch(52,-134,92,44,R)}\${box(74,-176,48,44,B)}<path d="M74,-176 L98,-224 L122,-176 Z" fill="\${Y}" \${sw(3)}/>
      <!-- \u0434\u043E\u043C\u0438\u043A \u0441\u043F\u0435\u0440\u0435\u0434\u0438 \u0441\u043F\u0440\u0430\u0432\u0430 -->
      \${box(96,-16,86,20,B)}\${box(112,-58,54,44,Y)}\${roof(112,-58,54,34,R)}\`;
  },
  bulb:()=>\`\${shadowE(34)}<circle class="bulbglow" cx="0" cy="-58" r="54" fill="url(#gLampGlow)"/><circle cx="0" cy="-58" r="34" fill="#FFE58A" \${sw(3)}/><path d="M-12,-30 h24 v10 a12,12 0 0 1 -24,0 Z" fill="#A9B3D0" \${sw(3)}/><path d="M-10,-40 l6,-16 l8,16" fill="none" stroke="#FF9F5A" stroke-width="4" stroke-linecap="round"/><g class="gear" style="--gd:11s">\${gearSVG(0,-58,13,7,'#FF9F5A')}</g>\`,
};
function buildDeco(){
  const g=$('#deco'); const put=(k,x,y,sc=1)=>html(g,\`<g transform="translate(\${x},\${y}) scale(\${sc})">\${OBJ[k]()}</g>\`);
  // \u043E\u0434\u0438\u043D \u043A\u0440\u0443\u043F\u043D\u044B\u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u0443 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u0430, \u0441\u043D\u0430\u0440\u0443\u0436\u0438 \u043F\u0435\u0442\u043B\u0438 \u2014 \u043A\u0430\u043A \u0432 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u0435
  const TURN_OBJ=['swing','arm','conveyor','post','bug'];
  for(let r=0;r<ROWS.length-1;r++){
    const t=turnApex(r); const x=t.E+t.side*118, y=t.y+44;
    put(TURN_OBJ[r],x,y,1.3);
  }
  // \u043D\u0430\u0447\u0430\u043B\u043E \u0434\u043E\u0440\u043E\u0433\u0438 \u0438 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u0432\u043E\u0440\u043E\u0442 \u043A \u0437\u043D\u0430\u0447\u043A\u0443
  put('gears',NODES[0].x-230,NODES[0].y+40,1.15);
  put('toys',LAST.x-TURN_OUT-200,(LAST.y+BADGE.y)/2+80,1.05);
}

/* =========================================================
   \u0423\u0417\u041B\u042B \u0423\u0420\u041E\u041A\u041E\u0412
   ========================================================= */
const nodeEls=[];
function buildNodes(){
  const g=$('#nodes');
  NODES.forEach((n,i)=>{
    nodeEls[i]=html(g,\`<g class="node locked" style="transform:translate(\${n.x}px,\${n.y}px)">
      <ellipse cy="\${NODE_R+6}" rx="\${NODE_R-4}" ry="10" fill="#2E9452" opacity=".28"/>
      <circle class="ring" r="\${NODE_R+10}" fill="none" stroke="#fff" stroke-width="5"/>
      <circle class="rim" r="\${NODE_R}" fill="none" stroke="#A3B6C9" stroke-width="6"/>
      <circle class="disc" r="\${NODE_R-3}" fill="url(#gNode)"/>
      <path class="shine" d="M-30,-22 A38,38 0 0 1 30,-22" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      <g class="lock"><rect x="-16" y="-8" width="32" height="27" rx="7" fill="#5F7185"/><path d="M-9,-8 V-17 a9,9 0 0 1 18,0 V-8" fill="none" stroke="#5F7185" stroke-width="6" stroke-linecap="round"/><circle cy="3" r="4" fill="#C4D1E0"/><rect x="-2" y="3" width="4" height="9" rx="2" fill="#C4D1E0"/></g>
      <text class="num" y="11">\${i+1}</text>
    </g>\`);
  });
}
function setNode(i,st){const e=nodeEls[i];e.classList.remove('locked','current','passed');e.classList.add(st);}

/* ---------- \u0437\u043D\u0430\u0447\u043E\u043A \u043A\u0443\u0440\u0441\u0430 \u0432\u043D\u0438\u0437\u0443 ---------- */
function buildBadge(){
  const g=$('#badge');
  // \u0411\u0430\u043D\u043D\u0435\u0440 \u0441\u0438\u0434\u0438\u0442 \u043D\u0430 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u043C \u0443\u0447\u0430\u0441\u0442\u043A\u0435 \u0434\u043E\u0440\u043E\u0433\u0438; \u043D\u0430\u0434 \u043D\u0438\u043C \u0432\u044B\u0433\u043B\u044F\u0434\u044B\u0432\u0430\u0435\u0442 \u043A\u0440\u0443\u0433\u043B\u044B\u0439
  // \u0437\u043D\u0430\u0447\u043E\u043A \u043A\u0443\u0440\u0441\u0430 \u2014 \u0442\u043E\u0442 \u0441\u0430\u043C\u044B\u0439, \u0447\u0442\u043E \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435: \u0434\u0432\u043E\u0439\u043D\u043E\u0439
  // \u043E\u0431\u043E\u0434\u043E\u043A (\u0431\u0435\u043B\u044B\u0439 \u043F\u043E \u0442\u0451\u043C\u043D\u043E\u043C\u0443), \u0433\u043B\u044F\u043D\u0435\u0446 \u0441\u0432\u0435\u0440\u0445\u0443 \u0438 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u044B\u0435 \u043B\u0443\u0447\u0438 \u043F\u043E\u0437\u0430\u0434\u0438.
  // \u0428\u0435\u0441\u0442\u0435\u0440\u0451\u043D\u043A\u0430 \u0432\u043D\u0443\u0442\u0440\u0438 \u2014 \u0437\u043D\u0430\u043A \u043A\u0443\u0440\u0441\u0430, \u043E\u043D\u0430 \u0436\u0435 \u043A\u0440\u0443\u0442\u0438\u0442\u0441\u044F \u0432 \u0448\u0430\u043F\u043A\u0435 \xAB\u0424\u0430\u0431\u0440\u0438\u043A\u0430 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432\xBB.
  // \u041F\u041E\u0420\u042F\u0414\u041E\u041A \u0421\u041B\u041E\u0401\u0412 \u0412\u0410\u0416\u0415\u041D. \u041B\u0443\u0447\u0438 \u0434\u043B\u0438\u043D\u043D\u0435\u0435 \u043F\u0440\u043E\u043C\u0435\u0436\u0443\u0442\u043A\u0430 \u043C\u0435\u0436\u0434\u0443 \u0437\u043D\u0430\u0447\u043A\u043E\u043C \u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C
  // \u0440\u044F\u0434\u043E\u043C \u043A\u0440\u0443\u0436\u043A\u043E\u0432 (\u0442\u0438\u043F \u043B\u0443\u0447\u0430 30\xB0 \u0434\u043E\u0445\u043E\u0434\u0438\u0442 \u0434\u043E y=1542, \u043D\u0438\u0437 \u043A\u0440\u0443\u0436\u043A\u043E\u0432 \u2014 1598),
  // \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u0435 \u0438 \u043B\u0443\u0447\u0438 \u0440\u0438\u0441\u0443\u044E\u0442\u0441\u044F \u0414\u041E \u0431\u0430\u043D\u043D\u0435\u0440\u0430, \u0430 \u0432\u0435\u0441\u044C \u0441\u043B\u043E\u0439 \u0437\u043D\u0430\u0447\u043A\u0430 \u0441\u0442\u043E\u0438\u0442
  // \u043F\u0435\u0440\u0435\u0434 #nodes: \u0438\u043D\u0430\u0447\u0435 \u043B\u0443\u0447\u0438 \u043B\u044F\u0433\u0443\u0442 \u043F\u043E\u0432\u0435\u0440\u0445 \u043A\u0440\u0443\u0436\u043A\u043E\u0432 \u0438 \u043F\u043E\u0432\u0435\u0440\u0445 \u0437\u0435\u043B\u0451\u043D\u043E\u0439 \u043F\u043B\u0430\u0448\u043A\u0438.
  const rays=Array.from({length:12},(_,k)=>\`<path d="M0,-100 l-8,-26 l16,0 Z" transform="rotate(\${k*30} 0 -28)" fill="#FFE58A" opacity=".55"/>\`).join('');
  html(g,\`<g transform="translate(\${BADGE.x},\${BADGE.y})">
    <g transform="translate(0,-98)"><ellipse class="glowb" cy="-26" rx="100" ry="52" fill="url(#gLampGlow)"/>\${rays}</g>
    <rect x="-305" y="-58" width="610" height="124" rx="22" fill="#4EA84C" opacity=".92"/><rect x="-305" y="-58" width="610" height="124" rx="22" fill="none" stroke="#7FD97A" stroke-width="3" opacity=".8"/>
    <g transform="translate(0,-98)"><circle cy="-28" r="66" fill="#FFFDF8"/><circle cy="-28" r="60" fill="\${INK}"/><circle cy="-28" r="54" fill="url(#gBadge)"/><circle cy="-28" r="54" fill="url(#gBadgeGloss)"/>
      \${gearSVG(0,-28,30,9,'#FFF3C4','#FE7A2A')}
      <path d="M-34,-56 A46,46 0 0 1 4,-76" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/></g>
    <text y="42" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="24" fill="#fff" style="filter:drop-shadow(0 2px 0 rgba(23,34,76,.25))">\${T(['\u0417\u043D\u0430\u0447\u043E\u043A \xAB\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B\xBB \u0436\u0434\u0451\u0442 \u0442\u0435\u0431\u044F!','\xABAlgoritmlar\xBB nishoni seni kutmoqda!','Your Algorithms badge is waiting for you!'])}</text></g>\`);
}

/* =========================================================
   \u041F\u0415\u0420\u0421\u041E\u041D\u0410\u0416\u0418 \u2014 \u0440\u0438\u0433 characters-tik-gluk
   ========================================================= */
const GLUK_SVG=\`<path class="blob" d="M196.0,126.0 C227.3,125.7 269.3,137.7 292.0,156.0 C314.7,174.3 329.3,206.7 332.0,236.0 C334.7,265.3 330.0,312.3 308.0,332.0 C286.0,351.7 235.7,353.0 200.0,354.0 C164.3,355.0 116.7,356.7 94.0,338.0 C71.3,319.3 62.3,272.0 64.0,242.0 C65.7,212.0 82.0,177.3 104.0,158.0 C126.0,138.7 164.7,126.3 196.0,126.0 Z" fill="url(#gGoo)"/>
  <ellipse cx="140" cy="176" rx="48" ry="27" fill="url(#gGooShine)" opacity=".9" transform="rotate(-26 140 176)"/><ellipse cx="292" cy="286" rx="22" ry="13" fill="url(#gGooShine)" opacity=".5" transform="rotate(-24 292 286)"/>
  <g class="features">
    <g class="feat eyes" data-f="g-open"><ellipse cx="168" cy="216" rx="26" ry="30" fill="#FFF8F0"/><ellipse cx="240" cy="216" rx="26" ry="30" fill="#FFF8F0"/><ellipse cx="171" cy="220" rx="13" ry="15" fill="#2B1B12"/><ellipse cx="243" cy="220" rx="13" ry="15" fill="#2B1B12"/><circle cx="166" cy="213" r="4.6" fill="#fff"/><circle cx="238" cy="213" r="4.6" fill="#fff"/></g>
    <g class="feat eyes" data-f="g-wide"><ellipse cx="168" cy="214" rx="30" ry="35" fill="#FFF8F0"/><ellipse cx="240" cy="214" rx="30" ry="35" fill="#FFF8F0"/><ellipse cx="170" cy="216" rx="12" ry="14" fill="#2B1B12"/><ellipse cx="242" cy="216" rx="12" ry="14" fill="#2B1B12"/><circle cx="165" cy="210" r="4.2" fill="#fff"/><circle cx="237" cy="210" r="4.2" fill="#fff"/></g>
    <g class="feat eyes" data-f="g-side"><ellipse cx="168" cy="216" rx="26" ry="29" fill="#FFF8F0"/><ellipse cx="240" cy="216" rx="26" ry="29" fill="#FFF8F0"/><ellipse cx="182" cy="218" rx="12" ry="14" fill="#2B1B12"/><ellipse cx="254" cy="218" rx="12" ry="14" fill="#2B1B12"/><circle cx="178" cy="212" r="4" fill="#fff"/><circle cx="250" cy="212" r="4" fill="#fff"/></g>
    <g class="feat eyes" data-f="g-up"><ellipse cx="168" cy="216" rx="26" ry="29" fill="#FFF8F0"/><ellipse cx="240" cy="216" rx="26" ry="29" fill="#FFF8F0"/><ellipse cx="172" cy="206" rx="12" ry="14" fill="#2B1B12"/><ellipse cx="244" cy="206" rx="12" ry="14" fill="#2B1B12"/><circle cx="168" cy="200" r="4" fill="#fff"/><circle cx="240" cy="200" r="4" fill="#fff"/></g>
    <g class="feat eyes" data-f="g-happy" fill="none" stroke="#2B1B12" stroke-width="8" stroke-linecap="round"><path d="M148,224 Q168,198 188,224"/><path d="M220,224 Q240,198 260,224"/></g>
    <g class="feat eyes" data-f="g-closed" fill="none" stroke="#2B1B12" stroke-width="7" stroke-linecap="round"><path d="M149,214 Q168,230 187,214"/><path d="M221,214 Q240,230 259,214"/></g>
    <g class="feat eyes" data-f="g-star" fill="#2B1B12"><path d="M168,194 q4,17 21,22 q-17,5 -21,22 q-4,-17 -21,-22 q17,-5 21,-22 Z"/><path d="M240,194 q4,17 21,22 q-17,5 -21,22 q-4,-17 -21,-22 q17,-5 21,-22 Z"/><circle cx="168" cy="216" r="4" fill="#FFF3C4"/><circle cx="240" cy="216" r="4" fill="#FFF3C4"/></g>
    <g class="feat mouth" data-f="gm-rest"><path d="M186,282 Q204,294 222,282" fill="none" stroke="#5C1A0F" stroke-width="8" stroke-linecap="round"/></g>
    <g class="feat mouth" data-f="gm-a"><path d="M172,272 Q204,262 236,272 Q231,314 204,314 Q177,314 172,272 Z" fill="url(#gMouth)"/><path d="M184,302 q20,-8 40,0 q-9,11 -20,11 q-11,0 -20,-11 Z" fill="#F0748A"/></g>
    <g class="feat mouth" data-f="gm-o"><ellipse cx="204" cy="286" rx="17" ry="20" fill="url(#gMouth)"/><ellipse cx="204" cy="296" rx="9" ry="7" fill="#F0748A"/></g>
    <g class="feat mouth" data-f="gm-e"><ellipse cx="204" cy="284" rx="30" ry="12" fill="url(#gMouth)"/><path d="M180,281 h48" stroke="#FFF8F0" stroke-width="4" stroke-linecap="round" opacity=".65"/></g>
    <g class="feat mouth" data-f="gm-m"><path d="M180,284 h48" stroke="#5C1A0F" stroke-width="9" stroke-linecap="round"/></g>
    <g class="feat mouth" data-f="gm-smile"><path d="M170,272 Q204,266 238,272 Q234,310 204,310 Q174,310 170,272 Z" fill="url(#gMouth)"/><path d="M182,300 q22,-9 44,0 q-10,10 -22,10 q-12,0 -22,-10 Z" fill="#F0748A"/></g>
    <g class="feat mouth" data-f="gm-frown"><path d="M184,294 Q204,276 224,294" fill="none" stroke="#5C1A0F" stroke-width="8" stroke-linecap="round"/></g>
    <g class="feat extra" data-f="gx-blush"><ellipse cx="120" cy="258" rx="24" ry="14" fill="url(#gBlush)"/><ellipse cx="288" cy="258" rx="24" ry="14" fill="url(#gBlush)"/></g>
    <g class="feat extra" data-f="gx-sparkles" fill="#FFF0C0"><path d="M74,140 q3.4,-15 6.8,0 q15,3.4 0,6.8 q-3.4,15 -6.8,0 q-15,-3.4 0,-6.8 Z"/><path d="M320,120 q3,-14 6,0 q14,3 0,6 q-3,14 -6,0 q-14,-3 0,-6 Z"/><path d="M348,238 q2.4,-11 4.8,0 q11,2.4 0,4.8 q-2.4,11 -4.8,0 q-11,-2.4 0,-4.8 Z"/></g>
    <g class="feat extra" data-f="gx-dots" fill="#7A3E1A"><circle cx="272" cy="104" r="8"/><circle cx="300" cy="96" r="9.5"/><circle cx="332" cy="86" r="11"/></g>
  </g>\`;
const TIK_SVG=\`<rect x="60" y="140" width="58" height="108" rx="29" fill="url(#gNavy)"/><rect x="282" y="140" width="58" height="108" rx="29" fill="url(#gNavy)"/>
  <g class="armL"><path d="M126,264 C100,272 80,300 68,340" fill="none" stroke="url(#gShell)" stroke-width="50" stroke-linecap="round"/><g fill="none" stroke="#17224C" stroke-width="6.5" stroke-linecap="round"><path d="M85.5,355.5 C86,359 86.5,362 87.4,364.5"/><path d="M73.5,361.5 C74,364.5 74.5,367.3 75.4,369.6"/><path d="M61.5,361.5 C61.5,364.5 61.8,367.3 62.5,369.6"/><path d="M49.5,355.5 C49.5,359 49.8,362 50.5,364.5"/></g></g>
  <g class="armR"><path d="M274,264 C300,272 320,300 332,340" fill="none" stroke="url(#gShell)" stroke-width="50" stroke-linecap="round"/><g fill="none" stroke="#17224C" stroke-width="6.5" stroke-linecap="round"><path d="M314.5,355.5 C314,359 313.5,362 312.6,364.5"/><path d="M326.5,361.5 C326,364.5 325.5,367.3 324.6,369.6"/><path d="M338.5,361.5 C338.5,364.5 338.2,367.3 337.5,369.6"/><path d="M350.5,355.5 C350.5,359 350.2,362 349.5,364.5"/></g></g>
  <path d="M200,254 C234,254 268,260 276,268 C286,298 280,332 266,348 C242,360 158,360 134,348 C120,332 114,298 124,268 C132,260 166,254 200,254 Z" fill="url(#gShell)"/>
  <path d="M126,318 C162,330 238,330 274,318 C271,336 262,348 250,355 C228,364 172,364 150,355 C138,348 129,336 126,318 Z" fill="url(#gPanel)"/>
  <path d="M150,348 C174,358 226,358 250,348 C245,366 226,376 200,376 C174,376 155,366 150,348 Z" fill="url(#gNavy)"/>
  <path d="M258,256 C276,260 288,268 294,278 C284,290 274,302 268,314 C258,298 252,272 258,256 Z" fill="url(#gNavy)"/><path d="M142,256 C124,260 112,268 106,278 C116,290 126,302 132,314 C142,298 148,272 142,256 Z" fill="url(#gNavy)"/>
  <circle class="led" cx="200" cy="296" r="5.5" fill="#6FD8FF"/>
  <rect x="86" y="90" width="228" height="198" rx="62" fill="url(#gShell)"/><rect x="98" y="140" width="204" height="142" rx="54" fill="url(#gPanel)"/>
  <path d="M300,150 C308,180 308,232 298,262 C292,272 282,276 276,270 C288,232 288,182 278,152 C282,144 294,142 300,150 Z" fill="#C3CADF" opacity=".55"/>
  <rect x="112" y="126" width="176" height="132" rx="42" fill="url(#gScreen)"/>
  <g clip-path="url(#cScreen)"><path d="M116,150 C160,136 244,142 288,158 L288,196 C232,208 158,204 112,190 Z" fill="#33488C" opacity=".5"/><rect class="scanline" x="112" y="126" width="176" height="34" fill="url(#gScan)"/></g>
  <g class="features">
    <g class="feat eyes" data-f="t-load"><circle cx="200" cy="192" r="42" fill="none" stroke="#33488C" stroke-width="9"/><g class="spinRing"><circle cx="200" cy="192" r="42" fill="none" stroke="#3FC5F0" stroke-width="9" stroke-linecap="round" stroke-dasharray="60 204" transform="rotate(-90 200 192)"/></g></g>
    <g class="feat eyes" data-f="t-on"><rect x="143.5" y="159" width="27" height="56" rx="13.5" fill="#3FC5F0"/><rect x="229.5" y="159" width="27" height="56" rx="13.5" fill="#3FC5F0"/><rect x="147.5" y="165" width="8" height="16" rx="4" fill="#B4EDFF" opacity=".7"/><rect x="233.5" y="165" width="8" height="16" rx="4" fill="#B4EDFF" opacity=".7"/></g>
    <g class="feat eyes" data-f="t-wide"><rect x="141" y="153" width="32" height="68" rx="16" fill="#3FC5F0"/><rect x="227" y="153" width="32" height="68" rx="16" fill="#3FC5F0"/><rect x="145.5" y="160" width="9" height="19" rx="4.5" fill="#B4EDFF" opacity=".7"/><rect x="231.5" y="160" width="9" height="19" rx="4.5" fill="#B4EDFF" opacity=".7"/></g>
    <g class="feat eyes" data-f="t-happy" fill="none" stroke="#3FC5F0" stroke-width="13" stroke-linecap="round"><path d="M140,200 Q157,176 174,200"/><path d="M226,200 Q243,176 260,200"/></g>
    <g class="feat eyes" data-f="t-closed"><rect x="141" y="181" width="32" height="12" rx="6" fill="#3FC5F0"/><rect x="227" y="181" width="32" height="12" rx="6" fill="#3FC5F0"/></g>
    <g class="feat eyes" data-f="t-side"><rect x="157" y="161" width="24" height="52" rx="12" fill="#3FC5F0"/><rect x="243" y="161" width="24" height="52" rx="12" fill="#3FC5F0"/><rect x="169" y="166" width="7" height="14" rx="3.5" fill="#B4EDFF" opacity=".7"/><rect x="255" y="166" width="7" height="14" rx="3.5" fill="#B4EDFF" opacity=".7"/></g>
    <g class="feat eyes" data-f="t-half"><rect x="143.5" y="187" width="27" height="28" rx="13.5" fill="#3FC5F0"/><rect x="229.5" y="187" width="27" height="28" rx="13.5" fill="#3FC5F0"/></g>
    <g class="feat extra" data-f="x-spark" fill="#8FE6FF"><path d="M70,132 q3,-14 6,0 q14,3 0,6 q-3,14 -6,0 q-14,-3 0,-6 Z"/><path d="M336,168 q2.6,-12 5.2,0 q12,2.6 0,5.2 q-2.6,12 -5.2,0 q-12,-2.6 0,-5.2 Z"/><path d="M112,70 q2,-10 4,0 q10,2 0,4 q-2,10 -4,0 q-10,-2 0,-4 Z"/></g>
  </g>\`;
const CHARS={};
function makeChar(kind){
  const gluk=kind==='gluk', sc=gluk?.3:.27, foot=gluk?354:376;
  const el=html($('#chars'),\`<g class="char \${kind}" style="transform:translate(0px,0px);opacity:0">
    <g transform="scale(\${sc}) translate(-200,\${-foot})">
      <ellipse class="c-shadow" cx="200" cy="\${foot+8}" rx="78" ry="11" fill="\${gluk?'#7A3E1A':'#16224A'}" opacity=".2"/>
      <g class="c-float"><g class="c-actor">\${gluk?GLUK_SVG:TIK_SVG}</g></g>
    </g></g>\`);
  const ch={el,kind,actor:el.querySelector('.c-actor'),x:0,y:0,visible:false,k:gluk?.85:1.2,amp:gluk?1:.6};
  CHARS[kind]=ch; return ch;
}
function place(ch,x,y){ch.x=x;ch.y=y;ch.el.style.transform=\`translate(\${x}px,\${y}px)\`;}
function show(ch,v){ch.visible=v;ch.el.style.opacity=v?1:0;}
function face(ch,list){ch.el.querySelectorAll('.feat').forEach(f=>f.classList.toggle('on',list.includes(f.dataset.f)));}

/* =========================================================
   \u0414\u0412\u0418\u0416\u041E\u041A
   ========================================================= */
let runId=0; const live=new Set(); class Abort extends Error{}
function track(a){live.add(a);a.finished.then(()=>live.delete(a),()=>live.delete(a));return a;}
function stopAll(){runId++;live.forEach(a=>{try{a.cancel()}catch(e){}});live.clear();}
const guard=rid=>p=>Promise.resolve(p).then(v=>{if(rid!==runId)throw new Abort();return v;});
function tw(el,kf,opt={}){const a=track(el.animate(kf,{fill:'forwards',easing:EZ.gentle,...opt,duration:D(opt.duration??400),delay:D(opt.delay||0)}));const last=kf[kf.length-1];
  return a.finished.then(()=>{for(const k in last){if(k!=='offset'&&k!=='easing')el.style[k]=last[k];}a.cancel();},()=>{});}
async function relaxFrom(ch,a){const m=getComputedStyle(ch.actor).transform;a.cancel();if(m&&m!=='none'){const b=track(ch.actor.animate([{transform:m},{transform:'none'}],{duration:D(280),easing:EZ.backSoft}));await b.finished.catch(()=>{});}}
async function act(ch,kf,dur,ease,{keep=false}={}){const a=track(ch.actor.animate(kf,{duration:D(dur),easing:ease,fill:'forwards'}));await a.finished.catch(()=>{});if(a.playState!=='finished')return;if(keep){ch.held=a;return;}await relaxFrom(ch,a);}
async function relax(ch){if(ch.held){const a=ch.held;ch.held=null;await relaxFrom(ch,a);}}
function samplePath(p,ox=0,oy=0){const L=p.getTotalLength(),n=Math.max(14,Math.min(50,Math.round(L/10))),kf=[];for(let i=0;i<=n;i++){const pt=p.getPointAtLength(L*i/n);kf.push({transform:\`translate(\${(pt.x+ox).toFixed(1)}px,\${(pt.y+oy).toFixed(1)}px)\`});}return kf;}
async function travel(ch,p,dur,ease,{ox=0,oy=0,delay=0}={}){const kf=samplePath(p,ox,oy),end=p.getPointAtLength(p.getTotalLength());const a=track(ch.el.animate(kf,{duration:D(dur),delay:D(delay),easing:ease,fill:'both'}));await a.finished.catch(()=>{});if(a.playState!=='finished')return;place(ch,end.x+ox,end.y+oy);a.cancel();}
/* \u0413\u043B\u044E\u043A \u2014 \u0433\u0435\u043B\u044C: \u043F\u0440\u044B\u0436\u043A\u0438 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0441\u043F\u043B\u044E\u0449\u0438\u0432\u0430\u043D\u0438\u0435\u043C (\u043F\u0435\u0440\u0435\u043B\u0451\u0442 15\u201320 %) */
async function gooHops(ch,dur){const it=Math.max(1,Math.round(dur/380)),d=dur/it,up='cubic-bezier(.2,.65,.35,1)',down='cubic-bezier(.55,0,.8,.35)';
  const a=track(ch.actor.animate([{transform:'translateY(0) scale(1.18,.8)',easing:up},{transform:'translateY(-64px) scale(.86,1.16)',offset:.5,easing:down},{transform:'translateY(0) scale(1.18,.8)'}],{duration:D(d),iterations:it,fill:'forwards'}));
  await a.finished.catch(()=>{});if(a.playState==='finished')await relaxFrom(ch,a);}
/* \u0422\u0438\u043A \u2014 \u0436\u0451\u0441\u0442\u043A\u0438\u0439 \u043A\u043E\u0440\u043F\u0443\u0441: \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0448\u0430\u0433\u0438 \u0431\u0435\u0437 \u0441\u043F\u043B\u044E\u0449\u0438\u0432\u0430\u043D\u0438\u044F, \u0432 \u043A\u043E\u043D\u0446\u0435 \u0443\u043F\u043E\u0440 */
async function tikSteps(ch,dur){const it=Math.max(2,Math.round(dur/300)),d=dur/it;
  const a=track(ch.actor.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-9px) rotate(2deg)',offset:.5,easing:EZ.md3},{transform:'translateY(0) rotate(0)'}],{duration:D(d),iterations:it}));
  await a.finished.catch(()=>{});}
async function tikBump(ch){face(ch,['t-half']);await act(ch,[{transform:'translateX(0) scale(1)'},{transform:'translateX(10px) scale(.98,1)',offset:.4,easing:EZ.out},{transform:'translateX(6px) scale(1)',offset:.7},{transform:'none'}],560,EZ.out);face(ch,['t-side']);await wait(420);face(ch,['t-on']);}
const TALK=['gm-rest','gm-a','gm-e','gm-o','gm-a','gm-m','gm-e','gm-a'];
let talkTimer=null;
/* \u0421\u0432\u043E\u0435\u0439 \u043E\u0437\u0432\u0443\u0447\u043A\u0438 \u0443 \u043A\u0430\u0440\u0442\u044B \u043D\u0435\u0442: \u043E\u043D\u0430 \u043E\u0442\u0434\u0430\u0451\u0442 \u0440\u0435\u043F\u043B\u0438\u043A\u0443 \u0443\u0440\u043E\u043A\u0443, \u0438 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0433\u043E\u043B\u043E\u0441 \u0443\u0440\u043E\u043A\u0430.
   \u0422\u0430\u043A \u0443 \u0413\u043B\u044E\u043A\u0430 \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u0438 \u0432 \u0443\u0440\u043E\u043A\u0435 \u043E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 \u0433\u043E\u043B\u043E\u0441 \u0438 \u043E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 \u044F\u0437\u044B\u043A. */
function toLesson(msg){try{parent.postMessage(msg,'*');}catch(e){}}
function say(ch,text,eyes=['g-open'],ms=2400,voice){ // \u0413\u043B\u044E\u043A \u0433\u043E\u0432\u043E\u0440\u0438\u0442: \u0440\u0435\u043F\u043B\u0438\u043A\u0430 + \u0432\u0438\u0441\u0435\u043C\u044B 170 \u043C\u0441
  // voice \u2014 \u0442\u043E, \u0447\u0442\u043E \u041F\u0420\u041E\u0418\u0417\u041D\u041E\u0421\u0418\u0422\u0421\u042F; text \u2014 \u0442\u043E, \u0447\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u0432 \u043F\u0443\u0437\u044B\u0440\u0435. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E
  // \u043E\u0434\u043D\u043E \u0438 \u0442\u043E \u0436\u0435, \u043D\u043E \u043F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0434\u043B\u0438\u043D\u043D\u043E\u0435: \u0441\u043B\u0443\u0448\u0430\u0442\u044C \u0435\u0433\u043E \u0445\u043E\u0440\u043E\u0448\u043E, \u0447\u0438\u0442\u0430\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F.
  if(ch.kind!=='tik')toLesson({type:'karta-say',text:String(voice||text||'')});
  const b=$('#bubble'); b.className='bubble'+(ch.kind==='tik'?' tik':''); b.innerHTML='';
  let n=0; text.split(' ').forEach((w,wi,arr)=>{const s=document.createElement('span');s.className='w';[...w].forEach(c=>{const l=document.createElement('span');l.textContent=c;l.style.animationDelay=(n++*14)+'ms';s.appendChild(l);});b.appendChild(s);if(wi<arr.length-1)b.appendChild(document.createTextNode(' '));});
  const cEl=$('#course'),r=svg.getBoundingClientRect(),c=cEl.getBoundingClientRect(),sc=r.width/W;
  b.style.left=(r.left-c.left+cEl.scrollLeft+ch.x*sc)+'px'; b.style.top=(r.top-c.top+(ch.y-(ch.kind==='gluk'?92:108))*sc)+'px'; b.classList.add('show');
  /* \u041F\u0443\u0437\u044B\u0440\u044C \u0432\u0438\u0441\u0438\u0442 \u043D\u0430 \u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0435 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430, \u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436 \u043C\u043E\u0436\u0435\u0442 \u0441\u0442\u043E\u044F\u0442\u044C \u0443 \u0441\u0430\u043C\u043E\u0433\u043E \u043A\u0440\u0430\u044F
     \u043F\u043E\u043B\u043E\u0441\u044B. \u041D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u0438\u0437-\u0437\u0430 \u044D\u0442\u043E\u0433\u043E \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0440\u0435\u043F\u043B\u0438\u043A\u0438 \u043E\u043A\u0430\u0437\u044B\u0432\u0430\u043B\u0430\u0441\u044C \u0437\u0430 \u043A\u0430\u0434\u0440\u043E\u043C \u2014
     \u0437\u0430\u043C\u0435\u0440\u0435\u043D\u043E \u043D\u0430 375\xD7812. \u0414\u0432\u0438\u0433\u0430\u0435\u043C \u043F\u0443\u0437\u044B\u0440\u044C \u0432\u043D\u0443\u0442\u0440\u044C \u0412\u0418\u0414\u0418\u041C\u041E\u0419 \u0447\u0430\u0441\u0442\u0438 \u043F\u043E\u043B\u043E\u0441\u044B; \u0445\u0432\u043E\u0441\u0442\u0438\u043A
     \u043F\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0437\u0430 \u043D\u0438\u043C, \u0447\u0442\u043E\u0431\u044B \u043E\u043D \u043D\u0435 \u043E\u0442\u0440\u044B\u0432\u0430\u043B\u0441\u044F \u043E\u0442 \u0433\u0435\u0440\u043E\u044F. */
  const half=b.offsetWidth/2+10, vis0=cEl.scrollLeft+half, vis1=cEl.scrollLeft+cEl.clientWidth-half;
  const want=parseFloat(b.style.left)||0, got=Math.max(vis0,Math.min(want,vis1));
  if(vis1>vis0&&got!==want){b.style.left=got+'px';
    const tail=Math.max(12,Math.min(b.offsetWidth-12,b.offsetWidth/2+(want-got)));
    b.style.setProperty('--tail',(tail/b.offsetWidth*100)+'%');}
  else b.style.removeProperty('--tail');
  /* \u041F\u043E \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438 \u043F\u0443\u0437\u044B\u0440\u044C \u0432\u0438\u0441\u0438\u0442 \u041D\u0410\u0414 \u0433\u0435\u0440\u043E\u0435\u043C. \u0415\u0441\u043B\u0438 \u0433\u0435\u0440\u043E\u0439 \u0441\u0442\u043E\u0438\u0442 \u0443 \u0432\u0435\u0440\u0445\u0430 \u043A\u0430\u0440\u0442\u044B,
     \u0432\u0435\u0440\u0445 \u043F\u0443\u0437\u044B\u0440\u044F \u0443\u0445\u043E\u0434\u0438\u0442 \u043F\u043E\u0434 \u043F\u043E\u043B\u043E\u0441\u0443 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430 \u2014 \u0437\u0430\u043C\u0435\u0440\u0435\u043D\u043E \u043D\u0430 375\xD7812, \u043F\u0435\u0440\u0432\u044B\u0445
     \u0441\u043B\u043E\u0432 \u043D\u0435 \u0432\u0438\u0434\u043D\u043E \u0432\u043E\u0432\u0441\u0435. \u0412 \u044D\u0442\u043E\u043C \u0441\u043B\u0443\u0447\u0430\u0435 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u043C \u043F\u0443\u0437\u044B\u0440\u044C \u041F\u041E\u0414 \u0433\u0435\u0440\u043E\u044F. */
  b.classList.remove('below');
  const topAbs=c.top+parseFloat(b.style.top)-b.offsetHeight;
  if(topAbs<62){b.classList.add('below');
    b.style.top=(r.top-c.top+(ch.y+(ch.kind==='gluk'?76:88))*sc)+'px';}
  clearInterval(talkTimer);
  if(ch.kind==='gluk'){let k=0;face(ch,[...eyes,TALK[0]]);talkTimer=setInterval(()=>{k=(k+1)%TALK.length;face(ch,[...eyes,TALK[k]]);},D(170));}
  return wait(ms).then(()=>{clearInterval(talkTimer);if(ch.kind==='gluk')face(ch,[...eyes,'gm-rest']);b.classList.remove('show');});
}
function hush(){clearInterval(talkTimer);$('#bubble').classList.remove('show');}
/* \u043F\u043B\u0430\u0432\u043D\u0430\u044F \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043A \u0442\u043E\u0447\u043A\u0435 \u043A\u0430\u0440\u0442\u044B */
/* \u0421\u0442\u0430\u0432\u0438\u0442 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443 \u043F\u043E \u0446\u0435\u043D\u0442\u0440\u0443 \u043A\u0430\u0434\u0440\u0430 \u043F\u043E \u041E\u0411\u0415\u0418\u041C \u043E\u0441\u044F\u043C.
   \u041F\u043E \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438 \u0435\u0434\u0435\u0442 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430, \u043F\u043E \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u0438 \u2014 \u0441\u0430\u043C\u0430 \u043F\u043E\u043B\u043E\u0441\u0430 \u043A\u0430\u0440\u0442\u044B: \u043A\u0430\u0440\u0442\u0430 \u043D\u0435
   \u0443\u0436\u0435 960 px, \u0438 \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u0432 \u043A\u0430\u0434\u0440 \u0432\u043B\u0435\u0437\u0430\u0435\u0442 \u043B\u0438\u0448\u044C \u0435\u0451 \u0442\u0440\u0435\u0442\u044C. \u041F\u043E\u043A\u0430 \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u0438
   \u043D\u0435 \u0431\u044B\u043B\u043E, \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0443\u0440\u043E\u043A\u0430 \u0441\u0442\u043E\u044F\u043B\u0430 \u0437\u0430 \u043F\u0440\u0430\u0432\u044B\u043C \u043A\u0440\u0430\u0435\u043C \u2014 \u0437\u0430\u043C\u0435\u0440\u0435\u043D\u043E \u043D\u0430 375\xD7812. */
function centerX(x,smooth){const c=$('#course');if(!c)return;const r=svg.getBoundingClientRect(),sc=r.width/W;
  const to=Math.max(0,Math.min(x*sc-c.clientWidth/2,c.scrollWidth-c.clientWidth));
  try{c.scrollTo({left:to,behavior:(smooth&&!reduce)?'smooth':'auto'});}catch(e){c.scrollLeft=to;}}
function scrollToWorld(y,dur=800){return new Promise(res=>{const r=svg.getBoundingClientRect(),sc=r.width/W;const target=window.scrollY+r.top+y*sc-window.innerHeight*.5;const from=window.scrollY,to=Math.max(0,Math.min(target,document.documentElement.scrollHeight-window.innerHeight));if(reduce){window.scrollTo(0,to);return res();}const t0=performance.now(),dd=D(dur);(function step(t){const k=Math.min(1,(t-t0)/dd),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;window.scrollTo(0,from+(to-from)*e);if(k<1)requestAnimationFrame(step);else res();})(t0);});}

/* =========================================================
   \u0421\u041E\u0421\u0422\u041E\u042F\u041D\u0418\u0415 \u041A\u0423\u0420\u0421\u0410
   ========================================================= */
const gluk=makeChar('gluk'), tik=makeChar('tik');
const TIK_AT=5; // \u0422\u0438\u043A \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u0432 5-\u043C \u0443\u0440\u043E\u043A\u0435
let cur=1, busy=false, auto=false;
const standG=i=>({x:NODES[i].x,y:NODES[i].y+14}), standT=i=>({x:NODES[i].x+62,y:NODES[i].y+8});
function setProgress(passed){const p=Math.round(passed/N*100);$('#barFill').style.width=p+'%';$('#barKnob').style.left=p+'%';$('#pct').textContent=p+'%';}
function setState(n){ // \u043F\u0435\u0440\u0435\u0434 \u0443\u0440\u043E\u043A\u043E\u043C n
  cur=n; for(let i=0;i<N;i++)setNode(i,i<n-1?'passed':i===n-1?'current':'locked');
  const g=standG(n-1); place(gluk,g.x,g.y); show(gluk,true); face(gluk,['g-open','gm-rest']); gluk.actor.style.transform='';
  if(n>=TIK_AT){const t=standT(n-1);place(tik,t.x,t.y);show(tik,true);face(tik,['t-on']);}else show(tik,false);
  tik.actor.style.transform=''; setProgress(n-1); hush();
}
/* \u0437\u0430\u043C\u043E\u043A \u0441\u043B\u0435\u0442\u0430\u0435\u0442, \u043D\u043E\u043C\u0435\u0440 \u043F\u043E\u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F */
async function unlock(i){
  const e=nodeEls[i], lock=e.querySelector('.lock');
  const sh=track(lock.animate([{transform:'rotate(0)'},{transform:'rotate(-10deg)',offset:.2},{transform:'rotate(10deg)',offset:.4},{transform:'rotate(-8deg)',offset:.6},{transform:'rotate(6deg)',offset:.8},{transform:'rotate(0)'}],{duration:D(460),easing:EZ.sine}));
  await sh.finished.catch(()=>{});
  const fly=track(lock.animate([{transform:'translateY(0) rotate(0)',opacity:1},{transform:'translateY(-70px) rotate(30deg)',opacity:1,offset:.55},{transform:'translateY(-40px) translateX(30px) rotate(90deg)',opacity:0}],{duration:D(640),easing:EZ.out}));
  setNode(i,'current');
  const pop=track(e.querySelector('.disc').animate([{transform:'scale(1)'},{transform:'scale(1.22)',offset:.5},{transform:'scale(1)'}],{duration:D(420),easing:EZ.back}));
  await Promise.all([fly.finished,pop.finished]).catch(()=>{});
}
async function passNode(i){setNode(i,'passed');const pop=track(nodeEls[i].querySelector('.disc').animate([{transform:'scale(1)'},{transform:'scale(1.25)',offset:.5},{transform:'scale(1)'}],{duration:D(400),easing:EZ.back}));await pop.finished.catch(()=>{});}

/* \u0422\u0440\u0438 \u044F\u0437\u044B\u043A\u0430. \u0418\u043D\u0434\u0435\u043A\u0441 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u043F\u043E LANG, \u043E\u0442\u043A\u0430\u0442 \u0432\u0441\u0435\u0433\u0434\u0430 \u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u0438\u0439 \u2014
   \u0442\u043E \u0436\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E, \u0447\u0442\u043E \u0438 \u0432\u043E \u0432\u0441\u0451\u043C \u0443\u0440\u043E\u043A\u0435. */
const LI=LANG==='uz'?1:LANG==='en'?2:0;
const T=(tr)=>tr[LI]||tr[0];
const LINES={
  done:['\u0423\u0440\u0430! \u041F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C!','\u0420\u0430\u0431\u043E\u0442\u0430\u0435\u0442! \u0414\u0430\u0436\u0435 \u044F \u043D\u0435 \u0437\u0430\u043F\u0443\u0442\u0430\u043B\u0441\u044F!','\u0412\u043E\u0442 \u044D\u0442\u043E \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C! \u0412\u0441\u0435 \u0448\u0430\u0433\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443!','\u0422\u044B \u043F\u043E\u0447\u0438\u043D\u0438\u043B \u043C\u043E\u044E \u043F\u0443\u0442\u0430\u043D\u0438\u0446\u0443 \u2014 \u0441\u043F\u0430\u0441\u0438\u0431\u043E!'],
  next:['\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0443\u0440\u043E\u043A \u043E\u0442\u043A\u0440\u044B\u043B\u0441\u044F! \u0418\u0434\u0451\u043C?','\u041E\u0439\u2026 \u0442\u0430\u043C \u044F, \u043A\u0430\u0436\u0435\u0442\u0441\u044F, \u0441\u043D\u043E\u0432\u0430 \u0432\u0441\u0451 \u043F\u0435\u0440\u0435\u043F\u0443\u0442\u0430\u043B. \u041F\u043E\u043C\u043E\u0436\u0435\u0448\u044C?','\u0415\u0449\u0451 \u043E\u0434\u043D\u0430 \u0437\u0430\u0434\u0430\u0447\u043A\u0430 \u0436\u0434\u0451\u0442 \u043D\u0430\u0441!','\u0411\u0435\u0436\u0438\u043C \u0434\u0430\u043B\u044C\u0448\u0435 \u2014 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0441\u0430\u043C\u0438 \u0441\u0435\u0431\u044F \u043D\u0435 \u0440\u0430\u0441\u0441\u0442\u0430\u0432\u044F\u0442!'],
  tik:'\u041E! \u042D\u0442\u043E \u0422\u0438\u043A. \u041E\u043D \u043D\u0435 \u0433\u043E\u0432\u043E\u0440\u0438\u0442, \u0437\u0430\u0442\u043E \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u043A\u0430\u043A \u043D\u0430\u0434\u043E.',
  final:'\u0412\u0435\u0441\u044C \u043A\u0443\u0440\u0441 \u043F\u0440\u043E\u0439\u0434\u0435\u043D! \u0422\u0432\u043E\u0439 \u0437\u043D\u0430\u0447\u043E\u043A \u0443\u0436\u0435 \u0436\u0434\u0451\u0442 \u0442\u0435\u0431\u044F!',
  /* \u041F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u043D\u0430 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435: \u043A\u0442\u043E \u044D\u0442\u043E, \u0433\u0434\u0435 \u043C\u044B \u0438 \u0447\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435.
     \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0444\u0440\u0430\u0437\u0430 \u2014 \u043F\u0440\u044F\u043C\u043E\u0435 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043D\u0430\u0436\u0430\u0442\u044C \u043D\u0430 \u043A\u0440\u0443\u0436\u043E\u043A, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E
     \u0441\u043B\u043E\u0432 \u043D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u043D\u0435\u0442 \u0438 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \xAB\u043D\u0430\u0436\u043C\u0438 \u0441\u044E\u0434\u0430\xBB \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435\u0447\u0435\u043C. */
  hello:T([
    '\u0414\u0430\u0432\u0430\u0439 \u043D\u0430\u0447\u043D\u0451\u043C \u043D\u043E\u0432\u044B\u0439 \u0443\u0440\u043E\u043A!',
    "Keling, yangi darsni boshlaymiz!",
    'Let us start a new lesson!'
  ]),
  /* \u0412 \u043F\u0443\u0437\u044B\u0440\u0435 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u044D\u0442\u043E: \u043E\u0434\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \u0438 \u043E\u0434\u043D\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u0412\u0441\u0451 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435
     \u043F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u0441\u043B\u044B\u0448\u0438\u0442, \u0430 \u043D\u0435 \u0447\u0438\u0442\u0430\u0435\u0442. */
  helloShort:T(['\u041D\u043E\u0432\u044B\u0439 \u0443\u0440\u043E\u043A!', 'Yangi dars!', 'New lesson!'])
};
const pick=(arr,n)=>arr[n%arr.length];

/* ---------- \u0441\u0446\u0435\u043D\u0430: \u0443\u0440\u043E\u043A \u043F\u0440\u043E\u0439\u0434\u0435\u043D \u2192 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C\u0443 ---------- */
async function passLesson(rid){
  const W_=guard(rid), n=cur, i=n-1;
  // 1. \u0440\u0430\u0434\u043E\u0441\u0442\u044C \u0413\u043B\u044E\u043A\u0430 \u0438 \u0437\u0430\u043A\u0440\u0430\u0441\u043A\u0430 \u0443\u0437\u043B\u0430
  face(gluk,['g-star','gm-smile','gx-sparkles']);
  await W_(Promise.all([act(gluk,[{transform:'translateY(0) scale(1)'},{transform:'translateY(6px) scale(1.12,.86)',offset:.12},{transform:'translateY(-46px) scale(.9,1.14)',offset:.4},{transform:'translateY(0) scale(1.14,.86)',offset:.6},{transform:'translateY(-24px) scale(.96,1.06)',offset:.78},{transform:'none'}],1050,EZ.back),passNode(i),say(gluk,pick(LINES.done,n),['g-happy'],1900)]));
  setProgress(n);
  if(tik.visible){face(tik,['t-happy','x-spark']);await W_(act(tik,[{transform:'scale(1)'},{transform:'scale(.985)',offset:.3},{transform:'scale(1.035)',offset:.65},{transform:'none'}],400,EZ.out));face(tik,['t-on']);}
  if(n===N){ // \u0444\u0438\u043D\u0430\u043B
    await W_(scrollToWorld(BADGE.y-60,900));
    const c=$('#badge'); const cp=track(c.animate([{transform:'scale(1)'},{transform:'scale(1.05)',offset:.5},{transform:'scale(1)'}],{duration:D(700),easing:EZ.back}));
    await W_(Promise.all([cp.finished.catch(()=>{}),say(gluk,LINES.final,['g-star'],3200)]));
    face(gluk,['g-happy','gm-smile']); cur=N+1; return;
  }
  // 2. \u0437\u0430\u043C\u043E\u043A \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0443\u0440\u043E\u043A\u0435 \u0441\u043B\u0435\u0442\u0430\u0435\u0442
  await W_(wait(150)); await W_(unlock(i+1)); cur=n+1;
  await W_(say(gluk,pick(LINES.next,n),['g-side'],2000));
  // 3. \u043F\u0440\u044B\u0436\u043A\u0438 \u043F\u043E \u0434\u043E\u0440\u043E\u0433\u0435; \u0422\u0438\u043A \u0438\u0434\u0451\u0442 \u0441\u043B\u0435\u0434\u043E\u043C \u0448\u0430\u0433\u0430\u043C\u0438
  face(gluk,['g-open','gm-smile']);
  const seg=SEGS[i], turn=NODES[i].row!==NODES[i+1].row, dur=turn?2200:1300;
  const g2=standG(i+1), t2=standT(i+1);
  scrollToWorld(NODES[i+1].y,turn?1600:900); centerX(NODES[i+1].x,true);
  const jobs=[travel(gluk,seg,dur,EZ.inout,{ox:0,oy:14}),gooHops(gluk,dur)];
  if(tik.visible){jobs.push(travel(tik,seg,dur,EZ.inout,{ox:62,oy:8,delay:260}));jobs.push((async()=>{await wait(260);await tikSteps(tik,dur);})());}
  await W_(Promise.all(jobs));
  place(gluk,g2.x,g2.y);
  // 4. \u043F\u0440\u0438\u0431\u044B\u0442\u0438\u0435
  if(tik.visible){place(tik,t2.x,t2.y);W_(tikBump(tik));}
  if(i+1===TIK_AT-1){await W_(tikArrives(i+1));}
}
/* \u0422\u0438\u043A \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u0432 5-\u043C \u0443\u0440\u043E\u043A\u0435: \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u0440\u044F\u0434\u043E\u043C \u0441 \u043A\u0440\u0443\u0433\u043E\u043C */
async function tikArrives(i){
  const t=standT(i); place(tik,t.x,t.y); tik.actor.style.transform='translateY(20px) scale(.94)'; show(tik,true); face(tik,['t-load']);
  face(gluk,['g-wide','gm-o']);
  await tw(tik.actor,[{transform:'translateY(20px) scale(.94)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:320,easing:EZ.out});
  const led=tik.el.querySelector('.led'); const lb=track(led.animate([{opacity:.2},{opacity:1},{opacity:.2},{opacity:1},{opacity:.2},{opacity:1}],{duration:D(1300),easing:'steps(6)'}));
  await wait(1400); face(tik,['t-on']); await lb.finished.catch(()=>{});
  const bub=say(tik,'\u0431\u0438\u043F-\u0431\u043E\u043F!',[],1100);
  // \u043F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435: \u0434\u0432\u0430 \u0437\u0430\u0442\u0443\u0445\u0430\u044E\u0449\u0438\u0445 \u043D\u0430\u043A\u043B\u043E\u043D\u0430 \u043A\u043E\u0440\u043F\u0443\u0441\u0430, \u0440\u0443\u043A\u0430 \u043C\u0430\u0448\u0435\u0442 \u0441 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u043E\u0439 60 \u043C\u0441
  const arm=tik.el.querySelector('.armR'); arm.style.transformBox='fill-box'; arm.style.transformOrigin='20% 10%';
  const wave=track(arm.animate([{transform:'rotate(0)'},{transform:'rotate(-28deg)',offset:.3},{transform:'rotate(-13deg)',offset:.55},{transform:'rotate(-32deg)',offset:.8},{transform:'rotate(0)'}],{duration:D(620),delay:D(60),easing:EZ.out}));
  face(tik,['t-happy']);
  await Promise.all([act(tik,[{transform:'rotate(0)'},{transform:'rotate(-3.4deg)',offset:.4},{transform:'rotate(2.2deg)',offset:.75},{transform:'rotate(0)'}],520,EZ.out),wave.finished.catch(()=>{}),bub]);
  face(tik,['t-on']);
  await say(gluk,LINES.tik,['g-side'],2600);
  face(gluk,['g-open','gm-rest']);
}
/* \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0413\u043B\u044E\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435: \u0448\u043B\u0451\u043F\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u0430\u0434\u0440 */
/* \u041A\u0440\u0443\u0436\u043E\u043A \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0443\u0440\u043E\u043A\u0430 \u2014 \u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0446\u0435\u043B\u044C \u043D\u0430\u0436\u0430\u0442\u0438\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u0435. \u041E\u043D \u0438 \u0442\u0430\u043A
   \u043F\u0443\u043B\u044C\u0441\u0438\u0440\u0443\u0435\u0442 \u043A\u043E\u043B\u044C\u0446\u043E\u043C, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 \u0441\u043B\u043E\u0432\u0430\u043C\u0438 \u043D\u0435 \u043D\u0443\u0436\u043D\u0430: \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u0432\u0438\u0434\u0438\u0442,
   \u0447\u0442\u043E \u0436\u0438\u0432\u043E\u0435 \u0437\u0434\u0435\u0441\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0434\u043D\u043E \u043C\u0435\u0441\u0442\u043E. */
function armStart(){
  const e=nodeEls[LESSON-1]; if(!e)return;
  e.style.cursor='pointer';
  e.setAttribute('tabindex','0');
  e.setAttribute('role','button');
  if(e.dataset.armed)return;        // \u0432\u044B\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0434\u0432\u0430\u0436\u0434\u044B: \u043D\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0438 \u043F\u043E\u0441\u043B\u0435 \u0432\u0445\u043E\u0434\u0430 \u0413\u043B\u044E\u043A\u0430
  e.dataset.armed='1';
  const go=()=>{if(started)return;started=true;hush();toLesson({type:'karta-start'});};
  e.addEventListener('click',go);
  e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}});
  enter=go;
}
/* \u0412\u0425\u041E\u0414 \u0421\u0410\u041C. \u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u041D\u0438\u043A\u0430 17.09: \xAB\u043A\u043E\u0433\u0434\u0430 \u043F\u0440\u044B\u0433\u0430\u043B \u2014 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0437\u0430\u0448\u0435\u043B\xBB.
   \u041A\u0440\u0443\u0436\u043E\u043A \u043F\u0440\u0438 \u044D\u0442\u043E\u043C \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0436\u0438\u0432\u044B\u043C \u2014 \u043A\u0442\u043E \u043D\u0435 \u0445\u043E\u0447\u0435\u0442 \u0436\u0434\u0430\u0442\u044C, \u0436\u043C\u0451\u0442 \u0438 \u0432\u0445\u043E\u0434\u0438\u0442 \u0440\u0430\u043D\u044C\u0448\u0435.
   \u26A0 \u0422\u0430\u0439\u043C\u0435\u0440, \u0430 \u041D\u0415 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0438: \u0432 \u0444\u043E\u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435 WAAPI-\u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043D\u0435
   \u0434\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0435\u0442, \u0438 \u0432\u0445\u043E\u0434, \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0439 \u043A \u0435\u0451 \u043A\u043E\u043D\u0446\u0443, \u043D\u0435 \u0441\u043B\u0443\u0447\u0438\u043B\u0441\u044F \u0431\u044B \u043D\u0438\u043A\u043E\u0433\u0434\u0430. */
let enter=null;
function autoStart(ms){setTimeout(()=>{if(enter)enter();},ms);}
let started=false;
async function glukEnters(rid){
  const W_=guard(rid); const g=standG(cur-1); place(gluk,g.x,g.y); face(gluk,['g-wide','gm-o']); show(gluk,true);
  /* \u26A0 \u0412\u0425\u041E\u0414 \u0412 \u0423\u0420\u041E\u041A \u041D\u0415 \u0416\u0414\u0401\u0422 \u041D\u0418 \u041E\u0414\u041D\u041E\u0419 \u0410\u041D\u0418\u041C\u0410\u0426\u0418\u0418. \u0417\u0430\u043C\u0435\u0440\u0435\u043D\u043E 12.09: \u0432 \u0444\u043E\u043D\u043E\u0432\u043E\u0439
     \u0432\u043A\u043B\u0430\u0434\u043A\u0435 WAAPI-\u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043D\u0435 \u0434\u043E\u0438\u0433\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u043E\u0432\u0441\u0435, \`await act(...)\` \u043D\u0435
     \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044F \u2014 \u0438 \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u0435 \u041D\u0410\u0412\u0421\u0415\u0413\u0414\u0410, \u0431\u0435\u0437 \u0432\u0445\u043E\u0434\u0430 \u0438 \u0431\u0435\u0437
     \u043E\u0448\u0438\u0431\u043A\u0438. \u0420\u043E\u0432\u043D\u043E \u0442\u043E\u0442 \u0436\u0435 \u0442\u0443\u043F\u0438\u043A, \u0447\u0442\u043E \u0434\u0430\u043B \u0431\u0435\u043B\u044B\u0439 \u044D\u043A\u0440\u0430\u043D \u043F\u043E\u0441\u043B\u0435 \u0447\u0435\u0442\u0432\u0451\u0440\u0442\u043E\u0439
     \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B 11.09. \u041F\u043E\u044D\u0442\u043E\u043C\u0443: \u043A\u0440\u0443\u0436\u043E\u043A \u043D\u0430\u0436\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443, \u043F\u0440\u044B\u0436\u043E\u043A \u0413\u043B\u044E\u043A\u0430
     \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0440\u044F\u0434\u043E\u043C \u0438 \u043D\u0438\u043A\u043E\u0433\u043E \u043D\u0435 \u0434\u0435\u0440\u0436\u0438\u0442. */
  armStart();
  act(gluk,[{transform:'translateY(-96px) scale(.74,1.34)'},{transform:'translateY(0) scale(1.32,.68)',offset:.42,easing:EZ.out},{transform:'translateY(-22px) scale(.92,1.1)',offset:.62},{transform:'translateY(0) scale(1.1,.9)',offset:.78},{transform:'translateY(-6px) scale(.98,1.03)',offset:.9},{transform:'none'}],760,EZ.back).catch(()=>{});
  await W_(wait(560));
  /* \u0420\u0435\u043F\u043B\u0438\u043A\u0430 \u043A\u043E\u0440\u043E\u0442\u043A\u0430\u044F, \u0438 \u0443\u0440\u043E\u043A \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 2,6 \u0441 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u044B\u0436\u043A\u0430:
     \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u0443\u0441\u043F\u0435\u0432\u0430\u0435\u0442 \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0443\u0434\u0430 \u043F\u043E\u043F\u0430\u043B, \u0438 \u0443\u0441\u043B\u044B\u0448\u0430\u0442\u044C \u0444\u0440\u0430\u0437\u0443 \u0446\u0435\u043B\u0438\u043A\u043E\u043C. */
  autoStart(2600);
  await W_(say(gluk,LINES.helloShort,['g-open'],2400,LINES.hello)); face(gluk,['g-open','gm-rest']);
}

/* =========================================================
   UI
   ========================================================= */
buildHeader(); buildMeadow(); buildRoad(); buildDeco(); buildNodes(); buildBadge();

async function run(fn){if(busy){stopAll();setState(Math.min(cur,N));}else stopAll();const rid=runId;busy=true;try{await fn(rid);}catch(e){if(!(e instanceof Abort))console.error(e);}finally{if(rid===runId)busy=false;}}
setState(LESSON);
armStart();                       // \u0432\u0445\u043E\u0434 \u043E\u0442\u043A\u0440\u044B\u0442 \u0441 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u043A\u0430\u0434\u0440\u0430, \u0434\u043E \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0439
scrollToWorld(NODES[LESSON-1].y,1); centerX(NODES[LESSON-1].x,false);
addEventListener('resize',()=>{if(!started)centerX(NODES[cur-1].x,false);});
/* \u26A0 \u043D\u0435 \u0447\u0435\u0440\u0435\u0437 requestAnimationFrame: \u0432 \u0444\u043E\u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435 \u043E\u043D \u043D\u0435 \u0432\u044B\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0412\u041E\u041E\u0411\u0429\u0415
   (\u0437\u0430\u043C\u0435\u0440\u0435\u043D\u043E 12.09 \u2014 \u043D\u043E\u043B\u044C \u0432\u044B\u0437\u043E\u0432\u043E\u0432), \u0438 \u0413\u043B\u044E\u043A \u043C\u043E\u043B\u0447\u0430\u043B \u0431\u044B \u0432\u0435\u0441\u044C \u044D\u043A\u0440\u0430\u043D. \u0420\u0430\u0437\u043C\u0435\u0442\u043A\u0430 \u043A
   \u044D\u0442\u043E\u043C\u0443 \u043C\u043E\u043C\u0435\u043D\u0442\u0443 \u0443\u0436\u0435 \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u0430, \u0436\u0434\u0430\u0442\u044C \u043A\u0430\u0434\u0440\u0430 \u043D\u0435 \u0437\u0430 \u0447\u0435\u043C. */
setTimeout(()=>{run(glukEnters);},60);
})();
<\/script>

</html>
`;

// deploy-algo-u1/src/karta.jsx
var MARK = ["[\u0420\u0443\u0441\u0441\u043A\u043E\u0435 \u043F\u0440\u043E\u0438\u0437\u043D\u043E\u0448\u0435\u043D\u0438\u0435] ", "[O\u02BBzbekcha tallaffuz] ", "[English pronunciation] "];
var LI = (lang) => lang === "uz" ? 1 : lang === "en" ? 2 : 0;
var LANGS = [["ru", "\u0420\u0423"], ["uz", "UZ"], ["en", "EN"]];
function KartaIntro({ lesson = 1, lang = "ru", onStart, onLang }) {
  const i = LI(lang);
  const segs = useMemo(() => [], []);
  const audio = useAudio(segs);
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);
  const srcDoc = useMemo(
    () => karta_default.replace("__LESSON__", String(lesson)).replace("__LANG__", lang),
    [lesson, lang]
  );
  useEffect(() => {
    const onMessage = (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "karta-say" && d.text) audio.pushOneOff(MARK[i] + d.text);
      if (d.type === "karta-start") {
        if (startedRef.current) return;
        startedRef.current = true;
        onStart && onStart();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [audio, i, onStart]);
  return <div style={{ position: "fixed", inset: 0, background: "#6CDC69", zIndex: 40 }}>{
    /* Пока кадр грузится, экран уже зелёный — белой вспышки между уроком
       и картой не видно ни кадра. */
  }<iframe
    title="karta"
    srcDoc={srcDoc}
    onLoad={() => setReady(true)}
    style={{
      display: "block",
      width: "100%",
      height: "100%",
      border: "none",
      opacity: ready ? 1 : 0,
      transition: "opacity .35s ease"
    }}
  />{
    /* Выбор языка есть и здесь: карта — первый экран урока, и если языка на
       ней не сменить, ребёнок услышит чужой язык раньше, чем доберётся до
       шапки урока. Стоит в свободном правом краю полосы прогресса. */
  }{onLang && <div style={{
    position: "absolute",
    top: 11,
    right: 12,
    display: "flex",
    gap: 2,
    padding: 2,
    borderRadius: 99,
    background: "rgba(255,255,255,.82)"
  }}>{LANGS.map(([code, label]) => {
    const on = lang === code;
    return <button
      key={code}
      onClick={() => onLang(code)}
      aria-label={code}
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: 99,
        padding: "3px 9px",
        minHeight: 26,
        fontFamily: "Nunito, sans-serif",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".06em",
        background: on ? "#FF9F5A" : "transparent",
        color: on ? "#3A1B00" : "#5B6C87"
      }}
    >{label}</button>;
  })}</div>}</div>;
}

// deploy-algo-u1/src/lesson.jsx
var LESSON_ID = "algoritmy-m4-u1-vokrug-tebya";
var LESSON_NO = 1;
var TOTAL_SCREENS = 11;
var SCORED = [5, 8, 9];
var LI2 = (lang) => lang === "uz" ? 1 : lang === "en" ? 2 : 0;
var LANGS2 = [["ru", "\u0420\u0423"], ["uz", "UZ"], ["en", "EN"]];
var LangCtx = React.createContext(null);
var TTS_MARK = ["[\u0420\u0443\u0441\u0441\u043A\u043E\u0435 \u043F\u0440\u043E\u0438\u0437\u043D\u043E\u0448\u0435\u043D\u0438\u0435] ", "[O\u02BBzbekcha tallaffuz] ", "[English pronunciation] "];
var readMs = (s) => Math.max(3e3, Math.min(2e4, String(s || "").length * 72));
var C = {
  bg: "rgb(245, 245, 245)",
  text: "#000",
  primary: "#fe5b1a",
  green1: "#10b981",
  green2: "#6ee7b7",
  green3: "#a7f3d0",
  green4: "#ecfdf5",
  yellow1: "#fcd34d",
  yellow2: "#fde68a",
  yellow3: "#fffbeb",
  yellow4: "#ffd659",
  gray1: "#94a3b8",
  gray2: "#5e5e5e33",
  red1: "#ff9090",
  red2: "#ff6a6a",
  redBg: "#fff5f5",
  orange1: "#f59e0b",
  blue: "#019acb",
  lightOrange: "#ff8b3e",
  // Карточка шага = блок «действие» из настоящего Blockly (там этим цветом
  // покрашен pick battery). Ребёнок встретит его снова через два курса, и
  // палитра будет ему уже знакома — мост держится на цвете, а не на словах.
  action: "#FF6680",
  actionDk: "#CC5266"
};
var BACK_BG = "#E8480C";
var ART = {
  shell1: "#FBFDF0",
  shell2: "#F0F3DE",
  shell3: "#DFE4C8",
  pan1: "#D3D9EC",
  pan2: "#A9B3D0",
  navy1: "#2A3C74",
  navy2: "#17224C",
  scr1: "#22326B",
  scr2: "#141F47",
  cyan: "#3FC5F0",
  cyanLt: "#B4EDFF",
  led: "#6FD8FF",
  gInk: "#2B1B12",
  tongue: "#F0748A",
  gCream: "#FFF8F0"
};
/* Телефон лёжа (высота меньше 500): Глюк и его полоса меньше —
   иначе экран приходилось уменьшать до трети. */
/* Узкий экран — сетки в два столбца. Телефон лёжа сюда не входит: там столбцы
   широкие, иначе страница уходила в высоту втрое. */
var NARROW = () => typeof window !== "undefined" && window.innerWidth < 640;
var LANDP = () => typeof window !== "undefined" && window.innerHeight < 500 && window.innerWidth > window.innerHeight;
var HERO = (m) => LANDP() ? 58 : m ? 94 : 126;
var CAST_H = (m) => LANDP() ? 66 : m ? 120 : 150;
var F = {
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Fraunces", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace'
};
var TONES = [
  ["#FFF4E8", "#FFE1C4", "#FFC79A", "#FFDFA6"],
  ["#FFF8EE", "#E9F1FA", "#BFD9F2", "#FFD9AE"],
  ["#F7F3FF", "#EAE3FB", "#CDBDF3", "#E7D6FF"],
  ["#F1FBF5", "#DBF2E6", "#AEE6C8", "#CFEFDD"],
  ["#FFF7EE", "#FDE7D2", "#FFCEA6", "#FFE3B8"],
  ["#F2F9FE", "#DCEBF8", "#B7D8F0", "#D8E9F7"],
  ["#FFF9EC", "#FBE6CC", "#F7CE9C", "#FFE2AE"],
  ["#FFFCEE", "#FDEFC8", "#FFDE94", "#FFEDBB"],
  ["#F4F9F6", "#DFF0E7", "#B7E0CB", "#D6EEE1"],
  ["#FFF6F2", "#FCE4DA", "#F8C7B4", "#FFDCCB"],
  ["#F6F5FC", "#E7E4F6", "#CBC5EC", "#DED9F3"],
  // Мост в Blockly: холодный воздух следующего курса
  ["#EAF2FB", "#D5E5F7", "#AFCDEE", "#CFE0F4"]
];
var L = {
  lessonTitle: ["\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B \u0432\u043E\u043A\u0440\u0443\u0433 \u0442\u0435\u0431\u044F", "Atrofingizdagi algoritmlar", "Algorithms Around You"],
  ui_next: ["\u0414\u0430\u043B\u044C\u0448\u0435", "Davom etish", "Next"],
  ui_back: ["\u041D\u0430\u0437\u0430\u0434", "Orqaga", "Back"],
  ui_yes: ["\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C", "Algoritm", "Algorithm"],
  ui_no: ["\u041D\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C", "Algoritm emas", "Not an algorithm"],
  ui_finish: ["\u0417\u0430\u043A\u043E\u043D\u0447\u0438\u0442\u044C \u0443\u0440\u043E\u043A", "Darsni tugatish", "Finish lesson"],
  ui_opened: ["\u041E\u0442\u043A\u0440\u044B\u0442\u043E", "Ochilgan", "Opened"],
  ui_tapMore: ["\u041E\u0442\u043A\u0440\u043E\u0439 \u0435\u0449\u0451", "Yana oching", "Open more"],
  ui_result: ["\u0422\u0432\u043E\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", "Sizning natijangiz", "Your result"],
  ui_tapPic: ["\u041D\u0430\u0436\u0438\u043C\u0430\u0439 \u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443", "Rasmni bosing", "Tap the picture"],
  // Граница между инструкцией-вопросом и вариантами ответа: без неё варианты
  // читались как продолжение той же плёнки.
  ui_pick: ["\u0412\u044B\u0431\u0435\u0440\u0438 \u043E\u0442\u0432\u0435\u0442", "Javobni tanlang", "Choose the answer"],
  k_hook: ["\u0417\u0430\u0433\u0430\u0434\u043A\u0430", "Topishmoq", "Puzzle"],
  k_look: ["\u0420\u0430\u0437\u0431\u043E\u0440", "Tahlil", "Walk-through"],
  k_rule: ["\u041F\u0440\u0430\u0432\u0438\u043B\u043E", "Qoida", "The rule"],
  k_game: ["\u0418\u0433\u0440\u0430", "O\u02BByin", "Game"],
  k_life: ["\u0422\u0432\u043E\u044F \u0436\u0438\u0437\u043D\u044C", "Sizning hayotingiz", "Your life"],
  k_task: ["\u0417\u0430\u0434\u0430\u043D\u0438\u0435", "Topshiriq", "Task"],
  k_predict: ["\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0436\u0438", "Bashorat qiling", "Predict"],
  k_end: ["\u0418\u0442\u043E\u0433", "Yakun", "Wrap-up"],
  // Похвала: коротко, до шести слов, без пересказа задания. Хвалим работу,
  // а не выдаём оценку человеку.
  praise: [
    ["\u041C\u043E\u043B\u043E\u0434\u0435\u0446, \u0432\u0441\u0451 \u0432\u0435\u0440\u043D\u043E!", "Zo\u02BBr, hammasi to\u02BBg\u02BBri!", "Well done, all correct!"],
    ["\u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E! \u0411\u044B\u0441\u0442\u0440\u043E \u0441\u043E\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0448\u044C.", "To\u02BBg\u02BBri! Tez tushunasiz.", "Correct! You think fast."],
    ["\u0422\u043E\u0447\u043D\u043E \u0442\u0430\u043A. \u0425\u043E\u0440\u043E\u0448\u043E \u0434\u0443\u043C\u0430\u0435\u0448\u044C.", "Aynan shunday. Yaxshi o\u02BBylaysiz.", "Exactly. That is good thinking."],
    ["\u0412\u0435\u0440\u043D\u043E! \u0422\u044B \u0432\u043D\u0438\u043C\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439.", "To\u02BBg\u02BBri! Siz diqqatlisiz.", "Right! You were really paying attention."]
  ],
  // ═══ СБОРКА ЛЕНТЫ: три задания по нарастающей, 3 → 4 → 5 шагов ═══
  // Текста на экране у них нет вовсе: что делать, говорит Глюк, а как
  // правильно — показывает Тик, когда лента запущена.
  build_win: [
    ["\u0412\u043E\u0442 \u0442\u0430\u043A! \u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0432\u0435\u0440\u043D\u044B\u0439 \u2014 \u0438 \u0447\u0430\u0439 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0441\u044F.", "Mana shunday! Tartib to\u02BBg\u02BBri \u2014 choy tayyor bo\u02BBldi.", "Just like that! The order is right, and the tea came out just perfect."],
    ["\u0413\u043E\u0442\u043E\u0432\u043E! \u0427\u0435\u0442\u044B\u0440\u0435 \u0448\u0430\u0433\u0430, \u0438 \u043A\u0430\u0436\u0434\u044B\u0439 \u043D\u0430 \u0441\u0432\u043E\u0451\u043C \u043C\u0435\u0441\u0442\u0435.", "Tayyor! To\u02BBrt qadam, va har biri o\u02BBz o\u02BBrnida.", "Done! Four steps, each in its place."],
    ["\u041F\u043B\u043E\u0432 \u0433\u043E\u0442\u043E\u0432! \u041F\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432, \u043D\u0438 \u043E\u0434\u0438\u043D \u043D\u0435 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0441\u044F.", "Palov tayyor! Besh qadam, birortasi yo\u02BBqolmadi.", "The palov is ready! Five steps and not one was lost."]
  ],
  // ПОМОЩЬ ПОСЛЕ ТРЁХ ПРОМАХОВ (её правка 17.09). Первая ступень: Глюк
  // проговаривает начало и ставит первые карточки сам. Вторая, ещё через два
  // промаха, добавляет одну. Ответ целиком не даётся никогда — последние шаги
  // ребёнок ставит сам.
  build_help1: [
    [
      "\u0421\u043C\u043E\u0442\u0440\u0438, \u043F\u043E\u043A\u0430\u0436\u0443 \u043D\u0430\u0447\u0430\u043B\u043E. \u0421\u043F\u0435\u0440\u0432\u0430 \u0447\u0430\u0439\u043D\u0438\u043A \u043D\u0430 \u043E\u0433\u043E\u043D\u044C. \u0414\u0430\u043B\u044C\u0448\u0435 \u0441\u0430\u043C.",
      "Qarang, boshini ko\u02BBrsataman. Avval choynak olovga. Davomini o\u02BBzingiz.",
      "Look, I will show you the start. First the kettle goes on the fire. The rest is yours."
    ],
    [
      "\u0421\u043C\u043E\u0442\u0440\u0438, \u043F\u043E\u043A\u0430\u0436\u0443 \u043D\u0430\u0447\u0430\u043B\u043E. \u0421\u043F\u0435\u0440\u0432\u0430 \u0437\u0430\u0441\u0442\u0435\u043B\u0438\u043B \u043A\u0440\u043E\u0432\u0430\u0442\u044C, \u043F\u043E\u0442\u043E\u043C \u0443\u043C\u044B\u043B\u0441\u044F. \u0414\u0430\u043B\u044C\u0448\u0435 \u0441\u0430\u043C.",
      "Qarang, boshini ko\u02BBrsataman. Avval karavotni yig\u02BBdingiz, keyin yuvindingiz. Davomini o\u02BBzingiz.",
      "Look, I will show you the start. First you made the bed, then you washed up. The rest is yours."
    ],
    [
      "\u0421\u043C\u043E\u0442\u0440\u0438, \u043F\u043E\u043A\u0430\u0436\u0443 \u043D\u0430\u0447\u0430\u043B\u043E. \u0421\u043F\u0435\u0440\u0432\u0430 \u043C\u044F\u0441\u043E \u0432 \u043A\u0430\u0437\u0430\u043D, \u043F\u043E\u0442\u043E\u043C \u043C\u043E\u0440\u043A\u043E\u0432\u044C. \u0414\u0430\u043B\u044C\u0448\u0435 \u0441\u0430\u043C.",
      "Qarang, boshini ko\u02BBrsataman. Avval go\u02BBsht qozonga, keyin sabzi. Davomini o\u02BBzingiz.",
      "Look, I will show you the start. First the meat into the kazan, then the carrot. The rest is yours."
    ]
  ],
  build_help2: [
    [
      "\u0418 \u0434\u0430\u043B\u044C\u0448\u0435 \u2014 \u0437\u0430\u0432\u0430\u0440\u043A\u0430. \u041E\u0441\u0442\u0430\u043B\u0430\u0441\u044C \u043F\u0438\u0430\u043B\u0430.",
      "Keyin \u2014 choy bargi. Piyola qoldi.",
      "And next come the tea leaves. Only the piyola is left."
    ],
    [
      "\u0414\u0430\u043B\u044C\u0448\u0435 \u2014 \u0437\u0430\u0432\u0442\u0440\u0430\u043A. \u041E\u0441\u0442\u0430\u043B\u0441\u044F \u0440\u044E\u043A\u0437\u0430\u043A.",
      "Keyin \u2014 nonushta. Ryukzak qoldi.",
      "Next comes breakfast. Only the backpack is left."
    ],
    [
      "\u0414\u0430\u043B\u044C\u0448\u0435 \u2014 \u0432\u043E\u0434\u0430. \u041E\u0441\u0442\u0430\u043B\u0438\u0441\u044C \u0440\u0438\u0441 \u0438 \u043A\u0440\u044B\u0448\u043A\u0430.",
      "Keyin \u2014 suv. Guruch bilan qopqoq qoldi.",
      "Next comes the water. Only the rice and the lid are left."
    ]
  ],
  build_miss: [
    ["\u041F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C \u0440\u043E\u0432\u043D\u043E \u0442\u043E, \u0447\u0442\u043E \u0442\u044B \u0441\u043E\u0431\u0440\u0430\u043B. \u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0438, \u043A\u0430\u043A\u043E\u0439 \u0448\u0430\u0433 \u0432\u0441\u0442\u0430\u043B \u043D\u0435 \u043D\u0430 \u0441\u0432\u043E\u0451 \u043C\u0435\u0441\u0442\u043E.", "Siz yig\u02BBganingiz aynan shunday chiqdi. Qaysi qadam o\u02BBz o\u02BBrnida emasligiga qarang.", "You got exactly what you built. See which step is in the wrong place."],
    ["\u041D\u0435 \u0432\u044B\u0448\u043B\u043E. \u041F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C \u0440\u043E\u0432\u043D\u043E \u043A\u0430\u043A \u0441\u043E\u0431\u0440\u0430\u043D\u043E. \u041F\u043E\u0434\u0443\u043C\u0430\u0439, \u043A\u0430\u043A\u043E\u0435 \u0434\u0435\u043B\u043E \u0434\u0435\u043B\u0430\u044E\u0442 \u0440\u0430\u043D\u044C\u0448\u0435 \u2014 \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u0432\u044C \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0441\u043D\u043E\u0432\u0430.", "Chiqmadi. Aynan yig\u02BBilganidek bo\u02BBldi. Qaysi ish oldinroq qilinishini o\u02BBylab ko\u02BBring \u2014 o\u02BBrnini almashtirib, yana urinib ko\u02BBring.", "It did not work. You got exactly what you built. Think about which one comes first, swap them and try again."],
    ["\u041A\u0430\u0437\u0430\u043D \u043D\u0435 \u043E\u0431\u043C\u0430\u043D\u0435\u0448\u044C. \u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0438 \u043D\u0430 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0435\u0449\u0451 \u0440\u0430\u0437.", "Qozonni aldab bo\u02BBlmaydi. Tartibga yana bir bor qarang.", "You cannot fool the kazan. Look at the order once more."]
  ],
  b1_audio: [
    "\u0422\u0435\u043F\u0435\u0440\u044C \u0441\u0430\u043C. \u0412\u043E\u0442 \u0442\u0440\u0438 \u0448\u0430\u0433\u0430 \u0447\u0430\u044F, \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043D\u0438 \u0440\u0430\u0441\u0441\u044B\u043F\u0430\u043B\u0438\u0441\u044C. \u041F\u043E\u0434\u0443\u043C\u0430\u0439, \u0441 \u0447\u0435\u0433\u043E \u043D\u0430\u0447\u0438\u043D\u0430\u044E\u0442, \u0438 \u0441\u043E\u0431\u0435\u0440\u0438 \u0438\u0445 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443. \u0421\u043E\u0431\u0435\u0440\u0451\u0448\u044C \u0432\u0441\u0435 \u0442\u0440\u0438 \u2014 \u043E\u043D\u0438 \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u0441\u0430\u043C\u0438. \u041E\u0434\u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0442\u0443\u0442 \u043B\u0438\u0448\u043D\u044F\u044F \u2014 \u043E\u043D\u0430 \u043D\u0435 \u0438\u0437 \u0447\u0430\u044F.",
    "Endi o\u02BBzingiz. Mana choyning uchta qadami, faqat ular sochilib ketdi. Nimadan boshlash kerakligini o\u02BBylab ko\u02BBring va tartib bilan yig\u02BBing. Uchalasini yig\u02BBsangiz \u2014 o\u02BBzi ishlaydi. Bitta kartochka ortiqcha \u2014 u choydan emas.",
    "Now you. Here are the three steps for making tea, only they got all jumbled up. Think about where you start and put them in order. Put all three together and they run by themselves. One card here is extra: it is not part of the tea."
  ],
  b2_audio: [
    "\u0410 \u0442\u0435\u043F\u0435\u0440\u044C \u0443\u0442\u0440\u043E. \u0412\u043E\u0442 \u0447\u0435\u0442\u044B\u0440\u0435 \u0434\u0435\u043B\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0442\u044B \u0434\u0435\u043B\u0430\u0435\u0448\u044C \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C, \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043D\u0438 \u043F\u0435\u0440\u0435\u043F\u0443\u0442\u0430\u043B\u0438\u0441\u044C. \u041F\u043E\u0434\u0443\u043C\u0430\u0439 \u0441\u0430\u043C: \u0447\u0442\u043E \u0440\u0430\u043D\u044C\u0448\u0435, \u0430 \u0447\u0442\u043E \u043F\u043E\u0437\u0436\u0435. \u0421\u043E\u0431\u0435\u0440\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443.",
    "Endi ertalabga o\u02BBtamiz. Mana siz har kuni qiladigan to\u02BBrtta ish, faqat ular aralashib ketdi. O\u02BBzingiz o\u02BBylab ko\u02BBring: qaysi biri oldin, qaysi biri keyin. Tartib bilan yig\u02BBing.",
    "And now the morning. Here are four things you do every day, only they got mixed up. Work it out yourself: what comes earlier and what comes later. Put them in order."
  ],
  b3_audio: [
    "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0438 \u0441\u0430\u043C\u0430\u044F \u0434\u043B\u0438\u043D\u043D\u0430\u044F \u2014 \u043F\u043B\u043E\u0432. \u041F\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432, \u0438 \u043E\u0448\u0438\u0431\u0438\u0442\u044C\u0441\u044F \u0442\u0443\u0442 \u043B\u0435\u0433\u043A\u043E. \u041F\u043E\u0434\u0443\u043C\u0430\u0439, \u0447\u0442\u043E \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u043A\u0430\u0437\u0430\u043D \u0440\u0430\u043D\u044C\u0448\u0435, \u0430 \u0447\u0442\u043E \u043F\u043E\u0437\u0436\u0435. \u0418 \u043E\u0434\u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043B\u0438\u0448\u043D\u044F\u044F \u2014 \u043E\u043D\u0430 \u043D\u0435 \u0438\u0437 \u043F\u043B\u043E\u0432\u0430. \u0421\u043E\u0431\u0438\u0440\u0430\u0439.",
    "Oxirgisi va eng uzuni \u2014 palov. Besh qadam, bunda xato qilish oson. Qozonga nima avval, nima keyin tushishini o\u02BBylab ko\u02BBring. Bitta kartochka esa ortiqcha \u2014 u palovdan emas. Yig\u02BBing.",
    "The last one and the longest: palov. Five steps, and it is easy to slip up here. Think about what goes into the kazan earlier and what later. And one card is extra: it is not part of the palov. Put it together."
  ],
  s0_title: ["\u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0443\u0442\u0440\u043E\u043C \u0442\u044B \u0443\u0436\u0435 \u0441\u0434\u0435\u043B\u0430\u043B \u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432.", "bugun ertalab siz yigirmata algoritm bajardingiz.", "you already did twenty algorithms this morning."],
  s0_sub: ["\u0418 \u0434\u0430\u0436\u0435 \u043D\u0435 \u0437\u0430\u043C\u0435\u0442\u0438\u043B. \u0412\u0435\u0440\u0438\u0448\u044C?", "Va sezmadingiz ham. Ishonasizmi?", "And you did not even notice. Do you believe me?"],
  s0_o: [["\u041D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C", "Bo\u02BBlishi mumkin emas", "No way"], ["\u041D\u0430\u0432\u0435\u0440\u043D\u043E\u0435, \u043F\u0440\u0430\u0432\u0434\u0430", "Rost bo\u02BBlsa kerak", "Probably true"], ["\u0410 \u0447\u0442\u043E \u0442\u0430\u043A\u043E\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C?", "Algoritm nima?", "What is an algorithm?"]],
  // Утро ребёнка в пяти кадрах. Экран-загадка был единственным без картинки
  // вовсе: одни буквы и кнопки. Кадры с галочками показывают то, о чём говорит
  // заголовок, — «это ты сегодня уже сделал и даже не заметил».
  s0_morning: [
    { art: "bedmade", t: ["\u0417\u0430\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0440\u043E\u0432\u0430\u0442\u044C", "Karavot yig\u02BBish", "Make the bed"] },
    { art: "sink", t: ["\u041F\u043E\u043C\u044B\u0442\u044C \u0440\u0443\u043A\u0438", "Qo\u02BBl yuvish", "Wash your hands"] },
    { art: "treats", t: ["\u041F\u043E\u0437\u0430\u0432\u0442\u0440\u0430\u043A\u0430\u0442\u044C", "Nonushta qilish", "Have breakfast"] },
    { art: "bagclosed", t: ["\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u0440\u0442\u0444\u0435\u043B\u044C", "Sumka yig\u02BBish", "Pack the backpack"] }
  ],
  s0_audio: [
    "\u041F\u0440\u0438\u0432\u0435\u0442, \u0434\u0440\u0443\u0433! \u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0413\u043B\u044E\u043A. \u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0443\u0442\u0440\u043E\u043C \u0442\u044B \u0443\u0436\u0435 \u0441\u0434\u0435\u043B\u0430\u043B \u0434\u0432\u0430 \u0434\u0435\u0441\u044F\u0442\u043A\u0430 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432 \u0438 \u0434\u0430\u0436\u0435 \u043D\u0435 \u0437\u0430\u043C\u0435\u0442\u0438\u043B. \u041D\u0435 \u0432\u0435\u0440\u0438\u0448\u044C? \u0422\u043E\u0433\u0434\u0430 \u0441\u043C\u043E\u0442\u0440\u0438 \u2014 \u043D\u0430\u0447\u043D\u0451\u043C \u0441 \u0441\u0430\u043C\u043E\u0433\u043E \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E \u0447\u0430\u044F.",
    "Salom, do\u02BBst! Mening ismim Glyuk. Bugun ertalab siz yigirmata algoritm bajardingiz va sezmadingiz ham. Ishonmayapsizmi? Unda qarang \u2014 eng oddiy choydan boshlaymiz.",
    "Hey there! I am Gluk. You already did twenty algorithms this morning and did not even notice. You do not believe me? Then watch: we start with an ordinary cup of tea."
  ],
  s1_title: ["\u041A\u0430\u043A \u0437\u0430\u0432\u0430\u0440\u0438\u0432\u0430\u044E\u0442 \u0447\u0430\u0439", "Choy qanday damlanadi", "How tea is brewed"],
  s1_steps: [
    ["\u0412\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u0432\u043E\u0434\u0443", "Suvni qaynatish", "Boil the water"],
    ["\u041D\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0443 \u0432 \u0447\u0430\u0439\u043D\u0438\u043A", "Choynakka choy solish", "Put tea in the pot"],
    ["\u0417\u0430\u043B\u0438\u0442\u044C \u043A\u0438\u043F\u044F\u0442\u043A\u043E\u043C", "Qaynoq suv quyish", "Pour boiling water"],
    ["\u041D\u0430\u043A\u0440\u044B\u0442\u044C \u0438 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C", "Yopib, kutish", "Cover it and wait"],
    ["\u041D\u0430\u043B\u0438\u0442\u044C \u0432 \u043F\u0438\u0430\u043B\u0443", "Piyolaga quyish", "Pour into the piyola"]
  ],
  s1_done: ["\u041F\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443 \u2014 \u0438 \u0447\u0430\u0439 \u0433\u043E\u0442\u043E\u0432.", "Besh qadam tartib bilan \u2014 va choy tayyor.", "Five steps in order and the tea is ready."],
  s1_audio: [
    "\u0412\u043E\u0442 \u043E\u043D, \u043F\u0435\u0440\u0432\u044B\u0439. \u0427\u0430\u0439 \u2014 \u0442\u043E \u0441\u0430\u043C\u043E\u0435, \u0447\u0442\u043E \u0434\u043E\u043C\u0430 \u0434\u0435\u043B\u0430\u044E\u0442 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C. \u041D\u0430\u0436\u0438\u043C\u0430\u0439 \u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443, \u0438 \u0434\u0435\u043B\u043E \u043F\u043E\u0439\u0434\u0451\u0442 \u0448\u0430\u0433 \u0437\u0430 \u0448\u0430\u0433\u043E\u043C. \u0410 \u044F \u0431\u0443\u0434\u0443 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442.",
    "Mana u, birinchisi. Choy \u2014 uyda har kuni qilinadigan ish. Rasmni bosing, ish qadamma-qadam boradi. Men esa nima bo\u02BBlayotganini aytib boraman.",
    "Here is the first one. Making tea is something your family does every day. Tap the picture and it goes step by step, and I will tell you what is happening."
  ],
  // Реплика на КАЖДЫЙ шаг: ребёнок нажал — Глюк объяснил, что сейчас сделал Тик.
  // Коротко, по одной мысли: между нажатиями пауза не должна тянуться.
  s1_stepAudio: [
    [
      "\u0428\u0430\u0433 \u043F\u0435\u0440\u0432\u044B\u0439: \u0432\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u0432\u043E\u0434\u0443. \u0412 \u0445\u043E\u043B\u043E\u0434\u043D\u043E\u0439 \u0432\u043E\u0434\u0435 \u0447\u0430\u0439 \u043D\u0435 \u0437\u0430\u0432\u0430\u0440\u0438\u0442\u0441\u044F \u2014 \u043D\u0443\u0436\u0435\u043D \u043A\u0438\u043F\u044F\u0442\u043E\u043A.",
      "Birinchi qadam: suvni qaynatish. Sovuq suvda choy damlanmaydi \u2014 qaynoq suv kerak.",
      "Step one: boil the water. Tea will not brew in cold water, it needs boiling water."
    ],
    [
      "\u0428\u0430\u0433 \u0432\u0442\u043E\u0440\u043E\u0439: \u043D\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0443 \u0432 \u0447\u0430\u0439\u043D\u0438\u043A. \u041E\u0434\u043D\u0430 \u043B\u043E\u0436\u043A\u0430 \u2014 \u0438 \u0445\u0432\u0430\u0442\u0438\u0442.",
      "Ikkinchi qadam: choynakka choy solish. Bir qoshiq \u2014 yetarli.",
      "Step two: put the tea in the pot. One spoon is enough."
    ],
    [
      "\u0428\u0430\u0433 \u0442\u0440\u0435\u0442\u0438\u0439: \u0437\u0430\u043B\u0438\u0442\u044C \u043A\u0438\u043F\u044F\u0442\u043A\u043E\u043C. \u0412\u043E\u0442 \u0442\u0435\u043F\u0435\u0440\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0430 \u043E\u0442\u0434\u0430\u0451\u0442 \u0441\u0432\u043E\u0439 \u0446\u0432\u0435\u0442 \u0438 \u0437\u0430\u043F\u0430\u0445.",
      "Uchinchi qadam: qaynoq suv quyish. Mana endi choy o\u02BBz rangi va hidini beradi.",
      "Step three: pour the boiling water. Now the tea lets out its colour and its smell."
    ],
    [
      "\u0428\u0430\u0433 \u0447\u0435\u0442\u0432\u0451\u0440\u0442\u044B\u0439: \u043D\u0430\u043A\u0440\u044B\u0442\u044C \u0438 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C. \u0421\u0430\u043C\u044B\u0439 \u0442\u0440\u0443\u0434\u043D\u044B\u0439 \u0448\u0430\u0433 \u2014 \u0442\u0443\u0442 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0434\u0435\u043B\u0430\u044E\u0442.",
      "To\u02BBrtinchi qadam: yopib, kutish. Eng qiyin qadam \u2014 bu yerda hech narsa qilinmaydi.",
      "Step four: cover it and wait. The hardest step, because here you do nothing."
    ],
    [
      "\u0428\u0430\u0433 \u043F\u044F\u0442\u044B\u0439: \u043D\u0430\u043B\u0438\u0442\u044C \u0432 \u043F\u0438\u0430\u043B\u0443. \u0413\u043E\u0442\u043E\u0432\u043E, \u043C\u043E\u0436\u043D\u043E \u0437\u0432\u0430\u0442\u044C \u0432\u0441\u0435\u0445 \u043A \u0434\u0430\u0441\u0442\u0430\u0440\u0445\u0430\u043D\u0443.",
      "Beshinchi qadam: piyolaga quyish. Tayyor, hammani dasturxonga chaqirsa bo\u02BBladi.",
      "Step five: pour it into the piyola. Done! Now you can call everyone to the dastarkhan."
    ]
  ],
  s1_audioEnd: [
    "\u041F\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432, \u0438 \u043A\u0430\u0436\u0434\u044B\u0439 \u043D\u0430 \u0441\u0432\u043E\u0451\u043C \u043C\u0435\u0441\u0442\u0435. \u042D\u0442\u043E \u0438 \u0435\u0441\u0442\u044C \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C. \u0417\u0430\u043F\u043E\u043C\u043D\u0438 \u0438\u0445 \u2014 \u0441\u0435\u0439\u0447\u0430\u0441 \u0440\u0430\u0437\u0431\u0435\u0440\u0451\u043C \u044D\u0442\u043E\u0442 \u0447\u0430\u0439 \u043D\u0430 \u0447\u0430\u0441\u0442\u0438.",
    "Besh qadam, va har biri o\u02BBz o\u02BBrnida. Mana shu algoritm. Ularni eslab qoling \u2014 hozir shu choyni qismlarga ajratamiz.",
    "Five steps, each in its place. That is an algorithm. Remember them: now we take this tea apart."
  ],
  s2_pre: [
    "\u0422\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E \u0437\u0430\u0432\u0430\u0440\u0438\u043B \u0447\u0430\u0439. \u0422\u0430\u043A\u0430\u044F \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0443 \u043B\u044E\u0431\u043E\u0433\u043E, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u0442\u0435\u0431\u044F. \u0420\u0430\u0437\u0431\u0435\u0440\u0451\u043C \u0435\u0451 \u043D\u0430 \u0447\u0430\u0441\u0442\u0438 \u2014 \u0438\u0445 \u0440\u043E\u0432\u043D\u043E \u0442\u0440\u0438.",
    "Siz hozirgina choy damladingiz. Bunday ko\u02BBrsatma faqat sendagina emas, har kimda ishlaydi. Uni qismlarga ajratamiz \u2014 ular roppa-rosa uchta.",
    "You have just brewed tea. An instruction like that works for anyone, not just you. Let us take it apart: there are exactly three parts."
  ],
  s2_slides: [
    {
      row: ["kettle", "leaves", "piyola"],
      ttl: ["\u0428\u0430\u0433\u0438", "Qadamlar", "Steps"],
      sb: ["\u041E\u0434\u043D\u043E \u043F\u043E\u043D\u044F\u0442\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u2014 \u043E\u0434\u0438\u043D \u0448\u0430\u0433", "Bitta aniq harakat \u2014 bitta qadam", "One clear action is one step"],
      audio: [
        "\u0427\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0432\u0430\u044F \u2014 \u0448\u0430\u0433\u0438. \u041E\u0434\u0438\u043D \u0448\u0430\u0433 \u2014 \u044D\u0442\u043E \u043E\u0434\u043D\u043E \u043F\u043E\u043D\u044F\u0442\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u0412\u0437\u044F\u043B \u0447\u0430\u0439\u043D\u0438\u043A. \u041D\u0430\u0441\u044B\u043F\u0430\u043B \u0437\u0430\u0432\u0430\u0440\u043A\u0443. \u041D\u0430\u043B\u0438\u043B \u0432 \u043F\u0438\u0430\u043B\u0443. \u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u0438\u0434\u043D\u043E \u0433\u043B\u0430\u0437\u0430\u043C\u0438 \u2014 \u0432\u043E\u0442 \u0438 \u0432\u0435\u0441\u044C \u0441\u0435\u043A\u0440\u0435\u0442.",
        "Birinchi qism \u2014 qadamlar. Bitta qadam \u2014 bu bitta aniq harakat. Choynakni oldi. Choy soldi. Piyolaga quydi. Har birini ko\u02BBz bilan ko\u02BBrasiz \u2014 butun sir shunda.",
        "Part one: steps. One step is one clear action. Take the pot. Add the tea. Pour it into the piyola. You can see every one of them with your eyes, and that is the whole secret."
      ]
    },
    {
      row: ["piyola", "kettle", "leaves"],
      cross: true,
      ttl: ["\u041F\u043E\u0440\u044F\u0434\u043E\u043A", "Tartib", "Order"],
      sb: ["\u0428\u0430\u0433\u0438 \u0442\u0435 \u0436\u0435, \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u0440\u0443\u0433\u043E\u0439 \u2014 \u0447\u0430\u044F \u043D\u0435\u0442", "Qadamlar o\u02BBsha, tartib boshqa \u2014 choy yo\u02BBq", "Same steps, different order, no tea"],
      audio: [
        "\u0427\u0430\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0430\u044F \u2014 \u043F\u043E\u0440\u044F\u0434\u043E\u043A. \u0421\u043C\u043E\u0442\u0440\u0438, \u0447\u0442\u043E \u0431\u044B\u0432\u0430\u0435\u0442, \u0435\u0441\u043B\u0438 \u0435\u0433\u043E \u043F\u0435\u0440\u0435\u043F\u0443\u0442\u0430\u0442\u044C. \u041A\u0438\u043F\u044F\u0442\u043E\u043A \u043D\u0430\u043B\u0438\u043B\u0438 \u0432 \u043F\u0438\u0430\u043B\u0443, \u0430 \u0437\u0430\u0432\u0430\u0440\u043A\u0443 \u0431\u0440\u043E\u0441\u0438\u043B\u0438 \u0441\u0432\u0435\u0440\u0445\u0443. \u0428\u0430\u0433\u0438 \u0442\u0435 \u0436\u0435, \u043D\u0438 \u043E\u0434\u0438\u043D \u043D\u0435 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0441\u044F \u2014 \u0430 \u0432 \u043F\u0438\u0430\u043B\u0435 \u043F\u043B\u0430\u0432\u0430\u044E\u0442 \u043B\u0438\u0441\u0442\u0438\u043A\u0438, \u0438 \u0447\u0430\u0439 \u043D\u0435 \u0437\u0430\u0432\u0430\u0440\u0438\u043B\u0441\u044F.",
        "Ikkinchi qism \u2014 tartib. Qarang, uni chalkashtirsangiz nima bo\u02BBladi. Piyolaga avval qaynoq suv quyildi, choy esa ustidan sepildi. Qadamlar o\u02BBsha, birortasi yo\u02BBqolmadi \u2014 lekin piyolada barglar suzib yuribdi, choy damlanmadi.",
        "Part two: order. Look what happens when you mix it up. The boiling water went into the piyola first and the tea leaves on top. The steps are the same, not one of them is missing, but the leaves are floating and the tea never brewed."
      ]
    },
    {
      row: ["piyola"],
      num: false,
      ttl: ["\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", "Natija", "Result"],
      sb: ["\u041E\u0434\u043D\u0430 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F \u2014 \u043E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 \u0447\u0430\u0439", "Bitta ko\u02BBrsatma \u2014 har doim o\u02BBsha choy", "One instruction, the same tea every time"],
      audio: [
        "\u0427\u0430\u0441\u0442\u044C \u0442\u0440\u0435\u0442\u044C\u044F \u2014 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442. \u0417\u0430\u0432\u0430\u0440\u0438 \u043F\u043E \u044D\u0442\u043E\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 \u0437\u0430\u0432\u0442\u0440\u0430, \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0434\u0435\u043B\u044E, \u0447\u0435\u0440\u0435\u0437 \u0433\u043E\u0434 \u2014 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F \u0442\u043E\u0442 \u0436\u0435 \u0441\u0430\u043C\u044B\u0439 \u0447\u0430\u0439. \u0418 \u0443 \u0442\u0435\u0431\u044F, \u0438 \u0443 \u043C\u0435\u043D\u044F, \u0438 \u0443 \u0441\u043E\u0441\u0435\u0434\u0430. \u0412\u043E\u0442 \u0442\u0435\u043F\u0435\u0440\u044C \u044D\u0442\u043E \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0439 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C.",
        "Uchinchi qism \u2014 natija. Shu ko\u02BBrsatma bo\u02BByicha ertaga damla, bir haftadan keyin damla, bir yildan keyin damla \u2014 o\u02BBsha choyning o\u02BBzi chiqadi. Sizda ham, menda ham, qo\u02BBshningizda ham. Mana endi bu haqiqiy algoritm.",
        "Part three: the result. Follow these same steps tomorrow, in a week, in a year, and you get the very same tea. For you, for me, for your neighbour. Now that is a real algorithm."
      ]
    },
    // Четвёртый кадр добавлен по правке 5 от 11.09: ребёнку объяснили только то,
    // ЧЕМ алгоритм является, и он не мог отличить его от не-алгоритма на игре.
    {
      row: ["heart", "sunhot"],
      num: false,
      ttl: ["\u041D\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C", "Algoritm emas", "Not an algorithm"],
      sb: ["\u0413\u0434\u0435 \u043D\u0435\u0442 \u0448\u0430\u0433\u043E\u0432 \u2014 \u043D\u0435\u0442 \u0438 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0430", "Qadam yo\u02BBq joyda algoritm ham yo\u02BBq", "No steps, no algorithm"],
      audio: [
        "\u0410 \u0442\u0435\u043F\u0435\u0440\u044C \u0441\u0430\u043C\u043E\u0435 \u0433\u043B\u0430\u0432\u043D\u043E\u0435: \u043D\u0435 \u0432\u0441\u0451 \u043D\u0430 \u0441\u0432\u0435\u0442\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C. \u0412\u043E\u0442 \u0441\u0435\u0440\u0434\u0446\u0435 \u2014 \xAB\u044F \u043B\u044E\u0431\u043B\u044E \u043F\u043B\u043E\u0432\xBB. \u042D\u0442\u043E \u0447\u0443\u0432\u0441\u0442\u0432\u043E, \u0435\u0433\u043E \u043D\u0435 \u0434\u0435\u043B\u0430\u044E\u0442 \u043F\u043E \u0448\u0430\u0433\u0430\u043C. \u0412\u043E\u0442 \u0441\u043E\u043B\u043D\u0446\u0435 \u2014 \xAB\u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0436\u0430\u0440\u043A\u043E\xBB. \u042D\u0442\u043E \u043F\u043E\u0433\u043E\u0434\u0430, \u043E\u043D\u0430 \u043F\u0440\u043E\u0441\u0442\u043E \u0435\u0441\u0442\u044C. \u041D\u0438 \u0442\u0430\u043C, \u043D\u0438 \u0442\u0430\u043C \u043D\u0435\u0447\u0435\u0433\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443 \u0438 \u043D\u0435\u0447\u0435\u0433\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0432 \u043A\u043E\u043D\u0446\u0435. \u0417\u0430\u043F\u043E\u043C\u043D\u0438: \u0435\u0441\u0442\u044C \u0448\u0430\u0433\u0438, \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u2014 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C. \u041D\u0435\u0442 \u0448\u0430\u0433\u043E\u0432 \u2014 \u043D\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C.",
        "Endi eng muhimi: dunyoda hamma narsa algoritm emas. Mana yurak \u2014 \xABmen palovni yaxshi ko\u02BBraman\xBB. Bu tuyg\u02BBu, uni qadamma-qadam bajarib bo\u02BBlmaydi. Mana quyosh \u2014 \xABbugun issiq\xBB. Bu ob-havo, u shunchaki bor. Ikkalasida ham tartib bilan qiladigan ish yo\u02BBq va oxirida oladigan natija yo\u02BBq. Eslab qoling: qadam, tartib va natija bor \u2014 algoritm. Qadam yo\u02BBq \u2014 algoritm emas.",
        "And now the main thing: not everything is an algorithm. Here is a heart, I love palov. That is a feeling, you do not do it in steps. Here is the sun, it is hot today. That is the weather, it is just there, nobody makes it. Neither one has steps you follow in order, and neither one gives you anything at the end. Remember: steps, order and a result mean an algorithm. No steps, no algorithm."
      ]
    }
  ],
  s3_title: ["\u042D\u0442\u043E \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u0438\u043B\u0438 \u043D\u0435\u0442?", "Bu algoritmmi yoki yo\u02BBqmi?", "Algorithm or not?"],
  s3_hint: ["\u0415\u0441\u043B\u0438 \u0435\u0441\u0442\u044C \u0448\u0430\u0433\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443 \u2014 \u044D\u0442\u043E \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C.", "Tartibli qadamlar bo\u02BBlsa \u2014 bu algoritm.", "If it has steps in order, it is an algorithm."],
  s3_audio: [
    "\u0422\u0440\u0438 \u0447\u0430\u0441\u0442\u0438 \u0442\u044B \u0442\u0435\u043F\u0435\u0440\u044C \u0437\u043D\u0430\u0435\u0448\u044C: \u0448\u0430\u0433\u0438, \u043F\u043E\u0440\u044F\u0434\u043E\u043A, \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442. \u041F\u0440\u043E\u0432\u0435\u0440\u0438\u043C, \u0443\u0437\u043D\u0430\u0435\u0448\u044C \u043B\u0438 \u0442\u044B \u0438\u0445 \u0432 \u0447\u0443\u0436\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u0445. \u0415\u0441\u0442\u044C \u0448\u0430\u0433\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443 \u2014 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C. \u041F\u0440\u043E\u0441\u0442\u043E \u043C\u044B\u0441\u043B\u044C \u0438\u043B\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u2014 \u043D\u0435\u0442.",
    "Uchala qismni endi bilasiz: qadamlar, tartib, natija. Ularni boshqa kartalarda taniy olasizmi \u2014 tekshiramiz. Tartibli qadamlar bor \u2014 algoritm. Shunchaki fikr yoki rasm \u2014 yo\u02BBq.",
    "You know all three parts now: steps, order, result. Let us see if you can spot them on other cards. Steps in order, it is an algorithm. Just a thought or a picture, it is not."
  ],
  s3_good: ["\u041C\u043E\u043B\u043E\u0434\u0435\u0446! \u0422\u044B \u0432\u0438\u0434\u0438\u0448\u044C \u0448\u0430\u0433\u0438.", "Zo\u02BBr! Siz qadamlarni ko\u02BBrasiz.", "Well done! You can see the steps."],
  s3_soso: ["\u0425\u043E\u0440\u043E\u0448\u043E. \u0415\u0449\u0451 \u043F\u043E\u0442\u0440\u0435\u043D\u0438\u0440\u0443\u0435\u043C\u0441\u044F.", "Yaxshi. Yana mashq qilamiz.", "Good. We will practise more."],
  s4_title: ["\u0414\u0435\u0441\u044F\u0442\u044C \u0442\u0432\u043E\u0438\u0445 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u043E\u0432", "O\u02BBnta algoritmingiz", "Ten of your algorithms"],
  s4_hint: ["\u041E\u0442\u043A\u0440\u043E\u0439 \u0445\u043E\u0442\u044F \u0431\u044B \u0448\u0435\u0441\u0442\u044C \u2014 \u0443\u0432\u0438\u0434\u0438\u0448\u044C \u0448\u0430\u0433\u0438 \u0432\u043D\u0443\u0442\u0440\u0438.", "Kamida oltitasini oching \u2014 ichidagi qadamlarni ko\u02BBrasiz.", "Open at least six to see the steps inside."],
  s4_audio: [
    "\u0410 \u0442\u0435\u043F\u0435\u0440\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435: \u0447\u0430\u0439 \u0443 \u0442\u0435\u0431\u044F \u043D\u0435 \u043E\u0434\u0438\u043D \u0442\u0430\u043A\u043E\u0439. \u0422\u0430\u043A\u0438\u0445 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0439 \u0446\u0435\u043B\u044B\u0439 \u0434\u0435\u043D\u044C, \u0441 \u0443\u0442\u0440\u0430 \u0434\u043E \u0432\u0435\u0447\u0435\u0440\u0430. \u041D\u0430\u0436\u0438\u043C\u0430\u0439 \u043D\u0430 \u043B\u044E\u0431\u043E\u0435 \u0434\u0435\u043B\u043E \u0438 \u0441\u043C\u043E\u0442\u0440\u0438, \u0438\u0437 \u043A\u0430\u043A\u0438\u0445 \u0448\u0430\u0433\u043E\u0432 \u043E\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u0438\u0442. \u041E\u0442\u043A\u0440\u043E\u0439 \u0432\u0441\u0435 \u043F\u044F\u0442\u044C.",
    "Endi eng muhimi: bunday ish yolg\u02BBiz choy emas. Bunday ko\u02BBrsatmalar kun bo\u02BByi, ertalabdan kechgacha uchraydi. Istalgan ishni bos va u qanday qadamlardan iboratligini ko\u02BBring. Beshtasini ham oching.",
    "And here is the main thing: tea is not the only one like that. You have instructions like it all day, from morning to night. Tap any of them and see what steps it is made of. Open all five."
  ],
  s4_done: ["\u0412\u0441\u0451 \u044D\u0442\u043E \u0442\u044B \u0434\u0435\u043B\u0430\u0435\u0448\u044C \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C, \u0438 \u0432\u0441\u0451 \u044D\u0442\u043E \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B. \u0422\u044B \u0434\u0430\u0432\u043D\u043E \u0438\u043C\u0438 \u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0448\u044C\u0441\u044F \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u043D\u0435 \u0437\u043D\u0430\u043B, \u043A\u0430\u043A \u043E\u043D\u0438 \u043D\u0430\u0437\u044B\u0432\u0430\u044E\u0442\u0441\u044F.", "Bularning hammasini siz har kuni qilasiz, va bularning hammasi algoritm. Siz ulardan ancha vaqtdan beri foydalanib kelyapsiz \u2014 shunchaki nomini bilmagansiz.", "You do all of this every day, and every one of them is an algorithm. You have been using them for ages, you just did not know their name."],
  s5_q: ["\u041E\u0434\u0438\u043D \u0448\u0430\u0433 \u043F\u0440\u043E\u043F\u0430\u043B. \u041A\u0430\u043A\u043E\u0439?", "Bitta qadam yo\u02BBqoldi. Qaysi biri?", "One step is missing. Which one?"],
  s5_o: [
    { art: "kettle", t: ["\u0412\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u0432\u043E\u0434\u0443", "Suvni qaynatish", "Boil the water"] },
    { art: "leaves", t: ["\u041D\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0443", "Choy solish", "Add the tea"] },
    { art: "covered", t: ["\u041D\u0430\u043A\u0440\u044B\u0442\u044C \u0447\u0430\u0439\u043D\u0438\u043A", "Choynakni yopish", "Cover the pot"] },
    { art: "piyola", t: ["\u041D\u0430\u043B\u0438\u0442\u044C \u0432 \u043F\u0438\u0430\u043B\u0443", "Piyolaga quyish", "Pour into the piyola"] }
  ],
  s5_audio: [
    "\u0410 \u0442\u0435\u043F\u0435\u0440\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u044E, \u0437\u0430\u043F\u043E\u043C\u043D\u0438\u043B \u043B\u0438 \u0442\u044B \u043D\u0430\u0448\u0438 \u043F\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432. \u0427\u0430\u0439 \u0437\u0430\u0432\u0430\u0440\u0438\u043B\u0438 \u0441\u043D\u043E\u0432\u0430, \u043D\u043E \u043E\u0434\u0438\u043D \u0448\u0430\u0433 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0438. \u0412 \u043F\u0438\u0430\u043B\u0435 \u043E\u043A\u0430\u0437\u0430\u043B\u0430\u0441\u044C \u043F\u0440\u043E\u0441\u0442\u043E \u0433\u043E\u0440\u044F\u0447\u0430\u044F \u0432\u043E\u0434\u0430. \u041A\u0430\u043A\u043E\u0433\u043E \u0448\u0430\u0433\u0430 \u043D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442?",
    "Endi besh qadamimizni eslab qoldingizmi \u2014 tekshiraman. Choy yana damlandi, lekin bitta qadam yo\u02BBqoldi. Piyolada shunchaki issiq suv qoldi. Qaysi qadam tushib qoldi?",
    "Now let me check if you remember our five steps. The tea was brewed again but one step was lost. The piyola held plain hot water. Which step is missing?"
  ],
  s5_w: {
    0: ["\u0412\u043E\u0434\u0430 \u0431\u044B\u043B\u0430 \u0433\u043E\u0440\u044F\u0447\u0430\u044F \u2014 \u0437\u043D\u0430\u0447\u0438\u0442, \u0432\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u043E\u043D \u0443\u0441\u043F\u0435\u043B.", "Suv issiq edi \u2014 demak, qaynatishga ulgurgan.", "The water was hot, so he did boil it."],
    2: ["\u0411\u0435\u0437 \u043A\u0440\u044B\u0448\u043A\u0438 \u0447\u0430\u0439 \u0441\u043B\u0430\u0431\u0435\u0435, \u043D\u043E \u0432\u0441\u0451-\u0442\u0430\u043A\u0438 \u0447\u0430\u0439.", "Qopqoqsiz choy suyuqroq, lekin baribir choy.", "Without the lid tea is weaker, but still tea."],
    3: ["\u041D\u0430\u043B\u0438\u0442\u044C \u043E\u043D \u043D\u0430\u043B\u0438\u043B \u2014 \u0438\u043D\u0430\u0447\u0435 \u043F\u0438\u0430\u043B\u0430 \u0431\u044B\u043B\u0430 \u0431\u044B \u043F\u0443\u0441\u0442\u0430\u044F.", "Quygan \u2014 bo\u02BBlmasa piyola bo\u02BBsh bo\u02BBlardi.", "He did pour it, or the piyola would be empty."]
  },
  s6_q: ["\u0427\u0442\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F \u043F\u043E \u044D\u0442\u043E\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438?", "Bu ko\u02BBrsatma bo\u02BByicha nima chiqadi?", "What will this instruction make?"],
  s6_steps: [
    ["\u041E\u0431\u0436\u0430\u0440\u0438\u0442\u044C \u043C\u044F\u0441\u043E", "Go\u02BBshtni qovurish", "Fry the meat"],
    ["\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043B\u0443\u043A \u0438 \u043C\u043E\u0440\u043A\u043E\u0432\u044C", "Piyoz va sabzi qo\u02BBshish", "Add onion and carrot"],
    ["\u041D\u0430\u043B\u0438\u0442\u044C \u0432\u043E\u0434\u0443", "Suv quyish", "Pour in water"],
    ["\u0417\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0440\u0438\u0441", "Guruch solish", "Add the rice"],
    ["\u041D\u0430\u043A\u0440\u044B\u0442\u044C \u043A\u0440\u044B\u0448\u043A\u043E\u0439", "Qopqog\u02BBini yopish", "Put the lid on"]
  ],
  // Манты сняты заказчиком 11.09: их не узнавали. Вариантов три — так даже
  // лучше, каждый ясно отличается от других.
  // Верный ответ — ГОТОВЫЙ плов, а не шаг «засыпать рис» (правка 12 от 11.09):
  // раньше в ответах стоял кусок самого задания, и вопрос не читался.
  s6_o: [
    { art: "palovready", t: ["\u041F\u043B\u043E\u0432", "Palov", "Palov"] },
    { art: "piyola", t: ["\u0427\u0430\u0439", "Choy", "Tea"] },
    { art: "salad", t: ["\u0421\u0430\u043B\u0430\u0442", "Salat", "Salad"] },
    { art: "kazanmeat", t: ["\u041C\u044F\u0441\u043E \u0432 \u043A\u0430\u0437\u0430\u043D\u0435", "Qozonda go\u02BBsht", "Meat in the kazan"] }
  ],
  s6_audio: [
    "\u0421 \u0447\u0430\u0435\u043C \u0442\u044B \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0441\u044F. \u0414\u0435\u0440\u0436\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044E \u043F\u043E\u0442\u0440\u0443\u0434\u043D\u0435\u0435 \u2014 \u0438 \u043D\u0430 \u044D\u0442\u043E\u0442 \u0440\u0430\u0437 \u0431\u0435\u0437 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0432 \u043A\u043E\u043D\u0446\u0435. \u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0439 \u0435\u0451 \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0438 \u0441\u043A\u0430\u0436\u0438, \u0447\u0442\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F. \u0413\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u043D\u0435 \u043D\u0430\u0434\u043E, \u043D\u0430\u0434\u043E \u0434\u043E\u0433\u0430\u0434\u0430\u0442\u044C\u0441\u044F.",
    "Choyni uddaladingiz. Mana sizga qiyinrog\u02BBi \u2014 bu safar oxirida rasmsiz. Uni oxirigacha o\u02BBqi va nima chiqishini ayting. Pishirish shart emas, topish kerak.",
    "You got the tea right! Here is a harder instruction, and this time with no picture at the end. Read it to the end and say what it makes. No cooking, just figure it out."
  ],
  s6_w: {
    1: ["\u0412 \u0447\u0430\u0435 \u043D\u0435\u0442 \u043D\u0438 \u043C\u044F\u0441\u0430, \u043D\u0438 \u0440\u0438\u0441\u0430. \u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0438 \u043F\u0435\u0440\u0432\u044B\u0439 \u0448\u0430\u0433.", "Choyda na go\u02BBsht, na guruch bor. Birinchi qadamga qarang.", "Tea has no meat and no rice. Look at step one."],
    2: ["\u0421\u0430\u043B\u0430\u0442 \u043D\u0435 \u0436\u0430\u0440\u044F\u0442 \u0438 \u043D\u0435 \u043D\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0442 \u043A\u0440\u044B\u0448\u043A\u043E\u0439.", "Salat qovurilmaydi, qopqoq bilan ham yopilmaydi.", "Salad is not fried or covered with a lid."],
    3: ["\u042D\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0440\u0432\u044B\u0439 \u0448\u0430\u0433 \u2014 \u043C\u044F\u0441\u043E \u0432 \u043A\u0430\u0437\u0430\u043D\u0435. \u0410 \u044F \u0441\u043F\u0440\u043E\u0441\u0438\u043B, \u0447\u0442\u043E \u0432\u044B\u0439\u0434\u0435\u0442 \u0432 \u0441\u0430\u043C\u043E\u043C \u043A\u043E\u043D\u0446\u0435.", "Bu faqat birinchi qadam \u2014 qozondagi go\u02BBsht. Men esa eng oxirida nima chiqishini so\u02BBradim.", "That is only step one, meat in the kazan. I asked what comes out at the very end."]
  },
  s7_title: ["\u0422\u044B \u043D\u0430\u0443\u0447\u0438\u043B\u0441\u044F", "Siz o\u02BBrgandingiz", "You learned to"],
  s7_em: ["\u0437\u0430\u043C\u0435\u0447\u0430\u0442\u044C \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B", "algoritmlarni sezishni", "spot algorithms"],
  s7_pre: ["\u041D\u0430\u0447\u0430\u043B\u0438 \u043C\u044B \u0441 \u043E\u0434\u043D\u043E\u0439 \u043F\u0438\u0430\u043B\u044B \u0447\u0430\u044F, \u0430 \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u0438 \u0446\u0435\u043B\u044B\u043C \u043A\u0430\u0437\u0430\u043D\u043E\u043C \u043F\u043B\u043E\u0432\u0430. \u0421\u043C\u043E\u0442\u0440\u0438, \u0447\u0442\u043E \u0442\u044B \u0442\u0435\u043F\u0435\u0440\u044C \u0437\u043D\u0430\u0435\u0448\u044C.", "Bir piyola choydan boshladik, butun qozon palov bilan tugatdik. Qarang, endi nimani bilasiz.", "We started with one piyola of tea and finished with a whole pot of palov. Look what you know now."],
  s7_slides: [
    {
      row: ["kettle", "leaves", "piyola"],
      ttl: ["\u0427\u0442\u043E \u0442\u0430\u043A\u043E\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C", "Algoritm nima", "What an algorithm is"],
      sb: ["\u0428\u0430\u0433\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0430\u044E\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442", "Natija beradigan tartibli qadamlar", "Steps in order that give a result"],
      audio: [
        "\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u2014 \u044D\u0442\u043E \u0448\u0430\u0433\u0438 \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0430\u044E\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442. \u0412\u0441\u0435 \u0442\u0440\u0438 \u0447\u0430\u0441\u0442\u0438 \u0442\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u043E\u0431\u0440\u0430\u043B \u0441\u0430\u043C.",
        "Algoritm \u2014 natija beradigan tartibli qadamlar. Uchala qismni ham bugun o\u02BBzingiz yig\u02BBdingiz.",
        "An algorithm is steps in order that give you a result. You put all three parts together yourself today."
      ]
    },
    {
      row: ["piyola", "piyola"],
      num: false,
      ttl: ["\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0443 \u043B\u044E\u0431\u043E\u0433\u043E", "Har kimda ishlaydi", "Works for anyone"],
      sb: ["\u0418 \u0443 \u0442\u0435\u0431\u044F, \u0438 \u0443 \u043C\u0435\u043D\u044F, \u0438 \u0443 \u0441\u043E\u0441\u0435\u0434\u0430", "Sizda ham, menda ham, qo\u02BBshningizda ham", "For you, for me, for your neighbour"],
      audio: [
        "\u0418 \u043E\u043D \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0443 \u043B\u044E\u0431\u043E\u0433\u043E, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u0442\u0435\u0431\u044F. \u0425\u043E\u0442\u044C \u0443 \u043C\u0435\u043D\u044F, \u0445\u043E\u0442\u044C \u0443 \u0441\u043E\u0441\u0435\u0434\u0430 \u2014 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043E\u0434\u0438\u043D.",
        "U faqat sendagina emas, har kimda ishlaydi. Menda ham, qo\u02BBshningizda ham \u2014 natija bir xil.",
        "And it works for anyone, not just you. For me, for your neighbour, the result is the same."
      ]
    },
    {
      row: ["kettle", "piyola"],
      cross: true,
      num: false,
      ttl: ["\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0448\u044C \u0448\u0430\u0433", "Qadam tushib qolsa", "Skip a step"],
      sb: ["\u0418 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F \u0441\u043E\u0432\u0441\u0435\u043C \u0434\u0440\u0443\u0433\u043E\u0435", "Butunlay boshqa narsa chiqadi", "And you get something else entirely"],
      audio: [
        "\u0410 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0448\u044C \u0448\u0430\u0433 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u043F\u0443\u0442\u0430\u0435\u0448\u044C \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u2014 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0441\u044F \u0434\u0440\u0443\u0433\u043E\u0435. \u0422\u044B \u0441\u0430\u043C \u044D\u0442\u043E \u0432\u0438\u0434\u0435\u043B: \u0431\u0435\u0437 \u0437\u0430\u0432\u0430\u0440\u043A\u0438 \u0432 \u043F\u0438\u0430\u043B\u0435 \u0431\u044B\u043B\u0430 \u043F\u0440\u043E\u0441\u0442\u043E \u0432\u043E\u0434\u0430. \u0418 \u0435\u0449\u0451 \u0442\u044B \u043D\u0430\u0443\u0447\u0438\u043B\u0441\u044F \u0447\u0438\u0442\u0430\u0442\u044C \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044E \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0438 \u0443\u0433\u0430\u0434\u044B\u0432\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442, \u043D\u0435 \u043D\u0430\u0447\u0430\u0432 \u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C.",
        "Qadamni tashlab ketsangiz yoki tartibni chalkashtirsangiz \u2014 boshqa narsa chiqadi. Buni o\u02BBzingiz ko\u02BBrdingiz: choysiz piyolada shunchaki suv edi. Va yana siz ko\u02BBrsatmani oxirigacha o\u02BBqib, pishirmasdan natijani topishni o\u02BBrgandingiz.",
        "Skip a step or mix up the order and you get something else. You saw it yourself: without the tea leaves the piyola held plain water. And you also learned to read an instruction to the end and guess the result before you start."
      ]
    }
  ],
  s7_ask: ["\u0410 \u0433\u0434\u0435 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u0432 \u0442\u0432\u043E\u0435\u0439 \u0436\u0438\u0437\u043D\u0438?", "Sizning hayotingizda algoritm qayerda?", "Where is an algorithm in your life?"],
  // Ответ ребёнка не должен уходить в пустоту: на каждый выбор Глюк отвечает
  // своим и прощается. Без этого последний вопрос стоял просто для вида.
  s7_byePick: [
    [
      "\u0423\u0442\u0440\u043E\u043C \u0434\u043E\u043C\u0430 \u2014 \u0442\u043E\u0447\u043D\u043E. \u0417\u0430\u0432\u0442\u0440\u0430 \u043F\u043E\u0441\u0447\u0438\u0442\u0430\u0439, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0448\u0430\u0433\u043E\u0432, \u043F\u043E\u043A\u0430 \u0441\u043E\u0431\u0435\u0440\u0451\u0448\u044C\u0441\u044F \u0432 \u0448\u043A\u043E\u043B\u0443.",
      "Ertalab uyda \u2014 aniq. Ertaga sanab ko\u02BBring: maktabga tayyorlanguningcha nechta qadam bor ekan.",
      "At home in the morning, exactly. Tomorrow count the steps it takes to get ready for school."
    ],
    [
      "\u041F\u043E \u0434\u043E\u0440\u043E\u0433\u0435 \u0432 \u0448\u043A\u043E\u043B\u0443 \u2014 \u0432\u0435\u0440\u043D\u043E. \u0422\u0430\u043C \u0443 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u0430 \u0441\u0432\u043E\u0451 \u043C\u0435\u0441\u0442\u043E.",
      "Maktab yo\u02BBlida \u2014 to\u02BBg\u02BBri. U yerda har bir burilish o\u02BBz o\u02BBrnida.",
      "On the way to school, right. You take the turns in the right order, one after another."
    ],
    [
      "\u0412 \u0438\u0433\u0440\u0435 \u2014 \u043A\u043E\u043D\u0435\u0447\u043D\u043E. \u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0438\u0433\u0440\u044B \u2014 \u044D\u0442\u043E \u0438 \u0435\u0441\u0442\u044C \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C.",
      "O\u02BByinda \u2014 albatta. O\u02BByin qoidalari \u2014 bu ham algoritm.",
      "When you play, of course. The rules of a game are an algorithm too."
    ],
    [
      "\u041D\u0430 \u043A\u0443\u0445\u043D\u0435 \u2014 \u0441\u0430\u043C\u043E\u0435 \u043C\u0435\u0441\u0442\u043E. \u0422\u0430\u043C \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C \u0432 \u043A\u0430\u0436\u0434\u043E\u0439 \u043A\u0430\u0441\u0442\u0440\u044E\u043B\u0435.",
      "Oshxonada \u2014 eng mos joy. U yerda har bir qozonda algoritm bor.",
      "In the kitchen, the perfect place. There is an algorithm in every pot."
    ]
  ],
  ui_bye: ["\u0414\u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0438!", "Ko\u02BBrishguncha!", "See you!"],
  s7_c: [
    ["\u0423\u0442\u0440\u043E\u043C \u0434\u043E\u043C\u0430", "Ertalab uyda", "At home in the morning"],
    ["\u041F\u043E \u0434\u043E\u0440\u043E\u0433\u0435 \u0432 \u0448\u043A\u043E\u043B\u0443", "Maktab yo\u02BBlida", "On the way to school"],
    ["\u041A\u043E\u0433\u0434\u0430 \u0438\u0433\u0440\u0430\u044E", "O\u02BBynaganimda", "When I play"],
    ["\u041A\u043E\u0433\u0434\u0430 \u043F\u043E\u043C\u043E\u0433\u0430\u044E \u043D\u0430 \u043A\u0443\u0445\u043D\u0435", "Oshxonada yordam berganimda", "When I help in the kitchen"]
  ],
  // Последние слова урока. Раньше они звучали на мосту у Кодди, теперь —
  // в конце прощания Глюка, потому что моста больше нет.
  s7_bye: ["\u0423\u0432\u0438\u0434\u0438\u043C\u0441\u044F \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0443\u0440\u043E\u043A\u0435!", "Keyingi darsda ko\u02BBrishguncha!", "See you in the next lesson!"],
  s7_hi: ["\u041E\u0442\u043B\u0438\u0447\u043D\u043E!", "Ajoyib!", "Excellent!"],
  s7_mid: ["\u0425\u043E\u0440\u043E\u0448\u043E!", "Yaxshi!", "Good!"],
  s7_low: ["\u0420\u0430\u0437\u0431\u0435\u0440\u0451\u043C \u0435\u0449\u0451 \u0440\u0430\u0437.", "Yana ko\u02BBrib chiqamiz.", "We will go through it again."]
};
var CARDS = [
  { art: "piyola", yes: true, text: ["\u0417\u0430\u0432\u0430\u0440\u0438\u0442\u044C \u0447\u0430\u0439", "Choy damlash", "Brewing tea"] },
  { art: "heart", yes: false, text: ["\u042F \u043B\u044E\u0431\u043B\u044E \u043F\u043B\u043E\u0432", "Men palovni yaxshi ko\u02BBraman", "I love palov"] },
  { art: "bedmade", yes: true, text: ["\u0417\u0430\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0440\u043E\u0432\u0430\u0442\u044C", "Karavot yig\u02BBish", "Making the bed"] },
  { art: "sunhot", yes: false, text: ["\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0436\u0430\u0440\u043A\u043E", "Bugun issiq", "It is hot today"] },
  { art: "legotower", yes: true, text: ["\u0421\u043E\u0431\u0440\u0430\u0442\u044C LEGO \u043F\u043E \u0441\u0445\u0435\u043C\u0435", "Sxema bo\u02BByicha LEGO yig\u02BBish", "Building LEGO from a plan"] },
  { art: "cat", yes: false, text: ["\u0423 \u043C\u0435\u043D\u044F \u0435\u0441\u0442\u044C \u043A\u043E\u0442", "Mening mushugim bor", "I have a cat"] }
];
var THINGS = [
  {
    art: "piyola",
    name: ["\u0417\u0430\u0432\u0430\u0440\u0438\u0442\u044C \u0447\u0430\u0439", "Choy damlash", "Brew tea"],
    sa: ["kettle", "leaves", "covered"],
    steps: [["\u0412\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u0432\u043E\u0434\u0443", "Suv qaynatish", "Boil water"], ["\u041D\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0443", "Choy solish", "Add tea"], ["\u0417\u0430\u043B\u0438\u0442\u044C \u0438 \u043D\u0430\u043A\u0440\u044B\u0442\u044C", "Quyib, yopish", "Pour and cover"]]
  },
  {
    art: "schoolgate",
    name: ["\u0414\u043E\u0439\u0442\u0438 \u0434\u043E \u0448\u043A\u043E\u043B\u044B", "Maktabga borish", "Walk to school"],
    sa: ["mahalla", "zebra", "schoolgate"],
    steps: [["\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043C\u0430\u0445\u0430\u043B\u043B\u0438", "Mahalladan chiqish", "Leave the mahalla"], ["\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043F\u043E \u0437\u0435\u0431\u0440\u0435", "Zebradan o\u02BBtish", "Cross at the stripes"], ["\u0414\u043E\u0439\u0442\u0438 \u0434\u043E \u0432\u043E\u0440\u043E\u0442", "Darvozagacha borish", "Reach the gate"]]
  },
  {
    art: "legotower",
    name: ["\u0421\u043E\u0431\u0440\u0430\u0442\u044C LEGO", "LEGO yig\u02BBish", "Build LEGO"],
    sa: ["legoplan", "legoplace", "legotower"],
    steps: [["\u041D\u0430\u0439\u0442\u0438 \u0434\u0435\u0442\u0430\u043B\u044C \u043D\u0430 \u0441\u0445\u0435\u043C\u0435", "Sxemada detalni topish", "Find the piece"], ["\u041F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043D\u0430 \u043C\u0435\u0441\u0442\u043E", "Joyiga qo\u02BByish", "Put it in place"], ["\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439", "Keyingisiga o\u02BBtish", "Move to the next"]]
  },
  {
    art: "rice",
    name: ["\u041F\u0440\u0438\u0433\u043E\u0442\u043E\u0432\u0438\u0442\u044C \u043F\u043B\u043E\u0432", "Palov pishirish", "Cook palov"],
    sa: ["kazanmeat", "carrot", "rice"],
    steps: [["\u041E\u0431\u0436\u0430\u0440\u0438\u0442\u044C \u043C\u044F\u0441\u043E", "Go\u02BBsht qovurish", "Fry the meat"], ["\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043C\u043E\u0440\u043A\u043E\u0432\u044C", "Sabzi qo\u02BBshish", "Add carrot"], ["\u0417\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0440\u0438\u0441", "Guruch solish", "Add rice"]]
  },
  // Правка 10: портфель собирают по-настоящему — открыл, сложил, закрыл.
  // Правка 11: дело «Помыть руки» снято целиком, дел стало пять.
  {
    art: "bagclosed",
    name: ["\u0421\u043E\u0431\u0440\u0430\u0442\u044C \u043F\u043E\u0440\u0442\u0444\u0435\u043B\u044C", "Sumka yig\u02BBish", "Pack the backpack"],
    sa: ["bagopen", "books", "bagclosed"],
    steps: [["\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0440\u0442\u0444\u0435\u043B\u044C", "Sumkani ochish", "Open the backpack"], ["\u0421\u043B\u043E\u0436\u0438\u0442\u044C \u043A\u043D\u0438\u0433\u0438", "Kitob solish", "Put books in"], ["\u0417\u0430\u043A\u0440\u044B\u0442\u044C", "Yopish", "Close it"]]
  }
];
var TEA_ART = ["kettle", "leaves", "pourhot", "covered", "piyola"];
var PALOV_ART = ["kazanmeat", "carrot", "waterpour", "rice", "lidon"];
var P = {
  pr: "#fe5b1a",
  bl: "#019acb",
  gr: "#10b981",
  yl: "#fcd34d",
  nv: "#2A3C74",
  pan: "#D3D9EC",
  pan2: "#A9B3D0",
  cr: "#FBFDF0",
  br: "#8B5A2B",
  br2: "#C88A4A",
  meat: "#C0552F",
  car: "#F2941B",
  rice: "#FFF3DC",
  tea: "#B45309",
  steam: "#9FB3CC",
  sk: "#FFCF9E",
  hair: "#3A2A1C",
  gn: "#1FA463",
  red: "#E24B4B",
  grn2: "#DBF2E6"
};
var O = P.nv;
var steam = (x, y, d) => `<path d="M${x} ${y}c4-5-4-9 0-14" fill="none" stroke="${P.steam}" stroke-width="3.4" stroke-linecap="round" opacity="0">
<animate attributeName="opacity" values="0;.9;.9;0" dur="3.4s" begin="${d}s" repeatCount="indefinite"/>
<animateTransform attributeName="transform" type="translate" values="0 6;0 -12" dur="3.4s" begin="${d}s" repeatCount="indefinite"/></path>`;
var spark = (x, y, r, d) => `<path d="M${x} ${y - r}l${r * 0.3} ${r * 0.7} ${r * 0.7} ${r * 0.3}-${r * 0.7} ${r * 0.3}-${r * 0.3} ${r * 0.7}-${r * 0.3}-${r * 0.7}-${r * 0.7}-${r * 0.3} ${r * 0.7}-${r * 0.3}Z" fill="${P.yl}" stroke="${O}" stroke-width="1.6" stroke-linejoin="round">
<animateTransform attributeName="transform" type="scale" values="0.7;1.15;0.7" dur="2s" begin="${d}s" repeatCount="indefinite" additive="sum"/></path>`;
var miniPiyola = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0h34c0 10-7 17-17 17S0 10 0 0Z" fill="${P.cr}" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="17" cy="0" rx="17" ry="5" fill="#fff" stroke="${O}" stroke-width="3"/><ellipse cx="17" cy="0" rx="12" ry="3" fill="${P.tea}"/></g>`;
var ordTile = (x, y, n, inner) => `<g><rect x="${x}" y="${y}" width="30" height="30" rx="7" fill="#fff" stroke="${O}" stroke-width="3"/>
<text x="${x + 5}" y="${y + 12}" font-family="monospace" font-size="10" font-weight="700" fill="${P.pr}" stroke="none">${n}</text>
<g transform="translate(${x} ${y})">${inner}</g></g>`;
var oLeaf = `<path d="M8 18h14v5a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4Z" fill="${P.pan}"/><ellipse cx="15" cy="18" rx="7" ry="2.6" fill="${P.pan2}"/><circle cx="12" cy="12" r="2.2" fill="${P.tea}" stroke="none"/><circle cx="18" cy="10.5" r="1.8" fill="${P.tea}" stroke="none"/>`;
var oPour = `<path d="M6 14h14v6a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4Z" fill="${P.pan}"/><path d="M20 16c3.5 0 4.5 2.5 4.5 4.5" fill="none" stroke-width="2.2"/><path d="M24.5 22v4" fill="none" stroke="${P.bl}" stroke-width="2.4"/>`;
var oTea = `<path d="M6 15h18c0 6.5-4 10-9 10s-9-3.5-9-10Z" fill="${P.cr}"/><ellipse cx="15" cy="15" rx="9" ry="3" fill="${P.tea}"/>`;
var oFail = `<path d="M6 15h18c0 6.5-4 10-9 10s-9-3.5-9-10Z" fill="${P.cr}"/><ellipse cx="15" cy="15" rx="9" ry="3" fill="#A8D4F0"/><ellipse cx="11" cy="14.4" rx="2.4" ry="1.5" fill="${P.tea}" stroke="none" transform="rotate(-18 11 14.4)"/><ellipse cx="18.5" cy="15.6" rx="2.2" ry="1.4" fill="${P.tea}" stroke="none" transform="rotate(14 18.5 15.6)"/><ellipse cx="15" cy="13.4" rx="1.7" ry="1.1" fill="${P.tea}" stroke="none"/>`;
var numTile = (x, y, n, inner) => `<g><rect x="${x}" y="${y}" width="34" height="34" rx="8" fill="#fff" stroke="${O}" stroke-width="3"/>
<text x="${x + 6}" y="${y + 13}" font-family="monospace" font-size="11" font-weight="700" fill="${P.pr}">${n}</text>${inner}</g>`;
var SC = {
  /* ═══ ЧАЙ ═══ */
  kettle: `<ellipse cx="50" cy="93" rx="27" ry="4" fill="#000" opacity=".1"/>
<g fill="${P.pr}"><path d="M38 90c0-7 5-9 5-15 3 3 3 5 3 7 2-3 4-6 4-10 5 5 7 11 7 18Z">
<animateTransform attributeName="transform" type="scale" values="1 1;1 .88;1 1" dur=".8s" repeatCount="indefinite" additive="sum"/></path></g>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M22 40h56v26a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10Z" fill="${P.pan}"/>
<path d="M22 52c-7-1-11-6-11-11 0-4 3-7 7-7l6 6Z" fill="${P.pan2}"/>
<path d="M32 38c0-9 8-14 18-14s18 5 18 14" fill="none"/>
<rect x="42" y="30" width="16" height="9" rx="4" fill="${P.pan2}"/>
<path d="M30 60c8 3 32 3 40 0" fill="none" stroke-width="2.4" opacity=".45"/></g>
${steam(16, 30, 0)}${steam(50, 22, 1.1)}${steam(70, 26, 2.1)}`,
  leaves: `<ellipse cx="50" cy="93" rx="27" ry="4" fill="#000" opacity=".1"/>
<g fill="${P.tea}" stroke="${O}" stroke-width="1.8" stroke-linejoin="round">
<ellipse cx="44" cy="20" rx="5" ry="3" transform="rotate(-25 44 20)"><animateTransform attributeName="transform" type="translate" values="0 0;2 40" dur="2.4s" repeatCount="indefinite" additive="sum"/><animate attributeName="opacity" values="1;1;0" dur="2.4s" repeatCount="indefinite"/></ellipse>
<ellipse cx="56" cy="14" rx="5.4" ry="3.2" transform="rotate(20 56 14)"><animateTransform attributeName="transform" type="translate" values="0 0;-3 44" dur="2.4s" begin=".55s" repeatCount="indefinite" additive="sum"/><animate attributeName="opacity" values="1;1;0" dur="2.4s" begin=".55s" repeatCount="indefinite"/></ellipse>
<ellipse cx="49" cy="10" rx="4.4" ry="2.8" transform="rotate(-8 49 10)"><animateTransform attributeName="transform" type="translate" values="0 0;1 48" dur="2.4s" begin="1.2s" repeatCount="indefinite" additive="sum"/><animate attributeName="opacity" values="1;1;0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></ellipse></g>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M26 56h44v14a12 12 0 0 1-12 12H38a12 12 0 0 1-12-12Z" fill="${P.pan}"/>
<path d="M70 60c8 1 12 6 12 11 0 4-3 7-6 8" fill="none"/>
<path d="M26 62c-6 1-9 5-9 9" fill="none"/>
<ellipse cx="48" cy="56" rx="22" ry="6" fill="${P.pan2}"/>
<ellipse cx="48" cy="56" rx="15" ry="3.6" fill="#2A3C74" opacity=".5" stroke="none"/></g>`,
  pourhot: `<ellipse cx="56" cy="93" rx="27" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g transform="rotate(-34 24 30)">
<path d="M6 14h34v16a9 9 0 0 1-9 9H15a9 9 0 0 1-9-9Z" fill="${P.pan}"/>
<path d="M40 20c7 2 10 6 10 10" fill="none"/>
<path d="M14 12c0-7 6-11 12-11s12 4 12 11" fill="none"/></g>
<path d="M32 56h44v14a12 12 0 0 1-12 12H44a12 12 0 0 1-12-12Z" fill="${P.pan}"/>
<ellipse cx="54" cy="56" rx="22" ry="6" fill="${P.pan2}"/>
<path d="M76 60c8 1 12 6 12 11" fill="none"/></g>
<g stroke="${P.bl}" stroke-width="5" stroke-linecap="round" fill="none">
<path d="M40 30c3 8 6 14 9 20"><animate attributeName="stroke-dasharray" values="0 40;28 12;0 40" dur="1.5s" repeatCount="indefinite"/></path></g>
${steam(70, 44, 0)}${steam(24, 50, 1.4)}`,
  covered: `<ellipse cx="50" cy="93" rx="29" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M78 58c8 1 12 6 12 11 0 4-3 7-6 8" fill="none"/>
<path d="M16 40c8-13 20-19 34-19s26 6 34 19c2 26-12 40-34 40S14 66 16 40Z" fill="${P.pr}">
<animateTransform attributeName="transform" type="scale" values="1 1;1.015 .985;1 1" dur="3.6s" repeatCount="indefinite" additive="sum"/></path>
<path d="M16 44c9 8 21 12 34 12s25-4 34-12" fill="none" stroke-width="2.6" opacity=".55"/>
<circle cx="32" cy="40" r="3.2" fill="${P.yl}"/><circle cx="50" cy="45" r="3.2" fill="${P.yl}"/><circle cx="68" cy="40" r="3.2" fill="${P.yl}"/>
<circle cx="50" cy="18" r="5" fill="${P.pan2}"/></g>
${steam(84, 44, 0.3)}`,
  piyola: `<ellipse cx="50" cy="94" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M26 86h48" fill="none"/>
<path d="M22 56h56c0 17-12 29-28 29S22 73 22 56Z" fill="${P.cr}"/>
<ellipse cx="50" cy="56" rx="28" ry="8" fill="#fff"/>
<ellipse cx="50" cy="57" rx="22" ry="5.4" fill="${P.tea}" stroke-width="2.2"/>
<ellipse cx="43" cy="56" rx="6" ry="1.8" fill="#fff" opacity=".4" stroke="none"/>
<g fill="${P.bl}" stroke="none"><circle cx="34" cy="70" r="2.6"/><circle cx="50" cy="74" r="2.6"/><circle cx="66" cy="70" r="2.6"/></g></g>
${steam(38, 44, 0)}${steam(52, 40, 1.2)}${steam(64, 44, 2.2)}`,
  /* ═══ ПЛОВ ═══ */
  kazanmeat: `<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 48h10M78 48h10" fill="none" stroke-width="5"/>
<path d="M16 44h68c0 24-15 42-34 42S16 68 16 44Z" fill="${P.nv}"/>
<ellipse cx="50" cy="44" rx="34" ry="9" fill="${P.pan2}"/>
<ellipse cx="50" cy="45" rx="27" ry="6.5" fill="#3A2A22"/>
<g fill="${P.meat}" stroke-width="2"><ellipse cx="40" cy="44" rx="8" ry="5"/><ellipse cx="58" cy="47" rx="7" ry="4.6"/><ellipse cx="50" cy="40" rx="6" ry="4"/></g></g>
${steam(36, 26, 0)}${steam(52, 20, 1.1)}${steam(66, 26, 2.2)}`,
  carrot: `<ellipse cx="50" cy="93" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 78h72a3 3 0 0 1 0 6H14a3 3 0 0 1 0-6Z" fill="${P.br2}"/>
<g fill="${P.car}"><path d="M32 30l7 44c.6 4 5 4 5.6 0L50 34Z"/><path d="M56 38l6 36c.6 3.6 4.4 3.6 5 0L71 42Z"/></g>
<g fill="none" stroke="#fff" stroke-width="2" opacity=".5"><path d="M36 46h9"/><path d="M38 58h8"/><path d="M59 52h8"/></g>
<g fill="${P.gn}"><path d="M32 30c-7-6-4-14 3-12s6 8 4 12Z"/><path d="M50 34c1-11 8-13 11-7s-3 9-7 9Z"/><path d="M56 38c-6-8-1-14 5-11s3 9 0 11Z"/></g></g>`,
  waterpour: `<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g transform="rotate(-30 22 26)"><path d="M6 12h30v14a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8Z" fill="${P.pan}"/><path d="M36 16c6 2 9 5 9 9" fill="none"/></g>
<path d="M12 52h10M78 52h10" fill="none" stroke-width="5"/>
<path d="M16 48h68c0 22-15 38-34 38S16 68 16 48Z" fill="${P.nv}"/>
<ellipse cx="50" cy="48" rx="34" ry="9" fill="${P.pan2}"/>
<ellipse cx="50" cy="49" rx="27" ry="6.5" fill="${P.bl}"/></g>
<g stroke="${P.bl}" stroke-width="5" stroke-linecap="round" fill="none">
<path d="M36 30c4 8 7 13 10 17"><animate attributeName="stroke-dasharray" values="0 36;24 12;0 36" dur="1.5s" repeatCount="indefinite"/></path></g>`,
  rice: `<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".1"/>
<g fill="${P.rice}" stroke="${O}" stroke-width="1.6" stroke-linejoin="round">
<ellipse cx="42" cy="16" rx="4.4" ry="2.6" transform="rotate(-20 42 16)"><animateTransform attributeName="transform" type="translate" values="0 0;2 24" dur="2s" repeatCount="indefinite" additive="sum"/><animate attributeName="opacity" values="1;1;0" dur="2s" repeatCount="indefinite"/></ellipse>
<ellipse cx="56" cy="12" rx="4.4" ry="2.6" transform="rotate(18 56 12)"><animateTransform attributeName="transform" type="translate" values="0 0;-2 26" dur="2s" begin=".6s" repeatCount="indefinite" additive="sum"/><animate attributeName="opacity" values="1;1;0" dur="2s" begin=".6s" repeatCount="indefinite"/></ellipse></g>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 52h10M78 52h10" fill="none" stroke-width="5"/>
<path d="M16 48h68c0 22-15 38-34 38S16 70 16 48Z" fill="${P.nv}"/>
<ellipse cx="50" cy="48" rx="34" ry="9" fill="${P.pan2}"/>
<path d="M24 48c5-7 15-11 26-11s21 4 26 11c-6 5-15 8-26 8s-20-3-26-8Z" fill="${P.rice}"/>
<g fill="${P.car}" stroke="none"><ellipse cx="40" cy="47" rx="5" ry="2" transform="rotate(-12 40 47)"/><ellipse cx="60" cy="49" rx="5" ry="2" transform="rotate(10 60 49)"/></g></g>`,
  lidon: `<ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 56h10M78 56h10" fill="none" stroke-width="5"/>
<path d="M16 52h68c0 22-15 36-34 36S16 72 16 52Z" fill="${P.nv}"/>
<g><path d="M12 50c0-11 17-19 38-19s38 8 38 19Z" fill="${P.pan2}"/>
<rect x="42" y="20" width="16" height="10" rx="5" fill="${P.pr}"/>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="2.6s" repeatCount="indefinite"/></g></g>
${steam(24, 26, 0)}${steam(76, 26, 1.3)}`,
  manti: `<ellipse cx="50" cy="93" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M16 62h68c0 14-15 24-34 24S16 76 16 62Z" fill="${P.pan}"/>
<ellipse cx="50" cy="62" rx="34" ry="8" fill="${P.pan2}"/>
<g fill="${P.cr}">
<path d="M32 62c0-9 5-15 11-15s11 6 11 15Z"/><path d="M32 62c0-9 5-15 11-15s11 6 11 15Z" fill="none" stroke-width="2.6"/>
<path d="M50 60c0-11 5-18 11-18s11 7 11 18Z"/><path d="M50 60c0-11 5-18 11-18s11 7 11 18Z" fill="none" stroke-width="2.6"/></g>
<g fill="none" stroke-width="2.2"><path d="M43 47v15"/><path d="M61 42v18"/><path d="M36 56c4-4 10-4 14 0"/><path d="M54 52c4-4 10-4 14 0"/></g></g>
${steam(38, 32, 0)}${steam(64, 28, 1.2)}`,
  salad: `<ellipse cx="50" cy="92" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 56h72c0 17-16 30-36 30S14 73 14 56Z" fill="#fff"/>
<ellipse cx="50" cy="56" rx="36" ry="9" fill="${P.pan}"/>
<g><path d="M26 54c4-10 14-14 22-10-6 6-14 10-22 10Z" fill="${P.gn}"/>
<path d="M52 52c6-9 16-11 22-6-7 5-15 8-22 6Z" fill="${P.gr}"/>
<circle cx="40" cy="52" r="6" fill="${P.red}"/><circle cx="62" cy="55" r="5" fill="${P.red}"/>
<circle cx="50" cy="49" r="4.4" fill="${P.car}"/></g></g>`,
  /* ═══ ЗУБЫ ═══ */
  brush: `<ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g transform="rotate(38 50 50)">
<path d="M46 74h8a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-8a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z" fill="${P.bl}"/>
<path d="M45 30h10v46h-10Z" fill="${P.bl}"/>
<path d="M43 22h14v10H43Z" fill="#0288B5"/>
<g stroke="${P.cr}" stroke-width="3.2"><path d="M45 22v-8"/><path d="M50 22v-9"/><path d="M55 22v-8"/></g>
<animateTransform attributeName="transform" type="rotate" values="34 50 50;42 50 50;34 50 50" dur="1.5s" repeatCount="indefinite"/></g></g>`,
  paste: `<ellipse cx="50" cy="92" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g transform="rotate(-16 50 58)">
<path d="M18 48h44c6 0 10 5 10 11s-4 11-10 11H18Z" fill="${P.cr}"/>
<path d="M18 48l-6 5 6 5-6 6 6 5-6 5 6 5" fill="none"/>
<rect x="72" y="52" width="12" height="14" rx="3" fill="${P.bl}"/>
<path d="M26 56h28" fill="none" stroke="${P.bl}" stroke-width="5" opacity=".7"/></g>
<path d="M84 50c6-5 12-2 14 3" fill="none" stroke="${P.gr}" stroke-width="7"/>
<path d="M84 50c6-5 12-2 14 3" fill="none" stroke-width="2"/></g>`,
  smile: `<ellipse cx="50" cy="93" rx="26" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 40c0-8 16-14 36-14s36 6 36 14c0 24-16 44-36 44S14 64 14 40Z" fill="${P.red}"/>
<path d="M18 42c8-6 20-9 32-9s24 3 32 9v6c0 8-14 13-32 13S18 56 18 48Z" fill="#fff"/>
<g stroke-width="2.2" fill="none"><path d="M34 34v25"/><path d="M50 33v27"/><path d="M66 34v25"/><path d="M18 47h64"/></g></g>
${spark(80, 26, 9, 0)}${spark(24, 30, 7, 1)}`,
  timer: `<ellipse cx="50" cy="93" rx="24" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M26 10h48M26 88h48" fill="none" stroke-width="5"/>
<path d="M32 14h36c0 16-13 22-13 34s13 18 13 34H32c0-16 13-22 13-34S32 30 32 14Z" fill="#EAF4FB"/>
<path d="M35 18h30c-1 12-12 18-12 18h-6s-11-6-12-18Z" fill="${P.yl}">
<animate attributeName="opacity" values="1;.25" dur="4s" repeatCount="indefinite"/></path>
<path d="M38 82h24c-1-10-9-14-12-14s-11 4-12 14Z" fill="${P.yl}">
<animate attributeName="opacity" values=".25;1" dur="4s" repeatCount="indefinite"/></path>
<path d="M50 46v10" fill="none" stroke="${P.yl}" stroke-width="2.6"/></g>
<text x="50" y="72" text-anchor="middle" font-family="monospace" font-size="13" font-weight="700" fill="${O}">2</text>`,
  /* ═══ ДОРОГА ═══ */
  mahalla: `<rect x="0" y="76" width="100" height="18" fill="${P.pan}"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M0 76h100" fill="none"/>
<rect x="70" y="60" width="7" height="18" fill="${P.br}"/>
<circle cx="74" cy="48" r="16" fill="${P.gn}"><animateTransform attributeName="transform" type="rotate" values="-2 74 62;2 74 62;-2 74 62" dur="4.5s" repeatCount="indefinite"/></circle>
<path d="M12 76V44l24-16 24 16v32Z" fill="${P.cr}"/>
<path d="M6 46 36 25l30 21" fill="none" stroke="${P.pr}" stroke-width="6"/>
<rect x="28" y="56" width="16" height="20" rx="2" fill="${P.br}"/>
<circle cx="40" cy="66" r="1.8" fill="${P.yl}" stroke="none"/></g>`,
  zebra: `<rect x="0" y="48" width="100" height="46" fill="${P.pan2}"/>
<g fill="#fff" stroke="${O}" stroke-width="2"><rect x="6" y="54" width="12" height="34" rx="2"/><rect x="26" y="54" width="12" height="34" rx="2"/><rect x="46" y="54" width="12" height="34" rx="2"/></g>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M84 88V60" fill="none" stroke-width="5"/>
<rect x="72" y="12" width="24" height="50" rx="9" fill="${P.nv}"/>
<circle cx="84" cy="24" r="6" fill="#5A2222"/>
<circle cx="84" cy="38" r="6" fill="#6A5418"/>
<circle cx="84" cy="52" r="6.5" fill="${P.gr}"><animate attributeName="opacity" values="1;.45;1" dur="1.8s" repeatCount="indefinite"/></circle></g>`,
  schoolgate: `<rect x="0" y="80" width="100" height="14" fill="${P.pan}"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M0 80h100" fill="none"/>
<path d="M50 22V8" fill="none" stroke-width="2.6"/>
<path d="M50 8h16l-5 6 5 6H50Z" fill="${P.pr}"><animateTransform attributeName="transform" type="scale" values="1 1;.86 1;1 1" dur="3s" repeatCount="indefinite" additive="sum"/></path>
<path d="M12 80V38l38-16 38 16v42Z" fill="${P.cr}"/>
<path d="M6 40 50 20l44 20" fill="none" stroke="${P.bl}" stroke-width="6"/>
<path d="M38 80V60a12 12 0 0 1 24 0v20Z" fill="${P.pr}"/>
<rect x="20" y="50" width="13" height="13" rx="2" fill="${P.bl}"/>
<rect x="67" y="50" width="13" height="13" rx="2" fill="${P.bl}"/></g>`,
  /* ═══ LEGO ═══ */
  legoplan: `<ellipse cx="50" cy="93" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="18" y="12" width="64" height="74" rx="6" fill="#fff"/>
<g stroke-dasharray="5 4" fill="none" stroke-width="2.4">
<rect x="30" y="54" width="40" height="14" rx="2"/><rect x="34" y="40" width="14" height="13" rx="2"/><rect x="54" y="40" width="14" height="13" rx="2"/></g>
<rect x="30" y="68" width="40" height="12" rx="2" fill="${P.bl}" stroke-width="2.4"/>
<g stroke-width="2.6" fill="none" opacity=".5"><path d="M28 22h30"/><path d="M28 30h18"/></g></g>`,
  legoplace: `<ellipse cx="50" cy="93" rx="26" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="70" width="56" height="16" rx="3" fill="${P.bl}"/>
<rect x="30" y="62" width="13" height="9" rx="3" fill="${P.bl}"/><rect x="57" y="62" width="13" height="9" rx="3" fill="${P.bl}"/>
<path d="M50 24v34" fill="none" stroke-width="2.4" stroke-dasharray="5 5" opacity=".6"/>
<g><rect x="34" y="36" width="32" height="16" rx="3" fill="${P.pr}"/>
<rect x="38" y="28" width="10" height="9" rx="3" fill="${P.pr}"/><rect x="52" y="28" width="10" height="9" rx="3" fill="${P.pr}"/>
<animateTransform attributeName="transform" type="translate" values="0 -14;0 8;0 6;0 -14" keyTimes="0;.55;.65;1" dur="2.6s" repeatCount="indefinite"/></g></g>
${spark(78, 64, 8, 1.4)}`,
  legotower: `<ellipse cx="50" cy="93" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="20" y="68" width="60" height="18" rx="3" fill="${P.bl}"/>
<rect x="28" y="46" width="44" height="18" rx="3" fill="${P.pr}"/>
<rect x="34" y="24" width="32" height="18" rx="3" fill="${P.yl}"/>
<g fill="${P.yl}"><rect x="38" y="16" width="10" height="9" rx="3"/><rect x="52" y="16" width="10" height="9" rx="3"/></g>
<g fill="${P.pr}"><rect x="32" y="38" width="10" height="9" rx="3"/><rect x="58" y="38" width="10" height="9" rx="3"/></g>
<g fill="${P.bl}"><rect x="26" y="60" width="10" height="9" rx="3"/><rect x="64" y="60" width="10" height="9" rx="3"/></g></g>`,
  /* ═══ ПРЯТКИ — в кадре всегда двое ═══ */
  count: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="0" y="86" width="100" height="8" fill="${P.pan}" stroke="none"/>
<rect x="72" y="46" width="12" height="42" fill="${P.br}"/>
<circle cx="78" cy="34" r="20" fill="${P.gn}"/>
<g><circle cx="66" cy="52" r="11" fill="${P.sk}"/>
<path d="M56 48c1-8 5-12 10-12s9 4 10 12c-3-4-6-5-10-5s-7 1-10 5Z" fill="${P.hair}"/>
<circle cx="61" cy="52" r="2.4" fill="${O}" stroke="none"/>
<path d="M74 58c4 0 6 2 6 5" fill="none" stroke="${P.sk}" stroke-width="7"/>
<animateTransform attributeName="transform" type="translate" values="0 0;-4 0;0 0" dur="3s" repeatCount="indefinite"/></g>
<path d="M14 88c0-14 8-22 18-22s18 8 18 22Z" fill="${P.bl}"/>
<circle cx="32" cy="42" r="19" fill="${P.sk}"/>
<path d="M13 38c1-13 9-20 19-20s18 7 19 20c-6-6-11-9-19-9s-13 3-19 9Z" fill="${P.hair}"/>
<path d="M18 42h28v11a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4Z" fill="${P.sk}"/>
<g fill="none" stroke-width="2.2"><path d="M25 46v11"/><path d="M32 44v13"/><path d="M39 46v11"/></g>
<path d="M20 62l-6 12M44 62l6 12" fill="none" stroke="${P.sk}" stroke-width="8"/></g>
<g font-family="monospace" font-size="15" font-weight="700" fill="${O}" text-anchor="middle">
<text x="32" y="14" opacity="0">1<animate attributeName="opacity" values="1;1;0;0;0;0" dur="3s" repeatCount="indefinite"/></text>
<text x="32" y="14" opacity="0">2<animate attributeName="opacity" values="0;0;1;1;0;0" dur="3s" repeatCount="indefinite"/></text>
<text x="32" y="14" opacity="0">3<animate attributeName="opacity" values="0;0;0;0;1;1" dur="3s" repeatCount="indefinite"/></text></g>`,
  search: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="0" y="86" width="100" height="8" fill="${P.pan}" stroke="none"/>
<rect x="74" y="44" width="12" height="44" fill="${P.br}"/>
<circle cx="80" cy="32" r="19" fill="${P.gn}"/>
<path d="M70 88c0-8 5-13 11-13" fill="none" stroke="${P.bl}" stroke-width="9"/>
<path d="M62 88h14" fill="none" stroke="${P.sk}" stroke-width="8"/>
<path d="M16 88c0-14 9-22 19-22s19 8 19 22Z" fill="${P.pr}"/>
<circle cx="35" cy="42" r="19" fill="${P.sk}"/>
<path d="M16 38c1-13 9-20 19-20s18 7 19 20c-6-6-11-9-19-9s-13 3-19 9Z" fill="${P.hair}"/>
<circle cx="29" cy="44" r="3" fill="${O}" stroke="none"/><circle cx="42" cy="44" r="3" fill="${O}" stroke="none"/>
<path d="M31 54c3 3 7 3 10 0" fill="none" stroke-width="2.4"/>
<g><circle cx="62" cy="30" r="12" fill="#DFF1FB" opacity=".9"/><path d="M70 39l7 8" fill="none" stroke-width="6"/>
<animateTransform attributeName="transform" type="translate" values="0 0;6 8;0 0" dur="3s" repeatCount="indefinite"/></g></g>`,
  tagrun: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="0" y="86" width="100" height="8" fill="${P.pan}" stroke="none"/>
<g><path d="M56 86l8-22 20 5-6 17Z" fill="${P.gn}"/>
<circle cx="72" cy="36" r="14" fill="${P.sk}"/>
<path d="M58 34c1-10 7-15 14-15s13 5 14 13c-5-5-9-7-14-7s-10 3-14 9Z" fill="${P.hair}"/>
<circle cx="78" cy="36" r="2.8" fill="${O}" stroke="none"/>
<path d="M62 66l-8 10M82 62l8 8" fill="none" stroke="${P.sk}" stroke-width="9"/>
<animateTransform attributeName="transform" type="translate" values="2 0;-2 0;2 0" dur="1s" repeatCount="indefinite"/></g>
<g><path d="M14 86l8-24 20 6-6 18Z" fill="${P.bl}"/>
<circle cx="30" cy="34" r="14" fill="${P.sk}"/>
<path d="M16 32c1-10 7-15 14-15s13 5 14 13c-5-5-9-7-14-7s-10 3-14 9Z" fill="${P.hair}"/>
<circle cx="36" cy="34" r="2.8" fill="${O}" stroke="none"/>
<path d="M20 64l-8 10" fill="none" stroke="${P.sk}" stroke-width="9"/>
<path d="M42 60c8-2 12-4 16-6" fill="none" stroke="${P.sk}" stroke-width="9"/>
<animateTransform attributeName="transform" type="translate" values="-2 0;2 0;-2 0" dur="1s" repeatCount="indefinite"/></g></g>`,
  /* ═══ ШНУРКИ ═══ */
  shoe: `<ellipse cx="50" cy="92" rx="32" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 60h24l14 10h26a6 6 0 0 1 6 6v10H12Z" fill="${P.pr}"/>
<path d="M12 78h70v8H12Z" fill="${P.nv}"/>
<path d="M20 60l6-22" fill="none" stroke-width="6"/>
<g stroke="${P.cr}" stroke-width="3.4" fill="none"><path d="M24 44l14 8"/><path d="M38 44l-14 8"/><path d="M26 34l12 6"/><path d="M38 34l-12 6"/></g></g>`,
  crosslace: `<ellipse cx="50" cy="92" rx="32" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 62h24l14 10h26a6 6 0 0 1 6 6v8H12Z" fill="${P.pan2}"/>
<path d="M12 78h70v8H12Z" fill="${P.nv}"/></g>
<g stroke="${P.pr}" stroke-width="6" fill="none" stroke-linecap="round">
<path d="M28 22l26 34"><animate attributeName="stroke-dasharray" values="0 46;46 0" dur="1.6s" repeatCount="indefinite"/></path>
<path d="M54 22L28 56"><animate attributeName="stroke-dasharray" values="0 46;46 0" dur="1.6s" begin=".3s" repeatCount="indefinite"/></path></g>`,
  looplace: `<ellipse cx="50" cy="92" rx="32" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 62h24l14 10h26a6 6 0 0 1 6 6v8H12Z" fill="${P.pan2}"/>
<path d="M12 78h70v8H12Z" fill="${P.nv}"/></g>
<g stroke="${P.pr}" stroke-width="6" fill="none" stroke-linecap="round">
<path d="M44 48c-16-7-21 12-7 14s12-19-3-21"><animateTransform attributeName="transform" type="scale" values="1;1.06;1" dur="2.2s" repeatCount="indefinite" additive="sum"/></path>
<path d="M56 48c16-7 21 12 7 14s-12-19 3-21"><animateTransform attributeName="transform" type="scale" values="1;1.06;1" dur="2.2s" begin=".4s" repeatCount="indefinite" additive="sum"/></path></g>`,
  tightlace: `<ellipse cx="50" cy="92" rx="32" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 62h24l14 10h26a6 6 0 0 1 6 6v8H12Z" fill="${P.pr}"/>
<path d="M12 78h70v8H12Z" fill="${P.nv}"/></g>
<g stroke="${P.cr}" stroke-width="5" fill="none" stroke-linecap="round">
<path d="M42 46c-12-5-16 9-5 11s9-15-2-16"/><path d="M58 46c12-5 16 9 5 11s-9-15 2-16"/>
<path d="M50 50l-9 14"/><path d="M50 50l9 14"/></g>
${spark(76, 26, 9, 0)}`,
  /* ═══ ДАСТАРХАН ═══ */
  cloth: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M8 46h84v24c0 8-19 14-42 14S8 78 8 70Z" fill="${P.pr}"/>
<g><ellipse cx="50" cy="46" rx="42" ry="12" fill="#FF8B3E"/>
<g fill="${P.cr}" stroke-width="2"><circle cx="26" cy="46" r="4"/><circle cx="50" cy="42" r="4"/><circle cx="74" cy="46" r="4"/></g>
<animateTransform attributeName="transform" type="translate" values="0 -6;0 0;0 -6" dur="3.2s" repeatCount="indefinite"/></g></g>`,
  treats: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M8 58h84v14c0 8-19 14-42 14S8 80 8 72Z" fill="${P.pr}"/>
<ellipse cx="50" cy="58" rx="42" ry="11" fill="#FF8B3E"/>
<circle cx="26" cy="46" r="14" fill="${P.br2}"/>
<circle cx="26" cy="46" r="7" fill="none" stroke-width="2.4" opacity=".6"/>
<path d="M50 54h26c0-8-6-13-13-13s-13 5-13 13Z" fill="${P.cr}"/>
<circle cx="58" cy="46" r="4.4" fill="${P.red}"/><circle cx="68" cy="47" r="4" fill="${P.gr}"/>
<path d="M80 40h10v10a5 5 0 0 1-5 5 5 5 0 0 1-5-5Z" fill="${P.pan}"/>
<path d="M90 43c4 1 5 3 5 5" fill="none"/></g>
${steam(88, 30, 0.6)}`,
  callall: `<ellipse cx="50" cy="94" rx="24" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M28 94c0-13 10-21 22-21s22 8 22 21Z" fill="${P.gn}"/>
<circle cx="46" cy="42" r="20" fill="${P.sk}"/>
<path d="M26 38c1-13 9-20 20-20s19 7 20 20c-6-6-11-9-20-9s-14 3-20 9Z" fill="${P.hair}"/>
<circle cx="39" cy="42" r="3.2" fill="${O}" stroke="none"/><circle cx="54" cy="42" r="3.2" fill="${O}" stroke="none"/>
<ellipse cx="47" cy="54" rx="7" ry="6" fill="${P.red}"/>
<g stroke="${P.pr}" stroke-width="4" fill="none">
<path d="M72 34c5 5 5 13 0 18"><animate attributeName="opacity" values=".3;1;.3" dur="1.8s" repeatCount="indefinite"/></path>
<path d="M84 27c9 9 9 27 0 36"><animate attributeName="opacity" values=".3;1;.3" dur="1.8s" begin=".4s" repeatCount="indefinite"/></path></g></g>`,
  /* ═══ ЦВЕТЫ ═══ */
  can: `<ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M24 42h42v34a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8Z" fill="${P.bl}"/>
<rect x="20" y="34" width="50" height="10" rx="5" fill="#0288B5"/>
<path d="M66 48l20-12v12l-16 10Z" fill="#0288B5"/>
<path d="M34 34c0-11 22-11 22 0" fill="none" stroke-width="5"/></g>`,
  watering: `<ellipse cx="50" cy="92" rx="30" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g transform="rotate(-26 20 22)"><path d="M4 10h26v16a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7Z" fill="${P.bl}"/><path d="M30 14l14-8v9l-12 7Z" fill="#0288B5"/></g>
<path d="M34 68h32l-4 20a4 4 0 0 1-4 4H42a4 4 0 0 1-4-4Z" fill="${P.pr}"/>
<path d="M50 68c0-15 8-24 20-26-2 15-9 24-20 26Z" fill="${P.gn}"/>
<path d="M50 68c0-12-8-20-18-22 2 14 8 20 18 22Z" fill="${P.gr}"/></g>
<g stroke="${P.bl}" stroke-width="4" stroke-linecap="round" fill="none">
<path d="M40 36v10"><animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/></path>
<path d="M47 42v10"><animate attributeName="opacity" values="1;0;1" dur="1.5s" begin=".3s" repeatCount="indefinite"/></path>
<path d="M54 48v10"><animate attributeName="opacity" values="1;0;1" dur="1.5s" begin=".6s" repeatCount="indefinite"/></path></g>`,
  plantpot: `<ellipse cx="50" cy="92" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M32 66h36l-5 22a4 4 0 0 1-4 4H41a4 4 0 0 1-4-4Z" fill="${P.pr}"/>
<rect x="28" y="58" width="44" height="10" rx="4" fill="#FF8B3E"/>
<g><path d="M50 58c0-17 9-27 21-29-2 17-9 27-21 29Z" fill="${P.gn}"/>
<path d="M50 58c0-14-8-22-19-24 2 16 8 22 19 24Z" fill="${P.gr}"/>
<circle cx="50" cy="28" r="7" fill="${P.yl}"/>
<animateTransform attributeName="transform" type="rotate" values="-2.5 50 58;2.5 50 58;-2.5 50 58" dur="4.2s" repeatCount="indefinite"/></g></g>`,
  /* ═══ ПОРТФЕЛЬ ═══ */
  bagopen: `<ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M34 34V22a16 16 0 0 1 32 0v12" fill="none" stroke-width="5"/>
<path d="M20 46h60v32a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill="${P.pr}"/>
<path d="M20 46c0-7 14-11 30-11s30 4 30 11c-9 6-19 9-30 9s-21-3-30-9Z" fill="#7A3410">
<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="2.8s" repeatCount="indefinite"/></path>
<rect x="42" y="62" width="16" height="14" rx="4" fill="${P.cr}"/></g>`,
  books: `<ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="62" width="68" height="16" rx="3" fill="${P.bl}"/>
<rect x="20" y="46" width="60" height="16" rx="3" fill="${P.pr}"/>
<rect x="24" y="30" width="52" height="16" rx="3" fill="${P.gr}"/>
<g stroke-width="2.4" opacity=".55" fill="none"><path d="M28 38h20"/><path d="M26 54h20"/><path d="M24 70h22"/></g></g>`,
  bagclosed: `<ellipse cx="50" cy="90" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M34 36V24a16 16 0 0 1 32 0v12" fill="none" stroke-width="5"/>
<rect x="18" y="36" width="64" height="50" rx="10" fill="${P.pr}"/>
<path d="M18 52h64" fill="none"/>
<rect x="42" y="46" width="16" height="14" rx="4" fill="${P.cr}"/>
<rect x="26" y="66" width="22" height="12" rx="4" fill="#FF8B3E"/></g>`,
  /* ═══ МЫТЬ РУКИ — предметы, без кистей ═══ */
  tap: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 14h22v10H14Z" fill="${P.pan2}"/>
<path d="M22 24v14h30v10" fill="none" stroke-width="7"/>
<path d="M44 30h18a4 4 0 0 1 0 8H44Z" fill="${P.pan}"/>
<path d="M12 74h76c0 10-8 16-38 16s-38-6-38-16Z" fill="#fff"/>
<ellipse cx="50" cy="74" rx="38" ry="8" fill="${P.pan}"/>
<ellipse cx="50" cy="75" rx="26" ry="4.6" fill="${P.bl}" opacity=".5"/></g>
<g stroke="${P.bl}" stroke-width="6" stroke-linecap="round" fill="none">
<path d="M50 50v22"><animate attributeName="stroke-dasharray" values="0 24;18 6;0 24" dur="1.2s" repeatCount="indefinite"/></path></g>`,
  soapbar: `<ellipse cx="50" cy="92" rx="28" ry="4" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M24 62h52a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V68a6 6 0 0 1 6-6Z" fill="#FFF7E6"/>
<path d="M26 68h30" fill="none" stroke-width="2.6" opacity=".5"/>
<g fill="#fff">
<circle cx="30" cy="44" r="11"><animateTransform attributeName="transform" type="scale" values="1;1.14;1" dur="2.6s" repeatCount="indefinite" additive="sum"/></circle>
<circle cx="52" cy="32" r="14"><animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3.2s" begin=".5s" repeatCount="indefinite" additive="sum"/></circle>
<circle cx="74" cy="42" r="10"><animateTransform attributeName="transform" type="scale" values="1;1.16;1" dur="2.9s" begin="1s" repeatCount="indefinite" additive="sum"/></circle>
<circle cx="62" cy="52" r="7"><animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2.3s" begin=".8s" repeatCount="indefinite" additive="sum"/></circle></g></g>`,
  towel: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M20 16h60" fill="none" stroke-width="5"/>
<circle cx="30" cy="16" r="5" fill="${P.pan2}"/><circle cx="70" cy="16" r="5" fill="${P.pan2}"/>
<g><path d="M28 20h44v52c0 6-4 10-10 10H38c-6 0-10-4-10-10Z" fill="${P.pr}"/>
<path d="M28 32h44" fill="none" stroke="${P.cr}" stroke-width="4"/>
<path d="M28 42h44" fill="none" stroke="${P.cr}" stroke-width="4"/>
<path d="M38 82c4 4 20 4 24 0" fill="none"/>
<animateTransform attributeName="transform" type="rotate" values="-2 50 20;2 50 20;-2 50 20" dur="3.4s" repeatCount="indefinite"/></g></g>`,
  sink: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M26 22v12h24v8" fill="none" stroke-width="6"/>
<path d="M44 26h16a4 4 0 0 1 0 8H44Z" fill="${P.pan}"/>
<path d="M10 56h80c0 16-10 26-40 26S10 72 10 56Z" fill="#fff"/>
<ellipse cx="50" cy="56" rx="40" ry="9" fill="${P.pan}"/>
<ellipse cx="50" cy="57" rx="28" ry="5" fill="${P.bl}" opacity=".45"/>
<path d="M70 40h18a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H70Z" fill="#FFF7E6"/></g>
<g stroke="${P.bl}" stroke-width="5" stroke-linecap="round" fill="none">
<path d="M50 44v12"><animate attributeName="stroke-dasharray" values="0 14;10 4;0 14" dur="1.2s" repeatCount="indefinite"/></path></g>`,
  /* ═══ КРОВАТЬ ═══ */
  sheet: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="54" width="80" height="24" rx="5" fill="${P.br2}"/>
<path d="M10 50h80v10H10Z" fill="#fff"><animateTransform attributeName="transform" type="translate" values="-2 0;2 0;-2 0" dur="3.2s" repeatCount="indefinite"/></path>
<rect x="8" y="76" width="10" height="14" rx="4" fill="${P.br}"/><rect x="82" y="76" width="10" height="14" rx="4" fill="${P.br}"/>
<rect x="6" y="36" width="10" height="20" rx="4" fill="${P.br}"/></g>`,
  blanket: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="54" width="80" height="24" rx="5" fill="${P.br2}"/>
<path d="M10 48h80v18c-11 5-27 8-40 8s-29-3-40-8Z" fill="${P.bl}">
<animateTransform attributeName="transform" type="translate" values="0 4;0 0;0 4" dur="3s" repeatCount="indefinite"/></path>
<g stroke-width="2.4" opacity=".5" fill="none"><path d="M30 50v22"/><path d="M50 50v24"/><path d="M70 50v22"/></g>
<rect x="8" y="76" width="10" height="14" rx="4" fill="${P.br}"/><rect x="82" y="76" width="10" height="14" rx="4" fill="${P.br}"/>
<rect x="6" y="36" width="10" height="20" rx="4" fill="${P.br}"/></g>`,
  pillow: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="58" width="80" height="20" rx="5" fill="${P.br2}"/>
<path d="M10 52h80v16c-11 5-27 8-40 8s-29-3-40-8Z" fill="${P.bl}"/>
<rect x="6" y="34" width="10" height="24" rx="4" fill="${P.br}"/>
<rect x="18" y="34" width="40" height="22" rx="10" fill="#fff">
<animateTransform attributeName="transform" type="translate" values="0 -6;0 0;0 -6" dur="2.6s" repeatCount="indefinite"/></rect>
<rect x="8" y="76" width="10" height="14" rx="4" fill="${P.br}"/><rect x="82" y="76" width="10" height="14" rx="4" fill="${P.br}"/></g>`,
  bedmade: `<ellipse cx="50" cy="90" rx="36" ry="5" fill="#000" opacity=".1"/>
<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="58" width="80" height="20" rx="5" fill="${P.br2}"/>
<path d="M10 52h80v16c-11 5-27 8-40 8s-29-3-40-8Z" fill="${P.bl}"/>
<rect x="6" y="34" width="10" height="24" rx="4" fill="${P.br}"/>
<rect x="18" y="36" width="36" height="20" rx="9" fill="#fff"/>
<rect x="8" y="76" width="10" height="14" rx="4" fill="${P.br}"/><rect x="82" y="76" width="10" height="14" rx="4" fill="${P.br}"/></g>
${spark(80, 26, 9, 0)}`,
  /* ═══ НЕ АЛГОРИТМ ═══ */
  heart: `<path d="M50 86S10 60 10 34c0-12 10-20 20-20 9 0 16 5 20 12 4-7 11-12 20-12 10 0 20 8 20 20 0 26-40 52-40 52Z" fill="${P.red}" stroke="${O}" stroke-width="3" stroke-linejoin="round">
<animateTransform attributeName="transform" type="scale" values="1;1.05;1;1.03;1" dur="1.8s" repeatCount="indefinite" additive="sum"/></path>
<path d="M28 30c-4 3-6 7-6 11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".65"/>`,
  sunhot: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<g><g stroke="${P.yl}" stroke-width="7" fill="none"><path d="M50 8v12"/><path d="M50 68v12"/><path d="M8 44h12"/><path d="M80 44h12"/><path d="M20 14l8 8"/><path d="M72 66l8 8"/><path d="M80 14l-8 8"/><path d="M28 66l-8 8"/></g>
<animateTransform attributeName="transform" type="rotate" values="0 50 44;360 50 44" dur="24s" repeatCount="indefinite"/></g>
<circle cx="50" cy="44" r="20" fill="${P.yl}"/>
<g stroke="${P.pr}" stroke-width="5" fill="none"><path d="M28 88h44"><animate attributeName="opacity" values=".5;1;.5" dur="2.4s" repeatCount="indefinite"/></path>
<path d="M36 96h28"><animate attributeName="opacity" values=".5;1;.5" dur="2.4s" begin=".5s" repeatCount="indefinite"/></path></g></g>`,
  suzani: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="12" width="84" height="76" rx="10" fill="#FFF1E4"/>
<g><circle cx="50" cy="50" r="17" fill="none" stroke="${P.pr}" stroke-width="4"/>
<circle cx="50" cy="50" r="7" fill="${P.pr}"/>
<g fill="${P.gr}"><circle cx="26" cy="28" r="6"/><circle cx="74" cy="28" r="6"/><circle cx="26" cy="72" r="6"/><circle cx="74" cy="72" r="6"/></g>
<g stroke="${P.yl}" stroke-width="4" fill="none"><path d="M50 22v8"/><path d="M50 70v8"/><path d="M18 50h8"/><path d="M74 50h8"/></g>
<animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="40s" repeatCount="indefinite"/></g></g>`,
  /* ═══ КАРТОЧКИ-ВЫВОДЫ · viewBox 0 0 140 110 ═══ */
  cSteps: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
${numTile(6, 10, 1, `<path d="M14 24h18v8a4 4 0 0 1-4 4h-10a4 4 0 0 1-4-4Z" fill="${P.pan}"/><path d="M32 26c4 0 5 3 5 5" fill="none" stroke-width="2.4"/>`)}
${numTile(53, 10, 2, `<ellipse cx="70" cy="26" rx="12" ry="4" fill="${P.pan2}"/><path d="M58 26h24v6a5 5 0 0 1-5 5H63a5 5 0 0 1-5-5Z" fill="${P.pan}"/><circle cx="66" cy="19" r="2.4" fill="${P.tea}" stroke="none"/><circle cx="74" cy="18" r="2" fill="${P.tea}" stroke="none"/>`)}
${numTile(100, 10, 3, `<path d="M106 26h22c0 7-5 12-11 12s-11-5-11-12Z" fill="${P.cr}"/><ellipse cx="117" cy="26" rx="11" ry="3.4" fill="${P.tea}"/>`)}
<path d="M70 52v14" fill="none" stroke-width="4"/><path d="M64 60l6 8 6-8" fill="none" stroke-width="4"/>
${miniPiyola(53, 74, 1)}</g>
<text x="70" y="106" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="${P.pr}">1 \u2192 2 \u2192 3</text>`,
  cOrder: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
${ordTile(2, 8, 1, oLeaf)}<path d="M34 23h6" fill="none" stroke-width="2.6"/>
${ordTile(42, 8, 2, oPour)}<path d="M74 23h6" fill="none" stroke-width="2.6"/>
${ordTile(82, 8, 3, oTea)}
<circle cx="124" cy="23" r="11" fill="${P.grn2}" stroke="${P.gr}"/><path d="M119 23l3.5 4.5 7-8" fill="none" stroke="${P.gr}" stroke-width="3"/>
${ordTile(2, 58, 2, oPour)}<path d="M34 73h6" fill="none" stroke-width="2.6"/>
${ordTile(42, 58, 1, oLeaf)}<path d="M74 73h6" fill="none" stroke-width="2.6"/>
${ordTile(82, 58, 3, oFail)}
<circle cx="124" cy="73" r="11" fill="#FFECEC" stroke="${P.red}"/><path d="M120 69l8 8M128 69l-8 8" fill="none" stroke="${P.red}" stroke-width="3"/>
<path d="M4 45h132" fill="none" stroke-width="2" stroke-dasharray="4 4" opacity=".45"/></g>`,
  cResult: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="24" y="4" width="92" height="32" rx="9" fill="#fff"/>
<g transform="translate(32 9)"><path d="M2 8h18v9a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5Z" fill="${P.pan}"/><ellipse cx="11" cy="8" rx="9" ry="2.6" fill="${P.pan2}"/><path d="M8 4.5h6" fill="none" stroke-width="2.6"/><path d="M20 11c4 0 5 3 5 6" fill="none" stroke-width="2.4"/></g>
<g stroke-width="2.6" fill="none"><path d="M66 13h40"/><path d="M66 21h32"/><path d="M66 29h36"/></g>
<path d="M70 36v8" fill="none" stroke-width="3"/>
<path d="M26 44h88" fill="none" stroke-width="3"/>
<path d="M26 44v8M70 44v8M114 44v8" fill="none" stroke-width="3"/>
${miniPiyola(9, 58, 1)}${miniPiyola(53, 58, 1)}${miniPiyola(97, 58, 1)}</g>
<text x="70" y="104" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="${P.gr}">= = =</text>`,
  cWhat: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
${numTile(8, 26, 1, `<path d="M16 40h18v8a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4Z" fill="${P.pan}"/>`)}
${numTile(48, 26, 2, `<ellipse cx="65" cy="42" rx="12" ry="4" fill="${P.pan2}"/><path d="M53 42h24v6a5 5 0 0 1-5 5H58a5 5 0 0 1-5-5Z" fill="${P.pan}"/>`)}
${numTile(88, 26, 3, `<path d="M94 42h22c0 7-5 12-11 12s-11-5-11-12Z" fill="${P.cr}"/><ellipse cx="105" cy="42" rx="11" ry="3.4" fill="${P.tea}"/>`)}
<path d="M126 43h8" fill="none" stroke-width="4"/><path d="M130 39l5 4-5 4" fill="none" stroke-width="4"/>
${miniPiyola(52, 80, 0.9)}</g>`,
  cAnyone: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="40" y="4" width="60" height="20" rx="7" fill="#fff"/>
<g stroke-width="2.4" fill="none"><path d="M48 11h28"/><path d="M48 17h18"/></g>
<path d="M70 24v8M70 32H24M70 32h46M24 32v8M116 32v8" fill="none" stroke-width="2.6"/>
<g><circle cx="24" cy="54" r="12" fill="${P.sk}"/><path d="M12 50c1-8 5-12 12-12s11 4 12 12c-4-4-7-6-12-6s-8 2-12 6Z" fill="${P.hair}"/><circle cx="20" cy="54" r="2" fill="${O}" stroke="none"/><circle cx="28" cy="54" r="2" fill="${O}" stroke="none"/></g>
<g><rect x="58" y="42" width="24" height="24" rx="8" fill="${P.pan}"/><rect x="62" y="48" width="16" height="12" rx="5" fill="${P.nv}"/><rect x="66" y="52" width="3" height="5" rx="1.5" fill="#3FC5F0" stroke="none"/><rect x="72" y="52" width="3" height="5" rx="1.5" fill="#3FC5F0" stroke="none"/></g>
<g><circle cx="116" cy="54" r="12" fill="${P.pr}"/><circle cx="112" cy="52" r="3" fill="#fff" stroke="none"/><circle cx="121" cy="52" r="3" fill="#fff" stroke="none"/><circle cx="112" cy="52" r="1.4" fill="${O}" stroke="none"/><circle cx="121" cy="52" r="1.4" fill="${O}" stroke="none"/></g>
${miniPiyola(8, 80, 0.7)}${miniPiyola(58, 80, 0.7)}${miniPiyola(108, 80, 0.7)}</g>
<text x="70" y="106" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="${P.gr}">= = =</text>`,
  cSkip: `<g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<rect x="6" y="14" width="30" height="30" rx="8" fill="#fff"/><text x="21" y="34" text-anchor="middle" font-family="monospace" font-size="15" font-weight="700" fill="${O}" stroke="none">1</text>
<rect x="42" y="14" width="30" height="30" rx="8" fill="#FFECEC" stroke="${P.red}" stroke-dasharray="5 4"/><text x="57" y="35" text-anchor="middle" font-family="monospace" font-size="17" font-weight="700" fill="${P.red}" stroke="none">?</text>
<rect x="78" y="14" width="30" height="30" rx="8" fill="#fff"/><text x="93" y="34" text-anchor="middle" font-family="monospace" font-size="15" font-weight="700" fill="${O}" stroke="none">3</text>
<path d="M114 29h10" fill="none" stroke-width="4"/><path d="M119 25l5 4-5 4" fill="none" stroke-width="4"/>
<g><path d="M48 62h44c0 13-10 22-22 22s-22-9-22-22Z" fill="${P.cr}"/>
<ellipse cx="70" cy="62" rx="22" ry="6" fill="#fff"/>
<ellipse cx="70" cy="63" rx="16" ry="4" fill="${P.bl}" opacity=".5"/>
<path d="M52 56l36 34M88 56L52 90" fill="none" stroke="${P.red}" stroke-width="5"/></g></g>
<text x="70" y="106" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="${P.red}">\u043D\u0435 \u0447\u0430\u0439</text>`
};
var VB = {
  cSteps: "0 0 140 110",
  cOrder: "0 0 140 96",
  cResult: "0 0 140 110",
  cWhat: "0 0 140 110",
  cAnyone: "0 0 140 110",
  cSkip: "0 0 140 110"
};
function Art({ k, size = 64, style }) {
  return <svg
    width={size}
    height={size}
    viewBox={VB[k] || "0 0 100 100"}
    aria-hidden="true"
    style={{ display: "block", flex: "0 0 auto", ...style }}
    dangerouslySetInnerHTML={{ __html: SC[k] || "" }}
  />;
}
function Wide({ k, max = 300 }) {
  return <svg
    viewBox={VB[k] || "0 0 100 100"}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    style={{ display: "block", width: `min(${max}px, 66vw)`, height: "auto" }}
    dangerouslySetInnerHTML={{ __html: SC[k] || "" }}
  />;
}
function ArtDefs() {
  return <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><defs><linearGradient id="agShell" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0" stopColor={ART.shell1} /><stop offset=".55" stopColor={ART.shell2} /><stop offset="1" stopColor={ART.shell3} /></linearGradient><linearGradient id="agPanel" x1=".2" y1="0" x2=".7" y2="1"><stop offset="0" stopColor={ART.pan1} /><stop offset="1" stopColor={ART.pan2} /></linearGradient><linearGradient id="agNavy" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stopColor={ART.navy1} /><stop offset="1" stopColor={ART.navy2} /></linearGradient><linearGradient id="agScreen" x1=".1" y1="0" x2=".8" y2="1"><stop offset="0" stopColor={ART.scr1} /><stop offset="1" stopColor={ART.scr2} /></linearGradient><radialGradient id="agGoo" cx="34%" cy="22%" r="86%"><stop offset="0" stopColor="#FFC58F" /><stop offset=".46" stopColor="#FF9F5A" /><stop offset="1" stopColor="#E2662A" /></radialGradient><radialGradient id="agShine" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff" stopOpacity=".72" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient><radialGradient id="agMouth" cx="50%" cy="30%" r="80%"><stop offset="0" stopColor="#8E2F1E" /><stop offset="1" stopColor="#5C1A0F" /></radialGradient><radialGradient id="agBlush" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FF6B6B" stopOpacity=".55" /><stop offset="1" stopColor="#FF6B6B" stopOpacity="0" /></radialGradient>{
    /* заливки нового набора предметов */
  }<linearGradient id="g-steel" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#F3F5F9" /><stop offset=".30" stopColor="#C3CCDB" /><stop offset=".47" stopColor="#6E7A92" /><stop offset=".56" stopColor="#F3F5F9" /><stop offset="1" stopColor="#C3CCDB" /></linearGradient><linearGradient id="g-iron" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#5A6785" /><stop offset=".55" stopColor="#3C4962" /><stop offset="1" stopColor="#242F47" /></linearGradient><linearGradient id="g-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F26B3A" /><stop offset=".55" stopColor="#F7B23C" /><stop offset="1" stopColor="#FFE08A" /></linearGradient></defs>{
    /* Контуры рисунков держатся на классах ag-*, а пар и пламя — на этих
       же анимациях. Без этого блока предметы останутся без обводки. */
  }<style>{ART_CSS}</style></svg>;
}
var TIK_EYES = {
  on: <g><rect x="143.5" y="159" width="27" height="56" rx="13.5" fill={ART.cyan} /><rect x="229.5" y="159" width="27" height="56" rx="13.5" fill={ART.cyan} /><rect x="147.5" y="165" width="8" height="16" rx="4" fill={ART.cyanLt} opacity=".7" /><rect x="233.5" y="165" width="8" height="16" rx="4" fill={ART.cyanLt} opacity=".7" /></g>,
  wide: <g><rect x="141" y="153" width="32" height="68" rx="16" fill={ART.cyan} /><rect x="227" y="153" width="32" height="68" rx="16" fill={ART.cyan} /></g>,
  happy: <g fill="none" stroke={ART.cyan} strokeWidth="13" strokeLinecap="round"><path d="M140,200 Q157,176 174,200" /><path d="M226,200 Q243,176 260,200" /></g>,
  half: <g><rect x="143.5" y="187" width="27" height="28" rx="13.5" fill={ART.cyan} /><rect x="229.5" y="187" width="27" height="28" rx="13.5" fill={ART.cyan} /></g>,
  side: <g><rect x="157" y="161" width="24" height="52" rx="12" fill={ART.cyan} /><rect x="243" y="161" width="24" height="52" rx="12" fill={ART.cyan} /></g>,
  scan: <g><rect x="136" y="179" width="42" height="16" rx="8" fill={ART.cyan} /><rect x="222" y="179" width="42" height="16" rx="8" fill={ART.cyan} /></g>
};
var ART_CSS = `
.ag-o{stroke:#2B3A67;stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
  .ag-t{stroke:#2B3A67;stroke-width:3;stroke-linejoin:round;stroke-linecap:round}
  .ag-steam{fill:none;stroke:#C9D6EA;stroke-width:3.5;stroke-linecap:round;opacity:0}
  @media (prefers-reduced-motion: reduce){ *{animation:none !important} .ag-steam{opacity:.7} }
  @keyframes k-rise{
    0%  {transform:translateY(4px) scaleX(.9);opacity:0}
    25% {opacity:.95}
    70% {opacity:.55}
    100%{transform:translateY(-12px) scaleX(1.08);opacity:0}
  }
  .ag-k-steam{animation:k-rise 2.8s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes k-flick{0%,100%{transform:scaleY(1) scaleX(1)}50%{transform:scaleY(1.12) scaleX(.92) translateX(1px)}}
  .ag-k-flame{animation:k-flick .55s cubic-bezier(0.45,0.05,0.55,0.95) infinite alternate}
  .ag-k-f1{animation-delay:-.15s} .ag-k-f3{animation-delay:-.32s} .ag-k-f2{animation-duration:.7s}
  @keyframes k-glow{0%,100%{transform:scaleX(1);opacity:.18}50%{transform:scaleX(1.08);opacity:.28}}
  .ag-k-glow{animation:k-glow 1.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes k-rattle{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-1.6px) rotate(-1.5deg)}60%{transform:translateY(-.6px) rotate(1.2deg)}}
  .ag-k-lid{animation:k-rattle .6s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes l-fall{
    0%  {transform:translate(2px,-4px) rotate(0);opacity:0}
    15% {opacity:1}
    80% {opacity:1}
    100%{transform:translate(-3px,18px) rotate(140deg);opacity:0}
  }
  .ag-l-leaf{animation:l-fall 1.5s cubic-bezier(.35,0,.85,.6) infinite}
  @keyframes l-rock{0%,100%{transform:rotate(38deg)}50%{transform:rotate(43deg)}}
  .ag-l-jar{animation:l-rock 3s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:90px 30px}
  @keyframes l-tap{0%,100%{transform:translateY(0)}50%{transform:translateY(.8px)}}
  .ag-l-bowl{animation:l-tap 1.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes l-pile{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.06)}}
  .ag-l-pile{animation:l-pile 3s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:56px 59px}
  @keyframes p-rise{
    0%  {transform:translateY(4px) scaleX(.9);opacity:0}
    25% {opacity:.95}
    70% {opacity:.55}
    100%{transform:translateY(-12px) scaleX(1.08);opacity:0}
  }
  .ag-p-steam{animation:p-rise 2.6s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes p-flow{to{stroke-dashoffset:-28}}
  .ag-p-flow{animation:p-flow .7s linear infinite}
  @keyframes p-drop{
    0%  {transform:translate(0,0) scale(.3);opacity:0}
    30% {opacity:1}
    100%{transform:translate(var(--dx),-14px) scale(1);opacity:0}
  }
  .ag-p-drop{animation:p-drop .9s cubic-bezier(.2,.6,.4,1) infinite}
  @keyframes p-tilt{0%,100%{transform:rotate(0)}50%{transform:rotate(-2deg) translateY(1px)}}
  .ag-p-kettle{animation:p-tilt 3.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:86px 40px}
  @keyframes p-water{0%,100%{transform:scale(1)}50%{transform:scale(1.04,1.15)}}
  .ag-p-water{animation:p-water 1.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:36.0px 84.0px}
  @keyframes p-ring{0%{transform:scale(.2);opacity:.9}100%{transform:scale(1);opacity:0}}
  .ag-p-ring{animation:p-ring 1.4s ease-out infinite;transform-origin:36.0px 84.0px}
  @keyframes c-rise{
    0%  {transform:translateY(4px) scaleX(.9);opacity:0}
    25% {opacity:.95}
    70% {opacity:.55}
    100%{transform:translateY(-10px) scaleX(1.08);opacity:0}
  }
  .ag-c-steam{animation:c-rise 3.2s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes c-close{
    0%,22% {transform:translateY(-18px) rotate(-7deg)}
    42%    {transform:translateY(0) rotate(0)}
    47%    {transform:translateY(-1.6px) rotate(.6deg)}
    52%,86%{transform:translateY(0) rotate(0)}
    100%   {transform:translateY(-18px) rotate(-7deg)}
  }
  .ag-c-lid{animation:c-close 4.2s cubic-bezier(.45,0,.55,1) infinite;transform-origin:64px 44px}
  @keyframes c-land{0%,41%,58%,100%{transform:scale(1)}45%{transform:scale(1.02,.975)}}
  .ag-c-pot{animation:c-land 4.2s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:64px 106px}
  @keyframes c-dots{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
  .ag-c-dot{animation:c-dots 1.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes c-puff{0%,40%{opacity:0;transform:translateY(0) scaleX(1)}46%{opacity:.9}70%,100%{opacity:0;transform:translateY(-8px) scale(1.5,1)}}
  .ag-c-puff{animation:c-puff 4.2s ease-out infinite}
  @keyframes y-rise{
    0%  {transform:translateY(4px) scaleX(.9);opacity:0}
    25% {opacity:.95}
    70% {opacity:.55}
    100%{transform:translateY(-12px) scaleX(1.08);opacity:0}
  }
  .ag-y-steam{animation:y-rise 3.0s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes y-flow{to{stroke-dashoffset:-24}}
  .ag-y-flow{animation:y-flow .65s linear infinite}
  @keyframes y-ring{0%{transform:scale(.15);opacity:.9}100%{transform:scale(1);opacity:0}}
  .ag-y-ring{animation:y-ring 1.6s ease-out infinite;transform-box:fill-box;transform-origin:50% 50%}
  .ag-y-ring2{animation-delay:-.8s}
  @keyframes y-sway{0%,100%{transform:translateX(-2px)}50%{transform:translateX(2px)}}
  .ag-y-shine{animation:y-sway 2.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite}
  @keyframes y-tilt{0%,100%{transform:rotate(0)}50%{transform:rotate(-2deg) translateY(1px)}}
  .ag-y-pot{animation:y-tilt 3.4s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:84px 46px}
  @keyframes y-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.01)}}
  .ag-y-bowl{animation:y-breathe 3s cubic-bezier(0.45,0.05,0.55,0.95) infinite;transform-origin:32px 110px}
`;
var SC2 = {
  kettle: `<title>\u0412\u0441\u043A\u0438\u043F\u044F\u0442\u0438\u0442\u044C \u0432\u043E\u0434\u0443</title>
<g transform="">
  <g class="ag-k-glow" style="transform-origin:64px 110px"><ellipse cx="64" cy="110" rx="36" ry="10" fill="#F7B23C" opacity=".18"/></g>
  <rect x="32" y="116" width="64" height="8" rx="4" fill="#3B4C7E" stroke="#2B3A67" stroke-width="3"/>
  <path d="M40 117 H88" stroke="#5B6FA8" stroke-width="2" stroke-linecap="round"/>
  <g class="ag-k-flame ag-k-f1" style="transform-origin:46px 118px">
    <path d="M46 118 C37 110 40 102 46 95 C52 102 55 110 46 118 Z" fill="#F26B3A"/>
    <path d="M46 118 C42 113 43 108 46 104 C49 108 50 113 46 118 Z" fill="#FFE08A"/></g>
  <g class="ag-k-flame ag-k-f3" style="transform-origin:82px 118px">
    <path d="M82 118 C73 110 76 102 82 95 C88 102 91 110 82 118 Z" fill="#F26B3A"/>
    <path d="M82 118 C78 113 79 108 82 104 C85 108 86 113 82 118 Z" fill="#FFE08A"/></g>
  <g class="ag-k-flame ag-k-f2" style="transform-origin:64px 119px">
    <path d="M64 119 C52 109 56 98 64 90 C72 98 76 109 64 119 Z" fill="#F7B23C"/>
    <path d="M64 119 C58 112 60 105 64 99 C68 105 70 112 64 119 Z" fill="#FFE08A"/></g>
  <defs>
    <linearGradient id="k-steel" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#F3F5F9"/><stop offset=".30" stop-color="#C3CCDB"/>
      <stop offset=".47" stop-color="#6E7A92"/><stop offset=".56" stop-color="#F3F5F9"/>
      <stop offset="1" stop-color="#C3CCDB"/>
    </linearGradient>
  </defs>
  <!-- black arch handle -->
  <path d="M42 60 C44 14 100 8 92 64" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M42 60 C44 14 100 8 92 64" fill="none" stroke="#23262D" stroke-width="7" stroke-linecap="round"/>
  <path d="M48 46 C52 24 92 20 94 44" fill="none" stroke="#4B515E" stroke-width="2" stroke-linecap="round" opacity=".9"/>
  <!-- whistle spout (tube up-left) -->
  <path d="M34 74 L16 54" fill="none" stroke="#2B3A67" stroke-width="15" stroke-linecap="round"/>
  <path d="M34 74 L16 54" fill="none" stroke="url(#k-steel)" stroke-width="9" stroke-linecap="round"/>
  <path d="M30 68 L20 57" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>
  <!-- open spout end -->
  <circle class="ag-o" cx="16" cy="54" r="5" fill="#6E7A92"/>
  <!-- dome body -->
  <path class="ag-o" d="M24 98 A40 40 0 0 1 104 98 Z" fill="url(#k-steel)"/>
  <path d="M28 98 A36 36 0 0 1 100 98" fill="none" stroke="#fff" stroke-width="1.5" opacity=".5"/>
  <path d="M36 78 C38 70 44 64 52 62" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".95"/>
  <!-- base ring -->
  <rect class="ag-o" x="22" y="96" width="84" height="8" rx="3" fill="url(#k-steel)"/>
  <!-- lid disc + black knob -->
  <g class="ag-k-lid" style="transform-origin:64px 56px">
    <ellipse class="ag-o" cx="64" cy="57" rx="19" ry="5" fill="url(#k-steel)"/>
    <path d="M50 55 C54 50 74 50 78 55" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>
    <rect x="61.5" y="46" width="5" height="8" fill="#C3CCDB" stroke="#2B3A67" stroke-width="3"/>
    <ellipse class="ag-o" cx="64" cy="44" rx="7.5" ry="4.5" fill="#23262D"/>
    <path d="M59.5 43 C61 41 67 41 68.5 43" fill="none" stroke="#4B515E" stroke-width="1.6" stroke-linecap="round"/>
  </g><path class="ag-steam ag-k-steam" d="M9 44 c-3 -2.7, 3 -6.3, 0 -9.0 c-3 -2.7, 3 -6.3, 0 -9.0" style="transform-origin:9px 44px;animation-delay:-.4s"/><path class="ag-steam ag-k-steam" d="M20 40 c-3 -2.4, 3 -5.6, 0 -8.0 c-3 -2.4, 3 -5.6, 0 -8.0" style="transform-origin:20px 40px;animation-delay:-1.5s"/><path class="ag-steam ag-k-steam" d="M14 36 c-3 -3.0, 3 -7.0, 0 -10.0 c-3 -3.0, 3 -7.0, 0 -10.0" style="transform-origin:14px 36px;animation-delay:-2.3s"/></g>`,
  leaves: `<title>\u041D\u0430\u0441\u044B\u043F\u0430\u0442\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0443</title>

<g class="ag-l-bowl">
  <g transform="translate(-6 14) scale(.96)">
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#F4F6FB" stroke-width="5" stroke-linecap="round"/>
  <path d="M90 56 C112 50 114 86 90 90" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path class="ag-o" d="M42 86 C24 86 6 72 9 54 C10 46 13 42 16 39 L25 37 C23 43 20 49 22 55 C25 66 33 70 42 68 Z" fill="#F4F6FB"/>
  <path d="M17 40 L24 38.5" stroke="#D7DEEE" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 56 C14 50 15 46 17 43" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
  <circle class="ag-o" cx="64" cy="72" r="30" fill="#F4F6FB"/>
  <path d="M40 90 A30 30 0 0 0 88 90 Z" fill="#D7DEEE"/>
  <path class="ag-t" d="M40 90 A30 30 0 0 0 88 90" fill="none"/>
  <path d="M46 58 C48 52 52 49 56 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".95"/>
  <ellipse cx="64" cy="102" rx="14" ry="2.6" fill="#D7DEEE" stroke="#2B3A67" stroke-width="3"/>
  <ellipse class="ag-o" cx="64" cy="44" rx="21" ry="6" fill="#D7DEEE"/>
  <ellipse cx="64" cy="44.6" rx="15.5" ry="3.9" fill="#3A3448"/>
  <ellipse cx="64" cy="43.6" rx="15.5" ry="3.9" fill="none" stroke="#2A2536" stroke-width="1.2" opacity=".6"/></g>
  <ellipse class="ag-l-pile" cx="55.5" cy="57.2" rx="10" ry="2.2" fill="#5A3E28"/>
</g>
<!-- lid taken off and set beside the pot -->
<g transform="translate(106 112) scale(.68) translate(-64 -44)">
  <ellipse class="ag-o" cx="64" cy="44" rx="22" ry="6" fill="#D7DEEE"/>
  <path class="ag-o" d="M42 44 C43 35 54 30 64 30 C74 30 85 35 86 44 Z" fill="#F4F6FB"/>
  <path d="M42 44 A22 6 0 0 0 86 44" fill="none" stroke="#F5C242" stroke-width="2.6"/>
  <rect class="ag-o" x="60" y="25" width="8" height="7" rx="2" fill="#F4F6FB"/>
  <ellipse class="ag-o" cx="64" cy="24" rx="7.5" ry="4.5" fill="#F4F6FB"/>
  <path d="M58 23 C60 20.5 68 20.5 70 23" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linecap="round"/>
</g>
<g>
  <path class="ag-l-leaf" d="M60 36 c3 -3 6 -1.5 4.5 2.2 c-1.5 3.8 -5.2 3 -6.8 1.5 c-.8 -2.2 .8 -3 2.3 -3.7 z" fill="#5A3E28" stroke="#5A3E28" stroke-width="1" stroke-linejoin="round" style="animation-delay:-0.0s;transform-origin:62px 38px"/>
  <path class="ag-l-leaf" d="M67 38 c3 -3 6 -1.5 4.5 2.2 c-1.5 3.8 -5.2 3 -6.8 1.5 c-.8 -2.2 .8 -3 2.3 -3.7 z" fill="#5A3E28" stroke="#5A3E28" stroke-width="1" stroke-linejoin="round" style="animation-delay:-0.55s;transform-origin:69px 40px"/>
  <path class="ag-l-leaf" d="M57 40 c3 -3 6 -1.5 4.5 2.2 c-1.5 3.8 -5.2 3 -6.8 1.5 c-.8 -2.2 .8 -3 2.3 -3.7 z" fill="#5A3E28" stroke="#5A3E28" stroke-width="1" stroke-linejoin="round" style="animation-delay:-1.1s;transform-origin:59px 42px"/>
  <path class="ag-l-leaf" d="M64 41 c3 -3 6 -1.5 4.5 2.2 c-1.5 3.8 -5.2 3 -6.8 1.5 c-.8 -2.2 .8 -3 2.3 -3.7 z" fill="#5A3E28" stroke="#5A3E28" stroke-width="1" stroke-linejoin="round" style="animation-delay:-0.3s;transform-origin:66px 43px"/>
  <path class="ag-l-leaf" d="M71 36 c3 -3 6 -1.5 4.5 2.2 c-1.5 3.8 -5.2 3 -6.8 1.5 c-.8 -2.2 .8 -3 2.3 -3.7 z" fill="#5A3E28" stroke="#5A3E28" stroke-width="1" stroke-linejoin="round" style="animation-delay:-0.85s;transform-origin:73px 38px"/>
</g>
<g class="ag-l-jar" transform="rotate(40 90 30)">
  <rect class="ag-o" x="77" y="12" width="26" height="36" rx="5" fill="#C98B4B"/>
  <rect x="77" y="12" width="26" height="9" rx="4" fill="#8A5A2B" stroke="#2B3A67" stroke-width="4"/>
  <rect x="82" y="26" width="16" height="12" rx="2" fill="#F4E7CF"/>
  <path d="M85 30 h10 M85 34 h7" stroke="#8A5A2B" stroke-width="2" stroke-linecap="round"/>
  <path d="M83 48 h14" stroke="#5A3E28" stroke-width="5" stroke-linecap="round"/>
</g>`,
  pourhot: `<title>\u0417\u0430\u043B\u0438\u0442\u044C \u043A\u0438\u043F\u044F\u0442\u043A\u043E\u043C</title>

<g transform="translate(4 62) scale(0.5)">
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#F4F6FB" stroke-width="5" stroke-linecap="round"/>
  <path d="M90 56 C112 50 114 86 90 90" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path class="ag-o" d="M42 86 C24 86 6 72 9 54 C10 46 13 42 16 39 L25 37 C23 43 20 49 22 55 C25 66 33 70 42 68 Z" fill="#F4F6FB"/>
  <path d="M17 40 L24 38.5" stroke="#D7DEEE" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 56 C14 50 15 46 17 43" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
  <circle class="ag-o" cx="64" cy="72" r="30" fill="#F4F6FB"/>
  <path d="M40 90 A30 30 0 0 0 88 90 Z" fill="#D7DEEE"/>
  <path class="ag-t" d="M40 90 A30 30 0 0 0 88 90" fill="none"/>
  <path d="M46 58 C48 52 52 49 56 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".95"/>
  <ellipse cx="64" cy="102" rx="14" ry="2.6" fill="#D7DEEE" stroke="#2B3A67" stroke-width="3"/>
  <ellipse class="ag-o" cx="64" cy="44" rx="21" ry="6" fill="#D7DEEE"/>
  <ellipse cx="64" cy="44.6" rx="15.5" ry="3.9" fill="#3A3448"/>
  <ellipse cx="64" cy="43.6" rx="15.5" ry="3.9" fill="none" stroke="#2A2536" stroke-width="1.2" opacity=".6"/></g>
<ellipse class="ag-p-water" cx="36.0" cy="84.3" rx="8.5" ry="2.2" fill="#A9CCF2"/>
<ellipse class="ag-p-ring" cx="36.0" cy="84.3" rx="7.0" ry="1.7" fill="none" stroke="#fff" stroke-width="1.5"/>
<!-- water stream (primary) -->
<path d="M44.6 47.3 C43 60 37 72 36 84" fill="none" stroke="#3F7ECF" stroke-width="6.5" stroke-linecap="round"/>
<path class="ag-p-flow" d="M44.6 47.3 C43 60 37 72 36 84" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="7 21" opacity=".85"/>
<g>
  <circle class="ag-p-drop" cx="30.0" cy="82.0" r="2.2" fill="#A9CCF2" style="--dx:-8px;animation-delay:0s"/>
  <circle class="ag-p-drop" cx="42.0" cy="82.0" r="2" fill="#A9CCF2" style="--dx:8px;animation-delay:-.45s"/>
  <circle class="ag-p-drop" cx="36.0" cy="80.0" r="1.8" fill="#fff" style="--dx:2px;animation-delay:-.25s"/>
</g>
<path class="ag-steam ag-p-steam" d="M24.0 88.0 c-3 -1.8, 3 -4.2, 0 -6.0 c-3 -1.8, 3 -4.2, 0 -6.0" style="transform-origin:24.0px 88.0px;animation-delay:-.3s"/>
<path class="ag-steam ag-p-steam" d="M49.0 87.0 c-3 -1.8, 3 -4.2, 0 -6.0 c-3 -1.8, 3 -4.2, 0 -6.0" style="transform-origin:49.0px 87.0px;animation-delay:-1.5s"/>
<g class="ag-p-kettle"><g transform="translate(86 40) rotate(-40) scale(0.7) translate(-64 -80)">
  <defs>
    <linearGradient id="pk-steel" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#F3F5F9"/><stop offset=".30" stop-color="#C3CCDB"/>
      <stop offset=".47" stop-color="#6E7A92"/><stop offset=".56" stop-color="#F3F5F9"/>
      <stop offset="1" stop-color="#C3CCDB"/>
    </linearGradient>
  </defs>
  <!-- black arch handle -->
  <path d="M42 60 C44 14 100 8 92 64" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M42 60 C44 14 100 8 92 64" fill="none" stroke="#23262D" stroke-width="7" stroke-linecap="round"/>
  <path d="M48 46 C52 24 92 20 94 44" fill="none" stroke="#4B515E" stroke-width="2" stroke-linecap="round" opacity=".9"/>
  <!-- whistle spout (tube up-left) -->
  <path d="M34 74 L16 54" fill="none" stroke="#2B3A67" stroke-width="15" stroke-linecap="round"/>
  <path d="M34 74 L16 54" fill="none" stroke="url(#pk-steel)" stroke-width="9" stroke-linecap="round"/>
  <path d="M30 68 L20 57" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>
  <!-- open spout end -->
  <circle class="ag-o" cx="16" cy="54" r="5" fill="#6E7A92"/>
  <!-- dome body -->
  <path class="ag-o" d="M24 98 A40 40 0 0 1 104 98 Z" fill="url(#pk-steel)"/>
  <path d="M28 98 A36 36 0 0 1 100 98" fill="none" stroke="#fff" stroke-width="1.5" opacity=".5"/>
  <path d="M36 78 C38 70 44 64 52 62" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".95"/>
  <!-- base ring -->
  <rect class="ag-o" x="22" y="96" width="84" height="8" rx="3" fill="url(#pk-steel)"/>
  <!-- lid disc + black knob -->
  <g class="ag-pk-lid" style="transform-origin:64px 56px">
    <ellipse class="ag-o" cx="64" cy="57" rx="19" ry="5" fill="url(#pk-steel)"/>
    <path d="M50 55 C54 50 74 50 78 55" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>
    <rect x="61.5" y="46" width="5" height="8" fill="#C3CCDB" stroke="#2B3A67" stroke-width="3"/>
    <ellipse class="ag-o" cx="64" cy="44" rx="7.5" ry="4.5" fill="#23262D"/>
    <path d="M59.5 43 C61 41 67 41 68.5 43" fill="none" stroke="#4B515E" stroke-width="1.6" stroke-linecap="round"/>
  </g></g></g>`,
  covered: `<title>\u041D\u0430\u043A\u0440\u044B\u0442\u044C \u0438 \u043F\u043E\u0434\u043E\u0436\u0434\u0430\u0442\u044C</title>

<g class="ag-c-pot">
  <g transform="translate(0 6)">
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#F4F6FB" stroke-width="5" stroke-linecap="round"/>
  <path d="M90 56 C112 50 114 86 90 90" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path class="ag-o" d="M42 86 C24 86 6 72 9 54 C10 46 13 42 16 39 L25 37 C23 43 20 49 22 55 C25 66 33 70 42 68 Z" fill="#F4F6FB"/>
  <path d="M17 40 L24 38.5" stroke="#D7DEEE" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 56 C14 50 15 46 17 43" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
  <circle class="ag-o" cx="64" cy="72" r="30" fill="#F4F6FB"/>
  <path d="M40 90 A30 30 0 0 0 88 90 Z" fill="#D7DEEE"/>
  <path class="ag-t" d="M40 90 A30 30 0 0 0 88 90" fill="none"/>
  <path d="M46 58 C48 52 52 49 56 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".95"/>
  <ellipse cx="64" cy="102" rx="14" ry="2.6" fill="#D7DEEE" stroke="#2B3A67" stroke-width="3"/>
  <ellipse class="ag-o" cx="64" cy="44" rx="21" ry="6" fill="#D7DEEE"/>
  <ellipse cx="64" cy="44.6" rx="15.5" ry="3.9" fill="#3A3448"/>
  <ellipse cx="64" cy="43.6" rx="15.5" ry="3.9" fill="none" stroke="#2A2536" stroke-width="1.2" opacity=".6"/>
  <g class="ag-c-lid" style="transform-origin:64px 44px">
    <ellipse class="ag-o" cx="64" cy="44" rx="22" ry="6" fill="#D7DEEE"/>
    <path class="ag-o" d="M42 44 C43 35 54 30 64 30 C74 30 85 35 86 44 Z" fill="#F4F6FB"/>
    <path d="M42 44 A22 6 0 0 0 86 44" fill="none" stroke="#F5C242" stroke-width="2.6"/>
    <path d="M50 38 C53 34 58 32.5 63 32.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".95"/>
    <!-- mushroom knob with gold cap -->
    <rect class="ag-o" x="60" y="25" width="8" height="7" rx="2" fill="#F4F6FB"/>
    <ellipse class="ag-o" cx="64" cy="24" rx="7.5" ry="4.5" fill="#F4F6FB"/>
    <path d="M58 23 C60 20.5 68 20.5 70 23" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linecap="round"/>
  </g></g>
</g>
<!-- little puff squeezed out when the lid lands -->
<g class="ag-c-puff" style="transform-origin:64px 50px" fill="#C9D6EA"><circle cx="40" cy="50" r="2.2"/><circle cx="88" cy="50" r="2.2"/></g>
<path class="ag-steam ag-c-steam" d="M20 42 c-3 -1.8, 3 -4.2, 0 -6.0 c-3 -1.8, 3 -4.2, 0 -6.0" style="transform-origin:20px 42px;animation-delay:-.5s"/>
<g fill="#C9D6EA">
  <circle class="ag-c-dot" cx="54" cy="122" r="2.4" style="animation-delay:0s"/>
  <circle class="ag-c-dot" cx="64" cy="122" r="2.4" style="animation-delay:-.35s"/>
  <circle class="ag-c-dot" cx="74" cy="122" r="2.4" style="animation-delay:-.7s"/>
</g>`,
  piyola: `<title>\u041D\u0430\u043B\u0438\u0442\u044C \u0432 \u043F\u0438\u0430\u043B\u0443</title>

<g class="ag-y-bowl"><g transform="translate(5 66) scale(.42)">
  <ellipse class="ag-o" cx="64" cy="106" rx="14" ry="4" fill="#D7DEEE"/>
  <path class="ag-o" d="M20 62 H108 C106 88 92 104 64 104 C36 104 22 88 20 62 Z" fill="#F4F6FB"/>
  <path d="M25 74 Q64 90 103 74" fill="none" stroke="#3F7ECF" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M28 70 Q64 84 100 70" fill="none" stroke="#A9CCF2" stroke-width="2" stroke-linecap="round"/>
  <circle cx="46" cy="90" r="3.6" fill="#3F7ECF"/><circle cx="64" cy="94" r="3.6" fill="#3F7ECF"/><circle cx="82" cy="90" r="3.6" fill="#3F7ECF"/>
  <ellipse class="ag-o" cx="64" cy="62" rx="44" ry="9.5" fill="#D7DEEE"/>
  <ellipse cx="64" cy="62" rx="38" ry="7" fill="#C97A2E"/>
  <ellipse class="ag-y-shine" cx="48" cy="61" rx="9" ry="1.8" fill="#E39B4A" opacity=".8"/>
  <ellipse class="ag-y-ring" cx="72" cy="62" rx="16" ry="3.4" fill="none" stroke="#FFE1B3" stroke-width="1.6"/>
  <ellipse class="ag-y-ring ag-y-ring2" cx="72" cy="62" rx="16" ry="3.4" fill="none" stroke="#FFE1B3" stroke-width="1.6"/>
</g></g>
<!-- tea stream from the tilted teapot's spout (primary) -->
<path d="M41 52 C39 64 33 78 32 92" fill="none" stroke="#C97A2E" stroke-width="5" stroke-linecap="round"/>
<path class="ag-y-flow" d="M41 52 C39 64 33 78 32 92" fill="none" stroke="#FFD9A8" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 18" opacity=".9"/>
<path class="ag-steam ag-y-steam" d="M19 90 c-3 -1.8, 3 -4.2, 0 -6.0 c-3 -1.8, 3 -4.2, 0 -6.0" style="transform-origin:19px 90px;animation-delay:-.6s"/>
<path class="ag-steam ag-y-steam" d="M26 88 c-3 -1.9, 3 -4.5, 0 -6.5 c-3 -1.9, 3 -4.5, 0 -6.5" style="transform-origin:26px 88px;animation-delay:-2s"/>
<!-- the brewing teapot itself, tilted toward its spout -->
<g class="ag-y-pot"><g transform="translate(84 46) rotate(-45) scale(0.78) translate(-64 -72)">
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#2B3A67" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 54 C116 46 120 94 84 94" fill="none" stroke="#F4F6FB" stroke-width="5" stroke-linecap="round"/>
  <path d="M90 56 C112 50 114 86 90 90" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path class="ag-o" d="M42 86 C24 86 6 72 9 54 C10 46 13 42 16 39 L25 37 C23 43 20 49 22 55 C25 66 33 70 42 68 Z" fill="#F4F6FB"/>
  <path d="M17 40 L24 38.5" stroke="#D7DEEE" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 56 C14 50 15 46 17 43" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
  <circle class="ag-o" cx="64" cy="72" r="30" fill="#F4F6FB"/>
  <path d="M40 90 A30 30 0 0 0 88 90 Z" fill="#D7DEEE"/>
  <path class="ag-t" d="M40 90 A30 30 0 0 0 88 90" fill="none"/>
  <path d="M46 58 C48 52 52 49 56 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".95"/>
  <ellipse cx="64" cy="102" rx="14" ry="2.6" fill="#D7DEEE" stroke="#2B3A67" stroke-width="3"/>
  <g class="ag-yt-lid" style="transform-origin:64px 44px">
    <ellipse class="ag-o" cx="64" cy="44" rx="22" ry="6" fill="#D7DEEE"/>
    <path class="ag-o" d="M42 44 C43 35 54 30 64 30 C74 30 85 35 86 44 Z" fill="#F4F6FB"/>
    <path d="M42 44 A22 6 0 0 0 86 44" fill="none" stroke="#F5C242" stroke-width="2.6"/>
    <path d="M50 38 C53 34 58 32.5 63 32.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".95"/>
    <!-- mushroom knob with gold cap -->
    <rect class="ag-o" x="60" y="25" width="8" height="7" rx="2" fill="#F4F6FB"/>
    <ellipse class="ag-o" cx="64" cy="24" rx="7.5" ry="4.5" fill="#F4F6FB"/>
    <path d="M58 23 C60 20.5 68 20.5 70 23" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linecap="round"/>
  </g></g></g>`,
  kazanmeat: `<g fill="url(#g-flame)" stroke="#D8480E" stroke-width="2" stroke-linejoin="round">
    <path d="M64 120 C53 111 56 100 64 91 C72 100 75 111 64 120 Z"/>
    <path d="M42 116 C33 108 36 99 42 92 C48 99 51 108 42 116 Z"/>
    <path d="M86 116 C77 108 80 99 86 92 C92 99 95 108 86 116 Z"/>
  </g>
  <path class="ag-o" d="M22 50 H106 C106 82 88 102 64 102 C40 102 22 82 22 50 Z" fill="url(#g-iron)"/>
  <ellipse class="ag-o" cx="64" cy="50" rx="42" ry="11" fill="#46536E"/>
  <ellipse cx="64" cy="51" rx="34" ry="8.5" fill="#2A3450"/>
  <g stroke="#2B3A67" stroke-width="2.6" stroke-linejoin="round">
    <rect x="38" y="47" width="18" height="9" rx="4" fill="#B4563A"/>
    <rect x="59" y="45" width="18" height="9" rx="4" fill="#C4674A"/>
    <rect x="48" y="53" width="16" height="8" rx="4" fill="#9E4630"/>
    <rect x="72" y="52" width="15" height="8" rx="4" fill="#B4563A"/>
  </g>
  <path d="M46 49 h6" stroke="#E0937A" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M30 58 C32 74 40 88 50 95" fill="none" stroke="#8A97B4" stroke-width="4" stroke-linecap="round" opacity=".5"/>`,
  carrot: `<path class="ag-o" d="M14 44 H114 C119 44 122 48 122 53 V94 C122 99 119 103 114 103 H14 C9 103 6 99 6 94 V53 C6 48 9 44 14 44 Z" fill="#DFAF71"/>
  <path d="M6 92 H122" stroke="#8A5A2B" stroke-width="3.5"/>
  <path d="M18 52 H108" stroke="#C9975A" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
  <g stroke="#2B3A67" stroke-width="3" stroke-linejoin="round">
    <path d="M14 62 C14 58 17 56 21 56 L46 58 C50 58 52 60 52 62 C52 64 50 66 46 66 L21 68 C17 68 14 66 14 62 Z" fill="#E27C22"/>
    <path d="M14 62 L6 58 M14 62 L5 64 M14 62 L8 68" stroke="#4E9A5A" stroke-width="4" stroke-linecap="round" fill="none"/>
  </g>
  <g stroke="#2B3A67" stroke-width="3" stroke-linejoin="round">
    <rect x="58" y="56" width="44" height="8" rx="4" fill="#F59A42"/>
    <rect x="52" y="68" width="50" height="8" rx="4" fill="#F08C32"/>
    <rect x="62" y="80" width="40" height="8" rx="4" fill="#F59A42"/>
    <rect x="24" y="74" width="34" height="8" rx="4" fill="#F08C32"/>
    <rect x="18" y="84" width="42" height="8" rx="4" fill="#E27C22"/>
  </g>
  <g stroke="#FFD9A8" stroke-width="2.4" stroke-linecap="round" opacity=".8">
    <path d="M64 59 H92"/><path d="M58 71 H92"/><path d="M28 77 H50"/>
  </g>`,
  waterpour: `<path class="ag-o" d="M22 50 H106 C106 82 88 102 64 102 C40 102 22 82 22 50 Z" fill="url(#g-iron)"/>
  <ellipse class="ag-o" cx="64" cy="50" rx="42" ry="11" fill="#46536E"/>
  <ellipse cx="64" cy="51" rx="34" ry="8.5" fill="#2A3450"/>
  <ellipse cx="62" cy="51" rx="28" ry="6.5" fill="#3F7ECF"/>
  <ellipse cx="62" cy="50" rx="16" ry="3.6" fill="none" stroke="#A9CCF2" stroke-width="2"/>
  <g transform="rotate(-28 96 30)">
    <path d="M112 18 C124 18 124 44 112 44" fill="none" stroke="#2B3A67" stroke-width="11" stroke-linecap="round"/>
    <path d="M112 18 C124 18 124 44 112 44" fill="none" stroke="#C3CCDB" stroke-width="6" stroke-linecap="round"/>
    <path class="ag-o" d="M84 8 H110 C113 8 115 11 115 14 V40 C115 49 108 55 99 55 H95 C86 55 79 49 79 40 V14 C79 11 81 8 84 8 Z" fill="url(#g-steel)"/>
    <path class="ag-o" d="M79 12 L66 18 C64 19 64 22 66 23 L79 28 Z" fill="#C3CCDB"/>
    <ellipse class="ag-o" cx="97" cy="8" rx="18" ry="5" fill="#D7DEEE"/>
    <path d="M86 18 V44" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".85"/>
  </g>
  <path d="M70 34 C67 41 64 46 62 49" fill="none" stroke="#3F7ECF" stroke-width="8" stroke-linecap="round"/>
  <path d="M70 34 C67 41 64 46 62 49" fill="none" stroke="#A9CCF2" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  <circle cx="48" cy="45" r="2.6" fill="#A9CCF2"/><circle cx="78" cy="44" r="2.2" fill="#A9CCF2"/>`,
  rice: `<path class="ag-o" d="M22 50 H106 C106 82 88 102 64 102 C40 102 22 82 22 50 Z" fill="url(#g-iron)"/>
  <ellipse class="ag-o" cx="64" cy="50" rx="42" ry="11" fill="#46536E"/>
  <path class="ag-o" d="M34 50 C42 40 53 35 64 35 C75 35 86 40 94 50 C84 56 74 58 64 58 C54 58 44 56 34 50 Z" fill="#F7EFDC"/>
  <g transform="rotate(38 30 16)">
    <path class="ag-o" d="M10 4 H50 C48 20 40 28 30 28 C20 28 12 20 10 4 Z" fill="#F4F6FB"/>
    <ellipse class="ag-o" cx="30" cy="4" rx="20" ry="5" fill="#D7DEEE"/>
  </g>
  <!-- \u041C\u041E\u0420\u041A\u041E\u0412\u042C \u041D\u0410 \u0420\u0418\u0421\u0415 (\u0435\u0451 \u043F\u0440\u0430\u0432\u043A\u0430 17.09: \xAB\u043F\u043B\u043E\u0432 \u043F\u043E\u0445\u043E\u0436 \u043D\u0430 \u0431\u0435\u043B\u044B\u0439 \u043F\u043B\u043E\u0432\xBB). \u041D\u0435\u043C\u043D\u043E\u0433\u043E \u2014
       \u043F\u044F\u0442\u044C \u0441\u043E\u043B\u043E\u043C\u043E\u043A \u0446\u0432\u0435\u0442\u043E\u043C \u043C\u043E\u0440\u043A\u043E\u0432\u0438 \u0438\u0437 \u043F\u0430\u043B\u0438\u0442\u0440\u044B \u043A\u0443\u0440\u0441\u0430: \u0440\u0438\u0441 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0440\u0438\u0441\u043E\u043C, \u043D\u043E
       \u0431\u043B\u044E\u0434\u043E \u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043F\u043B\u043E\u0432, \u0430 \u043D\u0435 \u043A\u0430\u043A \u0432\u0430\u0440\u0451\u043D\u0430\u044F \u043A\u0440\u0443\u043F\u0430. -->
  <g fill="#F2941B" stroke="#C9761A" stroke-width="1.4" stroke-linejoin="round">
    <path d="M45 45 l10 -3 1.1 3.2 -10 3 Z"/>
    <path d="M58 41 l11 -2.4 .9 3.2 -11 2.4 Z"/>
    <path d="M71 45 l10 -3 1.1 3.2 -10 3 Z"/>
    <path d="M52 51 l9 -2.2 .9 3 -9 2.2 Z"/>
    <path d="M66 52 l9 -2.2 .9 3 -9 2.2 Z"/>
  </g>
  <g fill="#F7EFDC" stroke="#B9A87E" stroke-width="1.6">
    <ellipse cx="42" cy="30" rx="4" ry="2.2"/><ellipse cx="50" cy="38" rx="3.8" ry="2.1"/><ellipse cx="36" cy="22" rx="3.6" ry="2"/>
  </g>
  <path d="M30 60 C32 76 40 90 50 96" fill="none" stroke="#8A97B4" stroke-width="4" stroke-linecap="round" opacity=".5"/>`,
  lidon: `<path class="ag-o" d="M22 50 H106 C106 82 88 102 64 102 C40 102 22 82 22 50 Z" fill="url(#g-iron)"/>
  <ellipse class="ag-o" cx="64" cy="50" rx="42" ry="11" fill="#46536E"/>
  <path class="ag-o" d="M16 50 C16 30 38 18 64 18 C90 18 112 30 112 50 Z" fill="#D7DEEE"/>
  <path d="M24 46 C28 34 44 26 64 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
  <rect class="ag-o" x="56" y="8" width="16" height="10" rx="4" fill="#F4F6FB"/>
  <ellipse class="ag-o" cx="64" cy="7" rx="9" ry="4.5" fill="#23262D"/>
  <g fill="none" stroke="#C9D6EA" stroke-width="3.5" stroke-linecap="round">
    <path d="M20 44 c-3 -2 3 -5 0 -7"/><path d="M108 44 c3 -2 -3 -5 0 -7"/>
  </g>`,
  bedmade: `<path class="ag-o" d="M10 52 H20 V110 H10 Z" fill="#C98B4B"/>
  <path class="ag-o" d="M108 70 H118 V110 H108 Z" fill="#C98B4B"/>
  <path class="ag-o" d="M18 76 H110 V98 H18 Z" fill="#3F7ECF"/>
  <path class="ag-o" d="M18 76 H110 V85 H18 Z" fill="#F4F6FB"/>
  <rect class="ag-o" x="24" y="58" width="34" height="19" rx="9" fill="#F4F6FB"/>
  <path d="M30 63 c7 -3 15 -3 22 0" fill="none" stroke="#D7DEEE" stroke-width="3" stroke-linecap="round"/>
  <path d="M40 91 H92" stroke="#2A62A8" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  sink: `<path d="M100 22 V44" fill="none" stroke="#2B3A67" stroke-width="13" stroke-linecap="round"/>
  <path d="M100 22 V44" fill="none" stroke="url(#g-steel)" stroke-width="8" stroke-linecap="round"/>
  <path d="M100 24 C100 16 84 14 70 14 C58 14 52 20 52 30" fill="none" stroke="#2B3A67" stroke-width="13" stroke-linecap="round"/>
  <path d="M100 24 C100 16 84 14 70 14 C58 14 52 20 52 30" fill="none" stroke="url(#g-steel)" stroke-width="8" stroke-linecap="round"/>
  <rect class="ag-o" x="90" y="42" width="20" height="9" rx="4" fill="#6E7A92"/>
  <path d="M110 32 H122" stroke="#2B3A67" stroke-width="9" stroke-linecap="round"/>
  <path d="M110 32 H122" stroke="#C3CCDB" stroke-width="5" stroke-linecap="round"/>
  <path d="M52 34 V72" fill="none" stroke="#3F7ECF" stroke-width="7" stroke-linecap="round"/>
  <path d="M52 34 V72" fill="none" stroke="#A9CCF2" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>
  <path class="ag-o" d="M14 70 H114 C110 96 92 108 64 108 C36 108 18 96 14 70 Z" fill="#F4F6FB"/>
  <ellipse class="ag-o" cx="64" cy="70" rx="50" ry="9" fill="#D7DEEE"/>
  <ellipse cx="52" cy="71" rx="14" ry="4" fill="#A9CCF2"/>
  <path d="M24 78 C26 92 34 100 44 104" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`,
  treats: `<path class="ag-o" d="M8 96 H120 C123 96 124 98 124 101 V108 C124 111 123 113 120 113 H8 C5 113 4 111 4 108 V101 C4 98 5 96 8 96 Z" fill="#3F7ECF"/>
  <path d="M10 105 H118" stroke="#2A62A8" stroke-width="3" stroke-linecap="round" opacity=".55"/>
  <circle class="ag-o" cx="42" cy="66" r="26" fill="#E8B978"/>
  <circle cx="42" cy="66" r="12" fill="#C98B4B"/>
  <g fill="#8A5A2B"><circle cx="42" cy="60" r="1.8"/><circle cx="47" cy="67" r="1.8"/><circle cx="37" cy="67" r="1.8"/><circle cx="42" cy="72" r="1.8"/></g>
  <path class="ag-o" d="M76 72 H118 C116 88 107 96 97 96 C87 96 78 88 76 72 Z" fill="#F4F6FB"/>
  <ellipse class="ag-o" cx="97" cy="72" rx="21" ry="5" fill="#D7DEEE"/>
  <ellipse cx="97" cy="72" rx="15" ry="3.2" fill="#C97A2E"/>
  <circle cx="90" cy="84" r="3" fill="#3F7ECF"/><circle cx="104" cy="84" r="3" fill="#3F7ECF"/>
  <path d="M26 54 c5 -7 12 -11 20 -12" fill="none" stroke="#F7E2C0" stroke-width="4" stroke-linecap="round" opacity=".85"/>`,
  bagclosed: `<path d="M44 36 C44 24 53 16 64 16 C75 16 84 24 84 36" fill="none" stroke="#2B3A67" stroke-width="5" stroke-linecap="round"/>
  <path class="ag-o" d="M30 40 H98 C104 40 108 44 108 50 V104 C108 110 104 114 98 114 H30 C24 114 20 110 20 104 V50 C20 44 24 40 30 40 Z" fill="#E2703A"/>
  <path class="ag-o" d="M20 64 H108 V84 H20 Z" fill="#C9562A"/>
  <rect class="ag-o" x="52" y="64" width="24" height="20" rx="6" fill="#F5C242"/>
  <path d="M30 50 C30 46 33 44 37 44" fill="none" stroke="#F7B98E" stroke-width="4" stroke-linecap="round"/>
  <path d="M30 96 H50" stroke="#B44A22" stroke-width="3" stroke-linecap="round"/>`,
  schoolgate: `<path class="ag-o" d="M20 56 L64 26 L108 56 V114 H20 Z" fill="#E8B978"/>
  <path d="M14 58 L64 22 L114 58" fill="none" stroke="#2B3A67" stroke-width="6" stroke-linecap="round"/>
  <path class="ag-o" d="M50 78 H78 V114 H50 Z" fill="#C98B4B"/>
  <path d="M64 78 V114" stroke="#2B3A67" stroke-width="3"/>
  <rect class="ag-o" x="28" y="70" width="15" height="15" rx="3" fill="#A9CCF2"/>
  <rect class="ag-o" x="85" y="70" width="15" height="15" rx="3" fill="#A9CCF2"/>
  <path d="M64 10 V26" stroke="#2B3A67" stroke-width="4" stroke-linecap="round"/>
  <path class="ag-o" d="M64 10 H86 L79 17 L86 24 H64 Z" fill="#E2574C"/>
  <circle cx="71" cy="96" r="2.6" fill="#2B3A67"/>
  <path d="M30 62 L52 46" fill="none" stroke="#F7E2C0" stroke-width="4" stroke-linecap="round" opacity=".8"/>`,
  legotower: `<g stroke="#2B3A67" stroke-width="4" stroke-linejoin="round">
    <rect x="24" y="86" width="80" height="24" rx="4" fill="#3F7ECF"/>
    <rect x="34" y="78" width="12" height="9" rx="3" fill="#3F7ECF"/>
    <rect x="58" y="78" width="12" height="9" rx="3" fill="#3F7ECF"/>
    <rect x="82" y="78" width="12" height="9" rx="3" fill="#3F7ECF"/>
    <rect x="34" y="56" width="60" height="23" rx="4" fill="#F5C242"/>
    <rect x="44" y="48" width="12" height="9" rx="3" fill="#F5C242"/>
    <rect x="72" y="48" width="12" height="9" rx="3" fill="#F5C242"/>
    <rect x="46" y="28" width="36" height="21" rx="4" fill="#E2574C"/>
    <rect x="58" y="20" width="12" height="9" rx="3" fill="#E2574C"/>
  </g>
  <path d="M30 92 V104" stroke="#A9CCF2" stroke-width="4" stroke-linecap="round"/>
  <path d="M40 62 V73" stroke="#FFE08A" stroke-width="4" stroke-linecap="round"/>`,
  heart: `<path d="M64 110 S13 77 13 43 c0-15 13-26 26-26 11 0 20 6 25 15 5-9 14-15 25-15 13 0 26 11 26 26 0 34-51 67-51 67 Z"
        fill="#E2574C" stroke="#2B3A67" stroke-width="4" stroke-linejoin="round"/>
  <path d="M36 38 c-5 4 -8 9 -8 14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".65"/>`,
  sunhot: `<g stroke="#E2A21A" stroke-width="5" stroke-linecap="round">
    <path d="M64 8 V22"/><path d="M64 86 V100"/><path d="M10 54 H24"/><path d="M104 54 H118"/>
    <path d="M26 16 L36 26"/><path d="M92 82 L102 92"/><path d="M102 16 L92 26"/><path d="M36 82 L26 92"/>
  </g>
  <circle class="ag-o" cx="64" cy="54" r="30" fill="#F5C242"/>
  <path d="M46 42 c4 -7 11 -11 18 -11" fill="none" stroke="#FFE08A" stroke-width="6" stroke-linecap="round"/>
  <g fill="none" stroke="#F26B3A" stroke-width="4" stroke-linecap="round">
    <path d="M34 118 c6 -5 -6 -9 0 -14"/><path d="M64 120 c6 -5 -6 -9 0 -14"/><path d="M94 118 c6 -5 -6 -9 0 -14"/>
  </g>`,
  cat: `<path class="ag-o" d="M96 104 C104 96 108 84 104 74 C110 78 116 88 114 100 C113 106 106 108 96 104 Z" fill="#C98B4B"/>
  <path class="ag-o" d="M40 112 C34 96 36 78 46 68 C56 58 74 58 84 68 C94 78 96 96 90 112 Z" fill="#E8B978"/>
  <path class="ag-o" d="M44 68 L40 42 L60 54 Z" fill="#E8B978"/>
  <path class="ag-o" d="M86 68 L90 42 L70 54 Z" fill="#E8B978"/>
  <path d="M46 64 L44 50 L54 56 Z" fill="#F2C6A0"/><path d="M84 64 L86 50 L76 56 Z" fill="#F2C6A0"/>
  <g fill="#2B3A67"><ellipse cx="54" cy="80" rx="4" ry="5"/><ellipse cx="76" cy="80" rx="4" ry="5"/></g>
  <path d="M60 90 H70 L65 96 Z" fill="#E2574C" stroke="#2B3A67" stroke-width="3" stroke-linejoin="round"/>
  <g stroke="#2B3A67" stroke-width="3" stroke-linecap="round">
    <path d="M52 92 H34"/><path d="M52 97 H36"/><path d="M78 92 H96"/><path d="M78 97 H94"/>
  </g>
  <path d="M52 70 c4 -5 10 -7 15 -7" fill="none" stroke="#F7E2C0" stroke-width="4" stroke-linecap="round" opacity=".85"/>`,
  salad: `<ellipse cx="64" cy="112" rx="30" ry="4" fill="#000" opacity=".10"/>
  <path class="ag-o" d="M16 66 H112 C110 96 92 112 64 112 C36 112 18 96 16 66 Z" fill="#F4F6FB"/>
  <!-- \u26A0 \u0414\u0412\u0415 \u0415\u0401 \u041F\u0420\u0410\u0412\u041A\u0418 \u041F\u041E\u0414\u0420\u042F\u0414, 17.09. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0431\u044B\u043B\u043E \xAB\u0432\u0441\u0435 \u0434\u0443\u043C\u0430\u044E\u0442 \u043B\u044F\u0433\u0443\u0448\u043A\u0430\xBB: \u0434\u0432\u0435
       \u0437\u0435\u043B\u0451\u043D\u044B\u0435 \u043A\u0430\u043F\u043B\u0438 \u043F\u043E \u043A\u0440\u0430\u044F\u043C \u0438 \u043A\u0440\u0430\u0441\u043D\u044B\u0439 \u043A\u0440\u0443\u0436\u043E\u043A \u043F\u043E\u0434 \u043D\u0438\u043C\u0438 \u0441\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u043B\u0438\u0441\u044C \u0432 \u043C\u043E\u0440\u0434\u0443.
       \u041F\u043E\u0442\u043E\u043C, \u0443\u0436\u0435 \u043F\u043E \u043D\u0430\u0440\u0435\u0437\u043A\u0435: \xAB\u043F\u043E\u043C\u0438\u0434\u043E\u0440 \u0438 \u043E\u0433\u0443\u0440\u0446\u044B \u0431\u0443\u0434\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0432\u0438\u0434\u0443 \u0441\u0442\u043E\u044F\u0442, \u0430
       \u043D\u0435 \u043A\u0430\u043A \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0439 \u0441\u0430\u043B\u0430\u0442\xBB \u2014 \u043E\u0432\u043E\u0449\u0438 \u043B\u0435\u0436\u0430\u043B\u0438 \u041D\u0410 \u043C\u0438\u0441\u043A\u0435, \u0430 \u043F\u0435\u0440\u0435\u0434\u043D\u044F\u044F \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430
       \u0447\u0430\u0448\u0438 \u043E\u0441\u0442\u0430\u0432\u0430\u043B\u0430\u0441\u044C \u0431\u0435\u043B\u043E\u0439 \u0438 \u043F\u0443\u0441\u0442\u043E\u0439.
       \u0422\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u044F \u0434\u0440\u0443\u0433\u043E\u0439: \u0442\u0435\u043B\u043E \u043C\u0438\u0441\u043A\u0438 -> \u041C\u0410\u0421\u0421\u0410 \u0421\u0410\u041B\u0410\u0422\u0410, \u043A\u043E\u0442\u043E\u0440\u0430\u044F
       \u0437\u0430\u043F\u043E\u043B\u043D\u044F\u0435\u0442 \u0447\u0430\u0448\u0443 \u0446\u0435\u043B\u0438\u043A\u043E\u043C \u0438 \u0433\u043E\u0440\u043A\u043E\u0439 \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u043D\u0430\u0434 \u043A\u0440\u0430\u0435\u043C -> \u043A\u0443\u0441\u043E\u0447\u043A\u0438 ->
       \u043F\u0435\u0440\u0435\u0434\u043D\u0438\u0439 \u043A\u0440\u0430\u0439 \u041B\u0418\u041D\u0418\u0415\u0419 \u043F\u043E\u0432\u0435\u0440\u0445. \u041F\u0443\u0441\u0442\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430 \u043D\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F, \u043D\u0438\u0437 \u043A\u0443\u0441\u043E\u0447\u043A\u043E\u0432
       \u0443\u0445\u043E\u0434\u0438\u0442 \u0437\u0430 \u043A\u0440\u0430\u0439 \u2014 \u043E\u043D\u0438 \u043B\u0435\u0436\u0430\u0442 \u0412 \u043C\u0438\u0441\u043A\u0435. \u0415\u0451 \u0432\u044B\u0431\u043E\u0440 \u0438\u0437 \u0442\u0440\u0451\u0445 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432: B,
       \u0430\u0447\u0438\u0447\u0443\u043A \u0441 \u0437\u0435\u043B\u0435\u043D\u044C\u044E, \u0433\u043E\u0440\u043A\u043E\u0439. -->
  <path d="M17 66 C23 48 42 42 64 42 C86 42 105 48 111 66 A47 9.5 0 0 1 17 66 Z"
        fill="#6FA85F" stroke="#2B3A67" stroke-width="3.4" stroke-linejoin="round"/>
  <g stroke="#2B3A67" stroke-width="2.6">
    <circle cx="33" cy="63" r="7" fill="#E2574C"/><circle cx="47" cy="55" r="6.4" fill="#4E9A5A"/>
    <circle cx="61" cy="50" r="7.2" fill="#E2574C"/><circle cx="76" cy="54" r="6.2" fill="#4E9A5A"/>
    <circle cx="90" cy="61" r="6.8" fill="#E2574C"/><circle cx="41" cy="71" r="6.2" fill="#4E9A5A"/>
    <circle cx="56" cy="66" r="6.6" fill="#E2574C"/><circle cx="71" cy="70" r="6" fill="#4E9A5A"/>
    <circle cx="86" cy="72" r="5.6" fill="#E2574C"/><circle cx="100" cy="68" r="5.2" fill="#4E9A5A"/>
    <circle cx="25" cy="70" r="5" fill="#4E9A5A"/>
  </g>
  <g opacity=".92">
    <circle cx="33" cy="63" r="3.6" fill="#F4938B"/><circle cx="61" cy="50" r="3.7" fill="#F4938B"/>
    <circle cx="90" cy="61" r="3.5" fill="#F4938B"/><circle cx="56" cy="66" r="3.4" fill="#F4938B"/>
    <circle cx="86" cy="72" r="2.9" fill="#F4938B"/>
    <circle cx="47" cy="55" r="3.3" fill="#CFE9B8"/><circle cx="76" cy="54" r="3.2" fill="#CFE9B8"/>
    <circle cx="41" cy="71" r="3.2" fill="#CFE9B8"/><circle cx="71" cy="70" r="3.1" fill="#CFE9B8"/>
    <circle cx="100" cy="68" r="2.7" fill="#CFE9B8"/><circle cx="25" cy="70" r="2.6" fill="#CFE9B8"/>
  </g>
  <g fill="none" stroke="#F7FAFF" stroke-width="2.4" stroke-linecap="round">
    <ellipse cx="52" cy="60" rx="7" ry="3"/><ellipse cx="80" cy="66" rx="6.2" ry="2.7"/>
  </g>
  <g fill="#3E7F49">
    <path d="M40 48 q4 -5 8 -2 q-4 4 -8 2Z"/><path d="M68 44 q5 -4 8 0 q-5 3 -8 0Z"/>
    <path d="M92 53 q4 -4 7 -1 q-4 3 -7 1Z"/>
  </g>
  <path d="M16 66 A48 10 0 0 0 112 66" fill="none" stroke="#2B3A67" stroke-width="4" stroke-linecap="round"/>
  <path d="M26 74 C28 90 36 102 46 108" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`,
  mahalla: `<path class="ag-o" d="M22 58 H92 V114 H22 Z" fill="#E8B978"/>
  <path d="M16 60 L57 30 L98 60" fill="none" stroke="#2B3A67" stroke-width="6" stroke-linecap="round"/>
  <path class="ag-o" d="M22 58 L57 33 L92 58 Z" fill="#C98B4B"/>
  <path class="ag-o" d="M42 76 H72 V114 H42 Z" fill="#C98B4B"/>
  <path d="M57 76 V114" stroke="#2B3A67" stroke-width="3"/>
  <circle cx="50" cy="96" r="2.6" fill="#2B3A67"/><circle cx="64" cy="96" r="2.6" fill="#2B3A67"/>
  <path class="ag-o" d="M108 88 C96 88 96 66 108 66 C120 66 120 88 108 88 Z" fill="#4E9A5A"/>
  <path d="M108 88 V114" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/>
  <path d="M30 62 L50 48" fill="none" stroke="#F7E2C0" stroke-width="4" stroke-linecap="round" opacity=".8"/>`,
  zebra: `<path class="ag-o" d="M6 62 H84 V110 H6 Z" fill="#6E7A92"/>
  <g stroke="#2B3A67" stroke-width="3" stroke-linejoin="round">
    <rect x="12" y="68" width="14" height="36" rx="2" fill="#F4F6FB"/>
    <rect x="32" y="68" width="14" height="36" rx="2" fill="#F4F6FB"/>
    <rect x="52" y="68" width="14" height="36" rx="2" fill="#F4F6FB"/>
    <rect x="72" y="68" width="10" height="36" rx="2" fill="#F4F6FB"/>
  </g>
  <path d="M104 66 V108" stroke="#2B3A67" stroke-width="10" stroke-linecap="round"/>
  <path d="M104 66 V108" stroke="#8A97B4" stroke-width="5" stroke-linecap="round"/>
  <ellipse class="ag-o" cx="104" cy="110" rx="14" ry="5" fill="#6E7A92"/>
  <rect class="ag-o" x="90" y="14" width="28" height="52" rx="8" fill="#3A4257"/>
  <circle cx="104" cy="28" r="7" fill="#E2574C"/>
  <circle cx="104" cy="52" r="7" fill="#4E9A5A"/>
  <path d="M16 72 V100" stroke="#D7DEEE" stroke-width="3" stroke-linecap="round"/>`,
  legoplan: `<path class="ag-o" d="M28 12 H100 C104 12 106 14 106 18 V110 C106 114 104 116 100 116 H28 C24 116 22 114 22 110 V18 C22 14 24 12 28 12 Z" fill="#F4F6FB"/>
  <path d="M22 26 H106" stroke="#2B3A67" stroke-width="3"/>
  <g stroke="#3F7ECF" stroke-width="3" stroke-dasharray="5 5" fill="none">
    <rect x="36" y="70" width="56" height="20" rx="3"/>
    <rect x="44" y="46" width="40" height="20" rx="3"/>
    <rect x="54" y="32" width="20" height="12" rx="3"/>
  </g>
  <g font-family="'JetBrains Mono',monospace" font-weight="700" font-size="13" fill="#FE5B1A">
    <text x="32" y="106">1</text><text x="58" y="106">2</text><text x="84" y="106">3</text>
  </g>
  <circle cx="32" cy="19" r="3" fill="#D7DEEE"/><circle cx="42" cy="19" r="3" fill="#D7DEEE"/>`,
  legoplace: `<g stroke="#2B3A67" stroke-width="4" stroke-linejoin="round">
    <rect x="26" y="88" width="76" height="24" rx="4" fill="#3F7ECF"/>
    <rect x="36" y="80" width="12" height="9" rx="3" fill="#3F7ECF"/>
    <rect x="80" y="80" width="12" height="9" rx="3" fill="#3F7ECF"/>
    <rect x="40" y="34" width="48" height="22" rx="4" fill="#F5C242"/>
    <rect x="48" y="26" width="12" height="9" rx="3" fill="#F5C242"/>
    <rect x="68" y="26" width="12" height="9" rx="3" fill="#F5C242"/>
  </g>
  <g stroke="#4E9A5A" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M64 62 V74"/><path d="M55 67 L64 76 L73 67"/>
  </g>
  <path d="M32 94 V106" stroke="#A9CCF2" stroke-width="4" stroke-linecap="round"/>`,
  books: `<g stroke="#2B3A67" stroke-width="4" stroke-linejoin="round">
    <rect x="16" y="86" width="94" height="24" rx="4" fill="#3F7ECF"/>
    <rect x="24" y="64" width="80" height="22" rx="4" fill="#4E9A5A"/>
    <rect x="20" y="42" width="88" height="22" rx="4" fill="#E2703A"/>
  </g>
  <g stroke="#F4F6FB" stroke-width="4" stroke-linecap="round">
    <path d="M24 94 V102"/><path d="M32 70 V80"/><path d="M28 48 V58"/>
  </g>`,
  pencase: `<g stroke="#2B3A67" stroke-width="3" stroke-linejoin="round">
    <path d="M34 62 V38 L40 28 L46 38 V62 Z" fill="#F5C242"/>
    <path d="M56 62 V44 L62 34 L68 44 V62 Z" fill="#E2574C"/>
    <path d="M78 62 V40 L84 30 L90 40 V62 Z" fill="#4E9A5A"/>
  </g>
  <path class="ag-o" d="M18 60 H110 C114 60 116 63 116 67 V96 C116 100 114 103 110 103 H18 C14 103 12 100 12 96 V67 C12 63 14 60 18 60 Z" fill="#3F7ECF"/>
  <path d="M12 72 H116" stroke="#2B3A67" stroke-width="4"/>
  <rect class="ag-o" x="94" y="64" width="12" height="10" rx="4" fill="#F5C242"/>
  <path d="M22 84 H50" stroke="#A9CCF2" stroke-width="4" stroke-linecap="round"/>`,
  wet: `<path d="M64 8 V22 C64 30 58 34 50 34 H34" fill="none" stroke="#2B3A67" stroke-width="13" stroke-linecap="round"/>
  <path d="M64 8 V22 C64 30 58 34 50 34 H34" fill="none" stroke="url(#g-steel)" stroke-width="8" stroke-linecap="round"/>
  <rect class="ag-o" x="26" y="30" width="14" height="9" rx="4" fill="#6E7A92"/>
  <path d="M33 42 V74" fill="none" stroke="#3F7ECF" stroke-width="8" stroke-linecap="round"/>
  <path d="M33 42 V74" fill="none" stroke="#A9CCF2" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  <path class="ag-o" d="M14 84 C14 72 24 66 34 66 C42 66 46 70 46 76 L46 96 C46 106 38 112 30 112 C20 112 14 104 14 94 Z" fill="#F2C6A0"/>
  <path class="ag-o" d="M48 88 C48 74 58 66 70 66 C80 66 86 72 86 80 L86 98 C86 108 78 114 68 114 C56 114 48 106 48 96 Z" fill="#FFCF9E"/>
  <g stroke="#D9A06E" stroke-width="3" stroke-linecap="round">
    <path d="M58 76 V92"/><path d="M68 76 V94"/><path d="M78 78 V92"/>
  </g>
  <g fill="#A9CCF2"><circle cx="24" cy="58" r="3"/><circle cx="46" cy="56" r="2.4"/><circle cx="56" cy="62" r="2"/></g>`,
  soapbar: `<g fill="#FFFFFF" stroke="#B9CFE6" stroke-width="2.6">
    <circle cx="44" cy="34" r="12"/><circle cx="72" cy="26" r="15"/><circle cx="94" cy="42" r="10"/>
    <circle cx="26" cy="48" r="8"/>
  </g>
  <rect class="ag-o" x="40" y="52" width="48" height="22" rx="9" fill="#8FCB86"/>
  <path d="M48 58 C50 55 54 54 58 54" fill="none" stroke="#DFF3DB" stroke-width="4" stroke-linecap="round"/>
  <path class="ag-o" d="M14 84 C14 72 24 66 34 66 C42 66 46 70 46 76 L46 96 C46 106 38 112 30 112 C20 112 14 104 14 94 Z" fill="#F2C6A0"/>
  <path class="ag-o" d="M48 88 C48 74 58 66 70 66 C80 66 86 72 86 80 L86 98 C86 108 78 114 68 114 C56 114 48 106 48 96 Z" fill="#FFCF9E"/>
  <g stroke="#D9A06E" stroke-width="3" stroke-linecap="round">
    <path d="M58 82 V96"/><path d="M68 82 V98"/><path d="M78 84 V96"/>
  </g>`,
  dry: `<path d="M18 16 H110" fill="none" stroke="#2B3A67" stroke-width="7" stroke-linecap="round"/>
  <path class="ag-o" d="M30 20 H98 V72 C98 82 90 88 80 88 H48 C38 88 30 82 30 72 Z" fill="#3F7ECF"/>
  <path d="M30 58 H98" stroke="#2A62A8" stroke-width="4"/>
  <path d="M30 68 H98" stroke="#2A62A8" stroke-width="4"/>
  <path d="M40 26 V52" fill="none" stroke="#A9CCF2" stroke-width="5" stroke-linecap="round"/>
  <path class="ag-o" d="M32 96 C32 84 42 78 52 78 C60 78 64 82 64 88 L64 106 C64 114 56 120 48 120 C38 120 32 112 32 102 Z" fill="#F2C6A0"/>
  <path class="ag-o" d="M64 98 C64 86 74 78 86 78 C96 78 100 84 100 92 L100 108 C100 116 92 122 82 122 C70 122 64 114 64 104 Z" fill="#FFCF9E"/>
  <g stroke="#D9A06E" stroke-width="3" stroke-linecap="round">
    <path d="M74 88 V104"/><path d="M84 88 V106"/><path d="M92 90 V104"/>
  </g>`
};
SC2.bagopen = `
  <path d="M44 34 C44 22 53 14 64 14 C75 14 84 22 84 34" fill="none" stroke="#2B3A67" stroke-width="5" stroke-linecap="round"/>
  <path class="ag-o" d="M30 44 H98 C104 44 108 48 108 54 V104 C108 110 104 114 98 114 H30 C24 114 20 110 20 104 V54 C20 48 24 44 30 44 Z" fill="#E2703A"/>
  <path class="ag-o" d="M20 56 H108 V70 H20 Z" fill="#2A3450"/>
  <path class="ag-o" d="M22 56 C22 44 30 34 42 30 L50 44 C42 47 36 50 36 56 Z" fill="#C9562A"/>
  <path class="ag-o" d="M22 54 H106 C106 44 98 36 86 34 H42 C30 36 22 44 22 54 Z" fill="#8E3A14"/>
  <path d="M32 80 C32 76 35 74 39 74" fill="none" stroke="#F7B98E" stroke-width="4" stroke-linecap="round"/>
  <path d="M30 96 H52" stroke="#B44A22" stroke-width="3" stroke-linecap="round"/>`;
SC2.palovready = `
  <path class="ag-o" d="M8 76 H120 C118 96 100 110 64 110 C28 110 10 96 8 76 Z" fill="#F4F6FB"/>
  <ellipse class="ag-o" cx="64" cy="76" rx="56" ry="12" fill="#D7DEEE"/>
  <path class="ag-o" d="M16 74 C22 56 40 44 64 44 C88 44 106 56 112 74 C96 82 82 85 64 85 C46 85 32 82 16 74 Z" fill="#F7EFDC"/>
  <g stroke="#2B3A67" stroke-width="2.6" stroke-linejoin="round">
    <rect x="34" y="56" width="17" height="7" rx="3.5" fill="#F59A42"/>
    <rect x="58" y="52" width="17" height="7" rx="3.5" fill="#F08C32"/>
    <rect x="80" y="58" width="16" height="7" rx="3.5" fill="#F59A42"/>
    <rect x="46" y="64" width="15" height="7" rx="3.5" fill="#E27C22"/>
    <rect x="68" y="64" width="15" height="7" rx="3.5" fill="#F08C32"/>
    <rect x="42" y="47" width="15" height="9" rx="4" fill="#B4563A"/>
    <rect x="66" y="44" width="15" height="9" rx="4" fill="#C4674A"/>
  </g>
  <g fill="none" stroke="#C9D6EA" stroke-width="3.4" stroke-linecap="round">
    <path d="M44 34 c4-5 -4-9 0-14"/><path d="M64 30 c4-5 -4-9 0-14"/><path d="M84 34 c4-5 -4-9 0-14"/>
  </g>
  <path d="M22 78 C30 86 44 90 56 91" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
Object.assign(SC, SC2);
Object.keys(SC2).forEach((k) => {
  VB[k] = "0 0 128 128";
});
var BLOB_A = "M196,126 C227,126 269,138 292,156 C315,174 329,207 332,236 C335,265 330,312 308,332 C286,352 236,353 200,354 C164,355 117,357 94,338 C71,319 62,272 64,242 C66,212 82,177 104,158 C126,139 165,126 196,126 Z";
var GLUK_EYES = {
  open: <g><ellipse cx="168" cy="216" rx="26" ry="30" fill={ART.gCream} /><ellipse cx="240" cy="216" rx="26" ry="30" fill={ART.gCream} /><ellipse cx="171" cy="220" rx="13" ry="15" fill={ART.gInk} /><ellipse cx="243" cy="220" rx="13" ry="15" fill={ART.gInk} /><circle cx="166" cy="213" r="4.6" fill="#fff" /><circle cx="238" cy="213" r="4.6" fill="#fff" /></g>,
  wide: <g><ellipse cx="168" cy="214" rx="30" ry="35" fill={ART.gCream} /><ellipse cx="240" cy="214" rx="30" ry="35" fill={ART.gCream} /><ellipse cx="170" cy="216" rx="12" ry="14" fill={ART.gInk} /><ellipse cx="242" cy="216" rx="12" ry="14" fill={ART.gInk} /><circle cx="165" cy="210" r="4.2" fill="#fff" /><circle cx="237" cy="210" r="4.2" fill="#fff" /></g>,
  side: <g><ellipse cx="168" cy="216" rx="26" ry="29" fill={ART.gCream} /><ellipse cx="240" cy="216" rx="26" ry="29" fill={ART.gCream} /><ellipse cx="182" cy="218" rx="12" ry="14" fill={ART.gInk} /><ellipse cx="254" cy="218" rx="12" ry="14" fill={ART.gInk} /><circle cx="178" cy="212" r="4" fill="#fff" /><circle cx="250" cy="212" r="4" fill="#fff" /></g>,
  happy: <g fill="none" stroke={ART.gInk} strokeWidth="8" strokeLinecap="round"><path d="M148,224 Q168,198 188,224" /><path d="M220,224 Q240,198 260,224" /></g>,
  star: <g><g fill={ART.gInk}><path d="M168,194 q4,17 21,22 q-17,5 -21,22 q-4,-17 -21,-22 q17,-5 21,-22 Z" /><path d="M240,194 q4,17 21,22 q-17,5 -21,22 q-4,-17 -21,-22 q17,-5 21,-22 Z" /></g><circle cx="168" cy="216" r="4" fill="#FFF3C4" /><circle cx="240" cy="216" r="4" fill="#FFF3C4" /></g>
};
var GLUK_MOUTH = {
  rest: <path d="M186,282 Q204,294 222,282" fill="none" stroke="#5C1A0F" strokeWidth="8" strokeLinecap="round" />,
  o: <g><ellipse cx="204" cy="286" rx="17" ry="20" fill="url(#agMouth)" /><ellipse cx="204" cy="296" rx="9" ry="7" fill={ART.tongue} /></g>,
  a: <g><path d="M172,272 Q204,262 236,272 Q231,314 204,314 Q177,314 172,272 Z" fill="url(#agMouth)" /><path d="M184,302 q20,-8 40,0 q-9,11 -20,11 q-11,0 -20,-11 Z" fill={ART.tongue} /></g>,
  e: <g><ellipse cx="204" cy="284" rx="30" ry="12" fill="url(#agMouth)" /><path d="M180,281 h48" stroke={ART.gCream} strokeWidth="4" strokeLinecap="round" opacity=".65" /></g>,
  m: <path d="M180,284 h48" stroke="#5C1A0F" strokeWidth="9" strokeLinecap="round" />,
  smile: <g><path d="M170,272 Q204,266 238,272 Q234,310 204,310 Q174,310 170,272 Z" fill="url(#agMouth)" /><path d="M182,300 q22,-9 44,0 q-10,10 -22,10 q-12,0 -22,-10 Z" fill={ART.tongue} /></g>
};
var VISEMES = ["rest", "a", "e", "o", "a", "m", "e", "a"];
function Gluk({ eyes = "open", mouth = "rest", blush = false, size = 110, talking = false }) {
  const [v, setV] = useState2(0);
  useEffect2(() => {
    if (!talking) return void 0;
    const id = setInterval(() => setV((n) => (n + 1) % VISEMES.length), 170);
    return () => clearInterval(id);
  }, [talking]);
  const m = talking ? VISEMES[v] : mouth;
  return <svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    role="img"
    aria-label="Gluk"
    style={{ display: "block", overflow: "visible", flex: "0 0 auto" }}
  ><ellipse cx="200" cy="366" rx="72" ry="10" fill="#7A3E1A" opacity=".18" /><motion.g animate={{ x: [-5, 5, -5] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}><motion.g
    style={{ originX: "200px", originY: "300px" }}
    animate={{ scaleX: [1, 1.035, 0.975, 1], scaleY: [1, 0.972, 1.03, 1], rotate: [0, 1.1, -0.9, 0] }}
    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
  ><path d={BLOB_A} fill="url(#agGoo)" /><ellipse cx="140" cy="176" rx="48" ry="27" fill="url(#agShine)" opacity=".9" transform="rotate(-26 140 176)" /></motion.g>{GLUK_EYES[eyes] || GLUK_EYES.open}{GLUK_MOUTH[m] || GLUK_MOUTH.rest}{blush && <g><ellipse cx="120" cy="258" rx="24" ry="14" fill="url(#agBlush)" /><ellipse cx="288" cy="258" rx="24" ry="14" fill="url(#agBlush)" /></g>}</motion.g></svg>;
}
function mobileNow(bp) {
  if (typeof window === "undefined") return false;
  /* Телефон лёжа — «мобильный» по РАЗМЕРАМ (картинки и карточки компактные),
     но сетки у него широкие, как на компьютере: см. NARROW(). */
  return window.innerWidth < bp || window.innerWidth < 950 && window.innerHeight < 560;
}
function useIsMobile(breakpoint = 640) {
  const [m, setM] = useState2(() => mobileNow(breakpoint));
  useEffect2(() => {
    const c = () => setM(mobileNow(breakpoint));
    c();
    window.addEventListener("resize", c);
    window.addEventListener("orientationchange", c);
    return () => {
      window.removeEventListener("resize", c);
      window.removeEventListener("orientationchange", c);
    };
  }, [breakpoint]);
  return m;
}
function useShort(limit = 720) {
  const [v, setV] = useState2(false);
  useEffect2(() => {
    const c = () => setV(window.innerHeight < limit);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, [limit]);
  return v;
}
function LangPicker() {
  const ctx = React.useContext(LangCtx);
  if (!ctx) return null;
  return <div style={{
    display: "flex",
    gap: 2,
    padding: 2,
    borderRadius: 99,
    background: "rgba(255,255,255,.75)",
    border: `1px solid ${C.gray2}`
  }}>{LANGS2.map(([code, label]) => {
    const on = ctx.lang === code;
    return <button
      key={code}
      onClick={() => ctx.set(code)}
      aria-label={code}
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: 99,
        padding: "3px 9px",
        minHeight: 26,
        fontFamily: F.mono,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".06em",
        background: on ? C.primary : "transparent",
        color: on ? "#fff" : C.gray1,
        transition: "background .2s, color .2s"
      }}
    >{label}</button>;
  })}</div>;
}
function AudioIndicator({ audio }) {
  const { isPlaying, muted, replay, toggleMute } = audio;
  return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{
    /* Замерено 12.09: было 24 и 22 px — вдвое меньше нормы в 44. Ребёнок
       промахивался мимо и глушил урок, сам того не заметив, а вернуть
       голос потом не догадывался. Значок остался прежним — выросла сама
       цель нажатия. */
  }<button
    onClick={toggleMute}
    title={muted ? "Sound on" : "Sound off"}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      width: 44,
      height: 44,
      borderRadius: 99,
      flex: "0 0 auto",
      display: "grid",
      placeItems: "center",
      color: muted ? C.gray1 : isPlaying ? C.primary : C.text
    }}
  >{muted ? <VolumeX size={20} /> : isPlaying ? <Volume2 size={20} /> : <Volume1 size={20} />}</button>{!muted && <button
    onClick={replay}
    title="Replay"
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      width: 44,
      height: 44,
      borderRadius: 99,
      flex: "0 0 auto",
      display: "grid",
      placeItems: "center",
      color: C.gray1
    }}
  ><RotateCcw size={18} /></button>}</div>;
}
function Backdrop({ tone }) {
  const [a, b, d1, d2] = tone;
  const blob = (s) => ({ position: "absolute", borderRadius: "50%", filter: "blur(30px)", opacity: 0.5, ...s });
  const ros = { position: "absolute", opacity: 0.13, color: d1 };
  return <div aria-hidden="true" style={{
    position: "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    background: `linear-gradient(168deg, ${a} 0%, ${b} 100%)`
  }}><motion.span
    style={blob({ width: "44vmin", height: "44vmin", left: "-12vmin", top: "-10vmin", background: d1 })}
    animate={{ x: ["0vmin", "7vmin"], y: ["0vmin", "5vmin"], scale: [1, 1.12] }}
    transition={{ duration: 26, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  /><motion.span
    style={blob({ width: "36vmin", height: "36vmin", right: "-10vmin", top: "16vmin", background: d2 })}
    animate={{ x: ["0vmin", "-6vmin"], y: ["0vmin", "7vmin"], scale: [1, 1.08] }}
    transition={{ duration: 31, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  /><motion.span
    style={blob({ width: "52vmin", height: "52vmin", right: "4vmin", bottom: "-20vmin", background: d1 })}
    animate={{ x: ["0vmin", "-8vmin"], y: ["0vmin", "-6vmin"], scale: [1, 1.14] }}
    transition={{ duration: 37, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  /><motion.svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    style={{ ...ros, width: "26vmin", height: "26vmin", left: "-6vmin", bottom: "6vmin" }}
    animate={{ rotate: 360 }}
    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
  ><circle cx="50" cy="50" r="14" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="44" /><g strokeLinecap="round"><path d="M50 6v14" /><path d="M50 80v14" /><path d="M6 50h14" /><path d="M80 50h14" /><path d="M19 19l10 10" /><path d="M71 71l10 10" /><path d="M81 19L71 29" /><path d="M29 71L19 81" /></g><circle cx="50" cy="27" r="5" /><circle cx="50" cy="73" r="5" /><circle cx="27" cy="50" r="5" /><circle cx="73" cy="50" r="5" /></motion.svg><motion.svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    style={{ ...ros, width: "20vmin", height: "20vmin", right: "6vmin", top: "-4vmin" }}
    animate={{ rotate: -360 }}
    transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
  ><circle cx="50" cy="50" r="18" /><circle cx="50" cy="50" r="38" /><circle cx="50" cy="50" r="6" /><g strokeLinecap="round"><path d="M50 4v12" /><path d="M50 84v12" /><path d="M4 50h12" /><path d="M84 50h12" /></g></motion.svg></div>;
}
var NW_DESK = 880;
var NH_DESK = 626;
var NH_PHONE = 620;
var FIT_MIN = 0.62;
var FIT_MAX = 1.25;
function useWinW() {
  const [w, setW] = useState2(() => typeof window === "undefined" ? 1280 : window.innerWidth);
  useEffect2(() => {
    const c = () => setW(window.innerWidth);
    c();
    window.addEventListener("resize", c);
    window.addEventListener("orientationchange", c);
    return () => {
      window.removeEventListener("resize", c);
      window.removeEventListener("orientationchange", c);
    };
  }, []);
  return w;
}
function useLessonScale(isMobile, areaRef, boxRef) {
  const [st, setSt] = useState2({ k: 1, nat: 0, over: false });
  useLayoutEffect(() => {
    const measure = () => {
      const area = areaRef.current;
      const box = boxRef.current;
      if (!area || !box) return;
      const cs = window.getComputedStyle(area);
      const h = area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const w = area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (h <= 0 || w <= 0) return;
      const nw = isMobile ? w : NW_DESK;
      const nh = isMobile ? NH_PHONE : NH_DESK;
      const raw = Math.min(h / nh, w / nw, isMobile ? 1 : FIT_MAX);
      const k = Math.max(FIT_MIN, Math.round(raw * 1e3) / 1e3);
      const nat = box.offsetHeight;
      const over = nat * k > h + 1;
      setSt((p) => Math.abs(p.k - k) < 4e-3 && Math.abs(p.nat - nat) < 2 && p.over === over ? p : { k, nat, over });
    };
    measure();
    const RO = typeof ResizeObserver === "function" ? ResizeObserver : null;
    const ro = RO ? new RO(measure) : null;
    if (ro) {
      if (areaRef.current) ro.observe(areaRef.current);
      if (boxRef.current) ro.observe(boxRef.current);
    }
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    const t1 = setTimeout(measure, 600);
    const t2 = setTimeout(measure, 2e3);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isMobile, areaRef, boxRef]);
  return st;
}
/* ВПИСАТЬ ЭКРАН В ГАДЖЕТ. Содержимое экрана меряется целиком — вместе с тем,
   что вылезло за края, — и уменьшается, пока не встанет в область между
   шапкой и кнопками. Ни обрезки, ни прокрутки ни на одном гаджете. Меряем
   по таймеру, а не по каждому кадру: Глюк «дышит» бесконечно, и замер по
   изменениям стиля не остановился бы никогда. Уменьшаем сразу, а обратно
   растём только на заметную величину — чтобы экран не дрожал. */
function useFitVW() {
  const [w, setW] = React.useState(() => typeof window === "undefined" ? 1280 : window.innerWidth);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}
/* Телефон лёжа: высота меньше 500 и ширина больше высоты. */
function useFitSide() {
  const get = () => typeof window !== "undefined" && window.innerHeight < 500 && window.innerWidth > window.innerHeight;
  const [v, setV] = React.useState(get);
  React.useEffect(() => {
    const on = () => setV(get());
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => { window.removeEventListener("resize", on); window.removeEventListener("orientationchange", on); };
  }, []);
  return v;
}
const fitFlat = (c) => React.Children.toArray(c).flatMap((x) => x && x.type === React.Fragment ? fitFlat(x.props.children) : [x]);
/* Первый блок каждого экрана — полоса Глюка (проверено замером на всех 56
   страницах). Лёжа она встаёт колонкой: её собственная строка разворачивается
   в столбец, высота — по содержимому. */
const FIT_BB_CSS = ".fit-box [style*=\"width: 100%\"] { box-sizing: border-box; }";
const FIT_SIDE_CSS = ".fit-side > * { height: auto !important; min-height: 0 !important; flex-direction: column !important; align-items: center !important; justify-content: flex-start !important; margin: 0 !important; gap: 8px !important; } .fit-side > * > * { margin-left: 0 !important; margin-right: 0 !important; }";
function FitBox({ children, maxW = 880, stretch = false }) {
  const side = useFitSide();
  const areaRef = React.useRef(null);
  const boxRef = React.useRef(null);
  const [fit, setFit] = React.useState({ k: 1, w: 0, dx: 0 });
  React.useLayoutEffect(() => {
    const area = areaRef.current;
    const box = boxRef.current;
    if (!area || !box) return void 0;
    // Меряем по вёрстке (offsetLeft/Top), а не по экрану: тряска, прыжки и
    // перестановки карточек идут через transform и не должны дёргать масштаб.
    const span = (w) => {
      if (box.style.width !== w + "px") box.style.width = w + "px";
      /* stretch: мерим при минимальном кадре — высота по содержимому. */
      if (stretch) box.style.height = "auto";
      let minL = 0;
      let maxR = w;
      let maxB = box.offsetHeight;
      const els = box.querySelectorAll("*");
      /* Блок, который сам обрезает содержимое (лента «не помещается» — так
         задумано), меряем целиком, а то, что внутри него, — нет. */
      const clip = new Set();
      for (let n = 0; n < els.length; n++) {
        const el = els[n];
        if (!(el instanceof HTMLElement) || !el.offsetParent || !el.offsetWidth) continue;
        let cut = false;
        for (let q = el.parentElement; q && q !== box; q = q.parentElement) if (clip.has(q)) { cut = true; break; }
        if (cut) continue;
        const cs = el.style;
        if (cs.overflow === "hidden" || cs.overflowX === "hidden" || cs.overflow === "clip" || cs.overflowX === "clip") clip.add(el);
        let x = 0;
        let y = 0;
        let e = el;
        while (e && e !== box) {
          x += e.offsetLeft;
          y += e.offsetTop;
          e = e.offsetParent;
        }
        if (e !== box) continue;
        if (x < minL) minL = x;
        if (x + el.offsetWidth > maxR) maxR = x + el.offsetWidth;
        if (y + el.offsetHeight > maxB) maxB = y + el.offsetHeight;
      }
      return { minL, maxR, maxB };
    };
    const measure = () => {
      const aw = area.clientWidth;
      const ah = area.clientHeight;
      if (!aw || !ah) return;
      // Что-то шире экрана (лента из пяти кадров) — раздвигаем вёрстку до его
      // ширины: соседние блоки растут вместе с ним, и после уменьшения страница
      // остаётся ровной, без пустой полосы сбоку.
      let w = Math.min(maxW, aw);
      let m = span(w);
      for (let t = 0; t < 3 && m.maxR - m.minL > w + 1; t++) {
        w = Math.min(Math.ceil(m.maxR - m.minL), Math.round(aw * 1.8));
        m = span(w);
      }
      const natW = Math.max(w, m.maxR - m.minL);
      const k = Math.min(1, aw / natW, ah / m.maxB);
      const dx = -((m.minL + m.maxR) / 2 - w / 2) * k;
      /* …а после замера отдаём кадру всю высоту области. */
      if (stretch) box.style.height = Math.floor(ah / k) + "px";
      setFit((p) => {
        const grow = k > p.k;
        if (p.w === w && Math.abs(p.dx - dx) < 1 && (grow ? k - p.k < 0.03 : p.k - k < 0.004)) return p;
        return { k, w, dx };
      });
    };
    measure();
    // Следим только за областью: ширину коробки меняет сам замер, и слежка
    // за ней зацикливала ResizeObserver.
    const ro = new ResizeObserver(measure);
    ro.observe(area);
    const iv = setInterval(measure, 400);
    return () => { ro.disconnect(); clearInterval(iv); };
  }, [maxW, stretch]);
  return <div ref={areaRef} data-fit={fit.k.toFixed(3)} style={{ flex: 1, minHeight: 0, width: "100%", position: "relative" }}><style>{FIT_BB_CSS}</style><div ref={boxRef} className="fit-box" style={{
    position: "absolute",
    top: 0,
    left: "50%",
    display: stretch ? "flex" : void 0,
    flexDirection: stretch ? "column" : void 0,
    width: fit.w || "100%",
    transform: `translateX(-50%) translateX(${fit.dx.toFixed(1)}px) scale(${fit.k.toFixed(4)})`,
    transformOrigin: "top center"
  }}>{side ? (() => {
    const all = fitFlat(children);
    /* <style> первым ребёнком — не полоса Глюка: её берём первой из остальных. */
    const head = all.findIndex((x) => !(x && x.type === "style"));
    const kids = head < 0 ? all : [all[head]].concat(all.filter((_, q) => q !== head));
    if (kids.length < 2) return children;
    return <><style>{FIT_SIDE_CSS}</style><div style={stretch ? { display: "flex", alignItems: "stretch", gap: 14, flex: 1, minHeight: 0 } : { display: "flex", alignItems: "flex-start", gap: 14 }}><div className="fit-side" style={{ flex: "0 0 auto", paddingTop: 4 }}>{kids[0]}</div><div style={stretch ? { flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" } : { flex: "1 1 0", minWidth: 0 }}>{kids.slice(1)}</div></div></>;
  })() : children}</div></div>;
}
function VideoStage({ children, progress, kicker, screenIdx, totalScreens, audio }) {
  const isMobile = useIsMobile();
  const land = LANDP();
  const winW = useWinW();
  const padX = isMobile ? 12 : Math.max(16, Math.min(100, Math.round((winW - NW_DESK) / 2)));
  const glass = "rgba(255,255,255,.72)";
  return <div style={{
    height: "100vh",
    width: "100%",
    background: C.bg,
    color: C.text,
    fontFamily: F.sans,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative"
  }}><ArtDefs /><Backdrop tone={TONES[0]} /><div style={{
    flex: "0 0 auto",
    background: glass,
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${C.gray2}`,
    position: "relative",
    zIndex: 1
  }}><div style={{ height: 3, background: C.gray2 }}><motion.div
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5 }}
    style={{ height: "100%", background: C.primary }}
  /></div><div style={{ padding: `${land ? 4 : 10}px ${padX}px`, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>{
    /* Рубрика словами снята: на экране урока текста нет вовсе. ТОЧКА КУРСА
       СЛЕВА ТОЖЕ СНЯТА (QA, 17.09: «nuqtacha kerak emas»). Вместе с ней
       ряд перешёл с «по краям» на «к правому краю»: без точки слева
       языки и счётчик уехали бы влево. Остались только они — цифры дети
       этого возраста читают свободно. */
  }<div style={{ display: "flex", alignItems: "center", gap: 12 }}><LangPicker />{audio && <AudioIndicator audio={audio} />}<div style={{ fontFamily: F.mono, fontSize: isMobile ? 10 : 11, color: C.gray1, letterSpacing: "0.1em" }}>{String(screenIdx + 1).padStart(2, "0")} / {String(totalScreens).padStart(2, "0")}</div></div></div></div>{
    /* Содержимое прижато к ВЕРХУ, а не по центру. Замер 08.09: при
       центрировании короткий экран начинался ниже длинного — верх кадра
       гулял 114…199px, и картинка стояла на разной высоте от экрана к
       экрану. С flex-start полоса персонажей у всех начинается одинаково,
       а значит и кадр под ней. */
  }<div style={{
    flex: 1,
    minHeight: 0,
    width: "100%",
    /* border-box: без него отступы по бокам прибавлялись к 100% ширины, и
       область выходила за экран — на телефоне на 24 px, на планшете на 200. */
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: `${land ? 6 : isMobile ? 14 : 26}px ${padX}px ${land ? 6 : isMobile ? 12 : 20}px`,
    overflow: "hidden",
    position: "relative",
    zIndex: 1
  }}><FitBox>{children}</FitBox></div></div>;
}
var AUTO_HOLD = 1e3;
function useAutoNext(open, busy, onNext) {
  const openAtMount = useRef2(open).current;
  const fired = useRef2(false);
  useEffect2(() => {
    if (openAtMount || fired.current) return void 0;
    if (!open || busy || typeof onNext !== "function") return void 0;
    const id = setTimeout(() => {
      fired.current = true;
      onNext();
    }, AUTO_HOLD);
    return () => clearTimeout(id);
  }, [open, busy, onNext, openAtMount]);
}
function Btn({ children, onClick, kind = "dark", disabled = false, round = false, style = {} }) {
  const kinds = {
    dark: { background: BACK_BG, color: "#fff", border: `1.5px solid ${BACK_BG}` },
    back: { background: BACK_BG, color: "#fff", border: `1.5px solid ${BACK_BG}` }
  };
  return <motion.button
    onClick={onClick}
    disabled={disabled}
    whileTap={disabled ? {} : { scale: 0.96 }}
    style={{
      fontFamily: F.sans,
      fontWeight: 700,
      // Круглая кнопка без слова: в уроке нет текста, и «Дальше» — это стрелка.
      // 56px — цель касания с запасом к минимальным 44.
      padding: round ? 0 : "clamp(11px,2vw,13px) clamp(16px,2.5vw,26px)",
      width: round ? 56 : void 0,
      height: round ? 56 : void 0,
      fontSize: "clamp(14px,1.8vw,16px)",
      borderRadius: round ? 999 : 12,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.38 : 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 48,
      ...kinds[kind],
      ...style
    }}
  >{children}</motion.button>;
}
var NAV_KNOPKA = (mob) => ({
  minHeight: "clamp(48px, 7dvh, 52px)",
  borderRadius: 999,
  fontSize: 17,
  fontWeight: 700,
  ...mob ? { flex: "1 1 0", minWidth: 0, padding: "0 14px" } : { minWidth: "min(200px, 100%)", padding: "0 32px" }
});
function NavBar({ i, onBack, onNext, nextLabel, nextDisabled }) {
  const isMobile = useIsMobile();
  const land = LANDP();
  const padX = land ? 20 : isMobile ? 12 : 100;
  return <div style={{
    flex: "0 0 auto",
    background: "rgba(255,255,255,.72)",
    backdropFilter: "blur(10px)",
    borderTop: `1px solid ${C.gray2}`,
    position: "relative",
    zIndex: 1,
    padding: `${land ? 5 : 10}px ${padX}px`,
    display: "flex",
    gap: 12,
    alignItems: "center"
  }}>{onBack && <Btn onClick={onBack} kind="back" style={NAV_KNOPKA(isMobile)}><ArrowLeft size={24} />{L.ui_back[i]}</Btn>}<Btn onClick={onNext} kind="dark" disabled={nextDisabled} style={{ marginLeft: "auto", ...NAV_KNOPKA(isMobile) }}>{nextLabel || L.ui_next[i]}<ArrowRight size={26} /></Btn></div>;
}
function ArtRow({ keys, isMobile, cross = false, numbered = true }) {
  const sz = (LANDP() ? [0, 150, 120, 92, 76] : isMobile ? [0, 210, 158, 110, 92] : [0, 340, 268, 212, 170])[Math.min(keys.length, 4)];
  return <div style={{ position: "relative", display: "flex", gap: isMobile ? 8 : 14, alignItems: "center" }}>{keys.map((k, i) => <div key={i} style={{
    position: "relative",
    background: "#fff",
    borderRadius: 18,
    border: `2px solid ${C.gray2}`,
    padding: isMobile ? 6 : 10
  }}><Art k={k} size={sz} />{numbered && <span style={{
    position: "absolute",
    top: 5,
    left: 9,
    fontFamily: F.mono,
    fontSize: isMobile ? 12 : 15,
    fontWeight: 700,
    color: C.primary
  }}>{i + 1}</span>}</div>)}{cross && <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: C.red2 }}><X size={isMobile ? 96 : 140} strokeWidth={3} /></span>}</div>;
}
function Carousel({ i, slides, audio, onDone }) {
  const isMobile = useIsMobile();
  const [n, setN] = useState2(0);
  const doneRef = useRef2(false);
  const advance = useCallback(() => {
    if (doneRef.current) return;
    if (n >= slides.length - 1) {
      doneRef.current = true;
      onDone();
      return;
    }
    audio.triggerEvent("button_click", "step");
    setN(n + 1);
  }, [n, slides.length, onDone, audio]);
  useEffect2(() => {
    const id = setTimeout(advance, readMs(slides[n].audio[i]));
    return () => clearTimeout(id);
  }, [n, i, advance, slides]);
  const s = slides[n];
  return <div><div onClick={advance} style={{ height: LANDP() ? 190 : isMobile ? 320 : 430, display: "grid", placeItems: "center", cursor: "pointer" }}><AnimatePresence mode="wait"><motion.div
    key={n}
    initial={{ opacity: 0, x: 90 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -90 }}
    transition={{ duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
  >{s.row ? <ArtRow keys={s.row} isMobile={isMobile} cross={s.cross} numbered={s.num !== false} /> : <div style={{ background: "#fff", border: `1.5px solid ${C.gray2}`, borderRadius: 18, padding: "12px 16px" }}><Wide k={s.art} max={420} /></div>}{
    /* Заголовок и подпись слайда сняты: карточка объясняет рисунком,
       остальное договаривает Глюк. */
  }</motion.div></AnimatePresence></div><div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 8 }}>{slides.map((_, k) => <span key={k} style={{
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: k === n ? C.primary : C.gray2,
    transform: k === n ? "scale(1.35)" : "none",
    transition: "all .3s"
  }} />)}</div></div>;
}
function Frame({ art, label, num, state, onClick, isMobile, big, badge = true }) {
  const on = state === "on" || state === "now";
  const box = {
    flex: 1,
    background: state === "now" ? C.yellow3 : state === "gap" ? "#fff5f0" : "#fff",
    border: state === "now" ? `1.5px solid ${C.orange1}` : state === "gap" ? `2px dashed ${C.primary}` : state === "hot" ? `1.5px dashed ${C.primary}` : `1.5px solid ${C.gray2}`,
    borderRadius: big ? 16 : 12,
    padding: big ? "12px 6px 10px" : "9px 4px 7px",
    minHeight: big ? isMobile ? 104 : 132 : isMobile ? 78 : 90,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: big ? 5 : 3,
    // 'hot' — это кадр, на который надо нажать: он обязан быть ЯРЧЕ соседей, а
    // не бледнее. Непройденные подняты с 0.34: на 0.34 плёнка почти не читалась.
    opacity: state === "off" ? 0.5 : 1,
    cursor: onClick ? "pointer" : "default",
    transition: "opacity .3s, border-color .3s, background .3s"
  };
  const artSize = big ? isMobile ? 62 : 92 : isMobile ? 50 : 72;
  return <motion.div onClick={onClick} whileTap={onClick ? { scale: 0.95 } : {}} style={box}>{art ? <Art k={art} size={artSize} /> : <span style={{ fontFamily: F.serif, fontSize: big ? 44 : 30, fontWeight: 600, color: C.primary }}>?</span>}<span style={{
    position: "absolute",
    top: big ? 6 : 4,
    left: big ? 8 : 6,
    fontFamily: F.mono,
    fontSize: big ? 12 : 10,
    color: on ? C.primary : C.gray1
  }}>{num}</span>{state === "on" && badge && <span style={{
    position: "absolute",
    top: -6,
    right: -6,
    width: 17,
    height: 17,
    borderRadius: "50%",
    background: C.green1,
    color: "#fff",
    display: "grid",
    placeItems: "center"
  }}><Check size={11} /></span>}</motion.div>;
}
function S0Hook({ i, displayName, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onNext }) {
  const segs = useMemo2(() => [{ id: "hook", text: TTS_MARK[i] + L.s0_audio[i], trigger: "on_mount" }], [i]);
  const audio = useAudio2(segs);
  const isMobile = useIsMobile();
  const [ready, setReady] = useState2(!!(storedAnswer && storedAnswer.seen));
  useEffect2(() => {
    if (ready) return void 0;
    const id = setTimeout(
      () => {
        setReady(true);
        onAnswer(screenIdx, { seen: true, type: "info" });
      },
      readMs(L.s0_audio[i])
    );
    return () => clearTimeout(id);
  }, [ready, i, onAnswer, screenIdx]);
  useAutoNext(ready, audio.isPlaying, onNext);
  return <><VideoStage progress={progress} kicker={L.k_hook[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>{
    /* Полоса персонажей — фиксированной высоты, как на остальных экранах */
  }<div style={{
    height: CAST_H(isMobile),
    display: "flex",
    alignItems: "flex-end",
    gap: isMobile ? 6 : 14,
    marginBottom: 10
  }}><Gluk size={HERO(isMobile)} eyes="wide" talking={audio.isPlaying} /></div>{
    /* УТРО РЕБЁНКА. Кадры выходят один за другим, пока Глюк договаривает
       фразу: сначала пусто, потом «вот они» — ровно то, о чём заголовок. */
  }{
    /* Правка 3 от 11.09: было пять кадров одной строкой в верхней трети и
       пустой низ. Стало 2×2 и на пятую часть крупнее, пятый кадр снят. */
  }<div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: isMobile ? 10 : 16,
    maxWidth: NARROW() ? "100%" : 620,
    margin: "0 auto"
  }}>{L.s0_morning.map((m, k) => <div key={k} style={{ display: "flex" }}><Frame art={m.art} num={k + 1} state="on" isMobile={isMobile} big badge={false} /></div>)}</div></VideoStage><NavBar i={i} onNext={onNext} nextDisabled={!ready} /></>;
}
function S1Tea({ i, progress, screenIdx, totalScreens, onNext, onBack }) {
  const [done, setDone] = useState2(0);
  const all = done >= L.s1_steps.length;
  const segs = useMemo2(() => {
    const a = [{
      id: "intro",
      text: TTS_MARK[i] + L.s1_audio[i],
      trigger: "on_mount",
      waits_for: { type: "button_click", target: "step" }
    }];
    L.s1_stepAudio.forEach((t, k) => a.push({
      id: "st" + k,
      text: TTS_MARK[i] + t[i],
      trigger: "after_previous",
      waits_for: k < L.s1_stepAudio.length - 1 ? { type: "button_click", target: "step" } : void 0
    }));
    a.push({ id: "end", text: TTS_MARK[i] + L.s1_audioEnd[i], trigger: "after_previous" });
    return a;
  }, [i]);
  const audio = useAudio2(segs);
  useAutoNext(all, audio.isPlaying, onNext);
  const isMobile = useIsMobile();
  const step = () => {
    if (all || audio.isPlaying) return;
    setDone(done + 1);
    audio.triggerEvent("button_click", "step");
  };
  return <><VideoStage progress={progress} kicker={L.k_look[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>{
    /* ПОЛОСА ПЕРСОНАЖЕЙ — всегда сверху и всегда одной высоты. Глюк стоит
       здесь с самого начала: он не выныривает снизу, когда заговорит, и
       кадр под полосой не сдвигается ни на пиксель. */
  }<div style={{
    height: CAST_H(isMobile),
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 8 : 14,
    marginBottom: 8
  }}><Gluk
    size={HERO(isMobile)}
    eyes={all ? "happy" : "open"}
    mouth={all ? "smile" : "rest"}
    talking={audio.isPlaying}
  /></div>{
    /* Кадр сцены. До первого нажатия он больше НЕ выцветает: серый чайник
       на 40% прозрачности читался как выключенный экран. Приглашение даёт
       оранжевая пунктирная рамка, а сама картинка живая с первой секунды. */
  }<div
    onClick={all || audio.isPlaying ? void 0 : step}
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: 12,
      border: done === 0 ? `4px solid ${C.primary}` : `1.5px solid ${C.gray2}`,
      boxShadow: done === 0 ? `0 0 0 8px ${C.yellow3}` : "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
      cursor: all ? "default" : "pointer",
      transition: "border-color .3s"
    }}
  ><div style={{ height: LANDP() ? 112 : isMobile ? 160 : 224, display: "grid", placeItems: "center" }}><AnimatePresence mode="wait"><motion.div
    key={done}
    initial={{ opacity: 0, scale: 0.72 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  ><Art k={done === 0 ? "kettle" : TEA_ART[done - 1]} size={LANDP() ? 112 : isMobile ? 160 : 224} /></motion.div></AnimatePresence></div>{
    /* Цифра-счётчик нажатий снята по слову Ника 17.09: «убери это, как я
       убрала в уроках до пятого» — обведена на снимке урока 6. Как в уроках
       3 и 5: куда нажимать, показывает рамка кадра (обводка 4 px и жёлтый
       ореол), а сколько уже прошло — видно по самим кадрам. Цифра в кружке
       читалась как оценка, а оценок в курсе нет. */
  }<div style={{ minHeight: 34, display: "grid", placeItems: "center" }}>{done === 0 && <span style={{
    display: "block",
    width: 44,
    height: 10,
    borderRadius: 99,
    background: C.primary,
    opacity: 0.55
  }} />}</div></div>{
    /* Плёнка шагов. Прыгающего Тика над ней больше нет: он дёргал взгляд и
       занимал полосу над кадром. Куда нажимать, показывает сама плёнка —
       следующий кадр обведён пунктиром (состояние 'hot'). */
  }<div style={{ display: "flex", gap: 7 }}>{L.s1_steps.map((s, k) => <Frame
    key={k}
    art={TEA_ART[k]}
    label={s[i]}
    num={k + 1}
    isMobile={isMobile}
    state={k < done ? k === done - 1 ? "now" : "on" : k === done ? "hot" : "off"}
    onClick={k === done && !all && !audio.isPlaying ? step : void 0}
  />)}</div></VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!all} /></>;
}
function S2Rule({ i, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onNext, onBack }) {
  const seen = !!(storedAnswer && storedAnswer.seen);
  const seenAtMount = useRef2(seen).current;
  const segs = useMemo2(() => {
    if (seenAtMount) return [{ id: "pre", text: TTS_MARK[i] + L.s2_pre[i], trigger: "on_mount" }];
    const a = [{ id: "pre", text: TTS_MARK[i] + L.s2_pre[i], trigger: "on_mount", waits_for: { type: "button_click", target: "step" } }];
    L.s2_slides.forEach((s, k) => a.push({
      id: "sl" + k,
      text: TTS_MARK[i] + s.audio[i],
      trigger: "after_previous",
      waits_for: k < L.s2_slides.length - 1 ? { type: "button_click", target: "step" } : void 0
    }));
    return a;
  }, [i, seenAtMount]);
  const audio = useAudio2(segs);
  const isMobile = useIsMobile();
  const [started, setStarted] = useState2(false);
  const trigger = audio.triggerEvent;
  useAutoNext(seen, audio.isPlaying, onNext);
  useEffect2(() => {
    if (seen || started) return void 0;
    const id = setTimeout(() => {
      setStarted(true);
      trigger("button_click", "step");
    }, readMs(L.s2_pre[i]));
    return () => clearTimeout(id);
  }, [seen, started, i, trigger]);
  return <><VideoStage progress={progress} kicker={L.k_rule[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>{
    /* Полоса той же высоты, что и на остальных экранах: без неё кадр этого
       экрана вставал на 199px против 116px у «Разбора» — картинка была
       не в одном месте. */
  }<div style={{ height: CAST_H(isMobile), display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 6 }}><Gluk size={HERO(isMobile)} eyes="open" talking={audio.isPlaying} /></div>{seen ? <div style={{ display: "grid", placeItems: "center", height: LANDP() ? 190 : isMobile ? 320 : 430 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><ArtRow keys={L.s2_slides[3].row} isMobile={isMobile} numbered={false} /></div></div> : started ? <Carousel i={i} slides={L.s2_slides} audio={audio} onDone={() => onAnswer(screenIdx, { seen: true, type: "info" })} /> : (
    /* Пока идёт вступление, кадр НЕ пустует. Раньше здесь десять секунд
       висел один абзац текста посреди пустого экрана. Показываем первую
       карточку — того же размера и на том же месте, где её подхватит
       карусель, так что при старте ничего не дёргается. */
    <div style={{ display: "grid", placeItems: "center", height: LANDP() ? 190 : isMobile ? 320 : 430 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><ArtRow keys={L.s2_slides[0].row} isMobile={isMobile} /></div></div>
  )}</VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!seen} /></>;
}
function linesOk(y, c, checkRows) {
  const rows = Math.ceil(y.length / c);
  for (let col = 0; col < c; col++) {
    const v = [];
    for (let r = 0; r < rows; r++) {
      const k = r * c + col;
      if (k < y.length) v.push(y[k]);
    }
    if (v.length > 1 && v.every((x) => x === v[0])) return false;
  }
  if (checkRows) {
    for (let r = 0; r < rows; r++) {
      const v = y.slice(r * c, r * c + c);
      if (v.length > 1 && v.every((x) => x === v[0])) return false;
    }
  }
  return true;
}
function shuffleN(n) {
  const a = [];
  for (let k = 0; k < n; k++) a.push(k);
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    const t = a[k];
    a[k] = a[j];
    a[j] = t;
  }
  return a;
}
function shuffleCards() {
  for (let tr = 0; tr < 400; tr++) {
    const a = CARDS.map((_, k) => k);
    for (let k = a.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      const t = a[k];
      a[k] = a[j];
      a[j] = t;
    }
    const y = a.map((k) => CARDS[k].yes);
    const alt = y.every((v, k) => v === (k % 2 === 0 ? y[0] : !y[0]));
    if (!alt && linesOk(y, 3, true) && linesOk(y, 2, false)) return a;
  }
  return [0, 2, 1, 5, 3, 4];
}
function S3Sort({ i, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onNext, onBack, order }) {
  const segs = useMemo2(() => [{ id: "q", text: TTS_MARK[i] + L.s3_audio[i], trigger: "on_mount" }], [i]);
  const audio = useAudio2(segs);
  const sfx = useSfx();
  const isMobile = useIsMobile();
  const [marks, setMarks] = useState2(() => storedAnswer && storedAnswer.marks || {});
  const answered = Object.keys(marks).length;
  const allDone = answered === CARDS.length;
  useAutoNext(allDone, audio.isPlaying, onNext);
  const right = order.filter((c, k) => marks[k] === CARDS[c].yes).length;
  const mark = (k, val) => {
    if (marks[k] !== void 0) return;
    const next = Object.assign({}, marks);
    next[k] = val;
    setMarks(next);
    const ok = val === CARDS[order[k]].yes;
    if (ok) sfx.playCorrect();
    else sfx.playWrong();
    if (Object.keys(next).length === CARDS.length) {
      const r = order.filter((c, n) => next[n] === CARDS[c].yes).length;
      onAnswer(screenIdx, { marks: next, correct: r >= 5, right: r, type: "sort" });
      setTimeout(() => audio.pushOneOff(TTS_MARK[i] + (r >= 5 ? L.s3_good[i] : L.s3_soso[i])), 400);
    }
  };
  return <><VideoStage progress={progress} kicker={L.k_game[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}><div style={{ height: CAST_H(isMobile), display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}><Gluk size={HERO(isMobile)} eyes={allDone ? "star" : "open"} mouth={allDone ? "smile" : "rest"} talking={audio.isPlaying} />{
    /* Легенда с галочкой и крестиком снята по правке 8 от 11.09:
       кнопки на самих карточках понятны и без неё. */
  }</div><div style={{ display: "grid", gridTemplateColumns: NARROW() ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 8 : 11 }}>{order.map((ci, k) => {
    const c = CARDS[ci], v = marks[k], ok = v !== void 0 && v === c.yes, bad = v !== void 0 && v !== c.yes;
    return <motion.div
      key={k}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.045 * k }}
      style={{
        background: ok ? C.green4 : bad ? C.redBg : "#fff",
        border: `1.5px solid ${ok ? C.green1 : bad ? C.primary : C.gray2}`,
        borderRadius: 14,
        padding: isMobile ? 9 : 11,
        display: "flex",
        flexDirection: "column",
        gap: 6
      }}
    ><div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 3 }}><Art k={c.art} size={isMobile ? 64 : 84} /></div>{v === void 0 ? <div style={{ display: "flex", gap: 6 }}><button
      onClick={() => mark(k, true)}
      aria-label="algorithm"
      style={{
        flex: 1,
        minHeight: 64,
        borderRadius: 9,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        border: `2px solid ${C.green1}`,
        background: "#fff",
        color: C.green1
      }}
    ><Check size={26} /></button><button
      onClick={() => mark(k, false)}
      aria-label="not an algorithm"
      style={{
        flex: 1,
        minHeight: 64,
        borderRadius: 9,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        border: `2px solid ${C.gray1}`,
        background: "#fff",
        color: C.gray1
      }}
    ><X size={26} /></button></div> : <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      minHeight: 44,
      color: ok ? C.green1 : C.primary,
      fontWeight: 700,
      fontSize: 13
    }}>{
      /* Верный ответ карточки показываем знаком, а не словом */
    }{c.yes ? <Check size={24} /> : <X size={24} />}</div>}</motion.div>;
  })}</div></VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!allDone} /></>;
}
var NEED_OPEN = 5;
function S4Twelve({ i, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onNext, onBack }) {
  const segs = useMemo2(() => [{ id: "a", text: TTS_MARK[i] + L.s4_audio[i], trigger: "on_mount" }], [i]);
  const audio = useAudio2(segs);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState2(() => storedAnswer && storedAnswer.open || []);
  const [active, setActive] = useState2(null);
  const enough = open.length >= NEED_OPEN;
  useAutoNext(enough, audio.isPlaying, onNext);
  const tap = (k) => {
    setActive(k);
    if (!open.includes(k)) {
      const nx = open.concat([k]);
      setOpen(nx);
      onAnswer(screenIdx, { open: nx, type: "explore" });
      if (nx.length === NEED_OPEN) setTimeout(() => audio.pushOneOff(TTS_MARK[i] + L.s4_done[i]), 300);
    }
  };
  return <><VideoStage progress={progress} kicker={L.k_life[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>{
    /* Глюк даёт задание — значит должен быть виден, пока говорит */
  }<div style={{ height: CAST_H(isMobile), display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}><Gluk size={HERO(isMobile)} eyes={enough ? "star" : "open"} mouth={enough ? "smile" : "rest"} talking={audio.isPlaying} />{
    /* Заголовок и подсказка сняты. Остался счётчик цифрами: сколько дел
       открыто из шести. Цифры в этом возрасте читают свободно. */
  }<div style={{
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: F.mono,
    fontWeight: 700,
    fontSize: isMobile ? 22 : 28,
    color: enough ? C.green1 : C.primary
  }}>{enough && <Check size={isMobile ? 22 : 26} />}<span>{Math.min(open.length, NEED_OPEN)} / {NEED_OPEN}</span></div></div>{
    /* Правка 9 от 11.09: было шесть в один ряд и рисунок 68px — не
       разглядеть. Стало три в ряд, вторая строка забирает пустоту внизу. */
  }<div style={{
    display: "grid",
    gridTemplateColumns: NARROW() ? "repeat(2,1fr)" : "repeat(3,1fr)",
    gap: isMobile ? 10 : 16,
    maxWidth: NARROW() ? "100%" : 720,
    margin: "0 auto"
  }}>{THINGS.map((th, k) => {
    const seen = open.includes(k);
    return <motion.button
      key={k}
      onClick={() => tap(k)}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.028 * k }}
      style={{
        background: active === k ? C.yellow3 : "#fff",
        cursor: "pointer",
        border: `1.5px solid ${active === k ? C.orange1 : seen ? C.green1 : C.gray2}`,
        borderRadius: 16,
        padding: isMobile ? 10 : 14,
        minHeight: LANDP() ? 78 : isMobile ? 110 : 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        position: "relative"
      }}
    ><Art k={th.art} size={LANDP() ? 58 : isMobile ? 84 : 122} />{seen && <span style={{
      position: "absolute",
      top: -6,
      right: -6,
      width: 17,
      height: 17,
      borderRadius: "50%",
      background: C.green1,
      color: "#fff",
      display: "grid",
      placeItems: "center"
    }}><Check size={11} /></span>}</motion.button>;
  })}</div><div style={{ minHeight: LANDP() ? 80 : isMobile ? 112 : 132, marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}><AnimatePresence mode="wait">{active !== null && <motion.div
    key={active}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25 }}
    style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, width: "100%" }}
  ><div style={{ display: "flex", gap: 8, flex: 1, minWidth: 0 }}>{THINGS[active].steps.map((s, n) => <motion.div
    key={n}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.11 * n }}
    style={{
      flex: 1,
      background: "#fff",
      border: `1.5px solid ${C.gray2}`,
      borderRadius: 11,
      padding: isMobile ? "8px 5px" : "9px 6px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 2
    }}
  ><Art k={THINGS[active].sa[n]} size={LANDP() ? 50 : isMobile ? 64 : 92} /><span style={{ position: "absolute", top: 5, left: 7, fontFamily: F.mono, fontSize: 12, fontWeight: 700, color: C.primary }}>{n + 1}</span></motion.div>)}</div></motion.div>}</AnimatePresence></div></VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!enough} /></>;
}
function PicMC({
  i,
  kicker,
  question,
  opts,
  correctIdx,
  wrong,
  audioText,
  film,
  filmCapt,
  steps,
  progress,
  screenIdx,
  totalScreens,
  storedAnswer,
  onAnswer,
  onNext,
  onBack
}) {
  const segs = useMemo2(() => [{ id: "q", text: TTS_MARK[i] + audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }], [i, audioText]);
  const audio = useAudio2(segs);
  const sfx = useSfx();
  const isMobile = useIsMobile();
  const [ord] = useState2(() => shuffleN(opts.length));
  const [picked, setPicked] = useState2(storedAnswer ? storedAnswer.picked : null);
  const rev = picked !== null && picked !== void 0;
  useAutoNext(rev, audio.isPlaying, onNext);
  const ok = picked === correctIdx;
  const pick = (k) => {
    if (rev) return;
    setPicked(k);
    audio.triggerEvent("option_picked");
    const good = k === correctIdx;
    onAnswer(screenIdx, { picked: k, correct: good, type: "mc" });
    if (good) sfx.playCorrect();
    else sfx.playWrong();
    const line = good ? L.praise[Math.floor(Math.random() * L.praise.length)][i] : wrong[k] ? wrong[k][i] : L.praise[0][i];
    setTimeout(() => audio.pushOneOff(TTS_MARK[i] + line), 400);
  };
  return <><VideoStage progress={progress} kicker={kicker} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}>{
    /* ПОЛОСА ПЕРСОНАЖА — сверху и фиксированной высоты, чтобы задание под
       ней не сдвигалось, когда Глюк меняет выражение лица. */
  }<div style={{
    height: CAST_H(isMobile),
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: isMobile ? 4 : 8
  }}><Gluk
    size={HERO(isMobile)}
    talking={audio.isPlaying}
    eyes={!rev ? "open" : ok ? "star" : "side"}
    mouth={!rev ? "rest" : ok ? "smile" : "o"}
    blush={rev && !ok}
  />{
    /* Вопрос словами снят — его задаёт Глюк голосом */
  }</div>{
    /* ИНСТРУКЦИЯ — она и есть вопрос, поэтому её кадры КРУПНЫЕ и стоят
       выше границы. Раньше они были вровень с вариантами, и экран читался
       как одна длинная лента без начала и конца. */
  }{film && <div style={{ display: "flex", gap: isMobile ? 6 : 9 }}>{film.map((f, k) => <Frame
    key={k}
    isMobile={isMobile}
    big
    num={k + 1}
    art={f === null ? ok ? opts[correctIdx].art : null : f}
    label={f === null ? ok ? opts[correctIdx].t[i] : "" : filmCapt[k][i]}
    state={f === null ? ok ? "now" : "gap" : "on"}
  />)}</div>}{steps && <div style={{ display: "flex", gap: isMobile ? 6 : 9 }}>{steps.map((s, k) => <Frame key={k} isMobile={isMobile} big num={k + 1} art={PALOV_ART[k]} label={s[i]} state="on" />)}</div>}{
    /* ГРАНИЦА: выше задание, ниже ответы */
  }<div style={{ display: "flex", alignItems: "center", gap: 10, margin: isMobile ? "12px 0 8px" : "18px 0 10px" }}><span style={{ flex: 1, height: 1, background: C.gray2 }} />{
    /* Слово «выбери ответ» снято: границу держит линия со стрелкой */
  }<span style={{ color: C.gray1, display: "grid", placeItems: "center" }}><ArrowDown size={18} /></span><span style={{ flex: 1, height: 1, background: C.gray2 }} /></div>{
    /* ОТВЕТЫ — своя зона на подложке и в своём порядке */
  }<div style={{
    background: "rgba(255,255,255,.5)",
    border: `1px solid ${C.gray2}`,
    borderRadius: 18,
    padding: isMobile ? 8 : 11,
    display: "grid",
    gridTemplateColumns: NARROW() ? "1fr 1fr" : `repeat(${opts.length},1fr)`,
    gap: isMobile ? 7 : 10
  }}>{ord.map((k, pos) => {
    const o = opts[k];
    const isC = k === correctIdx, sel = picked === k;
    return <motion.button
      key={k}
      onClick={() => pick(k)}
      disabled={rev}
      whileTap={rev ? {} : { scale: 0.96 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * pos }}
      style={{
        background: rev && isC ? C.green4 : rev && sel ? C.redBg : "#fff",
        border: `2px solid ${rev && isC ? C.green1 : rev && sel ? C.primary : rev ? C.gray2 : C.text}`,
        opacity: rev && !isC && !sel ? 0.5 : 1,
        borderRadius: 14,
        padding: "10px 6px 8px",
        cursor: rev ? "default" : "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4
      }}
    ><span style={{
      position: "absolute",
      top: 6,
      left: 7,
      width: 18,
      height: 18,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: C.gray2,
      color: C.text,
      fontFamily: F.mono,
      fontSize: 10,
      fontWeight: 700
    }}>{
      /* Вариант помечен цифрой, а не буквой: в уроке всё считается
         цифрами, и второй системы знаков ребёнку держать незачем.
         От номера шага этот номер отличается кружком и местом. */
    }{pos + 1}</span><Art k={o.art} size={isMobile ? 60 : 78} /></motion.button>;
  })}</div></VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!rev} /></>;
}
var S7_PICS = ["bedmade", "schoolgate", "legotower", "rice"];
function S7Result({ i, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onBack, onFinish }) {
  const seen = !!(storedAnswer && storedAnswer.seen);
  const seenAtMount = useRef2(seen).current;
  const segs = useMemo2(() => {
    if (seenAtMount) return [{ id: "ask", text: TTS_MARK[i] + L.s7_ask[i], trigger: "on_mount" }];
    const a = [{ id: "pre", text: TTS_MARK[i] + L.s7_pre[i], trigger: "on_mount", waits_for: { type: "button_click", target: "step" } }];
    L.s7_slides.forEach((s, k) => a.push({
      id: "r" + k,
      text: TTS_MARK[i] + s.audio[i],
      trigger: "after_previous",
      waits_for: k < L.s7_slides.length - 1 ? { type: "button_click", target: "step" } : void 0
    }));
    a.push({ id: "ask", text: TTS_MARK[i] + L.s7_ask[i], trigger: "after_previous" });
    return a;
  }, [i, seenAtMount]);
  const audio = useAudio2(segs);
  const isMobile = useIsMobile();
  const short = useShort();
  const cardH = isMobile ? short ? 132 : 196 : 172;
  const artSz = isMobile ? short ? 100 : 150 : 132;
  const [started, setStarted] = useState2(false);
  const [chip, setChip] = useState2(null);
  const [done, setDone] = useState2(false);
  const trigger = audio.triggerEvent;
  useEffect2(() => {
    if (seen || started) return void 0;
    const id = setTimeout(() => {
      setStarted(true);
      trigger("button_click", "step");
    }, readMs(L.s7_pre[i]));
    return () => clearTimeout(id);
  }, [seen, started, i, trigger]);
  return <><VideoStage progress={progress} kicker={L.k_end[i]} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}><div style={{ height: CAST_H(isMobile), display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 6 }}><Gluk size={HERO(isMobile)} eyes="star" mouth="smile" talking={audio.isPlaying} /></div>{!seen ? started ? <Carousel i={i} slides={L.s7_slides} audio={audio} onDone={() => onAnswer(screenIdx, { seen: true, type: "info" })} /> : <div style={{ display: "grid", placeItems: "center", height: LANDP() ? 190 : isMobile ? 320 : 430 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><ArtRow keys={L.s7_slides[0].row} isMobile={isMobile} /></div></div> : (
    /* Вопрос выходит последним, после карусели */
    /* «А где алгоритм в твоей жизни?» — четыре картинки вместо четырёх
       строк: утро, дорога в школу, игра, кухня. Вопрос задаёт Глюк
       голосом, на выбор отвечает своим ответом. */
    /* Правка 13 от 11.09: четыре картинки одним рядом и пустой низ.
       Правило набора: четыре и больше — только сеткой и крупно.
       12.09, после снятия моста: этот экран стал ПОСЛЕДНИМ в уроке.
       Замерено на 375×812 — карточки кончались на 476, а навигация
       начиналась на 742: 266 px пустоты под самым финалом. Карточки
       на телефоне подняты со 128 до 196, рисунок с 96 до 150. */
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: isMobile ? 12 : 18,
      maxWidth: NARROW() ? "100%" : 560,
      margin: "0 auto"
    }}>{S7_PICS.map((art, k) => <motion.button
      key={k}
      whileTap={chip !== null ? {} : { scale: 0.95 }}
      onClick={() => {
        if (chip !== null) return;
        setChip(k);
        audio.pushOneOff(TTS_MARK[i] + L.s7_byePick[k][i] + " " + L.s7_bye[i]);
      }}
      style={{
        borderRadius: 16,
        cursor: chip === null ? "pointer" : "default",
        minHeight: cardH,
        display: "grid",
        placeItems: "center",
        border: `2px solid ${chip === k ? C.primary : C.gray2}`,
        background: chip === k ? C.yellow3 : "#fff",
        opacity: chip !== null && chip !== k ? 0.45 : 1,
        transition: "opacity .3s"
      }}
    ><Art k={art} size={artSz} /></motion.button>)}</div>
  )}</VideoStage>{
    /* Теперь урок кончается ЗДЕСЬ: мост к Кодди снят 12.09. Кнопка ждёт
       трёх вещей: итог просмотрен, ответ выбран и Глюк ДОГОВОРИЛ. Третье
       важнее всех: последние слова урока — «Увидимся в следующем уроке!» —
       звучат именно в прощании, и ребёнок, приученный десятью экранами
       жать стрелку сразу, обрывал бы их на первом слове. Замок не может
       заклинить: реплика доигрывает даже при мёртвой озвучке, по времени
       чтения. После завершения кнопка гаснет — мёртвой активной стрелки
       на экране не остаётся. */
  }<NavBar
    i={i}
    onBack={onBack}
    onNext={() => {
      if (done) return;
      setDone(true);
      onFinish();
    }}
    nextDisabled={done || !seen || chip === null || audio.isPlaying}
  /></>;
}
var BUILDS = [
  { art: ["kettle", "leaves", "piyola"], extra: "rice", audio: "b1_audio" },
  // Шнурки сняты заказчиком 11.09. Ступень на четыре шага держит утро:
  // порядок там настоящий — рюкзак собирают последним, а не первым.
  { art: ["bedmade", "sink", "treats", "bagclosed"], audio: "b2_audio" },
  { art: ["kazanmeat", "carrot", "waterpour", "rice", "lidon"], extra: "leaves", audio: "b3_audio" }
];
function StepBuild({ i, bi, progress, screenIdx, totalScreens, storedAnswer, onAnswer, onNext, onBack }) {
  const task = BUILDS[bi];
  const N = task.art.length;
  /* Лишняя карточка (индекс N): ряд в лотке чётный, и ребёнок решает ещё и,
     какой карточке здесь не место. */
  const artOf = (k) => k < N ? task.art[k] : task.extra;
  const withExtra = (a) => {
    if (!task.extra) return a;
    const out = a.slice();
    out.splice(Math.floor(Math.random() * (out.length + 1)), 0, N);
    return out;
  };
  const segs = useMemo2(() => [{ id: "q", text: TTS_MARK[i] + L[task.audio][i], trigger: "on_mount" }], [i, task.audio]);
  const audio = useAudio2(segs);
  const sfx = useSfx();
  const isMobile = useIsMobile();
  const [tray, setTray] = useState2(() => {
    const n = task.art.length;
    for (let t = 0; t < 10; t++) {
      const a = task.art.map((_, k) => k);
      for (let k = n - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        const sw = a[k];
        a[k] = a[j];
        a[j] = sw;
      }
      if (a.every((v, k) => v !== k)) return withExtra(a);
    }
    return withExtra(task.art.map((_, k) => (k + 1) % n));
  });
  const shuffled = useRef2(null);
  if (shuffled.current === null) shuffled.current = tray;
  const [strip, setStrip] = useState2([]);
  const [phase, setPhase] = useState2(storedAnswer && storedAnswer.correct ? "win" : "build");
  const [misses, setMisses] = useState2(0);
  const [given, setGiven] = useState2(0);
  const HELP1 = Math.min(2, Math.floor(N / 2));
  const [runAt, setRunAt] = useState2(-1);
  const done = phase === "win";
  useAutoNext(done, audio.isPlaying, onNext);
  const put = (k) => {
    if (phase !== "build") return;
    setTray((t) => t.filter((x) => x !== k));
    setStrip((v) => v.length >= N ? v : v.concat([k]));
  };
  const back = (pos) => {
    if (phase !== "build") return;
    if (pos < given) return;
    const k = strip[pos];
    if (k === void 0) return;
    setStrip((v) => v.filter((_, n) => n !== pos));
    setTray((t) => t.indexOf(k) >= 0 ? t : t.concat([k]));
  };
  const runTimer = useRef2(null);
  useEffect2(() => () => {
    if (runTimer.current) clearTimeout(runTimer.current);
  }, []);
  const run = () => {
    if (strip.length < N || phase !== "build") return;
    setPhase("run");
    let k = 0;
    const tick = () => {
      setRunAt(k);
      k += 1;
      if (k <= N) {
        runTimer.current = setTimeout(tick, 780);
        return;
      }
      runTimer.current = null;
      const ok = strip.every((v, pos) => v === pos);
      setRunAt(-1);
      setPhase(ok ? "win" : "miss");
      if (ok) sfx.playCorrect();
      else sfx.playWrong();
      let say = ok ? L.build_win[bi][i] : L.build_miss[bi][i];
      if (!ok) {
        const m = misses + 1;
        setMisses(m);
        if (m === 3) {
          setGiven(HELP1);
          say = L.build_help1[bi][i];
        } else if (m === 5 && HELP1 + 1 < N) {
          setGiven(HELP1 + 1);
          say = L.build_help2[bi][i];
        }
      }
      audio.pushOneOff(TTS_MARK[i] + say);
      if (ok) onAnswer(screenIdx, { correct: true, type: "build" });
    };
    tick();
  };
  useEffect2(() => {
    if (phase !== "miss") return void 0;
    const id = setTimeout(() => {
      setGiven((g) => {
        const head = [];
        for (let k = 0; k < g; k++) head.push(k);
        setStrip(head);
        setTray(shuffled.current.filter((k) => k >= g));
        return g;
      });
      setPhase("build");
    }, 2600);
    return () => clearTimeout(id);
  }, [phase, task.art]);
  useEffect2(() => {
    if (phase !== "build" || strip.length < N) return void 0;
    const id = setTimeout(() => run(), 950);
    return () => clearTimeout(id);
  });
  const shown = runAt >= 0 ? artOf(strip[runAt]) : done ? task.art[N - 1] : null;
  const cell = isMobile ? 68 : 92;
  return <><VideoStage progress={progress} screenIdx={screenIdx} totalScreens={totalScreens} audio={audio}><div data-phase={phase} style={{ height: CAST_H(isMobile), display: "flex", alignItems: "center", gap: isMobile ? 8 : 14 }}><Gluk
    size={HERO(isMobile)}
    talking={audio.isPlaying}
    eyes={done ? "star" : phase === "miss" ? "side" : "open"}
    mouth={done ? "smile" : "rest"}
    blush={phase === "miss"}
  /></div>{
    /* СЦЕНА — всегда на одном месте и одной высоты, что бы в ней ни шло */
  }<div style={{
    background: "#fff",
    borderRadius: 18,
    border: `1.5px solid ${C.gray2}`,
    height: isMobile ? "min(30dvh, 240px)" : 210,
    display: "grid",
    placeItems: "center",
    marginBottom: 10
  }}>{
    /* Та же мина, что была на смене экранов: с AnimatePresence и
       initial={{opacity:0}} картинка шага не появляется вовсе, если
       анимация не пойдёт, — в середине экрана остаётся пустая белая
       карточка. Содержимое сцены рисуем без анимации входа. */
  }{shown ? <Art key={shown + String(runAt)} k={shown} size={isMobile ? 130 : 186} /> : (
    /* До запуска в сцене стоит БЛЕДНАЯ ЦЕЛЬ — то, что должно
       получиться. Раньше здесь был указатель-рука; он снят. */
    <div style={{ opacity: 0.22 }}><Art k={task.art[N - 1]} size={isMobile ? 120 : 170} /></div>
  )}</div>{
    /* ЛЕНТА ШАГОВ — ячейки по числу шагов, пустые обведены пунктиром */
  }<div style={{ display: "flex", gap: isMobile ? 6 : 9, marginBottom: 10 }}>{task.art.map((_, pos) => {
    const k = strip[pos];
    const active = runAt === pos;
    return <div
      key={pos}
      onClick={k === void 0 ? void 0 : () => back(pos)}
      data-slot={pos}
      data-art={k === void 0 ? "" : artOf(k)}
      style={{
        flex: 1,
        height: cell,
        borderRadius: 13,
        position: "relative",
        display: "grid",
        placeItems: "center",
        background: k === void 0 ? "rgba(255,255,255,.45)" : active ? C.yellow3 : "#fff",
        border: k === void 0 ? `2px dashed ${C.gray1}` : `2px solid ${active ? C.orange1 : done ? C.green1 : C.primary}`,
        cursor: k === void 0 || phase !== "build" ? "default" : "pointer",
        transition: "background .2s, border-color .2s"
      }}
    ><span style={{
      position: "absolute",
      top: 3,
      left: 6,
      fontFamily: F.mono,
      fontSize: isMobile ? 11 : 13,
      fontWeight: 700,
      color: C.gray1
    }}>{pos + 1}</span>{k !== void 0 && <Art k={artOf(k)} size={isMobile ? 46 : 64} />}</div>;
  })}</div>{
    /* ПАЛИТРА и ПУСК */
  }<div style={{ display: "flex", alignItems: "center" }}><div style={{ width: "100%", flex: 1, display: "flex", gap: isMobile ? 6 : 9, minHeight: cell }}>{tray.map((k) => <motion.button
    key={k}
    onClick={() => put(k)}
    whileTap={{ scale: 0.93 }}
    layout
    data-art={artOf(k)}
    style={{
      flex: 1,
      height: cell,
      borderRadius: 14,
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      background: "#fff",
      border: `3px solid ${C.action}`
    }}
  ><Art k={artOf(k)} size={isMobile ? 46 : 64} /></motion.button>)}</div></div></VideoStage><NavBar i={i} onBack={onBack} onNext={onNext} nextDisabled={!done} /></>;
}
function AlgoritmyU1({ studentName, lang = "ru", onFinished, startScreen = 0, intro = true }) {
  const startTime = useRef2(Date.now());
  const finishedRef = useRef2(false);
  const [screenIdx, setScreenIdx] = useState2(() => Math.min(Math.max(0, startScreen | 0), TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState2({});
  const [order] = useState2(() => shuffleCards());
  const [onMap, setOnMap] = useState2(() => intro && (startScreen | 0) === 0);
  const leaveMap = useCallback(() => setOnMap(false), []);
  const [uiLang, setUiLang] = useState2(lang);
  useEffect2(() => {
    setUiLang(lang);
  }, [lang]);
  const i = LI2(uiLang);
  const langCtx = useMemo2(() => ({ lang: uiLang, set: setUiLang }), [uiLang]);
  const displayName = (studentName || "").trim();
  const progress = (screenIdx + 1) / TOTAL_SCREENS * 100;
  const goNext = useCallback(() => setScreenIdx((n) => Math.min(n + 1, TOTAL_SCREENS - 1)), []);
  const goBack = useCallback(() => setScreenIdx((n) => Math.max(n - 1, 0)), []);
  const recordAnswer = useCallback((idx, payload) => setAnswers((a) => Object.assign({}, a, { [idx]: payload })), []);
  /* Урок завершён — дальше только фон (пустая страница для уведомления платформы). */
  const [ended, setEnded] = React.useState(false);
  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setEnded(true);
    const right = SCORED.filter((k) => answers[k] && answers[k].correct === true).length;
    onFinished && onFinished({
      lessonId: LESSON_ID,
      lessonTitle: L.lessonTitle[i],
      durationSec: Math.floor((Date.now() - startTime.current) / 1e3),
      totalQuestions: SCORED.length,
      correctAnswers: right,
      scorePercent: Math.round(right / SCORED.length * 100),
      passed: right >= Math.ceil(SCORED.length * 0.6),
      answers: Object.keys(answers).map((k) => ({
        questionIndex: Number(k),
        type: answers[k].type,
        correct: answers[k].correct === void 0 ? null : answers[k].correct,
        picked: answers[k].picked === void 0 ? null : answers[k].picked
      }))
    });
  }, [answers, i, onFinished]);
  const common = {
    i,
    displayName,
    progress,
    totalScreens: TOTAL_SCREENS,
    screenIdx,
    storedAnswer: answers[screenIdx],
    onAnswer: recordAnswer,
    onNext: goNext,
    onBack: screenIdx > 0 ? goBack : null
  };
  /* ПУСТАЯ СТРАНИЦА. После «Дальше» на итоге урок больше ничего не рисует,
     кроме фона: на нём платформа показывает своё уведомление. */
  if (ended) {
    return <div style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", background: C.bg }}><Backdrop tone={TONES[0]} /></div>;
  }
  return (
    /* ⚠ БЕЛЫЙ ЭКРАН. Здесь стоял AnimatePresence mode="wait": следующий экран
       не монтировался, пока уходящий не доиграет анимацию ухода. Если она не
       доигрывает — а не доиграть она может от чего угодно: придушенный
       requestAnimationFrame, таймер, выстреливший в уходящее дерево, слабый
       телефон, — ребёнок остаётся на пустой белой странице НАВСЕГДА. Ни
       ошибки в консоли, ни выхода: замерено 11.09, уходящий экран висит с
       opacity 0 и height 0, а следующий не появляется вовсе.
       Теперь экран меняется сразу, а плавность даёт CSS-анимация появления:
       она ничего не блокирует и не может «не доиграть». */
    <LangCtx.Provider value={langCtx}>{
      /* Урок начинается с карты курса, а не с первого экрана. Пока карта на
         месте, экранов в дереве НЕТ ВОВСЕ: смонтируй их под картой — и Глюк
         заговорит из урока поверх своей же реплики на карте. */
    }{onMap ? <KartaIntro lesson={LESSON_NO} lang={uiLang} onStart={leaveMap} onLang={setUiLang} /> : <>{
      /* Анимации появления у экрана НЕТ вовсе, и это решение, а не упущение.
         Любая анимация — и framer, и CSS — на время своего хода держит
         начальный кадр, то есть прозрачность 0. Если ход не начнётся
         (придушенный requestAnimationFrame, слабый телефон, вкладка в
         фоне), ребёнок остаётся перед белым экраном без выхода. Замерено
         11.09: и framer, и CSS-анимация дают ровно это. Плавность здесь
         стоит дешевле, чем риск пустого экрана: экраны меняются сразу. */
    }{
      /* В ключе и язык тоже: при смене языка экран пересобирается целиком и
         реплика начинает звучать заново на новом языке. Без этого обновление
         доезжало до состояния урока, но не до шапки. Номер экрана при этом
         сохраняется — он живёт выше, в состоянии урока. */
    }<div
      key={screenIdx + "-" + uiLang}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >{
      /* ОДИННАДЦАТЬ ЭКРАНОВ. Три сборки ленты стоят на 3, 5 и 7 — между
         ними всегда другой жанр, двух сборок подряд в уроке нет. Шагов в
         них 3 → 4 → 5: лесенка идёт через середину урока. */
    }{screenIdx === 0 && <S0Hook {...common} />}{screenIdx === 1 && <S1Tea {...common} />}{screenIdx === 2 && <StepBuild {...common} bi={0} />}{screenIdx === 3 && <S2Rule {...common} />}{screenIdx === 4 && <StepBuild {...common} bi={1} />}{screenIdx === 5 && <S3Sort {...common} order={order} />}{screenIdx === 6 && <StepBuild {...common} bi={2} />}{screenIdx === 7 && <S4Twelve {...common} />}{screenIdx === 8 && <PicMC
      {...common}
      opts={L.s5_o}
      correctIdx={1}
      wrong={L.s5_w}
      audioText={L.s5_audio[i]}
      film={[TEA_ART[0], null, TEA_ART[2], TEA_ART[3], TEA_ART[4]]}
      filmCapt={L.s1_steps}
    />}{screenIdx === 9 && <PicMC
      {...common}
      opts={L.s6_o}
      correctIdx={0}
      wrong={L.s6_w}
      audioText={L.s6_audio[i]}
      steps={L.s6_steps}
    />}{screenIdx === 10 && <S7Result {...common} onFinish={handleFinish} />}</div></>}</LangCtx.Provider>
  );
}
export default AlgoritmyU1;