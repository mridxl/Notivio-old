import Blog from '../models/Blog.js';
export default async function trendingBlogs(req, res) {
	try {
		const blogs = await Blog.find({ draft: false })
			.populate(
				'author',
				'personal_info.profile_img personal_info.fullname personal_info.username -_id'
			)
			.sort({
				'activity.total_read': -1,
				'activity.total_like': -1,
				publishedAt: -1,
			})
			.limit(8)
			.select('blog_id title publishedAt activity -_id');
		return res.json({ blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
}
