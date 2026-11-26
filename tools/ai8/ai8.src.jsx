// =============================================================================
// МОДУЛЬ «ИИ» · Урок 8 — «Финальный ИИ-проект» (final: true, практики нет)
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 12.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai8/build.mjs → lessons/ai/08-final-proekt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 8 · «Финальный ИИ-проект» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика: вся формула, свой сайт). Повторение всего модуля одним сайтом: школа просит сайт
// фестиваля роботов. Коди пишет одну строку «festival sayti» и жмёт «Отправить»: ИИ делает чужой фестиваль, всё —
// догадки. Ученик собирает промпт по формуле — семь станций, по одной на урок 1–6 (каждая берёт кусок из письма
// клиента), потом второй промпт (урок 7), большая проверка, свой сайт по всей формуле и его улучшение.
// Загадка (без имён): Коди думает, что главную работу делает ИИ — человеку остаётся нажать кнопку. Разгадка: главную
// работу делает человек — думает, пишет точно, проверяет и улучшает; ИИ — помощник.
//
// ДУГА (17 экранов):
//   s1 крючок (одна строка «festival sayti» → чужой фестиваль, «Taxmin»; загадка)
//   map показ: семь вопросов формулы и второй промпт загораются по очереди
//   станции: st1 «Nima?» (пишет) · st2 «Nega?» (выбор с живым сайтом) · st3 «Kim uchun?» (пишет) ·
//            st4 «Ichida nima?» (пишет) · st5 «Ko'rinishi?» (выбор с живым сайтом) · st6 «Qanday ishlaydi?» (пишет,
//            курсор показывает) · st7 «Qoidalar?» (пишет)
//   big показ: одна строка Коди → полный промпт, сайт растёт на глазах · st8 второй промпт (savol-javob, qolganini
//            o'zgartirma)
//   проверка: which (на какой вопрос отвечает фраза) · det (какой строки не хватает сайту)
//   свой: own (все семь строк) · ownfix (второй промпт к своему сайту)
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт и сайт, конец модуля.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite) и правки (tools/ai7/ai7-fix.jsx). Станция N показывает сайт так,
//     как в уроке N: строки дальше ещё не написаны.
//   · Узбекский — по /uzbekcha; в речи нет цифр и символов (номера только на экране).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-08-final-proekt',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '8-dars. Yakuniy loyiha',
    ru: 'Урок 8. Финальный ИИ-проект',
    en: 'Lesson 8. The final AI project'
  }
};
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  hw: L3('Uyga vazifa', 'Домашнее задание', 'Homework'),
  copy: L3('Nusxalash', 'Копировать', 'Copy'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  finish: L3('Modulni tugatish', 'Завершить модуль', 'Finish the module'),
  modDone: L3("Modul tugadi! Endi siz sun'iy intellekt bilan sayt yaratasiz", 'Модуль пройден! Теперь ты делаешь сайты вместе с ИИ', 'Module complete! Now you build sites with the AI'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};
const BUY = L3('Mijoz', 'Клиент', 'Client');
const STATION = L3('{n}/7 · {q}', '{n}/7 · {q}', '{n}/7 · {q}');
// Сайт фестиваля роботов: правильные строки (образцы станций).
const FEST = {
  what: L3('Robotlar festivali sayti', 'Фестиваль роботов', 'Robot festival'),
  why: L3("bolalar festivalga ro'yxatdan o'tsin", 'чтобы дети записывались на фестиваль', 'get kids to sign up for the festival'),
  who: L3("10–14 yoshli o'quvchilar va ularning ota-onalari", 'школьники 10–14 лет и их родители', 'students aged 10–14 and their parents'),
  inside: L3('jadval, rasmlar, aloqa', 'расписание, фото, контакты', 'schedule, photos, contact'),
  look: L3("zamonaviy, ko'k va oq", 'современный, синий и белый', 'modern, blue and white'),
  beh: L3('tugma ustiga kelganda kattalashsin', 'кнопка увеличивается при наведении', 'the button grows on hover'),
  rules: L3("majburiy: telefon +998 90 250 25 25, reklama oynasi va chegirma bo'lmasin", 'обязательно: телефон +998 90 250 25 25, без рекламного окна и скидок', 'must: phone +998 90 250 25 25, no pop-up window or discount')
};
const KODI_LINE = L3('festival sayti', 'фестиваль', 'festival');
// Общие ответы проверки (как в уроках модуля).
const M8 = {
  empty: L3("Qator hali bo'sh. Mijozning xabarini o'qing-da, u nima deganini yozing.", 'Напиши строку: что сказал клиент?', 'Write the line: what did the client say?'),
  fixEmpty: L3("Ikkinchi prompt hali bo'sh turibdi. Nimani va qanday o'zgartirishni yozing.", 'Напиши промпт: что и как изменить?', 'Write the prompt: what to change and how?'),
  vague: L3("«Yaxshiroq» so'zidan sun'iy intellekt nimani tuzatishni bilolmaydi. Aniq yozing: nimani va qanday o'zgartiramiz?", 'Что значит «лучше», ИИ не знает. Напиши точно: что и как изменить.', 'The AI doesn’t know what “better” means. Be precise: what to change and how.'),
  none: L3("Sun'iy intellekt bu so'zlardan hech qanday tuzatishni tushunmadi. Masalan, «tugmani kattaroq qil» deb yozib ko'ring.", 'ИИ не понял, что исправить. Например: сделай кнопку больше.', 'The AI didn’t understand what to fix. For example: make the button bigger.'),
  guess: L3("Nimani o'zgartirish yozilgan-u, qanday qilish aytilmagan. Sun'iy intellekt o'zicha taxmin qilib qo'ydi. U qanday bo'lishi kerak?", 'Что изменить — написано, а как — нет. ИИ угадал сам. Каким это должно стать?', 'You said what to change, but not how. The AI guessed. How should it be?'),
  keep: L3("Qarang, sun'iy intellekt boshqa narsalarni ham o'zgartirib yuboribdi: rang, sarlavha, tartib! Promptning oxiriga «qolganini o'zgartirma» deb qo'shing.", 'Смотри, ИИ поменял и другое: цвет, заголовок, порядок! Допиши в конце «остальное не меняй».', 'Look, the AI changed other things too: the colour, the title, the order! Add “don’t change anything else” at the end.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// варианты, строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Yakuniy loyiha', 'Финальный проект', 'Final project'),
    card: { h: BUY, t: L3("«Salom! Maktabimizda robotlar festivali bo'ladi. Bizga sayt kerak. Hammasini xabarlarda yozib beraman.»", '«Здравствуйте! В нашей школе будет фестиваль роботов. Нам нужен сайт. Всё подробно напишу в сообщениях».', '“Hello! Our school is holding a robot festival. We need a site. I’ll write all the details in messages.”') },
    seen: { h: BUY, t: L3("«Bu qaysi festival? Robotlar qani? Ro'yxatdan o'tish ham yo'q, ranglarimiz ham boshqa!»", '«Это какой фестиваль? Где роботы? И записаться нельзя, и цвета не наши!»', '“Which festival is this? Where are the robots? There’s no sign-up, and the colours aren’t ours!”') },
    say: L3("Salom! Bugun yakuniy loyiha, men esa bir oz dam olmoqchiman! Maktab robotlar festivali uchun sayt so'radi. Sun'iy intellekt juda aqlli-ku, shuning uchun bitta qator yozdim, xolos: «festival sayti». Qolganini u o'zi qiladi, men esa choy ichib o'tiraman! Qani, «Yuborish»ni bosing.",
      'Привет! Сегодня финальный проект! Школа просит сайт для фестиваля роботов. ИИ очень умный, я написал всего одну строку: фестиваль. Остальное он сделает сам! Нажми «Отправить».',
      'Hi! Today is the final project! A school wants a site for its robot festival. The AI is really smart, so I wrote just one line: festival. It’ll do the rest! Tap “Send”.'),
    magic: L3("Voy, bu qaysi festival bo'ldi? Sun'iy intellekt allaqanday boshqa bayramni yasabdi: robotlar yo'q, ro'yxatdan o'tish yo'q, ranglarni ham o'zicha tanlabdi. Qarang, hamma joyda «Taxmin» belgisi turibdi!",
      'Ого! ИИ сделал какой-то другой фестиваль. Ни роботов, ни записи, и цвета он выбрал сам. Смотри, везде «Догадка».',
      'Whoa! The AI made some other festival. No robots, no sign-up, and it picked the colours itself. Look, “Guess” everywhere.'),
    done: L3("Balki sun'iy intellekt bugun charchagandir? Baribir o'z fikrimda qolaman: asosiy ishni u qiladi, menga faqat tugmani bosish qoladi. Siz mening o'rnimda bo'lsangiz-chi, bugun ham choy ichib o'tirarmidingiz? Keling, festival saytini butun formula bilan to'g'ri yig'amiz, kim haq ekani o'shanda bilinadi.",
      'По-моему, главную работу делает ИИ, а мне остаётся только нажать кнопку. А ты как думаешь? Давай сегодня соберём сайт фестиваля правильно, по всей формуле.',
      'I think the AI does the main work, and all I do is press the button. What do you think? Today let’s build the festival site properly, with the whole formula.'),
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3('Bitta qator yetmadi', 'Одной строки не хватило', 'One line wasn’t enough')
  },
  map: {
    eyebrow: L3('Formula', 'Формула', 'The formula'),
    help: [
      L3("Promptdagi yettita savolga qarang-chi: ular bittalab yonib boryapti.", 'Посмотри на семь вопросов промпта: они загораются по очереди.', 'Look at the seven questions of the prompt: they light up one by one.'),
      L3("Mana shu yettita savol birgalikda formula deyiladi. Har bir savol saytga o'zining bir bo'lagini qo'shadi.", 'Формула — это семь вопросов хорошего промпта. Каждый даёт свою часть сайта.', 'The formula means the seven questions of a good prompt. Each gives its own part of the site.'),
      L3("Uy qurishdan oldin uning rejasini chizishadi: nechta xona bo'ladi, qaysi rangda, eshik qayerda turadi. Prompt ham saytning xuddi shunday rejasi bo'ladi.", 'Перед стройкой дома рисуют план: сколько комнат, какой цвет, где дверь. Промпт — тоже план сайта.', 'Before building a house you draw a plan: how many rooms, which colour, where the door goes. A prompt is a site plan too.')
    ],
    say: L3("Ishni boshlashdan oldin bir narsani eslab olaylik. Yaxshi promptda yettita savol bo'lishi esingizdami? Qani, ularni bittalab eslaymiz.", 'Помнишь, в хорошем промпте семь вопросов. Вспомним их по одному.', 'Remember, a good prompt has seven questions. Let’s recall them one by one.'),
    says: [
      L3("Birinchi bo'lib «Nima?» savoli keladi. U qanaqa sayt yasayotganimizni aniq aytib beradi.", 'Первый — что? То есть какой именно сайт.', 'The first: what? That is, exactly what site.'),
      L3("Undan keyin «Nega?» so'raydi: sayt nima qilishi kerak? Odamlar ro'yxatdan o'tsinmi, buyurtma bersinmi yoki qo'ng'iroq qilsinmi?", 'Второй — зачем? Что должен сделать сайт: записать, принять заказ или звонок.', 'The second: why? What the site should do: sign-ups, orders or calls.'),
      L3("Uchinchi o'rinda «Kim uchun?» turadi. U saytni kimlar ko'rishini va ular necha yoshda ekanini so'raydi.", 'Третий — для кого? Кто будет смотреть сайт, какого возраста.', 'The third: who for? Who will look at the site, and how old they are.'),
      L3("To'rtinchi bo'lib «Ichida nima?» keladi. U saytda qaysi bloklar bo'lishini va ular qanday tartibda turishini aytadi.", 'Четвёртый — что внутри? Какие блоки и в каком порядке.', 'The fourth: what’s inside? Which blocks and in what order.'),
      L3("Beshinchi savol «Ko'rinishi?» bo'ladi: unga uslub, ranglar va shrift yoziladi.", 'Пятый — как выглядит. Стиль, цвета и шрифт.', 'The fifth: how it looks. Style, colours and font.'),
      L3("Oltinchi savol «Qanday ishlaydi?» saytni jonlantiradi: qachon, nima bilan va nima bo'lishini shu yerga yozamiz.", 'Шестой — как ведёт себя? Когда, что и что происходит.', 'The sixth: how it behaves? When, what and what happens.'),
      L3("Nihoyat, yettinchi savol «Qoidalar?» keladi: unda nima albatta bo'lishi shart-u, nima mumkin emasligi yoziladi.", 'Седьмой — правила. Что обязательно и что нельзя.', 'The seventh: rules. What is a must and what is not allowed.')
    ],
    done: L3("Oxirida esa natijani tekshirib, ikkinchi prompt bilan yaxshilaymiz. Xo'sh, festival saytini yig'ishga tayyormisiz? Yo'limizda yettita bekat bor, har bir savol bitta bekat bo'ladi.", 'А в конце проверяем результат и улучшаем вторым промптом. Ну что, собираем сайт фестиваля! Каждый вопрос — одна станция.', 'And at the end we check the result and improve it with a second prompt. Let’s build the festival site! Each question is one station.'),
    asks: [L3("Qarang: Kodining bitta qatori", 'Смотри: одна строка Коди', 'Watch: Kodi’s one line'), L3('Qarang: Nima?', 'Смотри: Что?', 'Watch: What?'), L3('Qarang: Nega?', 'Смотри: Зачем?', 'Watch: Why?'), L3('Qarang: Kim uchun?', 'Смотри: Для кого?', 'Watch: For whom?'),
      L3('Qarang: Ichida nima?', 'Смотри: Что внутри?', 'Watch: What’s inside?'), L3("Qarang: Ko'rinishi?", 'Смотри: Как выглядит?', 'Watch: How it looks?'), L3('Qarang: Qanday ishlaydi?', 'Смотри: Как ведёт себя?', 'Watch: How it behaves?'), L3('Qarang: Qoidalar?', 'Смотри: Какие правила?', 'Watch: What rules?')],
    askDone: L3('Yettita savol: sayt rejasi', 'Семь вопросов — план сайта', 'Seven questions: the site plan')
  },
  st1: {
    card: { h: BUY, t: L3("«Bizda robotlar festivali bo'ladi, sayt aynan shu festival haqida.»", '«У нас будет фестиваль роботов, сайт — именно про него».', '“We’re holding a robot festival, and the site is about exactly that.”') },
    say: L3("Birinchi bekatga yetib keldik, bu yerda «Nima?» savoli turibdi. Mijozning xabarini o'qing-chi: ular qanaqa festival haqida yozyapti? Mening «festival sayti» degan qatorimni aniqroq qilib yozing.", 'Первая станция — что? Какой сайт просит клиент? Напиши строку точнее, чем «фестиваль» у Коди.', 'The first station: what? Which site does the client want? Write the line more precisely than Kodi’s “festival”.'),
    ph: L3('qanday sayt?', 'какой сайт?', 'what site?'),
    msgs: { robot: L3("Qaysi festival ekan? Mijoz aynan robotlar festivali haqida yozgan.", 'Какой фестиваль? Клиент сказал: фестиваль роботов.', 'Which festival? The client said: a robot festival.') },
    hints: [
      L3("Mijoz qanaqa festival haqida yozgan ekan?", 'О каком фестивале написал клиент?', 'Which festival did the client write about?'),
      L3("«Festival» so'zining oldiga «robotlar» so'zini qo'shing.", 'Добавь к слову «фестиваль» слово «роботов».', 'Add the word “robot” to the word “festival”.'),
      L3("Namuna ham chiqdi: unda festival qanaqaligi aniq aytilgan. Shu so'zlarni qatorga yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    ok: L3("Zo'r! Endi bu aynan robotlar festivali bo'ldi, sun'iy intellekt qanaqa sayt kerakligini bilib oldi.", 'Огонь! Теперь это именно фестиваль роботов. ИИ знает, какой нужен сайт.', 'Awesome! Now it’s exactly a robot festival. The AI knows what site is needed.'),
    ask: L3('«Nima?» qatorini yozing', 'Напиши строку «Что?»', 'Write the “What?” line')
  },
  st2: {
    card: { h: BUY, t: L3("«Joylar soni cheklangan, shuning uchun bolalar oldindan yozilishi kerak.»", '«Мест немного, поэтому дети должны записаться заранее».', '“Places are limited, so kids need to sign up in advance.”') },
    say: L3("Keyingi bekatda bizni «Nega?» kutib turibdi. Sayt aslida nimaga kerak, u nima qilishi kerak? Mijozning gapini o'qing-da, mos qatorni tanlang.", 'Вторая станция — зачем? Что должен сделать сайт? Прочитай слова клиента и выбери строку.', 'The second station: why? What should the site do? Read the client’s words and pick the line.'),
    ask: L3("«Nega?» qatorini tanlang", 'Выбери строку «Зачем?»', 'Pick the “Why?” line'),
    hint1: L3("Mijozning gapiga qarang-chi: bolalar nima qilishi kerak ekan?", 'Что, по словам клиента, должны сделать дети?', 'What does the client want the kids to do?'),
    hint2: L3("Mijoz «yozilishi kerak» deyapti. Bu saytda ro'yxatdan o'tish bo'lishi kerak, degani.", '«Должны записаться» — значит, нужна запись.', '“Need to sign up” means sign-up.'),
    items: [{ a: L3('odamlar festival qachon va qayerdaligini bilsin', 'чтобы люди узнали, когда и где фестиваль', 'people learn when and where the festival is'), b: FEST.why, c: L3("sayt chiroyli bo'lsin", 'чтобы сайт был красивым', 'the site looks pretty'), right: 'b',
      why: L3("Mijoz bolalarning oldindan yozilishini so'radi, shuning uchun saytda ro'yxatdan o'tish tugmasi bilan formasi bo'lishi kerak.", 'Клиент просил запись: на сайте нужны кнопка и форма записи.', 'The client asked for sign-ups: the site needs a sign-up button and form.') }],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Ajoyib! Endi saytning maqsadi aniq: bolalar festivalga ro'yxatdan o'tadi.", 'Класс! Цель ясна: дети записываются.', 'Great! The goal is clear: kids sign up.')
  },
  st3: {
    card: { h: BUY, t: L3("«Festivalga 10–14 yoshli o'quvchilar keladi, ko'pchiligi ota-onasi bilan.»", '«На фестиваль придут школьники 10–14 лет, многие — с родителями».', '“Students aged 10–14 will come, many of them with their parents.”') },
    say: L3("Uchinchi bekatdagi savol odamlar haqida bo'ladi: «Kim uchun?». Festival saytini kimlar ochib ko'radi? Mijozning xabaridan ularning yoshini va kimligini topib, qatorga yozing.", 'Третья станция — для кого? Кто будет смотреть сайт? Напиши возраст и кто они.', 'The third station: who for? Who will look at the site? Write their age and who they are.'),
    ph: L3('sayt kim uchun?', 'для кого сайт?', 'who is it for?'),
    msgs: {
      all: L3("«Hamma uchun» deb yozsangiz, sun'iy intellekt saytni kimga moslashni bilmay qoladi. Mijoz aynan kimlarni aytgan edi?", 'Если написать «для всех», ИИ не знает, под кого подстроиться. Кого назвал клиент?', 'If you write “for everyone”, the AI doesn’t know who to suit. Who did the client name?'),
      age: L3("Yoshini ham yozing: mijoz o'n yoshdan o'n to'rt yoshgacha degan.", 'Напиши возраст: клиент сказал 10–14 лет.', 'Write the age: the client said 10–14.'),
      par: L3("Ota-onalarni ham qo'shing, chunki saytni ular ham ko'radi.", 'Допиши и родителей: они тоже будут смотреть сайт.', 'Add the parents too: they’ll look at the site as well.')
    },
    hints: [
      L3("Mijozning xabarida ikki xil odam bor, topa olasizmi?", 'Клиент назвал два вида людей.', 'The client named two kinds of people.'),
      L3("Biri o'quvchilar, ularning yoshi bilan, ikkinchisi esa ularning ota-onalari.", 'Возраст школьников и их родители.', 'The students’ age, and their parents.'),
      L3("Promptning tagida namuna turibdi, unda yosh ham, ota-onalar ham bor. Shuni yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    ok: L3("Ana, ko'rdingizmi? Saytda ota-onalar uchun alohida bo'lim ham paydo bo'ldi!", 'Огонь! Смотри, появился и раздел для родителей.', 'Awesome! Look, a section for parents appeared too.'),
    ask: L3('«Kim uchun?» qatorini yozing', 'Напиши строку «Для кого?»', 'Write the “For whom?” line')
  },
  st4: {
    card: { h: BUY, t: L3("«Saytda festival jadvali, robotlar rasmlari va biz bilan aloqa bo'lsin.»", '«На сайте нужны расписание фестиваля, фото роботов и контакты».', '“The site needs the festival schedule, robot photos and our contacts.”') },
    say: L3("Yo'lning yarmidan o'tdik! To'rtinchi bekatda «Ichida nima?» savoliga javob beramiz: mijoz saytda qaysi bloklarni so'radi? Ularni xabardagi tartib bilan yozing.", 'Четвёртая станция — что внутри? Какие блоки просит клиент? Напиши их по порядку.', 'The fourth station: what’s inside? Which blocks does the client want? Write them in order.'),
    ph: L3('qanday bloklar?', 'какие блоки?', 'which blocks?'),
    msgs: {
      none: L3("Sun'iy intellekt bu yerda birorta blokni tanimadi. Masalan, shunday yozing: jadval, rasmlar, aloqa.", 'ИИ не узнал блоков. Например: расписание, фото, контакты.', 'The AI didn’t recognise any blocks. For example: schedule, photos, contact.'),
      schedule: L3("Jadval tushib qolibdi. Mijoz festival jadvalini ham so'ragan edi.", 'Нет расписания. Клиент просил расписание фестиваля.', 'There’s no schedule. The client asked for the festival schedule.'),
      gallery: L3("Rasmlar yo'q-ku. Robotlarning rasmlari ham xabarda bor edi.", 'Нет фото. Клиент просил фото роботов.', 'There are no photos. The client asked for robot photos.'),
      contact: L3("Aloqa bloki yo'q ekan. Mijoz «biz bilan aloqa bo'lsin» degan edi.", 'Нет контактов. Клиент просил контакты.', 'There’s no contact block. The client asked for one.')
    },
    hints: [
      L3("Mijoz xabarida uchta blokni aytgan, sanab ko'ring-chi.", 'Клиент назвал три блока.', 'The client named three blocks.'),
      L3("Jadval, rasmlar va aloqa: ularni vergul bilan ajratib yozing.", 'Расписание, фото и контакты — через запятую.', 'Schedule, photos and contact — with commas.'),
      L3("Namunaga qarang: uchala blok vergul bilan ajratilgan. Xuddi shu tartibda yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    ok: L3("Barakalla! Uchala blok ham joyida, tartibi ham xuddi mijoz aytgandek!", 'Молодец! Три блока, в том порядке, как сказал клиент.', 'Well done! Three blocks, in the order the client said.'),
    ask: L3('«Ichida nima?» qatorini yozing', 'Напиши строку «Что внутри?»', 'Write the “What’s inside?” line')
  },
  st5: {
    card: { h: BUY, t: L3("«Maktabimiz ranglari ko'k va oq. Sayt zamonaviy ko'rinsin.»", '«Цвета нашей школы — синий и белый. Сайт должен выглядеть современно».', '“Our school colours are blue and white. The site should look modern.”') },
    say: L3("Beshinchi bekatda sayt kiyinadi: bu yerda «Ko'rinishi?» savoli bor. Uchta qatordan qaysi biri mijozga mos keladi? Birini tanlang-da, sayt qanday bo'lishiga qarang.", 'Пятая станция — как выглядит. Какая из трёх строк подходит клиенту? Выбери и посмотри на сайт.', 'The fifth station: how it looks. Which of the three lines fits the client? Pick one and look at the site.'),
    ask: L3("«Ko'rinishi?» qatorini tanlang", 'Выбери строку «Как выглядит?»', 'Pick the “How it looks?” line'),
    hint1: L3("Mijozning xabarida qaysi ranglar va qanday uslub bor?", 'Какие цвета и какой стиль назвал клиент?', 'Which colours and style did the client name?'),
    hint2: L3("«Chiroyli» degan so'z sun'iy intellektga hech narsa demaydi. Ranglar esa mijozniki bo'lishi kerak.", '«Красиво» ничего не говорит ИИ. Цвета должны быть клиента.', '“Pretty” tells the AI nothing. The colours must be the client’s.'),
    items: [{ a: L3("chiroyli bo'lsin", 'пусть будет красиво', 'make it pretty'), b: L3("qorong'i, neon, qizil", 'тёмный, неон, красный', 'dark, neon, red'), c: FEST.look, right: 'c',
      why: L3("Mijozga zamonaviy uslub hamda maktab ranglari, ko'k bilan oq kerak.", 'Современный, синий и белый — как цвета школы.', 'Modern, blue and white — just like the school colours.') }],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Juda zo'r! Endi festival sayti maktabning o'z ranglarida turibdi.", 'Огонь! Теперь сайт в цветах школы.', 'Awesome! Now the site is in the school colours.')
  },
  st6: {
    card: { h: BUY, t: L3("«Ro'yxatdan o'tish tugmasi ko'zga tashlansin: sichqoncha kelganda kattalashsin.»", '«Кнопка записи должна бросаться в глаза: пусть увеличивается, когда наводишь мышь».', '“The sign-up button should stand out: make it grow when the mouse is over it.”') },
    say: L3("Oltinchi bekatda sayt jonlanadi: endi «Qanday ishlaydi?» savoliga javob yozamiz. Qachon, nima bilan va nima bo'ladi? Buni mijozning xabaridan olib yozing.", 'Шестая станция — как ведёт себя? Когда, что и что происходит? Напиши по словам клиента.', 'The sixth station: how it behaves? When, what and what happens? Write it from the client’s words.'),
    ph: L3("nima bo'ladi?", 'что происходит?', 'what happens?'),
    msgs: {
      vague: L3("Bunday so'zlardan sun'iy intellekt aniq nima bo'lishini bilolmaydi. Qachon, nima bilan va nima bo'lishini yozing.", 'Эти слова не называют точный случай. Когда, что и что происходит?', 'Those words don’t name an exact case. When, what and what happens?'),
      hover: L3("«Qachon» yozilmay qolibdi. Mijoz «sichqoncha kelganda» degan edi.", 'Нет «когда». Клиент: при наведении мыши.', 'There’s no “when”. The client said: on mouse hover.'),
      grow: L3("Tugma kattalashmayapti-ku. Mijoz «kattalashsin» deb so'ragan.", 'Кнопка не растёт. Клиент: пусть увеличивается.', 'The button doesn’t grow. The client said: make it grow.')
    },
    hints: [
      L3("Uchta savolga javob toping. Qachon? Sichqoncha kelganda. Nima? Tugma. Nima bo'ladi? U kattalashadi.", 'Когда: при наведении. Что: кнопка. Что происходит: увеличивается.', 'When: on hover. What: the button. What happens: it grows.'),
      L3("Qatorga shunday yozish mumkin: «tugma ustiga kelganda kattalashsin».", 'Кнопка увеличивается при наведении.', 'The button grows on hover.'),
      L3("Pastda tayyor namuna paydo bo'ldi. Uni qatorga ko'chiring-da, «Yuborish»ni bosing, kursor tugmani o'zi sinab ko'radi.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    ok: L3("Ajoyib! Kursor tugmaga yaqinlashdi-yu, tugma kattalashib ketdi!", 'Класс! Смотри, курсор подъехал к кнопке, и она выросла.', 'Great! Look, the cursor reached the button and it grew.'),
    ask: L3("«Qanday ishlaydi?» qatorini yozing", 'Напиши строку «Как ведёт себя?»', 'Write the “How it behaves?” line')
  },
  st7: {
    card: { h: BUY, t: L3("«Telefonimiz +998 90 250 25 25. Reklama oynasi ham, chegirma ham kerak emas: festival bepul!»", '«Наш телефон +998 90 250 25 25. Не нужны ни рекламное окно, ни скидки: фестиваль бесплатный!»', '“Our phone is +998 90 250 25 25. We need no pop-up window and no discount: the festival is free!”') },
    say: L3("Oxirgi bekat ham ko'rinib qoldi: «Qoidalar?». Saytda nima albatta bo'lishi kerak-u, nima bo'lmasligi kerak? Mijozning xabaridan topib, qatorga yozing.", 'Седьмая станция — правила. Что обязательно и что нельзя? Найди в сообщении клиента.', 'The seventh station: rules. What’s a must and what’s not allowed? Find it in the client’s message.'),
    ph: L3('majburiy? mumkin emas?', 'обязательно? нельзя?', 'must? not allowed?'),
    msgs: {
      empty: L3("Qator hali bo'sh turibdi. Nima majburiy-u, nima mumkin emas, shuni yozing.", 'Напиши: что обязательно и что нельзя?', 'Write what is a must and what is not allowed.'),
      vague: L3("Bunday so'zlar sun'iy intellektga hech narsa aytmaydi. Aniqroq yozib ko'ring.", 'Эти слова ничего не говорят ИИ. Напиши точно.', 'Those words tell the AI nothing. Be precise.'),
      phone: L3("Telefon raqami yo yo'q, yo boshqacha. Mijozning raqamini xabardan aniq ko'chirib yozing.", 'Номера нет или он другой. Напиши номер клиента точно.', 'The number is missing or different. Write the client’s number exactly.'),
      popup: L3("Reklama oynasi hali ham chiqib turibdi. Mijoz esa u kerak emas, degan.", 'Рекламное окно ещё на месте. Клиент: не нужно.', 'The pop-up window is still there. The client said: not needed.'),
      sale: L3("Chegirma hamon o'z joyida. Festival-ku bepul, unga chegirma nimaga kerak?", 'Скидка ещё на месте. Фестиваль бесплатный!', 'The discount is still there. The festival is free!')
    },
    hints: [
      L3("Xabarda uchta narsa bor: telefon raqami, reklama oynasi va chegirma.", 'В сообщении три вещи: номер, рекламное окно и скидка.', 'The message has three things: the number, the pop-up window and the discount.'),
      L3("Raqam albatta bo'lishi kerak, reklama oynasi bilan chegirma esa bo'lmasin.", 'Номер — обязательно. Рекламного окна и скидок быть не должно.', 'The number is a must. No pop-up window and no discount.'),
      L3("Namunada raqam ham, ikkala «bo'lmasin» ham bor. Raqamni adashtirmay yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    ok: L3("Qoyil! Raqam haqiqiy, na reklama bor, na chegirma. Yettita qatorning hammasi tayyor!", 'Молодец! Номер настоящий, ни рекламы, ни скидки. Все семь строк готовы!', 'Well done! The number is real, no ads, no discount. All seven lines are ready!'),
    ask: L3("«Qoidalar?» qatorini yozing", 'Напиши строку «Какие правила?»', 'Write the “What rules?” line')
  },
  big: {
    eyebrow: L3('Bitta qator va yettita', 'Одна строка и семь', 'One line and seven'),
    help: [
      L3("Prompt qatorlarini o'qing, keyin saytdagi belgilarni toping.", 'Посмотри на строки промпта и на метки на сайте.', 'Look at the prompt lines and at the labels on the site.'),
      L3("Har bir belgi saytning shu qismini qaysi savol berganini ko'rsatib turadi.", 'Каждая метка показывает, какой вопрос дал эту часть сайта.', 'Each label shows which question gave that part of the site.'),
      L3("Tort pishirganda retseptdagi har bir masalliq muhim. Shakarni unutsangiz, tort shirin chiqmaydi. Promptda ham bitta savolni tashlab ketsangiz, saytning o'sha qismini sun'iy intellekt taxmin qilib qo'yadi.", 'В рецепте торта важен каждый продукт. Забудешь сахар — торт не будет сладким.', 'Every ingredient matters in a cake recipe. Forget the sugar, and the cake won’t be sweet.')
    ],
    say: L3("Yettita bekatdan o'tdik, choyimga hatto qo'l ham tegmadi! Endi solishtirib ko'ramiz: mening bitta qatorimdan boshlaymiz, keyin sizning qatorlaringizni bittalab qo'shib boramiz. Sayt qanday o'sishini kuzatib turing.", 'Теперь сравним. Начнём с одной строки Коди и добавим твои семь строк по очереди. Смотри, как растёт сайт.', 'Now let’s compare. We start from Kodi’s one line and add your seven lines one by one. Watch the site grow.'),
    says: [
      L3("Oldin «Nima?» bilan «Nega?» qatorlarini qo'shdik. Sayt robotlar festivaliga aylandi, ro'yxatdan o'tish ham paydo bo'ldi. Endi bu chindan bizning festival!", 'Что и зачем: фестиваль роботов и запись. Теперь это наш фестиваль.', 'What and why: a robot festival and sign-ups. Now it’s our festival.'),
      L3("Keyin «Kim uchun?» bilan «Ichida nima?» qo'shildi. Ular saytga ota-onalar bo'limini, jadvalni, rasmlarni va aloqani olib keldi.", 'Для кого и что внутри: раздел для родителей, расписание, фото и контакты.', 'Who for and what’s inside: a parents’ section, the schedule, photos and contact.'),
      L3("«Ko'rinishi?» bilan «Qanday ishlaydi?» esa saytni maktab ranglariga bo'yadi, tugmani kattalashadigan qildi.", 'Как выглядит и как ведёт себя: цвета школы и растущая кнопка.', 'How it looks and how it behaves: the school colours and a growing button.'),
      L3("Oxirida «Qoidalar?» qo'shildi: haqiqiy raqam turibdi, reklama esa yo'q. Ko'rdingizmi, bitta qatordan butun boshli sayt o'sib chiqdi!", 'И правила: настоящий номер, никакой рекламы. Из одной строки вырос целый сайт!', 'And the rules: the real number, no ads. One line grew into a whole site!')
    ],
    done: L3("Demak, har bir savol saytga o'z bo'lagini qo'shar ekan. Bittasini tashlab ketsangiz, o'sha bo'lakni sun'iy intellekt taxmin qilib qo'yadi.", 'Значит, каждый вопрос даёт сайту свою часть. Пропустишь один — ИИ будет угадывать.', 'So every question gives the site its own part. Skip one, and the AI will guess it.'),
    asks: [L3("Qarang: bitta qator", 'Смотри: одна строка', 'Watch: one line'), L3('Qarang: nima va nega', 'Смотри: что и зачем', 'Watch: what and why'), L3('Qarang: kim uchun va ichida nima', 'Смотри: для кого и что внутри', 'Watch: who for and what’s inside'),
      L3("Qarang: ko'rinishi va qanday ishlaydi", 'Смотри: как выглядит и как ведёт себя', 'Watch: how it looks and behaves'), L3('Qarang: qoidalar', 'Смотри: правила', 'Watch: the rules')],
    askDone: L3("Yettita savol: to'liq sayt", 'Семь вопросов — целый сайт', 'Seven questions: a whole site')
  },
  st8: {
    eyebrow: L3('Ikkinchi prompt', 'Второй промпт', 'The second prompt'),
    card: { h: BUY, t: L3("«Sayt ajoyib! Faqat savol-javob bloki ham kerak. Qolganiga tegmang.»", '«Сайт отличный! Нужен только ещё блок вопросов и ответов. Остальное не трогайте».', '“The site is great! We just need a FAQ block too. Don’t touch the rest.”') },
    say: L3("Maktabdan yana xabar keldi: sayt ularga juda yoqibdi, faqat bitta narsa yetishmayapti. Ikkinchi promptni yozing: nima qo'shilsin va qolgani o'zgarmasin.", 'Клиент посмотрел сайт и попросил ещё одно. Напиши второй промпт: что добавить и чтобы остальное не менялось.', 'The client saw the site and asked for one more thing. Write the second prompt: what to add, and that the rest stays the same.'),
    ph: L3("nimani o'zgartiramiz?", 'что изменить?', 'what to change?'),
    msgs: { faq: L3("Savol-javob bloki qo'shilmay qoldi, maktab esa aynan shuni kutyapti.", 'Блок вопросов и ответов не добавился. Клиент просил его.', 'The FAQ block wasn’t added. The client asked for it.') },
    hints: [
      L3("Ikki narsani o'ylang: nima qo'shiladi-yu, qolganiga nima bo'ladi?", 'Что добавить и что будет с остальным?', 'What to add, and what happens to the rest?'),
      L3("«Savol-javob blokini qo'sh» deb yozing, keyin «qolganini o'zgartirma»ni qo'shing.", 'Добавь блок вопросов и ответов, остальное не меняй.', 'Add a FAQ block, don’t change anything else.'),
      L3("Ikkinchi promptning namunasi pastda. Uni yozib chiqing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("savol-javob blokini qo'sh, qolganini o'zgartirma", 'добавь блок вопросов и ответов, остальное не меняй', 'add a FAQ block, don’t change anything else'),
    ok: L3("Ish bitdi! Savol-javob qo'shildi, qolgani joy-joyida. Festival sayti tayyor!", 'Огонь! Вопросы и ответы добавились, остальное на месте. Сайт фестиваля готов!', 'Awesome! The FAQ was added, and the rest stays. The festival site is ready!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  which: {
    eyebrow: L3('Qaysi savol?', 'Какой вопрос?', 'Which question?'),
    say: L3("Endi formulani qanchalik yaxshi bilishingizni sinab ko'ramiz. Kartochkada promptdan bitta qator turadi. Uni o'qing-da, bu qator qaysi savolga javob berishini tanlang.", 'Теперь большая проверка. Я называю строку промпта, а ты выбираешь: на какой вопрос она отвечает?', 'Now the big check. I name a prompt line, and you choose: which question does it answer?'),
    card: L3('Prompt qatori', 'Строка промпта', 'Prompt line'),
    ask: L3('Savolni tanlang', 'Выбери вопрос', 'Pick the question'),
    hint1: L3("Qator nima haqida gapiryapti: sayt kim uchunligi, qanday ko'rinishi yoki nima bo'lishi haqidami?", 'О чём строка: для кого сайт, как выглядит или что происходит?', 'What’s the line about: who it’s for, how it looks or what happens?'),
    hint2: L3("Ikkita savolni adashtirmang: qachon va nima bo'lishi «Qanday ishlaydi?» savoliga kiradi. Nima majburiy-u, nima mumkin emasligi esa «Qoidalar?» savoliga yoziladi.", 'Вспомни: «когда и что происходит» — это поведение; «обязательно и нельзя» — правила.', 'Remember: “when and what happens” is behaviour; “must and not allowed” is rules.'),
    items: [
      { t: L3("tugma ustiga kelganda rangi o'zgarsin", 'кнопка меняет цвет при наведении', 'the button changes colour on hover'), opts: [4, 5, 6], right: 5,
        why: L3("Bu qatorda qachon va nima bo'lishi yozilgan, bunday gaplar «Qanday ishlaydi?» savoliga javob beradi.", 'Когда и что происходит — это поведение.', 'When and what happens: that’s behaviour.') },
      { t: L3("12–14 yoshli o'quvchilar", 'школьники 12–14 лет', 'students aged 12–14'), opts: [0, 2, 1], right: 2,
        why: L3("Bu qator saytni kimlar ko'rishini aytadi. Bu esa «Kim uchun?» savolining ishi.", 'Кто будет смотреть сайт — это «для кого».', 'Who will look at the site: that’s who it’s for.') },
      { t: L3("chat bo'lmasin", 'без чата', 'no chat'), opts: [3, 6, 5], right: 6,
        why: L3("«Chat bo'lmasin» nima mumkin emasligini aytadi. Bunday gaplar «Qoidalar?» savoliga yoziladi.", 'Нельзя — это правила.', 'Not allowed: that’s rules.') },
      { t: L3('jadval, narxlar, aloqa', 'расписание, цены, контакты', 'schedule, prices, contact'), opts: [3, 4, 0], right: 3,
        why: L3("Bu yerda saytning bloklari sanalgan. Bloklar esa «Ichida nima?» savoliga yoziladi.", 'Блоки — это «что внутри».', 'Blocks: that’s what’s inside.') },
      { t: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'), opts: [1, 2, 6], right: 1,
        why: L3("Qator saytning maqsadini aytadi: bolalar yozilsin. Maqsad esa «Nega?» savoliga yoziladi.", 'Что должен сделать сайт — это «зачем».', 'What the site should do: that’s why.') }
    ],
    right: L3("Juda zo'r!", 'Точно!', 'Exactly!'),
    ok: L3("Beshta qatorning hammasini o'z savoliga topib qo'ydingiz! Formulani yoddan bilar ekansiz.", 'Всё верно! Ты знаешь формулу наизусть.', 'All correct! You know the formula by heart.')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Keyingi topshiriq haqiqiy detektivlar uchun. Har bir saytning promptidan bitta qator tushib qolgan. Qaysi biri ekan, topa olasizmi?", 'Теперь побудем детективами. В каждом из этих сайтов из промпта выпала одна строка. Какая?', 'Let’s be detectives. In each of these sites, one line is missing from the prompt. Which one?'),
    ask: L3("Qaysi qator yo'q?", 'Какой строки нет?', 'Which line is missing?'),
    qWhich: L3("Qaysi savolga javob yozilmagan?", 'На какой вопрос нет ответа?', 'Which question has no answer?'),
    order: L3("Mijoz: ro'yxatdan o'tish, ko'k va oq, reklama yo'q", 'Клиент: запись, синий и белый, без рекламы', 'Client: sign-ups, blue and white, no ads'),
    hint1: L3("Saytni mijozning so'zlari bilan solishtiring: unda nima yetishmayapti?", 'Сравни сайт со словами клиента: чего не хватает?', 'Compare the site with the client’s words: what’s missing?'),
    hint2: L3("Ro'yxatdan o'tish yo'q bo'lsa, «Nega?» tushib qolgan. Ranglar boshqacha bo'lsa, «Ko'rinishi?» yo'q. Reklama chiqib turgan bo'lsa, «Qoidalar?» yozilmagan.", 'Нет записи — «зачем»; цвета не те — «как выглядит»; есть реклама — «правила».', 'No sign-up — why; wrong colours — how it looks; ads — rules.'),
    items: [
      { miss: 'rules', opts: [6, 2, 4], right: 6, why: L3("Saytda reklama oynasi, chegirma va chat chiqib turibdi: ularni to'xtatadigan qoidalar yozilmagan.", 'Есть рекламное окно, скидка и чат: правила не написаны.', 'There’s a pop-up window, a discount and a chat: no rules were written.') },
      { miss: 'why', opts: [3, 1, 5], right: 1, why: L3("Ro'yxatdan o'tish tugmasi ham, formasi ham yo'q, chunki «Nega?» qatori yozilmagan.", 'Нет кнопки и формы записи: «Зачем?» не написано.', 'No sign-up button or form: “Why?” wasn’t written.') },
      { miss: 'look', opts: [0, 6, 4], right: 4, why: L3("Ranglar maktabnikiga o'xshamaydi, chunki «Ko'rinishi?» qatori yozilmagan.", 'Цвета не школьные: «Как выглядит?» не написано.', 'The colours aren’t the school’s: “How it looks?” wasn’t written.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("Birorta qator sizdan yashirinib qololmadi! Sayt qanday chiqqaniga qarab, promptdan nima tushib qolganini topyapsiz.", 'Класс! По сайту ты находишь, какой строки не хватает.', 'Great! You can tell from a site which line is missing.')
  },
  own: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Festival sayti tayyor. Endi navbat sizga: o'z saytingizni yarating! Qanday sayt xohlasangiz, o'shani tanlang va unga yettita qator yozing. Bu sizning yakuniy loyihangiz bo'ladi.", 'А теперь твой сайт! Напиши семь строк для сайта, какой хочешь сам. Это твой финальный проект.', 'Now your own site! Write seven lines for any site you like. This is your final project.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    phIn: L3('saytda qanday bloklar?', 'какие блоки на сайте?', 'which blocks?'),
    phLook: L3("sayt qanday ko'rinsin?", 'каким будет сайт?', 'how should it look?'),
    phBeh: L3("nima bo'ladi?", 'что происходит?', 'what happens?'),
    phRules: L3('majburiy? mumkin emas?', 'обязательно? нельзя?', 'must? not allowed?'),
    msgs: {
      noWhat: L3("«Nima?» qatoridan boshlang: qanday sayt yaratyapsiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Bu hali faqat mavzu. Aniqroq yozing: klub saytimi, server saytimi, do'konmi yoki bayram sayti?", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Endi «Nega?» qatoriga navbat keldi: sayt nima qilishi kerak?", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      goal: L3("Saytning maqsadini yozing: odamlar yozilsinmi, buyurtma bersinmi yoki kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("«Kim uchun?» qatori bo'sh qolibdi: saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      who: L3("Sun'iy intellekt sayt kimlar uchun ekanini tushunmadi. Ularning yoshini yoki kimligini yozing.", 'ИИ не понял, для кого. Напиши возраст или кто они.', 'The AI couldn’t tell who. Write their age or who they are.'),
      noIn: L3("Saytda qanday bloklar bo'ladi? Buni «Ichida nima?» qatoriga yozing.", 'Теперь напиши строку «Что внутри?»: какие блоки на сайте?', 'Now write the “What’s inside?” line: which blocks?'),
      inNone: L3("«Ichida nima?» qatorida birorta blok topilmadi. Masalan, shunday yozing: rasmlar, narxlar, aloqa.", 'В «Что внутри?» не найдено блоков. Например: фото, цены, контакты.', 'No blocks found in “What’s inside?”. For example: photos, prices, contact.'),
      noLook: L3("«Ko'rinishi?» qatori hali bo'sh: sayt qanday ko'rinsin?", 'Теперь напиши строку «Как выглядит?»: каким будет сайт?', 'Now write the “How it looks?” line: how should it look?'),
      look: L3("«Ko'rinishi?» qatoriga uslub va ranglarni yozing. Masalan: zamonaviy, ko'k va oq.", 'В «Как выглядит?» напиши стиль и цвета. Например: современный, синий и белый.', 'In “How it looks?” write a style and colours. For example: modern, blue and white.'),
      noBeh: L3("Endi «Qanday ishlaydi?» qatori qoldi: qachon, nima bilan va nima bo'ladi?", 'Теперь напиши строку «Как ведёт себя?»: когда, что и что происходит?', 'Now write the “How it behaves?” line: when, what and what happens?'),
      beh: L3("«Qanday ishlaydi?» qatoriga aniq bir holatni yozing. Masalan: tugma ustiga kelganda kattalashsin.", 'В «Как ведёт себя?» напиши точный случай. Например: кнопка увеличивается при наведении.', 'In “How it behaves?” write an exact case. For example: the button grows on hover.'),
      noRules: L3("Oxirgi qator «Qoidalar?»: nima majburiy-u, nima mumkin emas?", 'Теперь напиши строку «Какие правила?»: что обязательно и что нельзя?', 'Now write the “What rules?” line: what is a must and what is not allowed?'),
      rules: L3("«Qoidalar?» qatoriga aniq yozing. Masalan: chegirma bo'lmasin, telefon raqami albatta bo'lsin.", 'В «Какие правила?» напиши точно. Например: без скидок, телефон обязательно.', 'In “What rules?” be precise. For example: no discount, the phone number is a must.')
    },
    hints: [
      L3("Yettita savolni bir sanab chiqing: nima, nega, kim uchun, ichida nima, ko'rinishi, qanday ishlaydi va qoidalar.", 'Семь вопросов: что, зачем, для кого, что внутри, как выглядит, как ведёт себя, какие правила.', 'Seven questions: what, why, who for, what’s inside, how it looks, how it behaves, what rules.'),
      L3("Festival saytiga qanday yozgan bo'lsangiz, shunday yozing, faqat o'z mavzuingiz bilan.", 'Пиши как для сайта фестиваля, только со своей темой.', 'Write it like the festival site, just with your own topic.'),
      L3("Pastga futbol klubi uchun tayyor misol qo'ydim. Unga qarab, o'z mavzuingiz bo'yicha yettita qatorni yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · 11–13 yoshli bolalar · rasmlar, jadval, aloqa · zamonaviy, yashil va oq · tugma ustiga kelganda kattalashsin · majburiy: telefon +998 90 123 00 11, chegirma va chat bo'lmasin",
      'Сайт нашего футбольного клуба · чтобы ребята записывались · дети 11–13 лет · фото, расписание, контакты · современный, зелёный и белый · кнопка увеличивается при наведении · обязательно: телефон +998 90 123 00 11, без скидок и чата',
      'Our football club site · get kids to sign up · kids aged 11–13 · photos, schedule, contact · modern, green and white · the button grows on hover · must: phone +998 90 123 00 11, no discount or chat'),
    ok: L3("Voy, ajoyib chiqdi! Bu sizning to'liq promptingiz va o'z saytingiz. Endi uni yana bir pog'ona yaxshilaymiz.", 'Ого, классно! Это твой полный промпт и твой сайт. Теперь улучшим его ещё на шаг.', 'Wow, great! That’s your full prompt and your site. Now let’s make it one step better.'),
    ask: L3("O'z saytingiz uchun yettita qatorni yozing", 'Напиши семь строк для своего сайта', 'Write seven lines for your own site')
  },
  ownfix: {
    eyebrow: L3("O'z saytingizni yaxshilang", 'Улучши свой сайт', 'Improve your site'),
    card: { h: L3('Sizning tanlovingiz', 'Твой выбор', 'Your choice'), t: L3("Saytingizga qarang. Nimani yaxshilash mumkin? Bitta-ikkita narsani tanlab, aniq tuzating.", 'Посмотри на свой сайт. Что можно улучшить? Выбери одну-две вещи и исправь их точно.', 'Look at your site. What could be better? Pick one or two things and fix them precisely.') },
    say: L3("Endi o'z saytingizga mijozning ko'zi bilan qarang. Nimani yaxshilasa bo'ladi? Ikkinchi promptda nimani va qanday o'zgartirishni yozing, qolganini esa saqlab qoling.", 'Посмотри на свой сайт внимательно. Что можно улучшить? Напиши во втором промпте, что и как изменить, а остальное сохрани.', 'Look at your site carefully. What could be better? In the second prompt, write what to change and how, and keep the rest.'),
    ph: L3('nima va qanday?', 'что и как?', 'what and how?'),
    hints: [
      L3("Bitta narsani tanlang: tugmanimi, sarlavhanimi, rangnimi yoki biror blokni.", 'Выбери одну вещь: кнопку, заголовок, цвет или блок.', 'Pick one thing: the button, the title, the colour or a block.'),
      L3("Oldin nimani va qanday o'zgartirishni yozing, oxiriga esa «qolganini o'zgartirma»ni qo'shing.", 'Напиши что и как, в конце — «остальное не меняй».', 'Write what and how, and at the end “don’t change anything else”.'),
      L3("Namunada ikkita tuzatish va oxirida «qolganini o'zgartirma» bor. Shunga o'xshatib yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("sarlavhani kattaroq qil, sharhlar blokini qo'sh, qolganini o'zgartirma", 'сделай заголовок больше, добавь блок отзывов, остальное не меняй', 'make the title bigger, add a reviews block, don’t change anything else'),
    ok: L3("Saytingiz yana ham yaxshilandi, qolgani esa joyida! Endi siz haqiqiy sayt muallifisiz!", 'Класс! Твой сайт стал ещё лучше, остальное на месте. Ты настоящий автор сайта!', 'Great! Your site got even better, and the rest stays. You’re a real site author!'),
    ask: L3('Ikkinchi promptni yozing', 'Напиши второй промпт', 'Write the second prompt')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Modul ham tugab qolyapti! Butun modul bo'yicha beshta gap tayyorladim, ular kartochkada chiqadi. Qaysi biri to'g'ri-yu, qaysi biri noto'g'ri, ajratib bering.", 'Последняя проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'The last check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida ekan: qisqa prompt haqidami, aniq ma'lumot haqidami yoki natijani tekshirish haqidami?", 'О чём фраза: о коротком промпте, о точных данных или о проверке результата?', 'What’s it about: a short prompt, exact details, or checking the result?'),
    hint2: L3("Esingizdami: promptda aytilmagan narsani sun'iy intellekt o'zicha taxmin qiladi.", 'Вспомни: то, что не сказано, ИИ угадывает.', 'Remember: whatever isn’t said, the AI guesses.'),
    items: [
      { t: L3("Qisqa prompt yetarli: sun'iy intellekt qolganini o'zi o'ylab topadi.", 'Короткого промпта хватит: остальное ИИ придумает сам.', 'A short prompt is enough: the AI will think up the rest.'), right: false,
        why: L3("Qolganini u taxmin qiladi, natija esa mijoz xohlagandek chiqmaydi. Festival saytida buni o'z ko'zingiz bilan ko'rdingiz-ku!", 'Он угадывает, и результат выходит не таким, как хотел клиент.', 'It guesses, and the result isn’t what the client wanted.') },
      { t: L3("Yaxshi promptda yettita savolga javob bor.", 'В хорошем промпте есть ответы на семь вопросов.', 'A good prompt answers seven questions.'), right: true,
        why: L3("Yettita savol bor: nima, nega, kim uchun, ichida nima, ko'rinishi, qanday ishlaydi va qoidalar.", 'Верно: что, зачем, для кого, что внутри, как выглядит, как ведёт себя, правила.', 'Right: what, why, who for, what’s inside, how it looks, how it behaves, rules.') },
      { t: L3("Telefon raqami va manzilni sun'iy intellekt o'zi to'g'ri biladi.", 'Номер телефона и адрес ИИ сам знает правильно.', 'The AI knows the right phone number and address by itself.'), right: false,
        why: L3("Aslida u ularni o'zicha to'qib chiqaradi. Aniq raqam va manzilni promptga siz yozasiz.", 'На самом деле он их выдумает. Точные данные пишешь ты.', 'Actually it makes them up. You write the exact details.') },
      { t: L3("Natijani buyurtma bilan solishtirib, ikkinchi promptda aniq tuzatamiz.", 'Сверяем результат с заказом и точно исправляем вторым промптом.', 'We check the result against the order and fix it precisely with a second prompt.'), right: true,
        why: L3("Ish shunday boradi: tekshiramiz, tuzatamiz va yana tekshiramiz.", 'Верно: проверяем, исправляем, снова проверяем.', 'Right: check, fix, check again.') },
      { t: L3("Saytning muallifi siz: siz o'ylaysiz, yozasiz va tekshirasiz.", 'Автор сайта — ты: ты думаешь, пишешь и проверяешь.', 'You are the site’s author: you think, write and check.'), right: true,
        why: L3("Muallif siz, sun'iy intellekt esa bu ishda yordamchingiz.", 'Верно, а ИИ — помощник.', 'Right, and the AI is the helper.') }
    ],
    ok: L3("Birorta gapda adashmadingiz! Sun'iy intellekt bilan qanday ishlashni yaxshi bilasiz.", 'Всё верно! Ты правильно работаешь с ИИ.', 'All correct! You work with the AI the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Choyim allaqachon sovib qoldi! Bugun dam olaman, asosiy ishni sun'iy intellekt qiladi, deb o'ylagandim. Mana sizga qiziq: bitta qatorimdan butunlay boshqa festival chiqdi! Asosiy ishni aslida siz qildingiz: mijozni tushundingiz, aniq yozdingiz, tekshirdingiz va yaxshiladingiz. Sun'iy intellekt esa yordamchi, xolos. Demak, men noto'g'ri o'ylagan ekanman.",
        'Вернёмся к загадке. Я думал, главную работу делает ИИ, а мне остаётся нажать кнопку. Но из одной строки вышел чужой фестиваль! Главную работу сделал ты: понял клиента, написал точно, проверил и улучшил. А ИИ — помощник. Я ошибся.',
        'Back to the riddle. I thought the AI does the main work and all I do is press the button. But one line gave us someone else’s festival! You did the main work: you understood the client, wrote precisely, checked and improved. The AI is the helper. I was wrong.'), k: 'riddle' },
      { text: L3("Mana, sizning yakuniy loyihangiz: o'zingiz yozgan prompt va o'zingiz yaratgan sayt.", 'Смотри, это твой финальный проект: твой промпт и твой сайт.', 'Look, this is your final project: your prompt and your site.'), k: 'own' },
      { text: L3("Oldin o'ylaymiz: mijoz aslida nimani xohlaydi?", 'Думай: чего хочет клиент?', 'Think: what does the client want?'), k: 'think' },
      { text: L3("Keyin aniq yozamiz va yettita savolning hammasiga javob beramiz.", 'Пиши точно: семь вопросов.', 'Write precisely: seven questions.'), k: 'write' },
      { text: L3("Natija chiqqach, tekshiramiz: hammasi buyurtmadagidekmi?", 'Проверяй: результат как в заказе?', 'Check: does the result match the order?'), k: 'check' },
      { text: L3("Kerak bo'lsa, ikkinchi prompt bilan yaxshilaymiz va «qolganini o'zgartirma» deyishni unutmaymiz.", 'Улучшай: второй промпт и «остальное не меняй».', 'Improve: a second prompt and “don’t change anything else”.'), k: 'fix' },
      { text: L3("Uyga vazifa: promptingizni haqiqiy sun'iy intellektga yuboring, saytingizni yarating va uni do'stlaringizga ko'rsating. Modul ham shu bilan tugadi, siz juda zo'r ishladingiz. Ko'rishguncha!",
        'Домашнее задание: отправь свой промпт настоящему ИИ, сделай свой сайт и покажи друзьям. Модуль пройден — отличная работа! До встречи!',
        'Homework: send your prompt to a real AI, make your site and show it to your friends. The module is complete, and you did a great job. See you!') }
    ],
    roles: {
      think: L3("o'ylang: mijoz nimani xohlaydi", 'думай: чего хочет клиент', 'think: what the client wants'),
      write: L3("aniq yozing: yettita savol", 'пиши точно: семь вопросов', 'write precisely: seven questions'),
      check: L3("tekshiring: buyurtma bilan solishtiring", 'проверяй: сверяй с заказом', 'check: compare with the order'),
      fix: L3("yaxshilang: ikkinchi prompt", 'улучшай: второй промпт', 'improve: a second prompt')
    },
    roleH: { think: L3("O'ylang", 'Думай', 'Think'), write: L3('Yozing', 'Пиши', 'Write'), check: L3('Tekshiring', 'Проверяй', 'Check'), fix: L3('Yaxshilang', 'Улучшай', 'Improve') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring, saytingizni yarating va do'stlaringizga ko'rsating.", 'Отправь свой промпт настоящему ИИ, сделай свой сайт и покажи друзьям.', 'Send your prompt to a real AI, make your site and show it to your friends.'),
    ask: L3('Loyihangizga qarang', 'Посмотри на свой проект', 'Look at your project')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, t: 1, miss: 1, opts: 1, right: 1, type: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:../ai7/ai7-fix.jsx@*/

/*@FILE:ai8-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:../ai4/ai4.css@*/
/*@FILE:../ai5/ai5.css@*/
/*@FILE:../ai6/ai6.css@*/
/*@FILE:../ai7/ai7.css@*/
/*@FILE:ai8.css@*/
`;
