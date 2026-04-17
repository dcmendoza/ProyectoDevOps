import { body, param } from 'express-validator';

export const createBoardValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre de tablero inválido'),
  body('description').optional().trim().isLength({ max: 300 })
];

export const boardIdValidator = [param('boardId').isUUID().withMessage('boardId inválido')];

export const addMemberValidator = [
  ...boardIdValidator,
  body('email').isEmail().withMessage('Email inválido')
];
