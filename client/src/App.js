import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Landing from './components/layout/landing';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Alert from './components/layout/alert';
import './App.css';
import { loadUser } from './actions/auth';
import setAuthToken from './assistant/setAuthenToken';
//Redux-- notre fournisseur de store
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // [] :  Cela veut dire que notre Effect ne depend d'aucune valeur  des accessoire ou de l'etat,
  // donc il n'a donc jamais besoin de se réexécuté

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
