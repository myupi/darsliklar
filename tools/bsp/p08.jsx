// =============================================================================
// ===== ПРАКТИКА 8 · «Robotlar ko'rgazmasi» · к уроку 8 «Карусель» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Страница выставки роботов кружка: фото выставки в карусели (баннеры урока 8, slayd1–3.jpg).
// При обновлении у карусели пропали слова — три фото встали столбиком, кнопки опустели, вкладки погасли. Ученик чинит пять
// страниц: значение data-bs-slide у правой кнопки (prev → next: кнопка листала назад) → вписать carousel-inner в пустой class
// (слайды в ряд) → взять карусель с сайта (Components → Carousel → Bottom controls), вставить и вписать свои файлы вместо «...»
// → починить имя версии 5 data-bs-ride (→ data-bs-autoplay="true") и data-bs-target без «#» → свой альбом: пустые class
// (carousel, carousel-inner), active на одном слайде, data-bs-target кнопок, строка script с сайта в конце body.
// Окно страницы — 480 px. Карусель в окне работает, как со скриптом Bootstrap, только при верной строке script (bp-kit).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-08p-karusel.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-08p-karusel',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "8-amaliyot. Robotlar ko'rgazmasi", ru: 'Практика 8. Выставка роботов', en: 'Practice 8. The robot show' }
};

// Фото выставки — баннеры урока 8 (те же рисунки: tools/bs8/bs8-kit.jsx), 480×200.
const P8_SVG_NS = 'http:' + '//' + 'www.w3.org/2000/svg';
const p8Svg = (w, h, inner) => 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='" + P8_SVG_NS + "' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + ' ' + h + "'>" + inner + '</svg>');
const P8_ROBOT = (x, y, k, c) => "<g transform='translate(" + x + ' ' + y + ') scale(' + k + ")'><line x1='60' y1='-6' x2='60' y2='-30' stroke='#475569' stroke-width='6'/><circle cx='60' cy='-34' r='9' fill='" + c + "'/>"
  + "<rect x='0' y='0' width='120' height='92' rx='22' fill='#E2E8F0' stroke='#475569' stroke-width='6'/><rect x='18' y='20' width='84' height='44' rx='14' fill='#1E293B'/><circle cx='42' cy='42' r='9' fill='#38BDF8'/><circle cx='78' cy='42' r='9' fill='#38BDF8'/>"
  + "<rect x='10' y='102' width='100' height='86' rx='18' fill='" + c + "' stroke='#475569' stroke-width='6'/><rect x='38' y='124' width='44' height='26' rx='6' fill='#FDE68A'/><circle cx='30' cy='202' r='16' fill='#334155'/><circle cx='90' cy='202' r='16' fill='#334155'/></g>";
const P8_FILES = {
  'slayd1.jpg': p8Svg(480, 200, "<rect width='480' height='200' fill='#CFFAFE'/><rect y='168' width='480' height='32' fill='#86EFAC'/><circle cx='410' cy='48' r='26' fill='#FDE68A'/>" + P8_ROBOT(205, 34, 0.6, '#0FA38E')),
  'slayd2.jpg': p8Svg(480, 200, "<rect width='480' height='200' fill='#EDE9FE'/><rect y='168' width='480' height='32' fill='#C4B5FD'/><rect x='40' y='60' width='90' height='70' rx='8' fill='#fff' stroke='#7c3aed' stroke-width='4'/><path d='M58 110l18-22 14 16 10-10 18 16' fill='none' stroke='#7c3aed' stroke-width='4'/>" + P8_ROBOT(250, 34, 0.6, '#7c3aed')),
  'slayd3.jpg': p8Svg(480, 200, "<rect width='480' height='200' fill='#FFEDD5'/><rect y='168' width='480' height='32' fill='#FDBA74'/><path d='M370 40l10 20 22 3-16 15 4 22-20-11-20 11 4-22-16-15 22-3z' fill='#FACC15'/>" + P8_ROBOT(160, 34, 0.6, '#FA4F28') + P8_ROBOT(260, 34, 0.6, '#0FA38E'))
};
const P8_PICS = ['slayd1.jpg', 'slayd2.jpg', 'slayd3.jpg'];

