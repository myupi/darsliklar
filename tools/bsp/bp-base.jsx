// =============================================================================
// ОБЩЕЕ ДЛЯ ВСЕХ ПРАКТИК МОДУЛЯ BOOTSTRAP (21.11.2026): L3, fillL, кнопки и подписи (UI), фразы проверки (FB),
// дополнительная задача. Тексты — по /uzbekcha: «Siz», апостроф ASCII; в звучащих фразах нет символов и кусков
// кода — только слова и имена тегов и классов (div, alert, theme-warning), чтобы голос их прочитал.
// =============================================================================
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// CDN — та же строка, что на сайте (Install, CDN Quickstart), как в уроке 1. Адреса — текст, рамка их не грузит.
// ─────────────────────────────────────────────────────────────────────────────
const BP_H = 'https://';
const BP_CDN = BP_H + 'cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/';
const BP_CSS_URL = BP_CDN + 'css/bootstrap.min.css';
const BP_JS_URL = BP_CDN + 'js/bootstrap.bundle.min.js';
const BP_CSS_SRI = 'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe';
const BP_JS_SRI = 'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL';
const BP_LINK = '<link href="' + BP_CSS_URL + '" rel="stylesheet" integrity="' + BP_CSS_SRI + '" crossorigin="anonymous">';
const BP_SCRIPT = '<script type="module" src="' + BP_JS_URL + '" integrity="' + BP_JS_SRI + '" crossorigin="anonymous"></script>';

