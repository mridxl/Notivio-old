import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../common/states/userAtom';

const ProtectedRoute = ({ children }) => {
	const { isAuth, user } = useRecoilValue(userAtom);
	let location = useLocation();

	if (!isAuth || !user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return children;
};

export default ProtectedRoute;
