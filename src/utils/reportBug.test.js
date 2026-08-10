import { describe, it, expect, vi } from "vitest";
import { buildReportMailto } from "./reportBug.js";

vi.stubEnv("VITE_REPORT_EMAIL", "soportelingoxic@gmail.com");

describe("buildReportMailto", () => {
  it("genera un mailto válido con asunto y cuerpo", () => {
    const url = buildReportMailto({ page: "/quiz/unit1", browser: "Chrome" });
    expect(url.startsWith("mailto:soportelingoxic@gmail.com?subject=")).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Página:");
    expect(decoded).toContain("Chrome");
    expect(decoded).toContain("/quiz/unit1");
  });

  it("usa el email por defecto cuando no hay env", () => {
    vi.stubEnv("VITE_REPORT_EMAIL", undefined);
    const url = buildReportMailto({ page: "Home" });
    expect(url.startsWith("mailto:soportelingoxic@gmail.com")).toBe(true);
    vi.unstubAllEnvs();
  });

  it("soporta campos vacíos", () => {
    const url = buildReportMailto({});
    expect(url.startsWith("mailto:")).toBe(true);
  });
});
