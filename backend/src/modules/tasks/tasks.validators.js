import { body, param } from 'express-validator';

const statusValues = ['TODO', 'DOING', 'DONE'];

export const createTaskValidator = [
  param('listId').isUUID(),
  body('title').trim().isLength({ min: 2 }).withMessage('Título inválido'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('assignedUserId').optional().isUUID()
];

export const taskIdValidator = [param('taskId').isUUID()];

export const moveTaskValidator = [
  ...taskIdValidator,
  body('targetListId').isUUID(),
  body('status').optional().isIn(statusValues),
  body('position').optional().isInt({ min: 0 })
];
