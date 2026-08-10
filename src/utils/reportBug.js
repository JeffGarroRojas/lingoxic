export const REPORT_EMAIL = import.meta.env.VITE_REPORT_EMAIL || "soportelingoxic@gmail.com";

export function buildReportMailto(details) {
  const subject = `[Lingoxic] Reporte de error - ${details.page || "App"}`;
  const body = [
    `Página: ${details.page || "Desconocida"}`,
    `Navegador: ${details.browser || "Desconocido"}`,
    `Fecha: ${details.date || new Date().toLocaleString()}`,
    "",
    "Descripción del problema:",
    details.description || "(sin descripción)",
  ].join("\n");

  return `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
