const VoteingValidation = require('../validation/voteing.validation');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const ResponseResult = require('../models/api/ResponseResult');
const VoteingService = require('../service/voteing.service');

const { voteService } = new VoteingService();
const voteingValidation = new VoteingValidation();


class VoteController {
  async vote(req, res) {
    const userId = req.user._id;
    const electionId = req.params.id;
    const { error, value } = voteingValidation.validateVote(req.body);
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
      const result = await voteService(userId, electionId, value.condidates);
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });
      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);


  }


}

module.exports = VoteController;
