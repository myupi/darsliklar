// Практика 5 «Зоопарк Коди», ЧАСТЬ 2: картинка из интернета и своя страница (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Открыть папку»: картинки пингвина нет в нашей папке — она на сайте kodi.uz), два новых задания по
// темам части 2 урока (t1 полный адрес картинки в src — поле в строке; t2 найти адрес без https и починить),
// прежнее т3 «картинка и абзац» (жираф, как было) и прежнее «своё» (t4, бывшее т5: h1, img и p; картинка — из нашей
// папки или с kodi.uz). Вывод — прежний Fin с четырьмя вкладками и новой речью.
// Картинки с сайта kodi.uz: адрес «https + kodi.uz + / + файл» (как в уроке 5, часть 2); без https браузер ищет
// файл в нашей папке — значок сломанной картинки. Рисунки — три «фото» животных (их нет среди файлов папки).
// Начало адреса (https, двоеточие, две косые черты) собирается кодом, готовых адресов картинок в тексте файла нет: так хочет валидатор IT (R04).

// ── Карта части 2: четыре страницы (вкладки). ──
TABS.splice(0, TABS.length,
  { id: 'pingvin', file: 'pingvin.html', ico: 'heart', c: '#F59E0B', name: L3("Pingvin", 'Пингвин', 'Penguin') },
  { id: 'flamingo', file: 'flamingo.html', ico: 'paw', c: '#FA4F28', name: L3("Flamingo", 'Фламинго', 'Flamingo') },
  { id: 'jirafa', file: 'jirafa.html', ico: 'sun', c: '#0FA38E', name: ANIMAL.jirafa.name },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening sahifam", 'Моя страница', 'My page') }
);

// ── Сайт kodi.uz: адрес картинки и три «фото». ──
const W5_PROTO = 'https:' + '/' + '/';
const W5_HOST = 'kodi.uz';
const W5_FILES = ['pingvin.jpg', 'maymun.jpg', 'flamingo.jpg'];
const w5Url = (f) => W5_PROTO + W5_HOST + '/' + f;
Object.assign(ANIMAL, {
  pingvin: { name: L3("Pingvin", 'Пингвин', 'Penguin'), fact: L3("Pingvin uchmaydi, lekin juda yaxshi suzadi.", 'Пингвин не летает, зато отлично плавает.', 'A penguin can’t fly, but it swims very well.') },
  maymun: { name: L3("Maymun", 'Обезьяна', 'Monkey'), fact: L3("Maymun daraxtlarga chaqqon chiqadi.", 'Обезьяна ловко лазает по деревьям.', 'A monkey climbs trees quickly.') },
  flamingo: { name: L3("Flamingo", 'Фламинго', 'Flamingo'), fact: L3("Flamingo bir oyog'ida uxlaydi.", 'Фламинго спит на одной ноге.', 'A flamingo sleeps on one leg.') }
});
const PicPingvin = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#E3F2FD" /><rect y="90" width="160" height="20" fill="#F5FBFF" />
    <ellipse cx="52" cy="66" rx="7" ry="20" fill="#1F2937" transform="rotate(14 52 66)" /><ellipse cx="108" cy="66" rx="7" ry="20" fill="#1F2937" transform="rotate(-14 108 66)" />
    <ellipse cx="80" cy="64" rx="27" ry="34" fill="#1F2937" /><circle cx="80" cy="34" r="19" fill="#1F2937" /><ellipse cx="80" cy="70" rx="17" ry="25" fill="#fff" />
    <circle cx="73" cy="32" r="4.6" fill="#fff" /><circle cx="87" cy="32" r="4.6" fill="#fff" /><circle cx="74" cy="33" r="2.2" fill="#1F2937" /><circle cx="86" cy="33" r="2.2" fill="#1F2937" />
    <path d="M74 41 L86 41 L80 49 Z" fill="#F59E0B" /><ellipse cx="68" cy="99" rx="9" ry="4" fill="#F59E0B" /><ellipse cx="92" cy="99" rx="9" ry="4" fill="#F59E0B" />
  </svg>
);
const PicMaymun = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FFF3E0" /><rect y="92" width="160" height="18" fill="#B7DFA4" />
    <path d="M134 110 V42 M124 72 L134 64" stroke="#8D6E63" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="46" cy="58" r="11" fill="#8D5524" /><circle cx="114" cy="58" r="11" fill="#8D5524" /><circle cx="46" cy="58" r="6" fill="#E0A878" /><circle cx="114" cy="58" r="6" fill="#E0A878" />
    <circle cx="80" cy="54" r="32" fill="#8D5524" /><ellipse cx="80" cy="63" rx="22" ry="19" fill="#F1C27D" />
    <circle cx="70" cy="50" r="3.6" fill="#1F2937" /><circle cx="90" cy="50" r="3.6" fill="#1F2937" /><ellipse cx="80" cy="60" rx="4" ry="2.6" fill="#7C4A1C" />
    <path d="M70 69 Q80 77 90 69" stroke="#7C4A1C" strokeWidth="2.4" fill="none" strokeLinecap="round" /><path d="M16 98 Q30 84 44 98" stroke="#FDD835" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);
