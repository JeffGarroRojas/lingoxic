// Generator QR imprimible ABA: nodo docs/make-qr-lingoxic-aba.cjs
// Requiere: npm i qrcode (ya instalada). Genera:
//   - public/icons/icon-512x512.png (falta en PWA manifest)
//   - docs/qr-lingoxic-aba.html  (single-file con QR embebido + logo central)
//   - /tmp/opencode/qr-lingoxic-aba.png (previsualización / verificación jsQR)
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const qrcode = require("qrcode");

const URL = "https://lingoxic.web.app";
const DARK = [15, 23, 42];
const ROOT = path.join(__dirname, "..");
const ICON_SRC = path.join(ROOT, "public", "icons", "icon-192x192.png");
const LOGO_SRC = path.join(ROOT, "docs", "assests", "logolingo.png");
const ICON_512 = path.join(ROOT, "public", "icons", "icon-512x512.png");
const HTML_OUT = path.join(__dirname, "qr-lingoxic-aba.html");
const PREVIEW = "/tmp/opencode/qr-lingoxic-aba.png";

// ---------- PNG codec mínimo (RGB/RGBA/gray, 8-bit) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}
function decodePNG(buf) {
  let off = 8, w, h, bd, ct;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    if (type === "IHDR") {
      w = buf.readUInt32BE(off + 8);
      h = buf.readUInt32BE(off + 12);
      bd = buf[off + 16];
      ct = buf[off + 17];
    }
    if (type === "IDAT") idat.push(buf.slice(off + 8, off + 8 + len));
    off += 12 + len;
  }
  if (bd !== 8 && bd !== 16) throw new Error("bit depth " + bd + " no soportado");
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = (ct === 6 ? 4 : ct === 2 ? 3 : 1);
  const bp = bd >> 3;
  const bpp = ch * bp;
  const stride = w * bpp;
  const scan = Buffer.from(raw);
  for (let y = 1; y < h; y++) {
    const f = scan[y * (stride + 1)];
    const rowStart = y * (stride + 1) + 1;
    const prevStart = (y - 1) * (stride + 1) + 1;
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? scan[y * (stride + 1) + 1 + i - bpp] : 0;
      const up = scan[prevStart + i];
      const upleft = i >= bpp ? scan[prevStart + i - bpp] : 0;
      let v = raw[rowStart + i];
      if (f === 1) v = (v + left) & 0xff;
      else if (f === 2) v = (v + up) & 0xff;
      else if (f === 3) v = (v + ((left + up) >> 1)) & 0xff;
      else if (f === 4) {
        const p = left + up - upleft;
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upleft);
        v = (v + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upleft)) & 0xff;
      }
      scan[y * (stride + 1) + 1 + i] = v;
    }
  }
  const rgba = Buffer.alloc(w * h * 4);
  const g = (p, i) => scan[p + i * bp];
  for (let y = 0; y < h; y++) {
    const s = y * (stride + 1) + 1;
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (ct === 6) {
        rgba[o] = g(s + x * bpp, 0);
        rgba[o + 1] = g(s + x * bpp, 1);
        rgba[o + 2] = g(s + x * bpp, 2);
        rgba[o + 3] = g(s + x * bpp, 3);
      } else if (ct === 2) {
        rgba[o] = g(s + x * bpp, 0);
        rgba[o + 1] = g(s + x * bpp, 1);
        rgba[o + 2] = g(s + x * bpp, 2);
        rgba[o + 3] = 255;
      } else {
        rgba[o] = g(s + x * bpp, 0);
        rgba[o + 1] = g(s + x * bpp, 0);
        rgba[o + 2] = g(s + x * bpp, 0);
        rgba[o + 3] = 255;
      }
    }
  }
  return { w, h, data: rgba };
}
function scale(src, sw, sh, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4);
  const sx = sw / dw, sy = sh / dh;
  for (let y = 0; y < dh; y++) {
    const fy = (y + 0.5) * sy - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const wy = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = (x + 0.5) * sx - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const wx = fx - x0;
      const o = (y * dw + x) * 4;
      for (let c = 0; c < 4; c++) {
        const a = src[(y0 * sw + x0) * 4 + c];
        const b = src[(y0 * sw + x1) * 4 + c];
        const d0 = src[(y1 * sw + x0) * 4 + c];
        const d1 = src[(y1 * sw + x1) * 4 + c];
        out[o + c] = Math.max(0, Math.min(255, Math.round((a + (b - a) * wx) + ((d0 + (d1 - d0) * wx) - (a + (b - a) * wx)) * wy)));
      }
    }
  }
  return out;
}

