import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { handleValidation } from '../../middleware/validationMiddleware.js';
import * as controller from './boards.controller.js';
import { addMemberValidator, boardIdValidator, createBoardValidator } from './boards.validators.js';

const router = Router();

router.use(requireAuth);

router.get('/', controller.getBoards);
router.post('/', createBoardValidator, handleValidation, controller.createBoard);
router.get('/:boardId', boardIdValidator, handleValidation, controller.getBoard);
router.patch(
  '/:boardId',
  [...boardIdValidator, body('name').optional().isLength({ min: 2 })],
  handleValidation,
  controller.patchBoard
);
router.delete('/:boardId', boardIdValidator, handleValidation, controller.removeBoard);
router.post('/:boardId/members', addMemberValidator, handleValidation, controller.postMember);
router.get('/:boardId/members', boardIdValidator, handleValidation, controller.getMembers);

export default router;
