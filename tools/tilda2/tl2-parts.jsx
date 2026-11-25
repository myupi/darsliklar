// =============================================================================
// ЧАСТИ ИНТЕРФЕЙСА TILDA урока 2 «Блоки»: страница из нескольких блоков, панель выбранного блока (шифр, «Настройки»,
// «Контент»; копировать, удалить, выключить, ▾, ↑, ↓), чёрный «+» под блоком, библиотека с разделами Заголовок, Текстовый
// блок, Изображение, отмена ↶ в верхней полосе. Всё — по настоящей Tilda (сверка 24–25.11.2026, docs/tilda-redaktor-zametki.md):
// удаление без вопроса, ↶ возвращает блок. Части урока 1 (TCover, TRecBar, TDock …) — из ../tilda1/tl1-parts.jsx.
// =============================================================================

// Карточки библиотеки по разделам (номер — место раздела в TL.cats). Тексты блоков — английские, как у Tilda по умолчанию.
const LIB2 = {
  2: [
    { id: 'TL01', k: 'title', d: TW('Заголовок', 'Title'), t: 'Main Title' },
    { id: 'TL02', k: 'title', d: TW('Заголовок с описанием', 'Title with description'), t: 'Main Title', s: 'A short line under the title' },
    { id: 'TL03', k: 'title', d: TW('Заголовок с линией', 'Title with a line'), t: 'Main Title', line: true }
  ],
  3: [
    { id: 'TX01', k: 'text', d: TW('Текст', 'Text'), t: 'Tell people about your project: who you are, what you do and why it matters.' },
    { id: 'TX02', k: 'text', d: TW('Текст крупным шрифтом', 'Large text'), t: 'Tell people about your project: who you are, what you do and why it matters.', big: true },
    { id: 'QT01', k: 'quote', d: TW('Цитата с фото автора', 'Quote with author photo') }
  ],
  4: [
    { id: 'IM01', k: 'img', d: TW('Изображение на всю ширину', 'Full-width image') },
    { id: 'IM02', k: 'img', d: TW('Изображение с подписью', 'Image with a caption'), cap: 'Our first robot' }
  ]
};
const CAT_TITLE = 2, CAT_TEXT = 3, CAT_IMG = 4;
const cardOf = (id) => [].concat(LIB2[2], LIB2[3], LIB2[4]).find((c) => c.id === id) || null;
// Блок страницы из карточки библиотеки: u — свой ключ блока на странице.
const blockOf = (card, u, extra) => Object.assign({ u: u, k: card.k, id: card.id, t: card.t, s: card.s, line: card.line, big: card.big, cap: card.cap }, extra || {});
const COVER_B = { u: 'c', k: 'cover', id: 'CR28' };

// Значки панели блока и верхней полосы (свой рисунок; как в Tilda: два листа, корзина, кнопка питания, стрелки).
function TIco({ k }) {
  const s = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (k === 'copy') return <svg {...s}><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></svg>;
  if (k === 'del') return <svg {...s}><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5" /></svg>;
  if (k === 'off') return <svg {...s}><path d="M12 3v8" /><path d="M6.6 6.6a8 8 0 1 0 10.8 0" /></svg>;
  if (k === 'more') return <svg {...s}><path d="M7 10l5 5 5-5" /></svg>;
  if (k === 'up') return <svg {...s}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
  if (k === 'down') return <svg {...s}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
  if (k === 'undo') return <svg {...s}><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></svg>;
  if (k === 'redo') return <svg {...s}><path d="M15 14l5-5-5-5" /><path d="M20 9H10a6 6 0 0 0 0 12h3" /></svg>;
  return null;
}
const TOOLS = ['copy', 'del', 'off', 'more', 'up', 'down'];

