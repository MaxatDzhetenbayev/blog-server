import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'

import { postCreateValidations, registerValidation, loginValidation } from './validations/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { postControllers, userControllers, commentControllers } from './controllers/index.js'

const app = express();


const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Yaboku:312359maks@cluster0.eb5nmyz.mongodb.net/blog?retryWrites=true&w=majority'

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))


const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, 'uploads')
	},
	filename: (_, filename, callback) => {
		callback(null, filename.originalname)
	}
})

const upload = multer({ storage })


mongoose.set("strictQuery", false);

mongoose
	.connect(MONGO_URI,
		{
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})


app.post('/auth/register', registerValidation, handleValidationErrors, userControllers.register);
app.post('/auth/login', loginValidation, handleValidationErrors, userControllers.login);
app.get('/auth/me', checkAuth, userControllers.getMe);

app.get('/tags', postControllers.getLastTags);

app.post('/posts', checkAuth, postCreateValidations, postControllers.createPost);
app.get('/posts', postControllers.getAllPosts);
app.get('/posts/:id', postControllers.getOnePosts);
app.delete('/posts/:id', checkAuth, postControllers.deleteOnePost);
app.patch('/posts/:id', checkAuth, postControllers.updatePost)

app.get('/posts/sort/popular', postControllers.getPopularPosts)
app.get('/posts/sort/news', postControllers.getNewPosts)

app.post('/comment/:id', checkAuth, commentControllers.createComment)


app.post('/uploads', upload.single('image'), (req, res) => {
	try {
		res.status(200).json({
			message: `/uploads/${req.file.originalname}`
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: err
		})
	}
})


app.listen(PORT, (err) => {
	if (err) {
		return console.log('server not working')
	}
	console.log('server is OK')
})