import { prisma } from '../../utils/prisma.js';
import { HttpError } from '../../utils/httpError.js';
import { ensureBoardMember } from '../boards/board.helpers.js';

async function getTaskWithPermissions(taskId, userId) {
  const task = await prisma.task.findUnique({ include: { list: true }, where: { id: taskId } });
  if (!task) throw new HttpError(404, 'Tarea no encontrada');
  await ensureBoardMember(task.list.boardId, userId);
  return task;
}

export async function createTask(listId, userId, data) {
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new HttpError(404, 'Lista no encontrada');
  await ensureBoardMember(list.boardId, userId);

  if (data.assignedUserId) {
    await ensureBoardMember(list.boardId, data.assignedUserId);
  }

  const last = await prisma.task.findFirst({ where: { listId }, orderBy: { position: 'desc' } });
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'TODO',
      priority: data.priority,
      assignedUserId: data.assignedUserId,
      listId,
      position: last ? last.position + 1 : 0
    }
  });
}

export async function getTask(taskId, userId) {
  const task = await getTaskWithPermissions(taskId, userId);
  return task;
}

export async function updateTask(taskId, userId, data) {
  const task = await getTaskWithPermissions(taskId, userId);

  if (data.assignedUserId) {
    await ensureBoardMember(task.list.boardId, data.assignedUserId);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedUserId: data.assignedUserId ?? null
    }
  });
}

export async function deleteTask(taskId, userId) {
  await getTaskWithPermissions(taskId, userId);
  await prisma.task.delete({ where: { id: taskId } });
  return { ok: true };
}

export async function moveTask(taskId, userId, data) {
  const task = await getTaskWithPermissions(taskId, userId);
  const targetList = await prisma.list.findUnique({ where: { id: data.targetListId } });

  if (!targetList) throw new HttpError(404, 'Lista destino no encontrada');
  await ensureBoardMember(targetList.boardId, userId);

  if (task.list.boardId !== targetList.boardId) {
    throw new HttpError(400, 'No puedes mover tareas entre tableros distintos');
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      listId: data.targetListId,
      status: data.status || task.status,
      position: typeof data.position === 'number' ? data.position : task.position
    }
  });
}
