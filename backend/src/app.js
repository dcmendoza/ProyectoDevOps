import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import boardsRoutes from './modules/boards/boards.routes.js';
import listsRoutes from './modules/lists/lists.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api', listsRoutes);
app.use('/api', tasksRoutes);
app.use('/api/users', usersRoutes);

app.use(notFound);
app.use(errorHandler);
