// Курс «Bootstrap» — план уроков (заказчик, 19.11.2026: «теперь делаем следующий модуль bootstrap»; темы — его список).
// Модуль идёт после «ИИ» (дорожная карта заказчика 17.11.2026: HTML → CSS → ИИ → Bootstrap → …).
// Файл урока: lessons/bootstrap/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …).
// Урок находится по номеру: как только файл появится, он станет «готов» в каталоге.
// Решения заказчика 19.11.2026: только Bootstrap 6 (источник — getbootstrap.com/docs/6.0; где имя поменялось, старое из
// версии 5 можно назвать одной фразой); подключение — ссылкой CDN с сайта, целиком (с integrity и crossorigin); главное умение —
// найти нужное на сайте Bootstrap, скопировать и настроить под себя. Состав — как в HTML и CSS (облик «Редактор»), но
// задания компилятора и тренажёр — позже, по слову заказчика.
// Практики (заказчик, 21.11.2026: «сегодня должны создать практики для бутстрапа… вот эти jsx») — каркас tools/bsp
// (поверх каркаса практик CSS), файлы lessons/bootstrap/NNp-<slug>.jsx, сборка node tools/bsp/build.mjs NN; финальному уроку 11 — нет.
// Тесты (заказчик, 20.11.2026: «делай тесты для уроков бутстрапа») — как у HTML и CSS: после урока «Тест 1/5…5/5»,
// файлы lessons/bootstrap/NNtK-<slug>.jsx, сборка node tools/webtest/build.mjs bootstrap; финальному уроку 11 — нет.

export default {
  title: 'Bootstrap',
  subtitle: 'Сайт из готовых классов',
  short: 'BS',
  color: '#7952B3',
  order: 4,
  practice: true,  // после урока — практика (<NN>p-<slug>.jsx), потом тесты
  tests: true,
  lessons: [
    { n: 1, slug: 'vvedenie', title: 'Введение в Bootstrap', topics: ['что такое Bootstrap', 'сайт документации', 'подключение CDN', 'готовые классы'], practiceTitle: 'Объявления возвращаются' },
    { n: 2, slug: 'cveta-i-knopki', title: 'Цвета и кнопки', topics: ['theme-*', 'text-* и bg-*', 'btn-solid', 'btn-outline'], practiceTitle: 'Цвета возвращаются' },
    { n: 3, slug: 'zagruzka-i-izobrazheniya', title: 'Загрузка и изображения', topics: ['spinner', 'placeholder (если хватит места)', 'img-fluid', 'rounded'], practiceTitle: 'Галерея' },
    { n: 4, slug: 'flex', title: 'Flex', topics: ['d-flex', 'justify-content-*', 'align-items-*', 'gap-*'], practiceTitle: 'Всё в ряд' },
    { n: 5, slug: 'kartochki', title: 'Карточки', topics: ['card', 'card-body', 'card-title', 'card-img-top'], practiceTitle: 'Карточки роботов' },
    { n: 6, slug: 'kontejner-i-setka', title: 'Контейнер и сетка', topics: ['container', 'row', 'col', 'колонки по ширине экрана'], practiceTitle: 'Сетка страницы' },
    // Урок 7 «Navbar и Pagination» (заказчик, 23.11.2026: «давай после сетки поставим») — прежние 7–10 стали 8–11.
    { n: 7, slug: 'navbar-i-pagination', title: 'Navbar и Pagination', topics: ['navbar', 'navbar-brand', 'nav-link', 'md:navbar-expand', 'pagination'], practiceTitle: 'Навигация сайта' },
    { n: 8, slug: 'formy', title: 'Формы', topics: ['form-control', 'form-label', 'form-select', 'form-check'], practiceTitle: 'Анкета записи' },
    { n: 9, slug: 'karusel', title: 'Карусель', topics: ['carousel', 'carousel-item', 'slide'], practiceTitle: 'Выставка роботов' },
    { n: 10, slug: 'menu-i-dialog', title: 'Menu и Dialog', topics: ['menu', 'dialog', 'data-bs-toggle'], practiceTitle: 'Страница турнира' },   // в Bootstrap 6 Dropdown → Menu, Modal → Dialog
    { n: 11, slug: 'final-proekt', title: 'Финальный проект', topics: [], final: true },
  ],
};
