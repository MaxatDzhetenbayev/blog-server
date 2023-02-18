import PostModel from '../models/Post.js';

export const createPost = async (req, res) => {

	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			image: req.body.image,
			tags: req.body.tags,
			user: req.userId
		})

		const post = await doc.save();

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(400).json({
			message: 'Не удалось создать пост'
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts.map(post => post.tags).flat().slice(0.5)

		res.status(200).json(tags)
	}
	catch (err) {
		res.status(404).json({
			message: 'Запрашиваемые теги не были найдены'
		})
	}
}

export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.status(200).json(posts)
	}
	catch (err) {
		res.status(404).json({
			message: 'Запрашиваемые посты не были найдены'
		})
	}
}

export const getOnePosts = (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findByIdAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { viesCount: 1 }
			},
			{
				returnDocument: 'after'
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					res.status(500).json({
						message: 'Не удалось вернуть статью'
					})
				}

				if (!doc) {
					res.status(404).json({
						message: 'Статья не найдена'
					})
				}

				res.status(200).json(doc)
			}
		)
	} catch (err) {
		console.log(err)
		res.status(404).json({
			message: 'Запрашиваемые пост не были найдены'
		})
	}
}

export const deleteOnePost = (req, res) => {

	const postId = req.params.id;

	PostModel.findByIdAndDelete(
		{
			_id: postId
		},
		(err, doc) => {
			if (err) {
				res.status(500).json({
					message: 'Не удалось удалить статью'
				})
			}
			if (!doc) {
				res.status(404).json({
					message: 'Не удалось найти статью'
				})
			}

			res.status(200).json({
				messsage: 'Статья удалена'
			})
		}
	)
}

export const updatePost = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				image: req.body.image,
				tags: req.body.tags,
				author: req.userId
			}
		)

		res.json(200).json({
			message: 'Статья обновлена'
		})

	} catch (err) {
		res.json(500).json({
			message: 'Не удалось обновить статью'
		})
	}

}