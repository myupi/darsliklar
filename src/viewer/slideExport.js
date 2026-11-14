// Слайд «Amaliy vazifa» режима «Компилятор» → PNG и PDF 1920×1080 (заказчик, 14.11.2026: «2 кнопочки: png и pdf»).
// Без библиотек: слайд рисуется на canvas по живой раскладке (позиции слов — из Range, шрифты — из стилей),
// страница-результат из iframe — картинкой через SVG foreignObject (её картинки встраиваются data-URL),
// PDF — одна страница 960×540 pt с этой картинкой (JPEG, DCTDecode).
export const OUT_W = 1920;
export const OUT_H = 1080;

const loadImg = (src) => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
const blobToDataUrl = (b) => new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Страница из iframe — картинкой нужного размера (в пикселях холста).
async function pageImage(frame, outW, outH) {
  const doc = frame.contentDocument;
  const clone = doc.documentElement.cloneNode(true);
  clone.removeAttribute('style');
  const imgs = [...clone.querySelectorAll('img')];
  await Promise.all(imgs.map(async (im) => {
    try {
      const src = new URL(im.getAttribute('src'), doc.baseURI).href;
      im.setAttribute('src', await blobToDataUrl(await (await fetch(src)).blob()));
    } catch (e) { /* картинки нет — останется alt */ }
  }));
  clone.querySelectorAll('script').forEach((s) => s.remove());
  const w = frame.offsetWidth, h = frame.offsetHeight;   // размер страницы до уменьшения
  const xhtml = new XMLSerializer().serializeToString(clone);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + outW + '" height="' + outH + '" viewBox="0 0 ' + w + ' ' + h + '">' +
    '<foreignObject x="0" y="0" width="' + w + '" height="' + h + '">' + xhtml + '</foreignObject></svg>';
  return loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
}

