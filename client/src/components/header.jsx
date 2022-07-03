import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import React, { Component } from 'react';
import { logOut, getCurrentUser } from '../services/authService';
import { getUser } from '../services/userService';
import * as Icon from 'react-bootstrap-icons';
import { Navbar, Nav } from 'react-bootstrap';
import config from '../config.json';

//import js/jquery.min.js

class Header extends Component {
  state = {};
  getTodayDate() {
    var today = new Date().toLocaleDateString('fa-IR');
    var today = new Date()
      .toLocaleDateString('fa-IR')
      .replace(/([۰-۹])/g, (token) =>
        String.fromCharCode(token.charCodeAt(0) - 1728)
      );
    return today;
  }

  logOutHandler() {
    logOut();
    window.location.hash = '/';
  }

  async componentWillMount() {
    var { _id } = getCurrentUser();
    var { profileImage, name } = await getUser(_id);
    name = name ? name : 'کاربر عزیز';
    profileImage = profileImage ? profileImage : config.profileImage;

    this.setState({ name, profileImage });
  }

  render() {
    return (
      <header>
        <Navbar
          className=""
          collapseOnSelect
          expand="lg"
          bg="light"
          variant="light"
        >
          <img
            style={{ width: '60px', height: '60px', borderRadius: '10px' }}
            src="/images/logo.png"
            alt=""
          />
          <Navbar.Brand>سامانه انتخابات آنلاین</Navbar.Brand>

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              activeKey="/"
              onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
              className="mr-auto col"
            >
              <Nav.Link
                className="navitem"
                as={NavLink}
                exact
                to="/"
                activeClassName="activeNav"
              >
                خانه
              </Nav.Link>

              <Nav.Link
                className="navitem"
                as={NavLink}
                exact
                to="/history"
                activeClassName="activeNav"
              >
                تاریخچه
              </Nav.Link>
              {/* <Nav.Link
                className="navitem"
                as={NavLink}
                exact
                to="/profile"
                activeClassName="activeNav"
              >
                پروفایل
              </Nav.Link> */}

              <Switch>
                <Route
                  path="/"
                  render={(props) => {
                    if (!!getCurrentUser() && !!getCurrentUser().isAdmin) {
                      return (
                        <React.Fragment>
                          <Nav.Link
                            className="navitem"
                            as={NavLink}
                            exact
                            to="/admin/elections"
                            activeClassName="activeNav"
                          >
                            پنل انتخابات
                          </Nav.Link>
                          <Nav.Link
                            className="navitem"
                            as={NavLink}
                            exact
                            to="/admin/admins"
                            activeClassName="activeNav"
                          >
                            ادمین ها
                          </Nav.Link>
                        </React.Fragment>
                      );
                    }
                  }}
                />
              </Switch>
            </Nav>
            <Nav.Link>{this.getTodayDate()}</Nav.Link>
          </Navbar.Collapse>

          <Nav.Link
            as={NavLink}
            exact
            to="/profile"
            className="p-0 d-flex align-items-center"
            activeClassName="activeNav prof"
          >
            <div
              style={{
                display: 'inline-block',
                height: '40px',
                width: '40px',
                marginRight: '30px',
                borderRadius: '50%',
                border: '2px solid #007bff',
                overflow: 'hidden',
                textAlign: 'center',
                verticalAlign: 'middle',
              }}
            >
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.profileImage}
                alt=""
              />
            </div>
            <span className="mx-3">{this.state.name}</span>
          </Nav.Link>
          <span
            style={{
              fontSize: '23px',
              color: '#dc3545',
              cursor: 'pointer',
            }}
            className=" mx-2"
          >
            <Icon.Power onClick={this.logOutHandler} />
          </span>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </Navbar>
      </header>
    );
  }
}

export default Header;
