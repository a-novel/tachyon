import React from 'react';
import css from './Svg.module.css';

const Svg = ({component, children, className, ...props}) => (
	<div className={`${css.container} ${className}`} {...props}>
		{component ? React.createElement(component) : children}
	</div>
);

export default Svg;