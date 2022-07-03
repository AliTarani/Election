import React, { Component } from 'react';
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';
import election from './election';
import VoteComponent from './voting';
import ElectionHistory from './electionHistory';
import EditProfile from './editProfile';

class UserComponent extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route path="/profile" component={EditProfile} />
        <Route path="/history" component={ElectionHistory} />
        <Route path="/vote/:id" component={VoteComponent} />
        <Route path="/" component={election} />
        {/* <Route component={Dashboard} /> */}
      </Switch>
    );
  }
}

export default UserComponent;
