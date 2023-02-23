import CommentModel from '../models/Comment.js'
import PostModel from '../models/Post.js'

export const createComment = async (req, res) => {
	const text = req.body.text
	const user = req.userId

	try {
		const doc = new CommentModel({ text, user: user })

		doc.save()
			.then(() => PostModel.findById(req.params.id))
			.then((post) => {
				post.comments.unshift(doc)
				return post.save()
			})
			.catch((err) => { console.log(err) })

		return res.status(200).json(doc)
	} catch (err) {
		res.status(500).json({ message: 'Не удалось создать комментарий ' + err })
	}
}