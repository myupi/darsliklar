# 1-dars «Qog‘oz sahifa» — o‘zbekcha matn (3-versiya, so‘zlashuv uslubi)

Kodining gaplari jonli, so‘zlashuv tilida. {name} — o‘quvchi o‘ylab topgan sahifa nomi, {greet} — u yozgan salom, {w} — raunddagi so‘z.

## 1-ekran · «Qog‘oz sahifa» (s1)

- s1.say — Hammaga salom! Mening ismim Kodi. Hozir sizlarga bitta veb-sahifani ko‘rsataman. Nimaga deysizmi? Buni dars davomida bilib olasiz!
- s1.sayTab — Tepadagi mana bu kichkina joyni ko‘ryapsizmi? Bu yorliq deyiladi. Unga sahifaning nomi yozib qo‘yilgan.
- s1.sayGo — Endi bir narsani tasavvur qiling: shu sahifa odam bo‘lib qolsa, qanaqa bo‘larkin? Qani, ko‘ramiz! «Aylantirish» tugmasini bosing.
- s1.magic — Voy-voy, qarang! Sahifa jonlanib, odamchaga aylanib qoldi!
- s1.magicHead — Sezdingizmi? Sahifaning nomi endi uning boshida turibdi. Chunki boshda sahifa haqidagi ma’lumotlar saqlanadi.
- s1.magicWin — Tanasi-chi? U sahifada ko‘rinib turgan narsalardan yasalgan: matndan, rasmdan va tugmadan.
- s1.done — Bugun siz ham o‘zingizning sahifangizni yasaysiz: unga nom qo‘yasiz, salom ham yozasiz. Lekin oldin kod degani qanaqa bo‘lishini ko‘rib olamiz.

## 2-ekran · «Kod qanday o‘qiladi?» (rd)

- rd.say — Mana, bu kod. Brauzer sahifani aynan shundan yig‘adi. Qani, qanday o‘qishini kuzatib turing!
- rd.read1 — Sezdingizmi? Brauzer kodni xuddi biz kitob o‘qigandek o‘qiyapti.
- rd.read2 — Har bir qatorni chapdan o‘ngga qarab o‘qiydi.
- rd.read3 — Qatorlarni esa tepadan pastga, bittalab o‘qiydi.
- rd.done — Brauzer kodni oxirigacha o‘qib chiqdi — mana, sahifa ham tayyor! Endi bu kodda nimalar yozilganini birga ko‘rib chiqamiz.

## 3-ekran · «Teg nima?» (s3)

- s3.say — Ramkaga bir qarang-chi: unda ikkita yozuv bor. Tepadagisini bosib ko‘ring.
- s3.br — Mana bu < va > belgilarini ko‘ryapsizmi? Ularni burchakli qavslar deyishadi.
- s3.nm — Ularning o‘rtasida html degan so‘z turibdi. Bu tegning nomi.
- s3.sayTag — Mana shu yozuv butunligicha teg deyiladi. Brauzer tegni sahifada ko‘rsatmaydi, faqat o‘qiydi.
- s3.top — Bunisi ochuvchi html tegi. U brauzerga «Sahifa shu yerdan boshlanadi», deb aytadi. Endi pastdagisini bosing.
- s3.bottom — Farqini sezdingizmi? Bunda birinchi qavsdan keyin qiya chiziq bor. Bu yopuvchi html tegi. U «Sahifa shu yerda tugaydi», deydi.
- s3.pair — Demak, ochuvchi teg boshlaydi, yopuvchi teg tugatadi. Sahifadagi hamma narsa shu ikkalasining o‘rtasida turadi.
- s3.done — Sizga bir sir aytaymi? Bu ramkani tushunarli bo‘lsin deb o‘zimiz chizdik. Haqiqiy brauzerda uni ko‘rmaysiz.

## 4-ekran · «Ramkani yoping» (s4)

