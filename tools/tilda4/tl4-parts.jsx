// =============================================================================
// ЧАСТИ ИНТЕРФЕЙСА TILDA урока 4 «Картинки и Cover»: свои рисунки-«фото» (TFoto), блок картинки IM01 (серая заглушка или
// фото), обложка CR28 с фоновым фото и фильтром (затемнение сверху и снизу), «Контент» картинки (файл, «…» → альт-текст),
// «Контент» и «Настройки» обложки, «Библиотека изображений» (Unsplash, поиск, кнопки формы). Всё — по настоящей Tilda
// (сверка 25.11.2026, docs/tilda-redaktor-zametki.md). Окно редактора, значки и докрутка — из урока 2 (../tilda2/tl2-parts.jsx).
// Панели «Контент» и «Настройки»: на компьютере — слева, как в Tilda; на телефоне — снизу, чтобы над ними был виден результат.
// =============================================================================

// Слова интерфейса урока 4 (как в Tilda; у uz — русские).
const TL4 = {
  save: TW('Сохранить', 'Save'), saveClose: TW('Сохранить и закрыть', 'Save and close'),
  img: TW('ИЗОБРАЖЕНИЕ', 'IMAGE'), upload: TW('Загрузить файл', 'Upload file'), search: TW('Искать в библиотеке', 'Search in library'),
  alt: TW('SEO: АЛЬТ-ТЕКСТ ДЛЯ ИЗОБРАЖЕНИЯ', 'SEO: ALT TEXT FOR IMAGE'), descr: TW('ОПИСАНИЕ', 'DESCRIPTION'), link: TW('ССЫЛКА', 'LINK'),
  uptitle: TW('НАДЗАГОЛОВОК', 'SUPERTITLE'), title: TW('ЗАГОЛОВОК', 'TITLE'),
  bg: TW('ФОНОВОЕ ИЗОБРАЖЕНИЕ', 'BACKGROUND IMAGE'), onlyColor: TW('ТОЛЬКО ЦВЕТ', 'COLOR ONLY'), video: TW('ВИДЕО', 'VIDEO'),
  optimal: TW('Оптимальный размер', 'Optimal size'),
  lib: TW('Библиотека изображений', 'Image library'), where: TW('Где найти', 'Where to find'), uploads: TW('Загрузки', 'Uploads'), services: TW('СЕРВИСЫ', 'SERVICES'),
  libCats: [TW('Фоновые изображения', 'Backgrounds'), TW('Природа', 'Nature'), TW('Уличная фотография', 'Street photography'), TW('Путешествия', 'Travel')],
  searchPh: TW('Поиск изображений', 'Search images'), allCats: TW('Все категории', 'All categories'),
  scroll: TW('ЭФФЕКТ ПРИ СКРОЛЛЕ', 'SCROLL EFFECT'), noEffect: TW('Без эффекта', 'No effect'), height: TW('ВЫСОТА', 'HEIGHT'),
  fTop: TW('ЦВЕТ ФИЛЬТРА В НАЧАЛЕ', 'FILTER COLOR AT THE START'), fBot: TW('ЦВЕТ ФИЛЬТРА В КОНЦЕ', 'FILTER COLOR AT THE END'), opacity: TW('НЕПРОЗРАЧНОСТЬ', 'OPACITY'),
  paid: TW('Доступно на платном тарифе', 'Available on a paid plan')
};
const CAT_IMG4 = 4;
// Раздел «Изображение» (как в Tilda; на бесплатном тарифе IM04 и IM08 — с замком).
const LIB4 = [
  { id: 'IM01', d: TW('Изображение', 'Image') },
  { id: 'IM04', d: TW('Изображение с текстом на полях', 'Image with text in the margins'), lock: true },
  { id: 'IM08', d: TW('Изображение в круге', 'Image in a circle'), lock: true }
];
// Фото: файл (как имя у Unsplash) и форма (wide — горизонтальное, tall — вертикальное).
const FOTO = {
  club: { file: 'photo-1527430253228.jpg' }, movie: { file: 'photo-1485827404703.jpg' }, vacuum: { file: 'photo-1563453392212.jpg' },
  factory: { file: 'photo-1565043666747.jpg' }, mount: { file: 'photo-1506905925346.jpg' }, cat: { file: 'photo-1514888286974.jpg' },
  sunset: { file: 'photo-1507525428034.jpg' }, pizza: { file: 'photo-1513104890138.jpg' }, tall: { file: 'photo-1561557944.jpg', tall: true }
};

