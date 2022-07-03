import React, { Component } from 'react';
import {
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
  Row,
  Modal,
  Card,
  ListGroup,
} from 'react-bootstrap';
import {
  addElection,
  editElection,
  deleteElection,
  getElectionById,
} from '../../services/electionService';

import {
  addCondid,
  editCondid,
  deleteCondid,
  getCondidateById,
} from '../../services/condidateService';
import { searchUser } from '../../services/userService';
import * as Icon from 'react-bootstrap-icons';
import { DatePicker } from 'react-advance-jalaali-datepicker';
import { Croppie } from 'croppie';
import $ from 'jquery';

const croppieOptions = {
  showZoomer: true,
  enableOrientation: true,
  mouseWheelZoom: 'ctrl',
  viewport: {
    width: 200,
    height: 100,
    type: 'square',
  },
  boundary: {
    width: '300px',
    height: '150px',
  },
};
// const croppie = document.getElementById('croppie');
// const c = new Croppie(croppie, croppieOptions);

let croppie;
let c;

class ElectionForm extends Component {
  state = {
    _id: '',
    title: '',
    startDate: '',
    endDate: '',
    voteLimit: '',
    active: false,
    condidates: [],
    condidSearch: '',
    searchRes: [],
    showModal: false,
    modalData: {
      _id: '',
      name: '',
      melliCode: '',
      slogan: '',
      bio: '',
      promisses: [],
      education: [],
    },
    croppedImage: null,
    isFileUploaded: false,
  };

  async fillPage(id) {
    let {
      title,
      active = false,
      condidates = [],
      endDate = '',
      startDate = '',
      cover = '',
      voteLimit = null,
    } = await getElectionById(id);

    condidates = condidates.map((con) => {
      // console.log(con);
      const { _id, user } = con;
      return { _id, melliCode: user.melliCode, name: user.name };
    });

    this.setState({
      _id: id,
      title,
      active,
      condidates,
      croppedImage: cover,
      endDate,
      startDate,
      voteLimit,
    });
  }

  async componentWillMount() {
    const id = this.props.match.params.id;
    await this.fillPage(id);
    this.setState({ _id: id });
    croppie = document.getElementById('croppie');
    c = new Croppie(croppie, croppieOptions);
  }

