import { useSetRecoilState } from 'recoil';
import { toast } from 'react-hot-toast';
import api from '../api/api';
import userAtom from '../common/states/userAtom';
import googleIcon from '../imgs/google.png';

export default function GoogleLoginButton() {
	const setUserAuth = useSetRecoilState(userAtom);
	const handleLoginSuccess = async (tokenResponse) => {
		console.log(tokenResponse);

		try {
			const res = await api.post('/auth/google', {
				code: tokenResponse,
			});
			if (res) {
				setUserAuth({ isAuth: true, user: res.user });
			}
			toast.success('Login successful!');
		} catch (error) {
			console.error(error);
			toast.error('Login failed');
		}
	};

	// const handleGoogleLogin = TODO: Implement Google Login

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
