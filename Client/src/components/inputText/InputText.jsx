import React from 'react';

const InputText = ({ placeholder, maxLength, minLength }) => {
	return (
		<input
			placeholder={placeholder}
			maxLength={maxLength}
			minLength={minLength}
			className='inputText'
			type='text'
		/>
	);
};

export default InputText;
