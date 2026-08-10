import { describe, it, expect, vi } from "vitest";
import { buildReportPayload, submitBugReport, FORMSPREE_ENDPOINT } from "./reportBug.js";

describe("buildReportPayload", () => {
  it("construye el payload con los datos del reporte", () => {
    const p = buildReportPayload({
      page: "/quiz/unit1",
      browser: "Chrome",
      description: "Error al enviar",
    });
    expect(p.page).toBe("/quiz/unit1");
    expect(p.browser).toBe("Chrome");
    expect(p.description).toContain("Error");
    expect(p.email).toBe("soportelingoxic@gmail.com");
  });
});

describe("submitBugReport", () => {
  it("devuelve error si no hay endpoint configurado", async () => {
    const r = await submitBugReport({}, "");
    expect(r.ok).toBe(false);
  });

  it("envía por POST cuando hay endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);
    const r = await submitBugReport({ page: "/home" }, "https://formspree.io/f/test");
    expect(mockFetch).toHaveBeenCalled();
    expect(r.ok).toBe(true);
    vi.unstubAllGlobals();
  });
});
