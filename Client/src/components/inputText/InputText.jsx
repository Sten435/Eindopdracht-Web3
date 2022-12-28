import React from 'react';

const InputText = ({ placeholder, maxLength, minLength, referace, className }) => {
	return <input placeholder={placeholder} maxLength={maxLength} minLength={minLength} ref={referace} className={'inputText ' + className} type="text" />;
};

export default InputText;
