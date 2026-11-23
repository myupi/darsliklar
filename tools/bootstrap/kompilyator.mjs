// Страницы-примеры заданий компилятора модуля Bootstrap (23.11.2026): node tools/bootstrap/kompilyator.mjs
// → public/kompilyator/bootstrap/<NN>/index.html (uz), <NN>/ru/index.html, <NN>/en/index.html и фото рядом (jpg).
// Задания — docs/kompilyator-amaliy-bootstrap.txt. Строки link и script — точно как на getbootstrap.com 6.0 (из tools/bsp/bp-base.jsx).
// Тема всегда светлая (data-bs-theme="light"): иначе Bootstrap 6 сам включает тёмную по настройке системы.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'public/kompilyator/bootstrap');
const base = fs.readFileSync(path.join(ROOT, 'tools/bsp/bp-base.jsx'), 'utf8');
const C = {};
for (const k of ['BP_H', 'BP_CDN', 'BP_CSS_URL', 'BP_JS_URL', 'BP_CSS_SRI', 'BP_JS_SRI', 'BP_LINK', 'BP_SCRIPT']) {
  const m = new RegExp('^const ' + k + ' = (.+);$', 'm').exec(base);
  C[k] = Function(...Object.keys(C), 'return ' + m[1])(...Object.values(C));
}
const LANGS = ['uz', 'ru', 'en'];
const T = (uz, ru, en) => ({ uz, ru, en });

// ── картинки: фото заказчика (23.11.2026: «давай их поставим, а не нарисованные») — tools/bootstrap/foto/,
// обрезаны до одной пропорции: машины 960×480 (карусель и карточки ровные), игры 960×540.
const FOTO = path.join(ROOT, 'tools/bootstrap/foto');

// ── страница ──
const page = (lang, title, body, js) => `<!DOCTYPE html>
<html lang="${lang}" data-bs-theme="light">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    ${C.BP_LINK}
  </head>
  <body>
${body.trim().split('\n').map((l) => '    ' + l).join('\n')}${js ? '\n    ' + C.BP_SCRIPT : ''}
  </body>
</html>
`;
const L = (o, lang) => (typeof o === 'string' ? o : o[lang]);

const CLOSE = (attr) => `<button type="button" class="btn-close" ${attr} aria-label="Close"></button>`;
const SPIN = (cls) => `<div class="${cls}" role="status"><span class="visually-hidden">Loading...</span></div>`;
const CARS = [['bmw.jpg', 'BMW M8', 305], ['porsche.jpg', 'Porsche 911 Turbo S', 330], ['mercedes.jpg', 'Mercedes-AMG One', 352]];
const GAMES = [['minecraft.jpg', 'Minecraft', T("Dunyo quring va sarguzashtga chiqing.", 'Строй мир и отправляйся в приключения.', 'Build a world and go on adventures.')],
  ['roblox.jpg', 'Roblox', T("Do'stlar bilan minglab o'yinlar.", 'Тысячи игр с друзьями.', 'Thousands of games with friends.')],
  ['efootball.jpg', 'eFootball', T("Sevimli jamoangiz bilan futbol.", 'Футбол с любимой командой.', 'Football with your favorite team.')]];
