// ОБЩИЙ НАБОР ОБЛИКА «KODI PLAYGROUND» — облик урока 1 курса HTML, эталона (заказчик, 02.11.2026).
// Пишет в папку gen урока бумажный набор урока 1 (tools/kollazh/) с правками облика и рамку B
// (tools/bdizayn16/), чтобы любой урок курса собирался в том же облике, что урок 1:
//   import { naborPlayground } from "../problemitas17/nabor.mjs";
//   naborPlayground(join(here, "gen"));   // потом sobrat.mjs по исходнику урока
// Что пишется в gen (подключать в исходнике урока через /*@FILE:gen/…@*/, порядок — в
// .claude/skills/novyy-urok/references/etalon-playground.md, раздел «Как собрать»):
//   kollazh-kit.jsx, kollazh.css, kollazh-trans.jsx («Клубки шерсти»), kollazh-paper.jsx (без шороха),
//   kollazh-paper-data.jsx, b16-chrome.jsx (StageB — шапка, низ, панели), b16.css, p17-skin.jsx
//   (лист без бумаги, героиня, полёт дугой), p17.css (облик, шрифт Nunito встроен).
// Экраны урока 1 (kollazh-screens.jsx) и его реплики (b16-texts.jsx) — не здесь, а в build.mjs.
// Исходники tools/kollazh/ и tools/bdizayn16/ не меняются: правки — только в копиях.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const L1 = join(root, "tools/kollazh");
const B16 = join(root, "tools/bdizayn16");

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error("nabor.mjs: не найдено ровно одно место — " + what);
  return s.replace(from, to);
};

export function naborPlayground(gen) {
  mkdirSync(gen, { recursive: true });
  for (const f of ["kollazh-kit.jsx", "kollazh.css", "kollazh-trans.jsx", "kollazh-paper.jsx", "kollazh-paper-data.jsx"]) {
    let s = readFileSync(join(L1, f), "utf8");
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

  // Рамка B урока 16 (StageB даёт экрану облик p17) и облик p17.
  let chrome = readFileSync(join(B16, 'b16-chrome.jsx'), 'utf8');
  chrome = must(chrome, "    <div className={'stage b-stage'", "    <div style={p17Tone(screen)} className={'stage b-stage p17'", 'StageB');
  // Лист узнаёт номер экрана — свой мотив фигур на «афише».
  chrome = must(chrome, '  const speaking = useSayBusy();\n  useEffect(() => { _hintText = hint', '  _p17Scr = screen || 0;\n  const speaking = useSayBusy();\n  useEffect(() => { _hintText = hint', 'StageB screen');
  writeFileSync(join(gen, 'b16-chrome.jsx'), chrome);
  writeFileSync(join(gen, 'b16.css'), readFileSync(join(B16, 'b16.css'), 'utf8'));
  writeFileSync(join(gen, 'p17-skin.jsx'), readFileSync(join(here, 'p17-skin.jsx'), 'utf8'));
  // Шрифт Nunito (SIL OFL) — урезанные woff2 из образца, встроены в CSS: урок не грузит ничего снаружи.
  const font = (file, w) => "@font-face { font-family: 'Nunito'; font-weight: " + w + "; font-display: swap; src: url(data:font/woff2;base64,"
    + readFileSync(join(here, 'fonts', file)).toString('base64') + ") format('woff2'); }";
  writeFileSync(join(gen, 'p17.css'), must(readFileSync(join(here, 'p17.css'), 'utf8'), '/*@P17_FONTS@*/',
    font('nunito-semibold.woff2', '400 700') + '\n' + font('nunito-black.woff2', '800 1000'), 'fonts'));
}
