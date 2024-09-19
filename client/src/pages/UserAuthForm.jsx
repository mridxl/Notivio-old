import { Toaster, toast } from 'react-hot-toast';
import AnimationWrapper from '../common/pageAnimation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { registerSchema, loginSchema } from '../common/types/zodTypes';
import errorMessage from '../common/types/zodMessage';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../common/states/userAtom';
import api from '../api/api';

function UserAuthForm({ type }) {
	const { isAuth, user } = useRecoilValue(userAtom);
	const setUserAuth = useSetRecoilState(userAtom);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location?.state?.from || '/';

	useEffect(() => {
		if (isAuth && user) {
			navigate(from);
		}
	}, [navigate, isAuth, from]);

	const userAuth = async (route, data) => {
		try {
			const res = await api.post(route, data);
			return res.data;
		} catch (error) {
			toast.error(error?.response?.data.error || 'Something went wrong');
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
				toast.error(errorMessage(parsedData));
			}
			const res = await userAuth('/login', loginData);
			if (res) {
				setUserAuth({ isAuth: true, user: res.user });
			}
		} else {
			const { fullname, email, password } = data;
			const registerData = { fullname, email, password };
			const parsedData = registerSchema.safeParse(registerData);
			if (!parsedData.success) {
				toast.error(errorMessage(parsedData));
				return;
			}
			const res = await userAuth('/register', registerData);
			if (res) {
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
				</form>
			</section>
		</AnimationWrapper>
	);
}

export default UserAuthForm;