const KMH = T('km/soat', 'км/ч', 'km/h');
const W = {
  home: T('Asosiy', 'Главная', 'Home'), about: T('Qoidalar', 'Правила', 'Rules'), contact: T('Aloqa', 'Контакты', 'Contact'),
  games: T("O'yinlar", 'Игры', 'Games'), prizes: T('Sovrinlar', 'Призы', 'Prizes'), cars: T('Mashinalar', 'Машины', 'Cars'),
  tickets: T('Chiptalar', 'Билеты', 'Tickets'), menu: T('Menyu', 'Меню', 'Menu'), photos: T('Rasmlar', 'Фото', 'Photos'),
  shop: T("Do'kon", 'Магазин', 'Store'), news: T('Yangiliklar', 'Новости', 'News'), club: T('Klub', 'Клуб', 'Club'),
};
// Navbar — как пример «Example» на getbootstrap.com 6.0 (меню-ящик drawer; на ноутбуке md:navbar-expand раскрывает его в строку).
// links: подписи пунктов; extra: свой пункт в конце (например, кнопка меню). dark — data-bs-theme="dark".
const NAV = (l, brand, links, { dark = true, extra = '' } = {}) => `<nav class="navbar md:navbar-expand bg-1"${dark ? ' data-bs-theme="dark"' : ''}>
  <div class="container-fluid">
    <a class="navbar-brand" href="#">${brand}</a>
    <button class="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="#menyu" aria-label="Menu">
      <span class="navbar-toggler-icon" aria-hidden="true"></span>
    </button>
    <dialog class="drawer drawer-end" id="menyu">
      <div class="drawer-header">
        <h5 class="drawer-title">${L(W.menu, l)}</h5>
        ${CLOSE('data-bs-dismiss="drawer"')}
      </div>
      <div class="drawer-body">
        <ul class="nav navbar-nav">
${links.map((x, i) => `          <li class="nav-item"><a class="nav-link${i ? '' : ' active'}" href="#">${L(x, l)}</a></li>`).join('\n')}${extra ? '\n' + extra : ''}
        </ul>
      </div>
    </dialog>
  </div>
</nav>`;
const MAIN = (inner) => `<main style="padding: 24px">\n${inner.trim().split('\n').map((x) => '  ' + x).join('\n')}\n</main>`;

