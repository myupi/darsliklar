// Сборка тестового урока 17 (30.10.2026): урок 16 «B · O'yin» как есть — реплики, экраны,
// шапка и низ рамки B (tools/bdizayn16/) — в стилистике образца заказчика «Kodi playground»
// (kodi-html-code.zip): тёплый фон, Nunito, мягкие карточки с нажимной тенью, плюшевый
// человечек с мехом из векторных штрихов, спокойное движение. Бумажного стиля нет.
//   node tools/problemitas17/build.mjs
// Исходники урока 1 (tools/kollazh/) и урока 16 (tools/bdizayn16/) не меняются: их копии
// с правками ложатся в tools/problemitas17/gen/. Что меняется в копиях:
//   · всё, что меняет урок 16 (StageB, KzAsk → панели, английские слова в речи);
//   · палитра набора KZ — цвета серии; Sheet — «афиша» с крупными фигурами, PaperMan —
//     плюшевый персонаж (оба — p17-skin.jsx, прежние переименованы);
//   · Cut: содержимое вырезки — отдельным слоем поверх «материала», чтобы мех
//     (фильтр #p17fur) не размывал глаза и надписи;
//   · StageB даёт экрану цвет клякс (p17Tone) — шапка и низ рамки не меняются;
//   · переход между экранами — p17-trans.jsx вместо kollazh-trans.jsx; шороха бумаги нет;
//   · ступеньки stop-motion в CSS набора и в полётах экранов — плавные;
//   · к CSS добавляется p17.css.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const L1 = join(root, 'tools/kollazh');
const B16 = join(root, 'tools/bdizayn16');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

