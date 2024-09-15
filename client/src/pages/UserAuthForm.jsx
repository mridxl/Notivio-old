import { Toaster, toast } from 'react-hot-toast';
import AnimationWrapper from '../common/pageAnimation';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import { registerSchema, loginSchema } from '../common/types/zodTypes';
import errorMessage from '../common/types/zodMessage';

import axios from 'axios';
const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true, // Ensure cookies are sent with requests
});

function UserAuthForm({ type }) {
	const userAuth = async (route, data) => {
		try {
			const res = await api.post(route, data);
			return res.data;
		} catch (error) {
			toast.error(error?.response?.data.error || 'Something went wrong');
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
		} else {
			const { fullname, email, password } = data;
			const registerData = { fullname, email, password };
			const parsedData = registerSchema.safeParse(registerData);
			if (!parsedData.success) {
				toast.error(errorMessage(parsedData));
				return;
			}
			const res = await userAuth('/register', registerData);
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
