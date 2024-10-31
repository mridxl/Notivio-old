import { useEffect, useState } from 'react';
import { unsecureApi } from '../api/api';
import AnimationWrapper from '../common/pageAnimation';
import Loader from '../components/Loader';
import BlogPostCard from '../components/BlogPost';
import InpageNavigation, { activeTabRef } from '../components/InpageNavigation';
import MinimalBlogCard from '../components/NoBannerBlogPost';
import NoData from '../components/NoData';
import formatPaginationData from '../common/formatPaginationData';
import LoadMoreBtn from '../components/LoadMore';

export default function Home() {
	const [blogs, setBlogs] = useState(null);
	const [trendingBlogs, setTrendingBlogs] = useState(null);
	const [activeTab, setActiveTab] = useState('home');

	const categories = [
		'Tech',
		'Science',
		'Politics',
		'Sports',
		'Entertainment',
		'Food',
		'Bollywood',
	];

	const fetchBlogs = async ({ page = 1 } = {}) => {
		if (blogs && blogs.page === page) return;
		try {
			const res = await unsecureApi.post('/latest-blogs', { page });
			const formattedData = formatPaginationData({
				currentState: blogs,
				newData: res.data.blogs,
				page,
				limit: 5,
			});
			setBlogs(formattedData);
		} catch (err) {
			console.log(err);
		}
	};
	const fetchTrendingBlogs = async () => {
		try {
			const res = await unsecureApi.get('/trending-blogs');
			setTrendingBlogs(res.data.blogs);
		} catch (err) {
			console.log(err);
		}
	};
	const fetchBlogByCat = async ({ page = 1 } = {}) => {
		try {
			const res = await unsecureApi.post('/search-blogs', {
				tag: activeTab,
				page,
			});
			const formattedData = formatPaginationData({
				currentState: blogs,
				newData: res.data.blogs,
				page,
				limit: 5,
			});
			setBlogs(formattedData);
		} catch (err) {
			console.log(err);
		}
	};
	const showBlogByCat = async (e) => {
		const category = e.target.innerText.toLowerCase();
		if (activeTab === category) {
			setBlogs(null);
			setActiveTab('home');
			return;
		}
		setBlogs(null);
		setActiveTab(category);
	};

	useEffect(() => {
		if (activeTab === 'home') {
			fetchBlogs();
		} else {
			fetchBlogByCat();
		}
		if (!trendingBlogs) fetchTrendingBlogs();

		activeTabRef.current.click();
	}, [activeTab]);

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest Blogs */}
				<div className="w-full">
					<InpageNavigation
						routes={[activeTab, 'trending blogs']}
						defaultHidden={['trending blogs']}
					>
						<>
							{blogs === null ? (
								<Loader />
							) : blogs.results.length ? (
								blogs.results.map((blog, i) => (
									<AnimationWrapper
										transition={{ duration: 1, delay: i * 0.05 }}
										key={i}
									>
										<BlogPostCard
											content={blog}
											author={blog.author.personal_info}
										/>
									</AnimationWrapper>
								))
							) : (
								<NoData message="No blogs found" />
							)}
							<LoadMoreBtn
								state={blogs}
								fetchFunction={
									activeTab === 'home' ? fetchBlogs : fetchBlogByCat
								}
							/>
						</>

						<>
							{trendingBlogs === null ? (
								<Loader />
							) : trendingBlogs.length ? (
								trendingBlogs.map((trendingBlog, i) => (
									<AnimationWrapper
										key={i}
										transition={{ duration: 1, delay: i * 0.05 }}
									>
										<MinimalBlogCard blog={trendingBlog} index={i} />
									</AnimationWrapper>
								))
							) : (
								<NoData message="No trending blogs found" />
							)}
						</>
					</InpageNavigation>
				</div>

				{/* Filters and trending blogs */}
				<div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
					<div className="flex flex-col gap-10">
						<div>
							<h1 className="text-xl font-medium mb-8">
								Stories from all interests
							</h1>
							<div className="flex gap-3 flex-wrap">
								{categories.map((category, i) => (
									<button
										key={i}
										className={
											'tag ' +
											(activeTab === category.toLowerCase()
												? 'bg-black text-white'
												: '')
										}
										onClick={(e) => showBlogByCat(e, category)}
									>
										{category}
									</button>
								))}
							</div>
						</div>

						<div>
							<h1 className="font-medium text-xl mb-8">
								Trending <i className="fi fi-rr-arrow-trend-up"></i>
							</h1>

							<>
								{trendingBlogs === null ? (
									<Loader />
								) : trendingBlogs.length ? (
									trendingBlogs.map((trendingBlog, i) => (
										<AnimationWrapper
											key={i}
											transition={{ duration: 1, delay: i * 0.05 }}
										>
											<MinimalBlogCard blog={trendingBlog} index={i} />
										</AnimationWrapper>
									))
								) : (
									<NoData message="No trending blogs found" />
								)}
							</>
						</div>
					</div>
				</div>
			</section>
		</AnimationWrapper>
	);
}
