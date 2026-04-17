import bcrypt from 'bcryptjs';
import { prisma } from '../../utils/prisma.js';
import { HttpError } from '../../utils/httpError.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser(payload) {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new HttpError(409, 'El email ya está registrado');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword
    }
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(payload) {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new HttpError(401, 'Credenciales inválidas');

  const isValid = await bcrypt.compare(payload.password, user.password);
  if (!isValid) throw new HttpError(401, 'Credenciales inválidas');

  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true }
  });
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}
