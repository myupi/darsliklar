// =============================================================================
// ЭКРАНЫ ВВОДНОГО УРОКА «Из чего сделан сайт» (16.11.2026). Кода нет: сайт игры «Planeta 9» в окне Chrome
// «раздевается» без CSS, просвечивается рентгеном, одевается из гардероба, меняет наряды, ломается и чинится,
// получает дизайн ученика. О будущем (карта курса, следующие уроки) — ничего (заказчик, 16.11.2026).
// =============================================================================

const sitePr = (pick) => ({ what: pick(SITE.what), why: pick(SITE.why) });

// ── САЙТ-ПРИМЕР «Planeta 9» (экраны 1–4): сайт выдуманной космической игры. Рисунки — свои SVG. ──
// Робот-космонавт с ранцем прыгает над планетой с кольцом.
FILES['robot.png'] = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='310' viewBox='0 0 300 310'><defs>"
  + "<radialGradient id='p' cx='.32' cy='.28' r='.85'><stop offset='0' stop-color='#FF9AD5'/><stop offset='.5' stop-color='#9B4DFF'/><stop offset='1' stop-color='#2B1670'/></radialGradient>"
  + "<linearGradient id='b' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#FFFFFF'/><stop offset='1' stop-color='#B9CCFF'/></linearGradient>"
  + "<linearGradient id='f' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#FFE066'/><stop offset='.5' stop-color='#FF6A3C'/><stop offset='1' stop-color='#FF3C6E' stop-opacity='0'/></linearGradient>"
  + "<radialGradient id='g' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#3BF0FF' stop-opacity='.5'/><stop offset='1' stop-color='#3BF0FF' stop-opacity='0'/></radialGradient></defs>"
  + "<circle cx='212' cy='236' r='78' fill='url(#p)'/><circle cx='186' cy='214' r='12' fill='#000' fill-opacity='.13'/><circle cx='236' cy='262' r='18' fill='#000' fill-opacity='.12'/><circle cx='240' cy='206' r='7' fill='#000' fill-opacity='.12'/>"
  + "<ellipse cx='212' cy='242' rx='128' ry='24' fill='none' stroke='#FFD23F' stroke-width='5' stroke-opacity='.9' transform='rotate(-12 212 242)'/>"
  + "<circle cx='52' cy='62' r='15' fill='#D6E6FF'/><circle cx='47' cy='58' r='3.5' fill='#000' fill-opacity='.12'/>"
  + "<circle cx='128' cy='132' r='92' fill='url(#g)'/>"
  + "<g transform='rotate(-12 128 132)'>"
  + "<path d='M110 186 Q118 246 126 186 Z' fill='url(#f)'/><path d='M132 186 Q140 238 148 186 Z' fill='url(#f)'/>"
  + "<rect x='104' y='130' width='48' height='58' rx='10' fill='#FF4FA3'/>"
  + "<rect x='82' y='126' width='18' height='42' rx='9' fill='url(#b)' transform='rotate(28 91 126)'/><rect x='156' y='92' width='18' height='42' rx='9' fill='url(#b)' transform='rotate(-38 165 134)'/>"
  + "<rect x='106' y='184' width='17' height='24' rx='8' fill='url(#b)'/><rect x='134' y='184' width='17' height='24' rx='8' fill='url(#b)'/>"
  + "<rect x='98' y='118' width='62' height='72' rx='19' fill='url(#b)'/><circle cx='129' cy='154' r='8' fill='#3BF0FF'/><circle cx='129' cy='154' r='3.5' fill='#fff'/>"
  + "<line x1='129' y1='66' x2='129' y2='48' stroke='#B9CCFF' stroke-width='3.5' stroke-linecap='round'/><circle cx='129' cy='44' r='7' fill='#FF4FA3'/>"
  + "<rect x='92' y='64' width='74' height='60' rx='23' fill='url(#b)'/><rect x='101' y='76' width='56' height='34' rx='15' fill='#0B1026'/>"
  + "<rect x='114' y='86' width='9' height='13' rx='4.5' fill='#3BF0FF'/><rect x='135' y='86' width='9' height='13' rx='4.5' fill='#3BF0FF'/>"
  + "<path d='M119 103 Q129 109 139 103' fill='none' stroke='#3BF0FF' stroke-width='2.5' stroke-linecap='round'/></g>"
  + "<g fill='#FFD23F'><path d='M250 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z'/><path d='M28 196 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z'/></g>"
  + "<g fill='#fff'><circle cx='210' cy='92' r='2'/><circle cx='278' cy='140' r='1.6'/><circle cx='70' cy='250' r='1.8'/><circle cx='20' cy='120' r='1.4'/></g></svg>");
// Движок страницы урока знает не все свойства CSS — сайту-примеру нужны ещё курсив, обрезка и отступы по сторонам.
['font-style', 'overflow', 'z-index', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'white-space', 'background-position'].forEach((x) => { if (CSS_PROPS.indexOf(x) < 0) CSS_PROPS.push(x); });
// Фон баннера: тонкие орбиты и звёзды.
FILES['orbits.svg'] = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480' viewBox='0 0 800 480' preserveAspectRatio='xMidYMid slice'>"
  + "<g fill='none' stroke='#3BF0FF' stroke-opacity='.10'><ellipse cx='600' cy='250' rx='330' ry='120' transform='rotate(-14 600 250)'/>"
  + "<ellipse cx='600' cy='250' rx='240' ry='86' transform='rotate(-14 600 250)'/></g>"
  + "<g fill='#fff' fill-opacity='.5'><circle cx='40' cy='60' r='1.2'/><circle cx='120' cy='400' r='1.4'/><circle cx='230' cy='120' r='1'/><circle cx='380' cy='40' r='1.3'/>"
  + "<circle cx='520' cy='430' r='1'/><circle cx='700' cy='60' r='1.5'/><circle cx='760' cy='380' r='1'/><circle cx='290' cy='450' r='1'/><circle cx='60' cy='260' r='1.1'/>"
  + "<circle cx='450' cy='140' r='1.2'/><circle cx='330' cy='300' r='.9'/><circle cx='180' cy='30' r='.9'/></g></svg>");
