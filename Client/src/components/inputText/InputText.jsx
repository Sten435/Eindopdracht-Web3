import React from 'react';

const InputText = ({ placeholder, maxLength, minLength, referace, value = '', numberOnly = false, isEmail = false, className }) => {
	if (numberOnly)
		return (
			<input
				placeholder={placeholder}
				maxLength={maxLength}
				minLength={minLength}
				defaultValue={value}
				ref={referace}
				className={'inputText ' + className}
				min='1'
				max='1000'
				type='number'
			/>
		);

	if (isEmail)
		return (
			<input
				placeholder={placeholder}
				maxLength={maxLength}
				minLength={minLength}
				defaultValue={value}
				ref={referace}
				className={'inputText ' + className}
				type='email'
			/>
		);

	return (
		<input
			placeholder={placeholder}
			maxLength={maxLength}
			minLength={minLength}
			defaultValue={value}
			ref={referace}
			className={'inputText ' + className}
			type='text'
		/>
	);
};

export default InputText;
