export function getSessionUserId(token) {
  try {
    if (typeof token !== "string" || token.split(".").length !== 3) return null;
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.userId !== "string" || !/^[a-f0-9]{24}$/i.test(payload.userId || "") || !Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now()) return null;
    return payload.userId;
  } catch {
    return null;
  }
}
