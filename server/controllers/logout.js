export default async function (req, res) {
	const cookies = req?.cookies;
	if (
		!cookies?.token ||
		cookies?.token === 'null' ||
		cookies?.token === 'undefined' ||
		cookies?.token === '' ||
		!cookies
	) {
		return res.sendStatus(204); //No content
	}
	res.clearCookie('token');
	return res.sendStatus(200).json({ message: 'Logged out successfully' });
}
