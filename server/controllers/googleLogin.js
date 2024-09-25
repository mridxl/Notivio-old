import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import serviceAccountKey from '../config/firebase-admin-key.json' assert { type: 'json' };
import User from '../models/User.js';
import generateUsername from '../utils/generateUsername.js';
import formatUserResponse from '../utils/formatUserResponse.js';
import generateAccessToken from '../utils/generateAccessToken.js';

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
});

export default async function (req, res) {
	const { accessToken } = req.body;
	let user = null;
	try {
		//verify the token and get the user info
		const decodedUser = await getAuth().verifyIdToken(accessToken);
		const { fullname, email } = decodedUser;

		user = await User.findOne({ 'personal_info.email': email }).select(
			'personal_info.fullname personal_info.profile_img personal_info.username google_auth'
		);

		// if user does not exist, its registered with google
		if (!user) {
			const username = await generateUsername(email);
			user = await User.create({
				personal_info: {
					fullname,
					email,
					username,
				},
				google_auth: true,
			});
		} // if user exists and is not registered with google
		else if (!user.google_auth) {
			return res.status(403).json({
				error:
					'This email is already registered with a different login method. Please login with your email and password',
			});
		}

		generateAccessToken(res, user);
		return res.status(200).json({
			message: 'Logged in with google successfully',
			user: formatUserResponse(user),
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Login with google failed' });
	}
}
