import React, { Component } from 'react';
import {
  Container,
  Modal,
  Col,
  Card,
  CardGroup,
  Form,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { getElections, addElection } from '../../services/electionService';
import { toast } from 'react-toastify';
import * as Icon from 'react-bootstrap-icons';
import { defaultCover } from '../../config.json';

class Elections extends Component {
  state = {
    showModal: false,
    elections: [],
    modalTitle: '',
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async fetchData() {
    const elections = await getElections();
    elections.filter((el) => el.active);
    this.setState({ elections: elections });
  }

  async componentDidMount() {
    await this.fetchData();
  }

  // openElection(election) {
  //   if (!election.voted) {
  //     this.props.history.push('/');
  //     window.location = `/vote/${election._id}`;
  //   } else {
  //     toast.error('شما در این اتخابات شرکت کرده اید.');
  //   }
  // }
  openElection(election) {
    this.props.history.push('/admin/elections');
    window.location = `/admin/election/form/${election._id}`;
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }
  handleClose() {
    this.setState({
      showModal: false,
      modalTitle: '',
    });
  }
  async addElection() {
    const title = this.state.modalTitle;
    try {
      var res = await addElection({ title });
      await this.fetchData();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Container>
        <CardGroup className="row my-3 d-flex justify-start-around">
          <Col
            className="addElection election"
            sm={12}
            md={4}
            lg={3}
            onClick={() => this.openModal()}
          >
            <Card className="my-3 card_sha">
              <Icon.PlusCircle />

              <span>افزودن انتخابات</span>
            </Card>
          </Col>
          {this.state.elections.map((el) => {
            let voteCount = 0;
            el.condidates.forEach((con) => (voteCount += con.votes.length));
            var cover = !!el.cover ? el.cover : defaultCover;
            return (
              <Col
                className=" election"
                sm={12}
                md={4}
                lg={3}
                key={el._id}
                onClick={() => this.openElection(el)}
              >
                <Card className="my-3 card_sha">
                  <Card.Img variant="top" src={cover} />
                  <Card.Body>
                    <Card.Title className="text-center">{el.title}</Card.Title>
                    <Card.Subtitle className="text-center">
                      {el.condidates.length} کاندید
                    </Card.Subtitle>
                    <Card.Text className="text-center">
                      تعداد کل آرا: {voteCount}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </CardGroup>

        <Modal
          scrollable="true"
          // size="lg"
          show={this.state.showModal}
          onHide={this.handleClose.bind(this)}
        >
          <Modal.Header>
            <Modal.Title>افزودن انتخابات </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-right">
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
                  name="modalTitle"
                  size="lg"
                  type="text"
                  placeholder="عنوان را وارد کنید"
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
              بستن
            </Button>
            <Button variant="primary" onClick={this.addElection.bind(this)}>
              افزودن
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default Elections;
