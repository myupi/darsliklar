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
 "Посмотреть всю программу": "Butun dasturni ko'rish",
 "Сократить вид": "Ko'rinishni qisqartirish",
 "вправо": "o'ngga",
 "вниз": "pastga",
 "влево": "chapga",
 "вверх": "yuqoriga",
 "блок": "blok",
 "блока": "blok",
 "блоков": "blok",
 "Кодди": "Koddy",
 "Coddy смотрит ": "Coddy qaragan tomon: ",
 "батарейка": "batareyka",
 "Удалить блок": "Blokni o'chirish",
 "до": "gacha",
 "пока": "toki",
 "не": "emas",
 "Верный ответ": "To'g'ri javob",
 "Понятно": "Tushunarli",
 "Программа Coddy": "Coddy dasturi",
 "Получилось! Coddy на флажке и полностью заряжен!": "Bo'ldi! Coddy bayroqchada va to'liq quvvatlangan!",
 "Почти! Coddy ещё не на флажке. Попробуй ещё раз 💪": "Sal qoldi! Coddy hali bayroqchada emas. Yana urinib ko'ring 💪",
 "Уже ближе! Посмотри, где Coddy свернул не туда.": "Yaqinlashdingiz! Coddy qayerda noto'g'ri burilganiga qarang.",
 "Не сдавайся! А если совсем трудно — нажми «Я сдаюсь» 👇": "Taslim bo'lmang! Agar juda qiyin bo'lsa — «Taslim bo'ldim»ni bosing 👇",
 "Брось блок сюда ⤵": "Blokni shu yerga tashlang ⤵",
 "Перетащи блоки сюда…": "Bloklarni shu yerga sudrang…",
 "Отпусти здесь ⤵": "Shu yerga qo'yib yuboring ⤵",
 "+ ещё блок": "+ yana blok",
 "Запустить": "Ishga tushirish",
 "Сброс": "Tozalash",
 "Корзина": "Savat",
 "Цель:": "Maqsad:",
 "🧠 Блоков:": "🧠 Bloklar:",
 "Показать верный ответ": "To'g'ri javobni ko'rsatish",
 "Скрыть ответ": "Javobni yashirish",
 "Я сдаюсь 🏳️": "Taslim bo'ldim 🏳️",
 "После 3 попыток": "3 urinishdan keyin",
 "Откроется после трёх попыток": "Uch urinishdan keyin ochiladi",
 "Блоки · лимит": "Bloklar · chek",
 "Блоки": "Bloklar",
 "✗ Лимит! «": "✗ Chek! «",
 "» больше нельзя": "» endi mumkin emas",
 "✋ тяни блок": "✋ blokni torting",
 "👆 тяни блок": "👆 blokni torting",
 "✗ Лимит! Блоков «": "✗ Chek! Bloklar «",
 "» больше нельзя — думай короче 🧠": "» endi mumkin emas — qisqaroq o'ylang 🧠",
 "✋ Не нажимай — тяни блок →": "✋ Bosmang — blokni torting →",
 "👆 Перетащи блок вправо →": "👆 Blokni o'ngga sudra →",
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
 "✓ умнее": "✓ aqlliroq",
 "Тот же результат": "O'sha natija",
 "Одна задача — два пути. А у кого умнее?": "Bitta topshiriq — ikki yo'l. Kimniki aqlliroq?",
 "Одну задачу решают длинной и короткой программой — Coddy приходит к одному флажку": "Bitta topshiriq uzun va qisqa dastur bilan yechiladi — Coddy bitta bayroqchaga keladi",
 "долгий путь": "uzun yo'l",
 "короткий путь": "qisqa yo'l",
 "Много слов — скучно, мало слов — понятно": "Ko'p so'z — zerikarli, kam so'z — tushunarli",
 "много слов": "ko'p so'z",
 "пара слов": "ikki og'iz so'z",
 "Семь блоков превращаются в четыре — тот же путь без лишних шагов": "Yetti blok to'rttaga aylanadi — o'sha yo'l, ortiqcha qadamlarsiz",
 "7 блоков": "7 ta blok",
 "4 блока": "4 ta blok",
 "Три правила: не делай лишних шагов, не отклоняйся зря, не возвращайся зря": "Uch qoida: ortiqcha qadam tashlamang, bekorga chetga chiqmang, bekorga orqaga qaytmang",
 "Озвучить": "Ovoz chiqarib o'qish",
 "кадр ": "kadr ",
 "Смотри — 22 блока!": "Qarang — 22 ta blok!",
 "Друг, смотри сколько я выучил — целых двадцать два блока в одной программе! Это огромная сила, я настоящий программист! Стоп… а вон тот робот решил ту же самую задачу всего пятью блоками? Ту же самую! Получается, я делал правильно, но не умно? Помоги мне — хочу научиться писать программы коротко и мудро!": "Do'stim, qarang qancha o'rgandim — bitta dasturda butun boshli yigirma ikkita blok! Bu ulkan kuch, men haqiqiy dasturchiman! To'xtang… anavi robot esa xuddi shu topshiriqni bor-yo'g'i besh blok bilan yechdimi? Xuddi shuni! Demak, men to'g'ri qildim, lekin aqlli emasmi? Menga yordam bering — dasturlarni qisqa va donolik bilan yozishni o'rganmoqchiman!",
 "Помочь Coddy": "Coddy'ga yordam berish",
 "Умный код": "Aqlli kod",
 "Один результат — два пути": "Bitta natija — ikki yo'l",
 "Одну и ту же задачу можно решить по-разному: длинной программой или короткой. Результат один, а путей много.": "Bitta topshiriqni turlicha yechish mumkin: uzun dastur bilan yoki qisqasi bilan. Natija bitta, yo'llar esa ko'p.",
 "Короче — значит умнее": "Qisqaroq — demak aqlliroq",
 "Программист — как сценарист: хороший рассказывает большую историю немногими словами. Короткая программа — хорошая программа.": "Dasturchi — ssenariynavis kabi: yaxshisi katta voqeani kam so'z bilan aytadi. Qisqa dastur — yaxshi dastur.",
 "Это — оптимизация": "Bu — optimallashtirish",
 "Делать то же самое, но меньшим числом блоков, — это называется оптимизация. Не лишних шагов, не лишних поворотов. Точно и кратко.": "O'sha ishni kamroq blok bilan bajarish — bu optimallashtirish deyiladi. Ortiqcha qadam yo'q, ortiqcha burilish yo'q. Aniq va qisqa.",
 "Три правила": "Uch qoida",
 "Запомни три правила мастера: не делай лишних шагов, не отклоняйся зря и не возвращайся, если не нужно.": "Ustaning uch qoidasini yodda tuting: ortiqcha qadam tashlamang, bekorga chetga chiqmang va kerak bo'lmasa orqaga qaytmang.",
 "Поехали": "Ketdik",
 "Убери лишнее": "Ortiqchasini olib tashlang",
 "Вот программа Coddy — она доходит до флажка, но в ней лишние шаги: до флажка всего четыре клетки, а блоков move целых семь. Нажми крестик на лишних блоках и оставь самый короткий путь — ровно четыре move. Потом запусти.": "Mana Coddy dasturi — u bayroqchagacha yetadi, lekin unda ortiqcha qadamlar bor: bayroqchagacha bor-yo'g'i to'rt katak, move bloklari esa yettita. Ortiqcha bloklardagi xochchalarni bosing va eng qisqa yo'lni qoldiring — aynan to'rtta move. Keyin ishga tushiring.",
 "Убери лишние блоки ✂️": "Ortiqcha bloklarni olib tashlang ✂️",
 "До флажка четыре клетки — значит ровно четыре move. Сними лишние крестиком.": "Bayroqchagacha to'rt katak — demak aynan to'rtta move. Ortiqchasini xochcha bilan olib tashlang.",
 "Вот так! Ровно четыре move — самый короткий путь. Всё лишнее убрано!": "Mana shunday! Aynan to'rtta move — eng qisqa yo'l. Ortiqchasi olib tashlandi!",
 "Дальше": "Davom etish",
 "Глупо или умно?": "Aqlsizmi yoki aqllimi?",
 "Одна задача — две программы. Запусти длинную, потом короткую. Обе доходят до флажка и берут батарейку — но одна тратит кучу блоков, а другая совсем мало. Реши: какая программа умнее?": "Bitta topshiriq — ikkita dastur. Uzunini ishga tushiring, keyin qisqasini. Ikkalasi ham bayroqchagacha yetadi va batareykani oladi — lekin biri bir talay blok sarflaydi, ikkinchisi esa juda oz. Hal qiling: qaysi dastur aqlliroq?",
 "Верно! Короткая программа умнее: тот же результат, но блоков намного меньше. Длинная зря возвращалась на старт. Это и есть оптимизация.": "To'g'ri! Qisqa dastur aqlliroq: natija o'sha, lekin bloklar ancha kam. Uzuni bekorga startga qaytdi. Mana shu optimallashtirish.",
 "Прямо за 4 шага": "To'g'riga 4 qadamda",
 "Теперь сам, но с лимитом. У тебя только четыре блока move — больше поставить нельзя, смотри на счётчик. Это и хорошо: лишних шагов не будет. Доведи Coddy до флажка ровно за четыре move.": "Endi o'zingiz, lekin chek bilan. Sizda faqat to'rtta move bloki bor — ko'proq qo'yib bo'lmaydi, hisoblagichga qarang. Bu yaxshi ham: ortiqcha qadam bo'lmaydi. Coddy'ni bayroqchagacha aynan to'rtta move bilan olib boring.",
 "Финиш в четырёх клетках по прямой — поставь четыре move.": "Finish to'g'ri chiziq bo'ylab to'rt katakda — to'rtta move qo'ying.",
 "Точно в цель — четыре клетки, четыре move! Ни одного лишнего шага.": "Aniq nishonga — to'rt katak, to'rtta move! Birorta ortiqcha qadam yo'q.",
 "Батарейка по дороге": "Yo'l-yo'lakay batareyka",
 "Батарейка лежит прямо на пути к флажку. Не делай крюк — иди прямо и подбери её мимоходом. Лимит: четыре move и один pick battery.": "Batareyka to'g'ri bayroqchaga boradigan yo'lda yotibdi. Aylanmang — to'g'ri yuring va uni yo'l-yo'lakay oling. Chek: to'rtta move va bitta pick battery.",
 "Два move до батарейки, pick battery, ещё два move до флажка.": "Batareykagacha ikkita move, pick battery, bayroqchagacha yana ikkita move.",
 "Умно! Батарейку взял по дороге — без лишнего крюка.": "Aqlli! Batareykani yo'l-yo'lakay oldingiz — ortiqcha aylanmasdan.",
 "Точно посчитай": "Aniq sanang",
 "Прочитай программу в голове. Флажок на пятой клетке, а в программе целых шесть move — это лишние шаги. Куда уедет Coddy: А, Б или В?": "Dasturni xayolingizda o'qing. Bayroqcha beshinchi katakda, dasturda esa oltita move — bu ortiqcha qadamlar. Coddy qayerga ketadi: A, B yoki V?",
 "Верно, клетка В! Coddy проскочил флажок на два шага. Лишние move уводят от цели — считай клетки точно.": "To'g'ri, V katagi! Coddy bayroqchadan ikki qadam o'tib ketdi. Ortiqcha move maqsaddan uzoqlashtiradi — kataklarni aniq sanang.",
 "Обойди без лишку": "Ortiqchasiz aylanib o'ting",
 "Прямо не пройти — стена. Наверху есть коридор, он и ведёт к флажку, а ходы вниз — тупики. Лимит тугой: восемь move, один turn left и два turn right. Лишнего шага он не позволит.": "To'g'ridan o'tib bo'lmaydi — devor. Yuqorida yo'lak bor, u bayroqchaga olib boradi, pastga ketgan yo'llar esa berk. Chek qattiq: sakkizta move, bitta turn left va ikkita turn right. U ortiqcha qadamga yo'l qo'ymaydi.",
 "turn left наверх, move, turn right, шесть move по верхнему коридору, turn right вниз, move на флажок.": "Yuqoriga turn left, move, turn right, yuqori yo'lak bo'ylab oltita move, pastga turn right, bayroqchaga move.",
 "Чистый обход! Ровно по лимиту — ни одного лишнего блока.": "Toza aylanma! Aynan chek bo'yicha — birorta ortiqcha blok yo'q.",
 "Не возвращайся!": "Orqaga qaytmang!",
 "Финал! Наверх ведёт короткая дорожка, но батарейки на ней нет, а без заряда флажок не считается. Иди нижним коридором, возьми батарейку по дороге и не возвращайся. Лимит: восемь move, два turn left, один turn right и один pick battery.": "Final! Yuqoriga qisqa yo'l bor, lekin unda batareyka yo'q, quvvatsiz esa bayroqcha hisoblanmaydi. Pastki yo'lakdan yuring, batareykani yo'l-yo'lakay oling va orqaga qaytmang. Chek: sakkizta move, ikkita turn left, bitta turn right va bitta pick battery.",
 "turn left наверх, move, turn right, три move до батарейки, pick battery, два move, turn left наверх, два move до флажка.": "Yuqoriga turn left, move, turn right, batareykagacha uchta move, pick battery, ikkita move, yuqoriga turn left, bayroqchagacha ikkita move.",
 "Вот это мастер! Взял батарейку и пошёл только вперёд — ни шагу назад.": "Mana bu usta! Batareykani oldi va faqat oldinga yurdi — bir qadam ham orqaga emas.",
 "Ты — оптимизатор!": "Siz — optimallashtiruvchisiz!",
 "Поздравляю! Теперь ты пишешь не просто правильно, а умно. Помни три правила: не делай лишних шагов, не отклоняйся зря, не возвращайся без нужды. Тебя ждут шесть уровней с лимитом блоков. А в следующем уроке Coddy начнёт ошибаться — и ты научишься находить и чинить ошибки. Нажми «Завершить».": "Tabriklayman! Endi siz shunchaki to'g'ri emas, aqlli yozasiz. Uch qoidani yodda tuting: ortiqcha qadam tashlamang, bekorga chetga chiqmang, keraksiz o'rinda orqaga qaytmang. Sizni blok cheklovli olti bosqich kutmoqda. Keyingi darsda esa Coddy xato qila boshlaydi — va siz xatolarni topib tuzatishni o'rganasiz. «Yakunlash»ni bosing.",
 "Завершить": "Yakunlash",
 "Не делай лишних шагов — считай клетки точно.": "Ortiqcha qadam tashlamang — kataklarni aniq sanang.",
 "Не отклоняйся зря — бери нужное по пути.": "Bekorga chetga chiqmang — keragini yo'l-yo'lakay oling.",
 "Не возвращайся, если не нужно — иди вперёд.": "Kerak bo'lmasa orqaga qaytmang — oldinga yuring.",
 "Короче программа — умнее код.": "Dastur qisqaroq — kod aqlliroq.",
 "Урок пройден! Молодец, теперь ты пишешь программы коротко и умно.": "Dars o'tildi! Ofarin, endi siz dasturlarni qisqa va aqlli yozasiz.",
 "Умный Coddy": "Aqlli Coddy",
 "Coddy · 1.5 · Оптимизация": "Coddy · 1.5 · Optimallashtirish",
 "Звук": "Ovoz",
 "Тихо": "Ovozsiz",
 "Сегодня без новых блоков": "Bugun yangi bloklarsiz",
 "— те же блоки, но теперь умно 🧠": "— o'sha bloklar, lekin endi aqlli 🧠",
 "Что ты освоил": "Nimani o'zlashtirdingiz",
 "Спасибо тебе! Теперь Coddy пишет коротко и умно.": "Sizga rahmat! Endi Coddy qisqa va aqlli yozadi.",
 "Назад": "Orqaga",
 "Выполни задание": "Topshiriqni bajaring",
 "Урок пройден! 🧠": "Dars o'tildi! 🧠",
 "Ты научился писать программы коротко и умно. Так держать, оптимизатор!": "Siz dasturlarni qisqa va aqlli yozishni o'rgandingiz. Shunday davom eting, optimallashtiruvchi!",
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
// УРОК 1.5 — «Умный Coddy» 🧠 (КОНЦЕПТУАЛЬНЫЙ урок: оптимизация, БЕЗ новых блоков)
// Дети 8-10. Пятый урок курса. Собран по пайплайну на инфраструктуре эталона 1.2/1.3/1.4.
// НОВЫХ БЛОКОВ НЕТ — только move/turn_left/turn_right/pick_battery (как в 1.4).
// ГЛАВНАЯ НОВАЯ МЕХАНИКА: ЛИМИТ БЛОКОВ (maxInstances) — нельзя поставить больше разрешённого.
//   В Sandbox: бейдж «осталось N» на каждом блоке палитры; превышение → блок НЕ ставится +
//   «✗ Лимит!» + sfx('limit'); чип «Блоков: X / лимит» (зелёный, когда ровно в цель).
// Главные идеи урока (концепт «оптимизация» = делать то же самое, но короче):
//  • Правило 1 — не делай лишних шагов (считай клетки точно).
//  • Правило 2 — не отклоняйся зря (бери по пути).
//  • Правило 3 — не возвращайся, если не нужно (иди только вперёд).
// Формат подачи: Coddy говорит ТОЛЬКО в Hook (гордится длинной программой → шок от короткой →
//   хочет учиться); со 2-й секции — только Ментор. Coddy остаётся на экране и реагирует.
// Добавлено поверх 1.4: лимит блоков в Sandbox (+ пустая палитра «trim»-режим «убери лишнее»),
//   новый компонент CompareLab (глупое vs умное — проиграть обе и выбрать умную); переписаны
//   HookScene (две программы), ComicScene (оптимизация+3 правила), SLIDES, RECAP под оптимизацию.
//   Единый applyStep; SFX (+limit); reduced-motion; без скролла. Прод-1.2 НЕ затрагивает.
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
  if (k === 'battery') return { next: cur, act: true };
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
function MiniGrid({ level, robot, bump, cell = CELL, markers, picked, charge }) {
  const { cols, rows, F, walls, hidden } = level;
  const reduce = !MOTION.d;
  const gap = 3;
  const ts = cell - gap;
  const rad = Math.max(8, Math.round(cell * 0.26));
  const flagSize = Math.round(cell * 0.62);
  const batSize = Math.round(cell * 0.62);

  // батарейки на карте: показываем те, что ещё не собраны (picked)
  const batteryEls = (level.batteries ? [...level.batteries] : []).filter((bk) => !(picked && picked.has(bk))).map((bk) => {
    const [c, r] = bk.split(',').map(Number);
    return (
      <div key={'bat' + bk} style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 3 }}>
        <Battery size={batSize} />
      </div>
    );
  });

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
  return (
    <div style={{ position: 'relative', width: cols * cell, height: rows * cell, margin: '0 auto', flexShrink: 0 }}>
      {cells}
      {batteryEls}
      {markers}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: cell, height: cell,
        transform: `translate(${robot.c * cell}px, ${robot.r * cell}px) ${bump ? 'scale(0.9)' : 'scale(1)'}`,
        transition: reduce ? 'none' : `transform ${(0.34 * MOTION.d).toFixed(2)}s ease`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none',
      }}>
        {charge && <ChargeBadge got={charge.got} req={charge.req} low={charge.low} cell={cell} />}
        <Coddy facing={robot.dir} mood={bump ? 'sad' : 'happy'} size={cell - 8} />
      </div>
    </div>
  );
}

