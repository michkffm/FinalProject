import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  const match = /^Bearer ([^ ]+)$/.exec(req.headers.authorization || "");
  if (!match) return res.status(401).json({ error: "Bitte log dich ein." });
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });
    if (typeof payload !== "object" || typeof payload.userId !== "string" || !/^[a-f0-9]{24}$/i.test(payload.userId || "") || !Number.isInteger(payload.tokenVersion) || !Number.isInteger(payload.exp)) return res.status(401).json({ error: "Bitte erneut einloggen." });
    const user = await User.findById(payload.userId).select("+tokenVersion");
    if (!user || user.tokenVersion !== payload.tokenVersion) return res.status(401).json({ error: "Bitte erneut einloggen." });
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError") return res.status(401).json({ error: "Bitte erneut einloggen." });
    next(error);
  }
}
