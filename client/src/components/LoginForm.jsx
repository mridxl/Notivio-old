import InputBox from './InputBox';
import googleIcon from '../imgs/google.png';
import { Link } from 'react-router-dom';

function LoginForm() {
	return (
		<>
			<InputBox
				name="email"
				type="email"
				placeholder="Email"
				icon="fi-rr-envelope"
			/>
			<InputBox
				name="password"
				type="password"
				placeholder="Password"
				icon="fi-rr-key"
			/>
			<button className="btn-dark mt-14 center" type="submit">
				Login
			</button>
			<div className="relative w-full flex items-center gap-2 my-10 uppercase text-black font-bold opacity-30">
				<hr className="w-1/2 border-black" />
				<p>Or</p>
				<hr className="w-1/2 border-black" />
			</div>
			<button className="btn-dark flex items-center justify-center gap-4 w-[70%] center">
				<img src={googleIcon} alt="Google" className="w-5" />
				Continue with Google
			</button>
			<p className="mt-6 text-dark-grey text-xl text-center">
				Don't have an account?
				<Link to="/register" className="underline text-black text-xl ml-1">
					Join us today
				</Link>
			</p>
		</>
	);
}

export default LoginForm;