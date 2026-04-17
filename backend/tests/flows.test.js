import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '../src/modules/auth/auth.service.js';
import { createBoard } from '../src/modules/boards/boards.service.js';
import { createList } from '../src/modules/lists/lists.service.js';
import { createTask, moveTask } from '../src/modules/tasks/tasks.service.js';
import { HttpError } from '../src/utils/httpError.js';

const state = {
  users: [{ id: 'u1', email: 'ana@demo.com', name: 'Ana', password: '$2a$10$x5NQj67rIhFVdYfkc9x67OrAG8h89hlyu4WSaNXR8A6o9vcpV3ka6' }],
  boards: [],
  members: [],
  lists: [],
  tasks: []
};

vi.mock('../src/utils/prisma.js', () => {
  const prisma = {
    user: {
      findUnique: vi.fn(async ({ where }) => state.users.find((u) => u.email === where.email || u.id === where.id) || null),
      create: vi.fn(async ({ data }) => {
        const user = { id: `u${state.users.length + 1}`, ...data };
        state.users.push(user);
        return user;
      })
    },
    board: {
      create: vi.fn(async ({ data }) => {
        const board = { id: `b${state.boards.length + 1}`, ...data };
        state.boards.push(board);
        return board;
      })
    },
    boardMember: {
      findUnique: vi.fn(async ({ where }) => state.members.find((m) => m.boardId === where.boardId_userId.boardId && m.userId === where.boardId_userId.userId) || null)
    },
    list: {
      findFirst: vi.fn(async ({ where }) => state.lists.filter((l) => l.boardId === where.boardId).at(-1) || null),
      create: vi.fn(async ({ data }) => {
        const list = { id: `l${state.lists.length + 1}`, ...data };
        state.lists.push(list);
        return list;
      }),
      findUnique: vi.fn(async ({ where }) => state.lists.find((l) => l.id === where.id) || null)
    },
    task: {
      findFirst: vi.fn(async ({ where }) => state.tasks.filter((t) => t.listId === where.listId).at(-1) || null),
      create: vi.fn(async ({ data }) => {
        const task = { id: `t${state.tasks.length + 1}`, ...data };
        state.tasks.push(task);
        return task;
      }),
      findUnique: vi.fn(async ({ where }) => {
        const task = state.tasks.find((t) => t.id === where.id);
        if (!task) return null;
        const list = state.lists.find((l) => l.id === task.listId);
        return { ...task, list };
      }),
      update: vi.fn(async ({ where, data }) => {
        const idx = state.tasks.findIndex((t) => t.id === where.id);
        state.tasks[idx] = { ...state.tasks[idx], ...data };
        return state.tasks[idx];
      })
    }
  };
  return { prisma };
});

describe('flujos de negocio backend', () => {
  beforeEach(() => {
    state.boards = [];
    state.members = [];
    state.lists = [];
    state.tasks = [];
  });

  it('registra usuario', async () => {
    const result = await registerUser({ name: 'Pedro', email: 'pedro@demo.com', password: 'password123' });
    expect(result.user.email).toBe('pedro@demo.com');
    expect(result.token).toBeTypeOf('string');
  });

  it('crea tablero, lista, tarea y mueve tarea', async () => {
    const board = await createBoard('u1', { name: 'Board', description: '' });
    state.members.push({ boardId: board.id, userId: 'u1', role: 'OWNER' });
    const list = await createList(board.id, 'u1', { name: 'To Do' });
    const task = await createTask(list.id, 'u1', { title: 'Task' });
    const moved = await moveTask(task.id, 'u1', { targetListId: list.id, status: 'DOING', position: 1 });

    expect(board.name).toBe('Board');
    expect(list.name).toBe('To Do');
    expect(task.title).toBe('Task');
    expect(moved.status).toBe('DOING');
  });

  it('valida permisos de tablero', async () => {
    const board = await createBoard('u1', { name: 'Privado' });
    await expect(createList(board.id, 'u2', { name: 'Oops' })).rejects.toThrow(HttpError);
  });
});