// Рисунок-«фото» (свой, в плоском стиле). meet — показать целиком (миниатюра в библиотеке), иначе — заполнить и обрезать.
function TFoto({ k, meet, cls }) {
  const tall = k === 'tall';
  const p = { className: 'tl4-foto' + (tall ? ' is-tall' : '') + (cls ? ' ' + cls : ''), viewBox: tall ? '0 0 100 150' : '0 0 160 100', preserveAspectRatio: meet ? 'xMidYMid meet' : 'xMidYMid slice', 'aria-hidden': 'true' };
  if (k === 'club') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#FCEBD2" />
        <rect x="110" y="8" width="40" height="30" rx="2" fill="#BFE0FF" stroke="#fff" strokeWidth="2" /><path d="M130 8v30M110 23h40" stroke="#fff" strokeWidth="2" />
        <rect x="12" y="10" width="24" height="18" rx="2" fill="#FA876B" /><circle cx="24" cy="19" r="5" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="14" y="50" width="34" height="30" rx="10" fill="#F97316" /><circle cx="31" cy="40" r="11" fill="#9A6440" />
        <path d="M20 38a11 11 0 0 1 22 0c-3-4-8-5-11-5s-8 1-11 5z" fill="#2B1B12" />
        <rect x="112" y="52" width="32" height="28" rx="10" fill="#10B981" /><circle cx="128" cy="42" r="10" fill="#E8B48A" />
        <path d="M118 41a10 10 0 0 1 20 0c-2-5-6-7-10-7s-8 2-10 7z" fill="#5B3A1E" /><circle cx="139" cy="38" r="4" fill="#5B3A1E" />
        <path d="M44 62L63 65" stroke="#9A6440" strokeWidth="5" strokeLinecap="round" /><path d="M115 63L97 65" stroke="#E8B48A" strokeWidth="5" strokeLinecap="round" />
        <rect x="0" y="70" width="160" height="30" fill="#C88A55" /><rect x="0" y="68" width="160" height="5" fill="#E0A26B" />
        <rect x="66" y="46" width="28" height="22" rx="4" fill="#3B82F6" /><rect x="72" y="52" width="16" height="8" rx="2" fill="#BFDBFE" />
        <rect x="69" y="30" width="22" height="16" rx="4" fill="#60A5FA" />
        <circle cx="76" cy="38" r="3" fill="#fff" /><circle cx="84" cy="38" r="3" fill="#fff" /><circle cx="76" cy="38" r="1.3" fill="#111" /><circle cx="84" cy="38" r="1.3" fill="#111" />
        <path d="M80 30v-6" stroke="#334155" strokeWidth="1.5" /><circle cx="80" cy="23" r="2.2" fill="#FA4F28" />
        <circle cx="71" cy="68" r="4" fill="#1F2937" /><circle cx="89" cy="68" r="4" fill="#1F2937" />
        <circle cx="106" cy="73" r="3" fill="#FACC15" /><rect x="46" y="72" width="9" height="3" rx="1" fill="#64748B" />
      </svg>
    );
  }
  if (k === 'movie') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#111827" /><circle cx="80" cy="50" r="46" fill="#1E3A5F" />
        <path d="M40 100c4-12 20-16 40-16s36 4 40 16z" fill="#D1D5DB" /><rect x="72" y="72" width="16" height="14" fill="#9CA3AF" />
        <ellipse cx="80" cy="46" rx="24" ry="30" fill="#E5E7EB" /><ellipse cx="80" cy="52" rx="17" ry="18" fill="#CBD5E1" />
        <ellipse cx="72" cy="46" rx="4.5" ry="2.6" fill="#22D3EE" /><ellipse cx="88" cy="46" rx="4.5" ry="2.6" fill="#22D3EE" /><path d="M74 60h12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (k === 'vacuum') {
    return (
      <svg {...p}>
        <rect width="160" height="56" fill="#EEF2F7" /><rect x="110" y="28" width="50" height="30" rx="6" fill="#A78BFA" />
        <rect y="56" width="160" height="44" fill="#D9A066" /><path d="M0 68h160M0 82h160M30 56v12M90 68v14M60 82v18M130 56v12" stroke="#C48A52" strokeWidth="1.5" />
        <ellipse cx="70" cy="77" rx="30" ry="10" fill="#111827" /><ellipse cx="70" cy="74" rx="30" ry="10" fill="#374151" /><ellipse cx="70" cy="73" rx="12" ry="4" fill="#4B5563" /><circle cx="86" cy="72" r="1.8" fill="#22C55E" />
      </svg>
    );
  }
  if (k === 'factory') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#CBD5E1" /><rect x="10" y="8" width="140" height="10" fill="#E2E8F0" /><rect y="72" width="160" height="28" fill="#94A3B8" />
        <rect x="0" y="64" width="160" height="8" fill="#475569" /><rect x="100" y="52" width="14" height="12" fill="#D97706" /><rect x="124" y="52" width="14" height="12" fill="#D97706" />
        <rect x="30" y="58" width="22" height="8" fill="#EA580C" />
        <path d="M41 58L55 30L85 40" stroke="#F97316" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="55" cy="30" r="5" fill="#C2410C" /><path d="M85 40l6 6M85 40l8-2" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (k === 'mount') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#F59E7B" /><rect width="160" height="44" fill="#C2416B" opacity=".55" /><circle cx="118" cy="36" r="10" fill="#FDE68A" />
        <path d="M0 100L36 46L64 78L96 30L130 70L160 52V100z" fill="#3B2A6B" /><path d="M0 100L26 72L56 92L90 60L124 88L160 74V100z" fill="#2A1F4F" />
      </svg>
    );
  }
  if (k === 'cat') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#FDE68A" /><ellipse cx="80" cy="86" rx="56" ry="12" fill="#F59E0B" />
        <path d="M112 74q22-2 18-24" stroke="#6B7280" strokeWidth="6" fill="none" strokeLinecap="round" /><ellipse cx="82" cy="70" rx="34" ry="20" fill="#6B7280" />
        <path d="M44 46l2-15 11 9zM57 40l11-9 2 15z" fill="#6B7280" /><circle cx="56" cy="54" r="16" fill="#6B7280" />
        <path d="M49 54q3 3 6 0M58 54q3 3 6 0" stroke="#111" strokeWidth="1.6" fill="none" strokeLinecap="round" /><circle cx="56" cy="59" r="1.5" fill="#F9A8D4" />
      </svg>
    );
  }
  if (k === 'sunset') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#FDBA74" /><rect width="160" height="32" fill="#FB7185" opacity=".55" /><circle cx="80" cy="60" r="18" fill="#FDE047" />
        <rect y="60" width="160" height="40" fill="#1E3A8A" /><path d="M64 68h32M70 76h20M74 84h12" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (k === 'pizza') {
    return (
      <svg {...p}>
        <rect width="160" height="100" fill="#FEF3C7" /><circle cx="80" cy="50" r="42" fill="#B45309" /><circle cx="80" cy="50" r="36" fill="#FBBF24" />
        <circle cx="80" cy="50" r="31" fill="#F97316" opacity=".35" />
        {[[66, 38], [92, 36], [72, 62], [96, 60], [82, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill="#DC2626" />)}
        <path d="M80 14v72M44 50h72" stroke="#B45309" strokeWidth="1.2" opacity=".5" />
      </svg>
    );
  }
  if (k === 'tall') {
    return (
      <svg {...p}>
        <rect width="100" height="150" fill="#E0F2FE" /><rect y="132" width="100" height="18" fill="#BAE6FD" />
        <path d="M50 7v10" stroke="#334155" strokeWidth="2" /><circle cx="50" cy="7" r="4" fill="#FA4F28" />
        <rect x="30" y="16" width="40" height="30" rx="6" fill="#14B8A6" />
        <circle cx="41" cy="30" r="6" fill="#fff" /><circle cx="59" cy="30" r="6" fill="#fff" /><circle cx="41" cy="30" r="2.5" fill="#111" /><circle cx="59" cy="30" r="2.5" fill="#111" />
        <rect x="40" y="39" width="20" height="3" rx="1.5" fill="#0F766E" /><rect x="45" y="46" width="10" height="6" fill="#0F766E" />
        <rect x="12" y="56" width="10" height="34" rx="5" fill="#14B8A6" /><rect x="78" y="56" width="10" height="34" rx="5" fill="#14B8A6" />
        <rect x="24" y="52" width="52" height="46" rx="6" fill="#0D9488" /><circle cx="40" cy="70" r="6" fill="#FDE68A" /><circle cx="60" cy="70" r="6" fill="#FCA5A5" />
        <rect x="32" y="98" width="12" height="30" rx="3" fill="#0F766E" /><rect x="56" y="98" width="12" height="30" rx="3" fill="#0F766E" />
        <rect x="28" y="126" width="20" height="8" rx="3" fill="#334155" /><rect x="52" y="126" width="20" height="8" rx="3" fill="#334155" />
      </svg>
    );
  }
  return null;
}

