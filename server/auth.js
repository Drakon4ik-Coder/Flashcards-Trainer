import { Router } from "express";
import db from "../db.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = "token";

function signToken(user) {
    return jwt.sign({
        sub: user.id,
        email: user.email
    }, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.HTTPS || false,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

router.post("/auth/register", async (req, res) => {
    const RegisterSchema = z.object({
        email: z.email(),
        password: z.string().min(8)
    });
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid email or password" });

    const { email, password } = parsed.data;
    const exists = db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const info = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, hash);
    const user = db.prepare("SELECT id, email, created_at FROM users WHERE id = ?").get(info.lastInsertRowid);

    const token = signToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ user });
});