/**
 * QA funcional completo de LinGoXiC (Brave + CDP).
 * Captura: pantallas, errores de consola, errores JS, requests fallidos,
 * estados de IndexedDB y textos visibles para revisión/OCR.
 *
 * Uso: node .qa/full-qa.mjs [url]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import unitsData from "../src/data/unitsData.js";
import listeningData from "../src/data/listeningData.js";

const BASE = process.argv[2] || "http://127.0.0.1:5173";
const OUT = "/tmp/opencode/qa-full";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222" });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900 });

const report = { base: BASE, startedAt: new Date().toISOString(), steps: [], errors: [], shots: [] };
const consoleErrors = [];
const consoleWarnings = [];
const pageErrors = [];
const failedRequests = [];
let currentStep = "setup";

page.on("console", (m) => {
  const entry = { step: currentStep, text: m.text().slice(0, 400) };
  if (m.type() === "error") consoleErrors.push(entry);
  if (m.type() === "warning") consoleWarnings.push(entry);
});
page.on("pageerror", (e) => pageErrors.push({ step: currentStep, error: String(e).slice(0, 500) }));
page.on("requestfailed", (r) =>
  failedRequests.push({ step: currentStep, url: r.url(), err: r.failure()?.errorText })
);
page.on("response", (r) => {
  if (r.status() >= 400)
    failedRequests.push({ step: currentStep, url: r.url(), status: r.status() });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const body = () => page.evaluate(() => document.body.innerText);
let shotIndex = 0;
async function shot(name, fullPage = true) {
  shotIndex++;
  const file = `${String(shotIndex).padStart(2, "0")}-${name.replace(/[^a-z0-9-_]/gi, "_")}.png`;
  if (fullPage) {
    // Recorrer la página para activar animaciones "whileInView" antes de capturar.
    await page.evaluate(async () => {
      const el = document.scrollingElement;
      window.scrollTo(0, el.scrollHeight);
      await new Promise((r) => setTimeout(r, 450));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.screenshot({ path: path.join(OUT, file), fullPage });
      break;
    } catch (e) {
      // El service worker puede recargar la página (autoUpdate) justo al capturar.
      await sleep(1200);
      if (attempt === 2) throw e;
    }
  }
  report.shots.push(file);
  return file;
}
function step(name, data = {}) {
  currentStep = name;
  const s = { name, ...data, at: new Date().toISOString() };
  report.steps.push(s);
  console.log(`\n▶ ${name}`, Object.keys(data).length ? JSON.stringify(data) : "");
  return s;
}
async function click(text, { exact = false, tag = "button" } = {}) {
  const ok = await page.evaluate(
    ({ text, exact, tag }) => {
      const els = [...document.querySelectorAll(tag)].filter((e) => e.offsetParent !== null && !e.disabled);
      const el = els.find((e) => (exact ? e.textContent.trim() === text : e.textContent.includes(text)));
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      el.click();
      return true;
    },
    { text, exact, tag }
  );
  await sleep(350);
  return ok;
}
async function clickCard(text) {
  return page.evaluate((text) => {
    const els = [...document.querySelectorAll("[class*='cursor-pointer'], a, button")].filter(
      (e) => e.offsetParent !== null
    );
    const el = els.find((e) => e.textContent.includes(text));
    if (!el) return false;
    el.scrollIntoView({ block: "center" });
    el.click();
    return true;
  }, text);
}
async function dbGet(store) {
  return page.evaluate(async (store) => {
    return await new Promise((resolve) => {
      const req = indexedDB.open("LinGoXiC");
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(store)) return resolve(null);
        const tx = db.transaction(store, "readonly");
        const g = tx.objectStore(store).getAll();
        g.onsuccess = () => resolve(g.result);
      };
      req.onerror = () => resolve(null);
    });
  }, store);
}
const getUser = async () => (await dbGet("user"))?.[0] || null;

// --- reset total ---
currentStep = "reset";
await page.goto(BASE + "/", { waitUntil: "networkidle2" });
await page.evaluate(async () => {
  localStorage.clear();
  const req = indexedDB.deleteDatabase("LinGoXiC");
  await new Promise((r) => {
    req.onsuccess = req.onerror = req.onblocked = () => r();
    setTimeout(r, 1500);
  });
});
await page.reload({ waitUntil: "networkidle2" });
// En el build de producción el service worker puede recargar una vez (autoUpdate).
await sleep(BASE.includes("4173") ? 4000 : 1000);

// ---------- ONBOARDING ----------
step("onboarding: welcome");
await shot("onboarding-welcome");
const welcomeTxt = await body();
report.steps.at(-1).checks = {
  hasWelcome: welcomeTxt.includes("Bienvenido a LinGoXiC"),
  hasStart: welcomeTxt.includes("Comenzar"),
};

await click("Comenzar");
await page.waitForSelector("input", { visible: true });
step("onboarding: nombre");
await shot("onboarding-name");
await page.type("input", "QA Automatizado");
await click("Continuar");
step("onboarding: eleccion de ruta");
await shot("onboarding-choice");
report.steps.at(-1).checks = {
  hasDiagnostic: (await body()).includes("Hacer diagnóstico"),
  hasA1: (await body()).includes("Empezar desde cero"),
};

await click("Hacer diagnóstico");
step("onboarding: test de ubicacion");
await shot("onboarding-placement");
report.steps.at(-1).checks = { hasQuestion: (await page.evaluate(() => document.querySelectorAll("button").length)) > 3 };
// responder 3 y omitir
for (let i = 0; i < 3; i++) {
  await page.evaluate(() => {
    const main = document.querySelector("#root > div > div");
    const opts = [...document.querySelectorAll("button")].filter(
      (b) => b.offsetParent && /^[A-D][).]|^\w/.test(b.textContent.trim()) && !/Omitir|Atrás/.test(b.textContent)
    );
    opts[0]?.click();
  });
  await sleep(450);
}
await click("Omitir y empezar en A1");
await sleep(1800);
step("post-onboarding: dashboard", { url: page.url() });
await shot("dashboard-inicial");
let user = await getUser();
report.steps.at(-1).user = { level: user?.level, xp: user?.xp, streak: user?.streak };
report.steps.at(-1).checks = {
  redirected: page.url().endsWith("/dashboard"),
  hasGreeting: (await body()).includes("QA Automatizado"),
};

// ---------- DIAGNOSTICO ----------
step("diagnostico: inicio");
await page.goto(BASE + "/diagnostic", { waitUntil: "networkidle2" });
await sleep(400);
await shot("diagnostic-intro");
await click("Comenzar diagnóstico");
let diagSteps = 0;
while (diagSteps < 40) {
  if ((await body()).includes("Tu diagnóstico")) break;
  const ok = await page.evaluate(() => {
    const main = document.querySelector("main");
    const opts = [...main.querySelectorAll("button.w-full")].filter(
      (b) => b.textContent.trim() && !/Siguiente|Anterior|Verificar/.test(b.textContent)
    );
    opts[0]?.click();
    return Boolean(opts.length);
  });
  if (!ok) break;
  diagSteps++;
  await sleep(400);
}
await sleep(800);
const diagTxt = await body();
user = await getUser();
step("diagnostico: resultado", { preguntas: diagSteps });
await shot("diagnostic-result");
report.steps.at(-1).checks = {
  completed: diagTxt.includes("Tu diagnóstico"),
  overall: user?.diagnostic?.overallLevel || null,
  weakAreas: user?.weakAreas || [],
  levelApplied: user?.level === user?.diagnostic?.overallLevel,
};

// ---------- LECCIONES ----------
const unit0 = unitsData[0];
step("lecciones: unidad", { unit: unit0.id });
await page.goto(`${BASE}/unit/${unit0.id}`, { waitUntil: "networkidle2" });
await sleep(400);
await shot("unit-detail");
const lesson = unit0.lessons[0];
const clickedLesson = await clickCard(lesson.title);
await sleep(700);
step("lecciones: detalle", { clickedLesson, url: page.url() });
await shot("lesson-first-slide");
let slides = 0;
while (slides < 15) {
  if ((await body()).includes("Marcar como completada")) break;
  if (!(await click("Siguiente"))) break;
  slides++;
}
await shot("lesson-last-slide");
const xpBeforeLesson = (await getUser())?.xp;
await click("Marcar como completada");
await sleep(1000);
const xpAfterLesson = (await getUser())?.xp;
step("lecciones: completar", { slides, xpBeforeLesson, xpAfterLesson });
await shot("lesson-completed");
report.steps.at(-1).checks = { xpGained: (xpAfterLesson || 0) - (xpBeforeLesson || 0) };

// ---------- QUIZ (aprobado y reprobado) ----------
const quiz = unit0.quizzes[0];
async function answerQuiz(correct) {
  return page.evaluate(
    ({ correct, answers }) => {
      const blocks = [...document.querySelectorAll("div.border.rounded-lg")];
      let n = 0;
      blocks.forEach((b, i) => {
        const btns = [...b.querySelectorAll("button")];
        const target = correct
          ? btns.find((x) => x.textContent.trim() === String(answers[i]).trim())
          : btns.find((x) => x.textContent.trim() !== String(answers[i]).trim());
        if (target) {
          target.click();
          n++;
        }
      });
      return n;
    },
    { correct, answers: quiz.questions.map((q) => q.correctAnswer) }
  );
}
step("quiz: reprobado", { quiz: quiz.id });
await page.goto(`${BASE}/quiz/${unit0.id}/${quiz.id}`, { waitUntil: "networkidle2" });
await sleep(500);
await shot("quiz-questions");
const markedFail = await answerQuiz(false);
await click("Verificar respuestas");
await sleep(500);
const failTxt = await body();
await shot("quiz-failed");
const xpBeforeFail = (await getUser())?.xp;
await click("Finalizar");
await sleep(800);
report.steps.at(-1).checks = {
  marked: markedFail,
  showsFail: failTxt.includes("No aprobado"),
  xpUnchanged: (await getUser())?.xp === xpBeforeFail,
};

step("quiz: aprobado");
await page.goto(`${BASE}/quiz/${unit0.id}/${quiz.id}`, { waitUntil: "networkidle2" });
await sleep(500);
await answerQuiz(true);
await click("Verificar respuestas");
await sleep(500);
const passTxt = await body();
await shot("quiz-passed");
const xpBeforePass = (await getUser())?.xp;
await click("Guardar XP");
await sleep(1000);
user = await getUser();
report.steps.at(-1).checks = {
  showsPass: passTxt.includes("¡Aprobado!"),
  xpGained: (user?.xp || 0) - (xpBeforePass || 0),
  quizSaved: user?.completedQuizzes?.includes(quiz.id),
};
await shot("quiz-finished");

// ---------- PRACTICA ----------
step("practica: mixta");
await page.goto(BASE + "/practice", { waitUntil: "networkidle2" });
await sleep(500);
await shot("practice-question");
let practiceAnswers = 0;
while (practiceAnswers < 15) {
  const txt = await body();
  if (txt.includes("Resultados")) break;
  const clicked = await page.evaluate(() => {
    const opt = [...document.querySelectorAll("main button")].find(
      (b) =>
        b.className.includes("border-2") &&
        b.className.includes("rounded-xl") &&
        b.offsetParent !== null
    );
    opt?.click();
    return Boolean(opt);
  });
  if (!clicked) break;
  practiceAnswers++;
  await sleep(400);
  if ((await body()).includes("Ver resultados")) {
    await click("Ver resultados");
    await sleep(500);
    break;
  }
}
await sleep(600);
const practiceTxt = await body();
await shot("practice-results");
report.steps.at(-1).checks = {
  answered: practiceAnswers,
  hasResults: practiceTxt.includes("Resultados"),
  hasScore: /\d+%/.test(practiceTxt),
};

// ---------- PRACTICA FILTRADA ----------
step("practica: filtro speaking");
await page.goto(BASE + "/practice?skill=speaking", { waitUntil: "networkidle2" });
await sleep(600);
await shot("practice-filter-speaking");
const filtered = await body();
report.steps.at(-1).checks = { hasQuestions: !filtered.includes("No hay preguntas disponibles") };

// ---------- EXAMEN ----------
step("examen: simulacro");
await page.goto(BASE + "/exam-sim", { waitUntil: "networkidle2" });
await sleep(500);
await shot("exam-intro");
const declared = ((await body()).match(/(\d+) preguntas/) || [])[1];
await click("Comenzar");
await sleep(2000);
const examState = await page.evaluate(() => ({
  blocks: document.querySelectorAll("main div.rounded-2xl").length,
  audios: document.querySelectorAll("main audio").length,
  timer: [...document.querySelectorAll("span")].map((s) => s.textContent).find((t) => /^\d{2}:\d{2}$/.test(t.trim())) || null,
}));
await shot("exam-running");
await page.evaluate(() => {
  [...document.querySelectorAll("main div.rounded-2xl")]
    .slice(0, 12)
    .forEach((c) => c.querySelector("button")?.click());
});
await sleep(400);
page.once("dialog", async (d) => d.accept());
await click("Finalizar y guardar");
await sleep(1200);
const examTxt = await body();
const examSaved = await dbGet("examResults");
await shot("exam-result");
report.steps.at(-1).checks = {
  declared: Number(declared),
  rendered: examState.blocks,
  audios: examState.audios,
  timer: examState.timer,
  score: (examTxt.match(/(\d+)\/(\d+) — (\d+)%/) || []).slice(1).join("/") || null,
  saved: examSaved?.length || 0,
};

// ---------- LISTENING ----------
step("listening: audio + preguntas");
await page.goto(BASE + "/listening", { waitUntil: "networkidle2" });
await sleep(1200);
const audio = await page.evaluate(async () => {
  const a = document.querySelector("audio");
  if (!a) return { found: false };
  await new Promise((r) => setTimeout(r, 400));
  const before = { ready: a.readyState, src: a.currentSrc, err: a.error?.code || null };
  try {
    await a.play();
  } catch (e) {
    return { ...before, finded: true, playErr: e.name };
  }
  await new Promise((r) => setTimeout(r, 1600));
  const res = { ...before, playing: !a.paused, time: Number(a.currentTime.toFixed(2)), duration: Number(a.duration.toFixed(2)) };
  a.pause();
  return res;
});
await shot("listening-player");
const listenQuestions = await page.evaluate(
  () => document.querySelectorAll("main div.border.rounded-lg").length
);
const verifyDisabled = await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.includes("Verificar")
  );
  return Boolean(b?.disabled);
});
const answeredListening = await page.evaluate((answers) => {
  const blocks = [...document.querySelectorAll("main div.border.rounded-lg")];
  let n = 0;
  blocks.forEach((b, i) => {
    const target = [...b.querySelectorAll("button")].find(
      (x) => x.textContent.trim() === String(answers[i]).trim()
    );
    if (target) {
      target.click();
      n++;
    }
  });
  return n;
}, (listeningData[0]?.questions || []).map((q) => q.correctAnswer));
await sleep(400);
await click("Verificar");
await sleep(500);
await shot("listening-checked");
const listenChecked = await body();
report.steps.at(-1).checks = {
  audio,
  listenQuestions,
  verifyDisabledWithoutAnswers: verifyDisabled,
  answeredListening,
  scoreShown: /4\/4 correctas/.test(listenChecked),
};

// ---------- VOCABULARIO ----------
step("vocabulario: busqueda y audio");
await page.goto(BASE + "/vocabulary", { waitUntil: "networkidle2" });
await sleep(600);
await shot("vocabulary");
const vocabAll = ((await body()).match(/(\d+) palabras/) || [])[1];
await page.type("input", "family");
await sleep(500);
const vocabFiltered = ((await body()).match(/(\d+) palabras/) || [])[1];
const unitLabels = await page.evaluate(() =>
  [...document.querySelectorAll("select option")].map((o) => o.textContent)
);
await shot("vocabulary-filtered");
report.steps.at(-1).checks = { total: vocabAll, filtered: vocabFiltered, units: unitLabels.slice(0, 8) };

// ---------- GRAMATICA ----------
step("gramatica: tema y ejercicio");
await page.goto(BASE + "/grammar", { waitUntil: "networkidle2" });
await sleep(500);
await shot("grammar");
await page.evaluate(() => {
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent.includes("Present Simple"))
    ?.click();
});
await sleep(600);
await click("Practicar");
await sleep(500);
const grammarAnswered = await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    /^(is|are|am|do|does|go|goes|have|has)$/.test(x.textContent.trim())
  );
  b?.click();
  return b?.textContent.trim() || null;
});
await sleep(500);
await shot("grammar-exercise");
report.steps.at(-1).checks = { answered: grammarAnswered, feedbackVisible: (await body()).includes("💡") };

// ---------- READING ----------
step("reading: cambio de unidad");
await page.goto(BASE + "/reading", { waitUntil: "networkidle2" });
await sleep(500);
await shot("reading");
const clickUnit = await click("Compras Tecnológicas");
await sleep(700);
const readingTxt = await body();
report.steps.at(-1).checks = {
  clickedUnit: clickUnit,
  changed: readingTxt.includes("Compras"),
  hasText: readingTxt.length > 600,
};
await shot("reading-other-unit");

// ---------- WRITING (IA no configurada) ----------
step("writing: degradacion sin IA");
await page.goto(BASE + "/writing", { waitUntil: "networkidle2" });
await sleep(500);
await shot("writing");
await page.type("textarea", "I am a student and I like learn English very much.");
await click("Enviar para feedback");
await sleep(2500);
const writingTxt = await body();
await shot("writing-feedback");
report.steps.at(-1).checks = {
  showsMessage: /IA no está configurada|Límite|Error al conectar/.test(writingTxt),
  rawError: writingTxt.includes("ERROR_RED") || writingTxt.includes("SIN_CONFIG"),
};

// ---------- SPEAKING ----------
step("speaking: modos");
await page.goto(BASE + "/speaking", { waitUntil: "networkidle2" });
await sleep(800);
await shot("speaking");
const speakingTabs = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map((b) => b.textContent.trim()).filter((t) => ["Aprender", "Conversar", "Grabar"].includes(t))
);
await click("Conversar");
await sleep(600);
await shot("speaking-converse");
await click("Grabar");
await sleep(800);
await shot("speaking-record");
report.steps.at(-1).checks = { tabs: speakingTabs, noCrash: (await body()).length > 200 };

// ---------- PROGRESO ----------
step("progreso: resumen");
await page.goto(BASE + "/progress", { waitUntil: "networkidle2" });
await sleep(900);
await shot("progress");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await sleep(600);
const progressTxt = await body();
report.steps.at(-1).checks = {
  hasChart: Boolean(
    await page.evaluate(
      () =>
        document.querySelector(".recharts-surface") ||
        document.querySelectorAll(".recharts-rectangle").length > 0
    )
  ),
  showsLevel: /A[12]|B[12]/.test(progressTxt),
  showsStreak: progressTxt.includes("Racha"),
};

// ---------- SETTINGS ----------
step("ajustes: tema y estado");
await page.goto(BASE + "/settings", { waitUntil: "networkidle2" });
await sleep(500);
const themeBefore = await page.evaluate(() => document.documentElement.classList.contains("dark"));
await shot("settings");
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find(
    (x) => x.className.includes("rounded-full") && x.className.includes("w-12")
  );
  b?.click();
});
await sleep(300);
const themeAfter = await page.evaluate(() => document.documentElement.classList.contains("dark"));
await page.reload({ waitUntil: "networkidle2" });
await sleep(900);
const themeReload = await page.evaluate(() => document.documentElement.classList.contains("dark"));
await shot("settings-after-reload");
report.steps.at(-1).checks = { themeBefore, themeAfter, themeReload, persisted: themeAfter === themeReload && themeBefore !== themeAfter };

// ---------- RESET PROGRESO ----------
step("ajustes: reset de progreso");
page.once("dialog", async (d) => d.accept());
await click("Reiniciar progreso");
await sleep(1500);
user = await getUser();
await shot("after-reset");
report.steps.at(-1).checks = { xp: user?.xp, level: user?.level, lessons: user?.completedLessons?.length };

// ---------- MOVIL ----------
step("movil: dashboard y examen");
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(BASE + "/dashboard", { waitUntil: "networkidle2" });
await sleep(900);
await shot("mobile-dashboard");
const overflowDash = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
await page.goto(BASE + "/exam-sim", { waitUntil: "networkidle2" });
await sleep(600);
await shot("mobile-exam");
const overflowExam = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
report.steps.at(-1).checks = { overflowDash, overflowExam };

// ---------- OFFLINE (solo build) ----------
if (BASE.includes("4173")) {
  step("offline: rutas y audio");
  await page.setViewport({ width: 1366, height: 900 });
  const routes = ["/dashboard", "/learn", "/vocabulary", "/grammar", "/practice", "/exam-sim", "/progress", "/settings", "/listening", "/reading", "/writing", "/speaking"];
  const offline = {};
  await page.setOfflineMode(true);
  for (const r of routes) {
    try {
      await page.goto(BASE + r, { waitUntil: "networkidle2", timeout: 12000 });
      await sleep(500);
      offline[r] = (await body()).length;
    } catch (e) {
      offline[r] = "FAIL";
    }
  }
  await page.goto(BASE + "/listening", { waitUntil: "networkidle2" });
  await sleep(900);
  const offlineAudio = await page.evaluate(async () => {
    const a = document.querySelector("audio");
    if (!a) return "no-audio";
    try {
      await a.play();
      return { ready: a.readyState, dur: a.duration };
    } catch (e) {
      return e.name;
    }
  });
  await shot("offline-listening");
  await page.setOfflineMode(false);
  report.steps.at(-1).checks = { routes: offline, audio: offlineAudio };
}

// ---------- CIERRE ----------
report.finishedAt = new Date().toISOString();
report.errors = { consoleErrors, consoleWarnings, pageErrors, failedRequests };
report.consoleErrorCount = consoleErrors.length;
report.pageErrorCount = pageErrors.length;
report.failedRequestCount = failedRequests.length;
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log("\n=== RESUMEN ===");
console.log("steps:", report.steps.length, "| shots:", report.shots.length);
console.log("consoleErrors:", consoleErrors.length, consoleErrors.slice(0, 5));
console.log("pageErrors:", pageErrors.length, pageErrors.slice(0, 5));
console.log("failedRequests:", failedRequests.length, failedRequests.slice(0, 5));
await page.close();
browser.disconnect();
