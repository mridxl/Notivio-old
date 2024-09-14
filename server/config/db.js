import mongoose from 'mongoose';
//use dotenv to access environment variables in development
import dotenv from 'dotenv';
dotenv.config();

const dbConnectionString = process.env.MONGO_URI;

export default async function connectDB() {
	try {
		await mongoose.connect(dbConnectionString);
	} catch (error) {
		console.error(error);
	}
}