const PicFlamingo = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FFF0F5" /><rect y="88" width="160" height="22" fill="#BBDEFB" />
    <path d="M86 78 V100 M84 100 H92" stroke="#EC6C98" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="86" cy="62" rx="30" ry="18" fill="#F48FB1" /><path d="M110 56 Q130 60 126 70" stroke="#EC6C98" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M66 54 C48 46 52 26 62 22" stroke="#F48FB1" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="66" cy="19" r="9" fill="#F48FB1" /><path d="M70 16 L84 20 L72 25 Z" fill="#1F2937" /><circle cx="64" cy="17" r="2" fill="#1F2937" />
  </svg>
);
const W5_PICS = { 'pingvin.jpg': PicPingvin, 'maymun.jpg': PicMaymun, 'flamingo.jpg': PicFlamingo };
// Картинка с сайта kodi.uz — честно, как браузер: полный адрес с https и именем сайта; иначе значок сломанной картинки.
function a5WebPic(src) {
  const m = /^https:\/\/([^/]+)\/([^/]+)$/.exec(String(src || ''));
  return m && m[1] === W5_HOST ? W5_PICS[m[2]] || null : null;
}

Object.assign(UI, {
  openFolder: L3("Papkani ochish", 'Открыть папку', 'Open the folder'),
  ourFiles: L3("Bizning papka", 'Наша папка', 'Our folder'),
  noThere: L3("yo'q", 'нет', 'missing'),
  isThere: L3("bor", 'есть', 'found'),
  siteName: L3("sayt nomi", 'имя сайта', 'site name'),
  fileName: L3("fayl nomi", 'имя файла', 'file name'),
  siteL: L3("Sayt", 'Сайт', 'Site'),
  fileL: L3("Fayl", 'Файл', 'File')
});

// ── Фразы проверки новых заданий. Слово ученика — в метках U+2063…U+2064 (не в озвучку). ──
Object.assign(FB, {
  emptyUrl: L3("src ichi hali bo'm-bo'sh. Unga rasmning to'liq manzilini yozing.", 'Впиши в src полный адрес картинки.', 'Type the picture’s full address in src.'),
  noProto: L3("Manzilning boshida https yo'q. Usiz brauzer rasmni o'zimizning papkadan izlaydi, topolmay, buzilgan rasm belgisini qo'yadi. Manzilni https, ikki nuqta va ikkita qiya chiziq bilan boshlang.",
    'В начале адреса нет https. Без него браузер ищет картинку в нашей папке, и она ломается. Начни адрес с https, двоеточия и двух косых черт.',
    'There’s no https at the start of the address. Without it the browser looks for the picture in our folder, and it breaks. Start the address with https, a colon and two slashes.'),
  httpOnly: L3("Manzil http bilan boshlangan, oxirida s yo'q. Bizning sayt faqat https bilan ochiladi, shuning uchun manzilni https bilan boshlang.",
    'Адрес начинается с http, без буквы s. Наш сайт открывается только с https, поэтому начни адрес с https.',
    'The address starts with http, without the letter s. Our site opens only with https, so start the address with https.'),
  colon: L3("https so'zining ortida ikki nuqta va ikkita qiya chiziq turishi kerak. Shu belgilarni bir tekshirib chiqing.", 'После https идут двоеточие и две косые черты. Проверь их.', 'After https come a colon and two slashes. Check them.'),
  noSlash: L3("Sayt nomi bilan fayl nomining o'rtasida qiya chiziq turishi kerak.", 'Между именем сайта и именем файла стоит косая черта.', 'There’s a slash between the site name and the file name.'),
  urlTypo: L3("Sayt nomi yoki fayl nomi boshqacha yozilibdi. Ikkalasini ham harfma-harf tekshirib ko'ring.", 'Имя сайта или имя файла написано иначе. Проверь оба буква в букву.', 'The site name or the file name is written differently. Check both letter by letter.'),
  webNo: L3("kodi.uz saytida bunday rasm yo'q: ⁣«{got}»⁤. Fayl nomini yoningizdagi yozuvdan harfma-harf ko'chirib yozing.", 'На сайте kodi.uz нет такой картинки: ⁣«{got}»⁤. Спиши имя файла с подсказки рядом буква в букву.', 'There’s no such picture on kodi.uz: ⁣“{got}”⁤. Copy the file name from the hint next to it, letter by letter.'),
  keepAlt: L3("alt atributiga tegmang, u o'zi to'g'ri. Faqat manzilning boshiga https qo'shing.", 'alt не трогай, он в порядке. Допиши только начало адреса: https.', 'Leave alt alone, it’s fine. Just add the start of the address: https.')
});

