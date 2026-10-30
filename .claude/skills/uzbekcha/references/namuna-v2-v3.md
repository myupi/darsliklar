# Как заказчик переписал узбекские реплики урока 1: v2 → v3

Источник: `urok-01-repliki-v2.md` (v2, книжнее) и `urok-01-uz.md` (v3, «so‘zlashuv uslubi» — разговорный стиль), оба от заказчика, 28.10.2026. Здесь все реплики, которые в v3 изменились (115 из 133). **Образец — правый столбец.** Левый — как писать не надо: правильно, но по-книжному и сухо.

Что меняется чаще всего — сводка в `uslub.md`, раздел «Замены v2 → v3».

| Ключ | v2 — было | v3 — стало (образец) |
|---|---|---|
| `s1.say` | Salom! Men Kodi. Qarang, mana bu veb-sahifa. | Hammaga salom! Mening ismim Kodi. Hozir sizlarga bitta veb-sahifani ko‘rsataman. Nimaga deysizmi? Buni dars davomida bilib olasiz! |
| `s1.sayTab` | Tepadagi kichkina qismni ko‘ryapsizmi? Bu yorliq. Unda sahifa nomi yozilgan. | Tepadagi mana bu kichkina joyni ko‘ryapsizmi? Bu yorliq deyiladi. Unga sahifaning nomi yozib qo‘yilgan. |
| `s1.sayGo` | Agar sahifa odam bo‘lganida, qanday bo‘lardi? Keling, tekshiramiz! «Aylantirish» tugmasini bosing. | Endi bir narsani tasavvur qiling: shu sahifa odam bo‘lib qolsa, qanaqa bo‘larkin? Qani, ko‘ramiz! «Aylantirish» tugmasini bosing. |
| `s1.magic` | Voy! Sahifa jonlanib, odamchaga aylandi! | Voy-voy, qarang! Sahifa jonlanib, odamchaga aylanib qoldi! |
| `s1.magicHead` | Qarang: sahifa nomi uning boshiga kirib oldi. Boshda sahifa haqidagi ma’lumot saqlanadi. | Sezdingizmi? Sahifaning nomi endi uning boshida turibdi. Chunki boshda sahifa haqidagi ma’lumotlar saqlanadi. |
| `s1.magicWin` | Tanasi esa sahifada ko‘rinadigan narsalardan yig‘ilgan: matn, rasm va tugmadan. | Tanasi-chi? U sahifada ko‘rinib turgan narsalardan yasalgan: matndan, rasmdan va tugmadan. |
| `s1.done` | Bugun o‘z sahifangizni yasaysiz: unga nom qo‘yasiz va salom yozasiz. Lekin avval kod qanday ko‘rinishini ko‘ramiz. | Bugun siz ham o‘zingizning sahifangizni yasaysiz: unga nom qo‘yasiz, salom ham yozasiz. Lekin oldin kod degani qanaqa bo‘lishini ko‘rib olamiz. |
| `rd.say` | Bu kod. Brauzer sahifani shu koddan yig‘adi. Qanday o‘qishini kuzating! | Mana, bu kod. Brauzer sahifani aynan shundan yig‘adi. Qani, qanday o‘qishini kuzatib turing! |
| `rd.read1` | Sezdingizmi? Brauzer kodni xuddi siz kitob o‘qigandek o‘qiydi. | Sezdingizmi? Brauzer kodni xuddi biz kitob o‘qigandek o‘qiyapti. |
| `rd.read2` | Har bir qatorni chapdan o‘ngga o‘qiydi. | Har bir qatorni chapdan o‘ngga qarab o‘qiydi. |
| `rd.read3` | Qatorlarni esa yuqoridan pastga, birin-ketin. | Qatorlarni esa tepadan pastga, bittalab o‘qiydi. |
| `rd.done` | Qatorma-qator o‘qidi va sahifa tayyor! Endi bu kodda nima yozilganini bilib olamiz. | Brauzer kodni oxirigacha o‘qib chiqdi — mana, sahifa ham tayyor! Endi bu kodda nimalar yozilganini birga ko‘rib chiqamiz. |
| `s3.say` | Ramkaga qarang: unda ikkita yozuv bor. Tepadagisini bosing. | Ramkaga bir qarang-chi: unda ikkita yozuv bor. Tepadagisini bosib ko‘ring. |
| `s3.br` | < va > belgilarini ko‘ryapsizmi? Bular burchakli qavslar. | Mana bu < va > belgilarini ko‘ryapsizmi? Ularni burchakli qavslar deyishadi. |
| `s3.nm` | Ularning orasida html so‘zi turibdi. Bu tegning nomi. | Ularning o‘rtasida html degan so‘z turibdi. Bu tegning nomi. |
| `s3.sayTag` | Qavslar va nom birgalikda teg deyiladi. Teg brauzer uchun ko‘rsatma. Brauzer tegni sahifada ko‘rsatmaydi, faqat o‘qiydi. | Mana shu yozuv butunligicha teg deyiladi. Brauzer tegni sahifada ko‘rsatmaydi, faqat o‘qiydi. |
| `s3.top` | Bu ochuvchi html tegi. U brauzerga: «Sahifa shu yerdan boshlanadi», deydi. Endi pastdagi yozuvni bosing. | Bunisi ochuvchi html tegi. U brauzerga «Sahifa shu yerdan boshlanadi», deb aytadi. Endi pastdagisini bosing. |
| `s3.bottom` | Farqini ko‘ryapsizmi? Birinchi qavsdan keyin darhol qiya chiziq turibdi. Bu yopuvchi html tegi. U: «Sahifa shu yerda tugaydi», deydi. | Farqini sezdingizmi? Bunda birinchi qavsdan keyin qiya chiziq bor. Bu yopuvchi html tegi. U «Sahifa shu yerda tugaydi», deydi. |
| `s3.pair` | Ochuvchi teg — boshlanish, yopuvchi teg — tugash. Sahifadagi hamma narsa ularning orasida turadi. | Demak, ochuvchi teg boshlaydi, yopuvchi teg tugatadi. Sahifadagi hamma narsa shu ikkalasining o‘rtasida turadi. |
| `s3.done` | Kichkina sir: ramkani tushunarli bo‘lishi uchun chizdik. Haqiqiy brauzerda u yo‘q. | Sizga bir sir aytaymi? Bu ramkani tushunarli bo‘lsin deb o‘zimiz chizdik. Haqiqiy brauzerda uni ko‘rmaysiz. |
| `s4.say` | Voy, ramkaning pastki cheti yo‘qolibdi! Kodda yopuvchi html tegi yetishmayapti. Uni bo‘sh qatorga yozing va «Tekshirish»ni bosing. | Voy, ramkaning pastki cheti qayoqqa ketdi? Kodda yopuvchi html tegi yo‘q ekan. Uni bo‘sh qatorga yozing-da, «Tekshirish»ni bosing. |
| `s4.msgs.needSlash` | Deyarli! Bu ochuvchi teg. Yopuvchi tegda html so‘zidan oldin qiya chiziq turadi. | Oz qoldi! Bu ochuvchi teg-ku. Yopuvchi tegda html so‘zidan oldin qiya chiziq bo‘ladi. |
| `s4.msgs.needLt` | Boshi yetishmayapti: teg «<» qavsi bilan boshlanadi. | Boshi tushib qolibdi: teg doim «<» qavsi bilan boshlanadi. |
| `s4.msgs.needGt` | Oxiri yetishmayapti: teg «>» qavsi bilan tugaydi. | Oxiri tushib qolibdi: teg doim «>» qavsi bilan tugaydi. |
| `s4.msgs.wrongName` | Teg ichidagi so‘zga qarang: bu yerda html kerak. | Teg ichidagi so‘zga qarang-chi: bu yerga html yozilishi kerak. |
| `s4.msgs.generic` | Nimadir aralashib ketdi. Tepadagi teg bilan solishtiring: qavs, qiya chiziq, html, qavs. | Nimadir chalkashib ketdi. Tepadagi teg bilan solishtirib ko‘ring: qavs, qiya chiziq, html, qavs. |
| `s4.hints[1]` | Yopuvchi teg xuddi o‘sha teg, faqat qiya chiziq bilan. | Yopuvchi teg ham xuddi o‘sha, faqat qiya chizig‘i bor. |
| `s4.hints[2]` | Tugmalarni ketma-ket bosing: qavs, qiya chiziq, html va yana qavs. | Tugmalarni ketma-ket bosing: qavs, qiya chiziq, html, keyin yana qavs. |
| `s4.ok` | Zo‘r! Ramka yopildi. Endi butun sahifa ikki html tegi orasida. | Zo‘r! Ramka yopildi. Endi butun sahifa ikkita html tegining o‘rtasida. |
| `s5.say` | Endi o‘zingiz! Ramkaga ikkita teg kerak: tepaga va pastga. Ehtiyot bo‘ling: pastdagi uchta tegdan bittasi ortiqcha. | Endi navbat sizga! Ramkaga ikkita teg kerak: biri tepaga, biri pastga. Faqat ehtiyot bo‘ling: pastdagi uchta tegdan bittasi ortiqcha. |
| `s5.sayHow` | Tegni joyiga torting. Yoki avval tegni, keyin joyni bosing. | Tegni ushlab, joyiga olib boring. Yoki oldin tegni, keyin joyni bosing. |
| `s5.top` | Deyarli! Tepada sahifa boshlanadi. Bu yerga qiya chiziqsiz ochuvchi teg kerak. | Oz qoldi! Tepada sahifa boshlanadi, shuning uchun bu yerga qiya chiziqsiz ochuvchi teg kerak. |
| `s5.bottom` | Hechqisi yo‘q! Pastda sahifa tugaydi. Bu yerga qiya chiziqli yopuvchi teg kerak. | Hechqisi yo‘q! Pastda sahifa tugaydi, bu yerga qiya chiziqli yopuvchi teg kerak. |
| `s5.back` | Mana tuzoq! Bu chiziq teskari tomonga egilgan. Yopuvchi tegda chiziq o‘ngga egilgan bo‘ladi. | Ana, tuzoq shu yerda ekan! Bu chiziq teskari tomonga qiyshaygan. Yopuvchi tegda chiziq o‘ngga qarab qiyshaygan bo‘ladi. |
| `s5.pickFirst` | Avval tegni tanlang. | Oldin tegni tanlang. |
| `s5.hints[0]` | Qaysi teg sahifani boshlaydi, qaysi biri tugatadi? | Qaysi teg sahifani boshlaydi-yu, qaysi biri tugatadi? |
| `s5.hints[2]` | Yonib turgan tegni yonib turgan joyga torting. | Yonib turgan tegni yonib turgan joyga olib boring. |
| `s5.ok` | Ajoyib, ikkala teg joyida! Teskari chiziqli teg esa ortiqcha edi. | Barakalla, ikkala teg ham joyida! Teskari chiziqli teg esa ortiqcha edi. |
| `s6.say` | html ichida ikki qism bor. Birinchisi head deb ataladi, inglizchada «bosh» degani. Odamchaning boshi aynan head. | html ichida ikkita qism yashaydi. Birinchisining nomi head, inglizchada «bosh» degani. Odamchaning boshi xuddi shu head. |
| `s6.sayInfo` | head ichida sahifa haqidagi ma’lumot bor. Brauzer oynasida, mana shu pastdagi katta qismda, u ko‘rinmaydi. Boshni bosing va ichida nima borligini ko‘ring. | head ichida sahifa haqidagi ma’lumotlar turadi. Pastdagi katta joy — brauzer oynasiga qarang: u yerda ular ko‘rinmaydi. Qani, boshni bosib, ichida nima borligini ko‘ring. |
| `s6.opened` | Mana ichida nima bor: sahifa nomi! U title tegiga yoziladi. Nom yozilgan qog‘ozchani bosing. | Ana, ichida nima ekan: sahifaning nomi! U title tegining ichiga yoziladi. Endi nom yozilgan qog‘ozchani bosing. |
| `s6.flew` | Nom yorliqqa uchib o‘tdi! Brauzer title tegidagi matnni aynan shu yerda, tepada ko‘rsatadi. Oynada esa u yo‘q. | Nom uchib, yorliqqa o‘tib oldi! Brauzer title tegidagi matnni mana shu yerda, tepada ko‘rsatadi. Oynada esa u yo‘q. |
| `s6.inHead` | Endi kodga qarang: tepada ochuvchi head tegi, pastda yopuvchi head tegi. | Endi kodga qarang: tepada ochuvchi head tegi, pastda yopuvchi head tegi turibdi. |
| `s6.done` | title qatori ularning orasida turibdi. Demak, title head ichida joylashgan. | title qatori ularning o‘rtasida. Demak, title head ichida yashaydi. |
| `s7.say` | Endi eng qiziq joyi: sahifangizga nom o‘ylab toping! Uni title teglari orasiga yozing, masalan, «Futbol». Nom darhol yorliqda paydo bo‘ladi. Keyin «Tayyor»ni bosing. | Endi eng qiziq joyiga keldik: sahifangizga o‘zingiz nom qo‘ying! Uni title teglarining o‘rtasiga yozing, masalan, «Futbol». Nom shu zahoti yorliqda chiqadi. Keyin «Tayyor»ni bosing. |
| `s7.hints[1]` | Nom ikki title tegi orasiga yoziladi. | Nom ikkita title tegining o‘rtasiga yoziladi. |
| `s7.hints[2]` | Ikki title tegi orasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing. | Ikkita title tegi o‘rtasidagi bo‘sh joyni bosing, nom yozing va «Tayyor»ni bosing. |
| `s7.ok` | Zo‘r! Endi yorliqda sahifangiz nomi turibdi. | Zo‘r! Endi yorliqda sahifangizning nomi turibdi. |
| `s9.say` | Nom tayyor. Endi sahifaning o‘zini to‘ldiramiz! html ichidagi ikkinchi qism body, inglizchada «tana» degani. Qarang-chi, odamchaning tanasidan nima uchib chiqarkin! | Nom tayyor. Endi sahifaning o‘zini to‘ldiramiz! html ichidagi ikkinchi qismning nomi body, inglizchada «tana» degani. Qani, odamchaning tanasidan nima uchib chiqarkin? |
| `s9.out` | Ana! Matn, rasm va tugma tanadan chiqib, to‘g‘ri oynaga tushdi. | Voy, qarang! Matn, rasm, tugma — hammasi tanadan uchib chiqib, to‘ppa-to‘g‘ri oynaga tushdi. |
| `s9.done` | Oynada ko‘rinadigan hamma narsa — matn, rasm, tugmalar — body ichida joylashadi. Bugun body ichiga matn yozamiz, rasm va tugmalarni esa keyingi darslarda qo‘shamiz. | Oynada nima ko‘rinsa — matnmi, rasmmi, tugmami — hammasi body ichida turadi. Bugun body ichiga matn yozamiz, rasm bilan tugmani keyingi darslarda qo‘shamiz. |
| `s10.say` | Endi body teglari orasiga salom yozing. Masalan, «Salom!». | Endi body teglarining o‘rtasiga «Salom» so‘zini yozing. |
| `s10.sayWin` | U darhol oynada paydo bo‘ladi. Keyin «Tayyor»ni bosing. | U shu zahoti oynada paydo bo‘ladi. Keyin «Tayyor»ni bosing. |
| `s10.hints[1]` | Matn ikki body tegi orasiga yoziladi. | Matn ikkita body tegining o‘rtasiga yoziladi. |
| `s10.hints[2]` | Ikki body tegi orasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing. | Ikkita body tegi o‘rtasidagi bo‘sh joyni bosing, matn yozing va «Tayyor»ni bosing. |
| `s8.say` | Endi o‘yin: siz brauzersiz! Kod qatoriga qarang va so‘z qayerda chiqishini toping: yorliqdami yoki oynadami? | Endi bir o‘yin o‘ynaymiz: siz brauzersiz! Kod qatoriga qarab, so‘z qayerda chiqishini toping: yorliqdami yoki oynada? |
| `s8.askTitle` | title tegida «{w}» deb yozilgan. U qayerda chiqadi? | title tegida «{w}» deb yozilgan. Qani, u qayerda chiqadi? |
| `s8.askBody` | Endi body tegida «{w}» deb yozilgan. U qayerda chiqadi? | Endi body tegida «{w}» deb yozilgan. Bu safar qayerda chiqadi? |
| `s8.ok.title` | To‘g‘ri! title tegidagi so‘z yorliqqa chiqdi. | To‘ppa-to‘g‘ri! title tegidagi so‘z yorliqqa chiqdi. |
| `s8.miss.title` | Hechqisi yo‘q! So‘z title tegida turibdi, shuning uchun yorliqqa chiqdi. | Hechqisi yo‘q! So‘z title tegida turgan edi, shuning uchun yorliqqa chiqdi. |
| `s8.miss.body` | Deyarli! So‘z body tegida turibdi, shuning uchun oynaga chiqdi. | Bu safar adashdingiz! So‘z body tegida turgan edi, shuning uchun oynaga chiqdi. |
| `s8.more` | Keling, yana bitta misol. | Keling, yana bittasini ko‘ramiz. |
| `s8.hints[0]` | So‘z qaysi teglar orasida turibdi? | So‘z qaysi teglarning o‘rtasida turibdi? |
| `s8.done` | Ana, tamom! Esda tuting: title tegidagi matn yorliqda, body tegidagi matn oynada. | Mana, o‘yin tugadi! Esingizda bo‘lsin: title tegidagi matn yorliqda, body tegidagi matn oynada chiqadi. |
| `s11.say` | Keling, tartib o‘rnatamiz! Har bir bo‘lakni qayerga qo‘yamiz: head ichigami yoki body ichigami? Uni torting. Yoki avval bo‘lakni, keyin kerakli qismni bosing. | Keling, endi hammasini joy-joyiga qo‘yamiz! Har bir bo‘lakning o‘z uyi bor. Qani, toping-chi: uyi head ichidami yoki body ichidami? Bo‘lakni olib boring yoki oldin bo‘lakni, keyin kerakli qismni bosing. |
| `s11.items[0].why` | Qarang: bu title qatori. title esa head ichida joylashadi. Demak, uning joyi head. | Qarang: bu title qatori-ku. title esa head ichida yashaydi, demak, uning joyi head. |
| `s11.items[1].why` | Deyarli! Salomingiz oynada ko‘rinadi. Demak, u body ichida. | Yo‘q, bunisining uyi boshqa joyda! Salomingiz oynada ko‘rinadi-ku, demak, u body ichida yashaydi. |
| `s11.items[2].why` | Hechqisi yo‘q! Rasmni oynada ko‘ramiz. Demak, u body ichida. | Hechqisi yo‘q! Rasmni oynada ko‘ramiz-ku, demak, u body ichida. |
| `s11.items[3].why` | O‘ylab ko‘ring: tugmani qayerda bosamiz? Oynada! Demak, u body ichida. | O‘ylab ko‘ring-chi: tugmani qayerda bosamiz? Oynada! Demak, u body ichida. |
| `s11.pickFirst` | Avval bo‘lakni tanlang. | Oldin bo‘lakni tanlang. |
| `s11.hints[1]` | Oynada ko‘rinadigan hamma narsa body ichida. title qatori head ichida. | Oynada ko‘rinadigan hamma narsa body ichida. title qatori esa head ichida. |
| `s11.hints[2]` | Yonib turgan bo‘lakni yonib turgan joyga torting. | Yonib turgan bo‘lakni yonib turgan joyga olib boring. |
| `s11.ok` | Hammasi joy-joyida! title head ichida, salom, rasm va tugma body ichida. | Hammasi joy-joyida! title head ichida, salom, rasm va tugma esa body ichida. |
| `s12.say` | Endi siz hamma qismlarni bilasiz. Keling, brauzer kodingizni qanday o‘qishini yana bir bor ko‘ramiz va har bir qatorni tushunib olamiz. | Endi siz hamma qismlarni bilasiz. Keling, brauzer sizning kodingizni qanday o‘qishini yana bir marta ko‘ramiz va har bir qatorni tushunib olamiz. |
| `s12.parts.doc` | Birinchi qator — <!DOCTYPE html>. U brauzerga: «Bu HTML sahifa», deydi. Uning jufti yo‘q, uni yopish shart emas. | Birinchi qator — <!DOCTYPE html>. U brauzerga «Bu HTML sahifa», deb aytadi. Uning jufti yo‘q, shuning uchun uni yopish shart emas. |
| `s12.parts.html` | html tegi butun sahifani quchoqlab turadi. Uning ichida head va body bor. | html tegi butun sahifani quchoqlab turadi. head ham, body ham uning ichida. |
| `s12.parts.head` | Bu head, sahifaning «boshi». Bu yerda sahifa haqidagi ma’lumot saqlanadi. | Mana bu head, sahifaning «boshi». Bu yerda sahifa haqidagi ma’lumotlar turadi. |
| `s12.parts.title` | head ichida title turadi, unda sahifa nomi bor. Brauzer bu nomni yorliqda ko‘rsatadi. | head ichida title bor, unda sahifaning nomi yozilgan. Brauzer shu nomni yorliqda ko‘rsatadi. |
| `s12.order5` | Muhim joyi: avval head yopiladi, shundan keyingina body ochiladi. Ular biri ichida emas, ketma-ket turadi. | Mana bu joyi muhim: oldin head yopiladi, keyin body ochiladi. Ular bir-birining ichida emas, ketma-ket turadi. |
| `s12.parts.body` | Bu body, sahifaning «tanasi». Bu yerda oynada ko‘rinadigan hamma narsa bor. | Mana bu body, sahifaning «tanasi». Oynada ko‘rinadigan hamma narsa shu yerda. |
| `s12.tapSay` | Yana eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi qismni bosing. | Yana bir marta eshitmoqchimisiz? Kod qatorini yoki o‘ngdagi qismni bosing, men aytib beraman. |
| `s13.say` | Endi eng katta sinov: butun kodni o‘zingiz yig‘ing! Birinchi qator joyida turibdi. Qatorchani bossangiz, u navbatdagi bo‘sh qatorga tushadi. | Mana, eng qiziq joyi keldi: endi butun kodni o‘zingiz yig‘asiz! Birinchi qatorni men qo‘yib qo‘ydim, qolgani sizdan. Qatorchani bossangiz, o‘zi keyingi bo‘sh joyga borib tushadi. |
| `s13.sayMove` | Tartibda adashsangiz, hechqisi yo‘q: qatorchalarni o‘qchalar bilan yuqoriga yoki pastga suring. Hammasi tayyor bo‘lsa, «Tekshirish»ni bosing. | Tartibni adashtirib qo‘ysangiz, qo‘rqmang: qatorchalarni o‘qchalar bilan tepaga yoki pastga suring. Hammasi tayyor bo‘lsa, «Tekshirish»ni bosing. |
| `s13.rules.html` | DOCTYPE qatoridan keyin darhol ochuvchi html tegi keladi. Yopuvchi html tegi esa eng oxirida turadi. | DOCTYPE qatoridan keyin darrov ochuvchi html tegi keladi. Yopuvchi html tegi esa eng oxirida turadi. |
| `s13.rules.pair` | Yopuvchi teg o‘z ochuvchi tegidan keyin turadi. | Yopuvchi teg doim o‘zining ochuvchi tegidan keyin keladi. |
| `s13.rules.order` | Avval head keladi, keyin body. | Oldin head keladi, keyin body. |
| `s13.rules.headClose` | Avval head tegini yoping, keyin body tegini oching. | Oldin head tegini yoping, keyin body tegini oching. |
| `s13.hints[0]` | DOCTYPE qatoridan keyin qaysi teg keladi, eng oxirida qaysi biri turadi? | DOCTYPE qatoridan keyin qaysi teg keladi, eng oxirida-chi? |
| `s13.hints[1]` | html ichida avval title bilan head, keyin salom bilan body keladi. | html ichida oldin title bilan head, keyin salom bilan body keladi. |
| `s13.hints[2]` | Belgilangan qatorlardan birini bosing, keyin ikkinchisini. Ular joy almashadi. | Belgilangan qatorlardan birini bosing, keyin boshqasini. Ular joyini almashtiradi. |
| `s13.ok` | Qoyil, kod to‘g‘ri yig‘ildi! Nom head ichida, salom body ichida. | Qoyil! Kod to‘g‘ri yig‘ildi. Nom head ichida, salom body ichida. |
| `s14.say` | Voy, nimadir buzildi! Sahifaning hamma matni yorliqqa chiqib ketdi, oyna esa bo‘sh. title qatorida bitta teg yetishmayapti. | Voy, nimadir buzilib qolibdi! Sahifadagi hamma matn yorliqqa chiqib ketibdi, oyna bo‘m-bo‘sh. title qatorida bitta teg yetishmayapti. |
| `s14.sayHow` | Tuzatamizmi? Kerakli tegni bo‘sh joyga torting yoki shunchaki bosing. | Keling, birga tuzatamiz! Kerakli tegni bo‘sh joyga olib boring yoki ustiga bir bosing. |
| `s14.why.<title>` | Deyarli! Bu ochuvchi teg, title esa allaqachon ochilgan. Endi uni yopish kerak. | Yo‘q, bu ochuvchi teg-ku! title allaqachon ochilgan, endi uni yopadigan teg kerak. |
| `s14.why.</head>` | Shoshilmang! head keyinroq yopiladi. Avval nom tugashi kerak, ya’ni title tegini yopish kerak. | Shoshilmang! head keyinroq yopiladi. Oldin nom tugashi kerak, ya’ni title tegini yopamiz. |
| `s14.hints[0]` | Qaysi teg ochilgan, lekin yopilmagan? | Qaysi teg ochilgan-u, lekin yopilmagan? |
| `s14.ok` | Tuzaldi! Nom yorliqda, salom oynada. Yopuvchi title tegi brauzerga nom qayerda tugashini ko‘rsatdi. | Mana, tuzaldi! Nom yorliqda, salom oynada. Yopuvchi title tegi brauzerga nom qayerda tugashini ko‘rsatib berdi. |
| `q1.say` | Endi o‘zingizni sinab ko‘ring! Mana yangi sahifa. Yorliqda «Robotlar», oynada esa «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga torting. | Endi o‘zingizni sinab ko‘ring! Mana yangi sahifa. Yorliqda «Robotlar», oynada esa «Salom!» chiqishi kerak. Har bir so‘zni koddagi o‘z joyiga olib boring. |
| `q1.toWin` | Qarang: «{w}» oynaga tushib qoldi. body tegidagi matn oynada chiqadi. Yorliq uchun esa title kerak. | Qarang: «{w}» oynaga tushib qoldi. body tegidagi matn oynada chiqadi, yorliq uchun esa title kerak. |
| `q1.toTab` | Qarang: «{w}» yorliqqa chiqib qoldi. title tegidagi matn yorliqda chiqadi. Oyna uchun esa body kerak. | Qarang: «{w}» yorliqqa chiqib qoldi. title tegidagi matn yorliqda chiqadi, oyna uchun esa body kerak. |
| `q1.pickFirst` | Avval so‘zni tanlang. | Oldin so‘zni tanlang. |
| `q1.hints[0]` | Yorliq uchun matn qaysi tegga yoziladi? | Yorliqdagi matn qaysi tegga yoziladi? |
| `q1.hints[2]` | Yonib turgan so‘zni yonib turgan joyga torting. | Yonib turgan so‘zni yonib turgan joyga olib boring. |
| `q1.ok` | Mukammal! «Robotlar» title tegida, shuning uchun yorliqda. «Salom!» body tegida, shuning uchun oynada. | Juda zo‘r! «Robotlar» title tegida, shuning uchun yorliqda. «Salom!» body tegida, shuning uchun oynada. |
| `q2.say` | Va oxirgi savol. Nima deb o‘ylaysiz, yopuvchi title tegi nima uchun kerak? Javobni tanlang. | Va oxirgi savol. Sizningcha, yopuvchi title tegi nimaga kerak? Javobni tanlang. |
| `q2.opts[0].why` | Unday emas: yopuvchi teg sahifada ko‘rinmaydi va oynaga hech narsa chiqarmaydi. | Unday emas: yopuvchi teg sahifada ko‘rinmaydi, oynaga ham hech narsa chiqarmaydi. |
| `q2.opts[2].why` | Unday emas: sahifa qayerda tugashini yopuvchi html tegi ko‘rsatadi. Yopuvchi title tegi esa faqat title tegini yopadi. | Unday emas: sahifa qayerda tugashini yopuvchi html tegi ko‘rsatadi. Yopuvchi title tegi faqat title tegini yopadi. |
| `q2.hints[0]` | Matn yorliqqa chiqib ketgan sahifani eslang. Unda qaysi teg yetishmagan edi? | Matn yorliqqa chiqib ketgan sahifa esingizdami? U yerda qaysi teg yetishmagan edi? |
| `q2.ok` | Aynan! U nom qayerda tugashini ko‘rsatadi. Usiz sahifaning hamma matni yorliqqa chiqib ketadi. | Xuddi shunday! U nom qayerda tugashini ko‘rsatadi. U bo‘lmasa, sahifadagi hamma matn yorliqqa chiqib ketadi. |
| `s15.say[1]` | Esingizdami? Teg — burchakli qavslardagi so‘z. Brauzer uni ko‘rsatmaydi, faqat o‘qiydi. | Esingizdami? Teg — bu burchakli qavs ichidagi so‘z. Brauzer uni ko‘rsatmaydi, faqat o‘qiydi. |
| `s15.say[2]` | html butun sahifani o‘z ichiga oladi: head ham, body ham uning ichida. | html butun sahifani o‘rab turadi: head ham, body ham uning ichida. |
| `s15.say[3]` | head sahifa haqidagi ma’lumotni saqlaydi. | head sahifa haqidagi ma’lumotlarni saqlaydi. |
| `s15.say[4]` | title head ichida turadi. Unga sahifa nomi yoziladi, brauzer esa bu nomni yorliqda ko‘rsatadi. | title head ichida yashaydi. Unga sahifa nomi yoziladi, brauzer esa shu nomni yorliqda ko‘rsatadi. |
| `s15.say[5]` | Oynada ko‘rinadigan hamma narsa body ichida joylashadi. | Oynada nima ko‘rinsa, hammasi body ichida turadi. |
| `s15.say[6]` | Tabriklayman! Birinchi HTML sahifangiz tayyor. Endi siz haqiqiy veb-dasturchiga bir qadam yaqinlashdingiz! | Barakalla! Birinchi HTML sahifangiz tayyor. Endi siz haqiqiy veb-dasturchi bo‘lishga bir qadam yaqinlashdingiz! |
