import jwt from "jsonwebtoken";
import db from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = "token";

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "unauthenticated" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare("SELECT id, email FROM users WHERE id = ?").get(payload.sub);
    if (!user) return res.status(401).json({ error: "unauthenticated" });
    req.user = user; // attach current user to request
    next();
  } catch {
    return res.status(401).json({ error: "unauthenticated" });
  }
}
