import React from 'react';
import css from './Paragraph.module.css';

const Paragraph = ({className, ...props}) => (
	<div className={`${css.wrapper} ${className}`} {...props}/>
);

export default Paragraph;