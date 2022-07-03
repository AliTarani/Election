import React, { Component } from 'react';
import { getElectionById, vote } from '../../services/electionService';
import { getCondidateById } from '../../services/condidateService';
import { toast } from 'react-toastify';
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  Button,
  Modal,
} from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';
import config from '../../config.json';

class Voting extends Component {
  state = {
    showModal: false,
    limit: 0,
    title: '',
    election: {},
    condidates: [],
    condidInfo: {
      education: [],
      promisses: [],
    },
  };
  async componentWillMount() {
    const id = this.props.match.params.id;
    const election = await getElectionById(id);

    var temp = election.condidates.map((con) => ({ ...con, choose: false }));

    this.setState({
      condidates: temp,
      election: election,
      title: election.title,
      limit: election.voteLimit,
    });
    console.log(this.state);
  }

  async clickCondidateHandler(id) {
    const condid = await getCondidateById(id);
    var condidInfo = {};
    condidInfo.name = condid.user.name;
    condidInfo.profileImage = !!condid.user.profileImage
      ? condid.user.profileImage
      : config.profileImage;
    condidInfo.bio = condid.bio;
    condidInfo.education = condid.education.slice();
    condidInfo.promisses = condid.promisses.slice();
    condidInfo.voteCount = condid.votes.length;
    condidInfo.slogan = condid.slogan;

    this.setState({ condidInfo, showModal: true });
    console.log(condid);
  }

  onToggleCheckbox(id) {
    // index = this.state.condidates.findIndex(it=> it._id === id);
    // this.state.condidates[index].choose =
    let newCondidates = this.state.condidates.map((con) => {
      if (con._id == id) con.choose = !con.choose;
      return con;
    });
    let choosedCount = newCondidates.filter((con) => con.choose).length;
    this.setState({ condidates: newCondidates });

    if (choosedCount > this.state.limit) {
      toast.error('تعداد انتخاب های شما تمام شده است');
      let newCondidates = this.state.condidates.map((con) => {
        if (con._id == id) con.choose = !con.choose;
        return con;
      });
      this.setState({ condidates: newCondidates });
    } else {
      if (choosedCount == this.state.limit) {
        toast.info('تعداد انتخاب های شما تمام شد');
      }
    }
  }
  handleClose() {
    this.setState({
      condidInfo: { promisses: [], education: [] },
      showModal: false,
    });
  }

  async handleVote() {
    let conf = window.confirm(
      'رای شما بعد از ثبت قابل تغییر نخواهد بود. ثبت شود؟'
    );
    if (!!conf) {
      let choosedCon = this.state.condidates
        .filter((con) => con.choose)
        .map((con) => con._id);
      const res = await vote(this.state.election._id, choosedCon);
      if (res == 'success') {
        // this.props.history.goBack()();
        window.location = `/`;
      }
    }
  }

