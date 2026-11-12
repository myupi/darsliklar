// =============================================================================
// УРОК 7 МОДУЛЯ «ИИ» «Как улучшить результат ИИ?» — СИМУЛЯТОР ВТОРОГО ПРОМПТА (12.11.2026). Без JSX: чистые функции
// поверх aiSite (tools/ai1/ai1-kit.jsx); экраны — ai7-screens.jsx. Урок 8 (финальный) может подключить этот файл.
//
// Второй (третий …) промпт — короткая правка готового сайта: «tugmani kattaroq qil, qolganini o'zgartirma».
// fixOf(text) разбирает правку:
//   · что меняем и как: блок (qo'sh / olib tashla), цвет сайта, кнопка (kattaroq, kichikroq, цвет), заголовок,
//     шрифт, телефон (номер из строки), Telegram, лишнее (окно, скидка, чат — olib tashla);
//   · «что» без «как» («tugmani o'zgartir», «rangini o'zgartir») — ИИ угадывает сам (метка «Taxmin»);
//   · «yaxshiroq qil», «qaytadan yarat» — ИИ не знает, что улучшать;
//   · «qolganini o'zgartirma» (остальное не меняй) — keep.
// fixSite(pick, pr0, fixes) — сайт после первого промпта pr0 (семь строк) и правок по очереди. Без keep ИИ пишет сайт
// заново: свой главный цвет, обратный порядок блоков, своё название (метки «O'zi o'zgartirdi»). Правка меняет
// строки промпта внутри симулятора (блок дописывается в «Ichida nima?», цвет — первым в «Ko'rinishi?», телефон и
// лишнее — в «Qoidalar?») или добавляет CSS (кнопка, заголовок). pr0.css — свой CSS первого сайта (маленькая кнопка,
// маленький заголовок — то, что ученик будет чинить).
// =============================================================================

