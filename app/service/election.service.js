const ServiceResult = require('../models/api/ServiceResult');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const Election = require('../models/database/election');
const Condidate = require('../models/database/condidate');
const User = require('../models/database/user');


class ElectionService {
  async createElectionServise(electionData) {
    const { title, cover, endDate, startDate, voteLimit, active, condidates } = electionData;
    const result = await Election.findOne({ title });
    if (!result) {
      let election = new Election({
        title: title,
        cover: cover,
        endDate: endDate,
        startDate: startDate,
        voteLimit: voteLimit,
        active: active,
        condidates: condidates
      });
      election = await election.save();


      return new ServiceResult({
        success: true,
        result: election,
        message: [
          new ResponseMessage({
            eventId: 200,
            type: ResponseMessageType.info,
            message: `ثبت  انتخابات با موفقیت انجام شد ${electionData.title}`,
            alertUser: true
          })
        ],
        httpMethodCode: 200
      });
    } else {
      const data = new ServiceResult({
        success: false,
        httpMethodCode: 401,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 401,
            type: ResponseMessageType.error,
            message: '  انتخابات با این عنوان وجود دارد. ',
            alertUser: true
          })
        ]
      });

      return data;
    }

  }

  async getAllElectionsService() {
    const elections = await Election.find()
      .populate(
        {
          path: 'condidates',
          model: 'Condidates',
          select: "votes"
        });
    if (elections.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'انتخاباتی وجود ندارد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: elections,
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

  async getActiveElectionsService() {
    const elections = await Election.find({ active: true }).select('-active')
      .populate(
        {
          path: 'condidates',
          model: 'Condidates',
          select: "votes"
        }
      );
    if (elections.length === 0) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'انتخابات فعالی وجود ندارد',
            alertUser: true
          })
        ]
      });
    }

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: elections,
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

  async getElectionByIdService(id) {
    const election = await Election.findById(id)
      .populate(
        {
          path: 'condidates',
          model: 'Condidates',
          select: "slogan user votes",
          populate: {
            path: 'user',
            model: 'Users',
            select: 'name profileImage melliCode'
          }

        }
      );

    if (!election) {
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

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: election,
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

  async updateElectionByIdService(id, model) {
    let election = await Election.findById(id);

    if (!election) {
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

    election = Object.assign(election, model)


    const result = await election.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: ' انتخابات بروزرسانی شد',
          alertUser: true
        })
      ]
    });
  }

  async deleteElectionByIdService(id) {
    const result = await Election.findById(id);

    if (!result) {
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

    result.condidates.forEach(async function (condid) {
      try {
        await Condidate.findByIdAndRemove(condid);
      } catch{
        // log it
      }
    })


    const election = await Election.findByIdAndRemove(id);

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: election,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: 'انتخابات حذف گردید',
          alertUser: true
        })
      ]
    });
  }

  async addCondidateToElectionService(electionId, condidateId) {
    let election = await Election.findById(electionId);

    if (!election) {
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

    const include = election.condidates.includes(condidateId)
    if (include) {
      return new ServiceResult({
        success: false,
        httpMethodCode: 404,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 404,
            type: ResponseMessageType.error,
            message: 'کاندید در انتخابات موجود است.',
            alertUser: true
          })
        ]
      });
    }

    election.condidates.push(condidateId)


    const result = await election.save();

    return new ServiceResult({
      success: true,
      httpMethodCode: 200,
      result: result,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: ' کاندید به انتخابات اضافه شد.',
          alertUser: true
        })
      ]
    });
  }

}

module.exports = ElectionService;