// Индикатор заряда над Coddy: «🔋 N / M». Зелёный при полной зарядке, янтарный пока не хватает,
// красный «низкий заряд» (low) — для Hook. Двигается вместе с Coddy (живёт в его клетке).
function ChargeBadge({ got = 0, req = 0, low = false, cell = CELL }) {
  const full = req > 0 && got >= req;
  const col = low ? T.red : full ? T.green : T.hint;
  const bg = low ? T.redSoft : full ? T.greenSoft : T.hintSoft;
  const fs = Math.max(9, Math.round(cell * 0.24));
  return (
    <div className={low ? 'cl-bat-low' : full ? 'cl-bat-pop' : ''} style={{ position: 'absolute', top: -Math.round(cell * 0.34), left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 99, background: bg, border: `1.5px solid ${col}`, color: col, fontWeight: 800, fontSize: fs, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(14,14,16,0.18)', zIndex: 8 }}>
      <svg width={fs + 1} height={fs + 1} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="14" height="9" rx="2" /><path d="M20 11v3" />{!low && <path d="M9 9.5l-1.5 3h3l-1.5 3" stroke={col} strokeWidth="1.8" />}</svg>
      {low ? '!' : `${got}/${req}`}
    </div>
  );
}

// ============================================================
// Блоки — как в реальном Blockly (move 1 step / turn left / turn right + Start Game)
// ============================================================
const BLOCK_DEF = { move: { label: 'move 1 step' }, left: { label: 'turn left' }, right: { label: 'turn right' }, battery: { label: 'pick battery' } };
// Цвет блока по типу: движение/повороты — синие (motion), pick_battery — зелёный (action).
const BLOCK_COLOR = { move: { bg: T.motion, dk: T.motionDk }, left: { bg: T.motion, dk: T.motionDk }, right: { bg: T.motion, dk: T.motionDk }, battery: { bg: T.action, dk: T.actionDk } };
const bcol = (k) => BLOCK_COLOR[k] || BLOCK_COLOR.move;

function BlockIcon({ k }) {
  const s = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (k === 'start') return (<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M7 5.4 L18.6 12 L7 18.6 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" /></svg>);
  if (k === 'move') return (<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M12 19.5 L12 5.6" {...s} /><path d="M6.4 11 L12 5.2 L17.6 11" {...s} /></svg>);
  if (k === 'battery') return (<svg width="17" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><rect x="3" y="7.4" width="14" height="9.2" rx="2.2" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M20 10.6 v2.8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /><path d="M10.6 8.8 L8.4 12.4 H11 L8.8 15.6" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (k === 'left') return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M6.3 7.8 A6 6 0 1 1 5.2 14.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M3 6 L7.4 6.6 L5.6 10.6 Z" fill="#FFFFFF" /></svg>);
  return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}><path d="M17.7 7.8 A6 6 0 1 0 18.8 14.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" /><path d="M21 6 L16.6 6.6 L18.4 10.6 Z" fill="#FFFFFF" /></svg>);
}

// `small` — плотный вариант для панели ответа: тот же блок, но ниже строка,
// чтобы длинное решение помещалось без прокрутки. На перетаскивание не влияет.
function ProgramBlock({ k, onPointerDown, onDelete, indicatorTop, active, small }) {
  return (
    <div style={{ position: 'relative' }} data-block-row>
      {indicatorTop && <div aria-hidden="true" style={{ position: 'absolute', top: -5, left: 2, right: 2, height: 4, borderRadius: 4, background: T.accent, boxShadow: '0 0 0 2px ' + T.accentSoft, zIndex: 5 }} />}
      <div onPointerDown={onPointerDown} className={active ? 'codeBlk codeBlk--active' : 'codeBlk'} style={{
        display: 'inline-flex', alignItems: 'center', gap: small ? 5 : 7, background: bcol(k).bg, color: '#FFFFFF',
        padding: small ? '1px 7px' : '6px 10px', minHeight: small ? 21 : 32, boxSizing: 'border-box', borderRadius: small ? 7 : 10, boxShadow: 'inset 0 0 0 1.5px ' + bcol(k).dk,
        fontFamily: 'Manrope, system-ui, sans-serif', fontSize: small ? 11 : 13, fontWeight: 700, letterSpacing: 0.1,
        cursor: onPointerDown ? 'grab' : 'default', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
      }}>
        <BlockIcon k={k} />
        <span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[k].label}</span>
        {onDelete && <button type="button" aria-label={uzT("Удалить блок")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDelete(e); }} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.22)', color: '#FFFFFF', fontSize: 14, lineHeight: 1, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>}
      </div>
    </div>
  );
}





// small — компактный вид для телефона: иначе «turn right» не влезал в строку и
// уезжал на вторую, а лишняя строка палитры отъедала высоту у «Программы Coddy».

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
    at_finish: 'at finish?', has_battery: 'has battery?', has_coin: 'has coin?',
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
    <div onPointerDown={onPointerDown} role="button" aria-label={BLOCK_DEF[k].label} className={coach ? 'coach-pulse' : ''} style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 5 : 7, background: bcol(k).bg, color: '#FFFFFF',
      padding: small ? '3px 7px' : '6px 11px', minHeight: small ? 27 : 32, boxSizing: 'border-box', borderRadius: 10, boxShadow: 'inset 0 0 0 1.5px ' + bcol(k).dk,
      fontFamily: 'Manrope, system-ui, sans-serif', fontSize: small ? 11.5 : 13, fontWeight: 700, letterSpacing: 0.1,
      cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
    }}>
      <BlockIcon k={k} />
      <span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[k].label}</span>
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
function Sandbox({ data, speak, gesture, onSolved, solved, cell, narrow, teach }) {
  const level = React.useMemo(() => ({ ...data.level, walls: buildWalls(data.level.cols, data.level.rows, data.level.inner || []), batteries: new Set((data.level.batteries || []).map(([c, r]) => key(c, r))), reqBatteries: data.level.reqBatteries || 0 }), [data]);
  const start = () => ({ c: level.S[0], r: level.S[1], dir: 'right' });
  // Изначальное состояние программы — одно на useState и на «Сброс».
  const makeInitialProgram = () => (data.initialProgram || []).map((k) => ({ id: uid(), k }));
  const [program, setProgram] = useState(makeInitialProgram);
  const [robot, setRobot] = useState(start);
  const [running, setRunning] = useState(false);
  const [runIdx, setRunIdx] = useState(-1);
  const [bump, setBump] = useState(false);
  const [picked, setPicked] = useState(() => new Set());
  const [fb, setFb] = useState(null);
  const [drag, setDrag] = useState(null);
  const [tapNudge, setTapNudge] = useState(false);
  // Счётчик неудачных запусков — по нему открывается кнопка «Я сдаюсь».
  const [fails, setFails] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const nudgeTimer = useRef(null);
  const [limitMsg, setLimitMsg] = useState(null); // ключ блока, чей лимит исчерпан (для «✗ Лимит!»)
  const limitTimer = useRef(null);
  const progRef = useRef(program); useEffect(() => { progRef.current = program; }, [program]);
  const dragRef = useRef(drag); useEffect(() => { dragRef.current = drag; }, [drag]);
  const runIdRef = useRef(0);
  useEffect(() => () => { if (nudgeTimer.current) clearTimeout(nudgeTimer.current); if (limitTimer.current) clearTimeout(limitTimer.current); }, []);
  const listRef = useRef(null); const trashRef = useRef(null);
  // Телефон: список программы держим ростом примерно на пять блоков — иначе он уходит
  // вниз бесконечно и дотянуть блок до конца программы пальцем уже нельзя.
  const [progOpen, setProgOpen] = useState(false);
  useEffect(() => { const el = listRef.current; if (el && narrow && !progOpen) el.scrollTop = el.scrollHeight; }, [program, narrow, progOpen]);
  const fit = useFitMap(narrow); // телефон: подбираем размер карты под «Программу Coddy»
  const palette = data.palette || ['move', 'left', 'right', 'battery'];
  const noPalette = palette.length === 0; // «trim»-режим: палитры нет, только удаление лишних блоков
  const programLabel = data.programLabel || uzT("Программа Coddy");
  const showCoach = teach && program.length === 0 && !drag;
  // ЛИМИТ БЛОКОВ (maxInstances) — главная механика урока 1.5: нельзя поставить больше разрешённого.
  const limits = data.limits || null;
  const counts = {}; program.forEach((b) => { counts[b.k] = (counts[b.k] || 0) + 1; });
  const remaining = (k) => (limits ? Math.max(0, (limits[k] || 0) - (counts[k] || 0)) : Infinity);
  const totalLimit = limits ? Object.keys(limits).reduce((s, k) => s + limits[k], 0) : null;
  const flashLimit = (k) => { setLimitMsg(k); if (limitTimer.current) clearTimeout(limitTimer.current); limitTimer.current = setTimeout(() => setLimitMsg(null), 2200); };
  // Автоскролл «Программы» в самый конец при добавлении блока, чтобы новый блок + слот для следующего были видны.
  const prevLenRef = useRef(program.length);
  useEffect(() => { const el = listRef.current; if (el && program.length > prevLenRef.current) el.scrollTop = el.scrollHeight; prevLenRef.current = program.length; }, [program.length]);

  const overIndexAt = (y) => { const cont = listRef.current; if (!cont) return progRef.current.length; const items = [...cont.querySelectorAll('[data-block-row]')]; for (let i = 0; i < items.length; i++) { const rc = items[i].getBoundingClientRect(); if (y < rc.top + rc.height / 2) return i; } return items.length; };
  const overTrashAt = (x, y) => { const el = trashRef.current; if (!el) return false; const rc = el.getBoundingClientRect(); return x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom; };
  const overListAt = (x, y, m = 28) => { const el = listRef.current; if (!el) return true; const rc = el.getBoundingClientRect(); return x >= rc.left - m && x <= rc.right + m && y >= rc.top - m && y <= rc.bottom + m; };
  const startDrag = (e, payload) => { if (running) return; gesture(); const x = e.clientX, y = e.clientY; setDrag({ ...payload, x, y, startX: x, startY: y, moved: false, over: overIndexAt(y), overTrash: false }); };
  useEffect(() => {
    if (!drag) return;
    const move = (e) => { const x = e.clientX, y = e.clientY; setDrag((d) => { if (!d) return d; const moved = d.moved || Math.hypot(x - d.startX, y - d.startY) > 6; return { ...d, x, y, moved, over: overIndexAt(y), overTrash: overTrashAt(x, y), outList: !overListAt(x, y), outStrict: !overListAt(x, y, 6) }; }); };
    const up = () => { commit(dragRef.current); setDrag(null); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [drag === null]);
  // DRAG-ONLY: тап (без перемещения) НЕ добавляет блок — только перетаскивание.
  const commit = (d) => {
    if (!d) return;
    if (d.type === 'new') { if (!d.moved) { setTapNudge(true); if (nudgeTimer.current) clearTimeout(nudgeTimer.current); nudgeTimer.current = setTimeout(() => setTapNudge(false), 1800); return; } if (d.overTrash || d.outStrict) { sfx('nope'); return; } /* дроп ВНЕ «Программы Coddy» — действие недействительно */ if (limits && progRef.current.filter((b) => b.k === d.k).length >= (limits[d.k] || 0)) { flashLimit(d.k); sfx('limit'); return; } const idx = clamp(d.over, 0, progRef.current.length); setProgram((p) => { const a = [...p]; a.splice(idx, 0, { id: uid(), k: d.k }); return a; }); sfx('pop'); return; }
    if (d.type === 'move') { if (d.overTrash || (d.moved && d.outList)) { setProgram((p) => p.filter((_, i) => i !== d.fromIndex)); sfx('pop'); return; } if (!d.moved) return; setProgram((p) => { const a = [...p]; const [it] = a.splice(d.fromIndex, 1); let idx = d.over > d.fromIndex ? d.over - 1 : d.over; idx = clamp(idx, 0, a.length); a.splice(idx, 0, it); return a; }); }
  };
  const removeAt = (i) => { if (running) return; setProgram((p) => p.filter((_, j) => j !== i)); };
  const reset = () => { runIdRef.current++; setProgram(makeInitialProgram()); setRunning(false); setRunIdx(-1); setBump(false); setFb(null); setRobot(start()); setPicked(new Set()); };
  const run = async () => {
    if (running || program.length === 0) return;
    gesture();
    // Телефон: прокручиваем страницу к карте — иначе прогон идёт за верхним краем экрана.
    if (narrow && typeof window !== 'undefined') { try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (e) {} setTimeout(() => { if (window.scrollY > 4) window.scrollTo(0, 0); }, 240); }
    const myId = ++runIdRef.current; setRunning(true); setFb(null); setBump(false); setRunIdx(-1);
    let cur = start(); const pick = new Set(); setRobot({ ...cur }); setPicked(new Set()); await sleep(300);
    for (let i = 0; i < program.length; i++) {
      if (myId !== runIdRef.current) return;
      setRunIdx(i);
      if (program[i].k === 'battery') {
        // pick_battery: подбирает, только стоя НА батарейке; НЕ двигает Coddy.
        const hk = key(cur.c, cur.r);
        if (level.batteries.has(hk) && !pick.has(hk)) { pick.add(hk); setPicked(new Set(pick)); sfx('charge'); await sleep(560); }
        else { sfx('nope'); await sleep(360); }  // на пустой клетке/уже собрано — ничего не происходит
        continue;
      }
      const r = applyStep(cur, program[i].k, level);
      // Стена больше не обрывает попытку: Coddy остаётся на месте и выполняет программу дальше.
      if (r.bumped) { sfx('bump'); setBump(true); await sleep(300); setBump(false); continue; }
      cur = r.next; setRobot({ ...cur }); sfx(r.turned ? 'turn' : 'step'); await sleep(r.turned ? 360 : 400);
    }
    if (myId !== runIdRef.current) return;
    setRunIdx(-1);
    const atF = cur.c === level.F[0] && cur.r === level.F[1];
    const got = pick.size, req = level.reqBatteries;
    if (atF && got >= req) finish(true, data.win || uzT("Получилось! Coddy на флажке и полностью заряжен!"));
    else if (atF && got < req) finish(false, `Coddy дошёл до флажка, но заряд неполный — собрано ${got} из ${req}. Зайди за батарейками и нажми pick battery, стоя НА батарейке!`);
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
  const finish = (ok, text) => { setRunning(false); setRunIdx(-1); setFb({ ok, text }); if (!ok) setFails((f) => f + 1); sfx(ok ? 'win' : 'miss'); if (speak) speak(text); if (ok && !solved && onSolved) onSolved(); };
  const dispOver = drag && drag.moved ? (drag.type === 'move' && drag.over > drag.fromIndex ? drag.over - 1 : drag.over) : -1;

  const appending = drag && drag.moved && dispOver >= program.length;
  const listChildren = (
    <>
      <StartBlock small />
      {program.length === 0 && <div className={showCoach ? 'coach-bob' : ''} style={{ color: showCoach ? T.accent : T.ink3, fontSize: 13, fontWeight: showCoach ? 700 : 500, padding: '8px 4px', border: showCoach ? `2px dashed ${T.accent}` : '2px dashed transparent', borderRadius: 10, textAlign: 'center' }}>{showCoach ? uzT("Брось блок сюда ⤵") : uzT("Перетащи блоки сюда…")}</div>}
      {program.map((b, i) => (<ProgramBlock key={b.id} k={b.k} active={running && runIdx === i} indicatorTop={drag && drag.moved && dispOver === i} onPointerDown={(e) => startDrag(e, { type: 'move', fromIndex: i })} onDelete={() => removeAt(i)} />))}
      {program.length > 0 && <div style={{ flexShrink: 0, height: 40, borderRadius: 11, border: `2px dashed ${appending ? T.accent : 'rgba(167,166,162,0.4)'}`, background: appending ? T.accentSoft : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: appending ? T.accent : T.ink3, fontSize: 12.5, fontWeight: 700, transition: 'background .12s, border-color .12s' }}>{appending ? uzT("Отпусти здесь ⤵") : uzT("+ ещё блок")}</div>}
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
      <div ref={trashRef} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px', borderRadius: 11, border: `2px dashed ${drag && drag.overTrash ? T.red : '#DCE5EC'}`, color: drag && drag.overTrash ? T.red : T.ink3, fontWeight: 700, fontSize: 12, background: drag && drag.overTrash ? T.redSoft : 'transparent' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>{uzT("Корзина")}
      </div>
    </div>
  );
  const palette3 = palette.map((k, i) => {
    const rem = remaining(k); const out = limits && rem <= 0;
    return (
      <div key={k} style={{ position: 'relative', opacity: out ? 0.5 : 1, transition: 'opacity .15s' }}>
        <PaletteBlock k={k} small={narrow} coach={showCoach && i === 0 && !out} onPointerDown={(e) => startDrag(e, { type: 'new', k })} />
        {limits && <span aria-hidden="true" style={{ position: 'absolute', top: -7, right: -7, minWidth: 18, height: 18, padding: '0 3px', borderRadius: 9, background: out ? T.red : '#fff', color: out ? '#fff' : T.ink2, border: `1.5px solid ${out ? T.red : T.motionDk}`, fontSize: 11, fontWeight: 800, lineHeight: '15px', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }}>{rem}</span>}
      </div>
    );
  });
  const charge = level.reqBatteries ? { got: picked.size, req: level.reqBatteries } : null;
  // напоминание «две цели»: флажок + батарейки
  const goalChip = level.reqBatteries ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: T.ink2, marginBottom: 4, whiteSpace: 'nowrap' }}>
      <span>{uzT("Цель:")}</span><FinishFlag size={15} /><span style={{ color: T.ink3 }}>+</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#37962E' }}>{level.reqBatteries}×<Battery size={15} float={false} /></span>
    </div>
  ) : null;
  // Чип лимита: «Блоков: X / N» — красный, если блоков больше нормы (trim), зелёный — ровно в цель.
  const limitChip = limits ? (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', borderRadius: 99, padding: '3px 11px', marginBottom: 4, boxShadow: 'var(--sh-card)', color: program.length > totalLimit ? T.accentDk : program.length === totalLimit ? T.greenDk : T.ink2, background: program.length > totalLimit ? T.accentSoft : program.length === totalLimit ? T.greenSoft : '#fff', border: `1.5px solid ${program.length > totalLimit ? T.accent : program.length === totalLimit ? T.green : 'rgba(167,166,162,0.5)'}` }}>{uzT("🧠 Блоков:")} <b>{program.length}</b> / {totalLimit}</div>
  ) : null;
  const mapEl = (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{goalChip}{limitChip}<MiniGrid level={level} robot={robot} bump={bump} cell={deskMapCell(level.cols, level.rows)} picked={picked} charge={charge} /></div>);

  const dragGhost = drag && drag.moved && (() => { const gk = drag.k || (program[drag.fromIndex] && program[drag.fromIndex].k); if (!gk || !BLOCK_DEF[gk]) return null; return (<div style={{ position: 'fixed', left: drag.x + 10, top: drag.y - 14, zIndex: 50, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', borderRadius: 12, background: bcol(gk).bg, color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 12px 26px rgba(0,0,0,0.25)' }}><BlockIcon k={gk} /><span>{BLOCK_DEF[gk].label}</span></div>); })();

  if (narrow) {
    // ТЕЛЕФОН: маленькая карта сверху → «Блоки» горизонтально → «Программа Coddy» (скролл после ~5 блоков). Фидбэк только голосом.
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div ref={fit.colRef} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div ref={fit.chipsRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{goalChip}{limitChip}</div>
            <MiniGrid level={level} robot={robot} bump={bump} cell={mobMapCell(fit.vw, level.cols)} picked={picked} charge={charge} />
          </div>
          {!noPalette && (
          <div ref={fit.palRef} style={{ flexShrink: 0 }}>
            <div style={lbl}>{limits ? uzT("Блоки · лимит") : uzT("Блоки")}</div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{palette3}</div>
            {limitMsg ? <div role="status" aria-live="polite" style={{ fontSize: 11.5, fontWeight: 800, color: T.accentDk, marginTop: 3 }}>{uzT("✗ Лимит! «")}{BLOCK_DEF[limitMsg].label}{uzT("» больше нельзя")}</div> : (tapNudge || showCoach) && <div className="coach-bob" style={{ fontSize: 11.5, fontWeight: 700, color: T.accent, marginTop: 2 }}>{tapNudge ? uzT("✋ тяни блок") : uzT("👆 тяни блок")}</div>}
          </div>
          )}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div style={lbl}>{programLabel}</div>
              <button type="button" onClick={() => setProgOpen((v) => !v)} className="btn-ghost" style={{ flexShrink: 0, padding: '4px 9px', fontSize: 11, minHeight: 26, borderRadius: 8, marginBottom: 5, whiteSpace: 'nowrap' }}>{progOpen ? uzT("Сократить вид") : uzT("Посмотреть всю программу")}</button>
            </div>
            <div ref={listRef} className="frame" style={{ minHeight: 210, maxHeight: progOpen ? 'none' : 244, overflowY: progOpen ? 'visible' : 'auto', display: 'flex', flexDirection: 'column', gap: 6, background: '#FBFAF7', padding: 9, boxShadow: drag ? `0 0 0 2px ${T.accent}, var(--sh-card)` : 'var(--sh-card)' }}>{listChildren}</div>
            {controlsEl}
          </div>
        </div>
        {showingAns && narrow && <AnswerOverlay solution={data.solution} onClose={() => setShowAns(false)} />}
        {dragGhost}
      </div>
    );
  }
  // КОМПЬЮТЕР: палитра слева → программа по центру → карта справа (как было)
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'nowrap', justifyContent: 'center' }}>
        {!noPalette && (
        <div style={{ flex: '0 0 auto', width: 162, display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 12, paddingTop: 8, overflowY: 'auto' }}>
          <div style={lbl}>{limits ? uzT("Блоки · лимит") : uzT("Блоки")}</div>
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 9 }}>{palette3}</div>
          {limitMsg ? <div role="status" aria-live="polite" style={{ fontSize: 12, fontWeight: 800, color: T.accentDk, marginTop: 2, lineHeight: 1.3 }}>{uzT("✗ Лимит! Блоков «")}{BLOCK_DEF[limitMsg].label}{uzT("» больше нельзя — думай короче 🧠")}</div> : (tapNudge || showCoach) && <div className="coach-bob" style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginTop: 2 }}>{tapNudge ? uzT("✋ Не нажимай — тяни блок →") : uzT("👆 Перетащи блок вправо →")}</div>}
          {giveUpEl}
          {showingAns && <AnswerPanel solution={data.solution} />}
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
      {showingAns && narrow && <AnswerOverlay solution={data.solution} onClose={() => setShowAns(false)} />}
      {dragGhost}
    </div>
  );
}

