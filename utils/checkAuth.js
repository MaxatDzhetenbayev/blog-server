import jwt from 'jsonwebtoken'


export default function (req, res, next) {

	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

	if (token) {
		try {
			const decoded = jwt.verify(token, 'secret123')

			req.userId = decoded._id;
			next()

		} catch (err) {
			res.status(403).json({
				message: err
			});
		}
	} else {
		return res.status(403).json({
			message: err
		});
	}
} 