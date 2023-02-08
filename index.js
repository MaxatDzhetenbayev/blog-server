import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb+srv://Yaboku:<18092002m>@cluster0.eb5nmyz.mongodb.net/?retryWrites=true&w=majority')


app.listen(4000, (err) => {
	if (err) {
		return console.log('server not working')
	}
	console.log('server is OK')
})



app.get("/", (req, res) => {
	res.send('main page')
})



