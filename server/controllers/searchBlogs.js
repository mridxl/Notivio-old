import Blog from '../models/Blog.js';
import User from '../models/User.js';

export default async function searchBlogs(req, res) {
	const { tag, query, page, author } = req.body;
	let findQuery;

	if (tag) {
		findQuery = { tags: { $in: [tag.toLowerCase()] }, draft: 'false' };
	} else if (query) {
		// regex helps to search for the query in a case-insensitive manner
		findQuery = { title: new RegExp(query, 'i'), draft: 'false' };
	} else if (author) {
		const user = await User.findOne({
			'personal_info.username': author,
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		findQuery = { author: user._id, draft: 'false' };
	} else {
		return res.status(400).json({ error: 'Invalid Request' });
	}

	const maxLimit = 5;
	const pageNo = page || 1;
	try {
		const blogs = await Blog.find(findQuery)
			.populate(
				'author',
				'personal_info.profile_img personal_info.fullname personal_info.username -_id'
			)
			.sort({ publishedAt: -1 })
			.skip((pageNo - 1) * maxLimit)
			.limit(maxLimit)
			.select('blog_id title des banner activity tags publishedAt -_id');
		return res.json({ blogs });
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
}
