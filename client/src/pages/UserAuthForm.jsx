import AnimationWrapper from '../common/pageAnimation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function UserAuthForm({ type }) {
	return (
		<AnimationWrapper keyvalue={type}>
			<section className="h-cover flex items-center justify-center">
				<form className="w-[80%] max-w-[400px]">
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