- s4.say — Voy, ramkaning pastki cheti qayoqqa ketdi? Kodda yopuvchi html tegi yo‘q ekan. Uni bo‘sh qatorga yozing-da, «Tekshirish»ni bosing.
- s4.msgs.needSlash — Oz qoldi! Bu ochuvchi teg-ku. Yopuvchi tegda html so‘zidan oldin qiya chiziq bo‘ladi.
- s4.msgs.needLt — Boshi tushib qolibdi: teg doim «<» qavsi bilan boshlanadi.
- s4.msgs.needGt — Oxiri tushib qolibdi: teg doim «>» qavsi bilan tugaydi.
- s4.msgs.wrongName — Teg ichidagi so‘zga qarang-chi: bu yerga html yozilishi kerak.
- s4.msgs.generic — Nimadir chalkashib ketdi. Tepadagi teg bilan solishtirib ko‘ring: qavs, qiya chiziq, html, qavs.
- s4.hints[0] — Ramkaning tepasidagi tegga qarang. Pastdagisi unga juda o‘xshaydi.
- s4.hints[1] — Yopuvchi teg ham xuddi o‘sha, faqat qiya chizig‘i bor.
- s4.hints[2] — Tugmalarni ketma-ket bosing: qavs, qiya chiziq, html, keyin yana qavs.
- s4.ok — Zo‘r! Ramka yopildi. Endi butun sahifa ikkita html tegining o‘rtasida.

## 5-ekran · «Teglarni joyiga qo‘ying» (s5)

- s5.say — Endi navbat sizga! Ramkaga ikkita teg kerak: biri tepaga, biri pastga. Faqat ehtiyot bo‘ling: pastdagi uchta tegdan bittasi ortiqcha.
- s5.sayHow — Tegni ushlab, joyiga olib boring. Yoki oldin tegni, keyin joyni bosing.
- s5.top — Oz qoldi! Tepada sahifa boshlanadi, shuning uchun bu yerga qiya chiziqsiz ochuvchi teg kerak.
- s5.bottom — Hechqisi yo‘q! Pastda sahifa tugaydi, bu yerga qiya chiziqli yopuvchi teg kerak.
- s5.back — Ana, tuzoq shu yerda ekan! Bu chiziq teskari tomonga qiyshaygan. Yopuvchi tegda chiziq o‘ngga qarab qiyshaygan bo‘ladi.
- s5.pickFirst (faqat yoziladi) — Oldin tegni tanlang.
- s5.hints[0] — Qaysi teg sahifani boshlaydi-yu, qaysi biri tugatadi?
- s5.hints[1] — Tepaga qiya chiziqsiz teg, pastga qiya chiziqli teg qo‘yiladi.
- s5.hints[2] — Yonib turgan tegni yonib turgan joyga olib boring.
- s5.ok — Barakalla, ikkala teg ham joyida! Teskari chiziqli teg esa ortiqcha edi.

## 6-ekran · «head va title» (s6)

- s6.say — html ichida ikkita qism yashaydi. Birinchisining nomi head, inglizchada «bosh» degani. Odamchaning boshi xuddi shu head.
- s6.sayInfo — head ichida sahifa haqidagi ma’lumotlar turadi. Pastdagi katta joy — brauzer oynasiga qarang: u yerda ular ko‘rinmaydi. Qani, boshni bosib, ichida nima borligini ko‘ring.
- s6.opened — Ana, ichida nima ekan: sahifaning nomi! U title tegining ichiga yoziladi. Endi nom yozilgan qog‘ozchani bosing.
- s6.flew — Nom uchib, yorliqqa o‘tib oldi! Brauzer title tegidagi matnni mana shu yerda, tepada ko‘rsatadi. Oynada esa u yo‘q.
- s6.inHead — Endi kodga qarang: tepada ochuvchi head tegi, pastda yopuvchi head tegi turibdi.
- s6.done — title qatori ularning o‘rtasida. Demak, title head ichida yashaydi.

## 7-ekran · «Yorliqdagi nom» (s7)

- s7.say — Endi eng qiziq joyiga keldik: sahifangizga o‘zingiz nom qo‘ying! Uni title teglarining o‘rtasiga yozing, masalan, «Futbol». Nom shu zahoti yorliqda chiqadi. Keyin «Tayyor»ni bosing.
- UI.noTags (faqat yoziladi) — Bu yerga faqat so‘z yozing, burchakli qavslar kerak emas.
- s7.hints[0] — Nom qayerga yoziladi? Kodga qarang: u yerda bo‘sh joy bor.
- s7.hints[1] — Nom ikkita title tegining o‘rtasiga yoziladi.
- s7.hints[2] — Ikkita title tegi o‘rtasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing.
- s7.ok — Zo‘r! Endi yorliqda sahifangizning nomi turibdi.

