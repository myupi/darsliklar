import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAudio, useSfx, useAssets } from '@lesson/runtime';

// ===================== i18n: русский / o'zbekcha =====================
// Язык фиксируется при загрузке урока: ?lang=uz, window.__CODDY_LANG или <html lang>.
// Внутри урока переключателя нет — так задумано курсом.
// Имена uzT/uzTr/UZ_DICT/CODDY_LANG выбраны свободными: T — это тема урока, а не текст.
var CODDY_LANG = (function () {
  try {
    if (typeof window !== 'undefined') {
      var g = window.__CODDY_LANG;
      if (g === 'uz' || g === 'ru') return g;
      var m = /[?&]lang=(uz|ru)\b/.exec(window.location.search || '');
      if (m) return m[1];
      var h = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (h.indexOf('uz') === 0) return 'uz';
    }
  } catch (e) {}
  return 'ru';
})();

// Словарь переводов: русский оригинал → узбекский.
// Блок между маркерами переписывается скриптом (node i18n-uz.js --refresh) —
// руками правьте uz-strings.json, а не это место.
var UZ_DICT = /*<<UZDICT*/ {
 "смотрят ОТ Coddy — как turn left и turn right": "Coddy'DAN qaraydi — turn left va turn right kabi",
 "открыто = там не стена, туда можно шагнуть": "ochiq = u yerda devor yo'q, u tomonga qadam qo'ysa bo'ladi",
 "ветки из 3.3 наконец получили ВОПРОСЫ": "3.3 dagi tarmoqlar nihoyat SAVOLGA ega bo'ldi",
 "за круг Coddy делает РОВНО ОДНУ ветку — и ровно один шаг": "bir aylanada Coddy ROPPA-ROSA BITTA tarmoqni bajaradi — va roppa-rosa bitta qadam",
 "программа не помнит карту — она СПРАШИВАЕТ её на каждой клетке": "dastur xaritani eslab qolmaydi — u har katakda undan SO'RAYDI",
 "Два новых ГЛАЗА — влево и вправо": "Ikkita yangi KO'Z — chapga va o'ngga",
 "Глаз вставляем в ШЕСТЕРЁНКУ": "Ko'zni TISHLI G'ILDIRAKKA qo'yamiz",
 "УНИВЕРСАЛЬНЫЙ НАВИГАТОР": "UNIVERSAL NAVIGATOR",
 "ОДИН код — ЛЮБОЙ лабиринт": "BITTA kod — ISTALGAN labirint",
 "Посмотреть всю программу": "Butun dasturni ko'rish",
 "Сократить вид": "Ko'rinishni qisqartirish",
 "вправо": "o'ngga",
 "вниз": "pastga",
 "влево": "chapga",
 "вверх": "yuqoriga",
 "блок": "blok",
 "блока": "blok",
 "блоков": "blok",
 "шаг": "qadam",
 "шага": "qadam",
 "шагов": "qadam",
 "Кодди": "Koddy",
 "Coddy смотрит ": "Coddy qaragan tomon: ",
 "батарейка": "batareyka",
 "батарейка": "batareyka",
 "вирус — опасно": "virus — xavfli",
 "щит — возьми take shield": "qalqon — take shield'ni oling",
 "Удалить блок": "Blokni o'chirish",
 "до": "gacha",
 "пока": "toki",
 "не": "emas",
 "Верный ответ": "To'g'ri javob",
 "Понятно": "Tushunarli",
 "move — поставь число шагов": "move — qadamlar sonini qo'ying",
 "финиш!": "finish!",
 "нет": "yo'q",
 "есть!": "bor!",
 "ВИРУС!": "VIRUS!",
 "чисто": "toza",
 "ЩИТ!": "QALQON!",
 "открыт!": "ochiq!",
 "стена": "devor",
 "Нажми ШЕСТЕРЁНКУ ⚙️ на блоке If и перетащи в структуру деталь «else»! Тогда у Coddy появится ВТОРАЯ ветка — что делать, если ответ «нет». ⚙️": "If blokidagi TISHLI G'ILDIRAKNI ⚙️ bosing va tuzilishga «else» qismini sudrang! Shunda Coddy'da IKKINCHI tarmoq paydo bo'ladi — javob «yo'q» bo'lsa nima qilish. ⚙️",
 "Открой ШЕСТЕРЁНКУ ⚙️ и добавь деталь «else if» — с ней у блока будет ТРИ ветки, и Coddy сможет выбирать из трёх вариантов! ⚙️": "TISHLI G'ILDIRAKNI ⚙️ oching va «else if» qismini qo'shing — u bilan blokda UCH tarmoq bo'ladi va Coddy uch variantdan tanlay oladi! ⚙️",
 "Coddy должен САМ увидеть поворот налево! Возьми сенсор «path to left?» ⬅ и брось его в окошко-условие ветки. 🧭": "Coddy chapga burilishni O'ZI ko'rishi kerak! «path to left?» ⬅ sensorini olib, uni tarmoqning shart-oynachasiga tashlang. 🧭",
 "А как программа узнает про поворот направо? Возьми сенсор «path to right?» ➡ и брось его в окошко-условие ветки. 🧭": "Dastur o'ngga burilish haqida qanday biladi? «path to right?» ➡ sensorini olib, uni tarmoqning shart-oynachasiga tashlang. 🧭",
 "У блока While нет условия! Брось сенсор в его окошко.": "While blokida shart yo'q! Uning oynachasiga sensorni tashlang.",
 "Внутри While пусто!": "While ichi bo'sh!",
 "У блока If пустое окошко-условие! Брось туда сенсор — ⬅, ➡ или 🔋. Без вопроса программа не знает, ЧТО проверять.": "If blokining shart-oynachasi bo'sh! U yerga sensorni tashlang — ⬅, ➡ yoki 🔋. Savolsiz dastur NIMANI tekshirishni bilmaydi.",
 "Внутри If пусто! Положи туда действие — то, что Coddy сделает, ЕСЛИ ответ «да».": "If ichi bo'sh! U yerga harakat qo'ying — javob «ha» BO'LSA Coddy nima qilishini.",
 "У ветки «else if» пустое окошко-условие! Брось туда сенсор — у каждой ветки свой вопрос.": "«else if» tarmog'ining shart oynasi bo'sh! U yerga sensor tashlang — har bir tarmoqning o'z savoli bor.",
 "Ветка «else if» пустая! Положи в неё действие — то, что Coddy сделает, если сработает ВТОРОЕ условие.": "«else if» tarmog'i bo'sh! Unga harakat qo'ying — IKKINCHI shart ishlasa Coddy nima qilishini.",
 "Ветка «else» пустая! Положи в неё действие — то, что Coddy сделает, если ВСЕ условия ответили «нет».": "«else» tarmog'i bo'sh! Unga harakat qo'ying — HAMMA shartlar «yo'q» deb javob bersa Coddy nima qilishini.",
 "Внутри Repeat пусто! Перетащи блоки ВНУТРЬ цикла — между створками.": "Repeat ichi bo'sh! Bloklarni tsikl ICHIGA sudrang — tavaqalari orasiga.",
 "повторений": "takrorlash",
 "Меньше ": "Kamroq ",
 "Больше ": "Ko'proq ",
 "В этой задаче хватит ДВУХ веток: добавь только «else» 🙂": "Bu topshiriqda IKKI tarmoq yetadi: faqat «else» qo'shing 🙂",
 "Тут хватит ОДНОЙ ветки «else if» — она уже есть 🙂": "Bu yerda BITTA «else if» tarmog'i yetadi — u allaqachon bor 🙂",
 "Ветка «else» может быть только ОДНА — она последняя.": "«else» tarmog'i faqat BITTA bo'lishi mumkin — u oxirgisi.",
 "В этой задаче ветка «else» не нужна.": "Bu topshiriqda «else» tarmog'i kerak emas.",
 "Отпусти деталь ВНУТРИ структуры блока — в рамке справа ⤵": "Qismni blok tuzilishi ICHIGA qo'yib yuboring — o'ngdagi ramkaga ⤵",
 "Деталь ": "Qism ",
 "Убрать ветку else if": "else if tarmog'ini olib tashlash",
 "Убрать ветку else": "else tarmog'ini olib tashlash",
 "Настройка блока If": "If blokini sozlash",
 "Закрыть": "Yopish",
 "Перетащи деталь в структуру — и блок вырастет. Сейчас веток:": "Qismni tuzilishga sudrang — va blok o'sadi. Hozir tarmoqlar:",
 "Детали": "Qismlari",
 "Структура блока": "Blok tuzilishi",
 "отпусти здесь ⤵": "shu yerga qo'yib yuboring ⤵",
 "Готово": "Tayyor",
 "else if — новое условие · else — «иначе», без условия": "else if — yangi shart · else — «aks holda», shartsiz",
 "Программа Coddy": "Coddy dasturi",
 "Ой! Coddy шагает и шагает по кругу — это БЕСКОНЕЧНЫЙ ЦИКЛ! 🔁 Проверь: в КАЖДОЙ ветке блока должен быть move, иначе Coddy застрянет на месте.": "Voy! Coddy aylanib yuraveradi — bu CHEKSIZ TSIKL! 🔁 Tekshiring: blokning HAR BIR tarmog'ida move bo'lishi kerak, aks holda Coddy joyida qotib qoladi.",
 "Coddy упёрся в стену — ничего страшного! 🧱 В лабиринте это значит: он шагнул НЕ в ту сторону. Проверь ветки — там, где сенсор ответил «да», Coddy должен сначала ПОВЕРНУТЬ, а уже потом шагнуть. 💪": "Coddy devorga tiraldi — hechqisi yo'q! 🧱 Labirintda bu shuni anglatadi: u NOTO'G'RI tomonga qadam tashladi. Tarmoqlarni tekshiring — sensor «ha» deb javob bergan joyda Coddy avval BURILISHI, keyingina qadam tashlashi kerak. 💪",
 "Получилось! Coddy сам нашёл дорогу: на каждой клетке спросил про путь и выбрал нужную ветку. 🧭⭐": "Bo'ldi! Coddy yo'lni o'zi topdi: har bir katakda yo'l haqida so'radi va kerakli tarmoqni tanladi. 🧭⭐",
 "Проверь ветку с сенсором «has battery?» — и pick battery внутри неё.": "«has battery?» sensorli tarmoqni tekshiring — va uning ichidagi pick battery'ni.",
 "Почти! Coddy ещё не на флажке. Попробуй ещё раз 💪": "Sal qoldi! Coddy hali bayroqchada emas. Yana urinib ko'ring 💪",
 "Уже ближе! Посмотри, где Coddy свернул не туда.": "Yaqinlashdingiz! Coddy qayerda noto'g'ri burilganiga qarang.",
 "Не сдавайся! А если совсем трудно — нажми «Я сдаюсь» 👇": "Taslim bo'lmang! Agar juda qiyin bo'lsa — «Taslim bo'ldim»ni bosing 👇",
 "Убрать": "Olib tashlash",
 "отпусти внутри ⤵": "ichiga qo'yib yuboring ⤵",
 "Удалить Repeat": "Repeat'ni o'chirish",
 "брось блоки сюда — их Coddy повторит": "bloklarni shu yerga tashlang — Coddy ularni takrorlaydi",
 "брось ⬅ ➡ или 🔋": "⬅ ➡ yoki 🔋 ni tashlang",
 "Удалить If": "If'ni o'chirish",
 "что делать, ЕСЛИ «да»": "«ha» BO'LSA nima qilish",
 "брось сенсор": "sensorni tashlang",
 "что делать, если сработало ЭТО условие": "SHU shart ishlasa nima qilish",
 "иначе — во всех остальных случаях": "aks holda — qolgan barcha hollarda",
 "✔ иначе": "✔ aks holda",
 "что делать, если ВСЕ ответы «нет»": "HAMMA javob «yo'q» bo'lsa nima qilish",
 "Режим: ": "Rejim: ",
 ". Переключить while/until": ". while/until'ni almashtirish",
 "брось 👁 или 🔋": "👁 yoki 🔋 ni tashlang",
 "Удалить While": "While'ni o'chirish",
 "брось сюда блок If и move": "shu yerga If blokini va move'ni tashlang",
 "Брось блок сюда ⤵": "Blokni shu yerga tashlang ⤵",
 "Перетащи блоки сюда…": "Bloklarni shu yerga sudrang…",
 "Отпусти здесь ⤵": "Shu yerga qo'yib yuboring ⤵",
 "+ ещё блок": "+ yana blok",
 "Запустить": "Ishga tushirish",
 "Сброс": "Tozalash",
 "Корзина": "Savat",
 "Цель:": "Maqsad:",
 "Показать верный ответ": "To'g'ri javobni ko'rsatish",
 "Скрыть ответ": "Javobni yashirish",
 "Я сдаюсь 🏳️": "Taslim bo'ldim 🏳️",
 "После 3 попыток": "3 urinishdan keyin",
 "Откроется после трёх попыток": "Uch urinishdan keyin ochiladi",
 "✗ Лимит! «": "✗ Chek! «",
 "» больше нельзя —": "» endi mumkin emas —",
 "обойдись тем, что есть 🙂": "bori bilan kifoyalaning 🙂",
 "🔍 Сенсор живёт в окошке-условии! Брось его в белую рамку у ветки блока If.": "🔍 Sensor shart-oynachada yashaydi! Uni If blokining tarmog'idagi oq ramkaga tashlang.",
 "✋ тяни блок": "✋ blokni torting",
 "👆 тяни блок": "👆 blokni torting",
 "Блоки · лимит": "Bloklar · chek",
 "Блоки": "Bloklar",
 "А": "A",
 "Б": "B",
 "В": "V",
 "Верно! Ты прошёл программу в голове.": "To'g'ri! Dasturni xayolingizda bajarib chiqdingiz.",
 "Coddy пришёл в другую клетку — посмотри, куда именно, и попробуй ещё раз. 🙂": "Coddy boshqa katakka keldi — qayerga kelganiga qarang va yana urinib ko'ring. 🙂",
 "Верно!": "To'g'ri!",
 "Смотри, куда пришёл Coddy, и попробуй ещё раз.": "Coddy qayerga kelganiga qarang va yana urinib ko'ring.",
 "Программа": "Dastur",
 "Проверить ставку": "Taxminni tekshirish",
 "Ещё раз": "Yana bir bor",
 "Сделай ставку:": "Taxmin qiling:",
 "где окажется Coddy?": "Coddy qayerda bo'ladi?",
 "Сделай ставку: где окажется Coddy?": "Taxmin qiling: Coddy qayerda bo'ladi?",
 "Смотрит:": "Qaragan tomoni:",
 "· шагов сделано:": "· qadam qilindi:",
 "✓ Coddy повернулся, но стоит на той же клетке. Поворот — не шаг!": "✓ Coddy burildi, lekin o'sha katakda turibdi. Burilish — bu qadam emas!",
 "нашу левую": "bizning chap",
 "нашу правую": "bizning o'ng",
 "верхнюю": "yuqori",
 "нижнюю": "past",
 "Покрути Coddy и смотри на стрелки:": "Coddy'ni aylantiring va strelkalarga qarang:",
 "зелёная": "yashil",
 "— его лево,": "— uning chapi,",
 "оранжевая": "to'q sariq",
 "— его право.": "— uning o'ngi.",
 "Они поворачиваются вместе с ним!": "Ular u bilan birga buriladi!",
 "Понятно, попробую →": "Tushunarli, urinib ko'raman →",
 "Пример": "Misol",
 "из": "dan",
 ". Coddy смотрит": ". Coddy qaragan tomoni —",
 "Поверни его в сторону": "Uni shu tomonga buring:",
 "Ещё пример": "Yana bir misol",
 ": поверни Coddy к флажку.": ": Coddy'ni bayroqcha tomon buring.",
 "🎉 Отлично! Ты прошёл все 5 примеров и усвоил повороты. Нажми «Дальше».": "🎉 Zo'r! Siz 5 ta misolni ham bajarib, burilishlarni o'zlashtirdingiz. «Davom etish»ni bosing.",
 "✓ Coddy смотрит на флажок! Нужен был «": "✓ Coddy bayroqchaga qarab turibdi! Kerak edi: «",
 "Следующий пример →": "Keyingi misol →",
 "Поздравляю! Теперь ты умеешь делать разворот.": "Tabriklayman! Endi siz orqaga burilishni bilasiz.",
 "= разворот 180°": "= 180° orqaga burilish",
 "Флажок": "Bayroqcha",
 "позади": "orqada",
 "Coddy. Разверни его к флажку!": "Coddy. Uni bayroqcha tomon buring!",
 "✓ Развернулся за": "✓ Orqaga burildi —",
 "поворота": "burilish",
 "поворотов": "burilish",
 "Назад = два поворота в одну сторону = 180°.": "Orqaga = bir tomonga ikki burilish = 180°.",
 "Сейчас смотрит:": "Hozir qaragan tomoni:",
 "Дальше стена — Coddy уже прошёл дорожку. Нажми pick battery, если он на батарейке!": "Oldinda devor — Coddy yo'lakni o'tib bo'ldi. Agar u batareyka ustida tursa, pick battery'ni bosing!",
 "✓ Есть заряд! Coddy стоял НА батарейке — pick battery сработал.": "✓ Quvvat olindi! Coddy batareyka USTIDA turgan edi — pick battery ishladi.",
 "Отлично! Coddy стоял на батарейке и подобрал её. Теперь ты знаешь главное правило.": "Zo'r! Coddy batareyka ustida turib, uni oldi. Endi siz asosiy qoidani bilasiz.",
 "Coddy не на батарейке! pick battery работает только на её клетке. Сначала дойди до неё блоком move.": "Coddy batareyka ustida emas! pick battery faqat uning katagida ishlaydi. Avval move bloki bilan unga yetib boring.",
 "Доведи Coddy до батарейки блоком": "Coddy'ni batareykagacha shu blok bilan olib boring:",
 ", а потом нажми": ", keyin esa bosing:",
 ". Помни: pick battery подбирает, но": ". Yodda tuting: pick battery oladi, lekin",
 "не двигает": "joyidan qimirlatmaydi",
 "Верно! Короткая программа умнее.": "To'g'ri! Qisqa dastur aqlliroq.",
 "Длинная делает то же самое, но тратит куда больше блоков. Короче — значит умнее. Выбери короткую!": "Uzuni ham xuddi shuni qiladi, lekin ancha ko'p blok sarflaydi. Qisqaroq — demak aqlliroq. Qisqasini tanlang!",
 "🐢 Длинная": "🐢 Uzun",
 "🚀 Короткая": "🚀 Qisqa",
 "🐢 Длинная программа": "🐢 Uzun dastur",
 "🚀 Короткая программа": "🚀 Qisqa dastur",
 "· короче на": "· shuncha qisqa:",
 "Запусти обе программы ▶": "Ikkala dasturni ham ishga tushiring ▶",
 "Какая программа умнее?": "Qaysi dastur aqlliroq?",
 "✓ Верно! Короче — значит умнее.": "✓ To'g'ri! Qisqaroq — demak aqlliroq.",
 "Короче — значит умнее. Выбери короткую!": "Qisqaroq — demak aqlliroq. Qisqasini tanlang!",
 "иду по коридору…": "yo'lakdan ketyapman…",
 "а дальше куда?": "keyin qayerga?",
 "💥 стена! программа не знала…": "💥 devor! dastur bilmagan edi…",
 "⬅ слева стена · ➡ СПРАВА ОТКРЫТО!": "⬅ chapda devor · ➡ O'NGDA OCHIQ!",
 "Лабиринт Coddy:": "Coddy labirinti:",
 "Моя программа из 3.3": "3.3 dagi dasturim",
 "Ветки есть… а ВОПРОСА нет! Чем спросить про поворот?": "Tarmoqlar bor… lekin SAVOL yo'q! Burilish haqida nima bilan so'raymiz?",
 "Ветки на месте — шестерёнка работает.": "Tarmoqlar joyida — tishli g'ildirak ishlayapti.",
 "Вот бы у меня были ГЛАЗА в стороны — слева открыто? справа открыто? Я бы сам находил повороты!": "Menda yon tomonlarga KO'Z bo'lganda edi — chapda ochiqmi? o'ngda ochiqmi? Burilishlarni o'zim topardim!",
 "Я умею ВЫБИРАТЬ ветку… но как программа узнает, что впереди ПОВОРОТ?!": "Men tarmoq TANLASHNI bilaman… lekin dastur oldinda BURILISH borligini qanday biladi?!",
 "Показать ещё раз": "Yana bir bor ko'rsatish",
 "Два новых сенсора: путь слева и путь справа. Слева стена, справа открыто": "Ikkita yangi sensor: chapdagi yo'l va o'ngdagi yo'l. Chapda devor, o'ngda ochiq",
 "ДА!": "HA!",
 "Сенсор пути вставляется в окошко условия блока If": "Yo'l sensori If blokining shart oynachasiga qo'yiladi",
 "у каждой": "har birida",
 "ветки —": "tarmoqlar —",
 "свой вопрос": "o'z savoli",
 "else if  ➡ справа?": "else if  ➡ o'ngda?",
 "Универсальный навигатор: три ветки по порядку, в каждой есть move": "Universal navigator: uch tarmoq tartib bilan, har birida move bor",
 "есть move": "move bor",
 "Г": "G",
 "Одна и та же программа проходит лабиринты формы Г, Z и U": "Bitta dasturning o'zi G, Z va U shaklidagi labirintlarni o'tadi",
 "поворот + шаг · поворот + шаг · шаг": "burilish + qadam · burilish + qadam · qadam",
 "форма": "shakl",
 "Озвучить": "Ovoz chiqarib o'qish",
 "кадр ": "kadr ",
 "ДА — туда можно": "HA — u yoqqa mumkin",
 "нет — там стена": "yo'q — u yerda devor",
 "Кружки у Coddy на карте — это и есть его глаза. Зелёная стрелка — путь открыт, серая заглушка — стена.": "Xaritadagi Coddy yonidagi doirachalar — bu uning ko'zlari. Yashil strelka — yo'l ochiq, kulrang to'siq — devor.",
 "Сенсоры + шестерёнка =": "Sensorlar + tishli g'ildirak =",
 "универсальный навигатор": "universal navigator",
 "Два глаза Coddy:": "Coddy'ning ikki ko'zi:",
 "⬅ слева": "⬅ chapda",
 "и": "va",
 "➡ справа": "➡ o'ngda",
 "Ветки проверяются СВЕРХУ ВНИЗ — как в прошлом уроке.": "Tarmoqlar YUQORIDAN PASTGA tekshiriladi — o'tgan darsdagidek.",
 "В КАЖДОЙ ветке есть move — значит за круг ровно один шаг.": "HAR BIR tarmoqda move bor — demak bir aylanishda aynan bitta qadam.",
 "Одна из трёх сработает всегда: слева, справа или прямо.": "Uchtadan biri har doim ishlaydi: chapda, o'ngda yoki to'g'riga.",
 "Всё это — внутри While «до 👁 финиш»: Coddy повторяет, пока не дойдёт.": "Bularning hammasi — While «👁 finishgacha» ichida: Coddy yetib borgunicha takrorlaydi.",
 "форма Г — один поворот": "G shakli — bitta burilish",
 "форма Z — повороты в обе стороны": "Z shakli — ikkala tomonga burilish",
 "код НЕ меняется": "kod O'ZGARMAYDI",
 "глаза крутятся ВМЕСТЕ с Coddy": "ko'zlar Coddy BILAN BIRGA buriladi",
 "стена → «нет», пусто → «ДА»": "devor → «yo'q», bo'sh → «HA»",
 "Запомни этот шаблон — он пройдёт ЛЮБОЙ лабиринт.": "Bu qolipni yodda tuting — u ISTALGAN labirintni o'tadi.",
 "Сенсор живёт в окошке-условии: брось его в белую рамку ветки.": "Sensor shart-oynachada yashaydi: uni tarmoqning oq ramkasiga tashlang.",
 "Куда сворачивать?!": "Qayoqqa burilish kerak?!",
 "Друг, беда! Захожу я в лабиринт со своей программой из прошлого урока. Шестерёнка на месте, ветки на месте — выбирать я умею! Иду прямо… и БАМ — стена. Понимаешь, в чём дело? Ветки-то готовы, а ВОПРОСА нет. Ни один мой сенсор не умеет посмотреть в сторону! Вот бы у меня были глаза: слева открыто? справа открыто? Тогда я бы сам находил повороты. Помоги мне!": "Do'stim, falokat! Men o'tgan darsdagi dasturim bilan labirintga kiraman. Tishli g'ildirak joyida, tarmoqlar joyida — tanlashni bilaman! To'g'ri yuraman… va BAM — devor. Gap nimadaligini tushunyapsizmi? Tarmoqlar tayyor, lekin SAVOL yo'q. Birorta sensorim yon tomonga qaray olmaydi! Menda ko'zlar bo'lganda edi: chapda ochiqmi? o'ngda ochiqmi? Unda burilishlarni o'zim topardim. Menga yordam bering!",
 "Помочь Coddy": "Coddy'ga yordam berish",
 "Глаза для лабиринта": "Labirint uchun ko'zlar",
 "Два новых глаза": "Ikkita yangi ko'z",
 "Coddy догадался абсолютно верно. Сегодня у него появятся два новых сенсора: путь слева и путь справа. Работают они просто: смотрят на соседнюю клетку — слева от Coddy и справа от Coddy. Если там пусто, ответ «да, туда можно». Если стена — ответ «нет». И заметь: стороны считаются ОТ Coddy и поворачиваются вместе с ним. Ты это давно знаешь — мы весь курс крутили Coddy блоками turn left и turn right.": "Coddy mutlaqo to'g'ri topdi. Bugun unda ikkita yangi sensor paydo bo'ladi: chapdagi yo'l va o'ngdagi yo'l. Ular oddiy ishlaydi: qo'shni katakka qaraydi — Coddy'ning chapidagi va o'ngidagi. Agar u yer bo'sh bo'lsa, javob «ha, u yoqqa mumkin». Devor bo'lsa — javob «yo'q». Va e'tibor bering: tomonlar Coddy'DAN hisoblanadi va u bilan birga buriladi. Buni siz allaqachon bilasiz — biz butun kurs davomida Coddy'ni turn left va turn right bloklari bilan aylantirdik.",
 "Вопрос — в ветку": "Savol — tarmoqqa",
 "А теперь самое интересное. Сами по себе сенсоры простые. Вся сила — в СВЯЗКЕ с шестерёнкой из прошлого урока! Помнишь, у блока If появились ветки else if и else? Ветки тогда были, а спрашивать было почти нечего. Сегодня в каждое окошко-условие мы вставим свой глаз: в первую ветку — путь слева, во вторую — путь справа. Ветки наконец получили настоящие вопросы.": "Endi eng qizig'i. Sensorlarning o'zi oddiy. Butun kuch — o'tgan darsdagi tishli g'ildirak bilan BOG'LAMADA! Esingizdami, If blokida else if va else tarmoqlari paydo bo'lgandi? Tarmoqlar o'shanda bor edi, lekin so'raydigan narsa deyarli yo'q edi. Bugun har bir shart-oynachaga o'z ko'zimizni qo'yamiz: birinchi tarmoqqa — chapdagi yo'l, ikkinchisiga — o'ngdagi yo'l. Tarmoqlar nihoyat haqiqiy savollarga ega bo'ldi.",
 "Универсальный навигатор": "Universal navigator",
 "Вот что получается. Читаем по порядку. Если путь слева открыт — повернуть налево и шагнуть. Иначе если путь справа открыт — повернуть направо и шагнуть. Иначе — просто шагнуть вперёд. Три ветки, и ровно одна сработает на каждой клетке. И самое важное: move стоит ВНУТРИ каждой ветки. Поэтому за один круг Coddy продвигается ровно на одну клетку — что бы он там ни увидел.": "Mana nima chiqadi. Tartib bilan o'qiymiz. Agar chapdagi yo'l ochiq bo'lsa — chapga burilib qadam tashlash. Aks holda agar o'ngdagi yo'l ochiq bo'lsa — o'ngga burilib qadam tashlash. Aks holda — shunchaki oldinga qadam tashlash. Uch tarmoq, va har bir katakda aynan bittasi ishlaydi. Eng muhimi esa: move har bir tarmoq ICHIDA turibdi. Shuning uchun bir aylanishda Coddy aynan bir katak siljiydi — u yerda nimani ko'rishidan qat'i nazar.",
 "Один код — любой лабиринт": "Bitta kod — istalgan labirint",
 "И вот ради чего всё затевалось. Эта программа не помнит карту наизусть — она СПРАШИВАЕТ её на каждой клетке. Поэтому один и тот же код проходит и форму Г, и форму Z, и форму У. Ты не переписываешь программу под каждый лабиринт — ты пишешь её ОДИН раз. Это называется универсальный навигатор, и он станет твоим лучшим другом до конца модуля.": "Mana nima uchun bularning hammasi boshlangan edi. Bu dastur xaritani yoddan bilmaydi — u undan har bir katakda SO'RAYDI. Shuning uchun bitta kodning o'zi G shaklini ham, Z shaklini ham, U shaklini ham o'tadi. Siz dasturni har bir labirint uchun qayta yozmaysiz — uni BIR marta yozasiz. Bu universal navigator deb ataladi va u modul oxirigacha sizning eng yaqin do'stingiz bo'ladi.",
 "Поехали": "Ketdik",
 "Глаза Coddy": "Coddy ko'zlari",
 "Давай разглядим глаза поближе. Coddy стоит в углу коридора и смотрит вправо. Впереди у него стена. Сенсор «путь слева» смотрит вверх — там тоже стена, значит ответ «нет». А сенсор «путь справа» смотрит вниз — там пусто, значит «да, туда можно». Видишь два кружка прямо у Coddy на карте? Это и есть его глаза: зелёная стрелка — путь открыт, серая заглушка — стена. Они будут светиться весь урок, а во время прогона тот глаз, который спрашивает программа, вспыхнет оранжевым. Пробуем!": "Keling, ko'zlarni yaqinroqdan ko'ramiz. Coddy yo'lak burchagida turibdi va o'ngga qaraydi. Uning oldida devor. «Chapdagi yo'l» sensori yuqoriga qaraydi — u yerda ham devor, demak javob «yo'q». «O'ngdagi yo'l» sensori esa pastga qaraydi — u yer bo'sh, demak «ha, u yoqqa mumkin». Xaritada Coddy yonidagi ikkita doirachani ko'ryapsizmi? Mana shular uning ko'zlari: yashil strelka — yo'l ochiq, kulrang to'siq — devor. Ular butun dars davomida yonib turadi, bajarilish paytida esa dastur so'ragan ko'z to'q sariq rangda chaqnaydi. Sinab ko'ramiz!",
 "Попробовать": "Urinib ko'rish",
 "Первый поворот": "Birinchi burilish",
 "Первая задача! Коридор идёт вправо, а потом сворачивает вниз. У Coddy появились новые глаза — они смотрят ВЛЕВО и ВПРАВО и говорят, есть ли там дорога. Подумай, о чём спросить на каждой клетке, чтобы он сам нашёл поворот.": "Birinchi vazifa! Yo'lak o'ngga ketadi, keyin pastga buriladi. Coddy'da yangi ko'zlar paydo bo'ldi — ular CHAPGA va O'NGGA qaraydi va u yerda yo'l bor-yo'qligini aytadi. U burilishni o'zi topishi uchun har katakda nimani so'rash kerakligini o'ylang.",
 "While «until» + 👁 «at finish?». Внутрь — If с сенсором ➡ «path to right?»: в ветку if — turn right и move, в ветку else — просто move.": "While «until» + 👁 «at finish?». Ichiga — ➡ «path to right?» sensorli If: if tarmog'iga — turn right va move, else tarmog'iga — shunchaki move.",
 "по одному move в каждой ветке — больше и не нужно.": "har bir tarmoqda bittadan move — ko'proq kerak ham emas.",
 "Coddy САМ нашёл поворот! 🧭 Ты не говорил ему, где сворачивать — он спросил у карты и повернул сам.": "Coddy burilishni O'ZI topdi! 🧭 Siz unga qayerda burilishni aytmadingiz — u xaritadan so'rab, o'zi burildi.",
 "Дальше": "Davom etish",
 "Та же программа — другая карта": "O'sha dastur — boshqa xarita",
 "А теперь фокус, который ты уже видел. Карта другая: коридор короче, поворот в другом месте. Но программу писать заново НЕ надо — собери ровно ту же. Ни одной правки.": "Endi siz allaqachon ko'rgan fokus. Xarita boshqa: yo'lak qisqaroq, burilish boshqa joyda. Lekin dasturni qaytadan yozish SHART EMAS — aynan o'shanisini yig'ing. Bitta ham o'zgartirishsiz.",
 "Та же программа, что в прошлой задаче: While «until» 👁 → If ➡ {turn right, move} else {move}. Менять НИЧЕГО не нужно.": "O'tgan topshiriqdagi o'sha dastur: While «until» 👁 → If ➡ {turn right, move} else {move}. HECH NARSANI o'zgartirish shart emas.",
 "по одному move в каждой ветке.": "har bir tarmoqda bittadan move.",
 "Ни одной правки — а карта пройдена! 🌍 Вот что значит универсальная программа.": "Birorta tuzatishsiz — xarita o'tildi! 🌍 Universal dastur degani mana shu.",
 "Поворот в другую сторону": "Boshqa tomonga burilish",
 "Теперь коридор сворачивает в другую сторону. Структура программы та же — поменяются только глаз и сторона поворота. Догадаешься какие?": "Endi yo'lak boshqa tomonga buriladi. Dastur tuzilishi o'sha — faqat ko'z va burilish tomoni o'zgaradi. Qaysilari ekanini topasizmi?",
 "While «until» + 👁 «at finish?». Внутрь — If с сенсором ⬅ «path to left?»: в ветку if — turn left и move, в ветку else — просто move.": "While «until» + 👁 «at finish?». Ichiga — ⬅ «path to left?» sensorli If: if tarmog'iga — turn left va move, else tarmog'iga — shunchaki move.",
 "Зеркальный поворот освоен! ⬅ Тот же скелет программы — другими были только глаз и сторона поворота.": "Ko'zguli burilish o'zlashtirildi! ⬅ Dasturning skeleti o'sha — faqat ko'z va burilish tomoni boshqacha edi.",
 "А теперь собираем всё вместе — это главная минута урока. Что если в лабиринте есть повороты И налево, И направо? Одного глаза мало. Зато хватит шестерёнки! Берём блок If, добавляем ветку else if и ветку else. В первое окошко — путь слева, во второе — путь справа. В первой ветке поворачиваем налево и шагаем, во второй — направо и шагаем, а в else просто шагаем вперёд. Читается сверху вниз, срабатывает ровно одна ветка, и в каждой есть move. Вот это и есть универсальный навигатор.": "Endi hammasini birga yig'amiz — bu darsning asosiy daqiqasi. Agar labirintda chapga HAM, o'ngga HAM burilishlar bo'lsa-chi? Bitta ko'z kam. Buning o'rniga tishli g'ildirak yetadi! If blokini olamiz, else if tarmog'ini va else tarmog'ini qo'shamiz. Birinchi oynachaga — chapdagi yo'l, ikkinchisiga — o'ngdagi yo'l. Birinchi tarmoqda chapga burilib qadam tashlaymiz, ikkinchisida — o'ngga burilib qadam tashlaymiz, else'da esa shunchaki oldinga qadam tashlaymiz. Yuqoridan pastga o'qiladi, aynan bitta tarmoq ishlaydi va har birida move bor. Mana shu universal navigator.",
 "Собрать": "Yig'ish",
 "🌟 Z-форма: полный навигатор": "🌟 Z-shakl: to'liq navigator",
 "Главная задача урока! Смотри на карту: тут форма Z — сначала поворот в одну сторону, потом в другую. Значит, нужны ОБА глаза и ещё ветка на случай «дороги по бокам нет». Собери полный навигатор — и он пройдёт любой коридор.": "Darsning asosiy vazifasi! Xaritaga qarang: bu yerda Z shakli — avval bir tomonga, keyin boshqa tomonga burilish. Demak, IKKALA ko'z ham kerak va «yon tomonlarda yo'l yo'q» holati uchun yana bir shox. To'liq navigatorni yig'ing — u istalgan yo'lakdan o'tadi.",
 "While «until» 👁 → If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}. Ветки добавляет шестерёнка ⚙️.": "While «until» 👁 → If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}. Tarmoqlarni tishli g'ildirak ⚙️ qo'shadi.",
 "move нужен в каждой из трёх веток — поэтому их три.": "move uchala tarmoqning har birida kerak — shuning uchun ular uchta.",
 "УНИВЕРСАЛЬНЫЙ НАВИГАТОР РАБОТАЕТ! 🧭 Два поворота в разные стороны — и ни одной подсказки от тебя. Coddy спросил карту и выбрал сам.": "UNIVERSAL NAVIGATOR ISHLAYAPTI! 🧭 Ikki tomonga ikki burilish — va sizdan birorta ishora yo'q. Coddy xaritadan so'rab, o'zi tanladi.",
 "Тот же код — новая Z": "O'sha kod — yangi Z",
 "Новая карта — и снова та же самая программа. Ничего не меняй, просто собери навигатор и запусти. Тут Z длиннее, но навигатору всё равно.": "Yangi xarita — va yana o'sha dastur. Hech narsani o'zgartirmang, shunchaki navigatorni yig'ing va ishga tushiring. Bu yerda Z uzunroq, lekin navigatorga baribir.",
 "Ровно тот же навигатор из прошлой задачи: If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}.": "O'tgan topshiriqdagi aynan o'sha navigator: If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}.",
 "move — по одному в каждой ветке.": "move — har bir tarmoqda bittadan.",
 "Та же программа — другая Z! ⭐ Ты уже решаешь не один лабиринт, а сразу все.": "O'sha dastur — boshqa Z! ⭐ Siz endi bitta labirintni emas, hammasini birdan yechyapsiz.",
 "Четыре поворота": "To'rt burilish",
 "Тут поворотов сразу четыре. Программу опять НЕ трогай. И понаблюдай за глазами Coddy во время прогона: сразу видно, какая ветка сработала.": "Bu yerda burilish to'rtta. Dasturga yana TEGMANG. Va ishga tushganda Coddy'ning ko'zlarini kuzating: qaysi shox ishlaganini darrov ko'rasiz.",
 "Тот же навигатор, что и на прошлых картах. Чисел тут нет вообще — While сам доведёт Coddy до флажка.": "O'tgan xaritalardagi o'sha navigator. Bu yerda umuman son yo'q — While Coddy'ni bayroqchagacha o'zi olib boradi.",
 "ЧЕТЫРЕ поворота одним кодом! 💪 Чем длиннее лабиринт, тем виднее, зачем нужен универсальный навигатор.": "TO'RT burilish bitta kod bilan! 💪 Labirint qanchalik uzun bo'lsa, universal navigator nima uchun kerakligi shunchalik ko'rinadi.",
 "Навигатор + батарейки": "Navigator + batareykalar",
 "Усложняем: в лабиринте появились батарейки. Блок If по-прежнему ОДИН — просто добавь ему ещё одну ветку через шестерёнку. Подумай, какой она должна быть по счёту: если сначала спросить про дорогу, Coddy уйдёт с батарейки, так и не подобрав её.": "Murakkablashtiramiz: labirintda batareykalar paydo bo'ldi. If bloki hamon BITTA — unga tishli g'ildirak orqali yana bir tarmoq qo'shing, xolos. U nechanchi bo'lishi kerakligini o'ylang: avval yo'l haqida so'ralsa, Coddy batareykani olmasdan ketib qoladi.",
 "Один блок If: первая ветка 🔋 «has battery?» → pick battery (без move!), дальше ⬅ и ➡ как в навигаторе, и else → move.": "Bitta If bloki: birinchi tarmoq 🔋 «has battery?» → pick battery (move'siz!), keyin navigatordagidek ⬅ va ➡, va else → move.",
 "блоков If тут ровно два: один водит, второй собирает.": "bu yerda If bloklari aynan ikkita: biri boshlaydi, ikkinchisi yig'adi.",
 "Три батарейки и точный маршрут! 🔋 Навигация и сбор — две отдельные задачи, и у каждой свой If.": "Uch batareyka va aniq yo'l! 🔋 Navigatsiya va yig'ish — ikki alohida vazifa, va har birining o'z If'i bor.",
 "🏆 ФИНАЛ: весь модуль 3 сразу": "🏆 FINAL: butun 3-modul birdaniga",
 "Финал урока — и всё, что ты знаешь про модуль три, в ОДНОМ блоке If. В лабиринте форма Z, батарейки, щит и вирус. Подумай о двух вещах: в каком порядке идут ветки и в каких из них нужен шаг, а в каких нет.": "Darsning yakuni — va uchinchi modul haqida bilganingizning hammasi BITTA If blokida. Labirintda Z shakli, batareykalar, qalqon va virus. Ikki narsani o'ylang: tarmoqlar qanday tartibda turadi va ularning qaysilarida qadam kerak, qaysilarida yo'q.",
 "Один блок If на пять веток: ⚠ {take shield, move} · 🔋 {pick battery} · ⬅ {turn left, move} · ➡ {turn right, move} · else {move}. Блоков move нужно четыре.": "Bitta If bloki, beshta tarmoq: ⚠ {take shield, move} · 🔋 {pick battery} · ⬅ {turn left, move} · ➡ {turn right, move} · else {move}. move bloklari to'rtta kerak.",
 "три блока If: защита, дорога, добыча.": "uchta If bloki: himoya, yo'l, o'lja.",
 "МАСТЕР НАВИГАЦИИ! 🏆 Один код провёл Coddy через повороты, защитил от вируса и собрал всё до последней батарейки. Так пишут настоящие программисты!": "NAVIGATSIYA USTASI! 🏆 Bitta kod Coddy'ni burilishlardan olib o'tdi, virusdan himoya qildi va oxirgi batareykagacha hammasini yig'di. Haqiqiy dasturchilar shunday yozadi!",
 "Мастер навигации! 🧭": "Navigatsiya ustasi! 🧭",
 "Поздравляю! Сегодня Coddy получил два глаза — путь слева и путь справа — а ты соединил их с шестерёнкой из прошлого урока. Так и родился универсальный навигатор: если слева открыто — налево, иначе если справа — направо, иначе прямо. Один код на любой лабиринт. Запомни этот шаблон, он ещё не раз пригодится. А в следующем уроке Coddy станет настоящим следопытом: соберём вместе ВСЕ навыки модуля три. Нажми «Завершить».": "Tabriklayman! Bugun Coddy ikkita ko'z oldi — chapdagi yo'l va o'ngdagi yo'l — siz esa ularni o'tgan darsdagi tishli g'ildirak bilan birlashtirdingiz. Shunday qilib universal navigator tug'ildi: chapda ochiq bo'lsa — chapga, aks holda o'ngda bo'lsa — o'ngga, aks holda to'g'riga. Bitta kod istalgan labirintga. Bu qolipni yodda tuting, u yana ko'p marta asqotadi. Keyingi darsda esa Coddy haqiqiy izquvar bo'ladi: uchinchi modulning BARCHA ko'nikmalarini birga yig'amiz. «Yakunlash»ni bosing.",
 "Завершить": "Yakunlash",
 "⬅ path to left? — слева свободно?": "⬅ path to left? — chapda bo'shmi?",
 "➡ path to right? — справа свободно?": "➡ path to right? — o'ngda bo'shmi?",
 "🧭 стороны считаются ОТ Coddy": "🧭 tomonlar Coddy'DAN hisoblanadi",
 "⚙️ вопросы — в ветки шестерёнки": "⚙️ savollar — tishli g'ildirak tarmoqlariga",
 "🚶 move ВНУТРИ каждой ветки": "🚶 move HAR BIR tarmoq ICHIDA",
 "♾️ один код — любой лабиринт": "♾️ bitta kod — istalgan labirint",
 "Урок пройден! Теперь Coddy сам находит дорогу: путь слева, путь справа — и универсальный навигатор!": "Dars o'tildi! Endi Coddy yo'lni o'zi topadi: chapdagi yo'l, o'ngdagi yo'l — va universal navigator!",
 "Сенсоры пути в действии": "Yo'l sensorlari ish boshida",
 "Coddy · 3.4 · Сенсоры пути": "Coddy · 3.4 · Yo'l sensorlari",
 "Звук": "Ovoz",
 "Тихо": "Ovozsiz",
 "Новые блоки урока": "Darsning yangi bloklari",
 "Что ты освоил": "Nimani o'zlashtirdingiz",
 "Теперь я сам вижу повороты! Один и тот же код — и Г, и Z, и четыре поворота подряд. А в следующем уроке стану настоящим следопытом!": "Endi men burilishlarni o'zim ko'raman! Bitta kodning o'zi — G ham, Z ham, ketma-ket to'rt burilish ham. Keyingi darsda esa haqiqiy izquvar bo'laman!",
 "Назад": "Orqaga",
 "Выполни задание": "Topshiriqni bajaring",
 "Навигатор собран! 🧭": "Navigator yig'ildi! 🧭",
 "Путь слева? Путь справа? Иначе — вперёд. Один код проходит любой лабиринт. Впереди — Coddy-следопыт!": "Chapda yo'l? O'ngda yo'l? Aks holda — oldinga. Bitta kod istalgan labirintni o'tadi. Oldinda — Coddy-izquvar!",
 "Пройти ещё раз": "Yana bir bor o'tish"
} /*UZDICT>>*/;

// uzT() — единственная точка перевода.
// ru → возвращает аргумент без изменений (идентичность сохраняется).
// uz → строка из словаря; нет перевода — остаётся русский (урок не ломается).
function uzT(v) {
  if (CODDY_LANG !== 'uz' || v == null) return v;
  if (typeof v === 'string') { var t = UZ_DICT[v]; return t == null ? v : t; }
  if (Array.isArray(v)) {
    var ch = false, out = new Array(v.length);
    for (var i = 0; i < v.length; i++) { out[i] = uzT(v[i]); if (out[i] !== v[i]) ch = true; }
    return ch ? out : v;
  }
  if (typeof v === 'object') {
    if (('uz' in v) || ('ru' in v)) return v.uz != null ? v.uz : v.ru;
    var ch2 = false, o = {};
    for (var k in v) { o[k] = uzT(v[k]); if (o[k] !== v[k]) ch2 = true; }
    return ch2 ? o : v;
  }
  return v;
}
// uzTr(uz, ru) — когда формулировки расходятся структурно, а не пословно.
function uzTr(uz, ru) { return CODDY_LANG === 'uz' ? uz : ru; }
// ==================== /i18n ====================

// ============================================================
// УРОК 3.4 — «Сенсоры пути в действии» 🧭 (ЧЕТВЁРТЫЙ урок модуля 3 — «Решения в опасном мире»)
// Дети 8-10. Собран по пайплайну на инфраструктуре урока 3.3 (шестерёнка If) ← эталон 1.2…3.3.
// ГЛАВНАЯ ЦЕЛЬ: УНИВЕРСАЛЬНЫЙ НАВИГАТОР — ОДИН код, который проходит ЛЮБОЙ лабиринт. Новое тут не
//   сами сенсоры (они простые), а их СВЯЗКА с шестерёнкой If/Else If/Else из 3.3: вот ради чего
//   в прошлом уроке росли ветки.
// НОВОЕ — ДВА СЕНСОРА ПУТИ:
//   • ⬅ path to left?  — «клетка слева от Coddy свободна?»
//   • ➡ path to right? — «клетка справа от Coddy свободна?»
//   Смотрят ОТ Coddy и крутятся вместе с ним — ровно как turn left / turn right, которые ребёнок
//   знает весь курс (поэтому «право Coddy vs право карты» НЕ объясняем заново — сценарий прав).
//   Свободна = в границах карты И не стена; вирусы/щиты/батарейки проходимости не меняют.
// НОВОЕ — «ГЛАЗА НА КАРТЕ» (PathEye): у Coddy всегда видны два боковых индикатора — зелёная стрелка
//   (путь открыт) или серая заглушка со стенкой. Во время прогона тот, который спрашивает программа,
//   вспыхивает оранжевым. Ребёнок видит ответ сенсора НА КАРТЕ, а не только в блоке — это карта-side
//   пара к «живым ответам веток» из 3.3.
// ГЛАВНЫЙ ПАТТЕРН УРОКА (заклинание модуля 3):
//   While до 👁 финиш { If ⬅ {turn left; move} Else If ➡ {turn right; move} Else {move} }
//   move ВНУТРИ КАЖДОЙ ветки → за круг Coddy продвигается ровно на 1 клетку; ветки проверяются
//   по порядку сверху вниз, срабатывает ровно одна. Один код — Г, Z, четыре поворота, финал.
// МЕХАНИКА: карты стали настоящими ЛАБИРИНТАМИ (повороты, а не прямой коридор). Задаются ОТКРЫТЫМИ
//   клетками — seg()/path()/mazeInner(): всё, что не путь, автоматически стена. Так карту невозможно
//   «недостроить» и случайно оставить дырку, из-за которой сенсор соврёт.
// 8 боевых sandbox-уровней (порт карт сценария 3.4.1–3.4.8): L1-L2 первый поворот (If/Else + ➡),
//   L3 поворот в другую сторону (⬅), L4 🌟 ПОЛНЫЙ навигатор на Z-карте, L5 он же на другой Z,
//   L6 четыре поворота, L7 навигатор + сбор батареек, L8 ФИНАЛ — навигатор + щит + сбор.
//   move зафиксирован в 1 шаг (lockMove1). Coddy говорит ТОЛЬКО в Hook; дальше — Ментор.
//   ⚠️ Карты сценария ужаты по краям: убраны сплошные стеновые столбцы/строки, не участвующие
//   в геометрии пути (9×7 → 7×7, 11×7 → 9×5). Путь и координаты S/F идентичны сценарию — ужимка
//   нужна, чтобы высокая карта помещалась на мобиле без скролла.
//   Прод-1.2 и уроки 2.1…3.3 НЕ затрагивает (отдельный файл + отдельная сборка/деплой).
// ============================================================

const CELL = 46;
const DIRS  = { right: [1, 0], down: [0, 1], left: [-1, 0], up: [0, -1] };
const LEFT  = { right: 'up', up: 'left', left: 'down', down: 'right' };
const RIGHT = { right: 'down', down: 'left', left: 'up', up: 'right' };
const ANG   = { right: 0, down: 90, left: 180, up: 270 };
// Ленивые: язык приходит пропом lang уже в рендере, а модуль вычисляется раньше.
const DIRRU = { get right() { return uzT("вправо"); }, get down() { return uzT("вниз"); }, get left() { return uzT("влево"); }, get up() { return uzT("вверх"); } };

const T = {
  // chrome (English-эталон)
  bg: '#F6F4EF', panel: '#FFFFFF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  accent: '#FF4F28', accentSoft: '#FFE8E1', accentDk: '#D63B16',
  green: '#1FA463', greenSoft: '#E3F0E8', greenDk: '#178A52',
  red: '#FF5A4D', redSoft: '#FFE3DF',
  mentor: '#019ACB', mentorSoft: '#ECF6FA',
  hint: '#E8B53A', hintSoft: '#FFF8E6',
  // блоки (как в реальном Blockly)
  motion: '#4C97FF', motionDk: '#3B7FDB',
  event: '#FFAB19', eventDk: '#E0930B',
  action: '#FF6680', actionDk: '#CC5266',   // pick battery / pick coin — розовый блок-действие (как на платформе)
  battery: '#46C24F', batteryGlow: 'rgba(70,194,79,0.45)',  // заряд/искра
  // плитки карты (фото 1)
  tileLight: '#CFE9FA', tileLightEdge: '#B6DCF3', tileDark: '#4F8AD0', tileDarkTop: '#6CA0DC',
  // алиасы для комикса (коридор/стена)
  tile: '#CFE9FA', wall: '#4F8AD0', wallTop: '#6CA0DC',
  // Coddy
  helmet: '#EEF2F6', helmetSh: '#D6DEE6', visor: '#15314A', cyan: '#49E2DB',
  ear: '#FF8A4C', earDk: '#E0712F', body: '#2B3A55', limb: '#C7D0DA',
  leftC: '#1FA463', rightC: '#FF7A1A',
};

let _id = 0;
const uid = () => ++_id;
// Копирование выключено полностью (парная правка к правилу .cl-root в CSS): гасим и события,
// чтобы Ctrl+C, правый клик и нативный drag не могли создать «копию блока» под курсором.
const noCopy = (e) => e.preventDefault();
const NO_COPY = { onCopy: noCopy, onCut: noCopy, onDragStart: noCopy, onContextMenu: noCopy };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const key = (c, r) => c + ',' + r;
// склонение «блок / блока / блоков» по числу (для счётчиков урока 1.5)
const blocksWord = (n) => { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return uzT("блок"); if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return uzT("блока"); return uzT("блоков"); };
// склонение «шаг / шага / шагов» — для блока move N
const stepsWord = (n) => { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return uzT("шаг"); if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return uzT("шага"); return uzT("шагов"); };

// --- reduced-motion: множитель длительностей (0 = мгновенно) ---
const MOTION = { d: 1 };
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, Math.round(ms * MOTION.d))));

// --- SFX без файлов (один AudioContext) ---
let _actx = null, SFX_ON = true;
// Платформенные «верно/неверно» приходят из useSfx(); ссылку кладёт главный компонент.
// Игровые звуки урока (шаг, поворот, стук) остаются свои — контракт их не касается.
let PLAT_SFX = null;
function sfx(type, notify) {
  if (!SFX_ON) return;
  // Только оценивaемый ответ: победа/промах уровня. На финальном экране notify=false.
  if (PLAT_SFX && notify !== false) { if (type === 'win') PLAT_SFX.playCorrect(); else if (type === 'miss') PLAT_SFX.playWrong(); }
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    _actx = _actx || new AC(); const ctx = _actx; if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime;
    const beep = (f, dur, when, wave = 'sine', g = 0.12) => {
      const o = ctx.createOscillator(), ga = ctx.createGain();
      o.type = wave; o.frequency.value = f;
      ga.gain.setValueAtTime(0.0001, t0 + when);
      ga.gain.exponentialRampToValueAtTime(g, t0 + when + 0.01);
      ga.gain.exponentialRampToValueAtTime(0.0001, t0 + when + dur);
      o.connect(ga); ga.connect(ctx.destination); o.start(t0 + when); o.stop(t0 + when + dur + 0.03);
    };
    if (type === 'turn') beep(840, 0.08, 0, 'square', 0.06);
    else if (type === 'step') beep(420, 0.05, 0, 'square', 0.05);
    else if (type === 'bump') beep(150, 0.2, 0, 'sine', 0.2);
    else if (type === 'win') { beep(660, 0.12, 0); beep(880, 0.14, 0.12); }
    else if (type === 'miss') { beep(340, 0.12, 0, 'square', 0.12); beep(200, 0.2, 0.1, 'square', 0.12); }
    else if (type === 'pop') beep(620, 0.07, 0, 'triangle', 0.08);
    else if (type === 'charge') { beep(540, 0.09, 0, 'triangle', 0.1); beep(720, 0.09, 0.08, 'triangle', 0.1); beep(960, 0.16, 0.16, 'triangle', 0.11); } // зарядка: восходящая искра
    else if (type === 'nope') beep(300, 0.16, 0, 'sine', 0.12); // мягкое «не здесь» (pick на пустой клетке)
    else if (type === 'limit') { beep(220, 0.1, 0, 'square', 0.12); beep(150, 0.16, 0.08, 'square', 0.12); } // «✗ лимит исчерпан» — блоков больше нельзя
    else if (type === 'shield') { beep(520, 0.09, 0, 'triangle', 0.11); beep(700, 0.1, 0.08, 'triangle', 0.11); beep(900, 0.14, 0.16, 'sine', 0.1); } // взял щит — восходящий «дзинь»
    else if (type === 'crack') { beep(340, 0.06, 0, 'square', 0.14); beep(180, 0.14, 0.05, 'sawtooth', 0.14); } // щит треснул «крак»
    else if (type === 'hit') { beep(200, 0.18, 0, 'sawtooth', 0.16); beep(120, 0.22, 0.12, 'square', 0.14); } // вирус ударил — низкий «бз-з»
    else if (type === 'sense') { beep(880, 0.055, 0, 'sine', 0.085); beep(1245, 0.08, 0.05, 'sine', 0.085); } // сенсор ответил «ДА» — звонкий «дзинь-к»
    else if (type === 'senseno') { beep(430, 0.05, 0, 'sine', 0.045); } // сенсор ответил «нет» — тихий короткий блип
    else if (type === 'gear') { beep(300, 0.04, 0, 'square', 0.05); beep(420, 0.04, 0.045, 'square', 0.05); beep(580, 0.06, 0.09, 'square', 0.05); } // шестерёнка щёлкнула — механический трещоточный клик
  } catch (e) { /* no-op */ }
}

// --- единая логика хода ---
// pick_battery — НЕ движение: не двигает и не поворачивает (сбор обрабатывают циклы run).
// Пишем «Coddy», а произносим «Коддий» — иначе синтезатор читает имя по-английски.
// Эмодзи не должны попадать в озвучку: синтезатор читает их названиями.
// Убираем только из речи — на экране они остаются.
function stripEmoji(t) {
  return String(t == null ? '' : t)
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F3FB}-\u{1F3FF}\uFE0F\uFE0E\u200D\u20E3]/gu, '')
    .replace(/[\u2713\u2714\u2717\u2718\u2605\u2606\u2192\u2190\u2191\u2193\u21D2\u21C4]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?;:…»])/g, '$1')
    .trim();
}
function ttsName(t) { return stripEmoji(String(t == null ? '' : t).replace(/\bCoddy(['’]?[a-zA-Z]*)/g, function (m0, suf) { return (function () {
     var nm = uzT("Кодди");
     if (!suf) return nm;
     // На узбекском аффикс присоединяется через апостроф: Koddy'ni, Koddy'ga.
     if (CODDY_LANG === 'uz' && suf[0] !== "'" && suf[0] !== '’') return nm + "'" + suf;
     return nm + suf;
    })(); })); }

// Маркер языка ElevenLabs v3 обязателен в НАЧАЛЕ каждой озвучиваемой строки.
const TTS_MARK_UZ = "[O'zbekcha tallaffuz] ", TTS_MARK_RU = '[Русское произношение] ';
// «!» или «?» сразу за названием блока движок отыгрывает эмоцией («Repeat!» звучит как
// восторг), поэтому там ставим нейтральную точку. Длинные названия идут первыми.
const EN_BLOCKS = ['pick battery', 'take shield', 'move 1 step', 'turn left', 'turn right',
  'path left', 'path right', 'at finish', 'has battery', 'danger front', 'shield front',
  'Start Game', 'else if', 'repeat', 'while', 'until', 'move', 'else', 'if'];
const EN_RE = new RegExp('\\b(' + EN_BLOCKS.join('|') + ')\\b\\s*([!?]+)', 'gi');
function ttsBlocks(t) { return String(t).replace(EN_RE, function (m0, tok) { return tok + '.'; }); }
// Числа в озвучке — прописью: «7» диктор читает обрывком, нужно «семь».
const NUM_RU = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять',
  'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать',
  'восемнадцать', 'девятнадцать'];
const TENS_RU = { 2: 'двадцать', 3: 'тридцать', 4: 'сорок', 5: 'пятьдесят', 6: 'шестьдесят', 7: 'семьдесят', 8: 'восемьдесят', 9: 'девяносто' };
const HUND_RU = { 1: 'сто', 2: 'двести', 3: 'триста', 4: 'четыреста', 5: 'пятьсот', 6: 'шестьсот', 7: 'семьсот', 8: 'восемьсот', 9: 'девятьсот' };
const NUM_UZ = ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"];
const TENS_UZ = { 1: "o'n", 2: 'yigirma', 3: "o'ttiz", 4: 'qirq', 5: 'ellik', 6: 'oltmish', 7: 'yetmish', 8: 'sakson', 9: "to'qson" };
function numWord(n) {
  if (CODDY_LANG === 'uz') {
    if (n < 10) return NUM_UZ[n];
    if (n < 100) { const t = Math.floor(n / 10), u = n % 10; return TENS_UZ[t] + (u ? ' ' + NUM_UZ[u] : ''); }
    if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h > 1 ? NUM_UZ[h] + ' ' : '') + 'yuz' + (r ? ' ' + numWord(r) : ''); }
    return String(n);
  }
  if (n < 20) return NUM_RU[n];
  if (n < 100) { const t = Math.floor(n / 10), u = n % 10; return TENS_RU[t] + (u ? ' ' + NUM_RU[u] : ''); }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return HUND_RU[h] + (r ? ' ' + numWord(r) : ''); }
  return String(n);
}
// «180°» диктор прочитал бы как число без единицы — подставляем слово.
function ttsDegrees(t) { return String(t).replace(/(\d+)\s*°/g, function (m0, d) { return numWord(parseInt(d, 10)) + (CODDY_LANG === 'uz' ? ' daraja' : ' градусов'); }); }
function ttsNumbers(t) { return String(t).replace(/\d+/g, function (d) { const n = parseInt(d, 10); return n <= 999 ? numWord(n) : d; }); }
function ttsMark(t) { return (CODDY_LANG === 'uz' ? TTS_MARK_UZ : TTS_MARK_RU) + ttsNumbers(ttsDegrees(ttsBlocks(ttsName(t)))); }
// Очередь сегментов пуста: урок ведёт рассказ императивно, через pushOneOff.
const NO_SEGMENTS = [];
// Сколько держать кадр комикса без сигналов плеера: примерно столько, сколько диктор читает
// фразу (замер живого TTS: 140 символов исходного текста = 10.7 с звука).
const readMs = (t) => Math.max(4500, Math.min(28000, String(t || '').length * 80));
// Имя ученика ставим перед фразой: «Азиз, лапы устали!». Первую букву опускаем только если
// это обычное слово, а не название блока и не аббревиатура.
const NAME_KEEP = /^(repeat|move|while|until|if|else|pick|take|turn|path|start|game|coddy)$/i;
function lcFirst(s) {
  const t = String(s == null ? '' : s);
  const w = (t.match(/^[\wА-Яа-яЁё'’]+/) || [''])[0];
  if (!w || w.length < 2 || NAME_KEEP.test(w) || w === w.toUpperCase()) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
function applyStep(cur, k, level) {
  if (k === 'left') return { next: { ...cur, dir: LEFT[cur.dir] }, turned: true };
  if (k === 'right') return { next: { ...cur, dir: RIGHT[cur.dir] }, turned: true };
  if (k === 'battery' || k === 'coin') return { next: cur, act: true };
  const [dc, dr] = DIRS[cur.dir]; const nc = cur.c + dc, nr = cur.r + dr;
  if (nc < 0 || nr < 0 || nc >= level.cols || nr >= level.rows || level.walls.has(key(nc, nr))) return { next: cur, bumped: true };
  return { next: { ...cur, c: nc, r: nr } };
}

function buildWalls(cols, rows, inner = []) {
  const w = new Set();
  for (let c = 0; c < cols; c++) { w.add(key(c, 0)); w.add(key(c, rows - 1)); }
  for (let r = 0; r < rows; r++) { w.add(key(0, r)); w.add(key(cols - 1, r)); }
  inner.forEach(([c, r]) => w.add(key(c, r)));
  return w;
}

// СЛЕД-РИСУНОК (урок 2.3): «чернила», которыми путь Coddy рисует фигуру на карте. Фиолетовый — отдельный цвет «чернил»
// (блок Repeat теперь зелёный, как на платформе; след намеренно контрастный). Линия по центрам пройденных клеток.
// След Coddy рисуем только в 2.3/2.4 (уроки про фигуры). Дальше он мешает — карту
// читают по стенам и сенсорам, поэтому в MiniGrid уходит trail={null}.
const TRAIL = { line: '#8E5BE0', dot: '#6F42C1', glow: 'rgba(124,78,207,0.45)' };

// ============================================================
// Coddy — официальный арт пользователя (PNG -> WebP data-URI), 4 ракурса.
// 4=анфас(front), 5=право(right), 6=лево(left), 7=спина(back). Обрезаны по контуру,
// уменьшены и встроены скриптом embed_coddy_png.py — НЕ редактировать вручную.
// ============================================================
// CODDY_ART_START
// Ссылки на медиатеку платформы вместо встроенных data-URI: файл урока легче на ~90 КБ,
// а WebP 320×480 весит 86 КБ на все четыре ракурса (исходные PNG 2000×2000 — 4.43 МБ).
// Если ментор положит ракурсы в манифест урока (img_coddy_front|right|left|back),
// useAssets() перекроет эти ссылки.
const CODDY_IMG = {
  "front": "https://crm.junior-it.uz/uploads/media_library/1f32d8e8c7ca28653a0361e776a48733.webp",
  "right": "https://crm.junior-it.uz/uploads/media_library/3958becef1222baa335aa594bac566fd.webp",
  "left": "https://crm.junior-it.uz/uploads/media_library/7ab8464df372307c1bcce9b2a043415a.webp",
  "back": "https://crm.junior-it.uz/uploads/media_library/050b8cbe360fb66fe566aae25cd800df.webp",
};
// CODDY_ART_END
const CODDY_ART = { down: 'front', up: 'back', left: 'left', right: 'right' };

// CX_KIT_START — общий кит «живого комикса»: SVG-примитивы с объёмом + маскот в кадре.
// Генерируется apply-cx-kit.js. Классы анимаций (cx-*) объявлены в CSS-ките внизу файла.
// Все примитивы рисуются в координатах viewBox кадра (обычно 200x130).
//
// ⚠️ ПРАВИЛО: CSS-анимация transform ПЕРЕБИВАЕТ SVG-атрибут transform. Никогда не вешай
// cx-класс с transform (float/travel/pop/…) на узел, у которого есть transform="translate(...)" —
// он телепортируется в угол кадра. Оборачивай: <g className="cx-…"><g transform="…">…</g></g>.
// Примитивы ниже уже устроены так: className уходит на внешний <g>, позиция — на внутренний.

// Общие defs: градиенты неба/пола/плитки/стены + мягкая тень. id фиксированные — кадр на экране один.
function CxDefs() {
  return (
    <defs>
      <linearGradient id="cxSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F6FBFF" /><stop offset="55%" stopColor="#E8F4FE" /><stop offset="100%" stopColor="#D8EBFB" />
      </linearGradient>
      <linearGradient id="cxFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#CFE6F8" /><stop offset="100%" stopColor="#B9D8F1" />
      </linearGradient>
      <linearGradient id="cxTile" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" /><stop offset="45%" stopColor="#EAF6FE" /><stop offset="100%" stopColor="#D3EAFB" />
      </linearGradient>
      <linearGradient id="cxWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7FB2EA" /><stop offset="55%" stopColor="#5189D4" /><stop offset="100%" stopColor="#3F74C0" />
      </linearGradient>
      <radialGradient id="cxGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" /><stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.25" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cxBlkMotion" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7CB4FF" /><stop offset="100%" stopColor={T.motion} />
      </linearGradient>
      <linearGradient id="cxBlkEvent" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFC65C" /><stop offset="100%" stopColor={T.event} />
      </linearGradient>
      <linearGradient id="cxBlkLoop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7FC97F" /><stop offset="100%" stopColor="#5BA55B" />
      </linearGradient>
      <linearGradient id="cxSheenG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="cxDrop" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.6" stdDeviation="1.5" floodColor="#14324F" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}

// Сцена кадра: небо с градиентом, мягкий пол, лёгкая виньетка. floor=false — без пола.
function CxStage({ w = 200, h = 130, r = 16, floor = true, floorY }) {
  const fy = floorY == null ? h - 26 : floorY;
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width={w} height={h} rx={r} fill="url(#cxSky)" />
      {floor && <path d={`M8 ${fy} H${w - 8} V${h - r} q0 ${r} -${r} ${r} H${r} q-${r} 0 -${r} -${r} Z`} fill="url(#cxFloor)" opacity="0.85" />}
      {floor && <path d={`M8 ${fy} H${w - 8}`} stroke="#FFFFFF" strokeWidth="1.4" opacity="0.65" />}
      <rect x="0" y="0" width={w} height={h} rx={r} fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.7" />
    </g>
  );
}

// Маскот прямо в кадре комикса (вместо кружка с буквой). x,y — левый верхний угол, size — сторона.
function CxCoddy({ x = 0, y = 0, size = 42, facing = 'right', className, style, shadow = true, glow = false }) {
  const view = (typeof CODDY_ART !== 'undefined' && CODDY_ART[facing]) || 'right';
  const url = (typeof CODDY_IMG !== 'undefined' && (CODDY_IMG[view] || CODDY_IMG.front)) || '';
  return (
    <g className={className} style={style}>
      <g transform={`translate(${x} ${y})`}>
        {glow && <circle cx={size / 2} cy={size / 2} r={size * 0.62} fill="url(#cxGlow)" />}
        {shadow && <ellipse cx={size / 2} cy={size * 0.99} rx={size * 0.33} ry={size * 0.095} fill="#14324F" opacity="0.18" />}
        <image href={url} x="0" y="0" width={size} height={size} preserveAspectRatio="xMidYMid meet" />
      </g>
    </g>
  );
}

// Клетка карты с объёмом: светлая (пол) или тёмная (стена).
function CxTile({ x, y, s, wall = false, r, className, style }) {
  const rad = r == null ? Math.max(3, s * 0.2) : r;
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={s} height={s} rx={rad} fill={wall ? 'url(#cxWall)' : 'url(#cxTile)'} />
      <rect x={x + 1} y={y + 1} width={s - 2} height={s * 0.32} rx={rad * 0.7} fill="#FFFFFF" opacity={wall ? 0.22 : 0.55} />
      <rect x={x} y={y} width={s} height={s} rx={rad} fill="none" stroke={wall ? '#315F9F' : '#BFE0F7'} strokeWidth="0.9" />
    </g>
  );
}

// Блок программы в стиле платформы (с объёмом): kind -> цвет из палитры T.
function CxBlock({ x, y, w = 62, h = 20, label, kind = 'motion', icon, className, style, fontSize = 9.5 }) {
  const C = {
    motion: [T.motion, T.motionDk], event: [T.event, T.eventDk], action: [T.action || '#46B84C', T.actionDk || '#37962E'],
    loop: ['#5BA55B', '#498449'], sensor: ['#2BA86E', '#1E8A57'], danger: ['#E8481C', '#B4240A'], shield: ['#2CA3D8', '#1E8FC0'],
  }[kind] || [T.motion, T.motionDk];
  const r = Math.min(6, h * 0.32);
  return (
    <g className={className} style={style}>
      <rect x={x} y={y + 2.5} width={w} height={h} rx={r} fill={C[1]} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={C[0]} />
      <rect x={x + 1.5} y={y + 1.5} width={w - 3} height={h * 0.38} rx={r * 0.7} fill="#FFFFFF" opacity="0.24" />
      {icon}
      <text x={x + w / 2 + (icon ? 5 : 0)} y={y + h / 2 + fontSize * 0.36} fontSize={fontSize} fontWeight="800" fill="#FFFFFF" textAnchor="middle">{label}</text>
    </g>
  );
}

// Искорка-звёздочка (внимание/успех).
function CxSpark({ x, y, s = 10, color = '#FFD23F', className = 'cx-spark', style }) {
  const h = s / 2;
  return (
    <g className={className} style={style}>
      <path transform={`translate(${x} ${y})`}
        d={`M${h} 0 L${h * 1.24} ${h * 0.76} L${s} ${h} L${h * 1.24} ${h * 1.24} L${h} ${s} L${h * 0.76} ${h * 1.24} L0 ${h} L${h * 0.76} ${h * 0.76} Z`}
        fill={color} />
    </g>
  );
}

// Человечек (ребёнок/взрослый) для «жизненных» метафор: мягкие формы, объём, лицо с бликами.
// (x,y) — точка ПОД НОГАМИ. h — рост. walking — ноги шагают, wave — рука машет «иди сюда».
function CxKid({ x, y, h = 46, shirt = '#1FA463', pants = '#3B4A66', skin = '#FFE0B8', hair = '#6B4A2E', facing = 'right', walking = false, wave = false, className, style }) {
  const s = (v) => +(v * h).toFixed(2);
  const flip = facing === 'left' ? -1 : 1;
  const leg = (dx, d) => (
    <g className={walking ? 'cx-swing' : undefined} style={walking && d ? { '--d': d } : undefined}>
      <rect x={s(dx)} y={s(-0.32)} width={s(0.12)} height={s(0.335)} rx={s(0.06)} fill={pants} />
      <rect x={s(dx - 0.045)} y={s(-0.03)} width={s(0.175)} height={s(0.075)} rx={s(0.037)} fill="#2B3A55" />
    </g>
  );
  return (
    <g className={className} style={style}>
      <g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
        <ellipse cx="0" cy={s(0.03)} rx={s(0.29)} ry={s(0.062)} fill="#14324F" opacity="0.16" />
        {leg(-0.16, null)}{leg(0.04, '.26s')}
        <path d={`M${s(-0.22)} ${s(-0.29)} L${s(-0.19)} ${s(-0.62)} Q0 ${s(-0.70)} ${s(0.19)} ${s(-0.62)} L${s(0.22)} ${s(-0.29)} Z`} fill={shirt} />
        <path d={`M${s(-0.22)} ${s(-0.29)} L${s(-0.19)} ${s(-0.62)} Q${s(-0.10)} ${s(-0.665)} ${s(-0.02)} ${s(-0.675)} L${s(-0.02)} ${s(-0.29)} Z`} fill="#FFFFFF" opacity="0.16" />
        <path d={`M${s(-0.19)} ${s(-0.58)} Q${s(-0.31)} ${s(-0.46)} ${s(-0.27)} ${s(-0.31)}`} fill="none" stroke={skin} strokeWidth={s(0.075)} strokeLinecap="round" />
        {wave ? (
          <g className="cx-tilt">
            <path d={`M${s(0.19)} ${s(-0.58)} Q${s(0.36)} ${s(-0.56)} ${s(0.40)} ${s(-0.74)}`} fill="none" stroke={skin} strokeWidth={s(0.075)} strokeLinecap="round" />
            <circle cx={s(0.41)} cy={s(-0.77)} r={s(0.055)} fill={skin} />
          </g>
        ) : (
          <path d={`M${s(0.19)} ${s(-0.58)} Q${s(0.33)} ${s(-0.48)} ${s(0.31)} ${s(-0.33)}`} fill="none" stroke={skin} strokeWidth={s(0.075)} strokeLinecap="round" />
        )}
        <rect x={s(-0.05)} y={s(-0.72)} width={s(0.10)} height={s(0.09)} rx={s(0.04)} fill={skin} />
        <circle cx="0" cy={s(-0.82)} r={s(0.137)} fill={skin} />
        <path d={`M${s(-0.137)} ${s(-0.845)} Q0 ${s(-1.005)} ${s(0.137)} ${s(-0.845)} Q${s(0.112)} ${s(-0.928)} 0 ${s(-0.945)} Q${s(-0.112)} ${s(-0.928)} ${s(-0.137)} ${s(-0.845)} Z`} fill={hair} />
        <circle cx={s(-0.05)} cy={s(-0.825)} r={s(0.019)} fill="#0E0E10" />
        <circle cx={s(0.05)} cy={s(-0.825)} r={s(0.019)} fill="#0E0E10" />
        <circle cx={s(-0.042)} cy={s(-0.833)} r={s(0.0075)} fill="#FFFFFF" />
        <circle cx={s(0.058)} cy={s(-0.833)} r={s(0.0075)} fill="#FFFFFF" />
        <path d={`M${s(-0.042)} ${s(-0.775)} Q0 ${s(-0.748)} ${s(0.042)} ${s(-0.775)}`} fill="none" stroke="#B4744A" strokeWidth={s(0.019)} strokeLinecap="round" />
        <ellipse cx={s(-0.097)} cy={s(-0.792)} rx={s(0.031)} ry={s(0.021)} fill="#FF9E9E" opacity="0.42" />
        <ellipse cx={s(0.097)} cy={s(-0.792)} rx={s(0.031)} ry={s(0.021)} fill="#FF9E9E" opacity="0.42" />
      </g>
    </g>
  );
}

// Расходящееся кольцо-подсветка вокруг точки.
function CxHalo({ cx, cy, r = 16, color = '#FF4F28', width = 2, className = 'cx-halo', style }) {
  return <circle className={className} style={style} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} />;
}
// CX_KIT_END


function Coddy({ facing = 'right', mood = 'happy', size = 64 }) {
  const view = CODDY_ART[facing] || 'right';
  // Контракт: медиа берём через useAssets(). Манифест урока имеет приоритет над ссылкой.
  const { resolveUrl } = useAssets();
  const url = resolveUrl('img_coddy_' + view) || CODDY_IMG[view] || CODDY_IMG.front;
  const [squash, setSquash] = useState(1);
  const prev = useRef(facing);
  useEffect(() => {
    if (prev.current !== facing) {
      prev.current = facing;
      if (MOTION.d) { setSquash(0.86); const t = setTimeout(() => setSquash(1), 150); return () => clearTimeout(t); }
    }
  }, [facing]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }} role="img" aria-label={uzT("Coddy смотрит ") + (DIRRU[facing] || '')}>
      <g style={{ transform: 'scale(' + squash + ')', transformOrigin: '50px 50px', transition: MOTION.d ? 'transform .15s ease' : 'none' }}>
        <image href={url} x="2" y="0" width="96" height="100" preserveAspectRatio="xMidYMid meet" />
      </g>
    </svg>
  );
}

// ============================================================
// Battery — арт батарейки пользователя (PNG -> WebP data-URI), встроен embed_battery_png.py.
// НЕ редактировать data-URI вручную. Рендерится HTML-оверлеем над клеткой карты.
// ============================================================
// BATTERY_ART_START
const BATTERY_IMG = "data:image/webp;base64,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";
// BATTERY_ART_END

function Battery({ size = 30, float = true }) {
  return (
    <div className={float ? 'cl-bat-float' : ''} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={BATTERY_IMG} alt={uzT("батарейка")} width={size} height={size} draggable={false} style={{ display: 'block', width: size, height: size, objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 2px 5px rgba(40,120,40,0.4))' }} />
    </div>
  );
}

// ============================================================
// Coin — золотая батарейка (SVG, без ассета). Цель уроков 2.1 — собрать батарейки по пути.
// ============================================================
function Coin({ size = 30, float = true }) {
  const gid = React.useMemo(() => 'coin-g-' + uid(), []);
  return (
    <div className={float ? 'cl-bat-float' : ''} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(180,130,20,0.45))' }} role="img" aria-label={uzT("батарейка")}>
        <defs>
          <radialGradient id={gid} cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#FFF1B8" /><stop offset="52%" stopColor="#FFD23F" /><stop offset="100%" stopColor="#E9A21B" />
          </radialGradient>
        </defs>
        <ellipse cx="12" cy="20.4" rx="6.4" ry="1.5" fill="rgba(14,14,16,0.14)" />
        <circle cx="12" cy="11.6" r="8.2" fill={`url(#${gid})`} stroke="#C9870F" strokeWidth="1.1" />
        <circle cx="12" cy="11.6" r="5.6" fill="none" stroke="#F6C638" strokeWidth="1.2" opacity="0.8" />
        <path d="M12 7.4v8.4M9.6 9.2h3.2a1.7 1.7 0 0 1 0 3.4H10m0 0h3.2" fill="none" stroke="#9A6708" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="9.4" cy="8.4" rx="1.7" ry="1.1" fill="#FFFFFF" opacity="0.55" transform="rotate(-28 9.4 8.4)" />
      </svg>
    </div>
  );
}

// ============================================================
// FinishFlag — клетчатый гоночный флаг в клетке
// ============================================================
function FinishFlag({ size = 26 }) {
  const fx = 9.5, fy = 3.2, fw = 11.2, fh = 8.4;
  const cols = 4, rows = 3;
  const cw = fw / cols, ch = fh / rows;
  const sq = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((c + r) % 2 === 0) {
        sq.push(<rect key={c + '_' + r} x={(fx + c * cw).toFixed(2)} y={(fy + r * ch).toFixed(2)} width={(cw + 0.15).toFixed(2)} height={(ch + 0.15).toFixed(2)} fill="#1A1A1E" />);
      }
    }
  }
  const cid = React.useMemo(() => 'ff-clip-' + uid(), []);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx="8.4" cy="21" rx="4.6" ry="1.5" fill="rgba(14,14,16,0.16)" />
      <rect x="7.2" y="2.4" width="1.7" height="18.4" rx="0.85" fill={T.ink3} />
      <rect x="7.2" y="2.4" width="0.7" height="18.4" rx="0.35" fill="#FFFFFF" opacity="0.45" />
      <circle cx="8.05" cy="2.4" r="1.25" fill={T.ink2} />
      <g>
        <rect x={(fx - 0.4).toFixed(2)} y={(fy - 0.4).toFixed(2)} width={(fw + 0.8).toFixed(2)} height={(fh + 0.8).toFixed(2)} rx="1.3" fill="#FFFFFF" stroke="rgba(14,14,16,0.10)" strokeWidth="0.5" />
        <clipPath id={cid}><rect x={(fx - 0.4).toFixed(2)} y={(fy - 0.4).toFixed(2)} width={(fw + 0.8).toFixed(2)} height={(fh + 0.8).toFixed(2)} rx="1.3" /></clipPath>
        <g clipPath={`url(#${cid})`}>{sq}</g>
      </g>
    </svg>
  );
}

// ============================================================
// MiniGrid — карта как на платформе (2 оттенка синего, флажок в клетке)
// ============================================================
// ============================================================
// Вирус ⚠️ — «живая» опасная клетка с хищными глазами (тёмный ядовитый блок). НЕ стена: наступить можно,
// но без щита это −1 жизнь. Пульсирует (cl-virus). Отличать от стены (синяя) и батарейки (жёлтая).
// ============================================================
function Virus({ size = 30, still = false }) {
  const g = React.useMemo(() => 'vir-' + uid(), []);
  const gs = React.useMemo(() => 'virs-' + uid(), []);
  const C = 24;
  const spike = (deg) => {
    const a = deg * Math.PI / 180, p = a + Math.PI / 2, w = 4.4;
    const t = [C + Math.cos(a) * 21.5, C + Math.sin(a) * 21.5];
    const b1 = [C + Math.cos(a) * 12 + Math.cos(p) * w, C + Math.sin(a) * 12 + Math.sin(p) * w];
    const b2 = [C + Math.cos(a) * 12 - Math.cos(p) * w, C + Math.sin(a) * 12 - Math.sin(p) * w];
    return `M${t[0].toFixed(1)} ${t[1].toFixed(1)} L${b1[0].toFixed(1)} ${b1[1].toFixed(1)} L${b2[0].toFixed(1)} ${b2[1].toFixed(1)} Z`;
  };
  return (
    <div className={still ? '' : 'cl-virus'} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={uzT("вирус — опасно")} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 3px 5px rgba(120,25,10,0.42))' }}>
        <defs>
          <linearGradient id={g} x1="0.2" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FF9A48" /><stop offset="48%" stopColor="#F4571C" /><stop offset="100%" stopColor="#CE2C06" />
          </linearGradient>
          <linearGradient id={gs} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FF7F0" /><stop offset="100%" stopColor="#1FB6C2" />
          </linearGradient>
        </defs>
        {/* бирюзовые шипы за телом */}
        {[-90, -45, 0, 45, 90, 135, 180, 225].map((d, i) => (<path key={i} d={spike(d)} fill={`url(#${gs})`} stroke="#178E9A" strokeWidth="0.7" strokeLinejoin="round" />))}
        {/* красно-оранжевый куб */}
        <rect x="10.5" y="12" width="27" height="27" rx="6.5" fill={`url(#${g})`} stroke="#AF250A" strokeWidth="1.3" />
        <rect x="13.5" y="14.6" width="21" height="4" rx="2" fill="#FFFFFF" opacity="0.26" />
        <path d="M13.8 34.6 Q24 37.2 34.2 34.6" fill="none" stroke="#9E2206" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        {/* хищные бирюзовые глаза */}
        <path d="M14 21.3 L22.4 24.3 L21.2 27.7 L13 24.7 Z" fill="#63EFE8" stroke="#178E9A" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M34 21.3 L25.6 24.3 L26.8 27.7 L35 24.7 Z" fill="#63EFE8" stroke="#178E9A" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M15.6 22.8 L20.4 24.6" stroke="#DDFFFB" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        <path d="M32.4 22.8 L27.6 24.6" stroke="#DDFFFB" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        {/* нос-клин */}
        <path d="M24 29 L26.6 33.4 L21.4 33.4 Z" fill="#B4240A" />
      </svg>
    </div>
  );
}

// ============================================================
// Щит 🛡️ — голубая светящаяся клетка. Встань на неё → take shield. Пропадает, когда щит взят.
// ============================================================
function ShieldTile({ size = 30 }) {
  const g = React.useMemo(() => 'shd-' + uid(), []);
  return (
    <div className="cl-shield-tile" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 40 44" role="img" aria-label={uzT("щит — возьми take shield")} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 0 4px rgba(70,195,235,0.75)) drop-shadow(0 3px 4px rgba(20,120,180,0.35))' }}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#AEEBFB" /><stop offset="52%" stopColor="#5FB9EE" /><stop offset="100%" stopColor="#2F86CC" />
          </linearGradient>
        </defs>
        {/* светящаяся кайма */}
        <path d="M20 2.4 L35 7.6 V22 C35 31.6 28.4 38.7 20 42.2 C11.6 38.7 5 31.6 5 22 V7.6 Z" fill="none" stroke="#8FE6FB" strokeWidth="2.6" opacity="0.85" />
        {/* тело щита */}
        <path d="M20 4.2 L33 8.9 V22 C33 30.5 27.3 36.8 20 39.9 C12.7 36.8 7 30.5 7 22 V8.9 Z" fill={`url(#${g})`} stroke="#2E86C6" strokeWidth="1.6" strokeLinejoin="round" />
        {/* светлая внутренняя панель */}
        <path d="M20 8 L29 11.3 V22 C29 28.3 24.8 33 20 35.4 C15.2 33 11 28.3 11 22 V11.3 Z" fill="#ECFBFF" opacity="0.42" />
        {/* верхний камешек */}
        <circle cx="20" cy="6.2" r="2" fill="#EFFCFF" stroke="#2E86C6" strokeWidth="1" />
        {/* буква J (бренд платформы) */}
        <text x="20" y="28.6" fontSize="18" fontWeight="900" fill="#1E6BA8" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif">J</text>
      </svg>
    </div>
  );
}

// ============================================================
// Сердечки жизней ❤️ — TRIES над картой. Погашенные (потерянные) — серые/лопнувшие.
// ============================================================
function Hearts({ n = 3, alive = 3, size = 18, lostIdx = -1 }) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const on = i < alive;
    const breaking = i === lostIdx;
    items.push(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={breaking ? 'cl-heart-break' : ''} style={{ display: 'block' }} aria-hidden="true">
        <path d="M12 21s-7-4.6-9.3-9C1 8.5 3 5 6.6 5 8.7 5 10.5 6.2 12 8c1.5-1.8 3.3-3 5.4-3C21 5 23 8.5 21.3 12 19 16.4 12 21 12 21z"
          fill={on ? '#FF5A6E' : '#E2DDD6'} stroke={on ? '#E23A55' : '#C9C2B8'} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return <div style={{ display: 'flex', alignItems: 'center', gap: 3 }} role="img" aria-label={`Жизни: ${alive} из ${n}`}>{items}</div>;
}

// ============================================================
// MiniGrid — карта как на платформе (синие плитки, флажок), + вирусы/щиты/аура щита Coddy (урок 3.1)
// ============================================================
// ⬅➡ ГЛАЗА ПУТИ (главная видимая новинка урока 3.4). У Coddy на карте всегда светятся два боковых
// индикатора — ровно то, что видят сенсоры path to left? / path to right?. Зелёная стрелка = путь открыт,
// серая с «стенкой» = там стена. Стороны крутятся ВМЕСТЕ с Coddy (как turn left / turn right).
// hot — сторону спрашивает программа прямо сейчас: обводим оранжевым и мигаем.
// ⚠️ Анимация висит на ВНУТРЕННЕМ div: на внешнем уже есть inline-transform (позиция), а
// cx-анимация transform его бы затёрла и значок улетел бы в центр клетки.
function PathEye({ side, dir, open, hot, cell }) {
  const d = side === 'left' ? LEFT[dir] : RIGHT[dir];
  const [dc, dr] = DIRS[d];
  const s = Math.max(13, Math.round(cell * 0.44));
  const off = cell * 0.6;
  // серый «стена» специально тёмный: значок непонятного цвета читается хуже 3:1 на светлой плитке
  const col = open ? '#15925A' : '#6B7684';
  const rot = { right: 0, down: 90, left: 180, up: 270 }[d];
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', left: 0, top: 0, width: cell, height: cell,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `translate(${(dc * off).toFixed(1)}px, ${(dr * off).toFixed(1)}px)`,
      zIndex: 7, pointerEvents: 'none',
    }}>
      <div className={hot ? 'cx-beat' : undefined} style={{
        width: s, height: s, borderRadius: '50%', boxSizing: 'border-box',
        background: open ? 'rgba(255,255,255,0.97)' : 'rgba(228,233,238,0.95)',
        border: `2px solid ${col}`,
        boxShadow: hot ? '0 0 0 3px rgba(255,167,90,0.85), 0 2px 5px rgba(14,14,16,0.2)' : '0 1px 3px rgba(14,14,16,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow .12s',
      }}>
        <svg width={Math.round(s * 0.66)} height={Math.round(s * 0.66)} viewBox="0 0 24 24" style={{ display: 'block', transform: `rotate(${rot}deg)` }}>
          {open
            ? <path d="M4.5 12h13M12 5.8l6.2 6.2L12 18.2" fill="none" stroke={col} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            : (<><path d="M4 12h8" fill="none" stroke={col} strokeWidth="3" strokeLinecap="round" /><path d="M16.5 4.5v15" fill="none" stroke={col} strokeWidth="3.6" strokeLinecap="round" /></>)}
        </svg>
      </div>
    </div>
  );
}

function MiniGrid({ level, robot, bump, cell = CELL, markers, picked, charge, trail, hasShield, taken, dead, hit, paths, probe }) {
  const { cols, rows, F, walls, hidden } = level;
  const reduce = !MOTION.d;
  const gap = 3;
  const ts = cell - gap;
  const rad = Math.max(8, Math.round(cell * 0.26));
  const flagSize = Math.round(cell * 0.62);
  const batSize = Math.round(cell * 0.62);
  const virSize = Math.round(cell * 0.74);
  const shdSize = Math.round(cell * 0.7);
  // свободна ли клетка (для «глаз пути») — ровно та же проверка, что у сенсора в движке
  const openCell = (c, r) => !(c < 0 || r < 0 || c >= cols || r >= rows || walls.has(key(c, r)));
  const sideOpen = (side) => { const [dc, dr] = DIRS[side === 'left' ? LEFT[robot.dir] : RIGHT[robot.dir]]; return openCell(robot.c + dc, robot.r + dr); };

  // батарейки на карте (собранные скрываем)
  const batteryEls = (level.batteries ? [...level.batteries] : []).filter((bk) => !(picked && picked.has(bk))).map((bk) => {
    const [c, r] = bk.split(',').map(Number);
    return (<div key={'bat' + bk} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}><Battery size={batSize} /></div>);
  });
  // батарейки на карте (собранные скрываем)
  const coinEls = (level.coins ? [...level.coins] : []).filter((ck) => !(picked && picked.has(ck))).map((ck) => {
    const [c, r] = ck.split(',').map(Number);
    return (<div key={'coin' + ck} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}><Coin size={batSize} /></div>);
  });
  // щиты на карте (взятые скрываем)
  const shieldEls = (level.shields ? [...level.shields] : []).filter((sk) => !(taken && taken.has(sk))).map((sk) => {
    const [c, r] = sk.split(',').map(Number);
    return (<div key={'shd' + sk} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}><ShieldTile size={shdSize} /></div>);
  });
  // вирусы на карте (уничтоженные щитом скрываем)
  const virusEls = (level.viruses ? [...level.viruses] : []).filter((vk) => !(dead && dead.has(vk))).map((vk) => {
    const [c, r] = vk.split(',').map(Number);
    return (<div key={'vir' + vk} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}><Virus size={virSize} /></div>);
  });

  // СЛЕД-РИСУНОК: «чернильная» линия по центрам пройденных клеток — в лабиринте это пройденный маршрут.
  const trailPts = (trail && trail.length > 1) ? trail.map(([c, r]) => `${((c + 0.5) * cell).toFixed(1)},${((r + 0.5) * cell).toFixed(1)}`).join(' ') : null;
  const trailEl = trailPts ? (
    <svg width={cols * cell} height={rows * cell} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 2, overflow: 'visible' }}>
      <polyline points={trailPts} fill="none" stroke={TRAIL.line} strokeOpacity="0.9" strokeWidth={Math.max(5, Math.round(cell * 0.16))} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 1px 2px ${TRAIL.glow})` }} />
    </svg>
  ) : null;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (hidden && hidden.has(key(c, r))) continue;
      const isWall = walls.has(key(c, r));
      const isFin = F && F[0] === c && F[1] === r;
      const wallStyle = {
        background: 'linear-gradient(180deg, #6AA1E4 0%, #4E88D6 55%, #4279C8 100%)',
        boxShadow: 'inset 0 2.5px 0 rgba(255,255,255,0.5), inset 0 -5px 9px rgba(16,44,80,0.34), 0 2px 3px rgba(16,44,80,0.22)',
      };
      const lightStyle = {
        background: 'radial-gradient(circle at 50% 45%, #F4FAFF 0%, #E2F3FD 55%, #D2EBFB 100%)',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.7), inset 0 0 0 4px rgba(150,205,240,0.22), inset 0 0 0 8px rgba(255,255,255,0.34), inset 0 0 0 10px rgba(150,205,240,0.14)',
      };
      cells.push(
        <div key={c + '_' + r} style={{
          position: 'absolute', left: c * cell + gap / 2, top: r * cell + gap / 2,
          width: ts, height: ts, boxSizing: 'border-box', borderRadius: rad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...(isWall ? wallStyle : lightStyle),
        }}>
          {isFin && !isWall && <FinishFlag size={flagSize} />}
        </div>
      );
    }
  }
  const auraSize = Math.round(cell * 0.94);
  return (
    <div style={{ position: 'relative', width: cols * cell, height: rows * cell, margin: '0 auto', flexShrink: 0 }}>
      {cells}
      {trailEl}
      {shieldEls}
      {virusEls}
      {batteryEls}
      {coinEls}
      {markers}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: cell, height: cell,
        transform: `translate(${robot.c * cell}px, ${robot.r * cell}px) ${bump || hit ? 'scale(0.9)' : 'scale(1)'}`,
        transition: reduce ? 'none' : `transform ${(0.32 * MOTION.d).toFixed(2)}s ease`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none',
      }}>
        {hasShield && <div className="cl-shield-aura" aria-hidden="true" style={{ position: 'absolute', width: auraSize, height: auraSize, borderRadius: '50%', border: `2.5px solid #35C6EA`, background: 'radial-gradient(circle, rgba(90,209,236,0.28) 0%, rgba(90,209,236,0.05) 70%, transparent 100%)', boxShadow: '0 0 12px rgba(53,198,234,0.6)' }} />}
        {hit && <div aria-hidden="true" style={{ position: 'absolute', width: auraSize, height: auraSize, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,60,60,0.5) 0%, rgba(255,60,60,0.12) 60%, transparent 100%)' }} />}
        {paths && <PathEye side="left" dir={robot.dir} open={sideOpen('left')} hot={probe === 'left'} cell={cell} />}
        {paths && <PathEye side="right" dir={robot.dir} open={sideOpen('right')} hot={probe === 'right'} cell={cell} />}
        {/* Бейдж заряда живёт РОВНО ТАМ, где верхний «глаз пути» (обе метки — над клеткой Coddy),
            и перекрывал его на 90%. Когда глаза включены, счётчик показываем в шапке карты. */}
        {charge && !paths && <ChargeBadge got={charge.got} req={charge.req} low={charge.low} coin={charge.coin} cell={cell} />}
        <Coddy facing={robot.dir} mood={bump || hit ? 'sad' : 'happy'} size={cell - 8} />
      </div>
    </div>
  );
}

// Индикатор заряда над Coddy: «🔋 N / M». Зелёный при полной зарядке, янтарный пока не хватает,
// красный «низкий заряд» (low) — для Hook. Двигается вместе с Coddy (живёт в его клетке).
function ChargeBadge({ got = 0, req = 0, low = false, cell = CELL, coin = false }) {
  const full = req > 0 && got >= req;
  const col = low ? T.red : full ? T.green : (coin ? T_COIN.dk : T.hint);
  const bg = low ? T.redSoft : full ? T.greenSoft : (coin ? '#FCEFCB' : T.hintSoft);
  const fs = Math.max(9, Math.round(cell * 0.24));
  return (
    <div className={low ? 'cl-bat-low' : full ? 'cl-bat-pop' : ''} style={{ position: 'absolute', top: -Math.round(cell * 0.34), left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 99, background: bg, border: `1.5px solid ${col}`, color: col, fontWeight: 800, fontSize: fs, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(14,14,16,0.18)', zIndex: 8 }}>
      {coin
        ? <svg width={fs + 2} height={fs + 2} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={col} strokeWidth="2.2" /><path d="M12 8v8M10.2 10h3a1.4 1.4 0 0 1 0 2.8h-2.6" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width={fs + 1} height={fs + 1} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="14" height="9" rx="2" /><path d="M20 11v3" />{!low && <path d="M9 9.5l-1.5 3h3l-1.5 3" stroke={col} strokeWidth="1.8" />}</svg>}
      {low ? '!' : `${got}/${req}`}
    </div>
  );
}

const BLOCK_DEF = { move: { label: 'move 1 step' }, left: { label: 'turn left' }, right: { label: 'turn right' }, battery: { label: 'pick battery' }, coin: { label: 'pick battery' }, repeat: { label: 'repeat' }, while: { label: 'while / until' }, until: { label: 'until' }, at_finish: { label: 'at finish?' }, has_battery: { label: 'has battery?' }, not: { label: 'not' }, shield: { label: 'take shield' }, if: { label: 'if' }, danger_front: { label: 'danger at front?' }, shield_front: { label: 'shield at front?' }, elif: { label: 'else if' }, else: { label: 'else' }, path_left: { label: 'path to left?' }, path_right: { label: 'path to right?' } };
// Цвета блоков = цвета НАСТОЯЩЕЙ платформы (Blockly): motion #4C97FF, pick #FF6680,
// цикл #5BA55B, логика (if/not) #5B80A5, сенсоры-вопросы #5CB1D6, щит #3B82F6.
const T_COIN = { bg: '#F0A92B', dk: '#CE8A12' };
const T_REPEAT = { bg: '#5BA55B', dk: '#498449' };   // repeat N times — зелёный цикл (Blockly LOOPS)
const T_WHILE = { bg: '#5BA55B', dk: '#498449' };    // repeat while/until — тот же зелёный цикл, что и Repeat   // While/Until — цикл по УСЛОВИЮ (indigo)
const T_SENSOR = { bg: '#5CB1D6', dk: '#4A8EAB' };   // at finish? — сенсор-вопрос (голубой Sensing)  // at_finish — сенсор-«глаз» (teal)
const T_NOT = { bg: '#5B80A5', dk: '#496684' };      // not — логика (Blockly LOGIC), как if
const T_HASBAT = { bg: '#5CB1D6', dk: '#4A8EAB' };   // has battery? — сенсор-вопрос (голубой Sensing)
const T_SHIELD = { bg: '#3B82F6', dk: '#2F68C5' };   // take shield — синий блок-действие // take shield — голубой блок-щит (урок 3.1) // has_battery — сенсор «батарейка подо мной?» (emerald)     // NOT — «наоборот» (deep-orange)
const T_IF = { bg: '#5B80A5', dk: '#496684' };       // if — блок РЕШЕНИЯ (Blockly LOGIC)          // If — блок РЕШЕНИЯ (magenta): вопрос + действие
const T_DANGER = { bg: '#FF6680', dk: '#CC5266' };   // danger at front? — сенсор опасности (розовый, как на платформе)      // danger at front? — сенсор опасности (красный, как вирус)
const T_SHIELDFRONT = { bg: '#3B82F6', dk: '#2F68C5' }; // shield at front? — синий, как take shield // shield at front? — сенсор щита (глубокий голубой, как щит)
const T_ELSE = { bg: '#5B80A5', dk: '#496684' };     // else / else if — ветки того же блока If        // else / else if — ветки того же блока If (розовее, но родня)
const T_PATH = { bg: '#5CB1D6', dk: '#4A8EAB' };     // path to left? / path to right? — сенсоры-вопросы         // path to left? / path to right? — сенсоры пути (бронза компаса)
const BLOCK_COLOR = { move: { bg: T.motion, dk: T.motionDk }, left: { bg: T.motion, dk: T.motionDk }, right: { bg: T.motion, dk: T.motionDk }, battery: { bg: T.action, dk: T.actionDk }, coin: { bg: T.action, dk: T.actionDk }, repeat: T_REPEAT, while: T_WHILE, until: T_WHILE, at_finish: T_SENSOR, has_battery: T_HASBAT, not: T_NOT, shield: T_SHIELD, if: T_IF, danger_front: T_DANGER, shield_front: T_SHIELDFRONT, elif: T_ELSE, else: T_ELSE, path_left: T_PATH, path_right: T_PATH };
const bcol = (k) => BLOCK_COLOR[k] || BLOCK_COLOR.move;
// Сенсор-ВОПРОС на платформе — ШЕСТИУГОЛЬНИК (Blockly boolean), а не прямоугольник:
// по форме видно, что он ВСТАВЛЯЕТСЯ в окошко условия, а не кладётся в программу.
// clip-path меняет только отрисовку: размеры элемента прежние, drag и зоны сброса не едут.
const SENSOR_KINDS = { at_finish: 1, has_battery: 1, danger_front: 1, shield_front: 1, path_left: 1, path_right: 1, not: 1 };
const HEX_CLIP = 'polygon(0% 50%, 9px 0%, calc(100% - 9px) 0%, 100% 50%, calc(100% - 9px) 100%, 9px 100%)';
const hexStyle = (k, pad = 15) => (SENSOR_KINDS[k] ? { clipPath: HEX_CLIP, borderRadius: 0, boxShadow: 'none', paddingLeft: pad, paddingRight: pad } : null);
// Разъём под сенсор — тёмный шестиугольник внутри блока if / repeat while.
const HEX_ONLY = { clipPath: HEX_CLIP, borderRadius: 0, boxShadow: 'none', paddingLeft: 12, paddingRight: 12 };
const hexSocket = (hot) => ({ clipPath: HEX_CLIP, borderRadius: 0, boxShadow: 'none', paddingLeft: 12, paddingRight: 12, background: hot ? 'rgba(255,255,255,0.55)' : 'rgba(14,14,16,0.30)' });

// человекочитаемое имя блока (move без «1 step» — у него теперь окошко-число)
const blockName = (k) => (k === 'move' ? 'move' : BLOCK_DEF[k].label);

function BlockIcon({ k }) {
  const s = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (k === 'start') return (<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M7 5.4 L18.6 12 L7 18.6 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" /></svg>);
  if (k === 'move') return (<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 19.5 L12 5.6" {...s} /><path d="M6.4 11 L12 5.2 L17.6 11" {...s} /></svg>);
  if (k === 'battery') return (<svg width="17" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><rect x="3" y="7.4" width="14" height="9.2" rx="2.2" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M20 10.6 v2.8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /><path d="M10.6 8.8 L8.4 12.4 H11 L8.8 15.6" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (k === 'coin') return (<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><circle cx="12" cy="12" r="8" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M12 7.6v8.8M10 9.6h3a1.6 1.6 0 0 1 0 3.2h-2.6m0 0H13" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (k === 'repeat') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M5.5 9A7 7 0 0 1 18 7.5" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M18.5 15A7 7 0 0 1 6 16.5" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M18 4l1 3.5-3.5.4Z" fill="#FFFFFF" /><path d="M6 20l-1-3.5 3.5-.4Z" fill="#FFFFFF" /></svg>);
  if (k === 'while') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M5 10a7 7 0 0 1 12-3.4" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M17.4 3.6l.4 3.6-3.6.2Z" fill="#FFFFFF" /><path d="M19 14a7 7 0 0 1-12 3.4" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M6.6 20.4l-.4-3.6 3.6-.2Z" fill="#FFFFFF" /></svg>);
  if (k === 'at_finish') return (<svg width="17" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6S2.5 12 2.5 12Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.7" fill="#FFFFFF" /></svg>);
  if (k === 'not') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M4 8.5h12.5M12.5 4.5l4 4-4 4" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 15.5H7.5m4 4l-4-4 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (k === 'has_battery') return (<svg width="18" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><rect x="2.5" y="7.6" width="13" height="9" rx="2.2" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M18.4 10.4v3.4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /><text x="9" y="15" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'shield') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 3 L5 5.6 V11 C5 16 8.2 19.6 12 21 Z" fill="#7FB4F2" /><path d="M12 3 L19 5.6 V11 C19 16 15.8 19.6 12 21 Z" fill="#FF9E4D" /><path d="M12 3 L19 5.6 V11 C19 16 15.8 19.6 12 21 C8.2 19.6 5 16 5 11 V5.6 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><path d="M12 3.4 V20.5" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.55" /></svg>);
  if (k === 'if') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 2.4 L21.6 12 L12 21.6 L2.4 12 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><text x="12" y="16" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'danger_front') return (<svg width="18" height="15" viewBox="0 0 26 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M8.4 4.2 L15.6 17.4 H1.2 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><path d="M8.4 9v3.1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /><circle cx="8.4" cy="14.6" r="1.05" fill="#FFFFFF" /><text x="21" y="17" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'shield_front') return (<svg width="18" height="15" viewBox="0 0 26 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M8.6 3 L14.8 5.5 V11 C14.8 15 12 17.9 8.6 19.1 C5.2 17.9 2.4 15 2.4 11 V5.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><text x="21" y="17" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'elif') return (<svg width="17" height="16" viewBox="0 0 26 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M3.2 2.8 V7.2 a2.4 2.4 0 0 0 2.4 2.4 H8.2" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.6 3.6 L23.2 12 L15.6 20.4 L8 12 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" /><text x="15.6" y="15.8" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'else') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 3.2 V9.4" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M12 9.4 C12 14.8 6.6 14.4 6.6 19.2" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeDasharray="2.8 2.4" /><path d="M12 9.4 C12 14.8 17.4 14.4 17.4 19" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" /><path d="M14.9 16.6 L17.4 20 L19.9 16.6" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (k === 'path_left') return (<svg width="18" height="15" viewBox="0 0 26 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M15 12 H4.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M9.4 6.4 L3.4 12 L9.4 17.6" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><text x="21" y="16.6" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'path_right') return (<svg width="18" height="15" viewBox="0 0 26 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M11 12 H21.8" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M16.6 6.4 L22.6 12 L16.6 17.6" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /><text x="5" y="16.6" fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">?</text></svg>);
  if (k === 'left') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M6.3 7.8 A6 6 0 1 1 5.2 14.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M3 6 L7.4 6.6 L5.6 10.6 Z" fill="#FFFFFF" /></svg>);
  return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M17.7 7.8 A6 6 0 1 0 18.8 14.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M21 6 L16.6 6.6 L18.4 10.6 Z" fill="#FFFFFF" /></svg>);
}

function ProgramBlock({ k, onPointerDown, onDelete, indicatorTop, active }) {
  return (
    <div style={{ position: 'relative' }} data-block-row>
      {indicatorTop && <div aria-hidden="true" style={{ position: 'absolute', top: -5, left: 2, right: 2, height: 4, borderRadius: 4, background: T.accent, boxShadow: '0 0 0 2px ' + T.accentSoft, zIndex: 5 }} />}
      <div onPointerDown={onPointerDown} className={active ? 'codeBlk codeBlk--active' : 'codeBlk'} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, background: bcol(k).bg, color: '#FFFFFF',
        padding: '6px 10px', minHeight: 32, boxSizing: 'border-box', borderRadius: 10, boxShadow: 'inset 0 0 0 1.5px ' + bcol(k).dk,
        fontFamily: 'Manrope, system-ui, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 0.1,
        cursor: onPointerDown ? 'grab' : 'default', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', ...hexStyle(k),
      }}>
        <BlockIcon k={k} />
        <span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[k].label}</span>
        {onDelete && <button type="button" aria-label={uzT("Удалить блок")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDelete(e); }} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.22)', color: '#FFFFFF', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>}
      </div>
    </div>
  );
}


// ===== Панель «Верный ответ» (см. answer-blocks.js) =====
// Цвет блока берём из bcol(), если он есть в уроке (1.4+), иначе из темы.
// typeof на необъявленном идентификаторе безопасен — исключения не будет.
function ansCol(k) {
  try { if (typeof bcol === 'function') return bcol(k); } catch (e) {}
  return { bg: T.motion, dk: T.motionDk };
}
function ansLabel(k) { return (BLOCK_DEF && BLOCK_DEF[k] && BLOCK_DEF[k].label) || k; }
function ansSensor(s) {
  const m = {
    at_finish: 'at finish?', has_battery: 'has battery?', has_coin: 'has battery?',
    danger_front: 'danger at front?', shield_front: 'shield at front?',
    path_left: 'path to left?', path_right: 'path to right?',
  };
  return m[s] || s;
}
// Заголовок блока-контейнера читается как в программе: «repeat 4», «до at finish?»
function ansHead(node) {
  // Заголовок читаем ровно как на блоке в программе — английские слова блока,
  // а не пересказ по-русски: иначе ребёнок не узнаёт свой же блок.
  if (node.k === 'repeat') return 'repeat ' + (node.n != null ? node.n : '') + ' times';
  if (node.k === 'while') {
    const mode = node.mode === 'until' ? 'until' : 'while';
    return mode + ' ' + (node.neg ? 'not ' : '') + ansSensor(node.sensor);
  }
  if (node.k === 'if') return 'if ' + ansSensor(node.sensor);
  return ansLabel(node.k);
}

function AnsChip({ text, k }) {
  const c = ansCol(k);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: '#FFFFFF',
      padding: '1px 7px', minHeight: 21, boxSizing: 'border-box', borderRadius: 7,
      boxShadow: 'inset 0 0 0 1.5px ' + c.dk, fontFamily: 'Manrope, system-ui, sans-serif',
      fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      {BLOCK_DEF && BLOCK_DEF[k] ? <BlockIcon k={k} /> : null}
      <span>{text}</span>
    </div>
  );
}

// Рекурсия: тело контейнера рисуется с отступом и цветной чертой слева —
// та же «лесенка», что ребёнок видит в «Программе Coddy».
function AnsNode({ node }) {
  if (!node) return null;
  const k = node.k;
  if (k === 'repeat' || k === 'while' || k === 'if') {
    const c = ansCol(k);
    const nest = (arr) => (
      <div style={{ marginLeft: 5, paddingLeft: 7, borderLeft: '2px solid ' + c.dk, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(arr || []).map((b, i) => <AnsNode key={i} node={b} />)}
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AnsChip k={k} text={ansHead(node)} />
        {nest(node.body)}
        {(node.elifs || []).map((e, i) => (
          <React.Fragment key={'e' + i}>
            <AnsChip k={k} text={'else if ' + ansSensor(e.sensor)} />
            {nest(e.body)}
          </React.Fragment>
        ))}
        {node.hasElse ? (<><AnsChip k={k} text="else" />{nest(node.elseBody)}</>) : null}
      </div>
    );
  }
  const num = node.n != null && node.n !== 1 ? ' ' + node.n : '';
  return <AnsChip k={k} text={ansLabel(k) + num} />;
}

function AnswerBlocks({ solution, maxH, columns }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignContent: 'flex-start', gap: 2, columnGap: 12,
      flexWrap: columns ? 'wrap' : 'nowrap', maxHeight: maxH,
      flex: columns ? undefined : '1 1 auto',
      overflowY: columns ? 'visible' : 'auto', overflowX: 'hidden', minHeight: 0,
    }}>
      {(solution || []).map((b, i) => <AnsNode key={i} node={b} />)}
    </div>
  );
}

// Панель в колонке — забирает всю свободную высоту (flex:1 + minHeight:0).
function AnswerPanel({ solution }) {
  if (!solution || !solution.length) return null;
  return (
    <div className="frame" style={{
      marginTop: 8, flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 5,
      background: '#FBFAF7', padding: 9, boxShadow: 'var(--sh-card)',
    }}>
      <div style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: '.4px', color: T.ink3, textTransform: 'uppercase' }}>{uzT("Верный ответ")}</div>
      <AnswerBlocks solution={solution} />
    </div>
  );
}

// Оверлей — для телефона везде и для вложенных программ на любом экране.
function AnswerOverlay({ solution, onClose }) {
  if (!solution || !solution.length) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,20,30,0.34)', padding: 10 }}>
      <div className="frame" style={{ maxWidth: '100%', maxHeight: 'calc(100dvh - 24px)', display: 'flex', flexDirection: 'column', gap: 8, background: '#FBFAF7', padding: 12, boxShadow: '0 14px 40px rgba(0,0,0,0.28)' }}>
        <div style={{ flexShrink: 0, fontSize: 11, fontWeight: 800, letterSpacing: '.4px', color: T.ink3, textTransform: 'uppercase' }}>{uzT("Верный ответ")}</div>
        <div style={{ minHeight: 0, overflowY: 'auto' }}><AnswerBlocks solution={solution} maxH={380} columns /></div>
        <button onClick={onClose} className="btn-white-accent" style={{ flexShrink: 0, alignSelf: 'center', padding: '9px 18px', fontSize: 13, minHeight: 40 }}>{uzT("Понятно")}</button>
      </div>
    </div>
  );
}

function PaletteBlock({ k, onPointerDown, coach, small }) {
  return (
    <div onPointerDown={onPointerDown} role="button" aria-label={k === 'move' ? uzT("move — поставь число шагов") : BLOCK_DEF[k].label} className={coach ? 'coach-pulse' : ''} style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 5 : 7, background: bcol(k).bg, color: '#FFFFFF',
      padding: small ? '3px 7px' : '6px 11px', minHeight: small ? 27 : 32, boxSizing: 'border-box', borderRadius: 10, boxShadow: 'inset 0 0 0 1.5px ' + bcol(k).dk,
      fontFamily: 'Manrope, system-ui, sans-serif', fontSize: small ? 11.5 : 13, fontWeight: 700, letterSpacing: 0.1,
      cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', ...hexStyle(k),
    }}>
      <BlockIcon k={k} />
      {k === 'move'
        ? (<><span>move</span><span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, padding: '0 3px', borderRadius: 6, background: 'rgba(255,255,255,0.96)', color: T.motionDk, fontSize: 12, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>1</span></>)
        : (<span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[k].label}</span>)}
    </div>
  );
}

function StartBlock({ small }) {
  return (
    <div aria-label="Start Game" style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 6 : 8, background: T.event, color: '#FFFFFF',
      padding: small ? '6px 11px' : '8px 13px', minHeight: small ? 32 : 38, boxSizing: 'border-box',
      borderRadius: 11, boxShadow: 'inset 0 0 0 1.5px ' + T.eventDk, fontFamily: 'Manrope, system-ui, sans-serif',
      fontSize: small ? 12 : 13, fontWeight: 700, letterSpacing: 0.1, userSelect: 'none', WebkitUserSelect: 'none', flexShrink: 0, alignSelf: 'flex-start',
    }}>
      <BlockIcon k="start" /><span style={{ whiteSpace: 'nowrap' }}>Start Game</span>
    </div>
  );
}

// Блок-кнопка для лабораторий (выглядит как блок, но кликается). Цвет — по типу блока.
function TurnControl({ k, onClick, disabled }) {
  const c = bcol(k);
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, background: c.bg, color: '#fff', border: 'none',
      padding: '11px 16px', borderRadius: 11, boxShadow: `inset 0 0 0 2px ${c.dk}`, fontFamily: 'Manrope, sans-serif',
      fontWeight: 700, fontSize: 14, cursor: disabled ? 'default' : 'pointer', minHeight: 46, opacity: disabled ? 0.5 : 1,
    }}><BlockIcon k={k} />{BLOCK_DEF[k].label}</button>
  );
}

// ============================================================
// ТЕЛЕФОН: карта не должна съедать «Программу Coddy».
// Карта в мобильной раскладке стоит первой и не сжимается, поэтому на больших
// уровнях списку программы оставалась одна строка. Меряем колонку и всё, что
// кроме самой сетки (чипы, палитра, кнопки), а остаток делим на строки карты —
// так в «Программе» всегда видно минимум три блока.
// Петли обратной связи нет: высоты палитры и кнопок от клетки карты не зависят.
// ============================================================
const FIT_MIN_LIST = 150; // ≈ Start Game + три блока + отступы рамки
const FIT_CHROME = 40;    // подпись «ПРОГРАММА CODDY» + два gap'а колонки + отступ кнопок
function useFitMap(active) {
  const colRef = useRef(null), chipsRef = useRef(null), palRef = useRef(null), ctlRef = useRef(null);
  const [budget, setBudget] = useState(null); // null — ещё не мерили; число — уже знаем, сколько осталось карте
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 380));
  useEffect(() => {
    const onW = () => setVw(window.innerWidth);
    onW();
    window.addEventListener('resize', onW);
    window.addEventListener('orientationchange', onW);
    return () => { window.removeEventListener('resize', onW); window.removeEventListener('orientationchange', onW); };
  }, []);
  useEffect(() => {
    if (!active) { setBudget(null); return; }
    const h = (r) => (r.current ? r.current.offsetHeight : 0);
    const calc = () => {
      const col = colRef.current; if (!col) return;
      const H = col.clientHeight; if (!H) return;
      const v = Math.max(0, H - h(chipsRef) - h(palRef) - h(ctlRef) - FIT_MIN_LIST - FIT_CHROME);
      setBudget((p) => (p != null && Math.abs(p - v) < 3 ? p : v)); // гистерезис: не дёргаем ререндер из-за пары пикселей
    };
    calc();                          // эффект идёт ПОСЛЕ коммита — размеры уже настоящие
    const t = setTimeout(calc, 150); // страховка: догрузился шрифт — высоты поехали
    window.addEventListener('resize', calc);
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(calc);
      [colRef, chipsRef, palRef, ctlRef].forEach((r) => { if (r.current) ro.observe(r.current); });
    }
    return () => { clearTimeout(t); window.removeEventListener('resize', calc); if (ro) ro.disconnect(); };
  }, [active]);
  return { colRef, chipsRef, palRef, ctlRef, budget, vw };
}
// budget === null — ещё не мерили (первый кадр) или десктоп: отдаём исходный размер.
// budget === 0 — места нет совсем: клетка падает до минимума, иначе карта
// выдавит «Программу Coddy» в одну строку (низкие экраны 375×667).
const fitCell = (budget, rows, cap) => (budget == null || !rows ? cap : Math.max(15, Math.min(cap, Math.floor((budget - 6) / rows))));
// Телефон: экран уровня теперь скроллится, поэтому карту НЕ ужимаем под высоту колонки.
// Размер клетки считается только по ширине экрана — карта занимает её целиком.
const mobMapCell = (vw, cols) => Math.max(18, Math.min(48, Math.floor(((vw || 380) - 26) / Math.max(1, cols || 1))));

// Компьютер: «Программа Coddy» берёт ровно столько, сколько нужно блокам (замер по всем
// урокам — максимум 360px), а вся оставшаяся ширина уходит КАРТЕ. Свой потолок клетки,
// а не общий cell: тот заодно управляет лабораториями и мобильными сценами.
const DESK_PROG_W = 460, DESK_PAL_W = 190;
const deskMapCell = (cols, rows) => {
  const vw = (typeof window !== 'undefined' && window.innerWidth) || 1240;
  const vh = (typeof window !== 'undefined' && window.innerHeight) || 800;
  const shell = Math.min(1240, vw - 26);
  const wBudget = Math.max(200, shell - 24 - DESK_PAL_W - DESK_PROG_W);
  const hBudget = Math.max(170, Math.round(vh * 0.52));
  return Math.max(18, Math.min(64, Math.floor(wBudget / Math.max(1, cols)), Math.floor(hBudget / Math.max(1, rows))));
};

const lbl = { fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: T.ink3, textTransform: 'uppercase', marginBottom: 6 };

function FeedbackNote({ kind, text }) {
  const cls = kind === 'ok' ? 'frame-success' : kind === 'hint' ? 'hint-yellow' : 'frame-soft';
  return <div role="status" aria-live="polite" className={cls} style={{ marginTop: 10, padding: '11px 14px', fontSize: 14.5, fontWeight: 600, lineHeight: 1.45 }}>{text}</div>;
}

// ============================================================
// SANDBOX (drag-only DnD + запуск, подсветка текущего блока) — единая логика applyStep
// ============================================================
// ============================================================
// SANDBOX 2.1 — дерево программы с блоком Repeat (C-образный цикл, глубина 1).
//   program: массив. Лист = {id,k} (k: move|left|right|coin).
//   Repeat  = {id, k:'repeat', n, body:[{id,k}...]} — внутри тела только листья.
//   DnD: палитра → ВЕРХ или ВНУТРЬ тела Repeat; перенос/удаление; число N редактируется −/+.
//   Интерпретатор разворачивает тело N раз; подсветка активного листа на КАЖДОЙ итерации.
//   Лимиты maxInstances = по ВСЕМ инстансам (лист внутри Repeat считается 1 раз, а не N раз).
// ============================================================
// ============================================================
// SANDBOX 2.4 — дерево программы с ВЛОЖЕННЫМИ циклами Repeat (Repeat внутри Repeat).
//   program: массив. Лист = {id,k} (k: move|left|right|coin). move всегда 1 шаг при data.lockMove1.
//   Repeat  = {id, k:'repeat', n, body:[...]} — в теле теперь могут лежать И листья, И другие Repeat.
//   Адресация узла = {parentId, index}: parentId==null → корень, иначе id Repeat-контейнера (на любой глубине).
//   DnD: палитра/перенос → корень ИЛИ тело ЛЮБОГО Repeat (ищем ближайший [data-bodyzone] под указателем).
//   Интерпретатор flattenProgram рекурсивно разворачивает тело N раз; подсветка активного листа (runHi=id)
//   и цепочки активных циклов (runReps[id]={iter,n}) на КАЖДОЙ итерации.
//   Лимиты maxInstances считаются по ВСЕМ инстансам рекурсивно (instanceCounts).
// ============================================================
// ============================================================
// SANDBOX 3.4 — «Сенсоры пути в действии» 🧭 — тот же движок 3.3 (шестерёнка If) + ДВА ГЛАЗА.
//   НОВОЕ: path_left ⬅ / path_right ➡ — «свободна ли соседняя клетка слева/справа ОТ Coddy».
//   Стороны берутся из LEFT/RIGHT — тех же таблиц, что у блоков turn left / turn right, поэтому
//   глаза крутятся вместе с Coddy. Свободна = в границах карты И не стена (вирус/щит не мешают).
//   Связка с ветками из 3.3 даёт УНИВЕРСАЛЬНЫЙ НАВИГАТОР — один код на любой лабиринт:
//     While до 👁 { If ⬅ {turn left; move} Else If ➡ {turn right; move} Else {move} }
//   probe — сторона, которую программа спрашивает прямо сейчас: соответствующий «глаз» на карте
//   вспыхивает оранжевым, и ребёнок видит ответ сенсора НА КАРТЕ, а не только в блоке.
// (ниже — исходный комментарий движка 3.3, вся механика веток осталась той же)
// БЛОК IF — «Шестерёнка»: блок НАСТРАИВАЕТСЯ и растёт под задачу.
//   Лист   = {id,k} (k: move|left|right|coin|battery|shield). move = N шагов (в 3.3 lockMove1 → 1 шаг).
//   Repeat = {id,k:'repeat', n, body:[...]}.  While = {id,k:'while',mode,neg,sensor,body} — цикл по УСЛОВИЮ.
//   If     = {id,k:'if', sensor, body, elifs:[{id,sensor,body}], hasElse, elseId, elseBody} — НОВОЕ:
//            у блока ОДНА шапка if, сколько угодно веток else if и ОДНА ветка else. Ветки проверяются
//            ПО ПОРЯДКУ сверху вниз; выполняется РОВНО ОДНА — первая, чей сенсор ответил «да».
//            Если ни одна не ответила — работает else (а если else нет — не делается ничего).
//   ШЕСТЕРЁНКА ⚙️ (GearBubble) — мини-мастерская настройки блока (аналог мутатора Blockly): в ней
//            перетаскиваешь детали «else if» и «else» в структуру блока, и блок ВЫРАСТАЕТ.
//   Сенсоры (тащатся в окошко-условие ЛЮБОЙ ветки и в While): danger_front ⚠️, shield_front 🛡️ (3.2),
//            has_battery 🔋 (2.6) — под ногами, at_finish 👁 (2.5) — на финише.
//   Мир 3.1 сохранён: вирусы/щиты/жизни. Интерпретатор run() ПОШАГОВЫЙ.
//   data.require — блоки/ветки, без которых задача уходит мимо темы ('else' и 'elif' — тоже требования).
//   Победа = дошёл до флажка И собрал reqBatteries батареек, не наступив на вирус без защиты.
// ============================================================
const isCont = (it) => it && (it.k === 'repeat' || it.k === 'while' || it.k === 'if');
const MAX_ELIF = 6; // веток «else if» столько же, сколько в настоящем Blockly (там без предела) — держим щедрый запас
// Как показывать сенсор: иконка + ответ «да/нет» во время прогона + подпись на чипе условия.
const SENSOR_UI = {   // ленивый: строки читаются в рендере
  get at_finish() { return { ico: '👁', yes: uzT("финиш!"), no: uzT("нет"), chip: 'at finish?' }; },
  get has_battery() { return { ico: '🔋', yes: uzT("есть!"), no: uzT("нет"), chip: 'has battery?' }; },
  get danger_front() { return { ico: '⚠️', yes: uzT("ВИРУС!"), no: uzT("чисто"), chip: 'danger at front?' }; },
  get shield_front() { return { ico: '🛡️', yes: uzT("ЩИТ!"), no: uzT("нет"), chip: 'shield at front?' }; },
  get path_left() { return { ico: '⬅', yes: uzT("открыт!"), no: uzT("стена"), chip: 'path to left?' }; },
  get path_right() { return { ico: '➡', yes: uzT("открыт!"), no: uzT("стена"), chip: 'path to right?' }; },

};
// Все «карманы» узла: [{ id — он же data-bodyzone, arr — массив блоков }].
// У If их несколько (тело if, тело каждой else if, тело else) — поэтому адресуем по id кармана.
function bodiesOf(it) {
  if (!isCont(it)) return [];
  if (it.k !== 'if') return [{ id: it.id, arr: it.body || [] }];
  const out = [{ id: it.id, arr: it.body || [] }];
  (it.elifs || []).forEach((e) => out.push({ id: e.id, arr: e.body || [] }));
  if (it.hasElse) out.push({ id: it.elseId, arr: it.elseBody || [] });
  return out;
}
// Все ветки If по порядку проверки: main → else if… (else считается отдельно, у него нет условия).
const branchesOf = (it) => [{ key: 'main', sensor: it.sensor, body: it.body || [] }].concat((it.elifs || []).map((e) => ({ key: e.id, sensor: e.sensor, body: e.body || [] })));
function instanceCounts(prog) {
  const c = {};
  const walk = (items) => items.forEach((it) => {
    if (it.k === 'repeat') { c.repeat = (c.repeat || 0) + 1; walk(it.body || []); }
    else if (it.k === 'if') {
      c.if = (c.if || 0) + 1; if (it.sensor) c[it.sensor] = (c[it.sensor] || 0) + 1; walk(it.body || []);
      (it.elifs || []).forEach((e) => { c.elif = (c.elif || 0) + 1; if (e.sensor) c[e.sensor] = (c[e.sensor] || 0) + 1; walk(e.body || []); });
      if (it.hasElse) { c.else = (c.else || 0) + 1; walk(it.elseBody || []); }
    }
    else if (it.k === 'while') { c.while = (c.while || 0) + 1; if (it.neg) c.not = (c.not || 0) + 1; if (it.sensor) c[it.sensor] = (c[it.sensor] || 0) + 1; walk(it.body || []); }
    else c[it.k] = (c[it.k] || 0) + 1;
  });
  walk(prog); return c;
}
const cloneNode = (it) => (
  it && it.k === 'if'
    ? { ...it, body: (it.body || []).map(cloneNode), elifs: (it.elifs || []).map((e) => ({ ...e, body: (e.body || []).map(cloneNode) })), elseBody: (it.elseBody || []).map(cloneNode) }
    : isCont(it) ? { ...it, body: it.body.map(cloneNode) } : { ...it }
);
const cloneProg = (p) => p.map(cloneNode);
function findContainer(tree, parentId) {
  if (parentId == null) return tree;
  let found = null;
  const walk = (items) => {
    for (const it of items) {
      if (!isCont(it)) continue;
      for (const b of bodiesOf(it)) { if (b.id === parentId) { found = b.arr; return; } }
      for (const b of bodiesOf(it)) { walk(b.arr); if (found) return; }
    }
  };
  walk(tree); return found;
}
function findNode(tree, id) {
  let found = null;
  const walk = (items) => { for (const it of items) { if (it.id === id) { found = it; return; } if (isCont(it)) { for (const b of bodiesOf(it)) { walk(b.arr); if (found) return; } } } };
  walk(tree); return found;
}
// Владелец окошка-условия: сам While / шапка If / любая ветка else if (у каждой своё окошко).
function findCondHost(tree, id) {
  let found = null;
  const walk = (items) => {
    for (const it of items) {
      if (found) return;
      if ((it.k === 'while' || it.k === 'if') && it.id === id) { found = it; return; }
      if (it.k === 'if') { const e = (it.elifs || []).find((x) => x.id === id); if (e) { found = e; return; } }
      if (isCont(it)) for (const b of bodiesOf(it)) { walk(b.arr); if (found) return; }
    }
  };
  walk(tree); return found;
}
// Все id-карманов внутри узла (включая его собственные) — чтобы контейнер нельзя было бросить сам в себя.
function zoneIdsOf(node) {
  const set = new Set();
  const walk = (it) => { if (!isCont(it)) return; for (const b of bodiesOf(it)) { set.add(b.id); b.arr.forEach(walk); } };
  walk(node); return set;
}
function findWhile(tree) {
  let found = null;
  const walk = (items) => { for (const it of items) { if (found) return; if (it.k === 'while') { found = it; return; } if (isCont(it)) for (const b of bodiesOf(it)) walk(b.arr); } };
  walk(tree); return found;
}
function evalKeep(node, reading) { const value = node.neg ? !reading : reading; return node.mode === 'while' ? value : !value; }
// Подсказки для «веди-до-верного», когда задача решается мимо темы урока.
const REQ_MSG = {   // ленивый: строки читаются в рендере
  get else() { return uzT("Нажми ШЕСТЕРЁНКУ ⚙️ на блоке If и перетащи в структуру деталь «else»! Тогда у Coddy появится ВТОРАЯ ветка — что делать, если ответ «нет». ⚙️"); },
  get elif() { return uzT("Открой ШЕСТЕРЁНКУ ⚙️ и добавь деталь «else if» — с ней у блока будет ТРИ ветки, и Coddy сможет выбирать из трёх вариантов! ⚙️"); },
  get path_left() { return uzT("Coddy должен САМ увидеть поворот налево! Возьми сенсор «path to left?» ⬅ и брось его в окошко-условие ветки. 🧭"); },
  get path_right() { return uzT("А как программа узнает про поворот направо? Возьми сенсор «path to right?» ➡ и брось его в окошко-условие ветки. 🧭"); },

};
// Проверка ПЕРЕД запуском: пустые тела и пустые условия → понятная подсказка вместо «зависания»,
// плюс require — блоки и ВЕТКИ, без которых уровень мимо темы урока.
function precheck(prog, need) {
  let msg = null;
  const walk = (items) => {
    for (const it of items) {
      if (msg) return;
      if (it.k === 'while') { if (!it.sensor) { msg = uzT("У блока While нет условия! Брось сенсор в его окошко."); return; } if ((it.body || []).length === 0) { msg = uzT("Внутри While пусто!"); return; } walk(it.body || []); }
      else if (it.k === 'if') {
        if (!it.sensor) { msg = uzT("У блока If пустое окошко-условие! Брось туда сенсор — ⬅, ➡ или 🔋. Без вопроса программа не знает, ЧТО проверять."); return; }
        if ((it.body || []).length === 0) { msg = uzT("Внутри If пусто! Положи туда действие — то, что Coddy сделает, ЕСЛИ ответ «да»."); return; }
        walk(it.body || []); if (msg) return;
        for (const e of (it.elifs || [])) {
          if (!e.sensor) { msg = uzT("У ветки «else if» пустое окошко-условие! Брось туда сенсор — у каждой ветки свой вопрос."); return; }
          if ((e.body || []).length === 0) { msg = uzT("Ветка «else if» пустая! Положи в неё действие — то, что Coddy сделает, если сработает ВТОРОЕ условие."); return; }
          walk(e.body || []); if (msg) return;
        }
        if (it.hasElse) {
          if ((it.elseBody || []).length === 0) { msg = uzT("Ветка «else» пустая! Положи в неё действие — то, что Coddy сделает, если ВСЕ условия ответили «нет»."); return; }
          walk(it.elseBody || []); if (msg) return;
        }
      }
      else if (it.k === 'repeat') { if ((it.body || []).length === 0) { msg = uzT("Внутри Repeat пусто! Перетащи блоки ВНУТРЬ цикла — между створками."); return; } walk(it.body || []); }
    }
  };
  walk(prog); if (msg) return msg;
  if (need && need.length) {
    const c = instanceCounts(prog);
    const miss = need.filter((k) => !c[k]);
    if (miss.length) return REQ_MSG[miss[0]] || `Тут не хватает блока «${blockName(miss[0])}». В этой задаче Coddy должен САМ проверить мир — добавь его и попробуй снова! 🔍`;
  }
  return null;
}

// КАРТЫ-ЛАБИРИНТЫ (3.4). Задаём ПУТЬ отрезками, а стенами становится всё остальное — так карту
// невозможно «недостроить» и случайно оставить дырку, из-за которой сенсор пути соврёт.
// seg — отрезок по прямой (оба конца включительно), path — склейка, mazeInner — внутренние стены.
const seg = (c1, r1, c2, r2) => { const out = []; const dc = Math.sign(c2 - c1), dr = Math.sign(r2 - r1); let c = c1, r = r1; out.push([c, r]); while (c !== c2 || r !== r2) { c += dc; r += dr; out.push([c, r]); } return out; };
const path = (...segs) => [].concat(...segs);
const mazeInner = (cols, rows, open) => { const o = new Set(open.map(([c, r]) => key(c, r))); const w = []; for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) if (!o.has(key(c, r))) w.push([c, r]); return w; };

// Окошко-число −/+ для Repeat (зелёное) и move N (синее).
function Stepper({ n, onDec, onInc, dk = T_REPEAT.dk, ring = 'rgba(73,132,73,0.5)', unit = uzT("повторений"), small }) {
  const b = { width: small ? 22 : 26, height: small ? 26 : 28, border: 'none', background: 'transparent', color: dk, fontSize: small ? 17 : 19, fontWeight: 800, lineHeight: 1, cursor: 'pointer', padding: 0, touchAction: 'manipulation', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const stop = (e) => e.stopPropagation();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.97)', borderRadius: 9, boxShadow: `inset 0 0 0 1.5px ${ring}`, margin: '0 1px' }}>
      <button type="button" aria-label={uzT("Меньше ") + unit} onPointerDown={stop} onClick={(e) => { stop(e); onDec(); }} style={b}>−</button>
      <span aria-live="polite" style={{ minWidth: small ? 20 : 24, textAlign: 'center', fontWeight: 900, color: dk, fontSize: small ? 15 : 16, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
      <button type="button" aria-label={uzT("Больше ") + unit} onPointerDown={stop} onClick={(e) => { stop(e); onInc(); }} style={b}>+</button>
    </span>
  );
}

// ⚙️ Шестерёнка — рисуем сами (не эмодзи), чтобы кнопка выглядела как настоящая деталь блока.
function GearIcon({ size = 15, color = '#fff', spin }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <g className={spin ? 'cx-spin' : undefined} style={{ transformOrigin: '12px 12px' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (<rect key={d} x="10.8" y="1.1" width="2.4" height="5" rx="1.1" fill={color} transform={`rotate(${d} 12 12)`} />))}
        <circle cx="12" cy="12" r="7" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="12" cy="12" r="2.5" fill={color} />
      </g>
    </svg>
  );
}

function EyeMini({ size = 13, color = '#fff' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6S2.5 12 2.5 12Z" stroke={color} strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.6" fill={color} /></svg>);
}
function BatMini({ size = 13, color = '#fff' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><rect x="3" y="8" width="13" height="8" rx="2.2" stroke={color} strokeWidth="2" /><path d="M18.5 10.6v2.8" stroke={color} strokeWidth="2" strokeLinecap="round" /><rect x="5.5" y="10" width="5.5" height="4" rx="1" fill={color} /></svg>);
}
// ⚠️ мини-знак опасности для чипа условия «вирус впереди?»
function DangerMini({ size = 13, color = '#fff' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 4.2 L21 19.4 H3 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" /><path d="M12 10v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="17" r="1.15" fill={color} /></svg>);
}
// 🛡️ мини-щит для чипа условия «щит впереди?»
function ShieldMini({ size = 13, color = '#fff' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 3.2 L19 6 V12 C19 16.6 15.9 19.9 12 21.2 C8.1 19.9 5 16.6 5 12 V6 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" /></svg>);
}
// ⬅/➡ мини-стрелка для чипа условия «путь слева/справа?»
function PathMini({ size = 13, color = '#fff', dir = 'left' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0, transform: dir === 'right' ? 'scaleX(-1)' : 'none' }}><path d="M20 12H5.4" stroke={color} strokeWidth="2.4" strokeLinecap="round" /><path d="M11 6.4L5 12l6 5.6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
const sensorMini = (s) => (s === 'has_battery' ? <BatMini /> : s === 'danger_front' ? <DangerMini /> : s === 'shield_front' ? <ShieldMini /> : s === 'path_left' ? <PathMini dir="left" /> : s === 'path_right' ? <PathMini dir="right" /> : <EyeMini />);
// какой «глаз» на карте подсветить, когда программа читает этот сенсор
const probeOf = (s) => (s === 'path_left' ? 'left' : s === 'path_right' ? 'right' : null);

// ============================================================
// ⚙️ GearBubble — МАСТЕРСКАЯ НАСТРОЙКИ БЛОКА (главная новая механика урока 3.3).
// Слева — «детали» (else if / else), справа — «структура» блока. Деталь перетаскивают в структуру,
// и блок вырастает. Правило Blockly: else всегда ПОСЛЕДНИЙ, else if вставляется перед ним.
// Короткий тап по детали тоже добавляет её (пальцем на планшете тянуть неудобно) — но подсказка учит тянуть.
// ============================================================
function GearBubble({ node, narrow, maxElif, allowElse, onAddElif, onAddElse, onRemoveElif, onRemoveElse, onClose }) {
  const [mdrag, setMdrag] = useState(null);
  const [warn, setWarn] = useState(null);
  const zoneRef = useRef(null);
  const mdragRef = useRef(null); useEffect(() => { mdragRef.current = mdrag; }, [mdrag]);
  const warnTimer = useRef(null);
  useEffect(() => () => { if (warnTimer.current) clearTimeout(warnTimer.current); }, []);
  const flash = (t) => { setWarn(t); if (warnTimer.current) clearTimeout(warnTimer.current); warnTimer.current = setTimeout(() => setWarn(null), 2400); };
  const elifs = node.elifs || [];
  const cap = maxElif == null ? MAX_ELIF : maxElif;  // на ранних уровнях веток else if ещё не нужно (limits.elif: 0)
  const okElse = allowElse !== false;
  const fullElif = elifs.length >= cap;
  const hasElse = !!node.hasElse;

  // куда вставится «else if»: считаем по строкам структуры (строка 0 — сама шапка if)
  const idxAt = (y) => {
    const cont = zoneRef.current; if (!cont) return elifs.length;
    const rows = [...cont.querySelectorAll('[data-mrow]')];
    let idx = rows.length;
    for (let i = 0; i < rows.length; i++) { const r = rows[i].getBoundingClientRect(); if (y < r.top + r.height / 2) { idx = i; break; } }
    return clamp(idx - 1, 0, elifs.length);
  };
  const overZone = (x, y) => { const el = zoneRef.current; if (!el) return false; const rc = el.getBoundingClientRect(); const m = 26; return x >= rc.left - m && x <= rc.right + m && y >= rc.top - m && y <= rc.bottom + m; };
  const startM = (e, kind) => {
    e.stopPropagation();
    if (kind === 'elif' && fullElif) { flash(cap === 0 ? uzT("В этой задаче хватит ДВУХ веток: добавь только «else» 🙂") : cap === 1 ? uzT("Тут хватит ОДНОЙ ветки «else if» — она уже есть 🙂") : `Больше ${cap} веток «else if» тут не нужно 🙂`); sfx('limit'); return; }
    if (kind === 'else' && (hasElse || !okElse)) { flash(okElse ? uzT("Ветка «else» может быть только ОДНА — она последняя.") : uzT("В этой задаче ветка «else» не нужна.")); sfx('limit'); return; }
    const x = e.clientX, y = e.clientY;
    setMdrag({ kind, x, y, startX: x, startY: y, moved: false, index: elifs.length, inside: false });
  };
  useEffect(() => {
    if (!mdrag) return;
    const move = (e) => { const x = e.clientX, y = e.clientY; setMdrag((d) => (d ? { ...d, x, y, moved: d.moved || Math.hypot(x - d.startX, y - d.startY) > 6, index: idxAt(y), inside: overZone(x, y) } : d)); };
    const up = () => {
      const d = mdragRef.current; setMdrag(null);
      if (!d) return;
      // короткий тап = добавить в конец; перетаскивание засчитываем только если отпустили над структурой
      if (d.moved && !d.inside) { sfx('miss'); flash(uzT("Отпусти деталь ВНУТРИ структуры блока — в рамке справа ⤵")); return; }
      if (d.kind === 'elif') onAddElif(d.moved ? d.index : elifs.length); else onAddElse();
      sfx('gear');
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [mdrag === null, elifs.length, hasElse]);

  const piece = (kind, disabled) => (
    <div role="button" tabIndex={0} aria-label={uzT("Деталь ") + BLOCK_DEF[kind].label} onPointerDown={(e) => startM(e, kind)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T_ELSE.bg, color: '#fff', padding: '7px 11px', minHeight: 34, borderRadius: 10, boxShadow: 'inset 0 0 0 1.5px ' + T_ELSE.dk, fontSize: 13, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none', userSelect: 'none', opacity: disabled ? 0.42 : 1 }}>
      <BlockIcon k={kind} />{BLOCK_DEF[kind].label}
    </div>
  );
  const mrow = (children, i, dim) => (
    <div key={i} data-mrow="" style={{ position: 'relative' }}>
      {mdrag && mdrag.moved && mdrag.kind === 'elif' && mdrag.inside && mdrag.index === i - 1 && i > 0 && (<div aria-hidden="true" style={{ position: 'absolute', top: -4, left: 0, right: 0, height: 4, borderRadius: 4, background: T.accent, boxShadow: '0 0 0 2px ' + T.accentSoft, zIndex: 4 }} />)}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: dim ? 'rgba(255,255,255,0.16)' : T_IF.bg, color: '#fff', padding: '6px 9px', minHeight: 32, borderRadius: 9, boxShadow: 'inset 0 0 0 1.5px ' + T_IF.dk, fontSize: 12.5, fontWeight: 800 }}>{children}</div>
    </div>
  );

  const rows = [];
  rows.push(mrow(<><BlockIcon k="if" /><span>if</span><span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 800, opacity: 0.85 }}>always first</span></>, 0));
  elifs.forEach((e, i) => rows.push(mrow(
    <><BlockIcon k="elif" /><span>else if</span>
      <button type="button" aria-label={uzT("Убрать ветку else if")} onClick={() => { onRemoveElif(e.id); sfx('gear'); }} style={{ marginLeft: 'auto', flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
    </>, i + 1)));
  if (hasElse) rows.push(mrow(
    <><BlockIcon k="else" /><span>else</span><span style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.85 }}>always last</span>
      <button type="button" aria-label={uzT("Убрать ветку else")} onClick={() => { onRemoveElse(); sfx('gear'); }} style={{ marginLeft: 'auto', flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
    </>, elifs.length + 1));

  const total = 1 + elifs.length + (hasElse ? 1 : 0);
  return (
    <div role="dialog" aria-label={uzT("Настройка блока If")} onPointerDown={(e) => e.stopPropagation()}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(38,32,44,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      <div className="frame" style={{ background: '#FFFDFA', width: '100%', maxWidth: narrow ? 340 : 470, maxHeight: '86vh', overflowY: 'auto', padding: narrow ? 12 : 16, boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: T_IF.bg, alignItems: 'center', justifyContent: 'center' }}><GearIcon size={16} spin /></span>
          <span style={{ fontSize: narrow ? 14 : 15.5, fontWeight: 900, color: T.ink }}>{uzT("Настройка блока If")}</span>
          <button type="button" aria-label={uzT("Закрыть")} onClick={onClose} style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 9, border: 'none', background: 'rgba(167,166,162,0.18)', color: T.ink2, fontSize: 17, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ fontSize: narrow ? 11.5 : 12.5, fontWeight: 700, color: T.ink3, marginBottom: 10, lineHeight: 1.35 }}>{uzT("Перетащи деталь в структуру — и блок вырастет. Сейчас веток:")} <b style={{ color: T_IF.dk }}>{total}</b>.</div>

        <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: narrow ? 10 : 14, alignItems: 'stretch' }}>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={lbl}>{uzT("Детали")}</div>
            {piece('elif', fullElif)}
            {piece('else', hasElse || !okElse)}
          </div>
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={lbl}>{uzT("Структура блока")}</div>
            <div ref={zoneRef} style={{ flex: 1, minHeight: 96, display: 'flex', flexDirection: 'column', gap: 6, padding: 9, borderRadius: 12, background: `${T_IF.bg}12`, border: `2px dashed ${mdrag && mdrag.moved && mdrag.inside ? T.accent : `${T_IF.bg}55`}`, transition: 'border-color .12s' }}>
              {rows}
              {mdrag && mdrag.moved && mdrag.inside && mdrag.index >= elifs.length && (<div style={{ height: 30, borderRadius: 8, border: `2px dashed ${T.accent}`, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontSize: 11.5, fontWeight: 800 }}>{uzT("отпусти здесь ⤵")}</div>)}
            </div>
          </div>
        </div>

        {warn && <div role="status" aria-live="polite" style={{ marginTop: 8, fontSize: 11.5, fontWeight: 800, color: T.accentDk, lineHeight: 1.35 }}>{warn}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={onClose} className="btn-white-accent glow-ready" style={{ padding: '11px 22px', fontSize: 15 }}>{uzT("Готово")}</button>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.ink3, lineHeight: 1.3 }}>{uzT("else if — новое условие · else — «иначе», без условия")}</span>
        </div>
      </div>
      {mdrag && mdrag.moved && (
        <div aria-hidden="true" style={{ position: 'fixed', left: mdrag.x + 10, top: mdrag.y - 14, zIndex: 70, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 11, background: T_ELSE.bg, color: '#fff', fontWeight: 800, fontSize: 13.5, boxShadow: '0 12px 26px rgba(0,0,0,0.28)' }}>
          <BlockIcon k={mdrag.kind} />{BLOCK_DEF[mdrag.kind].label}
        </div>
      )}
    </div>
  );
}

function Sandbox({ data, speak, gesture, onSolved, solved, cell, narrow, teach }) {
  const level = React.useMemo(() => ({
    ...data.level,
    walls: buildWalls(data.level.cols, data.level.rows, data.level.inner || []),
    batteries: new Set((data.level.batteries || []).map(([c, r]) => key(c, r))),
    coins: new Set((data.level.coins || []).map(([c, r]) => key(c, r))),
    viruses: new Set((data.level.viruses || []).map(([c, r]) => key(c, r))),
    shields: new Set((data.level.shields || []).map(([c, r]) => key(c, r))),
    reqBatteries: data.level.reqBatteries || 0,
    reqBatteries: data.level.reqBatteries || 0,
    tries: data.level.tries || 3,
  }), [data]);
  // сколько «собрать» и чем это показывать: 3.3 работает на батарейках (батарейки поддержаны для совместимости)
  const reqPick = level.reqBatteries || 0;   // монет в курсе нет: без «|| 0» тут был undefined и победа не засчитывалась
  const coinMode = false;   // собираемое в курсе одно — батарейка
  const lockMove1 = !!data.lockMove1;
  const showPaths = data.paths !== false;   // «глаза» ⬅➡ у Coddy на карте — главная видимая новинка 3.4
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  // лабиринт занимает и ширину, и высоту — иначе 7 строк карты не влезают на мобиле без скролла
  const deskCell = deskMapCell(level.cols, level.rows);
  const mobCell = Math.min(cell, 28, Math.floor((Math.min(vw, 880) - 40) / level.cols), Math.floor((vh >= 860 ? 210 : 158) / level.rows));
  const start = () => ({ c: level.S[0], r: level.S[1], dir: 'right' });
  const mkIf = () => ({ id: uid(), k: 'if', sensor: null, body: [], elifs: [], hasElse: false, elseId: uid(), elseBody: [] });
  const mkItem = (k) => (
    k === 'repeat' ? { id: uid(), k: 'repeat', n: 2, body: [] }
      : k === 'while' ? { id: uid(), k: 'while', mode: 'until', neg: false, sensor: null, body: [] }
        : k === 'if' ? mkIf()
          : k === 'move' ? { id: uid(), k: 'move', n: 1 }
            : { id: uid(), k }
  );
  const mkTree = (x) => (
    typeof x === 'string' ? mkItem(x)
      : x.k === 'while' ? { id: uid(), k: 'while', mode: x.mode || 'until', neg: !!x.neg, sensor: x.sensor || null, body: (x.body || []).map(mkTree) }
        : x.k === 'if' ? { id: uid(), k: 'if', sensor: x.sensor || null, body: (x.body || []).map(mkTree), elifs: (x.elifs || []).map((e) => ({ id: uid(), sensor: e.sensor || null, body: (e.body || []).map(mkTree) })), hasElse: !!x.hasElse, elseId: uid(), elseBody: (x.elseBody || []).map(mkTree) }
          : x.k === 'move' ? { id: uid(), k: 'move', n: x.n || 1 }
            : { id: uid(), k: 'repeat', n: x.n || 2, body: (x.body || []).map(mkTree) }
  );
  // Изначальное состояние программы — одно на useState и на «Сброс».
  const makeInitialProgram = () => (data.initialProgram || []).map(mkTree);
  const [program, setProgram] = useState(makeInitialProgram);
  const [robot, setRobot] = useState(start);
  const [running, setRunning] = useState(false);
  const [runHi, setRunHi] = useState(null);
  const [runReps, setRunReps] = useState(null);
  const [runWhile, setRunWhile] = useState(null);
  const [runIf, setRunIf] = useState(null);
  const [probe, setProbe] = useState(null);
  const [gearId, setGearId] = useState(null);
  const [bump, setBump] = useState(false);
  const [picked, setPicked] = useState(() => new Set());
  const [hasShield, setShieldOn] = useState(false);
  const [taken, setTaken] = useState(() => new Set());
  const [dead, setDead] = useState(() => new Set());
  const [lives, setLives] = useState(level.tries);
  const [hitOn, setHit] = useState(false);
  const [fb, setFb] = useState(null);
  const [trail, setTrail] = useState(null);
  const [drag, setDrag] = useState(null);
  const [tapNudge, setTapNudge] = useState(false);
  // Счётчик неудачных запусков — по нему открывается кнопка «Я сдаюсь».
  const [fails, setFails] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const nudgeTimer = useRef(null);
  const [limitMsg, setLimitMsg] = useState(null);
  const limitTimer = useRef(null);
  const [condWarn, setCondWarn] = useState(false);
  const condTimer = useRef(null);
  const progRef = useRef(program); useEffect(() => { progRef.current = program; }, [program]);
  const dragRef = useRef(drag); useEffect(() => { dragRef.current = drag; }, [drag]);
  const runIdRef = useRef(0);
  useEffect(() => () => { [nudgeTimer, limitTimer, condTimer].forEach((t) => t.current && clearTimeout(t.current)); }, []);
  const listRef = useRef(null); const trashRef = useRef(null);
  // Телефон: список программы держим ростом примерно на пять блоков — иначе он уходит
  // вниз бесконечно и дотянуть блок до конца программы пальцем уже нельзя.
  const [progOpen, setProgOpen] = useState(false);
  useEffect(() => { const el = listRef.current; if (el && narrow && !progOpen) el.scrollTop = el.scrollHeight; }, [program, narrow, progOpen]);
  const fit = useFitMap(narrow); // телефон: подбираем размер карты под «Программу Coddy»
  const palette = data.palette || ['left', 'right', 'move'];
  const noPalette = palette.length === 0;
  const programLabel = data.programLabel || uzT("Программа Coddy");
  const showCoach = teach && program.length === 0 && !drag;
  const limits = data.limits || null;
  const need = data.require || null;
  const counts = instanceCounts(program);
  const limited = (k) => !!(limits && Object.prototype.hasOwnProperty.call(limits, k));
  const remaining = (k) => (limited(k) ? Math.max(0, limits[k] - (counts[k] || 0)) : Infinity);
  const flashLimit = (k) => { setLimitMsg(k); if (limitTimer.current) clearTimeout(limitTimer.current); limitTimer.current = setTimeout(() => setLimitMsg(null), 2200); };
  const flashCond = () => { setCondWarn(true); if (condTimer.current) clearTimeout(condTimer.current); condTimer.current = setTimeout(() => setCondWarn(false), 2400); };
  const prevLenRef = useRef(program.length);
  useEffect(() => { const el = listRef.current; if (el && program.length > prevLenRef.current) el.scrollTop = el.scrollHeight; prevLenRef.current = program.length; }, [program.length]);

  const idxIn = (container, y) => { const rows = [...container.querySelectorAll(':scope > [data-row]')]; let idx = rows.length; for (let i = 0; i < rows.length; i++) { const r = rows[i].getBoundingClientRect(); if (y < r.top + r.height / 2) { idx = i; break; } } return idx; };
  const locate = (x, y) => {
    const cont = listRef.current; if (!cont) return { parentId: null, index: progRef.current.length, condId: null };
    let condId = null, condArea = Infinity;
    for (const cz of cont.querySelectorAll('[data-condzone]')) { const rc = cz.getBoundingClientRect(); if (x >= rc.left - 12 && x <= rc.right + 12 && y >= rc.top - 10 && y <= rc.bottom + 10) { const a = rc.width * rc.height; if (a < condArea) { condArea = a; condId = +cz.getAttribute('data-condzone'); } } }
    let best = null, bestArea = Infinity;
    for (const b of cont.querySelectorAll('[data-bodyzone]')) {
      const rc = b.getBoundingClientRect();
      if (x >= rc.left - 8 && x <= rc.right + 8 && y >= rc.top - 6 && y <= rc.bottom + 6) { const area = rc.width * rc.height; if (area < bestArea) { bestArea = area; best = b; } }
    }
    const node = best ? { parentId: +best.getAttribute('data-bodyzone'), index: idxIn(best, y) } : { parentId: null, index: idxIn(cont, y) };
    return { ...node, condId };
  };
  const overTrashAt = (x, y) => { const el = trashRef.current; if (!el) return false; const rc = el.getBoundingClientRect(); return x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom; };
  const overListAt = (x, y, m = 30) => { const el = listRef.current; if (!el) return true; const rc = el.getBoundingClientRect(); return x >= rc.left - m && x <= rc.right + m && y >= rc.top - m && y <= rc.bottom + m; };
  const startDrag = (e, payload) => { if (running || gearId != null) return; gesture(); const x = e.clientX, y = e.clientY; const kind = payload.k || payload.kind; setDrag({ ...payload, kind, x, y, startX: x, startY: y, moved: false, tgt: locate(x, y), overTrash: false, outList: false }); };

  useEffect(() => {
    if (!drag) return;
    const move = (e) => { const x = e.clientX, y = e.clientY; setDrag((d) => { if (!d) return d; const moved = d.moved || Math.hypot(x - d.startX, y - d.startY) > 6; return { ...d, x, y, moved, tgt: locate(x, y), overTrash: overTrashAt(x, y), outList: !overListAt(x, y), outStrict: !overListAt(x, y, 6) }; }); };
    const up = () => { commit(dragRef.current); setDrag(null); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [drag === null]);

  const insertInto = (arr, tgt, item) => { const cont = findContainer(arr, tgt.parentId); if (cont) cont.splice(clamp(tgt.index, 0, cont.length), 0, item); else arr.push(item); };
  const removeFrom = (arr, src) => { const cont = findContainer(arr, src.parentId); if (!cont) return null; const removed = cont[src.index]; cont.splice(src.index, 1); return removed; };
  const isCondBlock = (k) => k === 'not' || k === 'at_finish' || k === 'has_battery' || k === 'danger_front' || k === 'shield_front' || k === 'path_left' || k === 'path_right';
  const commit = (d) => {
    if (!d) return;
    if (d.type === 'new') {
      if (!d.moved) { setTapNudge(true); if (nudgeTimer.current) clearTimeout(nudgeTimer.current); nudgeTimer.current = setTimeout(() => setTapNudge(false), 1800); return; } if (d.overTrash || d.outStrict) { sfx('nope'); return; } /* дроп ВНЕ «Программы Coddy» — действие недействительно */
      if (isCondBlock(d.k)) {
        const cid = d.tgt.condId;
        if (cid == null) { flashCond(); sfx('miss'); return; }
        if (limited(d.k) && (instanceCounts(progRef.current)[d.k] || 0) >= limits[d.k]) { flashLimit(d.k); sfx('limit'); return; }
        setProgram((p) => { const a = cloneProg(p); const w = findCondHost(a, cid); if (w) { if (d.k === 'not') { if (w.k !== 'while' || w.neg) return p; w.neg = true; } else { if (w.sensor) return p; w.sensor = d.k; } } return a; }); sfx('pop'); return;
      }
      if (limited(d.k) && (instanceCounts(progRef.current)[d.k] || 0) >= limits[d.k]) { flashLimit(d.k); sfx('limit'); return; }
      setProgram((p) => { const a = cloneProg(p); insertInto(a, d.tgt, mkItem(d.k)); return a; }); sfx('pop'); return;
    }
    if (d.type === 'move') {
      if (d.overTrash || (d.moved && d.outList)) { setProgram((p) => { const a = cloneProg(p); removeFrom(a, d.src); return a; }); sfx('pop'); return; }
      if (!d.moved) return;
      setProgram((p) => {
        const a = cloneProg(p);
        if ((d.kind === 'repeat' || d.kind === 'while' || d.kind === 'if') && d.tgt.parentId != null) { const moving = findNode(a, d.nodeId); if (moving && zoneIdsOf(moving).has(d.tgt.parentId)) return p; }
        const removed = removeFrom(a, d.src); if (!removed) return p;
        let tgt = d.tgt;
        const sameParent = tgt.parentId === d.src.parentId;
        if (sameParent && tgt.index > d.src.index) tgt = { ...tgt, index: tgt.index - 1 };
        if (findContainer(a, tgt.parentId) == null) return p;
        insertInto(a, tgt, removed); return a;
      });
    }
  };
  const removeItem = (src) => { if (running) return; setProgram((p) => { const a = cloneProg(p); removeFrom(a, src); return a; }); };
  const setN = (id, delta) => { setProgram((p) => { const a = cloneProg(p); const rep = findNode(a, id); if (rep && rep.k === 'repeat') rep.n = clamp((rep.n || 1) + delta, 1, 20); return a; }); gesture(); sfx('pop'); };
  const setMode = (id) => { setProgram((p) => { const a = cloneProg(p); const w = findNode(a, id); if (w && w.k === 'while') w.mode = w.mode === 'while' ? 'until' : 'while'; return a; }); gesture(); sfx('pop'); };
  const removeCond = (id, which) => { if (running) return; setProgram((p) => { const a = cloneProg(p); const w = findCondHost(a, id); if (w) { if (which === 'not') w.neg = false; else w.sensor = null; } return a; }); gesture(); sfx('pop'); };
  // --- ШЕСТЕРЁНКА: настройка веток блока If ---
  const openGear = (id) => { if (running) return; gesture(); setGearId(id); sfx('gear'); };
  const gearMaxElif = limits && limits.elif != null ? limits.elif : MAX_ELIF;
  const gearAllowElse = !limits || limits.else == null || limits.else > 0;
  const addElif = (id, at) => setProgram((p) => { const a = cloneProg(p); const n = findNode(a, id); if (n && n.k === 'if') { const e = { id: uid(), sensor: null, body: [] }; n.elifs = n.elifs || []; if (n.elifs.length < gearMaxElif) n.elifs.splice(clamp(at, 0, n.elifs.length), 0, e); } return a; });
  const addElse = (id) => setProgram((p) => { const a = cloneProg(p); const n = findNode(a, id); if (n && n.k === 'if' && !n.hasElse && gearAllowElse) { n.hasElse = true; if (n.elseId == null) n.elseId = uid(); } return a; });
  const removeElif = (id, eid) => setProgram((p) => { const a = cloneProg(p); const n = findNode(a, id); if (n && n.k === 'if') n.elifs = (n.elifs || []).filter((e) => e.id !== eid); return a; });
  const removeElse = (id) => setProgram((p) => { const a = cloneProg(p); const n = findNode(a, id); if (n && n.k === 'if') { n.hasElse = false; n.elseBody = []; } return a; });
  const setMoveN = (src, delta) => {
    if (running || lockMove1) return;
    setProgram((p) => { const a = cloneProg(p); const cont = findContainer(a, src.parentId); if (cont) { const it = cont[src.index]; if (it && it.k === 'move') cont[src.index] = { ...it, n: clamp((it.n || 1) + delta, 1, 20) }; } return a; });
    gesture(); sfx('pop');
  };
  const reset = () => { runIdRef.current++; setProgram(makeInitialProgram()); setRunning(false); setRunHi(null); setRunReps(null); setRunWhile(null); setRunIf(null); setProbe(null); setBump(false); setHit(false); setFb(null); setRobot(start()); setPicked(new Set()); setShieldOn(false); setTaken(new Set()); setDead(new Set()); setLives(level.tries); setTrail(null); };

  const run = async () => {
    if (running || program.length === 0) return;
    const err = precheck(progRef.current, need);
    if (err) { gesture(); setFb(null); finish(false, err); return; }
    gesture();
    // Телефон: прокручиваем страницу к карте — иначе прогон идёт за верхним краем экрана.
    if (narrow && typeof window !== 'undefined') { try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (e) {} setTimeout(() => { if (window.scrollY > 4) window.scrollTo(0, 0); }, 240); }
    const myId = ++runIdRef.current; setRunning(true); setFb(null); setBump(false); setHit(false); setRunHi(null); setRunReps(null); setRunWhile(null); setRunIf(null);
    let cur = start(); const pick = new Set(); let shield = false; const taken = new Set(); const dead = new Set(); let lives = level.tries;
    setRobot({ ...cur }); setPicked(new Set()); setShieldOn(false); setTaken(new Set()); setDead(new Set()); setLives(lives);
    const tr = [[cur.c, cur.r]]; setTrail([[cur.c, cur.r]]); await sleep(300);
    const st = { bump: false, dead: false, infinite: false, aborted: false, ops: 0 };
    const MAX_OPS = 300;
    const atFinish = () => cur.c === level.F[0] && cur.r === level.F[1];
    const hasBattery = () => level.batteries.has(key(cur.c, cur.r)) && !pick.has(key(cur.c, cur.r));
    // сенсоры «впереди»: смотрят на СЛЕДУЮЩУЮ клетку по направлению Coddy (уничтоженные вирусы / взятые щиты не считаются)
    const frontKey = () => { const [dc, dr] = DIRS[cur.dir]; return key(cur.c + dc, cur.r + dr); };
    const dangerFront = () => { const f = frontKey(); return level.viruses.has(f) && !dead.has(f); };
    const shieldFront = () => { const f = frontKey(); return level.shields.has(f) && !taken.has(f); };
    // сенсоры пути: свободна ли соседняя клетка СЛЕВА/СПРАВА от Coddy (сторона крутится вместе с ним)
    const openAt = (c, r) => !(c < 0 || r < 0 || c >= level.cols || r >= level.rows || level.walls.has(key(c, r)));
    const sideOpen = (side) => { const [dc, dr] = DIRS[side === 'left' ? LEFT[cur.dir] : RIGHT[cur.dir]]; return openAt(cur.c + dc, cur.r + dr); };
    const sensorRead = (s) => (s === 'has_battery' ? hasBattery() : s === 'danger_front' ? dangerFront() : s === 'shield_front' ? shieldFront() : s === 'path_left' ? sideOpen('left') : s === 'path_right' ? sideOpen('right') : atFinish());

    const doLeaf = async (it, reps) => {
      if (myId !== runIdRef.current) { st.aborted = true; return false; }
      setRunHi(it.id);
      const rm = {}; (reps || []).forEach((rp) => { rm[rp.id] = { iter: rp.iter, n: rp.n }; }); setRunReps(rm);
      // pick battery / pick battery
      if (it.k === 'battery') {
        const hk = key(cur.c, cur.r);
        if (level.batteries.has(hk) && !pick.has(hk)) { pick.add(hk); setPicked(new Set(pick)); sfx('charge'); await sleep(440); }
        else { sfx('nope'); await sleep(280); }
        return true;
      }
      // take shield
      if (it.k === 'shield') {
        const hk = key(cur.c, cur.r);
        if (level.shields.has(hk) && !taken.has(hk)) { taken.add(hk); setTaken(new Set(taken)); shield = true; setShieldOn(true); sfx('shield'); await sleep(480); }
        else { sfx('nope'); await sleep(300); }
        return true;
      }
      // turns
      if (it.k === 'left' || it.k === 'right') {
        const r = applyStep(cur, it.k, level);
        cur = r.next; setRobot({ ...cur }); sfx('turn'); await sleep(320);
        return true;
      }
      // move N — разворачиваем в N ходов; на каждом ходу проверяем стену и вирус
      const steps = clamp(it.n || 1, 1, 20);
      for (let s = 0; s < steps; s++) {
        if (myId !== runIdRef.current) { st.aborted = true; return false; }
        const r = applyStep(cur, 'move', level);
        // Стена больше не обрывает прогон: шаг не выполняется, программа идёт дальше.
        // st.ops обязателен — иначе While, упёршийся в стену, крутился бы вечно.
        if (r.bumped) { sfx('bump'); setBump(true); await sleep(320); setBump(false); st.ops++; if (st.ops > MAX_OPS) { st.infinite = true; return false; } continue; }
        cur = r.next; setRobot({ ...cur }); tr.push([cur.c, cur.r]); setTrail([...tr]);
        const hk = key(cur.c, cur.r);
        if (level.viruses.has(hk) && !dead.has(hk)) {
          if (shield) { shield = false; setShieldOn(false); dead.add(hk); setDead(new Set(dead)); sfx('crack'); await sleep(500); }
          else { lives = 0; setLives(0); setHit(true); sfx('hit'); await sleep(760); setHit(false); cur = start(); setRobot({ ...cur }); await sleep(420); st.dead = true; return false; }
        } else { sfx('step'); await sleep(340); }
        st.ops++; if (st.ops > MAX_OPS) { st.infinite = true; return false; }
      }
      return true;
    };

    const walk = async (items, reps) => {
      for (const it of items) {
        if (st.aborted || st.bump || st.dead || st.infinite) return;
        if (it.k === 'repeat') {
          const n = clamp(it.n || 1, 1, 99);
          for (let i = 0; i < n; i++) { if (st.aborted || st.bump || st.dead || st.infinite) return; await walk(it.body || [], [...reps, { id: it.id, iter: i + 1, n }]); }
        } else if (it.k === 'if') {
          // СЕРДЦЕ УРОКА 3.3: ветки проверяются ПО ПОРЯДКУ, сработает РОВНО ОДНА.
          // Ребёнок видит это вживую: у каждой ветки загорается свой ответ, выбранная — подсвечивается,
          // остальные тускнеют («пропущено»).
          const answers = {}; let chosen = null;
          for (const br of branchesOf(it)) {
            const reading = sensorRead(br.sensor);
            answers[br.key] = reading;
            setRunHi(it.id); setRunIf({ id: it.id, at: br.key, answers: { ...answers }, chosen: reading ? br.key : null }); setProbe(probeOf(br.sensor));
            sfx(reading ? 'sense' : 'senseno'); await sleep(reading ? 420 : 300);
            if (st.aborted || myId !== runIdRef.current) { st.aborted = true; return; }
            if (reading) { chosen = br; break; }
          }
          if (!chosen && it.hasElse) {
            chosen = { key: 'else', body: it.elseBody || [] };
            setRunIf({ id: it.id, at: 'else', answers: { ...answers }, chosen: 'else' }); setProbe(null);
            sfx('sense'); await sleep(360);
            if (st.aborted || myId !== runIdRef.current) { st.aborted = true; return; }
          }
          if (chosen) await walk(chosen.body || [], reps);
        } else if (it.k === 'while') {
          let guard = 0; const MAX_LOOP = Math.max(40, (level.cols + level.rows) * 3);
          while (true) {
            if (st.aborted || st.bump || st.dead || st.infinite) return;
            const reading = sensorRead(it.sensor); const keep = evalKeep(it, reading); setProbe(probeOf(it.sensor));
            setRunHi(it.id); setRunWhile({ id: it.id, iter: guard, reading, sensor: it.sensor, done: !keep });
            if (!keep) { await sleep(280); break; }
            guard++; if (guard > MAX_LOOP) { st.infinite = true; break; }
            await walk(it.body || [], reps);
          }
        } else {
          const ok = await doLeaf(it, reps); if (!ok) return;
        }
      }
    };

    await walk(progRef.current, []);
    if (myId !== runIdRef.current) return;
    setRunHi(null); setRunReps(null); setRunWhile(null); setRunIf(null);
    if (st.infinite) { finish(false, uzT("Ой! Coddy шагает и шагает по кругу — это БЕСКОНЕЧНЫЙ ЦИКЛ! 🔁 Проверь: в КАЖДОЙ ветке блока должен быть move, иначе Coddy застрянет на месте.")); return; }
    if (st.dead) { finish(false, `Ай! Coddy коснулся ВИРУСА ⚠️ — раунд проигран, и его отбросило в начало пути. Проверь ветки: похоже, защита не сработала. Блок «вирус впереди?» ⚠️ ставь ПЕРВЫМ — до навигатора, чтобы Coddy успел взять щит!`); return; }
    if (st.bump) { finish(false, uzT("Coddy упёрся в стену — ничего страшного! 🧱 В лабиринте это значит: он шагнул НЕ в ту сторону. Проверь ветки — там, где сенсор ответил «да», Coddy должен сначала ПОВЕРНУТЬ, а уже потом шагнуть. 💪")); return; }
    const atF = atFinish(); const got = pick.size, req = reqPick;
    if (atF && got >= req) finish(true, data.win || uzT("Получилось! Coddy сам нашёл дорогу: на каждой клетке спросил про путь и выбрал нужную ветку. 🧭⭐"));
    else if (atF && got < req) finish(false, uzTr(`Coddy bayroqchada, lekin ${req} batareykadan ${got} tasini yig’di. Hammasini yig’ing, keyin bayroqchaga boring.`, `Coddy на флажке, но собрал ${got} из ${req} батареек. Собери все, а потом иди к флажку.`));
    else finish(false, missText());
  };
  // Короткая реплика вместо расписанного словами решения: длинный hint съедал
  // полколонки «Программы Coddy» и всё равно был непонятен ребёнку 8–10 лет.
  // Само решение теперь доступно кнопкой «Я сдаюсь» — блоками, а не текстом.
  const missText = () => {
    const lines = [
      uzT("Почти! Coddy ещё не на флажке. Попробуй ещё раз 💪"),
      uzT("Уже ближе! Посмотри, где Coddy свернул не туда."),
      uzT("Не сдавайся! А если совсем трудно — нажми «Я сдаюсь» 👇"),
    ];
    return lines[Math.min(fails, lines.length - 1)];
  };
  const finish = (ok, text) => { setRunning(false); setRunHi(null); setRunReps(null); setRunWhile(null); setRunIf(null); setProbe(null); setFb({ ok, text }); if (!ok) setFails((f) => f + 1); sfx(ok ? 'win' : 'miss'); if (speak) speak(text); if (ok && !solved && onSolved) onSolved(); };

  const dragging = drag && drag.moved;
  const draggingCond = dragging && isCondBlock(drag.kind);
  const dropAt = (parentId, i) => dragging && !draggingCond && drag.tgt.parentId === parentId && drag.tgt.index === i;
  const dropAppend = (parentId, len) => dragging && !draggingCond && drag.tgt.parentId === parentId && drag.tgt.index >= len;
  const dropIndicator = (<div aria-hidden="true" style={{ position: 'absolute', top: -5, left: 2, right: 2, height: 4, borderRadius: 4, background: T.accent, boxShadow: '0 0 0 2px ' + T.accentSoft, zIndex: 6 }} />);

  const condChip = (hostId, which, sensor) => {
    const isNot = which === 'not';
    const col = isNot ? T_NOT : (BLOCK_COLOR[sensor] || T_SENSOR);
    const ui = SENSOR_UI[sensor] || SENSOR_UI.at_finish;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: col.bg, color: '#fff', padding: '2px 6px', borderRadius: 7, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap', ...hexStyle(isNot ? 'not' : sensor, 11) }}>
        {isNot ? <span>not</span> : <>{sensorMini(sensor)}<span>{ui.chip}</span></>}
        <button type="button" aria-label={uzT("Убрать")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeCond(hostId, isNot ? 'not' : 'sensor'); }} style={{ flexShrink: 0, width: 15, height: 15, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.32)', color: '#fff', fontSize: 11, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </span>
    );
  };
  // Окошко-условие: у шапки If, у каждой ветки else if и у While — одинаковое, адресуется по id владельца.
  const condSlot = (hostId, sensor, placeholder, prefix) => {
    const hot = draggingCond && drag.tgt.condId === hostId;
    return (
      <span data-condzone={hostId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: 26, padding: '2px 5px', ...hexSocket(hot), transition: 'background .12s' }}>
        {prefix}
        {sensor ? condChip(hostId, 'sensor', sensor) : <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.92)', padding: '2px 3px', whiteSpace: 'nowrap' }}>{placeholder}</span>}
      </span>
    );
  };

  const leafRow = (it, parentId, index) => {
    const src = { parentId, index, nodeId: it.id };
    return (
      <div key={it.id} data-row="" style={{ position: 'relative' }}>
        {dropAt(parentId, index) && dropIndicator}
        <div onPointerDown={(e) => startDrag(e, { type: 'move', src, kind: it.k, nodeId: it.id })} className={runHi === it.id ? 'codeBlk codeBlk--active' : 'codeBlk'} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: bcol(it.k).bg, color: '#fff', padding: '6px 10px', minHeight: 32, boxSizing: 'border-box', borderRadius: 10, boxShadow: 'inset 0 0 0 1.5px ' + bcol(it.k).dk, fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}>
          <BlockIcon k={it.k} />
          {it.k === 'move'
            ? (lockMove1
              ? (<span>move</span>)
              : (<><span>move</span><Stepper n={it.n || 1} onDec={() => setMoveN(src, -1)} onInc={() => setMoveN(src, +1)} dk={T.motionDk} ring="rgba(59,127,219,0.55)" unit={uzT("шагов")} small /></>))
            : (<span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[it.k].label}</span>)}
          <button type="button" aria-label={uzT("Удалить блок")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeItem(src); }} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.22)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      </div>
    );
  };

  const renderNode = (it, parentId, index) => (it.k === 'repeat' ? repeatRow(it, parentId, index) : it.k === 'while' ? whileRow(it, parentId, index) : it.k === 'if' ? ifRow(it, parentId, index) : leafRow(it, parentId, index));

  // Карман для блоков. zoneId — id владельца кармана (у If их несколько: тело if / каждой else if / else).
  const bodyZone = (zoneId, items, bg, leftCol, emptyHint) => (
    <div data-bodyzone={zoneId} style={{ marginLeft: 12, marginTop: 4, borderLeft: `4px solid ${leftCol}`, borderBottomLeftRadius: 8, paddingLeft: 8, paddingTop: 2, paddingBottom: 4, display: 'flex', flexDirection: 'column', gap: 5, minHeight: 30 }}>
      {items.length === 0 && !dropAppend(zoneId, 0) && <div style={{ fontSize: 11.5, fontWeight: 700, color: bg, opacity: 0.85, border: `2px dashed ${leftCol}66`, borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>{emptyHint}</div>}
      {items.map((c, j) => renderNode(c, zoneId, j))}
      {dropAppend(zoneId, items.length) && <div style={{ height: 30, borderRadius: 8, border: `2px dashed ${T.accent}`, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontSize: 11.5, fontWeight: 800 }}>{uzT("отпусти внутри ⤵")}</div>}
    </div>
  );

  const repeatRow = (it, parentId, index) => {
    const active = !!(runReps && runReps[it.id]);
    const src = { parentId, index, nodeId: it.id };
    return (
      <div key={it.id} data-row="" style={{ position: 'relative' }}>
        {dropAt(parentId, index) && dropIndicator}
        <div style={{ borderRadius: 12, background: 'rgba(91,165,91,0.12)', boxShadow: active ? `0 0 0 3px rgba(255,167,90,0.7)` : `inset 0 0 0 1.5px ${T_REPEAT.bg}33`, padding: 4, transition: 'box-shadow .15s' }}>
          <div onPointerDown={(e) => startDrag(e, { type: 'move', src, kind: 'repeat', nodeId: it.id })} className={active ? 'codeBlk codeBlk--active' : ''} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: T_REPEAT.bg, color: '#fff', padding: '5px 9px', minHeight: 34, borderRadius: 9, boxShadow: 'inset 0 0 0 1.5px ' + T_REPEAT.dk, fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}>
            <BlockIcon k="repeat" /><span>repeat</span>
            <Stepper n={it.n} onDec={() => setN(it.id, -1)} onInc={() => setN(it.id, +1)} />
            <span style={{ whiteSpace: 'nowrap' }}>times{active ? ` · ${runReps[it.id].iter}/${runReps[it.id].n}` : ''}</span>
            <button type="button" aria-label={uzT("Удалить Repeat")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeItem(src); }} style={{ marginLeft: 'auto', flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          {bodyZone(it.id, it.body, T_REPEAT.dk, T_REPEAT.bg, uzT("брось блоки сюда — их Coddy повторит"))}
        </div>
      </div>
    );
  };

  // ГЛАВНЫЙ БЛОК УРОКА 3.3 — If с ШЕСТЕРЁНКОЙ: шапка + сколько угодно веток else if + одна else.
  // Все ветки — ОДНОГО цвета: это подчёркивает, что перед ребёнком ОДИН настраиваемый блок, а не три разных.
  const ifRow = (it, parentId, index) => {
    const src = { parentId, index, nodeId: it.id };
    const rif = runIf && runIf.id === it.id ? runIf : null;
    const elifs = it.elifs || [];
    const nbr = 1 + elifs.length + (it.hasElse ? 1 : 0);
    const grab = (e) => startDrag(e, { type: 'move', src, kind: 'if', nodeId: it.id });
    // тусклая ветка = «пропущено»: условие уже ответило «нет» либо сработала другая ветка
    const dimmed = (bkey) => !!(rif && rif.chosen != null && rif.chosen !== bkey);
    const litRing = (bkey) => !!(rif && rif.chosen === bkey);
    const answerBadge = (bkey, sensor) => {
      if (!rif || !(bkey in rif.answers)) return null;
      const yes = !!rif.answers[bkey];
      const ui = SENSOR_UI[sensor] || SENSOR_UI.at_finish;
      return (<span style={{ fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3, background: yes ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.2)', color: yes ? T_IF.dk : '#fff', borderRadius: 7, padding: '2px 7px' }}>{ui.ico} {yes ? ui.yes : ui.no}</span>);
    };
    const head = (extra) => ({ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: T_IF.bg, color: '#fff', padding: '5px 9px', minHeight: 34, borderRadius: 9, boxShadow: (litRing(extra) ? `0 0 0 3px rgba(255,167,90,0.85), ` : '') + '0 2px 0 ' + T_IF.dk, fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'grab', touchAction: 'none', userSelect: 'none', opacity: dimmed(extra) ? 0.45 : 1, transition: 'opacity .15s, box-shadow .15s' });
    return (
      <div key={it.id} data-row="" style={{ position: 'relative' }}>
        {dropAt(parentId, index) && dropIndicator}
        <div style={{ borderRadius: 12, background: `${T_IF.bg}14`, boxShadow: rif ? `0 0 0 3px rgba(255,167,90,0.45)` : `inset 0 0 0 1.5px ${T_IF.bg}40`, padding: 4, transition: 'box-shadow .15s' }}>
          {/* шапка if */}
          <div onPointerDown={grab} style={head('main')}>
            <BlockIcon k="if" /><span>if</span>
            {condSlot(it.id, it.sensor, uzT("брось ⬅ ➡ или 🔋"))}
            {answerBadge('main', it.sensor)}
            <button type="button" aria-label={`Шестерёнка: настроить ветки блока If (сейчас ${nbr})`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); openGear(it.id); }}
              style={{ marginLeft: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 8px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.95)', color: T_IF.dk, fontSize: 11.5, fontWeight: 900, cursor: 'pointer', touchAction: 'manipulation' }}>
              <GearIcon size={14} color={T_IF.dk} spin={nbr === 1} />{nbr}
            </button>
            <button type="button" aria-label={uzT("Удалить If")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeItem(src); }} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          <div style={{ opacity: dimmed('main') ? 0.45 : 1, transition: 'opacity .15s' }}>{bodyZone(it.id, it.body, T_IF.dk, T_IF.bg, uzT("что делать, ЕСЛИ «да»"))}</div>

          {/* ветки else if — второй, третий… вопрос того же блока */}
          {elifs.map((e) => (
            <React.Fragment key={e.id}>
              <div onPointerDown={grab} style={{ ...head(e.id), marginTop: 5 }}>
                <BlockIcon k="elif" /><span>else if</span>
                {condSlot(e.id, e.sensor, uzT("брось сенсор"))}
                {answerBadge(e.id, e.sensor)}
              </div>
              <div style={{ opacity: dimmed(e.id) ? 0.45 : 1, transition: 'opacity .15s' }}>{bodyZone(e.id, e.body, T_IF.dk, T_IF.bg, uzT("что делать, если сработало ЭТО условие"))}</div>
            </React.Fragment>
          ))}

          {/* ветка else — без условия, работает когда ВСЕ ответили «нет» */}
          {it.hasElse && (
            <>
              <div onPointerDown={grab} style={{ ...head('else'), marginTop: 5 }}>
                <BlockIcon k="else" /><span>else</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>{uzT("иначе — во всех остальных случаях")}</span>
                {rif && rif.chosen === 'else' && <span style={{ fontSize: 11, fontWeight: 900, background: 'rgba(255,255,255,0.96)', color: T_IF.dk, borderRadius: 7, padding: '2px 7px', whiteSpace: 'nowrap' }}>{uzT("✔ иначе")}</span>}
              </div>
              <div style={{ opacity: dimmed('else') ? 0.45 : 1, transition: 'opacity .15s' }}>{bodyZone(it.elseId, it.elseBody || [], T_IF.dk, T_IF.bg, uzT("что делать, если ВСЕ ответы «нет»"))}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const whileRow = (it, parentId, index) => {
    const active = !!(runWhile && runWhile.id === it.id);
    const src = { parentId, index, nodeId: it.id };
    const modeLabel = it.mode === 'while' ? 'while' : 'until';
    const rui = active ? (SENSOR_UI[runWhile.sensor] || SENSOR_UI.at_finish) : null;
    return (
      <div key={it.id} data-row="" style={{ position: 'relative' }}>
        {dropAt(parentId, index) && dropIndicator}
        <div style={{ borderRadius: 12, background: `${T_WHILE.bg}14`, boxShadow: active ? `0 0 0 3px rgba(255,167,90,0.7)` : `inset 0 0 0 1.5px ${T_WHILE.bg}40`, padding: 4, transition: 'box-shadow .15s' }}>
          <div onPointerDown={(e) => startDrag(e, { type: 'move', src, kind: 'while', nodeId: it.id })} className={active ? 'codeBlk codeBlk--active' : ''} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', background: T_WHILE.bg, color: '#fff', padding: '5px 9px', minHeight: 34, borderRadius: 9, boxShadow: 'inset 0 0 0 1.5px ' + T_WHILE.dk, fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}>
            <BlockIcon k="while" />
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setMode(it.id); }} aria-label={uzT("Режим: ") + modeLabel + uzT(". Переключить while/until")} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.97)', color: T_WHILE.dk, border: 'none', borderRadius: 8, padding: '3px 8px', fontSize: 13.5, fontWeight: 900, cursor: 'pointer', touchAction: 'manipulation' }}>
              {modeLabel}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T_WHILE.dk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 8h11l-3-3M17 16H6l3 3" /></svg>
            </button>
            {condSlot(it.id, it.sensor, uzT("брось 👁 или 🔋"), it.neg ? condChip(it.id, 'not') : null)}
            {active && rui && <span style={{ fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3 }}>· {rui.ico} {runWhile.reading ? rui.yes : rui.no}</span>}
            <button type="button" aria-label={uzT("Удалить While")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeItem(src); }} style={{ marginLeft: 'auto', flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          {bodyZone(it.id, it.body, T_WHILE.dk, T_WHILE.bg, uzT("брось сюда блок If и move"))}
        </div>
      </div>
    );
  };

  const listChildren = (
    <>
      <StartBlock small />
      {program.length === 0 && <div className={showCoach ? 'coach-bob' : ''} style={{ color: showCoach ? T.accent : T.ink3, fontSize: 13, fontWeight: showCoach ? 700 : 500, padding: '8px 4px', border: showCoach ? `2px dashed ${T.accent}` : '2px dashed transparent', borderRadius: 10, textAlign: 'center' }}>{showCoach ? uzT("Брось блок сюда ⤵") : uzT("Перетащи блоки сюда…")}</div>}
      {program.map((it, i) => renderNode(it, null, i))}
      {program.length > 0 && <div style={{ flexShrink: 0, height: 38, borderRadius: 11, border: `2px dashed ${dropAppend(null, program.length) ? T.accent : 'rgba(167,166,162,0.4)'}`, background: dropAppend(null, program.length) ? T.accentSoft : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: dropAppend(null, program.length) ? T.accent : T.ink3, fontSize: 12.5, fontWeight: 700, transition: 'background .12s, border-color .12s' }}>{dropAppend(null, program.length) ? uzT("Отпусти здесь ⤵") : uzT("+ ещё блок")}</div>}
    </>
  );
  // «Я сдаюсь» открывается только после третьего промаха. До этого кнопка
  // видна, но неактивна — ребёнок знает, что выход есть, но сначала пробует сам.
  const canGiveUp = fails >= 3;
  const showingAns = showAns && canGiveUp && !!data.solution;
  // На ТЕЛЕФОНЕ кнопка с подписью стоит сбоку от карты: там пустует место, и
  // блок не забирает вертикаль, нужную «Программе Coddy».
  const giveUpEl = data.solution ? (
    <div style={{
      flexShrink: 0, display: 'flex', flexDirection: narrow ? 'row' : 'column', alignItems: 'center',
      justifyContent: 'center', gap: 4, marginTop: narrow ? 0 : 8,
      minWidth: 0, textAlign: 'center',
    }}>
      <button
        onClick={() => { if (!canGiveUp) return; gesture(); setShowAns(!showAns); }}
        /* Ответ показываем БЛОКАМИ и не озвучиваем: data.hint — стенограмма решения
           («до 🔋 {move}; pick battery»), вслух это мусор. hint остаётся в данных
           уровня как заметка автора о задуманном решении. */
        disabled={!canGiveUp}
        aria-label={uzT("Показать верный ответ")}
        className="btn-ghost"
        style={{ flexShrink: 0, padding: narrow ? '8px 14px' : '8px 15px', fontSize: narrow ? 12.5 : 13, minHeight: narrow ? 38 : 38, opacity: canGiveUp ? 1 : 0.45, cursor: canGiveUp ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
      >
        {showingAns ? uzT("Скрыть ответ") : uzT("Я сдаюсь 🏳️")}
      </button>
      {!canGiveUp && <div style={{ fontSize: narrow ? 10 : 11, fontWeight: 600, color: T.ink3, lineHeight: 1.25 }}>{narrow ? uzT("После 3 попыток") : uzT("Откроется после трёх попыток")}</div>}
    </div>
  ) : null;
  const controlsEl = (
    <div ref={fit.ctlRef} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
      <button onClick={run} disabled={running || program.length === 0} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 11, border: 'none', background: T.green, color: '#fff', fontWeight: 800, fontSize: 14, cursor: running || !program.length ? 'default' : 'pointer', opacity: running || !program.length ? 0.5 : 1, boxShadow: `0 3px 0 ${T.greenDk}`, minHeight: 40 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M7 5l12 7-12 7z" /></svg>{uzT("Запустить")}
      </button>
      <button onClick={reset} className="btn-ghost" style={{ padding: '9px 12px', fontSize: 13, minHeight: 40 }}>{uzT("Сброс")}</button>
      {giveUpEl}
      <div ref={trashRef} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px', borderRadius: 11, border: `2px dashed ${drag && drag.overTrash ? T.red : '#DCE5EC'}`, color: drag && drag.overTrash ? T.red : T.ink3, fontWeight: 700, fontSize: 12, background: drag && drag.overTrash ? T.redSoft : 'transparent' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>{uzT("Корзина")}
      </div>
    </div>
  );
  const palette3 = palette.map((k, i) => {
    const rem = remaining(k); const lim = limited(k); const out = lim && rem <= 0;
    return (
      <div key={k} style={{ position: 'relative', opacity: out ? 0.5 : 1, transition: 'opacity .15s' }}>
        <PaletteBlock k={k} small={narrow} coach={showCoach && i === 0 && !out} onPointerDown={(e) => startDrag(e, { type: 'new', k })} />
        {lim && <span aria-hidden="true" style={{ position: 'absolute', top: -7, right: -7, minWidth: 18, height: 18, padding: '0 3px', borderRadius: 9, background: out ? T.red : '#fff', color: out ? '#fff' : T.ink2, border: `1.5px solid ${out ? T.red : (bcol(k).dk)}`, fontSize: 11, fontWeight: 800, lineHeight: '15px', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }}>{rem}</span>}
      </div>
    );
  });
  const charge = reqPick ? { got: picked.size, req: reqPick, coin: coinMode } : null;
  const goalChip = reqPick ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: T.ink2, whiteSpace: 'nowrap' }}>
      <span>{uzT("Цель:")}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: showPaths && picked.size >= reqPick ? T.greenDk : (coinMode ? T_COIN.dk : T.actionDk) }}>{showPaths ? picked.size + '/' + reqPick : reqPick + '×'}{coinMode ? <Coin size={16} float={false} /> : <Battery size={16} />}</span><span style={{ color: T.ink3 }}>+</span><FinishFlag size={15} />
    </div>
  ) : null;
  const mapHeader = (
    <div style={{ display: 'flex', flexDirection: narrow ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: narrow ? 10 : 3, marginBottom: 2, flexWrap: 'wrap' }}>
      <Hearts n={level.tries} alive={lives} size={narrow ? 16 : 18} />
      {goalChip}
    </div>
  );
  const gridEl = (bigCell) => (<MiniGrid level={level} robot={robot} bump={bump} cell={bigCell} picked={picked} charge={charge} trail={null} hasShield={hasShield} taken={taken} dead={dead} hit={hitOn} paths={showPaths} probe={probe} />);
  const mapEl = (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{mapHeader}{gridEl(deskCell)}</div>);

  const dragGhost = drag && drag.moved && (() => { const gk = drag.kind; if (!gk || !BLOCK_DEF[gk]) return null; return (<div style={{ position: 'fixed', left: drag.x + 10, top: drag.y - 14, zIndex: 50, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 12, background: bcol(gk).bg, color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 12px 26px rgba(0,0,0,0.25)' }}><BlockIcon k={gk} /><span>{blockName(gk)}</span></div>); })();
  const gearNode = gearId != null ? findNode(program, gearId) : null;
  const gearEl = gearNode && gearNode.k === 'if' ? (
    <GearBubble node={gearNode} narrow={narrow} maxElif={gearMaxElif} allowElse={gearAllowElse}
      onAddElif={(at) => addElif(gearNode.id, at)} onAddElse={() => addElse(gearNode.id)}
      onRemoveElif={(eid) => removeElif(gearNode.id, eid)} onRemoveElse={() => removeElse(gearNode.id)}
      onClose={() => { setGearId(null); sfx('gear'); }} />
  ) : null;
  const limitNote = (big) => {
    if (limitMsg) return <div role="status" aria-live="polite" style={{ fontSize: big ? 12 : 11.5, fontWeight: 800, color: T.accentDk, marginTop: 2, lineHeight: 1.3 }}>{uzT("✗ Лимит! «")}{blockName(limitMsg)}{uzT("» больше нельзя —")} {data.limitHint || uzT("обойдись тем, что есть 🙂")}</div>;
    if (condWarn) return <div role="status" aria-live="polite" style={{ fontSize: big ? 12 : 11.5, fontWeight: 800, color: T.accentDk, marginTop: 2, lineHeight: 1.3 }}>{uzT("🔍 Сенсор живёт в окошке-условии! Брось его в белую рамку у ветки блока If.")}</div>;
    return (tapNudge || showCoach) && <div className="coach-bob" style={{ fontSize: big ? 12 : 11.5, fontWeight: 700, color: T.accent, marginTop: 2 }}>{tapNudge ? uzT("✋ тяни блок") : uzT("👆 тяни блок")}</div>;
  };

  if (narrow) {
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div ref={fit.colRef} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div ref={fit.chipsRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{mapHeader}</div>
            {gridEl(mobMapCell(fit.vw, level.cols))}
          </div>
          {!noPalette && (
          <div ref={fit.palRef} style={{ flexShrink: 0 }}>
            <div style={lbl}>{limits ? uzT("Блоки · лимит") : uzT("Блоки")}</div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{palette3}</div>
            {limitNote(false)}
          </div>
          )}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div style={lbl}>{programLabel}</div>
              <button type="button" onClick={() => setProgOpen((v) => !v)} className="btn-ghost" style={{ flexShrink: 0, padding: '4px 9px', fontSize: 11, minHeight: 26, borderRadius: 8, marginBottom: 5, whiteSpace: 'nowrap' }}>{progOpen ? uzT("Сократить вид") : uzT("Посмотреть всю программу")}</button>
            </div>
            <div ref={listRef} className="frame" style={{ minHeight: 210, maxHeight: progOpen ? 'none' : 244, overflowY: progOpen ? 'visible' : 'auto', display: 'flex', flexDirection: 'column', gap: 6, background: '#FBFAF7', padding: 9, boxShadow: drag ? `0 0 0 2px ${T.accent}, var(--sh-card)` : 'var(--sh-card)' }}>{listChildren}</div>
            {controlsEl}
            {/* На узком экране фидбэк раньше не показывался (наследие эталона). В 3.3 подсказка precheck —
                это САМ механизм обучения («нажми шестерёнку»), поэтому на мобиле она тоже нужна. */}
            {fb && <FeedbackNote kind={fb.ok ? 'ok' : 'soft'} text={fb.text} />}
          </div>
        </div>
        {showingAns && <AnswerOverlay solution={data.solution} onClose={() => setShowAns(false)} />}
        {dragGhost}
        {gearEl}
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'nowrap', justifyContent: 'center' }}>
        {!noPalette && (
        <div style={{ flex: '0 0 auto', width: 188, display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 12, paddingTop: 8, overflowY: 'auto' }}>
          <div style={lbl}>{limits ? uzT("Блоки · лимит") : uzT("Блоки")}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{palette3}</div>
          {limitNote(true)}
        </div>
        )}
        <div style={{ flex: '0 1 460px', minWidth: 280, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={lbl}>{programLabel}</div>
          <div ref={listRef} className="frame" style={{ flex: 1, minHeight: 60, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, background: '#FBFAF7', padding: 10, boxShadow: drag ? `0 0 0 2px ${T.accent}, var(--sh-card)` : 'var(--sh-card)' }}>{listChildren}</div>
          {controlsEl}
        </div>
        {/* Подсказка после запуска стоит ПОД картой: в колонке программы она отъедала
            место у рабочей зоны ребёнка. Мобильная ветка не трогается. */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 8, minWidth: 0 }}>
          {mapEl}
          {fb && <div style={{ width: '100%', maxWidth: 340 }}><FeedbackNote kind={fb.ok ? 'ok' : 'soft'} text={fb.text} /></div>}
        </div>
      </div>
      {showingAns && <AnswerOverlay solution={data.solution} onClose={() => setShowAns(false)} />}
      {dragGhost}
      {gearEl}
    </div>
  );
}

const LETTERS = { get 0() { return uzT("А"); }, get 1() { return uzT("Б"); }, get 2() { return uzT("В"); } }; // ленивый
function Predict({ data, speak, gesture, onSolved, solved, cell, narrow }) {
  const level = React.useMemo(() => ({ ...data.level, walls: buildWalls(data.level.cols, data.level.rows, data.level.inner || []), batteries: new Set((data.level.batteries || []).map(([c, r]) => key(c, r))) }), [data]);
  const startDir = data.startDir || 'right';
  const start = { c: level.S[0], r: level.S[1], dir: startDir };
  const [robot, setRobot] = useState(start);
  const [bet, setBet] = useState(null);
  const [phase, setPhase] = useState('bet');
  const [runIdx, setRunIdx] = useState(-1);
  const [fb, setFb] = useState(null);
  const [picked, setPicked] = useState(() => new Set());
  const runIdRef = useRef(0);
  const launch = async () => {
    if (phase !== 'bet' || bet === null) return;
    gesture(); setPhase('running'); setFb(null); setRunIdx(-1);
    const myId = ++runIdRef.current; let cur = { ...start }; const pick = new Set(); setRobot({ ...cur }); setPicked(new Set()); await sleep(300);
    for (let i = 0; i < data.program.length; i++) {
      if (myId !== runIdRef.current) return;
      setRunIdx(i);
      if (data.program[i] === 'battery') {
        // pick_battery НЕ двигает — Coddy остаётся на месте, только подбирает.
        const hk = key(cur.c, cur.r);
        if (level.batteries.has(hk) && !pick.has(hk)) { pick.add(hk); setPicked(new Set(pick)); sfx('charge'); await sleep(520); }
        else { sfx('nope'); await sleep(340); }
        continue;
      }
      const r = applyStep(cur, data.program[i], level);
      if (r.bumped) { sfx('bump'); break; }
      cur = r.next; setRobot({ ...cur }); sfx(r.turned ? 'turn' : 'step'); await sleep(r.turned ? 340 : 400);
    }
    setRunIdx(-1);
    const correct = bet === data.correctIdx;
    setPhase('done');
    setFb({ ok: correct, text: correct ? (data.win || uzT("Верно! Ты прошёл программу в голове.")) : uzT("Coddy пришёл в другую клетку — посмотри, куда именно, и попробуй ещё раз. 🙂") });
    sfx(correct ? 'win' : 'miss'); if (speak) speak(correct ? (data.win || uzT("Верно!")) : uzT("Смотри, куда пришёл Coddy, и попробуй ещё раз."));
    if (correct && !solved && onSolved) onSolved();
  };
  const again = () => { setPhase('bet'); setBet(null); setFb(null); setRunIdx(-1); setRobot({ ...start }); setPicked(new Set()); };
  const pcell = narrow ? Math.min(cell, 30) : cell;
  const mk = narrow ? 24 : 26;
  const programPanel = (
    <div style={{ flex: narrow ? '1 1 0' : '0 0 auto', width: narrow ? undefined : 168, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
      <div style={lbl}>{uzT("Программа")}</div>
      <div className="frame" style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#FBFAF7', padding: narrow ? 8 : 10, overflowY: 'auto', minHeight: 0 }}>
        <StartBlock small />
        {data.program.map((k, i) => (<ProgramBlock key={i} k={k} active={phase === 'running' && runIdx === i} />))}
      </div>
    </div>
  );
  const mapPanel = (
    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <MiniGrid level={level} robot={robot} cell={pcell} picked={picked} markers={
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {data.candidates.map(([c, r], i) => (
            <div key={i} style={{ position: 'absolute', left: c * pcell, top: r * pcell, width: pcell, height: pcell, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: mk, height: mk, borderRadius: '50%', background: bet === i ? T.accent : 'rgba(255,255,255,0.92)', color: bet === i ? '#fff' : T.ink2, border: `2px solid ${T.accent}`, fontWeight: 800, fontSize: narrow ? 13 : 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{LETTERS[i]}</span>
            </div>
          ))}
        </div>
      } />
    </div>
  );
  const variantButtons = (
    <div style={{ display: 'flex', gap: narrow ? 8 : 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {data.candidates.map((_, i) => (<button key={i} onClick={() => { if (phase === 'bet') { gesture(); setBet(i); } }} disabled={phase !== 'bet'} style={{ width: narrow ? 44 : 50, height: narrow ? 44 : 50, borderRadius: 14, border: 'none', background: bet === i ? T.accentSoft : '#fff', color: T.ink, fontWeight: 800, fontSize: narrow ? 17 : 20, cursor: phase === 'bet' ? 'pointer' : 'default', boxShadow: bet === i ? `0 0 0 2px ${T.accent}, var(--sh-card)` : 'var(--sh-card)' }}>{LETTERS[i]}</button>))}
    </div>
  );
  const actionBtn = (
    <>
      {phase === 'bet' && <button onClick={launch} disabled={bet === null} className={`btn-white-accent${bet !== null ? ' glow-ready' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: narrow ? '10px 16px' : '11px 22px', fontSize: 14, minHeight: 46 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>{uzT("Проверить ставку")}</button>}
      {phase === 'done' && !fb?.ok && <button onClick={again} className="btn-white-accent glow-ready" style={{ padding: narrow ? '10px 16px' : '11px 22px', fontSize: 14, minHeight: 46 }}>{uzT("Ещё раз")}</button>}
    </>
  );

  if (narrow) {
    // ТЕЛЕФОН: карта сверху по центру; снизу слева «Программа», справа «Сделай ставку…». Фидбэк — голосом.
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>{mapPanel}</div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8, alignItems: 'stretch' }}>
          {programPanel}
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, textAlign: 'center', lineHeight: 1.25 }}>{uzT("Сделай ставку:")}<br />{uzT("где окажется Coddy?")}</div>
            {variantButtons}
            {actionBtn}
          </div>
        </div>
      </div>
    );
  }
  // КОМПЬЮТЕР: программа слева + карта справа; варианты по центру снизу (как было)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'nowrap', justifyContent: 'center' }}>
        {programPanel}
        {mapPanel}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, textAlign: 'center' }}>{uzT("Сделай ставку: где окажется Coddy?")}</div>
        {variantButtons}
        {actionBtn}
        {fb && <div style={{ width: '100%', maxWidth: 540 }}><FeedbackNote kind={fb.ok ? 'ok' : 'soft'} text={fb.text} /></div>}
      </div>
    </div>
  );
}

// ============================================================
// Тактильные слайды
// ============================================================
function CellFrame({ children, big }) {
  return <div style={{ position: 'relative', width: big ? 120 : 96, height: big ? 120 : 96, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 45%, #F4FAFF 0%, #E2F3FD 55%, #D2EBFB 100%)', borderRadius: big ? 28 : 22, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.7), inset 0 0 0 5px rgba(150,205,240,0.22), inset 0 0 0 9px rgba(255,255,255,0.34), inset 0 0 0 11px rgba(150,205,240,0.14)' }}>{children}</div>;
}

// Маленькая «плюс»-карта для лабораторий поворота (центр + 4 направления, флажок в клетке)
function PlusGrid({ dir, flagDir, cell = 56, mood = 'happy' }) {
  const level = { cols: 3, rows: 3, F: flagDir ? [1 + DIRS[flagDir][0], 1 + DIRS[flagDir][1]] : null, walls: new Set([key(0, 0), key(2, 0), key(0, 2), key(2, 2)]) };
  return <MiniGrid level={level} robot={{ c: 1, r: 1, dir }} bump={false} cell={cell} />;
}

// P3 — поворот ≠ шаг
function TurnInPlaceLab({ gesture }) {
  const [dir, setDir] = useState('right');
  const [turns, setTurns] = useState(0);
  const [flash, setFlash] = useState(false);
  const doTurn = (t) => { gesture(); sfx('turn'); setDir((d) => (t === 'left' ? LEFT[d] : RIGHT[d])); setTurns((n) => n + 1); setFlash(true); setTimeout(() => setFlash(false), 350); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: '#EAF6FD', borderRadius: 18, padding: 18 }}>
      <MiniGrid level={{ cols: 3, rows: 3, F: null, walls: new Set() }} robot={{ c: 1, r: 1, dir }} bump={false} cell={62} />
      <div style={{ fontSize: 15, color: T.ink2 }}>{uzT("Смотрит:")} <b style={{ color: T.motion }}>{DIRRU[dir]}</b> {uzT("· шагов сделано:")} <b style={{ color: flash ? T.accent : T.green, transform: flash ? 'scale(1.3)' : 'scale(1)', display: 'inline-block', transition: 'transform .2s' }}>0</b></div>
      <div style={{ display: 'flex', gap: 10 }}>
        <TurnControl k="left" onClick={() => doTurn('left')} />
        <TurnControl k="right" onClick={() => doTurn('right')} />
      </div>
      {turns >= 2 && <div style={{ fontSize: 14, color: T.green, fontWeight: 700, textAlign: 'center' }}>{uzT("✓ Coddy повернулся, но стоит на той же клетке. Поворот — не шаг!")}</div>}
    </div>
  );
}

// Стрелки «его лево (зелёная) / его право (оранжевая)»
function LRArrows({ facing }) {
  // Стрелка орбитой вокруг центра; БЕЗ transition — мгновенно снапается вместе с Coddy
  // (иначе CSS крутит rotate длинным путём, напр. up→right через 270°).
  const R = 72;
  const arrow = (toDir, color) => (
    <div key={toDir} style={{ position: 'absolute', left: '50%', top: '50%', transformOrigin: '0 0', transform: `rotate(${ANG[toDir]}deg) translate(${R}px, -7px)`, pointerEvents: 'none' }}>
      <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: `14px solid ${color}` }} />
    </div>
  );
  return (<>{arrow(LEFT[facing], T.leftC)}{arrow(RIGHT[facing], T.rightC)}</>);
}

// P4 — относительность: «смотрит на нас (вниз) → его налево = наше право»
function RelativityLab({ gesture }) {
  const rounds = [
    { facing: 'down', target: 'right' },
    { facing: 'down', target: 'left' },
    { facing: 'up', target: 'right' },
  ];
  const [phase, setPhase] = useState('intro'); // intro (свободно крутим) -> tasks
  const [i, setI] = useState(0);
  const r = rounds[i];
  const [dir, setDir] = useState('down');
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  useEffect(() => { if (phase === 'tasks') { setDir(rounds[i].facing); setDone(false); setHint(false); } }, [i, phase]);
  const need = LEFT[r.facing] === r.target ? 'left' : 'right';
  const ourSide = (d) => (d === 'left' ? uzT("нашу левую") : d === 'right' ? uzT("нашу правую") : d === 'up' ? uzT("верхнюю") : uzT("нижнюю"));
  const freeTurn = (t) => { gesture(); sfx('turn'); setDir((d) => (t === 'left' ? LEFT[d] : RIGHT[d])); };
  const pick = (turn) => {
    if (done) return; gesture();
    const nd = turn === 'left' ? LEFT[r.facing] : RIGHT[r.facing]; setDir(nd);
    if (nd === r.target) { sfx('win'); setDone(true); setHint(false); }
    else { sfx('miss'); setHint(true); setTimeout(() => setDir(r.facing), 650); }
  };
  const next = () => setI((x) => x + 1);
  // Coddy + стрелки в просторной зоне 180×180, чтобы стрелки не лезли на текст
  const coddyArea = (showArrows, dr) => (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0', flexShrink: 0 }}>
      <CellFrame big><Coddy facing={dr} size={104} mood={done ? 'wow' : 'happy'} /></CellFrame>
      {showArrows && <LRArrows facing={dr} />}
    </div>
  );

  if (phase === 'intro') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: '#FFF1E6', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 15.5, color: T.ink, fontWeight: 700, textAlign: 'center', lineHeight: 1.55, maxWidth: 460 }}>
        {uzT("Покрути Coddy и смотри на стрелки:")}<br />
        <b style={{ color: T.leftC }}>{uzT("зелёная")}</b> {uzT("— его лево,")} <b style={{ color: T.rightC }}>{uzT("оранжевая")}</b> {uzT("— его право.")}<br />
        {uzT("Они поворачиваются вместе с ним!")}
      </div>
      {coddyArea(true, dir)}
      <div style={{ display: 'flex', gap: 10 }}>
        <TurnControl k="left" onClick={() => freeTurn('left')} />
        <TurnControl k="right" onClick={() => freeTurn('right')} />
      </div>
      <button onClick={() => { gesture(); setPhase('tasks'); setI(0); setDir('down'); setDone(false); setHint(false); }} className="btn-white-accent glow-ready" style={{ padding: '10px 18px', fontSize: 14, minHeight: 44 }}>{uzT("Понятно, попробую →")}</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: '#FFF1E6', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 15, color: T.ink, fontWeight: 700, textAlign: 'center', lineHeight: 1.5, maxWidth: 460 }}>
        {uzT("Пример")} <b>{i + 1}</b> {uzT("из")} {rounds.length}{uzT(". Coddy смотрит")} <b style={{ color: T.motion }}>{DIRRU[r.facing]}</b>.<br />{uzT("Поверни его в сторону")} <b style={{ color: T.accent }}>{DIRRU[r.target]} {r.target === 'right' ? '→' : r.target === 'left' ? '←' : r.target === 'up' ? '↑' : '↓'}</b>.
      </div>
      {coddyArea(!done, dir)}
      {!done ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <TurnControl k="left" onClick={() => pick('left')} />
          <TurnControl k="right" onClick={() => pick('right')} />
        </div>
      ) : (<>
        <div style={{ fontSize: 14.5, color: T.green, fontWeight: 700, textAlign: 'center', maxWidth: 470, lineHeight: 1.45 }}>
          ✓ {r.facing === 'down'
            ? `Coddy смотрел на нас. Он повернул «${need === 'left' ? 'turn left' : 'turn right'}» — и оказался лицом в ${ourSide(r.target)} сторону. Когда смотрит вниз, его лево = наше право!`
            : `Когда Coddy смотрит вверх (от нас), его «${need === 'left' ? 'turn left' : 'turn right'}» совпадает с нашей стороной.`}
        </div>
        {i < rounds.length - 1 && <button onClick={next} className="btn-white-accent glow-ready" style={{ padding: '10px 18px', fontSize: 14, minHeight: 44 }}>{uzT("Ещё пример")}</button>}
      </>)}
    </div>
  );
}

// P5 — ситуативные тесты: поверни Coddy к флажку. Неверно → возврат в исходное + подсказка.
function SituationLab({ gesture, onSolved, solved, narrow }) {
  const rounds = [
    { facing: 'right', flag: 'up' },
    { facing: 'right', flag: 'down' },
    { facing: 'up', flag: 'right' },
    { facing: 'down', flag: 'right' },
    { facing: 'left', flag: 'down' },
  ];
  const [i, setI] = useState(0);
  const r = rounds[i];
  const [dir, setDir] = useState(r.facing);
  const [done, setDone] = useState(false);
  const last = i === rounds.length - 1;
  useEffect(() => { setDir(rounds[i].facing); setDone(false); }, [i]);
  const need = LEFT[r.facing] === r.flag ? 'left' : 'right';
  const pick = (turn) => {
    if (done) return; gesture();
    const nd = turn === 'left' ? LEFT[r.facing] : RIGHT[r.facing]; setDir(nd);
    if (nd === r.flag) { sfx('win'); setDone(true); if (last && !solved && onSolved) onSolved(); }
    else { sfx('miss'); setTimeout(() => setDir(r.facing), 650); }   // ошибся → звук + возврат на место (без подсказки)
  };
  const next = () => { if (!last) setI((x) => x + 1); };
  const solvedCount = i + (done ? 1 : 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 8 : 12, background: '#EAF6FD', borderRadius: 18, padding: narrow ? 12 : 16 }}>
      <div style={{ fontSize: 14.5, color: T.ink, fontWeight: 700, textAlign: 'center' }}>{uzT("Пример")} <b>{i + 1}</b> {uzT("из")} {rounds.length}{uzT(": поверни Coddy к флажку.")}</div>
      <div style={{ display: 'flex', gap: 6 }}>{rounds.map((_, k) => (<span key={k} style={{ width: 16, height: 6, borderRadius: 99, background: k < solvedCount ? T.green : k === i ? T.accent : '#D7E3EC' }} />))}</div>
      <PlusGrid dir={dir} flagDir={r.flag} cell={narrow ? 44 : 54} mood={done ? 'wow' : 'happy'} />
      {!done ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <TurnControl k="left" onClick={() => pick('left')} />
          <TurnControl k="right" onClick={() => pick('right')} />
        </div>
      ) : last ? (
        <div style={{ fontSize: 15, color: T.green, fontWeight: 800, textAlign: 'center', maxWidth: 470 }}>{uzT("🎉 Отлично! Ты прошёл все 5 примеров и усвоил повороты. Нажми «Дальше».")}</div>
      ) : (<>
        <div style={{ fontSize: 14.5, color: T.green, fontWeight: 700, textAlign: 'center' }}>{uzT("✓ Coddy смотрит на флажок! Нужен был «")}{need === 'left' ? 'turn left' : 'turn right'}».</div>
        <button onClick={next} className="btn-white-accent glow-ready" style={{ padding: '10px 18px', fontSize: 14, minHeight: 44 }}>{uzT("Следующий пример →")}</button>
      </>)}
    </div>
  );
}

// P6 — разворот 180° на мини-карте (флажок в клетке позади)
function Turn180Lab({ gesture, speak, onSolved, solved }) {
  const level = { cols: 3, rows: 3, F: [0, 1], walls: new Set([key(0, 0), key(1, 0), key(2, 0), key(0, 2), key(1, 2), key(2, 2)]) };
  const [dir, setDir] = useState('right'); const [n, setN] = useState(0);
  const done = dir === 'left';
  const turn = (t) => {
    if (done) return; gesture(); sfx('turn');
    const nd = t === 'left' ? LEFT[dir] : RIGHT[dir]; setDir(nd); setN((x) => x + 1);
    if (nd === 'left') { sfx('win'); if (!solved && onSolved) onSolved(); if (speak) speak(uzT("Поздравляю! Теперь ты умеешь делать разворот.")); }
  };
  const reset = () => { setDir('right'); setN(0); };
  const chip = (k) => (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: T.motion, color: '#fff', padding: '3px 7px', borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${T.motionDk}`, fontSize: 11.5, fontWeight: 800, verticalAlign: 'middle' }}><BlockIcon k={k} />{BLOCK_DEF[k].label}</span>);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: '#EAF6FD', borderRadius: 18, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 7, fontSize: 13, fontWeight: 800, color: T.ink2 }}>
        2× {chip('right')} = 2× {chip('left')} {uzT("= разворот 180°")}
      </div>
      <div style={{ fontSize: 15, color: T.ink, fontWeight: 700, textAlign: 'center' }}>{uzT("Флажок")} <b style={{ color: T.accent }}>{uzT("позади")}</b> {uzT("Coddy. Разверни его к флажку!")}</div>
      <MiniGrid level={level} robot={{ c: 2, r: 1, dir }} bump={false} cell={54} />
      {!done ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <TurnControl k="left" onClick={() => turn('left')} />
          <TurnControl k="right" onClick={() => turn('right')} />
        </div>
      ) : (<>
        <div style={{ fontSize: 14.5, color: T.green, fontWeight: 700, textAlign: 'center', maxWidth: 440, lineHeight: 1.45 }}>{uzT("✓ Развернулся за")} {n} {n >= 2 && n <= 4 ? uzT("поворота") : uzT("поворотов")}!<br />{uzT("Назад = два поворота в одну сторону = 180°.")}</div>
        <button onClick={reset} className="btn-white-accent glow-ready" style={{ padding: '10px 18px', fontSize: 14, minHeight: 44 }}>{uzT("Ещё раз")}</button>
      </>)}
      {!done && n > 0 && <div style={{ fontSize: 13, color: T.ink2 }}>{uzT("Сейчас смотрит:")} {DIRRU[dir]}</div>}
    </div>
  );
}

// L (1.4) — BatteryLab: тактильное знакомство с pick_battery.
// Учит трём правилам: (1) pick_battery НЕ двигает; (2) брать можно только стоя НА батарейке;
// (3) сначала дойди (move), потом подбери (pick battery). Гейтит «Дальше»: solved при сборе.
function BatteryLab({ gesture, speak, onSolved, solved, narrow }) {
  const COLS = 5, ROWS = 3, BAT = [3, 1];
  const level = React.useMemo(() => ({ cols: COLS, rows: ROWS, F: null, walls: buildWalls(COLS, ROWS), batteries: new Set([key(BAT[0], BAT[1])]) }), []);
  const start = { c: 1, r: 1, dir: 'right' };
  const [robot, setRobot] = useState(start);
  const [got, setGot] = useState(false);
  const [msg, setMsg] = useState(null); // { t, ok }
  const pcell = narrow ? 46 : 58;
  const onBattery = robot.c === BAT[0] && robot.r === BAT[1];
  const move = () => {
    if (got) return; gesture();
    const r = applyStep(robot, 'move', level);
    if (r.bumped) { sfx('bump'); setMsg({ t: uzT("Дальше стена — Coddy уже прошёл дорожку. Нажми pick battery, если он на батарейке!"), ok: false }); return; }
    setRobot(r.next); sfx('step'); setMsg(null);
  };
  const pick = () => {
    if (got) return; gesture();
    if (onBattery) { setGot(true); sfx('charge'); setMsg({ t: uzT("✓ Есть заряд! Coddy стоял НА батарейке — pick battery сработал."), ok: true }); if (!solved && onSolved) onSolved(); if (speak) speak(uzT("Отлично! Coddy стоял на батарейке и подобрал её. Теперь ты знаешь главное правило.")); }
    else { sfx('nope'); setMsg({ t: uzT("Coddy не на батарейке! pick battery работает только на её клетке. Сначала дойди до неё блоком move."), ok: false }); }
  };
  const reset = () => { gesture(); setRobot(start); setGot(false); setMsg(null); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 8 : 12, background: '#EAF6FD', borderRadius: 18, padding: narrow ? 12 : 16 }}>
      <div style={{ fontSize: narrow ? 13.5 : 14.5, color: T.ink, fontWeight: 700, textAlign: 'center', maxWidth: 500, lineHeight: 1.4 }}>
        {uzT("Доведи Coddy до батарейки блоком")} <b style={{ color: T.motion }}>move</b>{uzT(", а потом нажми")} <b style={{ color: T.actionDk }}>pick battery</b>{uzT(". Помни: pick battery подбирает, но")} <b>{uzT("не двигает")}</b>!
      </div>
      <MiniGrid level={level} robot={robot} bump={false} cell={pcell} picked={got ? new Set([key(BAT[0], BAT[1])]) : new Set()} charge={{ got: got ? 1 : 0, req: 1 }} />
      {!got ? (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TurnControl k="move" onClick={move} />
          <TurnControl k="battery" onClick={pick} />
        </div>
      ) : (
        <button onClick={reset} className="btn-white-accent glow-ready" style={{ padding: '10px 18px', fontSize: 14, minHeight: 44 }}>{uzT("Ещё раз")}</button>
      )}
      {msg && <div style={{ fontSize: narrow ? 13 : 14, color: msg.ok ? T.green : T.accentDk, fontWeight: 700, textAlign: 'center', maxWidth: 500, lineHeight: 1.4 }}>{msg.t}</div>}
    </div>
  );
}

// ============================================================
// CompareLab — «глупое vs умное»: проиграй обе программы на ОДНОЙ карте и выбери умную.
// Учит концепту оптимизации (один результат — два пути; короче = умнее). Гейтит «Дальше».
// ============================================================
function CompareLab({ data, speak, gesture, onSolved, solved, narrow, cell }) {
  const level = React.useMemo(() => ({ ...data.level, walls: buildWalls(data.level.cols, data.level.rows, data.level.inner || []), batteries: new Set((data.level.batteries || []).map(([c, r]) => key(c, r))), reqBatteries: data.level.reqBatteries || 0 }), [data]);
  const start = { c: level.S[0], r: level.S[1], dir: 'right' };
  const [robot, setRobot] = useState(start);
  const [picked, setPicked] = useState(() => new Set());
  const [which, setWhich] = useState(null);
  const [runIdx, setRunIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState({ long: false, short: false });
  const [choice, setChoice] = useState(null);
  const runIdRef = useRef(0);
  const longN = data.long.length, shortN = data.short.length, saved = longN - shortN;
  const bothSeen = seen.long && seen.short;
  const prog = which === 'long' ? data.long : which === 'short' ? data.short : [];

  const play = async (kind) => {
    if (playing) return; gesture();
    runIdRef.current++; const myId = runIdRef.current;
    setWhich(kind); setPlaying(true); setRunIdx(-1); setChoice(null);
    const steps = kind === 'long' ? data.long : data.short;
    let cur = { ...start }; const pick = new Set(); setRobot({ ...cur }); setPicked(new Set()); await sleep(280);
    const fast = steps.length > 12 ? 0.7 : 1;
    for (let i = 0; i < steps.length; i++) {
      if (myId !== runIdRef.current) return;
      setRunIdx(i);
      if (steps[i] === 'battery') { const hk = key(cur.c, cur.r); if (level.batteries.has(hk) && !pick.has(hk)) { pick.add(hk); setPicked(new Set(pick)); sfx('charge'); await sleep(360 * fast); } else { sfx('nope'); await sleep(220); } continue; }
      const r = applyStep(cur, steps[i], level); if (r.bumped) { sfx('bump'); break; }
      cur = r.next; setRobot({ ...cur }); sfx(r.turned ? 'turn' : 'step'); await sleep((r.turned ? 300 : 340) * fast);
    }
    if (myId !== runIdRef.current) return;
    setRunIdx(-1); setPlaying(false); sfx('win'); setSeen((s) => ({ ...s, [kind]: true }));
  };
  const choose = (kind) => {
    if (playing) return; gesture(); setChoice(kind);
    if (kind === 'short') { sfx('win'); if (!solved && onSolved) onSolved(); if (speak) speak(data.win || uzT("Верно! Короткая программа умнее.")); }
    else { sfx('miss'); if (speak) speak(uzT("Длинная делает то же самое, но тратит куда больше блоков. Короче — значит умнее. Выбери короткую!")); }
  };

  const playBtn = (kind, label, n, color) => (
    <button key={kind} onClick={() => play(kind)} disabled={playing} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: narrow ? '9px 12px' : '10px 16px', borderRadius: 12, border: `2px solid ${color}`, background: which === kind ? color : '#fff', color: which === kind ? '#fff' : color, fontWeight: 800, fontSize: narrow ? 13 : 14, cursor: playing ? 'default' : 'pointer', opacity: playing && which !== kind ? 0.5 : 1, minHeight: 44 }}>
      {label} <span style={{ opacity: 0.85, fontWeight: 700 }}>· {n}{seen[kind] ? ' ✓' : ''}</span>
    </button>
  );
  const buttons = (<div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>{playBtn('long', uzT("🐢 Длинная"), longN, T.ink2)}{playBtn('short', uzT("🚀 Короткая"), shortN, T.greenDk)}</div>);
  const mapEl = <MiniGrid level={level} robot={robot} cell={narrow ? Math.min(cell, 30) : cell} picked={picked} charge={level.reqBatteries ? { got: picked.size, req: level.reqBatteries } : null} />;
  const progPanel = which ? (
    <div className="frame" style={{ flex: '0 0 auto', width: 168, display: 'flex', flexDirection: 'column', gap: 5, padding: 10, background: '#FBFAF7', maxHeight: 250, overflowY: 'auto' }}>
      <div style={{ ...lbl, marginBottom: 2 }}>{which === 'long' ? uzT("🐢 Длинная программа") : uzT("🚀 Короткая программа")}</div>
      <StartBlock small />
      {prog.map((k, i) => <ProgramBlock key={i} k={k} active={playing && runIdx === i} />)}
    </div>
  ) : <div style={{ flex: '0 0 auto', width: 168 }} />;
  const compareBar = bothSeen ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: narrow ? 8 : 14, flexWrap: 'wrap', fontWeight: 800, fontSize: narrow ? 13.5 : 15.5 }}>
      <span style={{ color: T.ink2 }}>🐢 {longN}</span><span style={{ color: T.ink3 }}>→</span><span style={{ color: T.greenDk }}>🚀 {shortN}</span><span style={{ color: T.accent }}>{uzT("· короче на")} {saved}!</span>
    </div>
  ) : (<div style={{ fontSize: narrow ? 12.5 : 13.5, color: T.ink3, fontWeight: 700, textAlign: 'center' }}>{uzT("Запусти обе программы ▶")}</div>);
  const question = bothSeen ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: narrow ? 13.5 : 15, fontWeight: 800, color: T.ink }}>{uzT("Какая программа умнее?")}</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => choose('long')} disabled={choice === 'short'} style={{ padding: '9px 15px', borderRadius: 12, border: `2px solid ${choice === 'long' ? T.red : '#DCE5EC'}`, background: choice === 'long' ? T.redSoft : '#fff', color: T.ink, fontWeight: 800, fontSize: 14, cursor: 'pointer', minHeight: 44 }}>{uzT("🐢 Длинная")}</button>
        <button onClick={() => choose('short')} style={{ padding: '9px 15px', borderRadius: 12, border: `2px solid ${choice === 'short' ? T.green : '#DCE5EC'}`, background: choice === 'short' ? T.greenSoft : '#fff', color: T.ink, fontWeight: 800, fontSize: 14, cursor: 'pointer', minHeight: 44 }}>{uzT("🚀 Короткая")}</button>
      </div>
      {choice && <div role="status" aria-live="polite" style={{ fontSize: narrow ? 13 : 14, fontWeight: 700, textAlign: 'center', color: choice === 'short' ? T.green : T.accentDk, maxWidth: 460, lineHeight: 1.4 }}>{choice === 'short' ? uzT("✓ Верно! Короче — значит умнее.") : uzT("Короче — значит умнее. Выбери короткую!")}</div>}
    </div>
  ) : null;

  if (narrow) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>{mapEl}</div>
        <div style={{ flexShrink: 0 }}>{buttons}</div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, width: '100%' }}>{compareBar}{question}</div>
      </div>
    );
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 14, alignItems: 'flex-start', justifyContent: 'center' }}>{progPanel}{mapEl}</div>
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{buttons}{compareBar}{question}</div>
    </div>
  );
}

// ============================================================
// P1 Hook — Coddy прошёлся и заметил: его СЛЕДЫ нарисовали почти целый квадрат!
// «Я могу рисовать движением?!» — восторг, просьба научить рисовать фигуры.
// ============================================================
// HOOK 2.6 — Coddy смотрит на ДВЕ разные карты: слева одинокая батарейка, справа — ЦЕПОЧКА.
// Догадка: ситуации разные — а у меня есть While и Until. Как выбрать?
// HOOK 3.1 — Coddy весело шёл по карте и ВПЕРВЫЕ наступил на вирус: вспышка, одно сердечко гаснет.
// Coddy в шоке просит помощи. Единственный экран с речью Coddy (дальше — Ментор).
// HOOK 3.2 — Coddy устал ПЛАНИРОВАТЬ ВРУЧНУЮ: он расписал маршрут по клеточкам, а карта взяла и поменялась —
// и весь план сразу стал негодным. Единственный экран с речью Coddy (дальше — Ментор).
// HOOK 3.3 — Coddy вертит в лапах свой блок If из прошлого урока и вдруг замечает на нём ШЕСТЕРЁНКУ.
// Нажимает — открывается окошко с двумя незнакомыми деталями: else и else if. Блок ВЫРАСТАЕТ.
// Единственный экран с речью Coddy (дальше — Ментор).
// HOOK 3.4 — Coddy с программой из 3.3 (шестерёнка уже есть!) заходит в лабиринт… и врезается в стену.
// Он умеет ВЫБИРАТЬ — но не умеет ВИДЕТЬ, где поворот. В финале сцены у него включаются два боковых
// «глаза»: слева стена, а СПРАВА открыто. Это ровно те индикаторы, что живут на карте весь урок.
// Единственный экран с речью Coddy (дальше — Ментор).
function HookScene({ gesture, cell }) {
  // (0) идёт по коридору → (1) дошёл до угла → (2) БАМ! впереди стена → (3) включились ГЛАЗА пути
  const [phase, setPhase] = useState(0);
  const timers = useRef([]);
  const play = useCallback((withSfx) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase(0);
    const k = MOTION.d ? 1 : 0;
    timers.current.push(setTimeout(() => { setPhase(1); if (withSfx) sfx('step'); }, 800 * k));
    timers.current.push(setTimeout(() => { setPhase(2); if (withSfx) sfx('bump'); }, 1900 * k));
    timers.current.push(setTimeout(() => { setPhase(3); if (withSfx) sfx('sense'); }, 3100 * k));
  }, []);
  useEffect(() => { play(false); return () => timers.current.forEach(clearTimeout); }, [play]);
  const replay = () => { gesture(); play(true); };

  // маленький Г-лабиринт: коридор вправо, потом поворот вниз к флажку
  const level = React.useMemo(() => ({
    cols: 6, rows: 5, S: [1, 1], F: [3, 3],
    walls: buildWalls(6, 5, mazeInner(6, 5, path(seg(1, 1, 3, 1), seg(3, 1, 3, 3)))),
  }), []);
  const cs = clamp(Math.round(cell * 0.78), 26, 40);
  const robot = phase === 0 ? { c: 1, r: 1, dir: 'right' } : { c: 3, r: 1, dir: 'right' };
  const IF = T_IF.bg, IFD = T_IF.dk;

  const caption = phase === 0 ? uzT("иду по коридору…")
    : phase === 1 ? uzT("а дальше куда?")
      : phase === 2 ? uzT("💥 стена! программа не знала…")
        : uzT("⬅ слева стена · ➡ СПРАВА ОТКРЫТО!");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', justifyContent: 'center', minHeight: 26 }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.06em', color: T.ink3, textTransform: 'uppercase' }}>{uzT("Лабиринт Coddy:")}</span>
        <span className={phase === 3 ? 'cx-pop' : undefined} style={{ fontSize: 12.5, fontWeight: 900, color: phase === 3 ? T.green : phase === 2 ? T.accentDk : T.ink3, background: phase === 3 ? T.greenSoft : phase === 2 ? T.accentSoft : 'transparent', borderRadius: 99, padding: '3px 10px', transition: 'color .25s, background .25s' }}>{caption}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center', padding: '12px 16px', borderRadius: 16, background: '#EFE8F5', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.65)' }}>
        {/* карта: Coddy доходит до угла, упирается — и на 3-й фазе у него загораются глаза */}
        <MiniGrid level={level} robot={robot} bump={phase === 2} cell={cs} paths={phase === 3} probe={phase === 3 ? 'right' : null} />

        {/* его программа из прошлого урока — шестерёнка есть, а глаз нет */}
        <div style={{ minWidth: 158 }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '.07em', color: T.ink3, textTransform: 'uppercase', marginBottom: 6 }}>{uzT("Моя программа из 3.3")}</div>
          <div style={{ borderRadius: 12, background: `${IF}14`, boxShadow: `inset 0 0 0 1.5px ${IF}40`, padding: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: IF, color: '#fff', borderRadius: 9, padding: '5px 9px', minHeight: 30, boxShadow: 'inset 0 0 0 1.5px ' + IFD, fontSize: 12.5, fontWeight: 800 }}>
              <BlockIcon k="if" /><span>if</span>
              <span className={phase >= 2 ? 'cx-buzz' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: 'rgba(14,14,16,0.28)', ...HEX_ONLY, fontSize: 10.5, fontWeight: 900 }}>???</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 7, background: 'rgba(255,255,255,0.95)' }}><GearIcon size={13} color={IFD} /></span>
            </div>
            <div style={{ marginLeft: 12, borderLeft: `4px solid ${IF}`, borderBottomLeftRadius: 8, paddingLeft: 8, paddingTop: 5, paddingBottom: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.motion, color: '#fff', padding: '5px 9px', borderRadius: 9, boxShadow: `inset 0 0 0 1.5px ${T.motionDk}`, fontSize: 12, fontWeight: 700 }}><BlockIcon k="right" />turn right</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: IF, color: '#fff', borderRadius: 9, padding: '5px 9px', minHeight: 28, boxShadow: 'inset 0 0 0 1.5px ' + IFD, fontSize: 12.5, fontWeight: 800, marginTop: 5 }}>
              <BlockIcon k="else" /><span>else</span>
            </div>
            <div style={{ marginLeft: 12, borderLeft: `4px solid ${IF}`, borderBottomLeftRadius: 8, paddingLeft: 8, paddingTop: 5, paddingBottom: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.motion, color: '#fff', padding: '5px 9px', borderRadius: 9, boxShadow: `inset 0 0 0 1.5px ${T.motionDk}`, fontSize: 12, fontWeight: 700 }}><BlockIcon k="move" />move</span>
            </div>
          </div>
          <div style={{ marginTop: 7, fontSize: 11, fontWeight: 800, color: phase >= 2 ? T.accentDk : T.ink3, lineHeight: 1.3, transition: 'color .25s' }}>
            {phase >= 2 ? uzT("Ветки есть… а ВОПРОСА нет! Чем спросить про поворот?") : uzT("Ветки на месте — шестерёнка работает.")}
          </div>
        </div>
      </div>

      <div className="mentor mentor-coddy" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 520 }}>
        <span className="cx-buzz" style={{ fontSize: 22, lineHeight: 1, display: 'inline-block' }}>{phase === 3 ? '🤩' : '😣'}</span>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: T.ink2 }}>
          {phase === 3
            ? uzT("Вот бы у меня были ГЛАЗА в стороны — слева открыто? справа открыто? Я бы сам находил повороты!")
            : uzT("Я умею ВЫБИРАТЬ ветку… но как программа узнает, что впереди ПОВОРОТ?!")}
        </span>
      </div>
      <button onClick={replay} className="btn-white-accent glow-ready" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 14.5, minHeight: 44 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
        {uzT("Показать ещё раз")}
      </button>
    </div>
  );
}

function blkPath(x, y, w, h, notch) {
  const r = 5, nx = x + 16, nw = 12, nd = 4.5;
  let d = `M${x + r},${y}`;
  if (notch) d += `H${nx}l3,${nd}h${nw - 6}l3,${-nd}`;
  d += `H${x + w - r}q${r},0 ${r},${r}V${y + h - r}q0,${r} ${-r},${r}H${nx + nw}l-3,${nd}h${-(nw - 6)}l-3,${-nd}H${x + r}q${-r},0 ${-r},${-r}V${y + r}q0,${-r} ${r},${-r}Z`;
  return d;
}

// ============================================================
// Экран 2 — комикс «Опасный мир». Каждый кадр ДВИГАЕТСЯ ровно по своей мысли:
//   0) Coddy шагает на вирус → вспышка, сердечко гаснет, но он ОСТАЁТСЯ на клетке (вирус ≠ стена);
//   1) три сердечка бьются, Coddy ОБХОДИТ вирус верхом по зелёному маршруту — жизни целы;
//   2) блок take shield вспыхивает на голубой клетке → у Coddy загорается аура → он проходит
//      СКВОЗЬ вирус (вирус гаснет, искры «крак»), аура пропадает — щит израсходован;
//   3) два вируса — два блока take shield: аура зажигается ДВАЖДЫ, перед каждым вирусом.
// Всё рисуется китом CX (CxStage/CxCoddy/CxTile) в кадре 200x130; подпись кадра — в шапке.
// ============================================================
// Кадр комикса: сцена (только арт) + подписи ОБЫЧНЫМ текстом под ней.
// Текст в HTML переносится по словам и масштабируется — в отличие от <text> внутри SVG,
// который стоит по фиксированным координатам и потому налезал на соседние элементы.
function CxFrame({ title, notes = [], children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: '100%', minWidth: 0 }}>
      {children}
      {title && <div style={{ fontSize: 'clamp(12px, 1.55vw, 15px)', fontWeight: 800, color: T.ink, textAlign: 'center', maxWidth: 620, lineHeight: 1.25, textWrap: 'balance' }}>{title}</div>}
      {notes.filter(Boolean).map((n, i) => (
        <div key={i} style={{ fontSize: 'clamp(10.5px, 1.25vw, 12.5px)', fontWeight: 700, color: T.ink2, textAlign: 'center', maxWidth: 620, lineHeight: 1.3, textWrap: 'balance' }}>{n}</div>
      ))}
    </div>
  );
}

function ComicScene({ idx }) {
  const VB = '0 0 200 130';
  const svgStyle = { width: '100%', maxWidth: 620, maxHeight: 'min(40vh, 330px)', display: 'block' };
  const IF = T_IF.bg, IFD = T_IF.dk;
  const PTH = T_PATH.bg, PTHD = T_PATH.dk;
  const GR = T.green, GREY = '#8D9AA8';
  // одна «ветка» блока: цветная шапка + створка тела (тот же приём, что в комиксе 3.3)
  const branchRow = (x, y, w, label, fill, dk, bodyLabel, bodyFill, bodyDk) => (
    <g>
      <rect x={x} y={y} width={w} height="11.5" rx="4" fill={fill} stroke={dk} strokeWidth="1" />
      <text x={x + 5.5} y={y + 8.2} fontSize="7" fontWeight="900" fill="#FFFFFF">{label}</text>
      <rect x={x + 3.5} y={y + 11.5} width="2.6" height="9" rx="1.3" fill={dk} />
    </g>
  );
  // «пузырь ответа»: ДА (зелёный) / нет (серый)
  const answer = (x, y, text, col, className, style) => (
    <g className={className} style={style}>
      <rect x={x} y={y} width={text.length > 3 ? 28 : 22} height="14" rx="7" fill={col} />
      <text x={x + (text.length > 3 ? 14 : 11)} y={y + 10.2} fontSize="8" fontWeight="900" fill="#FFFFFF" textAnchor="middle">{text}</text>
    </g>
  );
  // «глаз пути» кружком — ровно тот индикатор, что светится у Coddy на карте
  const eye = (cx, cy, dirDeg, open, r = 7, className, style) => (
    <g className={className} style={style}>
      <circle cx={cx} cy={cy} r={r} fill={open ? '#FFFFFF' : '#E4E9EE'} stroke={open ? GR : GREY} strokeWidth="1.6" />
      <g transform={`rotate(${dirDeg} ${cx} ${cy})`}>
        {open
          ? <path d={`M${cx - r * 0.55} ${cy} h${r * 0.95} M${cx + r * 0.1} ${cy - r * 0.45} l${r * 0.45} ${r * 0.45} l${-r * 0.45} ${r * 0.45}`} fill="none" stroke={GR} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          : <><path d={`M${cx - r * 0.6} ${cy} h${r * 0.6}`} fill="none" stroke={GREY} strokeWidth="1.7" strokeLinecap="round" /><path d={`M${cx + r * 0.35} ${cy - r * 0.55} v${r * 1.1}`} fill="none" stroke={GREY} strokeWidth="2" strokeLinecap="round" /></>}
      </g>
    </g>
  );

  // Кадр 0 — «Два новых глаза»: Coddy на углу. Впереди стена, слева стена, а СПРАВА открыто.
  if (idx === 0) {
    const D = '4.2s';
    const s = 21, x0 = 106, yT = 26, yM = 47, yB = 68;
    const cx = (i) => x0 + i * s;
    return (
      <CxFrame title={uzT("Два новых ГЛАЗА — влево и вправо")} notes={[uzT("смотрят ОТ Coddy — как turn left и turn right"), uzT("открыто = там не стена, туда можно шагнуть")]}>
<svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Два новых сенсора: путь слева и путь справа. Слева стена, справа открыто")}>
        <CxDefs />
        <CxStage floor={false} />

        {/* карта-угол: верхний ряд стена, средний — коридор, снизу открыт поворот */}
        {[0, 1, 2, 3].map((i) => <CxTile key={'t' + i} x={cx(i)} y={yT} s={s} wall />)}
        {[0, 1, 2].map((i) => <CxTile key={'m' + i} x={cx(i)} y={yM} s={s} />)}
        <CxTile x={cx(3)} y={yM} s={s} wall />
        {[0, 1].map((i) => <CxTile key={'b' + i} x={cx(i)} y={yB} s={s} wall />)}
        <CxTile x={cx(2)} y={yB} s={s} />
        <CxTile x={cx(3)} y={yB} s={s} wall />
        <CxCoddy x={cx(2) + 2} y={yM + 1} size={18} facing="right" />
        {/* глаза: вверх — стена, вниз — открыто (мигает) */}
        {eye(cx(2) + s / 2, yM - 3, 270, false)}
        {eye(cx(2) + s / 2, yB + 1, 90, true, 7, 'cx-beat')}
        <CxSpark className="cx-seq" style={{ '--d': '1.9s', '--dur': D }} x={cx(2) + s - 4} y={yB + 8} s={9} color={GR} />

        {/* сами блоки-сенсоры и их ответы */}
        <g className="cx-seq" style={{ '--d': '0.5s', '--dur': D }}>
          <rect x="8" y="42" width="62" height="15" rx="5" fill={PTHD} />
          <rect x="8" y="40.5" width="62" height="15" rx="5" fill={PTH} />
          <text x="39" y="51" fontSize="7.4" fontWeight="900" fill="#FFFFFF" textAnchor="middle">⬅ path to left?</text>
          {answer(72, 41, uzT("нет"), GREY)}
        </g>
        <g className="cx-seq" style={{ '--d': '1.6s', '--dur': D }}>
          <rect x="8" y="68" width="62" height="15" rx="5" fill={PTHD} />
          <rect x="8" y="66.5" width="62" height="15" rx="5" fill={PTH} />
          <text x="39" y="77" fontSize="7.4" fontWeight="900" fill="#FFFFFF" textAnchor="middle">➡ path to right?</text>
          {answer(72, 67, uzT("ДА!"), GR)}
        </g>
      </svg>
      </CxFrame>
    );
  }

  // Кадр 1 — «Глаз вставляем в шестерёнку»: сенсор летит в окошко-условие блока If из 3.3.
  if (idx === 1) {
    const D = '4.4s';
    return (
      <CxFrame title={uzT("Глаз вставляем в ШЕСТЕРЁНКУ")} notes={[uzT("ветки из 3.3 наконец получили ВОПРОСЫ")]}>
<svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Сенсор пути вставляется в окошко условия блока If")}>
        <CxDefs />
        <CxStage floor={false} />

        {/* блок из прошлого урока: ветки есть, окошко пустое */}
        {branchRow(24, 26, 116, 'if', IF, IFD, 'turn left  +  move', T.motion, T.motionDk)}
        {branchRow(24, 56, 116, 'else if', IF, IFD, 'turn right  +  move', T.motion, T.motionDk)}
        {branchRow(24, 86, 116, 'else', IF, IFD, 'move', T.motion, T.motionDk)}
        {/* пустые окошки-условия (белая рамка) */}
        <rect x="36" y="28" width="34" height="8" rx="3.4" fill="#FFFFFF" opacity="0.28" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2.4 2" />
        <rect x="52" y="58" width="34" height="8" rx="3.4" fill="#FFFFFF" opacity="0.28" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2.4 2" />

        {/* ⬅ прилетает в первое окошко */}
        <g className="cx-travel" style={{ '--x0': '18px', '--y0': '62px', '--x1': '0px', '--y1': '0px', '--dur': '1.5s' }}>
          <rect x="36" y="27.4" width="34" height="9.4" rx="3.6" fill={PTHD} />
          <rect x="36" y="26.6" width="34" height="9.4" rx="3.6" fill={PTH} />
          <text x="53" y="33.6" fontSize="6.4" fontWeight="900" fill="#FFFFFF" textAnchor="middle">⬅ path to left?</text>
        </g>
        {/* ➡ прилетает во второе */}
        <g className="cx-travel" style={{ '--x0': '20px', '--y0': '46px', '--x1': '0px', '--y1': '0px', '--dur': '1.5s', '--d': '0.8s' }}>
          <rect x="52" y="57.4" width="34" height="9.4" rx="3.6" fill={PTHD} />
          <rect x="52" y="56.6" width="34" height="9.4" rx="3.6" fill={PTH} />
          <text x="69" y="63.6" fontSize="6.4" fontWeight="900" fill="#FFFFFF" textAnchor="middle">➡ path to right?</text>
        </g>
        <CxSpark className="cx-seq" style={{ '--d': '1.5s', '--dur': D }} x={146} y={26} s={10} color={PTH} />
        <CxSpark className="cx-seq" style={{ '--d': '2.3s', '--dur': D }} x={146} y={56} s={10} color={PTH} />
        <text x="172" y="45" fontSize="7" fontWeight="900" fill={T.ink3} textAnchor="middle">{uzT("у каждой")}</text>
        <text x="172" y="54" fontSize="7" fontWeight="900" fill={T.ink3} textAnchor="middle">{uzT("ветки —")}</text>
        <text x="172" y="63" fontSize="7" fontWeight="900" fill={IFD} textAnchor="middle">{uzT("свой вопрос")}</text>
      </svg>
      </CxFrame>
    );
  }

  // Кадр 2 — «Универсальный навигатор»: читаем сверху вниз, срабатывает первая ветка, move — в каждой.
  if (idx === 2) {
    const D = '4.8s';
    const rows = [
      { y: 26, n: '1', cond: 'if  ⬅ path to left?', act: 'turn left + move', d: '0.4s' },
      { y: 56, n: '2', cond: uzT("else if  ➡ справа?"), act: 'turn right + move', d: '1.7s' },
      { y: 86, n: '3', cond: 'else', act: 'move', d: '3.0s' },
    ];
    return (
      <CxFrame title={uzT("УНИВЕРСАЛЬНЫЙ НАВИГАТОР")} notes={[uzT("за круг Coddy делает РОВНО ОДНУ ветку — и ровно один шаг")]}>
<svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Универсальный навигатор: три ветки по порядку, в каждой есть move")}>
        <CxDefs />
        <CxStage floor={false} />
        {rows.map((r) => (
          <g key={r.n}>
            <text x="10" y={r.y + 9} fontSize="8.4" fontWeight="900" fill={T.ink3}>{r.n}</text>
            {branchRow(18, r.y, 124, r.cond, IF, IFD, r.act, T.motion, T.motionDk)}
            <g className="cx-seq" style={{ '--d': r.d, '--dur': D }}>
              <circle cx="152" cy={r.y + 15} r="6.6" fill={GR} />
              <path d={`M${149} ${r.y + 15} l2.4 2.6 l4.4 -5.2`} fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="176" y={r.y + 18} fontSize="6.6" fontWeight="900" fill={T.motionDk} textAnchor="middle">{uzT("есть move")}</text>
            </g>
          </g>
        ))}
        {/* рамка «сейчас проверяем» едет сверху вниз: 1 → 2 → 3 */}
        <rect className="cx-travel3" style={{ '--x0': '0px', '--y0': '0px', '--x1': '0px', '--y1': '30px', '--x2': '0px', '--y2': '60px', '--x3': '0px', '--y3': '60px', '--dur': D }} x="16" y="24" width="128" height="26" rx="9" fill="none" stroke={T.hint} strokeWidth="2.4" />
      </svg>
      </CxFrame>
    );
  }

  // Кадр 3 — «Один код — любой лабиринт»: три разные формы проходятся одной и той же программой.
  if (idx === 3) {
    const D = '5s';
    const s = 9;
    // мини-карты: список открытых клеток в сетке кадра
    const maps = [
      { x: 14, label: uzT("Г"), cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], route: '4.5,4.5 22.5,4.5 22.5,22.5' },
      { x: 78, label: 'Z', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1]], route: '4.5,4.5 13.5,4.5 13.5,13.5 31.5,13.5' },
      { x: 142, label: 'U', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0]], route: '4.5,4.5 4.5,13.5 22.5,13.5 22.5,4.5' },
    ];
    return (
      <CxFrame title={uzT("ОДИН код — ЛЮБОЙ лабиринт")} notes={[uzT("программа не помнит карту — она СПРАШИВАЕТ её на каждой клетке")]}>
<svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Одна и та же программа проходит лабиринты формы Г, Z и U")}>
        <CxDefs />
        <CxStage floor={false} />
        {/* та самая программа — компактной карточкой */}
        <g>
          <rect x="42" y="20" width="116" height="30" rx="8" fill="#FFFFFF" opacity="0.9" />
          <rect x="42" y="20" width="116" height="30" rx="8" fill="none" stroke={IF} strokeWidth="1.4" opacity="0.55" />
          <text x="100" y="31" fontSize="7.2" fontWeight="900" fill={IFD} textAnchor="middle">if ⬅ · else if ➡ · else</text>
          <text x="100" y="42" fontSize="7" fontWeight="800" fill={T.ink2} textAnchor="middle">{uzT("поворот + шаг · поворот + шаг · шаг")}</text>
        </g>
        {maps.map((m, i) => (
          <g key={m.label}>
            <g transform={`translate(${m.x} 62)`}>
              {m.cells.map(([c, r]) => <CxTile key={c + '_' + r} x={c * s} y={r * s} s={s} r={2.6} />)}
              <polyline className="cx-seq" style={{ '--d': (0.5 + i * 1.3).toFixed(1) + 's', '--dur': D }} points={m.route} fill="none" stroke={TRAIL.line} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            </g>
            <text x={m.x + 16} y="58" fontSize="7.4" fontWeight="900" fill={T.ink3} textAnchor="middle">{uzT("форма")} {m.label}</text>
            <g className="cx-seq" style={{ '--d': (1.2 + i * 1.3).toFixed(1) + 's', '--dur': D }}>
              <circle cx={m.x + 16} cy="100" r="7" fill={GR} />
              <path d={`M${m.x + 12.6} 100 l2.6 2.8 l4.6 -5.4`} fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        ))}
      </svg>
      </CxFrame>
    );
  }
  return null;
}

function ComicProblem({ gesture, frames, speak, audioPlaying, voiceOn, narrow }) {
  const [idx, setIdx] = useState(0);
  const showSub = !voiceOn;
  const startRef = useRef(0);      // когда кадр появился — сцене даём доиграть анимацию
  const spokeRef = useRef(false);  // платформа уже начинала озвучивать этот кадр
  const doneRef = useRef(false);   // кадр уже отправлен дальше
  const playAtRef = useRef(0);     // когда платформа реально начала говорить
  const playingRef = useRef(false);// говорит ли платформа прямо сейчас
  playingRef.current = !!audioPlaying;
  const timersRef = useRef([]);
  const clearTimers = () => { timersRef.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); timersRef.current = []; };
  const goNext = useCallback((force) => {
    if (doneRef.current || idx >= 3) return;
    // Пока платформа говорит — не листаем: окончание поймает эффект ниже.
    if (!force && playingRef.current) return;
    doneRef.current = true;
    const animMin = idx === 3 ? 3600 : 3400;
    const wait = Math.max(0, animMin - (Date.now() - startRef.current)) + 450;
    timersRef.current.push(setTimeout(() => setIdx((i) => Math.min(i + 1, 3)), wait));
  }, [idx]);
  useEffect(() => {
    startRef.current = Date.now(); spokeRef.current = false; doneRef.current = false;
    const text = (frames[idx] && frames[idx].voice) || '';
    if (voiceOn && text) speak(text);
    // Кадр ведёт ВРЕМЯ, а не сигналы плеера: контракт useAudio не обещает событий начала
    // и конца для pushOneOff, а без них кадры либо мелькали, либо застывали.
    timersRef.current.push(setTimeout(() => goNext(), readMs(text)));
    timersRef.current.push(setTimeout(() => goNext(true), readMs(text) + 25000));
    return clearTimers;
  }, [idx]);
  // Если платформа сообщает isPlaying — уточняем: не резать фразу и не ждать зря.
  useEffect(() => {
    if (!voiceOn) return;
    if (audioPlaying) { spokeRef.current = true; playAtRef.current = Date.now(); return; }
    if (!spokeRef.current) return;
    if (Date.now() - playAtRef.current < 1200) return; // оборвалось мгновенно — ведёт таймер
    goNext();
  }, [audioPlaying]);
  const go = (i) => { gesture(); setIdx(i); };
  const cur = frames[idx] || { caption: '', voice: '' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      <div className="mentor" style={{ display: 'flex', gap: 11, alignItems: 'center', padding: '11px 14px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{cur.caption}</div>
          {showSub && <div style={{ fontSize: narrow ? 12 : 13, color: T.ink2, lineHeight: 1.35, marginTop: 3 }}>{cur.voice}</div>}
        </div>
        <button onClick={() => speak && speak(cur.voice)} aria-label={uzT("Озвучить")} style={{ flexShrink: 0, width: narrow ? 32 : 38, height: narrow ? 32 : 38, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', color: T.mentor, boxShadow: 'var(--sh-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', marginLeft: 1 }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
        </button>
      </div>
      <div key={idx} className="fadein" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><ComicScene idx={idx} /></div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2, 3].map((i) => (<button key={i} onClick={() => go(i)} aria-label={uzT("кадр ") + (i + 1)} aria-current={i === idx} style={{ width: 11, height: 11, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === idx ? T.accent : '#E0D2C2', transition: 'background .2s' }} />))}
      </div>
    </div>
  );
}

// ============================================================
// Праздничный финал
// ============================================================
function Confetti() {
  const cols = [T.accent, T.green, T.motion, T.event, T.cyan];
  const bits = [];
  for (let i = 0; i < 28; i++) {
    const left = Math.random() * 100, delay = Math.random() * 0.5, dur = 2.4 + Math.random() * 1.6;
    const sz = 6 + Math.random() * 7, spin = (Math.random() * 400 - 100) + 'deg';
    bits.push(<span key={i} className="confetti-bit" style={{ left: left + '%', width: sz, height: sz * 0.6, background: cols[i % cols.length], animationDelay: delay + 's', animationDuration: dur + 's', '--spin': spin }} />);
  }
  return <div className="cl-confetti" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>{bits}</div>;
}

// ============================================================
// Речевой бокс (Coddy / Ментор) — caption + озвучка + субтитры при mute
// ============================================================
// На телефоне шапка ужимается: вертикаль там дороже всего — её забирает
// «Программа Coddy», куда ребёнок складывает блоки.
function SpeechBox({ who, caption, voice, speak, showSub, narrow }) {
  const isK = who === 'k';
  return (
    <div className={isK ? 'mentor mentor-coddy' : 'mentor'} style={{ display: 'flex', gap: narrow ? 8 : 11, alignItems: 'center', padding: narrow ? '6px 10px' : '11px 14px' }}>
      {isK && (
        <div style={{ flexShrink: 0, width: narrow ? 32 : 42, height: narrow ? 32 : 42, borderRadius: '50%', background: '#D6EEF9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Coddy facing="down" size={narrow ? 29 : 38} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isK && <div style={{ fontSize: narrow ? 9.5 : 10.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: T.motion }}>Coddy</div>}
        <div style={{ fontSize: narrow ? 13.5 : 15.5, fontWeight: 700, color: T.ink, lineHeight: 1.25 }}>{caption}</div>
        {showSub && <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.4, marginTop: 4 }}>{voice}</div>}
      </div>
      <button onClick={() => speak && speak(voice)} aria-label={uzT("Озвучить")} style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', color: T.mentor, boxShadow: 'var(--sh-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', marginLeft: 1 }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
      </button>
    </div>
  );
}

// ============================================================
// СЛАЙДЫ
// ============================================================
// Полные периметры/стены берутся ДОСЛОВНО из сценария lesson_2_1_final_with_json.md (просимулированы sim-21.js).
const W1 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[0,1],[3,1],[7,1],[10,1],[12,1],[0,2],[12,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3]];
const W2 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[0,1],[3,1],[6,1],[8,1],[0,2],[8,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]];
const W3 = [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[4,1],[0,2],[1,2],[4,2],[0,3],[4,3],[0,4],[4,4],[0,5],[3,5],[4,5],[0,6],[4,6],[0,7],[1,7],[2,7],[3,7],[4,7]];
const W4 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[3,1],[4,1],[5,1],[6,1],[0,2],[1,2],[4,2],[5,2],[6,2],[0,3],[1,3],[2,3],[5,3],[6,3],[0,4],[1,4],[2,4],[3,4],[6,4],[0,5],[1,5],[2,5],[3,5],[4,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]];
const W5 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[0,1],[8,1],[0,2],[2,2],[3,2],[4,2],[5,2],[6,2],[8,2],[0,3],[2,3],[3,3],[4,3],[5,3],[6,3],[8,3],[0,4],[2,4],[3,4],[4,4],[5,4],[6,4],[8,4],[0,5],[8,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]];
const W6 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[0,1],[2,1],[4,1],[7,1],[9,1],[0,2],[9,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]];
const W7 = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[0,1],[11,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2]];

// EXPLAIN 2.3 — анатомия квадрата: фигура = повторяющийся кусочек (сторона + поворот) × N → Repeat N.
// Главный навык урока: найти в фигуре повторяющийся паттерн. + правило фигур (квадрат/прямоугольник/узор).
// EXPLAIN 2.5 — анатомия блока While/Until: режим (пока/до) + условие (👁 at_finish, опц. «не») + тело.
// Главное правило урока: Repeat — знаю СКОЛЬКО раз; While/Until — знаю УСЛОВИЕ остановки.
// EXPLAIN 2.6 — два паттерна сбора: «НАЙДИ И ПОДБЕРИ» (Until 🔋 + pick) для одиночки и
// «СЪЕШЬ ЦЕПОЧКУ» (While 🔋 {pick; move}) для подряд. Главное правило: Until = ДОЙТИ, While = ПОКА ЕСТЬ.
// EXPLAIN 3.1 — две стратегии против вируса: «ОБОЙДИ» (свободный путь вокруг) и «ЗАЩИТИСЬ ЩИТОМ»
// (take shield → пройди сквозь). Главное правило: ПЛАНИРУЙ маршрут ЗАРАНЕЕ, глядя на всю карту.
// EXPLAIN 3.2 — анатомия блока If (ВОПРОС + ЧТО ДЕЛАТЬ, ЕСЛИ ДА) и три сенсора, которыми программа «видит» мир.
// Главная мысль внизу: программа НЕ видит карту глазами — она видит СЕНСОРАМИ. Поэтому и нужен сканер щита.
// EXPLAIN 3.3 — две «остановки» на пути к пониманию шестерёнки:
//   variant='else' — блок вырастает на ОДНУ ветку: «если да — А, ИНАЧЕ — Б». Ровно одно из двух.
//   variant='elif' — блок вырастает дальше: несколько вопросов ПО ПОРЯДКУ, срабатывает первый «да».
// Оба экрана показывают ЖИВОЙ макет блока (тот же вид, что в песочнице) + инструкцию по шестерёнке.
// EXPLAIN 3.4 — две «остановки» на пути к универсальному навигатору:
//   variant='eyes' — что именно видят ⬅ и ➡ (живая карта с теми же индикаторами, что в песочнице);
//   variant='nav'  — как связать их с шестерёнкой If/Else If/Else и получить ОДИН код на любой лабиринт.
function NavExplain({ narrow, cell, variant }) {
  const IF = T_IF.bg, IFD = T_IF.dk;
  const isNav = variant === 'nav';
  const fs = narrow ? 11 : 12.5;
  // маленькая карта-угол: впереди стена, слева стена, справа открыт поворот — как в первой задаче
  const level = React.useMemo(() => ({
    cols: 6, rows: 5, S: [1, 1], F: [3, 3],
    walls: buildWalls(6, 5, mazeInner(6, 5, path(seg(1, 1, 3, 1), seg(3, 1, 3, 3)))),
  }), []);
  const cs = clamp(Math.round(cell * (narrow ? 0.56 : 0.66)), 22, 34);

  const head = (label, icon, sock, tone) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: IF, color: '#fff', padding: '5px 9px', minHeight: 30, borderRadius: 9, boxShadow: 'inset 0 0 0 1.5px ' + IFD, fontSize: narrow ? 12 : 13, fontWeight: 800 }}>
      {icon}<span>{label}</span>
      {sock && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: tone || 'rgba(14,14,16,0.28)', ...HEX_ONLY, fontSize: narrow ? 10 : 11, fontWeight: 800, whiteSpace: 'nowrap' }}>{sock}</span>}
    </div>
  );
  const body = (label, icon) => (
    <div style={{ marginLeft: 12, borderLeft: `4px solid ${IF}`, borderBottomLeftRadius: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 3 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.motion, color: '#fff', padding: '4px 8px', borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${T.motionDk}`, fontSize: narrow ? 11 : 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{icon}{label}</span>
    </div>
  );
  const rule = (n, text, tone) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ flexShrink: 0, width: narrow ? 18 : 21, height: narrow ? 18 : 21, borderRadius: 7, background: tone || IF, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: narrow ? 10.5 : 12, fontWeight: 900 }}>{n}</span>
      <span style={{ fontSize: fs, fontWeight: 700, color: T.ink2, lineHeight: 1.3 }}>{text}</span>
    </div>
  );
  // строка «перевода»: блок-сенсор → что он ответил на этой клетке
  const readRow = (k, label, yes) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T_PATH.bg, color: '#fff', padding: '4px 9px', fontSize: narrow ? 11 : 12.5, fontWeight: 800, whiteSpace: 'nowrap', ...HEX_ONLY }}><BlockIcon k={k} />{label}</span>
      <span style={{ fontSize: 13, color: T.ink3, fontWeight: 800 }}>→</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: yes ? T.greenSoft : 'rgba(167,166,162,0.16)', color: yes ? T.greenDk : T.ink2, border: `1.5px solid ${yes ? T.green : 'rgba(167,166,162,0.5)'}`, padding: '3px 9px', borderRadius: 99, fontSize: narrow ? 11 : 12, fontWeight: 900, whiteSpace: 'nowrap' }}>{yes ? uzT("ДА — туда можно") : uzT("нет — там стена")}</span>
    </div>
  );

  // Живой макет универсального навигатора — ровно тот, что ребёнок соберёт в песочнице.
  const mock = (
    <div style={{ borderRadius: 12, background: `${IF}14`, boxShadow: `inset 0 0 0 1.5px ${IF}40`, padding: 5, minWidth: 0 }}>
      {head('if', <BlockIcon k="if" />, '⬅ path to left?', `${T_PATH.bg}`)}
      {body('turn left  →  move', <BlockIcon k="left" />)}
      <div style={{ marginTop: 5 }}>{head('else if', <BlockIcon k="elif" />, '➡ path to right?', `${T_PATH.bg}`)}</div>
      {body('turn right  →  move', <BlockIcon k="right" />)}
      <div style={{ marginTop: 5 }}>{head('else', <BlockIcon k="else" />, null)}</div>
      {body('move', <BlockIcon k="move" />)}
    </div>
  );

  const eyesPanel = (
    <div className="frame" style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', alignItems: 'center', gap: narrow ? 9 : 16, padding: narrow ? '9px 11px' : '11px 15px', width: '100%', maxWidth: 640, boxSizing: 'border-box' }}>
      <MiniGrid level={level} robot={{ c: 3, r: 1, dir: 'right' }} cell={cs} paths probe={null} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 7 : 9, minWidth: 0, flex: '1 1 0' }}>
        {readRow('path_left', 'path to left?', false)}
        {readRow('path_right', 'path to right?', true)}
        <div style={{ fontSize: narrow ? 10.5 : 11.5, fontWeight: 800, color: T.ink3, lineHeight: 1.35 }}>{uzT("Кружки у Coddy на карте — это и есть его глаза. Зелёная стрелка — путь открыт, серая заглушка — стена.")}</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 7 : 10, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: narrow ? 12 : 13.5, fontWeight: 800, color: T.ink2, textAlign: 'center' }}>
          {isNav
            ? <>{uzT("Сенсоры + шестерёнка =")} <b style={{ color: IFD }}>{uzT("универсальный навигатор")}</b></>
            : <>{uzT("Два глаза Coddy:")} <b style={{ color: T_PATH.dk }}>{uzT("⬅ слева")}</b> {uzT("и")} <b style={{ color: T_PATH.dk }}>{uzT("➡ справа")}</b></>}
        </span>
      </div>

      {isNav ? (
        <div className="frame" style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', alignItems: narrow ? 'stretch' : 'flex-start', gap: narrow ? 8 : 16, padding: narrow ? '9px 11px' : '11px 15px', width: '100%', maxWidth: 640, boxSizing: 'border-box' }}>
          {mock}
          <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 5 : 7, minWidth: 0, flex: '1 1 0' }}>
            {rule('1', uzT("Ветки проверяются СВЕРХУ ВНИЗ — как в прошлом уроке."))}
            {rule('2', uzT("В КАЖДОЙ ветке есть move — значит за круг ровно один шаг."), T.green)}
            {rule('3', uzT("Одна из трёх сработает всегда: слева, справа или прямо."))}
            <div style={{ fontSize: narrow ? 10.5 : 11.5, fontWeight: 800, color: T.ink3, lineHeight: 1.35 }}>{uzT("Всё это — внутри While «до 👁 финиш»: Coddy повторяет, пока не дойдёт.")}</div>
          </div>
        </div>
      ) : eyesPanel}

      <div style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: narrow ? 5 : 9, width: '100%', maxWidth: 640 }}>
        {(isNav
          ? [['🅶', uzT("форма Г — один поворот")], ['🆉', uzT("форма Z — повороты в обе стороны")], ['🔁', uzT("код НЕ меняется")]]
          : [['🧭', uzT("глаза крутятся ВМЕСТЕ с Coddy")], ['🧱', uzT("стена → «нет», пусто → «ДА»")]]
        ).map(([ico, txt]) => (
          <div key={txt} className="frame" style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, padding: narrow ? '7px 10px' : '9px 11px' }}>
            <span style={{ fontSize: narrow ? 15 : 17, lineHeight: 1, flexShrink: 0 }}>{ico}</span>
            <span style={{ fontSize: narrow ? 11 : 12, fontWeight: 800, color: T.ink2, lineHeight: 1.25 }}>{txt}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: narrow ? 8 : 12, flexWrap: 'wrap', justifyContent: 'center', background: T.hintSoft, border: `1.5px solid ${T.hint}`, borderRadius: 12, padding: narrow ? '7px 12px' : '9px 16px', maxWidth: 640 }}>
        <span style={{ fontSize: 18 }}>{isNav ? '🧭' : '👀'}</span>
        <span style={{ fontSize: narrow ? 11.5 : 13.5, fontWeight: 900, color: T.ink2 }}>{isNav ? uzT("Запомни этот шаблон — он пройдёт ЛЮБОЙ лабиринт.") : uzT("Сенсор живёт в окошке-условии: брось его в белую рамку ветки.")}</span>
      </div>
    </div>
  );
}

function buildSLIDES() { return [
  // 1. HOOK — единственный экран с речью Coddy: ветки из 3.3 есть, а посмотреть по сторонам нечем
  { kind: 'hook', who: 'k', caption: uzT("Куда сворачивать?!"), voice: uzT("Друг, беда! Захожу я в лабиринт со своей программой из прошлого урока. Шестерёнка на месте, ветки на месте — выбирать я умею! Иду прямо… и БАМ — стена. Понимаешь, в чём дело? Ветки-то готовы, а ВОПРОСА нет. Ни один мой сенсор не умеет посмотреть в сторону! Вот бы у меня были глаза: слева открыто? справа открыто? Тогда я бы сам находил повороты. Помоги мне!"), cta: uzT("Помочь Coddy") },
  // 2. PROBLEM — комикс (Ментор): два глаза → вставляем в шестерёнку → навигатор → один код на любую карту
  { kind: 'problem', who: 'm', caption: uzT("Глаза для лабиринта"), voice: '', frames: [
    { caption: uzT("Два новых глаза"), voice: uzT("Coddy догадался абсолютно верно. Сегодня у него появятся два новых сенсора: путь слева и путь справа. Работают они просто: смотрят на соседнюю клетку — слева от Coddy и справа от Coddy. Если там пусто, ответ «да, туда можно». Если стена — ответ «нет». И заметь: стороны считаются ОТ Coddy и поворачиваются вместе с ним. Ты это давно знаешь — мы весь курс крутили Coddy блоками turn left и turn right.") },
    { caption: uzT("Вопрос — в ветку"), voice: uzT("А теперь самое интересное. Сами по себе сенсоры простые. Вся сила — в СВЯЗКЕ с шестерёнкой из прошлого урока! Помнишь, у блока If появились ветки else if и else? Ветки тогда были, а спрашивать было почти нечего. Сегодня в каждое окошко-условие мы вставим свой глаз: в первую ветку — путь слева, во вторую — путь справа. Ветки наконец получили настоящие вопросы.") },
    { caption: uzT("Универсальный навигатор"), voice: uzT("Вот что получается. Читаем по порядку. Если путь слева открыт — повернуть налево и шагнуть. Иначе если путь справа открыт — повернуть направо и шагнуть. Иначе — просто шагнуть вперёд. Три ветки, и ровно одна сработает на каждой клетке. И самое важное: move стоит ВНУТРИ каждой ветки. Поэтому за один круг Coddy продвигается ровно на одну клетку — что бы он там ни увидел.") },
    { caption: uzT("Один код — любой лабиринт"), voice: uzT("И вот ради чего всё затевалось. Эта программа не помнит карту наизусть — она СПРАШИВАЕТ её на каждой клетке. Поэтому один и тот же код проходит и форму Г, и форму Z, и форму У. Ты не переписываешь программу под каждый лабиринт — ты пишешь её ОДИН раз. Это называется универсальный навигатор, и он станет твоим лучшим другом до конца модуля.") },
  ], cta: uzT("Поехали") },
  // 3. EXPLAIN A — что именно видят глаза (живая карта с теми же индикаторами, что в песочнице)
  { kind: 'explain', who: 'm', variant: 'eyes', caption: uzT("Глаза Coddy"), voice: uzT("Давай разглядим глаза поближе. Coddy стоит в углу коридора и смотрит вправо. Впереди у него стена. Сенсор «путь слева» смотрит вверх — там тоже стена, значит ответ «нет». А сенсор «путь справа» смотрит вниз — там пусто, значит «да, туда можно». Видишь два кружка прямо у Coddy на карте? Это и есть его глаза: зелёная стрелка — путь открыт, серая заглушка — стена. Они будут светиться весь урок, а во время прогона тот глаз, который спрашивает программа, вспыхнет оранжевым. Пробуем!"), cta: uzT("Попробовать") },
  // 4. SANDBOX 3.4.1 (teach) — первый поворот: If/Else + ➡
  { kind: 'sandbox', who: 'm', caption: uzT("Первый поворот"), voice: uzT("Первая задача! Коридор идёт вправо, а потом сворачивает вниз. У Coddy появились новые глаза — они смотрят ВЛЕВО и ВПРАВО и говорят, есть ли там дорога. Подумай, о чём спросить на каждой клетке, чтобы он сам нашёл поворот."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_right',body:[{k:'right'},{k:'move',n:1}],elifs:[],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 7, rows: 7, S: [1, 1], F: [5, 5], inner: mazeInner(7, 7, path(seg(1, 1, 5, 1), seg(5, 1, 5, 5))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_right', 'right', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 0, else: 1, path_right: 1, right: 1, move: 2 }, require: ['while', 'at_finish', 'if', 'else', 'path_right'], lockMove1: true, hint: uzT("While «until» + 👁 «at finish?». Внутрь — If с сенсором ➡ «path to right?»: в ветку if — turn right и move, в ветку else — просто move."), limitHint: uzT("по одному move в каждой ветке — больше и не нужно."), win: uzT("Coddy САМ нашёл поворот! 🧭 Ты не говорил ему, где сворачивать — он спросил у карты и повернул сам.") }, teach: true, cta: uzT("Дальше") },
  // 5. SANDBOX 3.4.2 — та же программа, другая карта
  { kind: 'sandbox', who: 'm', caption: uzT("Та же программа — другая карта"), voice: uzT("А теперь фокус, который ты уже видел. Карта другая: коридор короче, поворот в другом месте. Но программу писать заново НЕ надо — собери ровно ту же. Ни одной правки."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_right',body:[{k:'right'},{k:'move',n:1}],elifs:[],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 6, rows: 6, S: [1, 1], F: [4, 4], inner: mazeInner(6, 6, path(seg(1, 1, 4, 1), seg(4, 1, 4, 4))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_right', 'right', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 0, else: 1, path_right: 1, right: 1, move: 2 }, require: ['while', 'at_finish', 'if', 'else', 'path_right'], lockMove1: true, hint: uzT("Та же программа, что в прошлой задаче: While «until» 👁 → If ➡ {turn right, move} else {move}. Менять НИЧЕГО не нужно."), limitHint: uzT("по одному move в каждой ветке."), win: uzT("Ни одной правки — а карта пройдена! 🌍 Вот что значит универсальная программа.") }, cta: uzT("Дальше") },
  // 6. SANDBOX 3.4.3 (teach) — зеркальный поворот: ⬅ и turn left
  { kind: 'sandbox', who: 'm', caption: uzT("Поворот в другую сторону"), voice: uzT("Теперь коридор сворачивает в другую сторону. Структура программы та же — поменяются только глаз и сторона поворота. Догадаешься какие?"), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_left',body:[{k:'left'},{k:'move',n:1}],elifs:[],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 7, rows: 7, S: [1, 5], F: [5, 1], inner: mazeInner(7, 7, path(seg(1, 5, 5, 5), seg(5, 5, 5, 1))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'left', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 0, else: 1, path_left: 1, left: 1, move: 2 }, require: ['while', 'at_finish', 'if', 'else', 'path_left'], lockMove1: true, hint: uzT("While «until» + 👁 «at finish?». Внутрь — If с сенсором ⬅ «path to left?»: в ветку if — turn left и move, в ветку else — просто move."), limitHint: uzT("по одному move в каждой ветке."), win: uzT("Зеркальный поворот освоен! ⬅ Тот же скелет программы — другими были только глаз и сторона поворота.") }, teach: true, cta: uzT("Дальше") },
  // 7. EXPLAIN B — связка обоих глаз с шестерёнкой = универсальный навигатор
  { kind: 'explain', who: 'm', variant: 'nav', caption: uzT("Универсальный навигатор"), voice: uzT("А теперь собираем всё вместе — это главная минута урока. Что если в лабиринте есть повороты И налево, И направо? Одного глаза мало. Зато хватит шестерёнки! Берём блок If, добавляем ветку else if и ветку else. В первое окошко — путь слева, во второе — путь справа. В первой ветке поворачиваем налево и шагаем, во второй — направо и шагаем, а в else просто шагаем вперёд. Читается сверху вниз, срабатывает ровно одна ветка, и в каждой есть move. Вот это и есть универсальный навигатор."), cta: uzT("Собрать") },
  // 8. SANDBOX 3.4.4 (teach) — 🌟 ГЛАВНАЯ задача урока: Z-форма, полный навигатор
  { kind: 'sandbox', who: 'm', caption: uzT("🌟 Z-форма: полный навигатор"), voice: uzT("Главная задача урока! Смотри на карту: тут форма Z — сначала поворот в одну сторону, потом в другую. Значит, нужны ОБА глаза и ещё ветка на случай «дороги по бокам нет». Собери полный навигатор — и он пройдёт любой коридор."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_left',body:[{k:'left'},{k:'move',n:1}],elifs:[{sensor:'path_right',body:[{k:'right'},{k:'move',n:1}]}],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 9, rows: 5, S: [1, 1], F: [7, 3], inner: mazeInner(9, 5, path(seg(1, 1, 4, 1), seg(4, 1, 4, 3), seg(4, 3, 7, 3))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'path_right', 'left', 'right', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 3, else: 1, path_left: 1, path_right: 1, left: 1, right: 1, move: 3 }, require: ['while', 'at_finish', 'if', 'elif', 'else', 'path_left', 'path_right'], lockMove1: true, hint: uzT("While «until» 👁 → If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}. Ветки добавляет шестерёнка ⚙️."), limitHint: uzT("move нужен в каждой из трёх веток — поэтому их три."), win: uzT("УНИВЕРСАЛЬНЫЙ НАВИГАТОР РАБОТАЕТ! 🧭 Два поворота в разные стороны — и ни одной подсказки от тебя. Coddy спросил карту и выбрал сам.") }, teach: true, cta: uzT("Дальше") },
  // 9. SANDBOX 3.4.5 — тот же навигатор на другой Z
  { kind: 'sandbox', who: 'm', caption: uzT("Тот же код — новая Z"), voice: uzT("Новая карта — и снова та же самая программа. Ничего не меняй, просто собери навигатор и запусти. Тут Z длиннее, но навигатору всё равно."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_left',body:[{k:'left'},{k:'move',n:1}],elifs:[{sensor:'path_right',body:[{k:'right'},{k:'move',n:1}]}],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 10, rows: 7, S: [1, 1], F: [8, 5], inner: mazeInner(10, 7, path(seg(1, 1, 5, 1), seg(5, 1, 5, 5), seg(5, 5, 8, 5))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'path_right', 'left', 'right', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 3, else: 1, path_left: 1, path_right: 1, left: 1, right: 1, move: 3 }, require: ['while', 'at_finish', 'if', 'elif', 'else', 'path_left', 'path_right'], lockMove1: true, hint: uzT("Ровно тот же навигатор из прошлой задачи: If ⬅ {turn left, move} · else if ➡ {turn right, move} · else {move}."), limitHint: uzT("move — по одному в каждой ветке."), win: uzT("Та же программа — другая Z! ⭐ Ты уже решаешь не один лабиринт, а сразу все.") }, cta: uzT("Дальше") },
  // 10. SANDBOX 3.4.6 — четыре поворота подряд
  { kind: 'sandbox', who: 'm', caption: uzT("Четыре поворота"), voice: uzT("Тут поворотов сразу четыре. Программу опять НЕ трогай. И понаблюдай за глазами Coddy во время прогона: сразу видно, какая ветка сработала."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'path_left',body:[{k:'left'},{k:'move',n:1}],elifs:[{sensor:'path_right',body:[{k:'right'},{k:'move',n:1}]}],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 11, rows: 7, S: [1, 1], F: [9, 5], inner: mazeInner(11, 7, path(seg(1, 1, 4, 1), seg(4, 1, 4, 3), seg(4, 3, 7, 3), seg(7, 3, 7, 5), seg(7, 5, 9, 5))), tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'path_right', 'left', 'right', 'move'], limits: { while: 1, at_finish: 1, if: 1, elif: 3, else: 1, path_left: 1, path_right: 1, left: 1, right: 1, move: 3 }, require: ['while', 'at_finish', 'if', 'elif', 'else', 'path_left', 'path_right'], lockMove1: true, hint: uzT("Тот же навигатор, что и на прошлых картах. Чисел тут нет вообще — While сам доведёт Coddy до флажка."), limitHint: uzT("move — по одному в каждой ветке."), win: uzT("ЧЕТЫРЕ поворота одним кодом! 💪 Чем длиннее лабиринт, тем виднее, зачем нужен универсальный навигатор.") }, cta: uzT("Дальше") },
  // 11. SANDBOX 3.4.7 — навигатор + отдельный If для сбора
  { kind: 'sandbox', who: 'm', caption: uzT("Навигатор + батарейки"), voice: uzT("Усложняем: в лабиринте появились батарейки. Блок If по-прежнему ОДИН — просто добавь ему ещё одну ветку через шестерёнку. Подумай, какой она должна быть по счёту: если сначала спросить про дорогу, Coddy уйдёт с батарейки, так и не подобрав её."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'has_battery',body:[{k:'battery'}],elifs:[{sensor:'path_left',body:[{k:'left'},{k:'move',n:1}]},{sensor:'path_right',body:[{k:'right'},{k:'move',n:1}]}],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 7, rows: 7, S: [1, 1], F: [5, 5], inner: mazeInner(7, 7, path(seg(1, 1, 5, 1), seg(5, 1, 5, 5))), batteries: [[2, 1], [4, 1], [5, 3]], reqBatteries: 3, tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'path_right', 'has_battery', 'left', 'right', 'move', 'battery'], limits: { while: 1, at_finish: 1, if: 1, elif: 3, else: 1, path_left: 1, path_right: 1, has_battery: 1, left: 1, right: 1, move: 3, battery: 1 }, require: ['while', 'at_finish', 'if', 'elif', 'else', 'path_left', 'path_right', 'has_battery'], lockMove1: true, hint: uzT("Один блок If: первая ветка 🔋 «has battery?» → pick battery (без move!), дальше ⬅ и ➡ как в навигаторе, и else → move."), limitHint: uzT("блоков If тут ровно два: один водит, второй собирает."), win: uzT("Три батарейки и точный маршрут! 🔋 Навигация и сбор — две отдельные задачи, и у каждой свой If.") }, teach: true, cta: uzT("Дальше") },
  // 12. SANDBOX 3.4.8 — 🏆 ФИНАЛ: навигатор + щит + сбор
  { kind: 'sandbox', who: 'm', caption: uzT("🏆 ФИНАЛ: весь модуль 3 сразу"), voice: uzT("Финал урока — и всё, что ты знаешь про модуль три, в ОДНОМ блоке If. В лабиринте форма Z, батарейки, щит и вирус. Подумай о двух вещах: в каком порядке идут ветки и в каких из них нужен шаг, а в каких нет."), data: { solution: [{k:'while',mode:'until',neg:false,sensor:'at_finish',body:[{k:'if',sensor:'danger_front',body:[{k:'shield'},{k:'move',n:1}],elifs:[{sensor:'has_battery',body:[{k:'battery'}]},{sensor:'path_left',body:[{k:'left'},{k:'move',n:1}]},{sensor:'path_right',body:[{k:'right'},{k:'move',n:1}]}],hasElse:true,elseBody:[{k:'move',n:1}]}]}], level: { cols: 9, rows: 5, S: [1, 1], F: [7, 3], inner: mazeInner(9, 5, path(seg(1, 1, 4, 1), seg(4, 1, 4, 3), seg(4, 3, 7, 3))), batteries: [[2, 1], [4, 2]], shields: [[5, 3]], viruses: [[6, 3]], reqBatteries: 2, tries: 1 }, palette: ['while', 'at_finish', 'if', 'path_left', 'path_right', 'has_battery', 'danger_front', 'left', 'right', 'move', 'battery', 'shield'], limits: { while: 1, at_finish: 1, if: 1, elif: 3, else: 1, path_left: 1, path_right: 1, has_battery: 1, danger_front: 1, left: 1, right: 1, move: 4, battery: 1, shield: 1 }, require: ['while', 'at_finish', 'if', 'elif', 'else', 'path_left', 'path_right', 'has_battery', 'danger_front'], lockMove1: true, hint: uzT("Один блок If на пять веток: ⚠ {take shield, move} · 🔋 {pick battery} · ⬅ {turn left, move} · ➡ {turn right, move} · else {move}. Блоков move нужно четыре."), limitHint: uzT("три блока If: защита, дорога, добыча."), win: uzT("МАСТЕР НАВИГАЦИИ! 🏆 Один код провёл Coddy через повороты, защитил от вируса и собрал всё до последней батарейки. Так пишут настоящие программисты!") }, cta: uzT("Дальше") },
  // 13. RECAP
  { kind: 'recap', who: 'm', caption: uzT("Мастер навигации! 🧭"), voice: uzT("Поздравляю! Сегодня Coddy получил два глаза — путь слева и путь справа — а ты соединил их с шестерёнкой из прошлого урока. Так и родился универсальный навигатор: если слева открыто — налево, иначе если справа — направо, иначе прямо. Один код на любой лабиринт. Запомни этот шаблон, он ещё не раз пригодится. А в следующем уроке Coddy станет настоящим следопытом: соберём вместе ВСЕ навыки модуля три. Нажми «Завершить»."), cta: uzT("Завершить") },
]; }

function buildRECAP_RULES() { return [
  uzT("⬅ path to left? — слева свободно?"),
  uzT("➡ path to right? — справа свободно?"),
  uzT("🧭 стороны считаются ОТ Coddy"),
  uzT("⚙️ вопросы — в ветки шестерёнки"),
  uzT("🚶 move ВНУТРИ каждой ветки"),
  uzT("♾️ один код — любой лабиринт"),
]; }

// ============================================================
// КОРНЕВОЙ
// ============================================================
export default function CoddyLessonPathSensors({ studentName, lang = 'uz', onFinished }) {
  // Язык приходит пропом от платформы и является единственным источником истины для uzT.
  // Ставим ДО чтения контента: тексты экранов теперь собираются лениво, в рендере.
  if (lang === 'uz' || lang === 'ru') CODDY_LANG = lang;
  // Имя ученика — ТОЛЬКО в видимом тексте. В озвучку не попадает: TTS кешируется на
  // сервере по самому тексту, и имя ломало бы кеш каждому ученику.
  const displayName = studentName || uzTr("O'quvchi", 'Ученик');
  // Пропа embedded больше нет — контракт разрешает ровно три пропа.
  const embedded = false;
  const SLIDES = useMemo(buildSLIDES, [lang]);
  const RECAP_RULES = useMemo(buildRECAP_RULES, [lang]);
  const startedAt = useRef(Date.now());
  const [screen, setScreen] = useState(0);
  const [solvedMap, setSolvedMap] = useState({});
  const [voiceOn, setVoiceOn] = useState(true);
  const [finished, setFinished] = useState(false);
  const [, force] = useState(0);
  const voiceRef = useRef(true); useEffect(() => { voiceRef.current = voiceOn; SFX_ON = voiceOn; }, [voiceOn]);
  const gestRef = useRef(false);
  const gesture = useCallback(() => { gestRef.current = true; }, []);
  const [cell, setCell] = useState(CELL);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => { MOTION.d = mq.matches ? 0 : 1; force((x) => x + 1); };
    apply(); mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', apply) : mq.removeListener(apply); };
  }, []);
  useEffect(() => {
    // Порог 880 = ширина контейнера урока. Ниже неё трёхколоночная раскладка (палитра 168 + программа +
    // карта до 385px) зажимала колонку «Программа» до ~137px, и блоки навигатора вылезали за неё
    // горизонтально. В полосе 680-880 (планшеты, половина экрана ноутбука) стопочная вёрстка удобнее.
    const calc = () => { const w = window.innerWidth, h = window.innerHeight; setCell(Math.round(clamp(Math.min(w * 0.115, h * 0.06), 30, 46))); setNarrow(w < 880); };
    calc(); window.addEventListener('resize', calc); return () => window.removeEventListener('resize', calc);
  }, []);

  // Озвучка и звуки — только через хуки платформы. pushOneOff ложится 1:1 на прежний
  // speak(): он так же прерывает предыдущую фразу и начинает новую.
  const audio = useAudio(NO_SEGMENTS);
  const platSfx = useSfx();
  const audioRef = useRef(null); audioRef.current = audio;
  useEffect(() => { PLAT_SFX = platSfx; return () => { PLAT_SFX = null; }; }, [platSfx]);
  const speak = useCallback((text) => {
    if (!voiceRef.current || !text) return;
    const a = audioRef.current; if (!a) return;
    a.pushOneOff(ttsMark(text));
  }, []);

  const slide = SLIDES[screen];
  // На телефоне экран уровня (и боссфайт) скроллится: карта стала крупной и в экран не влезает.
  // На всех остальных экранах прежний запрет скролла страницы сохраняется.
  const levelScroll = narrow && !embedded && !!slide && (slide.kind === 'sandbox' || slide.kind === 'boss');

  // Урок — приложение фиксированной высоты: полосы прокрутки у страницы быть не должно.
  // Исключение — экраны уровня на телефоне, там скролл разрешён осознанно.
  useEffect(() => {
    if (typeof document === 'undefined' || embedded) return;
    const de = document.documentElement;
    const prev = de.style.overflowY;
    de.style.overflowY = levelScroll ? 'auto' : 'hidden';
    return () => { de.style.overflowY = prev; };
  }, [levelScroll, embedded]);
  const last = screen === SLIDES.length - 1;
  const isSolved = !!solvedMap[screen];
  const needsSolve = ['sandbox'].includes(slide.kind);
  const canNext = !needsSolve || isSolved;
  const markSolved = useCallback(() => { setSolvedMap((m) => ({ ...m, [screen]: true })); }, [screen]);

  // прогрев системных голосов браузера больше не нужен: озвучку ведёт платформа
  // Озвучка начинается СРАЗУ при входе в урок, не дожидаясь первого касания.
  useEffect(() => { if (!finished && SLIDES[screen].kind !== 'problem') speak(SLIDES[screen].voice); }, [screen]);
  // Если браузер запретил автозапуск, повторяем фразу на первом касании.
  const screenRef = useRef(0); screenRef.current = screen;
  useEffect(() => {
    const t = setTimeout(() => {
      const a = audioRef.current;
      if (a && a.isPlaying) return;                      // уже говорит
      const ua = typeof navigator !== 'undefined' ? navigator.userActivation : null;
      if (ua && ua.hasBeenActive) return;                 // жест был — дело не в автозапуске
      const again = () => { const sl = SLIDES[screenRef.current]; if (sl && sl.kind !== 'problem') speak(sl.voice); };
      window.addEventListener('pointerdown', again, { once: true });
      window.addEventListener('keydown', again, { once: true });
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  const go = (d) => { gesture(); setScreen((s) => clamp(s + d, 0, SLIDES.length - 1)); };
  const finishLesson = () => {
    gesture(); setFinished(true);
    sfx('win', false); // экран результата — не оцениваемый ответ
    speak(uzT("Урок пройден! Теперь Coddy сам находит дорогу: путь слева, путь справа — и универсальный навигатор!"));
    const gatedKinds = ['sandbox', 'predict', 'compare', 'boss'];
    const gated = SLIDES.map((sl, i) => ({ sl, i })).filter((x) => gatedKinds.includes(x.sl.kind));
    const solved = gated.filter((x) => !!solvedMap[x.i]).length;
    const payload = {
      lessonId: 'coddy_3_4_path_sensors', lessonTitle: uzT("Сенсоры пути в действии"), level: 'module3',
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      totalQuestions: gated.length, correctAnswers: solved,
      scorePercent: gated.length ? Math.round((solved / gated.length) * 100) : 100,
      passed: solved >= gated.length,
      solvedScreens: Object.keys(solvedMap).length,
      answers: gated.map((x) => ({ questionIndex: x.i, type: x.sl.kind, question: x.sl.caption, correct: !!solvedMap[x.i] })),
    };
    if (onFinished) onFinished(payload); else console.log('[Coddy] onFinished', payload);
  };
  const replay = () => { gesture(); setFinished(false); setSolvedMap({}); setScreen(0); };
  const showSub = !voiceOn;

  return (
    <div className="cl-root" {...NO_COPY} style={{ background: T.bg, minHeight: embedded ? 0 : '100dvh', height: embedded ? '100%' : 'auto', position: 'relative' }}>
      <style>{CSS}</style>
      <div style={{ maxWidth: 1240, margin: '0 auto', minHeight: embedded ? 0 : '100dvh', height: embedded ? '100%' : (levelScroll ? 'auto' : '100dvh'), display: 'flex', flexDirection: 'column', padding: '0 clamp(5px,1.5vw,13px)', position: 'relative' }}>
        {/* шапка */}
        <div style={{ flexShrink: 0, paddingTop: 12, paddingBottom: 8 }}>
          <div className="cl-progress-track"><div className="cl-progress-bar" style={{ width: `${((screen + 1) / SLIDES.length) * 100}%` }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', color: T.ink2, textTransform: 'uppercase' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, boxShadow: '0 0 0 4px rgba(255,79,40,0.16)' }} />{uzT("Coddy · 3.4 · Сенсоры пути")}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => { setVoiceOn((v) => !v); audio.toggleMute(); }} aria-label={uzT("Звук")} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, border: `1px solid ${voiceOn ? T.accent : 'rgba(167,166,162,0.4)'}`, background: 'transparent', cursor: 'pointer', color: voiceOn ? T.accent : T.ink2, fontSize: 12.5, fontWeight: 700 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />{voiceOn ? <path d="M15.5 8.5a5 5 0 0 1 0 7" /> : <path d="M17 9l5 6M22 9l-5 6" />}</svg>{voiceOn ? uzT("Звук") : uzT("Тихо")}
              </button>
              <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        {/* сцена */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 10, overflow: levelScroll ? 'visible' : 'hidden' }}>
          {slide.kind !== 'problem' && <SpeechBox who={slide.who} caption={slide.kind === 'hook' && studentName ? displayName + ', ' + lcFirst(slide.caption) : slide.caption} voice={slide.voice} speak={speak} showSub={showSub} narrow={narrow} />}
          <div className="cl-scene" style={{ flex: levelScroll ? '0 0 auto' : 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: levelScroll ? 'flex-start' : 'safe center', overflowY: levelScroll ? 'visible' : 'auto' }}>
            {slide.kind === 'hook' && <HookScene gesture={gesture} cell={cell} />}
            {slide.kind === 'problem' && <ComicProblem gesture={gesture} frames={slide.frames} speak={speak} audioPlaying={audio.isPlaying} voiceOn={voiceOn} narrow={narrow} />}
            {slide.kind === 'explain' && <NavExplain narrow={narrow} cell={cell} variant={slide.variant} />}
            {slide.kind === 'sandbox' && <Sandbox key={screen} data={slide.data} speak={speak} gesture={gesture} onSolved={markSolved} solved={isSolved} cell={cell} narrow={narrow} teach={slide.teach} />}
            {slide.kind === 'recap' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 8 : 14 }}>
                <div>
                  <div style={lbl}>{uzT("Новые блоки урока")}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: narrow ? 6 : 8, alignItems: 'center' }}>
                    <PaletteBlock k="path_left" />
                    <PaletteBlock k="path_right" />
                  </div>
                </div>
                <div>
                  <div style={lbl}>{uzT("Что ты освоил")}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: narrow ? 6 : 8 }}>
                    {RECAP_RULES.map((it, i) => (
                      <div key={i} className="frame" style={{ display: 'flex', gap: narrow ? 7 : 10, alignItems: 'center', padding: narrow ? '7px 9px' : '10px 12px' }}>
                        <span style={{ width: narrow ? 20 : 24, height: narrow ? 20 : 24, borderRadius: 7, flexShrink: 0, background: T.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: narrow ? 12 : 14 }}>✓</span>
                        <span style={{ fontSize: narrow ? 12 : 13.5, fontWeight: 600, lineHeight: 1.3 }}>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mentor mentor-coddy" style={{ display: 'flex', gap: 11, alignItems: 'center', padding: narrow ? 9 : 12 }}><Coddy facing="down" mood="wow" size={narrow ? 38 : 44} /><div style={{ fontSize: narrow ? 13.5 : 15.5, fontWeight: 700 }}>{uzT("Теперь я сам вижу повороты! Один и тот же код — и Г, и Z, и четыре поворота подряд. А в следующем уроке стану настоящим следопытом!")}</div></div>
              </div>
            )}
          </div>
        </div>

        {/* навигация */}
        <div className="cl-nav" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '13px 0', paddingBottom: 'calc(13px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid rgba(167,166,162,0.28)', position: 'sticky', bottom: 0, zIndex: 25, background: T.bg, boxShadow: levelScroll ? '0 -10px 18px -12px rgba(14,14,16,0.35)' : 'none' }}>
          {screen > 0 && <button onClick={() => go(-1)} className="btn-ghost" style={{ padding: '12px 20px', fontSize: 15 }}>{uzT("Назад")}</button>}
          {needsSolve && !isSolved && <div style={{ fontSize: 12.5, color: T.ink3, fontWeight: 600 }}>{uzT("Выполни задание")}</div>}
          {last ? (
            <button onClick={finishLesson} className="btn-white-accent glow-ready" style={{ marginLeft: 'auto', padding: '14px 30px', fontSize: 16 }}>{slide.cta}</button>
          ) : (
            <button onClick={() => go(1)} disabled={!canNext} className={`btn-white-accent${canNext ? ' glow-ready' : ''}`} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontSize: 16 }}>
              {slide.cta || uzT("Дальше")} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          )}
        </div>

        {/* праздничный финал */}
        {finished && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(246,244,239,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 24, borderRadius: 16 }}>
            <Confetti />
            <Coddy facing="down" mood="wow" size={120} />
            <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 'clamp(26px,6vw,40px)', color: T.ink }}>{studentName ? displayName + ', ' + lcFirst(uzT("Навигатор собран! 🧭")) : uzT("Навигатор собран! 🧭")}</div>
            <div style={{ fontSize: 16, color: T.ink2, maxWidth: 460 }}>{uzT("Путь слева? Путь справа? Иначе — вперёд. Один код проходит любой лабиринт. Впереди — Coddy-следопыт!")}</div>
            <button onClick={replay} className="btn-ghost" style={{ padding: '12px 22px', fontSize: 15, boxShadow: 'var(--sh-card)', background: '#fff', marginTop: 4 }}>{uzT("Пройти ещё раз")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CSS (English-эталон + ассеты)
// ============================================================
const CSS = `
.cl-virus{animation:clVirusPulse 1.7s ease-in-out infinite;transform-origin:50% 50%}
@keyframes clVirusPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
.cl-shield-tile{animation:clShieldPulse 1.9s ease-in-out infinite;transform-origin:50% 50%}
@keyframes clShieldPulse{0%,100%{transform:scale(1);opacity:.95}50%{transform:scale(1.06);opacity:1}}
.cl-shield-aura{animation:clAura 1.4s ease-in-out infinite}
@keyframes clAura{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.06)}}
.cl-heart-break{animation:clHeartBreak .6s ease forwards}
@keyframes clHeartBreak{0%{transform:scale(1)}30%{transform:scale(1.4)}60%{transform:scale(.9)}100%{transform:scale(1);opacity:.4}}
.cl-hit-flash{animation:clHitFlash .5s ease-in-out infinite}
@keyframes clHitFlash{0%,100%{opacity:.35}50%{opacity:1}}
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap');
.cl-root, .cl-root * { box-sizing: border-box; }
/* Сцена подстрахована overflowY:auto на случай коротких окон, но сама лента прокрутки
   только портит вид фиксированной раскладки — прячем её, прокрутка колесом работает. */
.cl-scene { scrollbar-width: none; }
.cl-scene::-webkit-scrollbar { width: 0; height: 0; }
/* НИЧЕГО НЕ ВЫДЕЛЯЕТСЯ И НЕ КОПИРУЕТСЯ (no-copy.js). Перетаскивание блока попутно начинало
   нативное выделение текста, и справа от каждого блока вспыхивала полоса подсветки — ребёнок
   читал это как «блок скопировался». Правило локальное (.cl-root), чтобы не запрещать выделение
   странице-хосту платформы. Полей ввода в уроках нет, ломать нечего. */
.cl-root, .cl-root * {
  -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
}
.cl-root::selection, .cl-root ::selection { background: transparent; }
.cl-root {
  --sh-card: 0 10px 22px -12px rgba(14,14,16,0.16), 0 2px 6px -2px rgba(14,14,16,0.08);
  --sh-accent: 0 12px 26px -12px rgba(255,79,40,0.45), 0 3px 8px -3px rgba(255,79,40,0.22);
  --sh-frame: 0 18px 40px -22px rgba(14,14,16,0.18), 0 4px 12px -6px rgba(14,14,16,0.07);
  font-family: 'Manrope', system-ui, sans-serif;
}
.cl-root button:focus-visible, .cl-root [role=button]:focus-visible { outline: 2px solid ${T.mentor}; outline-offset: 2px; }
.cl-root .mono { letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.cl-progress-track { height: 4px; background: rgba(167,166,162,0.28); border-radius: 99px; position: relative; }
.cl-progress-bar { position: absolute; left: 0; top: 0; bottom: 0; background: ${T.accent}; border-radius: 99px; box-shadow: 0 0 8px rgba(255,79,40,0.55); transition: width .45s ease; }
.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 700; background: #fff; color: ${T.accent}; border: none; border-radius: 12px; cursor: pointer; box-shadow: var(--sh-accent); transition: box-shadow .25s ease-out, background .2s, color .2s; }
.btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
.btn-white-accent:disabled { opacity: .45; cursor: default; box-shadow: none; }
.glow-ready:not(:disabled) { box-shadow: 0 0 0 3px rgba(255,79,40,0.28), var(--sh-accent); }
.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 700; background: transparent; color: ${T.ink2}; border: none; border-radius: 12px; cursor: pointer; transition: background .2s, color .2s; }
.btn-ghost:hover:not(:disabled) { background: #ECE8DF; color: ${T.ink}; }
.btn-ghost:disabled { opacity: .45; cursor: default; }
.frame { background: #fff; border: none; border-radius: 16px; box-shadow: var(--sh-card); }
.frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; box-shadow: 0 6px 16px -6px rgba(255,79,40,0.28); color: #9A4A12; }
.frame-success { background: ${T.greenSoft}; border-left: 4px solid ${T.green}; border-radius: 12px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.28); color: #14613B; }
.hint-yellow { background: ${T.hintSoft}; border-left: 4px solid ${T.hint}; border-radius: 12px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; box-shadow: 0 6px 16px -6px rgba(232,181,58,0.30); color: #7A5A12; }
.mentor { background: ${T.mentorSoft}; border-left: 4px solid ${T.mentor}; border-radius: 14px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; }
.mentor-coddy { background: #EAF6FD; border-left-color: ${T.motion}; }
.fadein { animation: cl-fade .35s ease both; }
@keyframes cl-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes cl-pulse { 0%,100% { opacity: .4; transform: scale(.94); } 50% { opacity: 1; transform: scale(1.06); } }
.pulse { animation: cl-pulse 1.1s ease-in-out infinite; }
/* батарейки: лёгкое парение на карте, всплеск заряда и мигание низкого заряда */
.cl-bat-float { animation: cl-batFloat 2.2s ease-in-out infinite; }
@keyframes cl-batFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.cl-bat-pop { animation: cl-batPop .5s ease-out; }
@keyframes cl-batPop { 0% { transform: translateX(-50%) scale(.5); } 60% { transform: translateX(-50%) scale(1.18); } 100% { transform: translateX(-50%) scale(1); } }
.cl-bat-low { animation: cl-batLow 1s ease-in-out infinite; }
@keyframes cl-batLow { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
.coach-pulse { animation: coachPulse 1.2s ease-in-out infinite; }
@keyframes coachPulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.motionDk}, 0 0 0 0 rgba(76,151,255,0.5); } 50% { box-shadow: inset 0 0 0 1.5px ${T.motionDk}, 0 0 0 8px rgba(76,151,255,0); } }
.coach-bob { animation: coachBob 1s ease-in-out infinite; }
@keyframes coachBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

/* активный (выполняющийся) блок программы */
.codeBlk--active { box-shadow: inset 0 0 0 1.5px ${T.motionDk}, 0 0 0 3px rgba(255,167,90,0.7); transform: scale(1.03); animation: codeBlkPulse 1.05s ease-in-out infinite; }
@keyframes codeBlkPulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.motionDk}, 0 0 0 3px rgba(255,167,90,0.62); } 50% { box-shadow: inset 0 0 0 1.5px ${T.motionDk}, 0 0 0 7px rgba(255,167,90,0.22); } }

/* конфетти финала */
@keyframes confettiFall { from { transform: translateY(-10vh) rotate(0); opacity: 1; } to { transform: translateY(110vh) rotate(var(--spin,300deg)); opacity: .9; } }
.confetti-bit { position: absolute; top: -14px; border-radius: 2px; animation-name: confettiFall; animation-timing-function: linear; animation-fill-mode: both; }

/* === P2 комикс: 4 ожившие сцены (классы cm-*) === */
@keyframes cm-bump { 0%,100% { transform: translateX(0); } 60% { transform: translateX(0); } 72% { transform: translateX(7px); } 84% { transform: translateX(0); } 92% { transform: translateX(3px); } }
.cm-bump { animation: cm-bump 2.4s ease-in-out 1 both; }
@keyframes cm-spark { 0%,55%,100% { opacity: 0; } 72% { opacity: 1; } 90% { opacity: .2; } }
.cm-spark { animation: cm-spark 2.4s ease-in-out 1 both; }
@keyframes cm-pop-excl { 0%,60% { opacity: 0; transform: scale(.2); } 74% { opacity: 1; transform: scale(1.15); } 82% { opacity: 1; transform: scale(1); } 100% { opacity: 1; transform: scale(1); } }
.cm-pop-excl { animation: cm-pop-excl 2.4s ease-out 1 forwards; }
@keyframes cm-walker { 0% { transform: translate(22px,85px); } 42% { transform: translate(135px,85px); } 55% { transform: translate(135px,85px); } 92% { transform: translate(135px,30px); } 100% { transform: translate(135px,30px); } }
.cm-walker { animation: cm-walker 2.6s ease-in-out 1 forwards; }
@keyframes cm-walker-rot { 0%,44% { transform: rotate(0deg); } 55%,100% { transform: rotate(-90deg); } }
.cm-walker-rot { animation: cm-walker-rot 2.6s ease-in-out 1 forwards; }
@keyframes cm-step-a { 0%,100% { transform: translateX(2px); } 50% { transform: translateX(-2px); } }
@keyframes cm-step-b { 0%,100% { transform: translateX(-2px); } 50% { transform: translateX(2px); } }
.cm-leg-f, .cm-arm-f { animation: cm-step-a .5s ease-in-out 5; }
.cm-leg-b, .cm-arm-b { animation: cm-step-b .5s ease-in-out 5; }
@keyframes cm-guide { to { stroke-dashoffset: -24; } }
.cm-guide { animation: cm-guide 1.3s linear 2; }
@keyframes cm-car { 0% { transform: translate(-22px,73px); } 40% { transform: translate(100px,73px); } 52% { transform: translate(100px,73px); } 90% { transform: translate(100px,22px); } 100% { transform: translate(100px,22px); } }
.cm-car { animation: cm-car 2.6s ease-in-out 1 forwards; }
@keyframes cm-car-rot { 0%,41% { transform: rotate(0deg); } 52%,100% { transform: rotate(-90deg); } }
.cm-car-rot { animation: cm-car-rot 2.6s ease-in-out 1 forwards; }
@keyframes cm-blk { 0% { opacity: 0; transform: scale(.4) translateY(8px); } 60% { opacity: 1; transform: scale(1.08) translateY(0); } 75% { transform: scale(1); } 100% { opacity: 1; transform: scale(1); } }
.cm-blk { opacity: 0; animation: cm-blk .55s ease-out forwards; }
.cm-blk-1 { animation-delay: .1s; } .cm-blk-2 { animation-delay: .45s; } .cm-blk-3 { animation-delay: .8s; }

@media (prefers-reduced-motion: reduce) {
  .cl-root *, .cl-root *::before, .cl-root *::after { animation: none !important; transition: none !important; }
  .cl-confetti { display: none; }
  .cm-bump { transform: translateX(5px); }
  .cm-spark, .cm-pop-excl { opacity: 1; transform: none; }
  .cm-walker { transform: translate(135px,30px); } .cm-walker-rot { transform: rotate(-90deg); }
  .cm-leg-f, .cm-leg-b, .cm-arm-f, .cm-arm-b { transform: none; }
  .cm-car { transform: translate(100px,22px); } .cm-car-rot { transform: rotate(-90deg); }
  .cm-blk { opacity: 1 !important; transform: none !important; }
}

/* ============ CX-KIT: живой комикс (общий кит анимаций) — генерит apply-cx-kit.js ============ */
.cl-root { --cx-out: cubic-bezier(.22,1,.36,1); --cx-io: cubic-bezier(.65,0,.35,1); --cx-soft: cubic-bezier(.34,1.28,.64,1); }
/* появление */
.cx-in { opacity: 0; animation: cxIn .5s var(--cx-out) var(--d,0s) both; }
@keyframes cxIn { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
.cx-pop { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; animation: cxPop .5s var(--cx-soft) var(--d,0s) both; }
@keyframes cxPop { 0% { opacity: 0; transform: scale(.88); } 60% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
/* Падение блока: настоящий squash — сжатие по оси удара и растяжение поперёк,
   потом короткая докатка. Раньше приземление было равномерным scale(1.04),
   и блок читался как «вырос», а не «упал»: веса не было. */
.cx-drop { opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; animation: cxDrop .5s var(--cx-out) var(--d,0s) both; }
@keyframes cxDrop {
  0% { opacity: 0; transform: translateY(-15px) scaleY(1.1) scaleX(.92); }
  58% { opacity: 1; transform: translateY(0) scaleY(.84) scaleX(1.14); }
  76% { transform: translateY(-3px) scaleY(1.05) scaleX(.97); }
  100% { opacity: 1; transform: none; }
}
/* «жизнь» персонажей и предметов.
   Периоды прежние, но вынесены в --dur: соседние фигуры теперь можно развести
   по фазе, чтобы они не дышали в унисон (раньше длительность была константой). */
.cx-float { transform-box: fill-box; transform-origin: 50% 50%; animation: cxFloat var(--dur,2.8s) ease-in-out var(--d,0s) infinite; }
@keyframes cxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3.5px); } }
.cx-breathe { transform-box: fill-box; transform-origin: 50% 100%; animation: cxBreathe var(--dur,3.4s) ease-in-out var(--d,0s) infinite; }
@keyframes cxBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
.cx-tilt { transform-box: fill-box; transform-origin: 50% 90%; animation: cxTilt var(--dur,3s) ease-in-out var(--d,0s) infinite; }
@keyframes cxTilt { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
.cx-nod { transform-box: fill-box; transform-origin: 50% 100%; animation: cxNod 2s var(--cx-io) var(--d,0s) infinite; }
@keyframes cxNod { 0%,60%,100% { transform: translateY(0); } 70% { transform: translateY(-4px); } 80% { transform: translateY(0); } 88% { transform: translateY(-2px); } }
.cx-step { transform-box: fill-box; transform-origin: 50% 100%; animation: cxStep .44s ease-in-out var(--d,0s) infinite; }
@keyframes cxStep { 0%,100% { transform: translateY(0) rotate(-1.6deg); } 50% { transform: translateY(-2px) rotate(1.6deg); } }
/* нога/рука: качается от верхней точки (бедро/плечо) — ставь --d в противофазе */
.cx-swing { transform-box: fill-box; transform-origin: 50% 0%; animation: cxSwing .52s ease-in-out var(--d,0s) infinite; }
@keyframes cxSwing { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }
/* реакция */
.cx-shake { transform-box: fill-box; transform-origin: 50% 50%; animation: cxShake .55s var(--cx-io) var(--d,0s) both; }
@keyframes cxShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-2.5px); } 80% { transform: translateX(2.5px); } }
.cx-buzz { transform-box: fill-box; transform-origin: 50% 50%; animation: cxBuzz 2.8s var(--cx-io) var(--d,0s) infinite; }
@keyframes cxBuzz { 0%,70%,100% { transform: translate(0,0) rotate(0); } 74% { transform: translate(-2px,1px) rotate(-3deg); } 78% { transform: translate(2px,-1px) rotate(3deg); } 82% { transform: translate(-1.5px,0) rotate(-2deg); } 86% { transform: translate(1px,0) rotate(1deg); } }
.cx-beat { transform-box: fill-box; transform-origin: 50% 50%; animation: cxBeat 1.7s var(--cx-out) var(--d,0s) infinite; }
@keyframes cxBeat { 0%,100% { transform: scale(1); } 16% { transform: scale(1.14); } 32% { transform: scale(1); } 48% { transform: scale(1.08); } 64% { transform: scale(1); } }
/* движение по маршруту: --x0/--y0 -> --x1/--y1 (px в системе координат viewBox) */
.cx-travel { animation: cxTravel var(--dur,2.8s) var(--cx-io) var(--d,0s) infinite both; }
@keyframes cxTravel { 0%,12% { transform: translate(var(--x0,0px), var(--y0,0px)); } 68%,100% { transform: translate(var(--x1,0px), var(--y1,0px)); } }
.cx-travel-once { animation: cxTravel var(--dur,2.8s) var(--cx-io) var(--d,0s) forwards; }
/* три шага по маршруту: x0 -> x1 -> x2 -> x3 (y можно не задавать — берётся --y0) */
.cx-travel3 { animation: cxTravel3 var(--dur,3.4s) var(--cx-out) var(--d,0s) infinite both; }
@keyframes cxTravel3 {
  0%,10% { transform: translate(var(--x0,0px), var(--y0,0px)); }
  24%,34% { transform: translate(var(--x1,0px), var(--y1,var(--y0,0px))); }
  48%,58% { transform: translate(var(--x2,0px), var(--y2,var(--y0,0px))); }
  72%,100% { transform: translate(var(--x3,0px), var(--y3,var(--y0,0px))); }
}
/* «сейчас выполняется этот блок»: короткое окно подсветки, сдвигается через --d */
/* Подсветка «сейчас этот блок»: прозрачность + короткий наскок масштаба.
   Одной прозрачностью это читалось как «лампочка мигнула», а не «вот ЭТОТ».
   Окно расширено с 22% до 30% цикла — метка успевает быть замеченной.
   Проверено: ни один cx-seq не висит на теге с атрибутом transform=, так что
   добавленный transform ничего не телепортирует. */
.cx-seq { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; animation: cxSeq var(--dur,3.4s) var(--cx-out) var(--d,0s) infinite; }
@keyframes cxSeq {
  0% { opacity: 0; transform: scale(.94); }
  6% { opacity: 1; transform: scale(1.05); }
  12% { transform: scale(1); }
  22% { opacity: 1; transform: scale(1); }
  30%,100% { opacity: 0; transform: scale(1); }
}
/* линии и подсветки */
.cx-draw { stroke-dasharray: var(--len,240); stroke-dashoffset: var(--len,240); animation: cxDraw var(--dur,1.5s) var(--cx-io) var(--d,0s) forwards; }
@keyframes cxDraw { to { stroke-dashoffset: 0; } }
/* Бегущий пунктир. Шаг −28 не был кратен НИ ОДНОМУ штриху, применявшемуся в
   уроках (замерено: периоды 8,9,10,11,12,13,14,17), поэтому на каждом круге
   лента дёргалась. Чиним двумя ходами: (1) сам штрих нормализуем классом —
   у всех маршрутов один ритм 6/6, период 12; (2) шаг −36 = ровно три периода.
   Нужен другой ритм — задайте на элементе --dash и --dashstep парой. */
.cx-dash { stroke-dasharray: var(--dash, 6 6); animation: cxDash 1.4s linear var(--d,0s) infinite; }
@keyframes cxDash { to { stroke-dashoffset: var(--dashstep, -36); } }
.cx-flash { animation: cxFlash 1.5s ease-in-out var(--d,0s) infinite; }
@keyframes cxFlash { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
.cx-halo { transform-box: fill-box; transform-origin: 50% 50%; animation: cxHalo 2.2s var(--cx-out) var(--d,0s) infinite; }
@keyframes cxHalo { 0% { opacity: .5; transform: scale(.72); } 70%,100% { opacity: 0; transform: scale(1.5); } }
.cx-spark { transform-box: fill-box; transform-origin: 50% 50%; animation: cxSpark 1.8s ease-in-out var(--d,0s) infinite; }
@keyframes cxSpark { 0%,100% { opacity: .25; transform: scale(.7) rotate(0deg); } 45% { opacity: 1; transform: scale(1.1) rotate(35deg); } }
.cx-spin { transform-box: fill-box; transform-origin: 50% 50%; animation: cxSpin var(--dur,3.4s) linear var(--d,0s) infinite; }
@keyframes cxSpin { to { transform: rotate(360deg); } }
.cx-sheen { animation: cxSheen 3.4s ease-in-out var(--d,0s) infinite; }
@keyframes cxSheen { 0%,60%,100% { opacity: 0; transform: translateX(-14px); } 70% { opacity: .85; } 84% { opacity: 0; transform: translateX(16px); } }
/* поочерёдный показ двух состояний (например «глупо» -> «умно»).
   Смена состояния «до → после». Был чистый кроссфейд: 0.32 с обе фазы
   полупрозрачны в одной точке — двойной глиф вместо «число поменялось».
   Стало «одометром»: старое уходит вверх и чуть уменьшается, новое приезжает
   снизу; перекрытие сокращено с 8% до 6% цикла.
   Проверено: ни один cx-cycle не висит на теге с атрибутом transform=. */
.cx-cycle-a { transform-box: fill-box; transform-origin: 50% 50%; animation: cxCycleA var(--dur,4s) var(--cx-out) var(--d,0s) infinite; }
@keyframes cxCycleA { 0%,44% { opacity: 1; transform: none; } 50%,94% { opacity: 0; transform: translateY(-6px) scale(.96); } 100% { opacity: 1; transform: none; } }
.cx-cycle-b { transform-box: fill-box; transform-origin: 50% 50%; animation: cxCycleB var(--dur,4s) var(--cx-out) var(--d,0s) infinite; }
@keyframes cxCycleB { 0%,44% { opacity: 0; transform: translateY(6px) scale(.96); } 50%,94% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(6px) scale(.96); } }
@media (prefers-reduced-motion: reduce) {
  .cx-in, .cx-pop, .cx-drop, .cx-flash, .cx-spark, .cx-sheen { opacity: 1 !important; transform: none !important; }
  /* Режим «уменьшить движение» обязан убирать ДВИЖЕНИЕ, а не содержание.
     Раньше cx-seq тут гасился в ноль — а на нём висит не подсветка, а сам
     учебный контент, и кадры уходили в пустоту. Пара cycle показывалась
     целиком, обе фазы разом: «7 блоков» поверх «4 блока». */
  .cx-seq { opacity: 1 !important; transform: none !important; animation: none !important; }
  /* Из пары показываем ровно ОДНУ фазу. По умолчанию первую — она задаёт
     постановку задачи. Кадру, где вывод живёт во второй фазе, задайте это
     локально: .cx-cycle-a{opacity:0!important} .cx-cycle-b{opacity:1!important} */
  .cx-cycle-a { opacity: 1 !important; transform: none !important; animation: none !important; }
  .cx-cycle-b { opacity: 0 !important; transform: none !important; animation: none !important; }
  .cx-dash { animation: none !important; }
  .cx-draw { stroke-dashoffset: 0 !important; }
  .cx-travel, .cx-travel-once { transform: translate(var(--x1,0px), var(--y1,0px)) !important; }
  .cx-travel3 { transform: translate(var(--x3,0px), var(--y3,var(--y0,0px))) !important; }
  .cx-float, .cx-breathe, .cx-tilt, .cx-nod, .cx-step, .cx-swing, .cx-shake, .cx-buzz, .cx-beat, .cx-halo, .cx-spin { transform: none !important; }
  .cx-halo { opacity: .25 !important; }
}
/* ============ /CX-KIT ============ */

`;

