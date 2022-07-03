import React, { Component } from 'react';
import { Container, Form, Button, Modal, Col, Row } from 'react-bootstrap';
import {
  searchUser,
  getAdmins,
  setAdmin,
  unSetAdmin,
} from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import * as Icon from 'react-bootstrap-icons';
import $ from 'jquery';

class Admins extends Component {
  state = {
    admins: [],
    adminSearch: '',
    searchRes: [],
  };

  async fillTable() {
    const data = await getAdmins();

    const newData = data.map((usr) => {
      const { _id, name, melliCode, profileImage } = usr;
      var currentUser = getCurrentUser();
      var you = false;
      if (currentUser._id == usr._id) {
        you = true;
      }
      return { _id, name, melliCode, profileImage, you };
    });

    this.setState({ admins: newData });
    console.log(data);
  }

  async componentDidMount() {
    await this.fillTable();
  }

  fillNameInput(e) {
    console.log(e.target.attributes.mellicode);

    $('#adminSearch').val(e.target.attributes.name.value);
    $('#adminSearch').attr('_id', e.target.attributes.id.value);
    $('#adminSearch').attr('mellicode', e.target.attributes.mellicode.value);
  }

  async doneTyping() {
    console.log($('#adminSearch').val());
    if (!!$('#adminSearch').val()) {
      const res = await searchUser($('#adminSearch').val());
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

  async addAdmin() {
    const _id = $('#adminSearch').attr('_id');
    const melliCode = $('#adminSearch').attr('mellicode');
    const name = $('#adminSearch').val();
    try {
      const res = await setAdmin(melliCode);
      await this.fillTable();
    } catch (error) {
      console.log(error);
    }
    // console.log(res);
    // const profileImage = '';
    // this.setState({
    //   admins: [...this.state.admins, { _id, melliCode, name, profileImage }],
    // });
    // $('#adminSearch').val('');
  }

  async deleteAdmin(melliCode) {
    try {
      const res = await unSetAdmin(melliCode);
      await this.fillTable();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Container>
        <h3 className="mt-4 marg-add text-right">اضافه کردن ادمین</h3>
        <div class="row" dir="rtl">
          <div
            class="col-12 input-group m-b-10"
            style={{ textAlign: 'center' }}
          >
            <div
              class="col-md-10 col-sm-12 m-sm-b-10"
              style={{ position: 'relative' }}
            >
              <input
                class="col-12 form-control"
                name="adminSearch"
                id="adminSearch"
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
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        mellicode={item.melliCode}
                        onClick={this.fillNameInput.bind(this)}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div
              onClick={this.addAdmin.bind(this)}
              class="btn btn-primary col-11 col-md-2 col-sm-11 m-auto"
            >
              اضافه کردن
            </div>
          </div>

          <div class="col-sm-12 col-md-10 text-center m-auto">
            <table class="my-4 table resTex responsiveText">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">نام</th>
                  <th scope="col">کدملی</th>
                  <th scope="col">عملیات</th>
                </tr>
              </thead>
              <tbody id="allowedPeopleTable">
                {this.state.admins.map((con) => {
                  return (
                    <tr key={con._id}>
                      <td>
                        <img
                          className="rounded-circle border img_sdmins"
                          src={con.profileImage}
                        />
                      </td>
                      <td>{con.name}</td>
                      <td>{con.melliCode}</td>
                      <td>
                        {!con.you && (
                          <Icon.Trash
                            className="cursor-pointer"
                            onClick={this.deleteAdmin.bind(this, con.melliCode)}
                          />
                        )}
                        {con.you && 'اکانت شما'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {this.state.admins.length === 0 && (
              <div class="col-12 text-center m-b-5 m-t-10">
                <span> فردی وجود ندارد ...! </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    );
  }
}

export default Admins;
