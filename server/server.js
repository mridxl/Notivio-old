import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

const app = express();
const PORT = 3000;

// Connect to mongoDB
connectDB();
// Only starts the server once we're connected to mongoDB
mongoose.connection.once('open', () => {
	console.log(`Connected to mongoDB`);
	app.listen(PORT, () => {
		console.log(`Server is running on port :${PORT}`);
	});
});
