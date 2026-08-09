const ACCESS_CODE = "MEP2026";

export function isValidAccessCode(code) {
  return typeof code === "string" && code.trim().toUpperCase() === ACCESS_CODE;
}