// ---------- Paso 1: icono 192 -> 512 (arregla icon-512 faltante del manifest) ----------
const icon = decodePNG(fs.readFileSync(ICON_SRC));
const icon512 = scale(icon.data, icon.w, icon.h, 512, 512);
fs.writeFileSync(ICON_512, encodePNG(512, 512, icon512));
console.log("OK icon-512x512.png (" + fs.statSync(ICON_512).size + " B)");

// ---------- Logo logolingo.png: análisis / crop a contenido ----------
const logo = decodePNG(fs.readFileSync(LOGO_SRC));
let lx0 = 1e9, ly0 = 1e9, lx1 = -1, ly1 = -1, logN = 0;
for (let y = 0; y < logo.h; y++) for (let x = 0; x < logo.w; x++) {
  if (logo.data[(y * logo.w + x) * 4 + 3] > 40) {
    if (x < lx0) lx0 = x; if (x > lx1) lx1 = x; if (y < ly0) ly0 = y; if (y > ly1) ly1 = y; logN++;
  }
}
console.log("LOGO opacos " + logN + " · bbox " + lx0 + "," + ly0 + " -> " + lx1 + "," + ly1 +
  " (" + (lx1 - lx0 + 1) + "x" + (ly1 - ly0 + 1) + ")");

// ---------- Paso 2: QR nivel H con logo central --------------
const qr = qrcode.create(URL, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const margin = 4;
const mod = 24;
const W = (size + margin * 2) * mod;
const cx = W >> 1, cy = W >> 1;
console.log("QR " + size + " mods · imagen " + W + "px");

const img = Buffer.alloc(W * W * 4);
for (let i = 0; i < img.length; i += 4) { img[i] = 255; img[i + 1] = 255; img[i + 2] = 255; img[i + 3] = 255; }

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (!qr.modules.get(c, r)) continue;
    const x0 = (margin + c) * mod, y0 = (margin + r) * mod;
    for (let y = y0; y < y0 + mod; y++) {
      for (let x = x0; x < x0 + mod; x++) {
        const o = (y * W + x) * 4;
        img[o] = DARK[0]; img[o + 1] = DARK[1]; img[o + 2] = DARK[2];
      }
    }
  }
}

// Insignia central: círculo blanco con borde suavizado
const badgePx = Math.floor(W * 0.24);
const logoPx = Math.floor(W * 0.175);
const R = Math.floor(badgePx / 2);
console.log("badge " + badgePx + "px · logo " + logoPx + "px");
for (let y = cy - R - 1; y <= cy + R + 1; y++) {
  for (let x = cx - R - 1; x <= cx + R + 1; x++) {
    const dx = x - cx, dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    const aa = Math.min(1, Math.max(0, R - d + 0.6));
    if (aa <= 0) continue;
    const o = (y * W + x) * 4;
    img[o] = Math.round(img[o] + (255 - img[o]) * aa);
    img[o + 1] = Math.round(img[o + 1] + (255 - img[o + 1]) * aa);
    img[o + 2] = Math.round(img[o + 2] + (255 - img[o + 2]) * aa);
  }
}
// Logo logolingo.png dentro de la insignia (escala bilinear, respeta alpha)
const lw = lx1 - lx0 + 1, lh = ly1 - ly0 + 1;
const logoSrc = Buffer.alloc(4);
let logoFit = scale(logo.data, lw, lh, logoPx, logoPx);
{ // crop del bbox si no es la imagen completa
  const cropped = Buffer.alloc(lw * lh * 4);
  for (let yy = 0; yy < lh; yy++) {
    for (let xx = 0; xx < lw; xx++) {
      const so = ((ly0 + yy) * logo.w + (lx0 + xx)) * 4;
      cropped[(yy * lw + xx) * 4] = logo.data[so];
      cropped[(yy * lw + xx) * 4 + 1] = logo.data[so + 1];
      cropped[(yy * lw + xx) * 4 + 2] = logo.data[so + 2];
      cropped[(yy * lw + xx) * 4 + 3] = logo.data[so + 3];
    }
  }
  logoFit = scale(cropped, lw, lh, logoPx, logoPx);
}
const half = logoPx >> 1;
for (let iy = 0; iy < logoPx; iy++) {
  for (let ix = 0; ix < logoPx; ix++) {
    const so = (iy * logoPx + ix) * 4;
    const a = logoFit[so + 3] / 255;
    if (a <= 0) continue;
    const dx = cx - half + ix, dy = cy - half + iy;
    const o = (dy * W + dx) * 4;
    img[o] = Math.round(img[o] + (logoFit[so] - img[o]) * a);
    img[o + 1] = Math.round(img[o + 1] + (logoFit[so + 1] - img[o + 1]) * a);
    img[o + 2] = Math.round(img[o + 2] + (logoFit[so + 2] - img[o + 2]) * a);
  }
}

