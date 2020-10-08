import React from 'react';
import css from './App.module.css';
import {goTo, isActive} from './utils/goTo';
import Svg from './components/svg/Svg';
import {KeyboardIcon, SandboxIcon} from './assets/icons';
import {Route, Router} from 'react-router-dom';
import history from './history';

const Header = props => (
	<div className={css.header}>
		<div className={css.headerTitle} onClick={() => goTo('/')}>
			<Svg className={css.headerTitleIcon} component={SandboxIcon}/>Playground
		</div>
		<div className={css.pageTitle}>
			<Router history={history}>
				<Route path='/tachyon-keys'>
					<Svg className={css.pageTitleIcon} component={KeyboardIcon}/>
					<div className={css.pageTitleText}>Keys</div>
				</Route>
			</Router>
		</div>
		<div
			className={`${css.headerLicense} ${isActive('/license', {propRoute: props.location.pathname}) ? css.headerLicenseActive : ''}`}
			onClick={() => goTo('/license')}
		>
			<div className={css.headerLicenceMain}>License MIT</div>
			<div className={css.headerLicenceSub}>by kushuh for a-novel</div>
		</div>
	</div>
);

export default Header;