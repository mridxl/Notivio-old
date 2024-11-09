import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import latestBlogs from './controllers/latestBlogs.js';
import trendingBlogs from './controllers/trendingBlogs.js';
import createBlog from './controllers/createBlog.js';
import searchBlogs from './controllers/searchBlogs.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import searchUsers from './controllers/searchUsers.js';
import getProfile from './controllers/getProfile.js';
import getBlog from './controllers/getBlog.js';

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

app.use('/auth', authRoutes);
app.post('/latest-blogs', latestBlogs);
app.get('/trending-blogs', trendingBlogs);
app.post('/search-blogs', searchBlogs);
app.get('/get-blog', getBlog);
app.post('/create-blog', authMiddleware, createBlog);
app.get('/search-users', searchUsers);
app.get('/get-profile', getProfile);

// Connect to mongoDB
connectDB();
// Only starts the server once we're connected to mongoDB
mongoose.connection.once('open', () => {
	console.log(`Connected to mongoDB`);
	app.listen(PORT, () => {
		console.log(`Server is running on port :${PORT}`);
	});
});
