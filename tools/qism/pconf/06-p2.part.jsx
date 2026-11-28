// Практика 6 «Анкеты Коди», ЧАСТЬ 2: placeholder, label и form (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Saqlash»: серые подсказки пропали, подписи отлетели от полей) и четыре прежних задания по темам части 2
// урока без изменений кода: бывшие т2 (строка input с type и placeholder), т3 (label с подписью и полем), т4 (найти
// поле пароля, «спрятанное» через placeholder — загадка урока 6) и т5 (своя анкета: h1, form, два label) — теперь т1…т4.
// Вывод — прежний Fin с четырьмя вкладками и новой речью (правки build-prac: свои плашки, вкладка «Mening anketam» —
// четвёртая). Четыре вкладки — Shaxmat, Robototexnika, Rasm chizish, Mening anketam (Futbol остался в части 1).

TABS.splice(0, 1);   // карта части 2 — четыре вкладки

// Ключи текстов должны совпадать с id экранов (прогрев озвучки берёт C[id]): прежние т2…т5 становятся т1…т4.
const OLD6 = { t2: C.t2, t3: C.t3, t4: C.t4, t5: C.t5 };
Object.assign(NOT_SPOKEN_IN, { roles: { placeholder: 1, label: 1, form: 1, type: 1, own: 1 } });

// Хук: шахматная анкета с серыми подсказками и подписями в label; «Saqlash» возвращает старую копию.
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Oldingi amaliyotda maydonlarni va ularning turini tuzatdik. Mana, shaxmat anketasi: maydonning ichida kulrang ishora turibdi, yozuv esa maydon bilan yonma-yon. Yangi nusxani joyiga qo'yamiz: «Saqlash»ni bosing.",
      'Привет! В прошлой практике мы починили поля и их вид. Вот анкета шахмат: в поле серая подсказка, а подпись стоит рядом с полем. Сохраним новую копию: нажми «Сохранить».',
      'Hi! In the last practice we fixed the fields and their kinds. Here’s the chess form: the field has a grey hint, and the caption sits right next to the field. Let’s save the new copy: tap “Save”.'),
    broke: L3("Voy, yana buzilib qolibdi! Kulrang ishora yo'qolibdi, yozuv esa maydondan ajralib, alohida qatorga tushib qolibdi. Bola endi bo'sh maydonga nima yozishni qayerdan bilsin?",
      'Ой, снова всё сломалось! Серая подсказка пропала, а подпись отлетела от поля на отдельную строку. Откуда ребёнку знать, что писать в пустое поле?',
      'Oh no, it broke again! The grey hint is gone, and the caption came off the field onto a separate line. How would a kid know what to type into an empty field?'),
    done: L3("Kulrang ishorani placeholder atributi qo'yadi, yozuvni maydon bilan esa label tegi bog'laydi. Ikkalasini ham o'zingiz qaytarasiz. Shaxmatdan boshlab, to'rtta anketani tuzatamiz, oxirgisi esa sizniki bo'ladi.",
      'Серую подсказку ставит атрибут placeholder, а подпись с полем связывает тег label. Оба вернёшь ты сам. Починим четыре анкеты, начиная с шахмат, а последняя будет твоей.',
      'The grey hint is set by the placeholder attribute, and the label tag ties the caption to the field. You’ll bring both back yourself. We’ll fix four forms, starting with chess, and the last one will be yours.'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Ishora bilan yozuvni o'zingiz qaytarasiz", 'Подсказку и подпись вернёшь ты сам', 'You bring the hint and the caption back yourself')
  }
});

