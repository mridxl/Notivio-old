import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserAuthForm from './pages/UserAuthForm';

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Navbar />}>
				<Route path="login" element={<UserAuthForm type="Login" />} />
				<Route path="register" element={<UserAuthForm type="Register" />} />
			</Route>
		</Routes>
	);
};

export default App;
