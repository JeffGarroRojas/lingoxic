export const REPORT_EMAIL = import.meta.env.VITE_REPORT_EMAIL || "soportelingoxic@gmail.com";
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";

export function buildReportPayload(details) {
  return {
    page: details.page || window.location.pathname,
    browser: details.browser || navigator.userAgent,
    date: details.date || new Date().toLocaleString(),
    description: details.description || "(sin descripción)",
    email: REPORT_EMAIL,
  };
}

export async function submitBugReport(details, endpoint = FORMSPREE_ENDPOINT) {
  if (!endpoint) {
    return { ok: false, error: "Reportes no configurados aún" };
  }
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildReportPayload(details)),
    });
    if (res.ok) return { ok: true };
    return { ok: false, error: `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: "Sin conexión" };
  }
}