const png = encodePNG(W, W, img);
fs.mkdirSync("/tmp/opencode", { recursive: true });
fs.writeFileSync(PREVIEW, png);
const dataUrl = "data:image/png;base64," + png.toString("base64");
console.log("OK preview + dataURL (" + png.length + " B)");

// ---------- Paso 3: HTML imprimible --------------
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Acceso Lingoxic — ABA</title>
<style>
@page { size: Letter; margin: 16mm; }
* { box-sizing: border-box; }
body { font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; color: #1e293b; font-size: 10.5px; line-height: 1.45; margin: 0; }
.topbar { height: 6px; background: linear-gradient(90deg, #0ea5e9, #2563eb); border-radius: 3px; margin-bottom: 14px; }
h1 { font-size: 20px; color: #0f172a; margin: 0 0 2px 0; letter-spacing: -0.3px; }
.subtitle { font-size: 12.5px; color: #0ea5e9; margin: 0 0 14px 0; font-weight: 600; }
.qr-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 16px 14px 16px; width: 76%; margin: 0 auto; text-align: center; background: #ffffff; }
.qr-img { width: 300px; max-width: 100%; display: block; margin: 0 auto; }
.url { display: inline-block; margin: 10px 0 12px 0; font-family: "DejaVu Sans Mono", Consolas, monospace; font-size: 12.5px; font-weight: 700; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 999px; padding: 4px 16px; }
table.steps { width: 100%; border-collapse: separate; border-spacing: 0 6px; margin-top: 6px; }
table.steps td { vertical-align: middle; padding: 4px 6px; font-size: 10.2px; color: #334155; }
.num { display: inline-block; width: 18px; height: 18px; line-height: 18px; border-radius: 50%; background: #0ea5e9; color: #fff; font-weight: 700; font-size: 10.5px; text-align: center; margin-right: 6px; }
.num-2 { background: #2563eb; }
.num-3 { background: #1d4ed8; }
.box { border: 1px solid #e2e8f0; border-left: 4px solid #0ea5e9; border-radius: 4px; padding: 8px 10px; margin: 12px 0 0 0; background: #f8fafc; font-size: 10px; }
.box b { color: #0c4a6e; }
.foot { margin-top: 18px; font-size: 8.8px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
<div class="topbar"></div>
<h1>ACCEDÉ A LINGOXIC</h1>
<p class="subtitle">Escaneá el código para abrir Lingoxic desde tu celular</p>

<div class="qr-card">
  <img class="qr-img" src="${dataUrl}" alt="Código QR de acceso a Lingoxic">
  <div class="url">${URL}</div>
  <table class="steps">
    <tr><td><span class="num">1</span>Abrí la cámara del celular (o Google Lens).</td></tr>
    <tr><td><span class="num num-2">2</span>Apuntá al código QR y tocá el enlace <b>lingoxic.web.app</b>.</td></tr>
    <tr><td><span class="num num-3">3</span>Opcional: en el navegador usá <b>«Agregar a pantalla de inicio»</b> para usarla como app.</td></tr>
  </table>
</div>
</body>
</html>`;
fs.writeFileSync(HTML_OUT, html);
console.log("OK " + HTML_OUT + " (" + fs.statSync(HTML_OUT).size + " B)");