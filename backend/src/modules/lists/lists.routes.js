import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { handleValidation } from '../../middleware/validationMiddleware.js';
import * as controller from './lists.controller.js';
import { boardListValidator, listIdValidator } from './lists.validators.js';

const router = Router();
router.use(requireAuth);

router.get('/boards/:boardId/lists', [param('boardId').isUUID()], handleValidation, controller.getLists);
router.post('/boards/:boardId/lists', boardListValidator, handleValidation, controller.postList);
router.patch('/lists/:listId', [...listIdValidator, body('name').trim().isLength({ min: 2 })], handleValidation, controller.patchList);
router.delete('/lists/:listId', listIdValidator, handleValidation, controller.removeList);

export default router;
