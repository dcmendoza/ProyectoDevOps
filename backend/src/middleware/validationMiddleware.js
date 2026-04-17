import { validationResult } from 'express-validator';

export function handleValidation(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next({ status: 400, message: 'Datos inválidos', errors: result.array() });
  }
  return next();
}
