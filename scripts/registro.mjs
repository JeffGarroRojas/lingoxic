#!/usr/bin/env node
/**
 * Registro de entradas de LinGoXiC.
 *
 * Lee /entries y /users con Firebase CLI (omite las reglas del cliente).
 *
 * Uso:
 *   npm run registro              # tabla legible
 *   npm run registro -- --csv     # CSV para Excel/Sheets
 *   npm run registro -- --json    # JSON crudo
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = [
  path.join(root, "node_modules", ".bin", "firebase"),
  path.join(root, "node_modules", "firebase-tools", "lib", "bin", "firebase.js"),
].find((p) => existsSync(p));

if (!bin) {
  console.error("No encontré firebase-tools. Ejecuta npm install.");
  process.exit(1);
}

const project = "lingoxic";
const args = process.argv.slice(2);
const csv = args.includes("--csv");
const json = args.includes("--json");

function readDb(pathname) {
  try {
    const out = execFileSync(bin, ["database:get", pathname, "--project", project], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const start = out.indexOf("{");
    if (start === -1) return {};
    return JSON.parse(out.slice(start)) || {};
  } catch {
    return {};
  }
}

const fmt = (ms) =>
  ms ? new Date(ms).toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" }) : "";

const entries = readDb("/entries");
const users = readDb("/users");

const rows = Object.entries(entries)
  .map(([id, e]) => ({
    entrada: id,
    fecha: fmt(e.at),
    at: e.at || 0,
    nombre: e.name || "",
    nivel: e.level || "",
    usuario: e.userId || "",
    dispositivo: e.deviceId || "",
    agente: (e.agent || "").replace(/\s+/g, " ").slice(0, 60),
  }))
  .sort((a, b) => b.at - a.at);

const perfiles = Object.entries(users).map(([id, u]) => ({
  usuario: id,
  nombre: u.name || "",
  nivel: u.level || "",
  dispositivo: u.deviceId || "",
  primeraVez: fmt(u.createdAt),
  ultimaVez: fmt(u.lastSeen),
  lastSeen: u.lastSeen || 0,
}));

if (json) {
  console.log(JSON.stringify({ entries: rows, users: perfiles }, null, 2));
  process.exit(0);
}

if (csv) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["fecha", "nombre", "nivel", "usuario", "dispositivo", "entrada", "agente"];
  const lines = rows.map((r) => [r.fecha, r.nombre, r.nivel, r.usuario, r.dispositivo, r.entrada, r.agente].map(esc).join(","));
  console.log([header.map(esc).join(","), ...lines].join("\n"));
  process.exit(0);
}

const rl = (v, n) => String(v ?? "").padEnd(n).slice(0, n);
console.log(`\nLinGoXiC · registro de entradas (${rows.length})\n`);
if (rows.length === 0) {
  console.log("  Sin entradas registradas todavía.\n");
} else {
  console.log(`  ${rl("FECHA", 18)}${rl("NOMBRE", 20)}${rl("NIVEL", 7)}${rl("DISPOSITIVO", 20)}USUARIO`);
  console.log(`  ${"-".repeat(88)}`);
  for (const r of rows.slice(0, 50)) {
    console.log(`  ${rl(r.fecha, 18)}${rl(r.nombre, 20)}${rl(r.nivel, 7)}${rl(r.dispositivo, 20)}${r.usuario}`);
  }
  if (rows.length > 50) console.log(`  … y ${rows.length - 50} más (usa --csv para el total)`);
}

console.log(`\nUsuarios registrados (${perfiles.length})\n`);
for (const p of perfiles.sort((a, b) => b.lastSeen - a.lastSeen).slice(0, 30)) {
  console.log(`  ${rl(p.nombre, 20)}${rl(p.nivel, 7)}${rl("última vez " + p.ultimaVez, 32)}${p.usuario}`);
}
console.log("\nConsejo: `npm run registro -- --csv > registro.csv` para abrirlo en Excel/Sheets.\n");
