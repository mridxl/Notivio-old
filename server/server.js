import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import register from './controllers/register.js';
import login from './controllers/login.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.post('/register', register);
app.post('/login', login);

// Connect to mongoDB
connectDB();
// Only starts the server once we're connected to mongoDB
mongoose.connection.once('open', () => {
	console.log(`Connected to mongoDB`);
	app.listen(PORT, () => {
		console.log(`Server is running on port :${PORT}`);
	});
});
