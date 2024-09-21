import InputBox from './InputBox';

function RegisterForm() {
	return (
		<>
			<InputBox
				name="fullname"
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
				Register
			</button>
		</>
	);
}

export default RegisterForm;