// Окно редактора урока 2: та же полоса, что в уроке 1, но ↶ ↷ — настоящие кнопки (видны и на телефоне).
function TEd2({ project, children, onUndo, undoLed, undoOff, onRedo, cls }) {
  const pick = usePick();
  return (
    <div className={'tl-ed tl2-ed' + (cls ? ' ' + cls : '')} translate="no">
      <div className="tl-top">
        <span className="tl-crumb" data-part="path"><i className="tl-home" aria-hidden="true" /><span className="tl-w tl-ms">{pick(TL.mySites)}</span><span>/</span><b>{project}</b><span className="tl-pg">/ {pick(TL.page)} ▾</span></span>
        <span className="tl-dev" aria-hidden="true"><i className="is-ph" /><i className="is-pc" /></span>
        <span className="tl-acts">
          <span className="tl2-ur">
            <button type="button" data-t="undo" className={'tl2-u' + (undoLed ? ' is-led' : '')} disabled={!onUndo || undoOff} onClick={onUndo || undefined} aria-label={pick(TL2.undo)}><TIco k="undo" /></button>
            <button type="button" data-t="redo" className="tl2-u" disabled={!onRedo} onClick={onRedo || undefined} aria-label={pick(TL2.redo)}><TIco k="redo" /></button>
          </span>
          <span className="tl-act" data-part="preview"><span className="tl-w">{pick(TL.preview)}</span><i className="tl-ico is-play" aria-label={pick(TL.preview)} /></span>
          <span className="tl-act is-pub"><span className="tl-w">{pick(TL.publish)}</span><i className="tl-ico is-cloud" aria-hidden="true" /></span>
          <span className="tl-act is-more"><span className="tl-w">{pick(TL.more)} ▾</span><i className="tl-ico is-menu" aria-hidden="true" /></span>
        </span>
      </div>
      <div className="tl-canvas tl2-canvas" data-part="page">{children}</div>
    </div>
  );
}

// Содержимое блока по виду.
function TBlockBody({ b, cover, onText, editing, edit }) {
  const pick = usePick();
  if (b.k === 'cover') return <TCover id="CR28" title={cover.t} sub={pick(cover.p)} />;
  if (b.k === 'title') {
    return (
      <div className="tl2-tl">
        <h2 className="tl2-h">{b.t}</h2>
        {b.line ? <i className="tl2-line" aria-hidden="true" /> : null}
        {b.s ? <p className="tl2-sub">{b.s}</p> : null}
      </div>
    );
  }
  if (b.k === 'text') {
    if (editing) return <div className={'tl2-tx' + (b.big ? ' is-big' : '')}>{edit}</div>;
    if (onText) return <button type="button" className={'tl2-tx is-tap' + (b.big ? ' is-big' : '')} data-t="text" onClick={(e) => { e.stopPropagation(); onText(); }}>{b.t}</button>;
    return <p className={'tl2-tx' + (b.big ? ' is-big' : '')}>{b.t}</p>;
  }
  if (b.k === 'img') {
    return (
      <div className="tl2-imgw">
        <div className="tl2-img" aria-hidden="true"><i className="tl2-sun" /><i className="tl2-m1" /><i className="tl2-m2" /><i className="tl2-bot" /></div>
        {b.cap ? <p className="tl2-cap">{b.cap}</p> : null}
      </div>
    );
  }
  return null;
}