// ============================================================
// PREDICT — программа слева, карта справа, варианты снизу. Подсветка блока + мягкий фидбэк.
// ============================================================
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
// P1 Hook — Coddy гордится длинной программой (22 блока, прокручивается), видит короткую (5):
// шок «та же задача — а у меня 22?!», просит научить писать коротко и мудро.
// ============================================================
// Чип программы в колонке Hook. Вынесен наружу, иначе React пересоздаёт тип компонента
// на каждый рендер и вступительная анимация cx-in переигрывается при каждом клике.
function HookChip({ k, i }) {
  return (
    <div className="cx-in" style={{ '--d': Math.min(0.06 + i * 0.035, 0.9) + 's', display: 'flex', alignItems: 'center', gap: 5, background: bcol(k).bg, color: '#fff', borderRadius: 6, padding: '3px 7px', fontSize: 10.5, fontWeight: 800, boxShadow: `inset 0 0 0 1.5px ${bcol(k).dk}`, flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', transform: 'scale(0.62)', transformOrigin: 'center', margin: '-3px' }}><BlockIcon k={k} /></span>
      <span style={{ whiteSpace: 'nowrap' }}>{BLOCK_DEF[k].label}</span>
    </div>
  );
}

function HookScene({ gesture, cell }) {
  // Две программы для ОДНОЙ задачи: длинная Coddy (22 блока, прокручивается) и короткая (5).
  const longProg = ['move', 'move', 'left', 'left', 'move', 'move', 'left', 'left', 'move', 'battery', 'left', 'move', 'right', 'move', 'move', 'left', 'left', 'move', 'move', 'right', 'move', 'move'];
  const shortProg = ['move', 'move', 'battery', 'left', 'move'];
  // выбор ребёнка: «какая умнее?» — короткая хвалится, длинная встряхивается
  const [pick, setPick] = useState(null);
  const [nudge, setNudge] = useState(0);
  const choose = (id) => {
    gesture(); setPick(id);
    if (id === 'short') sfx('win'); else { sfx('limit'); setNudge((n) => n + 1); }
  };
  const column = (id, title, prog, accent, scroll) => {
    const chosen = pick === id;
    const isLong = id === 'long';
    const countCls = chosen && isLong ? 'cx-shake' : undefined;
    return (
      <div role="button" tabIndex={0} aria-pressed={chosen} aria-label={title + ': ' + prog.length + ' ' + blocksWord(prog.length)}
        onClick={() => choose(id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(id); } }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '1 1 0', minWidth: 0, cursor: 'pointer', outline: 'none' }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: accent, textAlign: 'center', minHeight: 28, display: 'flex', alignItems: 'center' }}>{title}</div>
        <div className="frame" style={{ width: '100%', padding: 8, background: '#FBFAF7', display: 'flex', flexDirection: 'column', gap: 4, height: 170, overflowX: 'hidden', overflowY: scroll ? 'auto' : 'hidden', boxShadow: chosen ? `0 0 0 3px ${accent}, var(--sh-card)` : 'var(--sh-card)', transition: 'box-shadow .18s ease' }}>
          <StartBlock small />
          {prog.map((k, i) => <HookChip key={i} k={k} i={i} />)}
        </div>
        <div key={isLong ? 'n' + nudge : 'n'} className={countCls} style={{ fontSize: 13.5, fontWeight: 900, color: accent }}>{prog.length} {blocksWord(prog.length)}</div>
        <div style={{ minHeight: 21, display: 'flex', alignItems: 'center' }}>
          {chosen && !isLong && <span className="cx-pop" style={{ background: T.greenSoft, color: T.greenDk, border: `1.5px solid ${T.green}`, borderRadius: 99, padding: '2px 10px', fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}>{uzT("✓ умнее")}</span>}
        </div>
      </div>
    );
  };
  const cSize = Math.min(58, cell + 14);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', width: '100%', maxWidth: 470, justifyContent: 'center' }}>
        {column('long', uzT("Программа Coddy"), longProg, T.accent, true)}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0, width: 66 }}>
          {/* цель одна — флажок парит, вокруг расходится кольцо */}
          <div style={{ position: 'relative', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="cx-halo" aria-hidden="true" style={{ position: 'absolute', top: -4, left: -4, right: -4, bottom: -4, borderRadius: '50%', border: `2px solid ${T.accent}` }} />
            <span className="cx-float" style={{ display: 'inline-flex' }}><FinishFlag size={30} /></span>
          </div>
          <span className="cx-breathe" style={{ display: 'inline-flex' }}><Coddy facing="down" mood="sad" size={cSize} /></span>
          <div className="cx-float" style={{ lineHeight: 1 }}>
            <div className="cm-pop-excl" style={{ fontSize: 24, fontWeight: 900, color: T.accent, lineHeight: 1 }}>?!</div>
          </div>
        </div>
        {column('short', uzT("Тот же результат"), shortProg, T.green, false)}
      </div>
      <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 700, textAlign: 'center' }}>{uzT("Одна задача — два пути. А у кого умнее?")}</div>
    </div>
  );
}

