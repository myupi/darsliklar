// =============================================================================
// ТЕСТЫ К УРОКУ 3 МОДУЛЯ BOOTSTRAP «Загрузка и изображения» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: широкое фото на телефоне укладывает img-fluid (Bootstrap 6 сам его не сжимает; img-responsive — имя версии 3);
// круглое фото — rounded-circle; спиннер — знак загрузки; цвет спиннера — fg-*; заглушка без col-… не видна.
// Страница — честная (bs={BS_CSS}), телефон — vw 360. Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'zagruzka-i-izobrazheniya';
const b3H = (T) => `<h2>${T('Bizning jamoa', 'Наша команда', 'Our team')}</h2>`;
const QS = [
  { id: 'bootstrap-03t1', target: 'bootstrap-03', ptype: 'Bootstrap', tag: 'img-fluid', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`${b3H(T)}\n<img src="jamoa.jpg" class="___" alt="${T('Jamoa', 'Команда', 'Team')}">`} html={`${b3H(T)}\n<img src="jamoa.jpg" alt="${T('Jamoa', 'Команда', 'Team')}">`} bs={BS_CSS} vw={360} mark={[2]} />; },
    uz: { ctx: "Telefonda jamoa surati ekrandan chiqib ketdi.", q: "Surat ekranga sig'ishi uchun class-ga nima yoziladi?", opts: ['img-responsive', 'img-fluid', 'img-thumbnail', 'rounded-pill'],
      ok: "Qoyil! img-fluid suratni ekran kengligiga moslaydi: bitta surat har qanday telefonga sig'adi. img-responsive esa juda eski nom.", hint: "Bootstrap 6 suratni o'zi kichraytirmaydi. Darsda suratni har ekranga moslaydigan qaysi so'z bor edi?", alt: "Telefon ekranidan chiqib ketgan surat" },
    ru: { ctx: 'На телефоне фото команды вылезло за экран.', q: 'Что написать в class, чтобы фото уместилось?', opts: ['img-responsive', 'img-fluid', 'img-thumbnail', 'rounded-pill'],
      ok: 'Здорово! img-fluid подгоняет фото под ширину экрана: одно фото помещается на любой телефон. А img-responsive — очень старое имя.', hint: 'Bootstrap 6 сам фото не сжимает. Каким словом в уроке подгоняли фото под любой экран?', alt: 'Фото, вылезшее за экран телефона' },
    en: { ctx: 'On a phone, the team photo sticks out past the screen.', q: 'What goes in class so the photo fits?', opts: ['img-responsive', 'img-fluid', 'img-thumbnail', 'rounded-pill'],
      ok: 'Nice work! img-fluid fits the photo to the screen width, so one photo works on any phone. img-responsive is a very old name.', hint: 'Bootstrap 6 doesn’t shrink photos by itself. Which word in the lesson fit a photo to any screen?', alt: 'A photo sticking out of a phone screen' } },
  { id: 'bootstrap-03t2', target: 'bootstrap-03', ptype: 'Bootstrap', tag: 'rounded', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<img src="murabbiy.jpg" class="___"\n     alt="${T('Murabbiy', 'Тренер', 'Coach')}">`} html={`<img src="murabbiy.jpg" class="rounded-circle" alt="">`} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Murabbiyning surati o'ngdagidek doira bo'lishi kerak.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['rounded', 'img-circle', 'rounded-pill', 'rounded-circle'],
      ok: "Xuddi shunday! rounded-circle kvadrat suratni doiraga aylantiradi. rounded esa faqat burchaklarni biroz yumaloqlaydi.", hint: "Doira inglizcha nima bo'ladi? Darsda burchak so'zlari qaysi so'z bilan boshlanardi?", alt: "Doira shaklidagi murabbiy surati" },
    ru: { ctx: 'Фото тренера должно стать кругом, как справа.', q: 'Какое слово пишется на пустое место?', opts: ['rounded', 'img-circle', 'rounded-pill', 'rounded-circle'],
      ok: 'Именно! rounded-circle превращает квадратное фото в круг. А rounded лишь слегка скругляет углы.', hint: 'Как по-английски «круг»? С какого слова в уроке начинались слова для углов?', alt: 'Круглое фото тренера' },
    en: { ctx: 'The coach’s photo should be a circle, like on the right.', q: 'Which word goes in the empty spot?', opts: ['rounded', 'img-circle', 'rounded-pill', 'rounded-circle'],
      ok: 'Exactly! rounded-circle turns a square photo into a circle. rounded only softens the corners a little.', hint: 'What is the English word for a round shape? Which word did the corner classes start with?', alt: 'A round photo of the coach' } },
  { id: 'bootstrap-03t3', target: 'bootstrap-03', ptype: 'Bootstrap', tag: 'spinner', correct: 0,
    vis: () => { const src = `<div class="spinner-border fg-primary" role="status">\n  <span class="visually-hidden">Loading...</span>\n</div>`; return <WqVis code={src} html={src} bs={BS_CSS} vw={120} />; },
    uz: { ctx: "Saytda shunday aylanib turgan belgi paydo bo'ldi.", q: 'Bu belgi foydalanuvchiga nimani bildiradi?', opts: ["Sahifa hali yuklanayotganini", "Bu joyni bosish mumkinligini", "Saytda xato chiqqanini", "Rasm burchaklari yumaloqligini"],
      ok: "Juda zo'r! Bu spinner: u «kuting, yuklanyapti» deydi. Ichidagi yashirin Loading... yozuvini ekranni o'qiydigan dastur aytib beradi.", hint: "Telefoningizda video yoki o'yin ochilayotganda nima aylanadi? Kodda yashiringan so'zni o'qing.", alt: "Ko'k aylanuvchi spinner" },
    ru: { ctx: 'На сайте появился такой крутящийся значок.', q: 'Что этот значок сообщает посетителю?', opts: ['Что страница ещё загружается', 'Что на это место можно нажать', 'Что на сайте ошибка и он не работает', 'Что у картинки скруглены углы'],
      ok: 'Отлично! Это спиннер: он говорит «подожди, загружается». Спрятанное Loading... прочитает программа, озвучивающая экран.', hint: 'Что крутится на телефоне, пока открывается видео или игра? Прочитайте спрятанное слово в коде.', alt: 'Синий крутящийся спиннер' },
    en: { ctx: 'A spinning sign like this appeared on the site.', q: 'What does this sign tell the visitor?', opts: ['That the page is still loading', 'That this spot can be clicked', 'That the site has an error and is broken', 'That the picture has rounded corners'],
      ok: 'Great! It’s a spinner: it says “wait, loading”. A screen reader reads out the hidden Loading... text.', hint: 'What spins on your phone while a video or game opens? Read the hidden word in the code.', alt: 'A blue spinning spinner' } },
  { id: 'bootstrap-03t4', target: 'bootstrap-03', ptype: 'Bootstrap', tag: 'spinner-color', correct: 2, mono: true,
    vis: () => <WqVis code={`<div class="spinner-border ___"\n     role="status"></div>`} html={`<div class="spinner-border fg-success" role="status"></div>`} bs={BS_CSS} vw={120} mark={[1]} />,
    uz: { ctx: "Spinner o'ngdagidek yashil bo'lishi kerak.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['text-success', 'bg-success', 'fg-success', 'spinner-green'],
      ok: "To'ppa-to'g'ri! Spinner chizig'i matn rangida chiziladi, matn rangi esa fg bilan boshlanadi. bg-success uni yashil dumaloq dog'ga aylantirardi.", hint: "Spinnerning chizig'i qaysi rangni oladi: fonnimi yoki matnnikimi? 2-darsdagi so'zlar oilasini eslang.", alt: "Yashil spinner" },
    ru: { ctx: 'Спиннер должен стать зелёным, как справа.', q: 'Какое слово пишется на пустое место?', opts: ['text-success', 'bg-success', 'fg-success', 'spinner-green'],
      ok: 'Верно! Линия спиннера рисуется цветом текста, а цвет текста начинается с fg. bg-success превратил бы его в зелёное пятно.', hint: 'Какой цвет берёт линия спиннера: фона или текста? Вспомните семью слов из урока 2.', alt: 'Зелёный спиннер' },
    en: { ctx: 'The spinner should be green, like on the right.', q: 'Which word goes in the empty spot?', opts: ['text-success', 'bg-success', 'fg-success', 'spinner-green'],
      ok: 'Right! The spinner line uses the text color, and text color starts with fg. bg-success would turn it into a green blob.', hint: 'Which color does the spinner line take: background or text? Remember the word family from lesson 2.', alt: 'A green spinner' } },
  { id: 'bootstrap-03t5', target: 'bootstrap-03', ptype: 'Bootstrap', tag: 'placeholder', correct: 1,
    vis: (L) => { const T = aqL(L); const src = `<h2>${T('Yangiliklar', 'Новости', 'News')}</h2>\n<p class="placeholder-wave">\n  <span class="placeholder"></span>\n</p>`; return <WqVis code={src} html={src} bs={BS_CSS} mark={[3]} />; },
    uz: { ctx: "Matn yuklanguncha uning o'rnida kulrang chiziq turishi kerak edi. Lekin chiziq ko'rinmayapti.", q: 'Nima yetishmayapti?', opts: ["span ichida Loading... degan yozuv", "Kenglik so'zi, masalan col-6", "Rang so'zi, masalan fg-secondary", "p tegidagi placeholder-wave so'zi"],
      ok: "Qoyil! placeholder-ning o'zida kenglik yo'q. col-6 yozilsa, u qatorning yarmini egallaydi va kulrang chiziq paydo bo'ladi.", hint: "Chiziq bor, lekin uzunligi nolga teng. Darsda placeholder-ga uzunlikni qaysi so'z bergan edi?", alt: "placeholder chizig'i ko'rinmagan sahifa" },
    ru: { ctx: 'Пока текст грузится, на его месте должна стоять серая полоска. Но её не видно.', q: 'Чего не хватает?', opts: ['надписи Loading... внутри span', 'Слова ширины, например col-6', 'Слова цвета, например fg-secondary', 'слова placeholder-wave у тега p'],
      ok: 'Здорово! У самой заглушки нет ширины. С col-6 она займёт половину строки, и серая полоска появится.', hint: 'Полоска есть, но её длина равна нулю. Какое слово в уроке давало заглушке длину?', alt: 'Страница с невидимой заглушкой' },
    en: { ctx: 'While text loads, a grey bar should stand in its place. But the bar isn’t visible.', q: 'What is missing?', opts: ['a Loading... label inside the span', 'A width word, for example col-6', 'A color word, for example fg-secondary', 'the placeholder-wave word on the p tag'],
      ok: 'Nice work! The placeholder itself has no width. With col-6 it takes half the line, and the grey bar appears.', hint: 'The bar is there, but its length is zero. Which word gave the placeholder a length in the lesson?', alt: 'A page with an invisible placeholder' } }
];