for (const f of readdirSync(L1)) {
  if (!/^kollazh.*\.(jsx|css)$/.test(f) || f === 'kollazh.src.jsx') continue;
  let s = readFileSync(f === 'kollazh-screens.jsx' ? join(B16, 'b16-screens.jsx') : join(L1, f), 'utf8');
  if (f === 'kollazh-screens.jsx') {
    s = s.replace(/<Stage(\s)/g, '<StageB$1').replace(/<\/Stage>/g, '</StageB>');
    // Куски браузера, летящие в персонажа (экран 1) и из тела в окно (экран 8): без рваного края,
    // мягкими «таблетками», в цветах плюшевого персонажа, полёт плавный с пружинкой в конце.
    s = must(s, "clipPath: pc.round ? null : torn(pc.seed, 6, 2.5, Math.max(0.2, Math.min(5, g.w / Math.max(1, g.h)))),", 'clipPath: null,', 'morph clip');
    s = must(s, "borderRadius: pc.round ? (fly ? (pc.fade ? '6px' : '50%') : '6px 6px 0 0') : null,", "borderRadius: fly ? (pc.fade ? '12px' : '999px') : '14px',", 'morph radius');
    s = must(s, "const st = fly ? 'steps(9, end)' : 'steps(2, end)';", "const st = fly ? 'cubic-bezier(.5, 0, .2, 1.18)' : 'ease-out';", 'morph timing');
    // Экран 1, браузер → человечек: куски берут цвета нового браузера (как Chrome в Windows: серая
    // полоса, белая панель и вкладка) и летят в настоящие контуры частей человечка-школьника
    // (p17MorphBox в p17-skin.jsx), а не в их прямоугольники с запасом; вкладка с названием —
    // розовой капсулой туда, где она покажется под крышкой головы.
    s = must(s, "{ k: 'legL', c0: KZ.ink, c: KZ.ink,", "{ k: 'legL', c0: '#DEE1E6', c: '#C6B18D',", 'morph legL');
    s = must(s, "{ k: 'legR', c0: KZ.ink, c: KZ.ink,", "{ k: 'legR', c0: '#DEE1E6', c: '#C6B18D',", 'morph legR');
    s = must(s, "{ k: 'armL', c0: '#E6DCC6', c: KZ.ink,", "{ k: 'armL', c0: '#FFFFFF', c: '#7C90D9',", 'morph armL');
    s = must(s, "{ k: 'armR', c0: '#E6DCC6', c: KZ.ink,", "{ k: 'armR', c0: '#FFFFFF', c: '#7C90D9',", 'morph armR');
    s = must(s, "{ k: 'head', c0: KZ.ink, c: KZ.face,", "{ k: 'head', c0: '#DEE1E6', c: '#F1B48D',", 'morph head');
    s = must(s, "{ k: 'body', c0: KZ.cream, c: KZ.teal,", "{ k: 'body', c0: KZ.cream, c: '#6F84CD',", 'morph body');
    s = must(s, "{ k: 'name', c0: '#E6DCC6', c: '#E6DCC6',", "{ k: 'name', c0: '#FFFFFF', c: '#F7A3CB',", 'morph name');
    s = must(s, "const to = (el) => ({ x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,",
      "const to = (el) => p17MorphBox(el, { x: M.left - S.left + el.offsetLeft, y: M.top - S.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight,", 'morph to');
    s = must(s, "      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });\n    const half",
      "      r: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0 });\n    const half", 'morph to end');
    s = must(s, "to: { x: head.x + head.w * 0.18, y: head.y + head.h * 0.36, w: head.w * 0.64, h: head.h * 0.26, r: -4 }",
      "to: p17NameBox(part('head'), { x: M.left - S.left, y: M.top - S.top })", 'morph name to');
    s = s.replace(/steps\(\d+, end\)/g, 'cubic-bezier(.45, 0, .2, 1.1)');
    // Переход «Клубки шерсти» катится в сторону шага: «Дальше» — вправо, «Назад» — влево.
    s = must(s, 'next: go(R.next), prev: R.i > 0 ? go(R.prev) : null', 'next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null', 'go dir');
    // Экран 8 (body): в строке на листе — коротко, длинную фразу Коди говорит голосом
    // (заказчик, 30.10.2026: «многовато текста, для человечка мало места»).
    s = must(s, '<KzAsk text={out ? c.done : c.ask} />', '<KzAsk text={out ? P17_S9_DONE : c.ask} />', 's9 ask');
    // Бирка body на человечке — посреди живота (верх тела спрятан под головой), а не у рта.
    s = must(s, 'setLbl({ body: { x: m.B.left - m.S.left + m.B.width / 2, y: m.B.top - m.S.top },',
      'setLbl({ body: { x: m.B.left - m.S.left + m.B.width / 2, y: m.B.top - m.S.top + m.B.height * 0.48 },', 's9 body label');
  }
  if (f === 'kollazh-kit.jsx') {
    // Как в уроке 16 (tools/bdizayn16/build.mjs).
    s = must(s,
      "function KzAsk({ text, hint, n }) {\n  const pick = usePick();\n  return (\n    <div className=\"kz-ask-wrap\">\n      <p className={'kz-ask' + (hint ? ' is-hint' : '')} aria-live=\"polite\">\n        {n ? <span className=\"kz-ask-n\">{n}</span> : null}{pick(hint || text)}",
      "function KzAsk({ text, hint, n, err }) {\n  const pick = usePick();\n  const ts = text ? pick(text) : '', hs = hint ? pick(hint) : '', er = !!(hs && err);\n  useEffect(() => { if (_bAskSet) _bAskSet({ text: ts, hint: hs, err: er }); }, [ts, hs, er]);\n  return (\n    <div className=\"kz-ask-wrap\">\n      <p className=\"kz-ask\" aria-live=\"polite\">\n        {n ? <span className=\"kz-ask-n\">{n}</span> : null}{ts}",
      'KzAsk');
    s = must(s, "  return lang === 'uz' ? kzTagWord(out) : out;", "  return b16EnWords(lang === 'uz' ? kzTagWord(out) : out, lang);", 'spokenHtml');
    // Палитра образца «Kodi playground»: коралл, жёлтый, мятный, тёмно-синий.
    s = must(s, "const KZ = { kraft: '#D8C4A1', paper: '#EFE7D6', face: '#F2D7BC', cream: '#FBF6EA', coral: '#E0643F', mustard: '#F0B13F', teal: '#2A8C7E', ink: '#1F2A44' };",
      "const KZ = { kraft: '#F3F5FA', paper: '#FFFFFF', face: '#FFD563', cream: '#FFFFFF', coral: '#FF6957', mustard: '#FFD563', teal: '#77DCB8', ink: '#162038' };", 'KZ');
    // Лист — из p17-skin.jsx.
    s = must(s, 'function Sheet({ children, cls }) {', 'function SheetPaper({ children, cls }) {', 'Sheet');
    // Содержимое вырезки — поверх материала, а не внутри него.
    s = must(s, '<span className="kz-cut-in" style={{ background: c, clipPath: cp, WebkitClipPath: cp }}>{children}</span>',
      '<span className="kz-cut-in" style={{ background: c, clipPath: cp, WebkitClipPath: cp }} />{children != null && children !== false ? <span className="kz-cut-ct">{children}</span> : null}', 'Cut');
    // Персонаж — из p17-skin.jsx (плюшевый, те же части и метки).
    s = must(s, 'function PaperMan({', 'function PaperManPaper({', 'PaperMan');
    // Полёт капсулы на вкладку — дугой (kzFly в p17-skin.jsx).
    s = must(s, 'function kzFly(el, to, ms) {', 'function kzFlyPaper(el, to, ms) {', 'kzFly');
  }
  if (f === 'kollazh.css') {
    // Движение без ступенек stop-motion: кадровые анимации идут плавно по своим кадрам,
    // переходы — пружинкой. Мигание курсора в поле — как было.
    s = s.split('\n').map((ln) => (/kzCaret/.test(ln) ? ln
      : ln.replace(/steps\(1, end\)/g, 'linear').replace(/steps\(\d+, end\)/g, 'cubic-bezier(.34, 1.4, .64, 1)'))).join('\n');
  }
  if (f === 'kollazh-trans.jsx') {
    // Переход между экранами — свой, «пузырь и желе» (p17-trans.jsx), а не бумажный «разбор и сборка».
    s = readFileSync(join(here, 'p17-trans.jsx'), 'utf8');
  }
  if (f === 'kollazh-paper.jsx') {
    // Бумаги нет — шороха тоже.
    s = must(s, 'function paperOn() {\n  clearTimeout(_pp.stopT);\n', 'function paperOn() {\n  clearTimeout(_pp.stopT);\n  if (P17_QUIET) return;   // урок 17: без шороха бумаги\n', 'paperOn');
    s = 'const P17_QUIET = true;\n' + s;
  }
  writeFileSync(join(gen, f), s);
}

