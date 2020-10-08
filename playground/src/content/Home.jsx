import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import history from '../history';
import css from './Home.module.css';
import Menu from './Menu';
import Keys from './modules/Keys';

const Home = () => {
	return (
		<div className={css.wrapper}>
			<Router history={history}>
				<Route path='/' component={Menu}/>
				<Switch>
					<Route path='/tachyon-keys' component={Keys}/>
				</Switch>
			</Router>
		</div>
	);
};

export default Home;