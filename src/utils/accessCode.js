const INTERNAL_CODE = "MEP2026";
const ACADEMY_CODE = "ABA2026";
const ACADEMY_VALID_HOURS = 1;
const MS_PER_HOUR = 60 * 60 * 1000;

export function getAccessCodeType(code) {
  const normalized = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (normalized === INTERNAL_CODE) return "internal";
  if (normalized === ACADEMY_CODE) return "academy";
  return null;
}

export function isInternalCode(code) {
  return getAccessCodeType(code) === "internal";
}

export function isAcademyCode(code) {
  return getAccessCodeType(code) === "academy";
}

export function isValidAccessCode(code) {
  return getAccessCodeType(code) !== null;
}

export function hasAcademyCodeExpired(firstUsedAt, now = Date.now()) {
  if (!firstUsedAt) return false;
  return now - firstUsedAt > ACADEMY_VALID_HOURS * MS_PER_HOUR;
}
