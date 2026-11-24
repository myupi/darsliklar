// =============================================================================
// ЧАСТИ ИНТЕРФЕЙСА TILDA (урок 1). Нарисованы по настоящей Tilda (сверка 24.11.2026): сайт tilda.cc, форма регистрации,
// окно «Создать новый сайт», страница проекта, выбор новой страницы, редактор, библиотека, окно публикации.
// Окна браузера и кода нет (заказчик, 24.11.2026). Сначала — телефон: одна колонка, крупные нажатия.
// =============================================================================

// Обложка — одна и та же в редакторе и на опубликованном сайте.
function TCover({ id, title, sub, onTitle, editing, edit }) {
  const look = (COVERS.find((c) => c.id === id) || {}).look || 'plate';
  return (
    <section className={'tl-cover is-' + look}>
      {look === 'author' ? <i className="tl-avatar" aria-hidden="true" /> : null}
      <div className="tl-plate">
        {editing ? edit : (onTitle ? <button type="button" className="tl-h is-tap" onClick={onTitle}>{title}</button> : <h1 className="tl-h">{title}</h1>)}
        <p className="tl-p">{sub}</p>
      </div>
    </section>
  );
}

// Окно редактора: верхняя полоса «⌂ / проект / страница», «Предпросмотр», «Опубликовать»; внутри — холст.
function TEd({ project, children, pub, pubLed, onPub, cls }) {
  const pick = usePick();
  return (
    <div className={'tl-ed' + (cls ? ' ' + cls : '')} translate="no">
      <div className="tl-top">
        <span className="tl-crumb" data-part="path"><i className="tl-home" aria-hidden="true" /><span className="tl-w tl-ms">{pick(TL.mySites)}</span><span>/</span><b>{project}</b><span className="tl-pg">/ {pick(TL.page)} ▾</span></span>
        <span className="tl-dev" aria-hidden="true"><i className="is-ph" /><i className="is-pc" /></span>
        <span className="tl-acts">
          <span className="tl-undo" aria-hidden="true">↶ ↷</span>
          <span className="tl-act" data-part="preview"><span className="tl-w">{pick(TL.preview)}</span><i className="tl-ico is-play" aria-label={pick(TL.preview)} /></span>
          <button type="button" data-part="publish" className={'tl-act is-pub' + (pubLed ? ' is-led' : '')} disabled={!onPub || pub === false} onClick={onPub || undefined} aria-label={pick(TL.publish)}>
            <span className="tl-w">{pick(TL.publish)}</span><i className="tl-ico is-cloud" aria-hidden="true" />
          </button>
          <span className="tl-act is-set tl-w">{pick(TL.settings)}</span>
          <span className="tl-act is-more"><span className="tl-w">{pick(TL.more)} ▾</span><i className="tl-ico is-menu" aria-hidden="true" /></span>
        </span>
      </div>
      <div className="tl-canvas" data-part="page">{children}</div>
    </div>
  );
}
// Пустая страница и низ с «ВСЕ БЛОКИ».
function TEmpty() {
  const pick = usePick();
  return (
    <div className="tl-empty">
      <i className="tl-cam" aria-hidden="true" />
      <b>{pick(TL.empty1)}</b>
      <span>{pick(TL.empty2)}</span>
    </div>
  );
}
function TDock({ led, onAll, disabled }) {
  const pick = usePick();
  return (
    <div className="tl-dock" data-part="dock">
      <i className="tl-star" aria-hidden="true">★</i>
      <button type="button" className={'tl-all' + (led ? ' is-led' : '')} disabled={disabled || !onAll} onClick={onAll || undefined}><i aria-hidden="true">≡</i>{pick(TL.all)}</button>
      <span className="tl-quick">{TL.quick.map((q, i) => <span key={i}>{pick(q)}</span>)}</span>
    </div>
  );
}
// Библиотека блоков: категории слева; в «Обложке» — карточки блоков (платные — с замком).
function TCard({ c, onPick, flash, off }) {
  const pick = usePick();
  return (
    <button type="button" className={'tl-card' + (c.paid ? ' is-paid' : '') + (flash ? ' is-flash' : '')} data-v={c.id} disabled={off} onClick={() => onPick(c)}>
      <span className={'tl-thumb is-' + c.look} aria-hidden="true"><i /><b /></span>
      <span className="tl-cap"><em>{c.paid ? <i className="tl-lock" aria-hidden="true" /> : null}{c.id}</em>{pick(c.d)}</span>
      {c.paid ? <span className="tl-paid">{pick(TL.paid)}</span> : null}
    </button>
  );
}
function TLib({ cat, catLed, onCat, onCard, flash, off }) {
  const pick = usePick();
  return (
    <div className="tl-lib">
      <div className="tl-lib-l">
        <div className="tl-lib-h">{pick(TL.lib)}<span aria-hidden="true">⌕ ✕</span></div>
        <div className="tl-lib-tabs">{TL.tabs.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}>{pick(t)}</span>)}</div>
        <div className="tl-cats">
          {TL.cats.map((c, i) => (
            <button type="button" key={i} data-v={'cat' + i} disabled={off} className={'tl-cat' + (i === 0 && cat ? ' is-on' : '') + (i === 0 && catLed ? ' is-led' : '')}
              onClick={() => onCat && onCat(i)}>{pick(c)}</button>
          ))}
        </div>
      </div>
      {cat ? <div className="tl-lib-r">{COVERS.map((c) => <TCard key={c.id} c={c} flash={flash === c.id} onPick={onCard} off={off} />)}</div> : null}
    </div>
  );
}
// Полоса блока на странице: «CR28 ▾ · Настройки · Контент».
function TRecBar({ id }) {
  const pick = usePick();
  return (
    <div className="tl-bar">
      <span className="tl-chip">{id} ▾</span>
      <span className="tl-chip">⚙ {pick(TL.settings)}</span>
      <span className="tl-chip is-content">✎ {pick(TL.content)}</span>
    </div>
  );
}
// Окно «Публикация прошла успешно!».
function TPubModal({ onOpen, led }) {
  const pick = usePick();
  return (
    <div className="tl-modal">
      <div className="tl-dlg">
        <span className="tl-qr" aria-hidden="true" />
        <b className="tl-dlg-h">{pick(TL.okH)}</b>
        <span className="tl-dlg-l">{pick(TL.okLink)}</span>
        <span className="tl-dlg-u">https://{SITE_URL}</span>
        <button type="button" className={'tl-open' + (led ? ' is-led' : '')} disabled={!onOpen} onClick={onOpen || undefined}>{pick(TL.open)}</button>
        <span className="tl-dlg-f"><span>{pick(TL.seo)}</span><span className="tl-dlg-x">{pick(TL.close)}</span></span>
      </div>
    </div>
  );
}
// Опубликованный сайт: та же карточка без панелей редактора, адрес — строкой-ссылкой.
function TLive({ cover, title }) {
  const pick = usePick();
  const txt = COVER_TXT[cover] || COVER_TXT.CR28;
  return (
    <div className="tl-ed is-live" translate="no">
      <div className="tl-url"><i className="tl-globe" aria-hidden="true" /><span>{SITE_URL}</span></div>
      <div className="tl-site">
        <TCover id={cover} title={title} sub={txt.p} />
        <div className="tl-made"><i aria-hidden="true">T</i>{pick(TL.made)}</div>
      </div>
    </div>
  );
}
// Телефон или компьютер (та же граница, что у вида Tilda в CSS): часть интерфейса рисуется по-разному.
function useTouchView() {
  const [t, setT] = useState(isTouchView());
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(max-width: 759px)');
    const f = () => setT(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', f); else mq.addListener(f);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', f); else mq.removeListener(f); };
  }, []);
  return t;
}
// Сайт tilda.cc — как настоящий (сверка 24.11.2026): на компьютере слева картинка, справа меню в строку, заголовок и кнопки;
// на телефоне меню столбиком (ТАРИФЫ, #MADEONTILDA, БЛОГ, ЕЩЁ, ВОЙТИ, РЕГИСТРАЦИЯ), под ним картинка. Внизу — окно cookies.
function TSite({ cookie, onCookie, onReg, onLogin, regLed, ckLed, off }) {
  const pick = usePick();
  const touch = useTouchView();
  const login = <button type="button" className="tl-ts-login" data-v="login" disabled={off || !onLogin} onClick={onLogin || undefined}>{pick(TL.login)}</button>;
  const reg = <button type="button" className={'tl-ts-reg' + (regLed ? ' is-led' : '')} data-part="reg" data-v="reg" disabled={off || !onReg} onClick={onReg || undefined}>{pick(TL.reg)}</button>;
  return (
    <div className={'tl-ed tl-tsite' + (touch ? ' is-mob' : ' is-desk')} translate="no">
      {touch ? (
        <div className="tl-ts-mob">
          <b className="tl-ts-brand">{pick(TL.brand)}</b>
          <span className="tl-ts-col"><span>{pick(TL.tariffs)}</span><span>#MADEONTILDA</span><span>{pick(TL.blog)}</span><span>{pick(TL.more2)} ▾</span>{login}{reg}</span>
          <TArt />
        </div>
      ) : (
        <div className="tl-ts-desk">
          <div className="tl-ts-left"><TArt /><b className="tl-ts-brand2">{pick(TL.brand)}</b></div>
          <div className="tl-ts-right">
            <span className="tl-ts-row"><span>{pick(TL.tariffs)}</span><span>{pick(TL.blog)}</span><span>{pick(TL.more2)} ▾</span>{login}{reg}</span>
            <b className="tl-ts-hero2">{pick(TL.hero1)} <span>{pick(TL.hero2)}</span> <em>✦AI</em></b>
            <span className="tl-ts-sub">{pick(TL.heroSub)}</span>
            <span className="tl-ts-btns"><span className="tl-ts-ov">{pick(TL.overview)}</span><span className="tl-ts-cta">{pick(TL.ctaFree)}</span></span>
          </div>
        </div>
      )}
      {cookie ? (
        <div className="tl-ck">
          <b>{pick(TL.ckH)}</b>
          <span>{pick(TL.ckT)} <u>{pick(TL.ckLink)}</u></span>
          <span className="tl-ck-btns">
            <button type="button" data-v="ckYes" disabled={off || !onCookie} onClick={() => onCookie && onCookie('yes')}>{pick(TL.ckYes)}</button>
            <button type="button" data-v="ckNo" className={ckLed ? 'is-led' : ''} disabled={off || !onCookie} onClick={() => onCookie && onCookie('no')}>{pick(TL.ckNo)}</button>
            <em>{pick(TL.ckSet)}</em>
          </span>
        </div>
      ) : null}
      {cookie ? <i className="tl-ck-x" aria-hidden="true">✕</i> : null}
    </div>
  );
}
// Поиск (без марки поисковика): поле, кнопка, выдача; первая ссылка — tilda.cc.
function TSearch({ q, results, hl }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-search" translate="no">
      <div className="tl-se-top">
        <span className="tl-se-field" data-g="sfield"><i className="tl-se-mag" aria-hidden="true" /><span>{q}<i className="tl-caret" aria-hidden="true" /></span></span>
        <span className="tl-se-go" data-g="sgo">{pick(TL.find)}</span>
      </div>
      {results ? (
        <div className="tl-se-res kz-a-drop">
          <div className={'tl-se-item' + (hl ? ' is-hl' : '')} data-g="sres1">
            <span className="tl-se-site"><i className="tl-se-fav" aria-hidden="true">T</i><span><b>Tilda Publishing</b><em>https://tilda.cc</em></span></span>
            <b className="tl-se-h">{pick(TL.resH)}</b>
            <span className="tl-se-d">{pick(TL.resD)}</span>
          </div>
          <div className="tl-se-item is-dim">
            <span className="tl-se-site"><i className="tl-se-fav is-w" aria-hidden="true">W</i><span><b>Wikipedia</b><em>https://wikipedia.org › Tilda</em></span></span>
            <b className="tl-se-h">Tilda Publishing — Wikipedia</b>
          </div>
        </div>
      ) : null}
    </div>
  );
}
// Строка адреса телефона (без окна браузера вокруг): адрес печатается по буквам.
function TAddr({ text, go }) {
  return (
    <div className={'tl-addr' + (go ? ' is-go' : '')} translate="no">
      <i className="tl-addr-lock" aria-hidden="true" />
      <span>{text}<i className="tl-caret" aria-hidden="true" /></span>
      <b aria-hidden="true">→</b>
    </div>
  );
}
// Проверка пароля, как подсказывают сайты: длина, буквы и цифры, знак.
const passRules = (v) => [v.length >= 8, /[a-zA-Zа-яА-Я]/.test(v) && /\d/.test(v), /[^a-zA-Zа-яА-Я0-9\s]/.test(v)];
const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(v || '').trim());
// Форма регистрации (тёмная карточка, как на tilda.cc/registration): три поля, условия пароля, «Зарегистрироваться».
function TRegForm({ v, set, onGo, led, practice, rules }) {
  const pick = usePick();
  const [show, setShow] = useState(false);
  const pr = passRules(v.pass);
  const fld = (k, ph, type) => (
    <span className={'tl-rf' + (v[k] ? ' is-on' : '')}>
      <input type={type} value={v[k]} placeholder={pick(ph)} aria-label={pick(ph)} autoComplete={k === 'pass' ? 'new-password' : 'off'} autoCorrect="off" autoCapitalize="off" spellCheck={false} data-v={k}
        onChange={(e) => set(k, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onGo(); } }} />
      {k === 'pass' ? <button type="button" className="tl-eye" aria-label="show" onClick={() => setShow((x) => !x)}>{show ? '◉' : '◎'}</button> : null}
    </span>
  );
  return (
    <div className="tl-ed tl-regpage" translate="no">
      <TRoom />
      <div className="tl-reg-card">
        <TLogo cls="is-reg" />
        <b className="tl-reg-h">{pick(TL.start)}</b>
        {fld('name', TL.fName, 'text')}
        {fld('mail', TL.fMail, 'email')}
        {fld('pass', TL.fPass, show ? 'text' : 'password')}
        <span className="tl-rules">{rules.map((r, i) => <span key={i} className={pr[i] ? 'is-ok' : ''}><i aria-hidden="true">{pr[i] ? '✓' : '•'}</i>{pick(r)}</span>)}</span>
        <button type="button" className={'tl-reg-btn' + (led ? ' is-go' : '')} data-v="regGo" onClick={onGo}>{pick(TL.regBtn)}</button>
        <span className="tl-reg-terms">{pick(TL.terms)}</span>
        <span className="tl-reg-have">{pick(TL.haveAcc)}</span>
        <span className="tl-practice">{pick(practice)}</span>
      </div>
    </div>
  );
}
// Вход (tilda.cc/login): почта и пароль уже введены, «Я не робот», «Войти».
function TLogin({ tick, onTick, onGo, off, led }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-loginpage" translate="no">
      <div className="tl-login-card">
        <TLogo cls="is-login" />
        <span className="tl-lf is-on">kodi@gmail.com</span>
        <span className="tl-lf is-on">••••••••••••</span>
        <button type="button" className={'tl-robot' + (tick ? ' is-on' : '') + (led && !tick ? ' is-led' : '')} data-v="robot" disabled={off} onClick={onTick}>
          <i aria-hidden="true">{tick ? '✓' : ''}</i>{pick(TL.robot)}<em aria-hidden="true">reCAPTCHA</em>
        </button>
        <button type="button" className={'tl-login-go' + (led && tick ? ' is-led' : '')} data-v="loginGo" disabled={off} onClick={onGo}>{pick(TL.login)}</button>
        <span className="tl-login-links"><span>{pick(TL.regBtn)}</span><span>{pick(TL.forgot)}</span></span>
      </div>
    </div>
  );
}
// Примеры сайтов на Tilda (крючок): у каждого свой вид; нажатие — выбор.
function TExample({ s, on, onPick, off }) {
  const pick = usePick();
  return (
    <button type="button" className={'tl-ex is-' + s.k + (on ? ' is-on' : '')} data-v={s.k} disabled={off} onClick={() => onPick(s.k)}>
      <span className="tl-ex-top"><b>{pick(s.t)}</b><i aria-hidden="true" /><i aria-hidden="true" /></span>
      <span className="tl-ex-hero"><b>{pick(s.h)}</b><em aria-hidden="true" /></span>
      <span className="tl-ex-row" aria-hidden="true"><i /><i /><i /></span>
      <span className="tl-ex-made">Made on Tilda</span>
    </button>
  );
}
// Окно «Создать новый сайт».
function TNewSite({ value, onChange, onCreate, led, ph, inRef }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-nsback" translate="no">
      <TAccBar />
      <div className="tl-ns-over">
        <div className="tl-newsite">
          <div className="tl-ns-h"><span>{pick(TL.newSite)}</span><i aria-hidden="true">✕</i></div>
          <div className="tl-ns-b">
            <span className="tl-ns-l">{pick(TL.head)}</span>
            <input ref={inRef} className={'tl-ns-in' + (led ? ' is-led' : '')} value={value} maxLength={40} placeholder={pick(ph || TL.headPh)} aria-label={pick(TL.head)}
              onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onCreate(); } }}
              autoComplete="off" spellCheck={false} enterKeyHint="done" />
            <span className="tl-ns-note">{pick(TL.headNote)}</span>
            <span className="tl-ns-l">{pick(TL.type)}</span>
            <span className="tl-ns-radio"><span className="is-on"><i />{pick(TL.web)}</span><span><i />{pick(TL.shop)}</span></span>
            <span className="tl-ns-note">{pick(TL.typeNote)}</span>
            <span className="tl-ns-btns"><span className="tl-ns-close">{pick(TL.close)}</span><button type="button" className="tl-ns-go" onClick={onCreate}>{pick(TL.create)}</button></span>
          </div>
        </div>
      </div>
    </div>
  );
}
// Страница проекта: «Мои сайты», адрес, «Настройки сайта», «+ Создать новую страницу»; без страниц — флажок и надпись.
function TProject({ name, onNew, newLed }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-proj" translate="no">
      <TAccBar />
      <div className="tl-pj-band">
        <span className="tl-pj-links"><span>🌐 {pick(TL.domain)}</span><span className="is-wide">⬆ {pick(TL.pubAll)}</span><span>☰ {pick(TL.leads)}</span><em>{pick(TL.addr)} https://{SITE_URL}</em></span>
        <span className="tl-pj-main">
          <b className="tl-pj-name">{name}</b>
          <span className="tl-pj-btns">
            <span className="tl-pj-set">⚙ {pick(TL.siteSet)}</span>
            <button type="button" className={'tl-pj-new' + (newLed ? ' is-led' : '')} disabled={!onNew} onClick={onNew || undefined}>+ {pick(TL.newPage)}</button>
          </span>
        </span>
      </div>
      <div className="tl-pj-b">
        <span className="tl-pj-none"><i aria-hidden="true">⚑</i>{pick(TL.noPages)}<em>{pick(TL.noPages2)}</em></span>
      </div>
    </div>
  );
}
// Выбор новой страницы: поле AI, поиск по шаблонам, «Пустая страница», «Собрать страницу из готовых блоков».
function TNewPage({ onPick, led, off }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-newpage" translate="no">
      <TAccBar />
      <div className="tl-np-top">
        <i className="tl-np-x" aria-hidden="true">✕</i>
        <b className="tl-np-h">{pick(TL.withAiA)} <em>✦AI</em></b>
        <div className={'tl-np-ai' + (off ? ' is-off' : '')} onClick={() => { if (!off) onPick('ai'); }} role="button" tabIndex={0}>
          <span>{pick(TL.aiPh)}</span>
          <span className="tl-np-ai-row"><i>+</i><i className="is-pill">MiMo-V2.6 Flash</i><i className="is-n">◷ 30</i><b>↑</b></span>
        </div>
        <span className="tl-np-ai-note">{pick(TL.aiNote)}</span>
      </div>
      <div className="tl-np-panel">
        <span className="tl-np-ph"><b>{pick(TL.templates)} <em>625</em></b><span className="tl-np-search">⌕ {pick(TL.tplSearch)}</span></span>
        <div className="tl-np-body">
          <span className="tl-np-cats">{TL.tplCats.map((t, i) => <span key={i} className={i === 0 ? 'is-on' : ''}>{pick(t)}</span>)}</span>
          <div className="tl-np-cards">
            <button type="button" className={'tl-np-card is-blank' + (led ? ' is-led' : '')} data-v="blank" disabled={off} onClick={() => onPick('blank')}>
              <span className="tl-np-pic"><TLogo cls="is-ghost" /></span><b>{pick(TL.blank)}</b>
            </button>
            <button type="button" className="tl-np-card" data-v="tpl" disabled={off} onClick={() => onPick('tpl')}>
              <span className="tl-np-pic is-tpl" aria-hidden="true"><i /><i /><i /><em>✦AI</em></span><b>{pick(TL.fromBlocks)}</b>
            </button>
            <span className="tl-np-card is-more" aria-hidden="true"><span className="tl-np-pic is-dark"><b>Заголовок вашего сайта</b><i /></span><b>Landing</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// «Мои сайты» после входа (как в настоящей Tilda на узком экране): «+ Создать новый сайт», карточка проекта, «РЕДАКТИРОВАТЬ САЙТ».
function TMySites({ name }) {
  const pick = usePick();
  return (
    <div className="tl-ed tl-mysites kz-a-drop" translate="no">
      <TAccBar />
      <div className="tl-ms-b">
        <span className="tl-ms-head"><em>{pick(TL.myProjects)}</em><span className="tl-ms-new"><i aria-hidden="true">+</i>{pick(TL.newSite)}</span><span className="tl-ms-new"><i aria-hidden="true">+</i>{pick(TL.more)}</span></span>
        <div className="tl-ms-grid">
          <div className="tl-ms-card"><b>{name}</b><span className="tl-ms-foot"><em>✎ {pick(TL.editSite)}</em><u>↗ https://{SITE_URL}</u></span></div>
          <div className="tl-ms-empty" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// Логотип Tilda: круг, буква T с волной сверху (как на tilda.cc).
function TLogo({ cls }) {
  return (
    <svg className={'tl-logo' + (cls ? ' ' + cls : '')} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M16 24 C19 19 24 18 28 21 C33 25 38 26 47 20" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M32 27 V50" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
    </svg>
  );
}
// Верхняя полоса аккаунта (чёрная): логотип, «Мои сайты», CRM, «Тарифы и оплата», «Профиль»; справа — «Справочный центр»,
// «Уроки и статьи», «Выйти» (на телефоне правой части нет, как на узком экране).
function TAccBar() {
  const pick = usePick();
  return (
    <div className="tl-acc">
      <TLogo cls="is-acc" />
      <b>{pick(TL.mySites)}</b><span>CRM</span><span className="tl-acc-x">{pick(TL.plans)}</span><span className="tl-acc-x">{pick(TL.profile)}</span>
      <span className="tl-acc-r"><span>{pick(TL.help)}</span><span>{pick(TL.lessons)}</span><span>{pick(TL.logout)}</span></span>
    </div>
  );
}
// Рисунок tilda.cc в её стиле (свой, не копия): серый фон, карточки с чёрной обводкой, точечные пятна, лососевые вставки,
// в центре — большой круг с логотипом.
function TArt() {
  return (
    <div className="tl-art" aria-hidden="true">
      <i className="a1" /><i className="a2" /><i className="a3" /><i className="a4" /><i className="a5" /><i className="d1" /><i className="d2" /><i className="d3" />
      <span className="tl-art-c"><TLogo cls="is-art" /></span>
    </div>
  );
}
// Комната за формой регистрации (на компьютере): светлая стена, полка с книгами, растения, лампа — простыми формами.
function TRoom() {
  return (
    <div className="tl-room" aria-hidden="true">
      <i className="shelf" /><i className="b1" /><i className="b2" /><i className="b3" /><i className="plant" /><i className="leaf1" /><i className="leaf2" /><i className="lamp" /><i className="desk" /><i className="tree" />
    </div>
  );
}
