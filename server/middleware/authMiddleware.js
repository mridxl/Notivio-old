import jwt from 'jsonwebtoken';
export default function (req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.userId;
		next();
	} catch (err) {
		console.error(err);
		res.clearCookie('token');
		return res.status(403).json({ error: 'Invalid Token, Access denied.' });
	}
}
