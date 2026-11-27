// Практика 4 «Путешествие Коди», ЧАСТЬ 2: сайты в интернете и своя ссылка (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Википедия» без https — «Fayl topilmadi»), два новых задания по темам части 2 урока (т1 — полный адрес
// https://… в href, т2 — дописать потерянное https:// в готовой строке), прежнее т3 (абзац «Keyingi shahar: Buxoro» со
// ссылкой внутри, страница Samarqand) и прежнее «своё» (т4, бывшее т5: h1, p и ссылка — на страницу сайта или на сайт в
// интернете). Вывод — прежний Fin с четырьмя вкладками (правки в build-prac), речь и плашки — новые.
// Честный браузер знает несколько сайтов: Википедия на языке урока, Google, YouTube, wikipedia.org; другое имя сайта —
// «Saytni ochib bo'lmadi»; адрес без https:// браузер ищет среди файлов нашего сайта — «Fayl topilmadi».

// ── Карта части 2: четыре страницы (вкладки). ──
Object.assign(A4_ICO, {
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></>
});
TABS.splice(0, TABS.length,
  { id: 'web', file: 'saytlar.html', ico: 'globe', c: '#7C5CFA', name: L3("Foydali saytlar", 'Полезные сайты', 'Useful sites') },
  { id: 'find', file: 'qidiruv.html', ico: 'search', c: '#F59E0B', name: L3("Qidiruv", 'Поиск', 'Search') },
  { id: 'sam', file: 'samarqand.html', ico: 'dome', c: '#0FA38E', name: CITY.samarqand },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening sahifam", 'Моя страница', 'My page') }
);

