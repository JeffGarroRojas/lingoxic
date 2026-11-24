/**
 * Actualización forzada de la PWA.
 *
 * Borra service workers y cachés de assets, pero NO toca IndexedDB ni
 * localStorage: el usuario, su progreso y el tema se conservan.
 */
export async function forceUpdate({ reload = true } = {}) {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister().catch(() => false)));
    }
  } catch {}

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key).catch(() => false)));
    }
  } catch {}

  if (reload) {
    // Query única para saltar cualquier HTML cacheado por el navegador.
    const url = new URL(window.location.href);
    url.searchParams.set("_u", Date.now().toString(36));
    window.location.replace(url.toString());
  }
}

/** Pide al navegador comprobar si hay un service worker nuevo. */
export async function checkForUpdate() {
  try {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    await reg.update();
    return Boolean(reg.waiting || reg.installing);
  } catch {
    return false;
  }
}