const UI = {
  check: L3("Tekshirish", 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  editor: L3("Kod muharriri", 'Редактор кода', 'Code editor'),
  keys: L3("Belgilar", 'Символы', 'Symbols'),
  refresh: L3("Yangilash", 'Обновить', 'Refresh'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  html: L3("Sahifa HTML kodi", 'HTML страницы', 'The page’s HTML'),
  workReady: L3("Ish tayyor", 'Работа готова', 'Work is ready'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  phone: L3("Telefon", 'Телефон', 'Phone'),
  writeHere: L3("Kodni shu yerga yozing", 'Пиши код здесь', 'Write the code here'),
  // Подсказка в пустой рамке строки: что сюда пишут.
  phCls: L3("so'z", 'слово', 'word'),
  phTxt: L3("matn", 'текст', 'text'),
  phVal: L3("qiymat", 'значение', 'value'),
  // Пример с сайта Bootstrap: копирование и вставка.
  copy: L3("Nusxalash", 'Копировать', 'Copy'),
  copied: L3("Nusxalandi", 'Скопировано', 'Copied!'),
  paste: L3("Qo'yish", 'Вставить', 'Paste'),
  computer: L3("Kompyuter", 'Компьютер', 'Computer'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening sahifam", 'Моя страница', 'My page'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и что сделать. Без «xato», «noto'g'ri» про ученика. {t} — тег, {w} — слово, {n} — похожее.
// Строки link и script — как в уроке 1: не чиним по буквам, а берём с сайта заново.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  cyr: L3("Teg ichidagi harflar kirillchada yozilganga o'xshaydi. Teglar va class so'zlari lotin harflarida yoziladi: klaviaturani EN ga almashtiring va qaytadan yozing.",
    'Похоже, в теге буквы набраны по-русски. Теги и слова в class пишут английскими буквами: переключи клавиатуру на EN и набери ещё раз.',
    'Looks like some letters in a tag are Cyrillic. Tags and class words use English letters: switch your keyboard to EN and type again.'),
  quote: L3("Qo'shtirnoqlar juft emas. Atribut qiymati qo'shtirnoq bilan ochiladi va xuddi shunday yopiladi.", 'Кавычки не парные. Значение атрибута открывается кавычкой и так же закрывается.', 'The quotes don’t pair up. An attribute value opens with a quote and closes with one.'),
  tagOpen: L3("{t} tegi oxirigacha yozilmagan: uni yopuvchi burchakli qavs bilan tugating.", 'Тег {t} не дописан: закончи его закрывающей угловой скобкой.', 'The {t} tag isn’t finished: end it with a closing angle bracket.'),
  closeTag: L3("{t} tegi yopilmadi. Uning tarkibidan keyin yopuvchi {t} tegini yozing.", 'Тег {t} не закрыт. После его содержимого напиши закрывающий тег {t}.', 'The {t} tag isn’t closed. After its content, write the closing {t} tag.'),
  extraClose: L3("Ortiqcha yopuvchi {t} tegi bor. Har bir ochuvchi tegga bitta yopuvchi teg kerak.", 'Есть лишний закрывающий тег {t}. На каждый открывающий — один закрывающий.', 'There’s an extra closing {t} tag. Each opening tag gets one closing tag.'),
  linkTypo: L3("link qatoridagi manzil saytdagidan biroz farq qiladi: harflar o'zgargan. Brauzer bunday faylni topa olmaydi. Qatorni saytdan qaytadan nusxalang.",
    'Адрес в строке link чуть отличается от адреса на сайте: буквы изменились. Браузер такой файл не найдёт. Скопируй строку с сайта заново.',
    'The address in the link line is slightly different from the site’s: some letters changed. The browser can’t find that file. Copy the line from the site again.'),
  linkUrl: L3("link qatoridagi manzil Bootstrap fayliga olib bormaydi. Qatorni saytdan nusxalang.", 'Адрес в строке link не ведёт к файлу Bootstrap. Скопируй строку с сайта.', 'The address in the link line doesn’t lead to the Bootstrap file. Copy the line from the site.'),
  linkVer: L3("Bu Bootstrapning boshqa, eski versiyasi. Bizga oltinchi versiya kerak: qatorni saytdan nusxalang.", 'Это другая, старая версия Bootstrap. Нам нужна шестая: скопируй строку с сайта.', 'That’s another, older version of Bootstrap. We need version six: copy the line from the site.'),
  linkRel: L3("link qatorida rel stylesheet yo'q: brauzer faylni CSS deb tanimaydi. Qatorni saytdan to'liq nusxalang.", 'В строке link нет rel stylesheet: браузер не поймёт, что это CSS. Скопируй строку с сайта целиком.', 'The link line has no rel stylesheet: the browser won’t know it’s CSS. Copy the whole line from the site.'),
  linkSri: L3("integrity qiymati saytdagidan farq qiladi. Brauzer bunday faylni ishonchsiz deb, ulamaydi. Qatorni saytdan qaytadan nusxalang.", 'Значение integrity не совпадает с сайтом. Браузер посчитает файл ненадёжным и не подключит его. Скопируй строку с сайта заново.', 'The integrity value doesn’t match the site. The browser will treat the file as untrusted and won’t connect it. Copy the line from the site again.'),
  scriptUrl: L3("script qatoridagi manzil saytdagidan farq qiladi. Qatorni saytdan qaytadan nusxalang.", 'Адрес в строке script отличается от сайта. Скопируй строку с сайта заново.', 'The address in the script line differs from the site. Copy the line from the site again.'),
  scriptSri: L3("script qatoridagi integrity saytdagidan farq qiladi. Qatorni saytdan qaytadan nusxalang.", 'integrity в строке script не совпадает с сайтом. Скопируй строку с сайта заново.', 'The integrity in the script line doesn’t match the site. Copy the line from the site again.'),
  clsDot: L3("{w} so'zidan oldin nuqta turibdi. Nuqta CSS faylida turadi, class ichida esa so'z nuqtasiz yoziladi.", 'Перед словом {w} стоит точка. Точка нужна в CSS-файле, а в class слово пишут без точки.', 'There’s a dot before {w}. Dots belong in a CSS file; inside class the word goes without a dot.'),
  v5: L3("{w} eski nom, Bootstrapning oldingi versiyalaridan. Oltinchisida u ishlamaydi: so'zni saytdan oling.", '{w} — старое имя из прошлых версий Bootstrap. В шестой оно не работает: возьми слово с сайта.', '{w} is an old name from earlier Bootstrap versions. It doesn’t work in version 6: take the word from the site.'),
  cssInClass: L3("class ichiga CSS qoidasi yozilgan. Bootstrapda class ichiga qisqa so'z yoziladi, CSS esa Bootstrapning o'zida. So'zni saytdan oling.", 'В class написано CSS-правило. В Bootstrap в class пишут короткое слово, а сам CSS уже внутри Bootstrap. Возьми слово с сайта.', 'A CSS rule is written in class. In Bootstrap, class gets a short word; the CSS is already inside Bootstrap. Take the word from the site.'),
  cssValue: L3("{w} so'zida CSS qiymati turibdi. Bootstrap so'zi qisqaroq: {n}.", 'В слове {w} стоит значение из CSS. Слово Bootstrap короче: {n}.', 'The word {w} contains a CSS value. The Bootstrap word is shorter: {n}.'),
  gapNum: L3("{w}: gap dagi son piksel emas, jadvaldagi o'rin, noldan o'n ikkigacha. Saytdagi Gap jadvaliga qarang.", '{w}: число в gap — не пиксели, а место в таблице, от нуля до двенадцати. Посмотри таблицу Gap на сайте.', '{w}: the number in gap isn’t pixels, it’s a place in the table, from zero to twelve. Check the Gap table on the site.'),
  bpColon: L3("{w}: Bootstrap 6 da ekran o'lchami so'z oldidan ikki nuqta bilan yoziladi: {n}.", '{w}: в Bootstrap 6 размер экрана пишут перед словом через двоеточие: {n}.', '{w}: in Bootstrap 6 the screen size goes before the word with a colon: {n}.'),
  col12: L3("{w}: qator o'n ikki bo'lakka bo'linadi, ustun soni birdan o'n ikkigacha bo'ladi.", '{w}: строка делится на двенадцать частей, у колонки число от одного до двенадцати.', '{w}: a row is split into twelve parts, so a column number goes from one to twelve.'),
  colorName: L3("Bootstrap rangni oddiy nomi bilan emas, o'z so'zi bilan ataydi: {w} degan so'z yo'q. Rang so'zini saytdan oling.", 'Bootstrap называет цвета не обычными именами, а своими словами: слова {w} нет. Возьми слово цвета с сайта.', 'Bootstrap doesn’t use plain color names, it has its own words: there’s no {w}. Take the color word from the site.'),
  clsNear: L3("Bootstrap {w} degan so'zni bilmaydi. Balki {n} demoqchisiz? Harflarini solishtirib ko'ring.", 'Bootstrap не знает слова {w}. Может быть, {n}? Сравни буквы.', 'Bootstrap doesn’t know the word {w}. Did you mean {n}? Compare the letters.'),
  clsUnknown: L3("Bootstrap {w} degan so'zni bilmaydi, shuning uchun hech narsa o'zgarmadi. So'zni saytdan oling.", 'Bootstrap не знает слова {w}, поэтому ничего не поменялось. Возьми слово с сайта.', 'Bootstrap doesn’t know the word {w}, so nothing changed. Take the word from the site.'),
  // атрибуты data-bs-* (урок 8: карусель, урок 9: меню и окно)
  bsHash: L3("data-bs-target da panjara yo'q. id ga ishora qilganda oldiga panjara qo'yiladi: {w}. Busiz tugma o'z narsasini topmaydi.", 'В data-bs-target нет решётки. Когда указываешь на id, впереди ставится решётка: {w}. Без неё кнопка не найдёт свою вещь.', 'There’s no hash in data-bs-target. When you point to an id, a hash goes in front: {w}. Without it the button can’t find its target.'),
  bsDot: L3("Nuqta class uchun. id ga panjara bilan ishora qilinadi: {w}.", 'Точка — для class. На id указывают решёткой: {w}.', 'A dot is for class. You point to an id with a hash: {w}.'),
  bsSlide: L3("data-bs-slide faqat ikki so'zni biladi: next, ya'ni keyingi, va prev, ya'ni oldingi.", 'data-bs-slide знает только два слова: next, то есть следующий, и prev, то есть предыдущий.', 'data-bs-slide knows just two words: next and prev.'),
  slotEmpty: L3("Hozircha bo'sh: kerakli so'zni ramka ichiga yozing.", 'Пока пусто: впиши нужное в рамку.', 'It’s empty so far: type what’s needed into the box.'),
  slotCls: L3("Ramkaga faqat class so'zlarini yozing: qo'shtirnoq va burchakli qavslar o'z joyida turibdi.", 'В рамку — только слова для class: кавычки и угловые скобки уже на месте.', 'Only the class words go in the box: the quotes and angle brackets are already there.'),
  slotTxt: L3("Ramkaga faqat matnni yozing: teglar o'z joyida turibdi.", 'В рамку — только текст: теги уже на месте.', 'Only the text goes in the box: the tags are already there.'),
  notYet: L3("Kod ishlayapti, lekin sahifa hali kerakli ko'rinishda emas. Vazifani yana bir o'qing.", 'Код работает, но страница пока не такая, как нужно. Перечитай задание.', 'The code works, but the page isn’t quite right yet. Read the task again.'),
  // Фразы целей, общие для практик: подключение и место строк.
  noLink: L3("Bootstrap ulanmagan: head ichida link qatori yo'q. Uni saytdan nusxalang va head ichiga qo'ying.", 'Bootstrap не подключён: в head нет строки link. Скопируй её с сайта и вставь в head.', 'Bootstrap isn’t connected: there’s no link line in head. Copy it from the site and paste it into head.'),
  linkBody: L3("link qatori body ichida turibdi. Uning joyi head ichida, sahifa haqidagi ma'lumotlar yonida.", 'Строка link стоит внутри body. Её место — среди сведений о странице, то есть в head.', 'The link line is inside body. It belongs with the page’s info, that is, in head.'),
  noScript: L3("script qatori yo'q. Uni ham saytdan nusxalang va yopuvchi body tegidan oldin qo'ying.", 'Строки script нет. Её тоже скопируй с сайта и вставь перед закрывающим тегом body.', 'There’s no script line. Copy it from the site too and paste it before the closing body tag.'),
  scriptPlace: L3("script qatori body oxirida turishi kerak: sahifadagi hamma narsadan keyin, yopuvchi body tegidan oldin.", 'Строка script должна стоять в конце body: после всего содержимого, перед закрывающим тегом body.', 'The script line should be at the end of body: after everything on the page, before the closing body tag.')
};

// Дополнительная задача после образца третьей ступени.
const CP_DRILL = {
  say: L3("Zo'r! Endi yana bir kichik vazifa: xuddi shu narsani boshqa e'lon uchun qiling.", 'Здорово! А теперь ещё маленькая задача: то же самое для другого случая.', 'Great! Now one more small task: the same thing for another case.'),
  done: L3("Ajoyib, endi bu sizga tanish! Davom etamiz.", 'Отлично, теперь это точно твоё! Идём дальше.', 'Great, now you’ve really got it! Let’s move on.'),
  hint1: L3("Bu ham xuddi hozir yechgan vazifadagi ish. Kodingizga qarang: faqat so'z yoki matn boshqa.", 'Это то же, что в задании, которое ты только что решил. Посмотри на свой код: другое только слово или текст.', 'This is the same as the task you just solved. Look at your code: only the word or text is different.'),
  hint3: L3("Namuna kod ostida. Xuddi shunday kodni shu vazifa uchun yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такой же код для этой задачи и нажми «Проверить».', 'The example is under the code. Write the same code for this task and tap Check.')
};
