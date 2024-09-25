import { useSetRecoilState } from 'recoil';
import { toast } from 'react-hot-toast';
import api from '../api/api';
import userAtom from '../common/states/userAtom';
import googleIcon from '../imgs/google.png';
import { signInWithGoogle } from '../common/firebase';

export default function GoogleLoginButton() {
	const setUserAuth = useSetRecoilState(userAtom);

	const handleLoginSuccess = async (user) => {
		const { accessToken } = user;

		try {
			const res = await api.post('/auth/google', {
				accessToken,
			});
			const { user } = res.data;
			setUserAuth({ isAuth: true, user });
			toast.success('Login successful!');
		} catch (error) {
			if (error?.response?.status === 403) {
				toast.error(
					'This email is already registered with a different login method. Please login with your email and password'
				);
			} else toast.error('Login failed');
			setUserAuth({ isAuth: false, user: null });
		}
	};

	const handleGoogleLogin = async () => {
		let user = await signInWithGoogle();
		if (!user) toast.error('Login failed');
		else handleLoginSuccess(user);
	};
	return (
		<button
			className="btn-dark flex items-center justify-center gap-4 w-[70%] center"
			onClick={() => handleGoogleLogin()}
			type="button"
		>
			<img src={googleIcon} alt="Google" className="w-5" />
			Continue with Google
		</button>
	);
}