export async function renderSlide(slide) {
  if (document.fonts) await Promise.all(['500', '600', '700'].map((w) => document.fonts.load(w + ' 20px Poppins').catch(() => null)));
  const S = slide.getBoundingClientRect();
  const k = OUT_W / S.width, cq = S.width / 100;
  const canvas = document.createElement('canvas');
  canvas.width = OUT_W; canvas.height = OUT_H;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(k, 0, 0, k, 0, 0);   // дальше — в CSS-пикселях слайда
  const R = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height }; };
  const css = (el) => getComputedStyle(el);

  // Фон и серый круг.
  ctx.fillStyle = css(slide).backgroundColor; ctx.fillRect(0, 0, S.width, S.height);
  const circle = slide.querySelector('.cmp-slide-circle');
  if (circle) { const c = R(circle); ctx.fillStyle = css(circle).backgroundColor; ctx.beginPath(); ctx.arc(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, 0, Math.PI * 2); ctx.fill(); }
  // Персонаж.
  const hero = slide.querySelector('.cmp-slide-hero');
  if (hero && hero.complete && hero.naturalWidth) { const h = R(hero); ctx.drawImage(hero, h.x, h.y, h.w, h.h); }
  // Черта у «HTML» и точка у «JUNIOR».
  const ink = '#1B1F2E';
  const top = slide.querySelector('.cmp-slide-top');
  if (top) { const t = R(top); ctx.fillStyle = ink; ctx.fillRect(4.1 * cq, t.y + t.h / 2 - 0.075 * cq, 2.7 * cq, 0.15 * cq); }
  const jr = slide.querySelector('.cmp-slide-junior');
  if (jr) { const j = R(jr); ctx.fillStyle = '#FF613B'; ctx.beginPath(); ctx.arc(86.3 * cq + 0.625 * cq, j.y + j.h / 2, 0.625 * cq, 0, Math.PI * 2); ctx.fill(); }
  // Белая карточка с тенью.
  const card = slide.querySelector('.cmp-slide-card');
  if (card) {
    const c = R(card);
    ctx.save(); ctx.shadowColor = 'rgba(27, 31, 46, .08)'; ctx.shadowBlur = 1.6 * cq; ctx.shadowOffsetY = 0.4 * cq;
    ctx.fillStyle = '#fff'; roundRect(ctx, c.x, c.y, c.w, c.h, 1.4 * cq); ctx.fill(); ctx.restore();
  }
  // Рамка с результатом.
  const res = slide.querySelector('.cmp-slide-res');
  const frame = slide.querySelector('.cmp-slide-view iframe');
  const view = slide.querySelector('.cmp-slide-view');
  if (res) {
    const r = R(res), bw = 0.2 * cq, rad = 0.5 * cq;
    ctx.fillStyle = '#fff'; roundRect(ctx, r.x, r.y, r.w, r.h, rad); ctx.fill();
    if (frame && view) {
      try {
        const v = R(view);
        const fr = frame.getBoundingClientRect();   // уже уменьшенная страница
        const dw = Math.round(fr.width * k), dh = Math.round(fr.height * k);
        const img = await pageImage(frame, dw, dh);
        ctx.save(); ctx.beginPath(); ctx.rect(v.x, v.y, v.w, v.h); ctx.clip();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, Math.round((fr.left - S.left) * k), Math.round((fr.top - S.top) * k), dw, dh);
        ctx.restore();
      } catch (e) { /* без страницы — пустая рамка */ }
    }
    ctx.strokeStyle = css(res).borderTopColor; ctx.lineWidth = bw;
    roundRect(ctx, r.x + bw / 2, r.y + bw / 2, r.w - bw, r.h - bw, rad); ctx.stroke();
  }
  // Тексты: каждое слово — там же, где на экране, своим шрифтом и цветом.
  const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const cs = css(n.parentElement);
    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    ctx.fillStyle = cs.color; ctx.textBaseline = 'alphabetic';
    for (const m of n.data.matchAll(/\S+/g)) {
      range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const asc = ctx.measureText(m[0]).fontBoundingBoxAscent;
      ctx.fillText(m[0], r.left - S.left, r.top - S.top + asc);
    }
  }
  // Номера пунктов (::marker в DOM нет).
  slide.querySelectorAll('.cmp-slide-list > li').forEach((li, i) => {
    const cs = css(li);
    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    ctx.fillStyle = cs.color; ctx.textAlign = 'right';
    range.selectNodeContents(li);
    const first = range.getClientRects()[0];
    if (first) ctx.fillText((i + 1) + '.', R(li).x - parseFloat(cs.fontSize) * 0.35, first.top - S.top + ctx.measureText('1').fontBoundingBoxAscent);
    ctx.textAlign = 'left';
  });
  return canvas;
}

// Одностраничный PDF с JPEG во всю страницу.
export function pdfFromJpeg(jpeg, w, h, pw = 960, ph = 540) {
  const enc = new TextEncoder();
  const chunks = []; const offs = []; let len = 0;
  const push = (x) => { const b = typeof x === 'string' ? enc.encode(x) : x; chunks.push(b); len += b.length; };
  const obj = (n, body) => { offs[n] = len; push(n + ' 0 obj\n'); body(); push('\nendobj\n'); };
  push('%PDF-1.4\n');
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
  obj(3, () => push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'));
  obj(4, () => { push('<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n'); push(jpeg); push('\nendstream'); });
  const content = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q';
  obj(5, () => push('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream'));
  const xref = len;
  push('xref\n0 6\n0000000000 65535 f \n' + [1, 2, 3, 4, 5].map((n) => String(offs[n]).padStart(10, '0') + ' 00000 n \n').join(''));
  push('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
  return new Blob(chunks, { type: 'application/pdf' });
}

export function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export async function exportSlide(slide, kind, name) {
  const canvas = await renderSlide(slide);
  if (kind === 'png') {
    const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
    download(blob, name + '.png');
  } else {
    const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.95));
    const jpeg = new Uint8Array(await blob.arrayBuffer());
    download(pdfFromJpeg(jpeg, canvas.width, canvas.height), name + '.pdf');
  }
}
