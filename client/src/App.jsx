import React, { Component } from 'react';
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { decodeToken } from './services/tokenService';
import Header from './components/header';
import UserContent from './components/userContent';
import AdminContent from './components/adminContent';

class App extends Component {
  state = { name: '' };
  render() {
    return (
      <div className="App">
        <Header />
        <div className="content">
          <Switch>
            <Route
              path="/admin"
              render={(props) => {
                if (!!decodeToken() && !!decodeToken().isAdmin) {
                  return <AdminContent />;
                } else {
                  toast.warn('عدم دسترسی');
                  return <Redirect to="/" />;
                }
              }}
            />
            <Route path="/" component={UserContent} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
