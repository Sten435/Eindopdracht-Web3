import { Routes, Route, Navigate } from 'react-router-dom';

import StudentLogin from '../screens/student/login/Login';
import StudentDashboard from '../screens/student/dashboard/Dashboard';
import StudentOpdracht from '../screens/student/opdracht_element/OpdrachtElement';

import HostDashboard from '../screens/host/dashboard/Dashboard';
import HostOpdracht from '../screens/host/opdracht_element/OpdrachtElement';

import NotFoundScreen from '../screens/error/404';

const Navigator = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/student/login" replace={true} />} />
			<Route path="student/login" element={<StudentLogin />} />
			<Route path="student/dashboard" element={<StudentDashboard />} />
			<Route path="student/opdracht/:id" element={<StudentOpdracht />} />
			<Route path="host/dashboard" element={<HostDashboard />} />
			<Route path="host/opdracht/:id" element={<HostOpdracht />} />
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	);
};

export default Navigator;
