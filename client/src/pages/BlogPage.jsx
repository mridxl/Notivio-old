import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { unsecureApi } from '../api/api.js';
import formatDate from '../common/date.jsx';
import blogPageAtom from '../common/states/blogPageAtom.js';
import AnimationWrapper from '../common/pageAnimation.jsx';
import Loader from '../components/Loader.jsx';
import BlogPostCard from '../components/BlogPost.jsx';
import BlogInteraction from '../components/BlogInteraction.jsx';
import BlogContent from '../components/BlogContent.jsx';

export default function BlogPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [blog, setBlog] = useRecoilState(blogPageAtom);
	const [similarBlogs, setSimilarBlogs] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const {
		title,
		content,
		des,
		author: {
			personal_info: { fullname, username, profile_img },
		},
		tags,
		publishedAt,
		banner,
	} = blog;

	useEffect(() => {
		const getSimilarBlogs = async (tag) => {
			try {
				const res = await unsecureApi.post('/search-blogs', { tag });
				const filteredBlogs = res.data.blogs.filter(
					(blog) => blog.blog_id !== id
				);
				setSimilarBlogs(filteredBlogs);
			} catch (err) {
				console.log(err);
			}
		};
		const getBlog = async () => {
			setLoading(true);
			setSimilarBlogs(null);
			setError(false);
			try {
				const res = await unsecureApi.get(`/get-blog?id=${id}`);
				setBlog(res.data.blog);
				getSimilarBlogs(res.data.blog.tags[0]);
			} catch (err) {
				console.log(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		getBlog();
	}, [id]);

	useEffect(() => {
		if (error) {
			navigate('/404');
		}
	}, [error]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
					<img src={banner} alt="banner image" className="aspect-video" />
					<div className="mt-12">
						<h2>{title}</h2>
						<div className="flex max-sm:flex-col justify-between my-8">
							<div className="flex gap-5 items-start">
								<img
									src={profile_img}
									alt="profile"
									className="rounded-full w-12 h-12"
								/>
								<p className="capitalize">
									{fullname}
									<br />@
									<Link to={`/user/${username}`} className="underline">
										{username}
									</Link>
								</p>
							</div>
							<p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
								Published on {formatDate(publishedAt)}
							</p>
						</div>
					</div>
					<BlogInteraction />
					<BlogContent />
					<BlogInteraction />
					{similarBlogs && similarBlogs.length > 0 && (
						<>
							<h1 className="text-2xl mt-14 mb-10 font-medium">
								Similar Blogs
							</h1>
							{similarBlogs.map((blog, i) => {
								const blogAuthor = blog.author.personal_info;

								return (
									<AnimationWrapper
										key={blog.blog_id}
										transition={{ duration: 1, delay: i * 0.08 }}
									>
										<BlogPostCard content={blog} author={blogAuthor} />
									</AnimationWrapper>
								);
							})}
						</>
					)}
				</div>
			)}
		</AnimationWrapper>
	);
}