// ============================================================
// P2 «Проблема» — оживлённый комикс из 4 кадров
// ============================================================
// Флажок-цель в координатах кадра комикса (200x130): шест + клетчатое полотно.
function ComicFlag({ x, y, h = 44, w = 14, className, style }) {
  const ch = 12, cols = 3, rows = 2, cw = w / cols, chh = ch / rows;
  const sq = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if ((c + r) % 2 === 0) sq.push(<rect key={c + '_' + r} x={x + 2 + c * cw} y={y + 0.3 + r * chh} width={cw} height={chh} fill="#1A1A1E" />);
  }
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width="2.2" height={h} rx="1.1" fill={T.ink3} />
      <rect x={x} y={y} width="0.9" height={h} rx="0.45" fill="#FFFFFF" opacity="0.5" />
      <rect x={x + 2} y={y} width={w} height={ch + 0.6} rx="1.6" fill="#FFFFFF" stroke="rgba(14,14,16,0.12)" strokeWidth="0.6" />
      {sq}
    </g>
  );
}

// Блок программы в кадре комикса — ПЛОСКИЙ И С ПОДПИСЬЮ, как на платформе
// (renderer zelos): заливка + контур, иконка, английское имя блока.
// Раньше тут был свой blkPath со «шипом» и тёмной подложкой на y+2: блок
// выглядел объёмным пузырём без текста и на платформенный не походил вообще.
function CxProgBlock({ x, y, w = 72, h = 13, kind = 'motion', label, dim = false, icon = 'move' }) {
  const C = kind === 'event' ? [T.event, T.eventDk] : kind === 'action' ? [T.action, T.actionDk] : [T.motion, T.motionDk];
  const fs = Math.min(7.4, h * 0.56);
  const sw = Math.max(1, h * 0.1);
  return (
    <g opacity={dim ? 0.4 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={Math.min(4.5, h * 0.34)} fill={C[0]} stroke={C[1]} strokeWidth="1" />
      {icon === 'play'
        ? <path d={`M${x + 5.4} ${y + h * 0.26} L${x + 11} ${y + h / 2} L${x + 5.4} ${y + h * 0.74} Z`} fill="#FFFFFF" />
        : icon === 'left'
          ? <path d={`M${x + 8.2} ${y + h - 3.2} V${y + 5.6} M${x + 5.4} ${y + 8} L${x + 8.2} ${y + 5} L${x + 11} ${y + 8}`} fill="none" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" transform={`rotate(-32 ${x + 8.2} ${y + h / 2})`} />
          : <path d={`M${x + 8.2} ${y + h - 3.2} V${y + 3.4} M${x + 5.4} ${y + 6} L${x + 8.2} ${y + 3} L${x + 11} ${y + 6}`} fill="none" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />}
      <text x={x + 15} y={y + h / 2 + fs * 0.36} fontSize={fs} fontWeight="800" fill="#FFFFFF">{label}</text>
    </g>
  );
}

// Подпись-пилюля внутри кадра (короткая, ≤ 12 px — правило кадра комикса).
function CxPill({ x, y, w, h = 15, text, color, bg, className, style }) {
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={bg} stroke={color} strokeWidth="1.2" />
      <text x={x + w / 2} y={y + h / 2 + 2.9} fontSize="8" fontWeight="800" fill={color} textAnchor="middle">{text}</text>
    </g>
  );
}

