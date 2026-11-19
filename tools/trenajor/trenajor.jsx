// =============================================================================
// ТРЕНАЖЁР МОДУЛЯ (HTML; заказчик, 18.11.2026) — один JSX для LMS Junior + банк вопросов JSON рядом.
// Контракт — как у тренажёра математики LMS (образец: lessons/test/trenajor/):
//   <Trainer attempt lang busy onAnswer onFinished onRestart onExit />
//   attempt: { kind: 'reward'|'practice', status: 'in_progress'|'finished', question_count, started_at, finished_at,
//              coins_per_correct, points_per_correct, correct_count, reward: { coins, points }, reward_date,
//              questions: [вопрос банка …] — открываются по одному (ответов + 1), correct_answer у ещё не отвеченного — null,
//              answers: [{ question_id, option_id, correct }] }
//   onAnswer(questionId, optionId), onFinished() — LMS сохраняет и меняет attempt; может вернуть Promise (ошибка → «Yana bosing»).
//   onRestart, onExit — необязательны: без них кнопок нет.
// Вопросы выбирает, проверяет и награждает LMS; тренажёр только показывает. Импорт — только react.
// Облик — наш: стол в точку, белые карточки, оранжевый CoddyCamp #FA4F28, код — в тёмном редакторе как в уроках,
// страница — в окне Chrome (iframe без скриптов, HTML рисует сам браузер). Экран без прокрутки: картинка берёт остаток места.
// Языки: uz (Siz), ru (ты), en. Исходник — tools/trenajor/trenajor.jsx, копию с банком кладёт node tools/trenajor/build.mjs.
// =============================================================================
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const SESSION_DEFAULT = 15;
const VIS_PREFIX = '@htmlvis:';
const tx = (v, lang) => (v == null ? '' : typeof v === 'object' && !Array.isArray(v) ? String(v[lang] ?? v.uz ?? v.ru ?? '') : String(v));

const LABELS = {
  uz: {
    title: (m) => [m, <em key="t">trenajyori</em>], kicker: 'Mashq qilamizmi?', questions: (n) => `${n} ta savol`, perCorrect: "To'g'ri javob uchun", max: "Eng ko'pi",
    how: 'Qanday ishlaydi', rules: [
      "Savollarga javob bering: tanlang, yozing, bo'laklardan yig'ing yoki sahifada bosing. Javobni keyin o'zgartirib bo'lmaydi.",
      "Javobdan keyin izoh chiqadi: nega aynan shu javob to'g'ri.",
      "Har bir to'g'ri javob saytingizga bitta blok qo'shadi. Oxirida — tayyor sayt!",
      "Mukofot oxirida to'g'ri javoblar soniga qarab hisoblanadi. Chiqib ketsangiz ham, javoblar saqlanadi.",
    ], practiceRule: "Bu mashq: coin va point berilmaydi, xohlagancha mashq qilsangiz bo'ladi.",
    bubble: 'Sayt quramizmi?', start: 'Boshlash', startPractice: 'Mashq qilish',
    code: 'Kod', page: 'Natija', question: 'Savol', lesson: (n) => `${n}-dars`, next: 'Keyingi', finish: "Natijani ko'rish", right: "To'g'ri!", wrong: "Noto'g'ri",
    rightIs: (k) => `To'g'ri javob — ${k}.`, saving: 'Saqlanmoqda…', sendError: "Saqlab bo'lmadi. Yana bir bor bosing.", hint: '1–4 — javob, Enter — keyingisi',
    check: 'Tekshirish', typeHere: 'Javobni shu yerga yozing', rightAnswer: "To'g'ri javob", hintInput: 'Javobni yozing va Enter bosing',
    hintBuild: "Bo'laklarni tartib bilan bosing", undo: "Oxirgisini olib tashlash", hintBug: "Xato bor qatorni bosing", hintTap: "Sahifada kerakli joyni bosing",
    rightLine: (n) => `Xato — ${n}-qatorda.`, rightPlace: "To'g'ri joy yashil bilan belgilandi.", lineN: (n) => `${n}-qator`,
    site: 'Saytingiz', siteOf: (a, b) => `${a} / ${b} blok tayyor`, holeHint: "Bo'sh blokni bosing — qaysi savol ekanini ko'rasiz", qN: (n) => `${n}-savol`, yourAnswer: 'Sizning javobingiz',
    parts: ['Logo', 'Sarlavha', 'Menyu', 'Rasm', 'Banner matni', 'Tugma', '1-karta', '2-karta', '3-karta', 'Matn', "Ro'yxat", 'Forma maydoni', 'Forma tugmasi', 'Kontaktlar', 'Ijtimoiy tarmoqlar'],
    streak: (n) => `${n} ta ketma-ket`, result: 'Natija', of: (a, b) => `${a} / ${b}`, correctWord: "to'g'ri javob", time: 'Vaqt',
    byLesson: "Darslar bo'yicha", reward: 'Hisoblandi', rewardDate: 'Mukofot sanasi', practice: 'Mukofotsiz mashq', restart: 'Yana mashq qilish', leave: 'Chiqish', exit: 'Chiqish',
    praise: ["Mavzularni takrorlab, yana urinib ko'ring!", 'Yaxshi! Yana biroz mashq qiling.', "Zo'r natija!", "Ajoyib! Hammasi to'g'ri!"],
    coins: 'coin', points: 'point',
    errors: { missing: "LMS urinishni yubormadi.", questions: "LMS savollarni yubormadi yoki ular yetarli emas.", bad: "Savol tuzilishi noto'g'ri", answers: "Urinishda javoblar soni noto'g'ri." },
  },
  ru: {
    title: (m) => [<em key="t">Тренажёр</em>, m], kicker: 'Потренируемся?', questions: (n) => `${n} вопросов`, perCorrect: 'За верный ответ', max: 'Максимум',
    how: 'Как это работает', rules: [
      'Отвечай на вопросы: выбери, впиши, собери из кусочков или нажми на странице. Потом ответ не изменить.',
      'После ответа появится пояснение: почему верен именно этот ответ.',
      'Каждый верный ответ добавляет блок на твой сайт. В конце — готовый сайт!',
      'Награду посчитают в конце по числу верных ответов. Если выйдешь, ответы сохранятся.',
    ], practiceRule: 'Это тренировка: коины и поинты не начисляются, занимайся сколько хочешь.',
    bubble: 'Строим сайт?', start: 'Начать', startPractice: 'Тренироваться',
    code: 'Код', page: 'Результат', question: 'Вопрос', lesson: (n) => `Урок ${n}`, next: 'Дальше', finish: 'Показать результат', right: 'Верно!', wrong: 'Неверно',
    rightIs: (k) => `Верный ответ — ${k}.`, saving: 'Сохраняем…', sendError: 'Не удалось сохранить. Нажми ещё раз.', hint: '1–4 — ответ, Enter — дальше',
    check: 'Проверить', typeHere: 'Напиши ответ здесь', rightAnswer: 'Верный ответ', hintInput: 'Напиши ответ и нажми Enter',
    hintBuild: 'Нажимай кусочки по порядку', undo: 'Убрать последний', hintBug: 'Нажми на строку с ошибкой', hintTap: 'Нажми на нужное место на странице',
    rightLine: (n) => `Ошибка — в строке ${n}.`, rightPlace: 'Верное место обведено зелёным.', lineN: (n) => `строка ${n}`,
    site: 'Твой сайт', siteOf: (a, b) => `Готово блоков: ${a} из ${b}`, holeHint: 'Нажми на пустой блок — увидишь, какой это был вопрос', qN: (n) => `Вопрос ${n}`, yourAnswer: 'Твой ответ',
    parts: ['Логотип', 'Заголовок', 'Меню', 'Картинка', 'Текст баннера', 'Кнопка', 'Карточка 1', 'Карточка 2', 'Карточка 3', 'Текст', 'Список', 'Поле формы', 'Кнопка формы', 'Контакты', 'Соцсети'],
    streak: (n) => `${n} подряд`, result: 'Результат', of: (a, b) => `${a} / ${b}`, correctWord: 'верных ответов', time: 'Время',
    byLesson: 'По урокам', reward: 'Начислено', rewardDate: 'Награда за', practice: 'Тренировка без награды', restart: 'Ещё раз', leave: 'Выйти', exit: 'Выйти',
    praise: ['Повтори темы и попробуй ещё раз!', 'Хорошо! Ещё немного практики.', 'Отличный результат!', 'Великолепно! Всё верно!'],
    coins: 'coin', points: 'point',
    errors: { missing: 'LMS не передала попытку.', questions: 'LMS не передала вопросы или их недостаточно.', bad: 'Неверная схема вопроса', answers: 'В попытке неверное число ответов.' },
  },
  en: {
    title: (m) => [m, <em key="t">trainer</em>], kicker: 'Ready to practise?', questions: (n) => `${n} questions`, perCorrect: 'Per correct answer', max: 'Up to',
    how: 'How it works', rules: [
      'Answer each question: choose, type, build from pieces or tap on the page. You can’t change it afterwards.',
      'After you answer, you’ll see why exactly that answer is correct.',
      'Every correct answer adds a block to your website. At the end — a finished site!',
      'The reward is counted at the end by the number of correct answers. If you leave, your answers are saved.',
    ], practiceRule: 'This is practice: no coins or points, practise as much as you like.',
    bubble: 'Let’s build a site?', start: 'Start', startPractice: 'Practise',
    code: 'Code', page: 'Result', question: 'Question', lesson: (n) => `Lesson ${n}`, next: 'Next', finish: 'See result', right: 'Correct!', wrong: 'Not quite',
    rightIs: (k) => `The correct answer is ${k}.`, saving: 'Saving…', sendError: 'Couldn’t save. Tap once more.', hint: '1–4 — answer, Enter — next',
    check: 'Check', typeHere: 'Type your answer here', rightAnswer: 'Correct answer', hintInput: 'Type your answer and press Enter',
    hintBuild: 'Tap the pieces in order', undo: 'Remove the last one', hintBug: 'Tap the line with the mistake', hintTap: 'Tap the right place on the page',
    rightLine: (n) => `The mistake is in line ${n}.`, rightPlace: 'The right place is outlined in green.', lineN: (n) => `line ${n}`,
    site: 'Your website', siteOf: (a, b) => `${a} of ${b} blocks built`, holeHint: 'Tap an empty block to see which question it was', qN: (n) => `Question ${n}`, yourAnswer: 'Your answer',
    parts: ['Logo', 'Heading', 'Menu', 'Picture', 'Banner text', 'Button', 'Card 1', 'Card 2', 'Card 3', 'Text', 'List', 'Form field', 'Form button', 'Contacts', 'Social links'],
    streak: (n) => `${n} in a row`, result: 'Result', of: (a, b) => `${a} / ${b}`, correctWord: 'correct answers', time: 'Time',
    byLesson: 'By lesson', reward: 'Earned', rewardDate: 'Reward for', practice: 'Practice without reward', restart: 'Practise again', leave: 'Exit', exit: 'Exit',
    praise: ['Review the topics and try again!', 'Good! A bit more practice.', 'Great result!', 'Amazing! All correct!'],
    coins: 'coin', points: 'point',
    errors: { missing: 'The LMS did not send an attempt.', questions: 'The LMS sent no questions or not enough.', bad: 'Invalid question', answers: 'Wrong number of answers in the attempt.' },
  },
};
// Свои подписи модуля CSS (19.11.2026): миссия «Сайт одевается» — каждый верный ответ оформляет одну часть сайта.
const MOD_LABELS = {
  css: {
    uz: {
      rule3: "Har bir to'g'ri javob saytingizning bitta qismini bezaydi: rang, shrift, soya. Oxirida — chiroyli sayt!",
      bubble: 'Saytni bezaymizmi?', siteOf: (a, b) => `${a} / ${b} qism bezaldi`, holeHint: "Bezalmay qolgan qismni bosing — qaysi savol ekanini ko'rasiz",
      parts: ['Logo rangi', 'Sarlavha shrifti', 'Menyu qatorda', "Rasm o'lchami", 'Banner matni', 'Yumaloq tugma', '1-karta soyasi', '2-karta soyasi', '3-karta soyasi', 'Matn rangi', "Ro'yxat bezagi", 'Maydon chegarasi', 'Tugma rangi', 'Pastki qism', 'Hover effekti'],
    },
    ru: {
      rule3: 'Каждый верный ответ оформляет одну часть твоего сайта: цвет, шрифт, тень. В конце — красивый сайт!',
      bubble: 'Оформим сайт?', siteOf: (a, b) => `Оформлено частей: ${a} из ${b}`, holeHint: 'Нажми на неоформленную часть — увидишь, какой это был вопрос',
      parts: ['Цвет логотипа', 'Шрифт заголовка', 'Меню в ряд', 'Размер картинки', 'Текст баннера', 'Круглая кнопка', 'Тень карточки 1', 'Тень карточки 2', 'Тень карточки 3', 'Цвет текста', 'Оформление списка', 'Рамка поля', 'Цвет кнопки', 'Подвал', 'Эффект наведения'],
    },
    en: {
      rule3: 'Every correct answer styles one part of your website: colour, font, shadow. At the end — a beautiful site!',
      bubble: 'Let’s style the site?', siteOf: (a, b) => `${a} of ${b} parts styled`, holeHint: 'Tap an unstyled part to see which question it was',
      parts: ['Logo colour', 'Heading font', 'Menu in a row', 'Picture size', 'Banner text', 'Rounded button', 'Card 1 shadow', 'Card 2 shadow', 'Card 3 shadow', 'Text colour', 'List style', 'Field border', 'Button colour', 'Footer', 'Hover effect'],
    },
  },
};
const labelsOf = (lang, mod) => {
  const base = LABELS[lang] || LABELS.uz;
  const o = MOD_LABELS[mod] && (MOD_LABELS[mod][lang] || MOD_LABELS[mod].uz);
  if (!o) return base;
  const { rule3, ...rest } = o;
  return Object.assign({}, base, rest, { rules: base.rules.map((r, i) => (i === 2 && rule3 ? rule3 : r)) });
};