// Файлы урока 16 — копии в gen/ (StageB даёт экрану цвет клякс).
let chrome = readFileSync(join(B16, 'b16-chrome.jsx'), 'utf8');
chrome = must(chrome, "    <div className={'stage b-stage'", "    <div style={p17Tone(screen)} className={'stage b-stage p17'", 'StageB');
// Лист узнаёт номер экрана — свой мотив фигур на «афише».
chrome = must(chrome, '  const speaking = useSayBusy();\n  useEffect(() => { _hintText = hint', '  _p17Scr = screen || 0;\n  const speaking = useSayBusy();\n  useEffect(() => { _hintText = hint', 'StageB screen');
writeFileSync(join(gen, 'b16-chrome.jsx'), chrome);
writeFileSync(join(gen, 'b16-texts.jsx'), readFileSync(join(B16, 'b16-texts.jsx'), 'utf8'));
writeFileSync(join(gen, 'b16.css'), readFileSync(join(B16, 'b16.css'), 'utf8'));
writeFileSync(join(gen, 'p17-skin.jsx'), readFileSync(join(here, 'p17-skin.jsx'), 'utf8'));
// Шрифт Nunito (SIL OFL) — урезанные woff2 из образца, встроены в CSS: урок не грузит ничего снаружи.
const font = (file, w) => "@font-face { font-family: 'Nunito'; font-weight: " + w + "; font-display: swap; src: url(data:font/woff2;base64,"
  + readFileSync(join(here, 'fonts', file)).toString('base64') + ") format('woff2'); }";
writeFileSync(join(gen, 'p17.css'), must(readFileSync(join(here, 'p17.css'), 'utf8'), '/*@P17_FONTS@*/',
  font('nunito-semibold.woff2', '400 700') + '\n' + font('nunito-black.woff2', '800 1000'), 'fonts'));

let src = readFileSync(join(L1, 'kollazh.src.jsx'), 'utf8');
src = must(src, "lessonId: 'html-01-struktura-dokumenta'", "lessonId: 'test-17-problemitas'", 'lessonId');
src = must(src, "uz: '1-dars. HTML hujjatining tuzilishi',\n    ru: 'Урок 1. Структура HTML-документа',\n    en: 'Lesson 1. HTML document structure'",
  "uz: '17. «Kodi playground» uslubi (1-dars)',\n    ru: '17. Стиль «Kodi playground» (урок 1)',\n    en: '17. “Kodi playground” style (lesson 1)'", 'lessonTitle');
src = must(src, '/*@L2_HELPERS@*/', '/*@FILE:b16-texts.jsx@*/\n\n/*@L2_HELPERS@*/', 'texts');
src = must(src, '/*@FILE:kollazh-paper-data.jsx@*/', '/*@FILE:b16-chrome.jsx@*/\n\n/*@FILE:p17-skin.jsx@*/\n\n/*@FILE:kollazh-paper-data.jsx@*/', 'chrome');
src = must(src, '/*@FILE:kollazh.css@*/', '/*@FILE:kollazh.css@*/\n/*@FILE:b16.css@*/\n/*@FILE:p17.css@*/', 'css');
src = '// СГЕНЕРИРОВАНО tools/problemitas17/build.mjs из tools/kollazh/ и tools/bdizayn16/ — не править руками.\n' + src;
const srcOut = join(gen, 'p17.src.jsx');
writeFileSync(srcOut, src);

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, 'lessons/test/17-problemitas.jsx')], { stdio: 'inherit' });
