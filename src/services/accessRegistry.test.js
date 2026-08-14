import { describe, it, expect, vi, beforeEach } from "vitest";

const mockData = {};

vi.mock("firebase/database", () => ({
  ref: (db, path) => ({ db, path }),
  get: vi.fn(async (ref) => ({ val: () => mockData[ref.path] ?? null })),
  set: vi.fn(async (ref, val) => { mockData[ref.path] = val; }),
  update: vi.fn(async (ref, val) => { mockData[ref.path] = { ...(mockData[ref.path] ?? {}), ...val }; }),
  remove: vi.fn(),
  push: vi.fn(),
}));

vi.mock("./firebase.js", () => ({ rtdb: {} }));

import { checkAccessBlocked, registerUser } from "./accessRegistry.js";

beforeEach(() => {
  Object.keys(mockData).forEach((k) => delete mockData[k]);
  localStorage.clear();
});

describe("checkAccessBlocked — código de academia", () => {
  it("NO bloquea si nunca se usó (active true, sin timestamp)", async () => {
    mockData["access"] = { academyFirstUsedAt: 0, active: true };
    const r = await checkAccessBlocked("ABA2026");
    expect(r.blocked).toBe(false);
  });

  it("NO bloquea dentro de la ventana de 1 hora", async () => {
    mockData["access"] = { academyFirstUsedAt: Date.now() - 30 * 60 * 1000, active: true };
    const r = await checkAccessBlocked("ABA2026");
    expect(r.blocked).toBe(false);
  });

  it("BLOQUEA si pasó la hora", async () => {
    mockData["access"] = { academyFirstUsedAt: Date.now() - 2 * 60 * 60 * 1000, active: true };
    const r = await checkAccessBlocked("ABA2026");
    expect(r.blocked).toBe(true);
    expect(r.reason).toBe("EXPIRED");
  });

  it("BLOQUEA si active false pero ya hubo primer uso (bug real)", async () => {
    mockData["access"] = { academyFirstUsedAt: 1234567890, active: false };
    const r = await checkAccessBlocked("ABA2026");
    expect(r.blocked).toBe(true);
    expect(r.reason).toBe("EXPIRED");
  });

  it("NO bloquea si active false y nunca hubo primer uso", async () => {
    mockData["access"] = { academyFirstUsedAt: 0, active: false };
    const r = await checkAccessBlocked("ABA2026");
    expect(r.blocked).toBe(false);
  });
});

describe("checkAccessBlocked — código interno", () => {
  it("nunca bloquea MEP2026", async () => {
    mockData["access"] = { academyFirstUsedAt: Date.now() - 5 * 60 * 60 * 1000, active: false };
    const r = await checkAccessBlocked("MEP2026");
    expect(r.blocked).toBe(false);
  });
});

describe("registerUser — código de academia", () => {
  it("activa el acceso y guarda el primer uso", async () => {
    mockData["access"] = { academyFirstUsedAt: 0, active: false };
    const r = await registerUser("Ana", "ABA2026");
    expect(r.ok).toBe(true);
    expect(mockData["access"].active).toBe(true);
    expect(mockData["access"].academyFirstUsedAt).toBeGreaterThan(0);
  });
});
