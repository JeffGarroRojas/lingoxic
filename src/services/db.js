import Dexie from "dexie";

class LinGoXiCDB extends Dexie {
  constructor() {
    super("LinGoXiC");
    this.version(3).stores({
      user: "id, level, xp, streak",
      examResults: "++id, date, score",
      aiCache: "&key, timestamp",
      dailyCounters: "&id, date",
    });
  }
}

export const db = new LinGoXiCDB();

export async function getUser() {
  return (await db.user.toArray())[0] || null;
}

export async function saveUser(user) {
  await db.user.put(user);
}

export async function updateUser(partial) {
  const user = await getUser();
  if (user) await db.user.put({ ...user, ...partial });
}

export async function saveExamResult(result) {
  await db.examResults.add(result);
}

export async function getExamResults() {
  return await db.examResults.orderBy("date").reverse().toArray();
}

function hashKey(str) {
  let t = 0;
  for (let i = 0; i < str.length; i++) {
    let r = str.charCodeAt(i);
    t = (t << 5) - t + r;
    t &= t;
  }
  return `ai_${Math.abs(t).toString(36)}`;
}

const CACHE_TTL = 7200 * 1000;

export async function getCachedAI(prompt) {
  try {
    const key = hashKey(prompt);
    const cached = await db.aiCache.get(key);
    return cached && Date.now() < cached.expiresAt
      ? cached.response
      : (cached && (await db.aiCache.delete(key)), null);
  } catch {
    return null;
  }
}

export async function setCachedAI(prompt, response) {
  try {
    const key = hashKey(prompt);
    const timestamp = Date.now();
    await db.aiCache.put({ key, response, timestamp, expiresAt: timestamp + CACHE_TTL });
  } catch {}
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function getGeminiCount() {
  try {
    const counter = await db.dailyCounters.get("gemini");
    return counter && counter.date === todayStr() ? counter.count : 0;
  } catch {
    return 0;
  }
}

export async function setGeminiCount(count) {
  try {
    await db.dailyCounters.put({ id: "gemini", date: todayStr(), count });
  } catch {}
}
