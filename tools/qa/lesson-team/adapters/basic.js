// Базовый адаптер QA: для уроков и страниц без канона курса HTML (будущие модули,
// эталоны других курсов, самопроверка QA). Знает только общее:
//   · готовность — плеер сообщил loaded и в документе есть содержимое
//     (или элемент [data-qa-ready]);
//   · переполнение — прокрутка документа;
//   · эмуляция клавиатуры — уменьшение высоты iframe (видимая область меньше).
// Кнопок «Дальше» / «Назад», ведущего и экранов он не знает: такие действия
// описывает сценарий конкретного урока. Новому модулю с собственным каркасом —
// свой адаптер рядом (см. README).

export async function install(QA) {
  const platform = {
    name: 'basic',
    contentSelector: null,
    expectsServiceVoice: false,
    supportsLayoutSweep: false,
    isReady() {
      if (QA.q('[data-qa-ready]')) return true;
      const d = QA.doc();
      return QA.loaded() && !!d && !!d.body && d.body.innerText.trim().length > 0 && !/Загружаю урок/.test(d.body.innerText);
    },
    ready: async () => true,
    screen: () => null,
    total: () => null,
    fit() {
      const d = QA.doc(), w = QA.win();
      const se = d.scrollingElement || d.documentElement;
      const H = w.innerHeight, W = w.innerWidth;
      const out = [...d.querySelectorAll('body *')].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.right > W + 1 || r.left < -1 || r.bottom > H + 1);
      }).slice(0, 4).map((e) => (typeof e.className === 'string' && e.className) || e.tagName);
      return { over: se.scrollHeight - se.clientHeight, hscroll: se.scrollWidth - W, out };
    },
    // ЭМУЛЯЦИЯ клавиатуры: видимая высота урока уменьшается до vvh.
    async kbd(on = true, vvh = 330) {
      QA.frame.style.height = on ? vvh + 'px' : '100%';
      await QA.sleep(400);
      return platform.fit();
    },
    next() { throw new Error('Адаптер basic не знает кнопку «Дальше»: опиши действие в сценарии урока'); },
    back() { throw new Error('Адаптер basic не знает кнопку «Назад»: опиши действие в сценарии урока'); },
  };
  QA.platform = platform;
  return { name: platform.name };
}
