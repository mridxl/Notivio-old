import React from 'react';
import InputBox from '../components/InputBox';
import AnimationWrapper from '../common/pageAnimation';
import googleIcon from '../imgs/google.png';
import { Link } from 'react-router-dom';

function UserAuthForm({ type }) {
	return (
		<AnimationWrapper keyvalue={type}>
			<section className="h-cover flex items-center justify-center">
				<form className="w-[80%] max-w-[400px]">
					<h1 className="text-4xl font-gelasio capitalize text-center mb-14 pr-1">
						{type === 'Login' ? 'Welcome Back!' : 'Join Us Today'}
					</h1>
					{type !== 'Login' ? (
						<>
							<InputBox
								name="fullName"
								type="text"
								placeholder="Full Name"
								icon="fi-rr-circle-user text-1xl"
							/>
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
								{type}
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
						</>
					) : (
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
								{type}
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
						</>
					)}
					{type === 'Login' ? (
						<>
							<p className="mt-6 text-dark-grey text-xl text-center">
								Don't have an account?
								<Link
									to="/register"
									className="underline text-black text-xl ml-1"
								>
									Join us today
								</Link>
							</p>
						</>
					) : (
						<>
							<p className="mt-6 text-dark-grey text-xl text-center">
								Already have an account?
								<Link to="/login" className="underline text-black text-xl ml-1">
									Login
								</Link>
							</p>
						</>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
}

export default UserAuthForm;
