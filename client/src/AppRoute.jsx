import React from 'react';
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/login';
import register from './components/register';
import App from './App';
import { decodeToken } from './services/tokenService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Edited By M.Asg
const AppRoute = () => (
  <BrowserRouter>
    <ToastContainer autoClose={2500} />
    <Switch>
      {/* <AdminRoute path="/admin" component={AdminPage} /> */}

      <Route
        exact
        path="/login"
        render={(props) => {
          if (!!decodeToken() && !!decodeToken()._id) {
            // toast.info('.شما اخیرا وارد سیستم شده اید');
            return <Redirect to="/" />;
          } else {
            return <Login />;
          }
        }}
      />
      <Route path="/register" exact component={register} />
      <Route
        path="/"
        render={(props) => {
          if (!!decodeToken() && !!decodeToken()._id) {
            return <App></App>;
          } else {
            toast.info(' لطفا وارد سامانه شوید');
            return <Redirect to="/login" />;
          }
        }}
      />
    </Switch>
  </BrowserRouter>
);

export default AppRoute;
