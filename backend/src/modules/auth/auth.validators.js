import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre inválido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínima de 6 caracteres')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];
