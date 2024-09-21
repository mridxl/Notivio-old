import InputBox from './InputBox';

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
		</>
	);
}

export default LoginForm;
