import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {

	try {


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
}

export const login = async (req, res) => {


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
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		const { passwordHash, ...userData } = user._doc;

		res.json(userData);

	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Нет доступа'
		})
	}
}