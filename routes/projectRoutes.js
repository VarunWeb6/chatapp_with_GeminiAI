import {Router} from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/projectController.js';
import * as authMiddleWare from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)

export default router;