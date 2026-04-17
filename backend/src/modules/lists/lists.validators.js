import { body, param } from 'express-validator';

export const boardListValidator = [
  param('boardId').isUUID(),
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre de lista inválido')
];

export const listIdValidator = [param('listId').isUUID().withMessage('listId inválido')];
