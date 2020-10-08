import React from 'react';
import css from './Title.module.css';

const Title = ({className, ...props}) => (
	<div className={`${css.wrapper} ${className}`} {...props}/>
);

export default Title;