// Проверка полного адреса картинки: null — верно; иначе одна причина. file — нужный файл (null — любой из трёх).
function w5UrlIssue(v, file) {
  const n = a5Squash(v).replace(/^["'«“]+|["'»”]+$/g, '');
  if (!n) return FB.emptyUrl;
  if (file ? n === w5Url(file) : (/^https:\/\/kodi\.uz\/[^/]+$/.test(n) && W5_FILES.indexOf(n.split('/').pop()) >= 0)) return null;
  if (/^https:\/\/kodi\.uz\/[^/]+$/.test(n)) {   // адрес по правилам, но файл не тот или такого нет
    const f = n.split('/').pop();
    return W5_FILES.indexOf(f) < 0 ? fillL(FB.webNo, { got: f }) : fillL(FB.imgOther, { got: f, want: file });
  }
  if (/^http:\/\//.test(n)) return FB.httpOnly;
  if (/^https:\/\//.test(n)) return n.slice(8).indexOf('/') < 0 ? FB.noSlash : FB.urlTypo;
  if (/^h?t?t?ps?(?=[:/])/.test(n) || /^https?$/.test(n)) return FB.colon;
  return FB.noProto;
}
// Картинка в коде (для своей страницы): своя из папки или адрес с kodi.uz; alt — как у обычной картинки.
function w5ImgIssue(at) {
  const a = at || {};
  if (typeof a.src === 'string' && /^(https?:\/\/|kodi\.uz\/)/.test(a.src)) {
    const m = w5UrlIssue(a.src, null);
    if (m) return m;
    return a5ImgIssue(Object.assign({}, a, { src: IMG_FILES[0] }), null, true);
  }
  return a5ImgIssue(a, null, true);
}

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
const FIN_OLD = C.fin;   // подпись «Работа готова» и строка задания вывода — прежние
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Bog'imizning to'rtta sahifasini tuzatdik, yana to'rttasi navbatda. Mana, yangi sahifa: pingvin! Rasmning nomini to'g'ri yozdim, lekin rasm o'rnida yana buzilgan belgi turibdi. Nimaga deysizmi? Keling, papkamizni ochib ko'ramiz.",
      'Привет! Четыре страницы зоопарка мы починили, ещё четыре ждут. Вот новая страница: пингвин! Имя картинки я написал верно, а на её месте опять сломанный значок. Почему? Давай откроем нашу папку и посмотрим.',
      'Hi! We fixed four pages of the zoo, and four more are waiting. Here’s a new page: the penguin! I wrote the picture’s name right, but a broken icon is there again. Why? Let’s open our folder and see.'),
    broke: L3("Ko'rdingizmi? Papkamizda pingvin rasmi umuman yo'q ekan! U boshqa saytda, kodi.uz da turibdi.",
      'Видишь? В нашей папке картинки пингвина вообще нет! Она лежит на другом сайте, kodi.uz.',
      'See? There’s no penguin picture in our folder at all! It’s on another site, kodi.uz.'),
    done: L3("Demak, bu yerda fayl nomining o'zi yetmaydi: brauzer rasmni o'zimizning papkadan izlaydi va topa olmaydi. Boshqa saytdagi rasm uchun to'liq manzil kerak: https, sayt nomi, qiya chiziq va fayl nomi. Endi shuni to'rtta sahifada sinab ko'ramiz, oxirida esa o'z sahifangizni yozasiz.",
      'Выходит, одного имени файла тут мало: браузер ищет картинку в нашей папке и не находит. Для картинки с другого сайта нужен полный адрес: https, имя сайта, косая черта и имя файла. Проверим это на четырёх страницах, а в конце ты напишешь свою страницу.',
      'So the file name alone isn’t enough here: the browser looks for the picture in our folder and can’t find it. A picture from another site needs the full address: https, the site name, a slash and the file name. We’ll try it on four pages, and at the end you’ll write your own page.'),
    ask: L3("«Papkani ochish»ni bosing", 'Нажми «Открыть папку»', 'Tap “Open the folder”'),
    askDone: L3("Rasm bizning papkada emas, internetdagi saytda", 'Картинка лежит не в нашей папке, а на сайте', 'The picture isn’t in our folder, it’s on a site')
  },
  t1: {
    eyebrow: L3("Pingvin", 'Пингвин', 'Penguin'),
    say: L3("Pingvin sahifasidan boshlaymiz. Kodda img tegi bilan alt joyida turibdi, src ichi esa bo'sh. Pingvin rasmi kodi.uz saytida, shuning uchun src ichiga to'liq manzilni yozing: https, ikki nuqta, ikkita qiya chiziq, sayt nomi, yana qiya chiziq va fayl nomi. Sayt nomi bilan fayl nomi pastda yozib qo'yilgan.",
      'Начнём со страницы пингвина. В коде img и alt на месте, а src пустой. Картинка пингвина лежит на сайте kodi.uz, поэтому впиши в src полный адрес: https, двоеточие, две косые черты, имя сайта, ещё одна косая черта и имя файла. Имя сайта и имя файла написаны внизу.',
      'Let’s start with the penguin page. The img tag and alt are in place, but src is empty. The penguin picture lives on the kodi.uz site, so type the full address in src: https, a colon, two slashes, the site name, another slash and the file name. The site name and the file name are written below.'),
    ask: L3("src ichiga to'liq manzilni yozing", 'Впиши в src полный адрес картинки', 'Type the picture’s full address in src'),
    ok: L3("Pingvin internetdan suzib keldi! Brauzer rasmni kodi.uz saytidan to'ppa-to'g'ri topdi.",
      'Огонь! Пингвин приплыл из интернета: браузер нашёл картинку на сайте kodi.uz.',
      'Awesome! The penguin sailed in from the internet: the browser found the picture on kodi.uz.'),
    hints: [
      L3("Pingvin rasmi bizning papkada emas, boshqa saytda turibdi. Unga qanday manzil kerak?",
        'Эта картинка лежит не в нашей папке, а на другом сайте. Какой адрес ей нужен?',
        'This picture isn’t in our folder, it’s on another site. What kind of address does it need?'),
      L3("To'liq manzil https bilan boshlanadi, keyin ikki nuqta va ikkita qiya chiziq turadi. Undan keyin sayt nomi, qiya chiziq va fayl nomi keladi.",
        'Полный адрес начинается с https, потом двоеточие и две косые черты. Дальше идут имя сайта, косая черта и имя файла.',
        'A full address starts with https, then a colon and two slashes. Then come the site name, a slash and the file name.'),
      L3("https tugmasini bosing-da, kodi.uz deb yozing. Keyin qiya chiziq qo'yib, pingvin.jpg faylini yozing.",
        'Нажми кнопку https и напиши kodi.uz. Потом поставь косую черту и напиши файл pingvin.jpg.',
        'Tap the https button and type kodi.uz. Then add a slash and type the file pingvin.jpg.')
    ],
    drill: L3("Endi maymun: sayt kodi.uz, fayl maymun.jpg", 'Теперь обезьяна: сайт kodi.uz, файл maymun.jpg', 'Now the monkey: site kodi.uz, file maymun.jpg')
  },
  t2: {
    eyebrow: L3("Flamingo", 'Фламинго', 'Flamingo'),
    say: L3("Pingvin keldi! Endi flamingo sahifasi. Bu yerda ham rasm yo'q, faqat «Flamingo» degan so'z turibdi. Kodda rasm qatori bor, flamingoning fayli ham kodi.uz saytida turibdi. Demak, manzilda nimadir tushib qolgan. O'sha qatorni topib, ustiga bosing.",
      'Пингвин приплыл! Теперь страница фламинго. Тут тоже нет картинки, виден только текст «Фламинго». Строка с картинкой в коде есть, и файл фламинго лежит на сайте kodi.uz. Значит, в адресе чего-то не хватает. Найди эту строку и нажми на неё.',
      'The penguin is here! Now the flamingo page. There’s no picture here either, only the text “Flamingo”. The picture line is in the code, and the flamingo file is on kodi.uz. So something is missing from the address. Find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu manzilda sayt nomi turibdi-yu, boshida https yo'q. Shuning uchun brauzer flamingoni internetdan emas, o'zimizning papkadan izlayapti. Manzilning boshiga https yozing.",
      'Нашлась! В адресе есть имя сайта, а https в начале нет. Поэтому браузер ищет фламинго не в интернете, а в нашей папке. Допиши в начало адреса https.',
      'Found it! The address has the site name but no https at the start. That’s why the browser looks for the flamingo in our folder, not on the internet. Add https to the start of the address.'),
    ok: L3("Ana, flamingo ham qaytdi! Manzilning boshiga https qo'shdingiz, shuning uchun brauzer rasmni internetdan oldi.",
      'Ура, заработало! С https в начале адреса браузер взял картинку из интернета, и фламинго вернулся.',
      'Yes, it works! With https at the start of the address the browser took the picture from the internet, and the flamingo is back.'),
    why: {
      0: L3("Bu body qatori, flamingodan darak yo'q. Rasm qatoriga qarang-chi.", 'Здесь открывается body, строка в порядке. Посмотри на строку с картинкой.', 'body opens here, this line is fine. Look at the picture line.'),
      1: L3("Sarlavha ko'rinib turibdi, demak, h1 qatori butun. Rasmni boshqa qatordan qidiring.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      3: L3("Abzas o'z joyida, flamingo haqidagi gap ham ko'rinib turibdi. Rasm nega chiqmayapti-chi? Bir qator tepaga qarang.", 'Этот абзац в порядке. Почему нет картинки? Посмотри на строку выше.', 'This paragraph is fine. Why is there no picture? Look one line up.'),
      4: L3("body shu yerda yopiladi, bu qator ham butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Rasm kodi.uz saytida turibdi, lekin brauzer uni topa olmayapti. Manzilning boshiga qarang-chi: u qanday boshlanyapti?",
        'Картинка лежит на сайте kodi.uz, а браузер её не находит. Посмотри на начало адреса: с чего он начинается?',
        'The picture is on kodi.uz, but the browser can’t find it. Look at the start of the address: how does it begin?'),
      L3("Internetdagi rasmning manzili https bilan boshlanadi. Usiz brauzer fayl nomini o'zimizning papkadan izlaydi.",
        'Адрес картинки из интернета начинается с https. Без него браузер ищет файл в нашей папке.',
        'The address of a picture from the internet starts with https. Without it the browser looks for the file in our folder.'),
      L3("https tugmasini bosib, manzilning eng boshiga qo'ying. Namunadagi qatorga ham qarang.",
        'Нажми кнопку https и поставь её в самое начало адреса. Посмотри и на образец.',
        'Tap the https button and put it at the very start of the address. Look at the example too.')
    ],
    drill: L3("Bu yerda ham rasm yo'qolgan: qatorni toping va tuzating", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it'),
    d: {
      ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
      found: L3("Topdingiz! Bu manzilda ham boshida https yo'q. Uni manzilning boshiga yozing.", 'Нашлась! И здесь в начале адреса нет https. Допиши его.', 'Found it! There’s no https at the start of this address either. Add it.'),
      why: {
        0: L3("Bu body qatori, uning aybi yo'q. Rasm qatoriga qarang-chi.", 'Здесь открывается body, строка в порядке. Посмотри на строку с картинкой.', 'body opens here, this line is fine. Look at the picture line.'),
        1: L3("Sarlavha o'z teglari ichida turibdi, qator butun.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
        3: L3("Abzas joyida. Rasm nega chiqmayapti-chi? Bir qator tepaga qarang.", 'Этот абзац в порядке. Почему нет картинки? Посмотри на строку выше.', 'This paragraph is fine. Why is there no picture? Look one line up.'),
        4: L3("body shu yerda yopiladi, bu qator ham butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
      }
    }
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, bog'imizning qolgan sahifalari ham tayyor: pingvin, flamingo, jirafa va sizning hayvoningiz. Endi bog'ni mehmonlarga ochsak bo'ladi!",
        'Смотри, и остальные страницы зоопарка готовы: пингвин, фламинго, жираф и твоё животное. Теперь можно открывать зоопарк для гостей!',
        'Look, the other pages of the zoo are ready too: the penguin, the flamingo, the giraffe and your own animal. Now we can open the zoo to guests!') },
      { k: 'src', text: L3("Boshqa saytdagi rasm uchun src ichiga to'liq manzilni yozdingiz: https, sayt nomi, qiya chiziq va fayl nomi. O'zimizning papkadagi rasm uchun esa fayl nomining o'zi yetdi.",
        'Для картинки с другого сайта в src нужен был полный адрес: https, имя сайта, косая черта и имя файла. А для картинки из нашей папки хватало имени файла.',
        'For a picture from another site you wrote the full address in src: https, the site name, a slash and the file name. For a picture from our own folder the file name was enough.') },
      { k: 'src', text: L3("Flamingo sahifasida manzilning boshida https tushib qolgan edi. Usiz brauzer rasmni o'zimizning papkadan izlaydi va topa olmaydi.",
        'На странице фламинго в начале адреса не хватало https. Без него браузер ищет картинку в нашей папке и не находит.',
        'On the flamingo page the address was missing https at the start. Without it the browser looks for the picture in our folder and can’t find it.') },
      { k: 'img', text: L3("Jirafa sahifasida rasm tepada, uning tagida esa abzas turdi. Rasmni img tegi qo'yadi, abzasni esa p tegi yasaydi.",
        'На странице жирафа картинка стояла сверху, а под ней абзац. Картинку ставит тег img, а абзац тег p.',
        'On the giraffe page the picture came first and the paragraph went under it. The img tag adds the picture, and the p tag adds the paragraph.') },
      { k: 'alt', text: L3("Har bir rasmga alt ham yozdingiz: rasm ochilmay qolsa, sahifada aynan shu so'zlar turadi.",
        'У каждой картинки есть и alt: если фото не откроется, на странице останутся именно эти слова.',
        'You wrote alt for every picture too: if the photo doesn’t open, exactly these words stay on the page.') },
      { k: 'own', text: L3("Oxirida o'z hayvoningiz bilan sahifa yozdingiz, endi bog'imizda sevimli hayvoningiz ham yashaydi! Mehmonlar bog'ni baholashi kerak-ku: buning uchun anketa bo'lmasa bo'lmaydi.",
        'А в конце появилась страница с твоим животным. Это было мощно! На следующем уроке познакомимся с формами.',
        'And at the end you made a page with your own animal. That was awesome! Next lesson we’ll meet forms.') }
    ],
    roles: {
      img: L3("img — rasm", 'img — картинка', 'img — picture'),
      src: L3("src — fayl yoki manzil", 'src — файл или адрес', 'src — file or address'),
      alt: L3("alt — rasm haqida so'z", 'alt — слова о картинке', 'alt — words about the picture'),
      own: L3("Sahifamga rasm qo'ydim", 'Своя страница с картинкой', 'My page has a picture')
    },
    ask: FIN_OLD.ask
  }
});
// Своё — бывшее задание 5: h1, img и p; картинка — из нашей папки или с kodi.uz (полный адрес).
C.t4 = Object.assign({}, C.t5, {
  say: L3("Uchta sahifa tayyor! Endi to'rtinchisi: sizning sahifangiz. Bu yerda faqat body bor. Sevimli hayvoningizni tanlang: uning rasmi bizning papkada ham, kodi.uz saytida ham bo'lishi mumkin. Eng tepaga h1 tegi bilan nomini yozing, undan keyin img bilan rasmini qo'ying, oxirida esa p tegida u haqida bitta gap yozing. Rasmlar ro'yxati yoningizda, chizma esa yo'lingizni ko'rsatadi.",
    'Три страницы горят! Теперь четвёртая: твоя страница. Здесь есть только body. Выбери любимое животное: его картинка есть и в нашей папке, и на сайте kodi.uz. В самом верху заголовок в теге h1, потом картинка в img, а в конце фраза о животном в теге p. Список картинок рядом, схема подскажет дорогу.',
    'Three pages are lit! Now the fourth: your page. There’s only body here. Pick your favourite animal: its picture is both in our folder and on kodi.uz. At the very top, a heading in the h1 tag, then the picture in img, and at the end a sentence about the animal in the p tag. The list of pictures is right there, and the plan will show you the way.'),
  hints: [
    C.t5.hints[0],
    L3("img tegida: src ichiga ro'yxatdagi fayl nomi yoki kodi.uz saytining to'liq manzili, alt ichiga esa rasmda nima borligini yozing.",
      'В теге img: в src — имя файла из списка или полный адрес с сайта kodi.uz, а в alt — что на картинке.',
      'In the img tag: src holds a file name from the list or a full address from kodi.uz, and alt says what’s in the picture.'),
    L3("Mana sevimli hayvon haqidagi sahifa: sarlavha, internetdagi rasm va bitta gap. Sizning hayvoningiz ham shu uchtani oladi.",
      'Вот страница о любимом животном: заголовок, картинка из интернета и одна фраза. Напиши так же, только про своё.',
      'Here’s a page about a favourite animal: a heading, a picture from the internet and a sentence. Write yours the same way, about your own.')
  ]
});

// ─────────────────────────────────────────────────────────────────────────────
// Т1 · поле в строке: полный адрес картинки с kodi.uz (alt уже есть). Помощь: части адреса и имя сайта с файлом.
// ─────────────────────────────────────────────────────────────────────────────
function w1Check(v, file) {
  const s = a5Squash(v);
  if (!s) return { ok: false, msg: FB.emptyUrl };
  if (/[<>"'=]/.test(s)) return { ok: false, msg: UI.noTags };
  const m = w5UrlIssue(s, file);
  return m ? { ok: false, msg: m } : { ok: true };
}
function w1View(k) {
  return (st, x) => {
    const v = st.v || '';
    const name = x.pick(ANIMAL[k].name);
    const file = k + '.jpg';
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(name), T_('h1', true)] },
      { k: 'img', cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="ah" className="a5-g"><span className="a5-b">&lt;</span><span className="a5-n">img</span><span className="a5-a"> src="</span></span>,
        x.solved ? <span key="v" className="a5-a">{v}</span> : (
          <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
            <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={40}
              onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a5-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
          </span>),
        <span key="az" className="a5-g"><span className="a5-a">" alt="{name}"</span><span className="a5-b">&gt;</span></span>
      ] },
      { k: 'p', parts: [T_('p'), W_(x.pick(ANIMAL[k].fact)), T_('p', true)] }
    ];
    return {
      title: name, blocks: a5Page(a5AnimalCode(k, x.pick, v)).blocks,
      aid: (
        <>
          <A5Parts parts={[{ code: W5_PROTO }, { word: UI.siteName }, { code: '/' }, { word: UI.fileName }]} />
          <div className="a5-files w5-addr" translate="no">
            <span className="w5-site-l">{x.pick(UI.siteL)}:</span><code>{W5_HOST}</code>
            <span className="w5-site-l">{x.pick(UI.fileL)}:</span><code>{file}</code>
          </div>
        </>
      ),
      editor: <div className="a5-fieldwrap"><KzCode cls="a5-kz" lines={lines} /></div>,
      keys: !x.solved, syms: [W5_PROTO, '/']
    };
  };
}
const cfgW1 = () => ({
  id: 't1', num: 1, kind: 'write-src-url', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => w1Check(st.v, 'pingvin.jpg'),
  view: w1View('pingvin'),
  sample: (pk) => ['<img src="' + w5Url('maymun.jpg') + '" alt="' + pk(ANIMAL.maymun.name) + '">'],
  drill: { init: () => ({ v: '' }), check: (st) => w1Check(st.v, 'maymun.jpg'), view: w1View('maymun') }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 · найти строку и исправить: у адреса картинки нет https (kodi.uz/flamingo.jpg) — браузер ищет файл в нашей папке.
// Нажать строку img, дописать https в начало адреса (курсор встаёт перед именем сайта), alt не менять.
// ─────────────────────────────────────────────────────────────────────────────
function w5FixView(k, V) {
  return (st, x) => {
    const name = x.pick(ANIMAL[k].name);
    const lines = a5Body(['<h1>' + name + '</h1>', '<img src="' + W5_HOST + '/' + k + '.jpg" alt="' + name + '">', '<p>' + x.pick(ANIMAL[k].fact) + '</p>']);
    const BAD = 2;
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(V.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); const n = el.value.indexOf(W5_HOST); const at = n < 0 ? 0 : n; el.setSelectionRange(at, at); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(V.why[i] || V.why[0]);
    };
    if (st.at == null) {
      return {
        title: name, blocks: a5Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: V.ask,
        editor: <A5Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: name, blocks: a5Page(before.concat([st.code], after).join('\n')).blocks, ask: V.ask2 || C.t2.ask2, syms: [W5_PROTO],
      editor: <A5Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function w5FixCheck(st, k, pick, V) {
  if (st.at == null) return { ok: false, msg: V.ask };
  const r = a5Blocks(st.code);
  if (r.msg) return { ok: false, msg: r.msg };
  const f = r.blocks[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind !== 'img') return { ok: false, msg: a5Fb('wrongOpen', { tag: 'img', got: f.tag || '' }) };
  const a = f.attrs;
  if (a.src === undefined) return { ok: false, msg: a.href !== undefined ? FB.hrefOnImg : FB.noSrc };
  const m = w5UrlIssue(a.src, k + '.jpg');
  if (m) return { ok: false, msg: m };
  if (a5Norm(a.alt) !== a5Norm(pick(ANIMAL[k].name))) return { ok: false, msg: FB.keepAlt };
  return { ok: true };
}
const cfgW2 = (pick) => ({
  id: 't2', num: 2, kind: 'find-fix-url', C: C.t2,
  init: () => ({ at: null, code: '' }),
  check: (st) => w5FixCheck(st, 'flamingo', pick, C.t2),
  view: w5FixView('flamingo', C.t2),
  sample: (pk) => ['<img src="' + w5Url('pingvin.jpg') + '" alt="' + pk(ANIMAL.pingvin.name) + '">'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => w5FixCheck(st, 'maymun', pick, C.t2.d), view: w5FixView('maymun', C.t2.d) }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т4 · своё — прежнее задание 5 (h1, img с src и alt, p), номер 4. Картинка: файл из нашей папки или полный адрес
// с kodi.uz; в списке — обе группы. Страница в целой практике — пятая, здесь четвёртая (TABS[4] → TABS[3] правит build-prac).
// ─────────────────────────────────────────────────────────────────────────────
function w5OwnCheck(code) {
  const r = a5Blocks(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const B = r.blocks;
  if (!B.length) return { ok: false, msg: FB.empty };
  const f = B[0];
  if (f.kind !== 'block' || f.tag === 'p') return { ok: false, msg: FB.h1First };
  if (f.tag !== 'h1') return { ok: false, msg: a5Fb('mainH1', { got: f.tag }) };
  if (B.slice(1).some((b) => b.kind === 'block' && b.tag === 'h1')) return { ok: false, msg: FB.oneH1 };
  const img = B.find((b) => b.kind === 'img');
  if (!img) return { ok: false, msg: FB.needImg };
  const m = w5ImgIssue(img.attrs);
  if (m) return { ok: false, msg: m };
  const p = B.find((b) => b.kind === 'block' && b.tag === 'p');
  if (!p) return { ok: false, msg: FB.needPAfter };
  return { ok: true, result: { heading: f.text, src: img.attrs.src, alt: img.attrs.alt, text: p.text, code } };
}
function w5OwnDone(code) {
  const tk = lexA5(code);
  const n = (k, name) => tk.filter((t) => t.k === k && t.name === name).length;
  const okSrc = (s) => IMG_FILES.indexOf(s) >= 0 || !!a5WebPic(s);
  return { h1: n('open', 'h1') > 0 && n('close', 'h1') > 0, p: n('open', 'p') > 0 && n('close', 'p') > 0,
    img: tk.some((t) => t.k === 'open' && t.name === 'img' && t.attrs && okSrc(t.attrs.src) && a5Letters(t.attrs.alt)) };
}
function W5Files() {
  const pick = usePick();
  return (
    <div className="a5-files w5-files" translate="no">
      <span className="a5-files-l">{pick(UI.files)}:</span>
      {IMG_FILES.map((f) => <code key={f}>{f}</code>)}
      <span className="w5-site-l">{W5_HOST}:</span>
      {W5_FILES.map((f) => <code key={f} className="is-web">{f}</code>)}
    </div>
  );
}
const cfgW4 = (pick, store) => ({
  id: 't4', num: 4, kind: 'write-page-img', C: C.t4,
  init: () => ({ code: '' }),
  check: (st) => w5OwnCheck(st.code),
  onSolved: (r) => {
    store.set('myCode', r.result.code);
    store.set('myHead', r.result.heading); store.set('myText', r.result.text); store.set('mySrc', r.result.src); store.set('myAlt', r.result.alt);
    store.set('myTab', pick(TABS[3].name));
  },
  view: (st, x) => ({
    title: x.pick(TABS[3].name), blocks: a5Page(st.code).blocks, big: true,
    aid: <><A5Tree done={w5OwnDone(st.code)} /><W5Files /></>,
    editor: <A5Editor before={['<body>']} after={['</body>']} value={st.code} big inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />,
    syms: ['<', '/', '>', W5_PROTO]
  }),
  sample: (pk) => ['<h1>' + pk(XTRA.ownH) + '</h1>', '<img src="' + w5Url('maymun.jpg') + '" alt="' + pk(ANIMAL.maymun.name) + '">', '<p>' + pk(ANIMAL.maymun.fact) + '</p>']
});

const W1 = ({ p }) => <A5Task p={p} make={cfgW1} />;
const W2 = ({ p }) => <A5Task p={p} make={cfgW2} />;
const W4 = ({ p }) => <A5Task p={p} make={cfgW4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: страница пингвина, картинки нет (значок и alt). «Открыть папку»: в нашей папке такого файла нет,
// он лежит на сайте kodi.uz. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const [rec, put] = useRec('h2');
  const shown = !!(rec && rec.done);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: shown ? c.done : c.say, pose: shown ? 'point' : 'wonder' }]);
  const canGo = useAdvanceGate(shown, spoken);
  const led = useIdleLed(!shown, 0);
  const tabs = useA5Tabs(true);
  const tap = () => {
    if (shown) return;
    sfx('ok', true);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const name = pick(ANIMAL.pingvin.name);
  const lines = ['<h1>' + name + '</h1>', '<img src="pingvin.jpg" alt="' + name + '">', '<p>' + pick(ANIMAL.pingvin.fact) + '</p>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a5-sheet a5-s1 a5-h2">
        <KzAsk text={shown ? c.askDone : c.ask} />
        <div className="a5-work">
          <div className="a5-side">
            <A5Browser tabs={tabs} cur={0} title={name} url="pingvin.html">
              <A5Doc blocks={a5Page(lines.join('')).blocks} />
            </A5Browser>
          </div>
          <div className="a5-main">
            <A5Code lines={lines} />
            {!shown ? (
              <div className="kz-row a5-row">
                <button type="button" className="kz-btn is-coral a5-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                  {pick(UI.openFolder)}<Led on={led} />
                </button>
              </div>
            ) : (
              <div className="w5-where" translate="no">
                <div className="w5-wr is-no"><span className="w5-wl">{pick(UI.ourFiles)}</span><code>pingvin.jpg</code><em>{pick(UI.noThere)}</em></div>
                <div className="w5-wr is-yes"><span className="w5-wl">{W5_HOST}</span><code>pingvin.jpg</code><em>{pick(UI.isThere)}</em></div>
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
