// =============================================================================
// ЧАСТИ ИНТЕРФЕЙСА TILDA урока 5 «Цвета и шрифты»: страница сайта клуба с темой (цвет заголовков, текста, фона, кнопки,
// шрифт), страница проекта, «Настройки сайта» с разделами «Цвета и стили» (кружки цвета, палитра с «Сохраненные цвета»)
// и «Шрифты» (карусель пар «Заголовки / Текст» с «Выбрать»), «Настройки» блока → «КНОПКА» (цвет текста и фона).
// Всё — по настоящей Tilda (сверка 26.11.2026, docs/tilda-redaktor-zametki.md). Фото клуба и обложка — из урока 4
// (../tilda4/tl4-parts.jsx: TFoto, TCover4, TPanTop). Шрифты Tilda показаны похожими системными, подписаны настоящими именами.
// =============================================================================

const TL5 = {
  siteSet: TW('Настройки сайта', 'Website settings'), close: TW('Закрыть', 'Close'), saveChg: TW('Сохранить изменения', 'Save changes'),
  newPage: TW('Создать новую страницу', 'Create new page'), pages: TW('Страницы сайта:', 'Site pages:'), home: TW('Главная', 'Home'),
  tabs: { main: TW('Главное', 'General'), domain: TW('Домен', 'Domain'), homepg: TW('Главная страница', 'Home page'), hf: TW('Шапка и подвал', 'Header and footer'),
    fonts: TW('Шрифты', 'Fonts'), colors: TW('Цвета и стили', 'Colors and styles'), an: TW('Аналитика', 'Analytics'), seo: TW('SEO', 'SEO') },
  colorsNote: TW('Заданные цвета автоматически подключатся к текущим и новым блокам.', 'The colors you set will apply to current and new blocks automatically.'),
  colorsH: TW('Цвета', 'Colors'),
  rows: { h: TW('ЦВЕТ ЗАГОЛОВКОВ', 'TITLE COLOR'), t: TW('ЦВЕТ ТЕКСТА', 'TEXT COLOR'), l: TW('ЦВЕТ ССЫЛОК', 'LINK COLOR'), bg: TW('ЦВЕТ ФОНА СТРАНИЦЫ', 'PAGE BACKGROUND COLOR') },
  saved: TW('Сохраненные цвета', 'Saved colors'),
  heads: TW('Заголовки:', 'Titles:'), body: TW('Текст:', 'Text:'), choose: TW('Выбрать', 'Choose'), chosen: TW('Выбрано', 'Chosen'),
  sizeH: TW('Размер и насыщенность', 'Size and weight'),
  bw: TW('ШИРИНА БЛОКА', 'BLOCK WIDTH'), cols: TW('8 колонок', '8 columns'),
  secs: { btn: TW('КНОПКА', 'BUTTON'), typo: TW('ТИПОГРАФИКА', 'TYPOGRAPHY'), anim: TW('АНИМАЦИЯ', 'ANIMATION') },
  blockBg: TW('ЦВЕТ ФОНА ДЛЯ ВСЕГО БЛОКА', 'BACKGROUND COLOR FOR THE WHOLE BLOCK'),
  presets: TW('ПРЕСЕТЫ', 'PRESETS'), styles: TW('СТИЛИ', 'STYLES'),
  kind: TW('ВИД', 'TYPE'), kindV: TW('Кнопка', 'Button'), size: TW('РАЗМЕР', 'SIZE'), sizeV: TW('(M) Стандартный', '(M) Standard'),
  fg: TW('ЦВЕТ ТЕКСТА', 'TEXT COLOR'), bg: TW('ЦВЕТ ФОНА', 'BACKGROUND COLOR'), border: TW('ОБВОДКА', 'BORDER'), radius: TW('СКРУГЛЕНИЕ', 'ROUNDING')
};
// Цвета палитры («Сохраненные цвета»).
const PAL = { blue: '#1E3A8A', orange: '#F97316', cream: '#FFF7ED', yellow: '#FDE68A', pink: '#EC4899', gray: '#D1D5DB', white: '#FFFFFF', black: '#111111' };
const RAINBOW = ['#FDE047', '#A7F3D0', '#F9A8D4', '#BFDBFE', '#FDBA74', '#C4B5FD'];
// Шрифты (порядок карусели — как в Tilda, подмножество). Файлов шрифтов в уроке нет — похожие системные.
const FONT_ORDER = ['tilda', 'roboto', 'montserrat', 'playfair', 'oswald', 'comfortaa', 'code'];
const FONTS = {
  tilda: { n: 'Tilda Sans', f: 'var(--tl-f, var(--r-font))', w: 700 },
  roboto: { n: 'Roboto', f: 'Roboto, "Helvetica Neue", Arial, sans-serif', w: 500 },
  montserrat: { n: 'Montserrat', f: 'Montserrat, "Avenir Next", Futura, "Century Gothic", "Trebuchet MS", sans-serif', w: 800, ls: '-.01em' },
  playfair: { n: 'Playfair Display', f: '"Playfair Display", Didot, "Bodoni 72", Georgia, "Times New Roman", serif', w: 700, i: true },
  oswald: { n: 'Oswald', f: 'Oswald, Impact, "Arial Narrow Bold", "Arial Narrow", sans-serif', w: 700, up: true },
  // Comfortaa — тонкий круглый: на чужих системах тонким разрежённым шрифтом, чтобы не путать с плотным Montserrat.
  comfortaa: { n: 'Comfortaa', f: 'Comfortaa, "Varela Round", Nunito, ui-rounded, "Trebuchet MS", Verdana, sans-serif', w: 400, ls: '.07em' },
  code: { n: 'Source Code Pro', f: '"Source Code Pro", ui-monospace, Menlo, Consolas, monospace', w: 600 }
};
const fontCss = (k) => { const F = FONTS[k] || FONTS.tilda; return { fontFamily: F.f, fontWeight: F.w, fontStyle: F.i ? 'italic' : 'normal', textTransform: F.up ? 'uppercase' : 'none', letterSpacing: F.ls || 'normal' }; };
const fontBody = (k) => ({ fontFamily: (FONTS[k] || FONTS.tilda).f });
// Тема сайта: цвета и шрифт. TH0 — как в Tilda по умолчанию.
const TH0 = { h: '#111111', t: '#222222', bg: '#FFFFFF', btnBg: null, btnFg: '#000000', font: 'tilda' };
const th5 = (o) => Object.assign({}, TH0, o || {});

