// =============================================================================
// ЭКРАНЫ ВВОДНОГО УРОКА 2 «Свой сайт за 5 минут» (17.11.2026). Кода нет: ученик выбирает тему, кладёт кирпичики
// скелета на пустую страницу, одевает сайт, даёт кнопке мозг, выкладывает сайт в интернет; дорожная карта курса;
// вывод — его сайт и время. Окно сайта — AiBrowser набора «ИИ» (честная страница движка CSS).
// =============================================================================

// ── КАРТИНКИ ТЕМ (свои SVG, без эмодзи) ──
// Игра: робот-космонавт над планетой с кольцом.
FILES['k2-game.svg'] = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='310' viewBox='0 0 300 310'><defs>"
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
// Футбол: мяч летит в ворота с сеткой.
FILES['k2-foot.svg'] = (() => {
  const pt = (cx, cy, r, a) => (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
  const pent = (cx, cy, r, rot) => 'M' + [0, 1, 2, 3, 4].map((i) => pt(cx, cy, r, rot + (i * 2 * Math.PI) / 5)).join(' L') + ' Z';
  const X = 158, Y = 206, R = 60;
  const angs = [0, 1, 2, 3, 4].map((i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5);
  let ball = "<circle cx='" + X + "' cy='" + Y + "' r='" + R + "' fill='url(#w)'/><g clip-path='url(#c)' fill='#0F172A'>";
  ball += "<path d='" + pent(X, Y, 19, -Math.PI / 2) + "'/>";
  angs.forEach((a) => {
    ball += "<path d='" + pent(X + 52 * Math.cos(a), Y + 52 * Math.sin(a), 17, a + Math.PI) + "'/>";
    ball += "<path d='M" + pt(X, Y, 19, a) + ' L' + pt(X, Y, 36, a) + "' stroke='#0F172A' stroke-width='2.4'/>";
    ball += "<path d='M" + pt(X, Y, 36, a) + ' L' + pt(X, Y, 44, a - 0.42) + ' M' + pt(X, Y, 36, a) + ' L' + pt(X, Y, 44, a + 0.42) + "' stroke='#0F172A' stroke-width='2.4'/>";
  });
  ball += "</g><circle cx='" + X + "' cy='" + Y + "' r='" + R + "' fill='none' stroke='#0F172A' stroke-width='3'/>";
  let net = '';
  for (let x = 52; x <= 248; x += 14) net += "<line x1='" + x + "' y1='66' x2='" + (x + (x - 150) * 0.12).toFixed(1) + "' y2='176'/>";
  for (let y = 80; y <= 176; y += 14) net += "<line x1='" + (52 - (y - 66) * 0.12).toFixed(1) + "' y1='" + y + "' x2='" + (248 + (y - 66) * 0.12).toFixed(1) + "' y2='" + y + "'/>";
  return svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='310' viewBox='0 0 300 310'><defs>"
    + "<radialGradient id='g' cx='.5' cy='.55' r='.55'><stop offset='0' stop-color='#4ADE80' stop-opacity='.55'/><stop offset='1' stop-color='#4ADE80' stop-opacity='0'/></radialGradient>"
    + "<radialGradient id='w' cx='.38' cy='.32' r='.8'><stop offset='0' stop-color='#FFFFFF'/><stop offset='1' stop-color='#CBD5E1'/></radialGradient>"
    + "<clipPath id='c'><circle cx='" + X + "' cy='" + Y + "' r='" + (R - 1) + "'/></clipPath></defs>"
    + "<circle cx='150' cy='170' r='140' fill='url(#g)'/>"
    + "<ellipse cx='150' cy='282' rx='138' ry='22' fill='#16A34A'/><ellipse cx='150' cy='278' rx='118' ry='14' fill='#22C55E'/>"
    + "<g stroke='#fff' stroke-opacity='.45' stroke-width='1.5'>" + net + "</g>"
    + "<path d='M40 186 V58 H260 V186' fill='none' stroke='#fff' stroke-width='9' stroke-linejoin='round'/>"
    + "<ellipse cx='" + X + "' cy='276' rx='46' ry='8' fill='#000' fill-opacity='.18'/>"
    + "<g stroke='#FFD23F' stroke-width='6' stroke-linecap='round'><path d='M30 214 H76'/><path d='M44 236 H84' stroke-opacity='.7'/><path d='M22 192 H62' stroke-opacity='.5'/></g>"
    + ball
    + "<g fill='#FFD23F'><path d='M262 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z'/><path d='M244 228 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z'/></g></svg>");
})();
// Музыка: наушники, ноты и эквалайзер.
FILES['k2-music.svg'] = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='310' viewBox='0 0 300 310'><defs>"
  + "<radialGradient id='g' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#FF4FA3' stop-opacity='.55'/><stop offset='1' stop-color='#9B4DFF' stop-opacity='0'/></radialGradient>"
  + "<linearGradient id='c' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#FF7AC0'/><stop offset='1' stop-color='#E11D74'/></linearGradient></defs>"
  + "<circle cx='150' cy='160' r='142' fill='url(#g)'/>"
  + "<g>" + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const h = [30, 56, 80, 46, 96, 64, 40, 70, 34][i]; return "<rect x='" + (52 + i * 22) + "' y='" + (296 - h) + "' width='14' height='" + h + "' rx='7' fill='" + ['#3BF0FF', '#FFD23F', '#FF4FA3'][i % 3] + "' fill-opacity='.85'/>"; }).join('') + "</g>"
  + "<path d='M70 168 A80 80 0 0 1 230 168' fill='none' stroke='#1E1B4B' stroke-width='16' stroke-linecap='round'/>"
  + "<path d='M70 168 A80 80 0 0 1 230 168' fill='none' stroke='#fff' stroke-opacity='.25' stroke-width='4' stroke-linecap='round' transform='translate(0 -5)'/>"
  + "<rect x='46' y='150' width='50' height='86' rx='22' fill='url(#c)'/><rect x='84' y='162' width='18' height='62' rx='8' fill='#1E1B4B'/>"
  + "<rect x='204' y='150' width='50' height='86' rx='22' fill='url(#c)'/><rect x='198' y='162' width='18' height='62' rx='8' fill='#1E1B4B'/>"
  + "<g fill='#FFD23F'><ellipse cx='118' cy='92' rx='15' ry='11' transform='rotate(-20 118 92)'/><rect x='129' y='34' width='5' height='58'/><path d='M129 34 Q156 42 152 66 Q148 52 134 50 Z'/></g>"
  + "<g fill='#3BF0FF'><ellipse cx='178' cy='118' rx='12' ry='9' transform='rotate(-20 178 118)'/><ellipse cx='214' cy='106' rx='12' ry='9' transform='rotate(-20 214 106)'/>"
  + "<rect x='187' y='66' width='4.5' height='50'/><rect x='222.5' y='54' width='4.5' height='50'/><path d='M187 66 L227 54 L227 64 L187 76 Z'/></g>"
  + "<g fill='#fff'><path d='M60 60 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z'/><circle cx='252' cy='54' r='2.2'/><circle cx='34' cy='130' r='1.8'/></g></svg>");
// Животные: панда с бамбуком.
FILES['k2-zoo.svg'] = svgUri("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='310' viewBox='0 0 300 310'><defs>"
  + "<radialGradient id='g' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#A3E635' stop-opacity='.55'/><stop offset='1' stop-color='#22C55E' stop-opacity='0'/></radialGradient>"
  + "<radialGradient id='h' cx='.42' cy='.35' r='.75'><stop offset='0' stop-color='#FFFFFF'/><stop offset='1' stop-color='#E2E8F0'/></radialGradient></defs>"
  + "<circle cx='150' cy='160' r='142' fill='url(#g)'/>"
  + "<g><rect x='240' y='40' width='14' height='260' rx='6' fill='#65A30D'/><rect x='240' y='110' width='14' height='5' fill='#3F6212'/><rect x='240' y='190' width='14' height='5' fill='#3F6212'/>"
  + "<path d='M254 112 Q284 92 292 104 Q276 118 254 116 Z' fill='#84CC16'/><path d='M240 70 Q214 48 204 60 Q220 76 240 74 Z' fill='#84CC16'/><path d='M254 190 Q282 178 288 192 Q270 200 254 194 Z' fill='#84CC16'/></g>"
  + "<ellipse cx='146' cy='270' rx='84' ry='44' fill='url(#h)'/><ellipse cx='84' cy='262' rx='22' ry='34' fill='#111827' transform='rotate(24 84 262)'/><ellipse cx='208' cy='262' rx='22' ry='34' fill='#111827' transform='rotate(-24 208 262)'/>"
  + "<circle cx='86' cy='88' r='30' fill='#111827'/><circle cx='206' cy='88' r='30' fill='#111827'/><circle cx='86' cy='88' r='13' fill='#374151'/><circle cx='206' cy='88' r='13' fill='#374151'/>"
  + "<ellipse cx='146' cy='162' rx='94' ry='84' fill='url(#h)'/>"
  + "<ellipse cx='110' cy='152' rx='22' ry='30' fill='#111827' transform='rotate(32 110 152)'/><ellipse cx='182' cy='152' rx='22' ry='30' fill='#111827' transform='rotate(-32 182 152)'/>"
  + "<circle cx='114' cy='150' r='9' fill='#fff'/><circle cx='178' cy='150' r='9' fill='#fff'/><circle cx='116' cy='151' r='5' fill='#111827'/><circle cx='176' cy='151' r='5' fill='#111827'/>"
  + "<circle cx='118' cy='148' r='1.8' fill='#fff'/><circle cx='178' cy='148' r='1.8' fill='#fff'/>"
  + "<ellipse cx='146' cy='186' rx='13' ry='9' fill='#111827'/><path d='M132 200 Q146 214 160 200' fill='none' stroke='#111827' stroke-width='4' stroke-linecap='round'/>"
  + "<circle cx='92' cy='190' r='11' fill='#FDA4AF' fill-opacity='.7'/><circle cx='200' cy='190' r='11' fill='#FDA4AF' fill-opacity='.7'/>"
  + "<g fill='#FFD23F'><path d='M40 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z'/></g></svg>");

// Движок страницы урока знает не все свойства CSS — сайту ученика нужны ещё обрезка и отступы по сторонам.
['overflow', 'z-index', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'white-space', 'outline', 'outline-offset'].forEach((x) => { if (CSS_PROPS.indexOf(x) < 0) CSS_PROPS.push(x); });

