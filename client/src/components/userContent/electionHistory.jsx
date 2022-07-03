import React, { Component } from 'react';
import { getElections } from '../../services/electionService';
import { getCurrentUser } from '../../services/authService';
import { getUser } from '../../services/userService';
import {
  Container,
  Table,
  Col,
  Card,
  ListGroup,
  Modal,
  Button,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

class ElectionHistory extends Component {
  state = {
    elections: [],
    showModal: false,
    modalElection: {
      title: '',
      condidates: [],
    },
  };

  async componentDidMount() {
    var { _id } = getCurrentUser();
    const { elections } = await getUser(_id);

    var data = elections.map((el) => {
      var condids = el.election.condidates.map((con) => {
        var isVoted = el.votes.indexOf(con._id) === -1 ? false : true;
        return { name: con.user.name, _id: con._id, voted: isVoted };
      });
      // console.log(el);
      return {
        _id: el.election._id,
        startDate: el.election.startDate,
        endDate: el.election.endDate,
        title: el.election.title,
        condidates: condids,
      };
    });
    this.setState({ elections: data });

    // const elections = await getElections();
    // elections.filter((el) => el.active);
    // this.setState({ elections: elections });
  }

  openElection(id) {
    const index = this.state.elections.findIndex((el) => el._id === id);
    console.log(this.state.elections);

    if (index !== -1) {
      const election = this.state.elections[index];

      this.setState({
        modalElection: {
          title: election.title,
          condidates: election.condidates,
        },
        showModal: true,
      });
    } else {
      this.setState({
        modalElection: {
          title: '',
          condidates: [],
        },
        showModal: false,
      });
    }
  }

  handleClose() {
    this.setState({
      modalElection: {
        title: '',
        condidates: [],
      },
      showModal: false,
    });
  }

  render() {
    return (
      <div>
        <Container>
          <h2 className="text-right"> تاریخچه انتخابات</h2>
          <Table hover>
            <thead>
              <tr className="cursor-pointer">
                <th>عنوان</th>
                <th>تعداد کاندید</th>
                <th>تاریخ شروع</th>
                <th>تاریخ پایان </th>
              </tr>
            </thead>
            <tbody>
              {this.state.elections.map((el) => {
                return (
                  <tr onClick={() => this.openElection(el._id)}>
                    <td>{el.title}</td>
                    <td>{el.condidates.length} کاندید </td>
                    <td>{el.startDate}</td>
                    <td>{el.endDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Modal
            scrollable="true"
            // size="lg"
            show={this.state.showModal}
            onHide={this.handleClose.bind(this)}
          >
            <Modal.Header>
              <Modal.Title>{this.state.modalElection.title}</Modal.Title>
            </Modal.Header>
           
            <Modal.Body className="text-right">
              <Card>
                <Card.Header>کاندید ها</Card.Header>
              
                <ListGroup variant="flush">
                  {this.state.modalElection.condidates.map((con) => {
                    return (
                     


                     <ListGroup.Item 
                     className={con.voted ? 'voted' : 'disvoted'}>
                        {con.voted ? <Icon.ClipboardCheck className="ml-4 color_grreen"/>
                         :
                         <Icon.ClipboardX className="ml-4 color_red"/>}
                        {con.name}
                        {/* {con.voted ? '✅' : '❌'} */}

                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
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
        </Container>
       
      </div> 
    );
  }
}

export default ElectionHistory;
