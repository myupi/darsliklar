// =============================================================================
// ЧАСТИ ИНТЕРФЕЙСА TILDA урока 3 «Блоки Text и Button»: страница из блоков с видами текста (заголовок, лид, текст абзацами,
// цитата) и кнопкой; слово текста нажимается — над блоком панель стиля (B, I, U, S, ссылка, цвет, размер — как правка на месте
// в настоящей Tilda, docs/tilda-redaktor-zametki.md); библиотека с разделами «Текстовый блок» и «Кнопка» (BF101 бесплатный,
// остальные с замком); панель «Контент» кнопки (поле текста кнопки, «Сохранить и закрыть»).
// Окно редактора, значки, указатель и докрутка — из урока 2 (../tilda2/tl2-parts.jsx), обложка — из урока 1.
// «Контент» кнопки BF101 и шифры платных кнопок с живой Tilda не сверены (25.11.2026: аккаунт вышел).
// =============================================================================

// Слова интерфейса урока 3.
const TL3 = {
  fmt: { b: TW('Жирный', 'Bold'), i: TW('Курсив', 'Italic'), u: TW('Подчёркнутый', 'Underline'), s: TW('Зачёркнутый', 'Strikethrough'),
    link: TW('Ссылка', 'Link'), color: TW('Цвет', 'Color'), size: TW('Размер', 'Size') },
  btnText: TW('НАЗВАНИЕ КНОПКИ', 'BUTTON TITLE'),
  btnLink: TW('ССЫЛКА', 'LINK'),
  cards: TW('КАРТОЧКИ', 'CARDS'), card1: TW('КАРТОЧКА #1', 'CARD #1'), newWin: TW('В новом окне', 'In a new window'),
  pg: TW('Страница', 'Page'), blk: TW('Блок', 'Block'), addEl: TW('ДОБАВИТЬ ЭЛЕМЕНТ', 'ADD ELEMENT'),
  save: TW('Сохранить', 'Save'),
  saveClose: TW('Сохранить и закрыть', 'Save and close'),
  paid: TW('Доступно на платном тарифе', 'Available on a paid plan')
};
const CAT_TXT3 = 3, CAT_BTN3 = 7;
// Карточки библиотеки урока 3 (номер — место раздела в TL.cats).
const LIB3 = {
  3: [
    { id: 'TX01', k: 'text', d: TW('Текст', 'Text') },
    { id: 'TX02', k: 'lead', d: TW('Лид', 'Lead') },
    { id: 'QT01', k: 'quote', d: TW('Цитата с фото автора', 'Quote with author photo') }
  ],
  7: [
    { id: 'BF101', k: 'button', d: TW('Кнопка', 'Button') },
    { id: 'BF102', k: 'button', d: TW('Две или три кнопки', 'Two or three buttons'), lock: true },
    { id: 'BF103', k: 'button', d: TW('Кнопка для мобильной версии', 'Button for the mobile version'), lock: true }
  ]
};

// Слова предложения: [{ w, tail }] — слово без знаков и знак после него.
const wordsOf = (s) => String(s).split(' ').map((w) => { const m = /^(.*?)([.,!?:;»”]*)$/.exec(w); return { w: m[1], tail: m[2] }; });