## 8-ekran · «body qismi» (s9)

- s9.say — Nom tayyor. Endi sahifaning o‘zini to‘ldiramiz! html ichidagi ikkinchi qismning nomi body, inglizchada «tana» degani. Qani, odamchaning tanasidan nima uchib chiqarkin?
- s9.out — Voy, qarang! Matn, rasm, tugma — hammasi tanadan uchib chiqib, to‘ppa-to‘g‘ri oynaga tushdi.
- s9.done — Oynada nima ko‘rinsa — matnmi, rasmmi, tugmami — hammasi body ichida turadi. Bugun body ichiga matn yozamiz, rasm bilan tugmani keyingi darslarda qo‘shamiz.

## 9-ekran · «Oynadagi salom» (s10)

- s10.say — Endi body teglarining o‘rtasiga «Salom» so‘zini yozing.
- s10.sayWin — U shu zahoti oynada paydo bo‘ladi. Keyin «Tayyor»ni bosing.
- UI.noTags (faqat yoziladi) — Bu yerga faqat so‘z yozing, burchakli qavslar kerak emas.
- s10.hints[0] — Oyna uchun matn qayerga yoziladi? Kodga qarang.
- s10.hints[1] — Matn ikkita body tegining o‘rtasiga yoziladi.
- s10.hints[2] — Ikkita body tegi o‘rtasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing.
- s10.ok — Ajoyib! Salomingiz oynada turibdi.

## 10-ekran · «Yorliqmi yoki oyna?» (s8)

Tugmalar: «Yorliq», «Oyna».

- s8.say — Endi bir o‘yin o‘ynaymiz: siz brauzersiz! Kod qatoriga qarab, so‘z qayerda chiqishini toping: yorliqdami yoki oynada?
- s8.askTitle — title tegida «{w}» deb yozilgan. Qani, u qayerda chiqadi?
- s8.askBody — Endi body tegida «{w}» deb yozilgan. Bu safar qayerda chiqadi?
- s8.ok.title — To‘ppa-to‘g‘ri! title tegidagi so‘z yorliqqa chiqdi.
- s8.ok.body — Topdingiz! body tegidagi so‘z oynaga chiqdi.
- s8.miss.title — Hechqisi yo‘q! So‘z title tegida turgan edi, shuning uchun yorliqqa chiqdi.
- s8.miss.body — Bu safar adashdingiz! So‘z body tegida turgan edi, shuning uchun oynaga chiqdi.
- s8.more — Keling, yana bittasini ko‘ramiz.
- s8.hints[0] — So‘z qaysi teglarning o‘rtasida turibdi?
- s8.hints[1] — title tegidagi matn yorliqda, body tegidagi matn oynada ko‘rinadi.
- s8.hints[2] — Teg nomini o‘qing: title bo‘lsa «Yorliq»ni, body bo‘lsa «Oyna»ni bosing.
- s8.done — Mana, o‘yin tugadi! Esingizda bo‘lsin: title tegidagi matn yorliqda, body tegidagi matn oynada chiqadi.

Raund so‘zlari: Kosmos · Kosmos · Juma kuni final! · qo‘shimcha: Musiqa / Bugun konsert!

## 11-ekran · «Bo‘laklarni joylang» (s11)

- s11.say — Keling, endi hammasini joy-joyiga qo‘yamiz! Har bir bo‘lakning o‘z uyi bor. Qani, toping-chi: uyi head ichidami yoki body ichidami? Bo‘lakni olib boring yoki oldin bo‘lakni, keyin kerakli qismni bosing.
- s11.items[0].why — Qarang: bu title qatori-ku. title esa head ichida yashaydi, demak, uning joyi head.
- s11.items[1].why — Yo‘q, bunisining uyi boshqa joyda! Salomingiz oynada ko‘rinadi-ku, demak, u body ichida yashaydi.
- s11.items[2].why — Hechqisi yo‘q! Rasmni oynada ko‘ramiz-ku, demak, u body ichida.
- s11.items[3].why — O‘ylab ko‘ring-chi: tugmani qayerda bosamiz? Oynada! Demak, u body ichida.
- s11.pickFirst (faqat yoziladi) — Oldin bo‘lakni tanlang.
- s11.hints[0] — O‘ylab ko‘ring: bu narsa brauzer oynasida ko‘rinadimi?
- s11.hints[1] — Oynada ko‘rinadigan hamma narsa body ichida. title qatori esa head ichida.
- s11.hints[2] — Yonib turgan bo‘lakni yonib turgan joyga olib boring.
- s11.ok — Hammasi joy-joyida! title head ichida, salom, rasm va tugma esa body ichida.