const P8 = {
  club: L3("Robotlar ko'rgazmasi", 'Выставка роботов', 'The robot show'),
  t1: L3("Tugmalar", 'Кнопки', 'Buttons'), t2: L3("Slaydlar", 'Слайды', 'Slides'), t3: L3("Ko'rgazma", 'Выставка', 'Show'), t4: L3("Avtomat", 'Автомат', 'Autoplay'),
  h1: L3("Ko'rgazmadan suratlar", 'Фото с выставки', 'Photos from the show'),
  h3: L3("Ko'rgazma kunlari", 'Дни выставки', 'Show days'),
  h4: L3("Ko'rgazma o'zi aylansin", 'Выставка листается сама', 'The show slides by itself'),
  mine: L3("Mening albomim", 'Мой альбом', 'My album'), myH: L3("Mening albomim", 'Мой альбом', 'My album')
};
const P8_ID = 'korgazma';
const P8_PRE = (pk, h) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h4>' + pk(h || P8.club) + '</h4>'];
const P8_POST = ['  ' + BP_SCRIPT, '</body>'];
// Карусель кружка, по частям (отступы: карусель — 2, обёртка слайдов и ряд кнопок — 4, слайды и кнопки — 6).
// o: { id, car — class карусели (false — без class), auto — data-bs-autoplay, ride — data-bs-ride (версия 5), inner, items — class
// слайдов, btnCls — class кнопок (строка или [prev, next]), tgt — data-bs-target кнопок, slides — data-bs-slide [левая, правая],
// icons — значки кнопок, ctl — class ряда кнопок, dots — data-bs-slide-to точек (null — без точек), dotsCls, dotOn }.
const P8_O = { id: P8_ID, car: 'carousel slide', auto: null, ride: false, inner: 'carousel-inner', items: ['carousel-item active', 'carousel-item', 'carousel-item'],
  btnCls: 'btn-icon btn-sm', tgt: '#' + P8_ID, slides: ['prev', 'next'], icons: true, ctl: 'd-flex align-items-center gap-3', dots: null, dotsCls: 'carousel-indicators', dotOn: true };
const p8c = (v) => (v === false ? '' : ' class="' + v + '"');
const p8x = (o) => Object.assign({}, P8_O, o || {});
const p8Open = (o) => { const x = p8x(o); return '  <div id="' + x.id + '"' + p8c(x.car) + (x.auto ? ' data-bs-autoplay="' + x.auto + '"' : '') + (x.ride ? ' data-bs-ride="carousel"' : '') + '>'; };
const p8Inner = (o) => { const x = p8x(o); return ['    <div' + p8c(x.inner) + '>'].concat(x.items.map((c, i) => '      <div' + p8c(c) + '><img src="' + P8_PICS[i] + '" class="d-block w-100" alt="Robot"></div>'), ['    </div>']); };
const p8Btns = (o) => {
  const x = p8x(o);
  const out = [];
  ['prev', 'next'].forEach((dir, k) => {
    const bc = Array.isArray(x.btnCls) ? x.btnCls[k] : x.btnCls;
    out.push('      <button' + p8c(bc) + ' data-bs-target="' + x.tgt + '" data-bs-slide="' + x.slides[k] + '">', '        <span' + p8c(x.icons ? 'carousel-icon-' + dir : false) + '></span>', '      </button>');
  });
  return out;
};
const p8Dots = (o) => { const x = p8x(o); return ['      <div' + p8c(x.dotsCls) + '>'].concat(x.dots.map((t, i) => '        <button data-bs-target="' + x.tgt + '" data-bs-slide-to="' + t + '"' + (i || !x.dotOn ? '' : ' class="active"') + '></button>'), ['      </div>']); };
const p8CtlOpen = (o) => '    <div' + p8c(p8x(o).ctl) + '>';
const p8Car = (o) => { const x = p8x(o); return [p8Open(x)].concat(p8Inner(x), [p8CtlOpen(x)], p8Btns(x), x.dots ? p8Dots(x) : [], ['    </div>', '  </div>']); };
// Пример с сайта (Components → Carousel → Bottom controls / Crossfade) — как в уроке 8: src="..." — место для своего файла.
const p8SiteItems = (rounded) => ['  <div class="carousel-inner' + (rounded ? ' rounded-5' : '') + '">'].concat([0, 1, 2].map((i) => ['    <div class="carousel-item' + (i ? '' : ' active') + '">', '      <img src="..." class="d-block w-100" alt="...">', '    </div>'].join('\n')), ['  </div>']);
const p8SiteBtn = (id, dir) => ['    <button class="btn-icon btn-sm" type="button" data-bs-target="#' + id + '" data-bs-slide="' + dir + '">', '      <span class="carousel-icon-' + dir + '" aria-hidden="true"></span>',
  '      <span class="visually-hidden">' + (dir === 'prev' ? 'Previous' : 'Next') + '</span>', '    </button>'];
