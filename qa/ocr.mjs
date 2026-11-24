/**
 * OCR de las capturas generadas por full-qa.mjs.
 * Prueba dos variantes (normal e invertida) para leer tanto temas claros
 * como oscuros, y reporta textos sospechosos (errores, undefined, NaN...).
 *
 * Uso: node .qa/ocr.mjs [carpeta]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIR = process.argv[2] || "/tmp/opencode/qa-full";
const OCR = path.join(DIR, "ocr");
fs.mkdirSync(OCR, { recursive: true });

const PATTERNS = [
  /algo sali[oó] mal/i,
  /\berror(es)?\b/i,
  /\bundefined\b/i,
  /\bNaN\b/,
  /\bnull\b/,
  /no encontrad/i,
  /\bfailed\b/i,
  /\binv[aá]lid/i,
  /\[object Object\]/,
  /\?\?\?/,
  /no hay preguntas/i,
  /no hay lecciones/i,
  /no se pudo/i,
];
const IGNORE = [/reportar error/i, /errores m[aá]s comunes/i, /corrige/i];

const shots = fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();
const findings = [];
for (const file of shots) {
  const full = path.join(DIR, file);
  const base = path.join(OCR, file.replace(/\.png$/, ""));
  const variants = [
    { suffix: "", args: [] },
    { suffix: "-neg", args: ["negate"] },
  ];
  let text = "";
  for (const v of variants) {
    try {
      const tmp = base + v.suffix + ".png";
      if (v.args.length) {
        execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", full, "-vf", v.args[0], "-pix_fmt", "gray", tmp]);
      } else {
        execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", full, "-pix_fmt", "gray", tmp]);
      }
      execFileSync("tesseract", [tmp, base + v.suffix, "-l", "spa+eng", "--psm", "3"], {
        stdio: "ignore",
      });
      text += "\n" + fs.readFileSync(base + v.suffix + ".txt", "utf8");
    } catch (e) {
      text += `\n[ocr-error ${e.message}]`;
    }
  }
  fs.writeFileSync(base + ".txt", text.trim());
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    if (IGNORE.some((r) => r.test(line))) continue;
    if (PATTERNS.some((r) => r.test(line))) {
      findings.push({ file, line: line.trim().slice(0, 200) });
    }
  }
}

// Capturas con muy poco texto suelen indicar pantalla vacía o rota.
const thin = shots
  .map((file) => {
    const base = path.join(OCR, file.replace(/\.png$/, ".txt"));
    const words = fs.existsSync(base) ? fs.readFileSync(base, "utf8").split(/\s+/).filter(Boolean).length : 0;
    return { file, words };
  })
  .filter((x) => x.words < 10);

const report = {
  generatedAt: new Date().toISOString(),
  dir: DIR,
  shots: shots.length,
  findings,
  thinScreens: thin,
};
fs.writeFileSync(path.join(DIR, "ocr-report.json"), JSON.stringify(report, null, 2));

console.log(`OCR: ${shots.length} capturas`);
console.log(`Hallazgos sospechosos: ${findings.length}`);
for (const f of findings.slice(0, 40)) console.log(`  ${f.file}: ${f.line}`);
console.log(`Capturas con <10 palabras: ${thin.length}`);
for (const t of thin) console.log(`  ${t.file} (${t.words})`);
