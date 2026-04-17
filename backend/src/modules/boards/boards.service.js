import { prisma } from '../../utils/prisma.js';
import { HttpError } from '../../utils/httpError.js';
import { ensureBoardMember } from './board.helpers.js';

export function getUserBoards(userId) {
  return prisma.board.findMany({
    where: { members: { some: { userId } } },
    orderBy: { createdAt: 'desc' },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { lists: true } }
    }
  });
}

export async function createBoard(userId, data) {
  return prisma.board.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: userId,
      members: { create: { userId, role: 'OWNER' } }
    }
  });
}

export async function getBoardDetail(boardId, userId) {
  await ensureBoardMember(boardId, userId);
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      lists: { include: { tasks: true }, orderBy: { position: 'asc' } }
    }
  });
  if (!board) throw new HttpError(404, 'Tablero no encontrado');
  return board;
}

export async function updateBoard(boardId, userId, data) {
  const membership = await ensureBoardMember(boardId, userId);
  if (membership.role !== 'OWNER') throw new HttpError(403, 'Solo el owner puede editar el tablero');

  return prisma.board.update({
    where: { id: boardId },
    data: { name: data.name, description: data.description }
  });
}

export async function deleteBoard(boardId, userId) {
  const membership = await ensureBoardMember(boardId, userId);
  if (membership.role !== 'OWNER') throw new HttpError(403, 'Solo el owner puede eliminar el tablero');

  await prisma.board.delete({ where: { id: boardId } });
  return { ok: true };
}

export async function addMember(boardId, userId, email) {
  const membership = await ensureBoardMember(boardId, userId);
  if (membership.role !== 'OWNER') throw new HttpError(403, 'Solo el owner puede agregar miembros');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(404, 'Usuario no encontrado');

  return prisma.boardMember.upsert({
    where: { boardId_userId: { boardId, userId: user.id } },
    update: {},
    create: { boardId, userId: user.id, role: 'MEMBER' },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
}

export async function listMembers(boardId, userId) {
  await ensureBoardMember(boardId, userId);
  return prisma.boardMember.findMany({
    where: { boardId },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
}
