// Курс «Bootstrap» — план уроков (заказчик, 19.11.2026: «теперь делаем следующий модуль bootstrap»; темы — его список).
// Модуль идёт после «ИИ» (дорожная карта заказчика 17.11.2026: HTML → CSS → ИИ → Bootstrap → …).
// Файл урока: lessons/bootstrap/<NN>-<slug>.jsx, где NN — номер урока (01, 02 …).
// Урок находится по номеру: как только файл появится, он станет «готов» в каталоге.
// Решения заказчика 19.11.2026: только Bootstrap 6 (источник — getbootstrap.com/docs/6.0; где имя поменялось, старое из
// версии 5 можно назвать одной фразой); подключение — ссылкой CDN с сайта, целиком (с integrity и crossorigin); главное умение —
// найти нужное на сайте Bootstrap, скопировать и настроить под себя. Состав — как в HTML и CSS (облик «Редактор»), но
// практики, тесты, задания компилятора и тренажёр — позже, по слову заказчика (practice / tests не ставить).

export default {
  title: 'Bootstrap',
  subtitle: 'Сайт из готовых классов',
  short: 'BS',
  color: '#7952B3',
  order: 4,
  lessons: [
    { n: 1, slug: 'vvedenie', title: 'Введение в Bootstrap', topics: ['что такое Bootstrap', 'сайт документации', 'подключение CDN', 'готовые классы'] },
    { n: 2, slug: 'cveta-i-knopki', title: 'Цвета и кнопки', topics: ['theme-*', 'text-* и bg-*', 'btn-solid', 'btn-outline'] },
    { n: 3, slug: 'zagruzka-i-izobrazheniya', title: 'Загрузка и изображения', topics: ['spinner', 'placeholder (если хватит места)', 'img-fluid', 'rounded'] },
    { n: 4, slug: 'flex', title: 'Flex', topics: ['d-flex', 'justify-content-*', 'align-items-*', 'gap-*'] },
    { n: 5, slug: 'kartochki', title: 'Карточки', topics: ['card', 'card-body', 'card-title', 'card-img-top'] },
    { n: 6, slug: 'kontejner-i-setka', title: 'Контейнер и сетка', topics: ['container', 'row', 'col', 'колонки по ширине экрана'] },
    { n: 7, slug: 'formy', title: 'Формы', topics: ['form-control', 'form-label', 'form-select', 'form-check'] },
    { n: 8, slug: 'karusel', title: 'Карусель', topics: ['carousel', 'carousel-item', 'slide'] },
    { n: 9, slug: 'menu-i-dialog', title: 'Menu и Dialog', topics: ['menu', 'dialog', 'data-bs-toggle'] },   // в Bootstrap 6 Dropdown → Menu, Modal → Dialog
    { n: 10, slug: 'final-proekt', title: 'Финальный проект', topics: [], final: true },
  ],
};