// ── Сайты в интернете, которые знает браузер задания: адрес, имя на ссылке, подпись заглушки. ──
const same3 = (s) => L3(s, s, s);
const HTTPS = 'https:' + '//';   // адрес — данные, не речь (в реплики он не попадает)
const EXT = {
  wiki: { url: { uz: HTTPS + 'uz.wikipedia.org', ru: HTTPS + 'ru.wikipedia.org', en: HTTPS + 'en.wikipedia.org' }, name: L3("Vikipediya", 'Википедия', 'Wikipedia'),
    sub: L3("Erkin ensiklopediya", 'Свободная энциклопедия', 'The free encyclopedia') },
  portal: { url: same3('https://www.wikipedia.org'), name: L3("Vikipediya", 'Википедия', 'Wikipedia'), sub: L3("Erkin ensiklopediya", 'Свободная энциклопедия', 'The free encyclopedia') },
  google: { url: same3('https://www.google.com'), name: same3('Google'), sub: L3("Qidiruv tizimi", 'Поисковая система', 'Search engine') },
  youtube: { url: same3('https://www.youtube.com'), name: same3('YouTube'), sub: L3("Videolar sayti", 'Сайт с видео', 'A video site') }
};
// Адрес для сравнения: без пробелов и «/» в конце, регистр не важен; http:// браузер сам переводит на https://.
const a4WebKey = (f) => String(f || '').trim().replace(/\/+$/, '').toLowerCase().replace(/^http:\/\//, 'https://');
const a4WebOk = (h) => /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(a4WebKey(h));
const a4Host = (url) => String(url).replace(/^https?:\/\//, '');
// Что показывает браузер по адресу из ссылки: заглушка известного сайта; другое имя — «Saytni ochib bo'lmadi».
function a4ExtShown(file, pick) {
  const wk = a4WebKey(file);
  if (!/^https:\/\//.test(wk)) return null;
  const E = Object.keys(EXT).map((k) => EXT[k]).find((e) => LANGS.some((l) => a4WebKey(e.url[l]) === wk));
  if (E) return { title: pick(E.name), blocks: a4Page('<h1>' + pick(E.name) + '</h1><p>' + pick(E.sub) + '</p>').blocks, url: file, web: true };
  return { title: pick(UI.nr), blocks: a4Page('<h1>' + pick(UI.nr) + '</h1><p>' + pick(UI.nrText) + '</p>').blocks, url: file, nf: true };
}
// Адрес похож на имя сайта без https (есть точка, это не .html) — причина про https; иначе — как раньше, про файл.
function a4HrefMiss(h) {
  const s = String(h || '').trim();
  if (/^[^\s/]+\.[a-z]{2,}$/i.test(s) && !/\.html?$/i.test(s)) return FB.webNoProto;
  return fillL(FB.fileNo, { got: h });
}

Object.assign(UI, {
  addrProto: L3("internetga yo'l", 'путь в интернет', 'the way to the internet'),
  addrHost: L3("sayt nomi", 'имя сайта', 'site name'),
  noTagsWeb: L3("Bu yerga faqat manzilni yozing: qo'shtirnoq, probel va burchakli qavslar kerak emas.", 'Здесь нужен только адрес: без кавычек, пробелов и уголков.', 'Only the address here: no quotes, spaces or angle brackets.'),
  nr: L3("Saytni ochib bo'lmadi", 'Не удаётся открыть сайт', 'This site can’t be reached'),
  nrText: L3("Bunday sayt topilmadi. Sayt nomini tekshiring.", 'Такой сайт не найден. Проверь имя сайта.', 'No such site found. Check the site name.'),
  bpA: L3("havola: href va manzil", 'ссылка: href и адрес', 'link: href and an address')
});
Object.assign(NOT_SPOKEN_IN, { roles: { a: 1, val: 1, web: 1, own: 1 } });

// Страницы заданий 1 и 2: содержимое над ссылкой.
const P2 = {
  findP: L3("Savolingiz bormi? Internetdan qidiring.", 'Есть вопрос? Поищи в интернете.', 'Got a question? Search the internet.')
};

// ── Фразы проверки новых заданий (без слов ученика: в них нет плейсхолдеров). ──
Object.assign(FB, {
  webNoProto: L3("Manzilning boshi tushib qolibdi: unda https yo'q. Usiz brauzer internetga chiqmaydi, faylni o'z saytimizdan qidiradi. Manzilni https, ikki nuqta va ikkita qiya chiziq bilan boshlang.",
    'В начале нет https. Без него браузер не выходит в интернет и ищет файл на нашем сайте. Начни адрес с https, двоеточия и двух косых черт.',
    'There’s no https at the start. Without it the browser doesn’t go online and looks for a file on our site. Start the address with https, a colon and two slashes.'),
  webFile: L3("Bu bizning saytdagi fayl nomi. Bu yerga internetdagi saytning to'liq manzili kerak, u https bilan boshlanadi.",
    'Это имя файла нашего сайта. Здесь нужен полный адрес сайта в интернете, он начинается с https.',
    'That’s a file name from our site. Here you need the full address of a site on the internet, and it starts with https.'),
  webColon: L3("https so'zi joyida, lekin uning ortidagi belgilarni bir tekshirib ko'ring: oldin ikki nuqta, keyin ikkita qiya chiziq turadi.",
    'После https идут двоеточие и две косые черты. Проверь их.',
    'After https come a colon and two slashes. Check them.'),
  webNoHost: L3("Boshlanishi joyida, sayt nomi esa yozilmay qolibdi. Uni ikkita qiya chiziqdan keyin yozing: nomi pastda turibdi.",
    'Начало есть, а имя сайта не дописано. Напиши его после двух косых черт: оно записано внизу.',
    'The start is there, but the site name isn’t finished. Write it after the two slashes: it’s written below.'),
  webTypo: L3("Sayt nomi pastda yozilgandan ozgina farq qilyapti. Harfma-harf solishtirib ko'ring.",
    'Имя сайта чуть отличается от того, что написано внизу. Сравни буква в букву.',
    'The site name differs a little from the one written below. Compare it letter by letter.'),
  webOther: L3("Bu boshqa saytning manzili. Bizga pastda yozilgan sayt kerak.",
    'Это адрес другого сайта. Нужен тот, что написан внизу.',
    'That’s the address of another site. We need the one written below.'),
  webPath: L3("Manzil keragidan uzun chiqdi. Sayt nomining o'zi yetadi: oxiriga hech narsa qo'shmang.",
    'Адрес получился длиннее. Хватит одного имени сайта: ничего не дописывай в конце.',
    'The address came out longer. The site name alone is enough: don’t add anything at the end.'),
  webSame: L3("Manzil hali o'sha-o'sha turibdi: brauzer uni fayl deb qidiryapti. Boshiga yetishmagan qismni qo'shing.",
    'Адрес пока прежний: браузер ищет его как файл. Допиши в начало то, чего не хватает.',
    'The address is still the same: the browser looks for it as a file. Add what’s missing at the start.')
});

// Проверка адреса: null — всё верно; иначе одна причина. wantUrl — полный адрес («https://uz.wikipedia.org»).
function a4WebIssue(v, wantUrl) {
  const s = a4Squash(v);
  if (!s) return FB.emptyHref;
  const k = a4WebKey(s);
  const want = a4WebKey(wantUrl);
  if (k === want) return null;
  if (!/^https?/i.test(s)) return SITE_FILES.indexOf(s) >= 0 ? FB.webFile : FB.webNoProto;
  if (!/^https?:\/\//i.test(s)) return FB.webColon;
  const host = k.replace(/^https:\/\//, '');
  const wh = want.replace(/^https:\/\//, '');
  if (!host) return FB.webNoHost;
  if (host.indexOf(wh + '/') === 0) return FB.webPath;
  if (a4Dist(host, wh) <= 2) return FB.webTypo;
  return FB.webOther;
}
function a4WebFieldCheck(v, wantUrl) {
  const s = a4Squash(v);
  if (!s) return { ok: false, msg: FB.emptyHref };
  if (/[<>"'=\s]/.test(s)) return { ok: false, msg: UI.noTagsWeb };
  const m = a4WebIssue(s, wantUrl);
  return m ? { ok: false, msg: m } : { ok: true };
}
// Строка-ссылка целиком (т2): <a href="…">слова</a>, адрес — полный адрес нужного сайта.
function a4WebLineCheck(code, start, wantUrl, wantText) {
  if (a4Squash(code) === a4Squash(start)) return { ok: false, msg: FB.webSame };
  const toks = lexA4(code);
  const bad = a4Bad(toks) || a4Outer(toks);
  if (bad) return { ok: false, msg: bad };
  const g = a4Group(toks);
  if (g.msg) return { ok: false, msg: g.msg };
  const L = g.list;
  if (!L.length) return { ok: false, msg: FB.empty };
  const t0 = L[0];
  if (t0.k === 'close') return { ok: false, msg: a4Fb('closeStray', { got: t0.name }) };
  if (t0.k === 'open') return { ok: false, msg: a4Fb('wrongOpen', { tag: 'a', got: t0.name }) };
  if (L.length > 1) return { ok: false, msg: a4Fb('extra', { got: L[1].raw || '' }) };
  if (!t0.links.length) return { ok: false, msg: a4Fb('needOpenText', { tag: 'a' }) };
  const ln = t0.links[0];
  if (ln.href === undefined) return { ok: false, msg: FB.noHref };
  const m = a4WebIssue(ln.href, wantUrl);
  if (m) return { ok: false, msg: m };
  if (a4Norm(t0.v) !== a4Norm(ln.text)) return { ok: false, msg: a4Fb('textAfter', { tag: 'a' }) };
  if (a4Norm(ln.text) !== a4Norm(wantText)) return { ok: false, msg: fillL(FB.linkText, { got: ln.text, want: wantText }) };
  return { ok: true };
}

// ── Подпись адреса: из двух частей — https:// («путь в интернет») и имя сайта. ──
function A4Addr({ host }) {
  const pick = usePick();
  return (
    <div className="a4-slots a4-addr" translate="no">
      <span className="a4-slot" style={{ '--pc': '#7C5CFA' }}><b>1</b><code>https://</code><em>{pick(UI.addrProto)}</em></span>
      <span className="a4-slot" style={{ '--pc': '#0FA38E' }}><b>2</b><code>{host}</code><em>{pick(UI.addrHost)}</em></span>
    </div>
  );
}

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Sayohat saytida to'rtta sahifani tuzatdik, yana to'rttasi navbatda. Lekin oldin bir sinov: menyuga ikkita havola qo'ydim, Samarqand va Vikipediya. Vikipediyani bosib ko'ring-chi, nima bo'larkin?",
      'Привет! Четыре страницы сайта мы починили, ещё четыре ждут. Но сначала маленький опыт: я добавил в меню две ссылки, Самарканд и Википедию. Нажми «Википедия»: что будет?',
      'Hi! We fixed four pages of the trip site, and four more are waiting. But first, a little experiment: I added two links to the menu, Samarkand and Wikipedia. Tap “Wikipedia”: what will happen?'),
    broke: L3("Voy, «Fayl topilmadi» chiqdi! Samarqand ochiladi-ku, Vikipediya esa yo'q. Havola ham joyida, manzil ham yozilgan. Nimadir yetishmayapti shekilli.",
      'Ой, «Файл не найден»! Самарканд открывается, а Википедия нет. И ссылка на месте, и адрес написан. Чего-то не хватает.',
      'Oh no, “File not found”! Samarkand opens, but Wikipedia doesn’t. The link is in place and the address is written. Something’s missing.'),
    done: L3("Brauzer «Fayl topilmadi» dedi. Demak, u Vikipediyani internetdan emas, o'z saytimizdan qidirgan ekan. Nega shunday qildi? Buni to'rtta sahifada tuzatib topamiz, oxirgisida esa o'z sahifangizni yozasiz.",
      'Браузер сказал «Файл не найден». Значит, он искал Википедию не в интернете, а на нашем сайте. Почему так вышло? Разберёмся на четырёх страницах, а на последней ты напишешь свою.',
      'The browser said “File not found”. So it looked for Wikipedia on our own site, not on the internet. Why did it do that? We’ll figure it out on four pages, and on the last one you’ll write your own.'),
    ask: L3("Vikipediya havolasini bosing", 'Нажми ссылку «Википедия»', 'Tap the “Wikipedia” link'),
    askDone: L3("Samarqand ochildi, Vikipediya esa ochilmadi", 'Самарканд открылся, Википедия нет', 'Samarkand opened, Wikipedia didn’t')
  },
  t1: {
    eyebrow: L3("Foydali saytlar", 'Полезные сайты', 'Useful sites'),
    say: L3("Endi Vikipediya havolasini tuzatamiz! Birinchi sahifa: foydali saytlar. Samarqand havolasi o'z saytimizda ishlaydi, Vikipediyaning manzili esa bo'sh. Qo'shtirnoq ichiga to'liq manzilni yozing: oldin https, keyin ikki nuqta va ikkita qiya chiziq, oxirida sayt nomi. Sayt nomi pastda yozib qo'yilgan.",
      'Теперь починим ссылку на Википедию! Первая страница: полезные сайты. Ссылка на Самарканд ведёт на наш сайт, а у ссылки «Википедия» адрес пустой. Впиши в кавычки полный адрес: сначала https, потом двоеточие и две косые черты, потом имя сайта. Имя сайта написано внизу.',
      'Now let’s fix the Wikipedia link! First page: useful sites. The Samarkand link leads to our own site, but the “Wikipedia” link has an empty address. Type the full address in the quotes: first https, then a colon and two slashes, then the site name. The site name is written below.'),
    ask: L3("href ichiga to'liq manzilni yozing", 'Впиши в href полный адрес', 'Type the full address in href'),
    ok: L3("Vikipediya havolasi ishlayapti! https brauzerga «internetga chiq» deb aytdi. Bosib ko'ring!",
      'Работает! Начало https сказало браузеру: выходи в интернет. Нажми!',
      'It works! The https start told the browser to go online. Tap it!'),
    hints: [
      L3("Boshqa saytga to'liq manzil kerak. U qaysi so'z bilan boshlanadi? Pastdagi plashkalarga qarang.",
        'Для другого сайта нужен полный адрес. С какого слова он начинается? Посмотри на плашки внизу.',
        'Another site needs a full address. Which word does it start with? Look at the chips below.'),
      L3("Manzil ikki bo'lakdan iborat: oldin https, ikki nuqta va ikkita qiya chiziq, keyin sayt nomi. Ikkalasini ham ketma-ket, probelsiz yozing.",
        'Адрес состоит из двух частей: сначала https, двоеточие и две косые черты, потом имя сайта. Напиши обе подряд, без пробелов.',
        'The address has two parts: first https, a colon and two slashes, then the site name. Write both in a row, with no spaces.'),
      L3("Mana, Google havolasi shunday yoziladi: boshida https, oxirida sayt nomi. Siz ham Vikipediya uchun shunday yozing.",
        'Вот ссылка на Google: в начале https, в конце имя сайта. Напиши так же для Википедии.',
        'Here’s a link to Google: https at the start, the site name at the end. Write the Wikipedia one the same way.')
    ],
    drill: L3("Endi YouTube havolasi: manzilini yozing", 'Теперь ссылка на YouTube: впиши адрес', 'Now the YouTube link: type the address')
  },
  t2: {
    eyebrow: L3("Qidiruv", 'Поиск', 'Search'),
    say: L3("Vikipediya ishladi, endi keyingi sahifa: qidiruv. Bu yerda Google havolasi bor, lekin u ham «Fayl topilmadi» deb turibdi. Sayt nomi manzilda bor-ku, boshi esa tushib qolibdi. Havolani bosib ko'ring, keyin manzilni tuzating.",
      'Википедия заработала, теперь страница с поиском. Здесь есть ссылка на Google, но и она показывает «Файл не найден». Имя сайта в адресе есть, а начало потерялось. Нажми на ссылку, потом поправь адрес.',
      'Wikipedia works, so now the search page. It has a link to Google, but it also says “File not found”. The site name is in the address, but the beginning got lost. Tap the link, then fix the address.'),
    ask: L3("Manzilni tuzating: yetishmagan boshini qo'shing", 'Почини адрес: допиши потерянное начало', 'Fix the address: add the missing start'),
    ok: L3("Google havolasi ochildi! Esingizdami: boshqa saytga to'liq manzil kerak, boshida https bilan. Bosib ko'ring!",
      'Заработало! Для чужого сайта нужен полный адрес, в начале с https. Нажми!',
      'It works! A site that isn’t ours needs a full address, with https at the start. Tap it!'),
    hints: [
      L3("Havola ko'k, lekin bossangiz brauzer fayl qidiradi. Boshqa saytga olib boradigan manzilning boshida nima turishi kerak edi?",
        'Ссылка синяя, но браузер ищет файл. С чего должен начинаться адрес, который ведёт на чужой сайт?',
        'The link is blue, but the browser looks for a file. What should the address that leads to another site start with?'),
      L3("Sayt nomi joyida, faqat uning oldiga https, ikki nuqta va ikkita qiya chiziq yetishmayapti. Ularni qo'shtirnoq ichida sayt nomidan oldin yozing.",
        'Имя сайта на месте, а перед ним не хватает https, двоеточия и двух косых черт. Допиши их в кавычках перед именем сайта.',
        'The site name is in place, but before it https, a colon and two slashes are missing. Add them in the quotes before the site name.'),
      L3("Mana, YouTube havolasi to'g'ri yozilgan: sayt nomidan oldin https bor. Google uchun ham shunday qiling.",
        'Вот правильная ссылка на YouTube: перед именем сайта стоит https. Сделай так же для Google.',
        'Here’s a correct link to YouTube: https comes before the site name. Do the same for Google.')
    ],
    drill: L3("Endi Vikipediya havolasi: manzilni tuzating", 'Теперь ссылка на Википедию: почини адрес', 'Now the Wikipedia link: fix the address')
  }
});
// Своё — бывшее задание 5: тексты те же, номер страницы и первая фраза — четвёртые; ссылка — на страницу сайта или на сайт.
C.t4 = Object.assign({}, C.t5, {
  say: L3("Uchta sahifa joyida, endi to'rtinchisi: sizniki! Eng tepaga h1 tegida sarlavha yozing. Keyin abzas bo'lsin, ichida esa havola: saytimizdagi biror sahifaga yoki internetdagi saytga. Fayl nomlari yoningizda turibdi.",
    'Три страницы горят! Теперь четвёртая: твоя страница. Здесь есть только body. В самом верху напиши заголовок в теге h1. Потом абзац, а в нём ссылку: на страницу нашего сайта или на сайт в интернете. Имена файлов рядом.',
    'Three pages are lit! Now the fourth: your page. There’s only body here. At the very top, write a heading in the h1 tag. Then a paragraph with a link inside it: to a page of our site or to a site on the internet. The file names are right there.'),
  hints: [
    C.t5.hints[0],
    L3("href qiymati ro'yxatdagi fayl nomi bo'ladi. Internetdagi sayt uchun esa https bilan boshlanadigan to'liq manzil kerak.",
      'В открывающем теге a должен быть href: имя файла из списка или полный адрес сайта, который начинается с https.',
      'The opening a tag needs href: a file name from the list, or the full address of a site that starts with https.'),
    C.t5.hints[2]
  ]
});
// Вывод: речь и плашки части 2 (подписи плашек a · имя файла · https · своя страница; строка задания — прежняя).
const FIN_OLD = C.fin;
C.fin = Object.assign({}, FIN_OLD, {
  say: [
    { k: 'all', text: L3("Qarang, sayohat saytining hamma sahifalari tayyor: foydali saytlar, qidiruv, Samarqand va sizning sahifangiz. Endi sayt o'zimizdagi sahifalarga ham, internetga ham yo'l ochib turibdi!",
      'Смотри, все страницы сайта о путешествии готовы: полезные сайты, поиск, Самарканд и твоя страница. Теперь сайт ведёт и на свои страницы, и в интернет!',
      'Look, all the pages of the trip site are ready: useful sites, search, Samarkand and your page. Now the site leads both to its own pages and to the internet!') },
    { k: 'a', text: L3("Havola doim a tegida yashaydi: o'z sahifamizga ham, boshqa saytga ham.",
      'Ссылка всегда живёт в теге a: и на страницу нашего сайта, и на чужой сайт.',
      'A link always lives in the a tag, whether it goes to a page of our site or to another site.') },
    { k: 'val', text: L3("O'z saytimizdagi sahifaga fayl nomining o'zi yetadi, abzas ichida ham shunday ishlaydi.",
      'Для страницы нашего сайта хватает имени файла, и внутри абзаца ссылка тоже работает.',
      'For a page of our site, the file name is enough, and a link works inside a paragraph too.') },
    { k: 'web', text: L3("Boshqa saytga esa to'liq manzil kerak: https, ikki nuqta, ikkita qiya chiziq va sayt nomi. Boshi bo'lmasa, brauzer faylni o'z saytimizdan qidirib, «Fayl topilmadi» deydi.",
      'А для чужого сайта нужен полный адрес: https, двоеточие, две косые черты и имя сайта. Без начала браузер ищет файл у нас и пишет «Файл не найден».',
      'But another site needs the full address: https, a colon, two slashes and the site name. Without the start, the browser looks for a file on our site and says “File not found”.') },
    { k: 'own', text: L3("Sahifangiz ham sayohat saytiga ulandi, bu zo'r chiqdi! Keyingi darsda sahifaga rasm qo'shamiz.",
      'А в конце твоя страница тоже в сайте. Это было мощно! На следующем уроке добавим на страницу картинку.',
      'And at the end your page is part of the site too. That was awesome! Next lesson we’ll add a picture to the page.') }
  ],
  roles: {
    a: L3("a — havola", 'a — ссылка', 'a — link'),
    val: L3("fayl nomi — o'z saytimiz", 'имя файла — наш сайт', 'file name — our site'),
    web: L3("https — boshqa sayt", 'https — другой сайт', 'https — another site'),
    own: L3("Sahifam saytda", 'Моя страница в сайте', 'My page is on the site')
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т1 · поле в строке: полный адрес сайта в пустом href (ссылка на Википедию). Над ней — рабочая ссылка на свою страницу.
// ─────────────────────────────────────────────────────────────────────────────
function a4WebFieldView(ext, first) {
  return (st, x) => {
    const v = st.v || '';
    const name = x.pick(TABS[0].name);
    const url = x.pick(ext.url);
    const link1 = '<li><a href="' + first + '.html">' + x.pick(CITY[first]) + '</a></li>';
    const code = '<ul>' + link1 + '<li><a href="' + v + '">' + x.pick(ext.name) + '</a></li></ul>';
    const lines = [
      { k: 'ul', parts: [T_('ul')] },
      { k: 'f', d: 1, parts: [a4Parts(link1, 'f')] },
      { k: 'w', d: 1, cls: x.solved ? 'is-new' : 'is-hl', parts: [
        a4Parts('<li>', 'o'),
        <span key="ah" className="a4-g"><span className="a4-b">&lt;</span><span className="a4-n">a</span><span className="a4-a"> href="</span></span>,
        x.solved ? <span key="v" className="a4-a">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={40}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a4-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="az" className="a4-g"><span className="a4-a">"</span><span className="a4-b">&gt;</span></span>,
        <span key="t" className="a4-t">{x.pick(ext.name)}</span>,
        a4Parts('</a></li>', 'c')
      ] },
      { k: 'ulc', parts: [T_('ul', true)] }
    ];
    return {
      title: name, blocks: a4Page(code).blocks,
      aid: <A4Addr host={a4Host(url)} />,
      editor: <div className="a4-fieldwrap"><KzCode cls="a4-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgY1 = (pick) => ({
  id: 't1', num: 1, kind: 'write-web-address', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a4WebFieldCheck(st.v, pick(EXT.wiki.url)),
  view: a4WebFieldView(EXT.wiki, 'samarqand'),
  sample: (pk) => ['<a href="' + pk(EXT.google.url) + '">' + pk(EXT.google.name) + '</a>'],
  drill: { init: () => ({ v: '' }), check: (st) => a4WebFieldCheck(st.v, pick(EXT.youtube.url)), view: a4WebFieldView(EXT.youtube, 'toshkent') }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 · найти и исправить: готовая строка-ссылка с именем сайта без https:// — в браузере «Fayl topilmadi». Дописать начало.
// ─────────────────────────────────────────────────────────────────────────────
function a4WebFixView(ext) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(TABS[1].name) + '</h1>', '  <p>' + x.pick(P2.findP) + '</p>'];
    const after = ['</body>'];
    return {
      title: x.pick(TABS[1].name), blocks: a4Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A4Addr host={a4Host(x.pick(ext.url))} />,
      editor: <A4Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={before.length}
        onChange={(c) => x.set({ code: c })} />,
      syms: ['/', ':']
    };
  };
}
const a4WebStart = (pick, ext) => '  <a href="' + a4Host(pick(ext.url)) + '">' + pick(ext.name) + '</a>';
const cfgY2 = (pick) => {
  const s1 = a4WebStart(pick, EXT.google);
  const s2 = a4WebStart(pick, EXT.portal);
  return {
    id: 't2', num: 2, kind: 'fix-web-address', C: C.t2, cls: 't2 a4-web',
    init: () => ({ code: s1 }),
    check: (st) => a4WebLineCheck(st.code, s1, pick(EXT.google.url), pick(EXT.google.name)),
    view: a4WebFixView(EXT.google),
    sample: (pk) => ['<a href="' + pk(EXT.youtube.url) + '">' + pk(EXT.youtube.name) + '</a>'],
    drill: { init: () => ({ code: s2 }), check: (st) => a4WebLineCheck(st.code, s2, pick(EXT.portal.url), pick(EXT.portal.name)), view: a4WebFixView(EXT.portal) }
  };
};

// Т4 · своё — прежнее задание 5 (h1 и p со ссылкой): номер 4, тексты C.t4; страница в целой практике — пятая, здесь
// четвёртая (TABS[4] → TABS[3] правит build-prac); красится правилами .a4-t5.
const cfgY4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, C: C.t4, cls: 't5' });

const Y1 = ({ p }) => <A4Task p={p} make={cfgY1} />;
const Y2 = ({ p }) => <A4Task p={p} make={cfgY2} />;
const Y4 = ({ p }) => <A4Task p={p} make={cfgY4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: страница с двумя ссылками — Samarqand (файл сайта) и Vikipediya (имя сайта без https). Ссылки
// нажимаются: Samarqand открывается, а «Vikipediya» — «Fayl topilmadi». Одно касание — нажать «Vikipediya».
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const [rec, put] = useRec('h2');
  const broke = !!(rec && rec.done);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: broke ? c.done : c.say, pose: broke ? 'point' : 'wonder' }]);
  const canGo = useAdvanceGate(broke, spoken);
  const tabs = useA4Tabs(true);
  const nav = useA4Nav('index.html', 'h2');
  const host = a4Host(pick(EXT.wiki.url));
  const name = pick(SITE['index.html'].title);
  const lines = ['<h1>' + name + '</h1>', '<ul>', '  <li><a href="samarqand.html">' + pick(CITY.samarqand) + '</a></li>', '  <li><a href="' + host + '">' + pick(EXT.wiki.name) + '</a></li>', '</ul>'];
  const onNav = (href) => {
    nav.go(href);
    if (broke || a4WebKey(href) !== a4WebKey(host)) return;
    sfx('soft', true);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const shown = a4Shown(nav, { title: name, blocks: a4Page(lines.join('\n')).blocks, url: 'index.html' }, pick);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a4-sheet a4-s1 a4-h2">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a4-work">
          <div className="a4-side">
            <A4Browser tabs={tabs} cur={0} title={shown.title} pageHl={!broke && !nav.away} url={shown.url} onBack={nav.back} cls={shown.nf ? 'is-nf' : ''}>
              <A4Doc blocks={shown.blocks} onNav={onNav} />
            </A4Browser>
          </div>
          <div className="a4-main">
            <A4Code lines={lines} mark={broke ? 3 : null} />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
