const ServiceResult = require('../models/api/ServiceResult');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const User = require('../models/database/user');
const Condidate = require('../models/database/condidate');
const Election = require('../models/database/election');
const { forEach } = require('lodash');

class VoteingService {
  async voteService(userId, electionId, condidates) {
    let user = await User.findById(userId);
    if (!user) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاربر یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    let election = await Election.findById(electionId);
    if (!election || (!!election && election.active == false)) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'انتخابات یافت نشد',
            alertUser: true
          })
        ]
      });
    }
    // let votes = user.elections.filter(item => item.election == electionId)[0];
    const index = user.elections.findIndex(item => item.election == electionId);

    if (index != -1) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 400,
        result: "error",
        message: [
          new ResponseMessage({
            eventId: 400,
            type: ResponseMessageType.error,
            message: 'کاربر در انتخابات شرکت کرده',
            alertUser: true
          })
        ]
      });
    }


    var validCondidates = [];

    condidates.forEach(async condid => {
      let condidate = await Condidate.findById(condid);

      if (!condidate) {
        return new ServiceResult({
          success: false,
          httpMethodCode: 400,
          result: "error",
          message: [
            new ResponseMessage({
              eventId: 400,
              type: ResponseMessageType.error,
              message: 'کاندید یافت نشد.',
              alertUser: true

            })
          ]
        });
      }
      condidate.votes.push(userId);
      await condidate.save();
    });


    user.elections.push({
      election: electionId,
      votes: condidates
    });

    await user.save();


    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: "success",
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.error,
          message: 'اخذ رای با موفقیت انجام شد',
          alertUser: true

        })
      ]
    });


  }
}

module.exports = VoteingService;