// Задания: тексты прежние, меняется только первая фраза (сколько анкет уже готово и какая следующая).
C.t1 = Object.assign({}, OLD6.t2, {
  say: L3("Shaxmatdan boshlaymiz. Bu anketada Ism degan yozuv bor-u, uning maydoni butunlay o'chib ketibdi. Maydon qanaqa bo'lishini type aytadi, kulrang ishorani esa placeholder yozadi. Qani, ikkalasini bitta input qatoriga yig'ib yozing-chi. input tegini yopmaysiz: u yolg'iz yuradi.",
    'Начнём с шахмат. В этой анкете подпись «Имя» есть, а строка с полем стёрлась целиком. Напиши в пустой строке всё поле: тег input, в type — text, а в placeholder — серая подсказка. Помнишь, input не закрывается.',
    'Let’s start with chess. This form has the name caption, but the field line got erased completely. Write the whole field in the empty row: the input tag, text in type, and a grey hint in placeholder. Remember, input doesn’t close.')
});
C.t2 = Object.assign({}, OLD6.t3, {
  say: L3("Shaxmat ham tayyor, endi robototexnika anketasi! Yosh haqidagi savol butunlay yo'qolibdi. Uni label bilan yozing: ochuvchi label, Yosh degan yozuv, keyin son uchun maydon, oxirida yopuvchi label. Nega aynan label? Yozuvning o'zini bossangiz ham maydon yozishga tayyor bo'ladi.",
    'Шахматы готовы, теперь робототехника! Здесь пропал целиком вопрос про возраст. Напиши его через label: открывающий label, подпись «Возраст:», потом поле для числа и закрывающий label. Тогда нажатие на подпись выберет поле.',
    'Chess is done, now robotics! The age question vanished here completely. Write it with label: the opening label, the caption “Age:”, then a field for a number and the closing label. Then tapping the caption will select the field.')
});
C.t3 = Object.assign({}, OLD6.t4, {
  say: L3("Ikkita anketa joyiga tushdi, qoldi rasm chizish. Bu anketadagi parol maydoniga placeholder ichida Parol deb yozib, yashirdim deb o'ylagandim. Lekin qarang: bola parolini yozgan zahoti harflari ko'rinib qoldi! Men qaysi qatorda adashganman, topa olasizmi? O'sha qatorni bosing.",
    'Две анкеты готовы, третья: рисование. Тут я сам прятал пароль: написал в placeholder слово «Пароль». Но смотри: гость написал пароль, и его видно всем. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
    'Two forms are done, the third is drawing. Here I hid the password myself: I wrote “Password” in placeholder. But look, a visitor typed a password and everyone can see it. So one line is broken. First find that line and tap it.')
});
C.t4 = Object.assign({}, OLD6.t5, {
  say: L3("Uchala anketa ishlayapti! O'z to'garagingiz bo'lsa, u nima haqida bo'lardi? To'rtinchi anketa o'sha to'garak uchun. Oldin h1 tegida to'garagingizning nomini yozing: anketa nomsiz bo'lmaydi. Keyin form tegini oching, uning ichiga ikkita label qo'ying: birinchisida kulrang ishorali oddiy maydon, ikkinchisida parol maydoni.",
    'Три анкеты горят! Теперь четвёртая: твоя анкета. Здесь есть только body. Придумай свой кружок. В самом верху заголовок в теге h1. Потом внутри form два label: в первом обычное поле с серой подсказкой, во втором поле пароля.',
    'Three forms are lit! Now the fourth: your form. There’s only body here. Make up your own club. At the very top, a heading in the h1 tag, then two labels inside form: a plain field with a grey hint in the first, and a password field in the second.')
});

// Вывод части 2: четыре анкеты и тема части (placeholder, label, form, разгадка про пароль).
Object.assign(C.fin, {
  say: [
    { k: 'all', text: L3("Qarang, shaxmat, robototexnika, rasm chizish va sizning to'garagingiz anketalari ham tayyor! Oldingi amaliyotdagi to'rttasi bilan birga sakkizta anketa ishlab turibdi.",
      'Смотри, и анкеты шахмат, робототехники, рисования и твоего кружка готовы! Вместе с четырьмя из прошлой практики работают уже восемь анкет.',
      'Look, the forms for chess, robotics, drawing and your own club are ready too! Together with the four from the last practice, eight forms are working now.') },
    { k: 'placeholder', text: L3("Kulrang ishorani placeholder qo'ydi: u maydon bo'sh turganda ko'rinadi, odam yozishni boshlasa yo'qoladi.",
      'Серую подсказку ставил placeholder: она видна, пока поле пусто, и исчезает, когда человек начинает писать.',
      'The grey hint was set by placeholder: it shows while the field is empty and disappears when the person starts typing.') },
    { k: 'label', text: L3("label esa yozuv bilan maydonni bog'ladi: yozuvni bossangiz ham maydon yozishga tayyor bo'ladi.",
      'label связал подпись с полем: нажмёшь на подпись, и поле готово к вводу.',
      'label tied the caption to the field: tap the caption and the field is ready for typing.') },
    { k: 'form', text: L3("Oxirgi anketada hamma maydonni bitta form tegi bir joyga yig'di.",
      'А в последней анкете все поля собрал в одно место тег form.',
      'And in the last form, one form tag gathered all the fields in one place.') },
    { k: 'type', text: L3("Rasm chizish anketasidagi sirni esa o'zingiz ochdingiz: parolni placeholder emas, faqat password yashira oladi.",
      'А загадка из анкеты рисования разгадана: пароль прячет только password, а не placeholder.',
      'And you solved the riddle from the drawing form yourself: only password hides a password, not placeholder.') },
    { k: 'own', text: L3("Saytda endi sizning to'garagingiz ham bor, anketasi bilan birga! Bolalar ro'yxatdan tanlashi va anketani yuborishi uchun yana nima kerak ekan, o'ylab ko'ring.",
      'А в конце — твоя собственная анкета. Это было мощно! На следующем уроке научимся выбору из списка и кнопке отправки.',
      'And at the end you made your own form. That was awesome! Next lesson we’ll learn choosing from a list and the send button.') }
  ],
  roles: Object.assign({}, C.fin.roles, { form: L3("form — anketa", 'form — анкета', 'form — the form') })
});

