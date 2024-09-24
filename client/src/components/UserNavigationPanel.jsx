import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Toaster, toast } from 'react-hot-toast';
import AnimationWrapper from '../common/pageAnimation';
import userAtom from '../common/states/userAtom';
import api from '../api/api';

function UserNavigationPanel() {
	const setUserAuth = useSetRecoilState(userAtom);

	const handleLogout = async () => {
		try {
			await api.get('/auth/logout');
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Failed to logout');
		}
		setUserAuth({
			isAuth: false,
			user: null,
		});
	};
	const {
		user: { username },
	} = useRecoilValue(userAtom);
	return (
		<AnimationWrapper
			transition={{ duration: 0.2 }}
			className="absolute right-0 z-50"
		>
			<Toaster />

			<div className="absolute bg-white right-0 border border-grey w-60 duration-200">
				<Link to="/editor" className="flex gap-2 link pl-8 py-4 md:hidden">
					<i className="fi fi-rr-edit"></i>
					<p>Write</p>
				</Link>
				<Link to={`/user/${username}`} className="link pl-8 py-4 md:hidden">
					Profile
				</Link>
				<Link to="/dashboard/blogs" className="link pl-8 py-4 md:hidden">
					Dashboard
				</Link>
				<Link to="/settings/edit-profile" className="link pl-8 py-4 md:hidden">
					Settings
				</Link>
				<span className="absolute border-t border-grey w-[100%] md:hidden"></span>
				<button
					className="text-left p-4 hover:bg-grey w-full pl-8"
					onClick={handleLogout}
				>
					<h1 className="font-bold text-xl mb-1">Sign Out</h1>
					<p className="text-dark-grey">@{username}</p>
				</button>
			</div>
		</AnimationWrapper>
	);
}

export default UserNavigationPanel;
