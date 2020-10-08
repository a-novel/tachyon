import React from 'react';
import css from './Page.module.css';

const Page = ({className, ...props}) => (
	<div className={`${css.wrapper} ${className}`} {...props}/>
);

export default Page;