// Страница из блоков. sel — ключ выбранного блока (у него рамка, панель и «+»). lite — панель только со шифром (показ).
function TPage2({ blocks, cover, sel, onSel, onTool, onPlus, lite, gone, born, onText, editing, edit, ledTool }) {
  const pick = usePick();
  return (
    <div className="tl2-page">
      {blocks.map((b) => {
        const on = sel === b.u;
        return (
          <div key={b.u} data-b={b.u} data-k={b.k}
            className={'tl2-b is-' + b.k + (on ? ' is-sel' : '') + (b.off ? ' is-off' : '') + (gone === b.u ? ' is-gone' : '') + (born === b.u ? ' is-born' : '') + (onSel ? ' is-pick' : '')}
            onClick={onSel ? () => onSel(b.u) : undefined}>
            <TBlockBody b={b} cover={cover} onText={onText && b.k === 'text' ? onText : null} editing={editing && b.k === 'text'} edit={edit} />
            {on ? (
              <div className="tl2-tb" onClick={(e) => e.stopPropagation()}>
                <span className="tl2-tbl">
                  <span className="tl-chip tl2-id">{b.id} ▾</span>
                  <span className="tl-chip tl2-set">⚙<span className="tl2-w"> {pick(TL.settings)}</span></span>
                  <span className="tl-chip is-content">✎<span className="tl2-w"> {pick(TL.content)}</span></span>
                </span>
                {lite ? null : (
                  <span className="tl2-tbr">
                    {TOOLS.map((t) => (
                      <button key={t} type="button" data-t={t} className={'tl2-tool' + (ledTool === t ? ' is-led' : '')} disabled={!onTool || t === 'more'}
                        onClick={onTool && t !== 'more' ? () => onTool(b.u, t) : undefined} aria-label={pick(TL2[t])}><TIco k={t} /></button>
                    ))}
                  </span>
                )}
              </div>
            ) : null}
            {b.off ? <span className="tl2-offl">{pick(TL2.offL)}</span> : null}
            {on && onPlus ? <button type="button" data-t="plus" className="tl2-plus" onClick={(e) => { e.stopPropagation(); onPlus(b.u); }} aria-label={pick(TL2.plus)}>+</button> : null}
          </div>
        );
      })}
    </div>
  );
}

// Библиотека блоков урока 2: разделы слева; в выбранном разделе — карточки (Заголовок, Текстовый блок, Изображение).
function TLib2({ cat, onCat, onCard, off, flash }) {
  const pick = usePick();
  const cards = cat != null ? LIB2[cat] : null;
  return (
    <div className="tl-lib tl2-lib">
      <div className="tl-lib-l">
        <div className="tl-lib-h">{pick(TL.lib)}<span aria-hidden="true">⌕ ✕</span></div>
        <div className="tl-lib-tabs">{TL.tabs.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}>{pick(t)}</span>)}</div>
        <div className="tl-cats">
          {TL.cats.map((c, i) => (
            <button type="button" key={i} data-v={'cat' + i} disabled={off} className={'tl-cat' + (cat === i ? ' is-on' : '')}
              onClick={() => onCat && onCat(i)}>{pick(c)}</button>
          ))}
        </div>
      </div>
      {cards ? (
        <div className="tl-lib-r" key={cat}>
          {cards.map((c) => (
            <button key={c.id} type="button" className={'tl-card tl2-card' + (flash === c.id ? ' is-flash' : '')} data-v={c.id} disabled={off} onClick={() => onCard && onCard(c)}>
              <span className={'tl2-th is-' + c.k + (c.line ? ' is-line' : '') + (c.s ? ' is-sub' : '') + (c.big ? ' is-big' : '') + (c.cap ? ' is-cap' : '')} aria-hidden="true"><i /><b /><em /></span>
              <span className="tl-cap"><em>{c.id}</em>{pick(c.d)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Указатель, который сначала докручивает страницу до вещи (страница из блоков длиннее окна, особенно на телефоне).
function scrollToSel(sel) {
  const el = sel && document.querySelector('.tl-groot ' + sel);
  const box = el && el.closest && el.closest('.tl2-page');
  if (!el || !box) return;
  const a = box.getBoundingClientRect(), b = el.getBoundingClientRect();
  if (b.top < a.top + 4) box.scrollTop -= (a.top + 4 - b.top) + 30;
  else if (b.bottom > a.bottom - 4) box.scrollTop += (b.bottom - (a.bottom - 4)) + 30;
}
function usePoint2(G, sel, on) {
  useEffect(() => {
    if (!on || !sel) return undefined;
    scrollToSel(sel);
    const t = setTimeout(() => scrollToSel(sel), 260);
    return () => clearTimeout(t);
  }, [sel, on]);
  usePoint(G, sel, on);
}
