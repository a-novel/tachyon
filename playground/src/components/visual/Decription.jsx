import React from 'react';
import css from './Description.module.css';

const Description = ({className, ...props}) => (
	<div className={`${css.container} ${className}`} {...props}/>
);

export default Description;