// ─────────────────────────────────────────────────────────────────────────────
// Задания 1–4: прежние т2…т5 с новыми номерами. cls — класс листа прежнего номера (так работают CSS-правила прежних
// заданий: окно ниже в строках, большой редактор у своей анкеты).
// ─────────────────────────────────────────────────────────────────────────────
const cfgQ1 = (pick) => Object.assign(cfgT2(pick), { id: 't1', num: 1, cls: 't2', C: C.t1 });
const cfgQ2 = (pick) => Object.assign(cfgT3(pick), { id: 't2', num: 2, cls: 't3', C: C.t2 });
// Найти и исправить — своя копия cfgT4: тексты лежат под ключом t3 (см. правку a6FixCheck в build-prac).
const cfgQ3 = (pick) => ({
  id: 't3', num: 3, cls: 't4', kind: 'find-fix', C: C.t3,
  init: () => ({ at: null, code: '' }),
  check: (st) => a6FixCheck(st, pick),
  view: a6FixView(A6_T4, C.t3),
  sample: (pk) => [a6Label(pk(CAP.pass), a6Input('password', pk(PH.pass)))],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a6FixCheck(st, pick), view: a6FixView(A6_T4X, C.t3) }
});
const cfgQ4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, cls: 't5', C: C.t4 });
const Q1 = ({ p }) => <A6Task p={p} make={cfgQ1} />;
const Q2 = ({ p }) => <A6Task p={p} make={cfgQ2} />;
const Q3 = ({ p }) => <A6Task p={p} make={cfgQ3} />;
const Q4 = ({ p }) => <A6Task p={p} make={cfgQ4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: анкета шахмат (серые подсказки, подписи в label), четыре вкладки горят → «Saqlash» → старая
// копия: подсказки пропали, подписи отлетели от полей (каждая на своей строке над пустым полем), вкладки гаснут.
// Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const [rec, put] = useRec('h2');
  const broke = !!(rec && rec.done);
  const [boom, setBoom] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: broke ? c.done : c.say, pose: broke ? 'point' : 'wonder' }]);
  const canGo = useAdvanceGate(broke, spoken);
  const led = useIdleLed(!broke, 0);
  const all = useA6Tabs(true);
  const tabs = broke ? all.map((t) => Object.assign({}, t, { st: 'off' })) : all;
  const tap = () => {
    if (broke) return;
    sfx('off', true);
    setBoom(true);
    setTimeout(() => setBoom(false), 700);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const club = pick(CLUB.shaxmat);
  const capN = pick(CAP.name), capP = pick(CAP.pass);
  const lines = broke
    ? ['<h1>' + club + '</h1>', '<p>' + capN + '</p>', a6Input('text'), '<p>' + capP + '</p>', a6Input('password')]
    : ['<h1>' + club + '</h1>', '<form>', '  ' + a6Label(capN, a6Input('text', pick(PH.name))), '  ' + a6Label(capP, a6Input('password', pick(PH.pass))), '</form>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a6-sheet a6-s1 a6-five">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a6-work">
          <div className="a6-side">
            <A6Browser tabs={tabs} cur={0} title={club} cls={boom ? 'a6-glitch' : ''} url="shaxmat.html">
              <A6Doc blocks={a6Page(lines.join('\n')).blocks} />
            </A6Browser>
          </div>
          <div className="a6-main">
            <A6Code lines={lines} cls={boom ? 'a6-glitch' : ''} />
            {!broke ? (
              <div className="kz-row a6-row">
                <button type="button" className="kz-btn is-coral a6-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h11l3 3v15H5z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></svg>
                  {pick(UI.save)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
