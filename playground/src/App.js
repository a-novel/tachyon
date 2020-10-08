import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import history from './history';
import Home from './content/Home';
import css from './App.module.css';
import License from './content/License';
import Header from './Header';

function App() {
  return (
    <div className={css.page}>
      <Router history={history}>
        <Route path='/' component={Header}/>
        <Switch>
          <Route exact path='/license' component={License}/>
          <Route path='/' component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
