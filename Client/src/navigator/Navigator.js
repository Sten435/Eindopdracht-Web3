import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../screens/login/Login';
import Logout from '../screens/logout/Logout';
import StudentDashboard from '../screens/student/dashboard/Dashboard';
import OpdrachtElement from '../screens/student/opdracht_element/OpdrachtElement';

import HostDashboard from '../screens/host/dashboard/Dashboard';
import HostOpdracht from '../screens/host/opdracht_element/OpdrachtElement';

import AdminDashboard from '../screens/admin/dashboard/Dashboard';
import AdminOpdracht from '../screens/admin/opdracht/Opdracht';
import AdminRapport from '../screens/admin/rapport/Rapport';
import AdminStudent from '../screens/admin/student/Student';

import NotFoundScreen from '../screens/error/404';
import LoadCSV from '../screens/csv/LoadCSV';

const Navigator = () => {
	return (
		<Routes>
			<Route
				path='/'
				element={<Login />}
			/>
			<Route
				path='/logout'
				element={<Logout />}
			/>
			<Route
				path='student'
				element={<Navigate to='/student/dashboard' />}
			/>
			<Route
				path='student/dashboard'
				element={<StudentDashboard />}
			/>
			<Route
				path='student/opdracht/:id'
				element={<OpdrachtElement />}
			/>
			<Route
				path='host'
				element={<Navigate to='/host/dashboard' />}
			/>
			<Route
				path='host/dashboard'
				element={<HostDashboard />}
			/>
			<Route
				path='host/opdracht/:id'
				element={<HostOpdracht />}
			/>
			<Route
				path='admin'
				element={<Navigate to='/admin/dashboard' />}
			/>
			<Route
				path='admin/dashboard'
				element={<AdminDashboard />}
			/>
			<Route
				path='admin/opdracht'
				element={<AdminOpdracht />}
			/>
			<Route
				path='admin/rapport'
				element={<AdminRapport />}
			/>
			<Route
				path='admin/student'
				element={<AdminStudent />}
			/>
			<Route
				path='/import/opdracht'
				element={<LoadCSV type='opdracht' />}
			/>
			<Route
				path='/import/student'
				element={<LoadCSV type='student' />}
			/>
			<Route
				path='*'
				element={<NotFoundScreen />}
			/>
		</Routes>
	);
};

export default Navigator;
