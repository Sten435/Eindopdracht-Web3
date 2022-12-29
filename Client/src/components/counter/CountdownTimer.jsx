import { useState, useEffect } from 'react';

const CountdownTimer = (props) => {
	const [countdown, setCountdown] = useState(props.seconden);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(countdown - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [countdown]);

	if (countdown <= 0) {
		return 'Gedaan';
	}

	const hours = Math.floor(countdown / 3600);
	const minutes = Math.floor((countdown % 3600) / 60);
	const seconds = countdown % 60;
	const hoursString = (hours < 10 ? '0' : '') + hours;
	const minutesString = (minutes < 10 ? '0' : '') + minutes;
	const secondsString = (seconds < 10 ? '0' : '') + seconds;
	const formattedCountdown = (hoursString === '00' ? '' : hoursString + ':') + minutesString + ':' + secondsString;

	return formattedCountdown;
};

export default CountdownTimer;
