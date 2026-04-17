import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { prisma } from '../../utils/prisma.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });
  res.json(users);
});

export default router;
