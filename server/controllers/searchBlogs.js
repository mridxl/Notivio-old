import Blog from '../models/Blog.js';

export default async function searchBlogs(req, res) {
	const { tag, page } = req.body;
	const findQuery = { tags: { $in: [tag.toLowerCase()] }, draft: 'false' };

	const maxLimit = 5;
	try {
		const blogs = await Blog.find(findQuery)
			.populate(
				'author',
				'personal_info.profile_img personal_info.fullname personal_info.username -_id'
			)
			.sort({ publishedAt: -1 })
			.skip((page - 1) * maxLimit)
			.limit(maxLimit)
			.select('blog_id title des banner activity tags publishedAt -_id');
		return res.json({ blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
}
