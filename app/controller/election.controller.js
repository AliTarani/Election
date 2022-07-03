const ElectionValidation = require('../validation/election.validation');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const ResponseResult = require('../models/api/ResponseResult');
const ElectionService = require('../service/election.service');
const UserService = require('../service/user.service');

const electionValidation = new ElectionValidation();
const {
  createElectionServise,
  getActiveElectionsService,
  getElectionByIdService,
  getAllElectionsService,
  updateElectionByIdService,
  deleteElectionByIdService

} = new ElectionService();
const { getUserElectionsService } = new UserService

class ElectionController {
  async addElection(req, res) {

    //validate request body (JOI)
    const { error, value } = electionValidation.validateElection(req.body);

    let response;
    let httpMethodCode;

    if (error) {
      const errors = [];
      error.details.forEach(err => {
        errors.push(
          new ResponseMessage({
            eventId: 400,
            messageId: 1,
            type: ResponseMessageType.error,
            message: err.message,
            alertUser: true
          })
        );
      });
      response = new ResponseResult({ success: false, message: errors });
      httpMethodCode = 400;
    } else {

      // Send data to auth service
      const result = await createElectionServise({ ...value });
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });

      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);
  }

  async getAtiveElections(req, res) {
    //getting users voted elections 
    const userId = req.headers.userId;
    const { result: userElectionsInfo } = await getUserElectionsService(userId);
    const userElectionsIds = userElectionsInfo.map(user => user.election._id);

    // add voted flag to data if voted
    const result = await getActiveElectionsService();
    var data = result['result'];
    var newData = data.map(item => {
      var index = userElectionsIds.indexOf(item._id);
      if (index > -1) item.voted = true;
      else item.voted = false;
      return item;
    });

    const response = new ResponseResult({
      success: result['success'],
      result: newData,
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async getAllElections(req, res) {
    const result = await getAllElectionsService();

    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async getElectionById(req, res) {
    const id = req.params.id;
    // validate object id
    const result = await getElectionByIdService(id);

    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async updateElection(req, res) {
    const id = req.params.id;
    const { error, value } = electionValidation.updateValidateElection(
      req.body
    );

    let response;
    let httpMethodCode;

    if (error) {
      const errors = [];
      error.details.forEach(err => {
        errors.push(
          new ResponseMessage({
            eventId: 400,
            messageId: 1,
            type: ResponseMessageType.error,
            message: err.message,
            alertUser: true
          })
        );
      });

      response = new ResponseResult({ success: false, message: errors });
      httpMethodCode = 400;
    } else {
      const result = await updateElectionByIdService(id, { ...value });
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });

      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);
  }

  async deleteElection(req, res) {
    const id = req.params.id;
    const result = await deleteElectionByIdService(id);
    let response;
    let httpMethodCode;
    response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

}

module.exports = ElectionController;
