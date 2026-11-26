// =============================================================================
// ОБЩЕЕ ДЛЯ ВСЕХ ПРАКТИК КУРСА CSS (09.11.2026): L3, fillL, кнопки и подписи (UI), фразы проверки (FB),
// дополнительная задача. Тексты — по /uzbekcha: «Siz», апостроф ASCII; в звучащих фразах нет символов
// и кусков кода — только слова и имена свойств (color, font-size), чтобы голос их прочитал.
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
  // Проход «слабого ученика» на узбекском (10.11.2026): куда писать и что писать — видно сразу.
  writeHere: L3("Kodni shu yerga yozing", 'Пиши код здесь', 'Write the code here'),
  // Подсказка в пустой рамке строки: что сюда пишут.
  phVal: L3("qiymat", 'значение', 'value'),
  phSel: L3("selektor", 'селектор', 'selector'),
  phDecl: L3("xususiyat: qiymat;", 'свойство: значение;', 'property: value;'),
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
// ФРАЗЫ ПРОВЕРКИ — одна причина и что сделать. Без «xato», «noto'g'ri». {p} — имя свойства, {n} — похожее.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Bu yer hali bo'm-bo'sh turibdi. CSS kodini shu yerga yozing.", 'Пока пусто. Пиши CSS-код здесь.', 'It’s empty so far. Write the CSS code here.'),
  cyr: L3("Harflar kirillchada yozilganga o'xshaydi. Brauzer CSS kodini faqat lotin harflarida tushunadi: klaviaturada EN tilini tanlang-da, qayta yozing.",
    'Похоже, буквы набраны по-русски. В CSS пишут английскими буквами: переключи клавиатуру на EN и набери ещё раз.',
    'Looks like some letters are Cyrillic. CSS uses English letters: switch your keyboard to EN and type again.'),
  braceOpen: L3("Selektordan keyin ochuvchi jingalak qavs tushib qolibdi. Usiz brauzer qoida qayerdan boshlanishini bilmaydi.", 'Правилу нужна открывающая фигурная скобка: она стоит после селектора.', 'The rule needs an opening curly brace: it goes after the selector.'),
  braceClose: L3("Qoida ochildi-yu, lekin yopilmadi. Oxiriga yopuvchi jingalak qavsni qo'ying.", 'Правило не закрыто: в конце поставь закрывающую фигурную скобку.', 'The rule isn’t closed: put a closing curly brace at the end.'),
  braceExtra: L3("Bu yerda bitta yopuvchi jingalak qavs ortiqcha ekan. Har bir ochuvchi qavsning bittagina yopuvchi jufti bo'ladi.", 'Есть лишняя закрывающая скобка. На каждую открывающую — одна закрывающая.', 'There’s an extra closing brace. Each opening brace gets one closing brace.'),
  noSel: L3("Qavsdan oldin selektor yo'q, brauzer esa nimani bezashni qayerdan bilsin? Qavsning oldiga selektorni yozing.", 'Перед скобкой нет селектора: напиши, что оформляем.', 'There’s no selector before the brace: write what we’re styling.'),
  eq: L3("Mana bu xususiyatdan keyin tenglik belgisi turibdi: \u2063{p}\u2064. HTML atributlarida shunday yozardik-ku, lekin CSS kodida xususiyat bilan qiymatni ikki nuqta ajratib turadi.", 'После свойства \u2063{p}\u2064 стоит знак «равно». В CSS между свойством и значением — двоеточие.', 'There’s an equals sign after the property \u2063{p}\u2064. In CSS a colon goes between the property and the value.'),
  colon: L3("Bu xususiyatdan keyin ikki nuqta tushib qolibdi: \u2063{p}\u2064. Ikki nuqta brauzerga qiymat qayerdan boshlanishini ko'rsatadi, uni xususiyat bilan qiymatning o'rtasiga qo'ying.", 'После свойства \u2063{p}\u2064 нет двоеточия: поставь его между свойством и значением.', 'There’s no colon after the property \u2063{p}\u2064: put one between the property and the value.'),
  semi: L3("Ikki xususiyat o'rtasida nuqtali vergul yo'q ekan, shuning uchun brauzer ularni qo'shib o'qiyapti va hech birini tushunmayapti. Har bir qiymatdan keyin nuqtali vergul qo'ying.", 'Между двумя свойствами нет точки с запятой. Ставь её после каждого значения.', 'There’s no semicolon between two properties. Put one after every value.'),
  prop: L3("Bunday xususiyat brauzerga notanish ekan: \u2063{p}\u2064. Nomini harfma-harf tekshirib chiqing-chi.", 'Браузер не знает такого свойства: \u2063{p}\u2064. Проверь имя буква за буквой.', 'The browser doesn’t know this property: \u2063{p}\u2064. Check the name letter by letter.'),
  propNear: L3("Bunday xususiyatni brauzer bilmas ekan: \u2063{p}\u2064. Balki {n} demoqchi edingiz?", 'Браузер не знает такого свойства: \u2063{p}\u2064. Может быть, {n}?', 'The browser doesn’t know this property: \u2063{p}\u2064. Did you mean {n}?'),
  unit: L3("{p} uchun sonning yonida o'lchov birligi bo'lishi kerak, masalan, px. Busiz brauzer son nimani bildirishini tushunmaydi va qiymatni o'tkazib yuboradi.", 'Для {p} к числу нужна единица, например px. Без неё браузер выбросит значение.', '{p} needs a unit next to the number, like px. Without it the browser throws the value away.'),
  space: L3("{p} qiymatida son bilan o'lchov birligi bir-biridan ajralib qolibdi. Ularni bo'sh joysiz, yopishtirib yozing.", 'В {p} между числом и единицей пробел. Пиши их слитно.', 'In {p} there’s a space between the number and the unit. Write them together.'),
  time: L3("{p} qiymatida vaqt yozilgan-u, lekin yonida s yoki ms yo'q. Brauzer esa vaqtni soniya yoki millisoniyada kutadi: masalan, yarim soniya nol butun besh va s harfi bo'ladi.", 'В {p} у времени нет s или ms. Например, полсекунды — ноль целых пять и буква s.', 'In {p} the time has no s or ms. For example, half a second is zero point five and the letter s.'),
  comma: L3("{p} qiymatida kasr son vergul bilan yozilibdi. CSS kodida kasrni doim nuqta bilan yozamiz, xuddi kalkulyatordagidek.", 'В {p} дробь записана через запятую. В CSS дробь пишут через точку.', 'In {p} the decimal uses a comma. In CSS decimals use a dot.'),
  valueNear: L3("Bu so'z brauzerga tanish emas ekan: \u2063{v}\u2064. Balki {n} demoqchisiz? Ikkalasining harflarini bir solishtirib ko'ring-chi.", 'Браузер не знает такого слова: \u2063{v}\u2064. Может быть, {n}? Сравни буквы.', 'The browser doesn’t know this word: \u2063{v}\u2064. Did you mean {n}? Compare the letters.'),
  noRule: L3("Hozircha bu qoidaga o'xshamayapti. Qoida doim bir tartibda yoziladi: oldin selektor, keyin jingalak qavslar, ularning ichida esa xususiyat va qiymat.", 'Это пока не правило. Правило такое: селектор, потом фигурные скобки, а в них свойство и значение.', 'This isn’t a rule yet. A rule goes: selector, then curly braces, and inside them a property and a value.'),
  declNoProp: L3("Qavslar ichida xususiyat yo'q, yolg'iz shu so'z turibdi: \u2063{v}\u2064. Brauzer uni nimaga berishni bilmaydi. Oldin xususiyatni yozing, keyin ikki nuqta va qiymatni.", 'Свойства в скобках нет, стоит только это: \u2063{v}\u2064. Сначала напиши свойство, потом двоеточие и значение.', 'There’s no property inside the braces, only this: \u2063{v}\u2064. Write the property first, then a colon and the value.'),
  needDot: L3("Sahifada {s} degan teg yo'q, lekin xuddi shunday nomli class bor ekan. Brauzer uni class deb tanishi uchun nomning oldiga nuqta qo'ying.", 'На странице нет тега {s}, но есть такой класс. Перед именем класса поставь точку.', 'There’s no {s} tag on the page, but there is such a class. Put a dot before the class name.'),
  needHash: L3("{s} degan teg sahifada yo'q, lekin shunday id bor ekan. id nomini topish uchun brauzerga panjara belgisi kerak: uni nomning oldiga qo'ying.", 'На странице нет тега {s}, но есть такой id. Перед именем id поставь решётку.', 'There’s no {s} tag on the page, but there is such an id. Put a hash sign before the id name.'),
  noDot: L3("{s} teg nomi-ku, class emas. Teg nomini nuqtasiz yozamiz: nuqta faqat class nomining oldida turadi.", '{s} — это имя тега, а не класса. Перед именем тега точку не ставят.', '{s} is a tag name, not a class. Tag names don’t get a dot.'),
  value: L3("Brauzer {p} uchun yozilgan qiymatni tushunmadi va uni o'tkazib yubordi. Ikki nuqtadan keyin nima yozilganini bir tekshirib ko'ring.", 'Браузер не узнал значение для {p} и выбросил его. Проверь значение.', 'The browser didn’t recognize the value for {p} and threw it away. Check the value.'),
  noMatch: L3("Bu selektor sahifadan hech narsani topa olmadi. Uni HTML kodidagi nom bilan harfma-harf solishtirib ko'ring.", 'Селектор ничего не выбрал на странице. Сверь его с именем в HTML-коде.', 'The selector didn’t pick anything on the page. Compare it with the name in the HTML code.'),
  slotEmpty: L3("Ramka hali bo'sh turibdi. Kerakli so'zni shu ramkaning ichiga yozing.", 'Пока пусто: впиши нужное в рамку.', 'It’s empty so far: type what’s needed into the box.'),
  // В рамку — только своя часть правила (остальное уже написано вокруг неё).
  slotVal: L3("Ramkaga faqat qiymat kerak: xususiyatning nomi chap tomonda allaqachon yozib qo'yilgan-ku.", 'В рамку — только значение: имя свойства уже стоит слева.', 'Only the value goes in the box: the property name is already on the left.'),
  slotSel: L3("Bu yerga selektorning o'zi yetarli: qavslar ham, qolgan kod ham o'z joyida turibdi-ku.", 'В рамку — только селектор: скобки и остальной код уже на месте.', 'Only the selector goes in the box: the braces and the rest are already there.'),
  slotNoProp: L3("Ramkada yolg'iz qiymat qolibdi, unga xususiyat ham kerak. Tartibi shunday: oldin xususiyat, keyin ikki nuqta, keyin qiymat.", 'В рамке только значение. Здесь нужно и свойство: сначала свойство, потом двоеточие, потом значение.', 'There’s only a value in the box. It needs the property too: first the property, then a colon, then the value.'),
  slotDecl: L3("Ramkaga xususiyat bilan qiymatni yozsangiz bas: selektor ham, qavslar ham allaqachon turibdi.", 'В рамку — только свойство и значение: селектор и скобки уже на месте.', 'Only the property and value go in the box: the selector and braces are already there.'),
  notYet: L3("Kodingiz ishlayapti, brauzer hammasini tushundi. Lekin sahifa hali biz istagandek bo'lmadi: vazifani yana bir o'qib chiqing-chi.", 'Код работает, но страница пока не такая, как нужно. Перечитай задание.', 'The code works, but the page isn’t quite right yet. Read the task again.')
};

