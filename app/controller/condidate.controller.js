const CondidateValidation = require('../validation/condidate.validation');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const ResponseResult = require('../models/api/ResponseResult');
const CondidateService = require('../service/condidate.service');

const condidateValidation = new CondidateValidation();
const {
  createCondidate,
  getCondidateByIdService,
  updateCondidateByIdService,
  deleteCondidateByIdService
} = new CondidateService();


class CondidateController {
  async addCondidate(req, res) {

    //validate request body (JOI)
    const { error, value } = condidateValidation.validateCondidate(req.body);

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
            message: err.message
          })
        );
      });
      response = new ResponseResult({ success: false, message: errors });
      httpMethodCode = 400;
    } else {

      // Send data to auth service
      const result = await createCondidate({ ...value });
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });

      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);
  }

  async getCondidateById(req, res) {
    const id = req.params.id;
    const result = await getCondidateByIdService(id);

    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async updateCondidate(req, res) {
    const id = req.params.id;
    const { error, value } = condidateValidation.updateValidateCondidate(
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
            message: err.message
          })
        );
      });

      response = new ResponseResult({ success: false, message: errors });
      httpMethodCode = 400;
    } else {
      const result = await updateCondidateByIdService(id, { ...value });
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });

      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);
  }

  async deleteCondidate(req, res) {
    const id = req.params.id;
    const result = await deleteCondidateByIdService(id);
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

module.exports = CondidateController;
