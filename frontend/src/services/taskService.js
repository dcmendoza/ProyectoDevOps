import { apiFetch } from './api.js';

export const taskService = {
  createTask: (token, listId, body) => apiFetch(`/lists/${listId}/tasks`, { token, method: 'POST', body }),
  updateTask: (token, taskId, body) => apiFetch(`/tasks/${taskId}`, { token, method: 'PATCH', body }),
  moveTask: (token, taskId, body) => apiFetch(`/tasks/${taskId}/move`, { token, method: 'PATCH', body }),
  deleteTask: (token, taskId) => apiFetch(`/tasks/${taskId}`, { token, method: 'DELETE' })
};
