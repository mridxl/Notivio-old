import Blog from '../models/Blog.js';
import User from '../models/User.js';

export default async function getBlog(req, res) {
	const { id } = req.query;
	if (!id) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	if (!/^[a-zA-Z0-9-]*$/.test(id)) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	try {
		const blog = await Blog.findOneAndUpdate(
			{ blog_id: id },
			{
				$inc: { 'activity.total_reads': 1 },
			}
		)
			.populate(
				'author',
				'personal_info.fullname personal_info.username personal_info.profile_img -_id'
			)
			.select(
				'title banner des content tags publishedAt activity blog_id -_id'
			);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}
		await User.findOneAndUpdate(
			{ 'personal_info.username': blog.author.personal_info.username },
			{
				$inc: { 'activity_info.total_reads': 1 },
			}
		);
		return res.status(200).json({ blog });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}
