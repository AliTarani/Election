import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { loginUser } from '../services/authService';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

class Login extends Component {
  state = { username: '', password: '' };

  inputUpdate = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
    console.log(this.state);
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) {
      toast.error('*لطفا فیلدها را درست وارد کنید');
    } else {
      //this try post user pass to server and login to it
      try {
        await loginUser({ melliCode: username, password });
        window.location = '/';
        window.location.hash = '/';
      } catch (ex) {
        toast.error('خطایی رخ داده است!!');
        return;
      }
    }
  };

  render() {
    return (
      // <div className="login">
      //   <p>login page works</p>
      //   <input
      //     type="text"
      //     id="username"
      //     placeholder="user"
      //     onChange={this.inputUpdate}
      //   />

      //   <input
      //     type="text"
      //     id="password"
      //     placeholder="pas"
      //     onChange={this.inputUpdate}
      //   />

      //   <Button onClick={this.handleLogin}>ورود</Button>

      //   <Link to="/register">ثبت نام در سامانه</Link>
      // </div>

      // className="login"
      <Form
        className="d-flex flex-column-reverse mt-5 pt-5"
        onSubmit={this.handleLogin}
      >
        <div className="col-3 align-self-center">
          <div className="text-center">
            <Icon.Person className="text-muted display-1" />
          </div>
          <Form.Text className="text-muted text-center">
            لطفا وارد شوید
          </Form.Text>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="نام کاربری"
              id="username"
              onChange={this.inputUpdate}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="پسورد"
              id="password"
              onChange={this.inputUpdate}
            />
          </Form.Group>
          <Link
            className="m-2"
            className="d-flex justify-content-center"
            to="/register"
          >
            ثبت نام{' '}
          </Link>

          <Button variant="primary" type="submit" className="col-12">
            ورود
          </Button>
        </div>
      </Form>
    );
  }
}

export default Login;