// Только классы своего урока и прошлых (заказчик, 23.11.2026: «там появились задания которых не было в уроках»): без badge,
// btn-lg, btn-subtle, card-header, list-group, g-3, отступов mt-/mb-/p-, text-center, mx-auto; отступы и ширина — style.
const BOX = 'padding: 24px; border-radius: 16px; margin-bottom: 16px';
const PAGES = [
  // 1 · Введение: link и script, баннер, три e'lon разных цветов, третье закрывается крестиком
  { title: T('Minecraft turniri', 'Турнир Minecraft', 'Minecraft tournament'), js: true, files: ['minecraft.jpg'], body: (l) => `
${MAIN(`
<img src="minecraft.jpg" alt="Minecraft" style="width: 100%; height: 240px; object-fit: cover; border-radius: 16px">
<h1>${L(T('Minecraft turniri 2026', 'Турнир Minecraft 2026', 'Minecraft tournament 2026'), l)}</h1>
<div class="alert theme-success" role="alert">
  <p>${L(T("Ro'yxat ochiq! Turnir 30-noyabr kuni, maktab kompyuter xonasida.", 'Запись открыта! Турнир 30 ноября в школьном компьютерном классе.', 'Sign-up is open! The tournament is on November 30 in the school computer room.'), l)}</p>
</div>
<div class="alert theme-info" role="alert">
  <p>${L(T("Har bir jamoada 3 nafar o'yinchi.", 'В каждой команде 3 игрока.', 'Each team has 3 players.'), l)}</p>
</div>
<div class="alert theme-warning" role="alert">
  <p>${L(T("Kompyuteringizni oldindan tekshiring!", 'Проверь свой компьютер заранее!', 'Check your computer in advance!'), l)}</p>
  ${CLOSE('data-bs-dismiss="alert"')}
</div>`)}` },
  // 2 · Цвета и кнопки: главный блок bg-warning с e'lon, три белых блока с заголовками fg-*, по две кнопки, низ bg-success
  { title: T("Avto ko'rgazma", 'Автовыставка', 'Car show'), files: [], body: (l) => {
    const b = [['fg-success', T('Elektromobillar', 'Электромобили', 'Electric cars'), T("Benzinsiz yuradigan mashinalar.", 'Машины, которые ездят без бензина.', 'Cars that run without fuel.'), 'theme-success'],
      ['fg-primary', T('Sport mashinalar', 'Спорткары', 'Sports cars'), T("Eng tez mashinalarni yaqindan ko'ring.", 'Посмотри самые быстрые машины вблизи.', 'See the fastest cars up close.'), 'theme-primary'],
      ['fg-danger', T('Retro mashinalar', 'Ретро-машины', 'Retro cars'), T("50 yil oldingi chiroyli mashinalar.", 'Красивые машины 50-летней давности.', 'Beautiful cars from 50 years ago.'), 'theme-danger']];
    return `
${MAIN(`
<div class="bg-warning" style="${BOX}">
  <h1>${L(T("Avto ko'rgazma", 'Автовыставка', 'Car show'), l)}</h1>
  <div class="alert theme-info" role="alert">
    <p>${L(T("7-dekabr, shahar markazi. Bolalar uchun kirish bepul!", '7 декабря, центр города. Детям вход бесплатный!', 'December 7, city center. Free entry for kids!'), l)}</p>
  </div>
</div>
${b.map(([fg, h, p, th]) => `<div style="${BOX}; border: 1px solid #DDE2EA">
  <h3 class="${fg}">${L(h, l)}</h3>
  <p>${L(p, l)}</p>
  <button class="btn-solid ${th}">${L(T('Chipta olish', 'Взять билет', 'Get a ticket'), l)}</button>
  <button class="btn-outline ${th}">${L(T('Batafsil', 'Подробнее', 'More'), l)}</button>
</div>`).join('\n')}
<div class="bg-success" style="${BOX}">
  <p><b>${L(T('Manzil', 'Адрес', 'Address'), l)}:</b> ${L(T("Toshkent, Amir Temur ko'chasi, 1", 'Ташкент, улица Амира Темура, 1', 'Tashkent, Amir Temur street, 1'), l)}</p>
  <p><b>${L(T('Telefon', 'Телефон', 'Phone'), l)}:</b> +998 71 200 00 00</p>
</div>`)}`; } },
  // 3 · Загрузка и изображения: img-fluid rounded, три img-thumbnail рядом, спиннеры двух видов, placeholder-wave
  { title: T("O'yinlar galereyasi", 'Галерея игр', 'Game gallery'), files: GAMES.map((g) => g[0]), body: (l) => `
${MAIN(`
<h1 class="fg-primary">${L(T("Sevimli o'yinlarim", 'Мои любимые игры', 'My favorite games'), l)}</h1>
<img src="efootball.jpg" class="img-fluid rounded" alt="eFootball">
<h3>${L(T("Yana uchta o'yin", 'Ещё три игры', 'Three more games'), l)}</h3>
${GAMES.map(([f, n]) => `<img src="${f}" class="img-thumbnail" width="300" alt="${n}">`).join('\n')}
<h4>${L(T('Yangi rasmlar yuklanmoqda...', 'Загружаются новые фото...', 'New photos are loading...'), l)}</h4>
${['spinner-border fg-primary', 'spinner-grow fg-success', 'spinner-border fg-danger', 'spinner-grow fg-warning'].map((c) => SPIN(c)).join('\n')}
<p class="placeholder-wave">
  <span class="placeholder col-6"></span>
  <span class="placeholder col-4"></span>
  <span class="placeholder col-8"></span>
</p>`)}` },
  // 4 · Flex (упрощено 23.11.2026, заказчик: «задание flex нужно упростить»): три ряда — шапка по краям, машины в ряд по центру, кнопки по центру
  { title: T('Grand Prix', 'Гран-при', 'Grand Prix'), files: CARS.map((c) => c[0]), body: (l) => MAIN(`
<header class="d-flex justify-content-between align-items-center bg-warning" style="padding: 16px 24px; border-radius: 16px">
  <h2>Grand Prix 2026</h2>
  <button class="btn-solid theme-danger">${L(T('Jonli efir', 'Прямой эфир', 'Live'), l)}</button>
</header>
<h3 style="text-align: center; margin-top: 16px">${L(T("Poygadagi mashinalar", 'Машины в гонке', 'Cars in the race'), l)}</h3>
<div class="d-flex justify-content-center gap-5">
${CARS.map(([f, n]) => `  <div style="width: 300px">
    <img src="${f}" class="img-fluid rounded" alt="${n}">
    <p><b>${n}</b></p>
  </div>`).join('\n')}
</div>
<div class="d-flex justify-content-center gap-3">
  <button class="btn-solid theme-primary">${L(T('Natijalar', 'Результаты', 'Results'), l)}</button>
  <button class="btn-outline theme-primary">${L(T('Chiptalar', 'Билеты', 'Tickets'), l)}</button>
</div>`) },
  // 5 · Карточки: три машины в ряд, card-title / card-text, одна card-subtle с кнопкой btn-solid
  { title: T('Avtosalon', 'Автосалон', 'Car dealer'), files: CARS.map((c) => c[0]), body: (l) => `
${MAIN(`
<h1 style="text-align: center">${L(T('Eng tez mashinalar', 'Самые быстрые машины', 'The fastest cars'), l)}</h1>
<div class="d-flex justify-content-center gap-5">
${CARS.map(([f, n, v], i) => `  <section class="card${i === 1 ? ' card-subtle theme-success' : ''}" style="max-width: 300px">
    <img src="${f}" class="card-img-top" alt="${n}">
    <div class="card-body">
      <h4 class="card-title">${n}</h4>
      <p class="card-text fg-success">${L(T('Tezligi', 'Скорость', 'Top speed'), l)}: ${v} ${L(KMH, l)}</p>
      <a href="#" class="${i === 1 ? 'btn-solid theme-success' : 'btn-outline theme-primary'}">${L(T("Ko'rish", 'Смотреть', 'View'), l)}</a>
    </div>
  </section>`).join('\n')}
</div>`)}` },
  // 6 · Контейнер и сетка: реклама md:col-8 + предложение дня md:col-4, второй row — три игры md:col-4
  { title: T("O'yinlar do'koni", 'Магазин игр', 'Game store'), files: GAMES.map((g) => g[0]), body: (l) => {
    const price = [T("90 000 so'm", '90 000 сумов', '90,000 sum'), T('Bepul', 'Бесплатно', 'Free'), T("60 000 so'm", '60 000 сумов', '60,000 sum')];
    return `
${MAIN(`
<div class="container">
  <div class="row">
    <div class="md:col-8">
      <img src="efootball.jpg" class="img-fluid rounded" alt="eFootball" style="width: 100%; height: 250px; object-fit: cover">
    </div>
    <div class="md:col-4">
      <div class="card theme-warning">
        <div class="card-body">
          <h3>${L(T('Kun taklifi', 'Предложение дня', 'Deal of the day'), l)}</h3>
          <p>${L(T('eFootball: yangi mavsum bugun yarim narxda!', 'eFootball: новый сезон сегодня за полцены!', 'eFootball: the new season is half price today!'), l)}</p>
          <a href="#" class="btn-solid theme-success">${L(T('Olish', 'Купить', 'Get it'), l)}</a>
        </div>
      </div>
    </div>
  </div>
  <h2 style="margin-top: 24px">${L(T("O'yinlar", 'Игры', 'Games'), l)}</h2>
  <div class="row">
${GAMES.map(([f, n, p], i) => `    <div class="md:col-4">
      <div class="card">
        <img src="${f}" class="card-img-top" alt="${n}" style="height: 170px; object-fit: cover">
        <div class="card-body">
          <h5>${n}</h5>
          <p>${L(p, l)}</p>
          <p class="fg-success"><b>${L(price[i], l)}</b></p>
          <a href="#" class="btn-solid theme-primary">${L(T('Olish', 'Купить', 'Get it'), l)}</a>
        </div>
      </div>
    </div>`).join('\n')}
  </div>
</div>`)}`; } },
  // 7 · Navbar и Pagination: тёмный Navbar с сайта, новости игр в сетке, номера страниц по центру
  { title: T("O'yin yangiliklari", 'Игровые новости', 'Game news'), js: true, files: GAMES.map((g) => g[0]), body: (l) => `
${NAV(l, L(T("O'yin yangiliklari", 'Игровые новости', 'Game news'), l), [W.home, W.news, W.games, W.contact])}
${MAIN(`
<div class="container">
  <h2>${L(T("So'nggi yangiliklar", 'Последние новости', 'Latest news'), l)}</h2>
  <div class="row">
${GAMES.map(([f, n, p]) => `    <div class="md:col-4">
      <div class="card">
        <img src="${f}" class="card-img-top" alt="${n}" style="height: 160px; object-fit: cover">
        <div class="card-body">
          <h5>${n}</h5>
          <p>${L(p, l)}</p>
        </div>
      </div>
    </div>`).join('\n')}
  </div>
</div>
<nav aria-label="Pages" style="margin-top: 24px">
  <ul class="pagination justify-content-center">
    <li class="page-item"><a class="page-link" href="#">${L(T('Oldingi', 'Назад', 'Previous'), l)}</a></li>
    <li class="page-item active"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">${L(T('Keyingi', 'Вперёд', 'Next'), l)}</a></li>
  </ul>
</nav>`)}` },
  // 8 · Формы: две колонки md:col-6 — фото и форма; email, select, radio, check; кнопка btn-solid
  { title: T("O'yin klubi", 'Игровой клуб', 'Game club'), files: ['roblox.jpg'], body: (l) => `
${NAV(l, L(T("O'yin klubi", 'Игровой клуб', 'Game club'), l), [W.home, W.games, W.contact])}
${MAIN(`
<div class="container">
  <div class="row align-items-center">
    <div class="md:col-6">
      <img src="roblox.jpg" class="img-fluid rounded" alt="Roblox">
    </div>
    <div class="md:col-6">
      <h2>${L(T("Klubga yozilish", 'Запись в клуб', 'Join the club'), l)}</h2>
      <form>
        <label for="ism" class="form-label">${L(T('Ism', 'Имя', 'Name'), l)}</label>
        <input type="text" id="ism" class="form-control" placeholder="${L(T('Ismingiz', 'Твоё имя', 'Your name'), l)}">
        <label for="pochta" class="form-label">${L(T('Pochta', 'Почта', 'Email'), l)}</label>
        <input type="email" id="pochta" class="form-control" placeholder="name@mail.uz">
        <label for="oyin" class="form-label">${L(T("O'yin", 'Игра', 'Game'), l)}</label>
        <select id="oyin" class="form-control">
          <option>Roblox</option>
          <option>Minecraft</option>
          <option>eFootball</option>
        </select>
        <div class="form-field">
          <input type="radio" name="kun" id="k1" class="radio" checked>
          <label for="k1">${L(T('Shanba', 'Суббота', 'Saturday'), l)}</label>
        </div>
        <div class="form-field">
          <input type="radio" name="kun" id="k2" class="radio">
          <label for="k2">${L(T('Yakshanba', 'Воскресенье', 'Sunday'), l)}</label>
        </div>
        <div class="form-field">
          <input type="checkbox" id="qoida" class="check">
          <label for="qoida">${L(T('Qoidalarga roziman', 'Согласен с правилами', 'I agree to the rules'), l)}</label>
        </div>
        <button type="submit" class="btn-solid theme-success" style="margin-top: 12px">${L(T('Yozilish', 'Записаться', 'Sign up'), l)}</button>
      </form>
    </div>
  </div>
</div>`)}` },
  // 9 · Карусель: автопрокрутка, кнопки и точки, всё в container шириной 760 px, под ней три машины в сетке
  { title: T('Superkarlar', 'Суперкары', 'Supercars'), js: true, files: CARS.map((c) => c[0]), body: (l) => `
${NAV(l, L(T('Superkarlar', 'Суперкары', 'Supercars'), l), [W.home, W.cars, W.contact])}
${MAIN(`
<div class="container" style="max-width: 760px">
  <div id="superkar" class="carousel slide" data-bs-autoplay="true">
    <div class="carousel-inner">
${CARS.map(([f, n], i) => `      <div class="carousel-item${i ? '' : ' active'}"><img src="${f}" class="d-block w-100" alt="${n}"></div>`).join('\n')}
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn-icon btn-sm" type="button" data-bs-target="#superkar" data-bs-slide="prev">
        <span class="carousel-icon-prev" aria-hidden="true"></span>
      </button>
      <div class="carousel-indicators">
${[0, 1, 2].map((i) => `        <button type="button" data-bs-target="#superkar" data-bs-slide-to="${i}"${i ? '' : ' class="active" aria-current="true"'} aria-label="Slide ${i + 1}"></button>`).join('\n')}
      </div>
      <button class="btn-icon btn-sm" type="button" data-bs-target="#superkar" data-bs-slide="next">
        <span class="carousel-icon-next" aria-hidden="true"></span>
      </button>
    </div>
  </div>
  <div class="row" style="margin-top: 16px">
${CARS.map(([, n, v]) => `    <div class="md:col-4">
      <div class="card">
        <div class="card-body">
          <h5>${n}</h5>
          <p class="fg-danger"><b>${v} ${L(KMH, l)}</b></p>
        </div>
      </div>
    </div>`).join('\n')}
  </div>
</div>`)}` },
  // 10 · Menu и Dialog: главный блок, меню пицц, окно заказа (на слайде — открыто)
  { title: T('Pitsa kafesi', 'Пиццерия', 'Pizzeria'), js: true, files: [], body: (l) => {
    const pz = [[T('Margarita', 'Маргарита', 'Margherita'), "45 000"], [T('Pepperoni', 'Пепперони', 'Pepperoni'), "55 000"], [T("Sabzavotli", 'Овощная', 'Veggie'), "50 000"]];
    return `
${NAV(l, L(T('Pitsa kafesi', 'Пиццерия', 'Pizzeria'), l), [W.home, W.menu, W.contact])}
${MAIN(`
<div class="bg-warning" style="${BOX}; text-align: center">
  <h1>${L(T('Issiq pitsa 30 daqiqada!', 'Горячая пицца за 30 минут!', 'Hot pizza in 30 minutes!'), l)}</h1>
  <button class="btn-solid theme-primary" type="button" data-bs-toggle="menu">${L(T('Menyu', 'Меню', 'Menu'), l)}</button>
  <div class="menu">
    <h6 class="menu-header">${L(T('Pitsalar', 'Пиццы', 'Pizzas'), l)}</h6>
${pz.map(([n]) => `    <a class="menu-item" href="#">${L(n, l)}</a>`).join('\n')}
    <hr class="menu-divider">
    <a class="menu-item" href="#">${L(T('Ichimliklar', 'Напитки', 'Drinks'), l)}</a>
  </div>
  <button class="btn-solid theme-success" type="button" data-bs-toggle="dialog" data-bs-target="#buyurtma">${L(T('Buyurtma', 'Заказать', 'Order'), l)}</button>
</div>
<div class="container">
  <div class="row">
${pz.map(([n, p]) => `    <div class="md:col-4">
      <div class="card">
        <div class="card-body">
          <h4>${L(n, l)}</h4>
          <p class="fg-danger"><b>${p} ${L(T("so'm", 'сумов', 'sum'), l)}</b></p>
        </div>
      </div>
    </div>`).join('\n')}
  </div>
</div>
<dialog class="dialog" id="buyurtma" data-bs-backdrop="static">
  <div class="dialog-header">
    <h4 class="dialog-title">${L(T('Buyurtma', 'Заказ', 'Order'), l)}</h4>
    ${CLOSE('data-bs-dismiss="dialog"')}
  </div>
  <div class="dialog-body">
    <label for="manzil" class="form-label">${L(T('Manzil', 'Адрес', 'Address'), l)}</label>
    <input type="text" id="manzil" class="form-control" placeholder="${L(T("Ko'cha, uy", 'Улица, дом', 'Street, house'), l)}">
  </div>
  <div class="dialog-footer">
    <button type="button" class="btn-solid theme-success" data-bs-dismiss="dialog">${L(T('Tasdiqlash', 'Подтвердить', 'Confirm'), l)}</button>
  </div>
</dialog>`)}`; } },
  // 11 · Финальный проект: киберфестиваль — Navbar с меню, карусель игр, e'lon, призы в сетке, окно участия
  { title: T('Kiberfestival', 'Киберфестиваль', 'Cyber festival'), js: true, files: GAMES.map((g) => g[0]), body: (l) => {
    const prize = [['Minecraft', T("1 000 000 so'm", '1 000 000 сумов', '1,000,000 sum')], ['Roblox', T("700 000 so'm", '700 000 сумов', '700,000 sum')], ['eFootball', T("500 000 so'm", '500 000 сумов', '500,000 sum')]];
    const extra = `          <li class="nav-item">
            <button class="nav-link" type="button" data-bs-toggle="menu">${L(W.games, l)}</button>
            <div class="menu">
${GAMES.map(([, n]) => `              <a class="menu-item" href="#">${n}</a>`).join('\n')}
            </div>
          </li>`;
    return `
${NAV(l, L(T('Kiberfestival', 'Киберфестиваль', 'Cyber festival'), l), [W.home, W.prizes], { extra })}
${MAIN(`
<div class="container" style="max-width: 640px">
  <div id="oyinlar" class="carousel slide">
    <div class="carousel-inner">
${GAMES.map(([f, n], i) => `      <div class="carousel-item${i ? '' : ' active'}"><img src="${f}" class="d-block w-100" alt="${n}"></div>`).join('\n')}
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn-icon btn-sm" type="button" data-bs-target="#oyinlar" data-bs-slide="prev">
        <span class="carousel-icon-prev" aria-hidden="true"></span>
      </button>
      <button class="btn-icon btn-sm" type="button" data-bs-target="#oyinlar" data-bs-slide="next">
        <span class="carousel-icon-next" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</div>
<div class="alert theme-info" role="alert" style="margin-top: 16px"><p>${L(T('Festival 14-dekabr kuni, maktab zalida!', 'Фестиваль 14 декабря в школьном зале!', 'The festival is on December 14 in the school hall!'), l)}</p></div>
<div class="container">
  <div class="row">
${prize.map(([n, v]) => `    <div class="md:col-4">
      <div class="card">
        <div class="card-body">
          <h5>${n}</h5>
          <p class="fg-success"><b>${L(T('Sovrin', 'Приз', 'Prize'), l)}: ${L(v, l)}</b></p>
        </div>
      </div>
    </div>`).join('\n')}
  </div>
</div>
<button class="btn-solid theme-danger" type="button" data-bs-toggle="dialog" data-bs-target="#qatnashish" style="margin-top: 16px">${L(T('Qatnashish', 'Участвовать', 'Join'), l)}</button>
<dialog class="dialog" id="qatnashish">
  <div class="dialog-header">
    <h4 class="dialog-title">${L(T('Qatnashish', 'Участие', 'Join'), l)}</h4>
    ${CLOSE('data-bs-dismiss="dialog"')}
  </div>
  <div class="dialog-body">
    <form>
      <label for="ism" class="form-label">${L(T('Ism', 'Имя', 'Name'), l)}</label>
      <input type="text" id="ism" class="form-control">
      <label for="oyin" class="form-label">${L(T("O'yin", 'Игра', 'Game'), l)}</label>
      <select id="oyin" class="form-control">
${GAMES.map(([, n]) => `        <option>${n}</option>`).join('\n')}
      </select>
      <button type="submit" class="btn-solid theme-success" style="margin-top: 12px">${L(T('Yuborish', 'Отправить', 'Send'), l)}</button>
    </form>
  </div>
</dialog>`)}`; } },
];

let n = 0;
PAGES.forEach((p, i) => {
  const dir = path.join(OUT, String(i + 1).padStart(2, '0'));
  for (const lang of LANGS) {
    const d = lang === 'uz' ? dir : path.join(dir, lang);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'index.html'), page(lang, L(p.title, lang), p.body(lang), p.js));
    for (const f of p.files) fs.copyFileSync(path.join(FOTO, f), path.join(d, f));
    n += 1;
  }
});
console.log(`Готово: ${n} страниц в ${path.relative(ROOT, OUT)}/`);
