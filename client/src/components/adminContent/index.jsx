import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Elections from './elections';
import ElectionForm from './electionForm';
import Admins from './admins';

class AdminComponent extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route path="/admin/admins" component={Admins} />
        <Route path="/admin/election/form/:id" component={ElectionForm} />
        <Route path="/admin" component={Elections} />
        {/* <Route component={Dashboard} /> */}
      </Switch>
    );
  }
}

export default AdminComponent;