// ── КОДИ — герой курса (заказчик, 18.11.2026: «поставь наш робот»): тот же рисунок, что в уроках (canon/html/hero-tail.part.jsx,
// RobotSVG — голова в белом кружке: кремовый шлем, медные рамка и уши, тёмный экран, светящиеся глаза). Без системы поз урока:
// mood idle — глаза-точки и улыбка, happy — глаза-дуги, жёлтое свечение, think — серое свечение и ровный рот.
const KODI_GLOW = { idle: '#58F4F2', happy: '#FFD24A', think: '#7E8A99' };
let kodiUid = 0;
function Kodi({ mood = 'idle', size = 64 }) {
  const id = useMemo(() => 'htk' + (++kodiUid), []);
  const g = KODI_GLOW[mood] || KODI_GLOW.idle;
  const u = (k) => `url(#${id}${k})`;
  const ear = (x, l) => <>
    <rect x={x} y="78" width="16" height="62" rx="8" fill={u('c')} />
    <rect x={x + (l ? 7.5 : 3.5)} y="88" width="5" height="42" rx="2.5" fill={u('cup')} />
    <rect x={x + (l ? 8.5 : 4.5)} y="92" width="3" height="34" rx="1.5" fill="none" stroke={g} strokeWidth="2.5" opacity=".22" />
  </>;
  return (
    <span className={'ht-kodi is-' + mood} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="96.5 -13 227 227" focusable="false">
        <defs>
          <linearGradient id={id + 'h'} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FCFAF6" /><stop offset="55%" stopColor="#F3EFE6" /><stop offset="100%" stopColor="#E7E1D4" /></linearGradient>
          <radialGradient id={id + 'hl'} cx="28%" cy="14%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity=".95" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <radialGradient id={id + 'hs'} cx="78%" cy="100%" r="75%"><stop offset="0%" stopColor="#CBC2AF" stopOpacity=".95" /><stop offset="100%" stopColor="#CBC2AF" stopOpacity="0" /></radialGradient>
          <linearGradient id={id + 'c'} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4B57C" /><stop offset="38%" stopColor="#C8742F" /><stop offset="72%" stopColor="#8C4A1E" /><stop offset="100%" stopColor="#C8742F" /></linearGradient>
          <radialGradient id={id + 's'} cx="210" cy="104" r="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#18242B" /><stop offset="100%" stopColor="#0A0F12" /></radialGradient>
          <pattern id={id + 'px'} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0.5 H3" stroke="#000" strokeWidth=".7" opacity=".2" /></pattern>
          <radialGradient id={id + 'cup'} cx="38%" cy="32%" r="70%"><stop offset="0%" stopColor="#6B4328" /><stop offset="100%" stopColor="#2E1C11" /></radialGradient>
          <clipPath id={id + 'v'}><rect x="132" y="53" width="156" height="107" rx="27" /></clipPath>
          <clipPath id={id + 'hc'}><rect x="108" y="24" width="204" height="153" rx="62" /></clipPath>
          <filter id={id + 'bl'} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="11" /></filter>
        </defs>
        <rect x="108" y="24" width="204" height="153" rx="62" fill={u('h')} />
        <g clipPath={u('hc')}>
          <rect x="108" y="24" width="204" height="153" fill={u('hs')} />
          <rect x="108" y="24" width="204" height="153" fill={u('hl')} />
          {ear(104, true)}{ear(300, false)}
        </g>
        <rect x="108" y="24" width="204" height="153" rx="62" fill="none" stroke="#B9AE99" strokeWidth="1.4" opacity=".55" />
        <rect x="123" y="44" width="174" height="125" rx="35" fill={u('c')} />
        <rect x="127.5" y="48.5" width="165" height="116" rx="31" fill="none" stroke="#8C4A1E" strokeWidth="2" opacity=".55" />
        <path d="M150 45 Q210 38 270 45" fill="none" stroke="#FFE2C6" strokeWidth="3" strokeLinecap="round" opacity=".6" />
        <rect x="132" y="53" width="156" height="107" rx="27" fill={u('s')} />
        <g clipPath={u('v')}>
          {mood === 'happy' && <><ellipse cx="152" cy="140" rx="12" ry="6" fill="#FF8FB0" opacity=".55" /><ellipse cx="268" cy="140" rx="12" ry="6" fill="#FF8FB0" opacity=".55" /></>}
          <g className="ht-kodi-eyes">
            <circle cx="172" cy="104" r="17" fill={g} opacity=".7" filter={u('bl')} />
            <circle cx="248" cy="104" r="17" fill={g} opacity=".7" filter={u('bl')} />
            {mood === 'happy' ? <>
              <path d="M160 110 Q172 94 184 110" fill="none" stroke={g} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M236 110 Q248 94 260 110" fill="none" stroke={g} strokeWidth="5.5" strokeLinecap="round" />
            </> : <>
              <circle className="ht-kodi-eye" cx="172" cy="104" r="12.5" fill={g} />
              <circle className="ht-kodi-eye" cx="248" cy="104" r="12.5" fill={g} />
            </>}
          </g>
          <g style={{ filter: `drop-shadow(0 0 3px ${g})` }}>
            {mood === 'think'
              ? <path d="M196 139 L224 139" fill="none" stroke={g} strokeWidth="5" strokeLinecap="round" />
              : mood === 'happy'
                ? <path d="M190 127 L230 127 Q230 151 210 151 Q190 151 190 127 Z" fill={g} />
                : <path d="M183 128 Q210 147 237 128" fill="none" stroke={g} strokeWidth="5.5" strokeLinecap="round" />}
          </g>
          <rect x="132" y="53" width="156" height="107" fill={u('px')} />
          <path d="M140 62 Q154 54 188 54 L156 104 Q138 96 140 62 Z" fill="#fff" opacity=".07" />
          <ellipse cx="210" cy="54" rx="66" ry="8" fill="#fff" opacity=".06" />
          <rect x="143" y="58" width="26" height="5" rx="2.5" fill="#fff" opacity=".2" />
          <path d="M150 40 L176 40 L146 180 L120 180 Z" fill="#fff" opacity=".1" />
        </g>
        <rect x="132" y="53" width="156" height="107" rx="27" fill="none" stroke="#000" strokeWidth="3" opacity=".35" />
      </svg>
    </span>
  );
}

// ── Значки ──
const IcX = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
const IcOk = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IcArrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IcFlame = () => <svg viewBox="0 0 24 28" aria-hidden="true"><path d="M12 1c1 5 7 8 7 15a7 7 0 0 1-14 0c0-3 2-5 3-7 .5 2 1.5 3 2.5 3C10 9 10 5 12 1z" fill="#FA4F28" /><path d="M12 13c.6 2.6 3.4 3.8 3.4 7a3.4 3.4 0 0 1-6.8 0c0-1.6 1-2.6 1.6-3.6.3 1 .8 1.4 1.3 1.4-.4-1.8-.2-3.2.5-4.8z" fill="#FFD24A" /></svg>;
const IcCoin = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FFC83D" stroke="#D99A12" strokeWidth="2" /><circle cx="12" cy="12" r="5.6" fill="none" stroke="#FFF1B8" strokeWidth="1.8" /></svg>;
const IcStar = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#FFB020" stroke="#E08A00" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
const RULE_ICONS = [
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 8.5h18" stroke="currentColor" strokeWidth="2" /><rect x="6" y="11" width="6" height="6" rx="1" fill="currentColor" /><path d="M14.5 12h4M14.5 15.5h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="0" /></svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 7.5v9M9.5 9.8c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 1.7-2.5 2.2-2.5 1-2.5 2.2 1.1 2 2.5 2 2.5-.8 2.5-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
];
const IcBack = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6H9l-6 6 6 6h11z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M11.5 9.5l5 5M16.5 9.5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

// ── МИССИЯ «САЙТ СТРОИТСЯ» (18.11.2026): 15 блоков сайта, каждый верный ответ строит свой блок, неверный оставляет дыру ──
// Блок p строят вопросы partQs(N)[p]: при 15 вопросах — по одному, при 5 — один вопрос строит три блока, при 30 — два вопроса один блок.
const PARTS = [
  { b: [5.5, 13, 9, 9], d: <circle cx="10" cy="17.5" r="4.2" fill="#FA4F28" /> },
  { b: [17, 15, 32, 5], d: <rect x="17" y="15" width="32" height="5" rx="2.5" fill="#2E2A4F" /> },
  { b: [66, 15, 48, 5], d: <g fill="#7C6CF2"><rect x="66" y="15" width="14" height="5" rx="2.5" /><rect x="83" y="15" width="14" height="5" rx="2.5" /><rect x="100" y="15" width="14" height="5" rx="2.5" /></g> },
  { b: [4, 27, 53, 25], d: <g><rect x="4" y="27" width="53" height="25" rx="3" fill="#9BD3FF" /><circle cx="46" cy="33" r="3.2" fill="#FFD24A" /><path d="M4 52l15-15 9 9 7-6 14 12z" fill="#3FAE7A" /></g> },
  { b: [61, 29, 52, 12], d: <g fill="#2E2A4F"><rect x="61" y="29" width="52" height="5" rx="2.5" /><rect x="61" y="37" width="38" height="4" rx="2" fill="#8F8BA8" /></g> },
  { b: [61, 44, 26, 8], d: <rect x="61" y="44" width="26" height="8" rx="4" fill="#FA4F28" /> },
  { b: [4, 56, 36, 19], d: <g><rect x="4" y="56" width="36" height="19" rx="3" fill="#FFE6DA" /><rect x="7" y="59" width="12" height="9" rx="2" fill="#FFB596" /><rect x="22" y="60" width="15" height="3" rx="1.5" fill="#C2410C" /><rect x="22" y="65" width="11" height="2.5" rx="1.25" fill="#E7A88E" /></g> },
  { b: [42, 56, 36, 19], d: <g><rect x="42" y="56" width="36" height="19" rx="3" fill="#D9F5E8" /><rect x="45" y="59" width="12" height="9" rx="2" fill="#8FD9B6" /><rect x="60" y="60" width="15" height="3" rx="1.5" fill="#0B7A45" /><rect x="60" y="65" width="11" height="2.5" rx="1.25" fill="#8CC9AA" /></g> },
  { b: [80, 56, 36, 19], d: <g><rect x="80" y="56" width="36" height="19" rx="3" fill="#E4E6FF" /><rect x="83" y="59" width="12" height="9" rx="2" fill="#A9AEF5" /><rect x="98" y="60" width="15" height="3" rx="1.5" fill="#4338CA" /><rect x="98" y="65" width="11" height="2.5" rx="1.25" fill="#AFB2E6" /></g> },
  { b: [4, 79, 34, 13], d: <g fill="#A3A0B8"><rect x="4" y="79" width="34" height="3" rx="1.5" /><rect x="4" y="84" width="30" height="3" rx="1.5" /><rect x="4" y="89" width="24" height="3" rx="1.5" /></g> },
  { b: [42, 79, 33, 13], d: <g fill="#14B8A6"><circle cx="44" cy="80.5" r="1.6" /><circle cx="44" cy="85.5" r="1.6" /><circle cx="44" cy="90.5" r="1.6" /><rect x="47.5" y="79" width="26" height="3" rx="1.5" fill="#7DD3C8" /><rect x="47.5" y="84" width="21" height="3" rx="1.5" fill="#7DD3C8" /><rect x="47.5" y="89" width="24" height="3" rx="1.5" fill="#7DD3C8" /></g> },
  { b: [79, 78, 37, 7], d: <g><rect x="79.5" y="78.5" width="36" height="6" rx="2" fill="#fff" stroke="#A3A0B8" /><rect x="82" y="80.5" width="14" height="2" rx="1" fill="#D3D1DF" /></g> },
  { b: [79, 87, 21, 7], d: <rect x="79" y="87" width="21" height="7" rx="3.5" fill="#09B163" /> },
  { b: [4, 97.5, 40, 4], d: <g fill="#6E6A85"><rect x="4" y="98" width="20" height="3" rx="1.5" /><rect x="27" y="98" width="15" height="3" rx="1.5" /></g> },
  { b: [97, 96.5, 21, 6], d: <g><circle cx="101" cy="99.5" r="2.4" fill="#FA4F28" /><circle cx="107.5" cy="99.5" r="2.4" fill="#7C6CF2" /><circle cx="114" cy="99.5" r="2.4" fill="#14B8A6" /></g> },
];
// Вводный экран: сайт сам собирается по блоку — так видно, что будет в попытке; собрался — пауза и заново.
function IntroSite({ label, kind }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setK((x) => (x >= PARTS.length + 4 ? 0 : x + 1)), 420);
    return () => clearInterval(t);
  }, []);
  const n = Math.min(k, PARTS.length);
  const states = PARTS.map((_, p) => (p < n ? 'ok' : p === n ? 'cur' : 'todo'));
  return <Site states={states} fresh={n > 0 && k <= PARTS.length ? [n - 1] : []} label={label} className="is-intro" kind={kind} />;
}
const partQs = (N) => PARTS.map((_, p) => {
  if (N <= PARTS.length) return [Math.floor(p * N / PARTS.length)];
  const out = []; for (let i = 0; i < N; i++) if (Math.floor(i * PARTS.length / N) === p) out.push(i);
  return out;
});
// Состояние блоков: ok — построен, bad — дыра (вопрос с ошибкой), cur — строится сейчас, todo — ещё впереди.
function siteStates(N, answers, index, done) {
  return partQs(N).map((qs) => {
    if (qs.some((i) => answers[i] && !answers[i].correct)) return 'bad';
    if (qs.every((i) => answers[i] && answers[i].correct)) return 'ok';
    if (!done && qs.includes(index)) return 'cur';
    return 'todo';
  });
}
// kind 'css' — миссия «Сайт одевается» (19.11.2026): все части сайта уже есть (HTML), но серые и бледные — без CSS;
// верный ответ раскрашивает свою часть, неверный оставляет её серой с красной пунктирной рамкой.
let siteUid = 0;
function Site({ states, fresh = [], onPart, sel, label, className = '', kind }) {
  const gid = useMemo(() => 'hts' + (++siteUid), []);
  const css = kind === 'css';
  return (
    <svg className={'ht-site ' + (css ? 'is-css ' : '') + className} viewBox="0 0 120 104" role={onPart ? 'group' : 'img'} aria-label={label}>
      {css && <defs><filter id={gid}><feColorMatrix type="saturate" values="0" /></filter></defs>}
      <rect x="0.5" y="0.5" width="119" height="103" rx="6" fill="#fff" stroke="#D9D6E2" />
      <path d="M0.5 9V6.5a6 6 0 0 1 6-6h107a6 6 0 0 1 6 6V9z" fill="#ECEEF2" />
      <circle cx="6" cy="4.8" r="1.5" fill="#FF5F57" /><circle cx="10.5" cy="4.8" r="1.5" fill="#FEBC2E" /><circle cx="15" cy="4.8" r="1.5" fill="#28C840" />
      <rect x="3" y="11" width="114" height="13" rx="3" fill="#F6F5FA" />
      <path d="M0.5 95.5h119v2a6 6 0 0 1-6 6h-107a6 6 0 0 1-6-6z" fill="#F1EFF6" />
      {PARTS.map((pt, p) => {
        const st = states[p] || 'todo';
        const [x, y, w, h] = pt.b;
        const click = onPart && st === 'bad';
        return (
          <g key={p} className={'ht-sp is-' + st + (fresh.includes(p) ? ' is-new' : '') + (sel === p ? ' is-sel' : '') + (click ? ' is-click' : '')}
            onClick={click ? () => onPart(p) : undefined}>
            {st === 'ok' ? pt.d : css ? <><g filter={`url(#${gid})`} opacity=".42">{pt.d}</g><rect className="ht-sp-ol" x={x - 1} y={y - 1} width={w + 2} height={h + 2} rx="2.5" /></>
              : <rect className="ht-sp-ph" x={x} y={y} width={w} height={h} rx="2.5" />}
            {click && <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill="transparent" />}
          </g>
        );
      })}
    </svg>
  );
}

// ── РЕДАКТОР КОДА: подсветка как в VS Code (тег — синий, атрибут — голубой, значение — терракота), ___ — пустое место ──
function codeLine(line, key) {
  const out = []; let i = 0; let n = 0; let inTag = false; let m;
  const re = /<!--.*?-->|<\/?[a-zA-Z!][\w-]*|\/?>|___|\u0001/g;
  const text = (t) => {
    if (!t) return;
    if (!inTag) { out.push(<span key={key + '-' + n++} className="ht-c-tx">{t}</span>); return; }
    t.split(/(\s+|=|"[^"]*"|'[^']*')/).forEach((p) => {
      if (!p) return;
      const c = /^["']/.test(p) ? 'ht-c-str' : p === '=' ? 'ht-c-pn' : /^\s+$/.test(p) ? 'ht-c-tx' : 'ht-c-at';
      out.push(<span key={key + '-' + n++} className={c}>{p}</span>);
    });
  };
  while ((m = re.exec(line))) {
    text(line.slice(i, m.index));
    const t = m[0];
    if (t === '___') out.push(<span key={key + '-' + n++} className="ht-c-slot">?</span>);
    else if (t === '\u0001') out.push(<span key={key + '-' + n++} className="ht-caret" aria-hidden="true" />);   // курсор «собери»
    else if (t.startsWith('<!--')) out.push(<span key={key + '-' + n++} className="ht-c-cm">{t}</span>);
    else if (t === '>' || t === '/>') { out.push(<span key={key + '-' + n++} className="ht-c-pn">{t}</span>); inTag = false; }
    else { const sl = t[1] === '/' ? 2 : 1; out.push(<span key={key + '-' + n++} className="ht-c-pn">{t.slice(0, sl)}</span>, <span key={key + '-' + n++} className="ht-c-tg">{t.slice(sl)}</span>); inTag = true; }
    i = m.index + t.length;
  }
  text(line.slice(i));
  return out;
}
// CSS (тренажёр CSS, 19.11.2026): селектор — жёлтый, свойство — голубой, значение — терракота, число — зелёный, @media — фиолетовый.
// Состояние идёт через строки: { stack — открытые { (rule | group для @media/@keyframes), mode — sel | prop | val, sel — текст селектора }.
function cssLine(line, key, st) {
  const out = []; let n = 0;
  const push = (c, t) => out.push(<span key={key + '-' + n++} className={c}>{t}</span>);
  const re = /\/\*.*?\*\/|___|\u0001|[{};:]|\s+|[^{};:\s_\u0001/]+|./g;
  let m;
  while ((m = re.exec(line))) {
    const t = m[0];
    if (t.startsWith('/*')) push('ht-c-cm', t);
    else if (t === '___') out.push(<span key={key + '-' + n++} className="ht-c-slot">?</span>);
    else if (t === '\u0001') out.push(<span key={key + '-' + n++} className="ht-caret" aria-hidden="true" />);
    else if (/^\s+$/.test(t)) push('ht-c-tx', t);
    else if (t === '{') {
      const grp = /^\s*@(media|keyframes|supports)/.test(st.sel);
      st.stack.push(grp ? 'group' : 'rule'); st.mode = grp ? 'sel' : 'prop'; st.sel = ''; push('ht-c-pn', t);
    } else if (t === '}') {
      st.stack.pop(); st.mode = st.stack[st.stack.length - 1] === 'rule' ? 'prop' : 'sel'; st.sel = ''; push('ht-c-pn', t);
    } else if (t === ';') { if (st.mode === 'val') st.mode = 'prop'; push('ht-c-pn', t); }
    else if (t === ':') {
      if (st.mode === 'prop') { st.mode = 'val'; push('ht-c-pn', t); }
      else if (st.mode === 'sel') { st.sel += t; push(/^\s*@/.test(st.sel) ? 'ht-c-pn' : 'ht-c-sel', t); }
      else push('ht-c-str', t);
    } else if (st.mode === 'sel') {
      st.sel += t;
      if (/^\s*@/.test(st.sel)) push(t.startsWith('@') ? 'ht-c-kw' : /^[(]?[\d.]/.test(t) ? 'ht-c-num' : 'ht-c-at', t);
      else push('ht-c-sel', t);
    } else if (st.mode === 'prop') push('ht-c-at', t);
    else push(/^-?[\d.]+[a-z%]*[),]?$/i.test(t) ? 'ht-c-num' : 'ht-c-str', t);
  }
  return out;
}
// Весь код по строкам: css — файл style.css; иначе HTML, а строки между <style> и </style> — CSS.
function highlight(code, css) {
  const st = { stack: [], mode: 'sel', sel: '' };
  let inStyle = !!css;
  return code.split('\n').map((ln, i) => {
    if (css) return ln.length ? cssLine(ln, i, st) : null;
    if (inStyle && /<\/style>/i.test(ln)) inStyle = false;
    const r = !ln.length ? null : inStyle ? cssLine(ln, i, st) : codeLine(ln, i);
    if (/<style[\s>]/i.test(ln) && !/<\/style>/i.test(ln)) inStyle = true;
    return r;
  });
}
// lines — «найди ошибку»: строки нажимаются ({ onLine, picked, correct, answered }), номер строки — ответ.
function CodeBox({ code, mark, fs, maxH, compact, lines: tap, css }) {
  const lines = code.split('\n');
  const hl = useMemo(() => highlight(code, css), [code, css]);
  // Код не влез (maxH): видна часть вокруг главной строки — выделенной или с пропуском ___, а не только верх (телефон лёжа с клавиатурой).
  const focus = (mark && mark.length ? mark[0] : lines.findIndex((l) => l.includes('___')) + 1) || 0;
  const ed = useRef(null);
  useLayoutEffect(() => {
    const box = ed.current; const body = box && box.querySelector('.ht-ed-body');
    if (!body) return;
    let y = 0;
    const ln = focus && maxH ? body.children[focus - 1] : null;
    if (ln) {
      const avail = box.clientHeight - body.offsetTop;
      y = Math.max(0, Math.min(body.offsetHeight - avail, ln.offsetTop - body.offsetTop - (avail - ln.offsetHeight) / 2));
    }
    body.style.transform = y > 0 ? 'translateY(' + -Math.round(y) + 'px)' : '';
  });
  return (
    <div ref={ed} className={'ht-ed' + (compact ? ' is-compact' : '') + (tap ? ' is-tap' : '')} style={{ fontSize: fs, maxHeight: maxH }}>
      <div className="ht-ed-tabs"><span className={'ht-ed-tab' + (css ? ' is-css' : '')}>{css ? 'style.css' : 'index.html'}</span></div>
      <div className="ht-ed-body">
        {lines.map((ln, i) => {
          const n = String(i + 1);
          let c = 'ht-ln' + ((mark || []).indexOf(i + 1) >= 0 ? ' is-mark' : '');
          if (tap) c += tap.answered ? (n === tap.correct ? ' is-ok' : n === tap.picked ? ' is-bad' : ' is-off') : n === tap.picked ? ' is-pick' : '';
          const body = <><span className="ht-no">{tap && tap.answered && (n === tap.correct || n === tap.picked) ? (n === tap.correct ? '✓' : '✗') : i + 1}</span><span className="ht-code">{hl[i] || ' '}</span></>;
          return tap && !tap.answered
            ? <button key={i} type="button" className={c} onClick={() => tap.onLine(n)} disabled={tap.disabled}>{body}</button>
            : <div key={i} className={c}>{body}</div>;
        })}
      </div>
    </div>
  );
}