const P_LBL = (n) => fillL(L3('{n}-prompt', 'Промпт {n}', 'Prompt {n}'), { n: String(n) });
const DRIFT_L = L3("O'zi o'zgartirdi", 'Сам поменял', 'Changed by itself');
// Названия, которые ИИ придумывает, когда пишет сайт заново.
const DRIFT_T = [
  L3("{t} — eng zo'r tanlov!", '{t} — лучший выбор!', '{t} — the best choice!'),
  L3('{t} — siz kutgan joy!', '{t} — то, что ты искал!', '{t} — just what you wanted!'),
  L3('{t}: hammasi siz uchun!', '{t}: всё для тебя!', '{t}: all for you!')
];
const RE_KEEP = /qolgan\S*\s+(?:\S+\s+){0,2}(?:o'zgartirma|o'zgarmasin|o'zgartirilmasin|tegma|qolsin|saqla)|boshqa\s+(?:hech\s+)?(?:narsa|joy|narsalar)\S*\s+(?:\S+\s+){0,1}(?:o'zgartirma|o'zgarmasin|tegma)|hech\s+narsani?\s+o'zgartirma|остальн\S*\s+(?:\S+\s+){0,2}(?:не\s+меня|не\s+трога|не\s+измен|остав|без\s+измен)|(?:больше|другое|другого)\s+ничего\s+не|ничего\s+(?:больше|другого|ещё|еще)\s+не|(?:keep|leave)\s+(?:the\s+rest|everything\s+else|all\s+else|the\s+others?|other\s+things)|(?:don't|do\s+not|dont)\s+(?:change|touch)\s+(?:anything|the\s+rest|everything\s+else|other)|nothing\s+else/;
const RE_FIX_VAGUE = /yaxshiroq|yaxshila|chiroyliroq|zo'rroq|zo'r qil|chiroyli qil|boshqatdan|qaytadan|yangidan|qayta yarat|qayta qil|hammasini o'zgartir|лучше|красивее|улучш|заново|передела|по-другому|по другому|better|nicer|prettier|improve|redo|again|from scratch|start over|remake/;
const FX_BTN = /tugma|knopka|кнопк|button/;
const FX_TITLE = /sarlavha|заголов|title|heading/;
const FX_FONT = /shrift|harf|шрифт|font/;
const FX_COLW = /(^|\s)rang|цвет|colou?r/;
const FX_DEL = /olib tashla|olib qo'y|o'chir|kerak emas|bo'lmasin|yo'q qil|ketsin|olinsin|убер|удал|не нужн|(^|\s)без(\s|$)|remove|delete|get rid|take (?:out|off|away)|(^|\s)no(\s|$)|(^|\s)drop/;
const FX_ADD = /qo'sh|qo'y|kerak|bo'lsin|добав|постав|нужн|пусть|верни|(^|\s)add|(^|\s)put|include|need/;
const FX_BIG = /kattaroq|kattalashtir|katta|yirik|больш|крупн|увелич|bigger|larger|(^|\s)big|enlarge|huge/;
const FX_SMALL = /kichikroq|kichraytir|kichik|меньш|уменьш|smaller|(^|\s)small/;
const FX_PHW = /telefon|raqam|телефон|номер|phone|number/;
// Слова, которыми симулятор дописывает строки промпта (их узнают insOf, lookOf, rulesOf на любом языке урока).
const COL_TOK = { orange: "to'q sariq", red: 'qizil', blue: "ko'k", green: 'yashil', yellow: 'sariq', pink: 'pushti', purple: 'binafsha', gold: 'oltin', brown: 'jigarrang', black: 'qora', gray: 'kulrang', white: 'oq' };
const BLK_TOK = { menu: 'menyu', gallery: 'rasmlar', prices: 'narxlar', reviews: 'sharhlar', schedule: 'jadval', team: 'ustozlar', faq: 'savol-javob', rules: 'qoidalar', contact: 'aloqa', about: 'biz haqimizda' };
const DRIFT_COL = ['purple', 'blue', 'red', 'green', 'pink', 'orange'];
const segsOf = (s) => String(s || '').split(/\s*(?:,|;|\s(?:va|и|and)\s)\s*/).map((x) => x.trim()).filter(Boolean);
const mainColOf = (look) => { const lk = lookOf(look); const c = lk && lk.colors.find((x) => x.k !== 'white'); return c ? c.k : null; };
const colorIn = (s) => LOOK_COLORS.find((x) => x.re.test(s)) || null;

function fixOf(text) {
  const src = String(text || '').replace(/[‘’ʻʼ`]/g, "'").replace(/[“”«»„]/g, '"').trim();
  if (!src) return null;
  let low = lowAll(src);
  const keep = RE_KEEP.test(low);
  low = low.replace(new RegExp(RE_KEEP.source, 'g'), ' ');
  const cl = low.split(/[,;.!?\n]+|\s(?:va|и|and|hamda)\s/).map((s) => ' ' + s.trim() + ' ').filter((s) => s.trim()).map((s) => {
    const pm = s.match(RE_PHONE);
    const o = { s, ph: pm ? pm[0].trim() : null, tg: /telegram|телеграм/.test(s), phw: FX_PHW.test(s) };
    o.del = FX_DEL.test(s); o.add = !o.del && FX_ADD.test(s);
    o.big = FX_BIG.test(s); o.small = !o.big && FX_SMALL.test(s);
    o.col = colorIn(s);
    o.ex = RL_ITEMS.slice(0, 3).filter((it) => it[1].test(s)).map((it) => it[0]);
    o.tgt = o.tg || o.ex.length ? null : FX_BTN.test(s) ? 'btn' : FX_TITLE.test(s) ? 'title' : FX_FONT.test(s) ? 'font' : FX_COLW.test(s) ? 'color' : null;
    o.blk = o.ph || o.tg || o.ex.length || o.tgt ? [] : BLOCKS.filter((b) => b.re.test(s) && !(b.k === 'contact' && o.phw)).map((b) => b.k);
    o.vague = RE_FIX_VAGUE.test(s);
    return o;
  });
  // «tugmani kattaroq va qizil qil»: часть без своей цели берёт цель соседа слева.
  let lastT = null;
  cl.forEach((o) => {
    if (!o.tgt && !o.blk.length && !o.ex.length && !o.ph && !o.tg && (o.col || o.big || o.small) && lastT) o.tgt = lastT;
    if (o.tgt) lastT = o.tgt;
  });
  // «narxlar va sharhlar blokini qo'sh», «chat va chegirmani olib tashla»: действие — у соседа (справа, потом слева).
  cl.forEach((o, i) => {
    if (o.del || o.add || (!o.blk.length && !o.ex.length)) return;
    const d = cl.slice(i + 1).find((x) => x.del || x.add) || cl.slice(0, i).reverse().find((x) => x.del || x.add);
    if (d) { o.del = d.del; o.add = d.add; }
  });
  const ch = [], guess = [];
  let vague = false;
  cl.forEach((o) => {
    if (o.ph) { ch.push({ k: 'phone', v: o.ph }); return; }
    if (o.tg) { if (!o.del) ch.push({ k: 'tg' }); return; }
    if (o.ex.length) { if (o.del) o.ex.forEach((x) => ch.push({ k: 'no', v: x })); return; }
    if (o.tgt === 'btn' || o.tgt === 'title') {
      const T = o.tgt === 'btn' ? 'btn' : 'title';
      if (o.col) ch.push({ k: T + 'Color', c: o.col });
      if (o.big) ch.push({ k: T + 'Big' });
      if (o.small) ch.push({ k: T + 'Small' });
      if (!o.col && !o.big && !o.small) guess.push(T);
      return;
    }
    if (o.tgt === 'font') { if (o.big) ch.push({ k: 'fontBig' }); else guess.push('font'); return; }
    if (o.blk.length) { o.blk.forEach((b) => ch.push({ k: o.del ? 'del' : 'add', b })); return; }
    if (o.col) { ch.push({ k: 'color', c: o.col }); return; }
    if (o.tgt === 'color') { guess.push('color'); return; }
    if (o.phw && !o.del) { ch.push({ k: 'phone', v: null }); return; }
    if (o.vague) vague = true;
  });
  const isVague = vague && !ch.length && !guess.length;
  return { ch, guess, keep, vague: isVague, none: !ch.length && !guess.length && !isVague, text: src };
}
const fxHas = (f, k, x) => !!(f && f.ch.some((c) => c.k === k && (x === undefined || c.b === x || c.v === x || (c.c && c.c.k === x))));

// CSS правок: свой у каждой; позже в списке — сильнее (как в настоящем CSS).
const FX_CSS = {
  btnBig: ['.cta { font-size: 24px; padding: 20px 48px; border-radius: 16px; }', '@media (max-width: 600px) { .cta { font-size: 21px; padding: 17px 36px; } }'],
  btnSmall: ['.cta { font-size: 12px; padding: 6px 12px; }'],
  titleBig: ['.title { font-size: 62px; }', '@media (max-width: 600px) { .title { font-size: 44px; } }'],
  titleSmall: ['.title { font-size: 22px; }', '@media (max-width: 600px) { .title { font-size: 18px; } }'],
  // Догадки ИИ: «что» есть, «как» нет.
  gBtn: ['.cta { background-color: #111827; color: #FDE047; border-radius: 0; transform: rotate(-4deg); }'],
  gTitle: ['.title { font-family: "Courier New", monospace; letter-spacing: 3px; }'],
  gFont: ['body { font-family: "Courier New", monospace; }']
};
const inkOn = (c) => (c.k === 'white' || c.k === 'yellow' || c.k === 'gold' ? '#111827' : 'white');

function fixStep(stt, f, n) {
  const mk = { chg: [], drift: [], guess: [], n };
  if (!f) return Object.assign({}, stt, { mk });
  const pr = Object.assign({}, stt.pr);
  const css = stt.css.slice();
  let title = stt.title;
  const any = f.ch.length || f.guess.length || f.vague;
  const addRule = (r) => { pr.rules = (String(pr.rules || '').trim() ? pr.rules + ', ' : '') + r; };
  // Без «qolganini o'zgartirma» ИИ пишет сайт заново: свой главный цвет, обратный порядок блоков, своё название.
  if (any && !f.keep) {
    const d = stt.drifts;
    const cur = mainColOf(pr.look);
    const free = DRIFT_COL.filter((k) => k !== cur);
    pr.look = COL_TOK[free[d % free.length]] + ', ' + (pr.look || '');
    mk.drift.push('.badge');
    const sg = segsOf(pr.inside);
    if (sg.length > 1) { pr.inside = sg.reverse().join(', '); mk.drift.push('.bh0'); }
    if (!f.ch.some((c) => /^title/.test(c.k))) { title = DRIFT_T[d % DRIFT_T.length]; mk.drift.push('.title'); }
  }
  f.ch.forEach((c) => {
    if (c.k === 'add') {
      const ins = insOf(pr.inside);
      if (!ins || !ins.blocks.some((b) => b.k === c.b)) pr.inside = (String(pr.inside || '').trim() ? pr.inside + ', ' : '') + BLK_TOK[c.b];
      mk.chg.push('blk:' + c.b);
    }
    if (c.k === 'del') { const b = BLOCKS.find((x) => x.k === c.b); pr.inside = segsOf(pr.inside).filter((s) => !b.re.test(lowAll(s))).join(', '); }
    if (c.k === 'color') { pr.look = COL_TOK[c.c.k] + ', ' + (pr.look || ''); mk.chg.push('.badge'); }
    if (c.k === 'btnBig' || c.k === 'btnSmall' || c.k === 'titleBig' || c.k === 'titleSmall') { css.push(...FX_CSS[c.k]); mk.chg.push(/^btn/.test(c.k) ? '.cta' : '.title'); }
    if (c.k === 'btnColor') { css.push('.cta { background-color: ' + c.c.c + '; color: ' + inkOn(c.c) + '; }'); mk.chg.push('.cta'); }
    if (c.k === 'titleColor') { css.push('.title { color: ' + c.c.c + '; }'); mk.chg.push('.title'); }
    if (c.k === 'fontBig') { pr.look = (pr.look || '') + ', katta shrift'; mk.chg.push('.title'); }
    if (c.k === 'phone') {
      const re = new RegExp(RE_PHONE.source, 'g');
      pr.rules = String(pr.rules || '').replace(re, ' ');
      pr.inside = String(pr.inside || '').replace(re, ' ');
      addRule('majburiy: telefon ' + (c.v || ''));
      if (c.v) mk.chg.push('.info'); else mk.guess.push('.gsR');
    }
    if (c.k === 'tg') { addRule('majburiy: Telegram tugmasi'); mk.chg.push('.tg'); }
    if (c.k === 'no') addRule({ popup: "reklama oynasi bo'lmasin", sale: "chegirma bo'lmasin", chat: "chat bo'lmasin" }[c.v]);
  });
  f.guess.forEach((g) => {
    if (g === 'btn') { css.push(...FX_CSS.gBtn); mk.guess.push('.cta'); }
    if (g === 'title') { css.push(...FX_CSS.gTitle); mk.guess.push('.title'); }
    if (g === 'font') { css.push(...FX_CSS.gFont); mk.guess.push('.title'); }
    if (g === 'color') { const cur = mainColOf(pr.look); pr.look = (cur === 'purple' ? 'qora' : 'binafsha') + ', ' + (pr.look || ''); mk.guess.push('.badge'); }
  });
  // «Yaxshiroq qil, qolganini o'zgartirma»: ИИ не знает, что улучшать, — меняет что-то своё по мелочи.
  if (f.vague && f.keep) { css.push(...FX_CSS.gTitle); mk.guess.push('.title'); }
  return { pr, css, title, drifts: stt.drifts + (any && !f.keep ? 1 : 0), mk };
}
const mapEls = (els, fn) => els.map((e) => { const x = fn(e); return x.kids ? Object.assign({}, x, { kids: x.kids.map((k) => (typeof k === 'string' ? k : mapEls([k], fn)[0])) }) : x; });
// Сайт после первого промпта и правок по очереди (пустые — пропускаются).
function fixSite(pick, pr0, fixes) {
  const base = Object.assign({}, pr0);
  delete base.css;
  let stt = { pr: base, css: (pr0.css || []).slice(), title: null, drifts: 0, mk: null };
  (fixes || []).filter((x) => x && x !== MISS).forEach((t, i) => { stt = fixStep(stt, fixOf(t), i + 2); });
  const site = aiSite(pick, stt.pr);
  const title = stt.title ? pick(fillL(stt.title, { t: site.title })) : site.title;
  const els = stt.title ? mapEls(site.els, (e) => (e.k === 'h1' ? Object.assign({}, e, { text: title }) : e)) : site.els;
  return Object.assign({}, site, { title, els, css: site.css.concat(stt.css), fx: stt.mk, pr: stt.pr });
}
const blkSel = (site, k) => {
  const bl = site.ins ? site.ins.blocks.slice(0, site.rules && site.rules.max ? site.rules.max : 99) : [];
  const i = bl.findIndex((b) => b.k === k);
  return i >= 0 ? '.bh' + i : null;
};
// Метки последней правки: «N-prompt» — что изменил ученик, «O'zi o'zgartirdi» — что ИИ поменял сам, «Taxmin» — догадка.
const fixPins = (site) => {
  const mk = site.fx;
  if (!mk) return [];
  const out = [];
  mk.chg.forEach((s) => { const sel = s.indexOf('blk:') === 0 ? blkSel(site, s.slice(4)) : s; if (sel) out.push({ sel, q: P_LBL(mk.n), cls: 'is-fix', top: sel === '.info' }); });
  mk.drift.forEach((s) => out.push({ sel: s, q: DRIFT_L, cls: 'is-drift' }));
  mk.guess.forEach((s) => out.push({ sel: s, q: TAXMIN, cls: 'is-guess' }));
  return out.filter((x, i) => out.findIndex((y) => y.sel === x.sel) === i);
};
// Куда прокрутить окно: к тому, что изменилось; если ИИ поменял всё сам — к верху сайта (цвет и название).
const fixFocus = (site) => {
  if (site.fx && site.fx.drift.length) return '.nav';
  const p = fixPins(site).find((x) => x.cls === 'is-fix') || fixPins(site)[0];
  // Название, плашка, кнопка — в баннере: окно к верху сайта, иначе метка над названием упирается в край окна.
  return p ? (/^\.(title|badge|cta)$/.test(p.sel) ? '.nav' : p.sel) : null;
};
