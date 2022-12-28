import { Routes, Route } from 'react-router-dom';

import StudentLogin from '../screens/login/Login';
import Logout from '../screens/logout/Logout';
import StudentDashboard from '../screens/student/dashboard/Dashboard';
import OpdrachtElement from '../screens/student/opdracht_element/OpdrachtElement';

import HostDashboard from '../screens/host/dashboard/Dashboard';
import HostOpdracht from '../screens/host/opdracht_element/OpdrachtElement';

import NotFoundScreen from '../screens/error/404';
import LoadCSV from '../screens/csv/LoadCSV';

const Navigator = () => {
	return (
		<Routes>
			<Route path="/" element={<StudentLogin />} />
			<Route path="/logout" element={<Logout />} />
			<Route path="student/dashboard" element={<StudentDashboard />} />
			<Route path="student/opdracht/:id" element={<OpdrachtElement />} />
			<Route path="host/dashboard" element={<HostDashboard />} />
			<Route path="host/opdracht/:id" element={<HostOpdracht />} />
			<Route path="/import/opdracht" element={<LoadCSV type="opdracht" />} />
			<Route path="/import/student" element={<LoadCSV type="student" />} />
			<Route path="*" element={<NotFoundScreen />} />
		</Routes>
	);
};

export default Navigator;
