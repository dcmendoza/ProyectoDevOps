import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next({ status: 401, message: 'Token no proporcionado' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId, email: decoded.email };
    return next();
  } catch {
    return next({ status: 401, message: 'Token inválido' });
  }
}
