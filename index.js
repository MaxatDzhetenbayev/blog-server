import express from 'express';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';

import * as userControllers from './controllers/userControllers.js'

const app = express();

app.use(express.json())

app.listen(4000, (err) => {
	if (err) {
		return console.log('server not working')
	}
	console.log('server is OK')
})

mongoose.set("strictQuery", false);

mongoose
	.connect('mongodb+srv://Yaboku:312359maks@cluster0.eb5nmyz.mongodb.net/blog?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})

app.post('/auth/register', registerValidation, userControllers.register);


app.post('/auth/login', userControllers.login);


app.get('/auth/me', checkAuth, userControllers.getMe);