function ComicScene({ idx }) {
  const VB = '0 0 200 130';
  const svgStyle = { width: '100%', maxWidth: 620, maxHeight: 'min(48vh, 400px)', display: 'block' };

  // Кадр 0 — «результат один, путей много»: на ОДНОЙ карте нарисованы оба
  // маршрута, Coddy по очереди идёт то крюком, то напрямик — и оба раза
  // приходит к тому же флажку.
  if (idx === 0) {
    const CYC = '5.2s';
    return (
      <svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Одну задачу решают длинной и короткой программой — Coddy приходит к одному флажку")}>
        <CxDefs />
        <CxStage floor={false} />
        {/* старт и финиш — общие для обоих маршрутов */}
        <CxTile x={13} y={56} s={18} />
        <CxTile x={163} y={56} s={18} />
        <ComicFlag x={171} y={22} h={34} w={12} />
        {/* маршрут-крюк (длинный) */}
        <g className="cx-cycle-a" style={{ '--dur': CYC }}>
          <path className="cx-dash" d="M22 74 V98 H172 V74" fill="none" stroke="#B9B5AD" strokeWidth="2.6" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
          <CxPill x={70} y={104} w={60} text={uzT("долгий путь")} color="#8A8880" bg="#FFFFFF" />
          <g className="cx-travel3" style={{ '--x0': '0px', '--y0': '0px', '--x1': '0px', '--y1': '24px', '--x2': '150px', '--y2': '24px', '--x3': '150px', '--y3': '0px', '--dur': '3.4s' }}>
            <CxCoddy x={14} y={57} size={16} facing="right" />
          </g>
        </g>
        {/* маршрут напрямик (короткий) */}
        <g className="cx-cycle-b" style={{ '--dur': CYC }}>
          <path className="cx-dash" d="M32 65 H163" fill="none" stroke={T.green} strokeWidth="2.8" strokeDasharray="6 5" strokeLinecap="round" />
          <CxPill x={70} y={78} w={60} text={uzT("короткий путь")} color={T.greenDk} bg={T.greenSoft} />
          <g className="cx-travel" style={{ '--x0': '0px', '--x1': '150px', '--dur': '3.4s' }}>
            <CxCoddy x={14} y={57} size={16} facing="right" />
          </g>
        </g>
        {/* цель одна и та же — искра у флажка */}
        <CxSpark x={186} y={26} s={10} style={{ '--d': '2.2s' }} />
      </svg>
    );
  }

  // Кадр 1 — «программист как сценарист»: одна история то стеной слов, то
  // двумя ясными строками. Слушателя в кадре нет (человечков убрали), поэтому
  // оценку даёт значок ✗/✓ у облака, а не «zzz» над пустым местом.
  if (idx === 1) {
    const CYC = '4.8s';
    const grayW = [70, 58, 74, 52, 66, 40];
    return (
      <svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Много слов — скучно, мало слов — понятно")}>
        <CxDefs />
        <CxStage floorY={108} />
        <CxCoddy x={6} y={54} size={52} facing="right" />
        <g className="cx-float" style={{ '--d': '.2s' }}>
          <rect x="58" y="10" width="104" height="58" rx="12" fill="#FFFFFF" stroke="rgba(14,14,16,0.10)" strokeWidth="1" />
          <path d="M68 66 l-14 12 19 -5 Z" fill="#FFFFFF" />
          {/* фаза A — стена мелких серых строк */}
          <g className="cx-cycle-a" style={{ '--dur': CYC }}>
            {grayW.map((w, i) => <rect key={'g' + i} x="66" y={17 + i * 8} width={w} height="3.6" rx="1.8" fill="#D7D3CB" />)}
          </g>
          {/* фаза B — две крупные ясные строки */}
          <g className="cx-cycle-b" style={{ '--dur': CYC }}>
            <rect x="66" y="26" width="76" height="7" rx="3.5" fill={T.green} />
            <rect x="66" y="42" width="48" height="7" rx="3.5" fill={T.green} />
            <CxSpark x={124} y={41} s={11} />
          </g>
        </g>
        {/* оценка: долго и мутно ✗ — коротко и ясно ✓ */}
        <g className="cx-cycle-a" style={{ '--dur': CYC }}>
          <circle cx="172" cy="24" r="9" fill={T.accentSoft} stroke={T.accent} strokeWidth="1.6" />
          <path d="M168 20 l8 8 M176 20 l-8 8" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" />
          <CxPill x={104} y={80} w={62} text={uzT("много слов")} color="#8A8880" bg="#FFFFFF" />
        </g>
        <g className="cx-cycle-b" style={{ '--dur': CYC }}>
          <circle cx="172" cy="24" r="9" fill={T.greenSoft} stroke={T.green} strokeWidth="1.6" />
          <path d="M167.5 24 l3.4 3.6 6.1 -7" fill="none" stroke={T.greenDk} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <CxPill x={104} y={80} w={62} text={uzT("пара слов")} color={T.greenDk} bg={T.greenSoft} />
        </g>
      </svg>
    );
  }

  // Кадр 2 — оптимизация: три лишних блока помечены крестиком и исчезают
  // (7 → 4), счётчик падает, а дорожка к флажку остаётся ТОЙ ЖЕ.
  if (idx === 2) {
    const CYC = '5.2s';
    const H = 13, PITCH = 16;
    const ys = [6, 22, 38, 54, 70, 86, 102];
    const extra = [2, 4, 6];
    const rows = [
      { k: 'event', icon: 'play', label: 'Start Game' },
      { k: 'motion', icon: 'move', label: 'move' },
      { k: 'motion', icon: 'move', label: 'move' },
      { k: 'motion', icon: 'left', label: 'turn left' },
      { k: 'motion', icon: 'move', label: 'move' },
      { k: 'motion', icon: 'move', label: 'move' },
      { k: 'motion', icon: 'move', label: 'move' },
    ];
    const X = 16, W = 72;
    return (
      <svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Семь блоков превращаются в четыре — тот же путь без лишних шагов")}>
        <CxDefs />
        <CxStage floor={false} />
        {/* пустые места, которые остаются после уборки лишнего */}
        {extra.map((i) => <rect key={'ph' + i} x={X} y={ys[i]} width={W} height={H} rx="4.4" fill="none" stroke={T.ink3} strokeDasharray="4 3" strokeWidth="1.1" opacity="0.45" />)}
        {/* блоки, которые остаются всегда */}
        {[0, 1, 3, 5].map((i) => <CxProgBlock key={'k' + i} x={X} y={ys[i]} w={W} h={H} kind={rows[i].k} icon={rows[i].icon} label={rows[i].label} />)}
        {/* лишние блоки: в фазе A стоят и помечены крестиком слева, в фазе B их уже нет */}
        <g className="cx-cycle-a" style={{ '--dur': CYC }}>
          {extra.map((i) => <CxProgBlock key={'x' + i} x={X} y={ys[i]} w={W} h={H} kind="motion" icon="move" label="move" />)}
          {extra.map((i) => (
            <g key={'b' + i} className="cx-flash" style={{ '--d': (i * 0.12) + 's' }}>
              <circle cx={X - 8} cy={ys[i] + H / 2} r="5.2" fill={T.accent} />
              <path d={`M${X - 10.4} ${ys[i] + H / 2 - 2.4} l4.8 4.8 M${X - 5.6} ${ys[i] + H / 2 - 2.4} l-4.8 4.8`} stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
        </g>
        {/* дорожка и флажок — цель не меняется; флажок СТОИТ на последней клетке */}
        <CxTile x={100} y={44} s={17} /><CxTile x={118} y={44} s={17} /><CxTile x={136} y={44} s={17} /><CxTile x={154} y={44} s={17} /><CxTile x={172} y={44} s={17} />
        <ComicFlag x={179} y={14} h={30} w={12} />
        <g className="cx-travel" style={{ '--x0': '0px', '--x1': '72px', '--dur': '3s' }}>
          <CxCoddy x={100} y={43} size={17} facing="right" />
        </g>
        {/* счётчик блоков: 7 -> 4 */}
        <g className="cx-cycle-a" style={{ '--dur': CYC }}>
          <CxPill x={108} y={80} w={62} h={17} text={uzT("7 блоков")} color={T.accentDk} bg={T.accentSoft} />
        </g>
        <g className="cx-cycle-b" style={{ '--dur': CYC }}>
          <CxPill x={108} y={80} w={62} h={17} text={uzT("4 блока")} color={T.greenDk} bg={T.greenSoft} />
        </g>
      </svg>
    );
  }

  // Кадр 3 — три правила мастера: карточки загораются по очереди (cx-seq),
  // 1) дошёл ровно до флажка, 2) идёт прямо, крюк зачёркнут, 3) вперёд — а возврат зачёркнут.
  if (idx === 3) {
    const DUR = '3.9s';
    const dly = ['.15s', '1.35s', '2.55s'];
    const card = (i, children) => {
      const top = 6 + i * 39;
      return (
        <g key={i} className="cx-in" style={{ '--d': (i * 0.1) + 's' }}>
          <rect x="8" y={top} width="184" height="33" rx="11" fill="#FFFFFF" opacity="0.94" stroke="rgba(167,166,162,0.38)" strokeWidth="1.2" />
          <circle cx="26" cy={top + 16.5} r="9.5" fill={T.accent} />
          <text x="26" y={top + 20.5} fontSize="11" fontWeight="900" fill="#FFFFFF" textAnchor="middle">{i + 1}</text>
          {children}
          <rect className="cx-seq" style={{ '--d': dly[i], '--dur': DUR }} x="6" y={top - 2} width="188" height="37" rx="13" fill="none" stroke={T.hint} strokeWidth="3" />
        </g>
      );
    };
    return (
      <svg viewBox={VB} style={svgStyle} role="img" aria-label={uzT("Три правила: не делай лишних шагов, не отклоняйся зря, не возвращайся зря")}>
        <CxDefs />
        <CxStage floor={false} />
        {/* 1 — ровно столько шагов, сколько клеток */}
        {card(0, <g>
          {[48, 64, 80, 96, 112].map((x) => <CxTile key={x} x={x} y={14} s={15} />)}
          <ComicFlag x={136} y={10} h={23} w={10} />
          <g className="cx-travel" style={{ '--x0': '0px', '--x1': '64px', '--dur': '2.8s' }}>
            <CxCoddy x={48} y={13} size={15} facing="right" />
          </g>
          <CxSpark x={152} y={13} s={9} style={{ '--d': '1.7s' }} />
        </g>)}
        {/* 2 — прямо к цели, крюк перечёркнут */}
        {card(1, <g>
          <path d="M48 68 Q86 50 124 68" fill="none" stroke="#C9C6C0" strokeWidth="2.4" strokeDasharray="4 4" strokeLinecap="round" />
          <line className="cx-flash" x1="74" y1="51" x2="96" y2="66" stroke={T.accent} strokeWidth="3" strokeLinecap="round" />
          <path className="cx-dash" d="M48 68 H124" fill="none" stroke={T.green} strokeWidth="2.6" strokeDasharray="6 5" strokeLinecap="round" />
          <path d="M124 64 l6 4 -6 4 Z" fill={T.green} />
          <circle className="cx-travel" style={{ '--x0': '0px', '--x1': '72px', '--dur': '2.8s' }} cx="50" cy="68" r="3.6" fill={T.motion} />
          <ComicFlag x={136} y={49} h={23} w={10} />
        </g>)}
        {/* 3 — только вперёд, возврат перечёркнут.
            Всё держим выше y≈113: карточка кончается на 117, а у перечёркивания
            круглый torets — раньше он вылезал за карточку и почти за кадр. */}
        {card(2, <g>
          <g className="cx-travel" style={{ '--x0': '0px', '--x1': '68px', '--dur': '2.8s' }}>
            <CxCoddy x={46} y={85} size={14} facing="right" />
          </g>
          <path className="cx-dash" d="M48 101 H124" fill="none" stroke={T.green} strokeWidth="2.4" strokeDasharray="6 5" strokeLinecap="round" />
          <path d="M124 97 l6 4 -6 4 Z" fill={T.green} />
          <path d="M124 110 H62" fill="none" stroke="#C9C6C0" strokeWidth="2.4" strokeDasharray="4 4" strokeLinecap="round" />
          <path d="M62 106 l-6 4 6 4 Z" fill="#C9C6C0" />
          <line className="cx-flash" style={{ '--d': '.3s' }} x1="80" y1="102" x2="98" y2="112" stroke={T.accent} strokeWidth="3" strokeLinecap="round" />
          <ComicFlag x={136} y={86} h={22} w={10} />
        </g>)}
      </svg>
    );
  }
  return null;
}

// Комикс: каждая сцена озвучивается своим текстом; анимация играет ОДИН раз;
// к следующему кадру переходим ТОЛЬКО после окончания озвучки (синхронно).
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
function buildSLIDES() { return [
  // 1. HOOK — единственный экран с речью Coddy: гордится длинной программой → шок от короткой → хочет учиться
  { kind: 'hook', who: 'k', caption: uzT("Смотри — 22 блока!"), voice: uzT("Друг, смотри сколько я выучил — целых двадцать два блока в одной программе! Это огромная сила, я настоящий программист! Стоп… а вон тот робот решил ту же самую задачу всего пятью блоками? Ту же самую! Получается, я делал правильно, но не умно? Помоги мне — хочу научиться писать программы коротко и мудро!"), cta: uzT("Помочь Coddy") },
  // 2. PROBLEM — комикс (Ментор): два пути → короче=умнее → оптимизация → три правила
  { kind: 'problem', who: 'm', caption: uzT("Умный код"), voice: '', frames: [
    { caption: uzT("Один результат — два пути"), voice: uzT("Одну и ту же задачу можно решить по-разному: длинной программой или короткой. Результат один, а путей много.") },
    { caption: uzT("Короче — значит умнее"), voice: uzT("Программист — как сценарист: хороший рассказывает большую историю немногими словами. Короткая программа — хорошая программа.") },
    { caption: uzT("Это — оптимизация"), voice: uzT("Делать то же самое, но меньшим числом блоков, — это называется оптимизация. Не лишних шагов, не лишних поворотов. Точно и кратко.") },
    { caption: uzT("Три правила"), voice: uzT("Запомни три правила мастера: не делай лишних шагов, не отклоняйся зря и не возвращайся, если не нужно.") },
  ], cta: uzT("Поехали") },
  // 3. TRIM (sandbox, пустая палитра) — убери лишние блоки из готовой длинной программы (Правило 1)
  { kind: 'sandbox', who: 'm', caption: uzT("Убери лишнее"), voice: uzT("Вот программа Coddy — она доходит до флажка, но в ней лишние шаги: до флажка всего четыре клетки, а блоков move целых семь. Нажми крестик на лишних блоках и оставь самый короткий путь — ровно четыре move. Потом запусти."), data: { solution: [{k:'move'},{k:'move'},{k:'move'},{k:'move'}], level: { cols: 7, rows: 3, S: [1, 1], F: [5, 1] }, palette: [], initialProgram: ['move', 'move', 'move', 'move', 'move', 'move', 'move'], limits: { move: 4 }, programLabel: uzT("Убери лишние блоки ✂️"), hint: uzT("До флажка четыре клетки — значит ровно четыре move. Сними лишние крестиком."), win: uzT("Вот так! Ровно четыре move — самый короткий путь. Всё лишнее убрано!") }, cta: uzT("Дальше") },
  // 4. COMPARE — глупое vs умное: проиграй обе, выбери умную (концепт оптимизации, Правило 3)
  { kind: 'compare', who: 'm', caption: uzT("Глупо или умно?"), voice: uzT("Одна задача — две программы. Запусти длинную, потом короткую. Обе доходят до флажка и берут батарейку — но одна тратит кучу блоков, а другая совсем мало. Реши: какая программа умнее?"), data: { level: { cols: 7, rows: 5, S: [1, 3], F: [5, 1], batteries: [[3, 3]], reqBatteries: 1, inner: [[4, 3], [4, 2]] }, long: ['move', 'move', 'battery', 'left', 'left', 'move', 'move', 'left', 'left', 'move', 'move', 'left', 'move', 'move', 'right', 'move', 'move'], short: ['move', 'move', 'battery', 'left', 'move', 'move', 'right', 'move', 'move'], win: uzT("Верно! Короткая программа умнее: тот же результат, но блоков намного меньше. Длинная зря возвращалась на старт. Это и есть оптимизация.") }, cta: uzT("Дальше") },
  // 5. SANDBOX demo (teach) 1.5.1 — прямо за 4 (вводит ЛИМИТ блоков; Правило 1)
  { kind: 'sandbox', who: 'm', caption: uzT("Прямо за 4 шага"), voice: uzT("Теперь сам, но с лимитом. У тебя только четыре блока move — больше поставить нельзя, смотри на счётчик. Это и хорошо: лишних шагов не будет. Доведи Coddy до флажка ровно за четыре move."), data: { solution: [{k:'move'},{k:'move'},{k:'move'},{k:'move'}], level: { cols: 7, rows: 4, S: [1, 2], F: [5, 2], inner: [[3, 1]] }, palette: ['move'], limits: { move: 4 }, hint: uzT("Финиш в четырёх клетках по прямой — поставь четыре move."), win: uzT("Точно в цель — четыре клетки, четыре move! Ни одного лишнего шага.") }, teach: true, cta: uzT("Дальше") },
  // 6. SANDBOX 1.5.2 — батарейка по дороге (Правило 2): move=4, battery=1
  { kind: 'sandbox', who: 'm', caption: uzT("Батарейка по дороге"), voice: uzT("Батарейка лежит прямо на пути к флажку. Не делай крюк — иди прямо и подбери её мимоходом. Лимит: четыре move и один pick battery."), data: { solution: [{k:'move'},{k:'move'},{k:'battery'},{k:'move'},{k:'move'}], level: { cols: 7, rows: 4, S: [1, 2], F: [5, 2], batteries: [[3, 2]], reqBatteries: 1, inner: [[2, 1]] }, palette: ['move', 'battery'], limits: { move: 4, battery: 1 }, hint: uzT("Два move до батарейки, pick battery, ещё два move до флажка."), win: uzT("Умно! Батарейку взял по дороге — без лишнего крюка.") }, cta: uzT("Дальше") },
  // 7. PREDICT — лишний move уводит с финиша (Правило 1, на подумать)
  { kind: 'predict', who: 'm', caption: uzT("Точно посчитай"), voice: uzT("Прочитай программу в голове. Флажок на пятой клетке, а в программе целых шесть move — это лишние шаги. Куда уедет Coddy: А, Б или В?"), data: { level: { cols: 9, rows: 3, S: [1, 1], F: [5, 1] }, startDir: 'right', program: ['move', 'move', 'move', 'move', 'move', 'move'], candidates: [[4, 1], [6, 1], [7, 1]], correctIdx: 2, win: uzT("Верно, клетка В! Coddy проскочил флажок на два шага. Лишние move уводят от цели — считай клетки точно.") }, cta: uzT("Дальше") },
  // 8. SANDBOX 1.5.3 — обойди препятствие, уложись в тугой лимит (выбор короткого обхода)
  { kind: 'sandbox', who: 'm', caption: uzT("Обойди без лишку"), voice: uzT("Прямо не пройти — стена. Наверху есть коридор, он и ведёт к флажку, а ходы вниз — тупики. Лимит тугой: восемь move, один turn left и два turn right. Лишнего шага он не позволит."), data: { solution: [{k:'left'},{k:'move'},{k:'right'},{k:'move'},{k:'move'},{k:'move'},{k:'move'},{k:'move'},{k:'move'},{k:'right'},{k:'move'}], level: { cols: 9, rows: 6, S: [1, 2], F: [7, 2], inner: [[2, 2], [4, 2], [6, 2], [2, 3], [4, 3], [6, 3], [2, 4], [4, 4]] }, palette: ['move', 'left', 'right'], limits: { move: 8, left: 1, right: 2 }, hint: uzT("turn left наверх, move, turn right, шесть move по верхнему коридору, turn right вниз, move на флажок."), win: uzT("Чистый обход! Ровно по лимиту — ни одного лишнего блока.") }, cta: uzT("Дальше") },
  // 9. SANDBOX финал 1.5.4 — не возвращайся (Правило 3): move=9, l=1, r=1, battery=1
  { kind: 'sandbox', who: 'm', caption: uzT("Не возвращайся!"), voice: uzT("Финал! Наверх ведёт короткая дорожка, но батарейки на ней нет, а без заряда флажок не считается. Иди нижним коридором, возьми батарейку по дороге и не возвращайся. Лимит: восемь move, два turn left, один turn right и один pick battery."), data: { solution: [{k:'left'},{k:'move'},{k:'right'},{k:'move'},{k:'move'},{k:'move'},{k:'battery'},{k:'move'},{k:'move'},{k:'left'},{k:'move'},{k:'move'}], level: { cols: 9, rows: 6, S: [1, 4], F: [6, 1], batteries: [[4, 3]], reqBatteries: 1, inner: [[7, 1], [2, 2], [3, 2], [4, 2], [5, 2], [7, 2], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]] }, palette: ['move', 'left', 'right', 'battery'], limits: { move: 8, left: 2, right: 1, battery: 1 }, hint: uzT("turn left наверх, move, turn right, три move до батарейки, pick battery, два move, turn left наверх, два move до флажка."), win: uzT("Вот это мастер! Взял батарейку и пошёл только вперёд — ни шагу назад.") }, cta: uzT("Дальше") },
  // 10. RECAP
  { kind: 'recap', who: 'm', caption: uzT("Ты — оптимизатор!"), voice: uzT("Поздравляю! Теперь ты пишешь не просто правильно, а умно. Помни три правила: не делай лишних шагов, не отклоняйся зря, не возвращайся без нужды. Тебя ждут шесть уровней с лимитом блоков. А в следующем уроке Coddy начнёт ошибаться — и ты научишься находить и чинить ошибки. Нажми «Завершить»."), cta: uzT("Завершить") },
]; }

function buildRECAP_RULES() { return [
  uzT("Не делай лишних шагов — считай клетки точно."),
  uzT("Не отклоняйся зря — бери нужное по пути."),
  uzT("Не возвращайся, если не нужно — иди вперёд."),
  uzT("Короче программа — умнее код."),
]; }

// ============================================================
// КОРНЕВОЙ
// ============================================================
export default function CoddyLessonSmartCoddy({ studentName, lang = 'uz', onFinished }) {
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
    const calc = () => { const w = window.innerWidth, h = window.innerHeight; setCell(Math.round(clamp(Math.min(w * 0.115, h * 0.06), 30, 46))); setNarrow(w < 680); };
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
  const needsSolve = ['sandbox', 'predict', 'compare'].includes(slide.kind);
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
    speak(uzT("Урок пройден! Молодец, теперь ты пишешь программы коротко и умно."));
    const gatedKinds = ['sandbox', 'predict', 'compare', 'boss'];
    const gated = SLIDES.map((sl, i) => ({ sl, i })).filter((x) => gatedKinds.includes(x.sl.kind));
    const solved = gated.filter((x) => !!solvedMap[x.i]).length;
    const payload = {
      lessonId: 'coddy_1_5_smart', lessonTitle: uzT("Умный Coddy"), level: 'module1',
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
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, boxShadow: '0 0 0 4px rgba(255,79,40,0.16)' }} />{uzT("Coddy · 1.5 · Оптимизация")}
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
            {slide.kind === 'compare' && <CompareLab data={slide.data} speak={speak} gesture={gesture} onSolved={markSolved} solved={isSolved} narrow={narrow} cell={cell} />}
            {slide.kind === 'sandbox' && <Sandbox key={screen} data={slide.data} speak={speak} gesture={gesture} onSolved={markSolved} solved={isSolved} cell={cell} narrow={narrow} teach={slide.teach} />}
            {slide.kind === 'predict' && <Predict key={screen} data={slide.data} speak={speak} gesture={gesture} onSolved={markSolved} solved={isSolved} cell={cell} narrow={narrow} />}
            {slide.kind === 'recap' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 8 : 14 }}>
                <div>
                  <div style={lbl}>{uzT("Сегодня без новых блоков")}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: narrow ? 6 : 8, alignItems: 'center' }}>
                    <PaletteBlock k="move" /><PaletteBlock k="left" /><PaletteBlock k="right" /><PaletteBlock k="battery" />
                    <span style={{ fontSize: narrow ? 11.5 : 13, fontWeight: 700, color: T.ink3 }}>{uzT("— те же блоки, но теперь умно 🧠")}</span>
                  </div>
                </div>
                <div>
                  <div style={lbl}>{uzT("Что ты освоил")}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: narrow ? 6 : 8 }}>
                    {RECAP_RULES.map((it, i) => (
                      <div key={i} className="frame" style={{ display: 'flex', gap: narrow ? 7 : 10, alignItems: 'center', padding: narrow ? '8px 10px' : '11px 13px' }}>
                        <span style={{ width: narrow ? 20 : 24, height: narrow ? 20 : 24, borderRadius: 7, flexShrink: 0, background: T.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: narrow ? 12 : 14 }}>✓</span>
                        <span style={{ fontSize: narrow ? 12.5 : 14, fontWeight: 600, lineHeight: 1.3 }}>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mentor mentor-coddy" style={{ display: 'flex', gap: 11, alignItems: 'center', padding: narrow ? 9 : 12 }}><Coddy facing="down" mood="wow" size={narrow ? 38 : 44} /><div style={{ fontSize: narrow ? 13.5 : 15.5, fontWeight: 700 }}>{uzT("Спасибо тебе! Теперь Coddy пишет коротко и умно.")}</div></div>
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
            <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 'clamp(26px,6vw,40px)', color: T.ink }}>{studentName ? displayName + ', ' + lcFirst(uzT("Урок пройден! 🧠")) : uzT("Урок пройден! 🧠")}</div>
            <div style={{ fontSize: 16, color: T.ink2, maxWidth: 420 }}>{uzT("Ты научился писать программы коротко и умно. Так держать, оптимизатор!")}</div>
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

