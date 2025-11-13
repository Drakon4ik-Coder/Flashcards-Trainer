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
    const {name} = parsed.data.name;
    const info = db.prepare("INSERT INTO Decks (user_id, name) VALUES (?, ?)").run(req.user.id, name);
    const deck = db.prepare("SELECT * FROM Decks WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json({deck});
});

export default router;