// Значок пустой картинки (как в IM01 Tilda: рамка, солнце, горы).
function TImgIco() {
  return <svg className="tl4-ph-ico" viewBox="0 0 48 40" aria-hidden="true"><rect x="2" y="2" width="44" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="14" cy="13" r="4" fill="currentColor" /><path d="M6 34l12-14 8 9 6-6 10 11z" fill="currentColor" /></svg>;
}

// Обложка CR28 урока 4: фоновое фото (или чужие горы), фильтр сверху и снизу (непрозрачность 0–100), полупрозрачная плашка.
function TCover4({ foto, f, f2, title, sub, long }) {
  const a = (v) => Math.max(0, Math.min(100, v == null ? 10 : v)) / 100;
  return (
    <section className={'tl4-cov' + (long ? ' is-long' : '')}>
      <TFoto k={foto || 'mount'} cls="tl4-cov-bg" />
      <i className="tl4-cov-f" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,' + a(f) + '), rgba(0,0,0,' + a(f2 == null ? f : f2) + '))' }} aria-hidden="true" />
      <div className="tl4-plate">
        <h1 className="tl4-h">{title}</h1>
        {sub ? <p className="tl4-p">{sub}</p> : null}
      </div>
    </section>
  );
}

// Блоки страницы урока 4: cover (foto, f, f2), title, text (с одним жирным словом), img (foto или пусто), button.
function TBody4({ b, pick }) {
  if (b.k === 'cover') return <TCover4 foto={b.foto} f={b.f} f2={b.f2} title="RoboKlub" sub={pick(PAGE4.sub)} />;
  if (b.k === 'title') return <div className="tl2-tl"><h2 className="tl2-h tl3-h">{pick(PAGE4.title)}</h2></div>;
  if (b.k === 'text') return <p className="tl2-tx tl4-tx">{String(pick(PAGE4.text)).split('||').map((t, i) => (i % 2 ? <b key={i}>{t}</b> : <span key={i}>{t}</span>))}</p>;
  if (b.k === 'button') return <div className="tl3-btnw"><span className="tl3-btn">{pick(PAGE4.btn)}</span></div>;
  if (b.k === 'img') {
    return (
      <div className="tl4-imgw">
        {b.foto ? <TFoto k={b.foto} cls={'tl4-img' + (b.flash ? ' is-flash' : '')} /> : <span className="tl4-ph"><TImgIco /></span>}
      </div>
    );
  }
  return null;
}

