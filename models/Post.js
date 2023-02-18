import mongoose from 'mongoose';


const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	tags: {
		type: Array,
		default: []
	},
	viesCount: {
		type: Number,
		default: 0
	},
	likesCount: {
		type: Number,
		default: 0
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	image: String,
}, {
	timestamps: true,
})


export default mongoose.model('Post', PostSchema)