import { Routes, Route, Navigate } from 'react-router-dom';

import StudentLogin from '../screens/student/login/Login';
import StudentDashboard from '../screens/student/dashboard/Dashboard';

import NotFoundScreen from '../screens/error/404';

const Navigator = () => {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<Navigate
						to='/student/login'
						replace={true}
					/>
				}
			/>
			<Route path='student'>
				<Route
					path='login'
					element={<StudentLogin />}
				/>
				<Route
					path='dashboard'
					element={<StudentDashboard />}
				/>
			</Route>
			<Route
				path='*'
				element={<NotFoundScreen />}
			/>
		</Routes>
	);
};

export default Navigator;
