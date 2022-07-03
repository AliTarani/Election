import React, { Component } from 'react';
import { getActiveElections } from '../../services/electionService';
import { Container, Row, Col, Card, CardGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { defaultCover } from '../../config.json';

class Election extends Component {
  state = {
    elections: [],
  };

  async componentDidMount() {
    const elections = await getActiveElections();
    elections.filter((el) => el.active);
    this.setState({ elections: elections });
  }
  openElection(election) {
    if (!election.voted) {
      this.props.history.push('/');
      window.location = `/vote/${election._id}`;
    } else toast.error('شما در این اتخابات شرکت کرده اید.');
  }

  render() {
    return (
      <div>
        <Container>
          <CardGroup className="row my-3 d-flex justify-start-around">
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
                      <Card.Title className="text-center">
                        {el.title}
                      </Card.Title>
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
        </Container>
      </div>
    );
  }
}

export default Election;