// ── НАРЯДЫ САЙТА: один скелет — четыре одежды ──
const K_DISP = '"Arial Black", "Segoe UI Black", "Arial Rounded MT Bold", Impact, sans-serif';
const K_ROUND = '"Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif';
const K_SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
const K_MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const K_SANS = '"Avenir Next", "Segoe UI", "Helvetica Neue", Helvetica, sans-serif';
// Все наряды светлые (заказчик, 17.11.2026: «не хочу тёмных цветов в слайде… сделай наряды светлыми»).
const THEMES = {
  neon: { bg: '#F5F3FF', ink: '#1E1B4B', sub: '#4C4A7A', mute: '#6D6A9C', dim: '#7C7AA8', line: '#E4E0FB', a1: '#7C3AED', a2: '#FF4FA3',
    glowA: 'rgba(59, 240, 255, 0.45)', glowB: 'rgba(255, 79, 163, 0.16)', btn: '#FFD23F', btnInk: '#1E1B4B', btnSh: '#E0A800', chip: '#EDE9FE',
    fD: K_DISP, fB: K_SANS, fM: K_MONO, up: 'uppercase', r: '14px', tsh: '4px 4px 0 #3BF0FF, 8px 8px 0 #FF4FA3', lsh: 'none' },
  candy: { bg: '#FFE4F1', ink: '#4A1942', sub: '#7A3F6E', mute: '#A0638F', dim: '#B07AA0', line: '#F7C6DD', a1: '#7C5CFF', a2: '#FF6FAE',
    glowA: 'rgba(255, 255, 255, 0.9)', glowB: 'rgba(255, 182, 220, 0.6)', btn: '#FF6FAE', btnInk: '#FFFFFF', btnSh: '#D9478A', chip: '#FFFFFF',
    fD: K_ROUND, fB: K_ROUND, fM: K_ROUND, up: 'none', r: '999px', tsh: '3px 3px 0 #FFFFFF, 6px 6px 0 #FFC2DE', lsh: 'none' },
  retro: { bg: '#FFF8E1', ink: '#1F2937', sub: '#4B5563', mute: '#6B7280', dim: '#8A7F5C', line: '#F0E2B6', a1: '#16A34A', a2: '#EA580C',
    glowA: 'rgba(250, 204, 21, 0.35)', glowB: 'rgba(22, 163, 74, 0.10)', btn: '#16A34A', btnInk: '#FFFFFF', btnSh: '#0F7A35', chip: '#FDEFC3',
    fD: K_MONO, fB: K_MONO, fM: K_MONO, up: 'uppercase', r: '0px', tsh: '3px 3px 0 #FACC15', lsh: 'none' },
  forest: { bg: '#EEF6EA', ink: '#1F3A2B', sub: '#3F5A48', mute: '#5B7563', dim: '#6E8A73', line: '#D5E7CD', a1: '#2F7D4F', a2: '#E07A2F',
    glowA: 'rgba(242, 193, 78, 0.40)', glowB: 'rgba(120, 200, 120, 0.18)', btn: '#E07A2F', btnInk: '#FFFFFF', btnSh: '#A9541A', chip: '#DCEFD4',
    fD: K_SERIF, fB: K_SANS, fM: K_MONO, up: 'none', r: '8px', tsh: '0 2px 0 rgba(31, 58, 43, 0.15)', lsh: 'none' }
};
const OUTFITS = ['neon', 'candy', 'retro', 'forest'];

