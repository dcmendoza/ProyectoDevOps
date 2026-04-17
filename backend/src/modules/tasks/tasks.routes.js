import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { handleValidation } from '../../middleware/validationMiddleware.js';
import * as controller from './tasks.controller.js';
import { createTaskValidator, moveTaskValidator, taskIdValidator } from './tasks.validators.js';

const router = Router();
router.use(requireAuth);

router.post('/lists/:listId/tasks', createTaskValidator, handleValidation, controller.postTask);
router.get('/tasks/:taskId', taskIdValidator, handleValidation, controller.getTaskById);
router.patch(
  '/tasks/:taskId',
  [...taskIdValidator, body('status').optional().isIn(['TODO', 'DOING', 'DONE'])],
  handleValidation,
  controller.patchTask
);
router.delete('/tasks/:taskId', taskIdValidator, handleValidation, controller.removeTask);
router.patch('/tasks/:taskId/move', moveTaskValidator, handleValidation, controller.moveTask);

export default router;
