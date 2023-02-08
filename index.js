import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json())

mongoose
	.connect('mongodb+srv://Yaboku:<18092002m>@cluster0.eb5nmyz.mongodb.net/?retryWrites=true&w=majority')
	.then(() => {
		console.log('Mongo DB is OK')
	})
	.catch((err) => {
		console.log('Mongo DB error: ' + err)
	})


app.listen(4000, (err) => {
	if (err) {
		return console.log('server not working')
	}
	console.log('server is OK')
})


app.post('auth/login', (req, res) => {
	console.log(req.body)

	

})




