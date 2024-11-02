import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { unsecureApi } from '../api/api';
import formatPaginationData from '../common/formatPaginationData';
import AnimationWrapper from '../common/pageAnimation';
import BlogPostCard from '../components/BlogPost';
import InpageNavigation from '../components/InpageNavigation';
import NoData from '../components/NoData';
import LoadMoreBtn from '../components/LoadMore';
import userAtom from '../common/states/userAtom';
import Loader from '../components/Loader';
import AboutUser from '../components/About';

const profileInitialState = {
	personal_info: {
		fullname: '',
		email: '',
		username: '',
		bio: '',
		profile_img: '',
	},
	social_links: {},
	account_info: {
		total_posts: 0,
		total_reads: 0,
	},
	joinedAt: '',
};

export default function ProfilePage() {
	const { id } = useParams();
	const [profile, setProfile] = useState(profileInitialState);
	const [loading, setLoading] = useState(true);
	const [blogs, setBlogs] = useState(null);
	const navigate = useNavigate();
	const { user } = useRecoilValue(userAtom);

	const {
		personal_info: { fullname, bio, username: profileUsername, profile_img },
		social_links,
		account_info: { total_posts, total_reads },
		joinedAt,
	} = profile;

	const getUserProfile = async () => {
		setLoading(true);
		try {
			const res = await unsecureApi.get('/get-profile', {
				params: {
					q: id,
				},
			});
			setProfile(res.data.user);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
			if (error.response.status === 404) {
				navigate('/404');
			}
		}
	};

	const searchBlogs = async ({ page = 1 } = {}) => {
		//TODO: Change all post requests to get requests
		try {
			const res = await unsecureApi.post('/search-blogs', {
				author: id,
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

	useEffect(() => {
		setProfile(profileInitialState);
		setBlogs(null);
		getUserProfile();
	}, [id]);

	useEffect(() => {
		if (!loading) {
			searchBlogs();
		}
	}, [id, loading]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
					<div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
						<img
							src={profile_img}
							alt={fullname}
							className="bg-grey w-48 h-48 md:w-32 md:h-32 rounded-full"
						/>
						<h1 className="text-2xl font-medium">@{profileUsername}</h1>
						<p className="text-xl capitalize h-6">{fullname}</p>
						<p>
							{total_posts.toLocaleString()} Blogs -{' '}
							{total_reads.toLocaleString()} Reads
						</p>
						<div className=" flex mt -2 gap-4">
							{user && profileUsername === user.username ? (
								<Link
									to="/settings/edit-profile"
									className="btn-light rounded-md"
								>
									Edit Profile
								</Link>
							) : (
								''
							)}
						</div>
						<AboutUser
							bio={bio}
							joinedAt={joinedAt}
							socials={social_links}
							className="max-md:hidden"
						/>
					</div>
					<div className="max-md:mt-12 w-full">
						<InpageNavigation
							routes={['Blogs Published', 'About']}
							defaultHidden={['About']}
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

							<AboutUser bio={bio} joinedAt={joinedAt} socials={social_links} />
						</InpageNavigation>
					</div>
				</section>
			)}
		</AnimationWrapper>
	);
}