// Дополнительная задача после образца третьей ступени.
const CP_DRILL = {
  say: L3("Endi qo'lingiz o'rganib olsin: yana bitta kichkina vazifa bor. Xuddi shu qoidani boshqa narsa uchun yozib ko'ring.", 'Здорово! А теперь ещё маленькая задача: то же самое для другого случая.', 'Great! Now one more small task: the same thing for another case.'),
  done: L3("Ajoyib, qo'lingiz o'rganib qoldi! Endi bemalol davom etamiz.", 'Отлично, теперь это точно твоё! Идём дальше.', 'Great, now you’ve really got it! Let’s move on.'),
  // Помощь в дополнительной задаче — те же три ступени (отзыв, 14.11.2026: «в Bonus лампочка не даёт образец»):
  // 1 — направление (общее), 2 — что именно нужно (C.tN.drillNo), 3 — образец под кодом и эта строка.
  hint1: L3("Bu ham hozirgina yozgan qoidangizga juda o'xshaydi. O'sha kodingiz esingizdami? Bu safar faqat sahifadagi element boshqa.", 'Это то же правило, что в задании, которое ты только что решил. Посмотри на свой код: другой только элемент на странице.', 'This is the same rule as in the task you just solved. Look at your code: only the element on the page is different.'),
  hint3: L3("Namunaga yana bir qarang, u kod ostida turibdi. Uning qoidasi qanday tuzilgan bo'lsa, shu vazifa uchun ham xuddi shunday yozing-da, «Tekshirish»ni bosing.", 'Образец под кодом. Напиши такое же правило для этой задачи и нажми «Проверить».', 'The example is under the code. Write the same rule for this task and tap Check.')
};

