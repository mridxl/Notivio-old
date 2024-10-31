import { Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Layout from './Layout';
import ProtectedRoute from './components/ProtectedRoute';
import UserAuthForm from './pages/UserAuthForm';
import Editor from './pages/Editor';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import PageNotFound from './pages/404';

const App = () => {
	return (
		<RecoilRoot>
			<Routes>
				<Route
					path="/editor"
					element={
						<ProtectedRoute>
							<Editor />
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="login" element={<UserAuthForm type="Login" />} />
					<Route path="register" element={<UserAuthForm type="Register" />} />
					<Route path="search/:query" element={<SearchPage />} />
					<Route path="*" element={<PageNotFound />} />
				</Route>
			</Routes>
		</RecoilRoot>
	);
};

export default App;
