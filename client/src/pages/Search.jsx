import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unsecureApi } from '../api/api';
import AnimationWrapper from '../common/pageAnimation';
import Loader from '../components/Loader';
import BlogPostCard from '../components/BlogPost';
import InpageNavigation, { activeTabRef } from '../components/InpageNavigation';
import NoData from '../components/NoData';
import LoadMoreBtn from '../components/LoadMore';
import formatPaginationData from '../common/formatPaginationData';
import UserCard from '../components/UserCard';

export default function SearchPage() {
	const { query } = useParams();
	const [blogs, setBlogs] = useState(null);
	const [users, setUsers] = useState(null);

	const searchBlogs = async ({ page = 1, createNew = false } = {}) => {
		//TODO: Change all post requests to get requests
		try {
			const res = await unsecureApi.post('/search-blogs', { query, page });
			const formattedData = formatPaginationData({
				currentState: blogs,
				newData: res.data.blogs,
				page,
				limit: 5,
				createNew,
			});
			setBlogs(formattedData);
		} catch (err) {
			console.log(err);
		}
	};

	const searchUsers = async () => {
		try {
			const res = await unsecureApi.get('/search-users', {
				params: {
					q: query,
				},
			});
			setUsers(res.data.users);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		setBlogs(null);
		setUsers(null);
		searchBlogs({ createNew: true });
		searchUsers();
	}, [query]);

	const UserCardWrapper = () => {
		return (
			<>
				{users === null ? (
					<Loader />
				) : users.length ? (
					users.map((user, i) => (
						<AnimationWrapper
							transition={{ duration: 1, delay: i * 0.05 }}
							key={i}
						>
							<UserCard user={user} />
						</AnimationWrapper>
					))
				) : (
					<NoData message="No users found" />
				)}
			</>
		);
	};

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Blog Search */}
				<div className="w-full">
					<InpageNavigation
						routes={[`Search results for "${query}"`, 'Accounts Matched']}
						defaultHidden={['Accounts Matched']}
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
							<LoadMoreBtn state={blogs} fetchFunction={searchBlogs} />
						</>
						<UserCardWrapper />
					</InpageNavigation>
				</div>
				<div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
					<h1 className="font-medium text-xl mb-8">
						User related to search <i className="fi fi-rr-user mt-1"></i>
					</h1>

					<UserCardWrapper />
				</div>
			</section>
		</AnimationWrapper>
	);
}
