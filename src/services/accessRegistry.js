import { ref, get, set, update, remove, push } from "firebase/database";
import { rtdb } from "./firebase.js";
import {
  isAcademyCode,
  isInternalCode,
  hasAcademyCodeExpired,
} from "../utils/accessCode.js";

export function getDeviceId() {
  try {
    let id = localStorage.getItem("lingoxic_device_id");
    if (!id) {
      id =
        "dev_" +
        Math.random().toString(36).slice(2, 10) +
        Date.now().toString(36);
      localStorage.setItem("lingoxic_device_id", id);
    }
    return id;
  } catch {
    return "dev_unknown";
  }
}

export async function getAccessState() {
  try {
    const snap = await get(ref(rtdb, "access"));
    const data = snap.val();
    if (!data) {
      await set(ref(rtdb, "access"), {
        academyFirstUsedAt: 0,
        active: false,
      });
      return { academyFirstUsedAt: 0, active: false };
    }
    return data;
  } catch {
    return null;
  }
}

export async function registerUser(name, accessCode) {
  const code = accessCode.trim().toUpperCase();
  try {
    const state = await getAccessState();
    const deviceId = getDeviceId();

    if (isAcademyCode(code)) {
      const firstUsedAt = state && state.academyFirstUsedAt ? state.academyFirstUsedAt : Date.now();
      await update(ref(rtdb, "access"), { academyFirstUsedAt: firstUsedAt, active: true });
      const userRef = ref(rtdb, `users/${deviceId}`);
      await set(userRef, {
        name,
        code,
        deviceId,
        registeredAt: new Date().toISOString(),
        type: "academy",
      });
      return { ok: true, type: "academy" };
    }

    if (isInternalCode(code)) {
      const userRef = ref(rtdb, `users/${deviceId}`);
      await set(userRef, {
        name,
        code,
        deviceId,
        registeredAt: new Date().toISOString(),
        type: "internal",
      });
      return { ok: true, type: "internal" };
    }

    return { ok: false, error: "INVALID_CODE" };
  } catch (e) {
    return { ok: false, error: "NETWORK" };
  }
}

export async function checkAccessBlocked(accessCode) {
  const code = accessCode.trim().toUpperCase();
  if (isInternalCode(code)) return { blocked: false, reason: null };

  try {
    const state = await getAccessState();
    if (!state) return { blocked: false, reason: null };

    if (isAcademyCode(code)) {
      if (state.active === false) return { blocked: true, reason: "EXPIRED" };
      if (hasAcademyCodeExpired(state.academyFirstUsedAt)) {
        return { blocked: true, reason: "EXPIRED" };
      }
      const deviceId = getDeviceId();
      const deviceSnap = await get(ref(rtdb, `users/${deviceId}`));
      const device = deviceSnap.val();
      if (device && device.code === code && !device.allowed) {
        return { blocked: true, reason: "REVOKED" };
      }
    }
    return { blocked: false, reason: null };
  } catch {
    return { blocked: false, reason: null };
  }
}

export async function deactivateAccess() {
  try {
    await update(ref(rtdb, "access"), { active: false });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function purgeAllAcademyUsers() {
  try {
    const snap = await get(ref(rtdb, "users"));
    const users = snap.val() || {};
    const updates = {};
    for (const [deviceId, u] of Object.entries(users)) {
      if (u.type === "academy") updates[deviceId] = null;
    }
    if (Object.keys(updates).length) await update(ref(rtdb, "users"), updates);
    await update(ref(rtdb, "access"), { academyFirstUsedAt: 0, active: false });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
