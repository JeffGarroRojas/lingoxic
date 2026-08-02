import { useEffect } from "react";

export function setActivity(pending, label = "actividad") {
  window.__lingoxicBusy = { pending, label, at: Date.now() };
}

export function useActivityGuard(active) {
  useEffect(() => {
    setActivity(active, "actividad");
    return () => setActivity(false);
  }, [active]);
}
