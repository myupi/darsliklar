// Название урока, практики или теста на трёх языках для шапки просмотрщика (заказчик, 18.11.2026).
// Уроки и практики — META.lessonTitle из самого файла (tools/vite-lesson-titles.mjs); у тестов своего META нет —
// «Test K/5 · <тема урока>» по названию урока. Нет файла или META — null (шапка покажет русское название из плана).
import TITLES from 'virtual:lesson-titles';

const LANGS = ['uz', 'ru', 'en'];
const TEST = { uz: 'Test', ru: 'Тест', en: 'Test' };
const PREFIX = { uz: /^\d+-dars\.\s*/, ru: /^Урок \d+\.\s*/, en: /^Lesson \d+\.\s*/ };

export function titlesOf(lesson, course) {
  if (!lesson || !lesson.file) return null;
  if (TITLES[lesson.file]) return TITLES[lesson.file];
  if (lesson.kind === 'test' && lesson.tk != null && course) {
    // Урок частями: тема теста — по целому файлу урока (<NN>-<slug>), а не по части.
    // Тест части урока (<NN>q<K>t<J>): тема — название этой части (её файл урока).
    if (lesson.qk != null && lesson.slug) {
      const part = TITLES[`${lesson.course}/${String(lesson.n).padStart(2, '0')}q${lesson.qk}-${lesson.slug}`];
      if (part) return Object.fromEntries(LANGS.map((l) => [l, `${TEST[l]} ${lesson.tk}/5 · ${part[l].replace(PREFIX[l], '')}`]));
    }
    const whole = lesson.slug ? TITLES[`${lesson.course}/${String(lesson.n).padStart(2, '0')}-${lesson.slug}`] : null;
    const own = course.lessons.find((l) => l.kind === 'lesson' && l.n === lesson.n && l.file);
    const t = whole || (own && TITLES[own.file]);
    if (!t) return null;
    return Object.fromEntries(LANGS.map((l) => [l, `${TEST[l]} ${lesson.tk}/5 · ${t[l].replace(PREFIX[l], '')}`]));
  }
  return null;
}