// Кружок цвета (пустой — в клетку).
function TSw({ c, big }) {
  return <i className={'tl5-sw' + (big ? ' is-big' : '') + (c ? '' : ' is-none')} style={c ? { background: c } : undefined} aria-hidden="true" />;
}
// Слово в шрифте.
function TFontWord({ k, word, cls }) {
  return <span className={'tl5-fw' + (cls ? ' ' + cls : '')} style={fontCss(k)}>{word}</span>;
}

// Страница сайта клуба с темой. rainbow — каждый блок своим цветом (ошибка Коди).
function TBody5({ b, th, pick, rainbow, i }) {
  const hs = Object.assign({ color: th.h }, fontCss(th.font));
  if (b.k === 'cover') {
    return (
      <section className="tl4-cov tl5-cov">
        <TFoto k="club" cls="tl4-cov-bg" />
        <i className="tl4-cov-f" style={{ background: 'rgba(0,0,0,.6)' }} aria-hidden="true" />
        <div className="tl4-plate"><h1 className="tl4-h" style={fontCss(th.font)}>RoboKlub</h1><p className="tl4-p" style={fontBody(th.font)}>{pick(PAGE5.sub)}</p></div>
      </section>
    );
  }
  if (b.k === 'title') return <div className="tl2-tl"><h2 className={'tl2-h tl3-h tl5-h' + (b.flash ? ' is-flash' : '')} style={hs}>{pick(PAGE5.title)}</h2></div>;
  if (b.k === 'text') return <p className="tl2-tx tl4-tx tl5-tx" style={Object.assign({ color: th.t }, fontBody(th.font))}>{String(pick(PAGE5.text)).split('||').map((t, j) => (j % 2 ? <b key={j}>{t}</b> : <span key={j}>{t}</span>))}</p>;
  if (b.k === 'img') return <div className="tl4-imgw"><TFoto k="club" cls="tl4-img" /></div>;
  if (b.k === 'button') {
    const bs = th.btnBg ? { background: th.btnBg, color: th.btnFg, borderColor: th.btnBg } : { color: th.btnFg };
    return <div className="tl3-btnw"><span className={'tl3-btn tl5-btn' + (b.flash ? ' is-flash' : '')} style={Object.assign(bs, fontBody(th.font), { fontWeight: 700 })}>{pick(PAGE5.btn)}</span></div>;
  }
  return null;
}
function TPage5({ blocks, th, sel, onSel, onSettings, setLed, lite, rainbow }) {
  const pick = usePick();
  return (
    <div className="tl2-page tl5-page" style={{ background: th.bg }}>
      {blocks.map((b, i) => {
        const on = sel === b.u;
        return (
          <div key={b.u} data-b={b.u} data-k={b.k} className={'tl2-b is-' + b.k + (on ? ' is-sel' : '') + (onSel ? ' is-pick' : '')}
            style={rainbow && b.k !== 'cover' ? { background: RAINBOW[i % RAINBOW.length] } : undefined}
            onClick={onSel ? () => onSel(b.u) : undefined}>
            <TBody5 b={b} th={th} pick={pick} rainbow={rainbow} i={i} />
            {on ? (
              <div className="tl2-tb" onClick={(e) => e.stopPropagation()}>
                <span className="tl2-tbl">
                  <span className="tl-chip tl2-id">{b.id} ▾</span>
                  <button type="button" data-t="settings" className={'tl-chip tl2-set tl3-cbtn tl4-sbtn' + (setLed ? ' is-led' : '')} disabled={!onSettings} onClick={onSettings || undefined}>⚙<span className="tl2-w"> {pick(TL.settings)}</span></button>
                  <span className="tl-chip is-content">✎<span className="tl2-w"> {pick(TL.content)}</span></span>
                </span>
                {lite ? null : <span className="tl2-tbr">{TOOLS.map((t) => <span key={t} className="tl2-tool"><TIco k={t} /></span>)}</span>}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// Страница проекта: название, «Настройки сайта», «+ Создать новую страницу», список страниц.
function TProj5({ onSet, setLed }) {
  const pick = usePick();
  return (
    <div className="tl5-proj kz-a-drop" translate="no">
      <div className="tl5-proj-band">
        <b>RoboKlub</b>
        <span className="tl5-proj-btns">
          <button type="button" data-t="siteset" className={'tl5-pj-set' + (setLed ? ' is-led' : '')} disabled={!onSet} onClick={onSet || undefined}>⚙ {pick(TL5.siteSet)}</button>
          <span className="tl5-pj-new">+ {pick(TL5.newPage)}</span>
        </span>
      </div>
      <div className="tl5-proj-pages"><em>{pick(TL5.pages)}</em><span><i aria-hidden="true">⌂</i>{pick(TL5.home)}</span></div>
    </div>
  );
}

// «Настройки сайта»: вверху путь и «Закрыть» / «Сохранить изменения»; слева разделы; справа содержимое раздела.
// На телефоне — либо список разделов, либо раздел с «‹».
const SET_TABS = ['main', 'domain', 'homepg', 'hf', 'fonts', 'colors', 'an', 'seo'];
function TSiteSet({ tab, onTab, tabLed, onSave, saveLed, children }) {
  const pick = usePick();
  return (
    <div className={'tl5-set kz-a-drop' + (tab ? ' is-tab' : '')} translate="no">
      <div className="tl5-set-top">
        <span className="tl5-set-path"><span>{pick(TL.mySites)}</span> / <span>RoboKlub</span> / <b>{pick(TL5.siteSet)}</b></span>
        <span className="tl5-set-btns">
          <span className="tl5-set-close">{pick(TL5.close)}</span>
          <button type="button" data-t="savechg" className={'tl5-set-save' + (saveLed ? ' is-led' : '')} disabled={!onSave} onClick={onSave || undefined}>{pick(TL5.saveChg)}</button>
        </span>
      </div>
      <div className="tl5-set-in">
        <div className="tl5-set-menu">
          {SET_TABS.map((k) => (
            <button key={k} type="button" data-v={'tab-' + k} className={'tl5-set-mi' + (tab === k ? ' is-on' : '') + (tabLed === k ? ' is-led' : '')} disabled={!onTab} onClick={onTab ? () => onTab(k) : undefined}>{pick(TL5.tabs[k])}</button>
          ))}
        </div>
        <div className="tl5-set-body">
          {tab ? <span className="tl5-set-back">‹ {pick(TL5.tabs[tab])}</span> : null}
          {children}
        </div>
      </div>
    </div>
  );
}

// Палитра: квадрат оттенков, полоса цветов, HEX, «Сохраненные цвета» — кнопки-кружки с подписью.
function TPicker({ val, pal, onPick, bad }) {
  const pick = usePick();
  const ref = useRef(null);
  // Палитра открылась у нижней строки — окно настроек само докручивается, чтобы были видны все цвета.
  useEffect(() => {
    const t = setTimeout(() => {
      const el = ref.current; const box = el && el.closest('.tl5-set-body, .tl4-pan');
      if (!box) return;
      const a = box.getBoundingClientRect(), b = el.getBoundingClientRect();
      if (b.bottom > a.bottom - 6) box.scrollTop += Math.min(b.bottom - a.bottom + 10, b.top - a.top - 6);
    }, 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="tl5-pick kz-a-drop" ref={ref} onClick={(e) => e.stopPropagation()}>
      <span className="tl5-pick-sq" style={{ background: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ' + (val || '#FA4F28') + ')' }} aria-hidden="true" />
      <span className="tl5-pick-hue" aria-hidden="true" />
      <span className="tl5-pick-hex"><em>HEX ▾</em><b>{val ? val.toLowerCase() : '#000000'}</b></span>
      <span className="tl5-pick-sv">{pick(TL5.saved)} ▾</span>
      <span className="tl5-pick-row">
        {pal.map((n) => (
          <button key={n} type="button" data-v={'c-' + n} className={'tl5-pick-c' + (bad === n ? ' is-bad' : '')} disabled={!onPick} onClick={onPick ? () => onPick(n) : undefined}>
            <TSw c={PAL[n]} big /><span>{pick(COLOR_N[n])}</span>
          </button>
        ))}
        <span className="tl5-pick-plus" aria-hidden="true">+</span>
      </span>
    </div>
  );
}
// «Цвета и стили»: четыре цвета сайта; open — открытая палитра у строки.
function TColors({ vals, open, onSw, swLed, pal, onPick, bad }) {
  const pick = usePick();
  return (
    <div className="tl5-colors">
      <p className="tl5-note">{pick(TL5.colorsNote)}</p>
      <b className="tl5-h3">{pick(TL5.colorsH)}</b>
      <div className="tl5-crows">
        {['h', 't', 'l', 'bg'].map((k) => (
          <div key={k} className={'tl5-crow' + (open === k ? ' is-open' : '')}>
            <span className="tl5-lab">{pick(TL5.rows[k])}</span>
            <button type="button" data-t={'sw-' + k} className={'tl5-cfield' + (swLed === k ? ' is-led' : '')} disabled={!onSw} onClick={onSw ? () => onSw(k) : undefined}>
              <TSw c={vals[k]} /><span>{(vals[k] || '#000000').toLowerCase()}</span>
            </button>
            {open === k ? <TPicker val={vals[k]} pal={pal} onPick={onPick} bad={bad} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
// «Шрифты»: карусель пар шрифтов.
function TFonts({ i, chosen, onPrev, onNext, onChoose, nextLed, chooseLed, bad, word }) {
  const pick = usePick();
  const k = FONT_ORDER[i];
  const F = FONTS[k];
  return (
    <div className="tl5-fonts">
      <div className="tl5-fcar">
        <button type="button" data-t="prev" className="tl5-farr" disabled={!onPrev} onClick={onPrev || undefined} aria-label="‹">‹</button>
        <div key={k} className={'tl5-fcard kz-a-drop' + (bad === k ? ' is-bad' : '')}>
          <span className="tl5-fprev"><b style={fontCss(k)}>{word || F.n}</b><span style={fontBody(k)}>Every Saturday we build robots and learn to program them together.</span></span>
          <span className="tl5-fbar">
            <span className="tl5-fnames"><span>{pick(TL5.heads)} <b>{F.n}</b></span><span>{pick(TL5.body)} <b>{F.n}</b></span></span>
            <button type="button" data-t="choose" className={'tl5-fchoose' + (chosen === k ? ' is-on' : '') + (chooseLed ? ' is-led' : '')} disabled={!onChoose || chosen === k} onClick={onChoose ? () => onChoose(k) : undefined}>{pick(chosen === k ? TL5.chosen : TL5.choose)}</button>
          </span>
        </div>
        <button type="button" data-t="next" className={'tl5-farr' + (nextLed ? ' is-led' : '')} disabled={!onNext} onClick={onNext || undefined} aria-label="›">›</button>
      </div>
      <span className="tl5-fdots" aria-hidden="true">{FONT_ORDER.map((x, j) => <i key={x} className={j === i ? 'is-on' : ''} />)}</span>
      <b className="tl5-h3 tl5-hide-s">{pick(TL5.sizeH)}</b>
    </div>
  );
}

// «Настройки» блока кнопки: список разделов; раздел «КНОПКА» — вид, размер, цвет текста и фона, обводка, скругление.
function TBlockSet5({ sec, onSec, secLed, vals, open, onSw, swLed, pal, onPick, bad, onSave, saveLed }) {
  const pick = usePick();
  const swRow = (k, label) => (
    <div className={'tl5-brow' + (open === k ? ' is-open' : '')}>
      <span className="tl5-lab">{pick(label)}</span>
      <button type="button" data-t={'bsw-' + k} className={'tl5-cfield' + (swLed === k ? ' is-led' : '')} disabled={!onSw} onClick={onSw ? () => onSw(k) : undefined}>
        <TSw c={vals[k]} /><span>{vals[k] ? vals[k].toLowerCase() : ''}</span>
      </button>
      {open === k ? <TPicker val={vals[k]} pal={pal} onPick={onPick} bad={bad} /> : null}
    </div>
  );
  return (
    <div className="tl3-cnt tl4-pan tl5-bset kz-a-drop" translate="no" onClick={(e) => e.stopPropagation()}>
      <TPanTop onSave={onSave} led={saveLed} />
      <div className="tl3-cnt-body tl4-pan-body">
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL5.bw)}</span><b>{pick(TL5.cols)}</b></label>
        {['btn', 'typo', 'anim'].map((k) => (
          <React.Fragment key={k}>
            <button type="button" data-v={'sec-' + k} className={'tl5-sec' + (sec === k ? ' is-on' : '') + (secLed === k ? ' is-led' : '')} disabled={!onSec} onClick={onSec ? () => onSec(k) : undefined}>
              {pick(TL5.secs[k])}<i aria-hidden="true">{sec === k ? '‹' : '›'}</i>
            </button>
            {k === 'btn' && sec === 'btn' ? (
              <div className="tl5-bbox kz-a-drop">
                <span className="tl5-bbox-h"><b>{pick(TL5.secs.btn)}</b><em>{pick(TL5.presets)}</em><em>{pick(TL5.styles)}</em></span>
                <span className="tl5-brow is-dim tl4-hide-s"><span className="tl5-lab">{pick(TL5.kind)}</span><b>{pick(TL5.kindV)}</b></span>
                <span className="tl5-brow is-dim tl4-hide-s"><span className="tl5-lab">{pick(TL5.size)}</span><b>{pick(TL5.sizeV)}</b></span>
                {swRow('fg', TL5.fg)}
                {swRow('bg', TL5.bg)}
                <span className="tl5-brow is-dim tl4-hide-s"><span className="tl5-lab">{pick(TL5.border)}</span><b>#000000</b></span>
              </div>
            ) : null}
          </React.Fragment>
        ))}
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL5.blockBg)}</span><b>{' '}</b></label>
      </div>
    </div>
  );
}

// Схема сайта для сравнения (s7): цвета темы или радуга.
function TMini5({ th, rainbow }) {
  const bg = (i) => (rainbow ? RAINBOW[i % RAINBOW.length] : th.bg);
  return (
    <span className="tl5-mini" aria-hidden="true">
      <i className="is-cov" />
      <span className="tl5-mini-b" style={{ background: bg(0) }}><i className="is-h" style={{ background: rainbow ? '#7C3AED' : th.h }} /></span>
      <span className="tl5-mini-b" style={{ background: bg(1) }}><i /><i className="is-s" /></span>
      <span className="tl5-mini-b" style={{ background: bg(2) }}><i /><i className="is-s" /></span>
      <span className="tl5-mini-b" style={{ background: bg(3) }}><i className="is-btn" style={{ background: rainbow ? '#22C55E' : th.btnBg || '#fff' }} /></span>
    </span>
  );
}

// Сайт друга с тремя ошибками (s11): бледный подзаголовок, заголовок другим (рукописным) шрифтом, блоки радугой.
function TFix5({ fixed, onTap, flash }) {
  const pick = usePick();
  const tap = (k) => (onTap ? () => onTap(k) : undefined);
  return (
    <div className="tl5-fix" translate="no">
      <div className="tl5-fix-top" style={{ background: '#1E3A8A' }}><b style={fontCss('montserrat')}>GOL</b><span>⚽</span></div>
      <button type="button" data-v="fx-font" className={'tl5-fx tl5-fix-h' + (fixed.font ? ' is-fixed' : '') + (flash === 'font' ? ' is-flash' : '')} onClick={tap('font')}
        style={fixed.font ? fontCss('montserrat') : { fontFamily: '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive', fontWeight: 400, fontStyle: 'italic' }}>
        {pick(C.s11.site.title)}
      </button>
      <button type="button" data-v="fx-pale" className={'tl5-fx tl5-fix-sub' + (fixed.pale ? ' is-fixed' : '') + (flash === 'pale' ? ' is-flash' : '')} onClick={tap('pale')}
        style={{ color: fixed.pale ? '#374151' : '#FDE68A' }}>{pick(C.s11.site.sub)}</button>
      <div className="tl5-fix-blocks">
        {[0, 1, 2].map((i) => (
          <button key={i} type="button" data-v={'fx-rainbow' + i} className={'tl5-fx tl5-fix-b' + (fixed.rainbow ? ' is-fixed' : '') + (flash === 'rainbow' ? ' is-flash' : '')} onClick={tap('rainbow')}
            style={{ background: fixed.rainbow ? '#F3F4F6' : ['#F472B6', '#4ADE80', '#A78BFA'][i] }}>
            <b style={fontCss('montserrat')}>{pick(C.s11.site.blocks[i])}</b>
          </button>
        ))}
      </div>
      <button type="button" data-v="fx-good" className="tl5-fx tl5-fix-btn" onClick={tap('good')} style={fontBody('montserrat')}>{pick(C.s11.site.btn)}</button>
    </div>
  );
}
