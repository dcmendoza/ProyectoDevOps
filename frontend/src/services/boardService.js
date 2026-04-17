import { apiFetch } from './api.js';

export const boardService = {
  getBoards: (token) => apiFetch('/boards', { token }),
  createBoard: (token, body) => apiFetch('/boards', { token, method: 'POST', body }),
  getBoard: (token, boardId) => apiFetch(`/boards/${boardId}`, { token }),
  getMembers: (token, boardId) => apiFetch(`/boards/${boardId}/members`, { token }),
  createList: (token, boardId, body) => apiFetch(`/boards/${boardId}/lists`, { token, method: 'POST', body })
};
