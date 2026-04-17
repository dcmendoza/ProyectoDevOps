import { prisma } from '../../utils/prisma.js';
import { HttpError } from '../../utils/httpError.js';
import { ensureBoardMember } from '../boards/board.helpers.js';

export async function getBoardLists(boardId, userId) {
  await ensureBoardMember(boardId, userId);
  return prisma.list.findMany({
    where: { boardId },
    orderBy: { position: 'asc' },
    include: { tasks: { orderBy: { position: 'asc' } } }
  });
}

export async function createList(boardId, userId, data) {
  await ensureBoardMember(boardId, userId);
  const last = await prisma.list.findFirst({ where: { boardId }, orderBy: { position: 'desc' } });

  return prisma.list.create({
    data: {
      name: data.name,
      boardId,
      position: last ? last.position + 1 : 0
    }
  });
}

export async function updateList(listId, userId, data) {
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new HttpError(404, 'Lista no encontrada');
  await ensureBoardMember(list.boardId, userId);

  return prisma.list.update({ where: { id: listId }, data: { name: data.name } });
}

export async function deleteList(listId, userId) {
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new HttpError(404, 'Lista no encontrada');
  await ensureBoardMember(list.boardId, userId);

  await prisma.list.delete({ where: { id: listId } });
  return { ok: true };
}
