import { prisma } from '../../utils/prisma.js';
import { HttpError } from '../../utils/httpError.js';

export async function ensureBoardMember(boardId, userId) {
  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId } }
  });

  if (!membership) throw new HttpError(403, 'No tienes permisos sobre este tablero');
  return membership;
}
