import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../common/states/userAtom';

const ProtectedRoute = ({ children }) => {
	const { isAuth } = useRecoilValue(userAtom);
	let location = useLocation();

	if (!isAuth) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return children;
};

export default ProtectedRoute;
