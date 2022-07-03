import React, { Component } from 'react';
import { Container, Form, Button, Col } from 'react-bootstrap';
import { getUser, updateUser } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import * as Icon from 'react-bootstrap-icons';
import { Croppie } from 'croppie';
import $ from 'jquery';

const { profileImage: defaultProfileImage } = require('../../config.json');

const croppieOptions = {
  showZoomer: true,
  enableOrientation: true,
  mouseWheelZoom: 'ctrl',
  viewport: {
    width: 200,
    height: 200,
    type: 'square',
  },
  boundary: {
    width: '250px',
    height: '250px',
  },
};
// const croppie = document.getElementById('croppie');
// const c = new Croppie(croppie, croppieOptions);

let croppie;
let c;

class EditProfile extends Component {
  state = {
    _id: '',
    name: '',
    melliCode: '',
    phoneNumber: '',
    oldPassword: '',
    password: '',
    repeatPassword: '',
    croppedImage: '',
    isFileUploaded: false,
  };

  async componentDidMount() {
    croppie = document.getElementById('croppie');
    c = new Croppie(croppie, croppieOptions);
    await this.fetchData();
  }

  file = React.createRef();
  croppie = React.createRef();
  img = React.createRef();

  async fetchData() {
    var { _id } = getCurrentUser();

    const { name, melliCode, phoneNumber, profileImage } = await getUser(_id);

    this.setState({
      _id,
      name,
      melliCode,
      phoneNumber: !phoneNumber ? '' : phoneNumber,
      croppedImage: !profileImage ? defaultProfileImage : profileImage,
    });
    // console.log(this.state);
  }

  onFileUpload = (e) => {
    this.setState({ isFileUploaded: true }, () => {
      const reader = new FileReader();
      const file = this.file.current.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        c.bind({ url: reader.result });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    });
  };

  onResult = (e) => {
    c.result('base64').then((base64) => {
      this.setState(
        { croppedImage: base64 },
        () => (this.img.current.src = base64)
      );
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  change(unix, formatted) {
    console.log(unix); // returns timestamp of the selected value, for example.
    console.log(formatted); // returns the selected value in the format you've entered, forexample, "تاریخ: 1396/02/24 ساعت: 18:30".
  }

  async handleSubmit(e) {
    e.preventDefault();
    const {
      _id,
      name,
      phoneNumber,
      croppedImage,
      isFileUploaded,
      oldPassword,
      password,
      repeatPassword,
    } = this.state;
    let data = { name, phoneNumber };
    if (isFileUploaded) data = { ...data, profileImage: croppedImage };
    if (!!oldPassword)
      if (password === repeatPassword)
        data = { ...data, password, oldPassword };
      else {
        alert('رمز ها باهم مطابق نیستند');
        return;
      }
    try {
      // console.log(data);
      await updateUser(_id, data);
      window.location = '/';
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { isFileUploaded, croppedImage } = this.state;
    return (
      <Container className="my-3">
        <Form
          className="text-right rounded-bottom"
          onSubmit={this.handleSubmit.bind(this)}
          className="row"
        >
          <Col>
            <div className="row col-12">
              <div className="col">
                {/* <img ref={this.img} src={croppedImage} /> */}
                <input
                  type="file"
                  id="files"
                  ref={this.file}
                  onChange={this.onFileUpload}
                  className="btn"
                />
              </div>
              <div className="col">
                <div className="" id="croppie"></div>
                <button
                  type="button"
                  disabled={!isFileUploaded}
                  onClick={this.onResult.bind(this)}
                  className=" btn btn-primary col-12 mr-4"
                >
                  بریدن!
                </button>
              </div>
            </div>
          </Col>

          <Col>
            <div class="d-flex justify-content-center mt-4">
              <img
                ref={this.img}
                src={croppedImage}
                className="pic_prof rounded-circle border "
              />
            </div>
            <Form.Group controlId="formBasicEmail" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder=" نام و نام خانوادگی"
                disabled
              />

              <Form.Control
                className="rou-bot"
                value={this.state.name}
                onChange={this.handleChange}
                name="name"
                size="lg"
                type="text"
                placeholder="نام خود را وارد کنید"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="کد ملی"
                disabled
              />

              <Form.Control
                value={this.state.melliCode}
                onChange={this.handleChange}
                disabled
                className="rou-bot bg-white"
                name="melliCode"
                size="lg"
                type="text"
                placeholder="کد ملی"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder=" شماره موبایل "
                disabled
              />

              <Form.Control
                className="rou-bot"
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                name="phoneNumber"
                size="lg"
                type="text"
                placeholder="شماره موبایل را وارد کنید"
              />
            </Form.Group>

            <input
              type="checkbox"
              name="resetPass"
              id="resetPass"
              className="in_lable"
            />

            <label
              for="resetPass"
              className="col-11 ml-4 mr-2 btn btn-primary label_prof"
            >
              تغییر رمز عبور <Icon.ChevronDown className="icon-lab" />
            </label>
            <div id="pass" className="pass_chang">
              <Form.Group controlId="formBasicEmail" className="marg">
                <Form.Label></Form.Label>
                <Form.Control
                  className="hed_calendar"
                  placeholder=" رمز کنونی "
                  disabled
                />

                <Form.Control
                  className="rou-bot"
                  value={this.state.oldPassword}
                  onChange={this.handleChange}
                  name="oldPassword"
                  size="lg"
                  type="password"
                  placeholder="رمز کنونی را وارد کنید"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="marg">
                <Form.Label></Form.Label>
                <Form.Control
                  className="hed_calendar"
                  placeholder=" رمز جدید "
                  disabled
                />

                <Form.Control
                  className="rou-bot"
                  value={this.state.password}
                  onChange={this.handleChange}
                  name="password"
                  size="lg"
                  type="password"
                  placeholder="رمز جدید را وارد کنید"
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="marg">
                <Form.Label></Form.Label>
                <Form.Control
                  className="hed_calendar"
                  placeholder=" تکرار رمز جدید "
                  disabled
                />

                <Form.Control
                  className="rou-bot"
                  value={this.state.repeatPassword}
                  onChange={this.handleChange}
                  name="repeatPassword"
                  size="lg"
                  type="password"
                  placeholder="تکرار رمز جدید را وارد کنید"
                />
              </Form.Group>
            </div>
          </Col>

          <Button
            variant="primary"
            type="submit"
            className="btn btn-primary btn-block mt-5"
          >
            ویرایش اطلاعات
          </Button>
        </Form>
      </Container>
    );
  }
}

export default EditProfile;