// ── САЙТ УЧЕНИКА: тема, части скелета (что есть на странице) и наряд (как выглядит). Классы — с приставкой m-:
// имена вроде .title, .pic заняты оформлением самого урока. ──
const K2_PARTS = ['menu', 'title', 'pic', 'btn'];
// Начало сборки сайта — выбор темы (или первый открытый экран сборки, если урок открыт не с начала).
const k2Start = (store) => { if (!store.get('t0')) store.set('t0', Date.now()); };
const k2Of = (store) => ({ topic: store.get('topic') || 'game', theme: store.get('theme') || 'neon', act: store.get('act') || 'jump' });
function mySite(pick, st) {
  const tp = K2_TOPICS[st.topic] || K2_TOPICS.game;
  const parts = st.parts || K2_PARTS;
  const has = (k) => parts.indexOf(k) >= 0;
  const T = st.theme ? THEMES[st.theme] : null;
  const els = [];
  // Чертёж (экран «Скелет»): у недостающей части — пунктирное гнездо на её месте.
  const slot = (k) => (st.slots && !has(k) ? [{ t: 'div', cls: 'slot slot-' + k, k: 'slot-' + k, text: st.slots[k] }] : []);
  if (!has('menu')) els.push(...slot('menu'));
  if (has('menu')) {
    const kids = [{ t: 'span', cls: 'logo', k: 'logo', text: tp.logo }, { t: 'div', cls: 'links', k: 'links', kids: [].concat(...tp.links.map((x, i) => (i ? [' '] : []).concat({ t: 'span', cls: 'lk', k: 'l' + i, text: pick(x) }))) }];
    if (st.likes) kids.push({ t: 'span', cls: 'likes', k: 'likes', text: '♥ ' + st.likes });
    els.push({ t: 'div', cls: 'nav', k: 'nav', kids });
  }
  const tx = [];
  if (has('title')) tx.push({ t: 'h1', cls: 'title', k: 'h1', text: tp.title }, { t: 'p', cls: 'sub', k: 'sub', text: pick(tp.sub) }, { t: 'p', cls: 'spec', k: 'spec', text: pick(tp.spec) });
  else tx.push(...slot('title'));
  if (has('btn')) tx.push({ t: 'button', cls: 'cta', k: 'cta', text: '► ' + pick(tp.btn) });
  else tx.push(...slot('btn'));
  const pic = has('pic') ? [{ t: 'img', cls: 'pic', k: 'pic', src: tp.img, alt: tp.title }] : slot('pic');
  if (tx.length || pic.length) els.push({ t: 'div', cls: 'hero', k: 'hero', kids: [{ t: 'div', cls: 'htext', k: 'htext', kids: tx }].concat(pic.length ? [{ t: 'div', cls: 'hpic', k: 'hpic', kids: pic }] : []) });
  if (!els.length && st.blank) els.push({ t: 'p', cls: 'blank', k: 'blank', text: st.blank });
  let css = [];
  if (T) {
    const glow = (at) => 'radial-gradient(circle at ' + at + ', ' + T.glowA + ', ' + T.glowB + ' 34%, transparent 62%)';
    css = [
      'body { background-color: ' + T.bg + '; font-family: ' + T.fB + '; color: ' + T.ink + '; }',
      '.nav { display: flex; align-items: center; gap: 22px; padding: 14px 32px; background-color: ' + T.bg + '; border-bottom: 1px solid ' + T.line + '; }',
      '.logo { font-family: ' + T.fD + '; font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: ' + T.a1 + '; text-shadow: ' + T.lsh + '; white-space: nowrap; }',
      '.links { display: flex; gap: 22px; margin-left: auto; font-family: ' + T.fM + '; font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase; color: ' + T.mute + '; }',
      '.likes { padding: 5px 12px; border-radius: 999px; background-color: ' + T.a2 + '; color: #FFFFFF; font-size: 13px; font-weight: 800; white-space: nowrap; }',
      '.hero { display: flex; align-items: center; gap: 16px; padding: 34px 32px 38px; background-color: ' + T.bg + '; background-image: ' + glow('76% 50%') + '; overflow: hidden; }',
      '.htext { flex: 1; }',
      '.title { margin: 0; font-family: ' + T.fD + '; font-size: 62px; font-weight: 900; line-height: 0.95; letter-spacing: -1px; text-transform: ' + T.up + '; color: ' + T.ink + '; text-shadow: ' + T.tsh + '; }',
      '.sub { margin: 16px 0 8px; font-size: 19px; line-height: 1.4; color: ' + T.sub + '; }',
      '.spec { margin: 0 0 24px; font-family: ' + T.fM + '; font-size: 12px; letter-spacing: 1.4px; color: ' + T.dim + '; }',
      '.cta { padding: 14px 28px; border: none; border-radius: ' + T.r + '; background-color: ' + T.btn + '; color: ' + T.btnInk + '; font-family: ' + T.fD + '; font-size: 17px; font-weight: 900; letter-spacing: 0.5px; text-transform: ' + T.up + '; box-shadow: 0 5px 0 ' + T.btnSh + '; cursor: pointer; }',
      '.hpic { flex: none; }',
      '.pic { display: block; width: 260px; height: 269px; }',
      '@media (max-width: 600px) { .links { display: none; } .likes { margin-left: auto; } .nav { padding: 12px 18px; } .hero { flex-direction: column; text-align: center; padding: 26px 18px 30px; background-image: ' + glow('50% 76%') + '; } .title { font-size: 44px; } .sub { font-size: 16px; margin: 12px 0 6px; } .spec { margin: 0 0 18px; } .pic { width: 200px; height: 207px; } }'
    ];
  }
  const bc = st.blankColor || '#CBD5E1';
  css = css.concat('.blank { margin: 36px auto; width: 72%; padding: 54px 12px; border: 2px dashed ' + bc + '; border-radius: 14px; color: ' + (st.blankColor || '#94A3B8') + '; background-color: ' + (st.blankColor ? '#FFFFFF' : 'transparent') + '; text-align: center; font-family: sans-serif; font-size: 18px; font-weight: 700; }',
    st.slots ? ['.slot { margin: 10px 0; padding: 14px 12px; border: 2px dashed #CBD5E1; border-radius: 12px; background-color: #F8FAFC; color: #94A3B8; font-family: sans-serif; font-size: 15px; font-weight: 700; text-align: center; }',
      '.slot-title { width: 70%; padding: 26px 12px; }', '.slot-btn { width: 150px; }', '.slot-pic { width: 210px; padding: 64px 12px; }'] : [], st.extra || []);
  const pre = (e) => (typeof e === 'string' ? e : Object.assign({}, e, e.cls ? { cls: e.cls.split(' ').map((x) => 'm-' + x).join(' ') } : {}, e.kids ? { kids: e.kids.map(pre) } : {}));
  return { title: st.title || tp.title, url: st.url || 'index.html', els: els.map(pre), css: css.map((r) => r.replace(/\.([a-z][\w-]*)(\s*\{)/g, '.m-$1$2')), demos: null, btn: null };
}

// ── ЗНАЧКИ (вместо эмодзи) ──
function K2Ico({ k, size }) {
  const z = size || 20;
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const F = { fill: 'currentColor', stroke: 'none' };
  const g = {
    html: <g {...P}><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m13.5 4-3 16" /></g>,
    css: <g {...P}><path d="M19.5 3.5 10 13" /><path d="M9.5 13.5c-2.5 0-4 1.6-4 3.6 0 1.6-1 2.6-2.5 3.4 4.6.6 9-1.2 9-4.8" /><path d="m14 9 2 2" /></g>,
    ai: <g {...P}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8.5 1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2z" fill="currentColor" /></g>,
    js: <g {...P}><path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z" fill="currentColor" fillOpacity=".18" /></g>,
    grid: <g {...P}><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></g>,
    layout: <g {...P}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></g>,
    puzzle: <g {...P}><path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z" /></g>,
    git: <g {...P}><circle cx="6" cy="5" r="2.2" /><circle cx="6" cy="19" r="2.2" /><circle cx="18" cy="9" r="2.2" /><path d="M6 7.2v9.6" /><path d="M18 11.2c0 3.5-5 3-10.5 6" /></g>,
    atom: <g {...P}><circle cx="12" cy="12" r="1.6" fill="currentColor" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" /></g>,
    menu: <g {...P}><path d="M4 7h16M4 12h16M4 17h10" /></g>,
    title: <g {...P}><path d="M6 4v16M18 4v16M6 12h12" /></g>,
    pic: <g {...P}><rect x="3" y="4.5" width="18" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 8.5" /></g>,
    btn: <g {...P}><rect x="3" y="7" width="18" height="10" rx="5" /><path d="m11 10 3 2-3 2z" fill="currentColor" /></g>,
    clock: <g {...P}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M10 2.5h4" /></g>,
    up: <g {...P}><path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6 1.5A3.8 3.8 0 0 1 17.5 18" /><path d="M12 12v8M9 15l3-3 3 3" /></g>,
    pc: <g {...P}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></g>,
    globe: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></g>,
    lock: <g {...P}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></g>,
    eye: <g {...P}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></g>,
    heart: <g {...F}><path d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.2 0 5.2 3.2 4 6.4-1.7 4.5-9.2 9.1-9.2 9.1z" /></g>,
    jump: <g {...P}><path d="M12 19V6M7 11l5-5 5 5" /><path d="M5 21h14" /></g>,
    confetti: <g {...P}><path d="M4 20 9 7l8 8z" /><path d="M14 3v2M19 5l-1.5 1.5M21 10h-2M16.5 8.5 18 7" /></g>
  };
  return <svg width={z} height={z} viewBox="0 0 24 24" aria-hidden="true" className="k2-ico">{g[k] || null}</svg>;
}

// ── ДВИЖЕНИЕ НА СТРАНИЦЕ ──
const K2_SP = ['#06B6D4', '#EC4899', '#EAB308', '#8B5CF6', '#22C55E', '#F97316'];
function k2Sparks(D, x, y, n) {
  if (reduceMotion()) return;
  const N = n || 12;
  for (let i = 0; i < N; i += 1) {
    const sp = D.createElement('i'); sp.className = 'k2-spark';
    sp.style.left = x + 'px'; sp.style.top = y + 'px';
    sp.style.background = K2_SP[i % K2_SP.length];
    D.body.appendChild(sp);
    const ang = (Math.PI * 2 * i) / N, r = 46 + (i % 3) * 18;
    sp.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(ang) * r + 'px), calc(-50% + ' + Math.sin(ang) * r + 'px)) scale(.3)', opacity: 0 }],
      { duration: 700, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'forwards' }).onfinish = () => sp.remove();
  }
}
// Окно сайта к элементу (smooth в окне урока не работает — сразу).
function k2Show(host, el) {
  const view = host && host.querySelector('.kz-br-page');
  if (!view || !el) return;
  const v = view.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (r.top >= v.top && r.bottom <= v.bottom) return;
  view.scrollTop = Math.max(0, r.top - v.top + view.scrollTop - Math.max(16, (v.height - r.height) / 3));
}
// Смена страницы с движением (FLIP по data-t): старые части переезжают на новые места; drop — новые части падают
// сверху (fly — кирпичик сначала летит с полки); wipe — новый наряд волной накрывает страницу сверху вниз (цвет
// шва); под «меньше движения» — сразу.
function k2Flip(host, apply, opts) {
  const o = opts || {};
  const page = host && host.querySelector('.c17-doc');
  if (!page || reduceMotion() || typeof page.animate !== 'function') { apply(); return; }
  const D = page.ownerDocument;
  const keysOf = (list) => { const n = {}; return list.map((e) => { const t = e.getAttribute('data-t') || ''; n[t] = (n[t] || 0) + 1; return t + '#' + n[t]; }); };
  const a = [...page.querySelectorAll('.c17-el')];
  const ka = keysOf(a);
  const first = {};
  a.forEach((e, i) => { first[ka[i]] = e.getBoundingClientRect(); });
  let ghost = null, seam = null, gTop = 0, top = 0, h = 0;
  if (o.wipe) {
    const box = page.parentNode;
    const pr = page.getBoundingClientRect(), br = box.getBoundingClientRect();
    const scale = pr.width / (page.offsetWidth || 1) || 1;
    const view = host.querySelector('.kz-br-page');
    const vr = view ? view.getBoundingClientRect() : pr;
    top = Math.max(0, (vr.top - pr.top) / scale); h = Math.min(pr.height, vr.height) / scale;
    gTop = (pr.top - br.top) / scale;
    const put = { position: 'absolute', left: ((pr.left - br.left) / scale) + 'px', top: gTop + 'px', width: page.offsetWidth + 'px', margin: '0', 'pointer-events': 'none', 'z-index': '6',
      'clip-path': 'polygon(0 ' + top + 'px, 100% ' + top + 'px, 100% ' + (top + h) + 'px, 0 ' + (top + h) + 'px)' };
    ghost = page.cloneNode(true);
    ghost.classList.add('k2-ghost'); ghost.setAttribute('aria-hidden', 'true');
    Object.keys(put).forEach((k) => ghost.style.setProperty(k, put[k], 'important'));
    box.appendChild(ghost);
    seam = D.createElement('div'); seam.className = 'k2-seam'; seam.setAttribute('aria-hidden', 'true');
    const sp = { position: 'absolute', left: put.left, top: (gTop + top) + 'px', width: put.width, height: '5px', 'z-index': '7', 'pointer-events': 'none', background: o.wipe, 'box-shadow': '0 0 18px 4px ' + o.wipe };
    Object.keys(sp).forEach((k) => seam.style.setProperty(k, sp[k], 'important'));
    box.appendChild(seam);
  }
  apply();
  setTimeout(() => {
    const p2 = host.querySelector('.c17-doc');
    if (!p2) { if (ghost) ghost.remove(); if (seam) seam.remove(); return; }
    const s2 = p2.getBoundingClientRect().width / (p2.offsetWidth || 1) || 1;
    const b = [...p2.querySelectorAll('.c17-el')];
    const kb = keysOf(b);
    const fresh = new Set(b.filter((e, i) => !first[kb[i]]));
    const tops = b.filter((e) => fresh.has(e) && !(e.parentElement && fresh.has(e.parentElement.closest('.c17-el'))));
    if (o.drop && tops[0]) k2Show(host, tops[0]);
    b.forEach((e, i) => {
      const r0 = first[kb[i]];
      if (!r0) return;
      const r = e.getBoundingClientRect();
      const dx = (r0.left - r.left) / s2, dy = (r0.top - r.top) / s2;
      if (Math.abs(dx) + Math.abs(dy) < 1.5 || o.drop && Math.abs(dy) > 600) return;
      e.animate([{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'translate(0, 0)' }],
        { duration: o.wipe ? 800 : 520, delay: o.wipe ? 120 : 0, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' });
    });
    if (o.drop) {
      const delay = o.fly ? 380 : 0;
      tops.forEach((e) => {
        const r = e.getBoundingClientRect();
        if (o.fly && o.flyEl) {
          const g2 = o.flyEl.cloneNode(true);
          g2.classList.add('k2-fly');
          Object.assign(g2.style, { position: 'fixed', left: o.fly.left + 'px', top: o.fly.top + 'px', width: o.fly.width + 'px', height: o.fly.height + 'px', margin: '0', zIndex: '9999', pointerEvents: 'none' });
          D.body.appendChild(g2);
          const dx = r.left + Math.min(r.width, 300) / 2 - (o.fly.left + o.fly.width / 2), dy = r.top + Math.min(r.height, 80) / 2 - (o.fly.top + o.fly.height / 2);
          g2.animate([{ transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + (dx * 0.5) + 'px, ' + (dy * 0.5 - 60) + 'px) scale(1.1) rotate(-7deg)', opacity: 1, offset: 0.55 },
            { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(.55) rotate(0deg)', opacity: 0 }], { duration: 440, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' }).onfinish = () => g2.remove();
        }
        e.animate([{ transform: 'translateY(-80px) scale(1.04)', opacity: 0 }, { transform: 'translateY(8px) scale(1)', opacity: 1, offset: 0.62 }, { transform: 'translateY(-3px)', offset: 0.84 }, { transform: 'none', opacity: 1 }],
          { duration: 620, delay, easing: 'cubic-bezier(.3, .7, .4, 1)', fill: 'backwards' });
        e.animate([{ outline: '3px solid rgba(250, 79, 40, 0)', outlineOffset: '4px' }, { outline: '3px solid rgba(250, 79, 40, .9)', outlineOffset: '4px', offset: 0.3 }, { outline: '3px solid rgba(250, 79, 40, 0)', outlineOffset: '4px' }],
          { duration: 1100, delay: delay + 450 });
        setTimeout(() => { const q = e.getBoundingClientRect(); k2Sparks(D, q.left + Math.min(q.width, 300) / 2, q.top + Math.min(q.height, 80) / 2, 12); }, delay + 420);
      });
    }
    if (ghost) {
      const bot = top + h;
      ghost.animate([{ clipPath: 'polygon(0 ' + top + 'px, 100% ' + top + 'px, 100% ' + bot + 'px, 0 ' + bot + 'px)' }, { clipPath: 'polygon(0 ' + bot + 'px, 100% ' + bot + 'px, 100% ' + bot + 'px, 0 ' + bot + 'px)' }],
        { duration: 900, easing: 'cubic-bezier(.6, 0, .35, 1)', fill: 'forwards' }).onfinish = () => ghost.remove();
      seam.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + h + 'px)', opacity: 1, offset: 0.92 }, { transform: 'translateY(' + h + 'px)', opacity: 0 }],
        { duration: 900, easing: 'cubic-bezier(.6, 0, .35, 1)', fill: 'forwards' }).onfinish = () => seam.remove();
    }
  }, 30);
}
// Что делает кнопка (мозг сайта): картинка прыгает, конфетти сыплется по окну, «♥ +1» взлетает. dead — кнопка вздрагивает.
function k2Do(host, act) {
  const doc = host && host.querySelector('.c17-doc');
  if (!doc) return;
  const D = doc.ownerDocument;
  const btn = doc.querySelector('.m-cta');
  const r = btn ? btn.getBoundingClientRect() : doc.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (act === 'dead') {
    if (btn && !reduceMotion()) btn.animate([{ transform: 'none' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 340 });
    return;
  }
  if (reduceMotion()) return;
  if (act === 'confetti') {
    const w = host.querySelector('.kz-br-page') || doc;
    const q = w.getBoundingClientRect();
    for (let i = 0; i < 46; i += 1) {
      const c = D.createElement('i'); c.className = 'k2-conf';
      const x = q.left + Math.random() * q.width;
      c.style.left = x + 'px'; c.style.top = (q.top - 10) + 'px';
      c.style.background = K2_SP[i % K2_SP.length];
      if (i % 3 === 0) c.style.borderRadius = '50%';
      D.body.appendChild(c);
      const fall = q.height * (0.7 + Math.random() * 0.35), drift = (Math.random() - 0.5) * 80, rot = (Math.random() - 0.5) * 720;
      c.animate([{ transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }, { transform: 'translate(' + drift + 'px, ' + fall + 'px) rotate(' + rot + 'deg)', opacity: 0.9, offset: 0.85 }, { transform: 'translate(' + drift + 'px, ' + (fall + 20) + 'px) rotate(' + rot + 'deg)', opacity: 0 }],
        { duration: 1300 + Math.random() * 700, delay: Math.random() * 250, easing: 'cubic-bezier(.25, .6, .45, 1)', fill: 'forwards' }).onfinish = () => c.remove();
    }
    k2Sparks(D, cx, cy, 10);
    return;
  }
  if (act === 'like') {
    k2Sparks(D, cx, cy, 8);
    const f = D.createElement('span'); f.className = 'k2-plus'; f.textContent = '♥ +1';
    f.style.left = cx + 'px'; f.style.top = (r.top - 4) + 'px';
    D.body.appendChild(f);
    f.animate([{ transform: 'translate(-50%, 0) scale(.6)', opacity: 0 }, { transform: 'translate(-50%, -24px) scale(1.2)', opacity: 1, offset: 0.25 }, { transform: 'translate(-50%, -96px) scale(1)', opacity: 0 }],
      { duration: 1100, easing: 'cubic-bezier(.2, .8, .3, 1)', fill: 'forwards' }).onfinish = () => f.remove();
    return;
  }
  // jump
  k2Sparks(D, cx, cy, 12);
  const img = doc.querySelector('.m-pic');
  if (img) img.animate([{ transform: 'none' }, { transform: 'translateY(-60px) rotate(-10deg) scale(1.08)', offset: 0.4 }, { transform: 'translateY(-60px) rotate(8deg) scale(1.08)', offset: 0.6 }, { transform: 'none' }],
    { duration: 900, easing: 'cubic-bezier(.3, .7, .3, 1)' });
}
const isCta = (e) => !!(e.target && e.target.closest && e.target.closest('.c17-doc .m-cta'));
// Сердечки всплывают над окном сайта (экран «В интернет»).
function k2Hearts(host, n) {
  const w = host && host.querySelector('.kz-br');
  if (!w || reduceMotion()) return;
  const D = w.ownerDocument, q = w.getBoundingClientRect();
  for (let i = 0; i < n; i += 1) {
    const hEl = D.createElement('span'); hEl.className = 'k2-heart'; hEl.textContent = '♥';
    hEl.style.left = (q.left + q.width * (0.15 + Math.random() * 0.7)) + 'px';
    hEl.style.top = (q.top + q.height - 30) + 'px';
    hEl.style.color = ['#FF4FA3', '#F43F5E', '#FA4F28', '#EC4899'][i % 4];
    hEl.style.fontSize = (18 + Math.random() * 16) + 'px';
    D.body.appendChild(hEl);
    const up = 120 + Math.random() * 140, dx = (Math.random() - 0.5) * 60;
    hEl.animate([{ transform: 'translate(-50%, 0) scale(.4)', opacity: 0 }, { transform: 'translate(-50%, -30px) scale(1)', opacity: 1, offset: 0.2 }, { transform: 'translate(calc(-50% + ' + dx + 'px), -' + up + 'px) scale(.9)', opacity: 0 }],
      { duration: 1600 + Math.random() * 600, delay: i * 140, easing: 'cubic-bezier(.2, .7, .4, 1)', fill: 'backwards' }).onfinish = () => hEl.remove();
  }
}
// Счёт вверх (просмотры, лайки).
function useCountUp(target, run, ms) {
  const [v, setV] = useState(run === 'now' ? target : 0);
  useEffect(() => {
    if (!run || run === 'now') { setV(run ? target : 0); return undefined; }
    if (reduceMotion()) { setV(target); return undefined; }
    const t0 = Date.now();
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k >= 1) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [target, run, ms]);
  return v;
}

// Вещь (кирпичик, наряд, значок) летит дугой в другое место экрана; копия исчезает у цели.
function k2FlyEl(src, dst, o) {
  const op = o || {};
  if (!src || !dst || reduceMotion()) { if (op.done) op.done(); return; }
  const D = src.ownerDocument, a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
  const g = src.cloneNode(true);
  g.classList.add('k2-flyer');
  Object.assign(g.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', margin: '0', zIndex: '9999', pointerEvents: 'none' });
  D.body.appendChild(g);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const sc = op.scale || Math.max(0.2, Math.min(1.2, b.width / (a.width || 1)));
  const arc = op.arc != null ? op.arc : 70;
  g.animate([{ transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: 'translate(' + (dx * 0.5) + 'px, ' + (dy * 0.5 - arc) + 'px) scale(' + ((1 + sc) / 2 * 1.08) + ') rotate(' + (op.rot != null ? op.rot : -8) + 'deg)', opacity: 1, offset: 0.55 },
    { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + sc + ') rotate(0deg)', opacity: op.fade ? 0 : 1 }],
  { duration: op.ms || 650, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' }).onfinish = () => { g.remove(); if (op.done) op.done(); };
}
// Полоска загрузки над страницей в окне сайта (координаты — от колонки окна, у неё position: relative).
function k2LoadBar(host, color) {
  const page = host && host.querySelector('.kz-br-page');
  if (!page || reduceMotion()) return;
  const h = host.getBoundingClientRect(), r = page.getBoundingClientRect();
  const bar = host.ownerDocument.createElement('i');
  bar.className = 'k2-loadbar';
  Object.assign(bar.style, { left: (r.left - h.left) + 'px', top: (r.top - h.top) + 'px', width: r.width + 'px', background: color || '#FA4F28' });
  host.appendChild(bar);
  bar.animate([{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: 0.8 }, { transform: 'scaleX(1)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.3, .7, .4, 1)', fill: 'forwards' }).onfinish = () => bar.remove();
}
// Блик по окну сайта — «как в зеркале» после нового наряда.
function k2Shine(host) {
  const page = host && host.querySelector('.kz-br-page');
  if (!page || reduceMotion()) return;
  const h = host.getBoundingClientRect(), r = page.getBoundingClientRect();
  const sh = host.ownerDocument.createElement('i');
  sh.className = 'k2-shine';
  Object.assign(sh.style, { left: (r.left - h.left) + 'px', top: (r.top - h.top) + 'px', width: r.width + 'px', height: r.height + 'px' });
  host.appendChild(sh);
  sh.animate([{ backgroundPosition: '-60% 0' }, { backgroundPosition: '160% 0' }], { duration: 950, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' }).onfinish = () => sh.remove();
}
// Скелет готов: части по очереди вспыхивают голубым контуром, как на рентгене.
function k2Glow(host) {
  const doc = host && host.querySelector('.c17-doc');
  if (!doc || reduceMotion()) return;
  ['.m-nav', '.m-title', '.m-cta', '.m-pic'].forEach((sel, i) => {
    const el = doc.querySelector(sel);
    if (el) el.animate([{ outline: '3px solid rgba(6, 182, 212, 0)', outlineOffset: '4px' }, { outline: '3px solid rgba(6, 182, 212, .95)', outlineOffset: '4px', offset: 0.35 }, { outline: '3px solid rgba(6, 182, 212, 0)', outlineOffset: '4px' }], { duration: 900, delay: i * 180 });
  });
}
// Провод от выбранного действия к кнопке сайта: рисуется, по нему бежит искра, на конце — вспышка (мозг подключили).
function k2Wire(fromEl, toEl, color, done) {
  if (!fromEl || !toEl || reduceMotion()) { if (done) done(); return; }
  const D = fromEl.ownerDocument, NS = 'http://www.w3.org/2000/svg';
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  let d;
  if (b.left > a.right - 10) {
    const x1 = a.right, y1 = a.top + a.height / 2, x2 = b.left - 4, y2 = b.top + b.height / 2, m = (x2 - x1) / 2;
    d = 'M' + x1 + ' ' + y1 + ' C' + (x1 + m) + ' ' + y1 + ' ' + (x2 - m) + ' ' + y2 + ' ' + x2 + ' ' + y2;
  } else {
    const x1 = a.left + a.width / 2, y1 = a.bottom, x2 = b.left + b.width / 2, y2 = b.top - 4, m = (y2 - y1) / 2;
    d = 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + (y1 + m) + ' ' + x2 + ' ' + (y2 - m) + ' ' + x2 + ' ' + y2;
  }
  const svg = D.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'k2-wire');
  svg.setAttribute('width', String(D.documentElement.clientWidth));
  svg.setAttribute('height', String(D.documentElement.clientHeight));
  const under = D.createElementNS(NS, 'path'); under.setAttribute('d', d); under.setAttribute('class', 'k2-wire-u');
  const line = D.createElementNS(NS, 'path'); line.setAttribute('d', d); line.setAttribute('class', 'k2-wire-l'); line.style.stroke = color;
  const dot = D.createElementNS(NS, 'circle'); dot.setAttribute('r', '7'); dot.setAttribute('class', 'k2-wire-dot'); dot.style.stroke = color;
  svg.appendChild(under); svg.appendChild(line); svg.appendChild(dot);
  D.body.appendChild(svg);
  const len = line.getTotalLength();
  [under, line].forEach((pth) => { pth.style.strokeDasharray = len + ' ' + len; pth.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 520, easing: 'ease-out', fill: 'forwards' }); });
  const t0 = Date.now() + 420, T = 620;
  const tick = () => {
    const k = Math.max(0, Math.min(1, (Date.now() - t0) / T));
    const q = line.getPointAtLength(len * k);
    dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y);
    if (k < 1) { setTimeout(tick, 16); return; }
    k2Sparks(D, q.x, q.y, 14);
    if (done) done();
    svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 250, fill: 'forwards' }).onfinish = () => svg.remove();
  };
  tick();
}

// =============================================================================
// S1. КРЮЧОК — спор «сайт за 5 минут»; темы — четыре парящих острова. Выбранный остров летит в окно браузера,
// по вкладке бежит загрузка, печатается имя сайта, на пустой странице — контур «здесь будет твой сайт» цвета темы.
// =============================================================================
const TOPIC_C = { game: '#8B5CF6', foot: '#16A34A', music: '#EC4899', zoo: '#65A30D' };
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const store = useStore();
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [topic, setTopic] = useState(solved ? store.get('topic') || 'game' : null);
  const [typed, setTyped] = useState(99);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.picked : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) || !!topic;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !topic, 0);
  const hostRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const choose = (k, btn) => {
    if (!canTap || k === topic) return;
    sfx('pop', true);
    const first = !topic;
    const host = hostRef.current;
    k2FlyEl(btn && btn.querySelector('.k2-isl img'), host && host.querySelector('.kz-br-page'), { fade: true, scale: 1.5, ms: 620,
      done: () => { const pg = hostRef.current && hostRef.current.querySelector('.kz-br-page'); if (pg) { const r = pg.getBoundingClientRect(); k2Sparks(pg.ownerDocument, r.left + r.width / 2, r.top + Math.min(r.height / 2, 120), 14); } } });
    setTopic(k);
    store.set('topic', k);
    k2Start(store);
    tm.current.forEach(clearTimeout); tm.current = [];
    const title = K2_TOPICS[k].title;
    setTyped(0);
    tm.current.push(setTimeout(() => k2LoadBar(hostRef.current, TOPIC_C[k]), 420));
    for (let i = 1; i <= title.length; i += 1) tm.current.push(setTimeout(() => setTyped(i), 520 + i * 75));
    if (first) { put({ done: true }); sayNow(c.picked, 'cheer'); }
  };
  const tp = topic ? K2_TOPICS[topic] : null;
  const shown = tp ? tp.title.slice(0, typed) : pick(c.blank);
  const site = mySite(pick, { topic: topic || 'game', parts: [], blank: pick(tp ? c.yours : c.blank), blankColor: tp ? TOPIC_C[topic] : null, title: shown || ' ' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={topic ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={topic ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene k2-side">
          <div className="kz-col a1-left">
            <div className="k2-topics">
              {Object.keys(K2_TOPICS).map((k, i) => (
                <button key={k} type="button" data-k={k} className={'k2-topic' + (topic === k ? ' is-on' : '')} disabled={!canTap} onClick={(e) => choose(k, e.currentTarget)} aria-pressed={topic === k} style={{ '--tc': TOPIC_C[k] }}>
                  <span className="k2-isl" style={{ animationDelay: (i * -0.9) + 's' }}><img src={FILES[K2_TOPICS[k].img]} alt="" /></span>
                  <span className="k2-topic-n">{pick(K2_TOPICS[k].name)}</span>
                  <Led on={led && i === 0} />
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col a1-right" ref={hostRef}><AiBrowser site={site} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. САМ «Скелет» — страница-чертёж: пунктирные гнёзда «Меню», «Заголовок», «Кнопка», «Картинка». Кирпичик летит
// в своё гнездо и встаёт на место голым (шрифт браузера, серая кнопка). Все четыре — скелет вспыхивает, «Skelet = HTML».
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [parts, setParts] = useState(solved ? K2_PARTS.slice() : []);
  const [busy, setBusy] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = (useCanAnswer(spoken) || parts.length > 0) && !busy;
  const all = parts.length === K2_PARTS.length;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !all, parts.length);
  const nextK = K2_PARTS.find((k) => parts.indexOf(k) < 0);
  const hostRef = useRef(null);
  useEffect(() => k2Start(store), []); // eslint-disable-line react-hooks/exhaustive-deps
  const st = k2Of(store);
  const add = (k, btn) => {
    if (!canTap || parts.indexOf(k) >= 0) return;
    const nx = K2_PARTS.filter((x) => x === k || parts.indexOf(x) >= 0);
    const b = btn && btn.querySelector('.k2-brick-b');
    setBusy(true); sfx('pop', true);
    k2Flip(hostRef.current, () => setParts(nx), { drop: true, fly: b ? b.getBoundingClientRect() : null, flyEl: b });
    setTimeout(() => {
      setBusy(false);
      if (nx.length < K2_PARTS.length) { sfx('ok', true); return; }
      sfx('win', true); put({ done: true });
      setTimeout(() => k2Glow(hostRef.current), 150);
      log({ screenId: 's2', type: 'tap-all', correct: true, firstTry: true, attempts: K2_PARTS.length, hints: 0, depth: 0 });
      sayNow(c.ok, 'cheer');
    }, 900);
  };
  const slots = {};
  K2_PARTS.forEach((k) => { slots[k] = pick(c.bricks[k]); });
  const site = mySite(pick, { topic: st.topic, parts, slots });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={all ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={all ? c.askDone : c.ask} n={all ? null : parts.length + '/' + K2_PARTS.length} />
        <div className="kz-scene a1-scene k2-side">
          <div className="kz-col a1-left">
            <div className="k2-card">
              <div className="k2-head"><span className="k2-dot" aria-hidden="true" /><b>{pick(c.shelf)}</b><span className="k2-n">{parts.length}/{K2_PARTS.length}</span></div>
              <div className="k2-bricks">
                {K2_PARTS.map((k) => {
                  const on = parts.indexOf(k) >= 0;
                  return (
                    <button key={k} type="button" data-k={k} className={'k2-brick k2-brick-' + k + (on ? ' is-on' : '')} disabled={!canTap || on} onClick={(e) => add(k, e.currentTarget)}>
                      <span className="k2-brick-b"><span className="k2-studs" aria-hidden="true"><i /><i /><i /></span><span className="k2-brick-f"><K2Ico k={k} size={20} /><b>{pick(c.bricks[k])}</b></span></span>
                      <Led on={led && k === nextK} />
                    </button>
                  );
                })}
              </div>
              <div className={'k2-sum' + (all ? ' is-on' : '')}><K2Ico k="html" size={18} /><b>{pick(c.eyebrow)}</b><span>=</span><b translate="no">HTML</b></div>
            </div>
          </div>
          <div className="kz-col a1-right" ref={hostRef}><AiBrowser site={site} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. САМ «Одежда» — вешалка с четырьмя нарядами (футболки цветов наряда, покачиваются). Выбранная летит на сайт,
// наряд волной накрывает страницу, по окну пробегает блик — как в зеркале. Скелет тот же.
// =============================================================================
function K2Shirt({ T }) {
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" aria-hidden="true" className="k2-shirt">
      <path d="M28.5 8.5a3.6 3.6 0 1 1 3.5 3.6V15" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 15 L9 25 H55 Z" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M21 23 L28.5 21 Q32 26.5 35.5 21 L43 23 L57 33 L50.5 41 L46 37.5 V69 H18 V37.5 L13.5 41 L7 33 Z" fill={T.bg} stroke="#94A3B8" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="18" y="49" width="28" height="7" fill={T.btn} />
      <text x="32" y="44" textAnchor="middle" fontSize="11" fontWeight="900" fill={T.ink} style={{ fontFamily: T.fD }}>Aa</text>
    </svg>
  );
}
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [th, setTh] = useState(solved ? store.get('theme') || 'neon' : null);
  const [busy, setBusy] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = (useCanAnswer(spoken) || !!th) && !busy;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !th, 0);
  const hostRef = useRef(null);
  useEffect(() => k2Start(store), []); // eslint-disable-line react-hooks/exhaustive-deps
  const st = k2Of(store);
  const wear = (k, btn) => {
    if (!canTap || k === th) return;
    const first = !th;
    sfx('pop', true);
    setBusy(true);
    const host = hostRef.current;
    k2FlyEl(btn && btn.querySelector('.k2-shirt'), host && host.querySelector('.kz-br-page'), { fade: true, scale: 1.6, ms: 520, rot: 12 });
    setTimeout(() => {
      k2Flip(hostRef.current, () => setTh(k), { wipe: THEMES[k].a1 });
      store.set('theme', k);
    }, 380);
    setTimeout(() => { k2Shine(hostRef.current); const w = hostRef.current && hostRef.current.querySelector('.kz-br'); if (w) { const q = w.getBoundingClientRect(); k2Sparks(w.ownerDocument, q.left + q.width / 2, q.top + Math.min(q.height / 2, 170), 14); } setBusy(false); }, 1250);
    if (first) {
      setTimeout(() => { sfx('win', true); put({ done: true }); log({ screenId: 's3', type: 'tap', correct: true, firstTry: true, attempts: 1, hints: 0, depth: 0, theme: k }); sayNow(c.ok, 'cheer'); }, 1300);
    }
  };
  const site = mySite(pick, { topic: st.topic, theme: th });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={th ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={th ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene k2-side">
          <div className="kz-col a1-left">
            <div className="k2-card">
              <div className="k2-head"><span className="k2-dot is-css" aria-hidden="true" /><b>{pick(c.wardrobe)}</b></div>
              <div className="k2-rack">
                {OUTFITS.map((k, i) => (
                  <button key={k} type="button" data-k={k} className={'k2-hanger' + (th === k ? ' is-on' : '')} disabled={!canTap} onClick={(e) => wear(k, e.currentTarget)} aria-pressed={th === k}>
                    <span className="k2-hanger-s" style={{ animationDelay: (i * -0.7) + 's' }}><K2Shirt T={THEMES[k]} /></span>
                    <span className="k2-hanger-n">{pick(c.outfits[k])}</span>
                    <Led on={led && i === 0} />
                  </button>
                ))}
              </div>
              <div className={'k2-sum' + (th ? ' is-on' : '')}><K2Ico k="css" size={18} /><b>{pick(c.eyebrow)}</b><span>=</span><b translate="no">CSS</b></div>
            </div>
          </div>
          <div className="kz-col a1-right" ref={hostRef}><AiBrowser site={site} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. САМ «Мозг» — кнопка на сайте «спит» (z-z-z): нажатие — ничего. Ученик выбирает, что будет при нажатии; от
// выбора к кнопке тянется провод, по нему бежит искра — кнопка просыпается. Нажал — работает. JavaScript — что делает сайт.
// =============================================================================
const K2_ACTS = ['jump', 'confetti', 'like'];
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  useEffect(() => k2Start(store), []); // eslint-disable-line react-hooks/exhaustive-deps
  const st = k2Of(store);
  const [ph, setPh] = useState(solved ? 3 : 0);   // 0 — нажать мёртвую кнопку, 1 — выбрать, 2 — нажать живую, 3 — готово
  const [act, setAct] = useState(solved ? st.act : null);
  const [likes, setLikes] = useState(0);
  const [zz, setZz] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken) || ph > 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && ph === 1, ph);
  const hostRef = useRef(null);
  const busy = useRef(false);
  // «z-z-z» над спящей кнопкой — держится кнопки при прокрутке окна и смене размера.
  useLayoutEffect(() => {
    if (act) { setZz(null); return undefined; }
    const host = hostRef.current;
    const page = host && host.querySelector('.kz-br-page');
    if (!page) return undefined;
    const read = () => {
      const b = host.querySelector('.c17-doc .m-cta');
      if (!b) { setZz(null); return; }
      const h = host.getBoundingClientRect(), r = b.getBoundingClientRect(), pg = page.getBoundingClientRect();
      setZz(r.top < pg.top || r.top > pg.bottom - 10 ? null : { x: Math.round(r.right - h.left - 4), y: Math.round(r.top - h.top - 2) });
    };
    const t1 = setTimeout(read, 300), t2 = setTimeout(read, 1200);
    page.addEventListener('scroll', read);
    window.addEventListener('resize', read);
    return () => { clearTimeout(t1); clearTimeout(t2); page.removeEventListener('scroll', read); window.removeEventListener('resize', read); };
  }, [act]);
  const press = (e) => {
    if (!isCta(e) || !canTap || busy.current) return;
    if (!act) {
      sfx('soft', true);
      k2Do(hostRef.current, 'dead');
      if (ph === 0) { setPh(1); sayNow(c.dead, 'think'); }
      return;
    }
    sfx('win', true);
    if (act === 'like') setLikes((x) => x + 1);
    setTimeout(() => k2Do(hostRef.current, act), 40);
    if (ph === 2) {
      busy.current = true;
      setTimeout(() => {
        busy.current = false;
        setPh(3); put({ done: true });
        log({ screenId: 's4', type: 'pick-act', correct: true, firstTry: true, attempts: 2, hints: 0, depth: 0, act });
        sayNow(c.ok, 'cheer');
      }, 1000);
    }
  };
  const choose = (k, btn) => {
    if (ph < 1 || k === act) return;
    sfx('pop', true);
    const cta = hostRef.current && hostRef.current.querySelector('.c17-doc .m-cta');
    k2Wire(btn, cta, '#FACC15', () => {
      sfx('ok', true);
      const b2 = hostRef.current && hostRef.current.querySelector('.c17-doc .m-cta');
      if (b2 && !reduceMotion()) b2.animate([{ boxShadow: '0 0 0 0 rgba(250, 204, 21, .9)' }, { boxShadow: '0 0 0 14px rgba(250, 204, 21, 0)' }], { duration: 800 });
    });
    setAct(k); store.set('act', k);
    if (ph === 1) { setPh(2); sayNow(c.chosen, 'smile'); }
  };
  const ring = ph === 0 || ph === 2 ? ['.cta { outline: 3px solid #FA4F28; outline-offset: 5px; }'] : [];
  const site = mySite(pick, { topic: st.topic, theme: st.theme, likes: act === 'like' ? likes : 0, extra: ring });
  const askText = ph >= 3 ? c.askDone : c.asks[Math.min(ph, 2)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene a1-scene k2-side">
          <div className="kz-col a1-left">
            <div className={'k2-card k2-brain' + (ph === 1 ? ' is-ready' : '')}>
              <div className="k2-head"><span className={'k2-dot' + (act ? ' is-js' : ' is-off')} aria-hidden="true" /><b>{pick(c.head)}</b></div>
              <div className="k2-acts">
                {K2_ACTS.map((k, i) => (
                  <button key={k} type="button" data-k={k} className={'k2-act' + (act === k ? ' is-on' : '')} disabled={ph < 1} onClick={(e) => choose(k, e.currentTarget)} aria-pressed={act === k}>
                    <span className="k2-act-ic"><K2Ico k={k === 'like' ? 'heart' : k} size={20} /></span><span>{pick(c.acts[k])}</span>
                    <Led on={led && i === 0} />
                  </button>
                ))}
              </div>
              {ph < 1 ? <p className="k2-lock"><K2Ico k="lock" size={14} />{pick(c.locked)}</p> : null}
              <div className={'k2-sum' + (ph >= 3 ? ' is-on' : '')}><K2Ico k="js" size={18} /><b>{pick(c.eyebrow)}</b><span>=</span><b translate="no">JavaScript</b></div>
            </div>
          </div>
          <div className="kz-col a1-right k2-press" ref={hostRef} onClick={press}>
            <AiBrowser site={site} />
            {zz ? <span className="k2-zzz" style={{ left: zz.x, top: zz.y }} aria-hidden="true"><i>z</i><i>z</i><i>z</i></span> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. САМ «В интернет!» — земной шар крутится. Ученик жмёт кнопку: окно сайта сворачивается и улетает в шар, шар
// загорается, на нём выскакивают точки друзей; появляется адрес, растут просмотры и лайки, приходят отзывы, всплывают
// сердечки; на ноутбуке сайт открыт и на двух телефонах.
// =============================================================================
function K2Phone({ st, cls }) {
  const tp = K2_TOPICS[st.topic] || K2_TOPICS.game;
  const T = THEMES[st.theme] || THEMES.neon;
  return (
    <span className={'k2-phone ' + (cls || '')} aria-hidden="true">
      <span className="k2-phone-s" style={{ background: T.bg }}>
        <b style={{ color: T.a1, fontFamily: T.fD }}>{tp.logo}</b>
        <em style={{ color: T.ink, fontFamily: T.fD }}>{tp.title}</em>
        <img src={FILES[tp.img]} alt="" />
        <i style={{ background: T.btn, borderRadius: T.r === '0px' ? 0 : 8 }} />
      </span>
    </span>
  );
}
function K2Globe({ live }) {
  const land = (dx) => (
    <g transform={'translate(' + dx + ' 0)'}>
      <path d="M8 34q10-14 26-8q12 6 4 16q-10 10-24 6q-10-4-6-14z" /><path d="M52 22q14-8 26 0q8 8-2 14q-6 4-2 12q4 10-8 14q-14 2-16-12q-2-10 2-28z" />
      <path d="M96 40q12-10 30-4q14 6 6 18q-6 8-18 6q-6 10-16 4q-10-8-2-24z" /><path d="M20 74q12-6 18 4q4 10-6 16q-10 4-14-6q-2-8 2-14z" />
      <path d="M70 78q16-6 28 2q8 10-4 16q-14 6-24-4q-6-8 0-14z" /><path d="M128 76q10-4 16 4q4 8-6 12q-10 2-12-6z" />
    </g>
  );
  return (
    <svg viewBox="0 0 120 120" className={'k2-globe' + (live ? ' is-live' : '')} aria-hidden="true">
      <defs>
        <clipPath id="k2gc"><circle cx="60" cy="60" r="50" /></clipPath>
        <radialGradient id="k2gs" cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#F0F9FF" /><stop offset=".6" stopColor="#BAE6FD" /><stop offset="1" stopColor="#7DD3FC" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="57" className="k2-globe-halo" />
      <circle cx="60" cy="60" r="50" fill="url(#k2gs)" stroke="#38BDF8" strokeWidth="2" />
      <g clipPath="url(#k2gc)">
        <g className="k2-globe-land" fill="#86EFAC" stroke="#4ADE80" strokeWidth="1.2">{land(0)}{land(160)}</g>
        <g fill="none" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="1"><ellipse cx="60" cy="60" rx="50" ry="18" /><ellipse cx="60" cy="60" rx="20" ry="50" /><path d="M10 60H110" /></g>
      </g>
      <ellipse cx="42" cy="36" rx="14" ry="7" fill="#FFFFFF" opacity=".55" transform="rotate(-28 42 36)" />
      {live ? [[50, 50], [70, 56], [60, 74], [82, 42], [38, 68]].map(([x, y], i) => (
        <g key={i} className="k2-gpin" style={{ animationDelay: (0.2 + i * 0.35) + 's' }}>
          <circle cx={x} cy={y} r="6" fill="#FA4F28" opacity=".22" />
          <path d={'M' + x + ' ' + y + 'c-4-5-6-8-6-11a6 6 0 1 1 12 0c0 3-2 6-6 11z'} fill="#FA4F28" stroke="#fff" strokeWidth="1.2" />
          <circle cx={x} cy={y - 11} r="2.2" fill="#fff" />
        </g>
      )) : null}
    </svg>
  );
}
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  useEffect(() => k2Start(store), []); // eslint-disable-line react-hooks/exhaustive-deps
  const st = k2Of(store);
  const tp = K2_TOPICS[st.topic] || K2_TOPICS.game;
  const [ph, setPh] = useState(solved ? 2 : 0);   // 0 — ждём, 1 — загрузка, 2 — в интернете
  const [nC, setNC] = useState(solved ? c.comments.length : 0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken) && ph === 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const hostRef = useRef(null);
  const cardRef = useRef(null);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const later = (ms, f) => tm.current.push(setTimeout(f, ms));
  const was = useRef(solved).current;   // вернулся на готовый экран — числа сразу итоговые
  const views = useCountUp(128, ph === 2 ? (was ? 'now' : true) : false, 4200);
  const likes = useCountUp(37, ph === 2 ? (was ? 'now' : true) : false, 4600);
  const publish = () => {
    if (!canTap) return;
    sfx('pop', true); setPh(1);
    const host = hostRef.current;
    // цель — глобус; на телефоне он спрятан (размер 0) — тогда сама кнопка «В интернет»
    const card = cardRef.current, globe = card && card.querySelector('.k2-globe');
    const dst = globe && globe.getBoundingClientRect().width > 0 ? globe : card && card.querySelector('.k2-pub-btn');
    k2FlyEl(host && host.querySelector('.kz-br'), dst, { fade: true, scale: 0.12, ms: 950, arc: 40, rot: 12 });
    later(reduceMotion() ? 200 : 1700, () => {
      setPh(2); sfx('win', true); put({ done: true });
      log({ screenId: 's5', type: 'tap', correct: true, firstTry: true, attempts: 1, hints: 0, depth: 0 });
      sayNow(c.ok, 'cheer');
      [0, 1, 2, 3, 4].forEach((i) => later(300 + i * 900, () => k2Hearts(hostRef.current, 6)));
      [0, 1, 2, 3, 4].forEach((i) => later(200 + i * 350, () => sfx('tap', true)));
      c.comments.forEach((x, i) => later(1900 + i * 1300, () => { setNC(i + 1); sfx('tap', true); }));
    });
  };
  const site = mySite(pick, { topic: st.topic, theme: st.theme, url: ph === 2 ? tp.dom : 'index.html' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ph === 2 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={ph === 2 ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene k2-side">
          <div className="kz-col a1-left">
            <div className={'k2-card k2-pub is-ph' + ph} ref={cardRef}>
              {ph < 2 ? (
                <div className="k2-pub-go">
                  <div className="k2-globe-w"><K2Globe live={false} /></div>
                  <button type="button" className="kz-btn k2-pub-btn" disabled={!canTap} onClick={publish}>
                    <K2Ico k="up" size={24} /><span>{pick(ph === 1 ? c.loading : c.btn)}</span><Led on={led} />
                  </button>
                  <span className="k2-bar" aria-hidden="true"><i /></span>
                </div>
              ) : (
                <>
                  <div className="k2-pub-top">
                    <div className="k2-globe-w is-sm"><K2Globe live /></div>
                    <div className="k2-pub-meta">
                      <div className="k2-live"><span className="k2-live-dot" aria-hidden="true" /><b>{pick(c.live)}</b></div>
                      <div className="k2-addr"><K2Ico k="lock" size={14} /><b translate="no">{tp.dom}</b></div>
                    </div>
                  </div>
                  <div className="k2-stats">
                    <span className="k2-stat"><K2Ico k="eye" size={18} /><b>{views}</b><small>{pick(c.views)}</small></span>
                    <span className="k2-stat is-like"><K2Ico k="heart" size={18} /><b>{likes}</b><small>{pick(c.likes)}</small></span>
                  </div>
                  <ul className="k2-comments">
                    {c.comments.slice(0, nC).map((x, i) => (
                      <li key={i} className="k2-cm"><i className={'k2-ava k2-ava-' + i} aria-hidden="true" /><span>{pick(x)}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className={'kz-col a1-right k2-pubwin' + (ph === 1 ? ' is-up' : '') + (ph === 2 ? ' is-live' : '')} ref={hostRef}>
            <AiBrowser site={site} />
            {ph === 2 ? <><K2Phone st={st} cls="is-l" /><K2Phone st={st} cls="is-r" /></> : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// MAP. ПОКАЗ «Дорожная карта» (заказчик, 17.11.2026: «6-ой слайд… прям вау должен быть»): карта уровней как в игре.
// Сначала вся карта; камера приближается к ракете с сайтом ученика, ракета летит по извилистой дороге и оставляет
// след; планета, мимо которой она пролетела, оживает с искрами; зоны загораются под речь Коди (сайты: HTML, CSS, ИИ ·
// быстрее: Bootstrap, Tilda, Blockly · программист: JavaScript, Git/GitHub, React); в конце — кубок и конфетти, камера
// отъезжает, ракета возвращается к HTML («ты здесь»). Только светлые цвета (заказчик, 17.11.2026). Планету можно нажать.
// =============================================================================
// Цвет планеты — фирменный цвет технологии (заказчик, 17.11.2026: «внутри реакта иконка реакта… с остальными точно так же»).
const ROAD = [['html', '#E34F26', 'html', 'HTML'], ['css', '#1572B6', 'css', 'CSS'], ['ai', '#8B5CF6', 'ai', null], ['bootstrap', '#7952B3', 'grid', 'Bootstrap'],
  ['tilda', '#FF7A59', 'layout', 'Tilda'], ['blockly', '#4C97FF', 'puzzle', 'Blockly'], ['js', '#E5C700', 'js', 'JavaScript'], ['git', '#F05032', 'git', null], ['react', '#00B8D9', 'atom', 'React']];
// Значки технологий — упрощённые, узнаваемые, в фирменных цветах (у ИИ фирменного знака нет — искры).
function K2Logo({ k, size }) {
  const z = size || 34;
  const T = { fontFamily: 'Inter, "Segoe UI", Arial, sans-serif', fontWeight: 900, textAnchor: 'middle' };
  const g = {
    html: <g><path d="M5 3h30l-2.7 30.5L20 37l-12.3-3.5z" fill="#E34F26" /><path d="M20 6v28.2l9.9-2.8L32.2 6z" fill="#F06529" /><text x="20" y="27" fontSize="17" fill="#fff" style={T}>5</text></g>,
    css: <g><path d="M5 3h30l-2.7 30.5L20 37l-12.3-3.5z" fill="#1572B6" /><path d="M20 6v28.2l9.9-2.8L32.2 6z" fill="#33A9DC" /><text x="20" y="27" fontSize="17" fill="#fff" style={T}>3</text></g>,
    ai: <g><defs><linearGradient id="k2la" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset="1" stopColor="#EC4899" /></linearGradient></defs>
      <path d="M17 5c1.2 6.6 4.4 9.8 11 11-6.6 1.2-9.8 4.4-11 11-1.2-6.6-4.4-9.8-11-11 6.6-1.2 9.8-4.4 11-11z" fill="url(#k2la)" />
      <path d="M30 22c.7 3.7 2.3 5.3 6 6-3.7.7-5.3 2.3-6 6-.7-3.7-2.3-5.3-6-6 3.7-.7 5.3-2.3 6-6z" fill="url(#k2la)" opacity=".85" /></g>,
    bootstrap: <g><rect x="3" y="3" width="34" height="34" rx="9" fill="#7952B3" /><text x="20" y="28.5" fontSize="23" fill="#fff" style={T}>B</text></g>,
    tilda: <g><circle cx="20" cy="20" r="17" fill="#FF7A59" /><path d="M10.5 22.5c2.2-4.6 5.4-6 8.6-3.8 3.2 2.2 6.4.8 10.4-3.6" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" /></g>,
    blockly: <g><path d="M6 12h7a3.5 3.5 0 1 1 7 0h7v8a3.5 3.5 0 1 1 0 7v7H6v-7.5a3.5 3.5 0 1 0 0-7z" fill="#4C97FF" stroke="#3373CC" strokeWidth="1.5" strokeLinejoin="round" /><path d="M10 17h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".9" /></g>,
    js: <g><rect x="3" y="3" width="34" height="34" rx="3" fill="#F7DF1E" /><text x="25.5" y="33" fontSize="15" fill="#222" style={T}>JS</text></g>,
    git: <g><rect x="7" y="7" width="26" height="26" rx="4" transform="rotate(45 20 20)" fill="#F05032" /><path d="M15 13l5 5M20 18v9M20 18l5 5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="18" r="2.6" fill="#fff" /><circle cx="20" cy="27.5" r="2.6" fill="#fff" /><circle cx="25.5" cy="23.5" r="2.6" fill="#fff" /></g>,
    react: <g fill="none" stroke="#00B8D9" strokeWidth="2.2"><circle cx="20" cy="20" r="3.2" fill="#00B8D9" stroke="none" /><ellipse cx="20" cy="20" rx="16" ry="6.2" />
      <ellipse cx="20" cy="20" rx="16" ry="6.2" transform="rotate(60 20 20)" /><ellipse cx="20" cy="20" rx="16" ry="6.2" transform="rotate(120 20 20)" /></g>
  };
  return <svg width={z} height={z} viewBox="0 0 40 40" aria-hidden="true" className="k2-logo">{g[k] || null}</svg>;
}
const roadName = (pick, k) => { const r = ROAD.find((x) => x[0] === k); const n = C.map.names[k]; return r[3] || (typeof n === 'string' ? n : pick(n)); };
// Две раскладки мира: ноутбук (дорога волной слева направо) и телефон (сверху вниз). Последняя точка — кубок.
const MAP_L = { W: 1120, H: 520, pts: [[90, 360], [205, 250], [325, 140], [445, 240], [545, 370], [660, 280], [770, 150], [875, 250], [960, 370], [1055, 220]],
  zones: [[20, 20, 360, 480], [390, 20, 330, 480], [750, 20, 350, 480]], chips: [[190, 52], [555, 52], [925, 52]],
  clouds: [[470, 70, 1], [690, 455, 0.8], [40, 120, 0.9], [1060, 440, 0.8]] };
const MAP_P = { W: 560, H: 1010, pts: [[115, 125], [290, 175], [445, 290], [300, 395], [130, 480], [285, 580], [445, 670], [300, 765], [135, 845], [365, 890]],
  zones: [[16, 16, 528, 318], [16, 344, 528, 290], [16, 644, 528, 352]], chips: [[420, 52], [140, 376], [140, 702]],
  clouds: [[470, 140, 0.8], [90, 330, 0.7], [470, 520, 0.7], [470, 860, 0.8]] };
const ZONE_C = [['#FFF4ED', '#FDBA74'], ['#F5F3FF', '#C4B5FD'], ['#ECFEFF', '#67E8F9']];
// Гладкая дорога через точки (Catmull-Rom → кубические Безье), по отрезку на каждую пару точек.
function roadSegs(pts) {
  const P = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const out = [];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = P(i - 1), b = P(i), c = P(i + 1), d = P(i + 2);
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], c2 = [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6];
    out.push('C' + c1.map((v) => v.toFixed(1)).join(' ') + ' ' + c2.map((v) => v.toFixed(1)).join(' ') + ' ' + c.join(' '));
  }
  return out;
}
// Дорога петляет (заказчик, 17.11.2026: «дорогу можно более кривой… как собственно путь»): между соседними планетами —
// плавный изгиб, по очереди в разные стороны (дорога-змейка). at — номер точки дороги у каждой планеты.
function routeOf(pts, amp) {
  const out = [pts[0]], at = [0];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l, s = i % 2 ? 1 : -1, k = amp * Math.min(1.2, l / 150);
    [[0.5, s]].forEach(([t, sg]) => out.push([Math.round(a[0] + dx * t + nx * k * sg), Math.round(a[1] + dy * t + ny * k * sg)]));
    out.push(b); at.push(out.length - 1);
  }
  return { pts: out, at };
}
// Ракета (заказчик, 17.11.2026: «чтобы она как ракета была»): белый корпус с объёмом, красный нос и крылья, иллюминатор,
// сопло и живое пламя; полоса на корпусе — цвета наряда сайта ученика. Нос смотрит вправо — по ходу дороги.
function K2Rocket({ T }) {
  return (
    <svg width="104" height="56" viewBox="0 0 104 56" aria-hidden="true" className="k2-rk-svg">
      <defs>
        <linearGradient id="k2rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F1F5F9" /><stop offset="1" stopColor="#CBD5E1" /></linearGradient>
        <linearGradient id="k2rn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A65" /><stop offset=".5" stopColor="#FA4F28" /><stop offset="1" stopColor="#C2410C" /></linearGradient>
        <linearGradient id="k2rf" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#FEF9C3" /><stop offset=".35" stopColor="#FDE047" /><stop offset=".7" stopColor="#FB923C" /><stop offset="1" stopColor="#FB923C" stopOpacity="0" /></linearGradient>
        <radialGradient id="k2rg" cx=".35" cy=".35" r=".75"><stop offset="0" stopColor="#E0F2FE" /><stop offset=".45" stopColor="#7DD3FC" /><stop offset="1" stopColor="#0284C7" /></radialGradient>
      </defs>
      <g className="k2-rk-fire">
        <path d="M24 17 C14 17 4 22 0 28 C4 34 14 39 24 39 Z" fill="url(#k2rf)" />
        <path d="M24 21.5 C18 21.5 12 25 9 28 C12 31 18 34.5 24 34.5 Z" fill="#FFFBEB" opacity=".9" />
      </g>
      <path d="M22 20.5 H30 V35.5 H22 Q20 28 22 20.5 Z" fill="#94A3B8" />
      <path d="M36 16 L26 3.5 Q24.5 1.5 27 1.5 H33 Q35 1.5 37 3.5 L50 16 Z" fill="url(#k2rn)" stroke="#9A3412" strokeOpacity=".35" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M36 40 L26 52.5 Q24.5 54.5 27 54.5 H33 Q35 54.5 37 52.5 L50 40 Z" fill="url(#k2rn)" stroke="#9A3412" strokeOpacity=".35" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M29 15 H66 C82 15 95 21 102 28 C95 35 82 41 66 41 H29 Q26 28 29 15 Z" fill="url(#k2rb)" stroke="#94A3B8" strokeWidth="1.4" />
      <path d="M74 15.6 C86 17.4 96 22 102 28 C96 34 86 38.6 74 40.4 Q77 28 74 15.6 Z" fill="url(#k2rn)" />
      <rect x="38" y="15.4" width="6" height="25.2" fill={T.btn} opacity=".95" />
      <path d="M32 19 H70" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
      <circle cx="59" cy="28" r="8.2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.4" />
      <circle cx="59" cy="28" r="5.6" fill="url(#k2rg)" />
      <ellipse cx="57" cy="25.8" rx="2.2" ry="1.4" fill="#FFFFFF" opacity=".85" />
      <path d="M44 27 L54 27 M44 31 L50 31" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M33 41 L58 41 L50 47.5 L39 47.5 Z" fill="url(#k2rn)" opacity=".9" />
    </svg>
  );
}
function K2Cup() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 8h20v8a10 10 0 0 1-20 0z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
      <path d="M14 11H8a6 6 0 0 0 7 8M34 11h6a6 6 0 0 1-7 8" fill="none" stroke="#CA8A04" strokeWidth="2.5" />
      <path d="M21 26h6v6h-6z" fill="#FACC15" /><rect x="15" y="32" width="18" height="6" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
      <path d="M24 11l1.5 3 3.3.5-2.4 2.3.6 3.2-3-1.6-3 1.6.6-3.2-2.4-2.3 3.3-.5z" fill="#FFF" />
    </svg>
  );
}
function MapS({ p }) {
  const pick = usePick();
  const c = C.map;
  const store = useStore();
  const st = k2Of(store);
  const T = THEMES[st.theme] || THEMES.neon;
  const [rec, put] = useRec('map');
  const solved = !!(rec && rec.done);
  const N = ROAD.length + 1;   // планеты и кубок
  const [lit, setLit] = useState(solved ? N : 1);
  const [home, setHome] = useState(true);
  const [sel, setSel] = useState(null);
  // Мир: раскладка по форме окна, масштаб «вписать».
  const boxRef = useRef(null), camRef = useRef(null), rkRef = useRef(null), litRef = useRef(null), pathRef = useRef(null), segRefs = useRef([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const read = () => { const b = boxRef.current; if (b) setBox({ w: b.clientWidth, h: b.clientHeight }); };
    read();
    const t = setTimeout(read, 300);
    window.addEventListener('resize', read);
    return () => { clearTimeout(t); window.removeEventListener('resize', read); };
  }, []);
  // Раскладка — та, что крупнее в этом окне.
  const M = box.w && Math.min(box.w / MAP_P.W, box.h / MAP_P.H) > Math.min(box.w / MAP_L.W, box.h / MAP_L.H) ? MAP_P : MAP_L;
  const port = M === MAP_P;
  const fit = box.w ? Math.min(box.w / M.W, box.h / M.H) : 0;
  const RT = routeOf(M.pts, port ? 62 : 58);
  const segs = roadSegs(RT.pts);
  const d = 'M' + RT.pts[0].join(' ') + ' ' + segs.join(' ');
  // Длина дороги до каждой точки (меряется после раскладки).
  const L = useRef([0]);
  const cam = useRef({ x: 0, y: 0, z: 1 });
  const lenRef = useRef(0);   // где ракета на дороге (отдельно от камеры: setCam заменяет cam.current целиком)
  const setCam = (x, y, z, smooth) => {
    const el = camRef.current;
    if (!el) return;
    const zz = Math.max(1, z);
    const tx = Math.min(0, Math.max(M.W - M.W * zz, M.W / 2 - x * zz)), ty = Math.min(0, Math.max(M.H - M.H * zz, M.H / 2 - y * zz));
    cam.current = { x, y, z: zz };
    el.classList.toggle('is-follow', !smooth);
    el.style.transform = 'translate(' + tx.toFixed(1) + 'px, ' + ty.toFixed(1) + 'px) scale(' + zz.toFixed(3) + ')';
  };
  // Ракета летит над дорогой (всегда выше неё — без перескоков с бока на бок), нос плавно поворачивает по ходу
  // дороги (сглаживание угла), при полёте влево не переворачивается вверх ногами (заказчик, 17.11.2026: «странно летит»).
  const angRef = useRef(null);
  const setupPort = useRef(null);
  const placeRocket = (len, smooth) => {
    const path = pathRef.current, rk = rkRef.current;
    if (!path || !rk) return null;
    const total = path.getTotalLength();
    const l0 = Math.max(0, Math.min(total, len));
    const a = path.getPointAtLength(l0);
    const p1 = path.getPointAtLength(Math.max(0, l0 - 14)), p2 = path.getPointAtLength(Math.min(total, l0 + 14));
    const want = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    let ang = angRef.current;
    if (ang === null || !smooth) ang = want;
    else { const d = ((want - ang + 540) % 360) - 180; ang += d * 0.12; }
    angRef.current = ang;
    const left = Math.cos(ang * Math.PI / 180) < 0;
    const off = port ? 50 : 40;
    rk.style.transform = 'translate(' + a.x.toFixed(1) + 'px, ' + (a.y - off).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)' + (left ? ' scaleY(-1)' : '');
    if (litRef.current) litRef.current.style.strokeDasharray = l0.toFixed(1) + ' 99999';
    return a;
  };
  useLayoutEffect(() => {
    if (!fit) return;
    let acc = 0;
    const cum = [0].concat(segRefs.current.slice(0, segs.length).map((el) => { acc += el ? el.getTotalLength() : 0; return acc; }));
    L.current = RT.at.map((k) => cum[k]);
    // Окно сменило размер (подпись над картой стала в две строки и т. п.) — мир тот же: ракета и камера остаются где
    // были. Новая раскладка (ноутбук ↔ телефон) или первый раз — вся карта, ракета у HTML.
    const fresh = setupPort.current !== port;
    setupPort.current = port;
    if (fresh) { lenRef.current = 0; angRef.current = null; }
    placeRocket(lenRef.current || 0);
    if (litRef.current && litN.current >= N) litRef.current.style.strokeDasharray = L.current[N - 1] + ' 99999';
    if (fresh) setCam(M.W / 2, M.H / 2, 1, true);
  }, [fit, port]); // eslint-disable-line react-hooks/exhaustive-deps
  // Полёт ракеты по дороге: камера следует за ней, планеты оживают по пути.
  const tm = useRef([]);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; tm.current.forEach(clearTimeout); }, []);
  const litN = useRef(solved ? N : 1);
  const unlock = (i) => {
    litN.current = Math.max(litN.current, i + 1);
    setLit(litN.current);
    const el = boxRef.current && boxRef.current.querySelector('[data-i="' + i + '"] .k2-nd');
    if (el) { const r = el.getBoundingClientRect(); k2Sparks(el.ownerDocument, r.left + r.width / 2, r.top + r.height / 2, i === N - 1 ? 18 : 12); }
    if (i === N - 1) { sfx('win', true); celebrate(); } else sfx(i % 3 === 0 ? 'pop' : 'tap', true);
  };
  const fly = (toI, ms) => {
    const from = lenRef.current || 0, to = L.current[toI] || 0;
    if (reduceMotion()) { placeRocket(to); for (let i = litN.current; i <= toI; i += 1) unlock(i); lenRef.current = to; return; }
    const t0 = Date.now();
    let n = 0;
    const world = camRef.current;
    const tick = () => {
      if (!alive.current) return;
      const k = Math.min(1, (Date.now() - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const len = from + (to - from) * e;
      const pt = placeRocket(len, true);
      lenRef.current = len;
      if (pt) {
        const cx = cam.current.x + (pt.x - cam.current.x) * 0.14, cy = cam.current.y + (pt.y - cam.current.y) * 0.14;
        setCam(cx, cy, port ? 1.45 : 1.7, false);
        n += 1;
        if (n % 3 === 0 && world) {
          const dot = world.ownerDocument.createElement('i'); dot.className = 'k2-trail';
          dot.style.left = pt.x + 'px'; dot.style.top = pt.y + 'px'; dot.style.background = n % 2 ? T.btn : T.a1;
          world.appendChild(dot);
          dot.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 0.9 }, { transform: 'translate(-50%, -50%) scale(.2)', opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).onfinish = () => dot.remove();
        }
      }
      while (litN.current < N && litN.current <= toI && len >= L.current[litN.current] - 2) unlock(litN.current);
      if (k < 1) tm.current.push(setTimeout(tick, 16));
    };
    tick();
  };
  const zoomIn = () => { const q = M.pts[0]; setCam(q[0], q[1], port ? 1.45 : 1.7, true); };
  const goHome = () => {
    setHome(false);
    setCam(M.W / 2, M.H / 2, 1, true);
    tm.current.push(setTimeout(() => { if (!alive.current) return; placeRocket(0); lenRef.current = 0; if (litRef.current) litRef.current.style.strokeDasharray = L.current[N - 1] + ' 99999'; setHome(true); sfx('pop', true); }, 650));
  };
  const FLY = reduceMotion() ? 100 : 2600;
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); zoomIn(); }, wait: 1300 },
    { act: () => fly(2, FLY), wait: FLY + 200 }, { say: [{ text: c.says[0], pose: 'point' }] },
    { act: () => fly(5, FLY), wait: FLY + 200 }, { say: [{ text: c.says[1], pose: 'wonder' }] },
    { act: () => fly(N - 1, FLY + 600), wait: FLY + 900 }, { say: [{ text: c.says[2], pose: 'cheer' }] },
    { act: () => goHome(), wait: 1400 }, { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const fin = solved || demo.done;
  const zoneOn = (z) => lit > z * 3;
  const curZone = Math.max(0, Math.min(2, Math.ceil(lit / 3) - 1));
  const askText = fin ? c.askDone : lit <= 1 ? c.asks[0] : c.asks[Math.min(3, curZone + 1)];
  const cap = sel ? [roadName(pick, sel), pick(c.stops[sel])] : null;
  const h0 = M.pts[0];
  const items = ROAD.concat([['goal', '#EAB308', 'cup', null]]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet k2-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="k2-mapw">
          <div className="k2-map" ref={boxRef}>
            {fit ? (
              <div className={'k2-world' + (port ? ' is-p' : '')} style={{ width: M.W, height: M.H, left: (box.w - M.W * fit) / 2, top: (box.h - M.H * fit) / 2, transform: 'scale(' + fit + ')' }}>
                <div className="k2-cam" ref={camRef}>
                  {M.zones.map(([x, y, w, h], z) => (
                    <div key={z} className={'k2-zone' + (zoneOn(z) ? ' is-on' : '')} style={{ left: x, top: y, width: w, height: h, '--zb': ZONE_C[z][0], '--zl': ZONE_C[z][1] }} />
                  ))}
                  {M.clouds.map(([x, y, s], i) => (
                    <svg key={i} className="k2-cloud" style={{ left: x, top: y, transform: 'translate(-50%, -50%) scale(' + s + ')', animationDelay: (i * -3) + 's' }} width="120" height="56" viewBox="0 0 120 56" aria-hidden="true">
                      <path d="M24 48a18 18 0 0 1-2-36 24 24 0 0 1 44-6 20 20 0 0 1 32 12 15 15 0 0 1-2 30z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                    </svg>
                  ))}
                  <svg className="k2-road" width={M.W} height={M.H} aria-hidden="true">
                    <path d={d} className="k2-road-edge" />
                    <path d={d} className="k2-road-top" />
                    <path d={d} className="k2-road-dash" />
                    <path d={d} className="k2-road-lit" ref={litRef} style={{ stroke: T.btn }} />
                    <path d={d} ref={pathRef} fill="none" stroke="none" />
                    {segs.map((sg, i) => <path key={i} d={'M' + RT.pts[i].join(' ') + ' ' + sg} ref={(el) => { segRefs.current[i] = el; }} fill="none" stroke="none" />)}
                  </svg>
                  {M.chips.map(([x, y], z) => (
                    <span key={z} className={'k2-zchip' + (zoneOn(z) ? ' is-on' : '')} style={{ left: x, top: y, '--zl': ZONE_C[z][1] }}><em>{z + 1}</em>{pick(c.rows[z])}</span>
                  ))}
                  {items.map(([k, col, ic], i) => {
                    const [x, y] = M.pts[i];
                    const on = i < lit;
                    return (
                      <button key={k} type="button" data-k={k} data-i={i} className={'k2-pl' + (on ? ' is-on' : '') + (sel === k ? ' is-sel' : '') + (k === 'goal' ? ' is-goal' : '')}
                        style={{ left: x, top: y, '--c': col }} onClick={() => { if (k === 'goal') return; sfx('tap', true); setSel(k); }}>
                        <span className="k2-nd">{k === 'goal' ? <K2Cup /> : <K2Logo k={k} size={port ? 48 : 38} />}{k !== 'goal' ? <em>{i + 1}</em> : null}</span>
                        <b>{k === 'goal' ? pick(c.goal) : roadName(pick, k)}</b>
                        {k !== 'goal' && !port ? <small>{pick(c.stops[k])}</small> : null}
                      </button>
                    );
                  })}
                  <span className={'k2-rk' + (home ? '' : ' is-gone')} ref={rkRef} aria-hidden="true"><span className="k2-rk-in"><K2Rocket T={T} /></span></span>
                  {home && (lit <= 1 || fin) ? <span className="k2-here" style={{ left: h0[0], top: h0[1] }}>{pick(c.here)}</span> : null}
                </div>
              </div>
            ) : null}
          </div>
          <div className={'k2-cap' + (cap ? ' is-on' : '')}>
            {cap ? <><b>{cap[0]}</b><span>{cap[1]}</span></> : <span>{pick(fin ? c.tap : c.rows[curZone])}</span>}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// FIN. ВЫВОД — разгадка спора: секундомер крутится до времени ученика, значок «Меньше 5 минут!»; под речь Коди
// значки HTML, CSS и JavaScript слетаются в медаль; сайт ученика стоит на пьедестале, кнопка работает.
// =============================================================================
function K2Watch({ sec }) {
  return (
    <svg width="58" height="64" viewBox="0 0 58 64" aria-hidden="true" className="k2-watch">
      <rect x="23" y="1" width="12" height="7" rx="2" fill="#FA4F28" />
      <rect x="44" y="9" width="7" height="5" rx="2" transform="rotate(45 47 11)" fill="#FDBA74" />
      <circle cx="29" cy="36" r="25" fill="#FFFFFF" stroke="#FA4F28" strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => { const a = i * 30 * Math.PI / 180, r2 = i % 3 ? 16 : 14; return <line key={i} x1={29 + Math.sin(a) * 19} y1={36 - Math.cos(a) * 19} x2={29 + Math.sin(a) * r2} y2={36 - Math.cos(a) * r2} stroke="#94A3B8" strokeWidth={i % 3 ? 1.5 : 2.5} strokeLinecap="round" />; })}
      <line x1="29" y1="36" x2="29" y2="17" stroke="#FA4F28" strokeWidth="3" strokeLinecap="round" transform={'rotate(' + (sec * 6) + ' 29 36)'} />
      <circle cx="29" cy="36" r="3.5" fill="#FA4F28" />
    </svg>
  );
}
function K2Medal({ got, full }) {
  return (
    <span className={'k2-medal' + (full ? ' is-full' : '')} aria-hidden="true">
      <svg width="78" height="90" viewBox="0 0 78 90">
        <defs><radialGradient id="k2mg" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#FEF3C7" /><stop offset=".55" stopColor="#FCD34D" /><stop offset="1" stopColor="#F59E0B" /></radialGradient></defs>
        <path d="M20 0H35L44 30H29Z" fill="#FA4F28" /><path d="M58 0H43L34 30H49Z" fill="#0EA5E9" />
        <circle cx="39" cy="56" r="31" fill="url(#k2mg)" stroke="#D97706" strokeWidth="2" />
        <circle cx="39" cy="56" r="25" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 4" />
      </svg>
      {['html', 'css', 'js'].map((k) => (
        <span key={k} data-k={k} className={'k2-medal-s k2-medal-' + k + (got.indexOf(k) >= 0 ? ' is-on' : '')}>{got.indexOf(k) >= 0 ? <K2Logo k={k} size={20} /> : null}</span>
      ))}
    </span>
  );
}
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const st = k2Of(store);
  const tp = K2_TOPICS[st.topic] || K2_TOPICS.game;
  const [likes, setLikes] = useState(37);
  // Время сборки — от выбора темы до первого прихода на вывод (на повторном визите не растёт).
  const [t1] = useState(() => store.get('t1') || Date.now());
  useEffect(() => { if (!store.get('t1')) store.set('t1', t1); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const ms = Math.max(0, t1 - (store.get('t0') || t1));
  const [run, setRun] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRun(true), 500); return () => clearTimeout(t); }, []);
  const shown = useCountUp(ms, run ? (reduceMotion() ? 'now' : true) : false, 1800);
  const mm = Math.floor(shown / 60000), ss = Math.floor((shown % 60000) / 1000);
  const counted = run && shown >= ms;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'cheer' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  const idx = c.say.findIndex((x) => x.text === speaker.text);
  const curK = idx >= 0 ? c.say[idx].k : null;
  const ORDER = ['html', 'css', 'js'];
  const got = spoken ? ORDER : ORDER.filter((k, i) => idx >= i + 1);
  // Новый значок: копия значка из строки летит в своё гнездо медали.
  const prevGot = useRef(0);
  const rolesRef = useRef(null), medalRef = useRef(null);
  useEffect(() => {
    if (got.length <= prevGot.current) return;
    const fresh = got.slice(prevGot.current);
    prevGot.current = got.length;
    fresh.forEach((k, i) => setTimeout(() => {
      const src = rolesRef.current && rolesRef.current.querySelector('[data-role="' + k + '"] .k2-ico');
      const dst = medalRef.current && medalRef.current.querySelector('.k2-medal-' + k);
      sfx('pop', true);
      k2FlyEl(src, dst, { scale: 1.3, ms: 600, done: () => { if (dst) { const r = dst.getBoundingClientRect(); k2Sparks(dst.ownerDocument, r.left + r.width / 2, r.top + r.height / 2, 10); } } });
    }, i * 250));
    if (got.length === ORDER.length) setTimeout(() => celebrate(), 700);
  }, [got.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const hostRef = useRef(null);
  const site = mySite(pick, { topic: st.topic, theme: st.theme, url: tp.dom, likes: st.act === 'like' ? likes : 0 });
  const press = (e) => { if (!isCta(e)) return; sfx('win', true); if (st.act === 'like') setLikes((x) => x + 1); setTimeout(() => k2Do(hostRef.current, st.act), 40); };
  const ROLES = [['html', 'html', 'HTML'], ['css', 'css', 'CSS'], ['js', 'js', 'JavaScript']];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin k2-sheet">
        <div className="kz-scene a1-scene k2-side k2-finw">
          <div className="kz-col a1-left">
            <div className={'k2-score' + (curK === 'time' ? ' is-on' : '')}>
              <K2Watch sec={Math.floor(shown / 1000)} />
              <span className="k2-score-t">
                <small>{pick(c.time)}</small>
                <b>{mm}:{String(ss).padStart(2, '0')}</b>
                {counted ? <em className="k2-badge"><K2Ico k="clock" size={13} />{pick(ms < 300000 ? c.under5 : c.ready)}</em> : null}
              </span>
              <span ref={medalRef}><K2Medal got={got} full={got.length === ORDER.length} /></span>
            </div>
            <div className="kz-roles k2-roles" ref={rolesRef}>
              {ROLES.map(([k, ic, name]) => (
                <span key={k} data-role={k} className={'kz-role' + (curK === k ? ' is-on' : '')}><i aria-hidden="true" /><span><b className="k2-rb"><K2Ico k={ic} size={16} /> {name}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
          </div>
          <div className="kz-col a1-right k2-press k2-finsite" ref={hostRef} onClick={press}>
            <AiBrowser site={site} />
            <div className="k2-podium" aria-hidden="true"><span className="k2-podium-top"><b>1</b></span></div>
          </div>
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
  { id: 's2', code: 'LEVEL-1', Comp: S2 }, { id: 's3', code: 'LEVEL-2', Comp: S3 }, { id: 's4', code: 'LEVEL-3', Comp: S4 },
  { id: 's5', code: 'LEVEL-4', Comp: S5 },
  { id: 'map', code: 'SHOW', Comp: MapS },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; выбор ученика (тема, наряд, мозг) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

export default function KirishYol({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('topic') ? { type: 'intro-site', topic: store.get('topic'), theme: store.get('theme') || null, act: store.get('act') || null } : null })
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
