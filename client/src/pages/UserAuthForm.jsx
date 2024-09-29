import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { registerSchema, loginSchema } from '../common/types/zodTypes';
import api from '../api/api';
import errorMessage from '../common/types/zodMessage';
import userAtom from '../common/states/userAtom';
import AnimationWrapper from '../common/pageAnimation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

function UserAuthForm({ type }) {
	const { isAuth, user } = useRecoilValue(userAtom);
	const setUserAuth = useSetRecoilState(userAtom);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const from = location?.state?.from || '/';
		if (isAuth && user) {
			navigate(from);
		}
	}, [navigate, isAuth]);

	const userAuth = async (type, data) => {
		const route = `/auth${type}`;
		const toastId = toast.loading('Authenticating...');
		try {
			const res = await api.post(route, data);
			toast.success(res.data.message, {
				id: toastId,
			});
			return res.data;
		} catch (error) {
			toast.error(error?.response?.data.error || 'Something went wrong', {
				id: toastId,
			});
			setUserAuth({ isAuth: false, user: null });
			return null;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		if (type === 'Login') {
			const { email, password } = data;
			const loginData = { email, password };
			const parsedData = loginSchema.safeParse(loginData);

			if (!parsedData.success) {
				return toast.error(errorMessage(parsedData));
			} else {
				const res = await userAuth('/login', loginData);
				if (!res) return;
				setUserAuth({ isAuth: true, user: res.user });
			}
		} else {
			const { fullname, email, password } = data;
			const registerData = { fullname, email, password };
			const parsedData = registerSchema.safeParse(registerData);
			if (!parsedData.success) {
				return toast.error(errorMessage(parsedData));
			} else {
				const res = await userAuth('/register', registerData);
				if (!res) return;
				setUserAuth({ isAuth: true, user: res.user });
			}
		}
	};
	return (
		<AnimationWrapper keyvalue={type}>
			<section className="h-cover flex items-center justify-center">
				<Toaster />
				<form
					className="w-[80%] max-w-[400px]"
					onSubmit={handleSubmit}
					noValidate
				>
					<h1 className="text-4xl font-gelasio capitalize text-center mb-14 pr-1">
						{type === 'Login' ? 'Welcome Back!' : 'Join Us Today'}
					</h1>

					{type !== 'Login' ? <RegisterForm /> : <LoginForm />}

					<div className="relative w-full flex items-center gap-2 my-10 uppercase text-black font-bold opacity-30">
						<hr className="w-1/2 border-black" />
						<p>Or</p>
						<hr className="w-1/2 border-black" />
					</div>
					<GoogleLoginButton />

					{type !== 'Login' ? (
						<>
							<p className="mt-6 text-dark-grey text-xl text-center">
								Already have an account?
								<Link to="/login" className="underline text-black text-xl ml-1">
									Login
								</Link>
							</p>
						</>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don't have an account?
							<Link
								to="/register"
								className="underline text-black text-xl ml-1"
							>
								Register
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
}

export default UserAuthForm;
