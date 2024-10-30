import { Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Layout from './Layout';
import ProtectedRoute from './components/ProtectedRoute';
import UserAuthForm from './pages/UserAuthForm';
import Editor from './pages/Editor';
import Home from './pages/Home';

const App = () => {
	return (
		<RecoilRoot>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="login" element={<UserAuthForm type="Login" />} />
					<Route path="register" element={<UserAuthForm type="Register" />} />
				</Route>
				<Route
					path="/editor"
					element={
						<ProtectedRoute>
							<Editor />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</RecoilRoot>
	);
};

export default App;
