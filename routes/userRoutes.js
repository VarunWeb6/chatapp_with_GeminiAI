import { Router } from 'express'
import * as userController from '../controllers/userController.js'
import { body } from 'express-validator'

const router = Router()

router.post('/register', 
        body('email').isEmail().withMessage('Email must be valid email address'),
        body('password').isLength({min : 3}).withMessage('Password must be at least 8 characters long'),
    userController.createUserController)

export default router