## 12-ekran · «Yuqoridan pastga» (s12)

- s12.say — Endi siz hamma qismlarni bilasiz. Keling, brauzer sizning kodingizni qanday o‘qishini yana bir marta ko‘ramiz va har bir qatorni tushunib olamiz.
- s12.parts.doc — Birinchi qator — <!DOCTYPE html>. U brauzerga «Bu HTML sahifa», deb aytadi. Uning jufti yo‘q, shuning uchun uni yopish shart emas.
- s12.parts.html — html tegi butun sahifani quchoqlab turadi. head ham, body ham uning ichida.
- s12.parts.head — Mana bu head, sahifaning «boshi». Bu yerda sahifa haqidagi ma’lumotlar turadi.
- s12.parts.title — head ichida title bor, unda sahifaning nomi yozilgan. Brauzer shu nomni yorliqda ko‘rsatadi.
- s12.order5 — Mana bu joyi muhim: oldin head yopiladi, keyin body ochiladi. Ular bir-birining ichida emas, ketma-ket turadi.
- s12.parts.body — Mana bu body, sahifaning «tanasi». Oynada ko‘rinadigan hamma narsa shu yerda.
- s12.parts.text — Mana, sizning salomingiz! U body ichida, shuning uchun oynada ko‘rinyapti.
- s12.tapSay — Yana bir marta eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi qismni bosing, men aytib beraman.

## 13-ekran · «Sahifa asosini yig‘ing» (s13)

- s13.say — Mana, eng qiziq joyi keldi: endi butun kodni o‘zingiz yig‘asiz! Birinchi qatorni men qo‘yib qo‘ydim, qolgani sizdan. Qatorchani bossangiz, o‘zi keyingi bo‘sh joyga borib tushadi.
- s13.sayMove — Tartibni adashtirib qo‘ysangiz, qo‘rqmang: qatorchalarni o‘qchalar bilan tepaga yoki pastga suring. Hammasi tayyor bo‘lsa, «Tekshirish»ni bosing.
- s13.rules.html — DOCTYPE qatoridan keyin darrov ochuvchi html tegi keladi. Yopuvchi html tegi esa eng oxirida turadi.
- s13.rules.pair — Yopuvchi teg doim o‘zining ochuvchi tegidan keyin keladi.
- s13.rules.order — Oldin head keladi, keyin body.
- s13.rules.headClose — Oldin head tegini yoping, keyin body tegini oching.
- s13.rules.title — title head ichida turishi kerak.
- s13.rules.text — Salom body ichida turishi kerak.
- s13.hints[0] — DOCTYPE qatoridan keyin qaysi teg keladi, eng oxirida-chi?
- s13.hints[1] — html ichida oldin title bilan head, keyin salom bilan body keladi.
- s13.hints[2] — Belgilangan qatorlardan birini bosing, keyin boshqasini. Ular joyini almashtiradi.
- s13.ok — Qoyil! Kod to‘g‘ri yig‘ildi. Nom head ichida, salom body ichida.

## 14-ekran · «Matn yorliqqa chiqib ketdi» (s14)

