import { body } from 'express-validator'

export const registerValidation = [
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
	body('fullName').isLength({ min: 2 }),
	body('avatarUrl').isString().optional(),
]

export const loginValidation = [
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
]