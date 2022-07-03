const ServiceResult = require('../models/api/ServiceResult');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const Condidate = require('../models/database/condidate');
const User = require('../models/database/user');
const Election = require('../models/database/election');
const ElectionService = require('./election.service');
const { addCondidateToElectionService } = new ElectionService();



class CondidateService {
  async createCondidate(condidateData) {
    // const { election, user, slogan, promisses, education, bio } = condidateData;
    const { election, user } = condidateData;
    const result = await Condidate.findOne({ user, election });
    let data;

    if (!result) {
      // let condidate = new Condidate({
      //   election: election,
      //   user: user,
      //   slogan: slogan,
      //   bio: bio,
      //   promisses: promisses,
      //   education: education
      // });
      let condidate = new Condidate({
        election: election,
        user: user
      });
      condidate = await condidate.save();

      const result2 = await addCondidateToElectionService(condidate.election, condidate._id);
      if (result2.success) {
        return new ServiceResult({
          success: true,
          result: { condidate, result2 },
          message: [
            new ResponseMessage({
              eventId: 200,
              type: ResponseMessageType.info,
              message: `ثبت کاندید با موفقیت انجام شد `,
              alertUser: true
            })
          ],
          httpMethodCode: 200
        });
      } else {
        data = new ServiceResult({
          success: false,
          httpMethodCode: 401,
          result: result2,
          message: [
            new ResponseMessage({
              eventId: 401,
              type: ResponseMessageType.error,
              message: 'کاندید در انتخابات ثبت نگردید. ',
              alertUser: true
            })
          ]
        });
      }

    } else {
      data = new ServiceResult({
        success: false,
        httpMethodCode: 401,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 401,
            type: ResponseMessageType.error,
            message: 'کاربر در انتخابات کاندید میباشد. ',
            alertUser: true
          })
        ]
      });
    }

    return data;


  }

  async getAllCondidateService() {
    const condidates = await Condidate.find();
    if (condidates.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندیدی وجود ندارد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: condidates,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async getCondidateByIdService(id) {
    const condidate = await Condidate.findById(id)
      .populate({
        path: "user",
        model: "Users"
      });

    if (!condidate) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندید یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: condidate,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

  async updateCondidateByIdService(id, model) {
    let condidate = await Condidate.findById(id);

    if (!condidate) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندید یافت نشد',
            alertUser: true
          })
        ]
      });
    }
    condidate = Object.assign(condidate, model)

    const result = await condidate.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'اطلاعات کاندید بروزرسانی شد',
          alertUser: true
        })
      ]
    });
  }

  async deleteCondidateByIdService(id) {
    const result = await Condidate.findById(id);

    if (!result) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندید یافت نشد',
            alertUser: true
          })
        ]
      });
    }
    const electionId = result.election._id;

    const election = await Election.findById(electionId);

    if (!!election) {
      const condidIndex = election.condidates.findIndex(condid => condid == id);

      if (condidIndex != -1) election.condidates.splice(condidIndex, 1);

      await election.save();
    }

    const condidate = await Condidate.findByIdAndRemove(id);

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: { condidate, election },
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'کاندید حذف گردید',
          alertUser: true
        })
      ]
    });
  }

  async getvoteCountService(id) {
    const condidate = await Condidate.findById(id).select("votes");
    if (!condidate) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندید یافت نشد',
            alertUser: true
          })
        ]
      });
    }

    const count = condidate.votes.length;

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: count,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'success get',
          alertUser: false
        })
      ]
    });
  }

}

module.exports = CondidateService;