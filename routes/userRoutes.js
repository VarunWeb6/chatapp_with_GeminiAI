import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/authMiddleware.js'

const router = Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Email must be a valid email address'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    userController.createUserController
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email must be a valid email address'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    userController.loginController
)

router.get('/profile',
    [
        authMiddleware.authUser,
        userController.profileController
    ]
)

export default router;