  file = React.createRef();
  croppie = React.createRef();
  img = React.createRef();

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
  handleChangeModal = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      modalData: {
        ...prevState.modalData,
        [e.target.name]: e.target.value,
      },
    }));
  };
  handleChangeModalList(id) {
    const res = $(`#${id}`).val();

    if (!!res) {
      this.setState((prevState) => ({
        ...prevState,
        modalData: {
          ...prevState.modalData,
          [id]: [...prevState.modalData[id], res],
        },
      }));
      $(`#${id}`).val('');
    }
  }
  modalListDelete(id, key) {
    var filterd = this.state.modalData[id].filter((it) => it !== key);
    this.setState((prevState) => ({
      ...prevState,
      modalData: {
        ...prevState.modalData,
        [id]: filterd,
      },
    }));
  }
  change(unix, formatted) {
    console.log(unix); // returns timestamp of the selected value, for example.
    console.log(formatted); // returns the selected value in the format you've entered, forexample, "تاریخ: 1396/02/24 ساعت: 18:30".
  }
  DateInput(props) {
    return <input className="popo" {...props} />;
  }
  DateInput1(props) {
    return <input className="popo" {...props} />;
  }

  handleClose() {
    this.setState({
      modalData: {
        _id: '',
        name: '',
        melliCode: '',
        slogan: '',
        bio: '',
        promisses: [],
        education: [],
      },
      showModal: false,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    var cover = this.state.croppedImage;
    // console.log(cover);
    const data = {
      title: this.state.title,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      voteLimit: parseInt(this.state.voteLimit),
      active: this.state.active,
      cover,
    };
    try {
      var res = await editElection(this.state._id, data);
      if (!!res) await this.fillPage(this.state._id);
    } catch (err) {
      console.log(err);
    }
  }
  async handleDelete(e) {
    e.preventDefault();
    try {
      var res = await deleteElection(this.state._id);
      window.location = '/admin/elections';
    } catch (err) {
      console.log(err);
    }
  }

  fillNameInput(e) {
    console.log(e.target.attributes.melliCode);

    $('#condidSearch').val(e.target.attributes.name.value);
    $('#condidSearch').attr('_id', e.target.attributes.id.value);
    $('#condidSearch').attr('melliCode', e.target.attributes.melliCode.value);
  }

  async deleteCondid(id) {
    try {
      await deleteCondid(id);
      await this.fillPage(this.state._id);
    } catch (err) {
      console.log(err);
    }
    // this.setState({
    //   condidates: this.state.condidates.filter((con) => con._id !== id),
    // });
  }
  async openEditCondid(id) {
    try {
      var {
        bio = '',
        education = [],
        promisses = [],
        slogan = '',
        user,
      } = await getCondidateById(id);
      this.setState({
        showModal: true,
        modalData: {
          _id: id,
          name: user.name,
          melliCode: user.melliCode,
          slogan,
          bio,
          promisses,
          education,
        },
      });
    } catch (err) {
      console.log(err);
    }

    // this.props.history.push(`/admin/election/form/${this.state._id}`);
    // window.location = `/vote/${id}`;
    // alert('ed');
  }

  async editCondid() {
    const { _id, slogan, bio, promisses, education } = this.state.modalData;
    try {
      await editCondid(_id, { slogan, bio, promisses, education });
    } catch (err) {
      console.log(err);
    }
    this.handleClose();
  }

  async doneTyping() {
    console.log($('#condidSearch').val());
    if (!!$('#condidSearch').val()) {
      const res = await searchUser($('#condidSearch').val());
      if (!!res) {
        $('#offerLoader').css('display', 'none');
        //drop dowmn clear and fill
        this.setState({ searchRes: res });
        console.log(res);
      }
    } else {
      $('#offerDropdown').css('display', 'none');
      this.setState({ searchRes: [] });
    }
  }
  statetypingTimer = null;

  handleSearchKeyUp() {
    if (this.statetypingTimer != null) {
      clearTimeout(this.statetypingTimer);
    }
    $('#offerLoader').css('display', 'block');
    $('#offerDropdown').css('display', 'block');
    this.statetypingTimer = setTimeout(() => {
      this.doneTyping();
    }, 1000);
    // return () => clearTimeout(this.typingTimer);
  }

  handleBlur() {
    setTimeout(function () {
      $('#offerDropdown').css('display', 'none');
    }, 200);
  }

  async addCondidate() {
    if ($('#condidSearch').val() == '') return;
    const _id = $('#condidSearch').attr('_id');
    const melliCode = $('#condidSearch').attr('melliCode');
    const name = $('#condidSearch').val();
    // this.setState({
    //   condidates: [...this.state.condidates, { _id, melliCode, name }],
    // });
    try {
      await addCondid({ election: this.state._id, user: _id });
      await this.fillPage(this.state._id);
    } catch (err) {
      console.log(err);
    }
    $('#condidSearch').val('');
  }

  render() {
    const { isFileUploaded, croppedImage } = this.state;
    return (
      <Container>
        <Form className="text-right rounded-bottom">
          <Form.Group controlId="formBasicEmail" className="marg">
            <Form.Label></Form.Label>
            <Form.Control
              className="hed_calendar"
              placeholder=" عنوان اتخابات"
              disabled
            />

            <Form.Control
              className="rou-bot"
              value={this.state.title}
              onChange={this.handleChange}
              name="title"
              size="lg"
              type="text"
              placeholder="عنوان را وارد کنید"
            />
          </Form.Group>
          <div className="row col-12">
            <div className="col">
              <img
                ref={this.img}
                src={this.state.croppedImage}
                alt="عکس کاور انتخابات"
                className="img_elec"
              />
              <input
                type="file"
                id="files"
                ref={this.file}
                onChange={this.onFileUpload}
                className=" btn"
              />
            </div>
            <div className="col">
              <div className="" id="croppie"></div>
              <button
                type="button"
                disabled={!isFileUploaded}
                onClick={this.onResult}
                className=" btn btn-primary col-12 mr-4"
              >
                بریدن!
              </button>
            </div>
          </div>
          <div className="mt-4 d-flex flex-row-reverse">
            {/* <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
                    date 
                </Form.Label>
                <InputGroup className="mb-2 col-6">
                  <InputGroup.Prepend className="rounded-left">
                    <InputGroup.Text className="rounded-right"><Icon.Calendar/></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="inlineFormInputGroupUsername2" className=" rounded-left" placeholder="تاریخ" />
                </InputGroup>
              <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
                    date 
                </Form.Label>
                <InputGroup className="mb-2 col-6">
                  <InputGroup.Prepend className="rounded-left">
                    <InputGroup.Text className="rounded-right"><Icon.Calendar/></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl id="inlineFormInputGroupUsername2" className=" rounded-left" placeholder="تاریخ" />
                </InputGroup>


               */}

            <div className="col-6 m-0">
              <InputGroup.Text className="hed_calendar">
                <Icon.Calendar className="mx-1" />
                تاریخ پایان
              </InputGroup.Text>
              <DatePicker
                inputComponent={this.DateInput1}
                placeholder="تاریخ پایان"
                format="jYYYY/jMM/jDD"
                onChange={(unix, formatted) => {
                  this.setState({ endDate: formatted });
                }}
                id="datePicker"
                preSelected={this.state.endDate}
                controllValue="true"
                cancelOnBackgroundClick="true"
              />
            </div>
            <div className="col-6 m-0">
              <InputGroup.Text className="hed_calendar">
                <Icon.Calendar className="mx-1" />
                تاریخ شروع
              </InputGroup.Text>

              <DatePicker
                inputComponent={this.DateInput}
                placeholder=" تاریخ شروع"
                format="jYYYY/jMM/jDD"
                onChange={(unix, formatted) => {
                  this.setState({ startDate: formatted });
                }}
                id="datePicker"
                preSelected={this.state.startDate}
                controllValue="true"
                inputTextAlign=""
                cancelOnBackgroundClick="true"
              />
            </div>
          </div>
          <Form.Group controlId="formBasicEmail" className="marg mt-4">
            <Form.Label></Form.Label>
            <Form.Control
              className="hed_calendar"
              placeholder=" محدودیت تعداد رای"
              disabled
            />

            <Form.Control
              className="form-control form-control-lg rou-bot"
              type="number"
              placeholder=""
              value={this.state.voteLimit}
              onChange={this.handleChange.bind(this)}
              name="voteLimit"
            />
          </Form.Group>

          <Form.Check
            className="marg mt-4 mb-4 row"
            type="checkbox"
            id="custom-switch"
            label="نمایش انتخابات برای کاربر"
            checked={this.state.active}
            name="active"
            onChange={() => {
              this.setState({ active: !this.state.active });
            }}
          />

          <div className="row ml-2" dir="rtl">
            <div
              class="col-12 input-group m-b-10"
              style={{ textAlign: 'center' }}
            >
              <div
                class="col-md-10 col-sm-12 m-sm-b-10"
                style={{ position: 'relative' }}
              >
                <input
                  class="col-12 form-control "
                  name="condidSearch"
                  id="condidSearch"
                  onKeyUp={this.handleSearchKeyUp.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  type="text"
                />

                <div
                  id="offerDropdown"
                  style={{
                    display: 'none',
                    zIndex: '200',
                    overflow: 'scroll',
                    position: 'absolute',
                    top: '100%',
                    left: '0px',
                    right: '0px',
                  }}
                >
                  <ul id="offerItems" class="list-group">
                    <li
                      id="offerLoader"
                      class="list-group-item"
                      style={{ display: 'none' }}
                    >
                      <div class="loader-dark"></div>
                    </li>
                    {this.state.searchRes.map((item) => {
                      return (
                        <li
                          class="list-group-item cursor-pointer"
                          onClick={this.fillNameInput.bind(this)}
                          id={item._id}
                          name={item.name}
                          melliCode={item.melliCode}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div
                onClick={this.addCondidate.bind(this)}
                class="btn btn-primary col-11 col-md-2 col-sm-11 m-auto"
              >
                اضافه کردن
              </div>
            </div>

            <div class="col-sm-12 col-md-10 text-center m-auto">
              <table class="table resTex responsiveText my-4">
                <thead>
                  <tr>
                    <th scope="col">نام</th>
                    <th scope="col">کدملی</th>
                    <th scope="col" colSpan="2">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody id="allowedPeopleTable">
                  {this.state.condidates.map((con) => {
                    return (
                      <tr v-for="person in accessList">
                        <td>{con.name}</td>
                        <td>{con.melliCode}</td>
                        <td
                          class="cursor-pointer"
                          onClick={this.openEditCondid.bind(this, con._id)}
                        >
                          <Icon.Pen />
                        </td>
                        <td
                          class="cursor-pointer"
                          onClick={this.deleteCondid.bind(this, con._id)}
                        >
                          <Icon.Trash />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {this.state.condidates.length === 0 && (
                <div className="col-12 text-center m-b-5 m-t-10 m-4">
                  <span> فردی وجود ندارد ...! </span>
                </div>
              )}
            </div>
          </div>
          <div className="marg mb-4">
            <Button
              variant="primary"
              type="button"
              onClick={this.handleSubmit.bind(this)}
              className="btn btn-primary btn-lg btn-block"
            >
              ارسال
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={this.handleDelete.bind(this)}
              className="btn btn-danger btn-lg btn-block"
            >
              حذف انتخابات
            </Button>
          </div>
        </Form>
        <Modal
          scrollable="true"
          size="lg"
          show={this.state.showModal}
          onHide={this.handleClose.bind(this)}
        >
          <Modal.Header>
            <Modal.Title>
              {'  ویرایش کاندید'} {this.state.modalData.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-right">
            <Form.Group controlId="slogan" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="کد ملی"
                disabled
              />

              <Form.Control
                className="rou-bot"
                value={this.state.modalData.melliCode}
                onChange={this.handleChangeModal}
                name="mellicode"
                size="lg"
                disabled
                type="text"
                placeholder="کد ملی"
              />
            </Form.Group>
            <Form.Group controlId="slogan" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="شعار انتخاباتی"
                disabled
              />

              <Form.Control
                className="rou-bot"
                value={this.state.modalData.slogan}
                onChange={this.handleChangeModal}
                name="slogan"
                size="lg"
                type="text"
                placeholder="شعار انتخاباتی"
              />
            </Form.Group>

            <Form.Group controlId="bio" className="marg">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="بیوگرافی"
                disabled
              />

              <Form.Control
                className="rou-bot"
                value={this.state.modalData.bio}
                onChange={this.handleChangeModal}
                name="bio"
                size="lg"
                type="text"
                placeholder="بیوگرافی"
              />
            </Form.Group>

            <Form.Group className="marg row">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="تحصیلات"
                disabled
              />

              <Card className="col-12">
                <ListGroup variant="flush">
                  {this.state.modalData.education.map((pr) => {
                    return (
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>{pr}</span>
                        <Button
                          onClick={this.modalListDelete.bind(
                            this,
                            'education',
                            pr
                          )}
                          variant="outline-danger"
                        >
                          حذف
                        </Button>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
              <Form.Control
                className="rou-bot col-10"
                name="education"
                id="education"
                size="lg"
                type="text"
                placeholder=" تحصیلات جدید"
              />
              <Button
                className="col-2"
                onClick={this.handleChangeModalList.bind(this, 'education')}
              >
                {' '}
                افزودن
              </Button>
            </Form.Group>

            <Form.Group className="marg row">
              <Form.Label></Form.Label>
              <Form.Control
                className="hed_calendar"
                placeholder="وعده ها"
                disabled
              />

              <Card className="col-12">
                <ListGroup variant="flush">
                  {this.state.modalData.promisses.map((pr) => {
                    return (
                      <ListGroup.Item>
                        {pr}
                        <Button
                          onClick={this.modalListDelete.bind(
                            this,
                            'promisses',
                            pr
                          )}
                          variant="outline-danger"
                        >
                          حذف
                        </Button>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
              <Form.Control
                className="rou-bot col-10"
                id="promisses"
                name="promisses"
                size="lg"
                type="text"
                placeholder="وعده ی جدید"
              />
              <Button
                className="col-2"
                onClick={this.handleChangeModalList.bind(this, 'promisses')}
              >
                {' '}
                افزودن
              </Button>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
              بستن
            </Button>
            <Button variant="primary" onClick={this.editCondid.bind(this)}>
              ثبت تغییرات
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default ElectionForm;
