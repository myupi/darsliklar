// Урок 3 «Списки» двумя частями (tools/qism/build.mjs): часть 1 — ul, li и ol (s1–s7 + вывод E1),
// часть 2 — ul или ol и свой список (крючок H2 + s8–s15). Загадка про номера в ol разгадывается в E1.
const recipePage = [
  ["  const mine = useMine3();\n", ''],
  [": [{ t: 'h2', parts: [mine.title], k: 'h' }, { t: 'ul', k: 'l', hl: curK === 'ul', items: mine.items.map((w) => ({ parts: [w], hl: curK === 'li' })) }];",
    ": recipeBlocks(pick, curK === 'ul' || curK === 'li' ? 'ul' : curK === 'ol' ? 'ol' : null, false);"],
  ['<PaperBrowser title={riddle ? pick(PAGE.title) : pick(UI.mySite)} cls="z3-br">', '<PaperBrowser title={pick(PAGE.title)} cls="z3-br">']
];

export default {
  dir: 'tools/royxat3',
  src: 'z3.src.jsx',
  screens: 'z3-screens.jsx',
  lessonId: 'html-03-spiski',
  slug: 'spiski',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "3-dars. 1-qism: ul, li va ol", ru: 'Урок 3. Часть 1: ul, li и ol', en: 'Lesson 3. Part 1: ul, li and ol' },
    { uz: "3-dars. 2-qism: ul yoki ol va o'z ro'yxatingiz", ru: 'Урок 3. Часть 2: ul или ol и свой список', en: 'Lesson 3. Part 2: ul or ol and your own list' }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // Часть 1: загадка задаётся как раньше, но «в этой части», а не «в этом уроке».
  s1Done: {
    uz: [["Bu darsda ro'yxat tuzishni o'rganamiz, oxirida esa o'zingiz ham ro'yxat yasaysiz.", "Bu qismda ro'yxat tuzishni o'rganamiz."]],
    ru: [['Сегодня ты научишься делать такие списки и соберёшь свой.', 'В этой части ты научишься делать такие списки.'], ['в конце урока', 'в конце этой части']],
    en: [['Today you’ll learn to make lists like these and build your own.', 'In this part you’ll learn to make lists like these.'], ['at the end of the lesson', 'at the end of this part']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Retsept sahifasi tayyor", ru: 'Страница рецепта готова', en: 'The recipe page is ready' },
    next: { uz: "Keyingi qism: ul yoki ol va o'z ro'yxatingiz", ru: 'Следующая часть: ul или ol и свой список', en: 'Next part: ul or ol, and your own list' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Endi sirni ochamiz. Esingizdami, men qadamlarning oldiga raqamlarni qo'lda yozgan edim? Sahifaga qarang: birinchi qadam oldida ikkita raqam turibdi, bir va yana bir! Ol raqamni o'zi qo'yar ekan, men yozganim uning yoniga qo'shilib ketibdi. Demak, ol ichida raqamni qo'lda yozmaymiz.",
        ru: 'Вернёмся к загадке. Помнишь, я сам вписал номер перед каждым шагом? Смотри, что вышло: перед первым шагом два номера, один и ещё раз один. ol ставит номера сам, а мои встали рядом с ними. Значит, в ol номера руками не пишут.',
        en: 'Back to our riddle. Remember, I typed a number in front of each step myself? Look what happened: the first step has two numbers, one and one again. ol adds numbers by itself, and mine landed right next to them. So you never type numbers by hand in ol.' } },
      { k: null, text: { uz: "Mana, o'zingiz tuzgan retsept sahifasi!", ru: 'А вот страница с рецептом, которую ты собрал!', en: 'And here is the recipe page you put together!' } },
      { k: 'ul', text: {
        uz: "Mahsulotlar ul ichida turibdi: har birining oldida nuqta bor, tartibi esa muhim emas.",
        ru: 'Продукты лежат в ul: у каждого точка, а порядок не важен.',
        en: 'The ingredients sit in ul: each has a dot, and the order doesn’t matter.' } },
      { k: 'ol', text: {
        uz: "Qadamlar esa ol ichida: ularning tartibi muhim, shuning uchun raqamlarni brauzerning o'zi qo'yadi.",
        ru: 'А шаги лежат в ol: порядок у них важен, поэтому номера ставит браузер.',
        en: 'The steps are in ol: their order matters, so the browser adds the numbers.' } },
      { k: 'li', text: {
        uz: "Har bir band esa li ichida yashaydi. li doim ul yoki ol ichida turadi.",
        ru: 'А каждый пункт живёт в li. li всегда стоит внутри ul или ol.',
        en: 'And each item lives in li. li always sits inside ul or ol.' } },
      { k: null, text: {
        uz: "Lekin bitta savol qoldi: ul va ol teglarini almashtirib qo'ysak, sahifa nima bo'ladi? Keyingi qismda buni sinab ko'ramiz, undan keyin o'z ro'yxatingizni ham yasaymiz!",
        ru: 'Но остался вопрос: что будет, если поменять ul и ol местами? Проверим это в следующей части, а потом соберём твой собственный список!',
        en: 'But one question is left: what happens if we swap ul and ol? We’ll test it in the next part, and then build your own list!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Ikki ro'yxat, bitta farq", ru: 'Два списка и одно отличие', en: 'Two lists, one difference' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Salom! O'tgan qismda retsept sahifasini tuzdik: mahsulotlar nuqtali ro'yxatda, qadamlar raqamli ro'yxatda.",
        ru: 'Привет! В прошлой части мы собрали страницу рецепта: продукты в списке с точками, шаги в списке с номерами.',
        en: 'Hi! In the last part we built the recipe page: the ingredients in a bulleted list, the steps in a numbered one.' } },
      { k: 'li', text: {
        uz: "Lekin bandlarning o'zi ikkala ro'yxatda ham bir xil: ikkalasida ham li. Farq faqat tashqi tegda!",
        ru: 'Но сами пункты в обоих списках одинаковые: и там и там li. Разница только во внешнем теге!',
        en: 'But the items themselves are the same in both lists: li in each. The difference is only the outer tag!' } },
      { k: null, text: {
        uz: "Nima deb o'ylaysiz, mahsulotlar ro'yxatida ul o'rniga ol qo'ysam, sahifada nima o'zgaradi? Qani, ko'ramiz. Ketdik!",
        ru: 'Как думаешь, что изменится на странице, если у продуктов поменять ul на ol? Давай посмотрим. Погнали!',
        en: 'What do you think will change on the page if I swap ul for ol on the ingredients? Let’s see. Let’s go!' } }
    ]
  },
  e1Edits: recipePage,
  h2Edits: recipePage
};