  render() {
    return (
      <div className="voting">
        <Row className=" m-0 p-0 ">
          <Col md={8} className="condidates">
            <Container>
              <CardGroup className="row my-3">
                {/* {!!this.state.condidates && this.state.condidates[0].user.name} */}
                {this.state.condidates.map((con) => {
                  return (
                    // <Col
                    //   sm={12}
                    //   md={6}
                    //   lg={4}
                    //   key={con._id}
                    //   className={con.choose ? 'choosed' : ''}
                    // >
                    <Col
                      className="voting_card_sha"
                      sm={12}
                      md={6}
                      lg={4}
                      key={con._id}
                    >
                      {/* <input
                        type="checkbox"
                        checked={con.choose}
                        onChange={this.onToggleCheckbox.bind(this, con._id)}
                      /> */}

                      <div
                        sm={12}
                        md={6}
                        lg={4}
                        key={con._id}
                        className={
                          !con.choose
                            ? 'p-2   row condidCard '
                            : 'p-2   row condidCard choosed'
                        }
                      >
                        <div className=" imageWrapper m-0 p-2 col-3">
                          <Card.Img
                            className=" rounded-circle border border-primary p-2 mt-4"
                            variant="top"
                            src="/images/profileImage/default.png"
                          />
                        </div>

                        <Card.Body className="col-9">
                          <Card.Title className="text-right">
                            {con.user.name}
                          </Card.Title>
                          <Card.Subtitle className="text-right">
                            شعار انتخاباتی: {con.slogan}
                          </Card.Subtitle>
                          <Card.Text className="text-right">
                            تعداد آرا: {con.votes.length}
                          </Card.Text>
                        </Card.Body>
                        <Button
                          // onClick={() =>
                          //   this.clickCondidateHandler.bind(this, con._id)
                          // }
                          className="col-6 m-2 condidatesBtnVote"
                          onClick={this.clickCondidateHandler.bind(
                            this,
                            con._id
                          )}
                          variant="primary"
                        >
                          اطاعات بیشتر
                        </Button>
                        <input
                          id={con._id}
                          className="in_lable"
                          type="checkbox"
                          onChange={this.onToggleCheckbox.bind(this, con._id)}
                        />
                        <label
                          htmlFor=""
                          for={con._id}
                          className="col-4 btn m-2 btn-primary condidatesBtnVote"
                        >
                          {con.choose ? 'حذف انتخاب' : 'انتخاب'}
                        </label>
                      </div>
                    </Col>
                  );
                })}
              </CardGroup>
              <Modal
                scrollable="true"
                size="lg"
                show={this.state.showModal}
                onHide={this.handleClose.bind(this)}
              >
                {/* <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                          </Modal.Header> */}
                <Modal.Body className="text-right">
                  <h4 className="m-2">{this.state.condidInfo.name}</h4>
                  <div className="m-4 d-flex justify-content-center">
                    <img
                      className="vot_img_th m-auto"
                      src={this.state.condidInfo.profileImage}
                      alt=""
                    />
                  </div>
                  <div className="bg-secondary rounded p-2">
                    <div className="bg-light voting_card_sha rounded p-2">
                      <p className="m-2">{this.state.condidInfo.slogan}</p>
                      <p className="m-2">{this.state.condidInfo.bio}</p>
                      <label className="m-2" htmlFor="">
                        تحصیلات
                      </label>
                      {this.state.condidInfo.education.map((ed) => {
                        return <p className="m-2">{ed}</p>;
                      })}
                      <label className="m-2" htmlFor="">
                        وعده ها
                      </label>
                      {this.state.condidInfo.promisses.map((ed) => {
                        return <p className="m-2">{ed}</p>;
                      })}
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    className="col-12"
                    variant="secondary"
                    onClick={this.handleClose.bind(this)}
                  >
                    بستن
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* <Modal
                scrollable="true"
                size="lg"
                show={this.state.showModal}
                onHide={this.handleClose.bind(this)}
              >
                <Modal.Body>
                  <h4>{this.state.condidInfo.name}</h4>
                  <img
                    src={`/images/profileImage/${this.state.condidInfo.profileImage}`}
                    alt=""
                  />
                  <p>{this.state.condidInfo.slogan}</p>
                  <p>{this.state.condidInfo.bio}</p>
                  'تحصیلات:'
                  {this.state.condidInfo.education.map((ed) => {
                    return <p>{ed}</p>;
                  })}
                  'وعده ها:'
                  {this.state.condidInfo.promisses.map((ed) => {
                    return <p>{ed}</p>;
                  })}
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.handleClose.bind(this)}
                  >
                    بستن
                  </Button>
                </Modal.Footer>
              </Modal> */}
            </Container>
          </Col>
          <Col md={4} className="votePanel">
            <div className="wrapper voting_card_sha">
              <div className="choosenCondidList">
                <span className="text-center d-block">
                  {this.state.condidates.filter((con) => con.choose).length ==
                    0 && 'هیچ کاندیدی انتخاب نشده'}
                </span>
                {this.state.condidates
                  .filter((con) => con.choose)
                  .map((con) => {
                    return (
                      <Col className="col-12 mt-2" key={con._id}>
                        {/* <input
                        id={con._id}
                        className="in_lable"
                          type="checkbox"
                          checked={con.choose}
                          onChange={this.onToggleCheckbox.bind(this, con._id)}
                        />
                       <label htmlFor="" for={con._id} className="col-4 btn m-2 btn-primary">حذف</label> */}

                        <div className="choosed row condidCard">
                          <div className="imageWrapper m-0 p-2 col-2 ">
                            <Card.Img
                              className=" rounded-circle border border-success p-2 mt-4"
                              variant="top"
                              src="/images/profileImage/default.png"
                            />
                          </div>

                          <Card.Body className="text-right mt-4 col-9">
                            <Card.Title className="text-right">
                              {con.user.name}
                            </Card.Title>
                            <div className="pos_lab">
                              <input
                                id={con._id}
                                className="in_lable cursor_pos"
                                type="checkbox"
                                checked={con.choose}
                                onChange={this.onToggleCheckbox.bind(
                                  this,
                                  con._id
                                )}
                              />
                              <label
                                className="cursor_pos col_red"
                                htmlFor=""
                                for={con._id}
                              >
                                <Icon.XCircleFill />
                              </label>
                            </div>
                          </Card.Body>
                        </div>
                      </Col>
                    );
                  })}
              </div>

              <Button
                variant="success"
                className="col-12"
                onClick={this.handleVote.bind(this)}
                disabled={
                  this.state.condidates.filter((con) => con.choose).length === 0
                }
              >
                ثبت رای
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Voting;
