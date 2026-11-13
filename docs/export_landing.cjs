const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const file = "file://" + path.resolve("docs/landing-lingoxic-aba.html");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(file, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));

  const slides = await page.evaluate(() => document.querySelectorAll(".slide").length);

  const printCss = `
  @media print {
    html, body { height: auto !important; overflow: visible !important; background: #fff !important; }
    .deck { height: auto !important; max-height: none !important; overflow: visible !important; }
    .slide { position: relative !important; inset: auto !important; width: 100% !important;
      height: auto !important; max-height: none !important; opacity: 1 !important;
      transform: none !important; pointer-events: auto; filter: none !important;
      page-break-after: always; overflow: visible !important; }
    .slide:last-child { page-break-after: auto; }
    .slide-inner { overflow: visible !important; }
    .anim, .anim2, .anim3, .anim4 { opacity: 1 !important; transform: none !important;
      animation: none !important; filter: none !important; }
  }`;
  await page.addStyleTag({ content: printCss });

  await page.pdf({
    path: "docs/landing-lingoxic-aba.pdf",
    format: "Letter",
    landscape: true,
    scale: 0.78,
    printBackground: true,
    preferCSSPageSize: true,
  });

  console.log("slides:", slides);
  await browser.close();
  console.log("done");
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });