export default async function (req, res) {
	const cookies = req?.cookies;
	if (!cookies?.token) {
		return res.sendStatus(204); //No content
	}
	res.clearCookie('token');
	return res.sendStatus(200);
}
