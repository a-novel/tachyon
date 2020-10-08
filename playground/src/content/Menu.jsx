import React from 'react';
import css from './Menu.module.css';
import {goTo, isActive} from "../utils/goTo";

const Menu = props => (
	<div className={css.wrapper}>
		<div className={css.menuTitle}>Choose a module</div>
		<div
			className={`${css.row} ${isActive('/tachyon-keys', {propRoute: props.location.pathname}) ? css.rowActive : ''}`}
			onClick={() => goTo('/tachyon-keys')}
		>
			Tachyon keys
		</div>
	</div>
);

export default Menu;