// ── СТРАНИЦА: честный браузер (iframe srcdoc без скриптов; картинки из списка — рисунки, другое имя — сломанная картинка) ──
const pic = (bg, em, w = 160, h = 120) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><rect width="${w}" height="${h}" fill="${bg}"/><text x="50%" y="56%" font-size="${Math.round(h * 0.55)}" text-anchor="middle" dominant-baseline="middle">${em}</text></svg>`);
const FILES = {
  'sher.png': pic('#FDE68A', '🦁'), 'mushuk.png': pic('#FBCFE8', '🐱'), 'it.png': pic('#BFDBFE', '🐶'), 'pingvin.png': pic('#E0F2FE', '🐧'),
  'robot.png': pic('#DDD6FE', '🤖'), 'pitsa.png': pic('#FED7AA', '🍕'), 'tort.png': pic('#FCE7F3', '🎂'), 'top.png': pic('#DCFCE7', '⚽'),
  'logo.png': pic('#FFEDD5', '🏕️', 90, 90), 'tog.png': pic('#BAE6FD', '🏔️', 320, 180),
};
const withFiles = (s) => s.replace(/(src\s*=\s*")([^"]+)(")/g, (m, a, n, b) => (FILES[n] ? a + FILES[n] + b : m))
  .replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (m, q, n) => (FILES[n] ? 'url("' + FILES[n] + '")' : m));   // фон из CSS: url(tog.png)
// «Нажми на странице»: места data-t обведены пунктиром, под мышкой — оранжевые, после ответа верное — зелёное, нажатое неверное — красное.
const TAP_CSS = '[data-t]{outline:2px dashed rgba(250,79,40,.45);outline-offset:3px;cursor:pointer;transition:outline-color .15s,background-color .15s}'
  + '[data-hv]{outline:2.5px solid #FA4F28;background-color:rgba(250,79,40,.08)}[data-st=pick]{outline:3px solid #FA4F28;background-color:rgba(250,79,40,.12)}'
  + '[data-st=ok]{outline:3px solid #09B163;background-color:rgba(9,177,99,.12)}[data-st=bad]{outline:3px solid #D93A3A;background-color:rgba(217,58,58,.10)}[data-st=off]{outline-color:rgba(150,150,170,.35)}';
function pageDoc(html, tap) {
  const base = '<style>html{font-family:Arial,Helvetica,sans-serif;color:#111}body{margin:12px}img{max-width:100%}' + (tap ? TAP_CSS : '') + '</style>';
  const h = withFiles(html);
  if (/<html[\s>]/i.test(h)) return /<head[\s>]/i.test(h) ? h.replace(/<head([^>]*)>/i, '<head$1>' + base) : h.replace(/<html([^>]*)>/i, '<html$1>' + base);
  return '<!doctype html><html><head><meta charset="utf-8">' + base + '</head><body>' + h + '</body></html>';
}

function decodeVis(raw, lang) {
  if (!raw) return null;
  let v = raw;
  if (typeof raw === 'string') {
    if (!raw.startsWith(VIS_PREFIX)) return null;
    try { v = JSON.parse(raw.slice(VIS_PREFIX.length)); } catch { return null; }
  }
  if (!v || typeof v !== 'object') return null;
  // CSS-вид (тренажёр CSS): в редакторе css (style.css), на странице html + <style> base + css без объявлений с ___ (или goal).
  // Та же логика — visL в tools/trenajor/build.mjs.
  if (v.css != null || v.html != null) {
    const css = v.css != null ? tx(v.css, lang).replace(/^\n+|\s+$/g, '') : null;
    const html = v.html != null ? tx(v.html, lang) : null;
    const page = html == null ? null : '<style>' + tx(v.base, lang) + '\n' + (v.goal != null ? tx(v.goal, lang) : (css || '').replace(/[^{};\n]*___[^{};\n]*;?/g, '')) + '</style>\n' + html;
    return css == null && page == null ? null : { code: css, page, mark: v.mark || [], css: true, vw: Number(v.vw) || 0 };
  }
  const raw0 = v.code != null ? tx(v.code, lang).replace(/^\n+|\s+$/g, '') : null;
  const page = v.page === true ? raw0 : v.page != null ? tx(v.page, lang) : null;
  const code = raw0 == null ? null : raw0.replace(/\s+data-t="[^"]*"/g, '');   // метки целей «нажми на странице» ученику не видны
  return code == null && page == null ? null : { code, page, mark: v.mark || [] };
}

// Картинка вопроса подстраивается под оставшееся место: код — размером шрифта (не мельче 10 px, иначе видна часть),
// страница — масштабом (не мельче 0.5, иначе видна верхняя часть). На широком экране код и страница рядом.
// lines — «найди ошибку» (строки кода нажимаются), tap — «нажми на странице» ({ onTap, picked, correct, answered }).
function Visual({ vis, T, onCut, lines: lineTap, tap }) {
  const box = useRef(null);
  const frame = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [docH, setDocH] = useState(0);
  const [docTitle, setDocTitle] = useState('');
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const upd = () => setSize((p) => { const w = el.clientWidth; const h = el.clientHeight; return Math.abs(p.w - w) > 1 || Math.abs(p.h - h) > 1 ? { w, h } : p; });
    upd();
    if (typeof ResizeObserver !== 'function') return undefined;
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const hasCode = vis.code != null;
  const hasPage = vis.page != null;
  const row = hasCode && hasPage && size.w >= 600;
  const vw = !hasPage ? 0 : vis.vw || (size.w < 520 ? 360 : row ? 420 : 520);   // vis.vw — своя ширина страницы (@media, урок 16 CSS)
  const onLoad = () => {
    const d = frame.current && frame.current.contentDocument;
    if (!d || !d.documentElement) return;
    const f = frame.current; const old = f.style.height; f.style.height = '10px';
    const h = Math.max(70, d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
    f.style.height = old;
    setDocH(h); setDocTitle(d.title || '');
    setLoads((k) => k + 1);
  };
  const [loads, setLoads] = useState(0);
  // «Нажми на странице»: состояние целей — атрибутом data-st в самой странице (скриптов в ней нет, всё делает тренажёр).
  useEffect(() => {
    const d = tap && frame.current && frame.current.contentDocument;
    if (!d) return;
    d.querySelectorAll('[data-t]').forEach((el) => {
      const t = el.getAttribute('data-t');
      const st = tap.answered ? (t === tap.correct ? 'ok' : t === tap.picked ? 'bad' : 'off') : t === tap.picked ? 'pick' : '';
      if (st) el.setAttribute('data-st', st); else el.removeAttribute('data-st');
      if (tap.answered) el.removeAttribute('data-hv');
    });
  }, [tap && tap.picked, tap && tap.answered, loads]);
  // Нажатие по окну страницы → элемент с data-t под пальцем (iframe без событий: страница уменьшена, считаем сами).
  const tapTarget = (e) => {
    const f = frame.current; const d = f && f.contentDocument;
    if (!d) return null;
    const r = f.getBoundingClientRect(); const k = r.width / (f.offsetWidth || 1);
    const el = d.elementFromPoint((e.clientX - r.left) / k, (e.clientY - r.top) / k);
    return el && el.closest ? el.closest('[data-t]') : null;
  };
  const hovered = useRef(null);
  const hover = (el) => {
    if (hovered.current === el) return;
    if (hovered.current) hovered.current.removeAttribute('data-hv');
    hovered.current = el;
    if (el) el.setAttribute('data-hv', '');
  };
  const BAR = 30; const GAP = 10; const SEG = 40;
  const lines = hasCode ? vis.code.split('\n').length : 0;
  const compact = size.w > 0 && size.w < 520;   // телефон: строки кода плотнее
  const LH = compact ? 1.36 : 1.5; const ED = compact ? 34 : 44;
  const LP = lineTap ? (compact ? 8 : 6) : 0;   // строки-кнопки «найди ошибку» выше: в них удобно попасть пальцем
  const codeH = (fs) => ED + lines * (fs * LH + LP);
  const dh = docH || 160;
  // Раскладка под высоту: код — шрифтом (не мельче 10 px, иначе видна часть), страница — масштабом (не мельче 0.5, иначе верх).
  const fit = (hCode, hPage, wPage) => {
    const o = { codeFs: 14, codeMax: undefined, pageScale: 1, pageCut: undefined };
    if (hasCode) {
      o.codeFs = Math.min(compact ? 13.5 : 16, Math.max(10, (hCode - ED - lines * LP) / (lines * LH)));
      if (codeH(o.codeFs) > hCode + 1) o.codeMax = Math.max(60, hCode);
    }
    if (hasPage) {
      // после ответа в «нажми» и «найди ошибку» страница может стать мельче (до 0.34): важнее увидеть её целиком с отметками
      // низкое широкое окно (масштаб браузера 175–200%): CSS-пиксель там вдвое крупнее на экране — страница может быть мельче
      const shortWide = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-height: 460px) and (min-aspect-ratio: 3/2)').matches;
      const answered = (tap && tap.answered) || (lineTap && lineTap.answered);
      const floor = shortWide && answered ? 0.25 : shortWide || answered ? 0.34 : 0.5;
      o.pageScale = Math.min(1, wPage / vw, Math.max(0.01, hPage - BAR) / dh);
      if (o.pageScale < floor) { o.pageScale = Math.min(floor, wPage / vw); o.pageCut = Math.max(40, hPage - BAR); }
    }
    return o;
  };
  let F = fit(size.h, size.h, row ? Math.min(size.w * 0.5, vw) : size.w);
  let toggle = false;
  if (size.h > 0 && hasCode && hasPage && !row) {
    const natPage = BAR + dh * Math.min(1, size.w / vw);
    const natCode = codeH(13);
    let hCode = natCode; let hPage = natPage;
    if (natPage + natCode + GAP > size.h) {
      hCode = Math.max(Math.min(natCode, ED + 3 * (10 * LH + LP)), (size.h - GAP) * natCode / (natPage + natCode));
      hPage = size.h - GAP - hCode;
    }
    F = fit(hCode, hPage, size.w);
    // Вместе не читаются (маленький телефон) — переключатель «Kod / Natija», как в практиках: видно одно, но крупно.
    if (F.codeMax != null || F.codeFs < 11.5 || F.pageCut != null || F.pageScale < 0.7) {
      toggle = true;
      F = fit(size.h - SEG, size.h - SEG, size.w);
    }
  }
  const [view, setView] = useState(tap ? 'page' : 'code');
  // «нажми на странице» после ответа: переключатель не нужен — вся высота странице (на ней зелёная рамка верного места)
  const pageOnly = toggle && !!tap && tap.answered;
  if (pageOnly) F = fit(size.h, size.h, size.w);
  const showCode = hasCode && (!toggle || (!pageOnly && view === 'code'));
  const showPage = hasPage && (!toggle || pageOnly || view === 'page');
  const pageW = Math.round(vw * F.pageScale);
  const pageH = Math.round(dh * F.pageScale);
  const ready = size.h > 0 && (!hasPage || docH > 0);   // пока страница не измерена — не судим, иначе ужатие включится зря
  const cut = ready && ((showCode && F.codeMax != null) || (showPage && F.pageCut != null));
  useEffect(() => { if (onCut) onCut(!!cut); }, [cut]);   // карточка узнаёт, что картинка не влезает (ужатие)
  return (
    <div className={'ht-vis' + (row ? ' is-row' : '') + (toggle ? ' is-toggle' : '')} ref={box} data-cut={cut ? '1' : undefined} data-pagecut={ready && showPage && F.pageCut != null ? '1' : undefined}>
      {toggle && !pageOnly && (
        <div className="ht-seg" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'code'} className={view === 'code' ? 'is-on' : ''} onClick={() => setView('code')}>{T.code}</button>
          <button type="button" role="tab" aria-selected={view === 'page'} className={view === 'page' ? 'is-on' : ''} onClick={() => setView('page')}>{T.page}</button>
        </div>
      )}
      {showCode && <CodeBox code={vis.code} mark={vis.mark} fs={Math.round(F.codeFs * 10) / 10} maxH={F.codeMax} compact={compact} lines={lineTap} css={vis.css} />}
      {hasPage && (
        <div className={'ht-br' + (showPage ? '' : ' is-off')} style={{ width: pageW }} aria-hidden={showPage ? undefined : true}>
          <div className="ht-br-bar"><span className="ht-br-tab"><i className="ht-br-fav" /><span className="ht-br-tt">{docTitle || 'index.html'}</span></span></div>
          <div className={'ht-br-page' + (tap && !tap.answered ? ' is-tap' : '')} style={{ height: F.pageCut != null ? Math.min(pageH, F.pageCut) : pageH }}
            {...(tap && !tap.answered ? { onClick: (e) => { const t = tapTarget(e); if (t && !tap.disabled) tap.onTap(t.getAttribute('data-t')); },
              onMouseMove: (e) => hover(tapTarget(e)), onMouseLeave: () => hover(null) } : {})}>
            <iframe ref={frame} title="page" sandbox="allow-same-origin" srcDoc={pageDoc(vis.page, !!tap)} onLoad={onLoad} tabIndex={-1}
              style={{ width: vw, height: dh, transform: `scale(${F.pageScale})` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Высота экрана: от верха тренажёра до низа окна (минус нижние отступы контейнеров LMS) — без прокрутки ──
function useScreenHeight(ref) {
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      let bottom = 0;
      for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const cs = window.getComputedStyle(p);
        bottom += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
      }
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY);
      let vv = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      // Просмотрщик уроков рисует клавиатуру телефона сам и сообщает видимую высоту так же, как канон уроков: is-kbd и --vvh.
      const rootEl = document.documentElement;
      const vvh = rootEl.classList.contains('is-kbd') ? parseFloat(rootEl.style.getPropertyValue('--vvh')) : NaN;
      if (vvh > 0) vv = Math.min(vv, vvh);
      // Клавиатура открыта (телефон лёжа: видно ~190 px) — высота без нижней границы 300, иначе поле уходит под клавиатуру;
      // ниже 300 px — режим data-low: только вопрос, код у пропуска и поле (полоса прогресса и строки-пояснения прячутся).
      const kbd = vvh > 0 || (window.visualViewport && window.visualViewport.height < window.innerHeight - 80);
      const h = Math.floor(Math.min(window.innerHeight, vv) - top - bottom);
      const hh = kbd ? Math.max(140, h) : Math.max(300, h);
      el.style.setProperty('--ht-h', hh + 'px');
      if (hh < 300) el.setAttribute('data-low', ''); else el.removeAttribute('data-low');
    };
    measure();
    const f = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    // клавиатура телефона («впиши ответ») меняет только visualViewport
    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', measure);
    const mo = typeof MutationObserver === 'function' ? new MutationObserver(measure) : null;
    if (mo) mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => { window.cancelAnimationFrame(f); window.removeEventListener('resize', measure); if (vv) vv.removeEventListener('resize', measure); if (mo) mo.disconnect(); };
  }, [ref]);
}

function parseDate(v) {
  if (typeof v !== 'string') return NaN;
  const iso = v.replace(' ', 'T');
  return Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(iso) ? iso : iso + '+05:00');
}
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const modKey = (questions) => {
  const q = (questions || []).find(Boolean);
  const m = q && (q.module || q.block_id);
  return m ? String(m).toLowerCase() : 'html';
};
const moduleName = (questions) => modKey(questions).toUpperCase();

function attemptProblem(attempt, T) {
  if (!attempt) return T.errors.missing;
  const n = Number(attempt.question_count) || SESSION_DEFAULT;
  const answers = Array.isArray(attempt.answers) ? attempt.answers : null;
  if (!answers || answers.length > n || (attempt.status === 'finished' && answers.length !== n)) return T.errors.answers;
  const need = attempt.status === 'finished' ? n : Math.min(n, answers.length + 1);
  const qs = attempt.questions;
  if (!Array.isArray(qs) || qs.length < need) return T.errors.questions;
  for (const q of qs) {
    // варианты нужны только вопросу с выбором (2–4) и «собери» (кусочки, до 8); «впиши», «найди ошибку», «нажми» — без них
    const t = q && q.question_type;
    const maxOpts = t === 'assemble' ? 8 : t === 'text_input' || t === 'find_error' || t === 'tap_page' ? 0 : 4;
    if (!q || !q.question_id || (maxOpts > 0 && (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > maxOpts || !q.options.every((o) => o && o.id != null)))) {
      return `${T.errors.bad}: ${(q && q.question_id) || '—'}`;
    }
  }
  return null;
}

// ── ВВОДНЫЙ ЭКРАН (только в новой попытке) ──
function Intro({ attempt, lang, onStart, onExit }) {
  const kind = modKey(attempt && attempt.questions);
  const T = labelsOf(lang, kind);
  const root = useRef(null);
  useScreenHeight(root);
  const n = Number(attempt && attempt.question_count) || SESSION_DEFAULT;
  const c = Number(attempt && attempt.coins_per_correct);
  const p = Number(attempt && attempt.points_per_correct);
  const practice = !!attempt && attempt.kind === 'practice';
  const hasReward = !practice && Number.isFinite(c) && Number.isFinite(p) && (c > 0 || p > 0);
  const mod = moduleName(attempt && attempt.questions);
  const title = T.title(mod);
  const rules = practice ? [T.rules[0], T.rules[1], T.practiceRule] : T.rules;
  const head = useRef(null);
  useEffect(() => { if (head.current) head.current.focus(); }, []);
  // Низкое окно (масштаб браузера 175–200%, телефон лёжа): ступени it 1–3 — без картинки сайта → правила плотнее → без правил.
  const [it, setIt] = useState(0);
  const [vp, setVp] = useState(0);
  useEffect(() => { const on = () => setVp((k) => k + 1); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  useLayoutEffect(() => { setIt(0); }, [vp]);
  useLayoutEffect(() => {
    const r = root.current; const box = r && r.querySelector('.ht-intro'); const ol = r && r.querySelector('.ht-rules');
    if (!box || it >= 3) return;
    const over = (el) => !!el && el.scrollHeight > el.clientHeight + 1;
    if (over(box) || over(r) || over(ol)) setIt(it + 1);
  });
  return (
    <div className="ht ht--intro" ref={root} data-it={it || undefined}>
      <style>{CSS}</style>
      {typeof onExit === 'function' && <button type="button" className="ht-x" onClick={() => onExit()} aria-label={T.exit} title={T.exit}><IcX /></button>}
      <section className="ht-intro">
        <div className="ht-intro-top">
          <div className="ht-intro-text">
            <p className="ht-kicker">{T.kicker}</p>
            <h1 className="ht-intro-title" ref={head} tabIndex={-1}>{title[0]} {title[1]}</h1>
            <div className="ht-chips">
              <span className="ht-chip">{T.questions(n)}</span>
              {hasReward && <span className="ht-chip"><IcCoin />{T.perCorrect}: <b>{c} {T.coins} + {p} {T.points}</b></span>}
              {hasReward && <span className="ht-chip"><IcStar />{T.max}: <b>{n * c} {T.coins} + {n * p} {T.points}</b></span>}
              {practice && <span className="ht-chip is-soft">{T.practice}</span>}
            </div>
          </div>
          <div className="ht-intro-site"><IntroSite label={T.site} kind={kind} /></div>
          <div className="ht-intro-kodi"><span className="ht-bubble">{T.bubble}</span><Kodi mood="happy" size={92} /></div>
        </div>
        <h2 className="ht-h2">{T.how}</h2>
        <ol className="ht-rules">
          {rules.map((r, i) => <li key={i} style={{ '--i': i }}><span className="ht-rule-ic">{RULE_ICONS[i]}</span><span>{r}</span></li>)}
        </ol>
        <button type="button" className="ht-btn ht-start" onClick={onStart}>{practice ? T.startPractice : T.start}<IcArrow /></button>
      </section>
    </div>
  );
}

// ── «СОБЕРИ ИЗ КУСОЧКОВ» (question_type assemble): кусочки нажимаются по порядку, строка растёт в редакторе на месте ___ ──
// Ответ для LMS — id кусочков по порядку через запятую ("c,a,d"). Нажатый кусочек можно нажать ещё раз — он вернётся.
const pieceText = (q, id, lang) => { const o = (q.options || []).find((x) => x.id === id); return o ? tx(o.text, lang) : ''; };
function Assemble({ q, lang, answer, busy, T, vis, onSubmit }) {
  const [seq, setSeq] = useState([]);
  const done = !!answer;
  const shown = done ? String(answer.option_id || '').split(',').filter(Boolean) : seq;
  const built = shown.map((id) => pieceText(q, id, lang)).join('');
  const tpl = vis && vis.code && vis.code.includes('___') ? vis.code : '___';
  const code = tpl.replace('___', built ? built + (done ? '' : '\u0001') : '___');
  const right = q.correct_answer ? String(q.correct_answer).split(',').map((id) => pieceText(q, id, lang)).join('') : '';
  const lines = code.split('\n').length;
  const toggle = (id) => { if (done || busy) return; setSeq((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id])); };
  return (
    <div className={'ht-asm' + (done ? (answer.correct ? ' is-ok' : ' is-bad') : '') + (lines > 3 ? ' is-long' : '')}>
      <CodeBox code={code} css={!!(vis && vis.css)} />
      {done && answer.correct && <p className="ht-inp-right ht-asm-built"><IcOk /><code>{built.trim()}</code></p>}
      {done ? (!answer.correct && right && <p className="ht-inp-right"><IcOk />{T.rightAnswer}: <code>{right.trim()}</code></p>) : <>
        <div className="ht-pcs" role="group" aria-label={T.hintBuild}>
          {(q.options || []).map((o) => {
            const k = seq.indexOf(o.id);
            return (
              <button key={o.id} type="button" className={'ht-pc' + (k >= 0 ? ' is-used' : '')} onClick={() => toggle(o.id)} disabled={busy} aria-pressed={k >= 0}>
                {k >= 0 && <i>{k + 1}</i>}{tx(o.text, lang).trim()}
              </button>
            );
          })}
        </div>
        <div className="ht-asm-act">
          <button type="button" className="ht-btn is-ghost ht-undo" onClick={() => setSeq((a) => a.slice(0, -1))} disabled={!seq.length || busy} aria-label={T.undo} title={T.undo}><IcBack /></button>
          <button type="button" className="ht-btn ht-check" onClick={() => seq.length && onSubmit(seq.join(','))} disabled={!seq.length || busy}>{busy ? T.saving : T.check}</button>
        </div>
      </>}
    </div>
  );
}

// ── ТРЕНАЖЁР: вопросы и итог ──
function Body({ attempt, lang, busy, onAnswer, onFinished, onRestart, onExit }) {
  const kind = modKey(attempt && attempt.questions);
  const T = labelsOf(lang, kind);
  const root = useRef(null);
  useScreenHeight(root);
  const N = Number(attempt && attempt.question_count) || SESSION_DEFAULT;
  const questions = Array.isArray(attempt && attempt.questions) ? attempt.questions : [];
  const answers = Array.isArray(attempt && attempt.answers) ? attempt.answers : [];
  const problem = attemptProblem(attempt, T);
  const done = !!attempt && attempt.status === 'finished';
  const [index, setIndex] = useState(Math.max(0, Math.min(answers.length, N - 1, questions.length - 1)));
  const [err, setErr] = useState('');
  const [picking, setPicking] = useState(null);   // выбранный вариант, пока LMS сохраняет ответ
  const pending = useRef(null);
  const finishing = useRef(false);
  const head = useRef(null);
  const attemptKey = `${(attempt && attempt.started_at) || ''}|${questions.length ? questions[0] && questions[0].question_id : ''}`;
  // Новый ответ от LMS: остаёмся на вопросе (виден отклик), «Keyingi» ведёт дальше. Новая попытка — с начала.
  const prevKey = useRef(attemptKey);
  useEffect(() => {
    if (prevKey.current !== attemptKey) { prevKey.current = attemptKey; setIndex(Math.max(0, Math.min(answers.length, N - 1))); finishing.current = false; }
    pending.current = null; setErr(''); setPicking(null);
  }, [attemptKey, answers.length]);
  useEffect(() => { if (!done && index > answers.length) setIndex(answers.length); }, [index, answers.length, done]);
  useEffect(() => { if (head.current) head.current.focus({ preventScroll: true }); }, [index, done]);
  // «Natijani ko'rish» нажата, LMS сохранила (busy снят), а попытка не закончилась — значит, ошибка: можно нажать снова.
  useEffect(() => { if (!busy && !done) finishing.current = false; }, [busy, done]);

  const q = questions[index];
  const answer = answers[index];
  // Ужатие, если карточка вопроса не влезает (маленький телефон): 1 — плотнее, 2 — после ответа прячется картинка,
  // 3 — после ответа прячется и строка-ситуация. Пересчёт на каждый вопрос, ответ и смену размера окна.
  const cardRef = useRef(null);
  const [tight, setTight] = useState(0);
  const [visCut, setVisCut] = useState(false);
  const [vpKey, setVpKey] = useState(0);
  useEffect(() => {
    const on = () => setVpKey((k) => k + 1);
    window.addEventListener('resize', on);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); if (window.visualViewport) window.visualViewport.removeEventListener('resize', on); };
  }, []);
  useLayoutEffect(() => { setTight(0); }, [q && q.question_id, !!answer, vpKey]);
  useEffect(() => { setVisCut(false); }, [q && q.question_id]);
  // «Впиши ответ»: что ученик набрал; на компьютере поле в фокусе сразу (на телефоне клавиатура не выскакивает сама).
  const [typed, setTyped] = useState('');
  const inpRef = useRef(null);
  const [hole, setHole] = useState(null);   // итог: нажатая дыра сайта — блок p
  // Итог без прокрутки (19.11.2026, CSS — до 17 уроков в списке): если список уроков, открытая дыра или весь итог не влезают —
  // ступени ужатия rt 1–6 (плотнее список уроков → плитки → награда в строку → сайт меньше, сбоку от текста;
  // 5 — низкое широкое окно: сайт колонкой слева; 6 — крайний случай, масштаб 200%: список или пояснение листаются внутри, кнопки на месте).
  const [rt, setRt] = useState(0);
  useLayoutEffect(() => { setRt(0); }, [hole, vpKey, done]);
  useLayoutEffect(() => {
    if (!done || rt >= 6 || !root.current) return;
    const over = (sel) => { const el = root.current.querySelector(sel); return !!el && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1); };
    if (over('.ht-lessons') || over('.ht-hole') || over('.ht-res') || over('.ht--result')) setRt(rt + 1);
  });
  useEffect(() => {
    setTyped('');
    const el = inpRef.current;
    if (el && !answer && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) el.focus({ preventScroll: true });
  }, [q && q.question_id]);
  useLayoutEffect(() => {
    const c = cardRef.current;
    if (!c) return;
    const max = answer ? 3 : 1;
    const vis = c.querySelector('.ht-vis');
    if (!answer && tight < 1 && visCut) { setTight(1); return; }   // до ответа картинка не влезает — плотнее
    const ix = c.classList.contains('is-ix');   // «найди ошибку», «нажми»: картинка и есть ответ — не прячется
    const sliver = !ix && answer && tight < 2 && vis && vis.offsetHeight > 0 && vis.offsetHeight < 110;   // картинка-полоска после ответа — лучше спрятать
    const asm = c.querySelector('.ht-asm');   // «собери»: кусочки и кнопки не влезают — тоже ужатие
    const asmOver = asm && asm.scrollHeight > asm.clientHeight + 1;
    // после ответа страница обрезана: у «найди ошибку» и «нажми» прячем строки-пояснения (картинка остаётся),
    // у остальных на ступени 2 картинка прячется — ответ уже дан, видно пояснение (19.11.2026, низкое окно)
    const pageCut = !!c.querySelector('.ht-vis[data-pagecut]');
    const ixCut = answer && (ix ? visCut : pageCut);
    if (tight < max && (c.scrollHeight > c.clientHeight + 1 || sliver || asmOver || ixCut)) setTight(tight + 1);
  });
  const call = (fn, onFail) => {
    try {
      const r = fn();
      if (r && typeof r.catch === 'function') r.catch(() => { onFail(); setErr(T.sendError); });
    } catch { onFail(); setErr(T.sendError); }
  };
  const choose = (optionId) => {
    if (problem || done || busy || answer || !q || pending.current === q.question_id) return;
    if (typeof onAnswer !== 'function') { setErr(T.sendError); return; }
    pending.current = q.question_id; setErr(''); setPicking(optionId);
    call(() => onAnswer(q.question_id, optionId), () => { pending.current = null; setPicking(null); });
  };
  const next = () => {
    if (problem || done || !answer || busy) return;
    if (index + 1 >= N) {
      if (finishing.current) return;
      if (typeof onFinished !== 'function') { setErr(T.sendError); return; }
      finishing.current = true; setErr('');
      call(() => onFinished(), () => { finishing.current = false; });
    } else setIndex(index + 1);
  };
  useEffect(() => {
    const key = (e) => {
      if (problem || busy || done || e.repeat || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (/^[1-4]$/.test(e.key) && !answer && q && (q.question_type || 'single_choice') === 'single_choice') { const o = q.options[Number(e.key) - 1]; if (o) { e.preventDefault(); choose(o.id); } }
      else if (e.key === 'Enter' && answer) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  const correctCount = Number.isInteger(attempt && attempt.correct_count) ? attempt.correct_count : answers.filter((a) => a && a.correct).length;
  let streak = 0;
  for (let k = Math.min(answers.length, index + 1) - 1; k >= 0 && answers[k] && answers[k].correct; k--) streak++;
  const exitBtn = typeof onExit === 'function' && <button type="button" className="ht-x" onClick={() => onExit()} aria-label={T.exit} title={T.exit}><IcX /></button>;

  if (problem) {
    return <div className="ht" ref={root}><style>{CSS}</style>{exitBtn}<div className="ht-err-screen" role="alert"><Kodi mood="think" size={72} /><p>{problem}</p></div></div>;
  }

  // Миссия: сайт строится — блоки по ответам; только что построенные (ответ на текущий вопрос верный) «впрыгивают».
  const states = siteStates(N, answers, index, done);
  const pq = partQs(N);
  const fresh = !done && answers[index] && answers[index].correct ? pq.map((qs, p) => (qs.includes(index) && states[p] === 'ok' ? p : -1)).filter((p) => p >= 0) : [];
  // Полоса прогресса: верно — зелёный, неверно — красный, текущий — оранжевый.
  const bar = (
    <div className="ht-top">
      {exitBtn}
      <ol className="ht-steps" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => {
          const a = answers[i];
          const c = a ? (a.correct ? 'is-ok' : 'is-bad') : i === index && !done ? 'is-cur' : '';
          return <li key={i} className={c} />;
        })}
      </ol>
      {!done && <Site states={states} fresh={fresh} label={T.site} className="is-mini" kind={kind} />}
      <span className="ht-count">{done ? N : index + 1}<small> / {N}</small></span>
    </div>
  );

  if (done) {
    const pct = Math.round(correctCount / N * 100);
    const praise = T.praise[correctCount === N ? 3 : pct >= 80 ? 2 : pct >= 50 ? 1 : 0];
    const el = (parseDate(attempt.finished_at) - parseDate(attempt.started_at)) / 1000;
    const dur = Number.isFinite(el) && el >= 0 ? Math.round(el) : null;
    const byLesson = {};
    answers.forEach((a, i) => {
      const qq = questions[i]; if (!qq) return;
      const k = qq.lesson != null ? qq.lesson : '—';
      if (!byLesson[k]) byLesson[k] = { ok: 0, all: 0, topic: qq.topic };
      byLesson[k].all++; if (a && a.correct) byLesson[k].ok++;
    });
    const lessons = Object.keys(byLesson).sort((a, b) => Number(a) - Number(b));
    const builtN = states.filter((x) => x === 'ok').length;
    // Дыра → вопрос, из-за которого блок не построен: вопрос, ответ ученика, верный ответ, пояснение.
    const ansText = (qq, v) => {
      if (v == null) return '';
      const t = qq.question_type || 'single_choice';
      if (t === 'single_choice') return pieceText(qq, v, lang);
      if (t === 'assemble') return String(v).split(',').map((id) => pieceText(qq, id, lang)).join('').trim();
      if (t === 'find_error') return T.lineN(v);
      if (t === 'tap_page') return '';
      return String(v);
    };
    const holeQ = hole != null ? (pq[hole] || []).find((i) => answers[i] && !answers[i].correct) : null;
    const hq = holeQ != null ? questions[holeQ] : null;
    const detail = hq && (
      <div className="ht-hole" role="region" aria-label={T.qN(holeQ + 1)}>
        <div className="ht-hole-top">
          <span className="ht-tag">{T.parts[hole]} · {T.qN(holeQ + 1)}{hq.lesson != null ? ' · ' + T.lesson(hq.lesson) : ''}</span>
          <button type="button" className="ht-hole-x" onClick={() => setHole(null)} aria-label={T.byLesson}><IcX /></button>
        </div>
        <p className="ht-hole-q">{tx(hq.question_text, lang)}</p>
        {ansText(hq, answers[holeQ].option_id) && <p className="ht-hole-a is-bad"><IcX />{T.yourAnswer}: <code>{ansText(hq, answers[holeQ].option_id)}</code></p>}
        {ansText(hq, hq.correct_answer) && <p className="ht-hole-a is-ok"><IcOk />{T.rightAnswer}: <code>{ansText(hq, hq.correct_answer)}</code></p>}
        {tx(hq.solution_explanation, lang) && <p className="ht-hole-p">{tx(hq.solution_explanation, lang)}</p>}
      </div>
    );
    return (
      <div className="ht ht--result" ref={root}>
        <style>{CSS}</style>
        {bar}
        <section className={'ht-res' + (hole != null ? ' is-hole' : '')} data-rt={rt || undefined} aria-label={T.result}>
          <div className="ht-res-head">
            <div className="ht-res-site"><Site states={states} onPart={(p) => setHole((h) => (h === p ? null : p))} sel={hole} label={T.site} kind={kind} /></div>
            <div className="ht-res-text">
              <p className="ht-res-kick">{T.site} · {T.siteOf(builtN, PARTS.length)}</p>
              <h1 className="ht-res-title" ref={head} tabIndex={-1}>{praise}</h1>
              <p className="ht-res-sub">{correctCount} {T.correctWord} · {pct}%{dur != null ? ` · ${T.time}: ${mmss(dur)}` : ''}</p>
              {builtN < PARTS.length && <p className="ht-res-hint">{T.holeHint}</p>}
            </div>
            <Kodi mood={pct >= 50 ? 'happy' : 'think'} size={84} />
          </div>
          <div className="ht-res-body">
            <div className="ht-res-col">
              {detail || <>
              <h2 className="ht-h2">{T.byLesson}</h2>
              <ul className="ht-lessons">
                {lessons.map((k) => {
                  const s = byLesson[k];
                  return <li key={k}>
                    <span className="ht-les-n">{k === '—' ? '—' : (() => {   // слово «Урок» / «dars» — отдельно: на тесном телефоне прячется, остаётся номер
                      const lab = T.lesson(k); const i = lab.indexOf(String(k));
                      return i < 0 ? lab : <>{i > 0 && <span className="ht-les-w">{lab.slice(0, i)}</span>}{k}{i + String(k).length < lab.length && <span className="ht-les-w">{lab.slice(i + String(k).length)}</span>}</>;
                    })()}</span>
                    <span className="ht-les-t">{tx(s.topic, lang)}</span>
                    <span className="ht-les-bar"><i style={{ width: (s.ok / s.all * 100) + '%' }} /></span>
                    <span className="ht-les-s">{s.ok}/{s.all}</span>
                  </li>;
                })}
              </ul>
              </>}
            </div>
            <div className={'ht-reward' + (attempt.reward ? '' : ' is-practice')} role="status">
              {attempt.reward ? <>
                <span className="ht-reward-t">{T.reward}</span>
                <span className="ht-reward-v"><IcCoin /><b>{attempt.reward.coins}</b> {T.coins}</span>
                <span className="ht-reward-v"><IcStar /><b>{attempt.reward.points}</b> {T.points}</span>
                {attempt.reward_date && <span className="ht-reward-d">{T.rewardDate}: {attempt.reward_date}</span>}
              </> : <span className="ht-reward-t">{T.practice}</span>}
            </div>
          </div>
          {(typeof onExit === 'function' || typeof onRestart === 'function') && (
            <div className="ht-res-foot">
              {typeof onExit === 'function' && <button type="button" className="ht-btn is-ghost" onClick={() => onExit()}>{T.leave}</button>}
              {typeof onRestart === 'function' && <button type="button" className="ht-btn" onClick={() => onRestart()}>{T.restart}<IcArrow /></button>}
            </div>
          )}
        </section>
      </div>
    );
  }

  if (!q) return <div className="ht" ref={root}><style>{CSS}</style>{bar}</div>;
  const vis = decodeVis(q.vis, lang);
  const qt = q.question_type || 'single_choice';
  const isInput = qt === 'text_input';
  const isBuild = qt === 'assemble';
  const isBug = qt === 'find_error' && vis && vis.code != null;
  const isTap = qt === 'tap_page' && vis && vis.page != null;
  const isChoice = !isInput && !isBuild && !isBug && !isTap;
  const opts = isChoice ? q.options || [] : [];
  // «Найди ошибку» и «нажми на странице»: нажатое место ждёт сохранения (picking), потом — ответ LMS.
  const pickedVal = answer ? String(answer.option_id) : picking;
  const lineTap = isBug ? { onLine: choose, picked: pickedVal, correct: q.correct_answer != null ? String(q.correct_answer) : null, answered: !!answer, disabled: busy || !!picking } : undefined;
  const pageTap = isTap ? { onTap: choose, picked: pickedVal, correct: q.correct_answer != null ? String(q.correct_answer) : null, answered: !!answer, disabled: busy || !!picking } : undefined;
  const builtNow = fresh.length > 3 ? [T.parts[fresh[0]] + ' +' + (fresh.length - 1)] : fresh.map((p) => T.parts[p]);   // при 1–4 вопросах один ответ строит много блоков
  const optTexts = opts.map((o) => tx(o.text, lang));
  const mono = !!q.mono;
  const narrowPairs = optTexts.every((t) => t.length <= 14);
  const correctIdx = opts.findIndex((o) => o.id === q.correct_answer);
  const letter = (i) => String.fromCharCode(65 + i);
  const ctx = tx(q.context, lang);
  return (
    <div className="ht" ref={root}>
      <style>{CSS}</style>
      {bar}
      <section className={'ht-card' + (tight ? ' is-t' + tight : '') + (tight >= 2 ? ' is-t2' : '') + (tight >= 3 ? ' is-t3' : '') + (isBug || isTap ? ' is-ix' : '') + ' is-' + qt} ref={cardRef} aria-label={T.question} key={q.question_id} data-qid={q.question_id}>
        <div className="ht-meta">
          {q.lesson != null && <span className="ht-tag">{T.lesson(q.lesson)}{q.topic ? ' · ' + tx(q.topic, lang) : ''}</span>}
          {attempt.kind === 'practice' && <span className="ht-tag is-soft">{T.practice}</span>}
          {streak >= 3 && <span className="ht-streak" key={'s' + streak}><IcFlame />{T.streak(streak)}</span>}
        </div>
        {ctx && <p className="ht-ctx">{ctx}</p>}
        <h1 className="ht-q" ref={head} tabIndex={-1}>{tx(q.question_text, lang)}</h1>
        {isBuild ? <Assemble q={q} lang={lang} answer={answer} busy={busy} T={T} vis={vis} onSubmit={choose} />
          : vis ? <Visual vis={vis} T={T} onCut={setVisCut} lines={lineTap} tap={pageTap} /> : <div className="ht-spacer" />}
        {isBuild || isBug || isTap ? null : isInput ? (
          <form className={'ht-inp' + (answer ? (answer.correct ? ' is-ok' : ' is-bad') : '')} onSubmit={(e) => { e.preventDefault(); if (!typed.trim()) return; if (inpRef.current) inpRef.current.blur(); choose(typed.trim()); }}>
            <div className="ht-inp-row">
              <input ref={inpRef} className={'ht-inp-f' + (mono ? ' is-mono' : '')} value={answer ? String(answer.answer_text ?? answer.option_id ?? '') : typed}
                onChange={(e) => setTyped(e.target.value)} disabled={busy || !!answer} placeholder={T.typeHere} aria-label={T.typeHere}
                autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="done" maxLength={80} />
              {answer ? <span className="ht-inp-mark" aria-hidden="true">{answer.correct ? <IcOk /> : <IcX />}</span>
                : <button type="submit" className="ht-btn ht-check" disabled={!typed.trim() || busy}>{busy ? T.saving : T.check}</button>}
            </div>
            {answer && !answer.correct && q.correct_answer != null && <p className="ht-inp-right"><IcOk />{T.rightAnswer}: <code>{String(q.correct_answer)}</code></p>}
          </form>
        ) : (
        <div className={'ht-opts' + (mono ? ' is-mono' : '') + (narrowPairs ? ' is-short' : '')} data-count={opts.length}>
          {opts.map((o, i) => {
            const picked = answer && answer.option_id === o.id;
            const st = answer ? (o.id === q.correct_answer ? ' is-ok' : picked ? ' is-bad' : ' is-off') : picking === o.id ? ' is-sel' : '';
            return (
              <button key={o.id} type="button" className={'ht-opt' + st + (picked ? ' is-picked' : '')} disabled={busy || !!answer}
                aria-label={`${letter(i)}. ${optTexts[i]}`} onClick={() => choose(o.id)}>
                <span className="ht-badge">{answer && o.id === q.correct_answer ? <IcOk /> : answer && picked ? <IcX /> : letter(i)}</span>
                <span className="ht-opt-t">{optTexts[i]}</span>
              </button>
            );
          })}
        </div>
        )}
      </section>
      <div className={'ht-foot' + (answer ? (answer.correct ? ' is-ok' : ' is-bad') : '')}>
        {answer ? (
          <div className="ht-fb" role="status">
            <span className="ht-fb-ic">{answer.correct ? <IcOk /> : <IcX />}</span>
            <b className="ht-fb-h">{answer.correct ? T.right : T.wrong}
              {!answer.correct && isChoice && correctIdx >= 0 ? <span className="ht-fb-k">{T.rightIs(letter(correctIdx))}</span> : null}
              {answer.correct && builtNow.length > 0 && <span className="ht-fb-built">+ {builtNow.join(', ')}</span>}</b>
            {(tx(q.solution_explanation, lang) || (!answer.correct && (isBug || isTap))) && <p className="ht-fb-p">
              {!answer.correct && isBug && q.correct_answer != null ? <b className="ht-fb-where">{T.rightLine(q.correct_answer)} </b> : null}
              {!answer.correct && isTap ? <b className="ht-fb-where">{T.rightPlace} </b> : null}
              {tx(q.solution_explanation, lang)}</p>}
            <button type="button" className="ht-btn ht-next" onClick={next} disabled={busy}>{busy ? T.saving : index + 1 >= N ? T.finish : T.next}<IcArrow /></button>
          </div>
        ) : (
          <p className={'ht-hint' + (isChoice || isInput ? '' : ' is-act')}>{busy ? T.saving : isInput ? T.hintInput : isBuild ? T.hintBuild : isBug ? T.hintBug : isTap ? T.hintTap : T.hint}</p>
        )}
        {err && <p className="ht-err" role="alert">{err}</p>}
      </div>
    </div>
  );
}

// intro={false} — без вводного экрана (просмотрщик показывает так один вопрос банка; LMS этот пропс не передаёт).
export default function Trainer({ attempt, lang = 'uz', busy = false, onAnswer, onFinished, onRestart, onExit, intro = true }) {
  const L = LABELS[lang] ? lang : 'uz';
  const T = labelsOf(L);
  const fresh = intro !== false && !!attempt && attempt.status !== 'finished' && Array.isArray(attempt.answers) && attempt.answers.length === 0 && attemptProblem(attempt, T) === null;
  const key = attempt ? `${attempt.started_at || ''}|${(attempt.questions && attempt.questions[0] && attempt.questions[0].question_id) || ''}` : '';
  const [startedKey, setStartedKey] = useState(fresh ? null : key);
  if (fresh && startedKey !== key) return <Intro attempt={attempt} lang={L} onStart={() => setStartedKey(key)} onExit={onExit} />;
  return <Body attempt={attempt} lang={L} busy={!!busy} onAnswer={onAnswer} onFinished={onFinished} onRestart={onRestart} onExit={onExit} />;
}

const CSS = `
.ht { --o: #FA4F28; --o-dk: #D93A12; --ink: #1E1B39; --mut: #6E6A85; --line: #E9E7EF; --ok: #09B163; --bad: #D93A3A;
  box-sizing: border-box; position: relative; display: flex; flex-direction: column; width: 100%; height: var(--ht-h, 100dvh); overflow: hidden;
  padding: 12px 16px 14px; color: var(--ink); font-family: Inter, "Segoe UI", Roboto, system-ui, -apple-system, Arial, sans-serif; text-align: left;
  background-color: #F4F5F7; background-image: radial-gradient(circle, #D5DAE1 1px, transparent 1.4px); background-size: 20px 20px; background-position: -10px -10px; }
.ht *, .ht *::before, .ht *::after { box-sizing: border-box; }
.ht > * { flex: none; width: 100%; max-width: 880px; margin-left: auto; margin-right: auto; }
.ht button { font: inherit; }
.ht h1, .ht h2, .ht p { margin: 0; }
.ht h1:focus { outline: none; }
.ht-x { position: absolute; top: 12px; left: 12px; z-index: 3; width: 40px !important; height: 40px; margin: 0 !important; display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--line); border-radius: 12px; background: #fff; color: var(--mut); cursor: pointer; box-shadow: 0 2px 6px rgba(15, 23, 42, .06); }
@media (hover: hover) { .ht-x:hover { color: var(--ink); border-color: #D5D2DE; } }
.ht-x svg { width: 20px; height: 20px; }
.ht-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 0; border-radius: 14px; cursor: pointer;
  background: var(--o); color: #fff; font-size: 17px !important; font-weight: 700; box-shadow: 0 4px 0 var(--o-dk); transition: transform .12s, box-shadow .12s, filter .12s;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; white-space: nowrap; }
.ht-btn svg { width: 20px; height: 20px; }
@media (hover: hover) { .ht-btn:hover { filter: brightness(1.05); } }
.ht-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--o-dk); }
.ht-btn:disabled { opacity: .6; cursor: default; transform: none; }
.ht-btn.is-ghost { background: #fff; color: var(--ink); box-shadow: 0 0 0 1.5px var(--line) inset, 0 4px 0 #E1DEE8; }

/* ── вводный экран ── */
.ht--intro { justify-content: center; }
.ht-intro { display: flex; flex-direction: column; min-height: 0; max-height: 100%; padding: 22px 24px 20px; border-radius: 24px; background: #fff;
  box-shadow: 0 0 0 1px #ECEAF1, 0 14px 40px rgba(30, 27, 57, .08); animation: ht-up .4s ease both; }
.ht-intro-top { display: flex; align-items: center; gap: 16px; padding: 18px 20px; margin: -6px -8px 0; border-radius: 18px; background: linear-gradient(135deg, #FFF4EC, #FFE6D9); }
.ht-intro-text { flex: 1 1 auto; min-width: 0; }
.ht-kicker { font-size: 13px; font-weight: 600; color: #9A4A2E; }
.ht-intro-title { margin-top: 4px !important; font-size: 34px; font-weight: 800; line-height: 1.08; letter-spacing: -.01em; color: #0E0B26; }
.ht-intro-title em { font-style: normal; color: var(--o); }
.ht-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.ht-chip { display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 4px 12px; border-radius: 999px; background: #fff; color: var(--ink); font-size: 13px; font-weight: 500; box-shadow: 0 0 0 1px #F3D9CB; }
.ht-chip b { font-weight: 700; color: var(--o-dk); }
.ht-chip svg { width: 16px; height: 16px; flex: none; }
.ht-chip.is-soft { background: #FFF; color: var(--mut); }
.ht-intro-site { position: relative; flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ht-intro-kodi { position: relative; flex: none; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ht-intro-kodi .ht-kodi { animation: ht-bob 3s ease-in-out infinite; }
.ht-kodi { flex: none; display: block; border-radius: 50%; overflow: hidden; background: radial-gradient(circle at 50% 28%, #FFFFFF 0%, #FFFFFF 58%, #F3F0EA 100%);
  box-shadow: inset 0 0 0 1.5px rgba(28, 36, 51, .08), 0 8px 18px -10px rgba(28, 36, 51, .45); }
.ht-kodi svg { display: block; width: 100%; height: 100%; overflow: visible; }
.ht-kodi-eye { transform-box: fill-box; transform-origin: center; animation: ht-blink 4.6s infinite; }
@keyframes ht-blink { 0%, 94%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.15); } }
@keyframes ht-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.ht-site.is-intro { width: 150px; height: auto; filter: drop-shadow(0 6px 14px rgba(30, 27, 57, .12)); }
.ht-bubble { padding: 6px 12px; border-radius: 12px; background: #fff; font-size: 13px; font-weight: 700; color: var(--ink); box-shadow: 0 4px 12px rgba(30, 27, 57, .08); white-space: nowrap; }
.ht-h2 { margin-top: 18px !important; font-size: 15px; font-weight: 700; color: var(--ink); }
.ht-rules { list-style: none; margin: 10px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; min-height: 0; }
.ht-rules li { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: #F8F8FB; box-shadow: 0 0 0 1px #EFEDF4; font-size: 14px; line-height: 1.4; font-weight: 500;
  animation: ht-up .4s ease both; animation-delay: calc(.08s + var(--i) * .06s); }
.ht-rule-ic { flex: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #FFF1EC; color: var(--o); }
.ht-rule-ic svg { width: 22px; height: 22px; }
.ht-start { align-self: stretch; margin-top: 18px; }
.ht--intro .ht-intro { overflow: hidden; }
.ht--intro[data-it] .ht-intro-site, .ht--intro[data-it] .ht-bubble { display: none; }
.ht--intro[data-it] .ht-intro-kodi .ht-kodi { width: 64px !important; height: 64px !important; }
.ht--intro[data-it] .ht-intro { padding: 14px 18px 14px; }
.ht--intro[data-it] .ht-intro-top { padding: 12px 16px; }
.ht--intro[data-it] .ht-intro-title { font-size: 26px; }
.ht--intro[data-it] .ht-chips { margin-top: 8px; gap: 6px; }
.ht--intro[data-it] .ht-start { margin-top: 12px; }
.ht--intro[data-it="2"] .ht-rules, .ht--intro[data-it="3"] .ht-rules { gap: 6px; }
.ht--intro[data-it="2"] .ht-rules li { padding: 6px 10px; font-size: 12.5px; line-height: 1.3; }
.ht--intro[data-it="2"] .ht-rule-ic { display: none; }
.ht--intro[data-it="2"] .ht-h2 { margin-top: 10px !important; }
.ht--intro[data-it="3"] .ht-rules, .ht--intro[data-it="3"] .ht-h2 { display: none; }

/* ── полоса сверху ── */
.ht-top { display: flex; align-items: center; gap: 12px; min-height: 40px; padding-left: 0; }
.ht-top .ht-x { position: static; flex: none; }
.ht-steps { flex: 1 1 auto; display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; }
.ht-steps li { flex: 1 1 0; height: 8px; border-radius: 99px; background: #E3E1EA; transition: background .25s; }
.ht-steps li.is-cur { background: var(--o); box-shadow: 0 0 0 3px rgba(250, 79, 40, .18); }
.ht-steps li.is-ok { background: var(--ok); }
.ht-steps li.is-bad { background: var(--bad); }
.ht-count { flex: none; font-size: 16px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.ht-count small { font-size: 13px; font-weight: 600; color: var(--mut); }

/* ── вопрос ── */
.ht-card { flex: 1 1 auto !important; min-height: 0; display: flex; flex-direction: column; margin-top: 12px; padding: 16px 20px 18px; border-radius: 22px; background: #fff;
  box-shadow: 0 0 0 1px #ECEAF1, 0 10px 30px rgba(30, 27, 57, .06); animation: ht-in .32s ease both; }
.ht-card > * { flex: none; }
.ht-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.ht-tag { display: inline-flex; align-items: center; min-height: 26px; padding: 2px 10px; border-radius: 999px; background: #FFF1EC; color: #B8401D; font-size: 12.5px; font-weight: 600; }
.ht-tag.is-soft { background: #F2F1F6; color: var(--mut); }
.ht-streak { display: inline-flex; align-items: center; gap: 5px; min-height: 26px; padding: 2px 10px 2px 8px; border-radius: 999px; background: #FFF6D6; color: #9A5B00; font-size: 12.5px; font-weight: 700; animation: ht-pop .4s ease both; }
.ht-streak svg { width: 13px; height: 15px; }
.ht-ctx { margin-top: 10px !important; font-size: 15px; font-weight: 500; line-height: 1.4; color: var(--mut); overflow-wrap: break-word; }
.ht-q { margin-top: 4px !important; font-size: 22px; font-weight: 800; line-height: 1.28; color: #0E0B26; overflow-wrap: break-word; }
.ht-ctx + .ht-q { margin-top: 4px !important; }
.ht-meta + .ht-q { margin-top: 10px !important; }
/* после ответа на маленьком экране: картинка, затем ситуация прячутся, пояснение видно */
.ht-card.is-t2 .ht-vis { display: none; }
.ht-card.is-t2 .ht-spacer { display: none; }
.ht-card.is-t3 .ht-ctx { display: none; }
.ht-spacer { flex: 1 1 auto !important; min-height: 4px; max-height: 40px; }
.ht-vis { position: relative; flex: 1 1 auto !important; min-height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; margin-top: 12px; overflow: hidden; }
.ht-vis.is-row { flex-direction: row; align-items: center; }
.ht-vis.is-row > .ht-ed { flex: 1 1 50%; min-width: 0; align-self: center; }
.ht-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.ht-opt { display: flex; align-items: center; gap: 12px; min-height: 54px; padding: 8px 14px 8px 10px; border: solid var(--line); border-width: 2px 2px 4px; border-radius: 14px; background: #fff; color: var(--ink);
  font-size: 16px !important; font-weight: 500; line-height: 1.3; text-align: left; cursor: pointer; transition: border-color .15s, background .15s, transform .1s, opacity .2s;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
@media (hover: hover) { .ht-opt:not(:disabled):hover { border-color: #FFB89F; background: #FFFAF7; } }
.ht-opt:not(:disabled):active { transform: translateY(2px); border-bottom-width: 2px; margin-top: 2px; }
.ht-opt:disabled { cursor: default; }
.ht-badge { flex: 0 0 34px; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #F4F4F7; color: #77738F; font-size: 15px; font-weight: 800; }
.ht-badge svg { width: 18px; height: 18px; }
.ht-opt-t { min-width: 0; flex: 1 1 auto; overflow-wrap: anywhere; }
.ht-opts.is-mono .ht-opt-t { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .9em; font-weight: 600; white-space: pre-wrap; }
/* выбран, LMS сохраняет */
.ht-opt.is-sel { border-color: var(--o); background: #FFF2ED; }
.ht-opt.is-sel .ht-badge { background: var(--o); color: #fff; }
.ht-opt.is-ok { border-color: var(--ok); background: #ECFAF5; }
.ht-opt.is-ok .ht-badge { background: var(--ok); color: #fff; }
.ht-opt.is-ok.is-picked { animation: ht-pop .35s ease; }
.ht-opt.is-bad { border-color: var(--bad); background: #FFF1F1; animation: ht-shake .35s ease; }
.ht-opt.is-bad .ht-badge { background: var(--bad); color: #fff; }
.ht-opt.is-off { opacity: .55; }

/* ── «впиши ответ» ── */
.ht-inp { margin-top: 14px; }
.ht-inp-row { display: flex; align-items: stretch; gap: 10px; }
.ht-inp-f { flex: 1 1 auto; min-width: 0; height: 56px; padding: 0 16px; border: solid var(--line); border-width: 2px 2px 4px; border-radius: 14px; background: #fff; color: var(--ink);
  font: 600 18px/1 Inter, system-ui, sans-serif; outline: none; transition: border-color .15s, background .15s; }
.ht-inp-f.is-mono { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 17px; }
.ht-inp-f::placeholder { color: #A8A5B8; font-family: Inter, system-ui, sans-serif; font-weight: 500; font-size: 15px; }
.ht-inp-f:focus { border-color: var(--o); background: #FFFAF7; }
.ht-inp-f:disabled { opacity: 1; -webkit-text-fill-color: currentColor; }
.ht-check { min-height: 56px; }
.ht-inp.is-ok .ht-inp-f { border-color: var(--ok); background: #ECFAF5; color: #0B7A45; }
.ht-inp.is-bad .ht-inp-f { border-color: var(--bad); background: #FFF1F1; color: #B42318; animation: ht-shake .35s ease; }
.ht-inp-mark { flex: 0 0 56px; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: #fff; }
.ht-inp-mark svg { width: 24px; height: 24px; }
.ht-inp.is-ok .ht-inp-mark { background: var(--ok); }
.ht-inp.is-bad .ht-inp-mark { background: var(--bad); }
.ht-inp-right { display: flex; align-items: center; gap: 8px; margin-top: 8px !important; font-size: 15px; font-weight: 600; color: #0B7A45; }
.ht-inp-right svg { width: 18px; height: 18px; flex: none; padding: 2px; border-radius: 50%; background: var(--ok); color: #fff; }
.ht-inp-right code { padding: 2px 8px; border-radius: 6px; background: #ECFAF5; font: 700 15px/1.3 "JetBrains Mono", ui-monospace, Menlo, monospace; }

/* ── миссия «Сайт строится» ── */
.ht-site { display: block; overflow: visible; }
.ht-site.is-mini { flex: none; width: 54px; height: 47px; filter: drop-shadow(0 2px 4px rgba(30, 27, 57, .10)); }
.ht-sp-ph { fill: none; stroke: #CFCBDB; stroke-width: .9; stroke-dasharray: 2.2 1.6; }
.ht-sp.is-cur .ht-sp-ph { stroke: var(--o); stroke-width: 1.2; fill: rgba(250, 79, 40, .10); animation: ht-ph 1.3s ease-in-out infinite; }
.ht-sp.is-bad .ht-sp-ph { fill: #F6F4F9; stroke: #E05252; stroke-width: 1.1; }
.ht-site.is-mini .ht-sp-ph { stroke: none; fill: #ECEAF2; }
.ht-site.is-mini .ht-sp.is-cur .ht-sp-ph { fill: rgba(250, 79, 40, .45); }
.ht-site.is-mini .ht-sp.is-bad .ht-sp-ph { fill: #F5B5B5; }
.ht-sp-ol { fill: none; stroke: none; }
.ht-sp.is-cur .ht-sp-ol { stroke: var(--o); stroke-width: 1.2; stroke-dasharray: 2.2 1.6; fill: rgba(250, 79, 40, .08); animation: ht-ph 1.3s ease-in-out infinite; }
.ht-sp.is-bad .ht-sp-ol { stroke: #E05252; stroke-width: 1.1; stroke-dasharray: 2.2 1.6; }
.ht-site.is-mini .ht-sp.is-cur .ht-sp-ol { stroke: none; fill: rgba(250, 79, 40, .45); }
.ht-site.is-mini .ht-sp.is-bad .ht-sp-ol { stroke: none; fill: rgba(224, 82, 82, .45); }
@media (hover: hover) { .ht-sp.is-click:hover .ht-sp-ol { fill: rgba(224, 82, 82, .12); } }
.ht-sp.is-sel .ht-sp-ol { fill: rgba(224, 82, 82, .18); stroke-width: 1.8; stroke-dasharray: none; }
.ht-sp.is-new { transform-box: fill-box; transform-origin: center; animation: ht-build .6s cubic-bezier(.3, 1.6, .5, 1) both; }
.ht-sp.is-click { cursor: pointer; }
@media (hover: hover) { .ht-sp.is-click:hover .ht-sp-ph { fill: #FFE6E6; } }
.ht-sp.is-sel .ht-sp-ph { fill: #FFDADA; stroke-width: 1.8; stroke-dasharray: none; }
@keyframes ht-ph { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes ht-build { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }

/* ── «собери из кусочков» ── */
.ht-asm { flex: 1 1 auto !important; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: 12px; margin-top: 12px; }
.ht-asm > .ht-ed { width: 100%; max-width: 620px; align-self: center; font-size: 17px; transition: box-shadow .2s; }
.ht-asm.is-long > .ht-ed { font-size: 15px; }
.ht-asm.is-ok > .ht-ed { box-shadow: 0 0 0 3px var(--ok), 0 8px 22px rgba(15, 23, 42, .14); }
.ht-asm.is-bad > .ht-ed { box-shadow: 0 0 0 3px var(--bad), 0 8px 22px rgba(15, 23, 42, .14); animation: ht-shake .35s ease; }
.ht-asm .ht-inp-right { justify-content: center; margin-top: 0 !important; flex-wrap: wrap; }
.ht-asm .ht-asm-built { display: none; }
.ht-caret { display: inline-block; width: 2px; height: 1.15em; margin-left: 1px; vertical-align: -.2em; background: #FDBA74; animation: ht-caret 1s steps(1) infinite; }
@keyframes ht-caret { 50% { opacity: 0; } }
.ht-pcs { display: flex; flex-wrap: wrap; justify-content: center; gap: 9px; }
.ht-pc { position: relative; min-height: 46px; padding: 6px 14px; border: solid var(--line); border-width: 2px 2px 4px; border-radius: 12px; background: #fff; color: #1F3B73; cursor: pointer;
  font: 700 16px/1.2 "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important; white-space: pre; transition: border-color .15s, background .15s, opacity .15s;
  -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
@media (hover: hover) { .ht-pc:not(:disabled):hover { border-color: #FFB89F; background: #FFFAF7; } }
.ht-pc:not(:disabled):active { transform: translateY(2px); border-bottom-width: 2px; margin-top: 2px; }
.ht-pc.is-used { opacity: .5; border-style: dashed; border-bottom-width: 2px; margin-top: 2px; background: #F6F5FA; }
.ht-pc i { position: absolute; top: -9px; right: -9px; width: 21px; height: 21px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--o); color: #fff; font: 800 12px/1 Inter, system-ui, sans-serif; }
.ht-asm-act { display: flex; justify-content: center; gap: 10px; }
.ht-undo { width: 56px; padding: 0 !important; }
.ht-undo svg { width: 22px; height: 22px; }

/* ── «найди ошибку»: строки кода — кнопки ── */
.ht-ed.is-tap .ht-ln { width: 100%; margin: 0; border: 0; padding-top: 3px; padding-bottom: 3px; background: transparent; color: inherit; font: inherit; text-align: left;
  -webkit-tap-highlight-color: transparent; transition: background .15s; }
.ht-ed.is-tap.is-compact .ht-ln { padding-top: 4px; padding-bottom: 4px; }
.ht-ed.is-tap button.ht-ln { cursor: pointer; }
@media (hover: hover) { .ht-ed.is-tap button.ht-ln:not(:disabled):hover { background: rgba(250, 79, 40, .14); box-shadow: inset 3px 0 0 rgba(250, 79, 40, .7); } }
.ht-ln.is-pick { background: rgba(250, 79, 40, .26); box-shadow: inset 3px 0 0 var(--o); }
.ht-ln.is-ok { background: rgba(9, 177, 99, .26); box-shadow: inset 3px 0 0 #2BD47D; }
.ht-ln.is-bad { background: rgba(217, 58, 58, .3); box-shadow: inset 3px 0 0 #FF6B6B; }
.ht-ln.is-off { opacity: .55; }
.ht-ln.is-ok .ht-no { color: #2BD47D; font-weight: 800; }
.ht-ln.is-bad .ht-no { color: #FF8A8A; font-weight: 800; }
.ht-br-page.is-tap { cursor: pointer; }
.ht-card.is-t2.is-ix .ht-vis { display: flex; }

/* ── низ: подсказка клавиш или отклик с кнопкой ── */
.ht-foot { margin-top: 10px; min-height: 22px; }
.ht-hint { padding: 2px 4px; font-size: 13px; color: #9A97AE; text-align: center; }
.ht-fb { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; grid-template-areas: "ic h b" ". p b"; align-items: center; column-gap: 14px; padding: 12px 14px 12px 16px; border: 2px solid; border-radius: 18px; animation: ht-up .28s ease both; }
.ht-foot.is-ok .ht-fb { background: linear-gradient(180deg, #E9FAF1, #F5FCF8); border-color: #3DBE7A; }
.ht-foot.is-bad .ht-fb { background: linear-gradient(180deg, #FDECEC, #FFF6F6); border-color: #E05252; }
.ht-fb-ic { grid-area: ic; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
.ht-fb-ic svg { width: 19px; height: 19px; }
.ht-foot.is-ok .ht-fb-ic { background: #22A060; }
.ht-foot.is-bad .ht-fb-ic { background: #D32F2F; }
.ht-fb-h { grid-area: h; min-width: 0; font-size: 17px; font-weight: 800; line-height: 1.25; }
.ht-foot.is-ok .ht-fb-h { color: #1F9D57; }
.ht-foot.is-bad .ht-fb-h { color: #C62828; }
.ht-fb-k { margin-left: 10px; padding-left: 10px; border-left: 1.5px solid #F0B4B4; font-weight: 700; color: var(--ink); }
.ht-fb-where { font-weight: 800; color: #B42318; }
.ht-fb-built { display: inline-flex; margin-left: 10px; padding: 2px 10px; border-radius: 999px; background: #fff; color: #0B7A45; font-size: 13px; font-weight: 700; vertical-align: 2px;
  box-shadow: 0 0 0 1.5px #A6E3C3; animation: ht-pop .45s ease both; }
.ht-fb-p { grid-area: p; margin-top: 3px !important; font-size: 14.5px; font-weight: 500; line-height: 1.42; color: var(--ink); }
.ht-next { grid-area: b; }

.ht-err { margin-top: 6px !important; font-size: 13.5px; font-weight: 600; color: var(--bad); text-align: center; }
.ht-err-screen { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; border-radius: 20px; background: #fff; font-weight: 600; text-align: center; }

/* ── редактор кода (как в уроках) ── */
.ht-ed { flex: none; align-self: stretch; overflow: hidden; border-radius: 12px; background: #1E1E1E; box-shadow: 0 8px 22px rgba(15, 23, 42, .14);
  font: 600 13px/1.5 "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; position: relative; }
.ht-vis:not(.is-row) > .ht-ed { width: 100%; max-width: 620px; align-self: center; }
.ht-ed-tabs { display: flex; height: 30px; background: #252526; }
.ht-ed-tab { display: flex; align-items: center; gap: 7px; padding: 0 14px; background: #1E1E1E; border-top: 2px solid var(--o); color: #fff; font: 500 12px/1 Inter, system-ui, sans-serif; }
.ht-ed-tab::before { content: '<>'; color: #E44D26; font: 700 11px/1 "JetBrains Mono", monospace; }
.ht-ed-body { padding: 7px 0; }
.ht-ed[style*="max-height"]::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 20px; background: linear-gradient(rgba(30, 30, 30, 0), #1E1E1E); }
.ht-ed.is-compact { line-height: 1.36; }
.ht-ed.is-compact .ht-ed-tabs { height: 24px; }
.ht-ed.is-compact .ht-ed-tab { padding: 0 12px; font-size: 11.5px; }
.ht-ed.is-compact .ht-ed-body { padding: 5px 0; }
.ht-ln { display: flex; padding-right: 12px; white-space: pre; }
.ht-ln.is-mark { background: rgba(250, 79, 40, .18); box-shadow: inset 3px 0 0 var(--o); }
.ht-no { flex: 0 0 2.6em; padding-right: 1em; text-align: right; color: #6E7681; user-select: none; }
.ht-code { min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.ht-c-sel { color: #D7BA7D; } .ht-c-num { color: #B5CEA8; } .ht-c-kw { color: #C586C0; }
.ht-ed-tab.is-css::before { content: '#'; color: #42A5F5; }
.ht-c-tg { color: #569CD6; } .ht-c-at { color: #9CDCFE; } .ht-c-str { color: #CE9178; } .ht-c-pn { color: #808080; } .ht-c-tx { color: #D4D4D4; } .ht-c-cm { color: #6A9955; }
.ht-c-slot { display: inline-block; min-width: 2.2em; margin: 0 2px; padding: 0 6px; border: 1.5px dashed var(--o); border-radius: 5px; color: #FDBA74; text-align: center; line-height: 1.25; }

/* переключатель «Kod / Natija» (маленький телефон) */
.ht-vis.is-toggle { justify-content: flex-start; }
.ht-seg { flex: none; display: flex; gap: 4px; padding: 3px; border-radius: 11px; background: #F1F0F5; }
.ht-seg button { min-width: 92px; height: 30px; padding: 0 14px; border: 0; border-radius: 8px; background: transparent; color: var(--mut); font-size: 13.5px !important; font-weight: 700; cursor: pointer; }
.ht-seg button.is-on { background: #fff; color: var(--o-dk); box-shadow: 0 1px 3px rgba(30, 27, 57, .12); }
.ht-br.is-off { position: absolute; visibility: hidden; pointer-events: none; }

/* ── окно Chrome ── */
.ht-br { flex: none; max-width: 100%; border-radius: 10px; overflow: hidden; background: #DEE1E6; box-shadow: inset 0 0 0 1px #C7CBD1, 0 8px 22px rgba(15, 23, 42, .10); }
.ht-br-bar { display: flex; align-items: flex-end; height: 30px; padding-left: 8px; }
.ht-br-tab { display: flex; align-items: center; gap: 7px; max-width: 80%; height: 24px; padding: 0 12px; border-radius: 8px 8px 0 0; background: #fff; color: #202124; font-size: 12px; font-weight: 500; }
.ht-br-fav { flex: none; width: 11px; height: 11px; border-radius: 3px; background: #E44D26; }
.ht-br-tt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ht-br-page { position: relative; overflow: hidden; background: #fff; }
.ht-br-page iframe { display: block; border: 0; transform-origin: 0 0; background: #fff; pointer-events: none; }

/* ── итог ── */
.ht--result .ht-res { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; margin-top: 12px; padding: 20px 22px; border-radius: 22px; background: #fff;
  box-shadow: 0 0 0 1px #ECEAF1, 0 10px 30px rgba(30, 27, 57, .06); animation: ht-up .4s ease both; }
.ht-res-head { display: flex; align-items: center; gap: 18px; padding: 14px 16px; border-radius: 18px; background: linear-gradient(135deg, #FFF4EC, #FFE6D9); }
.ht-res-text { flex: 1 1 auto; min-width: 0; }
.ht-res-site { flex: none; width: 220px; }
.ht-res-site .ht-site { width: 100%; height: auto; filter: drop-shadow(0 6px 14px rgba(30, 27, 57, .12)); }
.ht-res-site .ht-sp.is-ok { transform-box: fill-box; transform-origin: center; animation: ht-build .5s cubic-bezier(.3, 1.6, .5, 1) both; }
.ht-res-site .ht-sp:nth-of-type(1) { animation-delay: 0.15s; }
.ht-res-site .ht-sp:nth-of-type(2) { animation-delay: 0.21s; }
.ht-res-site .ht-sp:nth-of-type(3) { animation-delay: 0.27s; }
.ht-res-site .ht-sp:nth-of-type(4) { animation-delay: 0.33s; }
.ht-res-site .ht-sp:nth-of-type(5) { animation-delay: 0.39s; }
.ht-res-site .ht-sp:nth-of-type(6) { animation-delay: 0.45s; }
.ht-res-site .ht-sp:nth-of-type(7) { animation-delay: 0.51s; }
.ht-res-site .ht-sp:nth-of-type(8) { animation-delay: 0.57s; }
.ht-res-site .ht-sp:nth-of-type(9) { animation-delay: 0.63s; }
.ht-res-site .ht-sp:nth-of-type(10) { animation-delay: 0.69s; }
.ht-res-site .ht-sp:nth-of-type(11) { animation-delay: 0.75s; }
.ht-res-site .ht-sp:nth-of-type(12) { animation-delay: 0.81s; }
.ht-res-site .ht-sp:nth-of-type(13) { animation-delay: 0.87s; }
.ht-res-site .ht-sp:nth-of-type(14) { animation-delay: 0.93s; }
.ht-res-site .ht-sp:nth-of-type(15) { animation-delay: 0.99s; }
.ht-res-kick { font-size: 13px; font-weight: 700; color: #9A4A2E; }
.ht-res-kick + .ht-res-title { margin-top: 4px !important; }
.ht-res-hint { margin-top: 8px !important; font-size: 13px; font-weight: 600; color: #B42318; }
.ht-hole { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; padding: 12px 14px; border-radius: 16px; background: #FFF6F6; box-shadow: 0 0 0 1.5px #F5C2C2; min-height: 0; overflow: hidden; animation: ht-up .25s ease both; }
.ht-hole-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ht-hole-x { flex: none; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 9px; background: #fff; color: var(--mut); cursor: pointer; }
.ht-hole-x svg { width: 16px; height: 16px; }
.ht-hole-q { font-size: 15.5px; font-weight: 700; line-height: 1.35; }
.ht-hole-a { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; font-weight: 600; }
.ht-hole-a svg { width: 16px; height: 16px; flex: none; padding: 2px; border-radius: 50%; color: #fff; }
.ht-hole-a.is-bad { color: #B42318; } .ht-hole-a.is-bad svg { background: var(--bad); }
.ht-hole-a.is-ok { color: #0B7A45; } .ht-hole-a.is-ok svg { background: var(--ok); }
.ht-hole-a code { padding: 1px 7px; border-radius: 6px; background: #fff; font: 700 13.5px/1.35 "JetBrains Mono", ui-monospace, Menlo, monospace; white-space: pre-wrap; }
.ht-hole-p { font-size: 13.5px; line-height: 1.42; color: var(--ink); }
.ht-res-title { font-size: 24px; font-weight: 800; line-height: 1.2; color: #0E0B26; }
.ht-res-sub { margin-top: 6px !important; font-size: 14.5px; font-weight: 500; color: #7A4A35; }
.ht-res-body { flex: 1 1 auto; min-height: 0; display: flex; gap: 16px; margin-top: 4px; }
.ht-res-col { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.ht-lessons { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; min-height: 0; overflow: hidden; }
.ht-lessons li { display: grid; grid-template-columns: auto 1fr 90px auto; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 10px; background: #F8F8FB; font-size: 13.5px; }
.ht-les-n { font-weight: 700; color: var(--o-dk); white-space: nowrap; }
.ht-les-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); font-weight: 500; }
.ht-les-bar { height: 7px; border-radius: 99px; background: #E6E4EC; overflow: hidden; }
.ht-les-bar i { display: block; height: 100%; border-radius: 99px; background: var(--ok); }
.ht-les-s { font-weight: 700; font-variant-numeric: tabular-nums; }
.ht-reward { flex: 0 0 220px; align-self: flex-start; margin-top: 18px; display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: #FFFBEB; box-shadow: 0 0 0 1px #FDE7A8; }
.ht-reward.is-practice { background: #F8F8FB; box-shadow: 0 0 0 1px #EFEDF4; }
.ht-reward-t { font-size: 13px; font-weight: 700; color: #8A6A10; }
.ht-reward.is-practice .ht-reward-t { color: var(--mut); }
.ht-reward-v { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
.ht-reward-v b { font-size: 22px; font-weight: 800; }
.ht-reward-v svg { width: 24px; height: 24px; }
.ht-reward-d { font-size: 12px; color: var(--mut); }
.ht-res-foot { display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px; }

@keyframes ht-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes ht-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
@keyframes ht-pop { 0% { transform: scale(.92); } 60% { transform: scale(1.04); } 100% { transform: scale(1); } }
@keyframes ht-shake { 0%, 100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

/* итог: ужатие rt 1–4 (список уроков, открытая дыра) */
.ht-res.is-hole .ht-res-hint { display: none; }
.ht-res[data-rt] .ht-lessons { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 12px; }
.ht-res[data-rt] .ht-lessons li { grid-template-columns: auto 1fr 40px auto; padding: 4px 9px; font-size: 13px; }
.ht-res[data-rt] .ht-reward-d { display: none; }
.ht-res[data-rt="2"] .ht-lessons, .ht-res[data-rt="3"] .ht-lessons, .ht-res[data-rt="4"] .ht-lessons { grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 5px; }
.ht-res[data-rt="2"] .ht-lessons li, .ht-res[data-rt="3"] .ht-lessons li, .ht-res[data-rt="4"] .ht-lessons li { display: flex; justify-content: space-between; gap: 6px; padding: 4px 8px; font-size: 12.5px; }
.ht-res[data-rt="2"] .ht-les-t, .ht-res[data-rt="2"] .ht-les-bar, .ht-res[data-rt="3"] .ht-les-t, .ht-res[data-rt="3"] .ht-les-bar, .ht-res[data-rt="4"] .ht-les-t, .ht-res[data-rt="4"] .ht-les-bar { display: none; }
.ht-res[data-rt="3"] .ht-res-site, .ht-res[data-rt="4"] .ht-res-site { width: 150px; }
.ht-res[data-rt="3"] .ht-res-head, .ht-res[data-rt="4"] .ht-res-head { padding: 10px 14px; }
.ht-res[data-rt="4"] .ht-res-site { width: 120px; }
.ht-res[data-rt="4"] .ht-res-head > .ht-kodi { display: none; }
.ht-res[data-rt="4"] .ht-hole-q { font-size: 14px; }
.ht-res[data-rt="4"] .ht-hole-p { font-size: 12.5px; line-height: 1.35; }
.ht-res[data-rt="4"] .ht-lessons li { padding: 3px 7px; font-size: 12px; }
/* итог: rt 6 — крайний случай (окно ниже ~400 px): листается только середина, шапка и кнопки на месте */
.ht-res[data-rt="6"] .ht-res-body { overflow-y: auto; }
.ht-res[data-rt="6"] .ht-lessons, .ht-res[data-rt="6"] .ht-hole, .ht-res[data-rt="6"] .ht-res-col { overflow: visible; min-height: auto; }
/* ── низкое окно (19.11.2026): ноутбук с масштабом браузера 125–200%, планшет и окно браузера лёжа — плотнее на любой ширине ── */
.ht-card.is-t1 .ht-meta { display: none; }
.ht-card.is-t1 .ht-meta + .ht-ctx, .ht-card.is-t1 .ht-meta + .ht-q { margin-top: 0 !important; }
@media (min-width: 641px) and (max-height: 620px) {
  .ht { padding: 8px 16px 10px; }
  .ht-top { min-height: 32px; gap: 10px; }
  .ht-top .ht-x { width: 32px !important; height: 32px; }
  .ht-steps li { height: 6px; }
  .ht-site.is-mini { width: 44px; height: 38px; }
  .ht-card { margin-top: 8px; padding: 10px 16px 12px; border-radius: 18px; }
  .ht-tag { min-height: 22px; font-size: 12px; }
  .ht-ctx { margin-top: 6px !important; font-size: 13.5px; line-height: 1.35; }
  .ht-q { font-size: 18px; line-height: 1.25; }
  .ht-meta + .ht-q { margin-top: 6px !important; }
  .ht-vis { margin-top: 8px; gap: 8px; }
  .ht-opts { gap: 6px; margin-top: 8px; }
  .ht-opt { min-height: 42px; padding: 4px 12px 4px 8px; font-size: 15px !important; gap: 10px; }
  .ht-badge { flex-basis: 28px; width: 28px; height: 28px; font-size: 13.5px; }
  .ht-inp { margin-top: 8px; }
  .ht-inp-f, .ht-check { height: 46px; min-height: 46px; }
  .ht-inp-mark { flex-basis: 46px; }
  .ht-inp-right { margin-top: 5px !important; font-size: 14px; }
  .ht-asm { gap: 8px; margin-top: 8px; }
  .ht-asm > .ht-ed { font-size: 15px; }
  .ht-pcs { gap: 7px; }
  .ht-pc { min-height: 38px; padding: 4px 12px; font-size: 14.5px !important; }
  .ht-asm-act .ht-btn { min-height: 42px; }
  .ht-foot { margin-top: 6px; min-height: 0; }
  .ht-hint { display: none; }
  .ht-hint.is-act { display: block; padding: 0; font-size: 12.5px; }
  .ht-fb { column-gap: 10px; padding: 7px 10px 8px 12px; border-radius: 14px; grid-template-columns: 28px minmax(0, 1fr) auto; }
  .ht-fb-ic { width: 28px; height: 28px; }
  .ht-fb-ic svg { width: 16px; height: 16px; }
  .ht-fb-h { font-size: 15.5px; }
  .ht-fb-p { font-size: 13.5px; line-height: 1.35; }
  .ht-next { min-height: 40px; padding: 0 16px; font-size: 15px !important; border-radius: 12px; }
  .ht-seg button { height: 26px; }
  .ht-card.is-t1 { padding-top: 8px; padding-bottom: 8px; }
  .ht-card.is-t1 .ht-ctx { font-size: 12.5px; }
  .ht-card.is-t1 .ht-q { font-size: 16px; }
  .ht-card.is-t1 .ht-opt { min-height: 36px; font-size: 14px !important; }
  .ht-card.is-t1 .ht-badge { flex-basis: 24px; width: 24px; height: 24px; font-size: 12.5px; }
  .ht-card.is-t1 .ht-pc { min-height: 34px; padding-top: 2px; padding-bottom: 2px; font-size: 13.5px !important; }
  .ht-card.is-t1 .ht-asm > .ht-ed { font-size: 13px; }
  .ht-card.is-t1 .ht-inp-f, .ht-card.is-t1 .ht-check { height: 40px; min-height: 40px; }
  .ht--result .ht-res { margin-top: 8px; padding: 12px 16px; }
  .ht-res-head { padding: 10px 14px; gap: 14px; }
  .ht-res-site { width: 170px; }
  .ht-res-title { font-size: 20px; }
  .ht-res-head > .ht-kodi { width: 64px !important; height: 64px !important; }
  .ht-reward { margin-top: 10px; padding: 10px 12px; gap: 5px; }
  .ht-reward-v b { font-size: 18px; }
  .ht-res-foot { margin-top: 8px; }
  .ht-res-foot .ht-btn { min-height: 42px; }
}
@media (min-width: 641px) and (max-height: 440px) {
  .ht-card { padding: 8px 14px 10px; }
  .ht-q { font-size: 16px; }
  .ht-ctx { font-size: 12.5px; }
  .ht-opt { min-height: 36px; font-size: 14px !important; }
  .ht-badge { flex-basis: 24px; width: 24px; height: 24px; font-size: 12.5px; }
  .ht-fb-p { font-size: 12.5px; }
  .ht-fb-h { font-size: 14.5px; }
  .ht-next { min-height: 36px; }
}
/* ── телефон ── */
@media (max-width: 640px) {
  .ht { padding: 10px 12px 12px; }
  .ht-intro { padding: 14px 14px 14px; border-radius: 20px; }
  .ht-intro-top { padding: 12px 12px; margin: -2px -2px 0; gap: 10px; }
  .ht-intro-title { font-size: 25px; }
  .ht-intro-top { position: relative; }
  .ht-intro-site { display: none; }
  .ht-intro-kodi { position: absolute; top: 10px; right: 10px; }
  .ht-intro-kodi .ht-kodi { width: 56px !important; height: 56px !important; }
  .ht-res-head > .ht-kodi { display: none; }
  .ht-kicker, .ht-intro-title { padding-right: 64px; }
  .ht-chip b { white-space: nowrap; }
  .ht-bubble { display: none; }
  .ht-chip { min-height: 26px; padding: 3px 10px; font-size: 12px; }
  .ht-h2 { margin-top: 12px !important; }
  .ht-rules { grid-template-columns: 1fr; gap: 7px; }
  .ht-rules li { padding: 8px 10px; font-size: 13.5px; gap: 10px; }
  .ht-rule-ic { width: 30px; height: 30px; }
  .ht-rule-ic svg { width: 18px; height: 18px; }
  .ht-start { margin-top: 12px; }
  .ht--intro .ht-x { top: 8px; left: 8px; width: 34px !important; height: 34px; }
  .ht--intro .ht-intro { margin-top: 34px; }
  .ht-top { gap: 10px; min-height: 36px; }
  .ht-top .ht-x { width: 36px !important; height: 36px; }
  .ht-steps { gap: 3px; }
  .ht-steps li { height: 7px; }
  .ht-card { margin-top: 8px; padding: 12px 12px 12px; border-radius: 18px; }
  .ht-ctx { font-size: 14px; margin-top: 8px !important; }
  .ht-q { font-size: 18.5px; }
  .ht-vis { margin-top: 10px; gap: 8px; }
  .ht-opts { grid-template-columns: 1fr; gap: 7px; margin-top: 10px; }
  .ht-opts.is-short { grid-template-columns: 1fr 1fr; }
  .ht-opt { min-height: 46px; padding: 6px 12px 6px 8px; font-size: 15px !important; gap: 10px; }
  .ht-inp { margin-top: 10px; }
  .ht-inp-f, .ht-check { height: 48px; min-height: 48px; }
  .ht-inp-f { font-size: 16px; padding: 0 12px; }   /* 16 px — iOS не приближает страницу при вводе */
  .ht-inp-f.is-mono { font-size: 16px; }
  .ht-check { padding: 0 16px; font-size: 15.5px !important; }
  .ht-inp-mark { flex-basis: 48px; }
  .ht-badge { flex-basis: 30px; width: 30px; height: 30px; font-size: 14px; }
  .ht-foot { margin-top: 8px; }
  .ht-hint { display: none; }
  .ht-hint.is-act { display: block; padding: 0; font-size: 12.5px; }
  .ht-site.is-mini { width: 44px; height: 38px; }
  .ht-fb-built { display: flex; width: fit-content; max-width: 100%; margin: 3px 0 0; padding: 1px 8px; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ht-asm { gap: 10px; margin-top: 10px; }
  .ht-asm > .ht-ed { font-size: 14.5px; }
  .ht-asm.is-long > .ht-ed { font-size: 13px; }
  .ht-pcs { gap: 7px; }
  .ht-pc { min-height: 40px; padding: 5px 11px; font-size: 14.5px !important; }
  .ht-asm-act .ht-check { flex: 1 1 auto; }
  .ht-asm-act .ht-btn { min-height: 46px; }
  .ht-card.is-t1 .ht-pc { min-height: 36px; padding-top: 3px; padding-bottom: 3px; font-size: 13.5px !important; }
  .ht-card.is-t1 .ht-asm { gap: 8px; margin-top: 8px; }
  .ht-card.is-t1 .ht-asm > .ht-ed { font-size: 12.5px; }
  .ht-card.is-t1 .ht-pcs { gap: 6px; }
  .ht-card.is-t1 .ht-asm-act .ht-btn { min-height: 42px; }
  .ht-res-site { width: 116px; }
  .ht-res-hint { font-size: 12px; margin-top: 4px !important; }
  .ht-hole { margin-top: 10px; padding: 10px 12px; }
  .ht-fb { grid-template-columns: 26px minmax(0, 1fr) auto; grid-template-areas: "ic h b" "p p p"; column-gap: 10px; padding: 8px 10px 10px 12px; border-radius: 16px; }
  .ht-fb-ic { width: 26px; height: 26px; }
  .ht-fb-ic svg { width: 15px; height: 15px; }
  .ht-fb-h { font-size: 15.5px; }
  .ht-fb-k { display: none; }
  .ht-fb-p { margin-top: 6px !important; font-size: 13.5px; line-height: 1.38; }
  .ht-next { min-height: 40px; padding: 0 14px; font-size: 15px !important; border-radius: 12px; gap: 6px; }
  .ht-next svg { width: 17px; height: 17px; }
  /* ужатие (маленький телефон) */
  .ht-card.is-t1 { padding-top: 10px; padding-bottom: 10px; }
  .ht-card.is-t1 .ht-meta { display: none; }
  .ht-card.is-t1 .ht-meta + .ht-ctx { margin-top: 0 !important; }
  .ht-card.is-t1 .ht-meta + .ht-q { margin-top: 0 !important; }
  .ht-card.is-t1 .ht-ctx { font-size: 13px; margin-top: 6px !important; }
  .ht-card.is-t1 .ht-q { font-size: 16.5px; }
  .ht-card.is-t1 .ht-opts { gap: 5px; margin-top: 8px; }
  .ht-card.is-t1 .ht-opt { min-height: 40px; padding-top: 4px; padding-bottom: 4px; font-size: 14px !important; }
  .ht-card.is-t1 .ht-badge { flex-basis: 26px; width: 26px; height: 26px; font-size: 13px; }
  .ht--result .ht-res { padding: 14px; margin-top: 8px; }
  .ht-res-head { flex-wrap: wrap; gap: 12px; padding: 12px; }
  .ht-res-title { font-size: 19px; }
  .ht-res-body { flex-direction: column; gap: 8px; }
  .ht-res-col .ht-h2 { margin-top: 12px !important; }
  .ht-reward { flex: none; align-self: stretch; margin-top: 0; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 10px 12px; }
  .ht-reward-t { width: 100%; }
  .ht-lessons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px; }
  .ht-lessons li { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 9px; font-size: 13px; }
  .ht-res[data-rt] .ht-lessons { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
  .ht-res[data-rt] .ht-lessons li { gap: 4px; padding: 3px 7px; font-size: 12px; }
  .ht-res[data-rt] .ht-reward { gap: 4px 12px; padding: 7px 12px; }
  .ht-res[data-rt] .ht-reward-t { width: auto; }
  .ht-res[data-rt] .ht-reward-v b { font-size: 18px; }
  .ht-res[data-rt="2"] .ht-res-head, .ht-res[data-rt="3"] .ht-res-head, .ht-res[data-rt="4"] .ht-res-head { flex-wrap: nowrap; align-items: center; gap: 10px; padding: 10px; }
  .ht-res[data-rt="2"] .ht-res-site, .ht-res[data-rt="3"] .ht-res-site, .ht-res[data-rt="4"] .ht-res-site { width: 92px; }
  .ht-res[data-rt="2"] .ht-res-title, .ht-res[data-rt="3"] .ht-res-title, .ht-res[data-rt="4"] .ht-res-title { font-size: 16.5px; }
  .ht-res[data-rt="2"] .ht-res-kick, .ht-res[data-rt="3"] .ht-res-kick, .ht-res[data-rt="4"] .ht-res-kick { font-size: 12px; }
  .ht-res[data-rt="2"] .ht-res-sub, .ht-res[data-rt="3"] .ht-res-sub, .ht-res[data-rt="4"] .ht-res-sub { font-size: 13px; margin-top: 3px !important; }
  .ht-res[data-rt="2"] .ht-res-hint, .ht-res[data-rt="3"] .ht-res-hint, .ht-res[data-rt="4"] .ht-res-hint { font-size: 11.5px; margin-top: 4px !important; }
  .ht-res[data-rt="3"] .ht-lessons, .ht-res[data-rt="4"] .ht-lessons { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .ht-res[data-rt="3"] .ht-les-n .ht-les-w, .ht-res[data-rt="4"] .ht-les-n .ht-les-w { display: none; }
  .ht-res[data-rt="3"] .ht-res-foot .ht-btn, .ht-res[data-rt="4"] .ht-res-foot .ht-btn { min-height: 42px; }
  .ht-res[data-rt="4"] .ht-res-site { width: 76px; }
  .ht-les-t, .ht-les-bar { display: none; }
  .ht-res-foot { margin-top: 10px; }
  .ht-res-foot .ht-btn { flex: 1 1 0; padding: 0 12px; min-height: 46px; font-size: 15.5px !important; }
}
@media (max-width: 640px) and (max-height: 680px) {
  .ht-q { font-size: 17px; }
  .ht-opt { min-height: 42px; }
  .ht-rules li { padding: 6px 10px; font-size: 13px; }
  .ht-intro-title { font-size: 22px; }
}
/* клавиатура открыта, а места мало (телефон лёжа): вопрос, код у пропуска и поле — остальное прячется */
.ht[data-low] { padding: 4px 8px; }
.ht[data-low] .ht-top, .ht[data-low] .ht-meta, .ht[data-low] .ht-ctx, .ht[data-low] .ht-hint { display: none !important; }
.ht[data-low] .ht-card { margin-top: 0; padding: 8px 10px; border-radius: 14px; }
.ht[data-low] .ht-q { font-size: 15px; line-height: 1.3; margin-top: 0 !important; }
.ht[data-low] .ht-vis { margin-top: 6px; }
.ht[data-low] .ht-inp { margin-top: 6px; }
.ht[data-low] .ht-inp-f, .ht[data-low] .ht-check { height: 40px; min-height: 40px; }
.ht[data-low] .ht-foot { margin-top: 4px; min-height: 0; }
/* окно ниже 460 px и широкое (масштаб 175–200%, лёжа): карточка в две колонки — слева вопрос и картинка, справа ответ */
@media (max-height: 460px) and (min-aspect-ratio: 3/2) {
  .ht-card { display: grid !important; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); grid-template-rows: auto auto auto minmax(0, 1fr); column-gap: 18px; }
  .ht-card > .ht-meta, .ht-card > .ht-ctx, .ht-card > .ht-q { grid-column: 1; }
  .ht-card > .ht-vis, .ht-card > .ht-spacer { grid-column: 1; grid-row: 4; margin-top: 6px; min-height: 0; max-height: none; }
  .ht-card > .ht-opts, .ht-card > .ht-inp { grid-column: 2; grid-row: 1 / 5; align-self: center; margin-top: 0; }
  .ht-card > .ht-opts, .ht-card > .ht-opts.is-short { grid-template-columns: 1fr; gap: 6px; }
  .ht-card.is-assemble > * { grid-column: 1 / 3; }
  .ht-card.is-ix { grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); }
  .ht-card.is-ix > .ht-vis { grid-column: 2; grid-row: 1 / 5; margin-top: 0; }
  .ht-card.is-assemble > .ht-asm { grid-row: 4; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; column-gap: 14px; row-gap: 8px; align-items: center; margin-top: 6px; }
  .ht-card.is-assemble .ht-asm > .ht-ed { grid-column: 1; grid-row: 1 / 3; max-width: none; }
  .ht-card.is-assemble .ht-asm > .ht-pcs { grid-column: 2; grid-row: 1; align-self: end; }
  .ht-card.is-assemble .ht-asm > .ht-asm-act { grid-column: 2; grid-row: 2; align-self: start; }
  .ht-card.is-assemble .ht-asm > .ht-inp-right { grid-column: 2; grid-row: 1 / 3; }
  .ht-card.is-t2 .ht-opt.is-off { display: none; }
  .ht-card.is-assemble.is-t1 .ht-asm > .ht-ed { font-size: 11px; }
  .ht-card.is-assemble.is-t2 .ht-asm > .ht-ed { font-size: 12px; }
  .ht-card.is-assemble.is-t3 .ht-asm > .ht-ed { font-size: 11px; }
  .ht-card.is-assemble.is-t3 .ht-asm.is-bad > .ht-ed { display: none; }   /* масштаб 200%, после ошибки: верный ответ строкой, без редактора */
  .ht-card.is-assemble.is-t3 .ht-asm.is-bad > .ht-inp-right { grid-column: 1 / 3; grid-row: 1 / 3; }
  .ht-card.is-assemble .ht-asm.is-ok > .ht-ed { grid-column: 1 / 3; }   /* после верного ответа справа пусто — код во всю ширину */
  .ht-card.is-assemble.is-t3 .ht-asm.is-ok > .ht-ed { display: none; }   /* масштаб 200%: собранная строка — одной строкой с галочкой */
  .ht-card.is-assemble.is-t3 .ht-asm.is-ok > .ht-asm-built { display: flex; grid-column: 1 / 3; grid-row: 1 / 3; }
  .ht-card.is-t3 .ht-q { font-size: 15px; }
  .ht-card .ht-opt { min-height: 36px; }
}
@media (min-width: 641px), (max-height: 460px) and (min-aspect-ratio: 3/2) {
  .ht-res[data-rt="5"], .ht-res[data-rt="6"] { display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr) auto; column-gap: 16px; }
  .ht-res[data-rt="5"] .ht-res-head, .ht-res[data-rt="6"] .ht-res-head { display: contents; }
  .ht-res[data-rt="5"] .ht-res-site, .ht-res[data-rt="6"] .ht-res-site { grid-column: 1; grid-row: 1 / 4; align-self: start; width: 130px; }
  .ht-res[data-rt="5"] .ht-res-text, .ht-res[data-rt="6"] .ht-res-text { grid-column: 2; grid-row: 1; }
  .ht-res[data-rt="5"] .ht-res-head > .ht-kodi, .ht-res[data-rt="6"] .ht-res-head > .ht-kodi { display: none; }
  .ht-res[data-rt="5"] .ht-res-title, .ht-res[data-rt="6"] .ht-res-title { font-size: 18px; }
  .ht-res[data-rt="5"] .ht-res-body, .ht-res[data-rt="6"] .ht-res-body { grid-column: 2; grid-row: 2; flex-direction: column; gap: 6px; margin-top: 6px; }
  .ht-res[data-rt="5"] .ht-reward, .ht-res[data-rt="6"] .ht-reward { order: -1; flex: none; align-self: stretch; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 2px 14px; margin-top: 0; padding: 5px 12px; }
  .ht-res[data-rt="5"] .ht-reward-v b, .ht-res[data-rt="6"] .ht-reward-v b { font-size: 16px; }
  .ht-res[data-rt="5"] .ht-h2, .ht-res[data-rt="6"] .ht-h2 { margin-top: 2px !important; font-size: 13.5px; }
  .ht-res[data-rt="5"] .ht-hole, .ht-res[data-rt="6"] .ht-hole { margin-top: 0; }
  .ht-res[data-rt="5"] .ht-res-foot, .ht-res[data-rt="6"] .ht-res-foot { grid-column: 2; grid-row: 3; }
}
@media (prefers-reduced-motion: reduce) { .ht *, .ht *::before, .ht *::after { animation: none !important; transition: none !important; } }
`;