// Блоки страницы урока 3. text: paras — массив абзацев, абзац — массив номеров предложений PAGE3.sents; bold — ключ слова
// «абзац:предложение:слово»; wall — одна стена жирным.
function TBody3({ b, pick, onWord, selW, boldSet, allBold }) {
  if (b.k === 'cover') return <TCover id="CR28" title="RoboKlub" sub={pick(UI.coverSub)} />;
  if (b.k === 'title') return <div className="tl2-tl"><h2 className="tl2-h tl3-h">{pick(PAGE3.title)}</h2></div>;
  if (b.k === 'lead') return <p className="tl2-tx is-big tl3-lead">{pick(PAGE3.lead)}</p>;
  if (b.k === 'quote') return <div className="tl3-qt"><i className="tl3-qava" aria-hidden="true" /><span><b>{pick(PAGE3.quote)}</b><em>{pick(PAGE3.quoteWho)}</em></span></div>;
  if (b.k === 'button') return <div className="tl3-btnw"><span className={'tl3-btn' + (b.flash ? ' is-flash' : '')}>{b.t ? pick(b.t) : "Let's go!"}</span></div>;
  if (b.k === 'text') {
    const paras = b.wall ? [[0, 1, 2, 3, 4, 5]] : (b.paras || [[0, 1], [2, 3], [4, 5]]);
    return (
      <div className={'tl2-tx tl3-tx' + (b.wall ? ' is-wall' : '')}>
        {paras.map((pa, pi) => (
          <p key={pi}>
            {pa.map((si) => wordsOf(pick(PAGE3.sents[si])).map((wd, wi) => {
              const key = si + ':' + wi;
              const bold = allBold || b.wall || (boldSet && boldSet.indexOf(key) >= 0);
              const inner = onWord
                ? <button type="button" data-w={key} className={'tl3-w' + (selW === key ? ' is-sel' : '')} onClick={(e) => { e.stopPropagation(); onWord(key, wd.w); }}>{wd.w}</button>
                : <span className={'tl3-w' + (selW === key ? ' is-sel' : '')}>{wd.w}</span>;
              return <React.Fragment key={key}>{bold ? <b>{inner}</b> : inner}{wd.tail} </React.Fragment>;
            }))}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Панель стиля (правка на месте): в настоящей Tilda — белая полоса на месте верхней полосы редактора (сверка 25.11.2026):
// B, I, U, S, ссылка, два списка, цвет, насыщенность, шрифт, размер, межстрочный интервал, выравнивание, типограф, ИИ,
// ластик, «ещё»; справа — «20px — TildaSans, Arial, sans-serif». На телефоне кнопки по 40 px, видна только часть ряда.
const FMT_KEYS = ['b', 'i', 'u', 's', 'link', 'ol', 'ul', 'color', 'weight', 'font', 'size', 'lh', 'align', 'typo', 'ai', 'clean', 'more'];
function FmtIco({ k }) {
  const s = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (k === 'b') return <b className="tl3-fi">B</b>;
  if (k === 'i') return <i className="tl3-fi is-i">I</i>;
  if (k === 'u') return <span className="tl3-fi is-u">U</span>;
  if (k === 's') return <span className="tl3-fi is-s">S</span>;
  if (k === 'link') return <svg {...s}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>;
  if (k === 'ol') return <svg {...s}><path d="M10 6h10M10 12h10M10 18h10M4 5h1v3M4 18h2l-2-2.5a1 1 0 0 1 1.6-1.2" /></svg>;
  if (k === 'ul') return <svg {...s}><path d="M10 6h10M10 12h10M10 18h10" /><circle cx="5" cy="6" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="5" cy="18" r="1" /></svg>;
  if (k === 'color') return <svg {...s}><path d="M14 4l6 6-9 9H5v-6z" /><path d="M12 6l6 6" /></svg>;
  if (k === 'weight') return <svg {...s}><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></svg>;
  if (k === 'font') return <span className="tl3-fi is-font">A</span>;
  if (k === 'size') return <span className="tl3-fi is-size">TT</span>;
  if (k === 'lh') return <svg {...s}><path d="M11 6h9M11 12h9M11 18h9M5 5v14M3 7l2-2 2 2M3 17l2 2 2-2" /></svg>;
  if (k === 'align') return <svg {...s}><path d="M4 6h16M4 10h10M4 14h16M4 18h10" /></svg>;
  if (k === 'typo') return <svg {...s}><path d="M4 5h7a4 4 0 0 1 4 4v10a4 4 0 0 0-4-4H4zM20 5h-1a4 4 0 0 0-4 4" /></svg>;
  if (k === 'ai') return <svg {...s} className="is-ai"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>;
  if (k === 'clean') return <svg {...s}><path d="M7 20h10M5 15l8-10 6 5-8 10H7z" /></svg>;
  return <span className="tl3-fi">⋯</span>;
}
function TFmt({ onFmt, led, off }) {
  const pick = usePick();
  return (
    <div className="tl3-fmt" onClick={(e) => e.stopPropagation()} translate="no">
      <span className="tl3-fmt-row">
        {FMT_KEYS.map((k) => (
          <button key={k} type="button" data-f={k} className={'tl3-f' + (led === k ? ' is-led' : '')} disabled={off || !onFmt} onClick={onFmt ? () => onFmt(k) : undefined} aria-label={TL3.fmt[k] ? pick(TL3.fmt[k]) : k}>
            <FmtIco k={k} />
          </button>
        ))}
      </span>
      <span className="tl3-fmt-info">20px — TildaSans, Arial, sans-serif</span>
    </div>
  );
}

// Страница урока 3: блоки с панелью выбранного (шифр, «Настройки», «Контент»; копировать, удалить, выключить, ▾, ↑, ↓).
function TPage3({ blocks, sel, onSel, onTool, onContent, contentLed, born, onWord, selW, boldSet, allBold, fmt, ledTool, lite, label }) {
  const pick = usePick();
  return (
    <div className="tl2-page">
      {blocks.map((b) => {
        const on = sel === b.u;
        return (
          <div key={b.u} data-b={b.u} data-k={b.k}
            className={'tl2-b is-' + b.k + (on ? ' is-sel' : '') + (born === b.u ? ' is-born' : '') + (onSel ? ' is-pick' : '')}
            onClick={onSel ? () => onSel(b.u) : undefined}>
            <TBody3 b={b} pick={pick} onWord={b.k === 'text' ? onWord : null} selW={selW} boldSet={boldSet} allBold={allBold} />
            {on ? (
              <div className="tl2-tb" onClick={(e) => e.stopPropagation()}>
                <span className="tl2-tbl">
                  <span className="tl-chip tl2-id">{b.id} ▾</span>
                  <span className="tl-chip tl2-set">⚙<span className="tl2-w"> {pick(TL.settings)}</span></span>
                  <button type="button" data-t="content" className={'tl-chip is-content tl3-cbtn' + (contentLed ? ' is-led' : '')} disabled={!onContent} onClick={onContent || undefined}>✎<span className="tl2-w"> {pick(TL.content)}</span></button>
                </span>
                {lite ? null : <span className="tl2-tbr">
                  {TOOLS.map((t) => (
                    <button key={t} type="button" data-t={t} className={'tl2-tool' + (ledTool === t ? ' is-led' : '')} disabled={!onTool || t === 'more'}
                      onClick={onTool && t !== 'more' ? () => onTool(b.u, t) : undefined} aria-label={pick(TL2[t])}><TIco k={t} /></button>
                  ))}
                </span>}
              </div>
            ) : null}
            {label && label.u === b.u ? <span className="tl3-name kz-a-drop">{label.t}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

// Библиотека урока 3: разделы слева; карточки раздела справа; платные — с замком.
function TLib3({ cat, onCat, onCard, off, flash }) {
  const pick = usePick();
  const cards = cat != null ? LIB3[cat] : null;
  return (
    <div className="tl-lib tl2-lib">
      <div className="tl-lib-l">
        <div className="tl-lib-h">{pick(TL.lib)}<span aria-hidden="true">⌕ ✕</span></div>
        <div className="tl-lib-tabs">{TL.tabs.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}>{pick(t)}</span>)}</div>
        <div className="tl-cats">
          {TL.cats.map((c, i) => (
            <button type="button" key={i} data-v={'cat' + i} disabled={off} className={'tl-cat' + (cat === i ? ' is-on' : '')} onClick={() => onCat && onCat(i)}>{pick(c)}</button>
          ))}
        </div>
      </div>
      {cards ? (
        <div className="tl-lib-r" key={cat}>
          {cards.map((c) => (
            <button key={c.id} type="button" className={'tl-card tl2-card tl3-card' + (c.lock ? ' is-paid' : '') + (flash === c.id ? ' is-flash' : '')} data-v={c.id} disabled={off} onClick={() => onCard && onCard(c)}>
              <span className={'tl3-th is-' + c.k + (c.id === 'BF102' ? ' is-two' : '') + (c.id === 'BF103' ? ' is-mob' : '')} aria-hidden="true"><i /><b /></span>
              <span className="tl-cap"><em>{c.lock ? <i className="tl-lock" aria-hidden="true" /> : null}{c.id}</em>{pick(c.d)}{c.lock ? <span className="tl3-paid">{pick(TL3.paid)}</span> : null}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Панель «Контент» кнопки BF101 — как в настоящей Tilda (сверка 25.11.2026): вверху «Сохранить» (чёрная) и «Сохранить и
// закрыть» (лососевая) на всю ширину; «КАРТОЧКИ» → «КАРТОЧКА #1»; поля «НАЗВАНИЕ КНОПКИ» и «ССЫЛКА» (http://), под ней
// «В новом окне · Страница · Блок»; внизу «ДОБАВИТЬ ЭЛЕМЕНТ». В уроке ученик не печатает: под названием — варианты.
function TContent3({ value, opts, onOpt, bad, okK, typing }) {
  const pick = usePick();
  return (
    <div className="tl3-cnt kz-a-drop" translate="no">
      <div className="tl3-cnt-top"><span className="tl3-cnt-s">{pick(TL3.save)}</span><span className="tl3-cnt-sc">{pick(TL3.saveClose)}</span></div>
      <div className="tl3-cnt-body">
        <span className="tl3-cnt-h">{pick(TL3.cards)} ⌃</span>
        <div className="tl3-cnt-card">
          <span className="tl3-cnt-ch"><b>{pick(TL3.card1)}</b><i aria-hidden="true">{['copy', 'del', 'off', 'up', 'down', 'more'].map((t) => <TIco key={t} k={t} />)}</i></span>
          <label className="tl3-cnt-f"><span>{pick(TL3.btnText)}</span><b className={typing ? 'is-typing' : ''}>{value}</b></label>
          {opts ? (
            <div className="tl3-cnt-opts">
              {opts.map(([k, l]) => (
                <button key={k} type="button" data-v={'txt-' + k} className={'tl3-opt' + (bad === k ? ' is-bad' : '') + (okK === k ? ' is-ok' : '')} disabled={!onOpt} onClick={onOpt ? () => onOpt(k) : undefined}>{pick(l)}</button>
              ))}
            </div>
          ) : null}
          <label className="tl3-cnt-f is-dim"><span>{pick(TL3.btnLink)}</span><b>http://</b></label>
          <span className="tl3-cnt-chk"><i aria-hidden="true" />{pick(TL3.newWin)}<em>{pick(TL3.pg)}</em><em>{pick(TL3.blk)}</em></span>
        </div>
        <span className="tl3-cnt-add">{pick(TL3.addEl)}</span>
      </div>
    </div>
  );
}

// Схема страницы для сравнения (s7): wall — стена жирным; good — заголовок, абзацы, одно жирное слово, кнопка.
function TSchema({ good }) {
  return (
    <span className={'tl3-sch' + (good ? ' is-good' : ' is-wall')} aria-hidden="true">
      {good ? (
        <>
          <i className="is-h" /><i className="is-lead" />
          <span className="tl3-sch-p"><i /><i className="is-s" /></span>
          <span className="tl3-sch-p"><i /><i className="is-s" /></span>
          <span className="tl3-sch-p"><i className="is-b" /><i className="is-s" /></span>
          <i className="is-btn" />
        </>
      ) : (
        <>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <i key={i} className={'is-fat' + (i === 9 ? ' is-s' : '')} />)}</>
      )}
    </span>
  );
}
