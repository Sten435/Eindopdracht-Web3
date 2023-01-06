import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GaTerug from '../gaTerug/GaTerug';

const Header = ({ title, name, metTerugButton = false, metLogoutButton = false }) => {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<header className='sticky top-0 z-10 w-full drop-shadow-md'>
			<nav className='flex flex-wrap items-center justify-between p-4 bg-white'>
				<div className='w-auto order-2 lg:text-center block'>
					<h1 className='text-xl font-semibold text-gray-800 font-heading drop-shadow-sm'>
						<span
							className='underline underline-offset-2 cursor-pointer'
							onClick={() => {
								if (location.pathname.includes('student')) {
									return navigate('/host');
								} else if (location.pathname.includes('host')) {
									return navigate('/admin');
								}

								navigate('/student');
							}}>
							{title && title.toUpperCase()}
						</span>
						{name && <span className='hidden sm:inline-block'> - {name.toUpperCase()}</span>}
					</h1>
				</div>
				<div className='w-fit navbar-menu lg:order-1 lg:block lg:w-2/5'>
					<div className='block lg:inline-block lg:mt-0'>
						{metTerugButton && !metLogoutButton && (
							<GaTerug
								className='drop-shadow-sm'
								backgroundKleur='bg-gray-700'
								text='Ga Terug'
							/>
						)}
						{metLogoutButton && !metTerugButton && (
							<GaTerug
								text='Logout'
								to='/logout'
							/>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
