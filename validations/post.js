import { body } from 'express-validator'

export const postCreateValidations = [
	body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
	body('tags', 'Неверный формат тегов (формат тегов массив)').isArray(),
	body('image').optional().isString(),
]