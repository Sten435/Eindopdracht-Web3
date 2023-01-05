import { useState, useEffect } from 'react';

const CountdownTimer = ({ seconden, inSeconds, start = true, onEnd = null }) => {
	const [countdown, setCountdown] = useState();

	useEffect(() => {
		if (seconden !== countdown) setCountdown(seconden);
	}, [seconden]);

	useEffect(() => {
		if (!start) return;
		const interval = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		if (countdown <= 0 && onEnd) onEnd();

		return () => clearInterval(interval);
	}, [countdown, seconden]);

	if (countdown <= 0) {
		return;
	}

	const hours = Math.floor(countdown / 3600);
	const minutes = Math.floor((countdown % 3600) / 60);
	const seconds = countdown % 60;
	const hoursString = (hours < 10 ? '0' : '') + hours;
	const minutesString = (minutes < 10 ? '0' : '') + minutes;
	const secondsString = (seconds < 10 ? '0' : '') + seconds;
	const formattedCountdown = (hoursString === '00' ? '' : hoursString + ':') + minutesString + ':' + secondsString;

	if (inSeconds) return countdown;
	return formattedCountdown;
};

export default CountdownTimer;