// Страница урока 4: блоки с панелью выбранного (шифр, «Настройки», «Контент»; копировать, удалить, выключить, ▾, ↑, ↓).
function TPage4({ blocks, sel, onSel, onTool, onContent, contentLed, onSettings, setLed, born, gone, ledTool, lite, onPlus, plusLed }) {
  const pick = usePick();
  return (
    <div className="tl2-page tl4-page">
      {blocks.map((b) => {
        const on = sel === b.u;
        return (
          <div key={b.u} data-b={b.u} data-k={b.k}
            className={'tl2-b is-' + b.k + (on ? ' is-sel' : '') + (born === b.u ? ' is-born' : '') + (gone === b.u ? ' is-gone' : '') + (onSel ? ' is-pick' : '')}
            onClick={onSel ? () => onSel(b.u) : undefined}>
            <TBody4 b={b} pick={pick} />
            {on ? (
              <div className="tl2-tb" onClick={(e) => e.stopPropagation()}>
                <span className="tl2-tbl">
                  <span className="tl-chip tl2-id">{b.id} ▾</span>
                  <button type="button" data-t="settings" className={'tl-chip tl2-set tl3-cbtn tl4-sbtn' + (setLed ? ' is-led' : '')} disabled={!onSettings} onClick={onSettings || undefined}>⚙<span className="tl2-w"> {pick(TL.settings)}</span></button>
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
            {on && onPlus ? <button type="button" data-t="plus" className={'tl2-plus' + (plusLed ? ' is-led' : '')} onClick={(e) => { e.stopPropagation(); onPlus(b.u); }} aria-label={pick(TL2.plus)}>+</button> : null}
          </div>
        );
      })}
    </div>
  );
}

// Раздел «Изображение» в библиотеке блоков.
function TLib4({ cat, onCat, onCard, off, flash }) {
  const pick = usePick();
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
      {cat === CAT_IMG4 ? (
        <div className="tl-lib-r" key={cat}>
          {LIB4.map((c) => (
            <button key={c.id} type="button" className={'tl-card tl2-card tl3-card' + (c.lock ? ' is-paid' : '') + (flash === c.id ? ' is-flash' : '')} data-v={c.id} disabled={off} onClick={() => onCard && onCard(c)}>
              <span className={'tl4-th is-' + c.id} aria-hidden="true"><i /><b /></span>
              <span className="tl-cap"><em>{c.lock ? <i className="tl-lock" aria-hidden="true" /> : null}{c.id}</em>{pick(c.d)}{c.lock ? <span className="tl3-paid">{pick(TL4.paid)}</span> : null}</span>
            </button>
          ))}
        </div>
      ) : cat != null ? <div className="tl-lib-r tl4-lib-none" key={cat} /> : null}
    </div>
  );
}

// Верх панели: «Сохранить» (чёрная) и «Сохранить и закрыть» (лососевая; в задании — настоящая кнопка).
function TPanTop({ onSave, led }) {
  const pick = usePick();
  return (
    <div className="tl3-cnt-top tl4-pan-top">
      <span className="tl3-cnt-s">{pick(TL4.save)}</span>
      <button type="button" data-t="saveclose" className={'tl3-cnt-sc tl4-sc' + (led ? ' is-led' : '')} disabled={!onSave} onClick={onSave || undefined}>{pick(TL4.saveClose)}</button>
    </div>
  );
}
// Строка файла: миниатюра, имя, «…», карандаш, корзина.
function TFileRow({ foto, onDots, dotsLed }) {
  return (
    <div className="tl4-file">
      <span className="tl4-file-th">{foto ? <TFoto k={foto} /> : <span className="tl4-ph is-mini"><TImgIco /></span>}</span>
      <span className="tl4-file-n">…/{foto ? FOTO[foto].file : 'imgfish.jpg'}</span>
      <span className="tl4-file-b">
        <button type="button" data-t="dots" className={'tl4-dots' + (dotsLed ? ' is-led' : '')} disabled={!onDots} onClick={onDots || undefined} aria-label="…">…</button>
        <i className="tl4-pen" aria-hidden="true">✎</i><TIco k="del" />
      </span>
    </div>
  );
}
// Кнопка «Искать в библиотеке».
function TSearchBtn({ onLib, led }) {
  const pick = usePick();
  return (
    <button type="button" data-t="libsearch" className={'tl4-libbtn' + (led ? ' is-led' : '')} disabled={!onLib} onClick={onLib || undefined}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="M15 15l5 5" /></svg>
      {pick(TL4.search)}
    </button>
  );
}

// «Контент» картинки IM01: ИЗОБРАЖЕНИЕ (Загрузить файл, Искать в библиотеке), строка файла; «…» → альт-текст с вариантами.
function TImgCnt({ foto, onLib, libLed, onSave, saveLed, onDots, dotsLed, alt, altVal, altOpts, onAlt, altBad, altOk }) {
  const pick = usePick();
  const altRef = useRef(null);
  // Поле альт-текста открылось — панель сама докручивается до него (на телефоне панель низкая, варианты были бы за краем).
  useEffect(() => {
    const el = altRef.current; const pan = el && el.closest('.tl4-pan');
    if (!pan) return undefined;
    const t = setTimeout(() => { pan.scrollTop = Math.max(0, Math.min(el.offsetTop - 8, el.offsetTop + el.offsetHeight - pan.clientHeight + 12)); }, 80);
    return () => clearTimeout(t);
  }, [alt, !!altOpts]);
  return (
    <div className="tl3-cnt tl4-pan kz-a-drop" translate="no" onClick={(e) => e.stopPropagation()}>
      <TPanTop onSave={onSave} led={saveLed} />
      <div className="tl3-cnt-body tl4-pan-body">
        <span className="tl3-cnt-h">{pick(TL4.img)}</span>
        <div className="tl4-uprow"><span className="tl4-upload">{pick(TL4.upload)}</span><TSearchBtn onLib={onLib} led={libLed} /></div>
        <TFileRow foto={foto} onDots={onDots} dotsLed={dotsLed} />
        {alt ? (
          <div className="tl3-cnt-f tl4-alt kz-a-drop" ref={altRef}>
            <span>{pick(TL4.alt)}</span>
            <b>{altVal ? pick(altVal) : ' '}</b>
            {altOpts ? (
              <div className="tl3-cnt-opts">
                {altOpts.map(([k, l]) => (
                  <button key={k} type="button" data-v={'alt-' + k} className={'tl3-opt' + (altBad === k ? ' is-bad' : '') + (altOk === k ? ' is-ok' : '')} disabled={!onAlt} onClick={onAlt ? () => onAlt(k) : undefined}>{pick(l)}</button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL4.descr)}</span><b>{' '}</b></label>
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL4.link)}</span><b>{' '}</b></label>
      </div>
    </div>
  );
}

// «Контент» обложки CR28: надзаголовок, заголовок, описание; «ФОНОВОЕ ИЗОБРАЖЕНИЕ · ТОЛЬКО ЦВЕТ · ВИДЕО»; файл фона.
function TCoverCnt({ foto, onLib, libLed, onSave, saveLed }) {
  const pick = usePick();
  return (
    <div className="tl3-cnt tl4-pan kz-a-drop" translate="no" onClick={(e) => e.stopPropagation()}>
      <TPanTop onSave={onSave} led={saveLed} />
      <div className="tl3-cnt-body tl4-pan-body">
        <label className="tl3-cnt-f tl4-hide-s"><span>{pick(TL4.uptitle)}</span><b>{' '}</b></label>
        <label className="tl3-cnt-f"><span>{pick(TL4.title)}</span><b>RoboKlub</b></label>
        <label className="tl3-cnt-f tl4-hide-s"><span>{pick(TL4.descr)}</span><b>{pick(PAGE4.sub)}</b></label>
        <span className="tl4-bgtabs"><b>{pick(TL4.bg)}</b><em>{pick(TL4.onlyColor)}</em><em>{pick(TL4.video)}</em></span>
        <div className="tl4-uprow"><span className="tl4-upload">{pick(TL4.upload)}</span><span className="tl4-opt">{pick(TL4.optimal)}<br />1680×900px</span><TSearchBtn onLib={onLib} led={libLed} /></div>
        <TFileRow foto={foto || 'mount'} />
      </div>
    </div>
  );
}

// «Настройки» обложки: высота, фильтр в начале и в конце (цвет и непрозрачность). open — открытый список ('top' / 'bot').
const OPAS = [0, 30, 70, 100];
function TCoverSet({ f, f2, open, onOpen, onOpa, ledOpen, bad }) {
  const pick = usePick();
  const row = (key, label, v) => (
    <div className="tl4-frow">
      <span className="tl4-fcol"><span className="tl4-lab">{pick(label)}</span><span className="tl4-color"><i aria-hidden="true" />#000000</span></span>
      <span className="tl4-fcol">
        <span className="tl4-lab">{pick(TL4.opacity)}</span>
        <button type="button" data-t={'op-' + key} className={'tl4-sel' + (open === key ? ' is-open' : '') + (ledOpen === key ? ' is-led' : '')} disabled={!onOpen} onClick={onOpen ? () => onOpen(key) : undefined}>{v}% <i aria-hidden="true">▾</i></button>
      </span>
      {open === key ? (
        <span className="tl4-opas kz-a-drop">
          {OPAS.map((o) => (
            <button key={o} type="button" data-v={key + '-' + o} className={'tl4-opa' + (v === o ? ' is-on' : '') + (bad === key + '-' + o ? ' is-bad' : '')} disabled={!onOpa} onClick={onOpa ? () => onOpa(key, o) : undefined}>{o}%</button>
          ))}
        </span>
      ) : null}
    </div>
  );
  return (
    <div className="tl3-cnt tl4-pan kz-a-drop" translate="no" onClick={(e) => e.stopPropagation()}>
      <TPanTop />
      <div className="tl3-cnt-body tl4-pan-body">
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL4.scroll)}</span><b>{pick(TL4.noEffect)}</b></label>
        <label className="tl3-cnt-f is-dim tl4-hide-s"><span>{pick(TL4.height)}</span><b>100vh</b></label>
        {row('top', TL4.fTop, f)}
        {row('bot', TL4.fBot, f2)}
      </div>
    </div>
  );
}

// «Библиотека изображений»: слева сервисы (на телефоне скрыты), сверху Unsplash, поиск, «Все категории», кнопки формы; фото.
function TImgLib({ q, fotos, onPick, bad, ok, off, typing }) {
  const pick = usePick();
  return (
    <div className="tl4-lib kz-a-drop" translate="no" onClick={(e) => e.stopPropagation()}>
      <div className="tl4-lib-h"><b>{pick(TL4.lib)}</b><span aria-hidden="true">✕</span></div>
      <div className="tl4-lib-in">
        <div className="tl4-lib-l">
          <span>{pick(TL4.where)}</span><span>{pick(TL4.uploads)}</span><em>{pick(TL4.services)}</em><b>Unsplash</b>
          {TL4.libCats.map((c, i) => <span key={i} className="is-sub">{pick(c)}</span>)}
        </div>
        <div className="tl4-lib-r">
          <div className="tl4-lib-bar">
            <span className="tl4-us"><i aria-hidden="true" />Unsplash</span>
            <span className={'tl4-q' + (q ? ' is-full' : '') + (typing ? ' is-typing' : '')}>{q || pick(TL4.searchPh)}{q ? <i aria-hidden="true">✕</i> : null}</span>
            <span className="tl4-cats">{pick(TL4.allCats)} ▾</span>
            <span className="tl4-shapes" aria-hidden="true"><i className="is-w is-on" /><i className="is-t" /><i className="is-s" /></span>
          </div>
          <div className="tl4-grid">
            {(fotos || []).map((k) => (
              <button key={k} type="button" data-v={'foto-' + k} className={'tl4-gi' + (bad === k ? ' is-bad' : '') + (ok === k ? ' is-ok' : '')} disabled={off || !onPick} onClick={onPick ? () => onPick(k) : undefined}>
                <TFoto k={k} meet />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Докрутить страницу так, чтобы блок стоял вверху окна (на телефоне снизу панель — блок должен быть над ней).
function scrollTopTo(sel) {
  const el = sel && document.querySelector('.tl-groot ' + sel);
  const box = el && el.closest && el.closest('.tl2-page');
  if (!el || !box) return;
  box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top;
}