// ─────────────────────────────────────────────────────────────────────────────
// СЛОВАРЬ СЛОВ КУРСА (10.11.2026): по нему разбор узнаёт опечатку («orang» → «Balki orange demoqchisiz?»).
// Переводы оставлены на будущее; полосу слов с переводом заказчик убрал (10.11.2026: «очень много места занимают»).
// ─────────────────────────────────────────────────────────────────────────────
const CP_GLOSS = {
  // теги
  h1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'), p: L3("abzas", 'абзац', 'paragraph'), body: L3("butun sahifa", 'вся страница', 'the whole page'),
  a: L3("havola", 'ссылка', 'link'), nav: L3("menyu", 'меню', 'menu'), footer: L3("sahifa pasti", 'низ страницы', 'page bottom'), span: L3("matn bo'lagi", 'кусочек текста', 'piece of text'),
  div: L3("quti", 'коробка', 'box'),
  // свойства
  color: L3("matn rangi", 'цвет текста', 'text color'), 'background-color': L3("fon rangi", 'цвет фона', 'background color'),
  'background-image': L3("fon rasmi", 'картинка фона', 'background picture'), 'background-size': L3("fon o'lchami", 'размер фона', 'background size'),
  'background-repeat': L3("fon takrori", 'повтор фона', 'background repeat'), 'font-size': L3("harf o'lchami", 'размер букв', 'letter size'),
  'font-family': L3("shrift", 'шрифт', 'font'), 'font-weight': L3("qalinlik", 'жирность', 'thickness'), 'text-align': L3("matnni tekislash", 'выравнивание текста', 'text alignment'),
  'text-decoration': L3("matn chizig'i", 'черта у текста', 'text line'), width: L3("kenglik", 'ширина', 'width'), height: L3("balandlik", 'высота', 'height'),
  padding: L3("ichki bo'shliq", 'отступ внутри', 'space inside'), margin: L3("tashqi bo'shliq", 'отступ снаружи', 'space outside'),
  border: L3("ramka", 'рамка', 'frame'), 'box-sizing': L3("o'lchamni hisoblash", 'как считать размер', 'how size is counted'),
  'border-radius': L3("burchaklar", 'углы', 'corners'), 'box-shadow': L3("soya", 'тень', 'shadow'),
  'border-left': L3("chapdagi chiziq", 'линия слева', 'line on the left'), 'border-bottom': L3("pastdagi chiziq", 'линия снизу', 'line at the bottom'),
  'border-top': L3("tepadagi chiziq", 'линия сверху', 'line at the top'), 'border-right': L3("o'ngdagi chiziq", 'линия справа', 'line on the right'),
  display: L3("ko'rinish turi", 'как стоит элемент', 'how it’s shown'), 'flex-direction': L3("yo'nalish", 'направление', 'direction'),
  'justify-content': L3("asosiy o'qda joylash", 'по главной оси', 'along the main axis'),
  'align-items': L3("ko'ndalang o'qda joylash", 'по поперечной оси', 'along the cross axis'),
  gap: L3("oraliq", 'промежуток', 'gap'), 'flex-wrap': L3("yangi qatorga o'tish", 'перенос на новую строку', 'move to a new line'),
  position: L3("joylashuv", 'положение', 'position'), 'prop:top': L3("tepadan", 'сверху', 'from the top'), 'prop:bottom': L3("pastdan", 'снизу', 'from the bottom'),
  'prop:left': L3("chapdan", 'слева', 'from the left'), 'prop:right': L3("o'ngdan", 'справа', 'from the right'),
  transform: L3("o'zgartirish", 'преобразование', 'change of shape'), cursor: L3("kursor", 'курсор', 'cursor'),
  transition: L3("silliq o'tish", 'плавный переход', 'smooth change'), animation: L3("animatsiya", 'анимация', 'animation'),
  '@media': L3("shart bilan qoidalar", 'правила по условию', 'rules with a condition'), '@keyframes': L3("harakat rejasi", 'план движения', 'motion plan'),
  // ранги
  orange: L3("to'q sariq", 'оранжевый', 'orange'), green: L3("yashil", 'зелёный', 'green'), purple: L3("binafsha", 'фиолетовый', 'purple'),
  pink: L3("pushti", 'розовый', 'pink'), brown: L3("jigarrang", 'коричневый', 'brown'), navy: L3("to'q ko'k", 'тёмно-синий', 'navy'),
  teal: L3("to'q firuza", 'тёмно-бирюзовый', 'teal'), lavender: L3("och binafsha", 'лавандовый', 'lavender'), red: L3("qizil", 'красный', 'red'),
  blue: L3("ko'k", 'синий', 'blue'), darkblue: L3("to'q ko'k", 'тёмно-синий', 'dark blue'), lightblue: L3("och ko'k", 'светло-синий', 'light blue'),
  gold: L3("oltin rang", 'золотой', 'gold'), lightgreen: L3("och yashil", 'светло-зелёный', 'light green'), white: L3("oq", 'белый', 'white'),
  black: L3("qora", 'чёрный', 'black'), gray: L3("kulrang", 'серый', 'gray'), silver: L3("kumush rang", 'серебристый', 'silver'),
  skyblue: L3("osmon rang", 'небесный', 'sky blue'), crimson: L3("to'q qizil", 'малиновый', 'crimson'), darkgreen: L3("to'q yashil", 'тёмно-зелёный', 'dark green'),
  lightyellow: L3("och sariq", 'светло-жёлтый', 'light yellow'), yellow: L3("sariq", 'жёлтый', 'yellow'), lightcyan: L3("och havorang", 'светло-голубой', 'light cyan'),
  // слова-значения
  none: L3("yo'q, yashirin", 'нет, спрятан', 'none, hidden'), block: L3("butun qator", 'вся строка', 'whole line'), inline: L3("matn kabi", 'как текст', 'like text'),
  'inline-block': L3("yonma-yon, o'lchamli", 'рядом, с размером', 'side by side, sized'), flex: L3("Flexbox qatori", 'ряд Flexbox', 'Flexbox row'),
  column: L3("ustun", 'столбик', 'column'), row: L3("qator", 'ряд', 'row'), 'row-reverse': L3("teskari qator", 'ряд наоборот', 'reversed row'),
  center: L3("o'rtaga", 'по центру', 'to the middle'), 'flex-end': L3("oxiriga", 'в конец', 'to the end'), 'flex-start': L3("boshiga", 'в начало', 'to the start'),
  'space-between': L3("chetlarga", 'по краям', 'to the edges'), wrap: L3("yangi qatorga", 'переносить', 'wrap'),
  relative: L3("o'z joyidan", 'от своего места', 'from its own place'), absolute: L3("oqimdan tashqari", 'вне потока', 'out of the flow'),
  fixed: L3("oynaga qotirilgan", 'приклеен к окну', 'stuck to the window'), static: L3("oddiy joyida", 'на обычном месте', 'in its usual place'),
  cover: L3("to'liq qoplasin", 'накрыть весь фон', 'cover it all'), 'no-repeat': L3("takrorlanmasin", 'не повторять', 'don’t repeat'),
  monospace: L3("bir xil enli harflar", 'буквы одной ширины', 'equal-width letters'), 'sans-serif': L3("oyoqchasiz shrift", 'шрифт без засечек', 'font without feet'),
  serif: L3("oyoqchali shrift", 'шрифт с засечками', 'font with feet'), bold: L3("qalin", 'жирный', 'bold'), 'val:right': L3("o'ngga", 'вправо', 'to the right'),
  'val:left': L3("chapga", 'влево', 'to the left'), 'border-box': L3("ramka kenglik ichida", 'рамка внутри ширины', 'border inside the width'),
  solid: L3("yaxlit chiziq", 'сплошная линия', 'solid line'), dashed: L3("chiziqchalar", 'чёрточки', 'dashes'), dotted: L3("nuqtalar", 'точки', 'dots'),
  linear: L3("tekis tezlikda", 'ровно', 'at an even speed'), ease: L3("sekin-tez-sekin", 'медленно-быстро-медленно', 'slow-fast-slow'),
  infinite: L3("cheksiz", 'без конца', 'forever'), alternate: L3("borib-qaytib", 'туда и обратно', 'back and forth'), all: L3("hammasi", 'всё', 'everything'),
  pointer: L3("qo'l", 'рука', 'hand'), underline: L3("tagiga chiziq", 'подчеркнуть', 'underline'), 'line-through': L3("ustidan chiziq", 'зачеркнуть', 'cross out'),
  // запись значений
  'fn:scale': L3("kattalashtirish", 'увеличить', 'make bigger'), 'fn:rotate': L3("burish", 'повернуть', 'turn'), 'fn:translate': L3("surish", 'сдвинуть', 'move'),
  'fn:translatex': L3("chapga-o'ngga surish", 'сдвинуть вбок', 'move sideways'), 'fn:translatey': L3("tepaga-pastga surish", 'сдвинуть вверх-вниз', 'move up or down'),
  'fn:rgb': L3("qizil, yashil, ko'k nur", 'красный, зелёный, синий луч', 'red, green, blue light'), 'fn:url': L3("rasm fayli", 'файл картинки', 'picture file'),
  hex: L3("rang kodi", 'код цвета', 'color code'),
  ':hover': L3("sichqoncha ustida", 'мышка над ним', 'mouse over it'),
  'max-width': L3("eng katta kenglik", 'наибольшая ширина', 'largest width'), 'min-width': L3("eng kichik kenglik", 'наименьшая ширина', 'smallest width'),
  'sel:from': L3("boshida", 'в начале', 'at the start'), 'sel:to': L3("oxirida", 'в конце', 'at the end'),
  'unit:px': L3("piksel", 'пиксели', 'pixels'), 'unit:%': L3("foiz", 'проценты', 'percent'), 'unit:s': L3("soniya", 'секунды', 'seconds'),
  'unit:ms': L3("millisoniya", 'миллисекунды', 'milliseconds'), 'unit:deg': L3("gradus", 'градусы', 'degrees'),
  'val:transform': L3("o'zgarish", 'преобразование', 'the change'), 'val:background-color': L3("fon rangi", 'цвет фона', 'background color')
};
