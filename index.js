import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from './models/User.js';
import { registerValidation } from './validations/auth.js';

const app = express();

app.use(express.json())

mongoose.set("strictQuery", false);

mongoose
	.connect('mongodb+srv://Yaboku:312359maks@cluster0.eb5nmyz.mongodb.net/blog?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})

app.post('/auth/register', registerValidation, async (req, res) => {

	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign({
			_id: user._id
		},
			'secret123',
			{
				expiresIn: '7d'
			})

		const { passwordHash, ...userData } = user._doc

		res.status(300).json({
			...userData,
			token
		});
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось зарегестрироваться клиенту'
		})
	}
})


app.post('/auth/login', async (req, res) => {


	const user = await UserModel.findOne({ email: req.body.email })

	if (!user) {
		return res.status(404).json({
			message: 'Пользователь не найден'
		})
	}


	const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

	if (!isValidPassword) {
		res.status(400).json({
			message: 'Неверный логин или пароль'
		})
	}


	const token = jwt.sign({
		_id: user._id
	},
		'secret123',
		{
			expiresIn: '7d'
		}
	)

	const { passwordHash, ...userData } = user._doc

	res.status(300).json({
		...userData,
		token
	});
})


app.listen(4000, (err) => {
	if (err) {
		return console.log('server not working')
	}
	console.log('server is OK')
})