import Database from "better-sqlite3";

const db = new Database("flashcards.db");
db.pragma("foreign_keys = ON");           // enforce FK constraints

export default db;
