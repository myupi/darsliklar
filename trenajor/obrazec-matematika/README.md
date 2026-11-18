# 1-sinf matematika trenajori: LMS yuklash

LMSga **faqat ikki fayl** yuklanadi:

1. `math_g01_b00_trenajor_3d_v1.jsx`: React komponenti (neon kosmik dizayn, 3D va animatsiya). Savollar bankini import qilmaydi, faqat `react` import qiladi.
2. `savollar_banki_g01_v1.json`: 400 ta `single_choice` savol, b01–b04 ning har birida 100 tadan.

## LMS bilan kontrakt

```jsx
<MathTrainer attempt lang busy onAnswer onFinished onRestart onExit />
```

- `attempt`, `lang` (`uz`/`ru`), `busy`, `onAnswer(questionId, optionId)`, `onFinished()`: majburiy. Javoblar va mukofotlarni LMS saqlaydi.
- `onRestart`: natija ekranidagi "Yana mashq qilish" tugmasi uchun. **Uzatilmasa tugma chiqmaydi.**
- `onExit`: chap yuqori burchakdagi X (chiqish) tugmasi uchun. **Uzatilmasa tugma chiqmaydi.** Argumentsiz, bitta bosishga 1 marta chaqiriladi. Natija ekranida "Yana mashq qilish" ning chap tomonida xuddi shunday "Chiqish" tugmasi ham shu callbackni chaqiradi (2026-11-05).
- Kirish oynasi ("Qanday o‘ynash kerak", "Boshlash"/"Mashq qilish") JSX ichida, faqat yangi urinishda (`answers` bo‘sh) chiqadi.
- Trenajor ramkasi ekran kengligini to‘liq oladi (100vw usuli): LMS konteyneri gorizontal markazda bo‘lishi va `overflow:hidden`/`transform` bermasligi kerak.
- Umumiy qoidalar: `LMS_TRENAJOR_JSX_JSON_QOIDALARI.md` (kirish oynasi §6, medallar va maket §7, chiqish tugmasi §8).

## Dizayn

- Qorong‘i kosmik fon, shisha panellar, neon tugmalar, robot-mascot (5 poza: `point`, `cheer`, `star`, `pencil`, `book`), 3D tanga va yulduzlar (Three.js), GSAP animatsiyasi. Figma "After" ga bog‘lanmaydi (metodist qarori, 2026-11-04).
- Kombo medallari (3, 5, 7, 9, 11 ketma-ket to‘g‘ri; 15/15 alohida): xato javobda yo‘qoladi, qayta yig‘ilsa paydo bo‘ladi. Desktopda o‘ng panelda, telefonda pastda mascot yonida.
- Telefonda (< 768 px) yon kartalar yo‘q, kontent bitta viewportga skrollsiz sig‘adi.
- 3 ta variant bitta qatorda, 4 ta 2×2.
- `prefers-reduced-motion` da animatsiya o‘chadi; WebGL bo‘lmasa CSS variant qoladi.
- RU: `ты`, jinssiz shakl; UZ: `siz`. Yangi UZ/RU matnlar draft, metodist ko‘rib chiqishi kerak.

## Yig‘ish (JSX qo‘lda tahrirlanmaydi)

Manba: `neon3d/math_trainer_3d.src.jsx`, kutubxonalar `neon3d/vendor-entry.js` (GSAP + Three.js, faqat kerakli sinflar), mascot rasmlari `assets/mascot/*.webp` (asllari `*.png`). Umumiy medal kodi: `src/components/shared/trainer-parts/medal-view.part.jsx`.

```powershell
node scripts/build-grade1-trainer-3d.mjs
node scripts/check-grade1-trainer-contract.mjs
```

Hajm ≈ 0,9 MB (vendor ≈ 608 KB, mascot ≈ 192 KB). LMS faqat `react` import qilishga ruxsat beradi, shuning uchun hammasi bitta faylga o‘raladi.

## Bloklar va darslar

| Blok | Darslar | Mavzu | Savollar |
|---|---:|---|---:|
| b01 | 1–12 | 10 gacha sanash, taqqoslash, qo‘shish va ayirish | 100 |
| b02 | 13–20 | 11–20 sonlari va o‘nlikdan o‘tib hisoblash | 100 |
| b03 | 21–27 | 21–100 sonlari va ular bilan amallar | 100 |
| b04 | 28–36 | Masalalar, shakllar, o‘lchov va jadval | 100 |

LMS savollarni **blok bo‘yicha** tanlaydi (o‘quvchida ochilgan blokning 100 ta savolidan tasodifiy 15 ta), darslar bo‘yicha emas (metodist ma’lumoti, 2026-11-04).

## Bankning kelib chiqishi

- Dastlabki 100 savolning matni, variantlari, javobi, izohi va tasviri saqlangan (`source_provenance: source_verified`). Olti ob’ektli tasvir LMS `bank_invalid_visual` tekshiruvidan o‘tishi uchun `@g01vis:` prefiksli JSON satrga aylantirilgan, JSX uni chizishdan oldin tiklaydi.
- Qolgan 300 savol dars mavzularidan hosil qilingan (`source_provenance: source_derived`). `status: Approved` LMS tanlashi uchun qo‘yilgan; bu **metodist yangi 300 savolni tasdiqlagani degani emas**. Matematik javoblar va RU/UZ maydonlar kod orqali tekshirilgan, mazmunni metodist ko‘rib chiqishi kerak.
- Dastlabki 100 savolli mustaqil demo (`math_g01_b00_hisob-100_v1.jsx`) va eski dizayn variantlari 2026-11-04 da o‘chirilgan; git tarixida bor.

## Tekshiruv

`node scripts/check-grade1-trainer-contract.mjs [jsx yo‘li]`: bank soni va taqsimoti, har bir javob, til maydonlari, tasvir sxemasi, arifmetik izohlar, 15 talik progressiv LMS oqimi. Real LMS shell ida JSX/JSON ni qayta yuklab, savol, saqlash, yakunlash, chiqish va telefon ekranlarini tekshirish talab etiladi.