const p8Site = (id, cls, rounded) => ['<div id="' + id + '" class="' + cls + '">'].concat(p8SiteItems(rounded), ['  <div>'], p8SiteBtn(id, 'prev'), p8SiteBtn(id, 'next'), ['  </div>', '</div>']).join('\n');
const P8_SITE_B = p8Site('carouselStackedBottom', 'carousel slide', true);
const P8_SITE_F = p8Site('carouselExampleFade', 'carousel carousel-fade', false);
const p8Mine = (txt, ind) => { let k = 0; return txt.split('\n').map((l) => ind + l.replace('src="..."', () => 'src="' + P8_PICS[k++ % 3] + '"')).join('\n'); };
const P8_FILES_CHIPS = { k: 'files', title: L3("Sizning fayllaringiz", 'Твои файлы', 'Your files'), chips: P8_PICS, copy: false };
const P8_DOCS_CAR = { page: L3("Components · Carousel", 'Components · Carousel', 'Components · Carousel'), items: [
  { k: 'bottom', title: 'Bottom controls · HTML', code: P8_SITE_B }, P8_FILES_CHIPS, { k: 'fade', title: 'Crossfade · HTML', code: P8_SITE_F }
] };
const P8_DOCS_FIX = { page: L3("Components · Carousel", 'Components · Carousel', 'Components · Carousel'), items: [
  { k: 'auto', title: 'Autoplay', chips: ['data-bs-autoplay="true"', 'data-bs-interval'], copy: false },
  { k: 'btn', title: 'Bottom controls', chips: ['btn-icon btn-sm', 'data-bs-target="#…"', 'data-bs-slide'], copy: false }
] };
const P8_DOCS_OWN = { page: L3("Install · Carousel", 'Install · Carousel', 'Install · Carousel'), items: [
  { k: 'js', title: 'CDN · JS', code: BP_SCRIPT },
  { k: 'car', title: 'Carousel', chips: ['carousel', 'slide', 'carousel-inner', 'carousel-item', 'active'], copy: false },
  { k: 'btn', title: 'Bottom controls', chips: ['data-bs-target="#albom"', 'data-bs-slide'], copy: false }
] };
// Проверки страницы: карусель, кнопки ведут к ней, фото на месте.
const p8Ok = (D) => !!D.q('.carousel > .carousel-inner > .carousel-item');
const p8Btns2 = (D) => D.qa('[data-bs-slide]');
const p8Tgt = (D) => { const car = D.q('.carousel'); const b = p8Btns2(D); return !!car && !!car.id && b.length >= 2 && b.every((x) => x.getAttribute('data-bs-target') === '#' + car.id); };
const p8Imgs = (D, sel) => D.qa((sel || '.carousel') + ' .carousel-item img');
const p8Dots3 = (src) => /src\s*=\s*["']\.\.\.["']/.test(src);

const PR = {
  next: L3("Menu va Dialog", 'Menu и Dialog', 'Menu and Dialog'),
  files: P8_FILES,
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P8.t1, file: 'tugmalar.html' },
    { ico: 'book', c: '#0FA38E', name: P8.t2, file: 'slaydlar.html' },
    { ico: 'rocket', c: '#7C5CFA', name: P8.t3, file: 'korgazma.html' },
    { ico: 'leaf', c: '#F59E0B', name: P8.t4, file: 'avtomat.html' },
    { ico: 'heart', c: '#E44D8A', name: P8.mine, file: 'albom.html' }
  ],
  // Крючок: карусель листается кнопками и точками; после «Yangilash» слов карусели нет — фото столбиком, кнопки пустые.
  hook: {
    vw: 480,
    doc: (pk, on) => P8_PRE(pk).concat(p8Car(on ? { dots: [0, 1, 2] } : { car: false, inner: false, items: [false, false, false], btnCls: false, icons: false, ctl: false, dots: [0, 1, 2], dotsCls: false, dotOn: false }), P8_POST).join('\n')
  },
  ownVw: 480,
  ownDefault: (pk) => P8_PRE(pk, P8.myH).concat(p8Car({ id: 'albom', tgt: '#albom' }), P8_POST).join('\n'),
  tasks: [
    // Т1 · значение data-bs-slide у правой кнопки: она листала назад (prev → next).
    (pk) => bpTask(1, {
      kind: 'change-word', vw: 480, pre: P8_PRE(pk, P8.h1).concat([p8Open()], p8Inner(), [p8CtlOpen()]), post: ['    </div>', '  </div>'].concat(P8_POST),
      code0: p8Btns({ slides: ['prev', 'prev'] }).join('\n'), answer: p8Btns().join('\n'),
      goal: (D) => { const b = D.q('.carousel-icon-next'); const btn = b && b.closest('button'); return btn && btn.getAttribute('data-bs-slide') === 'next' ? null : C.t1.no; },
      sample: ['<button … data-bs-slide="next">'],
      drill: { code0: p8Dots({ dots: [0, 1, 3] }).join('\n'), answer: p8Dots({ dots: [0, 1, 2] }).join('\n'),
        goal: (D) => (D.qa('[data-bs-slide-to]').map((x) => x.getAttribute('data-bs-slide-to')).join(',') === '0,1,2' ? null : C.t1.drillNo) }
    }),
    // Т2 · пустой class у обёртки слайдов: carousel-inner (слайды в ряд, виден один).
    (pk) => bpTask(2, {
      kind: 'write-class', vw: 480, pre: P8_PRE(pk, P8.h1).concat([p8Open()]), post: [p8CtlOpen()].concat(p8Btns(), ['    </div>', '  </div>'], P8_POST),
      code0: p8Inner({ inner: '' }).join('\n'), answer: p8Inner().join('\n'),
      goal: (D) => {
        if (p8Ok(D)) return null;
        if (D.q('.carousel > .carousel-item')) return C.t2.item;
        if (D.q('.carousel .carousel')) return C.t2.car;
        return C.t2.no;
      },
      sample: ['<div class="carousel-inner">', '  <div class="carousel-item active">…</div>'],
      drill: { code0: p8Inner({ items: ['carousel-item active', '', 'carousel-item'] }).join('\n'), answer: p8Inner().join('\n'),
        goal: (D) => (D.qa('.carousel-inner > .carousel-item').length === 3 ? null : C.t2.drillNo) }
    }),
    // Т3 · карусель с сайта (Components → Carousel → Bottom controls): скопировать, вставить, свои файлы вместо «...».
    (pk) => bpTask(3, {
      kind: 'copy-adapt', vw: 480, pre: P8_PRE(pk, P8.h3), post: P8_POST, docs: () => P8_DOCS_CAR,
      code0: '', answer: p8Mine(P8_SITE_B, '  '),
      goal: (D, st) => {
        if (!p8Ok(D)) return C.t3.noCar;
        const im = p8Imgs(D);
        if (im.length < 3) return C.t3.noCar;
        if (p8Dots3(st.code)) return C.t3.dots;
        return im.every((x) => x.naturalWidth > 0) ? null : C.t3.file;
      },
      sample: ['<div id="carouselStackedBottom" class="carousel slide">', '  …', '      <img src="slayd1.jpg" class="d-block w-100" alt="...">'],
      drill: { code0: '', answer: p8Mine(P8_SITE_F, '  '),
        goal: (D, st) => {
          const im = p8Imgs(D, '.carousel-fade');
          return im.length >= 3 && !p8Dots3(st.code) && im.every((x) => x.naturalWidth > 0) ? null : C.t3.drillNo;
        } }
    }),
    // Т4 · имя версии 5 и пропущенная решётка: data-bs-ride → data-bs-autoplay="true", data-bs-target="korgazma" → "#korgazma".
    (pk) => bpTask(4, {
      kind: 'fix', vw: 480, pre: P8_PRE(pk, P8.h4), post: P8_POST, docs: () => P8_DOCS_FIX,
      code0: p8Car({ ride: true, tgt: P8_ID }).join('\n'), answer: p8Car({ auto: 'true' }).join('\n'),
      goal: (D) => {
        if (D.q('[data-bs-ride]') || !D.q('.carousel[data-bs-autoplay="true"]')) return C.t4.auto;
        return p8Tgt(D) ? null : C.t4.tgt;
      },
      sample: ['<div id="korgazma" class="carousel slide" data-bs-autoplay="true">', '<button … data-bs-target="#korgazma" …>'],
      drill: { code0: p8Car({ auto: 'true', btnCls: ['carousel-control-prev', 'carousel-control-next'] }).join('\n'), answer: p8Car({ auto: 'true' }).join('\n'),
        goal: (D) => (p8Btns2(D).length >= 2 && p8Btns2(D).every((x) => x.classList.contains('btn-icon')) ? null : C.t4.drillNo) }
    }),
    // Т5 · свой альбом: carousel, carousel-inner, active на одном слайде, data-bs-target кнопок, строка script с сайта.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, vw: 480, pre: P8_PRE(pk, P8.myH), post: ['</body>'], docs: () => P8_DOCS_OWN,
      code0: p8Car({ id: 'albom', car: '', inner: '', items: ['carousel-item', 'carousel-item', 'carousel-item'], tgt: '' }).concat(['  ']).join('\n'),
      answer: p8Car({ id: 'albom', tgt: '#albom' }).concat(['  ' + BP_SCRIPT]).join('\n'),
      list: [
        { t: L3("carousel · carousel-inner", 'carousel · carousel-inner', 'carousel · carousel-inner'), ok: (D) => p8Ok(D) },
        { t: L3("active: bitta rasmda", 'active: на одном фото', 'active: on one photo'), ok: (D) => D.qa('.carousel-item.active').length === 1 },
        { t: L3("tugmalar: data-bs-target", 'кнопки: data-bs-target', 'buttons: data-bs-target'), ok: (D) => p8Tgt(D) },
        { t: L3("script: body oxirida", 'script: в конце body', 'script: end of body'), ok: (D) => D.script.ok && D.script.atEnd }
      ],
      goal: (D) => {
        if (!D.q('.carousel')) return C.t5.car;
        if (!p8Ok(D)) return C.t5.inner;
        const n = D.qa('.carousel-item.active').length;
        if (!n) return C.t5.active;
        if (n > 1) return C.t5.active2;
        if (!p8Tgt(D)) return C.t5.tgt;
        if (!D.script.tag) return FB.noScript;
        if (!D.script.atEnd) return FB.scriptPlace;
        return null;
      },
      sample: ['<div id="albom" class="carousel slide">', '  <div class="carousel-inner">', '    <div class="carousel-item active">…</div>', '<button … data-bs-target="#albom" …>', BP_SCRIPT],
      onSolved: (st) => store.set('myDoc', P8_PRE(pk, P8.myH).concat([st.code.replace(/\s+$/, '')], ['</body>']).join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Robotlar ko'rgazmasi", 'Выставка роботов', 'The robot show'),
    say: L3("Salom! Bu to'garakning ko'rgazma sahifasi. Suratlar karuselda turibdi. Karusel, ya'ni aylanadigan rasmlar degani: tugma yoki nuqtani bosing, keyingi surat chiqadi. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это страница выставки нашего кружка. Фото стоят в карусели, то есть в листающихся картинках: нажми кнопку или точку, появится следующее фото. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is our club’s show page. The photos sit in a carousel, a set of sliding pictures: tap a button or a dot and the next photo appears. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda karusel so'zlari o'chib ketdi. Uchala surat ustma-ust tizilib qoldi, tugmalar bo'shab qoldi, varaqlar o'chdi.",
      'Ой! При обновлении стёрлись слова карусели. Все три фото встали друг под другом, кнопки опустели, вкладки погасли.',
      'Oh no! The update erased the carousel words. All three photos lined up one under another, the buttons went empty, and the tabs went dark.'),
    done: L3("Kodga qarang: teglar joyida, lekin karusel so'zlari yo'q. Darsdagi topishmoq esingizdami? Karusel uchun uzun JavaScript yozish shart emas: class so'zlari, data-bs atributlari va script qatori yetadi. Beshta sahifani birma-bir tuzatamiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: теги на месте, а слов карусели нет. Помнишь загадку урока? Для карусели не нужно писать длинный JavaScript: хватит слов в class, атрибутов data-bs и строки script. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: the tags are in place, but the carousel words are gone. Remember the lesson’s riddle? A carousel doesn’t need long JavaScript: class words, data-bs attributes and the script line are enough. Let’s fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifadagi karuselni tiklaymiz", 'Восстановим карусель на пяти страницах', 'Let’s restore the carousel on five pages')
  },
  t1: {
    eyebrow: L3("Tugmalar", 'Кнопки', 'Buttons'),
    say: L3("Birinchi sahifa: tugmalar. O'ngdagi tugmani bosib ko'ring: u oldinga emas, orqaga suradi! Men ikkala tugmaga bir xil so'z yozib qo'yibman. O'ng tugmaning so'zini almashtiring.",
      'Первая страница: кнопки. Нажми правую кнопку: она листает не вперёд, а назад! Я написал обеим кнопкам одно и то же слово. Замени слово у правой кнопки.',
      'The first page is the buttons. Tap the right button: it slides back instead of forward! I gave both buttons the same word. Change the right button’s word.'),
    ask: L3("O'ng tugma oldinga sursin", 'Пусть правая кнопка листает вперёд', 'Make the right button slide forward'),
    ok: L3("Zo'r! Endi o'ng tugma oldinga, chap tugma orqaga suradi. Bosib tekshiring!", 'Здорово! Теперь правая кнопка листает вперёд, а левая назад. Понажимай!', 'Great! Now the right button goes forward and the left one goes back. Give them a tap!'),
    hints: [
      L3("Ikkinchi tugmaning data-bs-slide qiymatiga qarang. U qayoqqa surishni aytadi.", 'Посмотри на значение data-bs-slide у второй кнопки. Оно говорит, куда листать.', 'Look at the second button’s data-bs-slide value. It says which way to slide.'),
      L3("prev oldingi degani, next esa keyingi degani. O'ng tugmaga next yozing.", 'prev — это предыдущий, а next — следующий. Правой кнопке напиши next.', 'prev means previous, and next means next. Write next on the right button.'),
      L3("Namuna kod ostida. Xuddi shunday o'ng tugmaga yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши правой кнопке и нажми «Проверить».', 'The example is under the code. Write it on the right button the same way and tap Check.')
    ],
    no: L3("O'ng tugma hali orqaga suradi. Uning data-bs-slide qiymati next bo'lsin.", 'Правая кнопка всё ещё листает назад. Пусть её data-bs-slide будет next.', 'The right button still slides back. Make its data-bs-slide next.'),
    drill: L3("endi uchinchi nuqtani tuzating", 'теперь почини третью точку', 'now fix the third dot'),
    drillNo: L3("Nuqtalar noldan sanaladi: birinchisi nol, ikkinchisi bir, uchinchisi ikki.", 'Точки считают с нуля: первая — ноль, вторая — один, третья — два.', 'The dots count from zero: the first is zero, the second is one, the third is two.')
  },
  t2: {
    eyebrow: L3("Slaydlar", 'Слайды', 'Slides'),
    say: L3("Ikkinchi sahifa: slaydlar. Uchala surat yana ustma-ust turibdi. Suratlarni o'rab turgan quti class qiymati bo'sh. Darsda qaysi so'z ularni bir qatorga terib, faqat bittasini ko'rsatgan edi?",
      'Вторая страница: слайды. Все три фото снова стоят друг под другом. У коробки, которая обнимает фото, пустой class. Какое слово на уроке ставило их в один ряд и показывало только одно?',
      'The second page is the slides. All three photos stand one under another again. The box around the photos has an empty class. Which word in the lesson put them in one row and showed just one?'),
    ask: L3("Suratlar bir qatorga tizilsin", 'Пусть фото встанут в один ряд', 'Put the photos in one row'),
    ok: L3("Ajoyib! Suratlar qatorda, oynada bittasi ko'rinadi. Tugmalar bilan aylantirib ko'ring!", 'Отлично! Фото в ряд, в окне видно одно. Полистай кнопками!', 'Great! The photos are in a row and one shows in the window. Slide them with the buttons!'),
    hints: [
      L3("carousel ichida yana bitta quti bor. U slaydlarni o'rab turadi.", 'Внутри carousel есть ещё одна коробка. Она обнимает слайды.', 'Inside carousel there’s one more box. It wraps the slides.'),
      L3("Bu quti carousel-inner, ya'ni karuselning ichi degani. Shu so'zni bo'sh class ichiga yozing.", 'Эта коробка — carousel-inner, то есть внутренность карусели. Впиши это слово в пустой class.', 'That box is carousel-inner, the inside of the carousel. Write that word in the empty class.'),
      L3("Namuna kod ostida. Xuddi shunday so'zni yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такое же слово и нажми «Проверить».', 'The example is under the code. Write the same word and tap Check.')
    ],
    no: L3("Suratlar hali ustma-ust. Ularni o'rab turgan qutiga carousel-inner kerak.", 'Фото всё ещё друг под другом. Коробке, которая их обнимает, нужно carousel-inner.', 'The photos are still stacked. The box around them needs carousel-inner.'),
    item: L3("carousel-item bitta slayd uchun. Slaydlarni o'rab turgan quti esa carousel-inner.", 'carousel-item — это один слайд. А коробка, которая обнимает слайды, — carousel-inner.', 'carousel-item is one slide. The box that wraps the slides is carousel-inner.'),
    car: L3("carousel tashqi quti, u allaqachon bor. Ichki qutiga carousel-inner yozing.", 'carousel — внешняя коробка, она уже есть. Внутренней коробке напиши carousel-inner.', 'carousel is the outer box, and it’s already there. Write carousel-inner on the inner box.'),
    drill: L3("endi ikkinchi slaydni tuzating", 'теперь почини второй слайд', 'now fix the second slide'),
    drillNo: L3("Ikkinchi slaydning class qiymati bo'sh. Har bir slaydga carousel-item kerak.", 'У второго слайда пустой class. Каждому слайду нужно carousel-item.', 'The second slide’s class is empty. Every slide needs carousel-item.')
  },
  t3: {
    eyebrow: L3("Ko'rgazma", 'Выставка', 'Show'),
    say: L3("Uchinchi sahifa: ko'rgazma kunlari. Bu yerda karusel umuman yo'q. Bootstrap saytidagi Bottom controls namunasini nusxalang va qo'ying. Saytdagi misolda rasm nomi o'rnida uch nuqta turadi: ularning o'rniga o'z fayllaringiz nomini yozing.",
      'Третья страница: дни выставки. Здесь карусели совсем нет. Скопируй пример Bottom controls с сайта Bootstrap и вставь. В примере вместо имени картинки стоят три точки: напиши вместо них имена своих файлов.',
      'The third page is the show days. There’s no carousel here at all. Copy the Bottom controls example from the Bootstrap site and paste it. In the example, three dots stand in place of the picture names: write your own file names instead.'),
    ask: L3("Saytdan karusel oling", 'Возьми карусель с сайта', 'Take a carousel from the site'),
    ok: L3("Qoyil! Saytdagi karusel endi sizning suratlaringiz bilan!", 'Вот это да! Карусель с сайта теперь с твоими фото!', 'Wow! The site’s carousel now has your photos!'),
    hints: [
      L3("Saytdagi Bottom controls kodi yonida nusxalash belgisi bor. Uni bosing, keyin Qo'yish tugmasini.", 'Рядом с кодом Bottom controls на сайте есть значок копирования. Нажми его, потом «Вставить».', 'Next to the Bottom controls code on the site there’s a copy icon. Tap it, then Paste.'),
      L3("Qo'yilgan kodda uchta img tegi bor, src ichida uch nuqta. Ularning o'rniga slayd1.jpg, slayd2.jpg va slayd3.jpg deb yozing.", 'Во вставленном коде три тега img, в src — три точки. Напиши вместо них slayd1.jpg, slayd2.jpg и slayd3.jpg.', 'The pasted code has three img tags with three dots in src. Write slayd1.jpg, slayd2.jpg and slayd3.jpg instead.'),
      L3("Namuna kod ostida. Xuddi shunday uchala rasmga fayl nomini yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши имя файла всем трём картинкам и нажми «Проверить».', 'The example is under the code. Write a file name for all three pictures the same way and tap Check.')
    ],
    noCar: L3("Sahifada karusel hali yo'q. Saytdan Bottom controls namunasini nusxalang va qo'ying.", 'На странице пока нет карусели. Скопируй пример Bottom controls с сайта и вставь.', 'There’s no carousel on the page yet. Copy the Bottom controls example from the site and paste it.'),
    dots: L3("Suratlar singan: src ichida hali uch nuqta turibdi. Fayllar ro'yxatidan nomlarni yozing.", 'Фото сломаны: в src ещё стоят три точки. Напиши имена из списка файлов.', 'The photos are broken: src still has three dots. Write the names from the file list.'),
    file: L3("Bitta surat chiqmadi: fayl nomini tekshiring. Fayllar ro'yxatiga qarang, nom oxirigacha yoziladi.", 'Одно фото не появилось: проверь имя файла. Посмотри в список файлов, имя пишут до конца.', 'One photo didn’t show: check the file name. Look at the file list; the name is written in full.'),
    drill: L3("endi saytdan Crossfade namunasini oling", 'теперь возьми с сайта пример Crossfade', 'now take the Crossfade example from the site'),
    drillNo: L3("Crossfade namunasini nusxalang, qo'ying va uch nuqta o'rniga fayl nomlarini yozing.", 'Скопируй пример Crossfade, вставь и напиши имена файлов вместо трёх точек.', 'Copy the Crossfade example, paste it and write the file names instead of the three dots.')
  },
  t4: {
    eyebrow: L3("Avtomat", 'Автомат', 'Autoplay'),
    say: L3("To'rtinchi sahifa: bu karusel o'zi aylanishi kerak edi. Lekin men kodni eski darslikdan ko'chiribman: suratlar joyidan qimirlamaydi, tugmalar ham ishlamaydi. Kodda ikkita xato bor. Topib, tuzating.",
      'Четвёртая страница: эта карусель должна листаться сама. Но я списал код из старого учебника: фото стоят на месте, и кнопки не работают. В коде две ошибки. Найди и почини.',
      'The fourth page: this carousel was supposed to slide by itself. But I copied the code from an old tutorial: the photos don’t move and the buttons don’t work. There are two mistakes in the code. Find and fix them.'),
    ask: L3("Avtomat va tugmalarni tuzating", 'Почини автопрокрутку и кнопки', 'Fix the autoplay and the buttons'),
    ok: L3("Zo'r ish! Karusel o'zi aylanyapti, tugmalar ham ishlayapti!", 'Отличная работа! Карусель листается сама, и кнопки работают!', 'Nice work! The carousel slides by itself, and the buttons work too!'),
    hints: [
      L3("Karuselning birinchi qatoriga va tugmalardagi data-bs-target qiymatiga qarang.", 'Посмотри на первую строку карусели и на значение data-bs-target у кнопок.', 'Look at the carousel’s first line and at the buttons’ data-bs-target value.'),
      L3("data-bs-ride eski nom: o'rniga data-bs-autoplay yozing, qiymati true, ya'ni yoqiq degani. Tugmalarda esa id oldiga panjara qo'ying.", 'data-bs-ride — старое имя: вместо него data-bs-autoplay со значением true. А кнопкам поставь решётку перед id.', 'data-bs-ride is an old name: use data-bs-autoplay with the value true instead. And put a hash before the id on the buttons.'),
      L3("Namuna kod ostida. Xuddi shunday ikkala xatoni tuzating va Tekshirishni bosing.", 'Образец под кодом. Так же исправь обе ошибки и нажми «Проверить».', 'The example is under the code. Fix both mistakes the same way and tap Check.')
    ],
    auto: L3("Karusel hali o'zi aylanmayapti. Bootstrap 6 da buni data-bs-autoplay qiladi, qiymati true.", 'Карусель пока не листается сама. В Bootstrap 6 это делает data-bs-autoplay со значением true.', 'The carousel doesn’t slide by itself yet. In Bootstrap 6 that’s data-bs-autoplay with the value true.'),
    tgt: L3("Tugmalar karuselni topmayapti. data-bs-target da panjara va karusel id si turishi kerak.", 'Кнопки не находят карусель. В data-bs-target должны стоять решётка и id карусели.', 'The buttons can’t find the carousel. data-bs-target needs a hash and the carousel’s id.'),
    drill: L3("endi tugmalarning eski so'zini ham tuzating", 'теперь почини и старое слово у кнопок', 'now fix the buttons’ old word too'),
    drillNo: L3("carousel-control-prev va carousel-control-next eski nomlar. Tugmalarga btn-icon va btn-sm yozing.", 'carousel-control-prev и carousel-control-next — старые имена. Напиши кнопкам btn-icon и btn-sm.', 'carousel-control-prev and carousel-control-next are old names. Give the buttons btn-icon and btn-sm.')
  },
  t5: {
    eyebrow: L3("Mening albomim", 'Мой альбом', 'My album'),
    say: L3("Beshinchi sahifa sizniki: o'z albomingiz! Suratlar tayyor, lekin karusel hali yig'ilmagan: class qiymatlari bo'sh, tugmalar karuselni bilmaydi, script qatori ham yo'q. Ro'yxatdagi to'rtta shartni bajaring. Albom qaysi suratdan boshlanishini o'zingiz tanlang.",
      'Пятая страница твоя: свой альбом! Фото готовы, но карусель ещё не собрана: class пустые, кнопки не знают карусель, и строки script нет. Выполни четыре условия из списка. С какого фото начнётся альбом, выбери сам.',
      'The fifth page is yours: your own album! The photos are ready, but the carousel isn’t built yet: the classes are empty, the buttons don’t know the carousel, and there’s no script line. Meet the four conditions on the list. Choose for yourself which photo the album starts with.'),
    ask: L3("O'z karuselingizni yig'ing", 'Собери свою карусель', 'Build your own carousel'),
    ok: L3("Vau, haqiqiy karusel! Endi istalgan suratlarni Bootstrap bilan aylantira olasiz!", 'Вау, настоящая карусель! Теперь любые фото ты пролистаешь на Bootstrap!', 'Wow, a real carousel! Now you can slide any photos with Bootstrap!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart. Oldin tashqi qutiga carousel slide, ichki qutiga carousel-inner yozing.", 'Посмотри на список: четыре условия. Сначала напиши внешней коробке carousel slide, а внутренней — carousel-inner.', 'Look at the list: four conditions. First write carousel slide on the outer box and carousel-inner on the inner one.'),
      L3("Keyin bitta suratga active qo'shing. Tugmalarga data-bs-target: panjara va albom. Oxirida saytdan script qatorini nusxalab, bo'sh qatorga qo'ying.", 'Потом добавь active одному фото. Кнопкам — data-bs-target: решётка и albom. В конце скопируй с сайта строку script и вставь в пустую строку.', 'Then add active to one photo. Give the buttons data-bs-target: a hash and albom. Finally, copy the script line from the site and paste it into the empty line.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z karuselingizni yig'ing va Tekshirishni bosing.", 'Образец под кодом. Собери свою карусель в таком же порядке и нажми «Проверить».', 'The example is under the code. Build your carousel in the same order and tap Check.')
    ],
    car: L3("Tashqi qutiga carousel so'zi kerak.", 'Внешней коробке нужно слово carousel.', 'The outer box needs the word carousel.'),
    inner: L3("Suratlar hali qatorda emas. Ichki qutiga carousel-inner kerak.", 'Фото ещё не в ряд. Внутренней коробке нужно carousel-inner.', 'The photos aren’t in a row yet. The inner box needs carousel-inner.'),
    active: L3("Albom qaysi suratdan boshlanadi? Bitta slaydga active qo'shing.", 'С какого фото начнётся альбом? Добавь active одному слайду.', 'Which photo does the album start with? Add active to one slide.'),
    active2: L3("active bir nechta slaydda turibdi. Boshlanadigan surat bitta bo'ladi.", 'active стоит у нескольких слайдов. Начальное фото одно.', 'active is on several slides. There’s only one starting photo.'),
    tgt: L3("Tugmalar karuselni topmayapti. data-bs-target ga panjara va albom deb yozing.", 'Кнопки не находят карусель. Напиши в data-bs-target решётку и albom.', 'The buttons can’t find the carousel. Write a hash and albom in data-bs-target.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma karusellar yana aylanyapti! Qarang, bu sizning albomingiz.", 'Все карусели снова листаются! Смотри, это твой альбом.', 'All the carousels slide again! Look, this is your album.') },
      { k: 'a', text: L3("Karusel uchta qutidan iborat: carousel, ichida carousel-inner, unda har bir surat carousel-item.", 'Карусель — это три коробки: carousel, внутри carousel-inner, а в ней каждое фото — carousel-item.', 'A carousel is three boxes: carousel, inside it carousel-inner, and in that each photo is a carousel-item.') },
      { k: 'b', text: L3("active boshlanadigan suratni ko'rsatadi, u bitta bo'ladi.", 'active показывает начальное фото, оно одно.', 'active marks the starting photo, and there’s only one.') },
      { k: 'c', text: L3("Tugmaga data-bs-slide va data-bs-target kerak, data-bs-target da esa panjara va karusel id si turadi.", 'Кнопке нужны data-bs-slide и data-bs-target, а в data-bs-target стоят решётка и id карусели.', 'A button needs data-bs-slide and data-bs-target, and data-bs-target holds a hash and the carousel’s id.') },
      { k: 'd', text: L3("Tugmalarni script qatori ishlatadi. data-bs-ride esa eski nom, o'zi aylanishi uchun data-bs-autoplay.", 'Кнопки оживляет строка script. А data-bs-ride — старое имя, чтобы листалась сама, нужно data-bs-autoplay.', 'The script line brings the buttons to life. And data-bs-ride is an old name: for autoplay use data-bs-autoplay.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda menyu va oyna yasaymiz: ular ham tugma bosilganda ochiladi. Ko'rishguncha!", 'Поздравляю! На следующем уроке сделаем меню и окно: они тоже открываются по нажатию кнопки. До встречи!', 'Congratulations! Next lesson we’ll build a menu and a dialog: they also open when you tap a button. See you!') }
    ],
    roles: {
      a: L3("carousel · inner · item", 'carousel · inner · item', 'carousel · inner · item'),
      b: L3("active: boshlanish", 'active: начало', 'active: the start'),
      c: L3("data-bs-target: #id", 'data-bs-target: #id', 'data-bs-target: #id'),
      d: L3("script va autoplay", 'script и autoplay', 'script and autoplay')
    },
    ask: L3("Albomingizni aylantirib ko'ring", 'Полистай свой альбом', 'Slide through your album')
  }
};
