import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { regUser, loginUser } from '../services/authService';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';

class Register extends Component {
  state = { name: '', melliCode: '', password: '', repeatPass: '' };

  inputUpdate = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
    console.log(this.state);
  };

  async handleRegister(e) {
    // e.preventDefault();
    const { name, melliCode, repeatPass, password } = this.state;
    if (!name || !melliCode || !repeatPass || !password) {
      return toast.error('*لطفا فیلدها را درست وارد کنید');
    }
    if (password !== repeatPass) {
      return toast.warn('رمز وارد شده با تکرار رمز مطابقط ندارد');
    }
    //this try post user pass to server and login to it
    try {
      await regUser({ name, melliCode, password });
      await loginUser({ melliCode, password });
      window.location = '/';
    } catch (ex) {
      toast.error('خطایی رخ داده است!!');
      console.log(ex.response);
      return;
    }
  }

  render() {
    return (
      //  <div className="register">
      //     <p>reg page works</p>

      //     <input
      //       type="text"
      //       id="name"
      //       placeholder="name"
      //       onChange={this.inputUpdate}
      //     />
      //     <input
      //       type="text"
      //       id="melliCode"
      //       placeholder="melliCode"
      //       onChange={this.inputUpdate}
      //     />

      //     <input
      //       type="text"
      //       id="password"
      //       placeholder="pas"
      //       onChange={this.inputUpdate}
      //     />
      //     <input
      //       type="text"
      //       id="repeatPass"
      //       placeholder="pas"
      //       onChange={this.inputUpdate}
      //     />

      //     <button onClick={this.handleRegister}>ثبت نام</button>

      //     <Link to="/login"> ورود به سامانه</Link>
      //   </div>

      <Form
        className="d-flex flex-column-reverse mt-5 pt-5"
        onSubmit={this.handleRegister.bind(this)}
      >
        <div className="col-3 align-self-center">
          <div className="text-center">
            <Icon.PersonPlus className="text-muted display-1" />
          </div>
          <Form.Text className="text-muted text-center">
            لطفا ثبت نام کنید
          </Form.Text>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              type="text"
              id="name"
              placeholder="نام"
              onChange={this.inputUpdate}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              id="melliCode"
              placeholder="کد ملی"
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

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              id="repeatPass"
              placeholder="پسورد"
              onChange={this.inputUpdate}
            />
          </Form.Group>
          <Link
            className="m-2"
            className="d-flex justify-content-center"
            to="/login"
          >
            ورود{' '}
          </Link>

          <Button
            variant="primary"
            type="button"
            className="col-12"
            onClick={this.handleRegister.bind(this)}
          >
            ثبت نام
          </Button>
        </div>
      </Form>
    );
  }
}

export default Register;
