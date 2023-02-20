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

		return res.json(post)
	} catch (err) {
		console.log(err)
		return res.status(400).json({
			message: 'Не удалось создать пост'
		})
	}
}

export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		return res.status(200).json(posts)
	}
	catch (err) {
		return res.status(404).json({
			message: 'Запрашиваемые посты не были найдены'
		})
	}
}

export const getPopularPosts = async (req, res) => {

	const reqTag = req.query.tag

	try {
		const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec();

		if (reqTag) {
			const postForeach = (posts) => {
				return posts.filter((post) => {
					return post.tags.includes(reqTag)
				})
			}

			const filteredPosts = postForeach(posts)
			return res.status(200).json(filteredPosts)
		}

		return res.status(200).json(posts)
	}
	catch (err) {
		return res.status(404).json({
			message: 'Запрашиваемые посты не были найдены'
		})
	}
}

export const getNewPosts = async (req, res) => {

	const reqTag = req.query.tag

	try {
		const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec();

		if (reqTag) {
			const postForeach = (posts) => {
				return posts.filter((post) => {
					return post.tags.includes(reqTag)
				})
			}

			const filteredPosts = postForeach(posts)
			return res.status(200).json(filteredPosts)
		}

		return res.status(200).json(posts)
	}
	catch (err) {
		return res.status(404).json({
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
				$inc: { viewsCount: 1 }
			},
			{
				returnDocument: 'after'
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не удалось вернуть статью'
					})
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Статья не найдена'
					})
				}

				return res.status(200).json(doc)
			}
		).populate('user').exec();
	} catch (err) {
		console.log(err)
		return res.status(404).json({
			message: 'Запрашиваемый пост не были найдены'
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
				return res.status(500).json({
					message: 'Не удалось удалить статью'
				})
			}
			if (!doc) {
				return res.status(404).json({
					message: 'Не удалось найти статью'
				})
			}

			return res.status(200).json({
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

		return res.status(200).json({
			message: 'Статья обновлена'
		})

	} catch (err) {
		return res.status(500).json({
			message: 'Не удалось обновить статью'
		})

	}

}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts.map(post => post.tags).flat().slice(0.5)

		return res.status(200).json(tags)
	}
	catch (err) {
		return res.status(404).json({
			message: 'Запрашиваемые теги не были найдены'
		})
	}
}

