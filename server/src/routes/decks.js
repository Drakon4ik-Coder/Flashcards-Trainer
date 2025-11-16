import {Router} from 'express';
import db from '../db.js';
import {z} from 'zod';
import {requireAuth} from '../requireAuth.js';

const router = Router();

router.use(requireAuth);

// Create a new deck
router.post('/decks', (req, res) => {
    const DeckSchema = z.object({
        name: z.string().trim().min(1).max(255)
    });
    const parsed = DeckSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error: 'Invalid deck name'});
    const {name} = parsed.data;
    const info = db.prepare("INSERT INTO decks (user_id, name) VALUES (?, ?)").run(req.user.id, name);
    const deck = db.prepare("SELECT * FROM decks WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json({deck});
});

router.get('/decks', (req, res) => {
    const decks = db.prepare("SELECT * FROM decks WHERE user_id = ? ORDER BY decks.created_at DESC").all(req.user.id);
    res.json({decks});
});

router.get('/decks/:id', (req, res) => {
    const deck = db.prepare("SELECT * FROM decks WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
    if (!deck) return res.status(404).json({error: 'Deck not found'});
    res.json({deck});
});

router.delete('/decks/:id', (req, res) => {
    const info = db.prepare("DELETE FROM decks WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
    if (info.changes === 0) return res.status(404).json({error: 'Deck not found'});
    res.status(204).end();
});

export default router;