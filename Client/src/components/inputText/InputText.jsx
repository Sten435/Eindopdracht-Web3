import React from 'react';
import { useState } from 'react';

const InputText = ({ placeholder, maxLength, minLength, referace, numberOnly = false, value = null, className }) => {
	const [input, setInput] = useState(value);
	return (
		<input
			placeholder={placeholder}
			maxLength={maxLength}
			minLength={minLength}
			value={input ?? ''}
			onChange={(e) => setInput(numberOnly ? e.target?.value.replace(/[^0-9]/g, '') : e.target?.value)}
			ref={referace}
			className={'inputText ' + className}
			type='text'
		/>
	);
};

export default InputText;