- s14.say — Voy, nimadir buzilib qolibdi! Sahifadagi hamma matn yorliqqa chiqib ketibdi, oyna bo‘m-bo‘sh. title qatorida bitta teg yetishmayapti.
- s14.sayHow — Keling, birga tuzatamiz! Kerakli tegni bo‘sh joyga olib boring yoki ustiga bir bosing.
- s14.why.<title> — Yo‘q, bu ochuvchi teg-ku! title allaqachon ochilgan, endi uni yopadigan teg kerak.
- s14.why.</head> — Shoshilmang! head keyinroq yopiladi. Oldin nom tugashi kerak, ya’ni title tegini yopamiz.
- s14.hints[0] — Qaysi teg ochilgan-u, lekin yopilmagan?
- s14.hints[1] — title ochilgan. Uni yopadigan teg kerak.
- s14.hints[2] — Qiya chiziqli title tegini bo‘sh joyga qo‘ying.
- s14.ok — Mana, tuzaldi! Nom yorliqda, salom oynada. Yopuvchi title tegi brauzerga nom qayerda tugashini ko‘rsatib berdi.

## 15-ekran · Yakuniy tekshiruv «Yorliq va oyna» (q1)

So‘zlar: «Robotlar», «Salom!».

- q1.say — Endi o‘zingizni sinab ko‘ring! Mana yangi sahifa. Yorliqda «Robotlar», oynada esa «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga olib boring.
- q1.toWin — Qarang: «{w}» oynaga tushib qoldi. body tegidagi matn oynada chiqadi, yorliq uchun esa title kerak.
- q1.toTab — Qarang: «{w}» yorliqqa chiqib qoldi. title tegidagi matn yorliqda chiqadi, oyna uchun esa body kerak.
- q1.pickFirst (faqat yoziladi) — Oldin so‘zni tanlang.
- q1.hints[0] — Yorliqdagi matn qaysi tegga yoziladi?
- q1.hints[1] — Yorliq uchun title, oyna uchun body.
- q1.hints[2] — Yonib turgan so‘zni yonib turgan joyga olib boring.
- q1.ok — Juda zo‘r! «Robotlar» title tegida, shuning uchun yorliqda. «Salom!» body tegida, shuning uchun oynada.

## 16-ekran · Yakuniy tekshiruv «</title> nimaga kerak?» (q2)

Javob variantlari:
- opts[0] — Nomni oynada ko‘rsatadi
- opts[1] (to‘g‘ri) — Nom qayerda tugashini ko‘rsatadi
- opts[2] — Sahifa qayerda tugashini ko‘rsatadi

- q2.say — Va oxirgi savol. Sizningcha, yopuvchi title tegi nimaga kerak? Javobni tanlang.
- q2.opts[0].why — Unday emas: yopuvchi teg sahifada ko‘rinmaydi, oynaga ham hech narsa chiqarmaydi.
- q2.opts[2].why — Unday emas: sahifa qayerda tugashini yopuvchi html tegi ko‘rsatadi. Yopuvchi title tegi faqat title tegini yopadi.
- q2.hints[0] — Matn yorliqqa chiqib ketgan sahifa esingizdami? U yerda qaysi teg yetishmagan edi?
- q2.hints[1] — Qiya chiziqli teg o‘z qismini yopadi. title ichida nima turadi?
- q2.hints[2] — Yopuvchi title tegi sahifa nomini tugatadi.
- q2.ok — Xuddi shunday! U nom qayerda tugashini ko‘rsatadi. U bo‘lmasa, sahifadagi hamma matn yorliqqa chiqib ketadi.

## 17-ekran · Xulosa (s15)

Lavha: «Keyingi darsda sizlar bilan veb-sahifamizga katta sarlavha va xatboshilar qo‘shishni o‘rganamiz»

- s15.say[0] — Mana, sizning birinchi sahifangiz!
- s15.say[1] — Esingizdami? Teg — bu burchakli qavs ichidagi so‘z. Brauzer uni ko‘rsatmaydi, faqat o‘qiydi.
- s15.say[2] — html butun sahifani o‘rab turadi: head ham, body ham uning ichida.
- s15.say[3] — head sahifa haqidagi ma’lumotlarni saqlaydi.
- s15.say[4] — title head ichida yashaydi. Unga sahifa nomi yoziladi, brauzer esa shu nomni yorliqda ko‘rsatadi.
- s15.say[5] — Oynada nima ko‘rinsa, hammasi body ichida turadi.
- s15.say[6] — Barakalla! Birinchi HTML sahifangiz tayyor. Endi siz haqiqiy veb-dasturchi bo‘lishga bir qadam yaqinlashdingiz!