const K_DISP = '"Arial Black", "Segoe UI Black", "Arial Rounded MT Bold", Impact, sans-serif';
const K_ROUND = '"Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif';
const K_SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
const K_MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const K_SANS = '"Avenir Next", "Segoe UI", "Helvetica Neue", Helvetica, sans-serif';
// ── НАРЯДЫ САЙТА: один скелет — разная одежда (экран 5); свой дизайн ученика (экран 8) — неон со своими цветом,
// шрифтом и углами. ──
const THEMES = {
  neon: { bg: '#0B1026', ink: '#EEF2FF', sub: '#C4CAF2', mute: '#8B93C9', dim: '#7F88BE', line: '#1E2650', a1: '#3BF0FF', a2: '#FF4FA3',
    glowA: 'rgba(155, 77, 255, 0.55)', glowB: 'rgba(59, 240, 255, 0.16)', btn: '#FFD23F', btnInk: '#0B1026', btnSh: '#C99A00', pro: '#FFD23F',
    band: '#FFD23F', bandInk: '#0B1026', light: '#F1F0FF', lightInk: '#141A3A', lightMute: '#4D5583', kick: '#7B3FF2', cardBg: '#FFFFFF',
    cardBd: '#141A3A', cardSh: '#9B4DFF', unit: '#FF4FA3', heroes: '#141A3A', heroesInk: '#EEF2FF', chip: '#1E2650', foot: '#0B1026', footInk: '#6D76AE',
    fD: K_DISP, fB: K_SANS, fM: K_MONO, up: 'uppercase', r: '14px', rc: '20px', tsh: '4px 4px 0 #FF4FA3, 0 0 30px rgba(59, 240, 255, 0.45)', lsh: '0 0 14px rgba(59, 240, 255, 0.6)' },
  candy: { bg: '#FFE4F1', ink: '#4A1942', sub: '#7A3F6E', mute: '#A0638F', dim: '#B07AA0', line: '#F7C6DD', a1: '#7C5CFF', a2: '#FF6FAE',
    glowA: 'rgba(255, 255, 255, 0.9)', glowB: 'rgba(255, 182, 220, 0.6)', btn: '#FF6FAE', btnInk: '#FFFFFF', btnSh: '#D9478A', pro: '#7C5CFF',
    band: '#7C5CFF', bandInk: '#FFFFFF', light: '#FFF7FB', lightInk: '#4A1942', lightMute: '#8A5A7E', kick: '#FF6FAE', cardBg: '#FFFFFF',
    cardBd: '#F7C6DD', cardSh: '#FFC2DE', unit: '#7C5CFF', heroes: '#FFD1E8', heroesInk: '#4A1942', chip: '#FFFFFF', foot: '#FFE4F1', footInk: '#A0638F',
    fD: K_ROUND, fB: K_ROUND, fM: K_ROUND, up: 'none', r: '999px', rc: '28px', tsh: '3px 3px 0 #FFFFFF, 6px 6px 0 #FFC2DE', lsh: 'none' },
  retro: { bg: '#0A0A0A', ink: '#39FF14', sub: '#9BFF8A', mute: '#2EB80F', dim: '#2EB80F', line: '#39FF14', a1: '#39FF14', a2: '#39FF14',
    glowA: 'rgba(57, 255, 20, 0.16)', glowB: 'rgba(57, 255, 20, 0.04)', btn: '#39FF14', btnInk: '#0A0A0A', btnSh: '#1F8F0A', pro: '#FFFFFF',
    band: '#39FF14', bandInk: '#0A0A0A', light: '#0A0A0A', lightInk: '#39FF14', lightMute: '#2EB80F', kick: '#FFFFFF', cardBg: '#0A0A0A',
    cardBd: '#39FF14', cardSh: '#1F8F0A', unit: '#FFFFFF', heroes: '#0A0A0A', heroesInk: '#39FF14', chip: '#132B0E', foot: '#0A0A0A', footInk: '#2EB80F',
    fD: K_MONO, fB: K_MONO, fM: K_MONO, up: 'uppercase', r: '0px', rc: '0px', tsh: '0 0 12px rgba(57, 255, 20, 0.8)', lsh: '0 0 10px rgba(57, 255, 20, 0.8)' },
  forest: { bg: '#1F3A2B', ink: '#F6EEDC', sub: '#D9CDB1', mute: '#B5C9A8', dim: '#9FB592', line: '#2E5440', a1: '#F2C14E', a2: '#E07A2F',
    glowA: 'rgba(242, 193, 78, 0.35)', glowB: 'rgba(120, 200, 120, 0.15)', btn: '#E07A2F', btnInk: '#FFFFFF', btnSh: '#A9541A', pro: '#F2C14E',
    band: '#F2C14E', bandInk: '#1F3A2B', light: '#F3EBDD', lightInk: '#1F3A2B', lightMute: '#5B6B55', kick: '#2F7D4F', cardBg: '#FFFDF7',
    cardBd: '#1F3A2B', cardSh: '#A7C79A', unit: '#E07A2F', heroes: '#2E5440', heroesInk: '#F6EEDC', chip: '#1F3A2B', foot: '#1F3A2B', footInk: '#9FB592',
    fD: K_SERIF, fB: K_SANS, fM: K_MONO, up: 'none', r: '8px', rc: '12px', tsh: '0 2px 0 rgba(0, 0, 0, 0.25)', lsh: 'none' }
};
const LOOK = {
  color: { cyan: { btn: '#3BF0FF', btnInk: '#0B1026', btnSh: '#1BA9B5', pro: '#3BF0FF', band: '#3BF0FF', cardSh: '#3BF0FF' },
    pink: { btn: '#FF4FA3', btnInk: '#FFFFFF', btnSh: '#B02A6E', pro: '#FF4FA3', band: '#FF4FA3', cardSh: '#FF4FA3' },
    green: { btn: '#4ADE80', btnInk: '#0B1026', btnSh: '#1E9E4E', pro: '#4ADE80', band: '#4ADE80', cardSh: '#4ADE80' },
    orange: { btn: '#FF8A3D', btnInk: '#0B1026', btnSh: '#C25A16', pro: '#FF8A3D', band: '#FF8A3D', cardSh: '#FF8A3D' } },
  font: { bold: { fD: K_DISP, up: 'uppercase' }, round: { fD: K_ROUND, up: 'none' }, pixel: { fD: K_MONO, up: 'uppercase' } },
  corner: { soft: { r: '999px', rc: '28px' }, sharp: { r: '0px', rc: '0px' } }
};
const lookTheme = (lk) => Object.assign({}, THEMES.neon, lk && lk.color ? LOOK.color[lk.color] : {}, lk && lk.font ? LOOK.font[lk.font] : {}, lk && lk.corner ? LOOK.corner[lk.corner] : {});
function orbitSite(pick, T0) {
  const T = T0 || THEMES.neon;
  const O = ORBIT;
  const els = [
    { t: 'div', cls: 'nav', k: 'nav', kids: [{ t: 'span', cls: 'logo', k: 'logo', text: O.logo },
      { t: 'div', cls: 'links', k: 'links', kids: O.links.map((x, i) => ({ t: 'span', cls: 'lk', k: 'l' + i, text: pick(x) })) },
      { t: 'span', cls: 'navbuy', k: 'navbuy', text: pick(O.buy) }] },
    { t: 'div', cls: 'hero', k: 'hero', kids: [
      { t: 'div', cls: 'htext', k: 'htext', kids: [{ t: 'p', cls: 'eyebrow', k: 'eb', text: pick(O.eyebrow) },
        { t: 'h1', cls: 'title', k: 'h1', kids: ['Planeta ', { t: 'span', cls: 'pro', k: 'pro', text: '9' }] },
        { t: 'p', cls: 'sub', k: 'sub', text: pick(O.sub) },
        { t: 'div', cls: 'ctas', k: 'ctas', kids: [{ t: 'button', cls: 'cta', k: 'cta', text: '▶ ' + pick(O.buy) }, { t: 'button', cls: 'cta2', k: 'cta2', text: pick(O.more) }] },
        { t: 'p', cls: 'spec', k: 'spec', text: pick(O.spec) }] },
      { t: 'div', cls: 'hpic', k: 'hpic', kids: [{ t: 'img', cls: 'phone', k: 'img', src: 'robot.png', alt: 'Planeta 9' }, { t: 'p', cls: 'price', k: 'price', text: pick(O.price) }] }] },
    { t: 'div', cls: 'band', k: 'band', kids: [{ t: 'p', cls: 'bandt', k: 'bandt', text: pick(O.band) }] },
    { t: 'div', cls: 'feats', k: 'feats', kids: [{ t: 'p', cls: 'kicker', k: 'kick', text: pick(O.kicker) }, { t: 'h2', cls: 'fh', k: 'fh', text: pick(O.feat) },
      { t: 'div', cls: 'cards', k: 'cards', kids: O.cards.map(([n, u, d], i) => ({ t: 'div', cls: 'card', k: 'c' + i,
        kids: [{ t: 'span', cls: 'big', k: 'b' + i, kids: [n, { t: 'span', cls: 'unit', k: 'u' + i, text: pick(u) }] }, { t: 'p', cls: 'cp', k: 'p' + i, text: pick(d) }] })) }] },
    { t: 'div', cls: 'colors', k: 'colors', kids: [{ t: 'h2', cls: 'ch2', k: 'ch2', text: pick(O.colorsH) },
      { t: 'div', cls: 'dots', k: 'dots', kids: O.colors.map(([sw, em, n], i) => ({ t: 'div', cls: 'dot', k: 'd' + i, kids: [{ t: 'span', cls: 'sw ' + sw, k: 's' + i, text: em }, { t: 'span', cls: 'dl', k: 'n' + i, text: n }] })) }] },
    { t: 'div', cls: 'foot', k: 'foot', text: pick(O.foot) }
  ];
  const glow = (at) => 'radial-gradient(circle at ' + at + ', ' + T.glowA + ', ' + T.glowB + ' 34%, transparent 62%)';
  const css = [
    'body { background-color: ' + T.bg + '; font-family: ' + T.fB + '; color: ' + T.ink + '; }',
    '.nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 36px; background-color: ' + T.bg + '; border-bottom: 1px solid ' + T.line + '; }',
    '.logo { font-family: ' + T.fD + '; font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: ' + T.a1 + '; text-shadow: ' + T.lsh + '; }',
    '.links { display: flex; gap: 24px; font-family: ' + T.fM + '; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: ' + T.mute + '; }',
    '.navbuy { padding: 6px 14px; border-radius: ' + T.r + '; background-color: ' + T.btn + '; color: ' + T.btnInk + '; font-size: 12px; font-weight: 800; box-shadow: 0 3px 0 ' + T.btnSh + '; }',
    '.hero { display: flex; align-items: center; gap: 8px; padding: 30px 36px 26px; background-color: ' + T.bg + '; background-image: url("orbits.svg"), ' + glow('74% 50%') + '; background-repeat: no-repeat; background-size: cover; overflow: hidden; }',
    '.htext { flex: 1; }',
    '.eyebrow { margin: 0 0 12px; font-family: ' + T.fM + '; font-size: 12px; letter-spacing: 2.2px; color: ' + T.a2 + '; }',
    '.title { margin: 0; font-family: ' + T.fD + '; font-size: 66px; font-weight: 900; line-height: 0.95; letter-spacing: -1px; text-transform: ' + T.up + '; color: ' + T.ink + '; text-shadow: ' + T.tsh + '; }',
    '.pro { color: ' + T.pro + '; }',
    '.sub { margin: 16px 0 20px; font-size: 19px; line-height: 1.4; color: ' + T.sub + '; }',
    '.ctas { display: flex; gap: 12px; align-items: center; }',
    '.cta { padding: 13px 26px; border: none; border-radius: ' + T.r + '; background-color: ' + T.btn + '; color: ' + T.btnInk + '; font-family: ' + T.fD + '; font-size: 16px; font-weight: 900; letter-spacing: 0.5px; text-transform: ' + T.up + '; box-shadow: 0 5px 0 ' + T.btnSh + '; }',
    '.cta2 { padding: 12px 20px; border: 2px solid ' + T.a1 + '; border-radius: ' + T.r + '; background-color: transparent; color: ' + T.a1 + '; font-size: 15px; font-weight: 700; }',
    '.spec { margin: 20px 0 0; font-family: ' + T.fM + '; font-size: 11px; letter-spacing: 1.4px; color: ' + T.dim + '; }',
    '.hpic { display: flex; flex-direction: column; align-items: center; }',
    '.phone { display: block; width: 280px; height: 289px; }',
    '.price { margin: 4px 0 0; font-family: ' + T.fM + '; font-size: 12px; letter-spacing: 1px; color: ' + T.mute + '; }',
    '.band { padding: 12px 0; background-color: ' + T.band + '; text-align: center; overflow: hidden; }',
    '.bandt { margin: 0; font-family: ' + T.fM + '; font-size: 12px; font-weight: 800; letter-spacing: 3px; color: ' + T.bandInk + '; white-space: nowrap; }',
    '.feats { padding: 46px 36px 40px; background-color: ' + T.light + '; color: ' + T.lightInk + '; }',
    '.kicker { margin: 0; font-family: ' + T.fM + '; font-size: 11px; letter-spacing: 2.6px; color: ' + T.kick + '; }',
    '.fh { margin: 10px 0 30px; font-family: ' + T.fD + '; font-size: 36px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.1; }',
    '.cards { display: flex; gap: 16px; }',
    '.card { flex: 1; padding: 20px 18px; border-radius: ' + T.rc + '; background-color: ' + T.cardBg + '; border: 2px solid ' + T.cardBd + '; box-shadow: 6px 6px 0 ' + T.cardSh + '; }',
    '.big { display: block; font-family: ' + T.fD + '; font-size: 58px; font-weight: 900; line-height: 1; color: ' + T.lightInk + '; }',
    '.unit { margin-left: 6px; font-family: ' + T.fM + '; font-size: 14px; letter-spacing: 1px; color: ' + T.unit + '; }',
    '.cp { margin: 10px 0 0; font-size: 14px; color: ' + T.lightMute + '; }',
    '.colors { display: flex; justify-content: space-between; align-items: center; padding: 26px 36px; background-color: ' + T.heroes + '; color: ' + T.heroesInk + '; }',
    '.ch2 { margin: 0; font-family: ' + T.fD + '; font-size: 24px; font-weight: 900; }',
    '.dots { display: flex; gap: 14px; flex: none; }',
    '.dot { display: flex; align-items: center; gap: 8px; flex: none; white-space: nowrap; padding: 6px 14px 6px 6px; border-radius: 999px; background-color: ' + T.chip + '; font-family: ' + T.fM + '; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }',
    '.sw { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; font-size: 19px; }',
    '.swq { background-color: #3BF0FF; }',
    '.swt { background-color: #FF4FA3; }',
    '.swo { background-color: #FFD23F; }',
    '.foot { padding: 20px 36px; background-color: ' + T.foot + '; color: ' + T.footInk + '; font-family: ' + T.fM + '; font-size: 11px; letter-spacing: 1px; text-align: center; }',
    '@media (max-width: 600px) { .links { display: none; } .nav { padding: 12px 18px; } .hero { flex-direction: column; text-align: center; padding: 30px 18px 22px; background-image: url("orbits.svg"), ' + glow('50% 76%') + '; } .ctas { justify-content: center; } .title { font-size: 46px; } .sub { font-size: 16px; margin: 14px 0 18px; } .spec { margin: 18px 0 4px; } .phone { width: 230px; height: 238px; } .feats { padding: 34px 18px 30px; } .fh { font-size: 28px; } .cards { flex-direction: column; gap: 16px; } .big { font-size: 48px; } .colors { flex-direction: column; gap: 14px; padding: 24px 18px; } .dots { gap: 8px; } .dot { padding: 4px 10px 4px 4px; } .sw { width: 28px; height: 28px; font-size: 16px; } .bandt { font-size: 10px; letter-spacing: 2px; } }'
  ];
  // Классы сайта — с приставкой o-: имена вроде .dot, .title, .big заняты оформлением самого урока.
  const pre = (e) => (typeof e === 'string' ? e : Object.assign({}, e, e.cls ? { cls: e.cls.split(' ').map((x) => 'o-' + x).join(' ') } : {}, e.kids ? { kids: e.kids.map(pre) } : {}));
  return { title: 'Planeta 9', els: els.map(pre), css: css.map((r) => r.replace(/\.([a-z][\w-]*)(\s*\{)/g, '.o-$1$2')), demos: null };
}
// Селектор части сайта-примера: '.nav' → '.o-nav'.
const oc = (sel) => String(sel).replace(/\.([a-z][\w-]*)/g, '.o-$1');

// Части сайта и их правила CSS (по первому классу селектора): ученик «одевает» сайт по одной части.
const PARTS = ['menu', 'hero', 'btns', 'cards'];
const PART_CLS = {
  menu: ['nav', 'logo', 'links', 'lk', 'navbuy'],
  hero: ['hero', 'htext', 'eyebrow', 'title', 'pro', 'sub', 'spec', 'hpic', 'phone', 'price'],
  btns: ['ctas', 'cta', 'cta2'],
  cards: ['band', 'bandt', 'feats', 'kicker', 'fh', 'cards', 'card', 'big', 'unit', 'cp', 'colors', 'ch2', 'dots', 'dot', 'sw', 'swq', 'swt', 'swo', 'dl']
};
const PART_SEL = { menu: oc('.nav'), hero: oc('.nav'), btns: oc('.ctas'), cards: oc('.band') };
const PART_EM = { menu: '☰', hero: 'H', btns: '◉', cards: '▦' };
const firstCls = (sel) => { const m = /^\s*[.#]?([a-z][\w-]*)/i.exec(sel); return m ? m[1].replace(/^o-/, '') : ''; };
// Правила сайта только для одетых частей. Пусто — сайт без одежды.
function dressCss(css, on) {
  if (!on.length) return [];
  const allow = {};
  // Фон и цвет всей страницы (body) и подвал — только с последней вещью: иначе голые части (кнопки, текст)
  // оказываются тёмным по тёмному и выглядят пустыми.
  (on.length >= PARTS.length ? ['body', 'foot'] : []).concat(...on.map((k) => PART_CLS[k])).forEach((x) => { allow[x] = 1; });
  const out = [];
  css.forEach((rule) => {
    const t = String(rule).trim();
    const mq = /^@media\s*([^{]+)\{([\s\S]*)\}\s*$/.exec(t);
    if (mq) {
      const inner = [];
      String(mq[2]).replace(/([^{}]+)\{([^{}]*)\}/g, (all, sel, body) => { if (allow[firstCls(sel)]) inner.push(sel.trim() + ' {' + body + '}'); return all; });
      if (inner.length) out.push('@media ' + mq[1].trim() + ' { ' + inner.join(' ') + ' }');
      return;
    }
    if (allow[firstCls(t.split('{')[0])]) out.push(t);
  });
  return out;
}
// На телефоне окно модуля «ИИ» подсвечивает раздел цели и само к нему листает — здесь сайт смотрят с верха.
const k0Plain = (site) => Object.assign({}, site, { btn: null });
const dressed = (site, on) => Object.assign(k0Plain(site), { css: dressCss(site.css, on) });

// ── АНИМАЦИЯ СМЕНЫ ОДЕЖДЫ (заказчик, 16.11.2026: «я вижу что потерялся css, но это не анимированно») ──
// fall — одежда осыпается: снимок стильной страницы режется на полосы, они падают и тают; под ними части голой
// страницы съезжают со своих прежних мест в колонку (FLIP: где были → где стали). Без fall — части плавно
// переезжают на новые места, одетая часть вспыхивает. Под «меньше движения» — сразу.
function k0Morph(host, apply, opts) {
  const o = opts || {};
  const page = host && host.querySelector('.c17-doc');
  if (!page || reduceMotion() || typeof page.animate !== 'function') { apply(); return; }
  const box = page.parentNode;
  const pr = page.getBoundingClientRect(), br = box.getBoundingClientRect();
  const scale = pr.width / (page.offsetWidth || 1) || 1;
  const first = [...page.querySelectorAll('.c17-el')].map((e) => e.getBoundingClientRect());
  const ghosts = [];
  if (o.fall) {
    const N = 7, view = host.querySelector('.kz-br-page');
    const vr = view ? view.getBoundingClientRect() : pr;
    // Режем только видимую часть окна: полосы по высоте окна, а не всей страницы.
    const top = Math.max(0, (vr.top - pr.top) / scale), h = Math.min(pr.height, vr.height) / scale;
    for (let i = 0; i < N; i += 1) {
      const g = page.cloneNode(true);
      g.classList.add('k0-ghost');
      g.setAttribute('aria-hidden', 'true');
      const a = top + (h * i) / N, b = top + (h * (i + 1)) / N;
      // У страницы урока своё position с !important — снимок ставим поверх тоже с !important.
      const put = { position: 'absolute', left: ((pr.left - br.left) / scale) + 'px', top: ((pr.top - br.top) / scale) + 'px',
        width: page.offsetWidth + 'px', margin: '0', 'pointer-events': 'none', 'z-index': '6',
        'clip-path': 'polygon(0 ' + a + 'px, 100% ' + a + 'px, 100% ' + b + 'px, 0 ' + b + 'px)' };
      Object.keys(put).forEach((k) => g.style.setProperty(k, put[k], 'important'));
      box.appendChild(g); ghosts.push(g);
    }
  }
  apply();
  // React применяет новое состояние сразу после обработчика нажатия — замер «где стали» через миг.
  setTimeout(() => {
    const p2 = host.querySelector('.c17-doc');
    if (!p2) { ghosts.forEach((g) => g.remove()); return; }
    const s2 = p2.getBoundingClientRect().width / (p2.offsetWidth || 1) || 1;
    [...p2.querySelectorAll('.c17-el')].forEach((e, i) => {
      const a = first[i];
      if (!a) return;
      const b = e.getBoundingClientRect();
      const dx = (a.left - b.left) / s2, dy = (a.top - b.top) / s2;
      if (Math.abs(dx) + Math.abs(dy) < 1.5) return;
      e.animate([{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'translate(0, 0)' }],
        { duration: o.fall ? 900 : 650, delay: (o.fall ? 350 : 0) + Math.min(i * 14, 260), easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' });
    });
    ghosts.forEach((g, i) => {
      const dir = i % 2 ? 1 : -1;
      const an = g.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1, filter: 'saturate(1)' },
        { transform: 'translate(' + (dir * 6) + 'px, 10px) rotate(' + (dir * 1.5) + 'deg)', opacity: 1, filter: 'saturate(1.2)', offset: 0.25 },
        { transform: 'translate(' + (dir * 46) + 'px, 260px) rotate(' + (dir * 9) + 'deg)', opacity: 0, filter: 'saturate(0)' }
      ], { duration: 950, delay: i * 70, easing: 'cubic-bezier(.55, 0, .8, .35)', fill: 'forwards' });
      an.onfinish = () => g.remove();
    });
    if (o.glow) {
      const el = p2.querySelector(o.glow);
      if (el) el.animate([{ boxShadow: '0 0 0 0 rgba(250, 79, 40, .0)' }, { boxShadow: '0 0 0 6px rgba(250, 79, 40, .45)' }, { boxShadow: '0 0 0 0 rgba(250, 79, 40, 0)' }], { duration: 900, delay: 300 });
    }
  }, 30);
}

// =============================================================================
// S1. КРЮЧОК — красивый сайт космической игры «Planeta 9»; ученик «заглядывает внутрь» — одежда спадает, остаётся голый текст.
// Загадка: Коди думал, что сайты — волшебство для гениев.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [bare, setBare] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) && !bare;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const look = () => {
    if (!canTap) return;
    sfx('pop', true);
    k0Morph(hostRef.current, () => setBare(true), { fall: true });
    put({ done: true });
    setTimeout(() => sfx('soft', true), 450);
    sayNow(c.magic, 'wonder'); say(c.done, 'think');
  };
  const hostRef = useRef(null);
  const site = orbitSite(pick);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={bare ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={bare ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene k0-one">
          <div className="kz-col a1-right k0-brw" ref={hostRef}>
            <AiBrowser site={bare ? dressed(site, []) : k0Plain(site)} />
          </div>
          {!bare ? (
            <div className="k0-under">
              <button type="button" className="kz-btn k0-look" disabled={!canTap} onClick={look}>
                <span aria-hidden="true" className="k0-look-ic">🔍</span><span>{pick(c.btn)}</span><Led on={led} />
              </button>
            </div>
          ) : null}
        </div>
      </Sheet>
    </StageB>
  );
}

// ── ЗНАЧКИ (вместо эмодзи): блоки — HTML, кисть — CSS, искры — ИИ, флажок — свой сайт ──
function K0Ico({ k, size }) {
  const z = size || 20;
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width={z} height={z} viewBox="0 0 24 24" aria-hidden="true" className="k0-ico">
      {k === 'html' ? <g {...P}><rect x="3" y="3.5" width="18" height="5" rx="1.5" /><rect x="3" y="10.5" width="11" height="10" rx="1.5" /><rect x="16" y="10.5" width="5" height="10" rx="1.5" /></g> : null}
      {k === 'css' ? <g {...P}><path d="M19.5 3.5 10 13" /><path d="M9.5 13.5c-2.5 0-4 1.6-4 3.6 0 1.6-1 2.6-2.5 3.4 4.6.6 9-1.2 9-4.8" /><path d="m14 9 2 2" /></g> : null}
      {k === 'ai' ? <g {...P}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8.5 1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2z" fill="currentColor" /><path d="m18 4.5.6 1.2 1.2.6-1.2.6-.6 1.2-.6-1.2-1.2-.6 1.2-.6z" fill="currentColor" /></g> : null}
      {k === 'js' ? <g {...P}><path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z" fill="currentColor" fillOpacity=".18" /></g> : null}
      {k === 'goal' ? <g {...P}><path d="M5 21V4" /><path d="M5 4.5c4-2.2 6.5 2 11 0v8c-4.5 2-7-2.2-11 0" /></g> : null}
    </svg>
  );
}

// ── РЕНТГЕН (экран 2): голубой луч идёт сверху вниз по голой странице, окно листается следом; дошёл до части —
// она найдена (рамка её цвета рисуется правилом страницы, подпись — метка окна, как в модуле «ИИ»: обе держатся
// своего элемента при любой перестройке окна). instant — сразу итог (возврат на экран). ──
const XR_COLORS = ['#06B6D4', '#EC4899', '#EAB308', '#8B5CF6', '#22C55E', '#F97316'];
// Рамка найденной части — правило страницы (ширина по содержимому, чтобы рамка обнимала текст, а не всю строку).
const xrRules = (parts, n) => parts.slice(0, n).map(([sel], i) => oc(sel) + ' { width: fit-content; outline: 3px solid ' + XR_COLORS[i % XR_COLORS.length] + '; outline-offset: 3px; border-radius: 4px; }');
['outline', 'outline-offset'].forEach((x) => { if (CSS_PROPS.indexOf(x) < 0) CSS_PROPS.push(x); });
function k0Beam(host, parts, onFound, onDone, instant) {
  const page = host && host.querySelector('.kz-br-page');
  const doc = page && page.querySelector('.c17-doc');
  if (!page || !doc || instant || reduceMotion()) { parts.forEach((x, i) => onFound(i)); if (page) page.scrollTop = 0; onDone(); return () => {}; }
  const D = page.ownerDocument;
  const beam = D.createElement('div'); beam.className = 'k0-xbeam'; beam.setAttribute('aria-hidden', 'true');
  page.appendChild(beam);
  let n = 0, tm = 0;
  const T = 3200, t0 = Date.now();
  const tick = () => {
    const H = page.scrollHeight, V = page.clientHeight;
    const k = Math.min(1, (Date.now() - t0) / T);
    const y = k * H;
    page.scrollTop = Math.max(0, Math.min(H - V, y - V * 0.6));
    beam.style.top = y + 'px';
    // Дошёл ли луч до середины следующей части (в координатах прокрутки окна).
    while (n < parts.length) {
      const el = doc.querySelector(oc(parts[n][0]));
      if (el) {
        const r = el.getBoundingClientRect(), o = page.getBoundingClientRect();
        if (y < r.top - o.top + page.scrollTop + r.height / 2) break;
      }
      onFound(n); n += 1;
    }
    if (k < 1) { tm = setTimeout(tick, 16); return; }
    while (n < parts.length) { onFound(n); n += 1; }
    beam.classList.add('is-off');
    const from = page.scrollTop; let s2 = 0;
    const back = () => { s2 += 1; const e = s2 / 18; page.scrollTop = Math.round(from * (1 - e) * (1 - e)); if (s2 < 18) tm = setTimeout(back, 22); else { beam.remove(); onDone(); } };
    tm = setTimeout(back, 300);
  };
  tick();
  return () => { clearTimeout(tm); beam.remove(); };
}

// =============================================================================
// S2. ПОКАЗ «Рентген» — луч просвечивает голую страницу и находит её части: логотип, меню, заголовок, текст, кнопки,
// картинку. Слева — список находок со счётчиком; в конце — «Skelet = HTML».
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [scan, setScan] = useState(solved ? 2 : 0);   // 0 — ждём, 1 — луч идёт, 2 — сразу итог
  const [found, setFound] = useState(solved ? c.parts.length : 0);
  const hostRef = useRef(null);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setScan(1); }, wait: reduceMotion() ? 600 : 4600 },
    { say: [{ text: c.found, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const labels = c.parts.map(([sel, l]) => [sel, pick(l)]);
  useEffect(() => {
    if (!scan) return undefined;
    let stop = () => {};
    const t = setTimeout(() => {
      stop = k0Beam(hostRef.current, labels, (i) => { setFound((f) => Math.max(f, i + 1)); if (scan === 1) sfx('tap', true); }, () => {}, scan === 2);
    }, scan === 2 ? 500 : 50);
    return () => { clearTimeout(t); stop(); };
  }, [scan]); // eslint-disable-line react-hooks/exhaustive-deps
  const bare = dressed(orbitSite(pick), []);
  const site = Object.assign({}, bare, { css: xrRules(c.parts, found) });
  // Окно поменяло размер — метки пересчитываются, когда страница перестроится (новый ключ меток).
  const [rz, setRz] = useState(0);
  useEffect(() => {
    let t = 0;
    const on = () => { clearTimeout(t); t = setTimeout(() => setRz((x) => x + 1), 450); };
    window.addEventListener('resize', on);
    return () => { clearTimeout(t); window.removeEventListener('resize', on); };
  }, []);
  const pins = c.parts.slice(0, found).map(([sel, l], i) => ({ sel: oc(sel) + (rz ? ':not(.k0-r' + rz + ')' : ''), q: l, cls: 'k0-pin k0-pin-' + i }));
  const fin = solved || demo.done;
  const askText = fin ? c.askDone : c.asks[found >= c.parts.length ? 1 : 0];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene k0-side">
          <div className="kz-col a1-left k0-xside">
            <div className={'k0-xcard' + (scan === 1 && found < c.parts.length ? ' is-scan' : '')}>
              <div className="k0-xhead">
                <span className="k0-xdot" aria-hidden="true" />
                <b>{pick(scan === 1 && found < c.parts.length ? c.scan : c.foundN)}</b>
                <span className="k0-xn">{found}/{c.parts.length}</span>
              </div>
              <ul className="k0-xlist">
                {c.parts.map(([sel, l], i) => (
                  <li key={sel} className={'k0-xitem' + (i < found ? ' is-on' : '')} style={{ '--c': XR_COLORS[i % XR_COLORS.length] }}>
                    <i aria-hidden="true" /><span>{pick(l)}</span>{i < found ? <em aria-hidden="true">✓</em> : null}
                  </li>
                ))}
              </ul>
              <div className={'k0-xsum' + (fin ? ' is-on' : '')}><K0Ico k="html" size={18} /><b>{pick(C.fin.skel)}</b><span>=</span><b translate="no">HTML</b></div>
            </div>
          </div>
          <div className="kz-col a1-right k0-xwin" ref={hostRef}><AiBrowser site={site} pins={pins.length ? pins : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ── ГАРДЕРОБ (экран 3): вещь улетает с полки в окно сайта, на свою часть; часть одевается, летят искры ──
const WARD_SEL = { menu: '.nav', hero: '.title', btns: '.ctas', cards: '.band' };
function K0Mini({ k }) {
  if (k === 'menu') return <span className="k0-mini k0-mini-menu"><b>✦ planeta9</b><i /></span>;
  if (k === 'hero') return <span className="k0-mini k0-mini-hero"><b>PLANETA <em>9</em></b></span>;
  if (k === 'btns') return <span className="k0-mini k0-mini-btns"><b>▶ PLAY</b><i /></span>;
  return <span className="k0-mini k0-mini-cards"><i /><i /><i /></span>;
}
function k0Fly(srcEl, host, sel, then) {
  const page = host && host.querySelector('.kz-br-page');
  const target = page && page.querySelector('.c17-doc ' + oc(sel));
  if (!srcEl || !page || !target || reduceMotion()) { then(); return; }
  const D = page.ownerDocument;
  // Окно сайта — к нужной части, потом полёт.
  const o = page.getBoundingClientRect();
  const want = Math.max(0, target.getBoundingClientRect().top - o.top + page.scrollTop - 24);
  const from = page.scrollTop; let k = 0;
  const go = () => {
    const a = srcEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    const ghost = srcEl.cloneNode(true);
    ghost.classList.add('k0-fly');
    Object.assign(ghost.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', margin: '0', zIndex: '9999', pointerEvents: 'none' });
    D.body.appendChild(ghost);
    const dx = b.left + Math.min(b.width, 260) / 2 - (a.left + a.width / 2), dy = b.top + Math.min(b.height, 120) / 2 - (a.top + a.height / 2);
    const an = ghost.animate([
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + (dx * 0.5) + 'px, ' + (dy * 0.5 - 70) + 'px) scale(1.15) rotate(-8deg)', opacity: 1, offset: 0.5 },
      { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(.5) rotate(0deg)', opacity: 0.2 }
    ], { duration: 650, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
    an.onfinish = () => {
      ghost.remove();
      const cx = b.left + Math.min(b.width, 260) / 2, cy = b.top + Math.min(b.height, 120) / 2;
      for (let i = 0; i < 12; i += 1) {
        const sp = D.createElement('i'); sp.className = 'k0-spark';
        sp.style.left = cx + 'px'; sp.style.top = cy + 'px';
        sp.style.background = XR_COLORS[i % XR_COLORS.length];
        D.body.appendChild(sp);
        const ang = (Math.PI * 2 * i) / 12, r = 50 + (i % 3) * 18;
        sp.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(ang) * r + 'px), calc(-50% + ' + Math.sin(ang) * r + 'px)) scale(.3)', opacity: 0 }],
          { duration: 650, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'forwards' }).onfinish = () => sp.remove();
      }
      then();
    };
  };
  const scroll = () => { k += 1; const e = k / 10; page.scrollTop = Math.round(from + (want - from) * (1 - (1 - e) * (1 - e))); if (k < 10) setTimeout(scroll, 20); else go(); };
  if (Math.abs(want - from) < 8) go(); else scroll();
}

// =============================================================================
// S3. САМ «Гардероб» — полка с четырьмя вещами (меню, заголовок, кнопки, карточки — мини-образцы их стиля);
// ученик нажимает вещь, она улетает на свою часть сайта, часть одевается.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? PARTS.slice() : []);
  const [busy, setBusy] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const ready = useCanAnswer(spoken);
  const canTap = (ready || on.length > 0) && !busy;
  const all = on.length === PARTS.length;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !all, on.length);
  const nextK = PARTS.find((k) => on.indexOf(k) < 0);
  const hostRef = useRef(null);
  const dress = (k, btn) => {
    if (!canTap || all || on.indexOf(k) >= 0) return;
    const nx = on.concat(k);
    setBusy(true); sfx('pop', true);
    k0Fly(btn && btn.querySelector('.k0-mini'), hostRef.current, WARD_SEL[k], () => {
      k0Morph(hostRef.current, () => setOn(nx), { glow: k === 'hero' ? oc('.hero') : PART_SEL[k] });
      setBusy(false);
      if (nx.length < PARTS.length) { sfx('ok', true); return; }
      sfx('win', true); put({ done: true });
      log({ screenId: 's3', type: 'tap-all', correct: true, firstTry: true, attempts: PARTS.length, hints: 0, depth: 0 });
      sayNow(c.ok, 'cheer');
    });
  };
  const site = dressed(orbitSite(pick), on);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={all ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={all ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene k0-side k0-dress">
          <div className="kz-col a1-left">
            <div className="k0-xcard k0-ward">
              <div className="k0-xhead">
                <span className="k0-xdot" aria-hidden="true" />
                <b>{pick(c.wardrobe)}</b>
                <span className="k0-xn">{on.length}/{PARTS.length}</span>
              </div>
              <div className="k0-ward-shelf">
                {PARTS.map((k) => {
                  const worn = on.indexOf(k) >= 0;
                  return (
                    <button key={k} type="button" data-k={k} className={'k0-cloth' + (worn ? ' is-worn' : '')} disabled={!canTap || worn} onClick={(e) => dress(k, e.currentTarget)}>
                      <K0Mini k={k} />
                      <span className="k0-cloth-n">{worn ? '✓ ' + pick(c.worn) : pick(c.parts[k])}</span>
                      <Led on={led && k === nextK} />
                    </button>
                  );
                })}
              </div>
              <div className={'k0-xsum' + (all ? ' is-on' : '')}><K0Ico k="css" size={18} /><b>{pick(c.eyebrow)}</b><span>=</span><b translate="no">CSS</b></div>
            </div>
          </div>
          <div className="kz-col a1-right" ref={hostRef}><AiBrowser site={site} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ── ЧТО ДЕЛАЕТ КНОПКА (мозг сайта): робот прыгает, конфетти или «⭐ +10» взлетает от кнопки. Вздрогнуть — кнопка без мозга. ──
function k0Do(host, act) {
  const doc = host && host.querySelector('.c17-doc');
  if (!doc) return;
  const D = doc.ownerDocument;
  const btn = doc.querySelector('.o-cta');
  const r = btn ? btn.getBoundingClientRect() : doc.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (act === 'dead') {
    if (btn && !reduceMotion()) btn.animate([{ transform: 'none' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 320 });
    return;
  }
  if (act === 'confetti') { k0Sparks(D, cx, cy, 26); const w = host.querySelector('.kz-br'); if (w) { const q = w.getBoundingClientRect(); k0Sparks(D, q.left + q.width * 0.7, q.top + Math.min(q.height / 2, 150), 16); } return; }
  if (act === 'stars') {
    k0Sparks(D, cx, cy, 8);
    if (reduceMotion()) return;
    const f = D.createElement('span'); f.className = 'k0-plus'; f.textContent = '⭐ +10';
    f.style.left = cx + 'px'; f.style.top = (r.top - 4) + 'px';
    D.body.appendChild(f);
    f.animate([{ transform: 'translate(-50%, 0) scale(.6)', opacity: 0 }, { transform: 'translate(-50%, -24px) scale(1.15)', opacity: 1, offset: 0.25 }, { transform: 'translate(-50%, -90px) scale(1)', opacity: 0 }],
      { duration: 1100, easing: 'cubic-bezier(.2, .8, .3, 1)', fill: 'forwards' }).onfinish = () => f.remove();
    return;
  }
  // jump
  k0Sparks(D, cx, cy, 12);
  const img = doc.querySelector('.o-phone');
  if (img && !reduceMotion()) img.animate([{ transform: 'none' }, { transform: 'translateY(-70px) rotate(-12deg) scale(1.08)', offset: 0.4 }, { transform: 'translateY(-70px) rotate(8deg) scale(1.08)', offset: 0.6 }, { transform: 'none' }],
    { duration: 900, easing: 'cubic-bezier(.3, .7, .3, 1)' });
}
// Нажатие по кнопке «O'ynash» внутри окна сайта.
const isPlay = (e) => !!(e.target && e.target.closest && e.target.closest('.c17-doc .o-cta, .c17-doc .o-navbuy'));

// =============================================================================
// S4. САМ «Мозг» — ученик жмёт «O'ynash» прямо на сайте: ничего (кнопка без мозга). Включает «Miya · JavaScript» и
// жмёт снова: робот прыгает, искры, «O'yin boshlandi!», в шапке растут очки. JS — что делает сайт.
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const log = useLog();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 3 : 0);   // 0 — нажать мёртвую кнопку, 1 — включить мозг, 2 — нажать живую, 3 — готово
  const [js, setJs] = useState(solved);
  const [score, setScore] = useState(solved ? 10 : 0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken) || ph > 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && ph === 1, ph);
  const hostRef = useRef(null);
  const busy = useRef(false);
  const jump = () => k0Do(hostRef.current, 'jump');
  const press = (e) => {
    if (!isPlay(e) || !canTap || busy.current) return;
    if (!js) {
      sfx('soft', true);
      k0Do(hostRef.current, 'dead');
      if (ph === 0) { setPh(1); sayNow(c.dead, 'think'); }
      return;
    }
    sfx('win', true);
    setScore((x) => x + 10);
    setTimeout(jump, 40);
    if (ph === 2) {
      busy.current = true;
      setTimeout(() => {
        busy.current = false;
        setPh(3); put({ done: true });
        log({ screenId: 's4', type: 'toggle-js', correct: true, firstTry: true, attempts: 2, hints: 0, depth: 0 });
        sayNow(c.ok, 'cheer');
      }, 950);
    }
  };
  const turnOn = () => {
    if (ph < 1 || js) return;
    sfx('pop', true); setJs(true); setPh(2); sayNow(c.on, 'smile');
  };
  // Сайт: с мозгом в шапке — очки, в баннере — «O'yin boshlandi!»; кнопка, которую надо нажать, — в оранжевой рамке.
  const base = k0Plain(orbitSite(pick));
  const add = (e) => {
    if (typeof e === 'string') return e;
    let kids = e.kids ? e.kids.map(add) : e.kids;
    if (e.cls === 'o-nav' && js && score > 0) kids = kids.slice(0, 2).concat({ t: 'span', cls: 'o-score', k: 'score', text: '⭐ ' + score }, kids.slice(2));
    if (e.cls === 'o-htext' && js && score > 0) kids = [{ t: 'p', cls: 'o-toast', k: 'toast', text: '▶ ' + pick(c.toast) }].concat(kids);
    return Object.assign({}, e, kids ? { kids } : {});
  };
  const css = base.css.concat(
    '.o-score { margin-left: auto; margin-right: 14px; padding: 5px 12px; border-radius: 999px; background-color: #1E2650; color: #FFD23F; font-size: 13px; font-weight: 800; }',
    '.o-toast { display: inline-block; margin: 0 0 12px; padding: 6px 14px; border-radius: 999px; background-color: #4ADE80; color: #0B1026; font-size: 13px; font-weight: 800; }',
    '.o-cta { cursor: pointer; }',
    ph === 0 || ph === 2 ? '.o-cta { outline: 3px solid #FA4F28; outline-offset: 5px; }' : '.o-cta { outline: none; }');
  const site = Object.assign({}, base, { els: base.els.map(add), css });
  const askText = ph >= 3 ? c.askDone : c.asks[Math.min(ph, 2)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene a1-scene k0-side k0-dress">
          <div className="kz-col a1-left">
            <div className="k0-xcard k0-brain">
              <div className="k0-xhead"><span className={'k0-xdot' + (js ? ' is-js' : '')} aria-hidden="true" /><b>{pick(c.toggle)}</b><span className="k0-xn">⭐ {score}</span></div>
              <button type="button" className={'k0-switch' + (js ? ' is-on' : '') + (ph === 1 ? ' is-ready' : '')} disabled={ph < 1 || js} onClick={turnOn} aria-pressed={js}>
                <span className="k0-switch-ic"><K0Ico k="js" size={30} /></span>
                <span className="k0-switch-t"><b translate="no">JavaScript</b><small>{pick(js ? c.onL : c.off)}</small></span>
                <span className="k0-switch-k" aria-hidden="true"><i /></span>
                <Led on={led} />
              </button>
              <div className={'k0-xsum' + (ph >= 3 ? ' is-on' : '')}><K0Ico k="js" size={18} /><b>{pick(c.eyebrow)}</b><span>=</span><b translate="no">JS</b></div>
            </div>
          </div>
          <div className="kz-col a1-right k0-jswin" ref={hostRef} onClick={press}><AiBrowser site={site} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Искры вокруг точки (x, y) экрана.
function k0Sparks(D, x, y, n) {
  if (reduceMotion()) return;
  const N = n || 12;
  for (let i = 0; i < N; i += 1) {
    const sp = D.createElement('i'); sp.className = 'k0-spark';
    sp.style.left = x + 'px'; sp.style.top = y + 'px';
    sp.style.background = XR_COLORS[i % XR_COLORS.length];
    D.body.appendChild(sp);
    const ang = (Math.PI * 2 * i) / N, r = 50 + (i % 3) * 20;
    sp.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(ang) * r + 'px), calc(-50% + ' + Math.sin(ang) * r + 'px)) scale(.3)', opacity: 0 }],
      { duration: 700, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'forwards' }).onfinish = () => sp.remove();
  }
}
const sparkAt = (host) => {
  const w = host && host.querySelector('.kz-br');
  if (!w) return;
  const r = w.getBoundingClientRect();
  k0Sparks(w.ownerDocument, r.left + r.width / 2, r.top + Math.min(r.height / 2, 160), 14);
};

// =============================================================================
// S5. САМ «Смена одежды» — один скелет, четыре наряда: Neon, Konfet, Retro, O'rmon. Ученик примеряет три;
// сайт переодевается целиком (части переезжают, искры), текст и кнопки остаются теми же.
// =============================================================================
const OUTFITS = ['neon', 'candy', 'retro', 'forest'];
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [th, setTh] = useState(solved ? 'forest' : 'neon');
  const [tried, setTried] = useState(solved ? ['candy', 'retro', 'forest'] : []);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken) || tried.length > 0 || solved;
  const need = 3;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && tried.length < need, tried.length);
  const hostRef = useRef(null);
  const firstRef = useRef(!solved);
  const wear = (k) => {
    if (!canTap || k === th) return;
    sfx('pop', true);
    k0Morph(hostRef.current, () => setTh(k), { glow: oc('.hero') });
    setTimeout(() => sparkAt(hostRef.current), 120);
    const nx = tried.indexOf(k) >= 0 ? tried : tried.concat(k);
    setTried(nx);
    if (nx.length >= need && firstRef.current) {
      firstRef.current = false;
      setTimeout(() => { sfx('win', true); put({ done: true }); log({ screenId: 's5', type: 'tap-all', correct: true, firstTry: true, attempts: nx.length, hints: 0, depth: 0 }); sayNow(c.ok, 'cheer'); }, 700);
    }
  };
  const nextK = OUTFITS.find((k) => k !== th && tried.indexOf(k) < 0);
  const done = tried.length >= need;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={done ? c.askDone : c.ask} n={done ? null : Math.min(tried.length, need) + '/' + need} />
        <div className="kz-scene a1-scene k0-side k0-dress">
          <div className="kz-col a1-left">
            <div className="k0-outfits">
              {OUTFITS.map((k) => {
                const T = THEMES[k];
                return (
                  <button key={k} type="button" data-k={k} className={'k0-outfit' + (th === k ? ' is-on' : '') + (tried.indexOf(k) >= 0 ? ' is-tried' : '')} disabled={!canTap} onClick={() => wear(k)} aria-pressed={th === k}>
                    <span className="k0-outfit-sw" style={{ background: T.bg }}>
                      <i style={{ background: T.btn, borderRadius: T.r === '0px' ? 0 : 6 }} /><i style={{ background: T.a1 }} /><i style={{ background: T.a2 }} />
                    </span>
                    <span className="k0-outfit-n" style={{ fontFamily: T.fD }}>{pick(c.outfits[k])}</span>
                    <Led on={led && k === nextK} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="kz-col a1-right" ref={hostRef}><AiBrowser site={k0Plain(orbitSite(pick, THEMES[th]))} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. «Сломанный сайт» — Коди сломал сайт; ученик решает, что сломалось: скелет или одежда. Верно — сайт чинится.
// =============================================================================
function brokenSite(pick, k) {
  const site = k0Plain(orbitSite(pick));
  if (k === 'title') return Object.assign({}, site, { css: site.css.concat('.o-title { color: #0B1026; text-shadow: none; }', '.o-pro { color: #0B1026; }') });
  if (k === 'img') return Object.assign({}, site, { css: site.css.concat('.o-phone { width: 760px; height: 785px; }') });
  if (k === 'click') return Object.assign({}, site, { css: site.css.concat('.o-cta { outline: 3px dashed #FA4F28; outline-offset: 5px; cursor: pointer; }') });
  if (k === 'btn') {
    const drop = (e) => (typeof e === 'string' ? e : Object.assign({}, e, e.kids ? { kids: e.kids.filter((x) => !(x && x.cls === 'o-cta')).map(drop) } : {}));
    return Object.assign({}, site, { els: site.els.map(drop) });
  }
  return site;
}
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  return <RoundsScreen p={p} c={c} id="s6" keyOf={(it) => it.right} ansOf={(it) => pick(c[it.right])}
    opts={() => ['skel', 'kiy', 'js']} optLabel={(v) => pick(c[v])}
    body={(it, R) => (
      <div className="k0-broke">
        <div className="a1-q-card kz-a-drop k0-broke-q"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>
        <div className={'k0-bwin' + (R.ok ? ' is-fixed' : '')} onClick={(e) => {
          // Мёртвую кнопку можно нажать самому; после верного ответа она оживает.
          if (it.k !== 'click' || !isPlay(e)) return;
          const host = e.currentTarget;
          if (R.ok) { sfx('win', true); k0Do(host, 'jump'); } else { sfx('soft', true); k0Do(host, 'dead'); }
        }}><AiBrowser site={R.ok ? k0Plain(orbitSite(pick)) : brokenSite(pick, it.k)} /></div>
      </div>
    )} />;
}

// =============================================================================
// S8. «Свой дизайн» — ученик выбирает цвет, шрифт и углы; сайт сразу меняется. Ответа нет, готово — когда выбрано
// по одному в каждой строке. Дизайн ученика — в выводе.
// =============================================================================
const LOOK_ROWS = [['color', ['cyan', 'pink', 'green', 'orange']], ['font', ['bold', 'round', 'pixel']], ['corner', ['soft', 'sharp']], ['act', ['jump', 'confetti', 'stars']]];
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [lk, setLk] = useState(store.get('look') || {});
  const [pressed, setPressed] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken) || solved || Object.keys(lk).length > 0;
  const canGo = useAdvanceGate(solved, spoken);
  const full = LOOK_ROWS.every(([r]) => lk[r]);
  const led = useIdleLed(canTap && !full, Object.keys(lk).length);
  const nextRow = (LOOK_ROWS.find(([r]) => !lk[r]) || [])[0];
  const hostRef = useRef(null);
  const askedPress = useRef(false);
  const choose = (row, v) => {
    if (!canTap || lk[row] === v) return;
    const nx = Object.assign({}, lk, { [row]: v });
    sfx('pop', true);
    if (row === 'act') { setLk(nx); setTimeout(() => k0Do(hostRef.current, v), 60); }   // мозг: сразу показать, что делает кнопка
    else k0Morph(hostRef.current, () => setLk(nx), { glow: oc('.hero') });
    store.set('look', nx);
    if (LOOK_ROWS.every(([r]) => nx[r]) && !askedPress.current && !solved) { askedPress.current = true; setTimeout(() => sayNow(c.press, 'point'), 500); }
  };
  const press = (e) => {
    if (!isPlay(e)) return;
    if (!lk.act) { sfx('soft', true); k0Do(hostRef.current, 'dead'); return; }
    sfx('win', true); k0Do(hostRef.current, lk.act);
    if (full && !pressed) {
      setPressed(true); put({ done: true });
      log({ screenId: 's8', type: 'opinion', correct: true, firstTry: true, attempts: 4, hints: 0, depth: 0, look: lk });
      setTimeout(() => sayNow(c.ok, 'cheer'), 700);
    }
  };
  const sw = (row, v) => {
    if (row === 'color') return <i className="k0-lk-dot" style={{ background: LOOK.color[v].btn }} />;
    if (row === 'font') return <b className="k0-lk-aa" style={{ fontFamily: LOOK.font[v].fD }}>Aa</b>;
    if (row === 'act') return <b className="k0-lk-act" aria-hidden="true">{v === 'jump' ? '↑' : v === 'confetti' ? '✶' : '★'}</b>;
    return <i className={'k0-lk-cor is-' + v} />;
  };
  const askText = pressed ? c.askDone : full ? c.askPress : c.ask;
  const css = full && !pressed ? ['.o-cta { outline: 3px solid #FA4F28; outline-offset: 5px; cursor: pointer; }', '.o-navbuy { outline: 3px solid #FA4F28; outline-offset: 3px; cursor: pointer; }'] : ['.o-cta { cursor: pointer; }', '.o-navbuy { cursor: pointer; }'];
  const base = k0Plain(orbitSite(pick, lookTheme(lk)));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k0-sheet">
        <KzAsk text={askText} n={full ? null : Object.keys(lk).length + '/' + LOOK_ROWS.length} />
        <div className="kz-scene a1-scene k0-side k0-dress">
          <div className="kz-col a1-left">
            <div className="k0-lookp">
              {LOOK_ROWS.map(([row, vals]) => (
                <div key={row} className={'k0-lk-row' + (row === 'act' ? ' is-act' : '')}>
                  <span className="k0-lk-h">{row === 'act' ? <K0Ico k="js" size={13} /> : null}{pick(c.rows[row])}</span>
                  <div className="k0-lk-opts">
                    {vals.map((v, i) => (
                      <button key={v} type="button" data-v={v} className={'k0-lk' + (lk[row] === v ? ' is-on' : '')} disabled={!canTap} onClick={() => choose(row, v)} aria-pressed={lk[row] === v} aria-label={pick(c.opts[v])} title={pick(c.opts[v])}>
                        {sw(row, v)}<span>{pick(c.opts[v])}</span>
                        <Led on={led && row === nextRow && i === 0} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="kz-col a1-right k0-jswin" ref={hostRef} onClick={press}><AiBrowser site={Object.assign({}, base, { css: base.css.concat(css) })} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// FIN. ВЫВОД — разгадка: сайт не волшебство, а три части; что ученик сделал сегодня; его сайт — кнопка работает так,
// как он выбрал. О будущем — ничего.
// =============================================================================
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const look = store.get('look') || {};
  const site = k0Plain(orbitSite(pick, lookTheme(look)));
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const tm = setTimeout(() => celebrate(), 900); return () => clearTimeout(tm); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const ROLES = [['html', 'html', 'HTML'], ['css', 'css', 'CSS'], ['js', 'js', 'JavaScript'], ['own', 'ai', pick(c.own)]];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin k0-sheet">
        <div className="kz-scene a1-scene k0-side k0-finw">
          <div className="kz-col a1-left">
            <div className="kz-roles k0-roles">
              {ROLES.map(([k, ic, name]) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}><i aria-hidden="true" /><span><b className="k0-rb"><K0Ico k={ic} size={16} /> {name}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
          </div>
          <div className="kz-col a1-right k0-jswin" onClick={(e) => { if (isPlay(e)) { sfx('win', true); k0Do(e.currentTarget, look.act || 'jump'); } }}><AiBrowser site={Object.assign({}, site, { css: site.css.concat('.o-cta { cursor: pointer; }') })} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'LEVEL-2', Comp: S4 },
  { id: 's5', code: 'LEVEL-3', Comp: S5 }, { id: 's6', code: 'CHECK-2', Comp: S6 },
  { id: 's8', code: 'LEVEL-4', Comp: S8 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой дизайн ученика (look) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

export default function KirishSayt({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('look') ? { type: 'intro-look', look: store.get('look') } : null })
  });
  useParallax();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
