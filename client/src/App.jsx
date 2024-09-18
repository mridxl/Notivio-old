import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import UserAuthForm from './pages/UserAuthForm';
import Editor from './pages/Editor';
import { RecoilRoot } from 'recoil';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
	return (
		<RecoilRoot>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="login" element={<UserAuthForm type="Login" />} />
					<Route path="register" element={<UserAuthForm type="Register" />} />
					<Route
						path="editor"
						element={
							<ProtectedRoute>
								<Editor />
							</ProtectedRoute>
						}
					/>
				</Route>
			</Routes>
		</RecoilRoot>
	);
};

export default App;
